# Step-Up-Mount — CAD-Prüfung, 09.10.2026

## Umfang / Abnahmestand

**Nur digitaler Entwurf und Geometrie-/Sichtprüfung.** Kein Druck,
keine gemessene Passung, kein Einschmelz-/Belastungstest, keine
Druck-/Einbaufreigabe. Nutzer hat vor der Modellierung das Konzept
bestätigt: regelmäßiger Gitterboden, ein Schraubpfosten am vorhandenen
Montageloch, zwei massive Stützpfosten mittig und weg vom Lötbereich,
keine L-Auflage/Wände. Die nachfolgende Senkkopf-Version wurde vom Nutzer
anschließend ausdrücklich positiv bewertet (nur digital, siehe Abschluss).

Pfad: `3d-print/mounts/stepup-mount/`.
Verworfener Vorgänger unverändert kopiert nach
`archive/rejected-2026-10-09/`, einschließlich der bereits als verworfen
markierten README. Kein anderes Hardware-/Firmware-Teil geändert.

## Quellenprüfung

- `docs/kernwerte.md`, `hardware/BOM.md`, Nutzerentscheidungen in
  `hardware/gehaeuse-konzept.md` vor Modellierung gelesen.
- Original `Adafruit TPS61023.brd` via Hersteller-GitHub: Kontur
  11,43 × 17,78 mm, ein gebohrtes Ø-2,5-mm-Montageloch, Mittelpunkt
  (2,54; 15,24) mm ab links unten; Anschlussreihe y = 2,54 mm.
- Offizielles Hersteller-Unterseitenfoto betrachtet: keine aufgesetzten
  Bauteile. Foto zeigt keinen realen verlöteten Boxbert-Aufbau.
- ruthex-Maßtabelle inkl. Einbauzeichnung betrachtet: Einbauloch Ø 4,0 mm,
  Mindesttiefe L + 1 = 6,7 mm, Mindestwand W = 1,6 mm, Einsatz L = 5,7 mm
  und größter Ø = 4,6 mm. Keine STEP-Kontrollpunkt-Messung verwendet.
- Quellenlinks / Git-Blob-ID vollständig in Mount-README und Kernwerten.

## Erstentwurf vor Senkkopf-Anpassung — Konstruktionsparameter, keine Messwerte

- Boden 26 × 32 × 2 mm; 4 × 5 regelmäßige 4-mm-Zellen mit 2-mm-Rippen,
  ergänzt durch lokale Pfosten-/Schraublochverstärkungen.
- Alle Pfostenoberkanten bei z = 10 mm, also **8 mm Abstand vom Gitter**.
- Schraubpfosten Ø 8,2 mm; Loch Ø 4,0 × 6,7 mm von oben. Boden des
  Sacklochs bei z = 3,3 mm, damit 1,3 mm oberhalb des Gitterbodens.
- Mindestens 1,8 mm radial um größtes reales Einsatzmaß 4,6 mm.
- Mittige Stützpfosten Ø 2,8 mm, PCB-Koordinaten (5,715; 6,5) und
  (5,715; 10). Abstand der zylindrischen Stützpfosten voneinander
  0,7 mm; zum Schraubpfosten mindestens ca. 0,63 mm. Nur lokale Füße
  verbreitert, keine Verbindung als erhöhter Steg.
- Ein Holzloch Ø 3,2 mm **vorläufig**, bei (22; 4) mm ab Mount-Ursprung.
  Keine Entscheidung für eine Schraube oder Kopfaufnahme.
- Vorschau: PCB-Dicke 1,6 mm angenommen; Anzeigeversatz 0,03 mm gegen
  Kontaktflächen-Flackern. Einsatz-Dummy symbolisch schlanker als real.

## Erstprüfung vor Senkkopf-Anpassung — Export / maschinelle Prüfung

Werkzeug: OpenSCAD **2026.09.18**. Reproduktion:

```bash
bash 3d-print/mounts/stepup-mount/render.sh
python 3d-print/mounts/stepup-mount/check_mesh.py
```

STL mit CGAL exportiert (Simple: yes); die dort angezeigten zwei
Nef-Volumes umfassen den Außenraum, nicht zwei getrennte Druckteile.
Zusätzliche unabhängige Prüfung der exportierten Binär-STL mit
Python-Standardbibliothek:

- **3.094 Dreiecke**, keine degenerierten/tiny Dreiecke im Prüfkriterium.
- Eine zusammenhängende geschlossene Oberfläche; jede Kante genau
  zweimal mit entgegengesetzter Orientierung.
