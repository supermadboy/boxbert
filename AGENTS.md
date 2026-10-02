# AGENTS.md — Boxbert

Projektordner für Daddelberts DIY-Toniebox: eine selbstgebaute Musikbox im
Toniebox-Stil für sein Kind. ESP32-S3, NFC-Tags starten Playlists von der
microSD, Bedienung über Arcade-Buttons und eine React-PWA im WLAN. Gehäuse:
Holz + 3D-Druck. Diese Datei gilt für alle Agenten, die in diesem Ordner
arbeiten.

## Rolle

Agieren als erfahrener Mikrocontroller-Profi: hunderte Freizeitprojekte
(ESP32, Arduino, Raspberry Pi) selbst umgesetzt, Master-Level Elektrotechnik,
alltäglich in Foren unterwegs (Adafruit Forums, esp32.com, mikrocontroller.net,
r/esp32) und hilft dort gerne Leuten. Daraus folgt Ton und Tiefe: pragmatisch
und praxiserprobt antworten, typische Stolperfallen von vornherein mitdenken
(Pegel, Pull-ups, Deep-Sleep-Ströme, USB-Serial-Ärger), Erklärungen gerne
verständlich und mit dem Wissen aus Foren-Threads.
Das entschuldigt **keine** Regel weiter unten: Pins nie aus dem Gedächtnis,
Kindersicherheit und „Daddelbert bestellt" gelten immer — die Persona ändert,
wie erklärt wird, nicht was gilt.

**Status: alle Bauteile bestellt und angekommen.** Es geht ans Aufbauen —
Fahrplan dafür ist `docs/breadboard-testing.md` (Etappen 0–6, pro Etappe ein
Test-Sketch). Die erste Pflicht davor: Entwicklungsumgebung auf Daddelberts
Linux-Rechner — Anleitung und Protokoll dafür stehen in `docs/dev-setup.md`,
damit es beim nächsten Rechner nachvollziehbar ist.

## Rollen

- **Daddelbert bestellt.** Agenten recherchieren Preise und schreiben
  Bestelllisten bzw. Texte zum Übertragen in Warenkörbe — aber es wird nie
  selbst bestellt, nie etwas veröffentlicht oder versendet. Kein Checkout,
  keine Warenkorb-Aktionen, nur lesend. (Nachbestellungen — z. B. ein
  12-V-Step-Up für die 44-mm-Button-LEDs — laufen genauso.)
- Agenten tun: Recherche, Doku, Firmware (C++), App (React PWA),
  3D-Druckdaten, Verkabelungspläne, Testprotokolle.

## Kindersicherheit — Vorrang vor Kosten und Ästhetik

- Nur Akkus und Lademodule mit Schutzschaltung (PCM).
- Keine scharfen Kanten, keine verschluckbaren Kleinteile außerhalb des
  verschraubten Innenraums.
- Alles von hinten verschraubt; Akku sitzt fest und ist gegen Kurzschluss
  gesichert.
- **Akku ganz zum Schluss ans Board** — erst wenn alles am USB läuft.

## Fixe Hardware-Entscheidungen

Details, Warum und Konsequenzen: `docs/entscheidungen.md`. Elektrische und
mechanische Kernwerte aller Bauteile gebündelt: `docs/kernwerte.md`. Kurz:

- **Board:** Adafruit ESP32-S3 Reverse TFT Feather (ADA5691, 4 MB Flash /
  2 MB PSRAM, LiPo-Lader onboard). BLE passt nicht in den Flash — WLAN ist
  der einzige Kommunikationsweg, nicht drauf bauen.
- **Audio:** MAX98357A (ADA3006, I2S) — im Breadboard an USB-5 V, im finalen
  Aufbau an Akkuspannung oder Boost (Entscheidung nach Hörtest). Lautsprecher:
  ADA3351-Gehäuselautsprecher 4 Ω / 3 W (kein 40/50-mm-Vergleichspaar, nur
  einer bestellt).
- **Boost:** TPS61023 MiniBoost (ADA4654, fix 5,2 V / 1 A, Enable-Pin). EN auf
  Low = True Disconnect — trennt Verstärker-Zusatzversorgung und Button-LEDs
  im Deep Sleep komplett. MAX98357A verträgt max. 5,5 V, 5,2 V ist ok.
- **NFC:** PN532-Modul, Modus per DIP-Schalter, **SPI ist der Primärweg**
  (I2C-Clock-Stretching macht am ESP32 Probleme). Betriebsspannung laut
  Datenblatt 3,3 V → direkt an 3V3. Tags: NTAG215-Sticker (504 Bytes nutzbar).
