# Pinbelegung — Adafruit ESP32-S3 Reverse TFT Feather (ADA5691)

Stand Anschlussplanung: **06.11.2026**. Breadboard-Nachweise separat.
Nutzerentscheidung: Normale Buttons und zweiter Kippschalter am AW9523;
zwei Wake-Buttons und Encoder bleiben direkt am Feather. IO38/IO39 frei,
IO13 frei mit Onboard-LED. Encoder A/B/Taster verwenden interne Pull-ups.
Zwölf externe 10-kΩ-Pull-ups am AW; 24 funktionale Adern zum Deckel.
Verteilung und Aderbudget: `hardware/verkabelung-endaufbau.md`, Abschnitt
„Verbindliche Änderung: Deckel-Eingänge und Kabel (28.10.2026)“.
Verbindliche Quelle fuer Pin-Vorschlaege in Doku, Firmware und Chats.
Getestete Verbindungen und noch nicht aufgebaute Erweiterungen sind unten
getrennt. Endgueltige Firmware-Belegung spaeter in `firmware/Config.h`.

## Gemessener Endaufbau — Eingänge (11.11.2026)

**Für die folgenden Kontakte ersetzt die reale Zuordnung die älteren
Anschlussplanungen.** Diagnose einzeln betätigt und mit Nutzerpositionen
abgeglichen; keine endgültige Funktions-/UI-ID-Zuweisung. Gesamtfirmware
`firmware/Config.h` und Gesamtfirmware inzwischen daran angepasst;
Gerätenachweis für Gesamtfirmware separat, nicht aus Diagnose ableiten.
Nachweis: `docs/testprotokoll-endaufbau-inputs.md`, Rohlog dort verlinkt.
Positionen wie vom Nutzer beim Test bezeichnet.

| Kontakt | Tatsächlicher Eingang |
|---|---|
| 30 mm Rot unten links | AW P07 |
| 30 mm Gelb über Rot | AW P14 |
| 30 mm Weiß rechts neben Rot | AW P10 |
| 30 mm Grün über Weiß | AW P06 |
| 24 mm Rot unten links | AW P12 |
| 24 mm Blau über Rot | AW P05 |
| 24 mm Gelb rechts neben Rot | AW P00 |
| 24 mm Grün über Gelb | AW P11 |
| 44 mm Rot unten rechts | AW P13 |
| 44 mm Blau über Rot | Feather IO6 |
| Mini Grün rechts neben Mini Gelb | AW P17 |
| Mini Rot rechts neben Mini Grün | AW P15 |
| Mini Gelb ganz links | offen, kein Wechsel erkannt |
| Encoder-Taster | Feather IO5 |
| Encoder-Drehleitungen | Feather IO15/IO14, gegenläufige Phasenfolgen beobachtet |
| Zusätzlicher Kippschalter | Feather IO11 |

### Logische Button-IDs der Gesamtfirmware

Die IDs folgen der vorhandenen schematischen App-Ansicht: bei30/24 mm
oben links/rechts, dann unten links/rechts; bei44 mm oben, dann unten.
Keine Änderung gespeicherter Medienbelegungen anhand von Farben.

| ID | Physischer Kontakt | Eingang |
|---|---|---|
| 1 | 30 mm Gelb oben links | AW P14 |
| 2 | 30 mm Grün oben rechts | AW P06 |
| 3 | 30 mm Rot unten links | AW P07 |
| 4 | 30 mm Weiß unten rechts | AW P10 |
| 5 | 24 mm Blau oben links | AW P05 |
| 6 | 24 mm Grün oben rechts | AW P11 |
| 7 | 24 mm Rot unten links | AW P12 |
| 8 | 24 mm Gelb unten rechts | AW P00 |
| 9 | 44 mm Blau oben | IO6 |
| 10 | 44 mm Rot unten | AW P13 |

