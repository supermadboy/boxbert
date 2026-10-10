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

**Status 04.10.2026: Etappen 0–5 als Breadboard-Meilensteine bestanden.**
Etappe 4: zwei NFC-Tags wechseln SD-Musik, optimierter Hoertest bestaetigt.
Etappe 5: Handy-Webseite, MP3-Upload, Tag-Zuordnung und Wiedergabe laut
Nutzer erfolgreich, Zuordnung **und Wiedergabe nach RESET** bestaetigt.
Aktuell geflasht: `firmware/tests/etappe5_web_upload/` (Arduino-Core 3.3.12,
SD 4 MHz, NFC-Pause 200 ms, Volume 6/21, USB-only; privates `Secrets.h`
git-ignored). Etappe-4-Player bleibt unveraenderte Referenz im Repo.
Aktueller Arbeitsstand/nächste Schritte in `To-Do.md`; Flash-Inhalt vor
Tests verifizieren. Fahrplan/Abnahmeumfang: `docs/breadboard-testing.md`,
`docs/testprotokoll-etappe4.md`, `docs/testprotokoll-etappe5.md`.
Dauertests/Produktreife nicht mit der Breadboard-Abnahme gleichsetzen.
Entwicklungsumgebung ist eingerichtet; Reproduktion in `docs/dev-setup.md`.

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
  2 MB PSRAM, LiPo-Lader onboard). Aktuelle Firmwarebasis bleibt WLAN-only.
  BLE ist hardwareseitig möglich, aber die Gesamtfirmware mit BLE ist noch
  nicht gebaut; Flash-/RAM-Machbarkeit und Updatepartitionierung sind offen
  (`ideen/ble-wifi-wechsel/machbarkeit.md`). Keine BLE-Funktionszusage daraus.
- **Audio:** MAX98357A (ADA3006, I2S) — im Breadboard an USB-5 V, im finalen
  Aufbau an Akkuspannung oder Boost (Entscheidung nach Hörtest). Lautsprecher:
  ADA3351-Gehäuselautsprecher 4 Ω / 3 W (kein 40/50-mm-Vergleichspaar, nur
  einer bestellt).
- **Boost:** TPS61023 MiniBoost (ADA4654, nominal 5,2 V / 1 A, Enable-Pin).
  EN Low = True Disconnect **nur für Verbraucher hinter seinem Ausgang**.
  Aktueller Amp/PN532 hängen nicht dort; fertige Akku-/Sleep-Rails noch
  offen (`docs/power-plan.md`). MAX98357A max. 5,5 V; vor Anschluss
  Boost-Ausgang prüfen, 5,2 V nominal ist keine eigene Modulmessung.
- **NFC:** PN532 aktuell **I2C**: SDA IO3, SCL IO4, VCC 3V3, DIP 1 ON /
  2 OFF, Adresse 0x24, 100 kHz. UID-Lesen und NFC+SD+Audio neu geprueft,
  Nutzer-Hoertest bestaetigt. Timeout 0 nur in eigener NFC-Task mit Queue,
  nicht im Audio-Hauptloop; Pause 200 ms. Spaetere Wire-Nutzer (AW9523 /
  Fuel Gauge) synchronisieren. Fruehere Fehler nicht pauschal als
  Clock-Stretching-/Hardwaredefekt erklaeren. **Pegel je Modus pruefen:**
  Unterlagen nennen HSU/I2C 5-V-TTL; konkreter I2C-Ruhepegel laut Nutzer
  3,3 V. HSU-TXD/SDA isoliert **4,1 V bei VCC=3,27 V** gemessen;
  niemals direkt an RX/IO38, HSU ohne Pegelwandler gesperrt. Feather
  nicht 5-V-tolerant. Zwei bestaetigte Tags haben 4-Byte-UIDs, Chiptyp
  offen; bestellte NTAG215 nicht aus Hinweistext als identifiziert werten.
  Verbindliche UID-/Liedzuordnung: `hardware/nfc-tags.md`.
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
- **GPIO-Erweiterung:** AW9523 (ADA4886, I2C, 16 Kanäle, 0x58), am Feather
  **VIN 3V3**, niemals +5 V auf diese Rail. Keine internen Pull-ups:
  Taster brauchen externe 10 kΩ. Nur LED-Modus ist Konstantstrom-Senke;
  GPIO-Modus begrenzt LED-Strom nicht automatisch. Integrierte Button-
  Vorwiderstände bleiben erhalten. 5-V-LED-Portansteuerung erst elektrisch
  prüfen/freigeben; Details und Quellen in `docs/power-plan.md`.
