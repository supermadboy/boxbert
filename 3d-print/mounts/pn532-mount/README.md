# PN532 — Außenfoto-Korrektur

Stand **10.11.2026**, Basis `319ff7a`. Echte STL/PNGs und digitale
Passprüfungen, **keine Fertigungs-/Druck-/Kindersicherheitsfreigabe**.
Der Entwurf vom06.11. war falsch: Das Sollfoto zeigt die **Außenseite** des
Deckels mit Buttonkappen, nicht innen. Dessen Schichtung und beide linken
Holzlaschen sind ersetzt. Gefertigte Holz-/Glasdateien bleiben bytegleich.

## Foto und Koordinaten

Sollfoto `img_864b6372ad1a.jpg`: Bauteilseite zum Betrachter/Glas,
**vier I2C-Lötenden links, acht Lötenden oben, Löcher obenlinks/untenrechts**,
blauer Button unten, Gehäuserand rechts. Gegenfoto `img_3b57961b9cd2.jpg`
zeigt die unbestückte Rückseite mit langen Stiften: **Stecker/Pins hinten ins
Gehäuse**, nicht glaswärts. Die Seitenzuordnung ist aus beiden Fotos abgeleitet;
Stecker-, Lot- und Bauteilhöhen sind weiterhin ungemessene CAD-Hüllen.
Die drei Nutzerfotos mit eindeutiger Ist-/Sollzuordnung sind dauerhaft unter
[`docs/cad/pn532/photo-correction-2026-11-10/`](../../../docs/cad/pn532/photo-correction-2026-11-10/README.md)
gesichert; die Cache-Dateinamen oben dienen nur der ursprünglichen Zuordnung.

Lokales Foto-/Drucksystem: x rechts, y oben, **+z außen/glaswärts**, −z innen.
Bestätigte PCB42,7×40,4×1,15 mm, LöcherØ2,93, nahe Kante→Lochrand6,26 mm.
Lochmitten **(7,725;32,675)/(34,975;7,725)**, Raster27,25×24,95.
Keine 90°-Drehung einer vermeintlich quadratischen PCB.

Das historische CNC-System hat ebenfalls +Z außen. Daher jetzt ausschließlich
**(X,Y,Z)=(x,y,z+10,85)**, also reine Translation zwischen Druck- und CNC-
Koordinaten. Die bisherige180°-Y-Drehung `(42,7−x,y,27−z)` beruhte auf dem
falschen Innenblick und entfällt. Insbesondere wird die **asymmetrische Welle
nicht gespiegelt**. Die vier Eckführungen bleiben im originalen Durchbruch:
0,20 mm nominelles XY-Spiel/Seite,1,5-mm-Wand,4,5 mm Einstecktiefe ab Holzinnen-
seite. Keine zusätzliche Layoutdrehung/Fräsänderung aus älteren Fotos ableiten.

## Laschen

Eine Holzlasche **links oben** bei **(−10;32,675)**; zweite bleibt an der
**Unterkante**, Schraubenmitte **(38,4;−10)**, nach unten ragend.
Sie wandert entlang der Unterkante weit nach rechts, nicht an die rechte Kante.
Die Wahl ist ein **konservatives relatives CAD-Maximum** für den vorhandenen
6-mm-Hals: rechtsseitiger Guide-Hüllkasten beginnt bei x41,6; Hals endet mit
0,2 mm Nennabstand bei41,4 → Mitte38,4. Pad12×11, rechte Padkante44,4 liegt
noch innerhalb des Rahmen-Hüllmaßes44,9. Das ist kein aus dem Foto gemessener
Button-/Leistenabstand und kein globales mathematisches Optimierungsresultat
für beliebige neu gestaltete Laschen. Hals, Guide, Insert und Holzauflage sind
digital geprüft. Reale Buttonmutter/-körper, Kontakte, Leisten und
Schraubwerkzeugzugang bleiben **Passprobe**.

## Schichtung und Abstand

**Außen → Glas → Bauteile/kurze Lötenden/Köpfe → PCB → Insertpfosten/Gitter → innen.**
Kein Gitter zwischen Glas und Elektronik. Lange rückwärtige Stifte/Steckhüllen
bekommen zwei lokale Freistiche im Gitter; keine große Vertiefung/Mulde.

| Ebene | Lokales z [mm], + außen |
|---|---:|
| Kabelhülle (Annahme) | −8…−6 |
| I2C-Steckhülle4×12×16 (Annahme) | −6…10 |
| Gitter | 0…2 |
| 8-Pin-Hülle22×4×8 (Annahme) | 2…10 |
| Insert-Sacklochboden | 3,3 |
| Laschen, Senkung auf Innen-/Unterseite | 4,15…7,65 |
| Einsatz, bündig | 4,3…10 |
| Holzinnenseite/Laschenanschlag | 7,65 |
| PCB-Rückseite/Auflage | 10 |
| PCB-Bauteilseite | 11,15 |
| Führungsende | 12,15 |
| KöpfeØ4/Höhe1,5 und Lötenden (Annahmen) | bis12,65 |
| SMD-Hülle23×22×5 (unvermessene Annahme) | 11,15…16,15 |
| Plexiglas | 16,65…19,65 |
| Holz | 7,65…19,65 |

