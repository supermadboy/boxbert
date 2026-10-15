# Feather-Fenster: passgeführter Druckträger + CNC-Front

## Aktueller Vorschlag — 15.10.2026

**Nutzerauftrag:** Noch nichts gefräst oder gebaut. Tasche und Druckteil dürfen
zusammen neu ausgelegt werden. Träger außerhalb der Box mit Feather, Dupont-
Leitungen und nach bestandenem USB-Test mit Akku vormontieren; komplett von innen
einsetzen, bis die Anschläge anliegen, dann von innen mit Handwerkzeug befestigen.
Eingebaut ist **kein Steck-/Handzugang** zu Dupont/JST nötig. Zur Wartung die
Einheit wieder abschrauben. Platz für Stecker, Kabel und spannungsfreies Einsetzen
bleibt erforderlich. Akku sitzt weiterhin im separaten Akkuhalter.

**Digitaler Entwurf, keine reale Druck-/Holz-/Passungs- oder Sicherheitsabnahme.**
Die neuen Passmaße sind gemeinsam konstruierte Sollmaße, keine Messwerte.

## Was geändert wurde

- Vier abgerundete Eckführungen greifen von innen **3 mm** in eine **4 mm**
  tiefe CNC-Tasche. Die langen Seiten bleiben zwischen den Ecken offen.
- **0,20 mm Spiel je Seite**, also 0,40 mm insgesamt. Keine Presspassung.
  Oben 0,4 mm Einführschräge über 0,6 mm Höhe.
- Die beiden Schraublaschen liegen voll auf der Holzinnenseite und bilden den
  **Tiefenanschlag**. Führungsspitzen bleiben 1 mm vor dem Taschenboden;
  die Schrauben halten fest, sie dienen nicht zur optischen Ausrichtung.
- Spiel erlaubt ein kleines Restverdrehen; „absolut spielfrei“ ist ohne realen
  Probedruck nicht zugesagt. `fit_clearance` nach Test in Restholz kalibrieren.
- Rückwärtiger Bauraum vergrößert: PCB-Elektronikfläche jetzt 24 mm über der
  Trägerbasis, Holzinnenseite bei 22 mm. **Die Platinen-/Displaylage zur Front
  bleibt unverändert.** Unter der Platine sind 16 mm bis zum breiten Einsatzkopf.
  Das berücksichtigt angenommene **2,6 × 2,6 × 14 mm Dupont-Steckerkörper**;
  die alte 3,4-mm-Pinhülle reichte hierfür nicht. Reale Header-/Steckbauhöhe messen.
- Bestehende Kabelbinder-Aufnahmen erhalten. Heißkleber ist nicht erforderlich
  und ersetzt keine Zugentlastung. Kabel mit Biegereserve nach innen führen.

## Dateien und Bedienung

Alles in diesem Ordner halten, damit die relativen SCAD-Verweise funktionieren:

- **`feather_window_mount.scad`**: druckbarer Träger, F6/STL nur das Kunststoffteil.
- **`front_cnc.scad`**: 250 × 110 × 12 mm Frontplatte mit Fenster, innerer
  Führungstasche und äußerer Glasfalz. Keine Eckverbindungen der Holzbox,
  keine Pilotbohrungen und keine USB-Öffnung in der separaten Seitenwand.
- **`window_geometry.scad`**: gemeinsame Schnittstellenmaße. Änderungen an Tasche,
  Spiel, Holz-/Glasdicke oder Schichtung hier, nicht getrennt in zwei Modellen.
- **`assembly.scad`**: Ansicht/Schnitt/Explosionszeichnung, kein Druckteil.
  `scene` auf `section`, `exploded`, `inside` oder `outside` setzen.
- `feather_window_mount.stl`, `front_cnc.stl`: echte Geometrie-Exporte.
- `cnc-pocket.dxf`, `cnc-opening.dxf`, `cnc-rebate.dxf`, `cnc-glass.dxf`:
  2D-Nennkonturen im **gleichen lokalen Koordinatensystem, Einheit mm**.
  Es sind Bauteilgrenzen, **keine Werkzeugmittelbahnen und kein G-Code**.
- PNGs: Träger, Platine, Anschlussräume, Schnitt, Explosionszeichnung,
  eingebaute Innenansicht und beide Frässeiten.
- `render.sh`, `check_mesh.py`, `check_fit.py`, `logs/`: Reproduktion/Prüfung.

### CNC-Maße

