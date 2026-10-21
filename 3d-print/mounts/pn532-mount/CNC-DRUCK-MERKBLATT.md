# PN532 — Druck und CNC: Stand 21.10.2026

## Aktueller Dateistand

- Druckteil: **`pn532_mount.stl`**, nur Halter, Skalierung100 %.
- Durchbruch: **`cnc-opening.dxf`**,47,5×45,2 mm.
- Glasfalz: **`cnc-rebate.dxf`**,51,5×49,2 mm,3 mm tief.
- Scheibenvorschlag: **`cnc-glass.dxf`**,51,1×48,8×3 mm.
- CNC-Konturen unverändert gegenüber dem ursprünglichen PN532-Entwurf.
- Ecken R2, Fräser max.Ø4 mm. DXF in mm, Nennkonturen ohne
  Werkzeugkompensation; **kein G-Code**. Nur von außen: Falz, dann Durchbruch.
- `panel_cnc.stl` ist ein lokales Holz-Prüfstück, **nicht das Druckteil**.

## Orientierung — nicht einzelne Teile verdrehen

Alle bisherigen Richtungen beziehen sich auf das Nutzerfoto:
I2C oben, PCB-Löcher links unten/rechts oben, Wände unten/rechts,
Holzlaschen links und oben beim rechten oberen PCB-Loch.
**Foto-rechts wird später Gehäuse-oben.** Gesamte Anordnung samt CNC-Konturen
um90° gegen den Uhrzeigersinn gegenüber der Fotoansicht drehen.

## Änderungen im aktuellen Druckteil

- Nutzer-Messwerte: PCB42,7×40,4×1,15, LöcherØ2,93,
  Kante→naher Lochrand6,26 mm; daraus Lochraster27,25×24,95 mm.
- Holzlaschen nach links/oben versetzt; linke Anbindung zuletzt geradegestellt.
- Gitterbase mit geschlossenem, flachem mindestens2-mm-Randabschluss.
- I2C-/Kabelmodell und Kabelbinderpad an die obere Seite korrigiert;
  genaue Steckerhüllen-/Bauteilhöhen und Offset weiterhin Annahmen.
- PCB-Auflagen auf24,35 mm erhöht, nominal2-mm-Glasabstand beibehalten.
- M2×25/M2-Muttern vorgeschlagen, Kopf max.Ø4/Höhe1,5 mm.
  Holzbefestigung zwei3×12-mm-Senkkopf-Holzschrauben, nicht M3.

## Vor endgültigem Deckel prüfen

- [ ] Probedruck, Support/Orientierung für auskragende Laschen im Slicer prüfen.
- [ ] PCB-, Muttern-, Schrauben-, Löt-/Steckerpassung ohne Verspannung prüfen.
- [ ] Rechte/untere Randabstände im Foto genau messen:15 mm bislang nur ungefähr.
      Bei12-mm-Wand nominal nur0,8 mm Druckteil-/0,6 mm Durchbruchfreiheit.
- [ ] Linke Lasche gegen echten Button samt Mutter/Gehäuse und Leisten prüfen.
- [ ] Holz12 mm und Plexiglas3 mm sind noch durch Ist-Maße zu bestätigen.
- [ ] Zuerst Reststück fräsen, Führung/Glasfalz mit Druckteil einpassen.
- [ ] Holzschrauben begrenzt vorbohren, von Hand anziehen, keine Außendurchtritte.
- [ ] Scheibe sicher fixieren; Last-/Durchbiegung und NFC mit echten Tags im
      fertigen Aufbau inklusive Schrauben/Metallnähe prüfen.

**Digital geprüft:** reale STL geschlossen/orientiert/zusammenhängend/
nicht degeneriert;19 Solid-Testgruppen PASS, darunter21 einzelne Einsetzlagen
und neue Fehlvolumentests für Randabschluss/gerade Stütze. Keine reale
Druck-/CNC-/Passungs-/Last-/RF-/Kindersicherheitsfreigabe.
Details: `README.md`, `logs/`, `../../../docs/testprotokoll-pn532-mount.md`.
