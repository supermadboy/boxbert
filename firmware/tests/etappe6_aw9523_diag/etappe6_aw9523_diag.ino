// Boxbert — Etappe 6, Teil 2-DIAGNOSE: A0-Selbsttest am AW9523 (NICHT der Funktionstest!)
// ⚠️ HISTORISCH/VERWORFEN: Dieser Sketch schreibt LEDMODE=0x00 — das ist
// laut Adafruit_AW9523.cpp die INVERTIERTE Semantik (Bit 0 = LED-Sink).
// Er hat damit selbst den Fehler verursacht, den er diagnostizieren sollte.
// Korrekturfund: docs/testprotokoll-etappe6.md, fixierter Funktionstest:
// firmware/tests/etappe6_aw9523_button/ (LEDMODE=0xFF).
// Hintergrund damals: Funktionstest (etappe6_aw9523_button) las A0 dauerhaft
// LOW, ohne Wechsel beim Drücken. I2C selbst fehlerfrei (i2cErrors=0).
//
// Dieser Diagnose-Sketch trennt die Moeglichkeiten:
//   A) Chip-Kanal A0 kaputt / Register schreiben nicht
//   B) Hardshort nach GND (Taster klebt, Loetbruecke, falscher Pin)
//   C) Pull-up fehlt / ohne Kontakt -> Pin treibt LOW als Ausgang und liest
//      es selbst: wenn HIGH/LOW-Treiben korrekt zurueckgelesen wird, ist der
//      Kanal i.O. und die Ursache liegt extern (Pull-up/Verdrahtung).
//
// ACHTUNG: Waehrend des Tests tribt A0 aktiv HIGH/LOW. Der Taster darf
// WAHREND DER DIAGNOSE NICHT GEDRUECKT werden (Kurzschluss bei HIGH + Taste
// nach GND). Taster nur spater im eigentlichen Funktionstest betaetigen.
//
// AW9523-Registermap (Datenblatt): 0x02 P0-Out, 0x03 P1-Out, 0x04 P0-Cfg,
// 0x05 P1-Cfg, 0x06 P0-In, 0x07 P1-In, 0x10 GCR, 0x11 LEDMODE.

#include <Wire.h>

constexpr uint8_t PIN_SDA = 3;
constexpr uint8_t PIN_SCL = 4;
constexpr uint32_t I2C_HZ = 100000;
constexpr uint8_t ADDR = 0x58;

constexpr uint8_t REG_P0_OUT   = 0x02;
constexpr uint8_t REG_P0_CFG   = 0x04;
constexpr uint8_t REG_P0_IN    = 0x06;
constexpr uint8_t REG_GCR      = 0x10;
constexpr uint8_t REG_LEDMODE  = 0x11;
constexpr uint8_t A0_BIT = 0x01;

uint32_t i2cErrors = 0;

bool writeReg(uint8_t reg, uint8_t val) {
  Wire.beginTransmission(ADDR);
  Wire.write(reg);
  Wire.write(val);
  return Wire.endTransmission() == 0;
}
bool readReg(uint8_t reg, uint8_t& val) {
  Wire.beginTransmission(ADDR);
  Wire.write(reg);
  if (Wire.endTransmission() != 0) return false;
  if (Wire.requestFrom((int)ADDR, 1) != 1) return false;
  val = Wire.read();
  return true;
}

uint8_t readIn(bool& ok) {
  uint8_t v = 0;
  ok = readReg(REG_P0_IN, v);
  if (!ok) i2cErrors++;
  return v;
}

