# PN532 — Deckelhalter mit Plexiglas und Außenfalz

> **Branch `cad/falz-10mm`:** aktueller gerader Falz **67,5×65,2×3 mm**,
> 10 mm Rand an den geraden Durchbruchkanten, außen rechteckig ohne Rundung; Scheibe **67,1×64,8×3 mm**.
> Ersetzt alte Falz-/Scheibenmaße unten. Durchbruch/Halter unverändert.
> Neue Exporte/Prüfung/Layoutwarnungen: [../falz-10mm.md](../falz-10mm.md).
> Alte Bilder zeigen noch den schmalen Falz; neue Draufsicht dort verlinkt.

Stand **21.10.2026**, auf Nutzerauftrag an reale Messwerte und Deckellayout
angepasst. Druckdatei finalisiert für die reale Passprobe, **keine physische
Fertigungs-/Kindersicherheitsfreigabe**. Frische digitale Ergebnisse: `logs/`.
Herstellerbasis/Historie: `../../../docs/cad/pn532/README.md`.
Kurze Fertigungs-Checkliste: **`CNC-DRUCK-MERKBLATT.md`**.

## Nutzer-Messabgleich und Layout

Nutzerangaben vom 21.10.2026 (Messschieber, Chat):

- Platinenaußenmaße **42,7 × 40,4 mm** als passend bestätigt.
- PCB-Dicke **1,15 mm**, Lochdurchmesser **2,93 mm**.
- An allen vier nahen Kanten **6,26 mm von Platinenkante bis Lochkante**.
  Daraus Lochmittenabstand zur Kante 7,725 mm und Raster **27,25 × 24,95 mm**.
  Lochmitten lokal **(7,725;7,725)** und **(34,975;32,675)**.
- Foto: `~/Downloads/PXL_20261021_173403066.jpg`; Reader unten rechts,
  Buttonloch links daneben. Kein maßstäblicher Gesamtdeckel-CAD-Nachweis.
- PCB rechts/unten ungefähr **15 mm vom Deckelrand**, darunter **12 mm
  Gehäusewand**. 15 mm ist eine vorläufige Nutzerangabe, kein genauer Messwert.

Auf Wunsch **eine Holzlasche nach links zum benachbarten Buttonloch,
die andere nach oben beim rechten oberen PCB-Loch**. Keine Holzlasche nach
rechts/unten. **Alle Richtungsangaben beziehen sich auf das Nutzerfoto**, ebenso
unsere Draufsicht: +x nach Foto-rechts, +y nach Foto-oben. Laut abschließender
Nutzerklärung wird **Foto-rechts später Gehäuse-oben** (90° gegen den
Uhrzeigersinn gegenüber der Fotoansicht). Daher später: I2C links, Holzwände
oben/rechts; Laschen unten und links; PCB-Löcher unten rechts/oben links.
Das ist eine Drehung der gesamten Anordnung, keine Änderung einzelner
Stecker-/Laschenpositionen oder CNC-/Druckmaße.
**Nutzerkorrektur: I2C-Pins oben (+y), PCB-Löcher links unten/rechts oben,
Holzwände unten und rechts.** Das frühere linke Steckermodell war falsch.
Elektronik und vierpoliger I2C-Stecker nach innen; Platinenrückseite zum Glas.
Das Foto zeigt die Elektronikseite, nicht die spätere glaszugewandte Seite.
PCB-Auflagen auf freie Bauteil-/Lötbereiche prüfen.

Die Außenfläche der PCB bleibt trotz dünnerer Platine auf z=25,5 mm:
Auflagen wurden von 23,9 auf **24,35 mm** erhöht. Damit bleiben nominal
**2 mm PCB→Glas** und die M2×25-Gewinderechnung erhalten.

## Fertigungsdateien

- `geometry.scad`: gemeinsame Druck-/CNC-Parameter.
- **`pn532_mount.stl`**: nur der zu druckende Halter.
- `pn532_mount.scad`: Halter mit optionaler PCB-Vorschau.
- `panel_cnc.scad` / `panel_cnc.stl`: lokales Holz-Prüfstück, **nicht drucken**.
- `cnc-opening.dxf`: Durchbruch **47,5 × 45,2 mm, R2**.
- `cnc-rebate.dxf`: äußerer Falz **51,5 × 49,2 mm, R2, 3 mm tief**.
- `cnc-glass.dxf`: Scheibenvorschlag **51,1 × 48,8 × 3 mm, R1,8**.
- `overview.png`, `iso.png`, `iso-board.png`: Halter ohne/mit transparenter PCB.
- `height-side.png`, `exploded.png`, `outside.png`, `seated-inside.png`:
  Schichtung und Einbau. Antennenzeichnung nur schematisch.

