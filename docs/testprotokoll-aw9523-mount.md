# AW9523 / ADA4886 — CAD-Neustart und Prüfung

Datum: **09.10.2026**. Auftrag: Nutzer verwirft ersten Entwurf und verlangt
kompletten Neustart. **Digitaler Test, kein Probedruck/Hardwaretest.**

## Ausgang und neuer Stand

Vorgänger mit dünnen Freistichsektoren unverändert archiviert:
`3d-print/mounts/aw9523-mount/archive/rejected-2026-10-09/`.
Kein Wiederverwenden seiner Erfolgslogs oder Geometrie. Step-Up in diesem
Auftrag unverändert gelassen; dessen bereits vorhandene Worktree-
Änderungen stammen aus vorheriger Arbeit.

Neu: Gitter, zwei gestufte Gewindepfosten und zwei Stützen; **Einsätze von
unten** statt bündig oben. Dieses geänderte Einbauprinzip ist noch nicht
vom Nutzer bestätigt. Auch zwei seitliche Holzschrauben sind Vorschlag.

## Frische Herstellerprüfung

Original `Adafruit AW9523.brd` von
<https://raw.githubusercontent.com/adafruit/Adafruit-AW9523-PCB/master/Adafruit%20AW9523.brd>
neu geladen. Quellenkopie unter
`docs/cad/2026-10-09-aw9523-redesign/sources/Adafruit_AW9523.brd`.
SHA256 `3dec4c7ca674817b9b1a5f79dbcd7cabf7c74e58928bf5e64bc0a95a8b9831b9`.

`verify_source.py` wertet Layer-20-Wires, echte Package-Pads und Element-
Rotation aus (JP7 R180). Ergebnis **PASS**, Log `source-check.log`:

- 38,1 × 17,78 mm, Radius 2,54 an vier Ecken; alte Fasen-Angabe falsch.
- Vier Montagebohrungen drill 2,5, Lochzentren 2,54/35,56 × 2,54/15,24.
- 38 Durchkontaktierungspads drill 1,0; verwendete Pinliste stimmt überein.
- Minimaler Loch-/Pinabstand jeweils 3,81 mm.
- Neues Hersteller-Unterseitenfoto `4886-02.jpg` geprüft/gesichert:
  keine sichtbaren bestückten Unterseitenbauteile. Keine Aussage zu
  später angelöteten Nutzer-Pins/Drähten.

ruthex-Maße aus geprüften Herstellerwerten in `docs/kernwerte.md`:
Einbauloch Ø4,0, min. Tiefe6,7, min. Wand1,6; max. Einsatz-Ø4,6.

## Geometrische Rechnung — keine Festigkeitsprüfung

| Prüfung | Rechnung / Ergebnis |
|---|---|
| Einsatzwand | (8,2 − 4,6) / 2 = **1,8 mm**, durchgehend, kein Freistich |
| Kammer | Einsatzbeginn z0,2 + 6,7 = z6,9 |
| Materialhöhe über Kammer | breiter Pfosten bis z8 − 6,9 = **1,1 mm** |
| Schmale Auflage | Ø4,6, Kanal Ø2,8 → Wand **0,9 mm**, kein Einsatz dort |
| Lotzone oben | 3,81 − 4,6/2 − 1,1 = **0,41 mm** nominal |
| Breiter Pfosten zu Pinzone | PCB z12 − breit z8 = 4 mm; erlaubter Pinüberstand3,4 → **0,6 mm** Reserve |
| PCB-Kopfzugang Holzschraube | linkes Kopfende x7,1; PCB ab8,95 → **1,85 mm** Projektionsabstand, rechts symmetrisch |
| Senkung | (6,2 − 3,2)/2 = 1,5 mm bei90° |
| Material unter Senkung | 3,5 − 1,5 = **2 mm** |
| Holz, nominal | 12-mm-Senkkopfschraube − 3,5 Pad = **8,5 mm** Eingriff, 3,5 Reserve |
| PCB-Schraubenbeispiel | M2,5×12, PCB1,6 angenommen → Spitze z1,6, ca.4,3 mm geometrische Einsatzüberdeckung |

