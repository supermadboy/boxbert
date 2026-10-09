# Mount — TPS61023 MiniBoost (Adafruit 4654)

> **VERWORFENER ENTWURF — vom Nutzer ausdrücklich abgelehnt.**
> SCAD, STL und Renderings in diesem Ordner sind keine Druckfreigabe.
> Gewünscht sind ein regelmäßiger Gitterboden und einzelne Abstandspfosten,
> keine erhöhte L-Auflage. Aktuelle Nutzerentscheidungen:
> `hardware/gehaeuse-konzept.md`. Der nachfolgende Text ist die historische
> Beschreibung des vorherigen Agenten; Maßannahmen und behauptete
> mechanische Sicherheit sind nicht bestätigt und müssen neu geprüft werden.

Stand: **09.10.2026** — Beispiel-Mount für das einzelne-Mounts-Konzept.
**Noch nicht gedruckt, nicht auf die reale Platine gelegt, nicht
verschraubt.** Erst Probedruck + Auflegen, dann Einbau.

## Dateien

- `stepup_mount.scad` — parametrisches OpenSCAD-Modell (Quelle der Wahrheit)
- `stepup_mount.stl` — exportiert daraus (22,43 × 30,28 × 7,0 mm)
- `top.png` / `iso.png` — Renderings zur Sichtkontrolle

Neu rendern nach Änderungen:

```
openscad -o stepup_mount.stl stepup_mount.scad
```

## Konzept (Wunsch Daddelbert)

Keine Wände: flache **Gitterplatte (4 mm)**, daraus ragt ein **Post** mit
Heat-Set-Pocket; die Platine wird auf den Post geschraubt und „schwebt"
7 mm über dem Holzboden. Weil die Platine nur **ein** Montageloch hat,
tragen zwei **gleichhohe Stützstege** (L-Form am Post) mit: Platine ruht
auf drei Flächen (Post-Ring, Steg oben, Steg rechts) und ist mit einer
M2,5-Schraube klemmend fixiert. Drehen um die Schraube ist damit
ausgeschlossen; die angelöteten Adern geben zusätzlichen Halt.

## Maßquellen (nichts aus dem Gedächtnis)

| Größe | Wert | Quelle |
|---|---|---|
| Platine | 17,8 × 11,3 mm, H 5,6 mm | adafruit.com/product/4654 |
| Montageloch | **1 × Ø 2,5 (M2,5)**, je 2,54 mm von Lang-/Schmalkante (Ecke diagonal zum Header) | Eagle-.brd, github.com/adafruit/Adafruit-TPS61023-PCB (`MOUNTINGHOLE_2.5_PLATED`) |
| Header JP1 | 4 Pins, 0,1"-Raster, Reihe 2,54 mm von der Gegenseite | ditto |
| SMD-Seite | alle Bauteile **oben**, unten nur Header-Pins | .brd (kein `M`-rot) |
| ruthex RX-M2,5×5,7 | Körper Ø ≈ 4,06, Kragen Ø ≈ 4,6, L 5,7 | offizielles STEP (ruthex CAD-Daten) |

## Abgeleitete Maße im Mount

- **Pocket:** Ø 4,2 mm × 5,8 mm tief (Einsatz flusch mit Post-Oberkante,
  Restboden 1,2 mm) — ⚠ **Pocket-Ø an echtem Einsatz per Probewürfel
  verifizieren** (zu weit = Einsatz dreht, zu eng = geht nicht rein)
- **Platine schrauben:** M2,5 × 7 (M2,5 × 8 würde am Pocket-Boden anstehen)
- **Mount → Holz:** 1 × M4 Zylinderkopf, Durchgang Ø 4,3, Kopf-K-B Ø 7,5 × 2,8
  → in **Einschlagmutter M4** im Holz (Größe beim Einbau bestätigen)
- **Header-Freiraum:** Pin-Spitzen enden bei z ≈ 4,5, Lötpunkte ~5,5 —
  beides über der Platte (4,0), keine Extra-Öffnung nötig. Der rechte
  Stützsteg beginnt erst 2,0 mm oberhalb der Pin-Reihe (Freiraum für den
  Lötpunkt des letzten Pins).
- Platte 22,43 × 30,28 mm; Gitteraussparungen mit ≥ 0,3 mm Stegen.

## Offene Punkte / vor dem Druck

- [ ] Probewürfel: Pocket-Ø 4,2 mit RX-M2,5×5,7 testen
- [ ] Reale Platine (Klon!) auf Post/Steg legen: Lochposition, Header-
  Lage, Platz für Lötstellen — Klon-Abweichungen wie beim MAX98357A
  sind möglich
- [ ] Ein Holzschraubloch = Mount kann theoretisch um die Schraube
  rotieren; praktisch halten Nachbar-Mounts + Flachbandkabel. Falls
  nicht: zweiten Schraubpunkt oder Positionier-Dorn ergänzen
  (Parameter `screw_pos` ist eine Liste — zweiten Eintrag anhängen und
  `holes()` anpassen)
- [ ] Einschlagmuttern M4 für den Boden: Typ/Bohrmaß festlegen und
  Bohrtest an Restholz (Sperrholz neigt zum Aufspalten beim Einschlagen)
- [ ] Druck: PLA reicht; 4 Wände, ~25 % Infill; Post/Pocket nach oben
  drucken (Pocket = offene Bohrung, kein Bridging)
