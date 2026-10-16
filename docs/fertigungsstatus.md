# Fertigungsstatus — Prüfung 16.10.2026

**Nachtrag: SD-Halter inzwischen auf Nutzerauftrag fertig konstruiert.**
Aktueller Stand mit STL, Vorschauen und eigenen Prüflogs:
[`3d-print/mounts/sd-mount/README.md`](../3d-print/mounts/sd-mount/README.md).
Die folgende Bestandsaufnahme dokumentiert den Zustand **vor** diesem Bauauftrag;
„SD-Halter fehlt“ ist historisch und kein aktueller Konstruktionspunkt mehr.
Reale Passproben bleiben davon unabhängig.

**Ergebnis des digitalen Checks: Die vorhandenen Druck-/CNC-Einzeldateien
bestehen ihre erneut ausgeführten Prüfungen; der eigentliche SD-Halter fehlt.
Keine pauschale reale Passungs-/Einbaufreigabe.**

## Nutzerabgrenzung nach dem Check — 16.10.2026

Daddelbert übernimmt das Gehäuselayout einschließlich Button-, NFC- und
NeoPixel-Positionen sowie CNC-Anordnung, Befestigungsleisten und Kabelräume
selbst. Ebenso fertigt er Lautsprecheröffnung/Rückwand selbst als Lochraster.
Diese Punkte sind **kein offener Agenten-Konstruktionsauftrag**; die weiter
unten inventarisierten fehlenden Gesamtdateien sind keine Voraussetzung,
um die Einzelhalter weiterzubearbeiten.

Zur Scheibenfixierung schlägt Daddelbert selbst gebohrte Plexiglaslöcher mit
von Hand gefertigter 45°-Senkung und Schrauben vor. Das ist ein Montagevorschlag,
keine geprüfte Freigabe: Schrauben-/Senkungsgeometrie, Randabstand und reale
Riss-/Spannungsfreiheit sind noch nicht nachgewiesen. Keine CAD-Änderung beauftragt.

Akkuhalter ist bereits als Basis plus Bügel vorhanden. „Rückhaltung offen“
bezeichnet nur die noch ungeprüfte Haltewirkung bei Kippen/Stoß und die reale
Passung, **nicht einen fehlenden Druckhalter oder einen neuen Bauauftrag**.
Für die weitere Besprechung ist der fehlende SD-Halter der konkrete
Konstruktionspunkt; vorhandene Halter werden nicht ungefragt neu entworfen.

## Tatsächlich geprüft

Sauberer Arbeitsbaum zu Beginn; Referenzstand `681226b`. Aktive Dateien unter
`3d-print/mounts/`, keine verworfenen Archivvarianten. Erneut ausgeführt:

- `python3 3d-print/mounts/<name>/check_mesh.py` für akku, aw9523,
  feather-window, max98357, neopixel-stick, pn532 und stepup (jeweils `-mount`).
- Akku zusätzlich mit Argument `bridge`.
- `python3 3d-print/mounts/sd-mount/check_template.py`.
- `check_cnc.py` für feather-window, neopixel-stick und pn532.

Alle zwölf Aufrufe mit Exit-Code 0. Vollständige Ausgabe:
[`cad/fertigungscheck-2026-10-16/checks.log`](cad/fertigungscheck-2026-10-16/checks.log).
Neun Druck-/Schablonen-STLs: geschlossene, zusammenhängende, konsistent
orientierte Oberflächen ohne degenerierte Dreiecke; projektspezifische
Bounds-/Geometrieprüfungen erfolgreich. Drei CNC-Prüfungen bestätigen die
vorhandenen Holzmodelle und neun DXF-Nennkonturen sowie modellierte Maßketten.

**Prüfgrenzen:** Bestehende Exporte geprüft, nicht neu exportiert. Keine neuen
OpenSCAD-Solid-Kollisionstests, Renderings oder Slicerläufe. Frühere Solid-Logs
sind kein frischer Nachweis dieses Checks. Kein realer Druck-, Passungs-,
Last-, Glasfixierungs- oder NFC-Test durchgeführt. Mesh-PASS ist weder
Slicerfreigabe noch Bestätigung ungemessener Hardwaremaße.

## Druckteile

