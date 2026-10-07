# Testprotokoll Etappe 6 — AW9523, NeoPixel, Encoder, Boost, Button-LEDs

**Datum:** 07.10.2026 (laufendes Protokoll, Teil 1 begonnen)
**Umfang:** Fahrplan `docs/breadboard-testing.md`, Etappe 6. Nur USB, Akku
weiterhin ab. Etappe-5-Flash-Inhalt ist mit dem ersten Teil-1-Flash ersetzt.
**Rail-/Versorgungsdetails und offene elektrische Prüfungen:**
`docs/power-plan.md` (_LED-Rail noch NICHT freigegeben_).

Teilweise bestandene Meilensteine hier sind **keine Etappenabnahme**; die
Abnahme folgt erst, wenn alle geplanten Teiltests durch sind.

## Teil 1: AW9523 isoliert an I2C — BESTANDEN (07.10.2026)

### Verdrahtung (isoliert, sonst nichts)

- AW9523 (ADA4886): VIN → Feather **3V3**, GND → GND, SDA → IO3, SCL → IO4
- INT/RST offen; alle 16 Ports unbelegt; **kein** +5 V an VIN
- PN532 blieb am selben Bus (0x24, DIP 1 ON / 2 OFF); onboard MAX17048 (0x36)
- NeoPixel-Stick (bereits verlötet: 5 V/GND/DIN→IO8 über 330 Ω, DOUT offen,
  1000-µF-Elko geplant) **in diesem Test nicht angesteckt** — eine
  funktionale Stellschraube pro Vergleich

### Sketch und Build

- `firmware/tests/etappe6_aw9523_scan/etappe6_aw9523_scan.ino`
  (nur Wire-Scan alle 3 s, keine Expander-Bibliothek, Timeout 50 ms)
- Arduino-Core 3.3.12, FQBN `esp32:esp32:adafruit_feather_esp32s3_reversetft`
- Compile: 386.604 B Flash / 56.104 B RAM; `mktemp`-Build-Dir,
  Compile && Upload verkettet, esptool-Hashes verifiziert (07.10.2026)

### Ergebnis

- I2C-Scan (100 kHz) findet **0x24 (PN532)**, **0x36 (MAX17048, onboard)**,
  **0x58 (AW9523)** — stabil über mehrere Scans, keine Wiederholungsfehler
- Bewertung: AW9523 antwortet auf 0x58 → **Teil 1 BESTANDEN**; Bus mit drei
  Mitbewohnern koexistiert, kein Adresskonflikt
- Serial-Auslesung: passiv per `stty … raw` + `cat /dev/ttyACM0` (RTS/DTR
  unangetastet); Log: `docs/serial/etappe6-aw9523-scan-1.log`
  (Ausschnitt, Scans #13–#16 — Bootzeilen nicht mitgelesen, boot-Reset durch
  Upload-RTS nicht rekonstruiert)
- Monitor-Notizen: `arduino-cli monitor` blieb stumm; Rohlesen über
  `cat` funktionierte sofort. Vorgehen für kommende Etappen notiert.

### Grenzen

- Nur Presence-Check (ACK auf 0x58): keine Register-Lese-/Schreibtests,
  keine Ports getestet, keine LEDs/Taster angeschlossen.
- Scans #13–#16 beweisen kein Dauerverhalten; Fehlerzähler über längere
  Laufzeit bleibt Teil der späteren Härtung.

## Teil 2: Taster an AW9523 A0 (externer Pull-up) — BESTANDEN (07.10.2026)

### Verdrahtung

- A0 → **10 kΩ Pull-up nach 3V3** (extern, Chip hat keine internen Pull-ups)
- A0 → Taster (COM/NO), Taster → GND; unbetaetigt HIGH, betaetigt LOW
- LED (Anode A0, Kathode GND, vom Nutzer zwischendurch zum Test an-
  geschlossen) wurde nach Diagnose wieder abgeloest — LED-Last am
  Eingangspin klemmt den Pegel (Lehrstueck unten)

### V1 (VERWORFEN): falsches Register-Map aus dem Gedaechtnis

- Erste Version las Eingangszustand aus Reg **0x06** (= INTENABLE0!) und
  schrieb "LEDMODE" ins Reg **0x11** (= GCR) mit 0xFF -> globaler
  Konstantstrom-LED-Modus -> A0 dauerhaft LOW, kein Wechsel beim Druecken