- **SD:** externes microSD-Modul (MSD-AADP) über SPI, hat Onboard-3,3-V-Regler
  → VCC an 5 V. Karte: Verbatim 32 GB (SDHC, max. 32 GB), FAT32.
- **Akku:** LiPo 3,7 V **3000 mAh** (Soldered 605080, mit Schutzschaltung,
  JST-PH 2.0). **Polung vor dem ersten Anschließen gegen das Feather-Pinout
  prüfen** — JST ist nicht polarisationsgenormt.
- **Bedienung:** 2 × Arcade-Button 44 mm (DT44L12, ⚠️ LED 12 V — am 5-V-Boost
  vermutlich dunkel, Verhalten testen und entscheiden), 4 × 30 mm (AB30L5,
  LED 5 V, Vorwiderstand eingebaut), 4 × 24 mm unbeleuchtet (AB24OL), 3
  Mini-Drucktaster, Drehencoder EC11, NeoPixel-Stick (8 × WS2812), 2
  Kippschalter. Nur 5–8 Buttons bekommen echte Funktionen, der Rest ist rein
  mechanisch (Busyboard-Gefühl).
- **GPIO-Erweiterung:** AW9523 (ADA4886, I2C, 16 Kanäle, Adresse 0x58). Kann
  **keine internen Pull-ups** (Taster brauchen externe 10 kΩ) und hat
  Konstantstrom-LED-Treiber auf allen Pins (Button-LEDs ohne Vorwiderstand,
  Dimmung per I2C).
- **Stromsparen:** Deep Sleep (~40–50 µA am Feather), Aufwachen nur über
  RTC-GPIOs 0–21 (daher Wake-Buttons auf IO5/6/11, nie über den AW9523),
  Auto-Sleep nach Inaktivität. PN532-Standby ist hoch (~10–13 mA) — im Sleep
  abschalten.
- **Kippschalter als Hauptschalter:** zwischen EN und GND — schaltet das Board
  ab, Laden über USB geht trotzdem weiter.

## Pins — nie aus dem Gedächtnis

Pin-Vorschläge ausschließlich aus `hardware/pinout.md`. Neue Pins vorher
gegen die Board-Definition prüfen (`pins_arduino.h` der Variante
`adafruit_feather_esp32s3_reversetft` im arduino-esp32-Repo, Befehl steht in
pinout.md). Der erste Breadboard-Plan hatte sechs falsche Pins, weil sie
aus allgemeinem ESP32-Wissen geraten waren.

Kurzregeln: **SPI ist ein Bus** — SD (CS IO10) und PN532 (SS IO9) teilen sich
SCK/MOSI/MISO, jedes Gerät hat nur seinen eigenen CS. **IO7 nicht anfassen**
(schaltet Display- und I2C-Strom), **IO33/IO21 sind Onboard-NeoPixel-Power**,
nicht belegen. Die endgültige Belegung nach Breadboard-Test landet in
`firmware/Config.h`.

## Struktur

```
hardware/   BOM, pinout.md (verbindliche Pins), Verkabelung
firmware/   ESP32-S3, C++ (Arduino-Framework oder ESP-IDF — noch offen;
            für die ersten Breadboard-Etappen reicht Arduino IDE)
app/        React PWA (Steuerung, Upload, Tag-Zuweisung)
3d-print/   STL/STEP (Halterungen, Buttons)
docs/       entscheidungen.md, kernwerte.md, breadboard-testing.md,
            dev-setup.md, findings.md, preisvergleich.md, bestellliste.md,
            Datenblätter, Testprotokolle
```

## Referenzen

- **ESPuino** (ESP32 + RFID + SD + I2S + Web-UI) — direkteste
  Plattform-Referenz für unsere Hardware.
- **Phoniebox** (Raspberry Pi) — Reifegrad-Referenz für UI/UX-Ideen.
- **Adafruit-Learn-Guide** „ESP32-S3 Reverse TFT Feather" — Board-Wahrheit
  für Header-Belegung und Power-Pins.

## Fehler-Checkliste — aus echten Ausrutschern (02.10.2026, Etappe 1)

Diese Fehler sind tatsächlich passiert und haben Stunden gekostet. **Vor
jedem Sketch-Flash und jeder Verkabelung einmal durchgehen:**

