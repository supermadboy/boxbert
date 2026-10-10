# AW9523 / ADA4886 — Neuaufbau, 09.10.2026

**Neuer Konzeptvorschlag nach ausdrücklichem Nutzerauftrag zum kompletten
Neustart.** Der frühere Entwurf wurde verworfen und unverändert unter
`archive/rejected-2026-10-09/` gesichert. Nicht drucken/nicht als Vorlage
verwenden. Der Step-Up wurde in diesem Auftrag nicht geändert.

**Status:** neu exportierte STL digital geprüft, sechs Vorschauen geprüft.
Keine Druck-, Passungs-, Belastungs- oder Kindersicherheitsfreigabe.
**Noch abzustimmen:** Einsatzmontage von unten statt bündig oben und zwei
Holzschrauben. Das sind Vorschläge, keine bestätigten Nutzerentscheidungen.

## Konstruktionsprinzip

Regelmäßiger durchbrochener Gitterboden und vier einzelne gleich hohe
PCB-Auflagen. Keine Wände, Mulde, L-Auflage oder Klemmbefestigung.
Zwei diagonale Schraubpfosten, zwei massive Stützpfosten. Die Platine
wird von oben durch zwei vorhandene Montagelöcher verschraubt.

**Die Lösung für die eng benachbarten Pins ist eine Höhenstaffelung,
nicht das Wegschneiden der Einsatzwand:**

- Unterer Gewindebereich Ø 8,2 mm bis z = 8 mm.
- Obere schmale Auflage Ø 4,6 mm bis PCB-Unterseite z = 12 mm.
- Ø-4,0-mm-Einsatzkammer von **unten** bis z = 6,9 mm; darüber
  Ø-2,8-mm-Schraubenkanal bis zur Platine.
- ruthex RX-M2,5×5,7 wird vor der Holzmontage von unten eingeschmolzen,
  Unterkante nominal **0,2 mm zurückgesetzt**. Kein Metall darf unten
  überstehen. Das ist **nicht** die bisher gewünschte bündige Obermontage.
- Rundum **1,8 mm Material selbst um den maximalen Einsatz-Ø 4,6 mm**,
  bzw. 2,1 mm um das Einbauloch. Keine Freistiche, keine dünnen Sektoren.
- 1,1 mm Höhe zwischen Kammerende und Ende des dicken Pfostens.
  Die schmale obere Auflage hat 0,9 mm radiale Wand um den Schraubenkanal;
  hier sitzt **kein** Heat-Set-Einsatz. Festigkeit physisch prüfen.

Die großen Pfosten liegen unter der Pinzone. Im Entwurf dürfen Pins
bis **3,4 mm** unter der PCB-Unterseite herausragen; zum dicken Pfosten
bleiben dann **0,6 mm** vertikale Reserve. Die obere Auflage hält zum
nächsten Pinzentrum (3,81 mm) mit angenommener Lot-Hülle r = 1,1 mm
noch **0,41 mm** Abstand. **Diese Hüllen sind Entwurfsgrenzen, keine
Messwerte und keine Vorgabe, wie der Nutzer seine Platine löten muss.**
Bei Überschreitung neu parametrisieren, nicht Lötstellen/PCB passend zwingen.

Die Holzschrauben sitzen links/rechts **außerhalb der PCB-Projektion**.
Sie bleiben bei aufgeschraubter Platine erreichbar. Zwei Befestigungen
reduzieren das Verdrehen bei Kabelzug; ihre Anzahl ist noch abzustimmen.
Reale Stecker und Kabel können den Zugang trotzdem beeinflussen.

## Maße

