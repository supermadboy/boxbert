# NeoPixel-Stick — Deckelhalter mit Außenfräsung

**Stand 15.10.2026: konstruiert und digital geprüft, noch nicht gedruckt/gefräst.**
Daddelbert hat ausdrücklich die **Adafruit-1426-Platine als Entwurfsbasis**
freigegeben und gleicht sein geliefertes Exemplar vor dem Druck ab. Das ist
keine nachgewiesene Identifikation des in der BOM als NEOPS8 bestellten Moduls.

## Anordnung

Von **außen auf den Deckel und die LEDs** gesehen: DIN links, DOUT rechts,
Loch-/Kondensatorseite hinten. Zwei Holzlaschen liegen beide an der Vorderseite
nahe der Mitte, nicht eine vorne und eine hinten. Zentren relativ zur linken
unteren PCB-Ecke: (18,4; −17) und (32,4; −17) mm. Rückwand bleibt ohne Laschen.

Der Stick liegt mittig über die 250-mm-Deckelbreite, weit hinten auf dem
250 × 180 × 12-mm-Deckel. Referenz-Rückwand innen y=25,16, außen y=37,16:
zwischen Glasfalz hinten und innerer Rückwand bleiben 4 mm, zwischen Druckteil
hinten und innerer Rückwand 8,2 mm. Die Rückwand ist als 12-mm-Wand modelliert;
**noch keine Deckel-Schraubleisten/anderen Module** geprüft. Die Position muss
zum echten Deckelrahmen passen, nicht ungeprüft zwischen bestehende Leisten setzen.

## Dateien

- `geometry.scad`: gemeinsame CNC-/Druckmaße und Höhen.
- `neopixel_mount.scad` / `neopixel_mount.stl`: **nur das Druckteil**.
- `panel_cnc.scad` / `panel_cnc.stl`: Deckel-Referenzmodell, **nicht drucken**.
- `cnc-opening.dxf`: Durchbruch, 62,8 × 22,16 mm, R3.
- `cnc-rebate.dxf`: äußere Glasfalz, 70,8 × 30,16 mm, R3, **3 mm tief**.
- `cnc-glass.dxf`: vorgeschlagene Scheibe, 70,4 × 29,76 × 3 mm, R2,8.
- `overview.png`: mit Platine / nur Halter; `height-side.png`: gerader Höhenschnitt.
- `top-board.png`, `exploded.png`, `seated-inside.png`, `outside.png`: Zusatzansichten.

Koordinaten in **mm**, Ursprung linke untere PCB-Ecke; +x rechts, +y hinten,
+z außen. Der vollständige Deckel reicht x=−99,6…150,4 / y=−142,84…37,16.
DXF sind **Nennkonturen, keine Werkzeugbahnen und kein G-Code**.

## CNC: ausschließlich von außen

Eine Aufspannung, zuerst Falz, dann Durchbruch; **kein Wenden, keine Innentasche**.
Maximal Ø6-mm-Fräser wegen R3, CAM-Werkzeugkompensation/Zustellungen und sichere
Werkstückhaltung separat festlegen. Tatsächliche Plattenstärke prüfen.
Holzbefestigung von innen per 3 × 12-mm-Senkkopf-Holzschrauben; deren begrenzte
Pilotbohrungen sind Handarbeit von innen, **keine Durchgangslöcher im Deckel**
und nicht in den Außen-CNC-Dateien enthalten.

Vier kurze Eckführungen greifen 4,5 mm in den Durchbruch, 0,20 mm Spiel pro
Seite, 0,4-mm-Einführfase über 0,6 mm Höhe. Holzlaschen, nicht PCB/Glas/LEDs,
setzen den Tiefenanschlag. Führung richtet aus, Schrauben klemmen.

## Höhen und Optik

| Ebene | z [mm] | relativ zur Holzinnenseite |
|---|---:|---:|
| Druckteil-Unterseite | 0 | −12 |
| Gitteroberseite | 2 | −10 |
| Holzlaschen unten / Schraubkopfseite | 8,5 | −3,5 |
| Holzanschlag / Deckel innen | 12 | 0 |
| PCB unten / Auflage | 14,9 | +2,9 |
| PCB oben / Führungsspitze | 16,5 | +4,5 |
| LED oben | 18 | +6 |
| M2-Kopf oben | 18,5 | +6,5 |
| Scheibe unten | 21 | +9 |
| Holz-/Scheiben-Außenseite | 24 | +12 |

PCB-Dicke **1,6**, LED-Höhe **1,5**, Schraubkopf-Höhe **2**, Scheibendicke **3 mm**
sind Entwurfswerte, nicht am Nutzerexemplar gemessen. Vorgeschlagen: opales PMMA,
**3 mm LED→Scheibe**. Weder Homogenität, Farbwirkung noch Blend-/Kindersicherheit
wurden optisch geprüft. Das ist kein vom TFT blind übernommener 2-mm-Abstand.

**Glasfixierung ist noch offen.** Die Falz trägt von unten, verhindert aber
kein Herausheben. Vor Nutzung Scheibe sicher und kindgerecht fixieren; nicht
nur lose einlegen. Klebstoff-/Materialverträglichkeit und Temperatur prüfen.

## Platinenbefestigung: M2, nicht M2,5

Original-Eagle v2: 50,8 × 10,16 mm, zwei **Ø2,2** bei (12,7;8,128) und
(38,1;8,128), **25,4 mm** Lochabstand. Acht LED-Zentren bei
x=3,175 + n·6,35, y=3,81. Linker Eingang durch CN2/R1→LED1-DIN am Netz geprüft.
Quellenkopie, Lizenz und frischer Extraktor: `../../../docs/cad/neopixel-stick/`.

