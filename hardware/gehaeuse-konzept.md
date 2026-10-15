# Gehäuse und Modulbefestigung — Nutzerentscheidungen

Grundlage: ausdrückliche Entscheidungen des Nutzers im Chat zur
Gehäuse-/3D-Druckplanung. Dies ist ein Aufbaukonzept, kein Nachweis eines
bereits gebauten oder getesteten Gehäuses.

## Holzbox

- **Außenmaße: 250 × 180 × 110 mm** (25 × 18 × 11 cm).
- Vorderseite, Rückseite sowie linke und rechte Seite bilden den Rahmen.
- **Deckel und Boden werden angeschraubt**, damit beide zum Arbeiten und
  Warten abnehmbar bleiben. Kein fest verleimter Deckel/Boden vorgesehen.
- **Entschieden 09.10.2026: 12 mm Pappelsperrholz** für Rahmen, Deckel und
  Boden. Leicht und für diese kleine Box geeignet; weicher als Birke,
  deshalb Schrauben vorsichtig anziehen. Noch keine Beschaffung bestätigt.
  Tatsächliche Plattenstärke, Zuschnitt/Fugen und nutzbare Innenmaße vor
  Fertigung prüfen; Innenleisten/Module verringern den verfügbaren Raum.
- Scharniere sind nicht beschlossen; der Nutzer beschreibt einen
  abschraubbaren Deckel.

## Räumliche Anordnung

| Bereich | Geplante Teile |
|---|---|
| Deckel | Buttons, PN532-NFC-Reader, NeoPixel; Befestigung am Holz |
| Boden links | Anschlussstelle des Flachbandkabels, AW9523-Expander, Step-Up, Terminalblöcke für GND und 5-V-Versorgung |
| Boden rechts | Verstärker und SD-Modul |
| Zwischen den beiden Bodenbereichen | Akku |
| Rückseite | Lautsprecher |
| Vorderseite | ESP32-S3 Reverse TFT Feather |

Deckel und Unterteil werden über ein **Flachbandkabel** verbunden. Typ,
Stecker, Aderzahl, Länge, Belegung, Strombelastbarkeit und Zugentlastung
sind noch festzulegen. Die Anordnung legt keine elektrischen Rails oder
Pins neu fest: dafür gelten `hardware/pinout.md`,
`hardware/verkabelung-endaufbau.md` und `docs/power-plan.md`.

## Lautsprecher-Einbau — Entscheidung aus dem Chat

Der Lautsprecher bleibt an der **Rückseite**. Vor seiner Schallöffnung wird
statt eines separaten sichtbaren Gitters ein dichtes Raster aus **2-mm-Bohrungen**
im Holz vorgesehen. Die Rückwand wird in diesem Bereich **von innen dünner
gefräst**, damit keine langen engen Schallkanäle durch die volle Holzstärke
entstehen. Die Befestigung liegt außerhalb der Ausfräsung im vollen Holz;
dünnes Schaumstoffband um die Schallöffnung soll Klappern verhindern.
Nutzer hat diesem Vorgehen zugestimmt. Rasterfläche/-abstand, verbleibende
Wandstärke und Schrauben sind noch festzulegen; Hörvergleich am Reststück
vor der fertigen Rückwand empfohlen. Keine Bau-/Klang-/Sicherheitsabnahme.

## Gewünschte 3D-Druck-Mounts

