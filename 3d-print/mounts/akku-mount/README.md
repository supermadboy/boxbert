# Akkuhalter — erster Konzeptvorschlag, 09.10.2026

Separater Entwurf für den vorhandenen Soldered SOL-333286 / 605080.
Nutzer hat einen Vorschlag mit abnehmbarem Schraubbügel beauftragt.
**Keine Druck-, Passungs-, Belastungs- oder Kindersicherheitsfreigabe.**
Bestehende Platinen-Mounts bleiben unverändert.

## Dateien

- `akku_mount.scad`: parametrischer Entwurf, Baugruppe nur als Vorschau.
- `akku_base.stl`: nur Basis, 100 × 76 × 10,5 mm.
- `akku_bridge.stl`: nur Bügel, 16 × 74 × 3 mm; flach drucken.
- `iso.png`, `top.png`, `side.png`: ohne Akku, Basis + Bügel.
- `*-akku.png`: mit transparentem Akku-Hüllkörper und vorgeschlagener Unterlage.
- `render.sh`, `check_mesh.py`: reproduzierbarer Export und digitale Prüfungen.

## Prinzip und Maße

2-mm-Gitter, 4-mm-Zellen / 2-mm-Rippen. Acht kurze, abgerundete Anschläge,
keine strammen Pouch-Clips. Freier Innenraum zwischen Anschlägen 83 × 52 mm.
Akku-Hülle 81,1 × 49,8 × 5,7 mm aus `docs/kernwerte.md`, dortige Quelle:
`docs/datenblaetter/SOL-333286.pdf`. Kein eigener Messwert. Die dortige alte
Formulierung „> 6 mm Materialdicke“ ist keine begründete Wandstärkenvorgabe
und wird hier nicht als geprüfter Konstruktionswert übernommen.

Eine **separate glatte, elektrisch isolierende Unterlage**, im Entwurf
82 × 51 × 0,5 mm, trennt den Pouch vom Gitter. Material, Befestigung,
Kanten, Durchbiegung und Temperaturbeständigkeit noch auswählen/prüfen.
Unterlage ist nicht Bestandteil der STL und nicht als vorhanden bestätigt.
Ohne geeignete Unterlage den Akku nicht einsetzen.

Zwei feste Ø-9-mm-Pfosten tragen den Bügel bei z = 10,5 mm. Bei nominalem
Akku + 0,5-mm-Unterlage bleiben 2,3 mm Luft oberhalb des Akkus. Bügel wird
gegen Pfosten verschraubt, nicht gegen den Akku. Das Spiel ist kein
zugelassener Schwellraum: aufgeblähte/beschädigte Akkus nicht weiterverwenden.
Nominal bleibt bei vollständigem Anheben bis zum Bügel nur 0,7 mm Höhen-
Überdeckung an den Anschlägen: Retention, Kippmöglichkeit und Toleranzen
müssen mit einem ungefährlichen Dummy geprüft werden; noch keine sichere
Rückhaltung bei Stoß/Fall nachgewiesen. Kabel sind niemals die Sicherung.

Zwei ruthex RX-M2,5×5,7 von oben bündig: Einbauloch Ø4,0, Tiefe 6,7,
Wand zum maximalen Einsatz-Ø4,6: 2,2 mm. Herstellerwerte siehe Kernwerte
und Step-Up-README. Einschmelzen ausschließlich ohne Akku/Unterlage.
Bügelschrauben M2,5 mit flach aufliegendem Kopf, keine Senkköpfe.
M2,5×8 ist nur ein Rechenbeispiel: 3 mm Bügel + 5 mm Eingriff;
realen Einsatzbeginn, Gewindelänge und Schraubenende prüfen, nicht blind bestellen.

Holzschrauben: zwei 3 × 12 mm Senkköpfe bei (4,5;38)/(95,5;38),
außerhalb der Akku-Hülle. Pads 3,5 mm, Ø3,2-Durchgang, Ø6,2/90°-Senkung.
Bei bündigem Kopf nominal 8,5 mm Holzeingriff in 12-mm-Pappel;
reale Kopfpassung, Holzstärke, Vorbohrtiefe und Halt am Restholz prüfen.
Anzahl zwei ist ein Vorschlag, keine bestätigte mechanische Abnahme.

## Ungeklärt vor realem Einbau

- Echte maximale Akku-Abmessungen inklusive Foliennaht, PCM und Kabelansatz.
- Kabel-/PCM-Position: Hüllkörper zeigt diese **nicht**; freie Abschnitte
  zwischen Anschlägen sind nur mögliche Ausgänge, keine Anschlussfreigabe.
- Hersteller-Produktseite recherchiert, lieferte über Web-Extraktion keine
  nutzbaren Detailfotos/Maßtoleranzen; direkter JSON-Abruf HTTP403.
  https://soldered.com/products/li-po-battery-3000mah-3-7v-605080-jst
- Daher vor Passungsfreigabe Foto des realen Akkus mit Kabelseite und
  schonende Außenmaßmessung ohne Druck auf den Pouch nötig.
- Druckmaterial/Profil, Schichtfestigkeit des Bügels/Pfosten, glatte
  entgratete Kontaktflächen, Wärme im Ladebetrieb und Dummy-Rückhaltung.
- Gegen lose Metallteile/Kurzschluss sichern, Kabel zugentlasten ohne
  die Foliennaht zu belasten. Kein leitfähiges Filament verwenden.

Erst ohne Akku drucken, Einsätze montieren und mit Dummy testen. Akku bei
allen Arbeiten abstecken; elektrische Wiedermontage zuletzt nach Projekt-
Sicherheitsregeln. Keine Änderung von Firmware, Pins oder Power-Rails.

## Digitale Prüfung

`bash render.sh` (OpenSCAD CGAL, binäre STL, offscreen). Beide tatsächlichen
STLs auf geschlossene, orientierte, zusammenhängende Oberflächen,
degenerierte Dreiecke, passende Bounds und geometrische Stichproben geprüft.
Log: `docs/cad/akku-mount/render-check.log`.
Ein erster Zwischenexport hatte eine nichtmanifold tangentiale Pad/Gitter-
Berührung; durch versetzte, größere Pads konstruktiv beseitigt, nicht repariert.
CAD-Erfolg sagt nichts über Druckpassung oder Kindersicherheit aus.