void setup() {
  Serial.begin(115200);
  unsigned long t0 = millis();
  while (!Serial && millis() - t0 < 2000) {}
  Serial.println();
  Serial.println("Boxbert Etappe 6 Teil 2-DIAGNOSE: AW9523 A0 Selbsttest");
  Serial.println("!!! Taster nicht betaetigen waehrend der Diagnose !!!");

  Wire.begin(PIN_SDA, PIN_SCL);
  Wire.setClock(I2C_HZ);
  Wire.setTimeOut(50);

  uint8_t v = 0; bool ok = false;

  // 1) Boot-/Aktueller Zustand: Register readback VOR eigenen Aenderungen
  Serial.println("--- Readback VOR Aenderungen ---");
  if (readReg(REG_P0_CFG, v) && ok) { ok = true; Serial.printf("  P0_CFG  (0x04) = 0x%02X\n", v); } else { Serial.println("  P0_CFG  = I2C-FEHLER"); }
  if (readReg(REG_LEDMODE, v) && ok) Serial.printf("  LEDMODE (0x11) = 0x%02X\n", v); else Serial.println("  LEDMODE = I2C-FEHLER");
  if (readReg(REG_GCR, v) && ok)    Serial.printf("  GCR     (0x10) = 0x%02X (IMODE bits 4:3)\n", v); else Serial.println("  GCR     = I2C-FEHLER");
  (void)ok;

  // 2) Definierte Konfiguration schreiben
  Serial.println("--- Schreibe Konfiguration ---");
  Serial.printf("  LEDMODE=0x00  -> %s\n", writeReg(REG_LEDMODE, 0x00) ? "ACK" : "KEIN ACK");
  Serial.printf("  P0_CFG =0xFF  -> %s\n", writeReg(REG_P0_CFG, 0xFF) ? "ACK" : "KEIN ACK");
  // Readback zur Kontrolle, ob die Schreibwerte wirklich haengen
  if (readReg(REG_P0_CFG, v)) Serial.printf("  P0_CFG readback = 0x%02X (erwartet 0xFF)\n", v);
  if (readReg(REG_LEDMODE, v)) Serial.printf("  LEDMODE readback = 0x%02X (erwartet 0x00)\n", v);

  // 3) Selbstantrieb: A0 als Ausgang, HIGH und LOW treiben, Eingang mitlesen
  Serial.println("--- A0-Selbstantrieb (Taster loesen!) ---");
  bool okH = false, okL = false;
  uint8_t inH = 0, inL = 0;

  writeReg(REG_P0_CFG, 0x00);        // alle P0 = Ausgang
  writeReg(REG_P0_OUT, 0xFF);        // A0 = HIGH
  delay(100);                        // Linie stabilisieren lassen
  inH = readIn(okH);
  Serial.printf("  A0 als Ausgang HIGH  -> Eingang liest %d (%s)\n", inH,
                okH ? "I2C ok" : "I2C-FEHLER");

  writeReg(REG_P0_OUT, 0x00);        // A0 = LOW
  delay(100);
  inL = readIn(okL);
  Serial.printf("  A0 als Ausgang LOW   -> Eingang liest %d (%s)\n", inL,
                okL ? "I2C ok" : "I2C-FEHLER");

  // 4) Bewertung + Rueckkehr in Eingangsmodus
  bool channelOK = okH && okL && (inH == 1) && (inL == 0);
  if (channelOK) {
    Serial.println("BEWERTUNG: Kanal A0 arbeitet (HIGH/LOW-Treiben liest zurueck).");
    Serial.println("  -> Problem liegt AUSSERHALB des Chips: Pull-up nach 3V3 fehlt/kein");
    Serial.println("     Kontakt, oder Pin faellt ohne Bias auf 0. Verdrahtung 10k pruefen.");
  } else if (okH && okL && inH == 0 && inL == 0) {
    Serial.println("BEWERTUNG: A0 liest auch bei aktivem HIGH-Treiben 0.");
    Serial.println("  -> HARD-SHORT nach GND: Taster klebt/falscher Kontakt, Loetbruecke");
    Serial.println("     oder falsches Pad. Durchgangspruefer: A0 gegen GND unbetaetigt.");
  } else {
    Serial.printf("BEWERTUNG: unklar (inH=%d okH=%d, inL=%d okL=%d) — Schritte einzeln wiederholen.\n", inH, okH, inL, okL);
  }

  // Rueckkehr in definierten Eingangszustand fuer spaeteren Funktionstest
  writeReg(REG_P0_CFG, 0xFF);
  Serial.println("A0 zurueck als Eingang. Ab jetzt: Betaetigen erlaubt (Beobachtungs-Loop).");
}

// Schreibzugriff: bool writeReg
// Selbstantrieb im LOOP statt im Setup — so reicht ein einfaches Mitlesen
// ohne USB-Reset (der USB-Serial/JTAG re-enumeriert und reisst den Leser ab).
// Phase 1 (erste ~6 s): 3 Runden HIGH/LOW-Treiben. TASTER NICHT BETAETIGEN!
// Phase 2 danach: reine Beobachtung wie im Funktionstest.

void loop() {
  static uint32_t loopCount = 0;
  loopCount++;

  static uint8_t last = 255;  // A0-Zustand fuer Wechselausgabe (255 = Start)

  if (loopCount <= 6) {
    // Selbstantrieb: ungerade = HIGH treiben, gerade = LOW treiben
    uint8_t drive = (loopCount % 2) ? 0xFF : 0x00;
    writeReg(REG_P0_CFG, 0x00);   // A0 = Ausgang
    writeReg(REG_P0_OUT, drive);  // HIGH/LOW
    delay(100);
    bool ok = false;
    uint8_t in = readIn(ok);
    uint8_t cfg = 0, led = 0;
    readReg(REG_P0_CFG, cfg); readReg(REG_LEDMODE, led);
    Serial.printf("[Selbstantrieb %lu] treibe %d -> liest %d | P0_CFG=0x%02X LEDMODE=0x%02X | %s\n",
                  (unsigned long)loopCount, drive ? 1 : 0, in, cfg, led,
                  ok ? "I2C ok" : "I2C-FEHLER");
    if (loopCount == 6) {
      writeReg(REG_P0_CFG, 0xFF);  // zurueck als Eingang
      Serial.println("--- Selbstantrieb beendet, A0 wieder Eingang ---");
      Serial.println("--- AB JETZT: Taster betaetigen erlaubt ---");
      last = 255;
    }
    delay(900);
    return;
  }

  // Phase 2: Beobachtungs-Loop wie im Funktionstest
  bool ok = false;
  uint8_t p0 = readIn(ok);
  if (ok) {
    uint8_t st = (p0 & A0_BIT) ? 1 : 0;
    if (st != last) {
      if (last != 255)
        Serial.printf("[%10lu ms] A0 -> %d (%s)\n", millis(), st,
                      st ? "HOCH  = losgelassen" : "NIEDRIG = GEDRUECKT");
      last = st;
    }
  }
  static uint32_t beat = 0;
  if (millis() - beat > 5000) {
    beat = millis();
    uint8_t cfg = 0, led = 0;
    readReg(REG_P0_CFG, cfg); readReg(REG_LEDMODE, led);
    Serial.printf("[Herz] i2cErrors=%lu A0=%d P0_CFG=0x%02X LEDMODE=0x%02X\n",
                  (unsigned long)i2cErrors, last, cfg, led);
  }
  delay(20);
}
