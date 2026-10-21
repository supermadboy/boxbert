# NeoPixel — CNC-Merkblatt, 21.10.2026

## Aktuelle Konturen (mm)

1. `cnc-rebate.dxf`: **Wellenfalz,Hülle76,549 × 34,3**, **3 mm tief von außen**.
2. `cnc-opening.dxf`: **58,4 × 14,3**, R2, **durch das Holz**.
3. `cnc-glass.dxf`: gewellte Scheibe,Hülle**76,149 × 33,9**,
   vorgeschlagene Materialstärke **3 mm**. Nicht als Holz-Fräsbahn verwenden.

Wellenberge10 mm / Täler4 mm vom Durchbruchrand; Scheibenspiel0,2 mm.
Alte rechteckige Falz62,4×18,3 und Scheibe62×17,9 sind überholt.

**Nur von außen, eine Aufspannung. Erst Falz, dann Durchbruch.**
Maximal Ø4-mm-Fräser. DXF sind Nennkonturen, kein G-Code; Werkzeugkompensation,
Zustellungen, Haltestege/Opferplatte und sichere Spannung im CAM festlegen.
Nicht alle drei Konturen als Durchfräsung bearbeiten!

## Vor Start

- Holz-Iststärke prüfen: Entwurf **12 mm**. Scheibe-Iststärke prüfen: **3 mm**.
- Alle DXF gemeinsam im gleichen Ursprung importieren, Einheit **mm**.
- Öffnungs-/Falzmittelpunkt gemeinsam bei **(27;4,95)**, bezogen auf lokale
  linke vordere PCB-Ecke. Keine DXF unabhängig neu auf Null verschieben.
- Deckelposition übernimmt Daddelbert. Screenshot/Referenzdeckel ist kein
  vermessener CNC-Nullpunkt. Wand, Leisten, Buttons und RFID freihalten.
- An Reststück Führungsspiel und Scheibenfalz prüfen, dann erst echten Deckel.
- Alte Maße55,2×14,56 /59,2×18,56 nicht mehr verwenden.
- **Falz überdeckt die Holzschraubenprojektion bei(34;19,9):** bei3×12
  nominal nur0,5 mm Spitze→Falzboden. Schraubenlänge/Holzhalt neu klären!
- Frühere4,26-mm-Falz/Wandfreiheit ist überholt; größere Außenkontur im Layout prüfen.
- Holzschrauben-Pilotbohrungen kommen später von innen und begrenzt von Hand;
  keine Durchgangsbohrungen dafür in den Deckel fräsen.

## Zugehöriger Druck

`neopixel_mount.stl`: nur Halter,64×27,9×16,5 mm; PETG-Vorschlag,
**beide Holzlaschen im Deckelfoto nach links**, zur Lochreihe/Deckelmitte.
Schraubenpunkte lokal(20;19,9)/(34;19,9). Durchbruch und Halter unverändert,
Falz/Scheibe jetzt gewellt;
erhöhte Laschen brauchen Support/geeignete Orientierung. Erst Passprobe.
Direkte Lötleitungen: vorhandene Stiftleiste vorher entfernen.
**Neueste Kabelkorrektur:** Kabelausgang samt Zugentlastung am anderen kurzen
Ende, rechts/+x im Modell. Holzlaschen unverändert Foto-links. DIN-/Padbelegung
am realen Modul prüfen; diese Änderung ist nur die mechanische Route.
LED→Scheibe nominal3 mm. Scheibenfixierung ist separat sicher herzustellen.

**Montage noch nicht vollständig freigegeben:** Schraubenkopf-Hüllen schneiden
nur angenommene LED-Positionen im CAD. Reale M2-Kopf-/Bauteilfreiheit vor
endgültiger PCB-Montage klären, keine größere Schraube erzwingen. Die neue
CNC-Kontur ist exportiert und auf Maße geprüft, aber keine reale Passprobe.
Details/Prüfstatus: `README.md`, `logs/wave-cnc-check.log`,
`logs/wave-fit-check.log`; neue Bilder `wave-top.png` / `wave-iso.png`.
