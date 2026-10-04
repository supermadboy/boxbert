// Boxbert — Etappe 4: PN532 über I2C, Tag-UID lesen (NTAG215/Mifare).
//
// Verdrahtung (wie etappe4_i2cscan, bestätigt 04.10.2026):
//   SDA -> IO3, SCL -> IO4, VCC -> 3V3, GND -> GND
//   SPI-Header (SCK/MISO/MOSI/SS) am Modul offen, IRQ offen.
// DIP: I2C (Schalter 1 ON, Schalter 2 OFF) — gemessen: SDA/SCL 3,3 V Ruhelage.
//
// Bus-Mitbewohner: MAX17048 (0x36, onboard) — kein Konflikt mit 0x24.
// PN532-FW v1.6 per Scan bestätigt; dieser Sketch testet den vollen
// Lese-Pfad: SAMConfig + readPassiveTargetID in der Loop.

#include <Wire.h>
#include <Adafruit_PN532.h>

#define SDA_PIN 3
#define SCL_PIN 4

// IRQ/Reset offen: Dummy-Pins, die Lib pollt dann am Bus statt am IRQ.
Adafruit_PN532 nfc(255, 254, &Wire);

bool ready = false;
const char *result = "Noch nicht initialisiert";

void setup() {
  Serial.begin(115200);
  delay(2500);  // Zeitfenster, um nach dem Upload den Serial-Monitor zu öffnen
  const uint32_t started = millis();
  while (!Serial && millis() - started < 2000) {}

  Serial.println("\n=== Etappe 4: PN532 I2C Tag-Lesetest ===");
  Wire.begin(SDA_PIN, SCL_PIN);
  Wire.setClock(100000);  // konservativ, 100 kHz

  nfc.begin();
  delay(100);

  const uint32_t version = nfc.getFirmwareVersion();
  if (!version) {
    result = "FEHLER: PN532 antwortet nicht (DIP auf I2C? SDA/SCL vertauscht?)";
    Serial.println(result);
    return;
  }
  Serial.printf("PN5%02X gefunden, Firmware %u.%u\n",
                (unsigned)((version >> 24) & 0xFF),
                (unsigned)((version >> 16) & 0xFF),
                (unsigned)((version >> 8) & 0xFF));

  if (!nfc.SAMConfig()) {
    result = "FEHLER: SAMConfig fehlgeschlagen";
    Serial.println(result);
    return;
  }
  ready = true;
  result = "PN532 bereit (I2C) — NTAG215 auflegen";
  Serial.println(result);
}

void loop() {
  static uint32_t lastReport = 0;
  if (millis() - lastReport >= 3000) {
    lastReport = millis();
    Serial.println(result);  // auch nach spaeterem Oeffnen des Monitors sichtbar
  }
  if (!ready) {
    delay(100);
    return;
  }
  uint8_t uid[7] = {};
  uint8_t uidLength = 0;
  if (nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, uid, &uidLength, 500)) {
    Serial.print("Tag UID (");
    Serial.print(uidLength);
    Serial.print(" Bytes): ");
    for (uint8_t i = 0; i < uidLength && i < sizeof(uid); ++i) {
      if (i) Serial.print(':');
      Serial.printf("%02X", uid[i]);
    }
    Serial.println();
    delay(1200);  // Entprellung: nicht dieselbe Tag-Physik dauerhaft neu lesen
  }
  delay(100);
}
