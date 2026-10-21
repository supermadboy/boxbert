# ESP / Feather — festgehaltener Druck- und CNC-Dateistand

Aktueller Dateistand nach bestätigtem Wellenfalz: Falz und Scheibe neu
exportiert, Durchbruch und Druck-STL unverändert. CNC-/Mesh-Prüfungen erneut
ausgeführt, Ergebnisse `logs/wave-cnc-check.log`. Maßgeblich für Konstruktion und offene
Prüfungen bleibt `README.md`. Keine physische Passungs-/Sicherheitsfreigabe.

## Zu verwendende Dateien (alle im selben Ordner)

| Zweck | Datei |
|---|---|
| 3D-Druck, nur Kunststoffhalter | `feather_window_mount.stl` |
| CNC-Durchbruch | `cnc-opening.dxf` |
| CNC-Glasfalz außen | `cnc-rebate.dxf` |
| Plexiglas-Kontur | `cnc-glass.dxf` |

`front_cnc.stl` ist das Holzmodell, **nicht** der Druckhalter.
Die alte `archive/two-sided-superseded/cnc-pocket.dxf` nicht verwenden.

## Maße und Bearbeitung

- Feather-Platine: 50,8 × 22,86 mm, ohne Stecker/Kabel.
- Druckhalter gesamt: 64,4 × 70,86 × 26,5 mm, inklusive Holzlaschen.
- Grunddurchbruch: 64,8 × 36,86 mm, R3, plus JST-Kabelausbuchtung.
- Äußerer Glasfalz: Wellenkontur,Hülle84,8 × 58,995 mm,3 mm tief in12-mm-Holz.
- Plexiglas-Vorschlag: gewellt,Hülle84,4 × 58,595 × 3 mm,0,2 mm Konturspiel.
- Wellenberge10 mm / Täler4 mm zum tatsächlichen Durchbruch inklusive JST-Auslass.
- Neue Ansichten `wave-top.png`, `wave-iso.png`; alte Rechteckfalz ist überholt.
- CNC nur von außen, keine Innentasche/kein Wenden. Maximal Ø4-mm-Fräser
  wegen R2 am Kabelauslass. Sinnvoll erst Falz, dann Durchbruch.
- DXF sind Nennkonturen in mm, kein G-Code: CAM, Werkzeugkorrektur,
  Zustellungen, Aufspannung und Ausbruchstrategie noch festlegen.
- USB-Aussparung macht Daddelbert von Hand mit dem tatsächlichen Stecker.

## Randabstände zur Layoutplanung

Laschen ragen auf den beiden Seiten quer zur langen Platinenachse je 17 mm
über die Grunddurchbruchkante hinaus. Entlang der langen Platinenachse liegt
der Halter knapp innerhalb der Grunddurchbruchkontur.

Bei angrenzender 12-mm-Gehäusewand als Planungswert ab **Grunddurchbruchkante
bis Plattenaußenrand**: an den Laschenseiten mindestens 32 mm
(17 mm Lasche + 12 mm Wand + 3 mm Luft); an den anderen Seiten etwa 16 mm.
Das sind keine geprüften Gesamtgehäuse-Abstände: USB-Stecker, Kabelabgänge,
Leisten und benachbarte Teile zusätzlich berücksichtigen. Beim Drehen des
Halters drehen sich diese Abstände mit.

## Vor endgültiger Montage offen

- Probedruck/Passprobe für Führungen und Heat-Set-Einsätze; Druckorientierung
  und Support für erhöhte Laschen festlegen.
- Reale Display-/Header-/Steckerhöhen messen: 2 mm TFT–Glas sind nominal
  mit angenommenen Bauteilhöhen. BOOT/RESET und andere Taster frei halten.
- Schraubenköpfe, Gewindeeingriff und Holzbefestigung prüfen;
  M2,5×25 für PCB nur Längenbeispiel, keine bestätigte Passung.
- Sichere Glasfixierung festlegen; Falz allein verhindert kein Herausfallen.
- USB-Stecklast, Passung und Festigkeit real prüfen. Elektronik beim
  Einschmelzen der Einsätze nicht montiert lassen.

## SHA-256 der festgehaltenen Exporte

```text
987df103b78a0035658ee3f6b1629a73509cdc52ff826f91b510185bc117985c  feather_window_mount.stl
b77075b2b208d0b27f71809e3f5d6b54ba9fa2dd1e1bb24c3a7c89b2d29f3615  cnc-opening.dxf
501a333c322e3a70a8ca75807a7dfb99c56647f89b2b94b7cf08eda6d12911c7  cnc-rebate.dxf
4337a35a1c86fb753c82bdf03e51d068093592719fe7c1620d2d8bce09c00e08  cnc-glass.dxf
```
