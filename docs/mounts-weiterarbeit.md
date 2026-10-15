# Übergabe — Einzel-Mounts

## Aktuelle Übergabe 15.10.2026 — Fenster / nächste Deckel-Mounts

**Neueste Vorgabe: nur von außen CNC-fräsen.** Kein Wenden und keine
Innentasche. Aktuelle Referenz: `3d-print/mounts/feather-window-mount/README.md`
und dessen SCAD-Dateien. Der zuerst erstellte zweiseitige Fensterentwurf ist
überholt, auch wenn ältere Protokolle ihn noch als geprüft beschreiben.

- Gemeinsam parametrierte CNC-/Druckkontur, formschlüssige Ausrichtung mit
  kalibriertem Spiel, Einführfase und eigenem Holzanschlag. Schrauben halten,
  statt den Träger beim Anziehen erst optisch auszurichten.
- Vorbereiten außerhalb, erst danach von innen einsetzen/verschrauben. Kein
  dauernder Steckzugang erforderlich; eingesteckte Hüllen und Kabel brauchen
  trotzdem Platz. Keine Bauteile/Glas als Tiefenanschlag verwenden.
- Beim TFT Zielabstand zum Plexiglas **2 mm nominal**. PCB-/Display-/Glasdicken
  sind noch Annahmen, nicht gemessen. Laschen-Auflage z=22, PCB-Auflage 25,2,
  Führung 26,5, TFT-Front 29, Glasunterseite 31. Klare gerade Seitenansicht
  mit Höhenangaben liefern, nicht nur schwer abschätzbare Isometrie.
- Echte Steckerhüllen statt nur Pinüberstände prüfen. Langhals-/Insert-Höhen
  und Schraubenlängen hängen davon ab. Frontseitigen RESET neben D0/D1/D2
  berücksichtigen; Platzhalter-Vorschauen zeigen keine vollständige Bestückung.
- **USB macht Daddelbert ausdrücklich von Hand.** Der CNC-Entwurf enthält
  deshalb keinen USB-Kanal. Ohne diese manuelle Aussparung kollidiert die
  angenommene Steckerhülle noch mit Front-Holz; das ist im digitalen Test als
  bewusster manueller Restschritt markiert, nicht als automatisch gelöst.
  Reale Freigängigkeit beim Ausarbeiten prüfen. Glasfixierung/Passprobe offen.
- Digital prüfen: geschlossene reale STL, DXF-Nennkonturen, Vollkörper-
  Schnittmengen, absichtliche Versatz-/Tiefen-Gegenproben. Bekannte Kollisionen
  ausdrücklich als offen ausweisen, nicht durch erwartete Fehler grünreden.
- Reproduzierbare Headless-Werkzeuge stehen im aktuellen Fenster-`render.sh`:
  OpenSCAD 2021.01/CGAL + Xvfb + Mesa. `offscreen` allein reicht hier nicht;
  Library-/DRI-Pfade vor Xvfb-Start setzen. Kein Root und kein Flake-Update.

**Angekündigte nächste Session, noch kein neuer Bauauftrag:** Mounts für
NeoPixel-Stick **NEOPS8 (8 WS2812)** und **PN532-MOD** am Deckel. BOM und
Kernwerte zuerst lesen, tatsächliche Modulversionen/Lochbilder/Stecker prüfen.
Fenster als methodische Referenz für gemeinsam passende CNC-Ausschnitte und
Druckhalter verwenden, nicht dessen Feather-Maße blind kopieren. 2 mm sind
TFT-Optikziel, keine generelle NFC-/LED-Einbauhöhe. NFC-Antenne, Holz-/Glas-
Schichtung, Schrauben/Metallnähe und echte Lesereichweite separat prüfen.
Bei reinen Boden-Mounts bleibt der Step-Up die Stilvorlage.

## Ältere Modulübergabe — 09.10.2026

## MAX98357A / ADA3006 — Vorschlag 09.10.2026

Separater Nutzerauftrag und ausdrücklicher Wunsch: Expertenvorschlag bauen,
Nutzer schaut anschließend an. `3d-print/mounts/max98357-mount/` enthält
SCAD/STL und sechs tatsächlich angesehene Vorschauen. 38 × 26 × 12 mm,
zwei gestufte Gewindepfosten + zwei massive Stützen, Einsätze von unten,
zwei seitliche Senkkopflöcher. Quell-/STL-Prüfung PASS, kein Drucktest.
Noch keine Nutzer-Sichtabnahme der Form/Einsatzmontage/Holzlochanzahl.
Reale Lot-/Steckerfreiheit, Heat-Set-/Lastprobe, Schrauben-/Holzpassung offen.
Nutzerfoto/-bestätigung und Herstellerfoto stimmen visuell überein:
bestelltes ADA3006, alte Klon-Einordnung widersprochen; Original-Mono-PCB
17,78 × 19,05, zwei Ø2,5-Löcher im Abstand 12,70. Quellen/Prüfung:
`docs/cad/2026-10-09-max98357-mount/`,
`docs/testprotokoll-max98357-mount.md`, Mount-README. Keine Pin-/Railänderung.

## Aktueller AW9523-Stand