AW-Adresse 0x58. IO11 im aktuellen Schalterzustand LOW. IO5/IO6 bleiben
RTC-fähige Kontakte, sind real aber Encoder-Taster/großer blauer Button,
nicht zwei 30-mm-Buttons. Boost-EN, SD und Audio hier **nicht** verifiziert;
deren geplante Pins unten bleiben nur Anschlussplanung. Gelben Mini-Taster
nicht stillschweigend einem verbleibenden Anschluss zuweisen.

### SD-Gerätenachweis 11.11.2026

SD-Lesetest mit **CS IO8, SCK IO36, MOSI IO35, MISO IO37 bei400 kHz**
erfolgreich: Karte29818 MiB, Root lesbar, acht Datei-Anfänge ohne Lesefehler.
SD-VCC laut Nutzer5 V. Vorherige Versuche mit4 MHz/400 kHz scheiterten;
Nutzer bestätigt anschließend vier am SD-Modul falsch herum gesteckte
Signalkabel und deren Korrektur. **Anschließender4-MHz-Vergleich ebenfalls
erfolgreich**, gleiche Kapazität/acht Datei-Anfänge ohne Lesefehler.
Kein Vollkarten-/Schreib-/Dauer- oder Railführungsnachweis.
Details: `docs/testprotokoll-endaufbau-inputs.md`.

## PN532 am Endaufbau — Anschluss/Init11.11.2026

Nutzer bestätigt nun: **VCC3V3/GND, SDAIO3/SCLIO4, DIP1ON/2OFF,
IRQ anIO12**. Isolierte Initialisierungsprobe mit AdafruitPN5321.3.4:
Wire/begin/SAM erfolgreich, Version0x32010607 (PN532/Firmware1.6),
IRQ12HIGH im Ruhezustand. Anschließend UID **E3:2F:F6:33** gelesen und
GPIO12-Observer während Suche/Auslesen: **2LOW-/2HIGH-Flanken**. Karte war laut
Nutzer die ganze Zeit aufgelegt; kein Neuauflage-/Wechsel-/Wake-Nachweis.
Ein HIGH-Snapshot nach der intern I2C-pollenden API ist kein IRQ-Defektbeweis.
UID-/Flankenlog: `docs/serial/2026-11-11-nfc-uid-irq-edges.log`.
Resetleitung nicht zusätzlich bestätigt; Probe verwendet keinen Reset-GPIO.
Log: `docs/serial/2026-11-11-nfc-init-probe.log`.
Damals Gesamtfirmware mit NFC aus wiederhergestellt. **Seit13.11. neue NFC-
Laufzeit aktiv**, kurze Transfers ohne Tagwarten unter Mutex; Tag1→Arcade-
Decoder→EOF im Gesamtstand geloggt; Nutzer bestätigt Ton/TFT dieses Starts.
Weitere Bedienungs-/Dauerprüfung offen. Neuester Nachweis:
`docs/testprotokoll-nfc-integration-2026-11-13.md`.
Gemeinsamer I2C-Bus mit AW9523/Gauge verlangt kurze synchronisierte Transfers;
kein Timeout0-Tagwarten unter dem gemeinsamen Wire-Mutex.
Details: `docs/uebergabe-endaufbau-2026-11-11.md`.

## Historischer Encoder-/IRQ-Tausch (06.11.2026)

Die Encoderplanung IO11 unten wurde durch die Messung11.11. überholt:
**real Encoder-Taster IO5, zusätzlicher Kippschalter IO11; IRQ12 jetzt angeschlossen.**

Nutzerfreigabe: **Encoder-Taster → IO11**, **PN532-IRQ reserviert → IO12**.
`firmware/Config.h` angepasst; noch nicht geflasht oder am Gerät getestet.
Encoder A/B bleiben IO15/IO14, Boost-EN bleibt IO9 (nicht frei).

## Verbindlicher Pin-Tausch (30.10.2026)