- **Stromsparen:** Deep Sleep (~40–50 µA Board-Richtwert, kein gemessener
  Gesamtsystemstrom), Aufwachen nur über
  RTC-GPIOs 0–21 (daher Wake-Buttons auf IO5/6/11, nie über den AW9523),
  Auto-Sleep nach Inaktivität. PN532-Standby ist hoch (~10–13 mA) — im Sleep
  abschalten. Dafür separate PN532-3,3-V-Abschaltung planen; Boost-EN,
  Feather-EN und TFT/STEMMA-Power sind verschiedene Funktionen.
- **Kippschalter als Hauptschalter:** zwischen EN und GND — schaltet das Board
  ab, Laden über USB geht trotzdem weiter.

## Quellenzuständigkeit — Widersprüche nicht weginterpretieren

| Frage | Maßgebliche Datei |
|---|---|
| Arbeitsweise und Sicherheitsregeln | `AGENTS.md` |
| Aktueller Arbeitsstand / nächste Schritte | `To-Do.md` |
| Pins / bestätigte Verkabelung | `hardware/pinout.md` |
| Tatsächlich vorhandene Teile | `hardware/BOM.md` (Kaufbeleg: `docs/bestellliste.md`) |
| Bauteilwerte | `docs/kernwerte.md` mit Datenblatt-/Herstellerquellen |
| Nachgewiesene Tests / Messwerte | datierte Testprotokolle, Rohlogs, Nutzerbestätigungen |
| Aktuelle Entscheidungen / Begründungen | `docs/entscheidungen.md` |
| Gehäuse / bestätigtes Mount-Prinzip | `hardware/gehaeuse-konzept.md` |

Bei Widersprüchen **stoppen, Quellen prüfen und klären** — nicht einfach
jüngere, bequemere oder häufiger wiederholte Angabe wählen. Historie /
Archiv / Foren-Findings sind kein Ersatz für aktuelle Anschlussfreigaben.
Datierter Dokumentationsstand beweist nicht den aktuellen Flash-Inhalt.
Noch geplante Teile/Rails nicht als bereits aufgebaut/getestet behandeln.

## Pins — nie aus dem Gedächtnis

Pin-Vorschläge ausschließlich aus `hardware/pinout.md`. Neue Pins vorher
gegen die Board-Definition prüfen (`pins_arduino.h` der Variante
`adafruit_feather_esp32s3_reversetft` im arduino-esp32-Repo, Befehl steht in
pinout.md). Der erste Breadboard-Plan hatte sechs falsche Pins, weil sie
aus allgemeinem ESP32-Wissen geraten waren.

Kurzregeln: **PN532 auf I2C IO3/IO4, SD auf SPI IO36/35/37, CS IO10.**
IO9/IO38 sind fuer NFC nicht mehr belegt. Weitere SPI-Geraete brauchen
eigenen CS (Onboard-TFT hat IO42); alte SPI-/HSU-Plaene sind archiviert.
**IO7 nicht anfassen**
(schaltet TFT/STEMMA-QT-Rail, nicht allgemeinen 3V3-Header),
**IO33/IO21 sind Onboard-NeoPixel-Daten/Power**,
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
  oft eine andere Pinreihenfolge als das Original. **Korrektur 09.10.2026:**
  Unser MAX98357A passt laut Nutzerfoto/-bestätigung zum bestellten ADA3006;
  die alte Klon-Einordnung war nicht belastbar. `VIN, GND, SD, GAIN, DIN,
  BCLK, LRC` passt von der VIN-Seite gelesen auch zum Herstellerfoto
  (`docs/cad/2026-10-09-max98357-mount/`). Verkabelung
  **nie positionsgleich durchverbinden**; pro Draht: Modul-Beschriftung
  lesen → Feather-Beschriftung lesen → stecken. Der Durchgangsprüfer
  bestätigt sonst fröhlich die eigene irrige Annahme.
