# Feather-Fenster / CNC-Front — digitale Prüfung 15.10.2026

## Auftrag und Grenzen

Front noch nicht gefertigt. CNC-Tasche und Druckträger gemeinsam entwerfen:
selbst ausrichtend, Tiefenanschlag, innen Handverschraubung. Vormontierte
Dupont-/Akkuverbindungen müssen eingebaut nicht erreichbar sein. Umsetzung:
`3d-print/mounts/feather-window-mount/`, dort Maße und offene Hardwareprüfungen.

Kein Druck, kein Holz gefräst, keine reale mechanische Abnahme.

## Tatsächlich ausgeführt

- `verify_source.py`: Original-Eagle-Kontur, vier Löcher (2×Ø2,5 / 2×Ø2,2),
  Header und TFT-Footprint erneut extrahiert; keine Änderung der Quelldatei.
- Neue Führungsprüfung schlug vor dem CAD-Umbau wie beabsichtigt mit
  `RuntimeError: New pocket locating corner` fehl, danach PASS.
- Dupont-Steckerhüllenprüfung deckte die alte zu niedrige Standoff-Geometrie
  auf: `RuntimeError: Dupont housing lower outer corner`. Rückwärtigen
  Abstand vergrößert, Displaylage relativ zur Holzfront unverändert; danach PASS.
- Neue Prüfung Anschlussräume gegen Holz fand zuerst 681,400192 mm³
  Schnittmenge. USB-Kanal und JST-Ausbuchtung ergänzt; danach 0,000000 mm³.
- CGAL-STL-Export des Trägers: **7236 Dreiecke**, geschlossen,
  konsistent orientiert, eine zusammenhängende Oberfläche, keine degenerierten
  Dreiecke. Bounds −6,8/−24/0 bis 57,6/46,86/25 mm.
- Front-STL: **1040 Dreiecke**, geschlossen/orientiert; Bounds −24/−43,57/22
  bis 226/66,43/34 mm. Geprüfte 250×110×12-mm-Hülle.
- Vier echte DXF-Exporte; Nennkontur-Bounds im gemeinsamen mm-System geprüft.
- Alle zwölf PNG-Vorschauen tatsächlich gerendert und visuell angesehen.
  Innenansicht für gute Beleuchtung gewendet; Fräskoordinaten bleiben unverändert.
- `bash -n render.sh` und `shellcheck render.sh` bestanden.

## CGAL-Schnittmengen / echte Gegenproben

| Prüffall | Schnittvolumen [mm³] | Erwartung |
|---|---:|---|
| Sollposition, 0,001 mm Kontaktabstand | 0,000000 | frei |
| 5 mm vor Anschlag | 0,000000 | frei |
| 0,5 mm in x verschoben | 11,245892 | Kollision erkannt |
| 0,5 mm in y verschoben | 11,245895 | Kollision erkannt |
| 0,5 mm über Anschlag hinaus | 262,243685 | Kollision erkannt |
| Träger gegen PCB | 0,000000 | frei |
| Träger gegen angenommene Dupont-Hüllen | 0,000000 | frei |
| Träger gegen angenommene USB-/JST-Räume | 0,000000 | frei |
| Front gegen angenommene USB-/JST-Räume | 0,000000 | frei |

Die 0,001-mm-Rücksetzung vermeidet Nullstärken-Kontaktflächen im CGAL von
OpenSCAD 2021.01. Keine reale Passungsgarantie. Hüllen: Dupont 2,6×2,6×14 mm,
USB 25×12×6 mm, JST/Kabel 10×20×8 mm; keine Nutzer-Messwerte. Kabelbewegung,
Headerhöhe, Handhabung und separate Seitenwand nicht vollständig simuliert.

## Server / Reproduktion

Anfangs etwa 16 GB frei, nach CAD-Werkzeugen etwa 15 GB frei. Kein Root,
kein Eingriff in Minecraft oder Systemdienste, keine Ports geöffnet.
Nixpkgs-Revision im Render-Skript gepinnt; `flake.lock` unverändert.

OpenSCAD 2021.01 + CGAL exportierten STL direkt. PNGs scheiterten zuerst mit
`Can't create OpenGL OffscreenView` und anschließend `glXChooseFBConfig failed`.
Gelöst mit Xvfb, Mesa 26.1.5 und **vor Xvfb-Start** gesetzten Library-/DRI-Pfaden.
Diese Umgebung gilt nur im Render-Prozess; `render.sh` reproduziert sie.

Prüflogs im Mount-Ordner. Reproduktion vom Repo-Root:

```bash
python3 docs/cad/feather-window/verify_source.py
bash 3d-print/mounts/feather-window-mount/render.sh
```

**Vor Fertigung offen:** reale Stecker-/Header-/Bauteilhöhen, Kopf-/Gewindepassung,
Druck-/Restholz-Passprobe und Restverdrehung, längere PCB-Schrauben, Pfosten- und
Heat-Set-Belastung, Glasfixierung sowie USB-Öffnung der rechten Seitenwand.
