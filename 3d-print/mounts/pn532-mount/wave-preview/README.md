# Wellenfalz — erster PN532-Formvorschlag

**Inzwischen vom Nutzer bestätigt und auf alle drei aktiven Fensterkonturen
übertragen.** Dieser Ordner bewahrt die erste Vorschau, nicht den aktuellen
Fertigungsstatus. Aktuell: `../../common/README.md`, je Modul aktive
`cnc-rebate.dxf` / `cnc-glass.dxf`, Übersicht `../../wellenfalz-uebersicht.png`.
Die nachfolgenden Hinweise „unverändert“ beschreiben nur den Vorschauzeitpunkt.

Nutzerauftrag: später **alle drei Fenster** (PN532, NeoPixel, Feather/TFT)
mit gewelltem Außenfalz; zunächst **nur eines als Vorschau** zeigen.
10 mm ist der Abstand vom Durchbruchrand zum äußersten Wellenberg,
nicht von einer Schraublochmitte. Formfreigabe anschließend im Chat erteilt.

- Originaldurchbruch unverändert: 47,5 × 45,2 mm, R2.
- Acht breite, umlaufende Wellen; Abstand zum Lochrand 4–10 mm.
  Die 4-mm-Täler sind ein Entwurfsvorschlag, keine zusätzliche Nutzervorgabe.
- Hüllmaß des Falzes: 67,5 × 65,2 mm; Tiefe weiterhin 3 mm.
- `top.png`: bemaßte Draufsicht ohne Scheibe.
- `perspective.png`: tatsächliche OpenSCAD-Vorschau des offenen Falzes.
- `preview.scad`: separates Holz-Prüfstück, kein vollständiger Deckel.
  `show_glass=true` zeigt eine passende gewellte Scheibe, nominal 0,2 mm
  Konturspiel als echter Innenoffset; Scheibenfixierung ungeprüft.
- `generate.py`: erzeugt Konturpunkte, Draufsicht und `checks.txt`.
  Python 3 + Pillow erforderlich. Keine externen Quellen/Maße neu eingeführt;
  Durchbruch aus der aktuellen `../geometry.scad` gelesen.

Die Abstände wurden analytisch gegen den ursprünglichen abgerundeten
Durchbruch an 1.600 Konturpunkten geprüft: min.4 / max.10 mm.
**Keine Fertigungsfreigabe:** Fräserradius/CAM, reale Passung,
Schrauben-/Senkungspositionen und sichere Glasfixierung sind noch zu prüfen.
Die vergrößerten Falze benötigen mehr Fläche im Nutzerlayout; insbesondere
PN532-Randlage rechts/unten vor Fertigung abgleichen. Keine ungeprüfte
Übernahme der bisherigen schmalen Falzfreigängigkeit.

Bestehende CNC-DXF, STL, Halter und andere Fenster wurden nicht verändert.
Nach Formbestätigung gemeinsame Falz-/Scheibenkonturen der Fenster umsetzen
und die dazugehörigen Prüfungen/Unterlagen erneuern.

Reproduktion:

```sh
python3 generate.py
# OpenSCAD mit funktionierendem Software-GL/Xvfb wie im übergeordneten render.sh:
openscad --hardwarnings --preview --imgsize=1400,1100 --colorscheme=Tomorrow \
  --projection=o --camera=21,20,5,48,0,28,230 \
  -o perspective.png preview.scad
```

`render.log` gehört ausschließlich zu diesem Vorschau-Render, nicht zu
Mesh-/Fit-Prüfungen der bestehenden Halter.
