# PN532 — Foto-Korrektur, Inserts von innen

Stand **06.11.2026**, nach Wiederaufnahme vollständig neu gerechnet.
Neue Druck-STL und echte PNGs für eine **Passprobe**, keine
Produkt-/Druck-/Kindersicherheitsfreigabe. **Gefertigte Holz-/Glaskonturen bleiben
bytegleich.** Die Orientierung, M2,5×25/Muttern und 2-mm-PCB-Glasabstand des alten
Halters sind überholt. Aktuelle Nachweise ausschließlich `logs/revision/`.

## Foto-Bezug und Herleitung

Maßgeblich ist das letzte Nutzerfoto **von innen**: Bauteilseite sichtbar,
**vier I2C-Pins links, acht ungenutzte Pins oben, Löcher oben links/unten rechts**.
Großer blauer Button unten, freies Holz/Deckelmitte links, Außenrand rechts.
Fotos `img_a4a698726828.jpg`, `img_dc483ab58064.jpg`, `img_51ed6febdcb1.jpg`
zeigen alten leeren Halter, passende Rückseite und gewünschte Bauteilseite.

Gemessen/bestätigt vom Nutzer: PCB **42,7×40,4×1,15 mm**, Löcher **Ø2,93**,
nahe Kante→Lochrand jeweils **6,26 mm**, daraus Mitte **7,725 mm** und Raster
**27,25×24,95 mm**. Nicht aus dem perspektivischen Foto bemaßt.
Die originale Komponentenansicht auf Seite 2 der Elechouse-Zeichnung
(`../../../docs/cad/pn532/drawing-page2.png`) bestätigt die Anschlusskanten und
Diagonale, nicht die Identität des HW-147 oder dessen Bauteilhöhen.

**Neue lokale Foto-/Druckkoordinaten:** x rechts, y oben, z zum Innenbetrachter.
PCB-Rechteck unverändert 42,7 in x /40,4 in y. Lochmitten
**(7,725;32,675)** / **(34,975;7,725)**. Gegenüber dem alten numerischen Lochbild
ist dies **y′=40,4−y**, keine 90°-Drehung und kein quadratisches Ersatzraster.
Seitenwechsel ist eine Spiegelung; eine ebene Drehung allein tauscht die
sichtbare PCB-Seite nicht. Die alte Beschreibung „Foto-rechts wird Gehäuse-oben“
bezog sich auf eine andere, um90° gedrehte Fotoansicht und ist hier keine
Anweisung zum erneuten Drehen der gefertigten CNC-Dateien. Den Steckerdummy
lediglich umzusetzen hätte den Seiten-/Schichtungsfehler nicht behoben.

Für die echte 3D-Montage bleibt das historische CNC-System mit +Z nach außen:
**(X,Y,Z)=(42,7−x, y, 27−z)**. Das ist eine echte 180°-Drehung um Y plus
Translation, keine gespiegelte Fertigungsgeometrie. Innenansicht und CNC-Außen-
ansicht haben folglich entgegengesetzte horizontale Achsen. `assembly.scad`
wendet diese Transformation auf das unveränderte lokale Holz-/Glas-Prüfstück an.

## Laschen und Button

Zwei Holzlaschen **beide Foto-links**, Schraubenmitten **(−10;7,725)** und
**(−10;32,675)**. Das sind gewählte CAD-Punkte, **keine Foto-Messwerte**:
10 mm links der PCB, auf den beiden Loch-Y-Höhen, I2C/Kabel mittig dazwischen.
Damit wird die untere mittige Lasche vollständig von der Buttonseite entfernt,
statt sie zum rechten Außenrand zu schieben. Tab-Unterkante in XY bei y=2,225;
unterhalb des Rahmenrandes y=−2,2 steht kein Druckteil mehr vor. Neuer
Sektor-Schnitttest prüft diese Aussage, **nicht** einen erfundenen Buttonabstand.
Die vollständige Buttonmutter, Körper, Kontakte, Kabel, Leisten und deren Abstand
sind ungemessen. Kollisionsfreiheit am realen Button bleibt eine **Passprobe**.

