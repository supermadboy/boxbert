# NeoPixel-Stick — Deckelhalter mit Außenfräsung

**Stand 15.10.2026: konstruiert und digital geprüft, noch nicht gedruckt/gefräst.**
Daddelbert hat ausdrücklich die **Adafruit-1426-Platine als Entwurfsbasis**
freigegeben und gleicht sein geliefertes Exemplar vor dem Druck ab. Das ist
keine nachgewiesene Identifikation des in der BOM als NEOPS8 bestellten Moduls.

## Kompakte Überarbeitung

Nutzerkorrektur: kleinerer **Rand in X/Y**, nicht mehr Abstand zur Scheibe.
Die bisherigen großen Konturen (62,8×22,16 / Falz70,8×30,16) sind überholt;
der kurz besprochene 8,5-mm-LED-/Glasabstand wurde **nicht übernommen**.
Einbautiefe, 3-mm-Falztiefe und nominal 3-mm-Lichtspalt bleiben unverändert.

PCB50,8×10,16 → Durchbruch55,2×14,56: nur **2,2 mm je Platinenseite**.
Das enthält an den Führungen 0,5 mm PCB-Luft, 1,5 mm Kunststoff und 0,2 mm
Passspiel. Zusätzlich nur 2 mm Falzrand; Scheibe mit 0,2 mm Spiel liegt nominal
1,8 mm je gerader Seite auf. Erst reale Pass-/Druckprobe, nicht weiter auf null
reduzieren. `cnc-compare.png` zeigt alt/neu maßstäblich; links nur historische
Ansicht, **keine alten Fräskonturen verwenden**.

## Anordnung

Von **außen auf den Deckel und die LEDs** gesehen: DIN links, DOUT rechts,
Loch-/Kondensatorseite hinten. Zwei Holzlaschen liegen beide an der Vorderseite
nahe der Mitte, nicht eine vorne und eine hinten. Zentren relativ zur linken
unteren PCB-Ecke: (18,4; −10) und (32,4; −10) mm. Rückwand bleibt ohne Laschen.

Der Stick liegt mittig über die 250-mm-Deckelbreite, weit hinten auf dem
250 × 180 × 12-mm-Deckel. Referenz-Rückwand innen y=18,36, außen y=30,36:
zwischen Glasfalz hinten und innerer Rückwand bleiben 4 mm, zwischen Druckteil
hinten und innerer Rückwand 5,732 mm. Die PCB-Mitte liegt 25,28 mm vor der
hinteren Außenkante. Druckteil-Bounds 60,8×28,628×16,5 mm. Die Rückwand ist als 12-mm-Wand modelliert;
**noch keine Deckel-Schraubleisten/anderen Module** geprüft. Die Position muss
zum echten Deckelrahmen passen, nicht ungeprüft zwischen bestehende Leisten setzen.

## Dateien

- `geometry.scad`: gemeinsame CNC-/Druckmaße und Höhen.
- `neopixel_mount.scad` / `neopixel_mount.stl`: **nur das Druckteil**.
- `panel_cnc.scad` / `panel_cnc.stl`: Deckel-Referenzmodell, **nicht drucken**.
- `cnc-opening.dxf`: Durchbruch, 55,2 × 14,56 mm, R2.
- `cnc-rebate.dxf`: äußere Glasfalz, 59,2 × 18,56 mm, R2, **3 mm tief**.
- `cnc-glass.dxf`: vorgeschlagene Scheibe, 58,8 × 18,16 × 3 mm, R1,8.
- `overview.png`: mit Platine / nur Halter; `height-side.png`: gerader Höhenschnitt.
- `top-board.png`, `exploded.png`, `seated-inside.png`, `outside.png`: Zusatzansichten.

Koordinaten in **mm**, Ursprung linke untere PCB-Ecke; +x rechts, +y hinten,
+z außen. Der vollständige Deckel reicht x=−99,6…150,4 / y=−149,64…30,36.
DXF sind **Nennkonturen, keine Werkzeugbahnen und kein G-Code**.

## CNC: ausschließlich von außen

Eine Aufspannung, zuerst Falz, dann Durchbruch; **kein Wenden, keine Innentasche**.
Maximal Ø4-mm-Fräser wegen R2, CAM-Werkzeugkompensation/Zustellungen und sichere
Werkstückhaltung separat festlegen. Tatsächliche Plattenstärke prüfen.
Holzbefestigung von innen per 3 × 12-mm-Senkkopf-Holzschrauben; deren begrenzte
Pilotbohrungen sind Handarbeit von innen, **keine Durchgangslöcher im Deckel**
und nicht in den Außen-CNC-Dateien enthalten.

Vier kurze Eckführungen (2,4-mm-Eckbereiche, 1,5-mm-Wand) greifen 4,5 mm in den Durchbruch, 0,20 mm Spiel pro
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

- Zwei vorgeschlagene **M2 × 16-mm-Schrauben mit reduziertem Kopf**,
  **Kopf maximal Ø3,0 / 2 mm hoch**, keine breiten Unterlegscheiben.
  **Übliche Ø3,8-mm-Köpfe sind nicht freigegeben:** sie passen nur nominal
  zentriert und kollidieren in der ergänzten Toleranzprüfung. Der konkrete
  Schraubentyp mit diesem kleinen Kopf muss noch beschafft/verifiziert werden;
  keine Verfügbarkeit eines bestimmten Normartikels behauptet. Der neue Test
  reserviert 0,2 mm radialen Schraubenversatz und vergrößert die LED-/SMD-
  XY-Hüllen je Seite um 0,1 mm. Das ist ein angenommener Prüfspielraum, keine
  Hersteller-Toleranzangabe. Reale Kopfform und Bauteilposition prüfen.
