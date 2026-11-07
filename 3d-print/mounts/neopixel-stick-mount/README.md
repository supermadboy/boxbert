# NeoPixel-Stick — Deckelhalter / CNC

**Aktuell 07.11.2026:** zwei vorhandene ruthex **RX-M2,5×5,7 von oben**, bündig
an der unveränderten PCB-Unterseitenauflage; **M2,5×12** vom Nutzer bestätigt.
Die kleinen Schraubenköpfe passen laut seiner realen Probe von oben am PCB.
Diese Probe wird anerkannt. Genaue Kopfhöhe/-kontur sind nicht dokumentiert:
keine erfundene Kopfhülle im CAD und keine numerische Kopf-/LED-/Glasfreigabe.
Keine reale Druck-, Heat-Set-, Fräs-, Last- oder Lichtprüfung durch den Agenten.

## Unverändert / Messgrundlage

Nutzermaße und Foto: `../../../docs/cad/neopixel-stick/measurement-2026-10-21/`.
PCB **54×9,9×1,6**, PCB-Unterseite→LED oben3,23, somit LED-Aufbau1,63 mm.
Zwei Löcher **Ø3**, freier Lochabstand23, Raster26; Lochmitten
**(13,7;7,7)/(39,7;7,7)**. Rechter Lochrand→PCB-Ende12,8 und nahe lange
Kante→Lochrand0,7 mm. Ursprung linke vordere PCB-Ecke; +x rechts, +y zur
Lochreihe, +z nach außen / LED-Seite.

Nur die **zwei Schraubpfosten** lokal angepasst: Ø8 bis zur bestehenden
PCB-Auflage z14,77 statt dünnem Ø3,8-Hals, ohne Muttertaschen. Der volle obere
Pfosten ist für die Herstellerwand um den Insert nötig, keine neue Außenform.
Sonstige Form, **mittlerer Bereich/Loch**, Lochpositionen, PCB-Höhe, Gitter,
Führungen, Holzlaschen, Kabelausgang und CNC unverändert. Ein Vollkörpervergleich
zur Vorgänger-STL prüft hinzugefügtes UND entferntes Material außerhalb zweier
Ø8,02-mm-Zylinder um die bisherigen Schraubachsen; CNC wird bytegenau verglichen.

Beide Holzlaschen bleiben im Deckelfoto links zur Deckelmitte/Lochreihe (lokal+y),
Schraubenpunkte(20;19,9)/(34;19,9). Kabelausgang und Kabelbinderpad bleiben am
anderen kurzen Ende, **lokal+x/rechts**. Das ist keine elektrische DIN-/Padfreigabe.
Das Gesamtdeckel-Layout mit Buttons/Leisten/NFC übernimmt der Nutzer.

LED-/SMD-XY und Kabel-/Lotpositionen sind weiter nur angepasste historische
Adafruit-Referenzhüllen, keine gemessene Bestückungszeichnung dieses Boards.
Die reale Kopfprobe wird nicht durch Konflikte dieser alten Annahmen verworfen.

## Inserts und Schrauben

**Zwei RX-M2,5×5,7 von oben (+z) ohne PCB einschmelzen**, bündig an der späteren
PCB-Unterseitenauflage. Danach abkühlen lassen, PCB auflegen und mit den
bestätigten **M2,5×12 von oben** befestigen. Nicht durch die PCB einschmelzen,
keine PCB-Bohrung aufweiten und keine Schraube erzwingen. Alte M2×16 mit
rückseitigen Muttern sind überholt.

| Merkmal | CAD / Rechnung [mm] |
|---|---:|
| Einbauloch | Ø4,0, Tiefe6,7 von z14,77 nach z8,07 |
| Einsatz | L5,7, bündig oben z14,77, unten z9,07 |
| Reserve unter Einsatz | 1,0 bis zum Übergang auf Ø2,8 |
| Pfosten | Ø8, nominal1,7 Wand um max. Einsatz-Ø4,6 |
| Schraubenkanal | Ø2,8 vollständig bis zur Druckteil-Unterseite durchgehend |
| Schraubenspitze M2,5×12 ab PCB oben | z4,37 |
| Nominaler Überstand unter Einsatz | 4,7 |

