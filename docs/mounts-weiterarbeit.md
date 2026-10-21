# Übergabe — Einzel-Mounts

## PN532-Messabgleich / Finalisierungsauftrag 21.10.2026

Aktueller Halter: `3d-print/mounts/pn532-mount/README.md`. Nutzer bestätigt
Außenmaße42,7×40,4, misst PCB1,15 mm, BohrungenØ2,93 und an allen vier nahen
Kanten6,26 mm bis Lochrand. Daraus Lochmitten(7,725;7,725)/(34,975;32,675),
Raster27,25×24,95 statt früherer Zeichnungskoordinaten. Foto
`~/Downloads/PXL_20261021_173403066.jpg`: Reader unten rechts, Button links.
Auf ausdrücklichen Auftrag Laschen nach links zum Button und nach oben beim
rechten oberen PCB-Loch verlegt; keine rechts/unten. Auflagen jetzt24,35,
PCB-Außenfläche25,5 und2-mm-Glasabstand erhalten. CNC-Konturen unverändert.
Neue Bounds60,9×58,6×24,35; Schraubenpunkte(−10;20,2)/(34,975;50,4).
M2×25/M2-Muttern bleiben Vorschlag, echte Köpfe/Stecker/Lötfreiheit ungeprüft.
**Abschließende Orientierungsklärung:** alle Nutzer-Richtungsangaben und
SCAD-Draufsicht sind foto-relativ. Foto-rechts wird später Gehäuse-oben;
komplette Anordnung um90° gegen den Uhrzeigersinn drehen. Im fertigen
Gehäuse damit I2C links, Wände oben/rechts, Laschen unten/links. Keine
Geometrieänderung erforderlich, CNC und Druckteil stets gemeinsam drehen.
Weitere Nutzerkorrektur (Fotoorientierung): I2C-Pins **oben**, Löcher links unten/rechts oben,
Wände unten/rechts. Früheres linkes Steckermodell falsch; aktuelle
Stecker-/Kabelhülle und Kabelbinderpad oben. Nur die Seite bestätigt,
exakter Offset und Abmessungen weiterhin angenommen.
**Weitere Formkorrektur:** Nutzer bittet ohne Markierung um „gerade hoch“ und
fehlenden „Strich“ an der Base. Umgesetzt als gerader linker Laschenarm mit
passend ausgerichteter Stütze sowie geschlossenem ebenem2-mm-Randsteg statt
Randzähnen. CNC/Loch-/Laschenorte unverändert, Sichtfreigabe noch offen.
Neu exportiert/geprüft:5.180 Dreiecke,6.665,575 mm³,19 Solid-Testgruppen PASS.
Neue unabhängige Rand-/Stützen-Fehlvolumentests wiesen die vorige STL korrekt
ab. Neue Iso-/PCB-Übersicht angesehen; aktuelle Datei `pn532_mount.stl`.

PCB-Randabstand rechts/unten nur ungefähr15 mm laut Nutzer, Wand12 mm:
nominal Druckführung→Wand0,8 mm / Durchbruch→Wand0,6 mm. Keine reale Freigabe!
Genau messen und Buttonmutter/-gehäuse/Leisten prüfen. Digitaler Wandtest nur
für diese Annahmen; kein vollständiges Deckelmodell. Aktuelle echte Prüfwerte
in `logs/`; Druck-/Passungs-/Last-/RF-Test, Glasfixierung weiterhin offen.
Nachfolgender PN532-Abschnitt beschreibt die ursprüngliche Zeichnungsbasis,
nicht das neue Lochbild oder die neuen Laschenpositionen.

## Aktuell 16.10.2026: SD-Halter fertig konstruiert

Nutzer beauftragt Fertigstellung. `3d-print/mounts/sd-mount/README.md` ist
die aktuelle Referenz statt des früheren Nur-Schablonen-Stands: Gitterhalter
44×56×12 mm, vier gestufte Pfosten im akzeptierten 20×38-mm-Raster, vier
ruthex RX-M2,5×5,7 von unten, zwei seitliche 3×12-Senkkopf-Holzschrauben.
M2,5×12 als Längenbeispiel; reduzierte PCB-Köpfe max. Ø4/Höhe1,8 mm,
konkreten Schraubentyp/Verfügbarkeit und echte Kopf-/Sockelfreiheit prüfen.
Reale Lochraster-/Unterseiten-/Heat-Set-/Lastpassprobe bleibt offen, kein
fehlender CAD-Auftrag daraus. Stecker Richtung -Y, Karte +Y ohne Wand.
Digitale Prüfergebnisse im Mount-Ordner; keine physische Freigabe.

Gehäuse-/Button-/NFC-/NeoPixel-Anordnung, Leisten/Kabelräume und Lautsprecher-
Rückwand macht Daddelbert selbst, nicht als Gesamt-CAD-Auftrag nachfordern.
Akku-Basis/Bügel existieren; Rückhaltung bedeutet nur reale Halteprobe.

## Aktuell: NFC-Reader PN532-MOD beauftragt und konstruiert

Daddelbert hat den NFC-Mount ausdrücklich beauftragt und **Plexiglas** gewählt.
Nach dem Quellenwiderspruch (BerryBase 40×60 vs. annähernd quadratisches Foto)
hat er ausdrücklich die **Elechouse-V3-Maßzeichnung als Entwurfsbasis** akzeptiert.
Das beweist keine mechanische Identität mit seinem gelieferten Modul.

