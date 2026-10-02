// Boxbert — Etappe 2 Teil 2: mp3 von SD abspielen (ESP32-audioI2S v4)
// Fahrplan: docs/breadboard-testing.md, Etappe 2
// SD: CS=IO10, SCK=IO36, MOSI=IO35, MISO=IO37, VCC=USB-5V (Onboard-Regler)
// I2S (MAX98357A-Klon): DOUT=IO16 (A2 → Amp-DIN), BCLK=IO17 (A1), LRC=IO18 (A0)
//   SD-Pin des Amps liegt an 3V3 → Mono (L+R)/2; GAIN offen = 9 dB
//
// Kindersicherheit: Volume bewusst klein starten (6 von 21).
// API gegen Bibliotheksbeispiel geprüft (examples/I2Saudio_SD, v4.0.0).
// Braucht PSRAM: Build mit fqbn-Option PSRAM=opi (N8R2-Modul = OPI-PSRAM).

#include "Arduino.h"
#include "Audio.h"
#include "SPI.h"
#include "SD.h"
#include "FS.h"
#include <Adafruit_NeoPixel.h>

#define SD_CS   10
#define SPI_SCK 36
#define SPI_MISO 37
#define SPI_MOSI 35

#define I2S_DOUT 16
#define I2S_BCLK 17
#define I2S_LRC  18

#define LED_PIN    33
#define LED_PWR    21
Adafruit_NeoPixel px(1, LED_PIN, NEO_GRB + NEO_KHZ800);

Audio audio;   // I2S_PORT 0 ist Default

void my_audio_info(Audio::msg_t m) {
    Serial.printf("[audio] %s: %s\n", m.s, m.msg);
}

void setup() {
    px.begin();
    px.setBrightness(20);
    px.setPixelColor(0, px.Color(0, 0, 80));   // blau = bootet
    px.show();

    Audio::audio_info_callback = my_audio_info;

    pinMode(SD_CS, OUTPUT);
    digitalWrite(SD_CS, HIGH);                 // CS idle high (geteilter Bus)
    SPI.begin(SPI_SCK, SPI_MISO, SPI_MOSI);
    SPI.setFrequency(1000000);                 // konservativ wie im Beispiel

    Serial.begin(115200);
    unsigned long t0 = millis();
    while (!Serial && millis() - t0 < 2000) {}

    Serial.println("Etappe 2/2: mp3 von SD ueber I2S (ESP32-audioI2S v4)");

    if (!SD.begin(SD_CS)) {
        Serial.println("SD begin FEHLGESCHLAGEN");
        px.setPixelColor(0, px.Color(80, 0, 0)); // rot = Fehler
        px.show();
        while (true) delay(1000);
    }
    Serial.printf("SD ok — Kartengroesse: %.0f MB — Dateien:\n",
                  SD.cardSize() / (1024.0 * 1024.0));
    File root = SD.open("/");
    char firstMp3[64] = "";
    while (root) {
        File f = root.openNextFile();
        if (!f) break;
        Serial.printf("  %8u B  %s\n", (unsigned)f.size(), f.name());
        if (firstMp3[0] == '\0') {
            const char *n = f.name();
            size_t len = strlen(n);
            if (len > 4 && strcasecmp(n + len - 4, ".mp3") == 0) {
                snprintf(firstMp3, sizeof(firstMp3), "/%s", n);
            }
        }
        f.close();
    }
    root.close();
    if (firstMp3[0] == '\0') {
        Serial.println("Keine .mp3 auf der Karte gefunden!");
        px.setPixelColor(0, px.Color(80, 0, 0));
        px.show();
        while (true) delay(1000);
    }
    Serial.printf("Spiele: %s\n", firstMp3);

    audio.setPinout(I2S_BCLK, I2S_LRC, I2S_DOUT);
    audio.setVolume(6);                        // 0...21 — Etappe-2-Hoertest: 6 = leise-schoen, 21 = max
    if (!audio.connecttoFS(SD, firstMp3)) {
        Serial.printf("connecttoFS(%s) FEHLGESCHLAGEN\n", firstMp3);
        px.setPixelColor(0, px.Color(80, 0, 0));
        px.show();
        while (true) delay(1000);
    }

    px.setPixelColor(0, px.Color(0, 80, 0));   // grün = spielt
    px.show();
    Serial.println("Spielt: arcade-music-loop.mp3");
}

void loop() {
    audio.loop();
}