- Zwei vorgeschlagene **M2 × 16-mm-Zylinderschrauben**, Kopf maximal Ø3,8 / 2 mm
  hoch, **keine breiten Unterlegscheiben**. Bereits Ø4-mm-Köpfe schneiden im
  nominellen Modell die benachbarten LED-Ecken; dieser Fehler wurde im Test
  erkannt und durch die kleinere Kopfhülle behoben. Reale Kopfform prüfen.
- Zwei **M2-Sechskantmuttern**, nominal SW4 / Höhe 1,6; rückseitige Taschen
  SW4,2 / Tiefe 2,2. Passung kalibrieren, Muttern vor dem Verschrauben von
  unten einlegen/festhalten. Verdrehsicherung, **keine selbsthaltenden Clips**.
  Dieses M2-Material ist nicht als vorhanden/bestellt inventarisiert.
- Schraubenspitze rechnerisch z=0,5, Mutter z=0,6…2,2, somit nominal volle
  Mutterhöhe im Eingriff; nur 0,1 mm Überstand unter der Mutter. Tatsächliche
  PCB-/Schrauben-/Mutternmaße vor Verwendung prüfen; keine zu kurze Schraube
  durch stärkeres Anziehen kompensieren.
- Zwei zusätzliche flache Kunststoffstützen vorne unter der PCB; keine
  Pfosten auf LED-Bauteile. Unterseiten-Lotfreiheit real abgleichen.
- Die vorhandenen **M2,5-ruthex passen nicht durch Ø2,2**. Kein Aufbohren/Erzwingen.

Holzlaschen 3,5 mm, Bohrung Ø3,2, Senkung Ø6,2 / 90° von innen. 3×12-mm-
Holzschrauben greifen nominal 8,5 mm in 12-mm-Pappel; 3,5 mm Restholz.
Kopfmaß/Halt und begrenzte Vorbohrtiefe am Reststück prüfen, von Hand anziehen.

## Kabel und Montagefolge

Direkt angelötete Leitungen links zunächst **nach unten**, erst unterhalb der
Holzinnenseite nach links/vorne führen. Kein gerader seitlicher Steckerkanal
im Holz nötig. Darstellung ist eine Route, keine neue elektrische Pinbelegung.
DOUT bleibt laut bestehendem Verkabelungsplan offen. Elko/330-Ω-Widerstand und
Schrumpfschlauch nicht in den 3-mm-Lichtspalt legen; eigene Halterung/Isolierung
im Innenraum vorsehen, keine Zuglast auf die Lötpads.

Digitale Kabel-/Schrumpfschlauch-Hülle: x=−1…4, y=0,2…9,96, z=6…14,9 und
x=−16…4, y=1…9, z=3…9. **Keine vermessene Dupont-/Steckerfreigabe.** Größere
Stecker verlangen neue Hüllenprüfung. Kabelbinderpad links vorhanden;
Biegeradius, Isolierung und echte Zugentlastung vor Ort prüfen.

1. Druck-/Mutter-/Führungspassprobe, Muttern einsetzen; keine Elektronik beim
   Nacharbeiten belasten. PETG als Materialvorschlag, nicht mechanisch abgenommen.
2. PCB außerhalb montieren, M2-Schrauben vorsichtig anziehen, Kabel vorformen
   und am Pad entlasten. Akku bleibt für erste USB-Prüfung getrennt.
3. Gesamte Einheit gerade von innen einsetzen. Holzlaschen liegen am Deckel an.
4. Holzlöcher markieren/begrenzt vorbohren, von innen verschrauben. Eingebaut
   kein Steckzugang nötig; zum Ändern Baugruppe ausbauen.
5. Scheibe sicher fixieren; tatsächliche Luft, Leisten, Kabel und Last prüfen.

Druckorientierung mit Basis auf dem Bett als Ausgangspunkt; **erhöhte Laschen
brauchen Support oder eine geeignete alternative Orientierung**. Nicht als
supportfrei zugesagt. Lange Führungen/Laschen und einseitige Klemmung erfordern
Steifigkeits-/Schocktest am realen Druck; noch keine Belastungsfreigabe.

## Reproduktion / tatsächliche Prüfungen

```bash
bash 3d-print/mounts/neopixel-stick-mount/render.sh
```

Gepinntes OpenSCAD 2021.01/CGAL, Xvfb/Mesa und shellcheck entsprechend Fenster-
Referenz, nur Prozessumgebung, kein Root/Flake-Update. Python/Pillow aus der
vorhandenen Umgebung für Bildbeschriftungen. `bash -n` und `shellcheck` bestanden.

Frische tatsächliche STL: eine zusammenhängende, geschlossene, konsistent
orientierte Hülle ohne degenerierte Dreiecke; Bounds und CNC-/DXF-Maße geprüft.
11 Solid-Fälle einschließlich **importierter Druck-STL** gegen Holz, PCB,
Kabelhüllen, Rückwand und Glas; Schraubenköpfe separat gegen LEDs/SMD geprüft.
Absichtliche 0,5-mm-Seitversätze/Über-Einsetzen erzeugen erkannte Kollisionen.
Gerader Einsetzweg in 1-mm-Schritten geprüft, **kein lückenloser Bewegungsbeweis**.
0,001-mm-Prüfrückzug vermeidet reine Nullstärken-Kontaktflächen in CGAL.
Rohlogs unter `logs/`. Vorschauen tatsächlich gerendert und angesehen.

**Vor Fertigung offen:** Modulabgleich (Nutzer übernimmt vor Druck), reale
Schrauben/Muttern, Holz-/Glasstärke, Passungs-/Lastprobe, sichere Scheibenfixierung,
Stecker-/Löthüllen und Lichtwirkung. Digital PASS ist keine Fertigungs- oder
Kindersicherheitsfreigabe.