Gitterstil unverändert: 2-mm-Boden, 4-mm-Zellen/2-mm-Rippen, geschlossener
2-mm-Rand, einzelne Pfosten. Bounds **x−16…44,9 / y−2,2…42,6 / z0…14**,
also **60,9×44,8×14 mm** im Drucksystem. Zwei Ø8,2-Auflagen, zwei Ø2,8-Randstützen;
keine Wände/Mulde. Eckführungen mit0,20 mm nominellem XY-Spiel je Seite,
8,5 mm bis zum Holzanschlag; reale FDM-Passung und Einführbarkeit prüfen.
Die alten 4,5-mm-Führungshöhen und die alte axiale Einführfase gelten nicht mehr.

## Schichtung — notwendige Änderung, CNC bleibt gleich

Damit die Bauteilseite von innen frei sichtbar ist, liegen Gitter und
Insertpfosten **glaswärts hinter der PCB**, nicht davor. Bündige Insertaufnahmen
brauchen6,7 mm Tiefe und einen geschlossenen Boden. Das lässt sich nicht in den
alten2-mm-Abstand PCB→Glas quetschen. Gewählte neue Höhe: Auflage z=10 im
Drucksystem, Holzanschlag z=8,5; Gitter z=0…2. Keine dieser Höhen ist gemessen.

| Ebene | Druck-z [mm], + innen | Historisches CNC-Z [mm], + außen |
|---|---:|---:|
| Glas | −3,5…−0,5 | 27,5…30,5 |
| Gitter, glaswärts | 0…2 | 25…27 |
| Insert-Sacklochboden | 3,3 | 23,7 |
| Insertunterkante, bündig eingesetzt | 4,3 | 22,7 |
| Holzinnenseite / Laschenkontakt | 8,5 | 18,5 |
| PCB-Rückseite / Auflage / Insertoberkante | 10 | 17 |
| PCB-Bauteilseite / Schraubenkopfsitz | 11,15 | 15,85 |
| Laschenkopfseite | 12 | 15 |
| angenommener PCB-Kopf oben | 12,65 | 14,35 |
| angenommene Elektronikoberkante | 16,15 | 10,85 |
| angenommene I2C-Hülle oben | 27,15 | −0,15 |

PCB-Rückseite liegt1,5 mm innen hinter der Holzinnenseite. PCB→Glas ist jetzt
**10,5 mm**, davon2 mm Gitterkunststoff; **nicht10,5 mm reine Luft**.
Gitter→Glas nominal0,5 mm; keine Durchbiegungs-/Lastreserve nachgewiesen.
Druckhalter ragt5,5 mm nach innen; die angenommene I2C-Hülle reicht18,65 mm,
der Pin-Darstellungsdummy19,65 mm und die hoch geführte Kabelhülle21 mm hinein. **RF-Lesereichweite ist offen**, insbesondere
wegen neuer Schichtung, Messing-Inserts, Schrauben, Kunststoff und echter Tags.

## ruthex und kurze PCB-Schrauben

Zwei **ruthex RX-M2,5×5,7**, bündig **von oben in die PCB-Auflagen**, also von der
Innen-/Bauteilseite; **PCB vorher entfernen**. Druckausrichtung Gitter aufs Bett,
Insertlöcher +z oben. Einsetzrichtung und PCB-Schraubenrichtung beide nach−z
im Drucksystem. Nicht von der Glas-/Gitterseite einschmelzen.

- Einbauloch **Ø4,0, Tiefe6,7**, Öffnung z10, Boden z3,3. Geschlossenes Material
  darunter3,3 mm, davon1,3 mm über dem Gitter.
- Pfosten **Ø8,2 über die gesamte Insertlänge**, keine dünne Ø4,6-Halszone.
  Nominal radial **1,8 mm** um größten Einsatz-Ø4,6, beim48-Eck minimal
  **1,791 mm**, damit über1,6 mm. Einpress-/Schmelzinterferenz zwischen
  Ø4,0-Loch und Ø4,6-Messing ist beabsichtigt, kein freier Steckversuch.
- Herstellerwerte und Quelle siehe `../stepup-mount/README.md`, Abschnitt ruthex.
  „Wie Step-Up“ benennt das Insertprinzip: dessen README gibt ausdrücklich
  **keine feste PCB-Schraubenlänge** vor. Alte M2,5×7-Vorgabe nicht übernehmen.
- **M2,5, nominale Länge5,65…7,20 mm** rechnerisch ohne Scheibe möglich,
  praktisch **M2,5×6 als Längenbeispiel**, nicht als vorhandenes/kaufbares
  konkretes Fabrikat behauptet. ×25 und Muttern entfallen. Zylinder-/Flachkopf,
  Länge ab Kopfunterseite; kein Senkkopf in ungefräste PCB-Bohrungen.
