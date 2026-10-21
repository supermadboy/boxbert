# NeoPixel-Mount — digitaler Messabgleich 21.10.2026

## Auftrag / Grundlage

Nutzer beauftragt Fertigstellung für CNC und Druck, liefert PCB54×9,9×1,6,
PCB+LED3,23 und Ø3-Lochmaße. Freier Abstand23 mm ausdrücklich bestätigt,
rechts Lochrand→Ende12,8 und nahe lange Kante→Lochrand0,7 mm. Berechnetes
Lochbild(13,7;7,7)/(39,7;7,7), Raster26. Quelle/Originalfoto:
`docs/cad/neopixel-stick/measurement-2026-10-21/`.
Nach zunächst gewünschter Stiftleiste/Dupont entscheidet Nutzer für direkt
angelötete Kabel. Entfernung der Leiste nicht als durchgeführt bestätigt.

## Umsetzung

`3d-print/mounts/neopixel-stick-mount/`: gemeinsame Geometrie angepasst,
Durchbruch58,4×14,3 / Falz62,4×18,3×3, R2; Scheibe62×17,9×3, R1,8.
PCB-Auflage14,77, Oberseite16,37, LED oben18, Glas unten21:3 mm Lichtspalt.
Holzlaschen vorne(20;−10)/(34;−10), kurze direkte Kabelroute links beibehalten.
M2×16/M2-Muttern im Halter beibehalten, Schraubenkopf NICHT freigegeben.
LED-/SMD-/Pad-XY weiterhin nur Referenzhüllen; keine gemessene Bestückungszeichnung.
Die exakte Deckelposition ist Nutzeraufgabe, kein CNC-Nullpunkt aus dem Foto.

## Tatsächlicher Lauf — Erststand vor Laschenkorrektur

Aufruf:
`bash /home/markusinho/projects/boxbert/3d-print/mounts/neopixel-stick-mount/render.sh`

OpenSCAD2021.01/CGAL, Binär-STL, hardwarnings; Xvfb/Mesa. Ein erster
Vorschaulauf scheiterte am geerbten Xwayland-DISPLAY (glXChooseFBConfig).
Renderer danach auf eigene Headless-Xvfb-Instanz mit Mesa umgestellt und
vollständig erneut ausgeführt. Python/Pillow-Prozessumgebung aus gepinntem Nix.
Keine System-/Rootänderungen. Endlauf **Exit2**, ausdrücklich wegen offener
Kopffreiheit, nicht wegen unterdrücktem Export-/Renderfehler.

Rohlogs unter `3d-print/mounts/neopixel-stick-mount/logs/`.

| Prüfung | Tatsächliches Ergebnis |
|---|---|
| Druck-STL | PASS:5836 Dreiecke, geschlossen/orientiert/zusammenhängend, keine degenerierten Dreiecke |
| Bounds | (−8;−16;0)…(56;12,2;16,5),64×28,2×16,5 mm |
| Druckvolumen | 3537,973 mm³ |
| Material-/Lochproben | 15 PASS an echter STL |
| Referenzdeckel-STL / DXF | PASS: geschlossener250×180×12-Deckel, neue DXF-Bounds |
| Loch-/Höhenrechnung | PASS: Messwertableitung,3-mm-Luft, angenommene Gewindereserve |
| Halter im Holz | 0 mm³ Schnittmenge bei0,001-mm-Prüfrückzug |
| Seitversatz0,5 mm X/Y | Erwartete Kollision4,477166 /4,477174 mm³ erkannt |
| Über-Einsetzen0,5 mm | Erwartete Kollision142,677779 mm³ erkannt |
| PCB / Kabel-Druck / Kabel-Holz | Je0 mm³ unter den angenommenen Hüllen |
| Referenz-Rückwand / Glas | Je0 mm³; keine reale Wand-/Leistenabnahme |
| Einsetzweg | 21 einzelne Positionen z−20…0 mm, alle Schnittmengen leer; kein lückenloser Bewegungsbeweis |
| Kopf nominalØ3/Höhe2 | **OPEN:0,053533 mm³** gegen angenommene LED/SMD-Hüllen |
| Kopf mit0,5-mm-Radialspiel | **OPEN:2,068275 mm³**, Bauteile zusätzlich0,1 mm/Seite vergrößert |

Die zwei offenen Tests liefern kein PASS. Ursprüngliche Fehl-Logs zusätzlich
als `logs/revision-heads-components.log` und `logs/revision-heads-tolerance.log`
gesichert. Ein realer Konflikt ist mangels echter Bauteil-XY nicht nachgewiesen;
eine reale Passung ebenfalls nicht. Alte Adafruit-Kopffreigabe gilt nicht für
dieses neue Lochbild. Kein Verschieben angenommener LEDs, um Tests grün zu machen.

Vorschauen tatsächlich erzeugt und angesehen: overview, height-side, top-board,
seated-inside, exploded und cnc-compare. Transparenz in der Innenansicht hat
Preview-Überlagerungsartefakte am Holz, keine Festigkeits-/Passungsfreigabe.
`bash -n`, shellcheck im Renderer, Python-Syntaxprüfung und `git diff --check`
bestanden. Historischer Original-PCB-Extraktor bestätigt nur die alte Datei,
nicht die Identität oder Bestückung des realen Sticks.