- Zwei **M2-Sechskantmuttern**, nominal SW4 / Höhe 1,6; rückseitige Taschen
  SW4,2 / Tiefe 3,0. Passung kalibrieren, Muttern vor dem Verschrauben von
  unten einlegen/festhalten. Verdrehsicherung, **keine selbsthaltenden Clips**.
  Dieses M2-Material ist nicht als vorhanden/bestellt inventarisiert.
- Schraubenspitze rechnerisch z=0,5, Mutter z=1,4…3,0: nominal 0,9 mm
  Überstand unter der Mutter. Die tiefer von hinten ausgeführte Tasche setzt
  die Mutter näher an die PCB und schafft Reserve, ohne längere Schraube.
  Prüfannahmen: Schraubenlänge −0,2; PCB-Dicke +0,15; unvollständiges
  Spitzengewinde 0,3; Muttersitz −0,2; Mutterhöhe −0,1 mm. Damit mindestens
  1,5 mm Eingriff bei Prüfziel 1,2 mm. Das sind keine gemessenen Toleranzen.
  Tatsächliche Maße und tragende Gewindegänge prüfen; nicht stärker anziehen,
  um eine zu kurze Schraube zu kompensieren.
- Zwei zusätzliche flache Kunststoffstützen vorne unter der PCB; keine
  Pfosten auf LED-Bauteile. Unterseiten-Lotfreiheit real abgleichen.
- Die vorhandenen **M2,5-ruthex passen nicht durch Ø2,2**. Kein Aufbohren/Erzwingen.

Holzlaschen 3,5 mm, Bohrung Ø3,2, Senkung Ø6,2 / 90° von innen. 3×12-mm-
Holzschrauben greifen nominal 8,5 mm in 12-mm-Pappel; 3,5 mm Restholz.
Kopfmaß/Halt und begrenzte Vorbohrtiefe am Reststück prüfen, von Hand anziehen.

## Kabel und Montagefolge

Direkt angelötete Leitungen **links heraus**, mit kurzem links/abwärts führendem
Übergang im Durchbruch und dann unter dem Holz gerade nach links. **Keine lange
senkrechte Kabelschleife**, kein JST-/Steckerraum. Vollständig waagerecht auf
PCB-Höhe bis ins Holz geht bei unveränderter Tiefe nicht; deshalb nur dieser
kurze Übergang innerhalb des vorhandenen schmalen Durchbruchs. Keine zusätzliche
CNC-Kabelausbuchtung. Darstellung ist eine Route, keine neue elektrische Pinbelegung.
DOUT bleibt laut bestehendem Verkabelungsplan offen. Elko/330-Ω-Widerstand und
Schrumpfschlauch nicht in den 3-mm-Lichtspalt legen; eigene Halterung/Isolierung
im Innenraum vorsehen, keine Zuglast auf die Lötpads.

Digitale Kabelhülle: drei quadratische 1,9-mm-Hüllen, je entlang
(1,397;y;14,05) → (−0,9;y;9,5) → (−12;y;9,5), y=1,27 / 3,81 / 6,35.
Die runden Vorschauleitungen Ø1,5 liegen vollständig darin; keine vorhandenen
Drahtdurchmesser behauptet. **Keine Dupont-/Steckerfreigabe.** Größere Stecker
verlangen eine andere Hüllenprüfung. Kleines erhöhtes Kabelbinderpad links,
Oberseite z=8,5, zwei quer zur Kabelrichtung nutzbare Schlitze;
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
12 Solid-Fälle einschließlich **importierter Druck-STL** gegen Holz, PCB,
Kabelhüllen, Rückwand und Glas; Schraubenköpfe nominal und mit angenommenem
Versatz-/Bauteiltoleranzraum separat gegen LEDs/SMD geprüft.
Absichtliche 0,5-mm-Seitversätze/Über-Einsetzen erzeugen erkannte Kollisionen.
Gerader Einsetzweg in 21 Einzelpositionen z=−20…0 mm geprüft, **kein lückenloser
Bewegungsbeweis**. Jede Position hat eine eigene Solid-Schnittmenge und eigenes
Log. Die mathematisch gleichwertige gemeinsame Union lief im kompakten Modell
zweimal in ein 300-s-Zeitlimit; die getrennten Positionen ersetzen diese
aufwendige Union, nicht die Prüfung. Konservative Boxhüllen statt vieler
Kugel-Facetten halten die Kabelprüfung einfach.
0,001-mm-Prüfrückzug vermeidet reine Nullstärken-Kontaktflächen in CGAL.
Rohlogs unter `logs/`. Vorschauen tatsächlich gerendert und angesehen.

**Vor Fertigung offen:** Modulabgleich (Nutzer übernimmt vor Druck), reale
Schrauben/Muttern, Holz-/Glasstärke, Passungs-/Lastprobe, sichere Scheibenfixierung,
Stecker-/Löthüllen und Lichtwirkung. Digital PASS ist keine Fertigungs- oder
Kindersicherheitsfreigabe.