- Annahmen für die Maßkette: PCB1,00…1,30 (gemessen1,15), Sitzspalt0…0,10,
  Schraubenlänge±0,20, Spitzengewinde0,30, Ziel mindestens3,75 mm nutzbarer
  Eingriff und0,30 mm Reserve zum Sacklochboden. Daher
  Lmin=1,30+0,10+0,30+3,75+0,20=**5,65**;
  Lmax=6,70−0,30+1,00−0,20=**7,20**.
  ×6 ergibt konservativ **4,10 mm Eingriff /1,50 mm Bodenreserve**.
  Keine Festigkeits-/Gewindetragfähigkeitsfreigabe aus dieser Rechnung.
- Kopf im Modell max. **Ø4/Höhe1,5**, ohne Unterlegscheibe. Reales Fabrikat,
  Kopf-/Werkzeugfreiheit, Gewindeeingriff, bündiger Insertsitz und Lötfreiheit
  bleiben zu prüfen. PCB-Löcher nicht aufbohren oder Schrauben erzwingen.

**Keine vollständige Metall-/SMD-Freigabe:** Nominale Köpfe schneiden die nur
angenommene zentrale23×22×5-Hülle nicht. Mit0,215 mm radialem Lochspiel plus
0,3 mm Platzierungsreserve und um0,3 mm verbreiterter Bauteilhülle entsteht
jedoch **0,514514 mm³ Schnitt**. Das beweist keine reale SMD-Kollision, aber
verhindert ausdrücklich ein pauschales Kopf-FIT-PASS. Echte Bauteilkarte und
Schraubenköpfe am Modul prüfen. Insertmetall endet bündig hinter der PCB;
Kupfer-/Pad-Isolation und leitende Unterseitenbereiche sind nicht vermessen.

## Holzbefestigung und Vormontage

Zwei Holzschrauben, DurchgangØ3,2, SenkungØ6,2/90°, Lasche3,5 mm.
**3×12 bleibt eine frühere nominelle Vorgabe, keine Freigabe für diesen Falz!**
Bei8,5 mm Holzeingriff bleiben unter3-mm-Falz/12-mm-Holz nur **0,5 mm**
Spitzenreserve im ungünstigen Fall. Neuer Laschenort hebt das Problem nicht
pauschal auf; tatsächliche Wellenfalzüberdeckung, kürzere reale Schraube,
Vorbohrtiefe und Halt prüfen. Keine neuen Holz-/Glasfräsungen erforderlich.

Erst Heat-Set-Probestück, dann Inserts bei entfernter PCB einsetzen, kalt werden
lassen; PCB auflegen, kurze Schrauben ohne Verspannung, I2C links vormontieren.
Stecker/Kabelbinderpad links zwischen den Laschen. I2C-Hülle4×12×16,
8-Pin-Hülle22×4×8, Kabelhülle20,5×12×2, rückseitige Lotüberstände1,5 mm:
**alles Annahmen**, keine nachträglich vermessenen Fotoabmessungen.
Vormontiert von innen einsetzen, Laschen am Holz anschlagen, Holzschrauben
von innen mit Handwerkzeug anziehen. Nicht Glas oder PCB als Anschlag verwenden.
Sicher fixierte Scheibe, Zugentlastung und keine losen Kleinteile erforderlich.

## Dateien und echte Prüfungen

- **`pn532_mount.stl`**: nur Halter; `iso.png` ohne PCB, `iso-board.png` und
  `top-board.png` mit transparenter PCB, `side-board.png` gerade Seitenansicht.
- `seated-inside.png` montierte Innenansicht, `height-side.png` Holzschnitt,
  `exploded.png` Baugruppe. Elektronik/Antennenlayout sind keine exakten PCB-Daten.
- Holz/Glas unverändert: `cnc-opening.dxf`47,5×45,2 R2, gewellter
  `cnc-rebate.dxf`67,5×65,2×3, `cnc-glass.dxf`67,1×64,8,
  `pn532-glass.svg`, `panel_cnc.scad`/`panel_cnc.stl` (nicht drucken).
- `revision.test.mjs`: vier bestandene Node-Tests für Lochbild, Schichtung,
  Foto-/Prüfhüllen-Verträge und feste SHA-256-Baselines der gefertigten Dateien.
  Export prüft zusätzlich alle drei frisch erzeugten DXF **bytegleich** mit `cmp`.
