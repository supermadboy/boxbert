# MAX98357A / ADA3006 — Einzel-Mount (Vorschlag)

Stand 09.10.2026. Nutzerauftrag: Expertenvorschlag erstellen, anschließend
Sichtprüfung durch Nutzer. Keine physische Druck-/Passungsabnahme.
Step-Up und AW9523 bleiben unverändert.

## Anschauen

- `iso.png` / `top.png`: nur der Mount.
- `iso-board.png` / `top-board.png` / `side-board.png`: transparente Platine.
- `bottom.png`: Zugang zu den zwei Einsatzkammern von unten.
- `max98357_mount.stl`: ausschließlich der Mount, keine Platine/Einsätze.
- `max98357_mount.scad`: parametrischer Entwurf.

## Entwurf

**38 × 26 × 12 mm**, 2-mm-Gitterboden, 4-mm-Zellen und 2-mm-Rippen.
PCB-Unterseite bei z=12: 10 mm Abstand über dem Gitter.
Zwei Schraubpfosten an den originalen Montagelöchern, zwei separate massive
Ø4-Stützen auf unbestückten Unterseitenbereichen, weg von der Anschlussreihe.
Keine Wände, Mulde oder erhöhte L-Auflage.

Schraubpfosten unten Ø8,2 bis z=8; darüber Ø4,6-Auflage mit Ø2,8-Kanal.
Volle 1,8-mm-Wand um den maximalen Ø4,6-ruthex-Einsatz, keine Freistiche.
**Zwei RX-M2,5×5,7 von unten einsetzen**, 0,2 mm zurückgesetzt.
Einbauloch Ø4,0, nutzbare Kammer 6,7 mm; endet bei z=6,9.
Das ist eine bewusste Abweichung zur bündigen Obermontage beim Step-Up,
als Vorschlag zur Sichtprüfung, nicht bereits vom Nutzer abgenommen.

Zwei seitliche Holzschraubpolster außerhalb der PCB-Projektion, auch mit
montierter PCB zugänglich: 3 × 12 mm Senkkopf-Holzschrauben in 12-mm-Pappel.
Durchgang Ø3,2; Senkung Ø6,2/90°; Polster 3,5 mm, darunter 2 mm Material.
Nominal 8,5 mm Holzeingriff und 3,5 mm Reserve. Kopfpassung, Ist-Holzstärke,
begrenzte Vorbohrtiefe und Halt am Reststück prüfen. Kein gekauftes
Schraubenfabrikat vorausgesetzt; von Hand anziehen.

## Quellen und Abgleich

Nutzerfotos vom 09.10.2026 und Nutzerbestätigung, dass es das bestellte
ADA3006 ist; Herstellerfoto visuell passend. Original-Mono-Eagle-PCB:
17,78 × 19,05 mm, Ecken R2,54, zwei Ø2,5-Löcher im Abstand 12,70 mm.
Die alte Klon-Behauptung im Testprotokoll ist durch Foto/Bestätigung
widersprochen, nicht Grundlage dieses Entwurfs. Keine neue Verdrahtung.
Quellenkopien, `verify_source.py`, Rohlogs und Fotobelege:
`docs/cad/2026-10-09-max98357-mount/`.

ruthex-Werte aus offizieller Herstellerzeichnung, siehe `docs/kernwerte.md`
und Step-Up-README. Keine anderen Modulmaße übernommen.

## Annahmen und reale Prüfung

Unterseite auf Nutzerfoto ohne SMD-Bauteile; Lötstellenhöhe nicht gemessen.
Rot dargestellte Hülsen sind **Entwurfsgrenzen**: bis 3,4 mm Überstand,
Lotradius bis 1,3 mm. Freiraum zur nächsten oberen Auflage nominal ca.
1,06 mm; breiter Pfosten endet 4 mm unter PCB. Angeschlossene Stecker,
Kabelbiegung und echte Lötstellen beim trockenen Zusammenbau prüfen.
PCB-Dicke 1,6 mm und grüner Klemmenblock sind reine Vorschauannahmen;
Klemmenblock ist symbolisch, nicht maßhaltig. Schraubenköpfe fehlen im
Bild: reale Kopfpassung neben der Klemme zusätzlich prüfen.

M2,5 ohne Kraft durch die Ø2,5-PCB-Löcher prüfen, nicht aufbohren.
**M2,5×12 nur Rechenbeispiel**, kein Kauf-/Passungsentscheid:
bei 1,6-mm-PCB liegt die Spitze bei z=1,6, mit ca. 4,3 mm nominalem
Gewindeeingriff in den Einsatz (z=0,2…5,9). Reale PCB-Dicke, Kopf,
Unterlegscheibe und Schrauben-Istlänge entscheiden. Nicht fest anziehen,
bevor Insert-Halt/Schraubenlänge und Halsbelastbarkeit getestet sind.

Montagevorschlag: Probedruck und Einsatzpassung testen; Einsätze von unten
vor der Holzmontage einschmelzen. Gerade einsetzen, abkühlen lassen,
Auszug-/Verdrehhalt prüfen. Mount zunächst auf Holz befestigen, dann PCB
vorsichtig aufsetzen/verschrauben; Unterseiteneinsätze nicht durch zu hohe
Schraubenkraft nach unten herausziehen. Demontage des Mounts macht die
Unterseiten zugänglich. Platine spannungsfrei auf allen vier Auflagen;
keine Kabelzugkräfte über Platine/Klemme abfangen.

## Reproduktion / digitaler Prüfstand

```sh
./render.sh
python check_mesh.py
python ../../../docs/cad/2026-10-09-max98357-mount/verify_source.py
```

OpenSCAD 2026.09.18, offscreen; STL CGAL/hardwarnings/binstl.
Tatsächliche STL: 7188 Dreiecke, Volumen 2421,073 mm³; Bounds
(0,0,0)…(38,26,12). Geschlossen, konsistent orientiert, zusammenhängend,
keine degenerierten Dreiecke. Koordinatenprüfungen für Kammern, umlaufende
Wand, Schraubenkanäle, Senkungen, getrennte Pfosten und Lot-Hüllen PASS.
Sechs exportierte Bilder tatsächlich angesehen. Prüfprotokoll:
`docs/testprotokoll-max98357-mount.md`. Kein mechanischer Last-/Sicherheitsnachweis.
