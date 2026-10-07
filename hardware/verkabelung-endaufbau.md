# Verkabelungsplan Endaufbau — Boxbert

Stand: **07.10.2026**. Grundlage: `hardware/pinout.md` (Pin-Wahrheit),
`docs/kernwerte.md` (Bauteilwerte), `docs/power-plan.md` (Rails,
Entscheidungen), `hardware/BOM.md` (Bestand). Pins nie aus dem Gedächtnis
— jeder Anschluss wird gegen die Modul-/Feather-Silkscreen verdrahtet,
nicht gegen eine Tabellenposition.

**Status-Systematik in diesem Plan:**
- **[bestätigt]** = wurde schon an dieser Hardware erfolgreich getestet
- **[geplant]** = wird erstmals im Endaufbau verdrahtet; zuerst prüfen,
  dann Testprotokoll
- **[offen]** = elektrische Freigabe fehlt noch, Testpfad im Plan

## 0. Sicherheitsregeln für den Aufbau (Vorrang vor allem anderen)

1. **Akku erst ganz zum Schluss** ans Board — wenn alles am USB läuft
   und geprüft ist (AGENTS.md).
2. **Hauptschalter (Feather-EN↔GND) während des gesamten Aufbaus auf
   AUS** und USB nur zum Testen kurz dran.
3. **Kein +5 V auf eine 3V3-Rail.** AW9523-VIN, PN532-VCC, Feather-Logik
   sind 3,3 V. Boost-Ausgang (5,2 V) nur an SD-Modul und NeoPixel.
4. **PN532-HSU nie an GPIO** — HSU-TXD isoliert 4,1 V gemessen, Feather
   nicht 5-V-tolerant. I2C wie bestätigt, DIP 1 ON / 2 OFF.
5. Lautsprecher **nur zwischen Amp-Ausgang + und −**, nie gegen GND.
6. Nach jedem Subsystem: Spannungen messen, BEVOR das nächste dran kommt.

## 1. Versorgung / Rails [geplant]

```
LiPo JST-PH ──► Feather BAT-Buchse
LiPo JST-PH ──► TPS61023 IN   (direkt an der Akku-Buchse abgreifen,
                                nicht über den BAT-Header-Pin)
TPS61023 EN ──► Feather IO9    (Breakout-Pull-up bleibt drin)
TPS61023 OUT (5,2 V) ──► SD-Modul VCC, NeoPixel 5V
USB-C ──► Feather (Laden läuft unabhängig von allem)
```

- **[bestätigt]** Boost: EN/True Disconnect/5,2 V unbelastet (Etappe 6).
- **[offen]** Boost-Einschaltspitzen unter SD-Last und Gesamt-Sleep-
  Strom — erst im Aufbau messen.
- **MAX98357A VIN → BAT (Akku-Spannung).** Begründung: Nutzer-Hörtest
  07.10.2026 „Lautstärke USB vs. Akku gleich" (bei Volume 6/21), 2,7–5,5
  V passt, kein Boost-Strombedarf (1 A out = 1,8 A in). Falls später
  lauter gewünscht: VIN auf Boost-Ausgang umziehen (max. 5,5 V beachten).
- SD-Modul VCC → Boost-Ausgang **[geplant]** (Modul-Regler verträgt
  5,2 V, AMS1117-Klasse — Einschaltspitzen beobachten).

## 2. Feather-Header — Gesamtablauf [bestätigt soweit verdrahtet]

**Fazit (07.10.2026): Der Feather ist zu 100 % belegt** — jede
herausgeführte GPIO hat eine Aufgabe oder ist reserviert (IO11 für PN532-
IRQ). Erweiterungen laufen ab jetzt über den AW9523 (7 freie Ports) bzw.
einen zweiten Expander mit anderer I2C-Adresse. Konsequenz fürs Lötern:
Erst nach Doppelkontrolle löten — vertauschte Pins über den Button-
Test-Sketch vor der Gehäusemontage finden.

**Amp SD/Mode-Pin nicht vergessen:** → 3V3 (bestätigte Konfiguration,
sonst schaltet der Amp in Shutdown/tri-state).

