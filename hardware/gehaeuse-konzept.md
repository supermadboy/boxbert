# Gehäuse und Modulbefestigung — Nutzerentscheidungen

Grundlage: ausdrückliche Entscheidungen des Nutzers im Chat zur
Gehäuse-/3D-Druckplanung. Dies ist ein Aufbaukonzept, kein Nachweis eines
bereits gebauten oder getesteten Gehäuses.

## Holzbox

- **Außenmaße: 250 × 180 × 110 mm** (25 × 18 × 11 cm).
- Vorderseite, Rückseite sowie linke und rechte Seite bilden den Rahmen.
- **Deckel und Boden werden angeschraubt**, damit beide zum Arbeiten und
  Warten abnehmbar bleiben. Kein fest verleimter Deckel/Boden vorgesehen.
- Holzart, Wand-/Bodenstärke und daraus folgende Innenmaße sind noch offen.
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

## Gewünschte 3D-Druck-Mounts

**Entschieden: einzelne Mounts statt einer gemeinsamen Elektronik-Tray.**
Zunächst wird ausschließlich ein Beispiel für den Step-Up entworfen.
Weitere vom Nutzer genannte Modul-Mounts: Expander, SD-Modul und Verstärker.
Befestigungsdetails für Feather, Lautsprecher und Deckelmodule sind noch
nicht als konkrete 3D-Druckteile beschlossen.

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
   zur Befestigung am Holz**. Schraubentyp/-größe und Kopfaufnahme sind
   noch offen; M4 ist keine Nutzerentscheidung.
7. Lokale Materialverstärkungen um Pfosten und Befestigungsloch dürfen
   das regelmäßige Gitter ergänzen. Abmessungen und Höhen werden erst im
   neuen Entwurf abgestimmt, nicht vom alten Modell übernommen.

**Bestellt laut Nutzer:** ruthex **RX-M2,5×5,7**.
Hersteller-Einbauempfehlung für Bohrdurchmesser und Mindestlochtiefe noch
verifizieren; ein Passungs-Probedruck ist noch nicht durchgeführt.

## Weitere offene mechanische Fragen

- Akku: sichere, austauschbare Befestigung ohne Quetschung des LiPo-Pouchs.
  Wanne oder Bügel wurden erwogen, aber noch nicht entschieden.
- Befestigung des Mounts am Holz: Holzschraube oder geeigneter
  Holz-Gewindeeinsatz, Bohrmaß und Schraubenlänge erst nach Holzstärke
  festlegen. Heat-Set-Einsätze sind für die gedruckten Pfosten vorgesehen.
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

`3d-print/mounts/stepup-mount/` enthält den bisherigen Entwurf des
vorherigen Agenten (SCAD, STL, Bilder, README). Der Nutzer hat ihn nach
Sichtprüfung **abgelehnt**: kein gewünschtes regelmäßiges Gitter, stattdessen
unregelmäßige Öffnungen und eine erhöhte L-Auflage.

- Nicht als freigegebenes Muster für weitere Mounts verwenden.
- **4 mm Bodenstärke, 7 mm Gesamthöhe, M4-Holzbefestigung, Pocket Ø4,2 mm
  und die vorgeschriebene Schraubenlänge sind nicht freigegeben.**
- Weder Hersteller-Einbaumaß noch mechanische Passung sind durch den alten
  Entwurf nachgewiesen. Neuplanung und Konzeptabstimmung erforderlich.