- **Genau den erfolgreich kompilierten Build flashen.** Eindeutiges
  Build-Verzeichnis verwenden; `compile && upload --input-dir "$build_dir"`
  verketten (vollständiger Befehl in `docs/dev-setup.md`). Bei Compile-
  Fehler nie uploaden — sonst geht möglicherweise ein altes Binary raus.
  Board-Defaults einschließlich QSPI-PSRAM beibehalten, kein `PSRAM=opi`.
  Build-Pfad, Board-Optionen und Upload-Ergebnis ins Protokoll. Upload-
  Fehler („exit status 2") ansehen; `ls /dev/ttyACM*` als Port-Gegencheck.
- **Lautstärke vor dem Ton denken.** Kindersicherheit gilt auch im
  Breadboard-Test: Testtöne immer mit minimaler Aussteuerung starten und
  nur in Stufen hoch. Kind im Raum = leise Stufen, keine Maximallautstärke-
  Tests. MAX_AMP/Volume sind keine dB(A)-Messung oder Normgarantie;
  vor Sicherheitsfreigabe passende akustische Bewertung durchführen
  (`docs/audio-safety.md`), keine pauschalen 65/85-dB-Grenzen übernehmen.
- **Doku direkt nach jedem Test**, nicht „später": Messwerte mit Datum
  ins Protokoll, neue Erkenntnisse in `docs/findings.md` nachtragen.

## Arbeitsregeln aus Etappe 4 (04.10.2026)

Belege und Beispiele: `docs/testprotokoll-etappe4.md`, Rohlogs in
`docs/serial/`. Zusätzlich zur Fehler-Checkliste oben:

- **Flash/Reset ist kein Power-Cycle der Peripherie.** Der PN532 bleibt
  beim Feather-Reset möglicherweise versorgt und im bisherigen Zustand.
  Nach Initfehler nicht sofort umverdrahten oder wiederholt flashen:
  laufenden Sketch identifizieren, bei Bedarf einen gezielten USB-
  Power-Cycle mit weiterhin getrenntem Akku durchführen und dokumentieren.
- **Serial-Beobachtung soll den Versuch nicht verändern.** Zunächst
  passiv lesen, keinen unbeabsichtigten Reset über DTR/RTS auslösen
  (Monitorverhalten prüfen). Bei geplantem Kaltstart Leser vorher öffnen.
  Fehlende Boot-Zeilen nicht rekonstruieren; Rohlogs mit Datum, Variante
  und Einstellungen sichern, Ausschnitte als solche kennzeichnen.
- **Messstrecke und Nachweis präzise benennen.** Zeitstempel an relevante
  Ereignisse: UID erkannt → Datei geöffnet → Stream bereit. Das ist nicht
  Tag aufgelegt → erster hörbarer Ton. Datei-/Decoder-Erfolg und Nutzer-
  Hörtest getrennt behandeln; wiederholter „bereit“-Text beweist keine
  neue erfolgreiche Hardwareabfrage.
- **Eine funktionale Stellschraube pro Vergleich.** Funktionierenden
  Referenzstand sichern, erst messen, dann einzelne Änderung testen und
  Ergebnis direkt dokumentieren. Nicht gleichzeitig Verdrahtung,
  Bibliothek, Timeout und Takt ändern. Erfolgreiche Referenz-Sketches
  unverändert lassen, Experimente separat halten; verworfene Varianten
  eindeutig als historisch kennzeichnen.
- **Bestätigt, vermutet und ungeprüft trennen.** Frühere Agentenaussagen
  sind keine Abnahme. Logs, Nutzerbeobachtungen, Hypothesen und offene
  Tests getrennt ausweisen. Ein ausdrücklich akzeptierter Breadboard-
  Meilenstein ist keine Produkt-/Dauerprüfung; nicht durchgeführte Tests
  als spätere Härtung in `To-Do.md` erhalten, nie als bestanden ausgeben.

## Einzel-Mounts / CAD — Übergabe 09.10.2026

Vor einem Mount-Auftrag **`docs/mounts-weiterarbeit.md` und
`hardware/gehaeuse-konzept.md` lesen**, dazu den CAD-Abschnitt in
`docs/findings.md`. „Mount für GPIO-Expander“ meint **AW9523 / ADA4886**
aus der BOM, nicht MCP23017. Ein kurzer neuer Bauauftrag reicht aus;
das bereits bestätigte Grundprinzip nicht erneut zur Diskussion stellen.
Ein nur angekündigter/zitierter Folgeprompt ist noch kein Bauauftrag.

- Aktuelle Stilvorlage: **`3d-print/mounts/stepup-mount/`**, Nutzer hat
  die neue Senkkopf-Version ausdrücklich positiv bewertet. Kein gedruckter
  oder mechanisch abgenommener Referenz-Mount! Dessen Unterordner
  `archive/rejected-2026-10-09/` ist verworfen, niemals als Vorlage nutzen.
- Regelmäßiger, durchbrochener Gitterboden; einzelne Abstandspfosten,
  Einsätze bündig. **Keine Wände, Mulde oder erhöhte L-Auflage.**
  Lokale Füße/Verstärkungen erlaubt, Raster muss sichtbar bleiben.
- Holzbox außen 250 × 180 × 110 mm, **12 mm Pappelsperrholz**,
  Deckel/Boden abschraubbar. **3 × 12 mm Senkkopf-Holzschrauben** für
  Mounts, nicht M3-Maschinengewinde, nicht M4. Fabrikat/Kopfpassung und
  Vorbohrung noch prüfen; nichts als bereits gekauft ausgeben.
- Step-Up-Vorlage: 2-mm-Boden, 4-mm-Zellen/2-mm-Rippen, 8-mm-Pfosten
  über Gitter; Holz-Schraubpolster lokal 3,5 mm, Durchgang Ø 3,2,
  Senkung Ø 6,2 / 90°. Das sind Entwurfsparameter, **kein universelles
  Modul-Lochbild oder Außenmaß**. Lochanzahl zur Holzbefestigung bislang
  nur für den Step-Up entschieden, nicht pauschal auf jedes Modul übertragen.
- ruthex RX-M2,5×5,7 laut Nutzer bestellt: offizielles Einbauloch Ø 4,0,
  Tiefe min. 6,7, Wand min. 1,6 mm; Quellen in Kernwerten/Mount-README.
  Neue PCB-Löcher erst gegen M2,5 prüfen; nicht aufbohren oder Schrauben
  erzwingen. Zwei mittige massive Stützpfosten waren die **Step-Up-Lösung
  wegen nur eines Montagelochs**, kein Pflichtdetail für andere Module.
- Neues Modul separat anlegen, bestehendes Step-Up-Modell unverändert
  erhalten. Erst BOM/Kernwerte und echte Hersteller-PCB-Daten/Fotos
  prüfen; keine Maße, Lötstellenhöhen oder Schraubenlängen erfinden.
  Fotos zunächst selbst recherchieren, Nutzer nur bei realer Unklarheit fragen.
- Vorschauen ohne **und mit transparenter Platine**, STL nur Mount.
  `render.sh` (OpenSCAD/CGAL, offscreen) und `check_mesh.py` als technische
  Vorlage; Prüfkoordinaten/Bounds an neues Modul anpassen, keine alten
  Erfolgslogs wiederverwenden. Export + tatsächliche STL + Bilder prüfen.
  CAD-Erfolg ist keine Passungs-/Kindersicherheitsfreigabe.

## Findings-Datenbank

Erfahrungswissen von echten Menschen (Foren, Blogs, GitHub-Issues) zu genau
unseren Bausteinen — I2S-Knackser, SD/FAT32, SPI-Bus-Sharing, WS2812-Pegel,
Deep-Sleep-Realwerte — steht gebündelt in `docs/findings.md`. **Vor jedem
eigenen Debug-Marathon dort nachsehen**, ob das Problem schon dokumentiert
ist. Eigene Erkenntnisse aus Testprotokollen dorthin nachtragen — nur mit
echter Quelle oder eigener Messung, kein KI-generiertes Blabla.

## Ideendatenbank — ein Punkt pro Session

Daddelbert möchte **genau einen Punkt pro Session** besprechen. Index mit
Status, Name und Beschreibung: `ideen/README.md`; jede Idee hat einen eigenen
Ordner mit ihrer Ausarbeitung. Zu Beginn gemeinsam einen Eintrag wählen,
am Ende Ausarbeitung und Index aktualisieren. Keine anderen Ideen ungefragt
vorziehen. Ideen sind noch keine Bauaufträge; verbindliche Hardwareentscheidungen
bleiben in den zuständigen Fachdateien, konkrete Arbeit in `To-Do.md`.

## Offene Fragen

- Welcher Button (44/30/24 mm, welche Farbe) bekommt welche Funktion
  (Play/Pause, Vol, Skip, …) — im Breadboard-Test herausspielen, Ergebnis
  nach `hardware/` dokumentieren.
- 44-mm-LEDs (12 V): 12-V-Step-Up nachbestellen oder Deko-LEDs weglassen —
  nach Verhaltenstest an 5 V entscheiden. **ENTSCHIEDEN 07.10.2026:**
  keine Button-LEDs, NeoPixel übernimmt alle visuellen Signale
  (`hardware/verkabelung-endaufbau.md`).
- Boost-Ausgang an MAX98357A: ja/nein, je nach Hörtest (lauter, aber mehr
  Strom und Verzerrungsrisiko an der 5,2-V-Grenze).
- Arduino-Framework vs. ESP-IDF für die Firmware (Sprint-4-Entscheidung;
  für Breadboard-Etappen 0–4 nicht relevant).
- Gehäuse: Bohrbild/Lautsprecher-Einbau erst nach Hörtest planen.

## Konventionen

- **Daddelberts Rechner ist Arch Linux** (Hyprland/Wayland) — kein WSL, auch
  wenn der PATH so aussieht. Setup-Protokoll: `docs/dev-setup.md`. Bei
  Serial-Ports gilt die Gruppe `uucp` (Arch), nicht `dialout` (Ubuntu).
- **microSD immer nach `~/sd-card` mounten** (Nutzerkonvention):
  `sudo mount -o uid=$(id -u),gid=$(id -g) /dev/sda1 ~/sd-card` —
  danach landen Musikdateien dort und `sync` + `sudo umount` vor dem Ziehen.
  Kein udisks/gvfs auf dem Rechner; ohne sudo-Option uid/gid schreibt nur root.
  ⚠️ **Erst mounten, dann kopieren** — Dateien in ein ungemountetes
  Mount-Verzeichnis landen auf der Root-FS und verschwinden unter der
  gemounteten Karte (passiert 04.10.2026, drei halbe Dateien mussten
  danach nach dem Umount aus `~/sd-card` gelöscht werden).
- Preise immer mit Datum und Quelle notieren — Live-Preise veralten schnell.
- Bestelllisten gebündelt nach Händler, Zollpauschale einrechnen (Stand und
  Quelle in `docs/bestellliste.md` pflegen).
- Testprotokolle (Boost-Modul-Test, Breadboard-Etappen, Pegelmessungen)
  landen in `docs/` — mit Datum und gemessenen Werten, nicht nur „lief".
- Vor Datenblatt-PDFs erst in `docs/kernwerte.md` nachsehen.
- To-Dos mit Status in `To-Do.md` pflegen, damit jede Session weiß, wo es
  weitergeht.
