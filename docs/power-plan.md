# Versorgung, LED-Ansteuerung und Abschaltung — Planungsgrenzen

Stand: **04.10.2026**. Aktueller USB-Breadboard-Aufbau ist bestaetigt;
Etappe-6-Erweiterungen sind **noch keine freigegebene Steckanleitung**.
Pins ausschliesslich aus `hardware/pinout.md`. Akku bleibt getrennt,
vor jedem Umstecken USB abziehen. Keine neuen GPIO-Zuweisungen hier.

## Aktuell bestaetigte Versorgung

| Verbraucher | Versorgung im Breadboard | Abschaltung durch Boost-EN? |
|---|---|---|
| Feather | USB-C, onboard 3,3-V-Regler | nein |
| PN532 | Feather-3V3-Header | **nein**, nicht am Boost-Ausgang |
| SD-Modul | USB-5V, onboard 3,3-V-Regler | nein |
| MAX98357A | USB-5V; SD/Mode-Pin fest 3V3 | nein; aktuell kein Amp-Shutdown per Firmware |

Boost, AW9523 und externer NeoPixel-Stick sind nicht Teil der Etappe-4-
Abnahme. Test-/Bauteilbestand siehe `hardware/BOM.md`, Details im
Etappe-4-Protokoll. Es wird nicht aus zukuenftigen Plaenen auf heutige
Sleep-Stroeme oder eine bereits vorhandene Rail-Schaltung geschlossen.

## Rail-Merksatz (07.10.2026, aus Planungsdiskussion)

**BAT = Energiequelle, 3V3 = Logik, Boost-Ausgang = Leistung.**
- BAT (rohe Akkuspannung, 3,0–4,2 V) ist ungeeignet für SD-Modul
  (Regler-Dropout), NeoPixel/LED-Rail (Helligkeitsschwankung) und PN532
  (3,3-V-Teil). Einziger BAT-Direktkandidat: MAX98357A (2,7–5,5 V),
  siehe offene Amp-Variante oben.
- Der 3V3-Header speist den ESP32 selbst (inkl. WLAN-Bursts) — dort
  nur Logik-Verbraucher (PN532 ~30 mA Peak, AW9523 µA), keine
  Leistungslasten (Brown-out-Risiko).
- Boost-Eingang künftig **direkt an der Akku-JST-Buchse abgreifen**,
  nicht über den BAT-Header-Pin — Board-Leiterbahn ist nicht für
  ~2-A-Boost-Eingangsstrom dimensioniert (kernwerte: 1 A out ≈ 1,8 A in
  @3,7 V). Noch ungeprüft/zu testen, erst Anschlussfreigabe nach
  elektrischer Prüfung.

## Drei verschiedene Enable-/Power-Funktionen

1. **Feather-EN (Header):** deaktiviert den Haupt-3,3-V-Regler und damit
   das Board. BAT/USB bleiben versorgt; USB-Laden ist davon unabhaengig.
   Das ist der geplante manuelle Hauptschalter, kein normaler Deep Sleep
   mit weiterlaufendem RTC-Wake-Controller am abgeschalteten Board.
2. **TFT_I2C_POWER (IO7):** schaltet die separate TFT-/STEMMA-QT-
   Versorgung, **nicht** den allgemeinen 3V3-Header. Im aktuellen Aufbau
   IO7 nicht umschalten. PN532 am Header wird dadurch nicht abgeschaltet.
   Umversorgung an die geschaltete Rail waere eine eigene, noch zu
   pruefende Planungsentscheidung, kein bereits bestaetigter Anschluss.
3. **TPS61023-EN (geplant IO39):** True Disconnect trennt nur Verbraucher
   **hinter dessen Ausgang**. Es ersetzt weder Feather-EN noch eine
   separate schaltbare PN532-3,3-V-Versorgung. Der externe Stick ist
   ebenfalls erst nach tatsaechlicher Rail-Zuordnung abschaltbar.

