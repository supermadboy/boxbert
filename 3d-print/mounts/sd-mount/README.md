# HW-125 / MSD-AADP — fertiger Einzelhalter

Stand 16.10.2026. Nutzerauftrag: SD-Halter fertigstellen. Eigenständiger
Gitterhalter mit vier gestuften Schraubpfosten, vier ruthex RX-M2,5×5,7 von
unten und zwei seitlichen Senkkopf-Holzbefestigungen. Kein Gehäuselayout,
keine neue Verkabelung. Der zuvor beschriebene Vorschlag ist jetzt konstruiert;
physische Passung, Materialfestigkeit und Einbau bleiben real zu prüfen.

## Dateien

- `sd_mount.scad`: parametrischer Halter und zuschaltbare Hardwarevorschau.
- `sd_mount.stl`: ausschließlich das einzelne Druckteil, ohne PCB/Schrauben.
- `iso.png`, `top.png`, `bottom.png`: Halter ohne Platine.
- `iso-board.png`, `top-board.png`, `side-board.png`: transparente PCB,
  symbolische Bauteile, Schrauben und angenommene Anschluss-/Kartenräume.
- `overview.png`, `height-side.png`: beschriftete Übersicht und gerade Höhenansicht.
- `render.sh`: gepinnter OpenSCAD-Export, echte PNGs und Prüfungen.
- `check_mesh.py`: tatsächliche STL, Topologie und modulspezifische Stichproben.
- `fit.scad`, `check_fit.py`: CGAL-Schnittmengen mit Gegenproben.
- `hole_template.scad/.stl`, `check_template.py`: unveränderte optionale
  Lochraster-Prüfschablone, kein Ersatz für den Halter.

## Belegte Grundlagen und Annahmen

**Nutzermaße:** Platine 23,68 × 41,78 mm; M2,5 passt laut Nutzer durch die
vorhandenen Löcher. Nutzerfoto:
`docs/cad/2026-10-09-sd/user-sd-top.jpg`, zeigt HW-125 mit vier Ecklöchern,
Karte gegenüber gewinkelter sechspoliger Pinleiste. Kein Unterseitenfoto.

