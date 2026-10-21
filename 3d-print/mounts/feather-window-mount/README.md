# Feather-Fenster — aktuelle Außenfräs-Version

**Stand 15.10.2026, nach Nutzerkorrektur. Diese Version ersetzt den Entwurf mit
4-mm-Innentasche. Noch keine physische Fertigungs-/Passungsfreigabe.**

## Wellenfalz — aktuelle CNC-Konturen nach Formbestätigung

Zehn Wellen, **4–10 mm Abstand zum tatsächlichen Durchbruch einschließlich
JST-Auslass**, weiterhin3 mm tief. Passende gewellte Scheibe mit0,2 mm
Konturspiel. Druck-STL und Durchbruch unverändert (SHA-256 geprüft).
Ansichten `wave-top.png`, `wave-iso.png`, `../wellenfalz-uebersicht.png`.
Reproduktion `bash ../common/render_waves.sh`; unabhängige DXF-/Volumenprüfung
in `logs/wave-cnc-check.log`, Restpunkte in `../common/README.md`.

## Verbindliche Vorgaben

- CNC **ausschließlich von außen**: Durchbruch und anschließend äußere Glasfalz.
  Kein Wenden, keine Innentasche, keine heimlich vorausgesetzten Innenkanäle.
- Der Druckträger richtet sich direkt im Durchbruch aus; Laschen liegen an der
  Holzinnenseite an und bilden den Tiefenanschlag. Schrauben klemmen nur fest.
- Feather außerhalb befestigen, Dupont und nach bestandenem USB-Test Akku
  anschließen, dann komplette Einheit von innen einsetzen und von Hand befestigen.
  Eingebaut ist kein Steckzugang nötig; für Änderungen Einheit wieder ausbauen.
- Zielabstand TFT→Plexiglas **nominal 2 mm**. Reale Bauteilhöhen noch messen.

## Aktuelle Dateien / Sollmaße

`window_geometry.scad` ist die gemeinsame Maßquelle für:

- `feather_window_mount.scad`: Druckträger; STL enthält nur Kunststoff.
- `front_cnc.scad`: 250×110×12-mm-Front, Durchbruch und äußere Glasfalz.
- `assembly.scad`: Einbau-, Schnitt- und Explosionsansichten, kein Druckteil.

| Kontur | Sollmaß |
|---|---|
| Führungsrechteck / Grunddurchbruch | 64,8×36,86 mm, R3 |
| Zusatz am Durchbruch | JST-Kabelausbuchtung x=4,8…16,8 / y=27…32, R2 |
| Äußere Glasfalz | Wellenkontur, Hüllmaß84,8×58,995 mm,3 mm tief |
| Plexiglas-Vorschlag | Gewellt, Hüllmaß84,4×58,595×3 mm |
| Passspiel | 0,20 mm je Seite, real kalibrieren |
| Eingriff der vier Eckführungen | 4,5 mm ab Holzinnenseite |

Die Glasfläche ist größer als beim früheren Entwurf, weil der größere
Durchbruch jetzt zugleich Führung ist und die Kabelausbuchtung abdecken muss.
Fräser maximal Ø4 mm wegen R2 am JST-Auslass. CAM bleibt erforderlich:
Werkzeugradius, Zustellungen, Werkstückhaltung und sichere Ausbruchstrategie.
DXF sind **Nennkonturen in mm, kein G-Code**. Sinnvoll in einer Außenaufspannung
zuerst Falz und dann Durchbruch fräsen, damit das Werkstück möglichst lange
vollflächig gehalten bleibt. Beide Operationen bleiben auf derselben Seite.

Aktive Exporte: `cnc-opening.dxf`, `cnc-rebate.dxf`, `cnc-glass.dxf`.
Die alte `cnc-pocket.dxf` liegt nur noch unter `archive/two-sided-superseded/`
und darf **nicht** zur Fertigung verwendet werden. Frühere Prüflogs/Protokolle
beschreiben teils noch die verworfene Innenbearbeitung; maßgeblich ist diese
README zusammen mit den aktuellen SCAD-Dateien und `logs/fit-check.log`.

## Höhen einfach erklärt

Alle Werte lokal; +z zeigt nach außen. Die Basis liegt bei z=0:

| Fläche | z [mm] | relativ zur Holzinnenseite |
|---|---:|---:|
| Laschen-Auflage / Holzinnenseite | 22 | 0 |
| PCB-Elektronikseite / Auflage | 25,2 | +3,2 |
| Führungsspitzen | 26,5 | +4,5 |
| PCB-Displayseite, angenommene Dicke 1,6 | 26,8 | +4,8 |
| TFT-Front, angenommene Höhe 2,2 | 29 | +7 |
| Plexiglas-Unterseite | 31 | +9 |
| Holz-/Glas-Außenfläche | 34 | +12 |

Also: **Laschen niedriger als Platinenauflage und Führung.** Sie stoppen den
Träger am Holz, nicht am Glas oder Display. Zwischen TFT und Glas bleiben
rechnerisch 2 mm. `height-side.png` zeigt die gerade Seitenansicht.

## Stecker, USB und offene Freigaben

Dupont-Hülle im CAD: **2,6×2,6×14 mm** je Pinposition; keine Nutzer-Messung.
JST/Kabelraum: 10×20×8 mm, ebenfalls Annahme. Die tatsächliche Steck-/Headerhöhe
inklusive Kabelabgang messen. Kabel dürfen weder geklemmt noch als Halterung
verwendet werden. Kabelbinder-Pad am Träger erhalten, kein Heißkleber nötig.
Akku bleibt im separaten Halter; Polung prüfen, keine Zuglast auf JST.

