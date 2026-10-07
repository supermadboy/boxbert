# Kernwerte — Boxbert-Bauteile (Berry-Base-Bestellung 27.09.2026)

Kurzreferenz für Firmware, Verkabelung und 3D-Druck — die Dinge, die man sonst
aus jedem Datenblatt raussuchen müsste. Vollständige PDFs: `docs/datenblaetter/`.
Quelle: Berry-Base-Datenblätter, extrahiert am 27.09.2026. Wo das PDF unvollständig
ist (Ø44-Button-Bohrmaß, Feather-Pinmap), steht es im Abschnitt "Offene Punkte".
Korrekturen/Planungsgrenzen am 04.10.2026: Herstellerquellen für AW9523
und Board-Power in `docs/power-plan.md`; Lautstärke in `docs/audio-safety.md`.
Bauteilwerte sind keine Abnahme der noch ungeprüften Etappe-6-Schaltung.

---

## Versorgung / Strom (Systemplanung)

| Bauteil | Spannung | Strom | Anmerkung |
|---|---|---|---|
| ESP32-S3 Feather (ADA5691) | 3,3 V Logik; LiPo/USB-C | ~40–50 µA Board-Richtwert, keine eigene Gesamtsystemmessung | MAX17048 auf I2C; TFT/STEMMA-Rail separat schaltbar, allgemeiner 3V3-Header nicht über IO7 |
| LiPo-Akku (SOL-333286) | 3,7 V, 3000 mAh, 11,1 Wh | — | Schutzschaltung gegen Überladung/Kurzschluss vorhanden; JST-PH 2 mm Buchse; **Polung gegen Feather prüfen** |
| Boost TPS61023 (ADA4654) | IN 2–5 V → OUT 5,2 V | @3,7 V: 500 mA out = 800 mA in (88 %); 1 A out = 1,8 A in (78 %) | Enable auf Low = True Disconnect (OUT komplett stromlos). Bootet erst ab ~2 V |
| MAX98357A (ADA3006) | 2,7–5,5 V | — | 3,2 W @ 4 Ω bei 5 V; läuft am Akku (3,7 V) leiser |
| PN532 (PN532-MOD) | VCC 3,3 V | Betrieb 13–26 mA, Peak <30 mA, Standby 10–13 mA | Aktuell I2C; konkreter Ruhepegel 3,3 V laut Nutzer, HSU isoliert 4,1 V: nicht direkt an GPIO |
| NeoPixel Stick (NEOPS8) | 5 V im geplanten Test | konservatives Budget bis ~60 mA/LED, 8 LEDs bis ~480 mA; nicht gemessen | 3,3-V-Daten an 5-V-LEDs nicht pauschal garantiert; Pegel/Strom prüfen |
| Button-LEDs 30 mm | 5 V DC | noch zu prüfen | AB30L5 mit integriertem Vorwiderstand; AW9523-/LED-Rail-Anschluss noch nicht freigegeben |
| Button-LEDs 44 mm | **12 V DC**, leuchtet auch an **5 V**, Helligkeit „klar sichtbar“ (Nutzer, 07.10.2026); Strom an 5 V noch nicht gemessen | DT44L12: 12-V-Step-Up vs. 5-V-Rail — Helligkeitssorge entfällt; Strommessung + Portgrenzen offen; kein direkter AW9523-Anschluss |
| Encoder (EN2424-6T20) | 5 V DC (Taster-Schaltung) | max 10 mA | Signale A/B/Taster passiv, Pegel = Versorgung |
| Kippschalter/Drucktaster | passiv | — | max 3 A/125 V bzw. 1 A/125 V — für Logik egal |

## Logikpegel / Busse

- **Alles am Feather läuft auf 3,3 V.** ESP32-GPIOs sind NICHT 5-V-tolerant.
- **PN532:** aktuell **I2C IO3/IO4**, DIP 1 ON / 2 OFF, Adresse **0x24**,
  100 kHz, VCC 3,3 V. Etappe-4-NFC+SD+Audio-Player mit Hoertest bestaetigt.
  **Pegel getrennt bewerten:** Unterlagen nennen HSU/I2C 5V TTL und SPI
  3,3V TTL. Konkreter I2C-Ruhepegel laut Nutzer 3,3 V; kein Freibrief fuer
  andere Klone/Versorgungen. HSU-TXD/SDA isoliert **4,1 V bei VCC=3,27 V**
  gemessen (04.10.2026): niemals direkt an IO38, HSU ohne Pegelwandler
  gesperrt. Feather nicht 5-V-tolerant. Timeout 0 nur in eigener NFC-Task;
  weitere Wire-Clients synchronisieren. Quellen/Umfang im Etappe-4-Protokoll.
