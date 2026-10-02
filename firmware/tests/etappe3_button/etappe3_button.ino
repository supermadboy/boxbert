// Boxbert — Etappe 3: „Button drückt, Sound kommt raus"
// Fahrplan: docs/breadboard-testing.md, Etappe 3
// Button 1: Terminal A → IO5 (D5), Terminal B → GND, INPUT_PULLUP.
//   (IO5 ist bewusst gewählt: Deep-Sleep-Wake-GPIO für später.)
// SD: CS=IO10, SCK=IO36, MOSI=IO35, MISO=IO37, VCC=USB-5V
// I2S: DOUT=IO16, BCLK=IO17, LRC=IO18 (MAX98357A-Klon, SD an 3V3)
//
// Ablauf: Boot → Arcade-Loop (Volume 6) → Button-Druck spielt subbasesoft.mp3.
// Kindersicherheit: Volume klein; Pups kurz (2,9 s).

#include "Arduino.h"
#include "Audio.h"
#include "SPI.h"
#include "SD.h"
#include "FS.h"
#include <Adafruit_NeoPixel.h>

#define BUTTON_PIN   5     // IO5 / D5, andere Seite GND, INPUT_PULLUP
#define SD_CS   10
#define SPI_SCK 36
#define SPI_MISO 37
#define SPI_MOSI 35

#define I2S_DOUT 16
#define I2S_BCLK 17
#define I2S_LRC  18

#define LED_PIN    33
#define LED_PWR    21
Adafruit_NeoPixel px(1, LED_PIN, NEO_GRB + NEO_KHZ800);

Audio audio;

const char *STARTTRACK = "/arcade-music-loop.mp3";
const char *BUTTONTRACK = "/subbasesoft.mp3";

void my_audio_info(Audio::msg_t m) {
    Serial.printf("[audio] %s: %s\n", m.s, m.msg);
}

void setup() {
    px.begin();
    px.setBrightness(20);
    px.setPixelColor(0, px.Color(0, 0, 80));   // blau = bootet
    px.show();

    Audio::audio_info_callback = my_audio_info;

    pinMode(SD_CS, OUTPUT);
    digitalWrite(SD_CS, HIGH);
    pinMode(BUTTON_PIN, INPUT_PULLUP);         // IO5: LOW = gedrückt
    SPI.begin(SPI_SCK, SPI_MISO, SPI_MOSI);
    SPI.setFrequency(1000000);

    Serial.begin(115200);
    unsigned long t0 = millis();
    while (!Serial && millis() - t0 < 2000) {}

    Serial.println("Etappe 3: Button IO5 -> subbasesoft.mp3 (Boot: Arcade-Loop)");

    if (!SD.begin(SD_CS)) {
        Serial.println("SD begin FEHLGESCHLAGEN");
        px.setPixelColor(0, px.Color(80, 0, 0));
        px.show();
        while (true) delay(1000);
    }

    audio.setPinout(I2S_BCLK, I2S_LRC, I2S_DOUT);
    audio.setVolume(12);                       // Hoertest-Erhoehung (6 -> 12)

    if (!audio.connecttoFS(SD, STARTTRACK)) {
        Serial.printf("connecttoFS(%s) FEHLGESCHLAGEN\n", STARTTRACK);
        px.setPixelColor(0, px.Color(80, 0, 0));
        px.show();
        while (true) delay(1000);
    }

    px.setPixelColor(0, px.Color(0, 80, 0));   // grün = läuft
    px.show();
    Serial.println("Boot-Sound: arcade-music-loop.mp3 — wartet auf IO5 ...");
}

void loop() {
    audio.loop();

    // Button-Handling: fallende Flanke mit einfachem Entprellen (20 ms)
    static bool lastState = HIGH;              // INPUT_PULLUP: HIGH = offen
    static uint32_t lastChange = 0;
    bool pressed = (digitalRead(BUTTON_PIN) == LOW);
    if (pressed != (lastState == LOW)) {
        lastState = pressed;
        if (pressed && millis() - lastChange > 20) {
            Serial.println("Button IO5 — spiele subbasesoft.mp3");
            audio.connecttoFS(SD, BUTTONTRACK);   // bricht aktuellen Track ab
            px.setPixelColor(0, px.Color(0, 40, 0));
            px.show();
        }
        lastChange = millis();
    }
}