Für direkte SD-Kabelführung neben SCK/MO/MI: **SD CS → A5/IO8**,
**NeoPixel DIN → 10/IO10 über 330 Ω am Stickende**. Nutzerfreigabe liegt vor;
`firmware/Config.h` angepasst. Noch nicht geflasht oder am Gerät getestet.
Diese Zuordnung ersetzt ältere Anschlussplanungen unten. Die Breadboard-Tabelle
bleibt historischer Nachweis mit SD-CS IO10; unveränderte Referenzsketche
benötigen weiterhin die alte Verkabelung.

## Warum es diese Datei gibt

Der erste Breadboard-Plan (27.09.2026) hatte sechs falsche Pins: I2C auf
IO42/41 (TFT_CS/TFT_RST), SPI auf IO5/6/7 (Hardware-SPI 36/35/37; IO7
schaltet Display-/I2C-Strom), Buttons auf IO1/2/3 (Board-Taster/SDA),
Encoder auf IO45/46 (Backlight/nicht herausgefuehrt), Boost-EN auf IO33
(Onboard-NeoPixel). Neue Pins deshalb nie aus allgemeinem ESP32-Wissen.

## Wie man Pins prueft

Board-Definition der Variante `adafruit_feather_esp32s3_reversetft`:

```bash
curl -s https://raw.githubusercontent.com/espressif/arduino-esp32/master/variants/adafruit_feather_esp32s3_reversetft/pins_arduino.h
curl -s https://raw.githubusercontent.com/espressif/arduino-esp32/master/variants/adafruit_feather_esp32s3_reversetft/variant.cpp
```

Fuer Reproduktion der Tests auch die lokale Core-3.3.12-Definition
heranziehen: `~/.arduino15/packages/esp32/hardware/esp32/3.3.12/variants/adafruit_feather_esp32s3_reversetft/`.
`variant.cpp` setzt IO7 (TFT_I2C_POWER) und IO21 (NEOPIXEL_POWER) beim
Start HIGH. Header-Belegung: Adafruit-Learn-Guide „ESP32-S3 Reverse TFT
Feather → Pinouts“. Die Aufraeumarbeiten fuegen keine neuen Pins hinzu.

## Vom Board belegt — nicht frei zuweisen

| GPIO | Belegt durch |
|---|---|
| 0, 1, 2 | Onboard-Taster D0 (BOOT) / D1 / D2 |
| 7 | TFT_I2C_POWER (Display + STEMMA/I2C) |
| 13 | rote Onboard-LED; Ausgang moeglich, LED leuchtet mit |
| 21 | NeoPixel-Power |
| 33 | Onboard-NeoPixel |
| 40, 41, 42 | TFT DC / RST / CS |
| 45 | TFT-Backlight |
| 46 u. a. | nicht auf den Header gefuehrt |

Herausgefuehrt: A0=18, A1=17, A2=16, A3=15, A4=14, A5=8;
SCK=36, MOSI=35, MISO=37; SDA=3, SCL=4; RX=38, TX=39;
D5, D6, D9, D10, D11, D12, D13 (mit LED).

## Bestaetigter Breadboard-Aufbau — Etappen 1–4

**Nur USB, Akku ab. Vor Umstecken USB trennen.** Jeden Anschluss nach
Modul-/Feather-Silkscreen verbinden, nicht nach Position der Stiftleiste.

| Funktion | Feather-Pin | Hinweis |
|---|---|---|
| MAX98357A DIN | IO16 (A2) | I2S-Daten |
| MAX98357A BCLK | IO17 (A1) | |
| MAX98357A LRC | IO18 (A0) | |
| MAX98357A VIN / GND | USB-5V / GND | SD an 3V3, GAIN offen; Speaker nur zwischen Amp-Ausgaengen |
| SD SCK | IO36 | SPI fuer SD; PN532 nicht angeschlossen |
| SD MOSI / MISO | IO35 / IO37 | |
| SD CS | IO10 | Player mit 4 MHz getestet |
| SD VCC / GND | USB-5V / GND | Modul hat 3,3-V-Regler |
| PN532 SDA | IO3 | I2C 100 kHz; auch STEMMA-QT |
| PN532 SCL | IO4 | |
| PN532 VCC / GND | 3V3 / GND | DIP **1 ON / 2 OFF** |
| PN532 SPI/UART/IRQ/Reset | nicht verbunden | kein SS auf IO9 erforderlich |
| Button (Etappe 3) | IO5 / GND | INPUT_PULLUP; im Etappe-4-Player keine Button-Funktion |