| Operation | Nennmaß / Radius | Tiefe |
|---|---|---|
| Frontrohteil | 250 × 110 mm | 12 mm Holz |
| Innen: Führungstasche | 64,8 × 36,86 mm, R3 | 4 mm ab Innenseite |
| Durchbruch | 54,8 × 26,86 mm, R3 | durchgehend |
| Außen: Glasfalz | 62,8 × 34,86 mm, R3 | 3 mm ab Außenseite |
| Plexiglas-Vorschlag | 62,4 × 34,46 mm, R2,8 | 3 mm Material |

Die rechteckigen Grundkonturen sind um die Platinenmitte zentriert. Die
4-mm-Innentasche hat zusätzlich einen zur USB-Seitenkante offenen Kanal
(lokal x=−25…−5 / y=4…19, R2) und eine JST-Kabelausbuchtung
(x=4,8…16,8 / y=27…32, R2). Diese sind in `cnc-pocket.dxf` bereits vereinigt;
die vier Pass-Ecken bleiben davon unberührt. Die Leitungen werden später nach
innen geführt, nicht zwischen Anschlag und Holz geklemmt. **Beidseitige
Bearbeitung** mit registrierter Wendeaufspannung; DXFs nicht unabhängig mit
beliebigem Nullpunkt importieren. CAM muss Fräserradius, Zustellung, Halterung,
Spiegelung beim Wenden und Durchbruchstrategie ergänzen. Für die R3-Innenecken
Fräser **höchstens Ø4 mm** wegen der R2-Anschlusskanäle. Tatsächliche Holzdicke zuerst messen.
Glasfixierung noch festlegen; die Falz allein sichert es nicht gegen Herausfallen.

Lokales System: USB links bei x≈0, +z nach außen; dies ist die **Innenansicht**
der Front. Die USB-Seite entspricht der rechten Boxseite. Frontunterkante
`y=-43,57`, USB-seitige Außenkante `x=-24`; Fenster-/PCB-Mitte liegt 49,4 mm
von dieser Seitenkante und auf halber Fronthöhe. Position ist ein Vorschlag.
Bei 12-mm-Seitenwand liegt deren innere Fläche bei x=-12; USB-Buchse x≈0:
Zugriff durch die Seitenwand muss separat mit dem echten Ladestecker ausgelegt
werden, inklusive Kunststoffkörper/Entlastung. Nicht bloß USB-C-Metallkontur fräsen.

Schichtung im SCAD: Trägerbasis z=0; Holzanschlag z=22; PCB-Unterseite z=24;
angenommene PCB-Oberseite z=25,6; Display bis z=27,8; Taschenboden z=26;
Glasunterseite z=31; Außenfläche z=34. Display-/Glasabstand nominal **3,2 mm**.
Die Fensteröffnung lässt die gesamte PCB-Kontur mit Rand frei; keine Klemme am TFT.

### Schrauben, Einsätze und Druck

- Holzlaschen: 3,5 mm dick, Durchgang Ø3,2, Ø6,2/90°-Senkung von innen.
  Zwei 3×12-mm-Holzschrauben; nominal 8,5 mm Holzeingriff, 3,5 mm Restholz.
  Kopfpassung, begrenztes Vorbohren und Halt im Pappel-Reststück prüfen.
  Die Schraubzentren liegen jeweils 10 mm außerhalb der inneren Tasche.
- Zwei ruthex RX-M2,5×5,7 **von hinten** einschmelzen, 0,2 mm zurückgesetzt.
  Ø4,0-Einbauloch, 6,7 mm tief; 1,8 mm Wand um max. Einsatz-Ø4,6.
- Zwei schmale Ø4,6-Schraubhälse und zwei Ø3,2-Stützen bis z=24. Gegenende
  wird weiterhin nur gestützt, nicht durch seine Ø2,2-Löcher verschraubt.
- **Alte PCB-Schraubenlängen gelten nicht mehr.** Beispiel mit 1,6-mm-PCB:
  M2,5×25 reicht von z=25,6 bis z=0,6, nominell 5,3 mm Eingriff in den Einsatz.
  Nur Rechenbeispiel: echte PCB-Dicke, Schraubenkopf, Gewindelänge, Bodenabstand
  und Kopf-/Display-/Glasfreiheit prüfen, keinesfalls auf Grund festziehen.
- Druckteil-Bounds x=−6,8…57,6, y=−24…46,86, z=0…25:
  **64,4 × 70,86 × 25 mm**. Führungen und Hälse sind länger als zuvor;
  PETG als Ausgangsidee, Druckorientierung, Schichthaftung, Steifigkeit und
  Überhang-Support an den erhöhten Laschen im Slicer prüfen. Nicht supportfrei.
