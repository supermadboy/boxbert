# Etappe 4 — neuer minimaler Zwei-Tag-Musiktest

Neu geschrieben, keine Uebernahme des verworfenen `etappe4_tag_music`.
UIDs/Pfade verbindlich aus `hardware/nfc-tags.md`, beide neu geprueft.

## Verhalten

- Tag 1 `E3:2F:F6:33` → `/arcade-music-loop.mp3`.
- Tag 2 `01:8C:F1:6E` → `/happy-tune.mp3`.
- Exakte UID-Laenge und alle Bytes vergleichen; unbekannte UID startet
  nichts und unterbricht laufende Musik nicht.
- Erster bekannter Tag/andere UID startet sein Lied einmal. Gehaltenes
  Tag startet nicht staendig neu, EOF erzeugt keinen automatischen Loop.
- Entfernen stoppt Musik nicht. Anderes bekanntes Tag wechselt.
- Volume fest **6/21**, keine Lautstaerke-Kommandos. Kein Nachweis fuer
  Einhaltung einer akustischen Spielzeugnorm.
- Kein Boot-Lied, Autotest, WLAN, Button-, TFT- oder NeoPixel-Zusatz.
- Serial 115200: `h`/`s` zeigen Status; alle 5 s Status auch automatisch.

**V1-Grenze:** Mit dem getesteten blockierenden Timeout-0-Lesen gibt es
kein separates Entfernen-Event. Dieselbe UID nach Entfernen/Neuauflegen
loest daher keinen Neustart aus, solange nicht zwischenzeitlich eine
andere UID gelesen wurde. Das ist explizit keine vollstaendige Tag-
Anwesenheitslogik; Wiederstart desselben Tags bei Bedarf separat klaeren.

## Architektur — warum zwei Tasks

`etappe4_nfc_switch` hat NFC mit Host-Timeout 0 nachgewiesen, inklusive
Wechsel und nach angefordertem Kaltstart ohne Tag. Ohne Tag darf dieser
Aufruf warten, darf aber `audio.loop()` nicht blockieren.

- `setup()` initialisiert NFC wie im getesteten Wechseltest: I2C 100 kHz,
  nfc.begin, Firmwareversion, SAMConfig; KEINE Retry-/RFConfiguration.
- Danach besitzt nur die neue NFC-Task PN532/Wire. Keine parallelen
  PN532-Aufrufe. Adafruit waitready() gibt mit delay(10) CPU-Zeit frei.
- NFC-Task liefert feste Datenkopien (UID/Zaehler/Fehler) ueber eine
  FreeRTOS-Queue an den Hauptloop. Keine ungeschuetzten globalen Zaehler,
  keine Audio-/SD-Zugriffe aus der NFC-Task. Pause nach Erfolg aktuell
  200 ms (nach getrenntem Vergleich gegen 1300 ms, 04.10.2026).
- Hauptloop bedient laufend audio.loop(), konsumiert Events und startet
  bei geaenderter bekannter UID die Datei. Nur der Hauptloop steuert
  Audio/SD. Audio-Library behaelt eigene Task-/Core-Defaults.
- NFC-Fehler stoppt weitere Suchkommandos, meldet Fehler an Hauptloop;
  laufende Musik bleibt unangetastet. Task-/Queue-/Datei-/PSRAM-Fehler
  sind sichtbar, kein automatischer Reinit-/Flash-Marathon.
- Queue wartet bei Rueckstau statt Events still zu verlieren. STARTS
  zaehlt connecttoFS-Erfolge, nicht akustisch bestaetigte Starts;
  START_ERRORS zaehlt dessen false-Rueckgaben. READS/SWITCHES kommen von
  der NFC-Task, LOOPS belegt Fortschritt des Hauptloops auch ohne Tag.
- Spaeterer AW9523/Fuel-Gauge-Zugriff wuerde ebenfalls Wire verwenden:
  vor dieser Erweiterung Buszugriffe zwischen Tasks synchronisieren.

APIs gegen installierte Beispiele geprueft: Adafruit PN532 1.3.4
readMifare/Treiber, ESP32-audioI2S 4.0.0 I2Saudio_SD/Treiber,
Core 3.3.12 FreeRTOS Queue/BasicMultiThreading (inkl. READMEs).

## Verkabelung vor Musik-Flash bestaetigen

Alle Pins aus `hardware/pinout.md`; keine neuen Pins.
Nur USB, Akku ab, zum Umstecken USB abziehen. Modul-Silkscreen beachten.