- Bounding Box **(0; 0; 0) bis (26; 32; 10) mm**.
- Geometrisches Volumen **1.586,530 mm³** (kein Slicer-Verbrauchswert).
- Punkt-in-Mesh-Prüfungen bestanden: Gitterzelle offen, Gitterrippe solid,
  Holzloch durchgehend, Einsatz-Sackloch frei und unten geschlossen,
  Pfostenwand solid, beide Stützpfosten vorhanden, Luft zwischen
  Stützpfosten und im freien Bereich unter der Platine.
- STL enthält nur Mount: `$preview` ist beim Export false; Platinen- und
  Einsatz-Dummies werden nicht ausgegeben. PCB-Vorschaukörper hätte
  außerdem z > 10 mm und würde die Bounds-Prüfung verletzen.

Hashes zum protokollierten Stand:

- SCAD SHA256: `843382d8e8236add900d116b9bb2a83e12abe9a22af38ea946c31666594a5401`
- STL SHA256: `9162f131cc795a876889619bc5842693783b84135e5edab651526a40cdf6af81`

Rohprotokolle:
`docs/cad/2026-10-09-stepup/render.log`,
`docs/cad/2026-10-09-stepup/mesh-check.txt`.

Bei der Exportprüfung wurden zunächst im Manifold-Binär-STL kollabierte
Dreiecke an fast deckungsgleichen Kreis-/Fußkanten erkannt, obwohl
OpenSCAD NoError meldete. Fußpads geometrisch entkoppelt und endgültigen
Export mit CGAL geprüft; nicht bloß die Manifold-Meldung übernommen.

## Sicht- / Druckbarkeitsprüfung

Iso-, Drauf- und Seitenansicht mit transparenter PCB betrachtet; zusätzlich
Mount ohne PCB betrachtet. Regelmäßiges Raster ist sichtbar, Platine
liegt auf drei gleich hohen einzelnen Pfosten. Anschlussreihe liegt fern
der Stützpfosten; Montage- und Einsatzloch fluchten. Holzloch außerhalb
der PCB-Projektion, von oben zugänglich. Keine Wände oder L-Auflage.

Gitter flach aufs Bett, Pfosten/Sackloch nach oben: Kerne sind ab Druckbett
zusammenhängend, nach oben verjüngende Füße, kein schwebender Körper.
Reguläre Rippen 2 mm breit; keine absichtlich hauchdünnen Reststege.
Geometrisch keine Stützstruktur nötig. Keine Slicer-/Druckprüfung erfolgt.

## Vor realem Einbau noch offen

- [x] Neue digitale Senkkopf-Form vom Nutzer ausdrücklich positiv bewertet;
      keine physische Passungs-/Belastungsabnahme.
- [ ] Kleines Heat-Set-Passungs-Probestück mit tatsächlichem Material und
      Druckprofil; Einbau bündig, Auszug-/Verdrehhalt prüfen.
- [ ] Reale PCB-Lochpassung, Unterseite, Lötstellen-/Pinüberstände und
      lötstellenfreie mittige Auflage prüfen (8 mm Reserve ist nicht gemessen).
- [ ] PCB-Schraubentyp, Scheibe falls nötig und Schraubenlänge festlegen;
      nicht am Sacklochboden anschlagen, PCB nicht verformen.
- [x] Nutzerentscheidung: 12-mm-Pappelsperrholz und 3 × 12 mm
      Senkkopf-Holzschraube; CAD entsprechend angepasst (Nachtrag unten).
- [ ] Ist-Holzstärke, konkretes Schraubenfabrikat/Kopfmaß, Vorbohrung und
      sicheren Halt am Reststück prüfen; keine Schraubenspitze außerhalb.
- [ ] Slicer mit tatsächlicher Düse/Material und ausreichend Material um
      Einschmelzbereich prüfen; dann Passungs-/Belastungstest.
- [ ] Klemmenden Verdrehhalt von PCB und Mount am realen Aufbau prüfen;
      reine Auflageflächen sind keine formschlüssige Verdrehsicherung,
      Kabel/Nachbarmodule keine Halterungen.

## Nachtrag 09.10.2026 — aktueller Stand mit Senkkopf-Holzbefestigung

Nutzer hat **12 mm Pappelsperrholz und 3 × 12 mm Senkkopf-Holzschraube**
ausdrücklich bestätigt und die Anpassung beauftragt. Keine Aussage über
bereits gekauftes Holz/Schrauben oder einen physischen Test.