- **MAX98357A:** Eingänge vertragen 3,3 V **und** 5 V Logik. Pins:
  `LRC, BCLK, DIN, GAIN, SD, VIN, GND` (+/− Lautsprecher). Gain default 9 dB,
  per GAIN-Pin 3/6/9/12/15 dB. SD/Mode-Pin: default (L+R)/2-Mix; zum
  Abschalten auf Low (Shutdown) — nützlich für Deep Sleep.
  ⚠️ **Unser bestelltes Modul ist ein Klon** mit abweichender Pinreihenfolge
  `VIN, GND, SD, GAIN, DIN, BCLK, LRC` und Schraubklemme statt JST —
  Verkabelung und Details: `docs/testprotokoll-etappe1.md`.
  **Datenblatt-Zahlen (Rev 7):** 3,2 W @ 4 Ω/5 V (10 % THD), 2,5 W @ 1 % THD;
  3,7 V (Akku): 0,93 W @ 10 % THD. GAIN: offen = 9 dB; GND = 12 dB;
  VDD = 6 dB. SD-Pin-Modi (Analogschwellwerte): < 0,16 V Shutdown ·
  0,16–0,77 V nur rechts · 0,77–1,4 V nur links · > 1,4 V Mono (L+R)/2.
- **AW9523 (ADA4886):** I2C-Expander, 16 I/O, VIN am Feather **3V3**;
  keine +5 V auf diese Rail. Pins `VIN, GND, SCL, SDA, INT, RST`, P0/P1-
  Ports. Adresse 0x58, A0/A1-Pads für weitere Adressen. **Keine internen
  Pull-ups**: externe 10 kΩ nach 3V3 für Taster. P0 kann als Gruppe
  Open-Drain. Nur `AW9523_LED_MODE` ist Konstantstrom-Senke, GPIO-Modus
  braucht eigene geeignete LED-Strombegrenzung. Im LED-Modus Kathode an
  Port; Widerstand bei geeigneter nackter LED nicht zwingend, integrierte
  AB30L5-Widerstände bleiben aber erhalten. Direkte 5-V-Button-Ansteuerung
  erst anhand Portgrenzen/Schaltplan freigeben. Quellen/Testplan:
  `docs/power-plan.md` (Adafruit Pinouts/Arduino-Beispiele, 04.10.2026).
- **microSD-Modul (MSD-AADP / Soldered 333050):** Pins `VCC, GND, SCLK, MISO, MOSI, CS`.
  Onboard-3,3-V-Regler → mit 5 V speisen (nicht 3,3 V direkt — Regler-Dropout).
  SPI, bis 32 GB (die Verbatim-Karte ist microSDHC Class 10/U1, 80 MB/s Lesen).
- **NeoPixel:** Single-Wire 800 kHz; exaktes Timing in Firmware (RMT-Treiber).

## Pinout-Quellen (nie aus dem Gedächtnis!)

- Feather-Pinmap: `hardware/pinout.md` — vor Nutzung gegen `pins_arduino.h`
  der Variante `adafruit_feather_esp32s3_reversetft` prüfen.
- Auf dem Board sichtbare Labels (Foto im PDF): eine Seite
  `BAT EN USB 13 12 11 10 9 6 5 SCL SDA`, andere
  `RST 3V 3V GND A0 A1 A2 A3 A4 A5 SCK MO MI RX TX DB`;
  Taster auf Front: `D0 (Reset), D1, D2` (D0/BOOT0 = Bootloader).

## Maße & Montage (3D-Druck)

### Arcade-Button 30 mm, beleuchtet (AB30L5-*)
Aus Maßzeichnung im PDF (ab30-008): Gewinde **M28×2**, Bohrloch **Ø 28,0 mm**,
Kragen-Ø **33,3 mm** (Freistich im Deckel einplanen!), Kragen-/Anflanschhöhe
4,85 mm, Gewindelänge 28,6 mm bis zu den Pins, Flachstecker **2,8 mm**
(2 Pin: Taster; LED-Anschlüsse getrennt). Knopf-Ø ~33 mm sichtbar, Höhe über
Platte ~4,7 mm + R4,5 Wölbung.

