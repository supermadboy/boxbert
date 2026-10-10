# AW9523 (ADA4886) — Einzel-Mount mit regelmäßigem Gitter

Stand: **09.10.2026**. Zweiter Einzel-Mount im bestätigten Stil des
Step-Up-Mounts (`3d-print/mounts/stepup-mount/`): regelmäßiger,
durchbrochener Gitterboden, einzelne Pfosten mit Heat-Set-Einsätzen
bündig in der Pfostenoberkante, keine Wände, keine Mulde, keine
L-Auflage. Holzbefestigung wie beschlossen: **3 × 12 mm Senkkopf-
Holzschraube** in 12 mm Pappelsperrholz.

**Entwurf, keine Druck-/Einbaufreigabe:** Geometrie, STL und Vorschauen
digital geprüft (`check_mesh.py` PASS), noch kein Probedruck, kein
eingeschmolzener Einsatz, keine reale Passungs-/Belastungsprüfung.
Alle Konstruktionsmaße sind Entwurfsparameter, keine gemessenen
Hardwarewerte. **Zwei Punkte sind gegenüber dem Step-Up abweichend
abzustimmen** (siehe unten: Holzschrauben-Anzahl und Freistich-Konzept).

## Besonderheit: Montagelöcher liegen in den Stiftreihen

Anders als beim MiniBoost (ein Loch, Anschlussreihe seitlich) hat das
AW9523-PCB **vier Montagelöcher in denselben Reihen wie die Stiftleisten**.
Aus dem Original-PCB (Eagle-Boardfile, Layer 20 / Pads) ausgelesen:

- Loch A (2,54; 2,54) — nächster Pin: JP1-Pad 1 bei (6,35; 2,54),
  Abstand **3,81 mm** vom Lochzentrum.
- Loch B (35,56; 2,54) — JP1-Pad 11, ebenfalls 3,81 mm.
- Loch C (2,54; 15,24) — JP7-Pad 1, 3,81 mm.
- Loch D (35,56; 15,24) — JP7-Pad 11 (3,81 mm) **und** JP2-Pad 11
  (31,75; 12,7), Abstand 4,58 mm.

Ein coaxialer Heat-Set-Pfosten braucht wegen der ruthex-Mindestwand
1,6 mm um das Ø-4,0-mm-Einbauloch mindestens Ø 7,2 mm — der Rand läge
bei r ≥ 3,6 mm und würde den Stift (r bis ~0,55) und den Lotkegel
(typisch r ~0,85–1,1 um die Pin-Mitte, also Rand bei ~2,7–3,0 mm)
ERWISCHEN. Kein coaxialer Vollpfosten passt geometrisch.

**Gelöste Konstruktion:**

- **2 diagonale Schraubpfosten (A + D, Ø 8,2)** mit zweistufigem
  **Pin-Freistich** im Pfostenmantel, jeweils Richtung des nächstgelegenen
  Pins: Kegelzone (obere ~0,9 mm, Freistich bis r ≥ 2,61) und darunter
  schmalerer Pinfreistich (bis r ≥ 3,16). Die Freistiche werden im SCAD
  automatisch aus der Pinliste abgeleitet; Pfosten A hat einen Nachbarpin,
  Pfosten D zwei (Freistich mit zwei Loben).
- **2 massive Stützpfosten (Ø 4)** unter den übrigen Löchern B + C:
  klein genug, dass Stift/Lotkegel mit ≥ 0,4 mm klar vorbeikommen,
  ohne Freistich. PCB ruht auf allen vier Pfosten gleich hoch.
- Dadurch bleiben **ruthex RX-M2,5×5,7** wie gewünscht in A + D.

**Abweichung von der ruthex-Mindestwand, bewusst und dokumentiert:**
Im Kegelsektor des Freistichs bleibt um das Ø-4,0-mm-Einbauloch nur
**ca. 0,61 mm** Wand (im Pinfreistich ca. 1,16 mm; am zweiten Nachbarpin
von D ca. 1,38 mm). Hersteller fordert 1,6 mm radial. Das betrifft nur
den kleinen Sektor Richtung Stiftreihe; die übrige Pfostenwand um den
Einsatz bleibt 1,8 mm. Risiko: beim Einschmelzen könnte dort lokal
Material in den Freistich quellen; Haltekraft kommt überwiegend aus der
Restumfangs-Verankerung. **Wenn das nicht akzeptabel ist: Alternative
ist, die Stifte an A/D-NAchbarpositionen nach oben zu löten (Unterseite
flach), dann funktionieren Freistiche ohne Wandabstrafe** — oder der
Mount wird ohne PCB-Verschraubung gebaut (nicht gewünscht).

**Lötannahme:** Freistiche sind auf Lotkegel r ≤ 1,1 mm und Stifte bis
2,6 mm Überstand unter der Platine ausgelegt (Standard-Stiftleiste:
~1,95 mm). **Schlank löten, keine dicken Lötblobbs** an den vier
nahe den Löchern sitzenden Pins (JP1-Pad 1/11, JP7-Pad 1/11, JP2-Pad 11).
Frei hängende Adern unter der Platine sind nicht abgedeckt.

## Vorschauen / Dateien

- `iso.png`, `top.png`: Mount ohne Platine.
- **`iso-board.png`, `top-board.png`, `side-board.png`: transparente
  Platine + symbolische rote Stifte** zur Kontrolle von Pfostenlage,
  Freistichen, Luftspalt und Schraubzugang. Stifthöhe/-stärke sind
  Symbole, keine Messwerte.
- `aw9523_mount.scad`: parametrisches Modell mit Assertions zur
  Pin-Kollision, Wandstärken und Holzreserven.
