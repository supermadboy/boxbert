# MAX98357A-Mount — Quellenprüfung 09.10.2026

Nutzer bestätigt: fotografiertes Modul ist das online bestellte Modul
(Bestellreferenz ADA3006). Fotos aus `~/Downloads`, hier als user-top.jpg
und user-bottom.jpg gesichert. Herstellerfoto 3006-04.jpg tatsächlich
angesehen: Silkscreen, Bauteilanordnung, Schraubklemme und zwei Montagelöcher
stimmen visuell überein. Alte Klon-/schwarz-Einordnung im Etappe-1-Protokoll
ist damit widersprüchlich und nicht als mechanische Grundlage geeignet.
Dies ändert keine bestätigte Verdrahtung und schreibt historische Versuche
nicht rückwirkend um. Keine zusätzliche Echtheitsprüfung.

## Herstellerdaten

Quelle: https://github.com/adafruit/Adafruit-MAX98357-I2S-Amp-Breakout
Datei `Adafruit MAX98357 Breakout.brd` (Mono, nicht Stereo rev B).
Git-Blob laut GitHub-API: a37d77312e79eb592d0b970210f905934b283f81.
Lokale Datei SHA256: de54250dee04ac9aa117992ecf2da398a11785ee4310fdfde1480231e2b54f84.
Foto: https://cdn-shop.adafruit.com/970x728/3006-04.jpg

XML direkt ausgewertet:
- Kontur 17,78 × 19,05 mm, vier gerundete Ecken R2,54.
- Zwei Montagelöcher Ø2,5 bei (2,54;16,51) / (15,24;16,51).
- Lochabstand 12,70 mm.
- Anschlussreihe y=2,54; x=1,27 bis 16,51 in 2,54-mm-Schritten.
- Klemmen-Pads nach R180-Transformation: (7,09;15,494) und
  (10,59;15,494), drill=1, diameter=2,1844.
- Kleinster Abstand Montageloch zu Klemmen-Padmittelpunkt ca. 4,66 mm.

## Konzept noch abzustimmen

Gitter und einzelne Pfosten wie bestätigte Step-Up-Stilvorlage.
Voller Ø8,2-Einsatzpfosten bis zur PCB lässt neben dem Klemmen-Pad nur
ca. 0,56 mm zum Padmittelpunkt (weniger als dessen Kupferradius); daher
keine solche Obermontage ohne weitere Lösung übernehmen.
Vorschlag: zwei gestufte Schraubpfosten, oben schmale PCB-Auflagen,
Einsätze von unten mit voller Einsatzwand; zusätzliche massive Auflagen
auf der Seite der Anschlussreihe, von Lötstellen entfernt.
Unterseiten-Einsätze sind eine Abweichung vom bündigen Obermontage-Wunsch.
Nutzer hat anschließend ausdrücklich einen Expertenvorschlag zur späteren
Sichtprüfung beauftragt. Vorschlag mit zwei seitlichen Holzlöchern jetzt in
`3d-print/mounts/max98357-mount/`, keine endgültige Konzept-/Passungsabnahme.

CAD/STL und sechs Vorschauen erstellt, Quell-/Mesh-Prüfung PASS;
Details in `docs/testprotokoll-max98357-mount.md`. Keine Druck-/Passungsprüfung. Nutzerfotos zeigen keine
Unterseiten-SMD-Bauteile, aber Lötstellen; deren Überstand ist nicht gemessen.