### Arcade-Button 44 mm, beleuchtet (DT44L12-*)
Text sagt "Ø 24,0 mm / M24" — **widersprüchlich zur Zeichnung** (dt44img-008):
da sind M24×2 Gewinde **und** Ø44 als Gesamtdurchmesser des Knopfes, Ø36,6 als
Kragenaußendurchmesser, Bohrloch demnach **Ø 24 mm (M24×2)**, Kragen 19 mm Ø
Stufen, Höhen 10/4/3 mm. → Fürs Deckel-Layout zählt **Bohrung Ø 24 mm**,
Freistich für Kragen Ø 36,6 mm. Anschlüsse: Flachstecker **4,8 mm** (Taster,
Wechselschalter ON-(ON)), **6,3 mm** (LED, **12 V**).

### Mini-Arcade-Button 24 mm, unbeleuchtet (AB24OL-*)
Zeichnung (ab24-006): Knopf-Ø **27,1 mm**, Montageclip-Ø **23,5 mm** → Bohrung
**Ø 23,5 mm** (Datenblatt sagt Ø 23,5/Montageabmessung, passt), Einbauhöhe
27,5 mm, Gesamthöhe mit Pins 33,86 mm, Pins 9,05 mm lang, Flachstecker **2,8 mm**.

### Mono-Gehäuselautsprecher (ADA3351)
**30 × 70 × 17 mm**, Gewicht 26,4 g, 4 Ω / 3 W. Montagelöcher **Ø 3,4 mm** im
Rechteck **24 × 63 mm** (vier Ecken). Kabel: JST-PH 2 mm, ~570 mm lang,
direkt an den Verstärker-Ausgang. Für Frontöffnung/Abdeckung Form und
freie Schallöffnung am realen Bauteil prüfen; Außenmaße/Montagelöcher
sind kein Membran- oder Ausschnittmaß. Die frühere 65/66-mm-Lochidee war
nicht belegt und ist keine Bohrfreigabe. Gehäuse-/Abdeckungsentwurf erst
nach mechanischem Abgleich und Hörtest, ohne zugängliche Kleinteile.

### PN532-Modul (PN532-MOD)
Platine **40 × 60 mm** (rechteckig, Antennenschleife außen am Rand). Bohrlöcher
am Foto sichtbar (2, hinten). DIP-Schalter 2-fach oben. Header: gerade +
gewinkelte Stiftleiste im Lieferumfang.

### Inkrementalgeber (EN2424-6T20)
Achse **6 mm, D-Schnitt, 20 mm lang** → Drehknopf mit 6-mm-D-Aufnahme.
Printmontage (THT), 24 Rastungen/Impulse, Taster mit 0,5 mm Hub.
Drehknopf-Freistich und Befestigungsmutter beachten (Achsgewinde M6 üblich
bei EC11-artigem Aufbau — **am realen Teil nachmessen**).

### NeoPixel Stick (NEOPS8)
Platine ca. **54 × 10,5 × 3,15 mm**, 8 LEDs im Abstand ~10 mm (WS2812-5050).
2 Bohrlöcher (M2, ~Ø 2,1 mm, an den Enden — Foto zeigt Löcher zwischen Pin 1
und Pin 8-Bereich). Pins: GND, VCC, DIN, DOUT. Abstandhle zum Deckel: über
2× M2-Schrauben oder Einlassnut.

