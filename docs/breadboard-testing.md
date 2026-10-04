# Breadboard-Testplan — Boxbert

Stand: 04.10.2026 (Etappen 0–4 bestanden; NFC auf I2C aktualisiert).
Pins gegen Board-Definition **und Datenblätter** geprüft —
Kernwerte in `docs/kernwerte.md`. Bestellung angekommen; Fahrplan fuer
Aufbau und weitere Integration. **Alle Pins kommen aus
`hardware/pinout.md`** — dort steht auch, wie man Pins prüft und welche
Fehler die erste Version dieses Plans hatte. Endgültige Belegung danach in
`firmware/Config.h`.

## Grundprinzip

In Etappen aufbauen, nach jeder Etappe ein Test-Sketch. Erst wenn die
Etappe läuft, kommt die nächste dazu. So lokalisieren wir Fehler einzeln,
statt sie in einem Kabelberg zu suchen.

**Akku ganz zum Schluss** — erst wenn alles an USB läuft.

## Werkzeug

- USB-C-Kabel mit **Datenleitung** (kein reines Ladekabel!)
- Lötkolben: Feather, MAX98357A, AW9523, Boost und NeoPixel-Stick kommen
  mit losen Stiftleisten
- Breadboard, Jumperkabel
- Widerstände: 330 Ω (NeoPixel-Datenleitung), **6–8 × 10 kΩ** (Pull-ups für
  Taster am AW9523 — der hat **keine internen Pull-ups**, siehe kernwerte.md)
- 1000-µF-Elko (NeoPixel); geeignete Pegelwandlung bei Bedarf planen,
  keine ungeprüfte 1N4148 als Last-Diode für den gesamten Stick
- Multimeter (PN532-Pegel am Modul, Akku-Polung, Button-Terminal-Durchgang)
- arduino-cli mit ESP32-Core 3.3.12, eingerichtet in `docs/dev-setup.md`;
  IDE/PlatformIO optional, langfristige Frameworkwahl separat

Buttons selbst brauchen **keine** Widerstände, wenn sie direkt am Feather
hängen (`INPUT_PULLUP`) — nur am AW9523 brauchen sie externe 10 kΩ.
Die 5-V-Button-LEDs (AB30L5) haben den Vorwiderstand eingebaut.

## Etappe 0 — Feather allein (nur USB)

Nichts anschließen. Test: `File > Examples > WiFi > WiFiScan` + Display-
Beispiel aus der Adafruit-Board-Bibliothek.

- [x] Board erkennt COM-Port, lässt sich flashen (01.10.2026, /dev/ttyACM0, native USB-CDC)
- [x] TFT zeigt etwas (01.10.2026, Sketch firmware/tests/etappe0_tft)
- [x] WLAN-Scan findet Netze (01.10.2026, 4 Netze; Details in docs/dev-setup.md)

## Etappe 1 — I2S + Speaker

Am Breadboard hängt der Verstärker an USB-5V; im finalen Aufbau an
Akkuspannung oder Boost (Entscheidung nach Hörtest).

| MAX98357A | Feather | Datenblatt-Hinweis |
|---|---|---|
| VIN | USB (5 V) | Chip verträgt 2,7–5,5 V |
| GND | GND | |
| DIN | IO16 (A2) | |
| BCLK | IO17 (A1) | |
| LRC | IO18 (A0) | |
| GAIN | **offen** | offen = 9 dB; leiser geht per Firmware oder 100 kΩ nach GND |
| SD | **an 3V3** | am getesteten Klon Mono (L+R)/2 festgelegt; nicht alte Offenlassen-Annahme übernehmen |
| Speaker +/− | 4-Ω-Lautsprecher (ADA3351, JST-PH) | |

Test: bekannter Testton-/Audio-Sketch, minimaler Pegel zuerst; leise
Wiedergabe und Störungen prüfen. Kein automatisches Hochdrehen, keine
Maximallautstärke mit Kind im Raum (`docs/audio-safety.md`).

**BESTANDEN am 02.10.2026** — Protokoll mit Messwerten und der ganzen
Fehlersuche (setPins-Falle, Klon-Pinout, SD-Schwellwerte):
`docs/testprotokoll-etappe1.md`. Erkenntnis: Amp läuft, Software-Lautstärke
soll begrenzt werden; MAX_AMP/Volume-Zahlen sind kein dB(A)- oder
Normnachweis. Akustische Bewertung noch offen (`docs/audio-safety.md`).

## Etappe 2 — SD-Karte

Karte vorher am PC mit FAT32 formatieren, ein paar kurze mp3s drauf.

| SD-Modul | Feather | Datenblatt-Hinweis |
|---|---|---|
| CS | IO10 | |
| SCK | IO36 (SCK) | |
| MOSI | IO35 (MOSI) | |
| MISO | IO37 (MISO) | |
| VCC | USB (5 V) | **bestätigt**: Modul hat Onboard-3,3-V-Regler, Betriebsspannung 5 V |
| GND | GND | |

Karte max. 32 GB (SDHC) — die Verbatim 32 GB passt exakt.

