# NeoPixel-Stick — Deckelhalter / CNC, Messabgleich 21.10.2026

**Aktueller Stand:** Nutzermaße übernommen, STL/DXF neu exportiert.
**Kein vollständiger Fit-PASS: Schraubenkopf-/Bauteilfreiheit ist offen.**
Keine reale Druck-, Fräs-, Last- oder Lichtprüfung. Die alten CNC-Konturen
55,2 × 14,56 / 59,2 × 18,56 sind überholt und nicht mehr zu verwenden.

## Wellenfalz — aktuelle CNC-Konturen nach Formbestätigung

Sechs umlaufende Wellen, **4–10 mm zum Durchbruchrand**,3 mm tief.
Scheibe passend gewellt,0,2 mm Konturspiel. Durchbruch und Druck-STL
unverändert (SHA-256 geprüft). `wave-top.png` / `wave-iso.png` und
`../wellenfalz-uebersicht.png` zeigen die neue Form. Reproduktion:
`bash ../common/render_waves.sh`; Prüfdetails `../common/README.md`.
**Neue offene Holzbefestigung:** Falz reicht über die Schraubenprojektion
bei(34;19,9). Bei3×12 dort nominal nur0,5 mm Spitze→Falzboden statt3,5 mm
Restholz. Schraubenlänge/Holzhalt klären; keine Fertigungsfreigabe.

## Gemessene Grundlage

Nutzerangaben, bestätigt im Chat, und gesichertes Foto:
`../../../docs/cad/neopixel-stick/measurement-2026-10-21/README.md`.

| Merkmal | Nutzermaß / daraus berechnet |
|---|---:|
| PCB | 54 × 9,9 × 1,6 mm |
| PCB-Unterseite → LED oben | 3,23 mm |
| LED-Aufbauhöhe über PCB | 1,63 mm |
| Bohrungen | 2 × Ø3 mm |
| Freier Abstand zwischen Lochrändern | 23 mm |
| Lochmittenabstand | 26 mm |
| Rechter Lochrand → rechtes PCB-Ende | 12,8 mm |
| Lochrand → nahe lange PCB-Kante | 0,7 mm |
| Lochmitten, Ursprung linke vordere PCB-Ecke | (13,7;7,7), (39,7;7,7) mm |

+x rechts, +y nach hinten zur Lochreihe, +z nach außen. Vorgesehene
**Neueste Kabelkorrektur:** Kabelausgang und Kabelbinderpad am anderen kurzen
Platinenende, lokal **rechts/+x**, statt links/−x. Dies ist die gewünschte
mechanische Kabelführung, keine Bestätigung einer DIN-/Padbelegung.
**Nutzerkorrektur: beide Holzlaschen im Deckelfoto
nach links, zur Deckelmitte / Lochreihe hin** (lokal +y), nicht zur nahen
Außenkante. Schraubenpunkte jetzt (20;19,9)/(34;19,9). Das Foto zeigt die
Anordnung an der hinteren Deckelkante, beweist keine genauen Wandabstände.
Das Gesamtdeckel-Layout einschließlich Buttons, Leisten und NFC macht Daddelbert.

Die originale Adafruit-v2-Auswertung bleibt nur historische Referenz.
**LED-/SMD-XY und Padlagen des realen Moduls sind nicht gemessen.** Die Vorschau
und Bauteil-Hüllentests benutzen angepasste Referenzpositionen, keine
nachgewiesene Bestückungszeichnung des gemessenen Boards. DIN beim Löten an
Beschriftung prüfen, nicht aus der Fotoausrichtung raten.

## Dateien für CNC / Druck

Alle Dateien liegen in diesem Ordner. DXF in **mm**, Nennkonturen,
**keine Werkzeugbahnen und kein G-Code**; gemeinsamer Ursprung siehe oben.

| Datei | Inhalt / Nennmaß |
|---|---|
| `cnc-opening.dxf` | Durchbruch **58,4 × 14,3 mm**, R2 |
| `cnc-rebate.dxf` | Wellenfalz, tatsächliches Hüllmaß **76,549 × 34,3 mm**, **3 mm tief** |
| `cnc-glass.dxf` | Gewellte Scheibe, Hüllmaß **76,149 × 33,9 × 3 mm** |
| `neopixel_mount.stl` | Nur Druckhalter, Bounds **64 × 27,9 × 16,5 mm** |
| `panel_cnc.stl` | Referenzdeckel, **nicht drucken** |
| `geometry.scad` | Gemeinsame Maße für CNC und Halter |
| `overview.png` | Halter ohne / mit transparenter PCB |
| `height-side.png` | Gerader Höhenschnitt |
| `top-board.png`, `exploded.png`, `seated-inside.png`, `outside.png` | Zusatzansichten |
| `cnc-compare.png` | Alte Kontur gegen neue, gleiche Skalierung; links überholt |