**2 mm PCB-Bauteilseite→Glas war zuerst zu prüfen**, nicht wegen rückwärtiger
16-/8-mm-Stecker vergrößern! Mit der beibehaltenen, ungemessenen5-mm-SMD-Hülle
würden bei2 mm jedoch3 mm kollidieren (Gegenprobe1518 mm³). Der jetzige
**vorläufige CAD-Abstand5,5 mm =5 mm angenommene SMD-Höhe +0,5 mm nominelle
Freireserve** folgt nur dieser Hülle. Es ist **kein gemessener Mindestabstand**
und keine Nutzer-/RF-Abnahme. Die0,5 mm sind gewählte Entwurfsreserve, kein
Toleranznachweis. Bei gewünschter Reserve0,5 mm wäre2 mm nur mit allen realen
Aufbauten ≤1,5 mm möglich; Köpfe und Lot zusätzlich prüfen. Nach echter
Höhenmessung lässt sich die Einbauhöhe gezielt reduzieren. Lange Stecker
liegen hinten und erzwingen diesen Glasabstand ausdrücklich nicht.

## Inserts, Schrauben, Montage

Zwei **ruthex RX-M2,5×5,7**, EinbaulochØ4,0/Tiefe6,7, PfostenØ8,2;
nominal1,8 mm Material um max. EinsatzØ4,6 (48-Eck minimum1,791).
Geschlossener Sacklochboden3,3 mm, Einsatzoberkante bündig auf z10.
**Von oben an der späteren PCB-Auflagenseite bei entfernter PCB** einsetzen:
Werkzeug von+z, Einsatzbewegung nach−z. Nicht durch die PCB einschmelzen.
PCB-Schrauben kommen anschließend von der Bauteil-/Glasseite nach−z.
Die Holzschrauben werden getrennt dazu von innen nach+z gesetzt; ihre
Senkung liegt auf z4,15. Druckorientierung: Gitter z0 aufs Bett;
Laschenunterseiten und lokale Brücken sind Überhänge, Slicer/Support prüfen.
NeoPixel-Vorlage unverändert.

Kurze M2,5, ohne Scheibe, **5,65…7,20 mm** rechnerisches Nennlängenfenster;
**M2,5×6 nur Beispiel**, keine neue vorhandene Schraube behauptet.
Annahmen PCB1,00…1,30, Sitzspalt0…0,10, Länge±0,20, Spitzengewinde0,30,
Mindesteingriff3,75, Bodenreserve0,30 mm: Lmin1,30+0,10+0,30+3,75+0,20;
Lmax6,70−0,30+1,00−0,20. ×6 ergibt konservativ4,10 mm nutzbaren Eingriff und
1,50 mm Bodenreserve. Reale Kopfkontur/Werkzeug/Isolation/Tragfähigkeit prüfen,
PCB-Löcher nicht aufbohren oder Schrauben erzwingen.

**Kopf-/SMD-Toleranz bleibt OPEN:** Nominale Köpfe passen zur angenommenen
zentralen Hülle, mit0,215 mm Lochspiel+0,3 mm Platzierungsreserve und0,3 mm
verbreiterter SMD-Hülle entsteht0,514514 mm³ Schnitt. Keine behauptete reale
Kollision, aber auch kein pauschales Kopf-FIT-PASS. Reale SMD-/Kupferkarte fehlt.

Holzlaschen3,5 mm, DurchgangØ3,2, SenkungØ6,2/90°.
**3×12 nicht pauschal freigeben:** bei Falzüberdeckung bleiben nominell nur
0,5 mm Spitzenreserve zum Falzboden (12−3−(12−3,5)). Reale Holzschraubenlänge,
Vorbohrung/Halt und Wellenfalzüberdeckung separat abstimmen.

Inserts ohne PCB setzen/abkühlen; PCB verschrauben, rückwärtigen I2C-Stecker und
Kabel außerhalb vormontieren; Einheit von innen durch vorhandenen Durchbruch
schieben. Laschen schlagen am Holz an, nicht PCB/Glas. Holzschrauben von innen
mit Handwerkzeug anziehen. Scheibe separat sicher fixieren; keine losen Teile.

## Dateien und aktuelle Verifikation

- `pn532_mount.stl`: **nur Halter**,60,9×58,1×12,15 mm;
  Bounds(−16;−15,5;0)…(44,9;42,6;12,15).
