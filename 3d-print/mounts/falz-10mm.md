# Rechteckiger Außenfalz — Branch cad/falz-10mm

Nutzerauftrag in dieser Session: separater Worktree von main02671d6,
alle drei Fenster10 mm Rand,3 mm tief, keine Wellen. Anschließende Korrektur:
**einfach viereckig**. Außenfalz und Scheibe deshalb rechteckig ohne Rundung.
Durchbrüche, Einbauhöhen und Druckhalter bleiben unverändert.
Uncommittete Wellenänderungen im ursprünglichen Worktree wurden nicht übernommen.

| Fenster | Falz außen (mm) | Scheibe mit0,2 mm Spiel/Seite (mm) |
|---|---|---|
| TFT |84,8×59×3|84,4×58,6×3|
| NeoPixel |78,4×34,3×3|78×33,9×3|
| PN532 |67,5×65,2×3|67,1×64,8×3|

Rand10 mm ab geraden Durchbruchkanten; an den gerundeten Durchbruchecken
ist mehr Material. TFT: rechteckige Außenkontur umfasst auch die bestehende
JST-Kerbe mit10 mm Rand; oberhalb des Hauptdurchbruchs daher12,14 mm.
Keine zusätzliche äußere Ausbuchtung. Alte Maßtabellen/Bilder in den jeweiligen
READMEs gelten hinsichtlich Falz/Scheibe nicht mehr.

## Vorschauen

- [PN532](falz-10mm-pn532.png)
- [NeoPixel](falz-10mm-neopixel.png)
- [TFT](falz-10mm-tft.png)

Reproduzierbar aus `3d-print/mounts/` mit `falz-10mm-preview.scad`,
Parameter `model="pn532"`, `"neopixel"` oder `"tft"`.

## Frische digitale Prüfung

OpenSCAD2026.09.18, `--hardwarnings`, binäre Panel-STL und nominale DXF
neu exportiert. `check_cnc.py` aller drei Module bestanden: geschlossene,
orientierte Panel-STL, Außenmaße und tatsächliche DXF-Bounds geprüft.
DXF-Prüfer akzeptieren nun auch LWPOLYLINE (neues Exportformat).
`check_fit.py`: TFT und PN532 bestanden; NeoPixel weiterhin **BLOCKED**
wegen Schraubenkopf/angenommener Bauteilpositionen, kein voller Fit-PASS.
Frische Logs je Modul unter `logs/straight-10mm-*.log`.
Diese Tests betreffen primär Halter und lokale Holzstücke, NICHT eine neue
vollständige Layout-/Scheibenfixierungs-/Schraubzonenfreigabe.

## Vor Fertigung offen

- **Wandabstände neu planen:** NeoPixel-Falz überschneidet die unveränderte
  angenommene Rückwandfläche um3,74 mm. PN532-Falz überschneidet die beiden
  angenommenen Wandflächen (PCB-Rand15 mm zur Außenkante, Wand12 mm) um9,4 mm.
  Nicht automatisch gelöst, nur weil Halter/Wand-Test noch PASS meldet!
  Nutzer macht Gesamtdeckellayout, keine Wandposition erfunden/verschoben.
- Größerer Falz reicht in bisherige Holzschraubzonen. Restholz, Schraubenspitzen,
  Scheibenfixierung und Leisten mit realem Layout prüfen; Halter nicht verändert.
- **CNC-Innenecken sind mit rundem Fräser nicht scharfkantig herstellbar.**
  DXF ist die gewünschte rechteckige Nennkontur, keine fertige CAM-Freigabe.
  Ecken nacharbeiten oder Scheibenecken passend zum realen Fräser abrunden;
  reine0,2-mm-Fuge garantiert dort keine Passung.
- Materialstärken, Passung, sichere Scheibenbefestigung und reale Tests bleiben offen.

Keine Änderungen an Firmware, Pins oder Rails. Kein Druck-/Fräs-/Sicherheits-PASS.