| Teil | Vorhandener Stand | Vor endgültiger Fertigung/Verwendung offen |
|---|---|---|
| Step-Up | Vollständiges Mount-STL, digitale Form bestätigt | Heat-Set-/Schrauben-/Lot-/Holzpassprobe |
| AW9523 | Vollständiges Mount-STL | Unterseiten-Einsätze und zwei Holzschrauben noch als Vorschlag dokumentiert; reale Passprobe |
| MAX98357A | Vollständiges Mount-STL | Sichtentscheidung zum Vorschlag, Unterseiten-Einsätze, reale Kopf-/Klemmen-/Lotfreiheit |
| Akku | Basis und separater Bügel als STL | Maximale Akkuhülle einschließlich PCM/Kabel, geeignete glatte isolierende Unterlage, Dummy-Rückhaltung und Belastung; kein Akku in ungeprüften Halter |
| Feather-Fenster | Vollständiges Mount-STL, Außenfräs-Konturen | Reale Stecker-/Header-/Tasterhöhen, Schrauben und Passung; USB-Handaussparung bleibt beabsichtigter Arbeitsschritt |
| NeoPixel | Vollständiges Mount-STL, Außenfräs-Konturen | Tatsächliches Modul gegen akzeptierte Adafruit-Basis abgleichen, M2-Kopf max. Ø3/Höhe2 mm, Muttern/Support/Passung |
| PN532 | Vollständiges Mount-STL, Außenfräs-Konturen | Tatsächliches Modul/Lochbild gegen akzeptierte Elechouse-Basis abgleichen; Loch-Ø2,5 und Bauteilhüllen sind Annahmen; Schrauben/Support/Passung |
| SD HW-125 | Nur `hole_template.stl` | **Fertiger Halter fehlt.** Unterseiten-Einsätze und zwei Holzschrauben noch nicht abgestimmt; Schablone physisch prüfen |

Die vorhandenen STLs sind als Probedruck-Kandidaten nutzbar, nicht pauschal
für den endgültigen Aufbau freigegeben. Vor Druck Slicer, Material, Orientierung
und Support prüfen; erhöhte Fenster-/Deckellaschen nicht als supportfrei ansehen.

## CNC und Gesamtmontage

Vorhanden sind getrennte Ausschnitt-/Falz-/Scheibenkonturen für Feather,
NeoPixel und PN532. Die NeoPixel-Holzdatei ist ein Deckelmodell mit dessen
Ausschnitt, **kein zusammengeführter fertiger Deckel mit Buttons und PN532**.
PN532-Holzdatei ist nur ein lokales Prüfstück.

Offen für einen vollständigen Fertigungssatz:

1. Gemeinsames Deckellayout mit Buttons, PN532, NeoPixel, Leisten,
   Schraub- und Kabelräumen; Kollisions- und Montageprüfung der ganzen Box.
2. Lautsprecher-Rückwand: genaue Schalllochfläche/-raster, innere Ausdünnung,
   Restwandstärke, Befestigung und Dichtung. Die ausschließlich äußere
   Fensterfräsung ist nicht mit dem separat beschlossenen inneren
   Lautsprecher-Rückwandkonzept gleichzusetzen.
3. Holz-Zuschnitt/Fugen, Deckel-/Bodenleisten und deren Schrauben;
   tatsächliche Holz-/Scheibendicken und verfügbare Innenräume.
4. Sichere Scheibenfixierung aller drei Fenster: ein Falz allein hält die
   Scheibe nicht gegen Herausheben.
5. Flachband-/sonstige Kabelverbindungen und Zugentlastung im Gesamtaufbau;
   feste Montage der übrigen Verbinder/Terminalblöcke.
6. Werkzeug, Aufspannung, Frästiefen und CAM-Werkzeugradiuskompensation.
   DXF sind Nennkonturen, keine freigegebenen Maschinenprogramme. NeoPixel/
   PN532: R2 erfordert Fräser höchstens Ø4 mm.

Feather-USB wird ausdrücklich von Daddelbert von Hand ausgespart, nicht als
fehlende automatische CNC-Konstruktion nachfordern. Vor dieser Nacharbeit
besteht die bekannte USB-/Holzkollision; reale Freigängigkeit danach prüfen.

## Empfohlene Reihenfolge

Nach Nutzerabgrenzung: zunächst den fehlenden SD-Halter und etwaige dafür
nötige Konzeptentscheidungen besprechen. Gehäuseplanung und manuelle
Holzarbeiten übernimmt Daddelbert; daraus keinen weiteren Agentenauftrag
oder pauschale Sperre für die Ideendatenbank ableiten. Reale Passproben
bleiben von der digitalen Konstruktionsvollständigkeit getrennt.

Quellen: aktive Mount-READMEs, `hardware/gehaeuse-konzept.md`,
`docs/mounts-weiterarbeit.md`, `To-Do.md` und tatsächliche Exportdateien.