Kein Sacklochboden, kein Stopfen, keine Muttertasche. Längere Schrauben können
unten austreten; deren Freiraum zur realen Umgebung dann prüfen. M2,5×12
endet im freien Kanal, nicht im Kunststoff, und erreicht die volle nominale
Insertlänge5,7. Zusätzliches **angenommenes, nicht gemessenes** Budget:
Schraubenlänge−0,2, PCB+0,15, unvollständiges Spitzengewinde0,3, Sitz+0,2 mm;
auch dann reicht die Spitze über den gesamten nominalen Einsatz hinaus.
Das ist keine Messung der realen Schrauben-/Innengewindetoleranzen.

Herstellergrundlage: `../stepup-mount/README.md`, `../../../docs/kernwerte.md`:
EinbaulochØ4,0, Mindesttiefe6,7 (L+1), Mindestwand1,6, L5,7/max.Ø4,6.
Die kalte Ø4-Aufnahme ist kleiner als die heiße Rändelhülle: Messing in den
Vorschauen zeigt den eingebauten Maximaldurchmesser, **keinen kalten
Durchstecktest**. Der Solid-Wandtest verlangt mindestens1,6 mm durchgehenden
radialen Materialring außerhalb des max. Einsatzdurchmessers.

## Höhen, Druck und Montage

| Ebene | z [mm] |
|---|---:|
| Druckteil unten / Gitter oben | 0 / 2 |
| Holzlasche unten / Holzanschlag | 8,5 / 12 |
| PCB-Unterseite / Insert oben | **14,77** |
| PCB oben / Führung oben | **16,37** / 16,5 |
| LED oben / Scheibe unten | 18 / 21 |
| Holz/Scheibe außen | 24 |

LED→Scheibe nominal **3 mm**, unverändert. Voraussetzung:12-mm-Holz,
3-mm-Scheibe; echte Iststärken prüfen. Vier Eckführungen:0,20 mm Spiel je
Seite,4,5 mm Einstecktiefe,0,4-mm-Einführfase über0,6 mm. Holzlaschen setzen
Tiefe, nicht LEDs/Glas. PETG als Materialvorschlag, Basis auf dem Bett;
**erhöhte Laschen benötigen Support oder passende alternative Orientierung**.

Zuerst Führungs-/Heat-Set-Passprobe ohne Elektronik. Inserts einschmelzen und
abkühlen, dann PCB/Kabel außerhalb montieren. Vormontierte Einheit von innen
gerade einsetzen, Holzlaschen anschlagen lassen und von Hand befestigen.
Keine echte Einschmelz-/Klemm-/Lastfreigabe aus dem digitalen Test ableiten.

Stiftleiste auf Nutzerwunsch entfernen und Leitungen direkt anlöten; stromlos,
Pads schonen, Beschriftung prüfen. Kabel am rechten kurzen Ende kurz nach
innen und unter dem Holz nach rechts. Vorhandenes Kabelbinderpad entlastet
Leitungen; keine Zuglast auf Lötpads. Draht/Lot/Biegeradius real prüfen.
Kabelhüllen bleiben Annahmen: drei1,9-mm-Boxhüllen von(52,603;y;13,92) über
(54,9;y;9,5) nach(66;y;9,5), y1,27/3,81/6,35. Keine Dupont-/Pinfolgefreigabe.
Akku bleibt bei ersten USB-Prüfungen getrennt.

## Dateien und CNC — unverändert

Alle Dateien in diesem Ordner, DXF in **mm**, Nennkonturen, keine Werkzeugbahnen
oder G-Code. Gemeinsamen Ursprung beibehalten, nicht separat auf Bounds nullen.

| Datei | Inhalt |
|---|---|
| `neopixel_mount.stl` | Nur Druckhalter, Bounds **64×27,9×16,5 mm** |
| `geometry.scad`, `neopixel_mount.scad` | Gemeinsame Maße / Halterquelle |
| `cnc-opening.dxf` | Durchbruch **58,4×14,3**, R2 |
| `cnc-rebate.dxf` | Wellenfalz, Hülle **76,549×34,3**,3 mm tief |
| `cnc-glass.dxf` | Gewellte Scheibe, Hülle **76,149×33,9×3** |
| `panel_cnc.stl` | Referenzdeckel, nicht drucken |
| `overview.png`, `iso.png`, `iso-board.png` | Neue Halteransichten mit/ohne PCB |
| `height-side.png` | Gerader Schnitt durch Schraubachsen, Ebenen/Insert/Schraube |
| `top-board.png`, `exploded.png`, `seated-inside.png`, `outside.png` | Neue Zusatzansichten |
| `wave-top.png`, `wave-iso.png` | Unveränderte CNC-Wellenkontur |
| `cnc-compare.png` | Alter Durchbruch links, aktueller rechts |