**Entschieden: einzelne Mounts statt einer gemeinsamen Elektronik-Tray.**
Der Step-Up war das erste Beispiel und wurde neu entworfen. Der Nutzer
hat die aktuelle Senkkopf-Version am 09.10.2026 nach Vorschau ausdrücklich
positiv bewertet; keine physische Druck-/Passungsabnahme.
**GPIO-Expander AW9523 / ADA4886: kompletter Neustart beauftragt
09.10.2026**, nachdem der Nutzer den ersten Entwurf verworfen hat.
Neuer Konzeptvorschlag in `3d-print/mounts/aw9523-mount/`: Gitter,
vier einzelne Auflagen, zwei gestufte Gewindepfosten mit vollen Wänden.
**Abweichungen noch NICHT bestätigt:** ruthex-Einsätze von unten statt
bündig oben, zwei seitliche Holzschrauben. STL digital geprüft, keine
Druck-/Passungsabnahme. Vorgänger im Archiv, nicht als Vorlage verwenden.
Übergabe/Prüfstand in `docs/mounts-weiterarbeit.md` und
`docs/testprotokoll-aw9523-mount.md`.
Weitere vom Nutzer genannte Modul-Mounts: SD-Modul und Verstärker.
Für den Feather liegt inzwischen der passgeführte Fenster-Vorschlag vom
15.10.2026 vor (Abschnitt unten); Lautsprecher- und Deckel-Mounts bleiben offen.

Das gewünschte Grundprinzip:

1. Kleine flache Grundplatte mit einem **echten, regelmäßigen,
   durchbrochenen Gitterboden** zum Materialsparen. Gemeint ist der Boden
   des gedruckten Mounts, nicht ein Gitter als Holzboden der Box.
2. **Keine Gehäusewände, keine Mulde und keine erhöhte L-Auflage.**
3. Aus dem Gitterboden ragen **einzelne Abstandspfosten** heraus.
4. In die Pfosten werden Heat-Set-Gewindeeinsätze mit dem Lötkolben
   eingeschmolzen. Die **Pfosten**, nicht die Einsätze, sollen herausragen;
   die Einsätze sind bündig in den Pfosten vorgesehen.
5. Die Platine wird auf die Pfosten geschraubt und sitzt mit Luftabstand
   über dem Gitterboden ("schwebend").
6. Für den Step-Up-Mount genügt dem Nutzer zunächst **ein Schraubenloch
   zur Befestigung am Holz**. **Entschieden 09.10.2026: Holzschraube
   3 × 12 mm mit Senkkopf**, kein metrisches M3-Gewinde und kein M4.
   Fabrikat/Kopf-Istmaß und Vorbohrung am Restholz noch prüfen.
7. Lokale Materialverstärkungen um Pfosten und Befestigungsloch dürfen
   das regelmäßige Gitter ergänzen. Abmessungen und Höhen werden erst im
   neuen Entwurf abgestimmt, nicht vom alten Modell übernommen.

**Bestellt laut Nutzer:** ruthex **RX-M2,5×5,7**.
Hersteller-Einbauzeichnung am 09.10.2026 geprüft: Einbauloch **Ø 4,0 mm**,
Mindestlochtiefe **6,7 mm** (L + 1 mm), Mindestwandstärke **1,6 mm** radial.
Quelle und Zeichnung in `3d-print/mounts/stepup-mount/README.md`.
Ein Passungs-Probedruck ist noch nicht durchgeführt.

## Verstärker-Mount — Vorschlag 09.10.2026

Nutzer hat einen Expertenvorschlag beauftragt und möchte anschließend
ansehen: `3d-print/mounts/max98357-mount/`, 38 × 26 × 12 mm,
2-mm-Gitter, zwei gestufte Schraubpfosten und zwei massive Stützen.
**Vorschlag, noch nicht sichtabgenommen:** zwei ruthex-Einsätze von unten
und zwei seitliche Senkkopf-Holzschrauben. STL/Quellen digital PASS, sechs
Vorschauen angesehen; keine Druck-/Passungsabnahme. Reale Lot-/Stecker-,
Insert-/Last-, Schrauben-/Holzpassung offen.
Nutzerfotos/-bestätigung passen zum bestellten ADA3006, alte Klon-Deutung
widersprochen. Original-Mono-PCB: 17,78 × 19,05 mm, zwei Ø2,5-Löcher
im Abstand 12,70. Details: Mount-README und
`docs/testprotokoll-max98357-mount.md`. Vorhandene Mounts unverändert.

