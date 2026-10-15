# Feather-Fenster-Mount — Entwurf 09.10.2026

Eigenständiger Auftrag nach Nutzer-OK zur Z-Halter-Konzeptskizze.
**Digitaler Vorschlag, kein gedruckter/passungsgeprüfter Mount.**

## Einbau und Nutzerentscheidungen

- In der Draufsicht **vorne rechts**. Bisherige Vorderwand-Anordnung bleibt
  Grundlage: TFT zeigt nach vorne, nicht aus dem Deckel nach oben.
- USB-C-Ende zeigt zur **rechten Seitenwand**, Laden von der Seite gewünscht.
  Die Darstellung des einzelnen Mounts zeigt USB links; das ist die lokale
  CAD-Ansicht, nicht die Orientierung im Gehäuse. Bei Einbau entsprechend drehen.
- Montagevorgabe des Nutzers: Feather außerhalb der Holzbox am Druckträger
  befestigen, Dupont-Leitungen und nach bestandenem USB-Test den Akku anschließen,
  dann die vorbereitete Einheit einsetzen und von innen verschrauben.
  Dupont- und Akku-Stecker müssen nur vor dem Einsetzen erreichbar sein;
  im eingebauten Zustand ist kein Steck-/Handzugang erforderlich. Zur Wartung
  wird die gesamte Einheit wieder abgeschraubt. Die eingesteckten Stecker und
  Leitungen brauchen trotzdem kollisionsfreien Bauraum ohne Quetschung und Zug.
- Von außen bündige Plexiglasscheibe in gefräster Falz. Elektronik von innen
  komplett vorbereitet einsetzen, Holzlaschen neben dem Fenster verschrauben.
- Zwei seitliche Z-Laschen und ein offener Träger wurden als Konzept positiv
  bewertet und dessen CAD-Umsetzung beauftragt. Diese Geometrie ist bewusst ein
  Fenster-Mount, nicht die allgemeine Boden-Mount-Vorlage.

## Dateien

- `feather_window_mount.scad`: parametrisierbare Quelle.
- `feather_window_mount.stl`: **nur der gedruckte Mount**.
- `iso.png`, `top.png`: ohne Platine.
- `iso-board.png`, `top-board.png`, `side-board.png`: transparente Platine,
  vereinfachte Komponenten. Keine echte bestückte STEP-Geometrie.
- `connections.png`: Innenansicht; rote transparente Kästen sind reservierte,
  **angenommene** USB-/JST-Räume, keine gemessenen Stecker.
- `installation.png`: Seitenansicht mit einem schmalen Schnitt durch
  illustrative Holzfront und Glas. Keine Frässchablone.
- `render.sh`, `check_mesh.py`, `logs/`: reproduzierbare technische Prüfung.

## Herstellergeometrie statt Standard-Feather-Annahmen

Original-Adafruit-Eagle-Datei frisch geladen und maschinell ausgewertet:
PCB **50,8 × 22,86 mm**, vier gerundete Ecken **R2,54**.
Koordinaten bezogen auf linke untere PCB-Bounding-Box-Ecke, USB bei x≈0:

| Position | Lochzentrum x/y [mm] | Original-Bohrwert | Nutzung |
|---|---|---|---|
| USB unten | 2,54 / 2,54 | Ø 2,5 mm, plated Package | M2,5-Schraubpfosten |
| USB oben | 2,54 / 20,32 | Ø 2,5 mm, plated Package | M2,5-Schraubpfosten |
| Gegenende unten | 48,26 / 1,8415 | Ø 2,2 mm | flache Stütze, keine M2,5-Schraube |
| Gegenende oben | 48,26 / 20,955 | Ø 2,2 mm | flache Stütze, keine M2,5-Schraube |

**Nicht vier gleich große Standardlöcher!** Kein Aufbohren, kein Erzwingen.
Auch die zwei plated Ø2,5-Löcher am echten Board mit konkreter M2,5-Schraube
kraftfrei prüfen; ein CAD-Bohrwert garantiert die fertige Lochpassung nicht.