Entwurf: `3d-print/mounts/pn532-mount/README.md`; Quellen inklusive Original-PDF
und echter Rasterung der Maßzeichnung: `docs/cad/pn532/README.md`.
PCB42,7×40,4, Lochmitten in Zeichnungsorientierung untenlinks(7,4;7,6) und
obenrechts(35,2;32,8). **Ø2,5-Lochdurchmesser ist angenommen**, nicht bemaßt;
zwei M2×25 und rückseitige M2-Muttern vorgeschlagen, keine M2,5-ruthex erzwingen.
Köpfe max.Ø4/Höhe1,5 mm; reale Teile prüfen. Elektronik/Stecker nach innen,
I2C im lokalen Koordinatensystem links; exakte Stecker-/Löthüllen angenommen.

CNC nur außen: Durchbruch47,5×45,2, Glasfalz51,5×49,2×3 mm, R2, Fräser max.Ø4.
Vier Eckführungen mit0,20 mm Spiel/Seite; zwei Holzlaschen vorne/hinten als
Anschlag; 3×12-mm-Senkkopf-Holzschrauben. PCB→3-mm-Scheibe nominal2 mm,
Schraubenkopf→Glas0,5 mm; keine universelle NFC-Abstandsfreigabe. Quellen und
Höhenannahmen im README. Nur lokales Holz-Prüfstück, **kein Gesamtdeckel-Layout**.
Genauer Platz und Drehung zwischen Buttons/NeoPixel/Leisten bleiben offen.

Neue STL/DXF, eigene Mesh-/CNC-/Solid-Prüfungen und echte Ansichten im Mount-
Ordner, Prüfstatus aus frischen Logs lesen. Kein realer Druck-/Passungs-/RF-Test.
**Vor Fertigung offen:** Modul-/Lochabgleich, Löt-/Stecker-/Bauteilhöhen,
Schrauben/Muttern, Führungskalibrierung, Holz-/Glasstärke, Lastprobe und sichere
Scheibenfixierung. Echte Tags mit fertiger Schichtung inklusive Metallnähe testen.
NeoPixel-Rückwandposition und dessen Kabelroute gelten nicht automatisch für NFC.

NeoPixel-Abschluss: `3d-print/mounts/neopixel-stick-mount/README.md` mit allen
Maßen und offenen realen Prüfungen; `cnc-compare.png` zeigt die Randverkleinerung.
Durchbruch 55,2×14,56 mm, Falz 59,2×18,56×3 mm, R2 → Fräser höchstens Ø4 mm.
LED-/Glasabstand unverändert nominal 3 mm. Zwölf Solid-Testfälle einschließlich
21 einzeln geschnittener Einsetzpositionen bestanden; Quellen/SCAD/STL/DXF,
Logs und Bilder sind versioniert. Schrauben max. Kopf-Ø3/Höhe2 mm, reales
BerryBase-Modul gegen freigegebene Adafruit-Basis abgleichen; Scheibenfixierung,
Druck-/Passungs-/Last-/Lichtprüfung bleiben offen. Keine erneute Maßrecherche
zum NeoPixel als Voraussetzung für den separaten NFC-Auftrag aufmachen.

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

**NeoPixel-Stick beauftragt und konstruiert (15.10.2026):**
`3d-print/mounts/neopixel-stick-mount/README.md`. Nutzer akzeptiert ausdrücklich
Adafruit 1426 als Entwurfsbasis und gleicht reales Modul vor Druck ab; NEOPS8-
Identität damit nicht bewiesen. DIN außen links, hinten am Deckel, zwei mittige
Holzlaschen beide vorne. **Kompakte Nutzerkorrektur:** XY-Rand verkleinern,
Einbautiefe beibehalten; der diskutierte 8,5-mm-Lichtspalt ist NICHT übernommen.
CNC nur außen: Durchbruch55,2×14,56 (2,2 mm je PCB-Seite), Glasfalz
59,2×18,56×3 mm (2-mm-Falzrand), R2. Vorige größere Konturen sind überholt.
Kabel kurz links/abwärts im Durchbruch, dann unter dem Holz direkt links,
keine lange senkrechte Schleife/JST-Reserve und keine Kabelausbuchtung.
LED/Glas weiterhin nominal 3 mm, Annahmen im README. Platinenlöcher
Ø2,2 → M2×16 und rückseitige M2-Muttern statt M2,5-ruthex. Reduzierte Köpfe
max. Ø3,0 / Höhe 2 mm erforderlich, konkreter Schraubentyp noch zu prüfen.
Ø3,8 passt nur nominal und ist nach Toleranzprüfung nicht freigegeben.
Muttersitztiefe 3 mm schafft mehr Gewindereserve. Frische STL/DXF und
12 Solid-Fälle digital PASS; Scheibenfixierung, Druck-/Last-/Lichttest und
reale Hardwaremaße offen. Quellen: `docs/cad/neopixel-stick/`.
**Historischer Einstieg; inzwischen PN532-Mount beauftragt und konstruiert, siehe oben.**
BOM und Kernwerte zuerst lesen, tatsächliche Modulversionen/Lochbilder/Stecker prüfen.
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