| Merkmal | Neuer Entwurfswert |
|---|---|
| Mount, nur Druckteil | **56 × 26 × 12 mm** |
| Gitter | 2 mm dick; 4-mm-Zellen, 2-mm-Rippen, 9 × 4 Raster vor lokalen Pads |
| PCB-Unterseite | z = 12 mm, 10 mm über Gitter |
| Gewindepfosten | 2 × Ø 8,2 mm unten / Ø 4,6 mm oben |
| Stützpfosten | 2 × Ø 4,6 mm, massiv |
| Einsatzkammer | Ø 4,0 mm; 6,7 mm ab Einsatz-Unterkante z = 0,2 |
| Einsatz | 2 × ruthex RX-M2,5×5,7, von unten, nicht oben bündig |
| Schraubenkanal | Ø 2,8 mm |
| Holzbefestigung | Vorschlag 2 × 3 × 12 mm Senkkopf-Holzschraube |
| Holzpolster | Ø 8 mm, 3,5 mm Gesamthöhe |
| Durchgang / Senkung | Ø 3,2 / Ø 6,2 mm, 90°, 1,5 mm tief |
| Material unter Senkung | 2 mm |
| Holz | beschlossen: 12 mm Pappelsperrholz, Istmaß prüfen |
| Holzeingriff nominal | 8,5 mm, 3,5 mm Reserve bei bündigem Kopf |

### PCB-Schrauben: alte M2,5×8-Empfehlung gilt nicht mehr

Der Einsatz sitzt jetzt unten. **M2,5 × 12 ist nur ein Rechenbeispiel**,
keine endgültige Schraubenauswahl und nicht als vorhanden bestätigt.
Bei angenommener PCB-Dicke 1,6 mm, ohne Unterlegscheibe und Einsatz von
z = 0,2 bis 5,9 mm: Schraubenspitze z = 1,6 mm, geometrische Überdeckung
mit Einsatz ca. **4,3 mm**, Abstand zur Holzebene 1,6 mm. Der nutzbare
Gewindeeingriff ist wegen Schraubenspitze/Einsatzenden kleiner.

Reale PCB-Dicke, Scheiben, Schraubenlänge, Kopf-/Pinabstand und Einsatz-
Position zuerst prüfen. PCB-Bohrung laut Hersteller **Ø 2,5 mm** ist
nominal gleich Schrauben-Nenndurchmesser: tatsächliche M2,5-Passung ohne
Kraft testen, **nicht aufbohren** und keine Schraube erzwingen. Kopf darf
weder Lot noch Header berühren. Zu lange Schrauben können unten austreten
und den Mount anheben bzw. am Holz anstehen. Von Hand, nicht festknallen.

## Dateien und Vorschauen

- `aw9523_mount.scad`: vollständig neue Geometrie mit Assertions.
- `aw9523_mount.stl`: nur Mount, **keine PCB, Einsätze oder Pin-Dummies**.
- `iso.png`, `top.png`: ohne PCB.
- `iso-board.png`, `top-board.png`, `side-board.png`: transparente PCB;
  rote zulässige Pin-/Lot-Hüllen, keine gemessenen echten Header.
- `bottom.png`: Unterseite und Zugang zu den Einsatzkammern.
- `render.sh`: CGAL-STL und alle sechs Bilder, offscreen.
- `check_mesh.py`: neue Bounds/Probes; generischer Meshprüfkern beibehalten,
  alte Freistich-Prüfungen vollständig ersetzt. Keine Materialfestigkeitsprüfung.

PCB-Dicke 1,6 mm nur für die Vorschau angenommen. 0,03 mm Anzeigeversatz
verhindert Flackern und ist kein realer Luftspalt. Vorschau zeigt keine
oberen Komponenten, Headerkunststoff oder Kabel; Anschlusszugang am
realen Modul bleibt zu prüfen. Inserts symbolisch mit max. Außen-Ø 4,6,
ohne Rändel/Gewinde; sie verdrängen beim Einschmelzen Kunststoff und
sind daher größer als die CAD-Einbaukammer.

## Quellen — frisch geprüft am 09.10.2026

