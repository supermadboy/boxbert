// Boxbert — Etappe 6, Teil 3: NeoPixel-Stick Minimal-Rot-Test (ESP32-S3 Reverse TFT Feather)
// Fahrplan: docs/breadboard-testing.md, Etappe 6; Protokoll: docs/testprotokoll-etappe6.md
//
// Verdrahtung:
//   Stick 5V (VCC) -> USB 5 V  (WS2812 will 4-7 V, NICHT 3,3 V!)
//   Stick GND      -> GND
//   Stick DIN      -> IO8 (A5) ueber 330 Ohm in Reihe
//   Stick DOUT     -> offen (kein weiterer Stick)
//   1000 uF Elko   -> ueber 5 V/GND direkt am Stick (Stromspitzen puffern)
//
// Testprinzip (Kindersicherheit + Diagnose):
//   - Ein einziger Pixel nach dem anderen, gedimmtes Rot (Festwert 12/255,
//     kein setBrightness) — minimaler Strom, maximal klare Zuordnung
//   - Wenn ein Pixel dunkel bleibt/weisses flackert -> Datenproblem/Pegel-
//     problem (3,3-V-Logik gegen 5-V-Versorgung, bekanntes Risiko)
//   - Kein Vollweiss, kein All-Pixel-Test in dieser Etappe

#include <Adafruit_NeoPixel.h>

constexpr uint8_t NEO_PIN   = 8;   // DIN (A5) laut pinout.md
constexpr uint8_t NEO_COUNT = 8;   // Stick mit 8 x WS2812

Adafruit_NeoPixel strip(NEO_COUNT, NEO_PIN, NEO_GRB + NEO_KHZ800);

void setup() {
  Serial.begin(115200);
  unsigned long t0 = millis();
  while (!Serial && millis() - t0 < 2000) {}

  Serial.println();
  Serial.println("Boxbert Etappe 6 Teil 3: NeoPixel Minimal-Rot-Test");

  strip.begin();
  strip.clear();
  strip.show();   // alles aus als Startzustand
  Serial.println("Stick initialisiert, alle Pixel AUS.");
}

void loop() {
  // Genau ein Pixel: gedimmtes Rot wandert langsam ueber den Stick
  static uint8_t idx = 0;
  static uint32_t last = 0;

  if (millis() - last > 500) {
    last = millis();
    strip.clear();
    // Gedimmtes Rot: GRB, Festwert 12/255 Rot — bewusst kein setBrightness
    strip.setPixelColor(idx, strip.Color(12, 0, 0));
    strip.show();
    Serial.printf("[%10lu ms] Pixel %d an (gedimmtes Rot 12/255)\n",
                  millis(), idx);

    idx = (idx + 1) % NEO_COUNT;
  }
}