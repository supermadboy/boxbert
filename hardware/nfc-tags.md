# NFC-Tags — bestaetigte UID-/Liedzuordnung

Stand: **04.10.2026, Etappe 4 als Breadboard-Meilenstein abgenommen.**
Quelle: neue Serial-Beobachtungen und Nutzer-Hoertests in
`docs/testprotokoll-etappe4.md`, nicht alte Agentenannahmen.

## Verbindliches Mapping

| Tag | UID (exakte Bytes) | Laenge | Exakter SD-Pfad | Dateigroesse |
|---|---|---:|---|---:|
| Tag 1 | `E3:2F:F6:33` | 4 Bytes | `/arcade-music-loop.mp3` | 549988 Bytes |
| Tag 2 | `01:8C:F1:6E` | 4 Bytes | `/happy-tune.mp3` | 642028 Bytes |

Beide Dateien liegen im Karten-Wurzelverzeichnis; Pfade/Groessen neu
per SD-Dateiliste verifiziert. Liedzuordnung vom Nutzer am 04.10.2026
ca. 20:26 freigegeben (`yes ist gut`), Wiedergabe und Wechsel bestaetigt.
Implementierung: `firmware/tests/etappe4_tag_player/TagMap.h`.
Host-Test prueft UID-Laenge/alle Bytes, unbekannte UIDs, falsche Laengen
und null-Zeiger. Kein Ersatzlied, **kein Schreiben auf Tags erforderlich**.

## Verifikationsbelege

- `etappe4_nfc_i2c` unveraendert: je Tag neun identische Lesungen in
  12 s nach USB-Power-Cycle (Tag 1 ca. 20:20, Tag 2 ca. 20:24).
- `etappe4_nfc_switch`, Timeout 0: TAG1→TAG2→TAG1→TAG2 ohne Neustart,
  SWITCHES 3 (ca. 20:39), auch nach angeforderter tagloser Pause.
  Nach angefordertem Kaltstart ohne Tag spaeter Tag 1 erkannt (ca. 20:42).
- Neuer `etappe4_tag_player`: hoerbarer Liedwechsel und kein Neustart
  bei gleicher UID vom Nutzer bestaetigt. Nach SD-/Pausenoptimierung
  erneuter Hoertest „super“, Nutzer gibt Etappe-4-Abschluss frei.
- Die genaue Ursache frueherer endlicher Suchfehlschlaege bleibt offen.
  Der Referenztext „NTAG215 auflegen“ identifiziert keinen Chiptyp;
  bestaetigte UIDs sind 4 Bytes, genaue Tag-Chiptypen nicht bestimmt.

## Verhalten und Grenzen

- Erster bekannter Tag/andere bekannte UID startet sein Lied einmal.
- Gleiche UID startet nicht erneut, auch nach Entfernen/Neuauflegen,
  solange keine andere UID dazwischen gelesen wurde. Kein Entfernen-Event.
- Entfernen stoppt nicht; EOF erzeugt keinen automatischen Loop.
- Unbekannte UID startet nichts und unterbricht laufende Musik nicht.
- Volume fest 6/21, kein Boot-Lied/WLAN-/Button-Zusatz.

Wiedergabe, Wechsel und Keine-Neustart-Logik sind akustisch bestaetigt;
Entfernen/EOF nicht separat beobachtet, unbekanntes Tag nur host-getestet.
20 kontrollierte Wechsel/Minutenlast und Player-Kaltstart ohne Tag sind
**spaetere Haertung**, keine behaupteten Erfolge der Breadboard-Abnahme.

## Aktueller Flash-Inhalt

`firmware/tests/etappe4_tag_player/` v1-timing: PN532 I2C 100 kHz,
SD **4 MHz**, NFC-Erfolgspause **200 ms**, Timeout 0 in eigener Task,
Queue zum Audio-Hauptloop, Volume 6. USB-only, Akku weiterhin ab.

Happy Tune UID→stream-ready 5499 ms bei SD 1 MHz, 1548 ms bei nur SD
4 MHz, nach Pausenkuerzung 1555/1562 ms. Arcade aktuell 1369/1372 ms.
Keine Startfehler im letzten Kurzlog. Kein physischer Auflegezeitpunkt
oder erster-Ton-Zeitstempel; Hoertest kommt ausdruecklich vom Nutzer.
Rohlogs in `docs/serial/`, Abnahmeumfang im Etappe-4-Protokoll.

Aktive Referenzen: `firmware/tests/README.md`. Unveraenderter v1 und
Timing-Zwischenstaende unter `firmware/archive/etappe4_tag_player_v1/`.
Alte Diagnosen unter `firmware/archive/etappe4_diagnostics/`; Inventory
belegt nur SD-Liste/Chipantwort, keinen funktionierenden UID-Pfad.
Verworfenen `etappe4_tag_music` nicht als Vorlage wiederverwenden.
