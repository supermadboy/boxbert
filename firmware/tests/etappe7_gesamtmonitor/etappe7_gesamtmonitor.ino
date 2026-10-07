// Boxbert — Etappe 7: Gesamtmonitor (Integrations-Test mit TFT-Statusanzeige)
//
// Basis: bewaehrter etappe4_tag_player (unveraenderte Referenz im Repo),
// erweitert um TFT (etappe0-Init), onboard MAX17048 und WLAN-Station.
// Anzeige auf dem TFT: Akkustand %, Ladezustand (laedt/entlaedt/ruht),
// Spannung, aktuelles Lied + Wiedergabestatus, Lautstaerke, WLAN-Status/IP.
//
// BEWUSSTE ABWEICHUNG von der Etappe-4-Referenz (dokumentiert im README):
// 1. NFC-readPassiveTargetID mit Timeout 250 ms statt 0, damit die
//    NFC-Task periodisch zurueckkehrt und der Wire-Bus geteilt werden
//    kann. Latenzkosten: bis 250 ms mehr Erkennungsverzoegerung ohne Tag.
// 2. Wire-Mutex: PN532 (NFC-Task) und MAX17048 (Gauge-Task) teilen sich
//    SDA=IO3/SCL=IO4. Kein Wire-Zugriff ohne Mutex (AGENTS.md).
// 3. NFC-Lesefehler beendet die Task nicht mehr hart; ohne Tag laeuft
//    der Poll-Zyklus weiter. Trennung Timeout vs. Busfehler ist hier
//    NICHT nachgewiesen (README).
//
// Pins: NFC IO3/IO4 (I2C 100 kHz), SD SPI IO36/35/37 CS IO10 (4 MHz),
// I2S IO16/17/18, TFT CS42/DC40/RST41/Backlite45 — pins_arduino.h der
// Variante gegengeprueft. Board-Defaults mit QSPI-PSRAM, NICHT PSRAM=opi.
// Volume fest 6/21, keine Norm-Konformitaetsbehauptung. Kein Web-Upload
// (separat in Etappe 5 bestanden), kein BLE.

#include <Arduino.h>
#include <Wire.h>
#include <SPI.h>
#include <SD.h>
#include <WiFi.h>
#include <Adafruit_PN532.h>
#include <Adafruit_GFX.h>
#include <Adafruit_ST7789.h>
#include <Adafruit_MAX1704X.h>
#include <Audio.h>
#include <atomic>
#include <freertos/FreeRTOS.h>
#include <freertos/task.h>
#include <freertos/queue.h>
#include <freertos/semphr.h>
#include "TagMap.h"
#include "Secrets.h"

constexpr uint8_t NFC_SDA = 3;
constexpr uint8_t NFC_SCL = 4;
constexpr uint8_t SD_CS = 10;
constexpr uint8_t SD_SCK = 36;
constexpr uint8_t SD_MISO = 37;
constexpr uint8_t SD_MOSI = 35;
constexpr uint8_t I2S_BCLK = 17;
constexpr uint8_t I2S_LRC = 18;
constexpr uint8_t I2S_DOUT = 16;
constexpr uint8_t VOLUME = 6;
constexpr uint32_t SD_SPI_HZ = 4000000; // Referenz: Happy Tune 5499 -> ~1,5 s.
constexpr uint32_t NFC_PAUSE_MS = 200;  // Aus der Etappe-4-Referenz.
constexpr uint32_t NFC_TIMEOUT_MS = 250; // Abweichung zur Referenz (0), siehe Kopf.
constexpr uint32_t TFT_REFRESH_MS = 1000;
constexpr uint32_t GAUGE_PERIOD_MS = 2000;

// TFT-Pins kommen als Makros aus pins_arduino.h der Variante
// (TFT_CS=42, TFT_DC=40, TFT_RST=41, TFT_BACKLITE=45) — hier nicht
// doppelt deklarieren (etappe0-TFT-Referenz).

Adafruit_PN532 nfc(255, 254, &Wire);
Adafruit_MAX17048 gauge;
Adafruit_ST7789 tft(&SPI, TFT_CS, TFT_DC, TFT_RST);
Audio audio;

QueueHandle_t nfcEvents = nullptr;
SemaphoreHandle_t wireMutex = nullptr; // Schutz fuer PN532 + MAX17048 am I2C.

bool ready = false;
bool wifiConnected = false;
const char *state = "Boot";
const char *currentSong = "-"; // Name aus TagMap, nicht der Dateipfad.
uint32_t starts = 0;
uint32_t startErrors = 0;

