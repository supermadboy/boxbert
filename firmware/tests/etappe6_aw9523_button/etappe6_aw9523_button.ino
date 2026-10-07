// Boxbert — Etappe 6, Teil 2: Taster am AW9523-Port A0 (Adafruit ESP32-S3 Reverse TFT Feather)
// Fahrplan: docs/breadboard-testing.md, Etappe 6; Protokoll: docs/testprotokoll-etappe6.md
//
// Verdrahtung (AW9523 wie Teil 1: VIN->3V3, GND, SDA->IO3, SCL->IO4):
//   Port A0  -> 10 kOhm Pull-up nach 3V3 (extern! Chip hat KEINE internen Pull-ups)
//   Port A0  -> Taster
//   Taster   -> GND
// Also: unbetaetigt HIGH (1), betaetigt LOW (0).
//
// Registermap — 1:1 aus Adafruit_AW9523.h (nicht aus dem Gedächtnis!):
//   0x00 INPUT0   : Eingangszustand P0 (0x01 = P1)
//   0x02 OUTPUT0  : Ausgangswerte P0
//   0x04 CONFIG0  : Richtung P0 — Bit 1 = Eingang, 0 = Ausgang
//                   (Bib: configureDirection(1==output) schreibt ~pins)
//   0x06 INTENABLE0
//   0x10 CHIPID   : liest 0x23 (Sanity-Check wie lib begin())
//   0x11 GCR      : NICHT anfassen (Bits 4:3 = IMODE; 0xFF dort = LED-Modus
//                   global -> genau der Fehler aus der ersten Version!)
//   0x12 LEDMODE0 : Konstantstrom-Bits P0 — INVERTIERT: Registerbit 0 =
//                   LED-Sink, Bit 1 = GPIO (Bib: configureLEDMode schreibt ~pins)
//   0x7F SOFTRESET: Schreiben von 0 = Soft-Reset (wie lib reset())
//
// Historie: Erste Version las Eingangszustand fälschlich aus 0x06
// (INTENABLE!) und schrieb "LEDMODE" fälschlich ins GCR 0x11 mit 0xFF ->
// globaler LED-Modus -> A0 dauerhaft LOW. Diagnose: Selbstantrieb-Test
// (etappe6_aw9523_diag, historisch) + Bibliotheksquellen-Abgleich.
// Diese Version: Soft-Reset wie lib begin(), dann definierte Konfiguration.

#include <Wire.h>

constexpr uint8_t PIN_SDA = 3;
constexpr uint8_t PIN_SCL = 4;
constexpr uint32_t I2C_HZ = 100000;

constexpr uint8_t ADDR_AW9523 = 0x58;

constexpr uint8_t REG_INPUT0   = 0x00;
constexpr uint8_t REG_CONFIG0  = 0x04;
constexpr uint8_t REG_CHIPID   = 0x10;
constexpr uint8_t REG_LEDMODE0 = 0x12;
constexpr uint8_t REG_LEDMODE1 = 0x13;
constexpr uint8_t REG_SOFTRESET = 0x7F;

constexpr uint8_t A0_BIT = 0x01;  // Port-Pin A0 = Bit 0 an P0

uint32_t i2cErrors = 0;
uint32_t reads = 0;
uint8_t lastState = 255;  // 255 = "noch nie gelesen", forciert erste Ausgabe

// Schreibt ein Register und liefert true bei ACK/Match
bool writeReg(uint8_t reg, uint8_t val) {
  Wire.beginTransmission(ADDR_AW9523);
  Wire.write(reg);
  Wire.write(val);
  return Wire.endTransmission() == 0;
}

// Liest ein Register; gibt false bei I2C-Fehler zurueck
bool readReg(uint8_t reg, uint8_t& val) {
  Wire.beginTransmission(ADDR_AW9523);
  Wire.write(reg);
  if (Wire.endTransmission() != 0) return false;
  if (Wire.requestFrom((int)ADDR_AW9523, 1) != 1) return false;
  val = Wire.read();
  return true;
}

