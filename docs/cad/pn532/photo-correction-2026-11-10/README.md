# PN532 — Nutzerfotos zur Außenansicht vom 10.11.2026

Diese drei Originalaufnahmen wurden vom Nutzer im Telegram-Chat bereitgestellt.
Sie dokumentieren Ist- und Sollanordnung, keine Millimetermaße oder reale
Fertigungsabnahme. Die Originale liegen hier dauerhaft statt nur im Agenten-Cache.

- `old-mount-underside.jpg` (ursprünglich `img_96e162ba6210.jpg`): alter leerer
  Halter von unten. Die Lasche beim Button ist die später zu verlegende Lasche.
- `wrong-pcb-orientation.jpg` (ursprünglich `img_3b57961b9cd2.jpg`): vom Nutzer
  ausdrücklich als **falsch** bezeichnete Außenansicht mit PCB-Rückseite;
  vier lange Pins unten, acht rechts. Keine Sollvorlage.
- `desired-exterior-component-side.jpg` (ursprünglich `img_864b6372ad1a.jpg`):
  bestätigte Soll-Außenansicht mit Buttonkappen, Bauteilseite zum Plexiglas,
  vier Anschlüssen links, acht oben und PCB-Löchern obenlinks/untenrechts.
  Der abgebildete alte Halter ist dabei **nicht** die gewünschte Laschengeometrie.

## Zugehörige Nutzerkorrektur

In der letzten Sollansicht soll die untere, vorher beim blauen Button sitzende
Holzlasche entlang der **Unterkante nach rechts**, so weit wie sinnvoll möglich,
verschoben werden. Sie bleibt nach unten gerichtet. Die linke obere Lasche bleibt
links. Inserts werden bei abgenommener PCB von der späteren PCB-Auflageseite
angesetzt, nicht durch die Platine eingeschmolzen.

Die neue Geometrie setzt die untere Schraubenmitte auf (38,4;−10) im Foto-XY;
das ist ein relatives CAD-Limit unter Beibehaltung von Laschenhals und Führung,
kein aus dem Foto gemessener Buttonabstand. Elektronik zum Glas, Gitter und
lange Stifte dahinter ins Gehäuse. Die CNC-/Glaskonturen bleiben unverändert.

Aktueller Entwurf und offene Passproben:
[`3d-print/mounts/pn532-mount/README.md`](../../../../3d-print/mounts/pn532-mount/README.md).
Digitale Nachweise: `3d-print/mounts/pn532-mount/logs/photo-exterior/`.
Der Glasabstand von vorläufig5,5 mm beruht auf einer angenommenen Bauteilhöhe,
nicht einer realen Messung. Reale Montage-, Höhen-, Festigkeits- und RF-Prüfung
bleiben offen.

Die aktuelle Referenz ist auch in `AGENTS.md` verankert. Die modulspezifischen
READMEs und `docs/mounts-weiterarbeit.md` dokumentieren die maßgeblichen
Revisionen für PN532 (10.11.) und NeoPixel (07.11.).