- Frische PNGs1200×950: `iso.png`, `iso-board.png`, `top-board.png`,
  `side-board.png`, **`seated-outside.png`**, `height-side.png` (gerader echter
  Schnitt bei Foto-y20,2 mit Höhen), `exploded.png`. Transparente PCB zeigt absichtlich
  das dahinterliegende Gitter; das ist kein Gitter auf der Glas-/Bauteilseite.
  Schwarzer Zentralblock ist eine konservative Hülle, kein exaktes PCB-Bauteilmodell.
  Nur in `seated-outside.png` ist die Glasdarstellung um0,01 mm angehoben,
  um koplanare OpenCSG-Transparenzartefakte am Falzkontakt zu vermeiden;
  Schnittansicht, Kollisionsprüfungen, Einbauparameter und CNC bleiben nominal.
- Gefertigte Dateien unverändert: `cnc-opening.dxf`, `cnc-rebate.dxf`,
  `cnc-glass.dxf`, `pn532-glass.svg`, `panel_cnc.scad`, `panel_cnc.stl`,
  `../common/wave.scad`. SHA-Baselines in `revision.test.mjs`; alle drei DXF
  zusätzlich frisch erzeugt und mit `cmp` bytegleich geprüft.
- **Test-first:** Außenschichtungs-Regressionsprüfung zuerst rot, dann grün;
  anschließend Laschen-Regressionsprüfung rot (`tdd-tabs-red.log`), dann grün.
  Fünf Node-Verträge bestanden (einschließlich Pin-/Prüfhüllen-Konsistenz). Solid-Tests sind echte CGAL-Schnitte/Differenzen
  mit importierter neuer STL, keine Source-Regex als Ersatz für Meshprüfung.
- STL **4148 Dreiecke,4817,521204 mm³**, eine geschlossene, konsistent orientierte,
  zusammenhängende Oberfläche, keine schlechten Kanten/Nullflächen.
  Bestehende Python-Funktion `check_mesh.py:mesh()` zusätzlich frisch ausgeführt;
  deren altes CLI-Boundsprofil ist nicht die Abnahme dieser Revision.
- `logs/photo-exterior/`: aktuelle Rohlogs, `results.json`, `audit.json`.
  **53 PASS,0 FAIL,1 OPEN**, Schnitt-Leervolumen-Schwelle0,00001 mm³,
  tatsächliche Leerfälle0. Einschließlich Laschenmaterial/-auflage/Bohrungen,
  Sacklochboden/-wand/-öffnung, Werkzeugzugang, PCB/Holz/Glas/Hüllen,
  freie Außenprojektion ohne Gitter, rückwärtige Stecker und **21 einzeln
  geschnittene Einsetzlagen0…20 mm nach innen** (1-mm-Schritte).
  Gegenproben für Tiefen-/XY-Fehler, verschobene Einzelhüllen,
 2-mm-Glasabstand und absichtlich vor die PCB verlagertes Gitter liefern
  positive Schnitte. Kein kontinuierlicher Bewegungs-/Gesamtdeckelnachweis.
- Nur nominelle Kontakte Holz/Lasche und PCB/Pfosten/Insert werden im Prüfkörper
  um0,001 mm zurückgenommen, damit CGAL keine Nullstärkenflächen exportiert.
  CNC-Dateien, Einbauhöhe und Zeichnungen bleiben nominal.
- `audit_revision.mjs` kontrolliert aktuelle Quellen-SHA, JSON-Zählung,
  PNG-Signaturen/Abmessungen und aktuelle Logs auf CAD-Warnungen/Fehler.
  Gepinntes Nixpkgs `0954f7ee2f6bb3dc7d4e3d0d8bcb8fd4bde4cfc5`,
  OpenSCAD2021.01/CGAL, Xvfb/Mesa; `bash -n` und `shellcheck` bestanden.

```bash
bash 3d-print/mounts/pn532-mount/render.sh
```

Alle Logs unter `logs/revision/` und sonstige alte Nicht-`photo-exterior`-Logs
sowie `overview.png`, `outside.png`, `seated-inside.png`, `height-raw.png`,
`wave-*.png`/`wave-preview/` sind historisch, **keine aktuelle Freigabe**.
Keine alten Python-Orientierungsprüfungen als PASS übernommen.

**Offen:** reale SMD-/Kopf-/Lot-/Steckermaße (insbesondere2-mm-Ziel),
Button-/Rand-/Leisten-/Werkzeugpassung, Heat-Set/FDM/Support/Festigkeit,
Holz-/Glas-Istmaße und Scheibenfixierung, Holzschrauben/Halt, NFC-Reichweite
mit endgültiger Schichtung/Metall/echten Tags. Kein Druck, kein Slicer-
Selbstschnittnachweis, kein realer Montage-/Last-/Kindersicherheitstest.
Keine Firmware-/Host-/Dienständerung, kein Commit/Push.
