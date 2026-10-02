// Boxbert — Etappe 1: I2S-Audio + Onboard-NeoPixel-Status-LED  (v2)
// Fahrplan: docs/breadboard-testing.md, Etappe 1
// Pins aus pinout.md: ESP32-DOUT=IO16 (A2, → Amp-DIN), BCLK=IO17 (A1), LRC=IO18 (A0).
// Onboard-NeoPixel: IO33 (Daten), IO21 (Power — vom Core HIGH, nicht anfassen).
//
// v2-Fix: i2s.setPins() FEHLTE in v1 — ohne setPins() werden die GPIOs nie
// mit dem I2S-Controller verschaltet (GPIO-Matrix). begin() läuft trotzdem
// durch, write() zählt Bytes, aber am Pin kommt nichts an → tote Stille bei
// grüner LED. Symptom-Doku: docs/testprotokoll-etappe1.md.
//
// Modul (Klon, Pin-Reihenfolge VIN/GND/SD/GAIN/DIN/BCLK/LRC):
//   VIN→USB-5V, GND→GND, SD→3V3 (Mono (L+R)/2 erzwingen), GAIN offen (9 dB).

#include <ESP_I2S.h>
#include <Adafruit_NeoPixel.h>

// ---------------- NeoPixel (Onboard, IO33, GRB) ----------------
#define LED_PIN    33
#define LED_PWR    21   // Onboard-NeoPixel-Power (Core setzt HIGH; nicht toggeln)
Adafruit_NeoPixel px(1, LED_PIN, NEO_GRB + NEO_KHZ800);

// ---------------- I2S → MAX98357A (Breadboard) ----------------
// Achtung Namings: Der Amp-Pin "DIN" hängt am ESP32-DOUT (Daten RICHTUNG Amp).
#define I2S_BCLK 17    // A1
#define I2S_LRC  18    // A0 (Word Select)
#define I2S_DOUT 16    // A2 → Amp-DIN

static const int SAMPLE_RATE = 22050;
static const int SAMPLES     = 4410;  // 0,2 s pro Ton
static const int AMP_STUFE[] = { 10 };  // AMP 10 — laut Daddelbert immer noch gut hoerbar
static const int N_STUFEN    = sizeof(AMP_STUFE) / sizeof(AMP_STUFE[0]);

static int16_t tone_data[SAMPLES];

I2SClass i2s;   // global — setPins() einmal in setup(), nicht pro Zyklus neu

void setup() {
  px.begin();
  px.setBrightness(20);
  px.setPixelColor(0, px.Color(0, 0, 80));   // blau = bootet
  px.show();

  Serial.begin(115200);
  unsigned long t0 = millis();
  while (!Serial && millis() - t0 < 2000) {}

  Serial.println("Etappe 1 v2: setPins(BCLK=17, LRC=18, DOUT=16) + begin()");

  // TESTTONE 440 Hz erzeugen (loop() ueberschreibt eh — leise Startstufe)
  for (int i = 0; i < SAMPLES; i++) {
    tone_data[i] =
        (int16_t)(AMP_STUFE[0] * sinf(2.0f * PI * 440.0f * i / SAMPLE_RATE));
  }

  i2s.setPins(I2S_BCLK, I2S_LRC, I2S_DOUT);
  if (!i2s.begin(I2S_MODE_STD, SAMPLE_RATE, I2S_DATA_BIT_WIDTH_16BIT,
                 I2S_SLOT_MODE_MONO)) {
    Serial.println("I2S begin FEHLGESCHLAGEN");
    px.setPixelColor(0, px.Color(80, 0, 0)); // rot = Fehler
    px.show();
    while (true) delay(1000);
  }

  px.setPixelColor(0, px.Color(0, 80, 0));   // grün = Ton läuft
  px.show();
  Serial.println("I2S läuft — Testtoene im Dauerkreislauf (440/880/Stille).");
}

void loop() {
  // Lautstaerke-Treppe: alle 2 s eine Aussteuerungsstufe (440/880 im Wechsel).
  // Wir hoeren die Stufen direkt nacheinander und suchen die passende aus.
  static uint32_t cycle = 0;

  int freq = (cycle % 2) ? 880 : 440;
  int amp  = AMP_STUFE[(cycle / 2) % N_STUFEN];
  Serial.printf("Zyklus %u: %d Hz @ AMP %d", (unsigned)cycle, freq, amp);

  for (int i = 0; i < SAMPLES; i++) {
    tone_data[i] =
        (int16_t)(amp * sinf(2.0f * PI * freq * i / SAMPLE_RATE));
  }
  size_t written = 0;
  for (int r = 0; r < 10; r++) {   // 10 × 0,2 s = 2 s
    written += i2s.write((uint8_t*)tone_data, SAMPLES * sizeof(int16_t));
  }
  // Diagnose: Soll 88200 Bytes pro Zyklus (4410 Samples × 2 Bytes × 10).
  Serial.printf(" — written=%u/%u\n", (unsigned)written,
                (unsigned)(SAMPLES * sizeof(int16_t) * 10));
  cycle++;
}