## Offen / nächste reale Schritte

1. Echte Schraubenkopf-/LED-/SMD-Freiheit klären, ggf. Nahfoto/Messung. Kein
   endgültiger PCB-Montagestand freigegeben, keine größere Schraube erzwingen.
2. Holz-/Glas-Iststärke und endgültige Deckellage/Wände/Leisten abgleichen.
3. Führung/Muttertaschen am Probedruck und CNC-Falz am Reststück testen.
4. Stiftleiste stromlos entfernen, direkte Leitungen anlöten und entlasten;
   reale Lot-/Draht-/Biegeradien prüfen. Elektrische Belegung separat beachten.
5. Scheibe gegen Herausheben sicher befestigen, Last-/Schock-/Lichtprüfung.

Keine reale Druck-, Fräs-, Belastungs-, optische oder Kindersicherheitsabnahme.
RFID-Daten und -Entwurf nicht verändert; parallele Arbeiten bleiben erhalten.

## Nachtrag: beide Laschen im Foto nach links

Nutzer präzisiert ausdrücklich „auf dem foto nach links“: beide Holzlaschen
auf die Lochreihenseite / zur Deckelmitte, lokal+Y. Bisherige Laschen auf−Y
samt Stützstegen entfernt und auf+Y neu aufgebaut. Schraubenpunkte jetzt
(20;19,9)/(34;19,9), keine Laschen auf der anderen Seite.
Referenzwand gegenüber auf−Y orientiert, angenommene4,26 mm Luft bis Falz;
kein neuer gemessener Wandabstand. DXF-Nennkonturen unverändert.

Vollständiger Renderer erneut ausgeführt, nachfolgende Werte ersetzen für die
aktuelle STL die obige Erststand-Tabelle:

- Druck-STL5852 Dreiecke, geschlossen/orientiert/zusammenhängend ohne
  degenerierte Dreiecke; Bounds(−8;−2;0)…(56;25,9;16,5),64×27,9×16,5 mm,
  Volumen3548,411 mm³. Alle15 Mesh-Punktproben PASS, einschließlich beide
  neuen Holzbohrungen, Kontaktfläche und gezielt keine alte Lasche auf−Y.
- CNC-/Loch-/Höhenprüfung PASS; Öffnung58,4×14,3, Falz62,4×18,3×3 unverändert.
- Holz, PCB, Kabel, neue Referenzwand und Glas jeweils0 mm³;21 einzeln
  geschnittene Einsetzpositionen ohne Kollision. Gegenproben X/Y weiterhin
  4,477166/4,477174 mm³, Über-Einsetzen jetzt142,677910 mm³ erkannt.
- Beide Kopfprüfungen unverändert OPEN:0,053533 /2,068275 mm³. Renderer
  endet nach erfolgreichen neuen Bildern mit Exit2, KEIN vollständiger Fit-PASS.
- Neue overview/top-board/seated-inside tatsächlich gerendert und angesehen.
  Reale Kopf-/Bauteil-, Druck-/Passungs-/Last-/Lichtprüfung weiterhin offen.

## Nachtrag: Kabel ans andere kurze Ende

Weitere Nutzerkorrektur: Kabel waren auf der falschen Seite. Kabelhüllen und
Kabelbinderpad auf+x/rechts im Modell verlegt, altes linkes Pad entfernt.
Holzlaschen und CNC-Konturen unverändert. Neue Route von(52,603;y;13,92)
über(54,9;y;9,5) nach(66;y;9,5), y1,27/3,81/6,35. Nur mechanische Route;
keine bestätigte elektrische Padbelegung. DIN/Versorgung am realen Modul prüfen.

Renderer vollständig neu ausgeführt: Druck-STL5828 Dreiecke,
Bounds(−2;−2;0)…(62;25,9;16,5), weiterhin64×27,9×16,5 mm,
Volumen3548,411 mm³. Geschlossen/orientiert/zusammenhängend/nichtdegeneriert;
16 gezielte Mesh-Proben PASS inklusive rechtem Kabelbinderpad und Abwesenheit
des alten linken Pads. Kabel gegen Holz/Druck, PCB, Referenzwand und Glas
je0 mm³ Schnittmenge;21 Einsetzpositionen wieder frei. Gegenproben und
beide offenen Kopfprüfungen numerisch unverändert zum Laschen-Nachtrag.
CNC-/Höhen-/Lochprüfung PASS. Endstatus weiterhin Exit2 wegen Kopfkonflikt,
keine pauschale Montagefreigabe. Logs im Mount-Ordner überschreiben den
vorherigen aktuellen Lauf, dieses Protokoll trennt die Revisionen.

Neue overview und top-board tatsächlich angesehen; Top-Kamera anschließend
wegen zunächst abgeschnittenem rechtem Kabelende vergrößert/zentriert und
mit identischer Headless-Toolchain separat neu gerendert und erneut angesehen.
Änderung nur der Kamera, nicht der Geometrie. Reale Prüfungen weiterhin offen.