## Step-Up-Konzeptfreigabe / neuer Entwurf — 09.10.2026

Der Nutzer hat im Chat ausdrücklich zugestimmt: **ein Schraubpfosten unter
dem vorhandenen Montageloch plus zwei kleine, massive Stützpfosten mittig
unter der Platine**, weg von der gelöteten Anschlussreihe. Die beiden
Stützpfosten bekommen keine Gewindeeinsätze. Alle drei sind gleich hoch;
keine Wände, keine L-Auflage. Nach der Senkkopf-Anpassung wurde auch die
neue digitale Form vom Nutzer ausdrücklich gelobt. Konzept-/Sichtbestätigung
ist keine Maß-/Druckpassungs- oder Belastungsprüfung am realen Aufbau.

Neu aufgebauter Entwurf: `3d-print/mounts/stepup-mount/` mit SCAD, STL und
Vorschauen auch mit transparenter Platine. Entwurfsmaß 26 × 32 × 10 mm,
2-mm-Gitterboden, 4-mm-Zellen/2-mm-Rippen, 8 mm Pfosten über Gitteroberseite.
**Nach Nutzer-OK für 3 × 12 mm Senkkopf-Holzschraube angepasst:**
Durchgang Ø 3,2 mm, Senkung Ø 6,2 mm / 90° / 1,5 mm tief. Nur das lokale
Ø-8-mm-Schraubpolster ist jetzt insgesamt 3,5 mm dick, das Gitter bleibt
2 mm dick. Unter der Senkung bleiben 2 mm Material. Kopfmaß und Winkel
sind CAD-Annahmen für einen Kopf um Ø 6 mm, am konkreten Fabrikat prüfen.
Nominal bei bündigem Kopf: 8,5 mm Holzeingriff, 3,5 mm Reserve nach außen
bei 12-mm-Holz; nicht gemessen, kein pauschaler Sicherheitsnachweis.
Hersteller-PCB bestätigt ein Montageloch Ø 2,5 mm; Hersteller-Unterseitenfoto
zeigt keine aufgesetzten Bauteile, beweist aber nicht die Höhe der realen
Lötstellen.

Die Stützpfosten sind keine formschlüssige Verdrehsicherung. Schraubklemmung,
Lötstellenfreiraum und Druckpassung müssen am realen Aufbau geprüft werden.
Prüfstand: `docs/testprotokoll-stepup-mount.md`.

## Feather-Fenster — aktuelle Außenfräs-Version 15.10.2026

Nutzerkorrektur: **CNC ausschließlich von außen**, Durchbruch und äußere
Glasfalz. Keine Wendeaufspannung, keine Innentasche. Noch nichts gefertigt.
Vier Eckführungen des Druckteils greifen mit nominal 0,20 mm Spiel je Seite
4,5 mm in den Durchbruch. Holzlaschen bilden den Tiefenanschlag; sie sitzen
3,2 mm hinter der PCB-Auflage. Nominal **2 mm TFT→Plexiglas**, Bauteilhöhen
noch nicht gemessen. Größerer Durchbruch/Glasfalz ersetzen die Innentasche.

Feather, Dupont und nach USB-Prüfung Akku außerhalb vormontieren, dann
Einheit von innen einsetzen und mit Handwerkzeug verschrauben. Eingebaut
kein Steckzugang erforderlich, zur Wartung ausbauen. Kabel nicht quetschen.
CAD, Maße, Exporte und Prüfungen: `3d-print/mounts/feather-window-mount/`.

**USB-Aussparung fertigt Daddelbert von Hand**, sie gehört nicht zur CNC.
Die angenommene direkte Steckerroute kollidiert ohne diesen manuellen Schritt
noch mit Front-Holz; der digitale Test weist dies bewusst aus. Freigängigkeit
am realen Stecker prüfen. Glasfixierung, reale Passung, Header-/Tasterhöhen und
Lastprüfung bleiben offen. Ältere positive Prüfungen der zweiseitigen Variante
gelten nicht als Freigabe für das neue Ladeport-Layout.