**USB-Aussparung fertigt Daddelbert ausdrücklich von Hand.** Sie ist nicht
Teil des CNC-Modells. Ohne diesen manuellen Schritt schneidet die angenommene
lange USB-Steckerhülle noch Front-Holz; das bleibt als `KNOWN-LIMIT-side-usb`
im Test sichtbar, nicht als automatisch freigefräst kaschiert. Beim manuellen
Ausarbeiten mit dem echten Stecker prüfen: Körper, Einstecktiefe, Kabelabgang
und gerader Ein-/Ausbauweg des Trägers. Nicht nur die Metallkontur freimachen.

Glasfixierung ebenfalls noch festlegen. Der Falz allein verhindert kein
Herausfallen. Reale TFT-/Taster-/Schraubenkopfhöhen und Glasdurchbiegung prüfen.
Auf Displayseite sitzen D0/D1/D2 sowie **SW4/RESET** bei (44,45/11,43),
laut Original-Eagle `MR270` und RESET-Netz. SW2/RESET auf Elektronikseite.
Die vereinfachte Vorschau stellt Taster nicht dar. Keine Dauerbetätigung von
BOOT/RESET zulassen; die Führung darf nicht an Bauteilen tragen.

## Board, Schrauben, Druck

Original-Eagle-Board: 50,8×22,86 mm, R2,54. Löcher ab PCB-Ecke, USB bei x≈0:
(2,54/2,54) und (2,54/20,32): Ø2,5 plated, Schraubpfosten.
(48,26/1,8415) und (48,26/20,955): Ø2,2, **nur flache Stützen**.
Kein Aufbohren/Erzwingen von M2,5. TFT-Footprint x=11,291…42,291,
y=2,503…20,103. Originaldaten/Extraktor in `docs/cad/feather-window/`.
STEP gesichert, nicht als vollständiges bestücktes Kollisionsmodell geprüft.

Zwei Holzlaschen 3,5 mm, Ø3,2-Durchgang und Ø6,2/90°-Senkung von innen.
3×12-mm-Holzschrauben: nominal 8,5 mm Eingriff, 3,5 mm Restholz bei 12 mm.
Schraubzentren lokal (25,4/−17) und (25,4/39,86); außerhalb des Falzes.
Vorbohrung begrenzen, Kopfpassung und Halt in Pappel am Reststück prüfen.

Zwei ruthex RX-M2,5×5,7 von hinten, 0,2 mm zurückgesetzt. Ø4,0-Einbauloch,
Tiefe 6,7 mm, 1,8 mm Wand um maximalen Einsatz-Ø4,6. Zwei Ø4,6-Hälse und
zwei Ø3,2-Stützen. Beispiel **M2,5×25** bei 1,6-mm-PCB: Kopfauflage z=26,8,
Spitze z=1,8, nominell 4,1 mm Einsatz-Eingriff. Keine Freigabe ohne reale
Maß-/Gewinde-/Kopfprüfung. PCB vor Einsetzen von der Displayseite verschrauben.

STL-Hülle 64,4×70,86×26,5 mm. PETG als Ausgangsidee; lange Pfosten und
Eckführungen auf Steifigkeit und Schichthaftung prüfen. Erhöhte Holzlaschen
brauchen eine geeignete Druckorientierung/Support; nicht supportfrei zugesagt.
Heat-Set- und Führungspassprobe zuerst, Einsätze ohne Elektronik einschmelzen.
USB-Stecklast und Schock dürfen nicht nur durch PCB-Biegung gehalten werden.

## Reproduktion und Referenz für die nächsten Mounts

```bash
python3 docs/cad/feather-window/verify_source.py
bash 3d-print/mounts/feather-window-mount/render.sh
```

OpenSCAD 2021.01/CGAL, Xvfb, Mesa 26.1.5 und shellcheck aus gepinntem nixpkgs
0954f7ee2f6bb3dc7d4e3d0d8bcb8fd4bde4cfc5. Kein Root/kein Flake-Update.
Mesa-Library- und DRI-Pfade müssen **vor Xvfb** gesetzt sein, sonst
`glXChooseFBConfig failed`. `render.sh` stellt nur seine Prozessumgebung ein.

Aktuelle Mesh-, DXF- und Schnittmengenprüfungen haben eigene Logs. Sollposition
mit 0,001-mm-Rücksetzung vermeidet Nullstärkenflächen in altem CGAL. Seitlich
verschobene/zu tief gesetzte Modelle sind absichtliche Kollisions-Gegenproben.
Die bekannte USB-Kollision wird separat offen ausgewiesen. Höhen sind Annahmen,
keine physische Abnahme. Alte Erfolgsausgaben nicht für neue Module übernehmen.

Für **NeoPixel-Stick NEOPS8** und **PN532-MOD im Deckel**:
`docs/mounts-weiterarbeit.md` lesen. Dieses Fenster dient als Referenz für
Außenbearbeitung, gemeinsame CNC-/Druckmaße, Passführung, Anschlag, Vormontage
und klare Höhenbilder. Keine Feather-Lochbilder, 2-mm-Optikabstände oder
Steckermaße ungeprüft auf andere Module übertragen. Allgemeine flache
Boden-Mounts orientieren sich weiterhin am Step-Up-Mount.

Quellen: [Adafruit Downloads](https://learn.adafruit.com/esp32-s3-reverse-tft-feather/downloads),
[Original-PCB](https://github.com/adafruit/Adafruit-ESP32-S3-Reverse-TFT-Feather-PCB),
[ruthex-Zeichnung](https://cdn.shopify.com/s/files/1/0567/7019/9760/files/1Tabelle.PT05_eb2a30fa-5c34-46f8-b557-a6c432354560.jpg?v=1748341911).
