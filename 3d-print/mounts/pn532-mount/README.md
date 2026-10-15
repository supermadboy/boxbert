# PN532 — Deckelhalter mit Plexiglas und Außenfalz

Stand 15.10.2026. **Digitaler Entwurf, keine physische Fertigungsfreigabe.**
Daddelbert hat Plexiglas und die **Elechouse-V3-Zeichnung als Entwurfsbasis**
freigegeben; Abgleich mit dem tatsächlich gelieferten PN532-MOD bleibt offen.
Quellen/Zeichnung: `../../../docs/cad/pn532/README.md`.

## Form und Anordnung

Einzelhalter mit 2-mm-Gitterboden (4-mm-Öffnungen, 2-mm-Rippen), zwei diagonal
angeordneten Schraubpfosten, zwei kleinen Randstützen und vier Eckführungen.
Keine umlaufende Wanne. Zwei Holzlaschen an gegenüberliegenden Seiten bilden
Tiefenanschlag und Klemmung. Elektronik und vierpoliger I2C-Stecker zeigen
**nach innen**, die andere PCB-Seite zum Plexiglas. Keine Firmware-/Pinänderung.

Lokale Orientierung wie die Elechouse-Zeichnung auf Seite 2: Ursprung unten
links an der Platine, +x rechts, +y oben / hinten, +z nach außen. I2C-Hülle im
Modell links. Das BerryBase-Foto ist anders gedreht. **Die genaue Position und
Drehung im Gesamtdeckel ist noch nicht festgelegt.** Das Holzmodell ist ein
82,7 × 80,4-mm-Prüfstück, kein gebohrter Gesamtdeckel und kein geprüftes Layout
mit Buttons, NeoPixel, Rahmen oder Schraubleisten.

## Fertigungsdateien

- `geometry.scad`: gemeinsame Maße von Halter und CNC.
- `pn532_mount.scad` / `pn532_mount.stl`: **nur das Druckteil**, Hülle
  x=−12…44,9 / y=−16…56,4 / z=0…23,9 mm.
- `panel_cnc.scad` / `panel_cnc.stl`: lokales Holz-Prüfstück, **nicht drucken**.
- `cnc-opening.dxf`: Durchbruch **47,5 × 45,2 mm, R2**.
- `cnc-rebate.dxf`: äußerer Falz **51,5 × 49,2 mm, R2, 3 mm tief**.
- `cnc-glass.dxf`: Scheibe **51,1 × 48,8 × 3 mm, R1,8** vorgeschlagen.
- `overview.png`: ohne und mit transparenter PCB; `height-side.png`: gerade
  Seitenansicht mit Höhen. Weitere echte Ansichten: `top-board.png`,
  `exploded.png`, `seated-inside.png`, `outside.png`.

Alle DXF sind **Nennkonturen in mm, kein G-Code**, keine kompensierten Fräsbahnen.
Nur von außen fräsen, zuerst Falz, dann Durchbruch. Kein Wenden, keine Innentasche.
Wegen R2 maximal Ø4-mm-Fräser. CAM, Zustellungen, Werkstückhaltung und
Ausbruchstrategie separat festlegen. Innenliegende Pilotlöcher der Holzschrauben
werden von Hand begrenzt vorgebohrt, nicht als Durchgangslöcher CNC-gefräst.

Vier Eckführungen greifen 4,5 mm in den Durchbruch, 0,20 mm Spiel **je Seite**,
0,4-mm-Einführfase über 0,6 mm. Das sind Kalibrierwerte für eine reale Passprobe.
Holzlaschen tragen am Holz, nicht Platine oder Plexiglas. Führung richtet aus,
Schrauben klemmen. Die Scheibe liegt auf dem Holzfalz, nicht auf Elektronik.

## Höhen und Schichtung

+z außen, Ursprung Druckteil-Unterseite. Alle nicht aus der Zeichnung
stammenden Höhen sind **Entwurfsannahmen**, nicht am Nutzerexemplar gemessen.

