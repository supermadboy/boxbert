# Pinbelegung — Adafruit ESP32-S3 Reverse TFT Feather (ADA5691)

Stand: 27.09.2026. **Verbindliche Quelle für alle Pin-Vorschläge** in
`docs/`, Firmware (`firmware/Config.h`) und Chats. Wer einen Pin vorschlägt,
nimmt ihn von hier oder prüft ihn vorher wie unten beschrieben.

## Warum es diese Datei gibt

Der erste Breadboard-Plan (27.09.2026) war aus dem Gedächtnis geschrieben und
hatte sechs falsche Pins: I2C auf IO42/41 (sind TFT_CS/TFT_RST), SPI auf
IO5/6/7 (Hardware-SPI ist 36/35/37, IO7 schaltet Display- und I2C-Strom),
Buttons auf IO1/2/3 (Onboard-Taster bzw. SDA), Encoder auf IO45/46 (Backlight
bzw. nicht herausgeführt), Boost-Enable auf IO33 (Onboard-NeoPixel). Beim
Review gefunden, siehe Commit-Historie.

## Wie man Pins prüft (so wurde es gefunden)

Die Board-Definition aus dem Arduino-Core ist die Wahrheit, nicht allgemeines
ESP32-S3-Wissen und nicht Pinouts anderer Feather-Boards:

```bash
curl -s https://raw.githubusercontent.com/espressif/arduino-esp32/master/variants/adafruit_feather_esp32s3_reversetft/pins_arduino.h
curl -s https://raw.githubusercontent.com/espressif/arduino-esp32/master/variants/adafruit_feather_esp32s3_reversetft/variant.cpp
```

`pins_arduino.h` zeigt, was für SDA/SCL/SPI/TFT/LED/NeoPixel reserviert ist;
`variant.cpp` zeigt, dass IO7 (TFT_I2C_POWER) und IO21 (NEOPIXEL_POWER) beim
Start automatisch auf HIGH gesetzt werden — nicht selbst ansteuern.
Die Header-Belegung (welche GPIOs überhaupt herausgeführt sind) steht im
Adafruit-Learn-Guide „ESP32-S3 Reverse TFT Feather → Pinouts".

## Vom Board belegt — nicht verwenden

| GPIO | Belegt durch |
|---|---|
| 0, 1, 2 | Onboard-Taster D0 (BOOT) / D1 / D2 |
| 7 | TFT_I2C_POWER (Strom für Display + STEMMA/I2C) |
| 13 | rote Onboard-LED (als Ausgang nutzbar, leuchtet dann mit) |
| 21 | NeoPixel-Power |
| 33 | Onboard-NeoPixel |
| 40, 41, 42 | TFT DC / RST / CS |
| 45 | TFT-Backlight |
| 46 u. a. | nicht auf den Header geführt |

## Herausgeführte, nutzbare Pins

A0=18, A1=17, A2=16, A3=15, A4=14, A5=8 · SCK=36, MOSI=35, MISO=37 ·
SDA=3, SCL=4 · RX=38, TX=39 · D5, D6, D9, D10, D11, D12, (D13 mit LED)

## Belegung (Vorschlag, im Breadboard-Test bestätigen)

| Funktion | Pin | Hinweis |
|---|---|---|
| I2S DIN (MAX98357A) | IO16 (A2) | |
| I2S BCLK | IO17 (A1) | |
| I2S LRC | IO18 (A0) | |
| SPI SCK (SD + PN532 geteilt) | IO36 | Hardware-SPI |
| SPI MOSI | IO35 | |
| SPI MISO | IO37 | |
| SD CS | IO10 | |
| PN532 SS | IO9 | |
| I2C SDA (AW9523) | IO3 | auch STEMMA-QT-Buchse |
| I2C SCL | IO4 | |
| Button 1–3 (direkt, Wake-fähig) | IO5, IO6, IO11 | INPUT_PULLUP, andere Seite GND |
| Encoder A / B | IO15 (A3), IO14 (A4) | |
| Encoder-Taster | IO12 | |
| NeoPixel-Stick DIN | IO8 (A5) | 330 Ω in Reihe |
| Boost EN (TPS61023) | IO39 (TX) | |
| frei | IO13, IO38 | weitere Buttons über AW9523 (16 Kanäle) |

## Regeln

- **Deep-Sleep-Wake** geht nur über RTC-GPIOs **0–21**. Wake-Buttons daher
  auf IO5/6/11 (oder A-Pins), nie über den AW9523.
- **SPI ist ein Bus** — SD und PN532 teilen SCK/MOSI/MISO, jedes Gerät hat
  nur seinen eigenen CS.
- **IO7 nicht anfassen.** Wird vom Core auf HIGH gesetzt; LOW schaltet
  Display und I2C ab (später evtl. bewusst im Deep Sleep).