**Pad „DB" am rechten Header-Ende:** GPIO-Zuordnung in unseren
Unterlagen nicht verifiziert — nicht verdrahten.

Direkt am Feather (ohne AW9523):

| Feather-Pin | Funktion | Modul-Pin | Status |
|---|---|---|---|
| IO3 (SDA) | I2C-Daten | PN532 SDA **und** AW9523 SDA | [bestätigt] PN532; AW9523-Scan 0x58 bestätigt |
| IO4 (SCL) | I2C-Takt | PN532 SCL **und** AW9523 SCL | [bestätigt] |
| IO16 (A2) | I2S-Daten | MAX98357A **DIN** | [bestätigt] Klon-Pinorder prüfen: VIN,GND,SD,GAIN,DIN,BCLK,LRC |
| IO17 (A1) | I2S-Takt | MAX98357A BCLK | [bestätigt] |
| IO18 (A0) | I2S-LR-Clock | MAX98357A LRC | [bestätigt] |
| IO10 | SD-Chip-Select | SD CS | [bestätigt] 4 MHz |
| IO36 (SCK) | SPI-Takt | SD SCK | [bestätigt] |
| IO35 (MO) | SPI-MOSI | SD MOSI | [bestätigt] |
| IO37 (MI) | SPI-MISO | SD MISO | [bestätigt] |
| IO5 | Wake-Button 1 (z. B. Play/Pause) | Button-Schalter A → IO5, B → GND | [bestätigt] als Taster (Etappe 3); INPUT_PULLUP |
| IO6 | Wake-Button 2 | Button-Schalter A → IO6, B → GND | [geplant] Wake noch nicht getestet |
| IO14 (A4) | Encoder B | Encoder B | [geplant] |
| IO15 (A3) | Encoder A | Encoder A | [geplant] |
| IO12 | Encoder-Taster | Encoder SW | [geplant] |
| IO9 | Boost-EN | TPS61023 EN | [geplant] (Decision B1) |
| IO8 (A5) | NeoPixel-Daten | Stick DIN über **330 Ω** | [bestätigt] Minimal-Rot (Etappe 6) |
| IO38 | Kippschalter 2 (10014) | Schalter A → IO38, B → GND, INPUT_PULLUP | [geplant] |
| IO39 (TX) | 24-mm-Button 1 | Schalter A → IO39, B → GND | [geplant] |
| IO13 | 24-mm-Button 2 (optional) | Schalter A → IO13, B → GND. **Quirk:** Onboard-LED leuchtet mit dem Schalterzustand — wer das stört: Button nicht anschließen (mechanisch lassen) | [geplant] |
| — | Hauptschalter | Kippschalter 10020: Mitte ↔ Feather-EN, Ende ↔ GND | [geplant] |
| IO38, IO39(TX), IO13( LED) | (siehe oben) | IO11 = reserviert PN532-IRQ (Wake per Tag, später) | — |

**Nicht anfassen:** IO0/1/2 (Onboard-Taster), IO7 (TFT/STEMMA-Rail),
IO13 nur mit Bewusstsein (Onboard-LED leuchtet mit), IO21/IO33
(Onboard-NeoPixel), IO40–42/45 (TFT).

## 3. PN532 [bestätigt — unverändert übernehmen]

| PN532-Pin | Feather |
|---|---|
| VCC | 3V3 (bleibt dauerhaft an — Entscheidung 07.10.2026) |
| GND | GND |
| SDA | IO3 |
| SCL | IO4 |
| DIP-Schalter | **1 ON / 2 OFF** (I2C, Adresse 0x24) |
| IRQ / RST / SPI-Pins | nicht verbunden (IO11 bleibt für spätere IRQ-Erweiterung frei) |

## 4. AW9523 — Ports-Belegung [geplant]

**Nutzerentscheidung 07.10.2026: keine Button-LEDs.** Die 44-mm-/30-mm-
LED-Einheiten bleiben unverbunden (44-mm-12-V-LEDs und AB30L5-LEDs sind
nicht angeschlossen); alle visuellen Signale übernimmt der NeoPixel-Stick
(Farbe/Helligkeit in der Firmware). Damit entfällt auch die 5-V-LED-Rail
und der offene AW9523-LED-Portgrenzen-Test. Erkenntnis bleibt in
docs/findings.md für einen späteren Umbau erhalten.

