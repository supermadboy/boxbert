# CNC-Positionierungsblatt

Nutzerauftrag: alle drei vorhandenen Wellenfenster auf einem bemaßten Bild
für die Übergabe an den CNC-Betrieb darstellen. PNG für den Chat, PDF für die
Weitergabe ohne Fotokompression. Keine neue Kontur und kein G-Code.

## Lage (Außenansichten, alle Angaben in mm)

- Deckel 250 × 180: NeoPixel waagerecht entlang der 250-mm-Kante, mittig
  (Mitte bei 125), äußerste Falzkontur 5 von hinten. Ausrichtung im Chat bestätigt.
- PN532 oben rechts: äußerste Falzkontur jeweils 5 von hinten und rechts.
  Kontur und Halter gemeinsam 90° gegen Uhrzeigersinn gegenüber der lokalen
  Foto-/DXF-Orientierung drehen, wie in der bisherigen Übergabe festgelegt.
- ESP/TFT vorne rechts: äußerste Falzkontur 5 von rechts und 10 von unten
  (Inlay). Orientierung wie aktive DXF. Frontformat 250 × 110 aus bestehendem
  CAD, nicht neu am Werkstück gemessen; Zuschnitt prüfen. Die Lage von rechts
  und unten bleibt auch bei anderer realer Plattenhöhe die Nutzervorgabe.
- Falze 3 tief von außen, Holz nominal 12. Alle Abstände gelten zur äußersten
  Wellenkontur, nicht zum Durchbruch, Glas oder zur Platine.

`placement.json` enthält die aus den aktiven DXF berechneten Koordinaten.
Ursprung der jeweiligen Platte links unten, +X rechts, +Y oben. Transformation:
erst um den lokalen Ursprung drehen, dann verschieben. Die vorhandenen lokalen
`cnc-opening.dxf` / `cnc-rebate.dxf` bleiben unverändert und müssen im CAM
zusammen transformiert werden; keine Skalierung und keine unabhängige Zentrierung!
Hüllmaße im Bild dienen der Kontrolle, nicht als rechteckige Fräskontur.

## Prüfstatus und Grenzen

Das Generatorskript prüft Randabstände, NeoPixel-Mitte, vollständige Lage der
Falze innerhalb der nominalen Platten und die Nichtüberschneidung der beiden
Deckelfalze. Zwischen den Deckelfalzen verbleiben digital minimal 16,547 mm.
Es liest die tatsächlichen aktiven DXF. PNG visuell geprüft.

Keine vollständige Einbau-/CAM-/Fertigungsfreigabe: Buttons, Leisten,
Halter-/Steckerhüllen und Glasfixierung werden nicht neu geprüft. Die bekannten
Schraubenreserven unter PN532-/NeoPixel-Falz, NeoPixel-Kopffreiheit und manuelle
ESP-USB-Aussparung bleiben offen; siehe `../common/README.md`.
Keine neuen STL-Exporte oder Solid-/Slicerprüfungen in diesem Auftrag.

## Reproduktion

Python mit Pillow + Shapely wie in `../common/README.md` bereitstellen, dann:

```sh
python3 3d-print/mounts/common/placement_overview.py
```

Schreibt dieses PNG, PDF und `placement.json`. Das Bild ist keine
maßstäbliche Druckschablone; ausschließlich eingetragene Maße verwenden.