**Ausdrücklich akzeptierte Entwurfsbasis vom 09.10.2026:** Lochraster
20 × 38 mm von [Botland](https://botland.store/memory-cards-accessories/8230-micro-sd-card-reader-module-5904422311278.html).
Dort 42 × 24 mm PCB und M2 angegeben; keine Herstellerzeichnung unserer
HW-125-Revision. Raster weiterhin nicht real gemessen. Die alte
Soldered-Zuordnung ist nicht Grundlage dieses Halters.

**Annahmen:** symmetrische Randabstände der Löcher, PCB-Dicke 1,6 mm,
Ø2,7 als PCB-Darstellungsloch, Pin-/Lötüberstände, Sockel-/Header-/Stecker-
und Kartenhüllen. Foto belegt die Anordnung, nicht deren exakte Maße.
PCB im Modell ab (10,16;7,11), vier Lochzentren global
(12;9), (32;9), (12;47), (32;47). Lokale Lochmitten auf der PCB:
(1,84;1,89), (21,84;1,89), (1,84;39,89), (21,84;39,89).
X links/rechts, Anschlussseite -Y, Kartenseite +Y; Z nach oben.

## Druckteil und Maßkette

| Merkmal | Entwurf |
|---|---|
| Nur Halter, B × T × H | **44 × 56 × 12 mm** |
| Gitter | 2 mm Boden, 4-mm-Zellen / 2-mm-Rippen |
| PCB-Unterseite / Luft über Gitter | z=12 / 10 mm |
| Vier Gewindepfosten unten | Ø8,2 bis z=8, volle Wand ohne Freistiche |
| Vier schmale Auflagen | Ø4,6 bis z=12; Schraubenkanal Ø2,8 |
| Insertkammern | Ø4,0, von unten offen bis z=6,9 |
| ruthex | RX-M2,5×5,7; Unterkante z=0,2, Oberkante z=5,9 |
| Einbautiefe ab Insertbeginn | 6,7 mm (L+1) |
| Wand um max. Insert-Ø4,6 | 1,8 mm radial |
| Obere Halswand | 0,9 mm radial, kein Insert im Hals |
| Holzbefestigung | 2 × 3 × 12 mm Senkkopf, Zentren (4;28)/(40;28) |
| Holzpolster / Loch / Senkung | 3,5 mm / Ø3,2 / Ø6,2, 90°, 1,5 mm tief |
| Material unter Senkung | 2 mm |
| Holzeingriff bei bündigem Kopf | nominal 8,5 mm; 3,5 mm Reserve bei 12-mm-Holz |

ruthex-Einbaudaten aus offizieller Zeichnung, gesichert in `docs/kernwerte.md`
und Step-Up-README. Vier Einsätze vor Holzmontage **von unten einschmelzen**,
0,2 mm zurückgesetzt, nicht von oben in den schmalen Hals. Unterseite darf
kein Metallüberstand haben. Reale Heat-Set-Passung und Halt testen.

PCB-Schrauben: **M2,5×12 ist das Längenbeispiel**, ohne zusätzliche Scheiben
bei angenommener 1,6-mm-PCB. Nominale Spitze z=1,6, Insertüberdeckung 4,3 mm.
Explizites Rechenbudget: Auflagenhöhe ±0,15, PCB-Dicke ±0,15,
Schraubenlänge ±0,2, Insert-Ende -0,2 und 0,3 mm Spitzen-/Gewindereserve:
3,3 mm verbleibender axialer Eingriff und mindestens 1,1 mm Spitzenabstand
zum Holz. Das sind Annahmen, keine gemessenen Bauteiltoleranzen.
Mit Scheiben, anderem Kopf oder abweichender PCB-/Insertlage neu prüfen.
Keine M2,5×8 übernehmen; keine Schraube gewaltsam durch PCB-Löcher drehen.

## Montage und Freiräume

1. Lochraster optional mit vorhandener flacher Schablone ohne Kraft prüfen.
2. Halter flach mit Gitterunterseite aufs Bett, Pfosten nach oben drucken.
   Keine schwebenden Druckkörper; der kleine innere Übergang Ø4→Ø2,8
   braucht eine Slicerprüfung. Nicht pauschal für jedes Profil supportfrei.
   Pfosten mit ausreichend Perimetern/lokal massiv drucken.
3. Vier Einsätze ohne Elektronik einschmelzen und mit Schrauben prüfen.
   Unterseiten-Einsätze können bei Überlast herausgezogen werden: Lastprobe.
4. Mount über die zwei außerhalb der PCB liegenden Holzlöcher befestigen.
   Kopf/Fabrikat der Holzschrauben, tatsächliche Holzstärke, Vorbohrtiefe
   und Halt zuerst am Restholz prüfen; von Hand anziehen.
5. Stromlose Platine auf vier gleich hohen Auflagen spannungsfrei aufsetzen
   und mit geeigneten flach aufliegenden Köpfen vorsichtig befestigen.
   Keine Senkköpfe in die PCB, keine Lotstelle/Stecker als Auflage.
6. Karte Richtung +Y einschieben/entnehmen, Stecker gehen Richtung -Y heraus.
   Beide Stirnseiten sind ohne Wand. Modellierter Kartenweg und Dupont-
   Körper sind Freiraumannahmen; Griffraum und echtes Kabel separat prüfen.
   Kabelzugentlastung im Gehäuse übernimmt Daddelbert.

Die angenommene Unterseitenhülle umfasst sechs Pins bis 3,4 mm unter PCB,
Löthülle r=1,1 und einen zentralen Raum bis 3 mm unter PCB. Breite Pfosten
enden 4 mm unter PCB; schmale Auflagen bleiben neben den Pinpositionen.
Eine größere reale Lötstelle oder unbekannte Unterseitenbestückung kann
Anpassungen nötig machen; keine Pins passend verbiegen/PCB verspannen.

**Reduzierte PCB-Schraubenköpfe: höchstens Ø4,0 / Höhe1,8 mm.** Nicht jede
M2,5-Schraube erfüllt das; konkreten Typ/Verfügbarkeit und reale Passung
vor Montage prüfen. Keine größere Unterlegscheibe im engen Randbereich.
Kopfhüllen werden nominal sowie mit 0,1 mm radialem Schraubenspiel und
0,1 mm XY-Zugabe an angenommenen Bauteilhüllen geprüft. Die 15,24-mm-
Headerhülle entspricht sechs angenommenen 2,54-mm-Positionen; Sockelhülle
ist eine Entwurfsannahme aus der sichtbaren Anordnung, keine Maßzeichnung.
Diese Hüllen dürfen nicht als Nachweis der echten Kopf-/Sockelabstände
missverstanden werden. Ein früherer symbolischer Ø4,5-Kopf überlappte die
damalige Headerhülle (RED), darum keine pauschale Freigabe normaler Köpfe.

## Reproduktion und Nachweise

Vom Repo-Hauptverzeichnis:

```bash
bash 3d-print/mounts/sd-mount/render.sh
python3 3d-print/mounts/sd-mount/check_template.py
```

Voraussetzung: Nix mit `nix-command`/`flakes` und Zugriff auf die gepinnten
Pakete. `render.sh` betritt einmal seine Nix-Shell, auch wenn Host-Werkzeuge
vorhanden sind: OpenSCAD 2021.01/CGAL, `xvfb-run`, ShellCheck und Python mit
Pillow stammen aus Nixpkgs
`github:NixOS/nixpkgs/0954f7ee2f6bb3dc7d4e3d0d8bcb8fd4bde4cfc5`.
Python/Pillow wird als `python3.withPackages (ps: [ ps.pillow ])` bereitgestellt
([offizielles Nixpkgs-Handbuch](https://nixos.org/manual/nixpkgs/stable/#python.withpackages-function));
kein separat installiertes Pillow nötig. Xvfb/Mesa nur für den Benutzerprozess,
kein Root, keine System-/Firmwareänderung. Rohlogs
unter `logs/`. `logs/red-template.log` belegt, dass der neue Haltertest am
vorherigen flachen Schablonenexport erwartungsgemäß scheitert.

Digitale Ergebnisse: tatsächliche STL mit 7776 Dreiecken, geschlossen,
zusammenhängend, konsistent orientiert und ohne degenerierte Dreiecke;
77 Material-/Luftstichproben (nicht erschöpfend) und zwölf Solid-Fälle
einschließlich vier absichtlicher Kollisions-Gegenproben bestanden.
Kollisionskriterium der Solid-Prüfung: Schnittvolumen **>0,001 mm³**;
negative Fälle bestehen bei **≤0,001 mm³**, nicht zwingend exakt null.
Dies ist keine Behauptung vollständiger Schnittmengenfreiheit.
Vollständige Einordnung und Maßketten:
[`docs/testprotokoll-sd-mount.md`](../../../docs/testprotokoll-sd-mount.md).

Digitale Prüfung ersetzt keine Druck-/Passungs-/Belastungs-/Kindersicherheits-
freigabe. Insbesondere Lochraster, reale Unterseite, PCB-Schraubenköpfe und
Heat-Set-Halt zuerst am echten Teil bzw. Probedruck vergleichen.
