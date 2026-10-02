// Boxbert — Etappe 2: microSD-Karte am SPI-Bus (nur Dateiliste)
// Fahrplan: docs/breadboard-testing.md, Etappe 2
// Pins aus pinout.md: SD-CS=IO10, SCK=IO36, MOSI=IO35, MISO=IO37.
// VCC am Modul an USB-5V (Modul hat Onboard-3,3-V-Regler).
//
// Fehler-Checkliste AGENTS.md abgearbeitet:
//  - Peripheral-API gegen Bibliotheksbeispiel geprüft (SD.begin(CS, SPI),
//    SPI.begin(sck, miso, mosi, ss) — Reihenfolge sck/MISO/MOSI!).
//  - Modul-Silkscreen: Soldered MSD-AADP/333050, Pins VCC GND SCLK MISO MOSI CS.
//  - Lautstärke irrelevant (kein Ton in diesem Sketch).
//
// NeoPixel (IO33): blau=Boot, grün=SD ok, rot=SD-Fehler, danach Herzschlag.

#include <SPI.h>
#include <SD.h>
#include <Adafruit_NeoPixel.h>

#define SD_CS   10
#define SPI_SCK 36
#define SPI_MISO 37
#define SPI_MOSI 35

#define LED_PIN    33
#define LED_PWR    21
Adafruit_NeoPixel px(1, LED_PIN, NEO_GRB + NEO_KHZ800);

void listDir(fs::FS &fs, const char *dirname, int depth);

void setup() {
  px.begin();
  px.setBrightness(20);
  px.setPixelColor(0, px.Color(0, 0, 80));   // blau = bootet
  px.show();

  Serial.begin(115200);
  unsigned long t0 = millis();
  while (!Serial && millis() - t0 < 2000) {}

  Serial.println("Etappe 2: SD-Karte am SPI-Bus (CS=10, SCK=36, MOSI=35, MISO=37)");

  SPI.begin(SPI_SCK, SPI_MISO, SPI_MOSI, SD_CS);
  if (!SD.begin(SD_CS)) {
    Serial.println("SD begin FEHLGESCHLAGEN (Karte steckt? FAT32? VCC an 5V?)");
    px.setPixelColor(0, px.Color(80, 0, 0)); // rot = Fehler
    px.show();
    while (true) delay(1000);
  }

  Serial.printf("SD ok — Kartengroesse: %.0f MB, Typ: %d\n",
                SD.cardSize() / (1024.0 * 1024.0), SD.cardType());
  Serial.println("SD ok — root-Verzeichnis:");
  listDir(SD, "/", 0);

  px.setPixelColor(0, px.Color(0, 80, 0));   // grün = SD ok
  px.show();
  Serial.println("Etappe 2: Dateiliste fertig.");
}

void listDir(fs::FS &fs, const char *dirname, int depth) {
  File root = fs.open(dirname);
  if (!root || !root.isDirectory()) {
    Serial.printf("oeffne %s FEHLGESCHLAGEN\n", dirname);
    return;
  }
  File file = root.openNextFile();
  while (file) {
    if (file.isDirectory()) {
      Serial.printf("  DIR  %s\n", file.name());
      if (depth < 2) listDir(fs, file.name(), depth + 1);
    } else {
      Serial.printf("  %8u B  %s\n", (unsigned)file.size(), file.name());
    }
    file = root.openNextFile();
  }
  root.close();
}

void loop() {
  static uint32_t last = 0;
  static bool on = false;
  if (millis() - last >= 1000) {             // 1-Hz-Herzschlag
    last = millis();
    on = !on;
    px.setPixelColor(0, on ? px.Color(0, 25, 0) : px.Color(0, 0, 0));
    px.show();
  }
  delay(5);
}