**CNC-Konturen unverändert.** Nennkonturen in mm, kein G-Code/keine
Werkzeugkompensation. Nur von außen: erst Falz, dann Durchbruch. Kein Wenden,
keine Innentasche; wegen R2 Fräser max. Ø4. CAM, Zustellung, Werkstückhaltung
und Ausbruchschutz separat festlegen. Holzschrauben innen von Hand begrenzt
vorbohren, nicht als CNC-Durchgangslöcher ausführen.

## Abmessungen und Wandfreiheit

Druckteil-Bounds **x=−16…44,9 / y=−2,2…56,4 / z=0…24,35 mm**,
also **60,9 × 58,6 × 24,35 mm**. Gitterboden 2 mm, Raster 4-mm-Zellen/2-mm-Rippen.
**Formkorrektur:** linke Lasche mit geradem Arm/ausgerichtetem Stützsteg statt
seitlichem Versatz. Gitterausschnitte auf die Innenfläche begrenzt: umlaufender
mindestens 2 mm breiter ebener Randsteg, keine offenen Randzähne. Keine Wand.
Das ist die Umsetzung des Nutzerwunsches „gerade hoch“/fehlender „Strich“
ohne Markierung; neue Vorschau zur Sichtprüfung. Laschen-/Schraubenorte bleiben.
Vier Eckführungen: nominal 0,20 mm Spiel je Seite, 4,5 mm Eingriff ins Holz,
0,4-mm-Einführfase über 0,6 mm. Reale FDM-/Fräspassung kalibrieren.

Holzschraubenmitten **(−10;20,2)** und **(34,975;50,4)**. Laschen 11 mm breit,
3,5 mm dick; links/oben jeweils **13,6 mm über die Durchbruchkante**,
Schraubenmitte jeweils **7,6 mm außerhalb des Durchbruchs**.

Bei genau 15 mm PCB-Randabstand und bündig darunter sitzender 12-mm-Wand:
Durchbruch→Wand innen **0,6 mm**, Druckführung→Wand **0,8 mm** nominal.
Das ist knapp. Digitale Prüfung nur dieses angenommenen Wandmodells;
**Randabstände, Wandversatz, Leisten, Buttonmutter/-gehäuse und Schraubzugang
real prüfen**. Das Buttonloch allein reicht als Kollisionshülle nicht aus.
Der 3-mm-tiefe äußere Glasfalz darf über die Wandprojektion reichen, liegt
aber oben im Deckel. Die sicheren Reststärken sind real zu prüfen.

## Höhen und Schichtung

+z außen, Ursprung Druckteil-Unterseite. Holz 12 mm und Glas 3 mm weiterhin
Annahmen; PCB-Dicke jetzt Nutzer-Messwert. Komponenten-/Steckerhüllen ungemessen.

| Ebene | z [mm] | relativ zur Holzinnenseite |
|---|---:|---:|
| Druckteil-Unterseite | 0 | −18,5 |
| Gitteroberseite | 2 | −16,5 |
| Angenommene I2C-Hülle unten | 8,35 | −10,15 |
| Holzlasche unten | 15 | −3,5 |
| Holzanschlag / Deckel innen | 18,5 | 0 |
| Angenommene Elektronikhülle unten | 19,35 | +0,85 |
| Führungsspitze | 23 | +4,5 |
| PCB innen / Auflage | 24,35 | +5,85 |
| PCB außen / Schraubenkopfauflage | 25,5 | +7 |
| M2-Kopf oben, maximal | 27 | +8,5 |
| Plexiglas unten | 27,5 | +9 |
| Plexiglas / Holz außen | 30,5 | +12 |

PCB→Scheibe nominal **2 mm**, Kopf→Scheibe nominal **0,5 mm** bei Kopf max.
1,5 mm hoch. Nicht als Last-/Durchbiegungsfreigabe verstehen. NFC-Kopplung durch
3-mm-PMMA plus 2-mm-Luft ist nicht getestet. Echte Tags mit fertiger Schichtung,
Schrauben, Kabeln und Nachbarteilen prüfen; keine Metallfolie/Magnete hinzufügen.

## Schrauben und Montage

- Auf Nutzerauftrag **M2,5 statt M2**: zwei Schrauben mit rückseitigen
  M2,5-Sechskantmuttern, angenommen SW5 / Höhe2 mm. **M2,5×25 ist nur das
  Längenbeispiel**; Nutzer erklärt vorhandene Schrauben für passend, konkrete
  Kopfmaße/Länge nicht dokumentiert.
- Durchgänge Ø2,8, Mutternaufnahmen SW5,2; untere Pfosten Ø9,2 statt8 mm,
  damit radial mindestens1,5 mm Wand um die größere Tasche bleiben.
  PCB-Lage, Glasabstand, Laschen und CNC-Konturen unverändert.
  Köpfe max. Ø4 / Höhe1,5 mm; konkrete Schrauben noch prüfen, keine Scheiben
  im 2-mm-Spalt. Große PCB-Löcher sind kein Grund, Schrauben größer zu wählen.
