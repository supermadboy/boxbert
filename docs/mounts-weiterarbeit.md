# Übergabe — Einzel-Mounts

Stand **09.10.2026 nach ausdrücklichem AW9523-Neustartauftrag**.

## MAX98357A / ADA3006 — Vorschlag 09.10.2026

Separater Nutzerauftrag und ausdrücklicher Wunsch: Expertenvorschlag bauen,
Nutzer schaut anschließend an. `3d-print/mounts/max98357-mount/` enthält
SCAD/STL und sechs tatsächlich angesehene Vorschauen. 38 × 26 × 12 mm,
zwei gestufte Gewindepfosten + zwei massive Stützen, Einsätze von unten,
zwei seitliche Senkkopflöcher. Quell-/STL-Prüfung PASS, kein Drucktest.
Noch keine Nutzer-Sichtabnahme der Form/Einsatzmontage/Holzlochanzahl.
Reale Lot-/Steckerfreiheit, Heat-Set-/Lastprobe, Schrauben-/Holzpassung offen.
Nutzerfoto/-bestätigung und Herstellerfoto stimmen visuell überein:
bestelltes ADA3006, alte Klon-Einordnung widersprochen; Original-Mono-PCB
17,78 × 19,05, zwei Ø2,5-Löcher im Abstand 12,70. Quellen/Prüfung:
`docs/cad/2026-10-09-max98357-mount/`,
`docs/testprotokoll-max98357-mount.md`, Mount-README. Keine Pin-/Railänderung.

## Aktueller AW9523-Stand

Der Nutzer hat den ersten Expander-Mount verworfen und einen kompletten
Neustart beauftragt. **Aktuell neu konstruiert:**
`3d-print/mounts/aw9523-mount/`, SCAD, STL, sechs Vorschauen, Render-/Mesh-
Prüfskripte. Der Vorgänger liegt unverändert in dessen
`archive/rejected-2026-10-09/`, ist verworfen und keine Vorlage.

Neuer Vorschlag: 56 × 26 × 12 mm, 2-mm-Gitter (4-mm-Zellen/2-mm-Rippen),
vier einzelne Auflagen. Zwei diagonale gestufte Schraubpfosten, zwei
massive Stützen. Gewindebereich Ø 8,2 endet 4 mm unter der PCB; oben
schmale Ø-4,6-Auflage. **Keine Pin-Freistiche, keine dünne Einsatzwand.**
Zwei ruthex RX-M2,5×5,7 werden von **unten** eingesetzt, 0,2 mm
zurückgesetzt, volle Wand 1,8 mm um max. Einsatz-Ø 4,6. Holzschrauben
links/rechts außerhalb der PCB-Projektion, auch montiert zugänglich.

**Noch vom Nutzer zu entscheiden:**

1. Unterseiten-Einsatzmontage statt des bisher gewünschten bündigen
   Einsetzens in die Pfostenoberkante.
2. Zwei 3 × 12 mm Senkkopf-Holzschrauben (Ein-Loch-Wunsch war Step-Up-
   spezifisch; keine Expander-Anzahl freigegeben).

Keine Druck-/Passungsabnahme. Pin-/Lot-Hüllen sind nur Entwurfsgrenzen:
3,4 mm Überstand, Lotradius 1,1 mm. Reale Hardware prüfen, nicht passend
zwingen. M2,5×12 nur Schrauben-Rechenbeispiel bei angenommener 1,6-mm-PCB;
alte M2,5×8-Empfehlung gilt nicht mehr. Schraubenkopf und Ø-2,5-PCB-
Bohrungen an echten Schrauben ohne Kraft prüfen.

Quellen frisch ausgelesen: Original-Eagle-Boardfile inkl. Padrotation,
38,1 × 17,78 mm, vier Ø-2,5-Löcher; **gerundete Ecken R2,54**, nicht
gefast. Hersteller-Unterseitenfoto zeigt keine bestückten Bauteile,
aber beweist keine Nutzer-Lötstellenhöhe. Neue Quellenkopien/Rohlogs und
`verify_source.py`: `docs/cad/2026-10-09-aw9523-redesign/`.
STL Mesh PASS, sechs Bilder tatsächlich angesehen. Prüfprotokoll:
`docs/testprotokoll-aw9523-mount.md`. Details: Mount-README und `To-Do.md`.

## Bestätigtes Grundprinzip für weitere Aufträge

- AW9523 = **Adafruit ADA4886**, nicht MCP23017.
- Einzel-Mounts, regelmäßiger durchbrochener Gitterboden, einzelne
  Abstandspfosten; keine Wände, Mulden oder L-Auflagen.
- Stilvorlage: `3d-print/mounts/stepup-mount/`, aktuelle Senkkopf-Version
  vom Nutzer digital positiv bewertet, nicht physisch getestet.
  Abgelehnten Step-Up-Archivstand niemals als Vorlage verwenden.
- Holzbox außen 250 × 180 × 110 mm, **12 mm Pappelsperrholz**, Deckel/
  Boden abschraubbar; keine Holzbeschaffung bestätigt.
- **3 × 12 mm Senkkopf-Holzschrauben**, nicht M3-Maschinenschrauben/M4.
  Kopf/Fabrikat und Holztest mit begrenzter Vorbohrtiefe offen.
- ruthex RX-M2,5×5,7 laut Nutzer bestellt. Herstellerwerte Ø-4,0-Einbauloch,
  Tiefe mindestens 6,7 mm, Wand min. 1,6 mm. Keine dünnen Sektoren als
  fertige Lösung übernehmen; Einbau-/Lastprobedruck nötig.
- Step-Up-spezifisch: ein Holzloch, ein Schraubpfosten plus zwei mittige
  Stützen; nicht auf neue Module pauschal übertragen.

## Vorgehen

Vor neuem Mount: `hardware/gehaeuse-konzept.md`, BOM, Kernwerte und
CAD-Abschnitt in `docs/findings.md` lesen. Herstellerkontur, **drill**-
Werte, Lochbild, Unterseitenbauteile und Anschlüsse selbst prüfen.
Nur bei realer Hardware-Unklarheit Nutzerfoto/Messung anfragen.
Neue notwendige Konzeptabweichungen abstimmen, nicht erneut das bereits
bestätigte Gitterprinzip diskutieren. Ein angekündigter Folgeprompt ist
noch kein Bauauftrag.

Neues Modul separat, vorhandene Referenz unverändert. STL nur Mount;
Vorschauen ohne und mit transparenter Platine. Neue Prüfkoordinaten,
Bounds und tatsächliche neue Export-/Prüflogs. OpenSCAD 2026.09.18,
CGAL/hardwarnings/binstl, offscreen-Bilder. CAD-/Mesh-Erfolg und reale
mechanische Abnahme strikt trennen. Keine Firmware-/Railänderungen für
Mount-Aufträge. Weitere SD-/Amp-Mounts nur nach eigenem Auftrag.
