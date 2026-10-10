# TPS61023 — Einzel-Mount mit regelmäßigem Gitter

Stand: **09.10.2026**. Neu aufgebaut nach Nutzer-Konzeptfreigabe im Chat:
**ein Schraubpfosten am Montageloch, zwei kleine Stützpfosten mittig unter
der Platine**, fern der gelöteten Anschlussreihe. Keine Wände, Mulde oder
L-Auflage. Ein Loch zur Holzbefestigung. **Nachfolgend ebenfalls vom Nutzer
beschlossen: 12-mm-Pappelsperrholz und 3 × 12 mm Senkkopf-Holzschraube**;
Senkung und lokales Schraubpolster entsprechend ergänzt.

**Digitale Form vom Nutzer ausdrücklich positiv bewertet (09.10.2026).**
Stilvorlage für weitere Mounts, Übergabe in `docs/mounts-weiterarbeit.md`.
**Entwurf, keine Druck-/Einbaufreigabe:** Geometrie und Vorschauen geprüft;
noch kein Probedruck, kein eingeschmolzener Einsatz und keine reale
Passungs-/Belastungsprüfung. Die unten genannten Konstruktionsmaße sind
neu gewählte Entwurfsparameter, keine gemessenen Hardwarewerte.

## Vorschauen / Dateien

- `iso.png`, `top.png`: Mount ohne Platine.
- **`iso-board.png`, `top-board.png`, `side-board.png`: transparente Platine**
  zur Kontrolle von Pfosten, Luftspalt, Anschlussbereich und Schraubzugang.
- `stepup_mount.scad`: parametrisches Modell, in OpenSCAD auch mit Vorschau.
- `stepup_mount.stl`: **nur der gedruckte Mount**, ohne Platine/Einsatz.
- `render.sh`: reproduziert STL und alle fünf Bilder.
- `check_mesh.py`: STL-Prüfung mit Python-Standardbibliothek, auf die
  aktuellen Standardparameter abgestimmt.
- `archive/rejected-2026-10-09/`: unveränderte Kopie des **abgelehnten**
  Vorgängers samt dessen ausdrücklich als verworfen markierter README.
  Alte Angaben dort sind keine aktuelle Anschluss-/Druckfreigabe.

## Aktuelle Entwurfsmaße

| Merkmal | Wert / Bedeutung |
|---|---|
| Außenmaß | **26 × 32 × 10 mm** |
| Gitterboden | **2 mm** dick, 4 × 5 regelmäßige Zellen vor lokalen Verstärkungen |
| Gitteröffnung / Rippe | **4 × 4 mm / 2 mm**, nicht bloß willkürliche Ausschnitte |
| Pfosten über Gitteroberseite | **8 mm**, alle drei gleich hoch |
| Schraubpfosten | Ø **8,2 mm**, kurze lokale Fußverbreiterung |
| Stützpfosten | 2 × Ø **2,8 mm**, massiv, ohne Gewinde |
| Stützpunkte auf der Platine | x = 5,715; y = 6,5 und 10 mm, ab linker/unterer Kante |
| Heat-Set-Sackloch | Ø **4,0 mm**, **6,7 mm** tief, von oben |
| Geschlossenes Material unter Sackloch | 3,3 mm insgesamt; davon 1,3 mm oberhalb des 2-mm-Gitters |
| Material radial um realen Einsatz | (8,2 − 4,6) / 2 = **1,8 mm**, konservativ auch außerhalb größtem Einsatz-Ø |
| Holzbefestigung | **1 Durchgangsloch Ø 3,2 mm**, für 3 × 12 mm Senkkopf-Holzschraube |
| Schraubloch-Polster | Ø **8 mm**, **3,5 mm Gesamtdicke**, nur lokal 1,5 mm höher als das Gitter |
| Kopfsenkung | Ø **6,2 mm**, **90°**, **1,5 mm** tief; reale Kopfpassung prüfen |
| Material unter Kopfsenkung | **2 mm** |
| Holz | beschlossen: **12 mm Pappelsperrholz**, tatsächliche Stärke noch prüfen |

**Holzschraube, nicht M3-Maschinenschraube.** Bei Senkkopf zählt die
Schraubenlänge inklusive Kopf. Nominal bei bündigem Kopf ergibt sich
12 − 3,5 = **8,5 mm Holzeingriff**, somit **3,5 mm Reserve** nach außen
in 12-mm-Holz. Diese Rechnung ist keine Messung: Kopf kann leicht tiefer
sitzen, Holz/Schraube haben Toleranzen und Kunststoff kann sich setzen.
Vorbohrung und Halt deshalb zuerst am Reststück prüfen, Bohrtiefe begrenzen
und vorsichtig von Hand anziehen, nicht mit dem Akkuschrauber festknallen.
Keine Spitze darf durch die Außenseite reichen.