Display-Footprint laut Eagle: x=11,291…42,291, y=2,503…20,103 mm,
auf gespiegelter Displayseite (`MR270`). D0/D1/D2 liegen ebenfalls auf
Displayseite, nicht gemeinsam mit USB auf Elektronikseite. Glas verdeckt diese
Taster; hier ist keine Bedienung durch die Scheibe geplant. Reset auf
Elektronikseite zugänglich halten; BOOT bei Wartung gegebenenfalls durch
Ausbau erreichen.

Quellen:
- [Adafruit Downloads / Eagle + CAD](https://learn.adafruit.com/esp32-s3-reverse-tft-feather/downloads)
- [Original-PCB](https://github.com/adafruit/Adafruit-ESP32-S3-Reverse-TFT-Feather-PCB)
- [Original CAD und Foto](https://github.com/adafruit/Adafruit_CAD_Parts/tree/main/5691%20Feather%20ESP32%20S3%20Reverse%20TFT)
- [Elektronikseitenfoto](https://cdn-shop.adafruit.com/970x728/5691-03.jpg)
- [ruthex Einbauzeichnung](https://cdn.shopify.com/s/files/1/0567/7019/9760/files/1Tabelle.PT05_eb2a30fa-5c34-46f8-b557-a6c432354560.jpg?v=1748341911)

Gesicherte Downloads, Dateilisten, Extraktor und Fakten:
`docs/cad/feather-window/`. STEP wurde gesichert, aber **nicht** als
geprüfte 3D-Kollisionsgeometrie ausgewertet. Foto belegt keine Nutzer-Lot-/Kabelhöhe.

## Konstruktion / veränderbare Entwurfsmaße

Aktuelle STL-Hülle **62 × 70,86 × 14 mm**, lokale Bounds
x=−5,6…56,4, y=−24…46,86, z=0…14. z zeigt zur Außenseite.

- Offener Gitterrahmen: 2 mm dick, 4-mm-Zellen / 2-mm-Rippen;
  große zusätzliche mittige Öffnung für Elektronikzugang.
- PCB-Elektronikfläche z=14. Zwei Ø4,6-Schraubhälse, zwei Ø3,2-Stützen.
  Breiter Ø8,2-Einsatzbereich endet bei z=8: 6 mm Abstand zur Platine.
- Zwei ruthex RX-M2,5×5,7 **von hinten/Unterseite** einschmelzen,
  Unterkante 0,2 mm zurückgesetzt. Einbauloch Ø4,0; 6,7 mm tief ab
  Einsatzbeginn; 1,8 mm Wand um maximalen Einsatz-Ø4,6.
  Diese Unterseiten-Einsatzmontage ist Teil des neuen Vorschlags, keine
  bereits physisch freigegebene Einbaumethode.
- Kleine lokale Dreiecksverstärkungen an den 90°-Stufen. Keine Wanne,
  umlaufenden Wände oder PCB-Klemmung am Display.
- Holzlaschen 3,5 mm dick, Holz-Kontaktfläche z=12. Ø3,2-Durchgang,
  Ø6,2/90°-Senkung **von innen**, also auf der dem Holz abgewandten Fläche.
  Unter der Senkung 2 mm Material. Zwei Schrauben als Vorschlag.
- 3×12-mm-Holzschraube: nominal 8,5 mm Holzeingriff / 3,5 mm Reserve bei
  voller 12-mm-Holzstärke und passend bündigem Kopf. Keine reale Freigabe.
- Zwei Kabelbinder-Schlitze 1,6×4 mm im lokalen Pad auf der hinteren
  Trägerebene. Zugentlastung nur mit geeignetem kleinen Binder,
  ohne Quetschen/enge Kabelbiegung; nicht über LiPo-Pouch führen.

**Nicht gemessene Höhen / keine Fertigungsmaße:** PCB-Dicke 1,6 mm,
Displayhöhe 2,2 mm, Plexiglas 3 mm, Pinüberstand 3,4 mm, Lotradius 1,1 mm.
Die illustrative Fensteröffnung 64,8×40,86 und Falz sind nur Anzeigeannahmen.
Bei dieser angenommenen Schichtung: Platine 2 mm vor Holzinnenseite,
Display 3,2 mm hinter Glas. Wirkliche Schichtung vor Fräsen und Druck einstellen!

## USB und Akku — was jetzt frei ist, was noch zu prüfen ist

Die Laschen liegen an den Längsseiten, **nicht vor dem USB-Ende**.
Das große Mittel-Fenster bleibt offen; JST nicht unter einer Druckwand.
Reservierte Beispiel-Räume relativ zum lokalen CAD:

- USB: x=−23…2, y=5,43…17,43, z=9,5…15,5.
- JST/Kabel: x=5,8…15,8, y=10,8…30,8, z=5…13.

125 Innenpunkte je Raum wurden gegen die tatsächliche STL geprüft. Das ist
kein vollständiger Solid-Solid-Kollisionsnachweis und **keine Garantie für
unbekannte Stecker, angelötete Header oder reale Biegeradien**.

USB-Seitenöffnung und der Abstand Feather→rechte Seitenwand sind noch offen.
Bei direktem Einstecken muss auch der USB-Stecker-Kunststoffkörper durch die
12-mm-Wand bzw. in eine passende innere Tasche passen. Nicht einfach nur eine
kleine USB-C-Lochkontur fräsen. Alternative wäre eine geeignete, noch nicht
festgelegte Panel-Verlängerung. Der Mount entscheidet keine Beschaffung.
Kabel beim Herausnehmen nicht ziehen; Außen-Ladekabel zuerst abstecken.

Akku bleibt am separaten Akkuhalter, nicht an diesem Mount. Nicht am JST
ziehen; Polung prüfen, Akku für mechanische Arbeiten abziehen und erst nach
USB-Prüfung wieder anschließen. Ladekabel/USB-Port dürfen beim Spielen keine
Stoßlast auf die Boardbuchse übertragen. TFT-Orientierung erst in der finalen
Firmware passend zur mechanischen Drehung setzen; hier keine Firmwareänderung.

## Prüfung, Druck und Abnahme

```bash
python docs/cad/feather-window/verify_source.py
bash 3d-print/mounts/feather-window-mount/render.sh
```

OpenSCAD 2026.09.18, CGAL, hardwarnings, binäre STL, offscreen-Vorschauen.
Tatsächliche STL: geschlossen, konsistent orientiert, eine zusammenhängende
Oberfläche, keine degenerierten Dreiecke; Bounds, Holzloch/Senkrichtung,
Einsatzkammern, Stützen und freie Räume geprüft. Alle sieben aktuellen
Vorschauen persönlich durch den Agenten angesehen.

**Offen:** Sichtentscheidung zu konkreter Form, Druck-/Heat-Set-/Lasttest,
reale Platinen- und Kopfpassung, lot-/header-/USB-/JST-Freiraum,
Schraubenlängen, Holzhalteprobe, Fenster-/Falzmaße, Plexiglasfixierung,
USB-Seitenzugang und Kindersicherheitsbewertung.

FDM-Ausgangsidee: PETG, zunächst Probestück für Heat-Set. Keine universellen
Druckparameter freigegeben. Die erhöhten Laschen erzeugen Überhänge:
Slicer-Support und Druckorientierung prüfen; STL-Z=0 ist Konstruktionsebene,
keine Aussage „druckt supportfrei“. Einschmelzen außerhalb der montierten
Elektronik, Binder-/Schraubenkanten entgraten. PCB-Schrauben von Displayseite
vor Einbau ins Fenster setzen; Schrauben dürfen keine Bauteile oder das Glas
berühren. Zwei rechte Stützen verhindern nicht das Abheben bei Zug:
Biegung/Schock und USB-Stecklasten real prüfen, nicht mit Kabeln abfangen.