PN532-Adresse **0x24**, onboard MAX17048 **0x36**. Nutzerbericht vom
04.10.2026: I2C-Ruhepegel SDA/SCL 3,3 V; eigener neuer Chip-/UID-Test
und neuer NFC+SD+Audio-Player erfolgreich, Hoertest auch nach Optimierung
bestaetigt. Buspegel vor anderem Modul/anderer Versorgung neu pruefen.
Modulunterlagen nennen fuer HSU/I2C 5-V-TTL; der funktionierende konkrete
I2C-Aufbau ist keine allgemeine 3,3-V-Freigabe fuer beliebige PN532-Klone.
**HSU-TXD nie direkt an IO38:** isoliert 4,1 V bei VCC=3,27 V gemessen;
Feather-GPIOs sind nicht 5-V-tolerant. HSU ohne Pegelwandler gesperrt.

Aktueller Player: `firmware/tests/etappe4_tag_player/`, Timeout 0 in
NFC-Task, Pause 200 ms, Volume 6/21. UID-Zuordnung `hardware/nfc-tags.md`.
Messwerte/Abnahmeumfang: `docs/testprotokoll-etappe4.md`.

## Geplante Erweiterungen — noch im Breadboard bestaetigen

| Funktion | Pin | Hinweis |
|---|---|---|
| AW9523 SDA / SCL | IO3 / IO4 | Adresse 0x58; VIN 3V3, kein +5 V auf VIN; Wire-Zugriffe synchronisieren |
| Wake-Buttons | IO5, IO6 | INPUT_PULLUP, andere Seite GND; nur IO5 bisher getestet. **IO12 reserviert** für spätere PN532-IRQ-Erweiterung (Wake per Tag, „Hybrid" 07.10.2026; Pin-Tausch 06.11.2026) — nicht als Wake-Button belegen |
| Encoder A / B | IO15 (A3), IO14 (A4) | kein NFC-SPI-Konflikt mehr |
| Encoder-Taster | IO11 | INPUT_PULLUP; Pin-Tausch 06.11.2026, Gerätetest offen |
| NeoPixel-Stick DIN | IO10 (10) | 330 Ohm in Reihe; neuer Pin noch ungeprüft |
| Boost EN (TPS61023) | IO9 | **Decision 07.10.2026: IO9 statt IO39** — RTC-faehig, `rtc_gpio_hold_en` im Sleep; IO39 ist kein RTC-GPIO (`docs/power-plan.md` B1). |
| frei | IO38, IO39 (TX); IO13 mit LED | weitere Buttons ueber AW9523 |

## Regeln und Historie

- Deep-Sleep-Wake nur ueber RTC-GPIOs 0–21; Wake-Buttons nicht am AW9523.
- SPI ist ein Bus: weitere SPI-Geraete brauchen eigenen CS. Aktuell
  **PN532 per I2C**, SD auf SPI; alte SPI-/HSU-Plaene nicht mischen.
- IO7 nicht selbst umschalten: LOW schaltet TFT/STEMMA-QT-Rail ab,
  nicht den allgemeinen 3V3-Header. Aktueller PN532 dort bleibt versorgt.
  Feather-EN, Boost-EN und IO7 nicht gleichsetzen; Gezieltes Sleep-
  Power-Gating erst nach `docs/power-plan.md` planen/pruefen.
- Historische verworfene Pinplaene: `docs/archive/pinout-etappe4-legacy.md`;
  alte Diagnose-Sketches: `firmware/archive/etappe4_diagnostics/`.
- Keine pauschale Diagnose „Clock-Stretching defekt“ oder „Modul kaputt“:
  Ursachen der frueheren Fehlschlaege bleiben teilweise unbekannt.
