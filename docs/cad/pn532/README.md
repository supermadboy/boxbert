# PN532 — Entwurfsbasis und Quellen

Stand 15.10.2026. Daddelbert hat nach Hinweis auf den Widerspruch zwischen
BerryBase-Maßen und Produktfoto ausdrücklich die Elechouse-V3-Basis akzeptiert
(„Mach weiter und nimm einfach das an“). Das ist **keine Bestätigung**, dass das
vorhandene BerryBase PN532-MOD mechanisch identisch ist.

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
- **Kein Bohrdurchmesser bemaßt.** CAD verwendet ausdrücklich angenommene Ø2,5
  und M2-Schrauben. Nicht als Herstellerwert oder M2,5-Freigabe verstehen.

Die Zeichnung ist gegenüber dem BerryBase-Produktfoto anders orientiert.
Vierpoliger I2C-Anschluss im lokalen Modell **links**; das ist keine festgelegte
Links-/Rechtslage auf dem gesamten Boxdeckel. Bei einer Drehung immer komplette
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