void setup() {
  Serial.begin(115200);
  unsigned long t0 = millis();
  while (!Serial && millis() - t0 < 2000) {}

  Serial.println();
  Serial.println("Boxbert Etappe 6 Teil 2 (v2): Taster an AW9523 A0");

  Wire.begin(PIN_SDA, PIN_SCL);
  Wire.setClock(I2C_HZ);
  Wire.setTimeOut(50);  // ms — PN532/I2C-Ausfaelle duerfen nicht blockieren

  // Sanity-Check wie lib begin(): Chip-ID Register 0x10 muss 0x23 sein
  uint8_t chipid = 0;
  if (!readReg(REG_CHIPID, chipid)) {
    Serial.println("FEHLER: AW9523 auf 0x58 antwortet nicht — STOPP (nicht neu flashen, erst Durchgangspruefer/Power-Cycle)");
    while (true) delay(1000);
  }
  Serial.printf("CHIPID (0x10) = 0x%02X (erwartet 0x23)\n", chipid);
  if (chipid != 0x23) {
    Serial.println("FEHLER: unerwartete CHIPID — STOPP");
    while (true) delay(1000);
  }

  // Soft-Reset wie lib begin(): Reg 0x7F = 0 -> definierte Ausgangslage
  if (!writeReg(REG_SOFTRESET, 0x00)) {
    Serial.println("FEHLER: Soft-Reset nicht ACKed — STOPP");
    while (true) delay(1000);
  }
  delay(10);

  // Konfiguration wie lib begin(): alles Eingang, Push-Pull, kein INT,
  // zusaetzlich LEDMODE-Bits = 1 (GPIO-Modus, Bit invertiert!)
  bool ok = true;
  ok &= writeReg(REG_LEDMODE0, 0xFF);  // P0: alle GPIO-Modus (Bit 1 = GPIO)
  ok &= writeReg(REG_LEDMODE1, 0xFF);  // P1: alle GPIO-Modus
  ok &= writeReg(REG_CONFIG0,  0xFF);  // P0: alle Eingang (Bit 1 = Eingang)
  ok &= writeReg(REG_CONFIG0 + 1, 0xFF); // P1: alle Eingang
  if (!ok) {
    Serial.println("FEHLER: Konfiguration nicht bestätigt — STOPP");
    while (true) delay(1000);
  }

  // Readback zur Kontrolle
  uint8_t lm0 = 0, cfg0 = 0;
  readReg(REG_LEDMODE0, lm0);
  readReg(REG_CONFIG0, cfg0);
  Serial.printf("Readback: LEDMODE0=0x%02X (erw. 0xFF), CONFIG0=0x%02X (erw. 0xFF)\n",
                lm0, cfg0);

  Serial.println("Konfiguration ok. Warte auf Taster (A0: 1 = offen, 0 = gedrueckt) ...");
}

void loop() {
  uint8_t in0 = 0;
  reads++;

  if (!readReg(REG_INPUT0, in0)) {
    i2cErrors++;
    Serial.printf("[%10lu ms] I2C-FEHLER beim Lesen (Nr. %lu)\n",
                  millis(), (unsigned long)i2cErrors);
  } else {
    uint8_t state = (in0 & A0_BIT) ? 1 : 0;
    if (state != lastState) {
      if (lastState == 255) {
        Serial.printf("[%10lu ms] Startzustand A0 = %d (%s)\n", millis(),
                      state, state ? "HIGH, nicht betaetigt" : "LOW, betaetigt?!");
      } else {
        Serial.printf("[%10lu ms] A0 -> %d (%s)\n", millis(), state,
                      state ? "HOCH  = losgelassen" : "NIEDRIG = GEDRUECKT");
      }
      lastState = state;
    }
  }

  // Herzschlag alle 5 s, damit sichtbar bleibt, dass der Loop laeuft
  static uint32_t lastBeat = 0;
  if (millis() - lastBeat > 5000) {
    lastBeat = millis();
    uint8_t lm0 = 0, cfg0 = 0;
    readReg(REG_LEDMODE0, lm0); readReg(REG_CONFIG0, cfg0);
    Serial.printf("[Herz] reads=%lu i2cErrors=%lu A0=%d LEDMODE0=0x%02X CONFIG0=0x%02X\n",
                  (unsigned long)reads, (unsigned long)i2cErrors, lastState, lm0, cfg0);
  }

  delay(20);  // ~50 Hz Abtastung, reicht weit fuer Taster ohne Entprellen im Test
}