NeoPixel ist inzwischen als Vorschlag gebaut:
`3d-print/mounts/neopixel-stick-mount/README.md`. DIN links von außen,
beide Holzlaschen vorne mittig, Rückwand ohne Laschen. Nutzer akzeptiert
Adafruit 1426 als Entwurfsbasis, Modulabgleich vor Druck noch offen.
Nutzerkorrektur: kleinerer XY-Rand statt anderer Einbautiefe. CNC nur außen:
Durchbruch55,2×14,56 / Falz59,2×18,56×3, R2; LED-Luft bleibt nominal 3 mm.
Links nur kurzer Kabelübergang unter das Holz, keine große Steckertasche.
Ø2,2-Platinenlöcher erfordern M2-Schrauben/M2-Muttern, keine M2,5-ruthex.
Digital geprüft, keine Druck-/Last-/Optikfreigabe; Scheibenfixierung offen.
PN532-MOD bleibt nur angekündigt. Übergabe in `docs/mounts-weiterarbeit.md`.

## Weitere offene mechanische Fragen

- Akku: sichere, austauschbare Befestigung ohne Quetschung des LiPo-Pouchs.
  Wanne oder Bügel wurden erwogen, aber noch nicht entschieden.
- Mount-Holzbefestigung ist als 3 × 12 mm Senkkopf-Holzschraube in
  12-mm-Pappel beschlossen; reale Kopfpassung, Ist-Holzstärke, Vorbohrung
  und Halt am Reststück prüfen. Von Hand anziehen, nicht überdrehen;
  Bohrtiefe begrenzen und keine Spitze durch die Außenseite.
  Heat-Set-Einsätze bleiben für die gedruckten Platinenpfosten vorgesehen.
- Wiederholt abnehmbarer Deckel/Boden: innenliegende Befestigungsleisten
  empfohlen statt wiederholt in schmale Sperrholzkanten zu schrauben.
  Leisten, Verbindung und Schrauben sind separat noch zu planen.
- Modul-Lochbilder und Freiraum unter der real vorhandenen Platine prüfen.
  Bei nur einem Platinenloch erforderliche Unterstützung vorab abstimmen,
  keine L-Stege eigenmächtig ergänzen.
- Kabel und Lötstellen nicht als mechanische Halterungen auslegen.
- USB-/Display-/SD-Zugänglichkeit, NFC-Einbauposition und Schraubzugang
  müssen beim Layout geprüft werden.
- Kindersicherheit nach `AGENTS.md`: Akku fest und kurzschlussgesichert,
  keine scharfen Kanten, Befestigung von innen/hinten; Schrauben dürfen
  nicht durch die Holzaußenseite treten.

## Bisheriger Step-Up-Entwurf: ausdrücklich abgelehnt

`3d-print/mounts/stepup-mount/archive/rejected-2026-10-09/` enthält eine
unveränderte Kopie des bisherigen Entwurfs (SCAD, STL, Bilder und bereits
als verworfen markierte README). Der Nutzer hat ihn nach
Sichtprüfung **abgelehnt**: kein gewünschtes regelmäßiges Gitter, stattdessen
unregelmäßige Öffnungen und eine erhöhte L-Auflage.

- Nicht als freigegebenes Muster für weitere Mounts verwenden.
- **4 mm Bodenstärke, 7 mm Gesamthöhe, M4-Holzbefestigung, Pocket Ø4,2 mm
  und die vorgeschriebene Schraubenlänge sind nicht freigegeben.**
- Weder Hersteller-Einbaumaß noch mechanische Passung sind durch den alten
  Entwurf nachgewiesen. Er wurde durch den oben beschriebenen Neuaufbau
  ersetzt; dessen reale Druck-/Passungsprüfung bleibt offen.