CNC nur außen, eine Aufspannung: **Falz zuerst, Durchbruch danach**; kein Wenden,
keine Innentasche. Fräser wegen R2 höchstensØ4. CAM-Kompensation, Zustellungen
und Werkstückhaltung separat. Keine Holzschraubenlöcher automatisch gefräst:
begrenzte Pilotbohrungen innen von Hand.

**Bekannt, unverändert und nicht Teil der Insertkorrektur:** Wellenfalz4–10 mm
überdeckt Holzschraube(34;19,9). Mit3×12 durch3,5-mm-Lasche nominal8,5 mm
Holzeingriff, dort nur0,5 mm Spitzenreserve zum Falzboden statt3,5 mm zur
unvertieften Außenseite. Holzschraubenlänge/Halt/Bohrtiefe gesondert klären;
keine Fertigungsfreigabe. Referenzwand auf−y ist kein gemessener Fotoabstand,
Wellenfalz überdeckt deren Projektion: reales Layout/Restholz prüfen.
Scheibe muss kindersicher fixiert werden; die Falz allein hält sie nicht fest.

## Reproduktion / digitale Prüfung

Vom Repo-Root:

```bash
bash 3d-print/mounts/neopixel-stick-mount/render.sh
```

OpenSCAD2021.01/CGAL, explizit gepinnte Nix-Shell, Xvfb/Mesa und vorhandene
Pythonchecker/Pillow/Shapely; Node.js für den neuen Insertprüfer. Kein Root,
keine Dienste, keine Ports, kein Flakeupdate. Fehler brechen ab; Exit0 bestätigt
nur die angegebenen digitalen Prüfungen, keine physische Fertigungsfreigabe.

- Reale STL: geschlossen, konsistent orientiert, zusammenhängend, positives
  Volumen, keine degenerierten Dreiecke, feste Bounds und16 Material-/Lochproben.
- CNC-STL/DXF, echte Konturen/Volumen und unabhängige Loch-/Höhenrechnung.
- `node --test check_inserts.mjs`: volle Aufnahmen, obere Zugänglichkeit ohne
  PCB mit **Ø8-Prüfhülle** (keine gemessene Lötkolbenspitze), volle Wand,
  durchgehende Kanäle, Maßkette, lokale Formänderung und bytegleiche CNC.
  Der CNC-Holzkörper wird zusätzlich frisch nach `.cad-check/` exportiert,
  als Mesh und per beidseitigem Differenzkörper gegen die aktive Datei geprüft.
  CGAL kann Dreiecke anders sortieren; die aktive CNC-STL bleibt deshalb
  bytegleich, statt einen nur anders sortierten Export als neue Fräsdatei zu verteilen.
  Gegenproben: künstlicher Kanalboden, absichtlich falsche Wandhülle,
  Vorgänger-STL. RED am Vorgänger:48,890847 mm³ blockierte Aufnahme.
- Vollkörpertests Holz/PCB/Kabel/Referenzwand/Glas,21 einzelne Einsetzlagen
  z−20…0 als diskrete1-mm-Stichproben, kein kontinuierlicher Bewegungssweep;
  Seitenversatz/Über-Einsetzen als absichtliche Kollisionsgegenproben.
- Schnitt-/Fehlvolumenschwelle **0,001 mm³**. Prüf-Rückzüge vermeiden reine
  Kontaktflächen:0,01 mm an Aufnahme,0,001 am Zugang/PCB/Holzkontakt.
- Keine Kopf-CAD-Prüfung ohne reale Maße. Nutzer-Kopfprobe anerkannt,
  genaue Hülle offen. Historische `fit-heads-*`, `revision-heads-*`, `wave-*`
  und ältere Protokolle gehören zum Vorgänger, nicht zur neuen Befestigung.
- Original-Adafruit-Quellprüfung bestätigt nur die historische Quelldatei,
  nicht Identität/Bestückung des Nutzermoduls.

Aktuelle Rohwerte: `logs/insert-check.log`, `logs/mesh-check.log`,
`logs/cnc-check.log`, `logs/fit-check.log`; TDD-Vorgängerfehler `logs/insert-red.log`.
Reale Heat-Set-/Führungs-/Holz-/Scheibenpassprobe, Last-/Lichttest und
Kindersicherheitsfreigabe bleiben ausstehend. **Keine physischen Tests behauptet.**