### CNC: nur von außen

Eine Aufspannung, **Falz zuerst, Durchbruch danach**. Kein Wenden, keine
Innentasche. Fräser wegen R2 **höchstens Ø4 mm**. Werkstückhaltung,
Werkzeugkompensation und Zustellungen im CAM bestimmen. Die Konturen vor dem
Fräsen im CAM zusammen ausrichten; nicht unabhängig auf ihren jeweiligen
linken unteren Rand nullen.

Voraussetzung der Höhenplanung: **12-mm-Holz und 3-mm-Scheibe**. Iststärken
prüfen; die Holzdicke wurde in dieser Session nicht gemessen. Die endgültige
Deckelposition übernimmt der Nutzer. Das lokale Wandmodell liegt jetzt gegenüber den Laschen auf −y, passend
zur Nutzerkorrektur. Die frühere4,26-mm-Falzfreiheit ist durch die größere
Wellenkontur überholt: Falz reicht in XY über die Wandprojektion, liegt aber
oben im Deckel. Reststärken/Leisten/Wandlage neu prüfen; keine Layoutfreigabe.
Der gemeinsame DXF-Ursprung bleibt unverändert.

Keine Holzschrauben-Durchgangslöcher in den CNC-Dateien. Die beiden begrenzten
Pilotbohrungen werden von innen von Hand gesetzt.

## Höhen / Passung

| Ebene | z [mm] |
|---|---:|
| Druckteil unten | 0 |
| Gitter oben | 2 |
| Holzlasche unten | 8,5 |
| Holzanschlag / Deckel innen | 12 |
| PCB-Unterseite | 14,77 |
| PCB oben | 16,37 |
| Führung oben | 16,5 |
| LED oben | 18 |
| M2-Kopf oben bei angenommener Höhe 2 mm | 18,37 |
| Scheibe unten | 21 |
| Holz / Scheibe außen | 24 |

Nominal **3 mm LED → Scheibe**; 2,2 mm Rand pro PCB-Seite bis Durchbruch,
4–10 mm zusätzlicher Wellenfalz. Scheibe mit0,2 mm Konturspiel: Auflage
mindestens nominal3,8 mm. Optik/Blendung/Homogenität nicht geprüft.
Vier Eckführungen: 0,20 mm Spiel je Seite, 4,5 mm Einstecktiefe,
0,4-mm-Einführfase über 0,6 mm. Holzlaschen sind der Anschlag, nicht LEDs/Glas.

## PCB-Schrauben — offener Punkt vor endgültiger Montage

Der Halter behält **M2 × 16 und zwei M2-Sechskantmuttern** bei, statt aufgrund
der Ø3-mm-Messung ungeprüft auf größere Schraubenköpfe umzustellen.
Muttern: angenommen SW4 / Höhe1,6; Taschen SW4,2 / Tiefe3 mm von unten.
M2-Material ist nicht als vorhanden inventarisiert. Keine M2,5-ruthex vorgesehen.

**Kopf Ø3 / Höhe2 mm ist nur die aktuell geprüfte Hülle, keine freigegebene
Schraubenempfehlung.** Selbst diese Hülle überschneidet bei den angenommenen
Bauteilpositionen eine LED-Ecke. Zusätzlich ist M2 in Ø3 PCB-Löchern radial
bis 0,5 mm verschieblich; der vergrößerte Kopfhüllentest kollidiert ebenfalls.
Diese beiden echten Testbefunde sind als **OPEN/BLOCKED** protokolliert.
Nicht durch Anziehen, Verbiegen oder Wegdrücken eines Bauteils lösen!

Vor endgültiger PCB-Montage echte Kopfkontur und Abstand zu den LEDs/SMD
prüfen; dafür gegebenenfalls Detailfoto/Messung am realen Modul nachreichen.
Die Bauteilhüllen sind nicht gemessen, also beweist ihr Zusammenstoß weder
einen realen Konflikt noch eine sichere Passung. Breite Unterlegscheiben und
übliche größere M2-Köpfe sind nicht freigegeben. Schraubenkopf-/PCB-Probe
außerhalb der Box durchführen. Eine nötige Befestigungsänderung ist noch
kein erledigter Auftrag.