// Gauge-Werte: nur Gauge-Task schreibt, Hauptloop liest.
std::atomic<bool> gaugeOk{false};
std::atomic<uint32_t> gaugeMs{0};        // letzter Lesetermin
std::atomic<float> gaugeVolt{0.0f};
std::atomic<float> gaugePercent{0.0f};
std::atomic<float> gaugeRate{0.0f};      // %/h, positiv = laden

void audioInfo(Audio::msg_t message) {
    if (message.e == Audio::evt_vu || message.e == Audio::evt_spectrum) return;
    Serial.printf("[audio %lu ms] %s: %s\n", (unsigned long)millis(),
                  message.s ? message.s : "?", message.msg ? message.msg : "");
}

// Nur der Gauge-Task beruehrt den MAX17048; Wire-Mutex ist Pflicht.
void gaugeTask(void *) {
    for (;;) {
        float volt = 0, percent = 0, rate = 0;
        bool ok = false;
        if (xSemaphoreTake(wireMutex, pdMS_TO_TICKS(500)) == pdTRUE) {
            volt = gauge.cellVoltage();
            if (!isnan(volt)) {
                percent = gauge.cellPercent();
                rate = gauge.chargeRate();
                ok = true;
            }
            xSemaphoreGive(wireMutex);
        }
        if (ok) {
            gaugeVolt.store(volt);
            gaugePercent.store(percent);
            gaugeRate.store(rate);
            gaugeMs.store(millis());
        }
        gaugeOk.store(ok); // Auch Fehler sichtbar machen.
        vTaskDelay(pdMS_TO_TICKS(GAUGE_PERIOD_MS));
    }
}

void nfcTask(void *) {
    uint8_t lastUid[7] = {};
    uint8_t lastLength = 0;
    uint32_t taskReads = 0;
    uint32_t taskSwitches = 0;
    for (;;) {
        NfcEvent event;
        // Mutex haelt NUR die Lesung (max. Timeout-Fenster), nicht die Pause.
        if (xSemaphoreTake(wireMutex, pdMS_TO_TICKS(1000)) != pdTRUE) {
            vTaskDelay(pdMS_TO_TICKS(10));
            continue;
        }
        const bool ok = nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A,
                                                event.uid, &event.length,
                                                NFC_TIMEOUT_MS);
        xSemaphoreGive(wireMutex);
        if (!ok || event.length == 0 || event.length > sizeof(event.uid)) {
            // Kein Tag im 250-ms-Fenster (oder Busstoerung — im Monitor-
            // Betrieb nicht unterscheidbar, siehe README). Weiter pollen.
            vTaskDelay(pdMS_TO_TICKS(10));
            continue;
        }
        event.detectedMs = millis();
        event.reads = ++taskReads;
        event.changed = event.length != lastLength ||
                        memcmp(event.uid, lastUid, event.length) != 0;
        if (event.changed) {
            if (lastLength != 0) ++taskSwitches;
            memcpy(lastUid, event.uid, event.length);
            lastLength = event.length;
        }
        event.switches = taskSwitches;
        xQueueSend(nfcEvents, &event, portMAX_DELAY);
        // Erfolgs-Pause aus der Referenz; in dieser Zeit ist Wire frei
        // (Gauge-Task nutzt das Fenster).
        vTaskDelay(pdMS_TO_TICKS(NFC_PAUSE_MS));
    }
}

void drawCentered(uint8_t y, uint8_t size, uint16_t color, const char *text) {
    tft.setTextSize(size);
    tft.setTextColor(color, ST77XX_BLACK);
    // Zeile lokal loeschen, Hintergrundfarbe im Textmodus fuellt sonst nur
    // bis zum Textende.
    tft.fillRect(0, y, tft.width(), 8 * size + 2, ST77XX_BLACK);
    tft.setCursor(0, y);
    tft.print(text);
}

