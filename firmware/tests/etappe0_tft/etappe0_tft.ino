// Boxbert — Etappe 0, Teil 2: TFT-Test (Adafruit ESP32-S3 Reverse TFT Feather)
// Fahrplan: docs/breadboard-testing.md, Etappe 0
// Pins aus der Board-Variante pins_arduino.h (nicht geraten!):
//   TFT_CS=42, TFT_DC=40, TFT_RST=41, TFT_BACKLITE=45, TFT_I2C_POWER=7 (vom Core HIGH gesetzt)
// Erwartung: Display zeigt Boot-Text + WiFi-Scan-Ergebnis, Serial zeigt dasselbe.

#include <SPI.h>
#include <Adafruit_GFX.h>
#include <Adafruit_ST7789.h>
#include <WiFi.h>

#define TFT_CS        42
#define TFT_DC        40
#define TFT_RST       41
#define TFT_BACKLITE  45

Adafruit_ST7789 tft = Adafruit_ST7789(TFT_CS, TFT_DC, TFT_RST);

void setup() {
  // Backlight explizit an (45 = TFT_BACKLITE)
  pinMode(TFT_BACKLITE, OUTPUT);
  digitalWrite(TFT_BACKLITE, HIGH);

  Serial.begin(115200);
  // Nicht ewig auf Serial warten — Display soll auch ohne Monitor booten
  unsigned long t0 = millis();
  while (!Serial && millis() - t0 < 2000) {}

  tft.init(240, 135);          // ST7789, 240x135
  tft.setRotation(1);          // Landscape; falls spiegelverkehrt -> 3
  tft.fillScreen(ST77XX_BLACK);
  tft.setTextColor(ST77XX_GREEN);
  tft.setTextSize(2);
  tft.setCursor(0, 0);
  tft.println("Boxbert");
  tft.setTextSize(1);
  tft.setTextColor(ST77XX_WHITE);
  tft.println("Etappe 0: TFT ok!");
  tft.println();

  Serial.println("Boxbert Etappe 0: TFT-Test");

  // WLAN-Scan als zweiter Nachweis (Teil 1 war der gleiche Scan via WiFiScan-Beispiel)
  tft.println("Scanne WLAN ...");
  WiFi.mode(WIFI_STA);
  int n = WiFi.scanNetworks();

  tft.printf("WLAN-Netze: %d\n\n", n);
  Serial.printf("WLAN-Netze gefunden: %d\n", n);
  for (int i = 0; i < n && i < 6; i++) {
    String s = String(i + 1) + ": " + WiFi.SSID(i) + " (" + WiFi.RSSI(i) + " dBm)";
    tft.println(s);
    Serial.println(s);
  }
  tft.println("\nEtappe 0 BESTANDEN");
}

void loop() {
  // Lebenszeichen: Sekundenzaehler unten, farbwechselnder Balken
  static uint32_t last = 0;
  static uint8_t hue = 0;
  if (millis() - last >= 1000) {
    last = millis();
    tft.fillRect(0, 125, 240, 10, ST77XX_BLACK);
    tft.setCursor(0, 125);
    tft.printf("uptime: %lus", millis() / 1000);
  }
  delay(5);
}
