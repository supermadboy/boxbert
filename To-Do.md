# Boxbert — To-Do

## In Arbeit / Nächste Schritte

- [ ] Langfristige Framework-Entscheidung fuer Produktfirmware (Arduino vs.
  ESP-IDF) separat klaeren; Breadboard-Etappe 5 nutzt Arduino-Core 3.3.12.

### Spaetere Haertung — keine offenen Etappen-4-/5-Abschlussbedingungen

Etappen 4 und 5 sind als Breadboard-Meilensteine abgenommen, nicht als
vollstaendige Produkt-/Dauertests. Noch gezielt pruefen:

- [ ] Etappe 5: abgelehnte/doppelte/ungueltige Uploads, Upload-Abbruch,
  Groessenlimit und SD-Fehler; bestehende Musikdateien intakt halten.
- [ ] Etappe 5: Verhalten bei Upload waehrend Audio/NFC-Last pruefen —
  synchroner WebServer kann den Audio-Loop blockieren; erst danach
  parallelen Upload freigeben. Auth/Netz-Sicherheit vor Produktbetrieb
  bewerten (HTTP Basic nur im vertrauten lokalen WLAN).
- [ ] Etappe 5: physisch unbekanntes Tag, beide urspruenglichen Songs und
  mehrere Neustarts separat testen; bisher Happy-Path mit zugewiesener MP3.

- [ ] Mindestens 20 **kontrollierte** Tagwechsel und mehrere Minuten
  Audio unter NFC-Last, spaeter auch WLAN-/Upload-Last; Fehler zaehlen.
- [ ] Entfernen waehrend Audio und EOF ohne automatischen Neustart
  explizit beobachten. Verhalten ist implementiert, nicht separat abgenommen.
- [ ] Kaltstart ohne Tag im **Player**, spaeteres Auflegen. NFC-only-
  Wechselreferenz bestand diese angeforderte Testfolge bereits.
- [ ] Physisch unbekanntes Tag: kein Start/keine Unterbrechung. UID-
  Mapping host-getestet, noch kein unbekanntes Tag auf Hardware getestet.
- [ ] Tag-Chiptyp bei Bedarf bestimmen; beide bestaetigten Tags haben
  4-Byte-UIDs. Nicht allein aus Hinweistext „NTAG215“ ableiten.
- [ ] Vor AW9523-/Fuel-Gauge-Erweiterung Wire-Zugriffe mit NFC-Task
  synchronisieren. Akku erst ganz zum Schluss, Polung vorher pruefen.

### Vor Etappe-6-/Akku-Ausbau prüfen

- [ ] AW9523 erst an 3V3 im GPIO-/Tastertest; 5-V-LED-Portgrenzen,
  Reset-/Stromverhalten und Schaltplan prüfen. Kein +5 V auf VIN-3V3,
  integrierte Button-Widerstände behalten (`docs/power-plan.md`).
- [ ] Tatsächliche Rails/Abschaltung festlegen: PN532 am Header wird nicht
  durch Boost-EN/IO7 abgeschaltet. SD-Akkuversorgung, NeoPixel-Pegel,
  Sleep-Zustände/Rückspeisung und Gesamtstrom testen, dann erst Akku.
- [ ] Akustische Bewertung am finalen Aufbau planen; Volume/MAX_AMP
  nicht mit festen dB(A) oder Normkonformität gleichsetzen.
- [ ] IO6/IO11 und 44-mm-Schalter einzeln elektrisch/funktional testen.

## Erledigt

- [x] **04.10.2026: Etappe 5 BESTANDEN — Breadboard-Abnahme.**
  `firmware/tests/etappe5_web_upload/` mit Arduino-Core 3.3.12,
  WLAN-Station, einfacher Handy-Seite, `/files`, `/upload`, `/tags`,
  NVS-Zuordnung fuer die zwei bekannten UIDs. Nutzer bestaetigt
  Browser/Dateiliste, MP3-Upload, Tag-Zuweisung, hoerbares Abspielen und
  nach RESET erhaltene Zuordnung **sowie erneutes Abspielen** ohne
  Neuzuweisung. Serial: WLAN/NFC an, letzter Schnappschuss STARTS=4,
  ERRORS=0; Compile und Upload-Hashes ok. Nur USB, kein Akku; keine
  React-PWA, kein BLE. Fehlertests/Dauertest ausstehend, keine
  Produktfreigabe. Protokoll: `docs/testprotokoll-etappe5.md`.

