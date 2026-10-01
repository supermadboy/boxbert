# Breadboard-Testplan — Boxbert

Stand: 27.09.2026 (Pins gegen Board-Definition **und Datenblätter** geprüft —
Kernwerte in `docs/kernwerte.md`). Vorlage für das erste Aufbauen, wenn die
Bestellung (Tastenkrone, 109,81 €) angekommen ist. **Alle Pins kommen aus
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
- 1000-µF-Elko (NeoPixel), 1× 1N4148-Diode (falls NeoPixel-Pegel zickt)
- Multimeter (PN532-Pegel am Modul, Akku-Polung, Button-Terminal-Durchgang)
- Arduino IDE oder PlatformIO mit ESP32-S3-Support (entscheiden wir im
  Sprint 4; für die ersten Etappen reicht Arduino IDE)

Buttons selbst brauchen **keine** Widerstände, wenn sie direkt am Feather
hängen (`INPUT_PULLUP`) — nur am AW9523 brauchen sie externe 10 kΩ.
Die 5-V-Button-LEDs (AB30L5) haben den Vorwiderstand eingebaut.

## Etappe 0 — Feather allein (nur USB)

Nichts anschließen. Test: `File > Examples > WiFi > WiFiScan` + Display-
Beispiel aus der Adafruit-Board-Bibliothek.

- [ ] Board erkennt COM-Port, lässt sich flashen
- [ ] TFT zeigt etwas
- [ ] WLAN-Scan findet Netze

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
| SD | **offen lassen** | Adafruit-Board macht dann Mono (L+R)/2. Low = Shutdown, später für Deep Sleep nützlich |
| Speaker +/− | 4-Ω-Lautsprecher (ADA3351, JST-PH) | |

Test: Tone- oder WebRadio-Beispiel; prüfen, ob der Lautsprecher laut und
verzerrungsfrei klingt.

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

## Etappe 4 — PN532 (NFC)

DIP-Schalter am Modul: **SPI-Modus** (Set0 = AUS, Set1 = EIN — Beschriftung
am Modul gegenprüfen). Datenblatt sagt Betriebsspannung **3,3 V** → VCC an
3V3, keine Pegel-Thematik am SPI-Bus. Multimeter-Check entfällt damit
weitgehend; trotzdem vor dem ersten Einstecken kurz nachmessen, was am
Modul „5V"-beschriftet ist (manche PN532-Klone haben einen Regler — dann
geht auch 5 V, aber 3,3 V ist immer sicher).

PN532 teilt sich den SPI-Bus mit der SD-Karte, nur SS ist eigen:

| PN532 | Feather | Hinweis |
|---|---|---|
| VCC | 3,3 V | laut Datenblatt |
| GND | GND | |
| SCK | IO36 | geteilter Bus |
| MISO | IO37 | |
| MOSI | IO35 | |
| SS/NSS | IO9 | eigenes CS |
| IRQ / RSTO | erstmal offen (Polling reicht) | |

Test: NTAG215-Sticker drauflegen → UID auf Serial/Display (504 Bytes
nutzbar, reicht für Dateipfad). Danach: SD abspielen und Tag lesen
gleichzeitig (geteilter Bus). Falls die SD beim geteilten Betrieb hakt:
SPI-Frequenz senken (beginnen bei 4 MHz, hochtasten).

## Etappe 5 — WLAN-Webserver + Upload

Firmware-Skelett (Sprint 4): HTTP-Server auf dem Feather, Endpoints
`/files`, `/upload`, `/tags`. Test am Handy im gleichen WLAN: mp3
hochladen, Dateiliste sehen, Tag-UID zuordnen.

## Etappe 6 — AW9523, NeoPixel, Encoder, Boost, Button-LEDs

- **AW9523** an I2C: SDA=IO3, SCL=IO4 (oder STEMMA-QT-Kabel),
  VIN 3,3 V, GND. INT optional an IO13 (Tasten-Events ohne Polling),
  RST offen. Test: I2C-Scan findet **0x58** (Standardadresse).
- **Weitere Taster über AW9523:** jeder Taster braucht einen **externen
  10-kΩ-Pull-up** von 3,3 V zum Port-Pin, Taster dann gegen GND
  (Chip hat keine internen Pull-ups!). Taster-Zustand per I2C lesen.
- **Button-LEDs 30 mm (AB30L5, 5 V):** LED-Anschlüsse an AW9523-Port-Pins,
  gemeinsame +5 V an die VIN-Rail des AW9523 — Konstantstrom-Modus,
  **keine Vorwiderstände nötig**, Dimmung per I2C.
- **Button-LEDs 44 mm (DT44L12): ⚠️ sind 12-V-LEDs.** Am 5-V-Boost
  leuchten sie vermutlich nicht. Test an 5 V: Verhalten dokumentieren
  (gar nichts / schwach glimmen). Entscheidung danach:
  12-V-Step-Up nachbestellen oder Deko-LEDs weglassen.
  Taster-Funktion der 44-mm-Buttons ist davon unabhängig und kann
  normal verdrahtet werden (COM/NO wie in Etappe 3).
- **NeoPixel-Stick:** VCC an **USB 5 V** (WS2812 will 4–7 V, nicht an
  3,3 V!), 1000-µF-Elko über 5 V/GND am Stick, DIN an IO8 (A5) mit
  330 Ω in Reihe. Falls Pixel zittern/flackern: Pegel-Problem (3,3-V-Logik
  gegen 5-V-Versorgung, Schwellwert ~3,5 V) — dann 1N4148 in die
  Stick-VCC-Leitung (Stick läuft bei ~4,3 V, Schwellwert sinkt).
  DOUT offen lassen.
- **Encoder:** mittlerer Pin (C) an GND, A=IO15, B=IO14, Taster-Paar an
  IO12 + GND, alle mit `INPUT_PULLUP`. C vor dem Einstecken mit dem
  Durchgangsprüfer verifizieren (C schaltet abwechselnd gegen A und B
  beim Drehen).
- **TPS61023-Boost:** IN an 5 V (USB), GND, EN an IO39, OUT 5,2 V →
  Button-LED-Rail. EN auf Low = True Disconnect (OUT komplett stromlos).
  Test: EN togglen → 5-V-LEDs an/aus; prüfen, ob Audio über 5,2 V
  lauter wird (Vorsicht: MAX98357A verträgt max. 5,5 V, 5,2 V ist ok).
- Erst jetzt, wenn alles an USB klappt: Akku mit **polungsgeprüfter**
  JST-Verbindung an den Feather, USB ab, Betrieb aus Akku testen. Deep
  Sleep + Wake über IO5/6/11 (nur GPIO 0–21 können wecken). PN532- und
  NeoPixel-Versorgung im Sleep abschaltbar über Boost-EN.
- Kippschalter als Hauptschalter: zwischen **EN** und **GND** — schaltet
  das Board ab, Laden über USB geht trotzdem weiter.

## Was wir dabei entscheiden (To-Do für Sprint 2/3)

- [ ] Pinbelegung aus `hardware/pinout.md` bestätigen → `firmware/Config.h`
- [ ] Boost-Ausgang an MAX98357A: ja/nein, je nach Hörtest
- [ ] Welcher Button bekommt welche Funktion (Play/Pause, Vol, Skip, …)
- [ ] 44-mm-LEDs: 12-V-Step-Up nachbestellen oder weglassen
