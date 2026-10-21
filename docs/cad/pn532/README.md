# PN532 — Entwurfsbasis und Quellen

Stand 15.10.2026. Daddelbert hat nach Hinweis auf den Widerspruch zwischen
BerryBase-Maßen und Produktfoto ausdrücklich die Elechouse-V3-Basis akzeptiert
(„Mach weiter und nimm einfach das an“). Das ist **keine Bestätigung**, dass das
vorhandene BerryBase PN532-MOD mechanisch identisch ist.

## Reales Modul — Nutzerabgleich 21.10.2026

Für die aktuelle Druckdatei ersetzt der Nutzer-Messabgleich die früheren
Lochbild-/Dickenannahmen: PCB42,7×40,4 als passend bestätigt, Dicke1,15 mm,
LöcherØ2,93, jeweils6,26 mm Kante→naher Lochrand. Daraus Mitte7,725 mm
vom Rand und Raster27,25×24,95. Diese Angaben sind Chat-Messwerte des Nutzers,
keine nachträglich geänderten Herstellerdaten. Aktuelle Lochmitten lokal
(7,725;7,725)/(34,975;32,675). Foto:
`~/Downloads/PXL_20261021_173403066.jpg` (Modulaufdruck HW-147 sichtbar;
kein Nachweis eines bestimmten Schaltplans oder einer Herstelleridentität).
Weitere Nutzerkorrektur21.10.2026: **I2C-Pins oben**, Montagelöcher links unten
und rechts oben; Gehäusewände unten/rechts. Linke Anschlusslage im ersten
Modell war falsch. Aktuelle Steckerhülle oben, 12×4×16 mm; genauer Abstand
entlang der Kante, Hüllen und tatsächliche Glas-/Holzstärke bleiben ungeprüft.
Die folgenden Abschnitte dokumentieren die ursprüngliche Herstellerbasis
und historischen Annahmen, nicht den aktuellen gemessenen PCB-Stand.

## Originalquellen

- [BerryBase PN532-MOD](https://www.berrybase.de/pn532-nfc-und-rfid-modul-uart-i2c-spi-inkl.-karte-dongle):
  Shop nennt 40 × 60 mm. Produktfotos zeigen eine annähernd quadratische rote
  Platine und zwei diagonale Montagelöcher. Die bisherige Repo-Angabe 40 × 60
  ist deshalb nur Shopangabe, keine vermessene CAD-Grundlage.
- [Elechouse Originalzeichnung](https://www.elechouse.com/elechouse/images/product/PN532_module_V3/PN532_shematic_drowing.pdf):
  lokal `elechouse-v3-drawing.pdf`, **Seite 2** enthält die Maßzeichnung.
  `drawing-page2.png` ist eine echte Poppler-Rasterung dieser Seite.
- [Elechouse Manual V3](https://www.elechouse.com/elechouse/images/product/PN532_module_V3/PN532_%20Manual_V3.pdf):
  lokal `elechouse-v3-manual.pdf`, nennt 42,7 × 40,4 × 4 mm und verlinkt die
  Originalzeichnung. 4 mm Gesamtangabe ist kein vollständiges Stecker-/Lötmodell.

PDFs sind unveränderte Herstellerunterlagen, keine selbst erstellten Zeichnungen.
SHA256 der tatsächlich heruntergeladenen Dateien:

- drawing: `9552a4aefa5c329bc1b3b03cd3543c0eaa5d98b04a583bb692227843c33744fa`
- manual: `3800d5935532d664015514c0199d2ce4313b3feccf563759642b424048a0cf07`

## Visuell abgelesene Maßzeichnung, nicht automatisch aus Text extrahiert

Orientierung exakt wie Seite 2, Ursprung **unten links**, +x rechts / +y oben:

- PCB 42,70 × 40,40 mm.
- Rechte Lochmitte 7,50 mm vom rechten Rand, untere Lochmitte 7,60 mm von unten.
- Horizontaler Mittenversatz 27,80, vertikaler 25,20 mm.
- Daraus rechnerisch Löcher (7,40;7,60) und (35,20;32,80).
- **Kein Bohrdurchmesser bemaßt.** CAD verwendete zunächst ausdrücklich angenommene Ø2,5
  und M2-Schrauben. Nicht als Herstellerwert oder M2,5-Freigabe verstehen.

Die Zeichnung ist gegenüber dem BerryBase-Produktfoto anders orientiert.
Vierpoliger I2C-Anschluss war im ersten lokalen Modell **links** angenommen;
aktuell auf Nutzerkorrektur **oben**. Historische Zeichnungsorientierung ist
kein Beleg für die reale Steckerlage. Bei einer Drehung immer komplette
Baugruppe samt CNC-Konturen drehen, nicht nur das Lochbild spiegeln.

## Bewusste Annahmen

PCB 1,6 mm; Elektronikhülle innen 23 × 22 × 5 mm; vierpolige Steckerhülle
4 × 12 × 16 mm an der linken Seite; PCB-Schraubenlöcher Ø2,5. Steckerlage und
Unterseitenfreiheit sind Entwurfsgrenzen, keine aus PCB-Dateien extrahierten Maße.
Die Antennenlinien der Vorschau sind **nur stilisiert**, keine Kupfergeometrie
oder Simulation. Reale Lötseite/Anschlussorientierung vor Druck abgleichen.

Der Nutzer möchte Plexiglas. Vorschlag 3 mm und 2 mm Luft zur äußeren PCB-Seite;
keine universelle NFC-Mindestluft und kein nachgewiesener Leseabstand.
Kein Metallblech oder geschlossener metallischer Rahmen im Entwurf; vorhandene
Schrauben/Muttern bleiben RF-Einflüsse und müssen im fertigen Aufbau mit den
realen Tags getestet werden. Keine Zusatzmagnete ungeprüft ergänzen.

CAD und Prüfungen: `../../../3d-print/mounts/pn532-mount/README.md`.