- Symptombild: A0 stabil 0, i2cErrors=0, CONFIG-Readback "plausibel"
- Diagnoseweg (Rohlogs): etappe6_aw9523_diag (historisch markiert,
  fälschlich gleiche Register-Map, dafuer Selbstantrieb-Test: "treibe 1
  -> liest 0" = Hardshort-Symptom, eigentlich Sink-Modus) + Nutzer-
  Beobachtung "LED aus beim Druecken" (Sink hatte Spannungsreserve
  verloren) -> dann Abgleich gegen Adafruit_AW9523.h/.cpp auf GitHub
- Korrektes Register-Map (Quelle: Adafruit_AW9523.h, gelesen 07.10.2026):
  INPUT0=0x00, OUTPUT0=0x02, CONFIG0=0x04 (Bit 1=Eingang), CHIPID=0x10
  (muss 0x23), GCR=0x11 (nicht anfassen), LEDMODE0=0x12/0x13 (Bit
  INVERTIERT: 0=LED-Sink, 1=GPIO), SOFTRESET=0x7F (Schreiben von 0)
- Log: `docs/serial/etappe6-aw9523-taster-falschregister.log`

### V2 (BESTANDEN): `etappe6_aw9523_button/` korrigiert

- Ablauf wie lib begin(): CHIPID-Check (0x23), Soft-Reset (0x7F=0),
  LEDMODE0/1=0xFF (GPIO-Modus), CONFIG0/1=0xFF (Eingang), dann 50 Hz
  Poll von INPUT0 (0x00) Bit0; Herzschlag mit Readback alle 5 s
- Beobachtet (07.10.2026, Rohlog
  `docs/serial/etappe6-aw9523-taster-v2-ok.log`): Startzustand A0=1,
  mehrere saubere Wechsel A0 1<->0 mit Millisekunden-Zeitstempel,
  LEDMODE0=0xFF, CONFIG0=0xFF, i2cErrors=0 ueber den Beobachtungszeitraum
- PN532 (0x24) und MAX17048 (0x36) blieben geteilt am Bus — keine Fehler,
  keine sichtbaren Wechselwirkungen in dieser Kette
- Kein INT, kein Entprellen (Test sieht rohe Zustandswechsel, 50 Hz)

### Lehrstueck (gilt ueber den Chip hinaus)

1. Register-Map **nie aus dem Gedaechtnis** — auch wenn sie "plausibel
   passt"; bei I2C-Chips ist ACK nicht die Wurzel (ACK != Wert haengt).
2. Invertierte Bitbedeutungen (hier LEDMODE, CONFIG) sind ein
   Standardstolperstein; Register-Lese-/Schreibtests nur gegen die
   Refimpl der Bibliothek abgleichen.
3. Eine LED-Last direkt an einem Eingangspin veraendert die Messstrecke
   (Pegelklemmung) — Eingangspins nur Pull-up/Taster sehen lassen.

## Teil 3: NeoPixel-Stick Minimal-Rot-Test — BESTANDEN (07.10.2026)

### Verdrahtung

- Stick 5 V (VCC) → **USB 5 V** (WS2812 will 4–7 V, nicht 3,3 V), GND → GND
- DIN → **IO8 (A5)** über **330 Ω** in Reihe; DOUT offen (kein Folgestick)
- 1000-µF-Elko über 5 V/GND nahe am Stick (nutzerbestätigt verlötet)
- AW9523 blieb angesteckt (Teil-2-Konfiguration, Pins im GPIO-Eingangsmodus)

### Sketch und Build

- `firmware/tests/etappe6_neopixel_minrot/etappe6_neopixel_minrot.ino`
  (Adafruit NeoPixel 1.15.5, NEO_GRB + NEO_KHZ800, ein Pixel nach dem
  anderen, Festwert Rot 12/255 — bewusst kein setBrightness, kein
  Weiß-/All-Pixel-Test, Kindersicherheit)
- Arduino-Core 3.3.12, gleiche FQBN; Compile 360.436 B / 54.624 B RAM,
  Compile && Upload verkettet, Hashes verifiziert (07.10.2026)

### Ergebnis

- **Nutzerbeobachtung:** roter Pixel läuft sichtbar **von links nach rechts
  durch alle 8 Positionen**, gedimmt, ohne Nebenstein-/Flacker-Effekte
- Serial (Rohlog `docs/serial/etappe6-neopixel-minrot.log`): Pixel 0–7
  zirkulieren im exakt 500/501-ms-Takt über mehrere Runden, keine Drift,
  keine Lücken
- Bewertung: Datenpfad IO8→330 Ω→DIN i. O., alle 8 Pixel adressierbar,
  Farbordnung GRB bestätigt (rot wie erwartet) → **Teil 3 BESTANDEN**

### Grenzen / bekannte Risiken

- **Pegel-Risiko nicht widerlegt, nur unter dieser Konfiguration nicht
  aufgetreten:** 3,3-V-Logik gegen 5-V-Versorgung bleibt bekanntes Risiko
  bei späteren Konfigurationen (mehr Pixel an, längere Leitungen,
  andere Versorgung). Für den finalen Aufbau erneut bewerten.
- Kein Helligkeits-/Stromtest: Maximale Auslastung (alle 8 Pixel weiß)
  bewusst nicht getestet; Strombudget bleibt Thema power-plan.
- Nur USB-Betrieb, kein Akku.

## Teil 3a: DT44L12 (44 mm, 12-V-LED-Einheit) an USB-5 V — VERHALTEN GETESTET (07.10.2026)

- **Nutzerbeobachtung (07.10.2026):** Die als 12 V spezifizierte LED-
  Einheit **leuchtet auch an 5 V** — beidpolig getestet, Direktanschluss
  an die USB-5-V-Rail (interne Vorwiderstände begrenzen den Strom).
  Helligkeit laut Nutzer **„klar sichtbar“** (ausreichend für
  Kind-Erkennbarkeit); Stromaufnahme an 5 V noch nicht gemessen.
- Bewertung: 12-V-Design ist kein Blocker mehr. Damit sind DREI Optionen
  offen: (a) 12-V-Step-Up nachbestellen, (b) Deko-LEDs weglassen,
  (c) gemeinsame **5-V-LED-Rail** für alle Button-LEDs (AB30L5 sind eh
  5-V-Einheiten).
- Offen vor einer Rail-Entscheidung: Helligkeit an 5 V ausreichend
  (Kind-Erkennbarkeit)? Stromaufnahme an 5 V (Multimeter in Serie) fürs
  Strombudget; Port-Spannungsgrenzen am AW9523 im Konstantstrom-Modus
  (siehe `docs/power-plan.md`); Dimm-/Langzeitverhalten.
  **Keine Anschlussfreigabe an AW9523-Ports aus diesem Test.**

## Teil 3b: TPS61023-Boost isoliert (EN-Verhalten + Ausgangsspannung) — BESTANDEN (07.10.2026)

- Aufbau: IN → USB-5-V-Rail, GND → GND, OUT **ohne Last**, nur Multimeter.
- Messfolge (Nutzer, 07.10.2026, Multimeter DC):
  1. EN offen: **high** (Onboard-Pull-up, Wert entspricht Erwartung)
  2. OUT unbelastet: **~5,2 V** (Max. 5,5 V am MAX98357A bleibt Kontext —
     dort hängt nichts)
  3. **EN → GND gebrückt: OUT → 0 V** (True Disconnect bestätigt)
  4. Brücke gelöst: OUT wieder ~5,2 V
- Nutzerbestätigung: „alles so wie du gesagt hast“ — exakte Ziffern
  wurden nicht separat notiert; als Messung zählt die Bestätigung des
  Erwartungsbilds (EN-high, 5,2-V-Ausgang, 0 V bei EN-Low, Rückkehr).
- Grenzen: unbelastet — kein Lasttest am Boost-Ausgang; keine Rail-
  Anbindung, kein Verbraucher an OUT; MAX98357A-Boost-Vergleich
  (lauter/Verzerrung) separat und nicht Teil dieses Tests.

## Nächste Teiltests (geplant, nicht bestanden)

- ~~Teil 4: Encoder EC11~~ **auf Breadboard entfällt laut Nutzerentscheidung
  (07.10.2026):** EC11 wird erst in der fertigen Box verlötet und dort
  erstmals getestet. Konsequenzen für den Endaufbau:
  - Pins IO15 (A), IO14 (B), IO12 (Taster) bleiben reserviert (pinout.md
    folgt), C → GND, alle INPUT_PULLUP.
  - C-Pin-Verifikation (Durchgangsprüfer: C schaltet beim Drehen
    abwechselnd gegen A/B) **muss vor dem Verlöten** im Endaufbau passieren.
  - Encoder ist damit **nie elektrisch vorgeprüft** — Defekt-/Verwechslungs-
    risiko wandert komplett in die Endmontage; Test dort nachholen und
    ins Endaufbau-Protokoll.
- Danach erst: 44-mm-LED-Verhalten an 5 V, Boost-EN, LED-Rail — nur nach
  Schaltplanprüfung in `docs/power-plan.md`
- Teil 2b (LED-Ausgang am AW9523) **entfällt laut Nutzerentscheidung
  (07.10.2026)** — LED-Ansteuerung über Ports kommt erst mit den
  Button-LED-Rail-Tests zur Sprache (`docs/power-plan.md`)
