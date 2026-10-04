# Historische Pinplanung — NICHT als Verkabelungsanleitung verwenden

Archivkopie vom 04.10.2026 vor Etappe-4-Abschluss. Enthaelt verworfene
SPI-/HSU-Plaene und ueberholte Status-/Testannahmen. HSU nie ohne passende
Pegelwandlung anschliessen (4,1 V am TXD/SDA gemessen). Verbindlich ist
allein `hardware/pinout.md`: PN532 I2C IO3/IO4, SD SPI IO36/35/37, CS IO10.

## Urspruengliche Pinbelegung — Adafruit ESP32-S3 Reverse TFT Feather (ADA5691)

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

## Etappe 4 — Plan B: separater SPI-Bus für PN532 — **VERWORFEN (04.10.2026, Abend)**

**Nicht mehr nötig: PN532 läuft über I2C (IO3/IO4), Tag-Lesen bestätigt**
(siehe Plan D unten und `docs/testprotokoll-etappe4.md`). Der folgende
Abschnitt bleibt nur aus Doku-Gründen stehen.

**Tipp vom 03.10.2026, nicht umgesetzt.** SD-MISO verbunden:
NFC `Invalid ACK`, trotz SD-zuerst-Init. SD-MISO getrennt: UID mehrfach
lesbar. Deshalb den PN532 elektrisch vollständig vom SD-SPI trennen.

| PN532 | Neuer Feather-Anschluss | Bisher |
|---|---|---|
| SCK | IO15 / A3 | IO36 / SCK |
| MOSI | IO14 / A4 | IO35 / MOSI |
| MISO | IO38 / RX | IO37 / MISO |
| SS | IO9 / D9, Pull-up bleibt | unverändert |
| VCC / GND | 3V3 / GND | unverändert |

SD und Audio bleiben unverändert. **USB abziehen, Akku ablassen, erst
stromlos die drei NFC-Leitungen umstecken.** DIP bleibt 1=OFF, 2=ON.
NFC darf dann nicht zusätzlich mit den alten SPI-Leitungen verbunden sein.
Erst mit passendem Sketch funktioniert die neue Verdrahtung.

Software-Plan: SD bleibt auf globalem `SPI` (=FSPI), PN532 erhält einen
separaten `SPIClass(HSPI)`, explizit `begin(15, 38, 14)` (SCK, MISO, MOSI).
Bewährte 100 kHz/LSBFIRST/MODE0 und Workaround für leere Antworten behalten.
**Ziel bleibt Musik von SD + Tag-UID + Pups**, nicht nur Chip-Erkennung.

Pins am 03.10.2026 gegen die lokale Board-Definition im ESP32-Core 3.3.12
geprüft: `variants/adafruit_feather_esp32s3_reversetft/pins_arduino.h`
(A3=15, A4=14, RX=38). Zweiten Controller gegen `esp32-hal-spi.h` und
`libraries/SPI/src/SPI.cpp` geprüft: S3 globaler SPI=FSPI, HSPI separater Bus.

**Planungskonflikt:** IO14/15 waren für Encoder A/B reserviert. Im aktuellen
Etappe-4-Aufbau nicht benötigt; bei erfolgreichem NFC-Test muss die spätere
Encoder-Belegung neu entschieden werden. Noch keine endgültige Pinbelegung!
Testbelege: `docs/testprotokoll-etappe4.md`.

## Etappe 4 — Plan C: PN532 über HSU statt SPI — **VERWORFEN (04.10.2026, Abend)**

**Nicht mehr nötig: PN532 läuft über I2C (siehe Plan D).** HSU bleibt
dauerhaft gesperrt: 4,1 V am TXD/SDA (Modulausgang, 5V-TTL-Level-Shifter)
sind ohne Pegelwandler nicht Feather-kompatibel, und I2C macht denselben
Job ohne Zusatzteile.

**Plan C, auf Nutzerwunsch.** Grund: geteilter MISO bleibt elektrisch
gestört (21:40). HSU umgeht den SPI-Bus komplett; SD bekommt den Bus allein.

**Teststatus 04.10.2026, 13:05:** PN532_HSU auf Serial1 (RX=IO38,
TX=IO39) antwortet weiterhin nicht (`Ack: Timeout`). RX/TX-Loopback am Feather
ist bestanden; VCC am Modul 3,27 V. Nutzer maß **4,1 V am TXD/SDA, isoliert
vom Feather**. Elechouse-Unterlagen spezifizieren HSU/I2C als 5V TTL und SPI
als 3,3V TTL. Daher HSU-TXD nicht direkt an Feather RX/IO38 anschließen.
Plan C ist bis Pegelwandlung gestoppt; Option ohne Zusatzteile ist Plan B:
PN532 auf eigenem 3,3V-SPI-Bus (Encoder-Konflikt IO14/15 beachten). Details
und Quellen: `docs/testprotokoll-etappe4.md`, `docs/findings.md`.

