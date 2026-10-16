# SD-Halter HW-125 — digitaler Prüfstand 16.10.2026

Nutzerauftrag: nach Fertigungscheck den fehlenden SD-Halter fertigstellen.
Keine Gehäuseplanung, keine Änderung der bestehenden anderen Halter, keine
Pin-/Firmware-/Railänderung. Der komplette Halter ersetzt den Nur-Schablonen-
Stand als aktuelles Konstruktionsartefakt; Schablone unverändert erhalten.

## Artefakt

`3d-print/mounts/sd-mount/sd_mount.stl`: 44 × 56 × 12 mm, regelmäßiger
2-mm-Gitterboden, vier gestufte Pfosten auf akzeptiertem 20 × 38-mm-Raster,
vier unterseitige RX-M2,5×5,7-Kammern und zwei seitliche 3×12-Holzschrauben.
Keine Vorschauhardware im Druck-STL. Komplette Montage-/Quellen-/Annahmen-
Beschreibung im Mount-README. Form auf neuem Fertigstellungsauftrag aufgebaut;
kein behaupteter physischer Referenzdruck.

## Tatsächlich ausgeführt

- RED: neuer STL-Checker auf vorherigem `hole_template.stl` scheitert
  erwartungsgemäß an der fertigen Bauhöhe/Breite/Tiefe statt 30×48×2 mm.
  Log `logs/red-template.log`.
- Tatsächlicher CGAL-Binär-STL-Export mit OpenSCAD **2021.01**, hardwarnings.
  Rohlog `logs/export.log`; Simple=yes. CGAL Volumes=2 enthält den Außenraum;
  tatsächliche STL-Dreiecksadjazenz bestätigt **eine** verbundene Oberfläche.
- `check_mesh.py`: PASS, 7776 Dreiecke, Bounds (0,0,0)…(44,56,12), positives
  Volumen **4455,759 mm³**, geschlossene konsistent orientierte Kanten,
  keine degenerierten Dreiecke; **77** modulspezifische Material-/Luftstichproben
  (nicht erschöpfend, kein vollständiger Freiraumnachweis).
- Finale STL-SHA256:
  `3d2d9a95bc0ff5871688d0c0de947254d7f61af2b8038c2008a17d637e37759b`.
- `check_fit.py`: **12 von 12 Vollkörperfällen PASS**, echte CGAL-Schnitte:
  PCB mit dokumentiertem +0,001-mm-Kontaktrückzug, angenommene Unterseite,
  Pins/Lot, angeschlossener Steckerraum, Kartenweg und Holz sowie
  Kopf-/Bauteilhüllen nominal und mit radialem Spiel bestehen als negative
  Fälle bei Schnittvolumen **≤0,001 mm³**. Das bedeutet nicht zwingend exakt
  null Schnittvolumen. Kollisionskriterium ist **>0,001 mm³**; die absichtlichen
  Kopf-, Pin-, Stecker- und Kartenkollisionen überschreiten diese Schwelle.
- Gegenprobenvolumen: Kopf Ø6 **6,771347**, Pins um2 mm verschoben
  **3,496599**, Stecker zu tief **253,700470**, Karte zu tief
  **263,916066 mm³**. Keine Erfolgsmeldungen aus alten Mount-Logs kopiert.
- Frühe Ø4,5-Kopfvorschau kollidierte mit damaliger symbolischer Headerhülle
  (**0,574618 mm³**, `logs/red-heads.log`); finale Empfehlung daher reduziert
  **max.Ø4/Höhe1,8**, ohne pauschale Freigabe handelsüblicher Köpfe. Die
  Vorschau wurde auch an die Foto-Anordnung angepasst (Sockel am Kartenende,
  Header-Nennlänge15,24); beide Hüllen sind weiter ungemessene Annahmen.
  Der finale Toleranzfall enthält0,1 mm radialen Versatz und0,1 mm Bauteilzugabe.