| Ebene | z [mm] | relativ zur Holzinnenseite |
|---|---:|---:|
| Druckteil-Unterseite | 0 | −18,5 |
| Gitteroberseite | 2 | −16,5 |
| Angenommene I2C-Hülle unten | 7,9 | −10,6 |
| Holzlasche unten / Schraubkopfseite | 15 | −3,5 |
| Holzanschlag / Deckel innen | 18,5 | 0 |
| Angenommene Elektronikhülle unten | 18,9 | +0,4 |
| Führungsspitze | 23 | +4,5 |
| PCB innen / Auflage | 23,9 | +5,4 |
| PCB außen / Schraubenkopfauflage | 25,5 | +7 |
| M2-Kopf oben, maximal | 27 | +8,5 |
| Plexiglas unten | 27,5 | +9 |
| Plexiglas / Holz außen | 30,5 | +12 |

**PCB→Scheibe nominal 2 mm, Kopf→Scheibe mindestens nominal 0,5 mm** bei max.
1,5-mm-Kopfhöhe. PCB 1,6 mm, Scheibe 3 mm, Elektronikhülle 5 mm, Steckerhülle
16 mm sind Annahmen. Tatsächliche Toleranzen und Scheibendurchbiegung prüfen.

NFC-Kopplung durch 3-mm-PMMA plus 2-mm-Luft ist **nicht getestet**. Diese Werte
sind ein kompakter Vorschlag, kein garantierter Leseabstand. Beide PCB-Seiten
sind kein gerichteter optischer Sender; Orientierung allein garantiert keine
RF-Verbesserung. Reale Tags mit komplett montierter Schichtung prüfen, inklusive
Schrauben/Muttern, Kabeln und benachbarter Hardware. Keine Metallfolie/-platte,
Metallrahmen oder Zusatzmagnete ohne neuen RF-Test ergänzen.

**Scheibenfixierung bleibt offen.** Der Falz allein verhindert kein Herausheben.
Vor Nutzung sicher und kindgerecht fixieren; Material-/Klebstoffverträglichkeit,
Drucklast und Durchbiegung prüfen. Nicht nur lose einlegen.

## PCB-Befestigung und Schrauben

Elechouse-Maßzeichnung: 42,7 × 40,4 mm, zwei Lochmitten (7,4;7,6) und
(35,2;32,8), Versatz 27,8 × 25,2 mm. **Ø2,5 ist nur eine Annahme**, weil der
Bohrdurchmesser in der Originalzeichnung fehlt. Vor Fertigung prüfen.

- Vorgeschlagen: **zwei M2×25**, Kopfdurchmesser max. 4 mm, Kopfhöhe max.
  **1,5 mm**, keine zusätzlichen Scheiben im 2-mm-Spalt. Konkretes Fabrikat
  und reale Kopfgeometrie noch zu prüfen, nicht als vorhanden inventarisiert.
- Zwei rückseitig eingelegte M2-Sechskantmuttern, nominal SW4 / 1,6 mm Höhe.
  Taschen SW4,2 / 3,5 mm tief, von hinten zugänglich; **keine selbsthaltenden
  Clips**. Taschen kalibrieren, Muttern beim Montieren halten.
- Schraubenspitze nominal z=0,5; Mutter z=1,9…3,5. Volle Mutterhöhe im
  nominellen Gewindebereich. Eigenes angenommenes Budget: Schraubenlänge
  ±0,2, PCB-Abweichung +0,15, unvollständiges Spitzengewinde 0,3, Sitz −0,2,
  Mutterhöhe −0,1 mm. Daraus rechnerisch mindestens 1,5 mm Gewindeeingriff;
  kein gemessener Toleranz- oder Festigkeitsnachweis.
- Kein Aufbohren, keine vorhandenen M2,5-ruthex erzwingen. M2 ist hier ein
  separater Vorschlag zur kleinen PCB-Verschraubung.
- 8-mm-Pfosten werden zur PCB auf Ø4,6 verjüngt; zwei weitere Ø2,8-Auflagen
  stützen angenommene freie Randbereiche. Echte Lötstellen-/Bauteilfreiheit
  einschließlich dieser Stützflächen prüfen, keine PCB-Biegung erzwingen.

