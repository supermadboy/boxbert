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

## Vor Akku-/Deep-Sleep-Abnahme

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