VIN → Feather **3V3** (niemals +5 V), GND gemeinsam, SDA/SCL → IO3/IO4.
Adresse 0x58. **Keine internen Pull-ups im Chip** — jeder Tastereingang
braucht **externen 10 kΩ nach 3V3**; Taster andere Seite GND.

**Port-Budget (voll ausgenutzt, Stand 07.10.2026):** Alle Schalter sollen
angeschlossen werden — dazu wandern 3 Eingänge direkt an freie Feather-
GPIOs (IO38 = Kippschalter 2, IO39 = 24-mm-Button 1, IO13 = 24-mm-Button
2 mit LED-Quirk), damit alles passt:

| AW9523-Port | Funktion | Detail |
|---|---|---|
| P00 | DT44L12-R Schalter | + externer 10 k Pull-up |
| P01 | DT44L12-B Schalter | + externer 10 k Pull-up |
| P02 | AB30L5-Schalter #3 | + externer 10 k Pull-up |
| P03 | AB30L5-Schalter #4 | + externer 10 k Pull-up |
| P04 | AB24OL-Button 3 | + externer 10 k Pull-up |
| P05 | AB24OL-Button 4 | + externer 10 k Pull-up |
| P06 | Mini-Drucktaster 1 | + externer 10 k Pull-up |
| P07 | Mini-Drucktaster 2 | + externer 10 k Pull-up |
| P10 | Mini-Drucktaster 3 | + externer 10 k Pull-up |
| P11–P17 | **frei** (LED-Entscheidung 07.10.2026) | Reserve für spätere Ideen |

Verteilung: 9 Schalter auf 10 Ports (P00–P07, P10); P11–P17 frei. Die
AB24OL-Buttons 1/2 sitzen an IO39/IO13 (Feather-GPIOs, interne Pull-ups
reichen dort), Button-Schalter der AB30L5 #1/#2 an IO5/IO6 (Wake).

## 4b. Encoder EN2424-6T20 [geplant]

| Encoder-Pin | Feather | Detail |
|---|---|---|
| A | IO15 (A3) | externer 10 kΩ Pull-up nach **3V3** (rechtsdrehbar sauber lesen; interne Pull-ups reichen prinzipiell, extern ist stabiler) |
| B | IO14 (A4) | externer 10 kΩ Pull-up nach 3V3 |
| SW (Taster) | IO12 | externer 10 kΩ Pull-up nach 3V3 (bzw. INPUT_PULLUP) |
| + / LED-Versorgung | **3V3** | kweine 5 V: Falls das Modul interne Widerstände hat, ziehen die nach VCC — A/B/SW dürfen max. 3,3 V an den GPIO legen. Falls das Modul eine LED hat, ist sie an 3,3 V evtl. dunkel — Module/Silkscreen/Datenblatt VORHER prüfen |
| − | GND | gemeinsam |

## 5. NeoPixel-Stick [bestätigt Verlötung, Rest geplant]

- Stick 5 V/GND → **Boost-Ausgang** (Rail), GND gemeinsam mit Feather.
- **1000 µF Elko** direkt am Stick (+/−), **DIN über 330 Ω** von IO8
  (Lötstand: DIN→IO8 fertig, Elko einbauen).
- DOUT offen (kein Folgestick).
- Pegel 3,3 V-Daten auf 5-V-Pixel: im Etappe-6-Test gelaufen — beim
  Endaufbau mit neuer Kabellänge erneut gegenprüfen (Kabellänge kurz
  halten, 330 Ω am Pixelende).

## 6. Lautsprecher [bestätigt Komponente, Gehäuse-Sitz neu]

ADA3351 (4 Ω / 3 W) **nur** an MAX98357A +/− (zwei Adern, kein GND-Bezug).
Amp-Ausgänge sind Brücke (BTL). GAIN offen = 9 dB. Adern verdrillt legen,
weg vom I2C/I2S, NFC-Antennenbereich meiden.

## 7. Werkstatt-Tipps (aus echten Ausrutschern + Standardpraxis)