Gewindereserve rechnerisch: Spitze z0,37, Mutter z1,4…3,0; angenommenes
Worst-Case-Budget mindestens1,5 mm Eingriff bei Ziel1,2 mm. Längen-/PCB-/
Gewindespitzen-/Muttersitztoleranzen im Prüfer sind Annahmen, keine Messungen.

Holzbefestigung: zwei 3 × 12-mm-Senkkopf-Holzschrauben bei (20;19,9)/(34;19,9),
Laschen3,5 mm, DurchgangØ3,2, SenkungØ6,2/90°. Nominal8,5 mm Holzeingriff,
3,5 mm Restholz nur außerhalb der Falz; bei Überdeckung nominal0,5 mm
Spitzenreserve. Holzschraubenlänge neu klären. Echte Kopfpassung, Bohrtiefe und Halt am Reststück
prüfen; von Hand anziehen. Keine Schraube nach außen durchstehen lassen.

## Kabel / Druck / Montage

**Nutzerentscheidung: Stiftleiste entfernen, Kabel direkt anlöten.**
Keine Dupont-/Steckerfreigabe. Erst stromlos entlöten, Pads schonen und
prüfen; das Foto zeigt noch die Leiste, deren Entfernung ist nicht bestätigt.
Keine Anschluss-Pinfolge aus dieser Mechanikzeichnung übernehmen.

Kabel am rechten kurzen Platinenende (lokal+x) kurz nach innen führen und
unter dem Holz nach rechts. Zugentlastung ebenfalls dorthin verlegt; das
alte linke Kabelbinderpad ist entfernt. Kein zusätzlicher CNC-Kabelkanal, keine lange senkrechte Schleife.
Vorhandenes Kabelbinderpad entlastet die Leitungen; keine Zuglast auf Lötpads.
Padpositionen/Kabelhüllen bleiben Entwurfsannahmen: drei1,9-mm-Boxhüllen von
(52,603;y;13,92) über (54,9;y;9,5) nach (66;y;9,5), y1,27/3,81/6,35.
Drahtdicke, Lötstellen und Biegeradius echt prüfen. Widerstand/Elko nicht
in den Lichtspalt setzen. Akku bleibt bei ersten USB-Prüfungen getrennt.

PETG als Materialvorschlag, Basis auf dem Bett als Ausgangspunkt.
**Erhöhte Laschen brauchen Support oder eine passende alternative Orientierung.**
Zuerst Führung-/Mutterpassprobe ohne Elektronik, dann PCB-/Kabelprüfung außerhalb
montieren; Halter von innen gerade einsetzen, Holzlaschen anschlagen lassen.
PCB-Schraubenkonflikt vorher klären. Keine Last-/Schockfreigabe des Druckteils.

Scheibe muss kindersicher gegen Herausheben fixiert werden. Die Falz allein
hält sie nicht fest. Klebung oder manuelle Schraubenlösung ist nicht geprüft;
kein loses Glas als Endzustand.

## Reproduktion / Prüfstatus

```bash
bash /home/markusinho/projects/boxbert/3d-print/mounts/neopixel-stick-mount/render.sh
```

OpenSCAD2021.01/CGAL, Xvfb/Mesa, ohne Root/Flake-Update. Der Renderer exportiert
STL/DXF, prüft sie und erzeugt echte Vorschauen. **Exit2 bedeutet offene
Schraubenkopffreiheit**, kein voller Fit-PASS; Bilder werden trotzdem erzeugt.
Sonstige Fehler brechen ab. Rohlogs unter `logs/`.

- Reale Druck-STL auf Geschlossenheit, Orientierung, Zusammenhang, degenerierte
  Dreiecke, Bounds und16 gezielte Material-/Loch-Punktproben geprüft.
- Realer Referenzdeckel und DXF-Bounds sowie unabhängige Loch-/Höhenrechnung geprüft.
- Solid-Tests gegen Holz, PCB, Kabel, Rückwand, Glas sowie21 einzelne
  Einsetzpositionen; absichtliche Seitenversätze/Über-Einsetzen als Gegenproben.
- Zwei Kopf-/Bauteiltests ausdrücklich **offen**, keine pauschale PASS-Aussage.
- Original-Adafruit-Quellprüfung prüft nur die historische Datei, nicht die
  Identität oder Bestückungskoordinaten des Nutzermoduls.

Digitale Konturen ersetzen keine reale Führungs-/Druck-/Holz-/Scheibenpassprobe,
kein Last-/Lichttest und keine Kindersicherheitsfreigabe. Genaue Resultate aus
`logs/fit-check.log`, `logs/mesh-check.log`, `logs/cnc-check.log` lesen.