Quellen: Elechouse-Handbuch V3 (PDF in `docs/datenblaetter/PN532-MOD.pdf`:
HSU-TXD ist mit Host-RX, RXD mit Host-TX zu verbinden; I2C- und HSU-Labels
stehen auf Vorder-/Rückseite). Gegenprüfung: [Tasmota PN532-HSU-Verdrahtung](https://github.com/arendst/Tasmota/issues/5497)
(`SCL/RXD`, `SDA/TXD`) und [Raspberry-Pi-Wiring](https://raspberrypi.stackexchange.com/questions/82220/connecting-elechouse-pn532-v3-to-raspberry-pi-5v-or-3-3v)
(`SDA/TxD`, `SCL/RxD`). HSU = DIP OFF/OFF (I2C = ON/OFF, SPI = OFF/ON).
Rückseiten-Beschriftung am konkreten Modul gegenprüfen.

| PN532 | Feather | Hinweis |
|---|---|---|
| SDA (= TXD) | IO38 / RX | Modulausgang → Feather-Eingang |
| SCL (= RXD) | IO39 / TX | Moduleingang ← Feather-Ausgang |
| VCC | 3V3 | unverändert |
| GND | GND | unverändert |
| IRQ | offen | wird nicht benötigt |

- **DIP: BEIDE Schalter OFF** (HSU). Silkscreen-Tabelle zeigt nur I2C/SPI.
- ⚠️ **UART-Pegel:** Elechouse V3-Unterlagen spezifizieren HSU/I2C als
  5V TTL, SPI als 3,3V TTL. Am realen Modul wurden bei VCC=3,27 V isoliert
  **4,1 V an TXD/SDA** gemessen. ESP32-GPIOs sind nicht 5V-tolerant: TXD/SDA
  nicht direkt an Feather RX/IO38 anschließen. HSU nur mit Pegelwandler;
  alternativ den getrennten 3,3V-SPI-Plan B nutzen. Details/Quelle:
  `docs/testprotokoll-etappe4.md`.
- **Alle SPI-Leitungen vom PN532 lösen** (SCK 36, MOSI 35, MISO 37, SS 9);
  SS-Pull-up an IO9 kann entfallen. SD wieder **voll** verdrahten inkl. MISO 37.
- Stromlos umstecken (USB ab, Board ablassen).
- ⚠️ **Konflikt IO39:** war für Boost-EN (TPS61023) reserviert. Solange der
  Boost nicht am Breadboard hängt, unkritisch; für den finalen Aufbau muss
  Boost-EN auf einen anderen Pin umziehen (Kandidat IO13). Offene Frage.
- Plan B (eigener SPI-Bus IO15/14/38) damit **verworfen** — Encoder-Konflikt
  IO14/15 entfällt damit auch.
- Software: `PN532_HSU`-Transport der installierten PN532-Lib (ESP32-
  Konstruktor mit RX/TX-Pin), `nfc.begin()` macht Serial1 115200 8N1 +
  Wakeup. **Kreuzung:** PN532 SDA/TXD → Feather RX/IO38; PN532 SCL/RXD →
  Feather TX/IO39. Workaround für leere Antworten wie in
  `etappe4_nfc_direct.ino`.

## Etappe 4 — Plan D: PN532 über I2C — **AKTUELLER STAND (04.10.2026, Abend)**

PN532 am Feather-Standard-I2C-Bus, ohne Pegelwandler. Vor dem Anschluss
Pegel gemessen: **SDA 3,3 V, SCL 3,3 V** (DIP auf I2C = 1 ON / 2 OFF) —
anderer Befund als die 4,1 V am gemeinsamen Pad im HSU-Kontext.

| PN532 | Feather | Hinweis |
|---|---|---|
| SDA | IO3 / SDA | auch STEMMA-QT-Buchse |
| SCL | IO4 / SCL | |
| VCC | 3V3 | |
| GND | GND | |
| IRQ | offen | wird nicht benötigt |

- DIP: **1 ON / 2 OFF** (I2C).
- I2C-Adresse **0x24**; onboard MAX17048 (Fuel Gauge) liegt auf 0x36,
  kein Konflikt. Später kommt AW9523 (0x58) dazu — ebenfalls kein Konflikt.
- Chip-Antwort bestätigt (PN532, FW v1.6); Nutzer meldet: Tag-Lesen
  funktioniert.
- Konsequenz: SD hat SPI (IO36/35/37, CS IO10) **allein**; MISO-Bussharing-
  Problem obsolet, SD darf volle Geschwindigkeit. IO9 und IO38 frei.
- Offen vor Etappe-4-Abschluss: Stresstest (50–100 Lesezyklen bei laufender
  Musik, Clock-Stretching-Timeouts zählen), Tag-Typ prüfen (NTAG215 =
  7-Byte-UID, SAK 0x04 — die UID vom 03.10. war 4 Byte/SAK 0x08),
  kombinierter Sketch NFC + SD + Audio. Details:
  `docs/testprotokoll-etappe4.md`.

## Regeln

- **Deep-Sleep-Wake** geht nur über RTC-GPIOs **0–21**. Wake-Buttons daher
  auf IO5/6/11 (oder A-Pins), nie über den AW9523.
- **SPI ist ein Bus** — im ursprünglichen Plan teilen SD und PN532
  SCK/MOSI/MISO, jedes Gerät hat seinen eigenen CS. Bei Plan B oben
  werden auch SCK/MOSI/MISO getrennt; nicht beide Pläne vermischen.
- **IO7 nicht anfassen.** Wird vom Core auf HIGH gesetzt; LOW schaltet
  Display und I2C ab (später evtl. bewusst im Deep Sleep).