1. **Silkscreen ist die Wahrheit.** Der MAX98357A-Klon hat eine andere
   Pinreihenfolge als das Adafruit-Original (VIN,GND,SD,GAIN,DIN,BCLK,
   LRC). Pro Draht: Modul-Beschriftung lesen → Feather-Beschriftung
   lesen → stecken/löten. Durchgangsprüfer bestätigt fröhlich die
   eigene irrige Annahme.
2. **Erst verkabeln, dann Durchgangsprüfung, dann Strom.** Jede Kabel-
   verbindung gegen die Tabelle durchklingeln — falsch verdrahtete
   Rail schlägt gleich mehrere Module gleichzeitig kaputt.
3. **Reihenfolge:** Rails bauen → mit USB (ohne Akku!) Spannungen prüfen
   (Boost-Ausgang 5,2 V, 3V3-Rails sauber, keine Erwärmung) → Module
   EINZELN zuschalten und testen → erst dann Akku. Nie alles auf einmal
   verdrahten und dann den ersten Strom geben.
4. **Sternmasse / gemeinsamer GND:** alle GND-Pfade zum selben Punkt
   (Feather-GND bzw. Dickader-Knoten). Keine Daisy-Chains über Module,
   vor allem nicht über den NeoPixel-Stick (GND-Last).
5. **Power-Adern dimensionieren:** Boost-Eingang (bis ~1,8 A) und
   Boost-Ausgang (bis 1 A) mit ≥ 0,5 mm² bzw. ordentlicher Litze;
   Signaladern dünn. I2C kurz und weg von Boost-/Speaker-/NeoPixel-
   Adern (Störungen); Speaker-Adern verdrillt.
6. **NFC-Antennenlage:** PN532-Antenne weg vom Lautsprechermagneten,
   von Metall/Masseflächen und von NeoPixel/Boost (Wärme + Störungen).
   Lesereichweite im Einbau testen, bevor das Gehäuse zu ist.
7. **Kein Hot-Plug:** Module nie umverdrahten, solange USB/Akku dran
   ist. Erst abklemmen — Flash/Reset ist kein Power-Cycle (Etappen-
   Lektion).
8. **Beschriften/strukturieren:** Adernendhülsen oder beschriftete
   Kabelbinder, Litzen­farben-Code festlegen (z. B. Rot=5V-Rail,
   Schwarz=GND, Gelb=3V3, Blau=Daten) — jede Session dankt es dir.
9. **Zugänglichkeit einplanen:** SD-Slot muss erreichbar bleiben (Karten-
   wechsel ohne Gehäuseöffnung), TFT sichtbar, microSD nach
   `~/sd-card`-Konvention einspielen (mounten, dann kopieren!).
10. **Kindersicherheit:** alles verschraubt von hinten, Akku fest und
    kurzschlussgesichert, keine scharfen Kanten, keine verschluckbaren
    Kleinteile außerhalb des verschraubten Innenraums. Akku JST-Polung
    VOR dem ersten Anschließen gegen das Feather-Pinout prüfen.
11. **Boost-EN-Verifikation nicht vergessen:** sobald Etappe-8-Firmware
    läuft — Sleep starten, am Boost-Ausgang 0 V messen (True Disconnect
    nachweisen).

## 8. Abnahme-Reihenfolge (Vorschlag, je Teil eigenes Kurzprotokoll)

1. Rails mit USB (ohne Akku, Boost-EN manuell HIGH via IO9-Test-Puls? —
   nein: erst Stromversorgung statisch prüfen, Boost-Ausgang mit EN-Pin
   in Firmware HIGH) — Spannungen messen
2. PN532 + AW9523 am I2C: Scan (0x24 + 0x58) — Bus-Sharing erster Test
3. SD am Boost-Ausgang: Dateiliste, Playback
4. Encoder: A/B-Drehen + Taster
5. AW9523-Buttons: Lesen aller Schalterports
6. NeoPixel am Boost-Rail: Minimal-Rot
7. Gesamtmonitor-Sketch mit TFT: alles gleichzeitig
8. Akku ran (Polung!), laden, Akku-only-Betrieb
9. Etappe-8-Firmware: Auto-Sleep, Wake-Button, 0-V-Nachweis am Boost,
   Gesamtsystem-Sleep-Strom (µA)