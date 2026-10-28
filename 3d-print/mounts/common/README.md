# Gemeinsamer Wellenfalz — 21.10.2026

Nutzer hat die PN532-Formvorschau bestätigt und die Übertragung auf
**PN532, NeoPixel und TFT/Feather** beauftragt. Gestaltungsfreigabe ist keine
Fertigungs-/Passungs-/Kindersicherheitsfreigabe.

## Aktueller Dateistand

In den drei jeweiligen Mount-Ordnern sind die **aktiven** `cnc-rebate.dxf`
und `cnc-glass.dxf` jetzt gewellt, außerdem die zugehörigen Holz-STL erneuert.
`cnc-opening.dxf` und die **Druckhalter-STL sind bytegleich unverändert**,
siehe `unchanged-files.log`. Kein neuer Druck nötig allein wegen dieser
Formänderung. Befestigungsfragen unten trotzdem vor Fertigung lösen.

| Modul | Wellen | Falz-Hüllmaß [mm] | Scheiben-Hüllmaß [mm] |
|---|---:|---:|---:|
| PN532 | 8 | 67,500 × 65,200 | 67,100 × 64,800 |
| NeoPixel | 6 | 76,549 × 34,300 | 76,149 × 33,900 |
| TFT/Feather | 10 | 84,800 × 58,995 | 84,400 × 58,595 |

Alle Falze: **3 mm tief von außen**, **4–10 mm zum Durchbruchrand**.
Die maximale Breite10 mm bezieht sich nicht auf Schraubenmitten.
Scheiben vorgeschlagen3 mm dick, umlaufend0,2 mm Konturspiel; keine Skalierung
um den Mittelpunkt. Hüllmaße sind keine Rechteck-Zuschnittkonturen!
Die Scheiben müssen entlang der gewellten DXF-Kontur gefertigt werden.

### Plexiglas als SVG

In den Mount-Ordnern liegen zusätzlich `feather-window-glass.svg`,
`neopixel-stick-glass.svg` und `pn532-glass.svg`. Je Datei genau eine
ungefüllte, geschlossene Schnittkontur, explizite Millimetermaße und passende
`viewBox`; keine Beschriftungen oder zusätzlichen Schnittlinien. Im
Schneidprogramm **1:1 importieren**, nicht an die Seite anpassen. Außenmaße
nach Import kontrollieren. Die Strichbreite ist nur Anzeige, kein Schnittspalt.

Reproduktion mit Python 3 + Shapely:
`python3 3d-print/mounts/common/export_glass_svg.py`. Der Export übernimmt die
aktiven Glas-DXF ohne Glättung; SVG-Y wird für die CAD-Draufsicht umgekehrt.
Der Rücklesetest prüft Maßeinheiten, einen geschlossenen Pfad und die
Konturgleichheit zur DXF (Hausdorff-Abstand < 1e-8 mm und symmetrische
Differenzfläche < 1e-8 mm²). Keine Schnittspalt-/Werkzeugkompensation enthalten;
physische Passprobe und sichere Scheibenfixierung bleiben offen.

`wave.scad` parametrisiert alle drei Profile gemeinsam: Sinusbreite entlang
der abgerundeten Öffnung und Verschiebung in Außennormalenrichtung,1.600
Stützpunkte. Beim TFT wird die Distanz zur tatsächlichen Vereinigungsöffnung
inklusive JST-Kabelauslass gelöst; die dortige Kontur wird nicht blind vom
Führungsrechteck aus vergrößert. Ursprünge/Orientierung unverändert. DXF in mm,
Nennkonturen, keine Werkzeugbahnen. Von außen erst Falz, dann Durchbruch.

## Vorschauen

- `../wellenfalz-uebersicht.png`: alle drei tatsächlichen DXF-Profile im
  selben Maßstab, ohne Glas, damit der Falz sichtbar ist.
- Je Modul `wave-top.png` / `wave-iso.png`: tatsächliche OpenSCAD-Holzmodelle.
- Einbau-/Explosionsansichten ebenfalls mit neuer Scheibenkontur aktualisiert.
- `../pn532-mount/wave-preview/`: ursprünglicher bestätigter Formvorschlag,
  keine eigene zusätzliche Fertigungsdatei.

## Digitale Nachweise und Grenzen

`check_wave.py` liest die **exportierten DXF**, unterstützt LINE und geschlossene
LWPOLYLINE, prüft genau einen geschlossenen einfachen Ring ohne Restsegmente,
vollständige Öffnungsüberdeckung, Breite an6.400 Umfangspositionen und
Scheibenspiel an3.200 Positionen. Mit dem bisherigen polygonalen Öffnungsexport
beträgt die größte gemessene Breite10,0014 mm (Kreisapproximation/Exportpräzision).
Alle drei Profile liegen innerhalb der festgelegten digitalen Prüftoleranz
4..10 mm ±0,02 mm; Scheibenspiel0,2 mm ±0,002 mm.

