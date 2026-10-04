// Boxbert — Etappe 4: separater NFC-Tagwechseltest, KEIN AUDIO/SD.
// Ausgangspunkt: unveraenderter, erneut getesteter etappe4_nfc_i2c.
// Funktionale Versuchsaenderung: readPassiveTargetID-Host-Timeout 500 -> 0.
// 0 wartet auf ein Tag, statt die Suchantwort nach 500 ms aufzugeben.
// Keine Retry-/RFConfiguration, kein IRQ-Kabel, keine Library-Aenderung.
// Rueckgabefehler: Test stoppen, nicht weitere Suchkommandos nachschieben.
// Kein Tag = absichtlich blockierender NFC-Aufruf; KEINE Audio-Vorlage.
// Pins aus hardware/pinout.md: SDA=IO3, SCL=IO4, VCC=3V3, GND.
// DIP 1 ON / 2 OFF; PN532-SPI/UART ab; IRQ/Reset offen. Nur USB, Akku ab.
// API gegen Adafruit PN532 1.3.4 readMifare + Treibercode geprueft.

#include <Arduino.h>
#include <Wire.h>
#include <Adafruit_PN532.h>
#include <cstring>

#define SDA_PIN 3
#define SCL_PIN 4

// Dummy-Pins exakt wie im funktionierenden Einzeltest beibehalten.
// RDY wird in dieser Version ueber I2C gelesen, nicht ueber IRQ.
Adafruit_PN532 nfc(255, 254, &Wire);

bool ready = false;
const char *result = "Noch nicht initialisiert";
uint32_t reads = 0;
uint32_t switches = 0;  // UID-Aenderungen NACH der ersten UID, keine Entfernen-Events
uint8_t lastUid[7] = {};
uint8_t lastLength = 0;
const uint8_t TAG1[] = {0xE3, 0x2F, 0xF6, 0x33};
const uint8_t TAG2[] = {0x01, 0x8C, 0xF1, 0x6E};

const char *tagName(const uint8_t *uid, uint8_t length) {
  if (length == sizeof(TAG1) && memcmp(uid, TAG1, length) == 0) return "TAG1";
  if (length == sizeof(TAG2) && memcmp(uid, TAG2, length) == 0) return "TAG2";
  return "UNBEKANNT";
}

void setup() {
  Serial.begin(115200);
  delay(2500);
  const uint32_t started = millis();
  while (!Serial && millis() - started < 2000) {}

  Serial.println("\n=== BOXBERT NFC SWITCH v1 — timeout=0, KEIN AUDIO ===");
  Wire.begin(SDA_PIN, SCL_PIN);
  Wire.setClock(100000);
  nfc.begin();
  delay(100);

  const uint32_t version = nfc.getFirmwareVersion();
  if (!version) {
    result = "FEHLER: keine PN532-Firmwareantwort; Test gestoppt";
    Serial.println(result);
    return;
  }
  Serial.printf("PN5%02X gefunden, Firmware %u.%u\n",
                unsigned((version >> 24) & 0xFF),
                unsigned((version >> 16) & 0xFF),
                unsigned((version >> 8) & 0xFF));
  if (!nfc.SAMConfig()) {
    result = "FEHLER: SAMConfig; Test gestoppt";
    Serial.println(result);
    return;
  }
  ready = true;
  result = "NFC initialisiert; readPassiveTargetID wartet ohne Host-Timeout";
  Serial.println(result);
  Serial.println("Bei leerer Leserflaeche darf Serial still sein. Tag auflegen beendet das Warten.");
}

void loop() {
  if (!ready) {
    static uint32_t lastReport = 0;
    if (millis() - lastReport >= 3000) {
      lastReport = millis();
      Serial.println(result);
    }
    delay(100);
    return;
  }

  uint8_t uid[7] = {};
  uint8_t length = 0;
  // Dokumentierter API-Default (readMifare-Beispiel): timeout=0.
  // Ein Suchaufruf bleibt offen, bis eine Antwort kommt. Nicht fuer den
  // spaeteren Audio-Hauptloop verwenden: der braucht laufend CPU-Zeit.
  if (!nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, uid, &length, 0)) {
    ready = false;
    result = "FEHLER: NFC-Aufruf lieferte false; keine weiteren Suchkommandos";
    Serial.println(result);
    return;
  }
  if (length == 0 || length > sizeof(uid)) {
    ready = false;
    result = "FEHLER: unplausible UID-Laenge; Test gestoppt";
    Serial.println(result);
    return;
  }

  ++reads;
  const bool changed = length != lastLength || memcmp(uid, lastUid, length) != 0;
  if (changed) {
    if (lastLength != 0) ++switches;
    memcpy(lastUid, uid, length);
    lastLength = length;
  }
  Serial.printf("%s | UID ", tagName(uid, length));
  for (uint8_t i = 0; i < length; ++i) {
    if (i) Serial.print(':');
    Serial.printf("%02X", unsigned(uid[i]));
  }
  Serial.printf(" | LEN %u | READS %lu | SWITCHES %lu%s\n",
                unsigned(length), (unsigned long)reads,
                (unsigned long)switches, changed ? " | NEUE UID" : "");
  // Erfolgs-Pause wie in der bestaetigten Referenz belassen.
  delay(1200);
  delay(100);
}