Test: SD-Beispiel → Dateiliste lesen. Danach erste mp3 von SD über I2S
abspielen (**Pups-Geräusch aus der Box**).

**BESTANDEN am 02.10.2026** — Dateiliste ✔, mp3-Wiedergabe ✔, Volume-Skala
vermessen (6 = leise-schön, 21 = max). Protokoll:
`docs/testprotokoll-etappe2.md`. Lehrstück: QSPI-PSRAM nicht auf opi
zwingen — kompiliert grün, läuft aber nicht.

## Etappe 3 — Buttons: „Button drückt, Pups kommt raus"

Der Meilenstein braucht **keinen** AW9523 — Buttons direkt an den Feather:

- Am einfachsten die **24-mm-Buttons** (AB24OL, unbeleuchtet, 2
  Flachstecker 2,8 mm, OFF-(ON) = Schließer): Terminal A an **IO5, IO6,
  IO11**, Terminal B an GND, `INPUT_PULLUP`
- Die 30-mm-Buttons gehen genauso (Schalter-Terminals, NICHT die LED-Pins)
- **44-mm-Buttons (DT44L12) haben 3 Anschlüsse** (Wechselschalter):
  **COM an GPIO, NO an GND** — mit Durchgangsprüfer COM/NO identifizieren
  (COM ist der Pin, der nur bei gedrücktem Button durchschaltet)
- Button-LEDs noch nicht anschließen

Test-Sketch: Button-Druck → spielt ein hinterlegtes „Pups"-mp3 von der SD.

**BESTANDEN am 02.10.2026** — Button an IO5 (INPUT_PULLUP) unterbricht
Boot-Loop und spielt `subbasesoft.mp3` ✔. 20-ms-Entprellen reicht, Volume
per Hörtest 6 → 12. Protokoll: `docs/testprotokoll-etappe3.md`.
Bisher nur IO5/AB24OL getestet. IO6/IO11 und 44-mm-Wechselschalter
jeweils mit Durchgangs-/Anschlusstest und eigener Firmwarefunktion
prüfen; gleiche Grundschaltung bedeutet nicht bereits abgenommen.

## Etappe 4 — PN532 (NFC)

**BESTANDEN am 04.10.2026 als Breadboard-Meilenstein**, inklusive
Nutzer-Hoertest nach Latenzoptimierung. Aktuell **I2C**, nicht der alte
SPI-/HSU-Plan. Vor Umstecken USB ab, Akku weiter getrennt.

| PN532 | Feather | Hinweis |
|---|---|---|
| VCC | 3V3 | konkrete Modulversorgung |
| GND | GND | |
| SDA | IO3 | I2C 100 kHz, Adresse 0x24 |
| SCL | IO4 | |
| SPI/UART/IRQ/Reset | nicht verbunden | keine SS-Leitung auf IO9 |

DIP **1 ON / 2 OFF**. Buspegel am konkreten Modul pruefen: Nutzerbericht
SDA/SCL in I2C 3,3 V. HSU am selben Pad lieferte isoliert 4,1 V und darf
nicht direkt an Feather-RX; GPIOs nicht 5-V-tolerant. VCC=3,3 V allein
beweist keinen sicheren Signalpegel. Keine allgemeine Klon-Freigabe.

Aktive Referenzen in `firmware/tests/README.md`:
- `etappe4_nfc_i2c`: unveraenderter UID-Einzeltest.
- `etappe4_nfc_switch`: nachgewiesener Timeout-0-Wechselpfad.
- `etappe4_tag_player`: zwei exakte UIDs starten zwei SD-Dateien; SD
  4 MHz, NFC-Pause 200 ms, Volume 6/21. NFC wartet in eigener Task,
  Audio/SD im Hauptloop; unbekannte UIDs starten kein Ersatzlied.

Liedwechsel und kein Neustart bei gleicher UID akustisch bestaetigt.
Happy Tune UID→stream-ready von 5499 auf ca. 1555–1562 ms reduziert,
Arcade ca. 1369–1372 ms. Keine physische Auflege→Ton-Messung.
V1 ohne Entfernen-Event: gleiche UID startet auch nach Neuauflegen nicht
neu, solange keine andere UID dazwischen gelesen wurde. Kein Tag-Schreiben.

Abnahme/Chronologie: `docs/testprotokoll-etappe4.md`; UIDs/Pfade:
`hardware/nfc-tags.md`. 20 kontrollierte Wechsel, Minutenlast, expliziter
Entfernen-/EOF-Test und Player-Kaltstart stehen als **spaetere Haertung**
in `To-Do.md`, nicht als offene Bedingungen dieses Nutzerabschlusses.

## Etappe 5 — WLAN-Webserver + Upload

**Naechster Schritt nach Etappe 4.** Vor Umsetzung Umfang und Framework
abstimmen; bisheriger Player bleibt Referenz. Firmware-Skelett (Sprint 4):
HTTP-Server auf dem Feather, Endpoints
`/files`, `/upload`, `/tags`. Test am Handy im gleichen WLAN: mp3
hochladen, Dateiliste sehen, Tag-UID zuordnen.