Der Nutzer hat den ersten Expander-Mount verworfen und einen kompletten
Neustart beauftragt. **Aktuell neu konstruiert:**
`3d-print/mounts/aw9523-mount/`, SCAD, STL, sechs Vorschauen, Render-/Mesh-
Prüfskripte. Der Vorgänger liegt unverändert in dessen
`archive/rejected-2026-10-09/`, ist verworfen und keine Vorlage.

Neuer Vorschlag: 56 × 26 × 12 mm, 2-mm-Gitter (4-mm-Zellen/2-mm-Rippen),
vier einzelne Auflagen. Zwei diagonale gestufte Schraubpfosten, zwei
massive Stützen. Gewindebereich Ø 8,2 endet 4 mm unter der PCB; oben
schmale Ø-4,6-Auflage. **Keine Pin-Freistiche, keine dünne Einsatzwand.**
Zwei ruthex RX-M2,5×5,7 werden von **unten** eingesetzt, 0,2 mm
zurückgesetzt, volle Wand 1,8 mm um max. Einsatz-Ø 4,6. Holzschrauben
links/rechts außerhalb der PCB-Projektion, auch montiert zugänglich.

**Noch vom Nutzer zu entscheiden:**

1. Unterseiten-Einsatzmontage statt des bisher gewünschten bündigen
   Einsetzens in die Pfostenoberkante.
2. Zwei 3 × 12 mm Senkkopf-Holzschrauben (Ein-Loch-Wunsch war Step-Up-
   spezifisch; keine Expander-Anzahl freigegeben).

Keine Druck-/Passungsabnahme. Pin-/Lot-Hüllen sind nur Entwurfsgrenzen:
3,4 mm Überstand, Lotradius 1,1 mm. Reale Hardware prüfen, nicht passend
zwingen. M2,5×12 nur Schrauben-Rechenbeispiel bei angenommener 1,6-mm-PCB;
alte M2,5×8-Empfehlung gilt nicht mehr. Schraubenkopf und Ø-2,5-PCB-
Bohrungen an echten Schrauben ohne Kraft prüfen.

Quellen frisch ausgelesen: Original-Eagle-Boardfile inkl. Padrotation,
38,1 × 17,78 mm, vier Ø-2,5-Löcher; **gerundete Ecken R2,54**, nicht
gefast. Hersteller-Unterseitenfoto zeigt keine bestückten Bauteile,
aber beweist keine Nutzer-Lötstellenhöhe. Neue Quellenkopien/Rohlogs und
`verify_source.py`: `docs/cad/2026-10-09-aw9523-redesign/`.
STL Mesh PASS, sechs Bilder tatsächlich angesehen. Prüfprotokoll:
`docs/testprotokoll-aw9523-mount.md`. Details: Mount-README und `To-Do.md`.

## Bestätigtes Grundprinzip für weitere Aufträge

- AW9523 = **Adafruit ADA4886**, nicht MCP23017.
- Einzel-Mounts, regelmäßiger durchbrochener Gitterboden, einzelne
  Abstandspfosten; keine Wände, Mulden oder L-Auflagen.
- Stilvorlage: `3d-print/mounts/stepup-mount/`, aktuelle Senkkopf-Version
  vom Nutzer digital positiv bewertet, nicht physisch getestet.
  Abgelehnten Step-Up-Archivstand niemals als Vorlage verwenden.
- Holzbox außen 250 × 180 × 110 mm, **12 mm Pappelsperrholz**, Deckel/
  Boden abschraubbar; keine Holzbeschaffung bestätigt.
- **3 × 12 mm Senkkopf-Holzschrauben**, nicht M3-Maschinenschrauben/M4.
  Kopf/Fabrikat und Holztest mit begrenzter Vorbohrtiefe offen.
- ruthex RX-M2,5×5,7 laut Nutzer bestellt. Herstellerwerte Ø-4,0-Einbauloch,
  Tiefe mindestens 6,7 mm, Wand min. 1,6 mm. Keine dünnen Sektoren als
  fertige Lösung übernehmen; Einbau-/Lastprobedruck nötig.
- Step-Up-spezifisch: ein Holzloch, ein Schraubpfosten plus zwei mittige
  Stützen; nicht auf neue Module pauschal übertragen.

## Vorgehen

Vor neuem Mount: `hardware/gehaeuse-konzept.md`, BOM, Kernwerte und
CAD-Abschnitt in `docs/findings.md` lesen. Herstellerkontur, **drill**-
Werte, Lochbild, Unterseitenbauteile und Anschlüsse selbst prüfen.
Nur bei realer Hardware-Unklarheit Nutzerfoto/Messung anfragen.
Neue notwendige Konzeptabweichungen abstimmen, nicht erneut das bereits
bestätigte Gitterprinzip diskutieren. Ein angekündigter Folgeprompt ist
noch kein Bauauftrag.

Neues Modul separat, vorhandene Referenz unverändert. STL nur Mount;
Vorschauen ohne und mit transparenter Platine. Neue Prüfkoordinaten,
Bounds und tatsächliche neue Export-/Prüflogs. OpenSCAD 2026.09.18,
CGAL/hardwarnings/binstl, offscreen-Bilder. CAD-/Mesh-Erfolg und reale
mechanische Abnahme strikt trennen. Keine Firmware-/Railänderungen für
Mount-Aufträge. Weitere SD-/Amp-Mounts nur nach eigenem Auftrag.
