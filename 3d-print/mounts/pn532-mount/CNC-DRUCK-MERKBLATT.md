# PN532 — Druck und CNC: Stand 21.10.2026

## Aktueller Dateistand

- Druckteil: **`pn532_mount.stl`**, nur Halter, Skalierung100 %.
- Durchbruch: **`cnc-opening.dxf`**,47,5×45,2 mm.
- Glasfalz: **`cnc-rebate.dxf`**, Wellenkontur,Hülle67,5×65,2 mm,3 mm tief.
- Scheibenvorschlag: **`cnc-glass.dxf`**, gewellt,Hülle67,1×64,8×3 mm.
- Wellenberge10 mm / Täler4 mm vom Durchbruchrand;0,2 mm Scheibenspiel.
- Durchbruch und Halter unverändert; Falz/Scheibe ersetzen alte Rechteckkonturen.
- Durchbruch R2 → Fräser höchstensØ4 mm; Wellen im CAM gesondert prüfen. DXF in mm, Nennkonturen ohne
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
- M2,5×25/M2,5-Muttern als Längenbeispiel, Kopf max.Ø4/Höhe1,5 mm angenommen.
  Holzbefestigung zwei3×12-mm-Senkkopf-Holzschrauben, nicht M3.

## Vor endgültigem Deckel prüfen

- [ ] Probedruck, Support/Orientierung für auskragende Laschen im Slicer prüfen.
- [ ] PCB-, Muttern-, Schrauben-, Löt-/Steckerpassung ohne Verspannung prüfen.
- [ ] Rechte/untere Randabstände im Foto genau messen:15 mm bislang nur ungefähr.
      Bei12-mm-Wand nominal nur0,8 mm Druckteil-/0,6 mm Durchbruchfreiheit.
- [ ] Linke Lasche gegen echten Button samt Mutter/Gehäuse und Leisten prüfen.
- [ ] Holz12 mm und Plexiglas3 mm sind noch durch Ist-Maße zu bestätigen.
- [ ] Zuerst Reststück fräsen, Führung/Glasfalz mit Druckteil einpassen.
- [ ] **Neue Falz überdeckt linke Holzschraube:** mit3×12 nominal nur0,5 mm
      Spitzenreserve zum Falzboden. Kürzere Schraube oder andere Befestigung
      erst abstimmen/real prüfen; nicht mit alter3,5-mm-Restholzannahme fertigen.
- [ ] Holzschrauben begrenzt vorbohren, von Hand anziehen, keine Außendurchtritte.
- [ ] Scheibe sicher fixieren; Last-/Durchbiegung und NFC mit echten Tags im
      fertigen Aufbau inklusive Schrauben/Metallnähe prüfen.

**Wellenfalz-Nachweis:** `logs/wave-cnc-check.log`, neue Bilder `wave-top.png`
und `wave-iso.png`; gemeinsame Übersicht `../wellenfalz-uebersicht.png`.
**Druckteil-Nachweis (unverändert):** reale STL geschlossen/orientiert/zusammenhängend/
nicht degeneriert;19 Solid-Testgruppen PASS, darunter21 einzelne Einsetzlagen
und neue Fehlvolumentests für Randabschluss/gerade Stütze. Keine reale
Druck-/CNC-/Passungs-/Last-/RF-/Kindersicherheitsfreigabe.
Details: `README.md`, `logs/`, `../../../docs/testprotokoll-pn532-mount.md`.
