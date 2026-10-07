# Aktive Breadboard-Referenzen

Stand: **04.10.2026, Etappen 0–5 als Breadboard-Meilensteine bestanden.** Kein Produktfirmware-
Sammelsketch: jede Referenz hat einen begrenzten Testumfang.

| Sketch | Zweck / Status |
|---|---|
| etappe0_tft | Board/TFT/WLAN-Scan, Etappe 0 |
| etappe1_audio_led | I2S-/Testtonreferenz, Etappe 1 |
| etappe2_sd | SD-/Musikreferenz, Etappe 2 |
| etappe2_play | damalige SD-Wiedergabereferenz |
| etappe3_button | Button an IO5, Etappe 3 |
| etappe4_nfc_i2c | unveraenderte PN532-I2C-UID-Einzelreferenz, beide Tags neu reproduziert |
| etappe4_nfc_switch | bestaetigter Timeout-0-Wechselpfad, NFC-only |
| etappe4_tag_player | Etappe-4-Referenz, optimierter Hoertest bestaetigt; seit Etappe-5-Flash nicht mehr auf Board |
| etappe5_web_upload | Breadboard-Abnahme bestanden: WLAN-Station, Handy-Webseite, Dateiliste, Upload, NVS-Zuordnung der zwei bekannten Tags samt RESET-Test; Haertung offen, siehe `docs/testprotokoll-etappe5.md` |
| akku_fuel_gauge | **aktuell geflasht (07.10.2026)**: liest onboard MAX17048 (Spannung/SoC/Laderate) am Serial-Monitor; kein NFC/SD/Audio. Werte nicht gesichert, nur Nutzerbestätigung — `docs/testprotokoll-akku.md` |

## Etappe 4 — gueltiger Stand

PN532 I2C IO3/IO4, VCC 3V3, DIP 1 ON / 2 OFF, 100 kHz; SD SPI
IO36/35/37, CS IO10, VCC USB-5V, im Player 4 MHz; MAX98357A I2S
DIN IO16/BCLK IO17/LRC IO18, VIN USB-5V, SD 3V3, GAIN offen.
Alle Pins aus `hardware/pinout.md`. **Nur USB, Akku ab; vor Umstecken
USB trennen.** HSU-TXD/SDA hatte 4,1 V: nicht direkt an Feather-GPIO.

Der Einzeltest bleibt unveraendert; fuer Wechsel/Integration den
bestaetigten Timeout-0-Pfad verwenden. Im Player blockiert er nur die
NFC-Task, Events gehen per Queue an den Audio-Hauptloop. Erfolgspause
200 ms, Volume 6/21. Gleiche UID ohne zwischenzeitlich andere UID
startet nicht erneut. Kein Tag-Schreiben/Boot-Lied/Fallback/WLAN.

Abnahme ist ein Breadboard-Meilenstein, nicht 20-Wechsel-/Minutenlast-
oder Produktnachweis. Spaetere Haertung in `To-Do.md`; genaue Chronologie,
Messwerte, Nutzerbestaetigungen in `docs/testprotokoll-etappe4.md`.
Host-Test unter `firmware/host-tests/tag_map_test.cpp`.

## Toolchain / Build

arduino-cli 1.5.1, esp32-Core 3.3.12, Adafruit PN532 1.3.4,
BusIO 1.17.4, ESP32-audioI2S 4.0.0. SPI/SD/Wire aus dem Core.
FQBN `esp32:esp32:adafruit_feather_esp32s3_reversetft`, Board-Defaults
mit QSPI-PSRAM, **kein PSRAM=opi**. Reproduzierbarer Compile-/Upload-
Befehl in `docs/dev-setup.md`; nach Compile-Fehler nie altes Binary flashen.

## Historie statt aktiver Diagnosen

- `firmware/archive/etappe4_diagnostics/`: alte SPI-/HSU-/Inventory-
  Experimente als .ino.txt, Status in dortigem README.
- `firmware/archive/etappe4_tag_music/`: verworfener kombinierter Sketch,
  keine Vorlage fuer neue Firmware.
- `firmware/archive/etappe4_tag_player_v1/`: erfolgreicher v1 vor
  Optimierung sowie die beiden Timing-Vergleichsstaende.
- `docs/archive/pinout-etappe4-legacy.md`: verworfene Pinplaene,
  **keine aktuelle Verkabelungsanleitung**.