void drawStatus() {
    char line[64];
    const bool fresh = millis() - gaugeMs.load() < 10000;

    // Zeile 1: Akku
    if (!fresh) {
        snprintf(line, sizeof(line), "Akku: ?  (Gauge fehlt)");
        drawCentered(0, 2, ST77XX_RED, line);
    } else {
        const float pct = gaugePercent.load();
        const uint16_t color = pct > 50.0f ? ST77XX_GREEN
                             : pct > 20.0f ? ST77XX_YELLOW : ST77XX_RED;
        const float rate = gaugeRate.load();
        const char *charge = rate > 2.0f ? "+LAEDT"
                           : rate < -2.0f ? "entlaedt" : "ruht";
        snprintf(line, sizeof(line), "Akku %.0f%% %.2fV %s", pct,
                 (double)gaugeVolt.load(), charge);
        drawCentered(0, 2, color, line);
    }

    // Zeile 2: WLAN
    if (wifiConnected) {
        snprintf(line, sizeof(line), "WLAN: %s %s", BOXBERT_WIFI_SSID,
                 WiFi.localIP().toString().c_str());
    } else if (WiFi.status() == WL_DISCONNECTED) {
        snprintf(line, sizeof(line), "WLAN: verbinde ...");
    } else {
        snprintf(line, sizeof(line), "WLAN: nicht verbunden");
    }
    drawCentered(24, 1, ST77XX_WHITE, line);

    // Zeile 3: Lied + Wiedergabestatus
    snprintf(line, sizeof(line), "Lied: %s %s", currentSong,
             audio.isRunning() ? "[laeuft]" : "[idle]");
    drawCentered(40, 2, audio.isRunning() ? ST77XX_CYAN : ST77XX_WHITE, line);

    // Zeile 4: Lautstaerke
    snprintf(line, sizeof(line), "Vol: %u/21", unsigned(VOLUME));
    drawCentered(64, 2, ST77XX_MAGENTA, line);

    // Zeile 5: Lebenszeichen
    snprintf(line, sizeof(line), "STARTS %lu | ERR %lu | uptime %lus",
             (unsigned long)starts, (unsigned long)startErrors,
             (unsigned long)(millis() / 1000));
    drawCentered(118, 1, ST77XX_ORANGE, line);
}

void setup() {
    Serial.begin(115200);
    delay(2500);
    const uint32_t started = millis();
    while (!Serial && millis() - started < 2000) {}
    Serial.printf("\n=== BOXBERT GESAMTMONITOR — SD=%lu Hz, NFC-Timeout=%lu ms, Volume %u ===\n",
                  (unsigned long)SD_SPI_HZ, (unsigned long)NFC_TIMEOUT_MS, unsigned(VOLUME));
    Audio::audio_info_callback = audioInfo;
    if (!psramFound() || ESP.getFreePsram() == 0) {
        state = "FEHLER: PSRAM fehlt; Board-Defaults/QSPI pruefen";
        Serial.println(state);
        return;
    }
    Serial.printf("PSRAM frei: %lu Bytes\n", (unsigned long)ESP.getFreePsram());

    // TFT zuerst (etappe0-Init), CS frueh hoch, bevor SD den Bus kriegt.
    pinMode(TFT_CS, OUTPUT);
    digitalWrite(TFT_CS, HIGH);
    pinMode(TFT_BACKLITE, OUTPUT);
    digitalWrite(TFT_BACKLITE, HIGH);
    if (!SPI.begin(SD_SCK, SD_MISO, SD_MOSI, SD_CS)) { // Bus einmal, Pins explizit.
        state = "FEHLER: SPI.begin";
        Serial.println(state);
        return;
    }
    // Lib-Bibliotheksbeispiel (graphicstest_st7789): 240x135-Panel heißt
    // init(135, 240) — Portrait-Maße, daraus rechnet die Lib die Offsets.
    // init(240, 135) (auch in der etappe0-Referenz!) setzt die Offsets
    // falsch: Inhalt in der Mitte, gefleckte Raender.
    tft.init(135, 240);
    tft.setRotation(1);
    tft.fillScreen(ST77XX_BLACK);
    tft.setTextColor(ST77XX_GREEN);
    tft.setTextSize(2);
    tft.setCursor(0, 0);
    tft.print("Boxbert startet ...");
    Serial.println("TFT initialisiert (240x135, Rotation 1).");

    // WLAN im STA-Modus verbindet im Hintergrund (Muster Etappe 5).
    WiFi.mode(WIFI_STA);
    WiFi.setHostname("boxbert");
    WiFi.begin(BOXBERT_WIFI_SSID, BOXBERT_WIFI_PASSWORD);
    Serial.println("WLAN verbindet im Hintergrund.");

    // Wie im bestaetigten Wechseltest, keine Retry-/RFConfiguration.
    if (!Wire.begin(NFC_SDA, NFC_SCL)) {
        state = "FEHLER: Wire.begin";
        Serial.println(state);
        return;
    }
    Wire.setClock(100000);
    if (!nfc.begin()) {
        state = "FEHLER: nfc.begin";
        Serial.println(state);
        return;
    }
    delay(100);
    const uint32_t version = nfc.getFirmwareVersion();
    if (!version || !nfc.SAMConfig()) {
        state = "FEHLER: PN532-Firmwareantwort/SAMConfig";
        Serial.println(state);
        return;
    }
    Serial.printf("PN532 Firmware %u.%u, I2C 100 kHz\n",
                  unsigned((version >> 16) & 0xFF), unsigned((version >> 8) & 0xFF));

    // MAX17048 am selben Wire-Bus; erst lesen, bevor die Tasks starten.
    if (!gauge.begin()) {
        state = "FEHLER: MAX17048 nicht gefunden (Akku dran?)";
        Serial.println(state);
        return;
    }
    Serial.printf("MAX17048 Chip 0x%X | %.2f V | %.1f %% | %.1f %%/h\n",
                  unsigned(gauge.getChipID()), (double)gauge.cellVoltage(),
                  (double)gauge.cellPercent(), (double)gauge.chargeRate());
    gaugeOk.store(true);
    gaugeVolt.store(gauge.cellVoltage());
    gaugePercent.store(gauge.cellPercent());
    gaugeRate.store(gauge.chargeRate());
    gaugeMs.store(millis());

    pinMode(SD_CS, OUTPUT);
    digitalWrite(SD_CS, HIGH);
    if (!SD.begin(SD_CS, SPI, SD_SPI_HZ) || SD.cardType() == CARD_NONE) {
        state = "FEHLER: SD nicht erreichbar";
        Serial.println(state);
        return;
    }
    for (const auto &binding : TAG_BINDINGS) {
        File file = SD.open(binding.path, FILE_READ);
        if (!file || file.isDirectory() || file.size() == 0) {
            Serial.printf("FEHLER: Datei %s fehlt/leer/nicht lesbar\n", binding.path);
            state = "FEHLER: Lieddatei";
            return;
        }
        Serial.printf("%s -> %s | %lu Bytes\n", binding.name, binding.path,
                      (unsigned long)file.size());
        file.close();
    }
    if (!audio.setPinout(I2S_BCLK, I2S_LRC, I2S_DOUT)) {
        state = "FEHLER: audio.setPinout";
        Serial.println(state);
        return;
    }
    audio.setVolume(VOLUME);

    wireMutex = xSemaphoreCreateMutex();
    nfcEvents = xQueueCreate(8, sizeof(NfcEvent));
    if (!wireMutex || !nfcEvents) {
        state = "FEHLER: Wire-Mutex/NFC-Queue";
        Serial.println(state);
        return;
    }
    // Beide Tasks niedrige Prioritaet; Audio-Lib behaelt ihre Defaults.
    if (xTaskCreate(nfcTask, "BoxbertNFC", 4096, nullptr, 1, nullptr) != pdPASS ||
        xTaskCreate(gaugeTask, "BoxbertGauge", 3072, nullptr, 1, nullptr) != pdPASS) {
        state = "FEHLER: Task-Start";
        Serial.println(state);
        return;
    }
    ready = true;
    state = "Bereit";
    drawStatus();
    Serial.println("Bereit. Bekanntes Tag startet sein Lied einmal; TFT zeigt Status.");
}

