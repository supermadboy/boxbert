# HW-125 / MSD-AADP — in Arbeit

Stand 09.10.2026. Nutzer beauftragt SD-Mount und akzeptiert Online-Lochraster
als Entwurfsbasis. **Aktuell nur Prüfschablone, noch kein fertiger Mount.**

## Belege

- Nutzer: Platine 23,68 × 41,78 mm; M2,5-Schrauben passen durch Löcher.
- Nutzerfoto `~/Downloads/PXL_20261009_134715605.jpg`, gesicherte Kopie
  `docs/cad/2026-10-09-sd/user-sd-top.jpg`: HW-125, vier geschlossene
  Ecklöcher, Karte gegenüber Pinleiste. Keine Unterseitenansicht vorhanden.
- Botland, abgerufen 09.10.2026:
  https://botland.store/memory-cards-accessories/8230-micro-sd-card-reader-module-5904422311278.html
  nennt 42 × 24 mm PCB und 38 × 20 mm Lochraster, allerdings M2-Löcher.
  Ähnliche Bauform, keine Originalzeichnung der konkreten HW-125-Revision.
  Reales Lochraster weiterhin ungeprüft, Nutzer akzeptiert Entwurfsannahme.
- Falsche frühere Soldered-333050-Zuordnung/38 × 22 mm korrigiert in Kernwerten.

## Prüfschablone

`hole_template.scad`, `hole_template.stl`, `hole-template.png`:
30 × 48 × 2 mm flacher Rahmen; vier Ø-2,7-mm-Löcher auf 20 × 38 mm Raster.
Kein Gewinde, keine Einsätze, keine Schraubenlängen-Freigabe.
Flach mit leerer Mitte nach oben drucken, kein Support nötig nach CAD-Geometrie.
Mit stromloser Platine prüfen, alle vier M2,5-Schrauben müssen ohne Kraft
fluchten; nicht aufbohren, nicht verspannen. Platine nicht mit überlangen
Schrauben auf einer Tischfläche beschädigen. Drucker-/Materialpassung offen.

Export OpenSCAD CGAL/hardwarnings/binstl erfolgreich. Tatsächliche STL mit
`python check_template.py` geprüft: geschlossene, zusammenhängende,
konsistent orientierte Oberfläche, keine degenerierten Dreiecke, Bounds
und Rahmen-/Lochvolumen geprüft. Bild angesehen. Rohlogs:
`docs/cad/2026-10-09-sd/template-*.log`. Keine physische Prüfung.

## Nächster Konstruktionsschritt / vorher abstimmen

Regelmäßiges Gitter, keine Wände; Karte/Stecker frei. Die Anschlussreihe
liegt nahe den Montagelöchern. Ein voller Ø-8,2-mm-Einsatzpfosten bis zur
PCB-Unterseite könnte in den Bereich von Lötstellen geraten. Foto zeigt
keine Unterseite und beweist keine Lotfreiheit.

Vorschlag zur Abstimmung: vier gestufte Einzelpfosten, breiter Einsatzbereich
unten, schmale Auflage oben; ruthex RX-M2,5×5,7 von unten statt bündig von
oben. Volle Wand um Einsatz-max.-Ø 4,6, Einbauloch Ø 4,0, Mindesttiefe 6,7.
Diese Abweichung ist **noch nicht vom Nutzer freigegeben**, keine STL dafür
erstellt. Zwei seitliche 3 × 12 mm Senkkopf-Holzschrauben als Vorschlag,
Anzahl ebenfalls noch abzustimmen. Reale Lot-/Kopf-/Kartenfreigängigkeit
bleibt selbst bei erfolgreichem CAD-Test offen.