Quellen, gelesen 04.10.2026:
[Adafruit Feather Power Management](https://learn.adafruit.com/esp32-s3-reverse-tft-feather/power-management),
Board-Core-3.3.12-Pinzuordnung und `hardware/pinout.md`;
[Adafruit MiniBoost ADA4654](https://www.adafruit.com/product/4654)
(5,2-V-Feedback, True Disconnect, Lastgrenzen abhaengig von Eingang),
`docs/kernwerte.md` / `docs/datenblaetter/ADA4654.pdf`.

## AW9523: Logikversorgung und LED-Versorgung getrennt planen

**Erster isolierter Test:** AW9523-VIN an **3V3**, GND gemeinsam, I2C auf
IO3/IO4. 0x58 scannen; einen Taster mit externem 10-kOhm-Pull-up nach
3V3 pruefen. Mit aktivem NFC vorher Wire-Zugriffe synchronisieren.
INT/Reset nicht ungeprueft als zusaetzliche Pflichtleitungen behandeln.

Adafruit verlangt VIN entsprechend der Mikrocontroller-Logikspannung
und nennt fuer Feather explizit 3V → VIN. **Kein +5 V auf diese 3V3-
VIN-Rail legen.** Feather-GPIOs und der gemeinsame I2C-Bus sind nicht
als 5-V-tolerant freigegeben.

### LED-Modi nicht verwechseln

- **GPIO-Ausgangsmodus:** keine automatische LED-Konstantstrombegrenzung.
  Nackte LEDs brauchen passende Strombegrenzung; siehe Blink-Beispiel.
- **AW9523_LED_MODE:** programmierbare Konstantstrom-**Senke**; Kathode
  zum LED-Port, Anode zur fuer diesen Test geprueften LED-Versorgung.
  Nur in diesem Modus kann eine geeignete nackte LED ohne externen
  Vorwiderstand betrieben werden. Anfangswert aus/kleiner Strom, nie
  ungeprueft maximaler Dimmwert oder Gesamtstrom.
- **Unsere AB30L5:** fertige **5-V-LED-Einheiten mit integriertem
  Vorwiderstand**. Diesen nicht entfernen/ueberbruecken. Die Aussage
  „AW braucht keinen Widerstand“ ist keine Umruestanweisung fuer Buttons.
- **DT44L12:** 12-V-LED-Einheiten; nicht direkt am AW9523 vorsehen.

**Offen vor 5-V-Button-LED-Test:** zulaessige LED-Portspannung im konkreten
Modus bei VDD=3,3 V, Reset-/Boot-Zustaende, Strom/Verlustleistung pro Port
und gesamt, erforderliche Spannungsreserve der Stromsenke, Verhalten der
integrierten Widerstaende. Datenblatt und Breakout-Schaltplan gegenpruefen;
gegebenenfalls externen geeigneten LED-Treiber planen. Eine getrennte
5-V-LED-Rail ist eine zu pruefende Option, **noch keine direkte
Anschlussfreigabe an die Ports**. Nie dafuer VIN mit +5 V verbinden.

Primarquellen, gelesen 04.10.2026:
- [Adafruit AW9523 Pinouts](https://learn.adafruit.com/adafruit-aw9523-gpio-expander-and-led-driver/pinouts)
- [Adafruit Arduino-Beispiele: GPIO und Konstantstrom](https://learn.adafruit.com/adafruit-aw9523-gpio-expander-and-led-driver/arduino)
- [Datenblatt-/Schaltplan-Links](https://learn.adafruit.com/adafruit-aw9523-gpio-expander-and-led-driver/downloads)

Die VIN-Vorgabe und Modusunterscheidung sind quellengeprueft; daraus
keine bereits erfolgte Board-/Button-LED-Messung behaupten. Die externe
5-V-Rail ist bewusst bis zur elektrischen Gegenpruefung offen.

## Rail-Feinplanung (ENTWURF, 07.10.2026) — Entscheidungen und offene Pruefungen

Status: **Entwurf nach Etappe-6-Breadboard-Programm** (Teilprogramm
bestanden, s. `docs/testprotokoll-etappe6.md`). Nichts davon ist
angeschlossen/getestet; Umsetzung erst nach Freigabe + Bestellung
fehlender Teile. Ziel: Deep Sleep nur Feather (~40–50 µA Richtwert),
Wake nur ueber IO5/6/11 (PN532 ist im Sleep aus — Tag-Erkennung gibt es
erst nach Wake, das ist das bestehende Konzept, nicht neu).

### Verbraucher → Rail (Vorschlag)

| Verbraucher | Rail im Endaufbau | Abschaltung im Sleep | Wie |
|---|---|---|---|
| Feather | BAT/USB, onboard 3,3-V-Regler | schlaeft selbst (Wake IO5/6/11) | Deep Sleep, Kippschalter an Feather-EN als Hauptschalter |
| Fuel Gauge MAX17048 (onboard) | immer an | nein (µA, Batterie-Monitoring) | — |
| AW9523 | Feather 3V3 | nein (µA-Logik; Ports im Sleep als Eingang, LED-Rail ist aus) | — |
| **PN532** | 3,3 V, **abschaltbar** | **ja (10–13 mA Standby!)** | Optionsentscheidung unten (A) |
| SD-Modul | **Boost-Ausgang 5,2 V** (Play-Modus) | ja, via Boost-EN | Modul-Regler vertraegt 5,2 V (AMS1117-Klasse), geprueft werden Einschaltspitzen |
| MAX98357A | **offen**: Akkuspannung (3,7–4,2 V) vs. Boost 5,2 V — Hörtest ausstehend (AGENTS offene Frage) | ja, via Boost-EN wenn Boost-Variante; bei Akku-Variante Shutdown-Pin nutzen | Variante (a) heißt: kein Extra-Schalter nötig, aber leiser |
| NeoPixel-Stick | Boost-Ausgang 5,2 V | ja, via Boost-EN | DIN 330 Ω wie getestet; Rueckspeisung ueber DIN im Sleep pruefen (Pulldown) |
| Button-LEDs 30 mm + 44 mm | gemeinsame **5-V-LED-Rail** vom Boost-Ausgang | ja, via Boost-EN | Anoden an Rail, Kathoden an AW9523-Ports (Konstantstrom-Sink) — **Portgrenzen-Pruefung ausstehend** |
| Boost (TPS61023) | IN an BAT (oder USB) | ja (True Disconnect bestaetigt, Teil 3b) | EN-Steuerung: Optionsentscheidung unten (B) |

### Optionsentscheidung A — PN532 abschalten

1. **PN532 an die IO7-Rail (TFT/STEMMA-Versorgung) umversorgen:** kein
   neues Bauteil; IO7 ist RTC-faehig (0–21) und default-aus im Sleep;
   Rail laedt TFT (+STEMMA, ~wenige mA) + PN532 (13–26 mA).
   Vorher zu pruefen: Rail-Belastbarkeit/Ladewandler? (Adafruit-Schaltplan
   gegensehen), Verhalten bei Boot (variant.cpp setzt IO7 HIGH), ob TFT-aus
   im Sleep okay ist (ja, Display schlaeft mit).
2. **P-Kanal-MOSFET High-Side an 3V3 (neues Bauteil, Bestellung):** Gate-
   Pull-up an 3V3 (default aus im Deep Sleep, Gate floatet), Gate von
   **IO38** (frei laut pinout.md; nicht RTC — reicht, weil Pull-up den
   Aus-Zustand definiert). Sauber getrennt von TFT-Funktion.
   Empfehlung bei Bestellung: z. B. Si2301/DMG3415-Klasse + 10 kΩ.

### Optionsentscheidung B — Boost-EN im Deep Sleep

**Problem (neu erkannt, 07.10.2026):** Geplanter EN-Pin IO39 ist **kein
RTC-GPIO** (RTC = 0–21) — im Deep Sleep floatet er, das Breakout zieht
EN hoch → Boost bleibt AN → SD/Amp/Stick/LED-Rail ziehen Sleep-Strom.
1. **EN auf IO9 umziehen** (frei laut pinout.md, RTC-faehig): Firmware
   hält LOW vor dem Sleep (rtc_gpio_hold_en), Boost aus; nach Wake wieder
   an. Breakout-Pull-up bleibt nutzbar. IO39 bleibt frei.
2. **Externer Pulldown an EN (IO39 bleibt):** teilt mit Breakout-Pull-up
   einen unklaren Mittelpegel, wenn Pull-up-Wert nicht gegengeprueft ist —
   riskanter, nur mit Schaltplan-Check des Breakouts.
3. **EN an RTC-GPIO IO13** (onboard-LED haengt dran, aber nutzbar): nur
   falls IO9 anderweitig gebraucht wird.

**Empfehlung im Entwurf: B1 (IO9) + A je nach Nutzerentscheidung**
(IO7-Rail spart Bauteil, MOSFET ist sauberer isoliert).

### Offene elektrische Pruefungen vor Umsetzung

- AW9523-Port-Spannungsgrenzen im Konstantstrom-Modus bei VDD=3,3 V,
  Reset-/Boot-Zustaende der Ports, Strom/Verlustleistung pro Port/gesamt,
  Spannungsreserve der Senke gegen 5-V-Rail (Datenblatt AW9523 +
  Breakout-Schaltplan); integrierte 44-mm-Widerstaende im 5-V-Betrieb.
- LED-Stroeme an 5 V messen (30 mm und 44 mm) fuer das Strombudget.
- Rueckspeisung: DIN/NeoPixel-Datenleitung im Boost-aus-Zustand;
  SD-Modul-Einschaltspitze am Boost; AW9523-Ports bei abgeschalteter
  LED-Rail (koennen Ports aus der 3,3-V-Logik speisen?).
- Gesamt-Sleep-Strom messen (µA-Messbereich, Burden beachten) — Richtwert
  40–50 µA ist kein gemessener Gesamtsystemstrom.
- Amp-Variante (Akku vs. Boost) erst nach Hörtest festlegen; dann ggf.
  MAX98357A-Verlustleistung an 5,2 V unter Last bewerten (max. 5,5 V).
- Akku: Polung gegen Feather-Pinout pruefen (JST nicht polarisations-
  genormt), Akku erst ganz zum Schluss ans Board (AGENTS).

## Vor Akku-/Deep-Sleep-Abnahme (Checkliste, Stand 04.10.2026)

*Hinweis 07.10.2026: Die meisten Punkte sind im Rail-Feinplanungs-Entwurf
oben gebündelt und konkretisiert; Liste bleibt als Gegenkontrolle stehen.*

- Verbraucher ihren **realen** Rails zuordnen, Strom-/Spannungsgrenzen,
  Reglerverlustleistung und Einschaltspitzen pruefen.
- SD-Modul mit 5-V-Eingang braucht fuer Akkubetrieb eine gepruefte
  Versorgung; USB-Pin liefert ohne USB-Kabel nicht automatisch 5 V.
- PN532-VCC nicht an 5,2 V Boost anschliessen. Separate abschaltbare
  3,3-V-Versorgung/geeignete geschaltete Board-Rail erst entscheiden.
- Sleep-/Reset-Zustaende der EN-Steuerung und moegliche Rueckspeisung
  ueber Datenleitungen pruefen. „True Disconnect“ garantiert nicht, dass
  alle anderen Systempfade ebenfalls stromlos sind.
- Externer NeoPixel-Stick: 5-V-Versorgung/Pegel pruefen; keine ungepruefte
  1N4148 als Last-Diode fuer alle acht LEDs empfehlen. Pegelwandler oder
  belastbare, dimensionierte Alternative separat festlegen.
- Board-Richtwert ~40–50 uA ist kein gemessener Gesamtsystemstrom.
  Sleep-Strom mit geeignetem uA-Messbereich messen (Messaufbau/Burden-
  Spannung beachten); gewoehnlichen USB-Meter nicht als uA-Nachweis nutzen.
- Erst danach Akku-Polung gegen Feather pruefen, Akku anschliessen,
  sicheren Lade-/Akkubetrieb und Sleep/Wake testen und protokollieren.