- `aw9523_mount.stl`: **nur der gedruckte Mount**, ohne Platine/Einsatz.
- `render.sh`: reproduziert STL und alle fünf Bilder (OpenSCAD CGAL,
  offscreen).
- `check_mesh.py`: STL-Prüfung (Manifold, Bounds 44 × 26 × 10, Punkt-
  probes für Freistiche/Polster), auf die aktuellen Standardparameter
  abgestimmt.

## Aktuelle Entwurfsmaße

| Merkmal | Wert / Bedeutung |
|---|---|
| Außenmaß | **44 × 26 × 10 mm** |
| Gitterboden | **2 mm** dick, 7 × 4 regelmäßige Zellen vor lokalen Verstärkungen |
| Gitteröffnung / Rippe | **4 × 4 mm / 2 mm** |
| Pfosten über Gitteroberseite | **8 mm**, alle vier gleich hoch |
| Schraubpfosten | 2 × Ø **8,2 mm** an Löchern A + D (diagonal), mit Pin-Freistich |
| Stützpfosten | 2 × Ø **4 mm** an Löchern B + C, massiv, ohne Gewinde |
| PCB-Ursprung auf Basis | (2,95; 4,11); Lochzentren 2,54 mm von Platinenkante |
| Heat-Set-Sackloch | Ø **4,0 mm**, **6,7 mm** tief (ruthex d3 / L+1), von oben |
| Material unter Sackloch | 3,3 mm; Wand um Einsatz 1,8 mm (außerhalb Freistiche) |
| Freistich-Wand Kegelsektor | **ca. 0,61 mm** — Abweichung von ruthex 1,6 mm, siehe oben |
| PCB-Schrauben | Empfehlung **M2,5 × 8** (PCB ~1,6 mm angenommen, ungeprüft); Sackloch 6,7 mm, Schraube darf nicht bottomen |
| Holzbefestigung | **2 Durchgangslöcher Ø 3,2 mm** (Abstimmung offen: Step-Up hatte 1) |
| Schraubpolster | Ø **8 mm**, **3,5 mm Gesamtdicke**, Senkung Ø **6,2 mm** / **90°** / 1,5 mm; CAD-Annahme für Kopf ~Ø 6, Fabrikat prüfen |
| Holz | beschlossen: **12 mm Pappelsperrholz**; nominal 8,5 mm Eingriff, 3,5 mm Reserve — keine Sicherheitsfreigabe |

## Maßquellen — am 09.10.2026 geprüft

### Adafruit AW9523 Breakout (ADA4886)

[Originales Adafruit-PCB-Repository](https://github.com/adafruit/Adafruit-AW9523-PCB),
Datei `Adafruit AW9523.brd` (main-Branch, abgerufen 09.10.2026, lokal
ausgewertet: Layer-20-Wires, Packages `MOUNTINGHOLE_2.5_PLATED`,
`1X11_ROUND`, `1X05_ROUND`, `JST_SH4`):

- Kontur: **38,1 × 17,78 mm** Oktogon, alle vier Ecken 2,54 mm gefast.
- **4 ×** `MOUNTINGHOLE_2.5_PLATED` bei (2,54 / 35,56 × 2,54 / 15,24),
  Pad `drill="2.5"`, `diameter="3.2"` — direkt ausgelesen, nicht aus
  Produktnamen abgeleitet.
- Durchreihte Reihen mit drill 1,0: JP1 (y = 2,54), JP7 (y = 15,24),
  JP2 (y = 12,7) je 1×11, x = 6,35…31,75; JP3 (y = 5,08) 1×05,
  x = 21,59…31,75.
- STEMMA-QT-Stecker (JST-SH) rein SMD: Unterseite besteht nur aus den
  vier Stiftreihen und den Montagepad-Inseln.
- Produktfoto (`assets/4886.jpg`, unbestückt): Headerpositionen liegen
  direkt neben den Montagelöchern; Foto beweist keine Lötstellenhöhe.

Produkt: <https://www.adafruit.com/product/4886>

### ruthex RX-M2,5×5,7

Wie Step-Up-Mount geprüft ([Produktseite](https://www.ruthex.de/products/ruthex-gewindeeinsatz-m2-5-70-stuck-rx-m2-5x5-7-messing-gewindebuchsen),
[Maßtabelle mit Einbauzeichnung](https://cdn.shopify.com/s/files/1/0567/7019/9760/files/1Tabelle.PT05_eb2a30fa-5c34-46f8-b557-a6c432354560.jpg?v=1748341911)):
Einbauloch **Ø 4,0**, Mindesttiefe **6,7 mm**, Mindestwand **1,6 mm**
radial (hier im Kegelsektor unterschritten, siehe oben).

## Offen / Abzustimmen

1. **Holzschrauben-Anzahl:** 2 statt 1 (Basis 44 mm lang; 1 Schraube
   ließe den Mount um die Schraube pendeln). Nutzer-OK abwarten.
2. **Freistich-Konzept + Wandabweichung (0,61 mm vs 1,6 mm):** Nutzer-OK
   abwarten; Alternativen siehe oben.
3. **M2,5 × 8 PCB-Schrauben beschaffen** — nicht als vorhanden ausgeben.
   PCB-Dicke (~1,6 mm angenommen) vor erstem Einschrauben messen.
4. Heat-Set-Probedruck (Einbauloch Ø 4,0 in 8,2-mm-Pfosten, zusätzlich
   Freistichsektoren), reale Lötstellenhöhe/-breite der angelöteten
   Stiftleisten, Kopfpassung der Holzschraube, Holztest am Reststück.
5. Für das NFC/SD/Audio-Umfeld relevante Fragen (Bus, Rails) sind
   mechanisch hier nicht behandelt; Maßgeblichkeit `AGENTS.md`.