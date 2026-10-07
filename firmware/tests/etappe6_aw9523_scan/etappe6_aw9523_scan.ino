// Boxbert — Etappe 6, Teil 1: AW9523 isoliert an I2C (Adafruit ESP32-S3 Reverse TFT Feather)
// Fahrplan: docs/breadboard-testing.md, Etappe 6; Rail-Details: docs/power-plan.md
//
// Verdrahtung (sonst NICHTS!):
//   AW9523 VIN  -> Feather 3V3  (Logikversorgung, niemals +5 V!)
//   AW9523 GND  -> GND
//   AW9523 SDA  -> IO3
//   AW9523 SCL  -> IO4
//   INT, RST    -> offen (RST hat Onboard-10k-Pull-up, Bibliothek macht Soft-Reset)
//   Keine Taster, keine LEDs am Expander in diesem Test.
//
// PN532 darf weiterhin am selben Bus hängen (I2C-Adresse 0x24, DIP 1 ON / 2 OFF):
// Der Scan zeigt dann beide Geräte — 0x24 (PN532) und 0x58 (AW9523).
//
// Erwartung: Serial listet 0x58; falls PN532 angesteckt, zusätzlich 0x24.
// Kein 0x58 -> Verdrahtung/Versorgung prüfen, NICHT wiederholt neu flashen
// (Flash/Reset ist kein Power-Cycle der Peripherie — siehe AGENTS.md).

#include <Wire.h>

// I2C-Pins laut pinout.md (PN532-Bus): SDA IO3, SCL IO4, 100 kHz
constexpr uint8_t PIN_SDA = 3;
constexpr uint8_t PIN_SCL = 4;
constexpr uint32_t I2C_HZ = 100000;

constexpr uint8_t ADDR_AW9523 = 0x58;
constexpr uint8_t ADDR_PN532  = 0x24;

uint32_t scans = 0;
uint32_t foundA9523 = 0;

void scanBus(uint8_t found[128]) {
  for (uint8_t a = 1; a < 127; a++) {
    found[a] = 0;
    Wire.beginTransmission(a);
    if (Wire.endTransmission() == 0) found[a] = 1;
  }
}

void setup() {
  Serial.begin(115200);
  // Nicht ewig auf Serial warten — Test soll auch ohne Monitor booten
  unsigned long t0 = millis();
  while (!Serial && millis() - t0 < 2000) {}

  Serial.println();
  Serial.println("Boxbert Etappe 6 Teil 1: AW9523 I2C-Scan");
  Serial.printf("Bus: SDA=IO%u SCL=IO%u @ %lu Hz\n", PIN_SDA, PIN_SCL,
                (unsigned long)I2C_HZ);

  Wire.begin(PIN_SDA, PIN_SCL);
  Wire.setClock(I2C_HZ);
  Wire.setTimeOut(50);  // ms; PN532/I2C-Ausfaelle sollen nicht blockieren
}

void loop() {
  static uint8_t found[128];
  scans++;

  scanBus(found);

  Serial.printf("\n--- Scan #%lu ---\n", (unsigned long)scans);
  bool any = false;
  for (uint8_t a = 1; a < 127; a++) {
    if (found[a]) {
      any = true;
      const char* who = "unbekannt";
      if (a == ADDR_AW9523) who = "AW9523";
      else if (a == ADDR_PN532) who = "PN532";
      Serial.printf("  0x%02X gefunden (%s)\n", a, who);
    }
  }
  if (!any) Serial.println("  (keine Geräte gefunden)");

  if (found[ADDR_AW9523]) {
    foundA9523++;
    Serial.println("AW9523 auf 0x58: ETAPPE 6 TEIL 1 BESTANDEN");
  } else {
    Serial.println("AW9523 (0x58) FEHLT — VIN/GND/SDA/SCL durchmessen, dann USB-Power-Cycle");
  }

  delay(3000);
}
