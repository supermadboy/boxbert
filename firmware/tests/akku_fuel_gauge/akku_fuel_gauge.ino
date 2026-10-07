// akku_fuel_gauge — separater Test-Sketch, Etappe 04.10.2026-Referenz unangetastet
//
// Liest den onboard Fuel Gauge MAX17048 des Adafruit ESP32-S3 Reverse TFT
// Feather aus: Zellspannung, Ladezustand (%), Laderate (positiv = laden,
// negativ = entladen). Ausgabe alle 2 s am Serial-Monitor.
//
// Absicht (07.10.2026): ersten Akku-Tag begleiten — lädt der Akku auf,
// entlädt er plausibel beim Abspielen? Werte landen in
// docs/testprotokoll-akku.md.
//
// I2C: Onboard-Bus SDA=IO3 / SCL=IO4 (pins_arduino.h der Variante
// adafruit_feather_esp32s3_reversetft) — DERSSELBE Bus wie der PN532
// am Header. Dieser Sketch redet NICHT mit dem PN532; erst wenn beide
// in einem Sketch laufen, müssen die Wire-Zugriffe mit der NFC-Task
// synchronisiert werden (AGENTS.md).
//
// API gegen Bibliotheksbeispiel MAX17048_basic geprüft
// (Adafruit MAX1704X 1.0.3, Adresse 0x36 intern in der Lib).

#include "Adafruit_MAX1704X.h"

Adafruit_MAX17048 maxlipo;

void setup() {
  Serial.begin(115200);
  while (!Serial) delay(10);  // Serial-Monitor öffnen, sonst verpassen wir die Kopfzeilen

  Serial.println(F("\n== akku_fuel_gauge =="));

  bool found = false;
  for (int tries = 0; tries < 5 && !found; tries++) {
    found = maxlipo.begin();
    if (!found) {
      Serial.println(F("MAX17048 nicht gefunden — Akku angesteckt? Neuer Versuch in 2 s ..."));
      delay(2000);
    }
  }
  if (!found) {
    Serial.println(F("FATAL: MAX17048 bleibt unauffindbar. Sketch endet hier."));
    while (true) delay(1000);
  }

  Serial.print(F("MAX17048 gefunden, Chip ID: 0x"));
  Serial.println(maxlipo.getChipID(), HEX);
  Serial.println(F("Format: millis_s | Spannung V | SoC % | Rate %/h (+=laden, -=entladen)"));
}

void loop() {
  float volt = maxlipo.cellVoltage();
  if (isnan(volt)) {
    Serial.println(F("ERR: Spannungslesen fehlgeschlagen — Akku dran?"));
    delay(2000);
    return;
  }

  Serial.print(millis() / 1000);
  Serial.print(F(" s | "));
  Serial.print(volt, 3);
  Serial.print(F(" V | "));
  Serial.print(maxlipo.cellPercent(), 1);
  Serial.print(F(" % | "));
  Serial.print(maxlipo.chargeRate(), 2);
  Serial.println(F(" %/h"));

  delay(2000);  // Lib-Beispiel: nicht haeufiger abfragen
}
