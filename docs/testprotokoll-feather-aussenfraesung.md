# Außenfräs-Version — digitale Prüfung 15.10.2026

Diese Version ersetzt den zuvor geprüften Entwurf mit Innentasche.
Nutzerkorrekturen: nur von außen fräsen, TFT nominal 2 mm hinter Plexiglas;
USB-Aussparung macht Daddelbert **von Hand**, nicht mit dieser CNC-Datei.

## Tatsächlich ausgeführt

`bash render.sh`: STL und drei aktive DXF exportiert, PNGs neu erzeugt,
`bash -n` und `shellcheck` bestanden. Gerade Höhenansicht zusätzlich zu
Isometrie/Schnitt erstellt und persönlich angesehen. Weitere Ansichten
u.a. Außenfalz und Einbauschnitt visuell kontrolliert.

- Der neue Höhenziel-Test schlug am alten Modell mit `Expected 2 mm nominal
  TFT/glass gap, got 3.2` fehl. PCB-Auflage um 1,2 mm angehoben; danach PASS.
- Träger: 7236 Dreiecke, geschlossen/konsistent orientiert/eine Oberfläche,
  keine degenerierten Dreiecke, Bounds −6,8/−24/0 bis 57,6/46,86/26,5 mm.
- Front: 704 Dreiecke, geschlossen/orientiert, 250×110×12-mm-Hülle.
- Drei DXF-Nennkonturen im gemeinsamen mm-System geprüft. Keine aktive
  Innen-Taschenkontur mehr. Alter Taschen-DXF im Archiv, nicht zur Fertigung.
- Nominale Höhen: Laschen 22, PCB-Auflage 25,2, Führung 26,5, TFT-Front 29,
  Glasunterseite 31 mm. PCB-/TFT-Höhen und Glasdicke bleiben Annahmen.
- Reale CGAL-Schnittmengen: Sollposition und Einsetzprobe ohne Schnittvolumen,
  Versatz x/y um 0,5 mm erzeugt 17,711444 / 17,711448 mm³ Kollision,
  Über-Einsetzen um 0,5 mm erzeugt 262,243685 mm³. Gegenproben schlagen an.
- PCB, angenommene Dupont-/JST-Hüllen gegen Träger frei; JST-Raum gegen Front frei.
- **Manueller USB-Restschritt:** angenommene direkte Steckerhülle schneidet
  902,400218 mm³ Front-Holz, solange die von Daddelbert geplante manuelle
  Aussparung fehlt. Expliziter `MANUAL STEP REQUIRED`-Fall, keine USB-Freigabe.

Exakte aktuelle Ausgaben: `logs/mesh-check.log`, `logs/cnc-check.log`,
`logs/fit-check.log` im Mount-Ordner. 0,001-mm-Rücksetzung im nominalen
Holztest vermeidet reine Nullstärken-Kontaktflächen in altem CGAL.

**Keine reale Druck-/Fräs-/Sicherheitsabnahme.** Restholz-/Passprobe,
Steckerkörper und Kabelabgänge, TFT-/Taster-/Kopfhöhen, Glasfixierung,
Pfosten-/Insert-/Holzlast und manuelle USB-Freigängigkeit am echten Aufbau
prüfen. Nächste Deckel-Mounts: methodische Referenz in `docs/mounts-weiterarbeit.md`.
