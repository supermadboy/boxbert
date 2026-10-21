# PN532-Halter — digitaler Messabgleich 21.10.2026

## Auftrag und reale Grundlage

Nutzer beauftragt Finalisierung vor CNC. Reader liegt im aktuellen Deckelfoto
unten rechts, Buttonloch links daneben. Foto lokal:
`~/Downloads/PXL_20261021_173403066.jpg`.

Nutzer bestätigt Platine42,7×40,4 mm, misst mit Messschieber:
Dicke1,15 mm, LöcherØ2,93 mm, an allen vier nahen Kanten6,26 mm von
Platinenkante bis Lochkante. Daraus rechnerisch Lochmitten7,725 mm vom Rand,
Raster27,25×24,95 mm. Kein Agenten-Messnachweis, keine Herstelleridentifikation.
Ungefähre Randabstände15 mm rechts/unten, darunter12-mm-Gehäusewand;
Abstände nicht als präzise gemessen bestätigt.

## Umsetzung

Ordner `3d-print/mounts/pn532-mount/`:
- Lochbild und PCB-Dicke an Nutzerwerte angepasst.
- Auflage24,35 statt23,9 mm; Außenfläche25,5 und nominal2-mm-Glasabstand bleiben.
- Holzlaschen links und oben beim rechten oberen PCB-Loch, statt vorne/hinten.
  Schraubenzentren(−10;20,2)/(34,975;50,4), keine Lasche rechts/unten.
- Linker Stützsteg neben Stecker-/Kabelweg versetzt, diagonaler Laschenarm.
- CNC-Nennkonturen unverändert: Durchbruch47,5×45,2 / Falz51,5×49,2×3 / R2.
- Nur Druckteil in `pn532_mount.stl`, keine PCB-/Glas-/Holz-Dummies.

## Erster Lauf vor Stecker-Seitenkorrektur (historisch)

Reproduktion: `bash 3d-print/mounts/pn532-mount/render.sh`.
Aktuelle Rohlogs im Mount-Unterordner `logs/`.

- Reale Druck-STL: **5.168 Dreiecke**, geschlossen, orientiert,
  zusammenhängend, keine degenerierten Flächen, Volumen **6.553,536 mm³**.
- Bounds **(−16;−2,2;0)…(44,9;56,4;24,35)**,
  Gesamtgröße60,9×58,6×24,35 mm.
- DXF-Nennmaße und geschlossenes lokales Holzmodell geprüft.
- Unabhängige Schichtungs-/Schraubenrechnung: PCB24,35…25,5,
  Glasunterseite27,5, M2×25-Spitze0,5, angenommener minimaler
  Gewindeeingriff1,5 mm.
- **17 Solid-Testgruppen PASS**, einschließlich 21 einzeln geschnittener
  Einsetzpositionen z=−20…0 mm. Keine Soll-Kollisionen mit Holz, PCB,
  angenommener Elektronik-/Stecker-/Kabelhülle, Glas oder Schraubbohrungen.
- Absichtliche Versatz-/Tiefenkollisionen erkannt; Materialproben beider
  neuen Laschen positiv, Holzschrauben-Bohrungen frei.
- Angenommenes15-mm-Rand-/12-mm-Wandmodell ohne Schnittmenge. Nominale
  Führung→Wand0,8 mm, Durchbruch→Wand0,6 mm, **keine Toleranzfreigabe**.

Erste Zwischenstände fielen korrekt durch: Stecker-Kollision42,021 mm³,
danach Kabel-Kollision23,040 mm³. Geometrisch beseitigt, nicht als erwartete
Fehler akzeptiert. Historische Rohlogs `revision-before-connector-fix.log`
und `revision-before-cable-fix.log` klar von aktuellen PASS-Logs getrennt.

Render-Skript: relative Selbstaufrufe auf absoluten Skriptpfad korrigiert.
Geerbtes Xwayland-DISPLAY führte beim ersten PNG zu fehlendem GLX-Kontext;
Skript verwendet jetzt explizit eigenes Xvfb und Mesa-GLX. Fehlendes Pillow
im System-Python wird durch eine gepinnte Nix-Python-Umgebung mit Pillow
behoben. Keine Änderung an Systemkonfiguration, kein Root/Flake-Update.

Finaler Komplettlauf von `render.sh` erfolgreich beendet (21.10.2026,
ca.20:01 lokale Rechnerzeit). Neue Iso-/PCB-/Explosionsansichten,
`overview.png` und `height-side.png` tatsächlich geöffnet und angesehen.
STL-SHA256: `186194657ed7a929179585866e87438e8db7dee264c8c5de6d9b2c1082827eba`.

## Nutzerkorrektur: Anschluss oben statt links

Im anschließenden Chat bestätigt: **I2C-Pins oben**, Platinenlöcher links
unten/rechts oben, Holzwände unten/rechts. Die frühere linke Anschlusslage
war falsch; deren PASS-Tests bewiesen keine reale Steckerlage.