Die modulweisen `check_cnc.py` prüfen weiterhin Holz-STL auf geschlossene,
orientierte Kanten und Bounds; zusätzlich Volumen gegen unabhängige Rechnung
`Plattenfläche×12 − Öffnungsfläche×9 − Falzfläche×3`, Toleranz0,05 mm³.
Druckhalter-Meshprüfungen erneut ausgeführt, ohne Druckgeometrieänderung.
Zusätzlich alle drei aktuellen Mount-SCAD nach `/tmp` neu kompiliert und
jeweils die symmetrische Volumendifferenz zur behaltenen Druck-STL per CGAL
gebildet: überall leer (trotz teils anderer Dreieckssortierung/Dateibytes).
Nachweise `logs/wave-source-mount-export.log` und
`logs/wave-source-mount-difference.log`; Prüfgeometrie `mount_difference.scad`.
`test_wave_checks.py`: vier Tests PASS, darunter negative Gegenproben mit
alter2-mm-Falz, zu großen12-mm-Bergen und nur skaliertem Glas. `wave-tests.log`.

Nachweise je Modul `logs/wave-cnc-check.log`, `wave-panel-export.log`,
`wave-mount-mesh-check.log`, `wave-tool-version.log`. Die neue Hüllentestserie
steht separat in `logs/wave-fit-check.log` / `wave-fit-status.txt`:

- PN532:19 Solid-Testgruppen PASS, inklusive21 einzelner Einsetzlagen.
- NeoPixel:21 Einsetzlagen und Glas-/Wand-/Kabeltests ohne Kollision;
  **Exit2/BLOCKED**, weil die bestehenden Kopf-/Bauteilhüllen weiterhin
  kollidieren. Kein Gesamt-Fit-PASS.
- TFT:10 Testgruppen wie erwartet; direkter Seiten-USB weiterhin mit
 902,400218 mm³ Holzkollision als **MANUAL STEP REQUIRED**, nicht freigegeben.

Nicht ältere Logs als Nachweis neuer Gesamtfreigaben ausgeben. Zusätzlich
zur bestehenden NeoPixel-Kopffreiheit und TFT-USB-Handarbeit sind die unten
beschriebenen neuen Holzbefestigungsreserven vor Fertigung zu lösen.

## Neue offene Befestigung — vor Fertigung klären

Die größere Falz überdeckt in XY mindestens die Holzschraubenprojektionen:

- PN532 **(−10;20,2)**, linke Lasche in Fotoorientierung.
- NeoPixel **(34;19,9)**, zweite Lasche.

Bisher3×12-mm-Senkkopf-Holzschrauben durch3,5-mm-Laschen →8,5 mm Holzeingriff.
Unter einer3-mm-Falz bleiben von nominell12 mm nur9 mm Holz; damit dort
**nur0,5 mm Schraubenspitze→Falzboden** statt3,5 mm Restholz! Das ist keine
belastbare Bohr-/Schraubenfreigabe. Holz-Istmaß, Senkung, Schraubenspitze und
Anziehverhalten können die Reserve weiter reduzieren. Auch die reduzierte
Holzauflage im Laschenbereich prüfen. Keine Schrauben im Entwurf still geändert.
**Vor Fertigung kürzere Schrauben oder geänderte Befestigung mit Nutzer
abstimmen und am Reststück prüfen.** Eine3×10 wäre rechnerisch eine mögliche
Prüfvariante mit2,5 mm Reserve, aber weder bestellt noch freigegeben/geprüft.

Falze reichen teilweise in die frühere Wandprojektion hinein, sitzen jedoch
oben in der Platte; Wände enden am Platten-Unterrand. Das ist nicht automatisch
eine 3D-Kollision, aber neue Reststärken-/Layoutfrage. Tatsächliche Ränder,
Buttons/Muttergehäuse, Leisten und sichere Scheibenfixierung real prüfen.
Metall/Schrauben und PMMA-Schichtung beim NFC-Lesetest berücksichtigen.

Die CAM-Diagnose ermittelt Restflächen idealer Rundfräser; diese kleinen
Polygon-/Eckrestflächen sind **keine Werkzeugfreigabe**. Die bisherigen
R2-Auslässe begrenzen den Durchbruchfräser auf höchstensØ4 mm; die Wellen
und Glasfertigung gesondert im CAM simulieren und am Reststück prüfen.

## Reproduktion (Arch, user-only Nix, keine Systemänderung)

```sh
bash 3d-print/mounts/common/render_waves.sh
# Optional: vollständige, deutlich langsamere Solid-Hüllentestserien:
bash 3d-print/mounts/common/render_waves.sh --fit
# Python 3 + Shapely + Pillow, z.B. der vom Render-Skript erzeugte Nix-Python:
python3 3d-print/mounts/common/test_wave_checks.py
```

Gepinnte Nix-Umgebung wie in den Mount-Renderern, OpenSCAD2021.01/CGAL,
Xvfb/Mesa. Skript exportiert ausschließlich CNC-Modelle/Konturen und Bilder,
nicht die Druckhalter-STL. NeoPixel-Fittestcode2 bedeutet explizit
**BLOCKED wegen ungeklärter Kopffreiheit**, nicht Gesamt-PASS.