| Bauteil | Anschluss |
|---|---|
| PN532 | SDA IO3, SCL IO4, VCC 3V3, GND; DIP 1 ON / 2 OFF |
| PN532 SPI/UART/IRQ/Reset | nicht angeschlossen |
| SD | CS IO10, SCK IO36, MISO IO37, MOSI IO35, VCC USB-5V, GND |
| MAX98357A | VIN USB-5V, GND, DIN IO16, BCLK IO17, LRC IO18 |
| MAX98357A SD/GAIN | SD fest an 3V3, GAIN offen, wie Etappe 1–3 |
| Lautsprecher | am Amp-Ausgang; keine Speaker-Leitung an GND |

Die neue I2C-/SD-Verdrahtung wurde bereits vom Nutzer bestaetigt. Den
aktuellen Audio-Aufbau vor erstem Musik-Flash noch bestaetigen lassen:
aufgelegtes Tag kann nach Boot sofort leise Musik starten.

## Status (04.10.2026, ca. 20:55)

Host-TagMap-Test/Board-Compile erneut erfolgreich: Core 3.3.12,
Adafruit PN532 1.3.4/BusIO 1.17.4, ESP32-audioI2S 4.0.0,
1645392 Bytes Flash, 77176 Bytes globale Variablen. Audio-Aufbau vom
Nutzer bestaetigt, Player geflasht, Upload-Hashes verifiziert.
Erste Live-Logs: Happy-Tune-MP3-Stream aktiv (40 s, 44100 Hz, Stereo),
STARTS 2 / SWITCHES 1 / START_ERRORS 0; NFC-READS und Hauptloop parallel
fortschreitend. Nutzer bestaetigt danach Wiedergabe/Liedwechsel und
kein Neustart bei gleicher UID. Wechselzeit nach Nutzerschaetzung ca.
5 s; damals waren Latenzoptimierung, weitere Tests und Dauertest offen.
Das war der Stand vor Optimierung. Keine volle bestandene Etappe aus
Teiltests ableiten.

## Aktueller Stand nach Optimierung (04.10.2026, ca. 21:20)

**Geflasht: SD 4 MHz / NFC-Erfolgspause 200 ms**, Timeout 0 und Volume 6
unveraendert. Zeitmarker in NfcEvent/Audio-Callback ergaenzt, Queue-
Datenkopien und atomare Callback-Marker. Alle drei Vergleichsvarianten
jeweils Host-Test/Compile/Upload-Hashes erfolgreich (1646096 B Flash,
77184 B globale Variablen).

| Variante | UID→stream-ready Arcade | UID→stream-ready Happy Tune |
|---|---|---|
| SD 1 MHz / Pause 1300 ms | nicht vollstaendig erfasst | 5499 ms |
| SD 4 MHz / Pause 1300 ms | 1362 / 1368 ms | 1548 ms |
| SD 4 MHz / Pause 200 ms | 1372 / 1369 ms | 1562 / 1555 ms |

SD-Takt als dominante Stellschraube nachgewiesen; kein globaler Library-
Patch, keine neuen Pins. UID-Marker liegt *nach* NFC-Erkennung, keine
Auflege→Ton-Messung. stream-ready ist kein Nachweis fuer ersten hoerbaren
Ton. Nutzer bestaetigt danach auch optimierten Hoertest als „super“
und gibt Etappe 4 als **Breadboard-Meilenstein** frei (04.10.2026).
Kein Nachweis fuer Produkt-/Dauerreife; Haertungsaufgaben in `To-Do.md`.
Rohlogs: `docs/serial/etappe4-player-latency-*.log`.
Unveraenderter v1 und beide Timing-Zwischenstaende gesichert unter
`firmware/archive/etappe4_tag_player_v1/`.

## Build und Tests

Board-Defaults verwenden (QSPI-PSRAM), kein `PSRAM=opi`.

```bash
arduino-cli compile \
  --fqbn esp32:esp32:adafruit_feather_esp32s3_reversetft \
  firmware/tests/etappe4_tag_player

g++ -std=c++17 -Wall -Wextra -Werror \
  firmware/host-tests/tag_map_test.cpp -o /tmp/boxbert-tag-map-test
/tmp/boxbert-tag-map-test
```

**Etappe 4 als Breadboard-Meilenstein abgenommen, Hoertest erfolgreich.**
Spaetere Haertung: Entfernen waehrend Audio, EOF ohne Loop, mindestens
20 kontrollierte Wechsel, mehrere Minuten Audio unter NFC-/WLAN-Last,
Player-Kaltstart ohne Tag und physisch unbekanntes Tag. Diese noch nicht
als bestanden ausgeben. Kein akustisches Bestehen allein aus Compile,
connecttoFS/Decoder-Logs oder READS ableiten.
Aktueller Status und Protokoll: `docs/testprotokoll-etappe4.md`, `To-Do.md`.