Holzlaschen 3,5 mm; Ø3,2-Durchgang und Ø6,2 / 90°-Senkung von innen.
Zwei **3×12-mm-Senkkopf-Holzschrauben**, Zentren (21,35;−10) und (21,35;50,4).
Nominal 8,5 mm Eingriff und 3,5 mm Restholz bei 12-mm-Pappel. Reales Kopfmaß,
Holzstärke, Halt und begrenzte Vorbohrtiefe am Reststück prüfen. Von Hand anziehen.

## Kabel und Montage

Die im CAD angenommene vierpolige I2C-Hülle sitzt links innen, 4×12×16 mm,
x=0,5…4,5 / y=11…23. Sie ist **kein vermessener Dupont-/JST-Nachweis**.
Vier Leitungen gehen nach innen und bei z≈8…10 unter dem Holz nach links.
Kabelbinderpad links neben der Basis, reale Biegeradien und Zugentlastung
separat prüfen; Kabel/Lötstellen sind keine mechanische Halterung.

1. Druck-/Führungs-/Mutternpassprobe ohne Elektronik, tatsächliches Modul und
   Schrauben abgleichen. PETG als Ausgangsidee, keine Materialfreigabe.
2. Muttern von hinten einlegen/halten, PCB und Stecker außerhalb vormontieren.
   Schraubenköpfe auf der späteren Glasseite, Elektronik/Stecker nach innen.
3. Kabel vorformen und entlasten. Baugruppe gerade von innen einsetzen, bis
   die Holzlaschen aufliegen. Eingebaut kein erneuter Steckzugang nötig.
4. Begrenzt vorbohren, mit Holzschrauben von innen befestigen.
5. Scheibe sicher fixieren; echte Freigängigkeit, Last und NFC-Lesen prüfen.

Lange Pfosten/Führungen und erhöhte Laschen brauchen eine geeignete
Druckorientierung bzw. Support, **nicht supportfrei zugesagt**. Festigkeit,
Schichthaftung, stoßfeste Befestigung und Kindersicherheit sind offen.

## Reproduktion / Prüfgrenzen

Tatsächlicher Lauf: STL mit 5.232 Dreiecken, einer geschlossenen orientierten
zusammenhängenden Oberfläche und Volumen 6.616,832 mm³ geprüft. Alle 13
Solid-Testgruppen bestanden, darunter 21 einzelne Einsetzlagen und drei
absichtliche Kollisions-Gegenproben. Neue PNGs gerendert und visuell geprüft.
Das bestätigt nur das digitale Modell mit den angegebenen Annahmen.

```bash
bash 3d-print/mounts/pn532-mount/render.sh
```

Gepinnte OpenSCAD-2021.01-/CGAL-/Xvfb-/Mesa-Umgebung wie beim Fenster, kein
Root, kein Flake-Update. `render.sh` prüft `bash -n` und `shellcheck`.
`check_mesh.py` prüft die tatsächliche STL (geschlossene orientierte,
zusammenhängende, nicht degenerierte Oberfläche, positive Volumen und Bounds).
`check_cnc.py` prüft reale DXF-/Holz-STL-Maße und eine unabhängige Maßkette.

`check_fit.py` führt Vollkörper-Schnitte gegen die **importierte Druck-STL**
aus: Holz-Sollposition, Versatz-/Tiefen-Gegenproben, PCB, Elektronikhülle,
Stecker/Kabel gegen Mount und Holz, Glas und M2-Bohrungen. Zusätzlich 21
Einsetzlagen z=−20…0, einzeln geschnitten, mit 0,001-mm-Prüfrückzug gegen reine
Nullstärken-Kontaktflächen. Ein 1-mm-Raster ist **kein lückenloser Bewegungsbeweis**.
Es prüft nur die expliziten angenommenen Hüllen, kein vollständiges bestücktes
PCB-Modell und keinen realen Holz-/FDM-Toleranzbereich. Frische Logs: `logs/`.
Vor erster Implementierung schlug der neue Mesh-Test erwartungsgemäß mit
`AssertionError: Missing new PN532 print export` fehl.

Offen: Modul-/Lochabgleich, Stecker-/Löt-/Bauteilhöhen, echte M2-Köpfe/Muttern,
Holz-/Glasstärke, Druck-/Passungs-/Lasttest, Scheibenfixierung, Gesamtdeckel-
Layout und reale Lesereichweite. Keine elektrische oder physische Abnahme.
