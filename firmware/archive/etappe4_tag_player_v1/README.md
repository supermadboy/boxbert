# Funktionierender Player v1 — Referenz vor Latenzoptimierung

Gesichert am 04.10.2026 vor jeder Optimierung. Nutzer hat Wiedergabe,
Liedwechsel und keinen Neustart bei gleicher UID bestaetigt; Wechselzeit
nach Schaetzung ca. 5 s. SD 1 MHz, NFC-Erfolgspause 1300 ms, Volume 6.

`etappe4_tag_player.ino.txt` und `TagMap.h` sind eine unveraenderte
Quellcodekopie des zuerst erfolgreich geflashten Players. Dateiendung
.txt verhindert versehentliche Auswahl als aktiver Sketch. PLAYER-README
ist der damalige Dokumentationsstand. Kein neuer Flash aus diesem Archiv.

Gesicherte nachfolgende Timing-Vergleichsstaende (jeweils .ino.txt und
passendes TagMap.h):
- `timing-1mhz/`: nur Zeitmessung ergaenzt, 1 MHz / 1300 ms. Happy Tune
  UID→stream-ready 5499 ms.
- `timing-4mhz-1300ms/`: allein SD-Takt erhoeht, Happy Tune 1548 ms.

Aktiv unter `firmware/tests/etappe4_tag_player/`: SD 4 MHz / Pause 200 ms,
separat nach dem SD-Vergleich getestet. Volume/Timeout/UID-Verhalten
unveraendert. Ergebnisse und Grenzen im Etappe-4-Protokoll, Rohlogs unter
`docs/serial/`. Optimierter Hoertest inzwischen vom Nutzer bestaetigt,
Breadboard-Etappe 4 abgenommen. Volle Dauer-/Produkthaertung noch offen.
