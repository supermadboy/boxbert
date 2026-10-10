# Akkuhalter — digitale Konzeptprüfung 09.10.2026

Auftrag: erster Vorschlag mit abnehmbarem Schraubbügel. Keine reale
Druck-/Passungs-/Sicherheitsabnahme. CAD: `3d-print/mounts/akku-mount/`.

## Ausgeführt

- Zwei getrennte Binär-STLs per OpenSCAD CGAL exportiert, nicht die Baugruppe.
- Basis Bounds 0..100 / 0..76 / 0..10,5 mm, 8640 Dreiecke.
- Bügel Bounds 0..16 / 0..74 / 0..3 mm, 788 Dreiecke.
- Beide geschlossene, zusammenhängende, konsistent orientierte Oberflächen;
  keine degenerierten Dreiecke. Prüfpunkte: Gitter, Holzloch/Senkung,
  Einsatz-Sackloch/Boden/Wand, freier Akkuraum, Anschlag und Bügelloch.
- Sechs Vorschauen exportiert, alle Ansichten tatsächlich angesehen.
  Iso-Abstand nach erster Sichtprüfung vergrößert, damit ganze Basis sichtbar.
- Erster Basisexport: tangentiale Pad-/Gitterberührung erzeugte nichtmanifold
  Kante bei (4;42). Holzpads vergrößert auf Ø8,4 und Zentren auf x4,5/95,5
  versetzt. Erneuter Export/Prüfung erfolgreich, keine Mesh-Reparatur.

Reproduktion: `bash 3d-print/mounts/akku-mount/render.sh`.
Rohlog mit Hashes: `docs/cad/akku-mount/render-check.log`.

## Grenzen / noch offen

Akku-Hülle nur dokumentiertes Nominalmaß, keine eigene Messung. PCM,
Foliennaht und Kabelansatz nicht modelliert. Hersteller-Seite recherchiert,
Web-Extraktion ohne nutzbares Detailfoto; JSON HTTP403. Reale Akku-Fotos
und schonende maximale Außenmaßprüfung vor Passungsfreigabe nötig.

Glatte isolierende Unterlage ist ein separat zu beschaffender/prüfender
Vorschlag, 0,5 mm nur CAD-Annahme. Kein Pouch direkt auf raues Gitter.
Nominal 2,3 mm Luft unter Bügel; nur 0,7 mm Höhenüberdeckung der Anschläge
bei vollständigem Anheben. Dummy-Test gegen Kippen/Herausrutschen und
Stoß-/Fall-Rückhaltung zwingend offen. Schrauben-/Heat-Set-/Holzprüfung,
Material/Temperatur, Druckfestigkeit und Kurzschlussschutz offen.

Nutzer-Sichtentscheidung zum neuen Modell noch ausstehend. Erfolgreiche
STL-Prüfung ist keine Freigabe zum Einsetzen eines realen LiPo.