Alle Pin-/Lotgrößen und PCB-Dicke sind **ungeprüfte Annahmen/Hüllgrenzen**.
Nominale Rechnung ersetzt keine Kopfpassung, Gewindeeingriffsmessung,
Druck-/Materialfestigkeit oder Kindersicherheitsfreigabe.

## Export und Prüfung am tatsächlichen STL

OpenSCAD **2026.09.18**, CGAL, `--hardwarnings --export-format binstl`;
Bilder `QT_QPA_PLATFORM=offscreen`, `--preview`, orthografisch.
Befehl: `bash 3d-print/mounts/aw9523-mount/render.sh`.
Neue Ausgabe unter `docs/cad/2026-10-09-aw9523-redesign/render.log`.
Export erfolgreich, keine Warnungen. CGAL `Simple: yes`.

Danach `python3 3d-print/mounts/aw9523-mount/check_mesh.py`:
**PASS**, siehe neues `mesh.log`.

- 7532 nicht-degenerierte Dreiecke.
- Jede Kante zweimal, entgegengesetzte Orientierung.
- Eine zusammenhängende geschlossene Oberfläche.
- Bounds **(0,0,0) bis (56,26,12) mm**.
- Positives orientiertes Volumen **3029,051 mm³**.
- Punktproben: offene Gitterzellen, Holzlöcher/Senkungen und Polster,
  offene unterseitige Einsatzkammern, Schulter und Schraubenkanäle,
  Ende des dicken Pfostens, massive Stützen.
- Umlaufende Wandproben an beiden Gewindepfosten (15°-Raster, vier Höhen).
- Pin-/Lot-Hüllproben an allen38 Pads, zwei Höhen, Mitte plus vier
  Randpunkte. Zusammen mit SCAD-Abstandsassertions digitale Freiraumprüfung,
  keine vollständige Simulation der realen Hardware.

STL-SHA256:
`9faa5d7f90ed3c4529431f761fbe29e96ba733fea6326480471deaa5f014b5ce`.
Vorschau-Dummies nicht in STL: Bounds/Material-Luftproben entsprechen
nur dem Mount. Keine automatische Mesh-Reparatur.

Zusätzlich: Python-Syntaxprüfung beider Prüfscripte und `bash -n render.sh`
erfolgreich. Sechs tatsächlich neu erzeugte PNGs einzeln angesehen:
Iso/Drauf ohne PCB; Iso/Drauf/Seite mit transparenter PCB; Unterseite.
Pfosten getrennt, Raster sichtbar, rote Hüllen frei, Holzlöcher seitlich
zugänglich. PCB-Kontur jetzt gerundet. Keine realen oberen Bauteile/
Steckergehäuse/Schraubenköpfe modelliert, keine diesbezügliche Freigabe.

## Abnahme offen

- [ ] Nutzer akzeptiert Unterseiten-Heat-Set-Montage (nicht oben bündig).
- [ ] Nutzer akzeptiert zwei seitliche Holzschrauben.
- [ ] Gestuften Pfosten probedrucken; Innenübergang/Kanal und Einbauloch prüfen.
- [ ] Einsätze von unten setzen, Unterseite ohne Metallüberstand; Material
      darf Schraubenkanal nicht verstopfen. Einschmelzen und Lastprobe prüfen.
- [ ] Reale PCB-Dicke, Pins, Lötstellen, Anschlüsse, Kabelzugfreiheit prüfen.
- [ ] Ø2,5-PCB-Loch/M2,5-Schrauben ohne Kraft testen; nicht aufbohren.
- [ ] PCB-Schraubenlänge/-kopf wählen und Spitze/Gewindeeingriff prüfen;
      alte M2,5×8-Empfehlung verworfen, M2,5×12 nur Rechenbeispiel.
- [ ] Holzschraubenfabrikat/Kopf, Vorbohrung mit Tiefenbegrenzung, Halt am
      echten 12-mm-Pappel-Reststück prüfen; keine Spitze durch Außenfläche.
- [ ] Wiederholte Montage, Kabelzug, Wärme und Gesamt-Kindersicherheit prüfen.

Kein Flash, keine Verdrahtungsänderung, kein Akkuanschluss durchgeführt.