- [x] **04.10.2026: Etappe 4 BESTANDEN — Breadboard-Abnahme.** Neuer
  `etappe4_tag_player`: PN532 I2C IO3/IO4 (DIP ON/OFF, 100 kHz), SD SPI
  IO36/35/37 mit CS IO10 (4 MHz), MAX98357A I2S IO16/17/18, USB-only.
  Tag 1 `E3:2F:F6:33` → `/arcade-music-loop.mp3`, Tag 2 `01:8C:F1:6E`
  → `/happy-tune.mp3`, Volume 6/21. Hoerbarer Liedwechsel und kein
  Neustart bei gleicher UID vom Nutzer bestaetigt; optimierter Hoertest
  ebenfalls „super“, Nutzer gibt Abschluss frei. Happy Tune intern
  UID→stream-ready 5499→ca. 1555–1562 ms; Arcade ca. 1369–1372 ms.
  Host-Test/Compile/Upload-Hashes erfolgreich, keine Startfehler im
  letzten Kurzlog. Timeout 0 in eigener NFC-Task, Pause 200 ms, Queue
  zum Audio-Hauptloop; kein Tag-Schreiben/Fallback/Boot-Song/WLAN.
  v1/Zwischenstaende und alte Diagnosen archiviert; nur bestaetigte
  NFC-Referenzen aktiv, Hauptdoku auf I2C aktualisiert. Protokoll:
  `docs/testprotokoll-etappe4.md`, Rohlogs `docs/serial/`, UID-Tabelle
  `hardware/nfc-tags.md`. Keine erfundene Dauer-/Produktabnahme.

- [x] 02.10.2026: **Etappe 3 BESTANDEN** — Button (AB24OL, Terminal A
  → IO5, B → GND, INPUT_PULLUP) unterbricht Boot-Loop und spielt
  `subbasesoft.mp3` (2,9 s). 20-ms-Entprellen reicht, kein
  Doppel-Trigger. Volume per Hörtest 6 → 12. Protokoll:
  `docs/testprotokoll-etappe3.md`.

- [x] 02.10.2026: **Etappe 2 BESTANDEN** — SD-Karte (FAT32) am SPI-Bus
  (CS=IO10, SCK=IO36, MOSI=IO35, MISO=IO37, VCC=USB-5V), Dateiliste ok,
  mp3-Wiedergabe über ESP32-audioI2S v4 (PSRAM=QSPI Board-Default!) über
  I2S zum MAX98357A. Volume vermessen: 6 = leise-schoen, 21 = max.
  Lehrstück: PSRAM-Modus nicht manuell auf opi drehen. Protokoll:
  `docs/testprotokoll-etappe2.md`.

- [x] 02.10.2026: **Etappe 1 BESTANDEN**
  I2S (DOUT=IO16, BCLK=IO17, LRC=IO18, VIN→USB-5V, SD→3V3, GAIN offen).
  Testtoene 440/880 Hz hörbar und verzerrungsfrei, Dynamik AMP 10–32000
  vermessen. Unterm Strich drei Lehrstücke: Klon-Pinout am Silkscreen
  prüfen (unser Modul: VIN/GND/SD/GAIN/DIN/BCLK/LRC), SD-Pin ist
  Analogschwellwert (Mono-Modus > 1,4 V festlegen), und `ESP_I2S` braucht
  zwingend `setPins()` vor `begin()` — ohne das läuft alles grün, nur
  ohne Ton. Protokoll: `docs/testprotokoll-etappe1.md`.
  Software-Limit vorgesehen; früheres MAX_AMP 6000–8000 ist kein
  akustisch validierter Grenzwert. Norm-/Schalldruckbewertung offen,
  `docs/audio-safety.md`.

- [x] 01.10.2026: Etappe 0 in `docs/breadboard-testing.md` abgehakt — TFT-Test
  bestanden (Sketch: `firmware/tests/etappe0_tft/`, zeigt Text + WLAN-Scan
  + „Etappe 0 BESTANDEN“).
- [x] 27.09.2026: Bestellliste abgeschickt (Tastenkrone, berrybase.de,
  109,81 €) — Details in `docs/bestellliste.md`.
- [x] 01.10.2026: **Lieferung komplett angekommen.**
- [x] 01.10.2026: **Dev-Setup fertig** — arduino-cli 1.5.1, ESP32-Core
  3.3.12, uucp-Gruppe, Kernel-Reboot (cdc_acm), WiFiScan geflasht und
  **4 WLAN-Netze gefunden** → Etappe 0 Teil 1 bestanden. Protokoll:
  `docs/dev-setup.md`.
- [x] 27.09.2026: Preisvergleich + Bestellliste erstellt
  (`docs/preisvergleich.md`, `docs/bestellliste.md`).
- [x] 27.09.2026: Pin-Belegung geprüft und festgelegt
  (`hardware/pinout.md`), Breadboard-Fahrplan geschrieben
  (`docs/breadboard-testing.md`).
- [x] 25.09.2026: Projektstruktur, AGENTS.md, BOM, Entscheidungen
  (`docs/entscheidungen.md`, `docs/kernwerte.md`).