- Muttern von hinten einlegen/halten, Taschen SW5,2 / Tiefe3,5 mm.
  Keine Clips, keine M2,5-ruthex. Spitzenende nominal z=0,5, Mutter z=1,5…3,5.
  Angenommenes Budget Schraubenlänge ±0,2, PCB-Abweichung +0,15,
  Spitzengewinde 0,3, Sitz −0,2, Mutterhöhe −0,1 mm ergibt mindestens
  1,9 mm Eingriff. Kein gemessener Festigkeitsnachweis.
- Zwei **3×12-mm-Senkkopf-Holzschrauben**: Durchgang Ø3,2, Senkung Ø6,2/90°.
  Nominal 8,5 mm Eingriff und 3,5 mm Restholz bei 12-mm-Holz. Begrenzte
  Vorbohrtiefe, echte Kopfpassung und Halt am Reststück prüfen; von Hand anziehen.
- Platine auf schmalen Ø4,6-Schraubauflagen und zwei kleinen Randstützen.
  Bauteil-/Lötfreiheit real prüfen, PCB nicht mit Schrauben geradeziehen.

Außerhalb vormontieren: Muttern, PCB, I2C-Stecker. Kabel von der oberen
Platinenkante nach innen, dann nach oben (+y) unter dem Holz führen und
zugentlasten. Kabelbinderpad ebenfalls oben, links neben der oberen rechten
Holzlasche. Reale Steckerhülle/Biegeradien prüfen: angenommene Hülle
12×4×16 mm oben, lokal x=10…22 / y=35,9…39,9, keine vermessene Dupont-/JST-Hülle.
Nur die Anschlussseite ist bestätigt, nicht die genaue Lage entlang der Kante.
Baugruppe von innen einsetzen, bis die Laschen am Holz anliegen, dann
verschrauben. Glas oder Elektronik sind kein Tiefenanschlag.

**Scheibe sicher fixieren**, nicht lose einlegen. Nutzeridee mit gebohrten,
von Hand gesenkten Schraubenlöchern ist keine geprüfte Riss-/Lastfreigabe;
Schraubenzugang, Glasrandabstände und Metallnähe zur Antenne separat prüfen.
Keine verschluckbaren losen Teile, keine scharfen Kanten.

## Drucken und prüfen

PETG als Ausgangsidee, keine Materialfreigabe. Lange Pfosten/Führungen und
Laschen brauchen geeignete Orientierung/Support; nicht supportfrei zugesagt.
Vor endgültiger Montage Führungs-/Mutternpassung und Belastbarkeit prüfen.
Halter reicht **18,5 mm unter die Holzinnenseite** in die Box.

```bash
bash 3d-print/mounts/pn532-mount/render.sh
```

Gepinnte OpenSCAD-/CGAL-/Xvfb-/Mesa-Umgebung, kein Root/Flake-Update.
`check_mesh.py` prüft die reale STL auf geschlossene, orientierte, einzelne
Oberfläche, Volumen, degenerierte Flächen und neue Bounds. `check_cnc.py`
prüft DXF-/Holz-STL und unabhängige Maßkette inklusive Messwerte.
Nach Geradstellung/Randabschluss neu exportiert und geprüft: **5.180 Dreiecke,
6.665,575 mm³, alle 19 Solid-Testgruppen PASS**, darunter 21 einzelne Einsetzlagen
und zwei neue Fehlvolumen-Prüfungen für Randsteg/gerade Stütze. Neue Iso-/PCB-
Übersicht tatsächlich angesehen. Beide neuen Tests haben die vorige STL
nachweislich abgewiesen (`logs/revision-rim-brace-red.log`). Protokoll:
`../../../docs/testprotokoll-pn532-mount.md`.
`check_fit.py` prüft Vollkörper-Schnitte mit importierter Druck-STL:
Holz, PCB, angenommene Elektronik-/Stecker-/Kabelhüllen, Glas, M2,5-Bohrungen,
21 einzelne Einsetzlagen (1-mm-Abtastung, kein lückenloser Bewegungsbeweis),
absichtliche Kollisions-Gegenproben sowie neue Holzlaschen/Bohrungen und das
**angenommene** 15-mm-Rand-/12-mm-Wandlayout. Kein Button-/Gesamtdeckelmodell.

Offen: echte Randabstände/Leisten/Buttonmutter, Stecker-/Löt-/Kopfhöhen,
Holz-/Glasstärke, Druckpassung, Festigkeit, sichere Scheibenfixierung und
NFC-Lesen im fertigen Aufbau. Digitale Prüfung ersetzt keine reale Abnahme.