Steckerhülle jetzt lokal x=10…22 / y=35,9…39,9, Höhe16 mm; Kabelweg von dort
nach innen und oben (+y). Kabelbinderpad von links nach oben verlegt, links
neben der oberen rechten Holzlasche. Exakter Offset und Hüllenmaße weiterhin
Annahmen; Anschlussseite bestätigt. Lochbild, Laschenpositionen, Höhen und
CNC-Nennkonturen unverändert. Erneuter kompletter STL-/Mesh-/Solid-/Render-Lauf
erfolgreich beendet, einschließlich 17 PASS-Testgruppen und21 Einsetzlagen.
Aktuelle STL **5.160 Dreiecke, 6.606,049 mm³**, geschlossen/orientiert/
zusammenhängend/nicht degeneriert, Bounds unverändert. Neue Draufsicht und
Übersicht geöffnet/visuell geprüft. Aktuelle Ergebnisse in
`3d-print/mounts/pn532-mount/logs/`.
Aktuelle STL-SHA256:
`fe68d22a95b5ba9521abd44df46e002c242519559ff177043c9690afe89d4ea0`.

## Abschließende Bezugsrahmen-Klärung des Nutzers

Alle bisherigen Nutzerangaben waren foto-relativ. **Foto-rechts wird am
fertigen Gehäuse oben**. SCAD bleibt bewusst in Fotoorientierung; gesamte
Anordnung (PCB, Halter, CNC-Konturen) gemeinsam90° gegen den Uhrzeigersinn
gegenüber der Fotoansicht drehen. Danach I2C links, Wände oben/rechts,
Laschen unten/links, PCB-Löcher unten rechts/oben links. Kein erneutes
Umsetzen einzelner Teile, keine geänderte STL/Prüfannahme durch diese reine
Orientierungsbenennung. Der Wandtest ist weiterhin foto-relativ unten/rechts.

## Formkorrektur: gerade linke Lasche und Randsteg

Nutzer bittet ohne Markierung um Umsetzung von „gerade hoch“ und fehlendem
„Strich“ an der Base. Interpretation nach Ansicht der echten Iso-Vorschau:
linken Laschenarm gerade statt seitlich versetzt ausführen; fehlenden
Randabschluss der durch Randzellen geöffneten Base schließen. Sichtfreigabe
steht noch aus, nicht als exakte vom Nutzer markierte Stelle ausgeben.

I2C bleibt foto-relativ oben, Wände unten/rechts, Loch-/Laschenorte und CNC
unverändert. Linker Stützsteg jetzt y=17,2…23,2, gerader Arm nach links.
Gitterausschnitte werden nur innerhalb der um2 mm verkleinerten Kontur
abgezogen; umlaufender flacher Randsteg statt Randzähnen, keine Wände.

Zwei neue echte STL-Fehlvolumen-Tests: vier unabhängige Randstreifen und
Materialhülle der geraden Stütze müssen vollständig enthalten sein.
**Red-Test gegen vorige STL:** 83,016275 mm³ fehlender Randsteg und
127,913810 mm³ fehlendes Stützenmaterial korrekt erkannt. Rohlog:
`logs/revision-rim-brace-red.log`, außerdem `fit-red-old-rim.log` und
`fit-red-old-brace.log`. Neuer Komplettlauf erfolgreich beendet: **alle19
Gruppen PASS**, einschließlich21 Einsetzlagen und beiden neuen Prüfungen.
Reale neue STL: **5.180 Dreiecke,6.665,575 mm³**, geschlossen/orientiert/
zusammenhängend/nicht degeneriert, Bounds unverändert. Neue Iso-Ansicht und
Übersicht mit transparenter Platine geöffnet und angesehen.
Aktueller STL-SHA256:
`4dfbe4bdd79d5aacf75163191eace5367f30c75ce3e537aa003cf87056c4dc8c`.

## Prüfgrenzen / noch real zu tun

**Kein Druck-, CNC-, Passungs-, Last-, RF- oder Kindersicherheitsnachweis.**
1-mm-Einsetzabtastung ist kein lückenloser Bewegungsbeweis. Nur angenommene
Stecker-/Bauteilhüllen, kein vollständiges reales PCB-Modell.

Vor endgültiger Montage genaue Randabstände, Holz-/Glasstärke, Wandversatz,
Leisten und besonders benachbarte Buttonmutter/-gehäuse prüfen. Kein
Gesamtdeckel-/Button-Solid-Modell vorhanden. Echte Schrauben-/Muttern-/Kopfmaße,
Löt-/Steckerfreiheit, reale Führungspassung und Druckfestigkeit prüfen.
Support/Orientierung im Slicer nötig, keine Supportfreiheitszusage.
Scheibe sicher fixieren und echte Tags durch fertige Schichtung inklusive
Metallnähe testen. Akku und elektrische Verdrahtung wurden nicht verändert.