Die **Ø-6,2-mm-/90°-Senkung ist eine CAD-Annahme** für einen Kopf um Ø 6 mm.
Konkretes Fabrikat noch offen, nicht als bestellt/vorhanden ausgeben.
Referenz: [SPAX-Kopfdurchmessertabelle beim Händler](https://1aschrauben.de/mediafiles/Sonstiges/Spax/KopfdurchmesserSPAX-Schrauben.pdf)
nennt 6 mm Kopf für nominal 3-mm-Senkkopfschrauben (abgerufen 09.10.2026).
Kopf-Istmaß und Winkel vor Druck/Einbau prüfen; nicht jede Holzschraube
hat dieselbe Geometrie. Die Verstärkung füllt lokal eine Gitterzelle,
alle übrigen Boden-/Pfostenparameter bleiben unverändert.

Die äußeren Bodenecken sind leicht gerundet. Alle Pfostenkerne laufen bis
zur Druckbettseite durch; lokale Pads und kurze konische Füße verbinden
sie mit mehreren Gitterrippen. Oberhalb dieser Füße stehen die drei
Pfosten separat — keine versteckte erhöhte L-Verbindung.

## Maßquellen — am 09.10.2026 geprüft

### MiniBoost

[Originales Adafruit-PCB-Repository](https://github.com/adafruit/Adafruit-TPS61023-PCB),
Datei `Adafruit TPS61023.brd` (abgerufener Git-Blob
`bbdc02b72e9c77a2412e7a7ea90e644356b00168`):

- Layer-20-Kontur: **11,43 × 17,78 mm**, obere Ecken Radius 2,54 mm.
- Element `U$9`: genau **ein** `MOUNTINGHOLE_2.5_PLATED`, Mittelpunkt
  **(2,54; 15,24)** mm bei Ursprung links unten.
- Package-Pad `P$1`: `drill="2.5"`; nicht nur aus dem Package-Namen abgeleitet.
- JP1: 4 Anschlusslöcher Ø 1 mm, Raster 2,54 mm, Reihe y = 2,54 mm.

[Offizielles Unterseitenfoto](https://cdn-shop.adafruit.com/970x728/4654-08.jpg)
zeigt keine aufgesetzten Unterseitenbauteile. Mittige Stützpunkte liegen
abseits der Anschlussreihe. Foto des unbestückten Anschlussbereichs ist
**kein Messnachweis** für Überstände der tatsächlich angelöteten Pins/Adern.
Produkt: <https://www.adafruit.com/product/4654>.

### ruthex RX-M2,5×5,7

[Offizielle Produktseite](https://www.ruthex.de/products/ruthex-gewindeeinsatz-m2-5-70-stuck-rx-m2-5x5-7-messing-gewindebuchsen),
[Hersteller-Maßtabelle mit Einbauzeichnung](https://cdn.shopify.com/s/files/1/0567/7019/9760/files/1Tabelle.PT05_eb2a30fa-5c34-46f8-b557-a6c432354560.jpg?v=1748341911):

- M2,5: d1 = 4,6; d2 = 3,9; **Einbauloch d3 = 4,0**; L = 5,7 mm.
- Mindestlochtiefe **L + 1 mm = 6,7 mm**.
- Mindestwandstärke **W = 1,6 mm** radial gemäß Zeichnung.
- Einsatz bündig im Pfosten, nicht aus ihm herausragend.

Das offizielle STEP-Modell ist **nicht** Grundlage einer aus
Kontrollpunkt-Extrema geschätzten Pocket. Das Einbauloch richtet sich nach
der Herstellerzeichnung; tatsächliche FDM-Passung zuerst an einem kleinen
Passungs-Probestück mit gleichem Material/Druckprofil prüfen.

## Anzeigeannahmen und mechanische Grenzen

- Transparente Platine: **1,6 mm Dicke nur als Darstellungsannahme**.
  0,03 mm Anzeigeversatz über Pfostenoberkante verhindert Z-Flackern.
- Goldener Einsatz-Dummy ist rein symbolisch und zur kollisionsfreien
  Vorschau auf knapp Einbauloch-Ø verkleinert. Realer Maximal-Ø: 4,6 mm.
  Kein Dummy gelangt ins STL (`$preview`-Schutz).
- 8 mm Abstand Platinenunterseite/Gitteroberseite ist eine **gewählte
  Freiraumreserve**, kein gemessener Abstand zu realen Lötstellen.
- Drei Auflagepunkte helfen gegen Kippen. Sie sind **keine formschlüssige
  Verdrehsicherung**; Halt um die einzelne Platinen-Schraube ist klemmend.
  Kabel zugentlasten, nicht zur Halterung machen.
- Auch ein Holzbefestigungsloch gewährleistet keine formschlüssige
  Verdrehsicherung des ganzen Mounts. Schraubklemmung am realen Holz prüfen;
  Nachbarmodule und Kabel sind kein Ersatz.
- Platinen-Schraubenlänge erst aus tatsächlicher PCB-Dicke, etwaiger
  Unterlegscheibe und sicherem Gewindeeingriff bestimmen. Kein Anschlagen
  am Sacklochboden; keine alte M2,5×7-Vorgabe übernehmen.

## Reproduktion / Prüfung

```bash
bash 3d-print/mounts/stepup-mount/render.sh
python 3d-print/mounts/stepup-mount/check_mesh.py
```

Geprüft am 09.10.2026 mit OpenSCAD **2026.09.18**; STL-Export mit
**CGAL**, Bilder mit OpenCSG-Vorschau. Der zusätzlich geprüfte Binär-STL
ist geschlossen, zusammenhängend und konsistent orientiert, ohne
Nullflächen oder zusätzliche Vorschaukörper. Ergebnis/Rohlog:
`docs/testprotokoll-stepup-mount.md`.

Druckorientierung: Gitter flach aufs Bett, Pfosten/Sackloch nach oben.
Geometrisch keine schwebenden Körper, keine Stützstruktur erforderlich;
regelmäßige Rippen 2 mm breit. Slicerprüfung mit tatsächlicher Düse und
Material bleibt offen. Einschmelzbereich mit genügend Perimetern/lokal
massiv drucken; nicht darauf vertrauen, dass dünne Infill-Wände tragen.

**Vor endgültigem Einsatz offen:** Heat-Set-Probedruck,
reale Platinen-/Lötstellenpassung, PCB-Schraubenauswahl,
Kopfpassung der gewählten Holzschraube, Vorbohr-/Holzbefestigungstest und
vorsichtiger Belastungs-/Verdrehtest.