- Vorhandene Lochschablone erneut geprüft: PASS, unverändert.
- Sechs echte OpenSCAD-PNGs gerendert; Übersicht und gerade Höhenansicht
  beschriftet. `iso.png`, `overview.png` und `height-side.png` mit Bildwerkzeug
  tatsächlich angesehen: alle relevanten Körper im Bild, Höhen lesbar.
- `bash -n`, `shellcheck` für neuen Renderer sowie Python-Syntax geprüft.
  Wrapper-Reexec vom Repo-Root und ein Shellcheck-Kommahinweis wurden vor
  erfolgreichem Gesamtlauf korrigiert. Beschriftung mit gepinnten DejaVu-Fonts,
  Python/Pillow; keine synthetisch erfundenen Geometriebilder.
- Renderer betritt die gepinnte Nix-Shell jetzt unabhängig von vorhandenen
  Host-Werkzeugen; Python/Pillow werden mit bereitgestellt. Nach dieser
  Review-Korrektur den **gesamten** Renderer erneut ausgeführt: Exit0,
  STL-/77 Stichproben-/12 Solid-Fälle sowie alle PNGs erfolgreich.
- `check_pinning.py`: isolierter Kontrollfluss-Test mit Befehlsattrappen,
  **keine** simulierten CAD-Ergebnisse. Alter Wrapper umgeht Nix und scheitert
  erwartungsgemäß (`logs/red-pinning.log`); korrigierter Wrapper betritt Nix
  trotz vorhandener Host-Werkzeuge (`logs/pinning-check.log`, PASS).
  Der echte Nix-/CAD-Gesamtlauf ist davon getrennt oben nachgewiesen.
- Unabhängige mechanische Gegenprüfung: Grundgeometrie und Insert-/Schrauben-
  Maßkette plausibel; dort angemerktes Kopfproblem anschließend separat mit
  reduzierten Köpfen und Toleranzfall geprüft. Der Review bezog sich noch
  auf den frühen Stand, nicht auf eine physische Abnahme.
- Abschließender unabhängiger Code-Re-Review nach Versionsschutz-Korrektur:
  PASS, keine Security-/Logikblocker. Vollständiger realer Renderer-Lauf
  zusätzlich vom ausführenden Agenten mit Exit0 geprüft, nicht vom Reviewer.

Prüflogs im Mount-Unterordner `logs/`; nur `red-*` protokollieren erwartete
Vorgängerfehler, finale Export-/Mesh-/Fit-/Bildlogs gehören zum Endstand.

## Schraubenmaßkette gerechnet

M2,5×12 ohne Scheibe bei12-mm-Auflage und1,6-mm-PCB: Spitze z=1,6,
Überdeckung zum Insert z=0,2…5,9 nominal4,3 mm. Mit explizit angenommenen
±0,15 mm für Auflage/PCB, ±0,2 Schraubenlänge, -0,2 Insert-Oberende und
0,3 mm Spitzenreserve bleiben3,3 mm Eingriff sowie mindestens1,1 mm zum
Holz. Keine echte Toleranzmessung und keine Schrauben-Bestellfreigabe.

## Reale Grenzen — nicht fehlende Konstruktion

Reales HW-125-Lochraster noch nicht durch Passprobe bestätigt; Unterseitenfoto,
Lot-/Header-/Sockelmaße fehlen. Die angenommene Modellhülle muss mit dem
realen Modul verglichen werden. Insbesondere passende reduzierte Schrauben
finden und Kopfabstand am echten Sockel/Header prüfen; keine PCB aufbohren
oder verspannen. Heat-Set-/Schrauben-/Holz-/Lastprobe, tatsächlicher Slicer,
Druckmaterial und Karten-/Handzugang noch nicht physisch geprüft.
Kein realer Druck oder Lasttest auf dem Server behauptet.

Übergabe und Status in `docs/mounts-weiterarbeit.md`, `To-Do.md`,
`docs/fertigungsstatus.md` aktualisiert. Ein ergänzender AGENTS.md-Verweis
blieb unverändert, weil die Schreibfreigabe des geschützten Pfads ausblieb;
kein Umgehungsversuch. Die bestehende AGENTS.md verweist bereits auf die
aktualisierte Mount-Übergabe.