- Erst Heat-Set- und Führungspassung am Probestück, dann Vollteil. Einsätze ohne
  Elektronik einschmelzen. M2,5 durch die realen PCB-Löcher kraftfrei prüfen.
  PCB-Schrauben vor dem Einsetzen von der Displayseite montieren.

## Belegte Boardgeometrie / Quellen

Original-Adafruit-Eagle: **50,8 × 22,86 mm**, Ecken R2,54. USB bei x≈0:

| Lochzentrum x/y [mm] | Hersteller-Bohrwert | Verwendung |
|---|---|---|
| 2,54 / 2,54 | Ø2,5 plated | Schraubpfosten |
| 2,54 / 20,32 | Ø2,5 plated | Schraubpfosten |
| 48,26 / 1,8415 | Ø2,2 | flache Stütze |
| 48,26 / 20,955 | Ø2,2 | flache Stütze |

Display-Footprint x=11,291…42,291 / y=2,503…20,103, gespiegelte Displayseite.
D0/D1/D2 ebenfalls Displayseite; hinter Glas nicht bedienbar, so vorgesehen.
Reset/BOOT gegebenenfalls nach Ausbau erreichen. Hersteller-STEP gesichert,
aber nicht als vollständige bestückte Kollisionsgeometrie ausgewertet.

- [Adafruit Downloads](https://learn.adafruit.com/esp32-s3-reverse-tft-feather/downloads)
- [Original-PCB](https://github.com/adafruit/Adafruit-ESP32-S3-Reverse-TFT-Feather-PCB)
- [Original CAD](https://github.com/adafruit/Adafruit_CAD_Parts/tree/main/5691%20Feather%20ESP32%20S3%20Reverse%20TFT)
- [Elektronikseitenfoto](https://cdn-shop.adafruit.com/970x728/5691-03.jpg)
- [ruthex Zeichnung](https://cdn.shopify.com/s/files/1/0567/7019/9760/files/1Tabelle.PT05_eb2a30fa-5c34-46f8-b557-a6c432354560.jpg?v=1748341911)

Gesicherte Daten/Extraktor: `docs/cad/feather-window/`.

## Reproduktion und Prüfumfang

```bash
python3 docs/cad/feather-window/verify_source.py
bash 3d-print/mounts/feather-window-mount/render.sh
```

`render.sh` lädt bei Bedarf OpenSCAD 2021.01, xvfb-run und shellcheck aus
gepinntem nixpkgs `0954f7ee2f6bb3dc7d4e3d0d8bcb8fd4bde4cfc5`, ohne Root und
ohne Änderung an `flake.lock`. Xvfb + Mesa 26.1.5 (Software-OpenGL) für echte PNGs;
`QT_QPA_PLATFORM=offscreen` allein funktionierte auf diesem Server nicht.
Auch Xvfb ohne Mesa-Pfade meldete `glXChooseFBConfig failed`. Mesa-Library- und
DRI-Pfade müssen **vor** dem Xvfb-Start für Server und Client gesetzt sein;
`render.sh` erledigt dies nur in seiner eigenen Prozessumgebung.
CGAL ist in dieser Version der Standard; `--backend=CGAL` entfällt.

Mesh-Test prüft reale STL: geschlossene/konsistent orientierte zusammenhängende
Oberfläche, keine degenerierten Dreiecke, Bounds, Schraublöcher, Einsätze und
Führungen. CGAL-Schnittmengen prüfen Träger/Holz, PCB und angenommene Stecker-
hüllen. Absichtlich um 0,5 mm verschobene bzw. zu tief gesetzte Modelle müssen
Kollisionen auslösen. Für die nominale Holzprüfung wird der Träger 0,001 mm
zurückgesetzt, um reine Nullstärken-Kontaktflächen des alten CGAL auszuschließen.
Das ist eine digitale Kollisionsprüfung, kein Nachweis realer Steckermontage.
Der gerade Einsetzweg ist geometrisch frei: alle Trägerteile über der Holz-
innenseite liegen in der zur Innenseite offenen Tasche; der Rest bleibt dahinter.
Kabel und der separate Akku sind nicht als verformbare Körper simuliert.

**Physisch offen:** Passspiel/Restverdrehung, tatsächliche Stecker- und Headerhöhe,
Kabelbiegung/Zugentlastung, TFT-/Taster-/Kopf-Höhen, Glasfixierung, lange Pfosten
unter Stoß-/USB-Last, Heat-Set, Schrauben-/Holzhalteprobe und Seiten-USB-Zugang.
Keine Bau-/Kindersicherheitsfreigabe. Akku-Polung prüfen, mechanisch spannungsfrei
arbeiten; keine Zuglast auf JST/USB, keine Schraubspitze außen.