Änderung ausschließlich am Holz-Schraubpunkt:

- Ø-8-mm-Polster von 2 auf **3,5 mm Gesamtdicke** erhöht; restliches
  Gitter und alle Platinenpfosten unverändert.
- Durchgang weiterhin Ø **3,2 mm**; Kopfsenkung Ø **6,2 mm / 90°**,
  **1,5 mm tief**, darunter **2 mm Material**.
- Kopf um Ø 6 mm / 90° ist Konstruktionsannahme, keine Messung eines
  konkreten Fabrikats. Kopfdurchmesser-Referenz in Mount-README.
- Nominal bei bündigem Kopf: 12 − 3,5 = **8,5 mm Holzeingriff**, somit
  **3,5 mm Reserve** in nominal 12-mm-Holz. Kopfversenkung, Toleranzen und
  Kunststoffsetzen berücksichtigen; kein Nachweis einer sicheren realen
  Schraubenlänge. Am Reststück mit begrenzter Vorbohrtiefe prüfen.

Erneut alle fünf Vorschauen und STL mit `render.sh` erzeugt. Isoansicht
mit transparenter PCB, Draufansicht und Seitenansicht betrachtet:
Senkung und ausschließlich lokal erhöhtes Polster sichtbar, Schraubzugang
frei; Raster und Platinenpfosten unverändert. Erneute CGAL-/Binär-STL-
Prüfung mit erweitertem `check_mesh.py` bestanden:

- **3.734 Dreiecke**, geschlossen, eine zusammenhängende Oberfläche,
  konsistent orientiert, keine degenerierten/tiny Dreiecke.
- Bounds weiterhin **26 × 32 × 10 mm**, Volumen **1.634,971 mm³**.
- Zusätzliche Punktprüfungen: erhöhtes Polster solid, zentrales Loch
  durchgehend, kegelförmige Senkung und Öffnung bis Ø 6,2 frei, Material
  neben und 2 mm unter Senkung vorhanden, außerhalb des Polsters keine
  Bodenerhöhung. Alle bisherigen Pfosten-/Luft-/Lochprüfungen bestanden.
- SCAD SHA256: `6f95d836b3825892a1e232b0cc92425861fdaa119164543624faec2f981eba9b`
- STL SHA256: `abd03a5dbde76d8c5a4e389d1645b3fb9ae508d5d4ebc2689ab0034388ceb4da`

Rohprotokolle dieses aktuellen Stands:
`docs/cad/2026-10-09-stepup/senkkopf/render.log`,
`docs/cad/2026-10-09-stepup/senkkopf/mesh-check.txt`.
Die oben dokumentierten Erstprüfungswerte und Rohlogs bleiben historische
Belege des vorherigen Gitterentwurfs ohne Senkung.

Entscheidung und To-Do nachgeführt. Kein Druck, keine reale Kopf-/Holz-/
Heat-Set-Passungsprüfung; **weiterhin keine Druck-/Einbaufreigabe**.

## Abschluss / Übergabe 09.10.2026

Nutzer bewertet die aktuelle digitale Senkkopf-Version ausdrücklich positiv
(„ist das alles krank gut geworden“) und bittet um Findings/Übergabe für
einen kurzen Folgeauftrag zum GPIO-Expander. Damit ist die digitale Form
positiv bestätigt, nicht der reale Druck oder mechanische Halt.

Ergänzung zum oben genannten Zwischenvergleich: Ein anfangs bei PCB-
(5,715; 11) gesetzter Ø-2,8-mm-Stützpfosten überlappte den Schraubpfosten
bei (2,54; 15,24), Ø 8,2 mm. Rechnerisch Abstand ca. 5,30 mm gegenüber
Radien-Summe 5,50 mm. Aktueller Punkt (5,715; 10) hat ca. 6,13 mm Abstand,
also ca. 0,63 mm freie Lücke. Quelle: eigene CAD-Parameter-/Abstandsprüfung,
keine Messung eines gedruckten Teils. Aktuelle Assertions und Luftchecks
halten die Pfosten oberhalb der lokalen Füße getrennt.

CAD-Findings in `docs/findings.md`, Session-Einstieg in
`docs/mounts-weiterarbeit.md`, Verweise/Regeln in `AGENTS.md` und To-Do.
Der angekündigte Prompt meint **AW9523 / ADA4886**. In dieser Übergabe
nur Dokumentation geändert, **kein nächster Mount modelliert oder neu
recherchiert**, aktuelles Step-Up-CAD/STL unverändert.