## Etappe 6 — AW9523, NeoPixel, Encoder, Boost, Button-LEDs

**Noch nicht abgenommen.** Erst GPIO-/Einzeltests, dann freigegebenen
LED-/Rail-Schaltplan erstellen. Quellen und offene elektrische Prüfungen:
`docs/power-plan.md`. Keine +5 V auf eine bereits an 3V3 angeschlossene
AW9523-VIN-Rail, kein PN532 an 5,2 V Boost.

- **AW9523** an I2C: SDA=IO3, SCL=IO4 (oder STEMMA-QT-Kabel),
  VIN **3V3**, GND. INT/Reset für ersten GPIO-Test nicht zusätzlich
  verdrahten. Test: I2C-Scan findet **0x58**. Vor gleichzeitiger Nutzung
  mit PN532/Fuel Gauge Wire-Zugriffe zwischen Tasks synchronisieren.
- **Weitere Taster über AW9523:** jeder Taster braucht einen **externen
  10-kΩ-Pull-up** von 3,3 V zum Port-Pin, Taster dann gegen GND
  (Chip hat keine internen Pull-ups!). Taster-Zustand per I2C lesen.
- **Button-LEDs 30 mm (AB30L5, 5 V):** integrierte Vorwiderstände bleiben
  erhalten. LED-Versorgung von AW9523-Logikversorgung trennen; **direkter
  5-V-LED-Portanschluss noch nicht freigegeben**. Erst Portspannungsgrenzen,
  Reset-Zustände, Strom/Verlustleistung und Spannungsreserve prüfen.
  Nur LED-Modus ist Konstantstrom-Senke, nicht normaler GPIO-Ausgang.
  Separater LED-Test erst nach Schaltplanprüfung (`docs/power-plan.md`).
- **Button-LEDs 44 mm (DT44L12): ⚠️ sind 12-V-LEDs.** Am 5-V-Boost
  leuchten sie vermutlich nicht. Test an 5 V: Verhalten dokumentieren
  (gar nichts / schwach glimmen). Entscheidung danach:
  12-V-Step-Up nachbestellen oder Deko-LEDs weglassen.
  Taster-Funktion der 44-mm-Buttons ist davon unabhängig und kann
  normal verdrahtet werden (COM/NO wie in Etappe 3).
- **NeoPixel-Stick:** VCC an **USB 5 V** (WS2812 will 4–7 V, nicht an
  3,3 V!), 1000-µF-Elko über 5 V/GND am Stick, DIN an IO8 (A5) mit
  330 Ω in Reihe. Falls Pixel zittern/flackern: Pegel-Problem (3,3-V-Logik
  gegen 5-V-Versorgung, mögliche Schwellwertverletzung) — geeigneten
  Pegelwandler oder elektrisch dimensionierte Alternative vorsehen.
  Keine ungeprüfte 1N4148 als Versorgungsdiode für acht LEDs; Strombudget
  und tatsächliche Pegel messen. DOUT offen lassen.
- **Encoder:** mittlerer Pin (C) an GND, A=IO15, B=IO14, Taster-Paar an
  IO12 + GND, alle mit `INPUT_PULLUP`. C vor dem Einstecken mit dem
  Durchgangsprüfer verifizieren (C schaltet abwechselnd gegen A und B
  beim Drehen).
- **TPS61023-Boost:** IN an 5 V (USB), GND, EN an IO39, OUT 5,2 V →
  Button-LED-Rail. EN auf Low = True Disconnect (OUT komplett stromlos).
  Erst Ausgangsspannung unbelastet/unter geeigneter Last und EN-Verhalten
  prüfen. LED-Rail nur nach Freigabe anschließen; Amp-Boost-Vergleich
  separat und leise (MAX98357A max. 5,5 V, reale Boost-Spannung prüfen).
  Noch kein bereits aufgebauter Verstärker-/LED-Versorgungspfad.
- Erst jetzt, wenn alles an USB klappt: Akku mit **polungsgeprüfter**
  JST-Verbindung an den Feather, USB ab, Betrieb aus Akku testen. Deep
  Sleep + Wake über IO5/6/11 (nur GPIO 0–21 können wecken). PN532 am
  aktuellen 3V3-Header wird **nicht** durch Boost-EN oder IO7 abgeschaltet.
  Separate schaltbare 3,3-V-Rail erst planen; externen NeoPixel-Stick
  seiner realen Rail zuordnen. Sleep-Zustände, Rückspeisung und Gesamt-
  Sleep-Strom prüfen (`docs/power-plan.md`).
- Kippschalter als Hauptschalter: zwischen **EN** und **GND** — schaltet
  das Board ab, Laden über USB geht trotzdem weiter.

## Was wir dabei entscheiden (To-Do für Sprint 2/3)

- [ ] Pinbelegung aus `hardware/pinout.md` bestätigen → `firmware/Config.h`
- [ ] Boost-Ausgang an MAX98357A: ja/nein, je nach Hörtest
- [ ] Welcher Button bekommt welche Funktion (Play/Pause, Vol, Skip, …)
- [ ] 44-mm-LEDs: 12-V-Step-Up nachbestellen oder weglassen