[Original Adafruit-PCB](https://github.com/adafruit/Adafruit-AW9523-PCB),
Datei `Adafruit AW9523.brd` aus master, lokale Quellenkopie:
`docs/cad/2026-10-09-aw9523-redesign/sources/Adafruit_AW9523.brd`.
SHA256: `3dec4c7ca674817b9b1a5f79dbcd7cabf7c74e58928bf5e64bc0a95a8b9831b9`.

Neu ausgelesen, einschließlich Package-Pad-Koordinaten und JP7-Rotation:

- PCB **38,1 × 17,78 mm**, vier **gerundete** Ecken Radius 2,54 mm.
  Layer-20-Wires enthalten `curve="90"`; alte Fasen-/Oktogon-Angabe falsch.
- Montagebohrungen **4 × Ø 2,5 mm**, Mittelpunkte x = 2,54 / 35,56,
  y = 2,54 / 15,24 mm; Package `MOUNTINGHOLE_2.5_PLATED`.
- 38 Durchkontaktierungspads Ø 1,0 mm: drei 11er-Reihen, eine 5er-Reihe;
  nächste Pins jeweils 3,81 mm vom Montagelochzentrum entfernt.
- [Hersteller-Unterseitenfoto](https://cdn-shop.adafruit.com/970x728/4886-02.jpg)
  lokal gesichert: keine aufgesetzten Unterseitenbauteile sichtbar.
  Beweist ausdrücklich keine Überstände der am Nutzer-Modul angelöteten Pins.
- ruthex-Maße aus `docs/kernwerte.md` und
  [Einbauzeichnung](https://cdn.shopify.com/s/files/1/0567/7019/9760/files/1Tabelle.PT05_eb2a30fa-5c34-46f8-b557-a6c432354560.jpg?v=1748341911):
  Ø 4,0, Tiefe L+1 = 6,7, Wand min. 1,6 mm radial; max. Außen-Ø 4,6.

`verify_source.py` im CAD-Protokollordner prüft Originaldaten gegen die
verwendete Koordinatenmenge. Keine Maße aus dem verworfenen Mount abgeleitet.

## Prüfung und nächste Schritte

Neu gerendert mit OpenSCAD **2026.09.18 / CGAL / hardwarnings**.
STL-Prüfung: **PASS**, 7532 Dreiecke, geschlossene zusammenhängende,
konsistent orientierte Oberfläche, Bounds 56 × 26 × 12 mm.
STL-SHA256: `9faa5d7f90ed3c4529431f761fbe29e96ba733fea6326480471deaa5f014b5ce`.
Neue Rohlogs: `docs/cad/2026-10-09-aw9523-redesign/`.
Prüfprotokoll: `docs/testprotokoll-aw9523-mount.md`.

1. Nutzerentscheidung zu **Unterseiten-Einsätzen und zwei Holzschrauben**.
2. Heat-Set-Probe am neuen gestuften Pfosten: Material/Druckprofil wählen,
   Ø-4-Loch prüfen, von unten kontrolliert setzen; Schraubenkanal darf nicht
   mit Kunststoff zulaufen, Einsatz darf nicht unten überstehen. Belastungs-
   und wiederholten Verschraubungstest durchführen, nicht nur Einschmelzen.
3. Unterseiten-Überstände/Lotradien des echten Moduls prüfen; PCB liegt nur
   an den vier Auflagen auf, keine Pins/Stecker tragen mechanisch mit.
4. PCB-Schrauben auswählen und Kopf-, Gewinde-/Holzebenenfreiheit testen.
5. Holzschrauben-Kopfmaß/-winkel, Ist-Holzstärke, Vorbohrung und Halt am
   Reststück prüfen. Tiefe begrenzen; keine Spitze durch die Außenseite.
6. Kabelzugentlastung und Gesamtmontage separat bewerten. Akku bleibt
   getrennt; mechanisch eingeschlossene Bauteile ersetzen keine Sicherheitsabnahme.

Drucklage: Gitterunterseite auf Druckbett. Geometrisch keine externen
Stützen vorgesehen; der kleine Innenübergang Ø 4 auf Ø 2,8 ist mit dem
realen Druckprofil zu prüfen. Kein pauschales Druckprofil vorgeschrieben.