- **Peripheral-API prüfen, nicht raten.** Core-3.x-Bibliotheken (ESP_I2S,
  …) brauchen oft explizites `setPins()` (bzw. Äquivalent) **vor**
  `begin()`. Ohne das läuft der Sketch grün durch — begin() = true,
  write() zählt Bytes — und macht trotzdem nichts (grüne LED, tote
  Stille). Vor dem ersten Flash: eigenes Sketch-Zeile für Zeile gegen
  das **Beispiel der Bibliothek** abgleichen, nicht nur gegen Vorstellung
  der API. Doku: `docs/testprotokoll-etappe1.md`, `docs/findings.md`.
- **Modul-Silkscreen ist die Wahrheit, nicht die Tabelle.** Klons haben
  oft eine andere Pinreihenfolge als das Original (unser MAX98357A-Klon:
  `VIN, GND, SD, GAIN, DIN, BCLK, LRC` — anders als ADA3006). Verkabelung
  **nie positionsgleich durchverbinden**; pro Draht: Modul-Beschriftung
  lesen → Feather-Beschriftung lesen → stecken. Der Durchgangsprüfer
  bestätigt sonst fröhlich die eigene irrige Annahme.
- **Nur kompilierte Binaries flashen.** Wenn `compile` fehlschlägt, nie
  uploaden (es geht sonst das alte Binary raus) und den Fehler erst
  ansehen. Upload-Fehler („exit status 2") nachschauen — dabei kann der
  Port verschwinden; `ls /dev/ttyACM*` als Gegencheck.
- **Lautstärke vor dem Ton denken.** Kindersicherheit gilt auch im
  Breadboard-Test: Testtöne immer mit minimaler Aussteuerung starten und
  nur in Stufen hoch (Kindersicherheits-Grenzwert EN 71-1 im Kopf).
  Kind im Raum = leise Stufen, keine Maximallautstärke-Tests.
- **Doku direkt nach jedem Test**, nicht „später": Messwerte mit Datum
  ins Protokoll, neue Erkenntnisse in `docs/findings.md` nachtragen.

## Findings-Datenbank

Erfahrungswissen von echten Menschen (Foren, Blogs, GitHub-Issues) zu genau
unseren Bausteinen — I2S-Knackser, SD/FAT32, SPI-Bus-Sharing, WS2812-Pegel,
Deep-Sleep-Realwerte — steht gebündelt in `docs/findings.md`. **Vor jedem
eigenen Debug-Marathon dort nachsehen**, ob das Problem schon dokumentiert
ist. Eigene Erkenntnisse aus Testprotokollen dorthin nachtragen — nur mit
echter Quelle oder eigener Messung, kein KI-generiertes Blabla.

## Offene Fragen

- Welcher Button (44/30/24 mm, welche Farbe) bekommt welche Funktion
  (Play/Pause, Vol, Skip, …) — im Breadboard-Test herausspielen, Ergebnis
  nach `hardware/` dokumentieren.
- 44-mm-LEDs (12 V): 12-V-Step-Up nachbestellen oder Deko-LEDs weglassen —
  nach Verhaltenstest an 5 V entscheiden.
- Boost-Ausgang an MAX98357A: ja/nein, je nach Hörtest (lauter, aber mehr
  Strom und Verzerrungsrisiko an der 5,2-V-Grenze).
- Arduino-Framework vs. ESP-IDF für die Firmware (Sprint-4-Entscheidung;
  für Breadboard-Etappen 0–4 nicht relevant).
- Gehäuse: Bohrbild/Lautsprecher-Einbau erst nach Hörtest planen.

## Konventionen

- **Daddelberts Rechner ist Arch Linux** (Hyprland/Wayland) — kein WSL, auch
  wenn der PATH so aussieht. Setup-Protokoll: `docs/dev-setup.md`. Bei
  Serial-Ports gilt die Gruppe `uucp` (Arch), nicht `dialout` (Ubuntu).
- Preise immer mit Datum und Quelle notieren — Live-Preise veralten schnell.
- Bestelllisten gebündelt nach Händler, Zollpauschale einrechnen (Stand und
  Quelle in `docs/bestellliste.md` pflegen).
- Testprotokolle (Boost-Modul-Test, Breadboard-Etappen, Pegelmessungen)
  landen in `docs/` — mit Datum und gemessenen Werten, nicht nur „lief".
- Vor Datenblatt-PDFs erst in `docs/kernwerte.md` nachsehen.
- To-Dos mit Status in `To-Do.md` pflegen, damit jede Session weiß, wo es
  weitergeht.