### Kippschalter Miniatur (10020, goobay)
**12,5 × 6,5 × 9,5 mm** (L×B×H), 3 Pin, EIN-EIN, Lötösen, max **6 A/125 V oder
3 A/250 V**. Gewinde-/Montagebohrung für den Hebel: **Ø 6 mm** (bei
Miniatur-Kippschaltern Standard M6×0,75 — siehe Zeichnung 10020-PDF, "M6 x 0.75,
SW 9" Kragen 11 mm hoch, mit Mutter).

### Kippschalter Subminiatur (10014)
**8 × 5 × 7 mm**, 3 Pin, EIN-EIN, Lötösen, max 3 A/125 V, blanker Metallhebel.
Bauform ON-Mitte-ON laut Text: "drei Positionen: Ein–Mittelstellung–Ein" —
dritter Pin unbestückt = normaler EIN/AUS. Für den Deckel: Pinabstand
typisch 0,1"-Raster, am realen Teil nachmessen.

### Mini-Drucktaster HQ (E-TSS10/13/14)
Länge 27 mm, **Bohrung Ø 7 mm** (Panel-Montage mit Mutter), 1-polig
Schließer OFF-(ON), 1 A/125 V, 2 Flachstifte hinten. Farben laut Bestellung:
rot/gelb/grün — das PDF zeigt die schwarz-Variante als Muster (E-TSS11),
Farbe ist reine Kappe, elektrisch identisch.

### Akku (SOL-333286)
**81,1 × 49,8 × 5,7 mm**, 3000 mAh, 3,7 V. Halterung mit > 6 mm Materialdicke
planen, gegen Verrutschen sichern, JST-PH-Buchse herausführen (Feather-Seite
hat Gegenstück — Polung einmal durchmessen, JST ist nicht genormt polarisiert).

### microSD-Modul (MSD-AADP)
Platine **38 × 22 mm**, SD-Slot an einer Längskante, 4 Ecken-Bohrlöcher (M2, Foto:
4 Stück, gegen die Platine geöffnet). Karte zeigt nach außen — Zugangsluke oder
herausgeführter Slot im Gehäuse einplanen.

### Feather (ADA5691)
Standard-Feather-Format: **50,8 × 22,86 mm** (2" × 0,9"), Lochabstand der
Padreihen 43,18 mm ± üblich. Display auf der **Rückseite** (Reverse TFT!),
Taster D0–D2 + USB-C auf der Front. → Bei der Deckel-Montage Display nach
innen/außen je nach gewünschter PWA-Bedienung — Entscheidung offen.

## Offene Punkte / Vorsicht

1. **44-mm-Button LED = 12 V.** Die zwei DT44L12 brauchen 12 V — es gibt keine
   12-V-Quelle im jetzigen Schaltplan. Entweder einen kleinen Step-Up (nicht
   bestellt) oder die LEDs wechseln/umbauen. **Vor dem Verdrahten klären** —
   Erst Verhalten bei kleinerer Spannung prüfen, dann Entscheidung
   dokumentieren (`docs/entscheidungen.md`, `docs/power-plan.md`).
   Eine nominale 12-V-LED ist keine freigegebene 5-V-LED.
2. **Ø44-Button-Bohrmaß** widersprüchlich (Text Ø24/M24 vs. Produktname 44 mm).
   Zeichnung sagt: M24×2 Gewinde, Kragen Ø 36,6 mm. Für die Bohrung zählt M24.
3. **PN532-Standby 10–13 mA** ist für Akkubetrieb zu hoch. Separate
   abschaltbare 3,3-V-Versorgung/geeignete Board-Rail noch planen.
   Aktuell PN532 am 3V3-Header: weder Boost-EN noch TFT/STEMMA-Power
   schaltet ihn dort ab; Feather-EN schaltet das Board aus. Nicht
   gleichsetzen. Schlafstrom und Rückspeisung erst messen (`docs/power-plan.md`).
4. **NeoPixel an 5 V Boost** Dateneingang: WS2812-Schwellwert liegt mit 0,7×VDD
   (5 V) bei ~3,5 V — 3,3-V-Logik kann marginal sein. Serien-Diode im
   5-V-Pfad oder Pegelwandler/DI-Drop einplanen. Erst messen, dann löten.
5. Feather "Reverse TFT" = Display auf der Unterseite. PWA ist der Hauptweg,
   Display als Zweitdisplay — Ausrichtung beim Gehäusedesign entscheiden.

## Chipuebersicht (Firmware-relevant)
| Chip | Bus/Protokoll | Adresse/Mode | Bemerkung |
|---|---|---|---|
| ESP32-S3 (Feather) | WLAN; BLE nicht im Projektumfang | — | ADA5691, 4 MB Flash / 2 MB PSRAM |
| MAX98357A | I2S | — | 8–96 kHz, kein MCLK |
| PN532 | I2C 100 kHz | 0x24; DIP ON/OFF | Timeout 0 in NFC-Task, IRQ/Reset offen |
| AW9523 | I2C | 4 Adressen (A0/A1) | Konstantstrom-LED, kein Pull-up intern |
| MAX17048 | I2C (onboard Feather) | 0x36 | spaetere Wire-Zugriffe mit NFC synchronisieren |
| ST7789 (TFT onboard) | SPI | — | 240×135, Backlight per PWM |
| WS2812 ×8 | Single-Wire | — | RMT-Treiber, exaktes Timing |
| microSD | SPI (Player 4 MHz) | CS IO10 | bis 32 GB (SDHC) |
