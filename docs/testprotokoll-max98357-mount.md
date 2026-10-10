# Digitalprüfung MAX98357A-Mount — 09.10.2026

Auftrag: Vorschlag erstellen, Nutzer möchte anschließend ansehen.
Mount: `3d-print/mounts/max98357-mount/`. Keine Druck-/Passungsabnahme.

## Quellenabgleich

Nutzerbestätigung: fotografiertes Modul ist das bestellte ADA3006.
Beide Nutzerfotos und Herstellerfoto tatsächlich angesehen; Layout stimmt
visuell überein. Alte Klon-/schwarz-Behauptung ist widersprochen.
Original-Mono-Eagle-PCB aus Adafruit-Repo gespeichert; Lochbild,
Layer-20-Rundungen, Bohrdurchmesser und rotierte Through-Hole-Pads durch
`verify_source.py` geprüft. PASS: 17,78 × 19,05, R2,54, zwei Ø2,5-Löcher
mit 12,70 mm Abstand. Kleinster Loch-/Padabstand ca. 4,66 mm.
Erster Prüfskriptlauf scheiterte nur am direkten Float-Vergleich;
Koordinaten einheitlich auf 6 Stellen gerundet, neuer Lauf PASS.
Initiales Fehlerlog separat erhalten. Keine Geometrie dafür geändert.

## Export und STL

OpenSCAD 2026.09.18; `render.sh`, QT_QPA_PLATFORM=offscreen,
CGAL/hardwarnings/binstl. STL nur Mount, PCB und symbolische Komponenten
nur unter `$preview`. Export erfolgreich; keine Hardwarning.
Eigenes `check_mesh.py` auf neue Datei, Bounds und Prüfkoordinaten angepasst.

- SHA256: 44b0b1c069c11713288a1938c0a2834b641276173297f802d659deae7edcb0b4
- Dreiecke: 7188
- Bounds: (0,0,0)…(38,26,12) mm
- Volumen: 2421,073 mm³
- Geschlossene, konsistent orientierte Kanten; zusammenhängende Oberfläche.
- Keine degenerierten/zu kleinen Dreiecke.
- Punktproben PASS: offene Gitterzelle, vier Pfosten, zwei unten offene
  Einsatzkammern, volle umlaufende Einsatzwände, Schulter/Kanal,
  Senkung mit Restmaterial, getrennte Pfosten und neun Pin-/Lot-Hüllen.

Rohlogs: `docs/cad/2026-10-09-max98357-mount/{render,mesh,source-check}.log`.

## Sichtprüfung

Alle sechs neuen PNGs geöffnet und angesehen: iso, top, iso-board,
top-board, side-board, bottom. Regelmäßiges Gitter sichtbar, vier einzelne
Pfosten, keine Wände/L-Auflage; Holzlöcher außerhalb PCB-Projektion.
Transparente PCB, symbolische Klemme und ungeprüfte Lot-Hüllen nur in
Board-Vorschauen. STL enthält keine dieser Vorschaukomponenten.

## Offen / keine falsche Abnahme

- Nutzer-Sichtprüfung des Vorschlags, Unterseiten-Einsätze und Holzlochanzahl.
- FDM-/Heat-Set-Probedruck, Wand-/Halsbelastbarkeit, Insert-Auszug/-Verdrehhalt.
- Reale PCB-, Lot-/Steckerfreiheit und spannungsfreie Vierpunktauflage.
- M2,5 durch reale PCB-Löcher ohne Kraft; Kopfzugang neben Klemme.
- Schraubenlänge nur nach Ist-PCB/Unterlegscheibe; M2,5×12 Rechenbeispiel.
- Reale Holz-/Kopfpassung und begrenzte Vorbohrung, keine Außenspitze.
- Kabelzugentlastung separat, nicht über PCB oder Klemme.

Keine Firmware-, Pin- oder Railänderung; Step-Up/AW9523 unverändert.
Digitaler Erfolg ist keine Druckpassungs-/Kindersicherheitsfreigabe.