void loop() {
    if (ready) {
        audio.loop();
        if (!wifiConnected && WiFi.status() == WL_CONNECTED) {
            wifiConnected = true;
            Serial.print("WLAN verbunden: http://");
            Serial.println(WiFi.localIP());
        }
        NfcEvent event;
        if (xQueueReceive(nfcEvents, &event, 0) == pdTRUE) {
            if (event.changed) {
                Serial.print("NFC NEUE UID: ");
                for (uint8_t i = 0; i < event.length; ++i) {
                    if (i) Serial.print(':');
                    Serial.printf("%02X", unsigned(event.uid[i]));
                }
                Serial.println();
                const TagBinding *binding = findTagBinding(event.uid, event.length);
                if (!binding) {
                    Serial.println("Unbekanntes Tag: kein Liedstart, laufende Musik bleibt.");
                } else {
                    // connecttoFS beendet laut Library zuvor laufenden Song.
                    audio.setVolume(VOLUME);
                    const bool connected = audio.connecttoFS(SD, binding->path);
                    if (connected) {
                        ++starts;
                        currentSong = binding->name;
                        Serial.printf("START %s -> %s | VOLUME %u | STARTS %lu\n",
                                      binding->name, binding->path, unsigned(VOLUME),
                                      (unsigned long)starts);
                    } else {
                        ++startErrors;
                        Serial.printf("FEHLER: connecttoFS(%s)\n", binding->path);
                    }
                }
            }
        }
        static uint32_t lastDraw = 0;
        if (millis() - lastDraw >= TFT_REFRESH_MS) {
            lastDraw = millis();
            drawStatus();
        }
    }
    delay(1);
}