- `check_revision.mjs`: unabhängige Binär-STL-Topologie, Bounds, Volumen und echte
  CGAL-Schnitte/-Differenzen an der importierten neuen STL, sequenziell.
  Leervolumen-Schwelle **0,00001 mm³**, tatsächliche leere Fälle0. An nominellen
  PCB-/Pfosten- und PCB-/Insert-Kontaktflächen wird der PCB-Prüfkörper um
  **0,001 mm nach innen zurückgezogen**, damit CGAL keine Nullstärkenfläche
  statt eines Volumens exportiert. Im **Holz-Prüfkörper** endet die Innenseite
  ebenso0,001 mm vor dem nominalen Laschenkontakt; gefertigte CNC und
  Einbau-/Explosionsansichten bleiben nominal (Schnittansicht zeigt den Prüfkörper). Dies entfernt Nullstärken-Kontaktflächen,
  keine relevante Volumenkollision und ist keine FDM-Toleranzfreigabe.
  Prüft Sacklochöffnung/geschlossenen3,3-mm-Boden, volle Einsatzwand,
  Holz/Glas/PCB, angenommene Komponenten/8-Pins/I2C/Kabel/Lot, Metall hinter PCB,
  beide Laschen und Bohrungen, Ø8-Werkzeugzugang ohne PCB bzw. Holzschrauben
  mit PCB, sowie21 Einsetzlagen0…20 mm in1-mm-Schritten. Kein kontinuierlicher
  Bewegungs- oder vollständiger Gesamtdeckelnachweis. Die exakten Vereinigungen
  von Baugruppe und Holz/Glas werden einmal als geschlossene Test-STL exportiert,
  danach **jede** Einsetzlage einzeln geschnitten; keine Stichprobe entfällt.
- Positivkontrollen:0,2 mm zu tiefer Kern4,962205 mm³;0,4-mm-seitlicher Kern
  20,458128;1-mm-XY-Versatz103,900994;1-mm-zu-tief262,994407 mm³.
  Die zusammen geprüften Bauteilhüllen werden vor dem Schnitt explizit
  **vereinigt**, nicht fälschlich gegenseitig geschnitten. Gegenproben bewegen
  jeweils eine Elektronik-/Steckerhülle absichtlich in Halter/Holz/Kopf;
  diese müssen positive Schnittvolumen liefern.
- Frisch exportierte STL **4.232 Dreiecke,5.116,214130 mm³**, eine geschlossene,
  konsistent orientierte, zusammenhängende Oberfläche, keine Nullflächen,
  keine schlechten Kanten. Kein separater Slicer-/Selbstschnittnachweis.
- Aktuell **47 digitale Solid-Prüfungen bestanden,1 ausdrücklich OPEN**
  (Kopf-/SMD-Toleranzhülle), keine Produktfreigabe. Aktuelle Rohlogs und JSON
  unter `logs/revision/`; Schnitt-STL-Prüfkörper werden beim Prüflauf erzeugt.
- `audit_revision.mjs` prüft JSON-Zählung, Quellen-SHA, alle sieben PNG-Dateien
  und sämtliche aktuellen Rohlogs auf Warnungen/Fehler.
  Nachweis `logs/revision/audit.json`.

```bash
bash 3d-print/mounts/pn532-mount/render.sh
```

Gepinntes Nixpkgs `0954f7ee2f6bb3dc7d4e3d0d8bcb8fd4bde4cfc5`,
OpenSCAD2021.01/CGAL, Xvfb/Mesa; `bash -n` und `shellcheck` im Lauf geprüft.
Keine Host-/Dienst-/Port-/Firmwareänderungen. Die alten **Python-Prüfer und
Annotationen sind unverändert, aber für die alte Orientierung/Bounds/Höhen
spezialisiert und NICHT die Abnahme dieses Standes**. Alle alten Logs außerhalb
`logs/revision/`, `overview.png`, `outside.png`, `height-raw.png`, `wave-*.png`
sowie `wave-preview/` sind historische Ansichten/Prüfungen, keine aktuelle
Mount-Freigabe. Nicht erneut als PASS übernehmen.

Offen: reale Button-/Rand-/Leistenpassung, Bauteil-/Kupfer-/Kopfhüllen,
Heat-Set/FDM-Passung/Support/Festigkeit, reale Holz-/Glasdicken, sichere
Scheibenbefestigung, Holzschraubenauswahl/Halt und NFC mit endgültiger Schichtung.
