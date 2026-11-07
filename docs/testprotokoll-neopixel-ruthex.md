# NeoPixel — RX-M2,5×5,7 von oben, 07.11.2026

## Auftrag und Ergebnis

Vorhandene Inserts und **M2,5×12** vom Nutzer bestätigt. Seine reale Probe
mit kleinen Schraubenköpfen von oben am PCB wird anerkannt; genaue Kopfmaße
fehlen. Keine erfundene Kopfkontur oder numerische Kopf-/LED-/Glasfreigabe.

Zwei bisherige Schraubpfosten lokal auf Ø8 bis zur unveränderten PCB-Auflage
z14,77 ausgeführt, ohne Muttertaschen. Insert von oben ohne PCB: Ø4-Aufnahme
6,7 tief bis z8,07, bündiger Einsatz L5,7 bis z9,07, nominal1,7 mm Wand um
max.Ø4,6. Schraubenkanäle Ø2,8 **durchgehend bis unten**, kein Sacklochboden.
M2,5×12 ab PCB oben z16,37 → Spitze z4,37; voller nominaler Einsatz erreicht.
Genaues Toleranzbudget und Montagefolge im Mount-README.

Lochmitten(13,7;7,7)/(39,7;7,7), PCB-Ebene, mittlerer Bereich/Loch, sonstige
Form, Holzlaschen, Kabelausgang und CNC unverändert. Die lokale Verstärkung
der zwei dünnen Hälse ist für die Insertwand nötig; keine Änderung des CNC-
Ausschnitts oder der äußeren Halter-Bounds.

## Tatsächliche digitale Prüfungen

Reproduktion: `bash 3d-print/mounts/neopixel-stick-mount/render.sh` vom Repo-Root.
Explizit gepinntes OpenSCAD2021.01/CGAL, Xvfb/Mesa, vorhandene Pythonchecker
und neuer Node-JS-Solidprüfer. Vollständiger Export-/Prüf-/Renderlauf **Exit0**.
Anschließend nur Kameraabstand für unbeschnittene Explosions-/Innenansicht
erhöht, beide PNG erneut gerendert und Shellcheck wiederholt; keine Geometrieänderung.

Rohlogs unter `3d-print/mounts/neopixel-stick-mount/logs/`:

| Nachweis | Tatsächliches Ergebnis |
|---|---|
| `mesh-check.log` | **5772 Dreiecke**, geschlossen/orientiert/zusammenhängend/nicht degeneriert, Volumen **3997,343 mm³**, Bounds64×27,9×16,5;16 Material-/Lochproben PASS |
| `insert-red.log` | Anforderung scheitert am Vorgänger erwartungsgemäß: **48,890847 mm³** blockierte Aufnahme |
| `insert-check.log` | **6 Node-Testgruppen,6 bestanden,0 fehlgeschlagen** |
| Aufnahmen / Durchgänge / Zugang | Beide Seiten jeweils **0,000000 mm³** Schnitt |
| Künstlicher Kanalboden | Gegenprobe beide Seiten **2,424048 mm³** Schnitt, erkannt |
| Voller Wandring | Beide Seiten **0,000000 mm³** fehlendes Material |
| Absichtlich falsche Wandhülle | Gegenprobe **71,262333 /71,262337 mm³**, erkannt |
| Formvergleich zum Vorgänger | Außerhalb zweier Ø8,02-Prüfzylinder hinzugefügt/entfernt jeweils **0,000000 mm³** |
| CNC-Dateien | Alle drei aktiven DXF und aktive Holz-STL bytegleich zum Vorgänger |
| Frischer CNC-Holzexport | Beidseitiger Differenzkörper zur aktiven Datei jeweils **0,000000 mm³**; Mesh/Volumen/Konturen geprüft |
| `fit-check.log` | Holz/PCB/Kabel/Referenzwand/Glas jeweils **0,000000 mm³** Schnitt |
| Seiten-/Tiefengegenproben | x **4,477166**, y **5,104947**, zu tief **142,677910 mm³**, erkannt |
| `fit-insertion.log` | **21 getrennte Vollkörper-Einsetzlagen z−20…0**, alle leer; diskrete1-mm-Stichproben, kein kontinuierlicher Sweep |
| `shell-check.log` | `bash -n` und gepinntes `shellcheck`: PASS |

Schwelle für Schnitt-/Fehlvolumen **0,001 mm³**; Kontakt-Rückzüge und
Ø8-Werkzeug-Prüfhülle im Prüfer/README dokumentiert. Die Ø8-Hülle ist keine
Messung der realen Lötkolbenspitze. Der Messing-Maximaldurchmesser beschreibt
den eingebauten heißen Insert, keinen kalten Durchstecktest durch Ø4.

CGAL sortierte den frischen Holz-STL-Export anders. Deshalb bleibt die aktive
CNC-STL bytegleich; der frische Export liegt ignoriert in `.cad-check/` und
wird als Solid und Mesh statt über die Dreiecksreihenfolge verglichen.
Eine zeitlich begrenzte Werkzeugausführung wurde durch einen länger laufenden
getrackten Renderprozess ersetzt; dessen vollständiger Abschluss war Exit0.

## Sichtprüfung / Grenzen

Echte PNGs neu gerendert und angesehen: Übersicht mit/ohne transparenter PCB,
gerader beschrifteter Höhenschnitt, Draufsicht, Explosion, Innen-/Außenansicht.
Goldene Inserts, graue nominelle Schraubenschäfte ohne erfundene Köpfe im
Höhenschnitt. Übersicht und Höhenbeschriftung lesbar/unbeschnitten;
Explosion und lokales Holzstück nach Kamerakorrektur vollständig im Bild.

Keine Dienste/Root/Ports/Flakes geändert. Neuere Remote-PN532-/Firmware-Commits
per Fast-forward übernommen; der rein dokumentarische Konflikt in
`docs/mounts-weiterarbeit.md` wurde als **getrennte Absichten** aufgelöst:
PN532-Abschnitt vollständig erhalten, NeoPixel-Abschnitt zusätzlich erhalten.
`AGENTS.md` blieb unverändert: die Schreibschutzregel untersagte den
Aktualisierungsversuch; aktuelle Nutzerkorrektur steht in den Fachdateien.

**Offen, nicht als eigener physischer Test behauptet:** FDM-/Heat-Set-/Klemm-/
Last-/Lichtprobe, genaue Kopfhülle/Glasfreiheit, echtes Holz/Glas und sichere
Scheibenfixierung. Die bekannte Holzschrauben-/Wellenfalzreserve bleibt
unverändert und wurde nicht ungefragt umkonstruiert. Keine Gesamtfertigungs-
oder Kindersicherheitsfreigabe aus dem digitalen Ergebnis ableiten.
