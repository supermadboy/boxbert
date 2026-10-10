# Findings — Foren, Herstellerquellen und eigene Tests (kuratiert)

Praxis-Wissen von Leuten, die es selbst gebaut haben (Foren-Threads, Blogs,
GitHub-Issues) — gesammelt am **01.10.2026**, sortiert nach unseren
Baugruppen. Kein Ersatz für `docs/kernwerte.md` (dort stehen *unsere*
Bauteile), sondern das, was schiefgeht, bevor wir es selbst erleben.

Pflegeregel: Echte Quellen (Forum, Blog, Issue, Herstellerunterlagen) oder
nachvollziehbare eigene Tests mit Protokoll — keine KI-generierten
„Top-10-Artikel". Digitale CAD-/Codeprüfungen ausdrücklich von physischen
Messungen unterscheiden. Jedes Finding mit Quelle und, wenn relevant,
mit „Heißt für Boxbert". Neues oben dran? Nein — beim passenden Thema
einfügen, Datum dazu.

---

## I2S-Audio / MAX98357A

- **SD-Takt dominiert gemessene MP3-Startstrecke (eigener Vergleich,
  04.10.2026).** Nutzer meldet beim neuen Zwei-Tag-Player ca. 5 s
  Wechselzeit. Danach Zeitstempel: Happy Tune UID→stream-ready **5499 ms**
  bei 1 MHz SD, Queue 1 ms / connecttoFS 30 ms. *Nur* SD auf 4 MHz
  geaendert (NFC-Pause weiterhin 1300 ms): gleicher Pfad **1548 ms**,
  rund 72 % kuerzer. Arcade 1362/1368 ms. Separat NFC-Pause 1300→200 ms:
  Happy Tune 1562/1555 ms, Arcade 1372/1369 ms; keine Startfehler im
  kurzen Mitschnitt. UID liegt nach Erkennung: NFC-Pause vor UID und
  physischer Auflege→Ton-Abstand damit nicht gemessen. stream-ready
  ist kein Nachweis fuer hoerbaren Ton; Nutzer bestaetigt danach auch
  optimierten Hoertest und nimmt Breadboard-Etappe 4 ab. Installierte Audio-Lib
  4.0.0 liest in processLocalFile() vor jedem schrittweisen MP3-/ID3-
  Header-Aufruf bis 65535 Bytes nach. Bei 1 MHz braucht schon ein voller
  solcher Block idealisiert 0,524 s, real mehr; mehrere Startaufrufe
  koennen grosse Datenmengen vor dem ersten Ton lesen. Kein pauschaler
  Zwang, kompletten ca. 655-KB-Puffer vor Audio zu fuellen!
  → SD 4 MHz als aktuell getestet beibehalten; bei weiteren Latenz-
  Optimierungen Messstrecke und jeweils einzelne Stellschraube trennen.
  Mehrere Minuten/20 kontrollierte Wechsel als spaetere Haertung offen.
  Quelle: `docs/testprotokoll-etappe4.md`, eigene Serial-Rohlogs unter
  `docs/serial/etappe4-player-latency-*.log`; eigene Codepruefung
  `etappe4_tag_player.ino`, Audio-4.0.0 `Audio.cpp` (processLocalFile,
  read_ID3_Header), `Audio.h` (MAX_TRANSFER_SIZE).

- **Knackser beim Start/Stop sind normal und behandelbar.** Der MAX98357A
  zentriert seinen Analog-Ausgang bei VCC/2; fährt der I2S-Stream mit
  Nullen hoch/runter, hörst du einen Pop. Abhilfe: Samples am Anfang und
  Ende des Streams softwareseitig ein-/ausblenden (Fade-in/Fade-out).
  → Heißt für Boxbert: In die Firmware — Play/Pause mit kurzem Fade bauen,
  nicht hart abschalten.
  Quelle: [EE StackExchange „MAX98357A popping noise"](https://electronics.stackexchange.com/questions/723166/max98357a-creating-popping-noise-understanding-i2s-for-stm32), [esp32.com I2S-Crackling-Thread](https://www.esp32.com/viewtopic.php?t=4872)
- **Sample-/Slot-Format nicht aus dem Höreindruck erraten.** Die frühere
  pauschale Aussage „Chip will nur 16 Bit, 32 Bit knistert“ war hier
  nicht belegt und ist keine Fehlersuchregel. Bei Störungen tatsächliche
  Decoder-/I2S-Einstellungen gegen Datenblatt und Beispiel der verwendeten
  Library prüfen, nicht ungeprüft `I2S_DATAFORMAT_16B` erzwingen. Für die
  getestete ESP_I2S-Referenz siehe `docs/testprotokoll-etappe1.md` und
  `firmware/tests/etappe1_audio_led/`; MP3-Player nutzt andere Audio-API.
- **Stottern bei WLAN/Webserver-Betrieb** kommt meist aus DMA-Underruns
  bzw. CPU-Core-Wechseln. Bewährte Werte aus der Community:
  DMA-Buffer erhöhen (~`buffer_count = 16`, `buffer_size = 1024`) und Audio
  auf einen Core binden, WLAN-Kram auf den anderen. PSRAM wird für
  WLAN-Audiostreams praktisch zwingend gebraucht — haben wir (2 MB).
  → Heißt für Boxbert: Etappe 5 (Webserver + Audio gleichzeitig) ist der
  kritische Moment; wenn es stottert, erst DMA-Buffer, dann Core-Pinning.
  Quelle: [ESP32-audioI2S-Issue #142](https://github.com/schreibfaul1/ESP32-audioI2S/issues/142), [audio-tools-Diskussion #1930](https://github.com/pschatzmann/arduino-audio-tools/discussions/1930)
- **ESP_I2S (Arduino-Core 3.x): Ohne `setPins()` läuft alles — nur kein Ton.**
  `i2s.begin()` und `write()` funktionieren ohne Pin-Zuweisung fehlerfrei
  (Rückgabewert ok, Bytes gezählt), aber die GPIO-Matrix verbindet die Pins
  nie mit dem I2S-Controller → tote Stille bei grüner LED. Vor `begin()`
  IMMER `i2s.setPins(bclk, ws, dout)` aufrufen (Reihenfolge:
  BCLK, LRC, DOUT — Amp-DIN ist aus ESP32-Sicht DOUT!). Eigenes Symptom
  am 02.10.2026 erlebt, Debugging in `docs/testprotokoll-etappe1.md`.
  Quelle: Beispiel `ESP_I2S/examples/Simple_tone` im arduino-esp32-Core
- **MAX98357A: Pinreihenfolge am Silkscreen prüfen, nicht raten.**
  **Korrektur 09.10.2026:** Nutzerfotos und Bestätigung passen zum
  bestellten Adafruit ADA3006 einschließlich Pinlabels und Schraubklemme.
  Die frühere „schwarzer Klon / völlig anderes Adafruit-Layout“-Einordnung
  war nicht belastbar. `VIN, GND, SD, GAIN, DIN, BCLK, LRC` ist die Reihe
  von der VIN-Seite gelesen, kein Klon-Beweis. Durchgangstest bestätigt
  nur die Verdrahtung, nicht die richtige Signalzuordnung.
  Quellenvergleich: `docs/cad/2026-10-09-max98357-mount/`,
  `docs/testprotokoll-max98357-mount.md`. Bestätigte Verdrahtung unverändert.
- **MAX98357A: SD-Pin ist ein Analog-Schwellwert-Pin, kein Digital-Ein/Aus.**
  Datenblatt-Modi: < 0,16 V = Shutdown · 0,16–0,77 V = nur rechter Kanal ·
  0,77–1,4 V = nur linker Kanal · > 1,4 V = Mono-Mix (L+R)/2. Ein „halbhoch
  hängender" Pin (z. B. halber Kontakt) kann also rechte-Kanal-Modus
  erzeugen: Das Mono-Links-Slot-Signal wird dann nicht ausgegeben →
  unsichtbar stumm. Fix: SD fest an 3,3 V.
- **Subjektiver Hörtest ist keine Schalldruckmessung (Klarstellung
  04.10.2026).** AMP 10/32767 wurde noch gehört; der relative digitale
  Pegel ist kein dB(A)-Wert. Frühere MAX_AMP-/65/85-dB-Angaben hatten
  keinen dokumentierten akustischen Mess-/Normnachweis für Boxbert.
  Keine kindersichere Grenze daraus berechnen; aktuelle leise Volume-6-
  Referenz und nötige spätere Bewertung in `docs/audio-safety.md`.
  Quelle: tatsächlich dokumentierter Hörtest `docs/testprotokoll-etappe1.md`
  und Nutzer-Hörtests der Etappen 2–4; keine neue Normprüfung behauptet.

## SD-Karte

- **FAT32, max. 32 GB, sonst geht gar nichts.** exFAT unterstützt die
  Standard-Library nicht — Karte wird einfach nicht erkannt.
  → Heißt für Boxbert: Unsere Verbatim 32 GB ist exakt richtig; am PC
  wirklich FAT32 formatieren (Windows bietet bei 32 GB exFAT als Default an).
  Quelle: [Arduino-Forum exFAT-Thread](https://forum.arduino.cc/t/exfat-microsd-card-cant-initiate-on-esp32/1380343)
- **`send_op_cond`-/Init-Fehler** kommen typischerweise von fehlenden
  Pull-ups auf den Datenleitungen oder von billigen Level-Shift-Modulen.
  → Heißt für Boxbert: Unser MSD-AADP-Modul hat einen Onboard-Regler
  (kernwerte.md); wenn die Karte trotzdem nicht initialisiert, Drahtbrücken
  und Kabellängen prüfen, bevor man am Modul zweifelt.

## SPI-Bus-Sharing (SD + PN532)

- **Eigene Beobachtung (03.10.2026): Erst mit getrenntem SD-MISO antwortet
  der PN532.** Unveränderter Sketch, SD-CS bereits HIGH, SPI 100 kHz;
  vor Trennen keine Firmware-Antwort, danach „Chip erkannt,
  Tag-Konfiguration fehlgeschlagen“. Starker Hinweis auf Störung durch
  den SD-MISO-Zweig; nicht durch Buspegelmessung oder Rückvergleich
  bestätigt. Nach lokaler Konfigurationskorrektur UID E3:2F:F6:33
  wiederholt erkannt. Rückvergleich 21:40 mit SD-MISO wieder verbunden:
  SD-zuerst-Init und getrennte SPI-Transaktionen helfen nicht, NFC meldet
  Invalid ACK; SD und Audio-Stream starten. Damals separater SPI-Bus
  vorgeschlagen; inzwischen durch bestaetigten I2C-Aufbau ueberholt.
  Historischer Befund, kein neuer Integrationsnachweis aus diesem alten
  Sketch. Nicht vorschnell NFC-Modul fuer defekt erklaeren.
  Quelle: eigene Hardware-Tests, `docs/testprotokoll-etappe4.md`.
- **Gemeinsamer Bus zwischen SD-Reader und RFID führt häufig zu Bus-Lockups**
  — es ist DIE bekannte Schwachstelle solcher Projekte. Forumslage: Uneins,
  ob Pull-ups/CS-Widerstände das zuverlässig fixen; als zuverlässiger gilt
  ein zweiter SPI-Bus.
  → Historischer Plan fuer Boxbert, inzwischen ueberholt: **PN532 I2C**,
  SD SPI, kein gemeinsamer SD-/NFC-MISO mehr. Zweiten NFC-SPI-Bus nicht
  erneut als aktuellen Plan empfehlen. Bei anderen SPI-Erweiterungen
  korrekte CS-/Busfreigabe weiterhin beachten.
  Quelle: [StackExchange RFID+SD-Thread](https://stackoverflow.com/questions/75639315/using-rfid-and-sd-card-reader-at-the-same-time-with-spi-and-esp32-not-working)

## PN532 (NFC)

- **Host-Timeout 0 besteht grundlegenden I2C-Wechsel-/Starttest
  (04.10.2026, ca. 20:34–20:42).** Separater `etappe4_nfc_switch`,
  Referenz-Init und Erfolgs-Pause beibehalten, Host-Timeout 500→0:
  TAG1→TAG2→TAG1→TAG2 im selben Lauf, SWITCHES 3; Rueck-/Hinwechsel
  nach jeweils angeforderter tagloser Pause erfolgreich. Nach angefordertem
  Kaltstart ohne Tag spaeter Tag 1 erkannt (READS 14→22, SWITCHES 0).
  Pausendauern nicht unabhaengig gemessen, kein Dauertest/Audio-Nachweis.
  Codepruefung: Adafruit PN532 1.3.4 gibt bei Host-Timeout false zurueck,
  ohne in diesem Pfad explizit eine PN532-Suche abzubrechen; erneuter
  Aufruf schreibt neuen Suchbefehl. Ueberlappung als plausible Hypothese,
  genaue Ursache nicht bewiesen. Timeout 0 ist der dokumentierte Default
  und darf ohne Tag unbegrenzt warten.
  → Fuer Audio niemals diesen Aufruf direkt in audio.loop-Hauptloop:
  neuer Player nutzt eigene NFC-Task/Queue; inzwischen mit SD/I2S und
  optimiertem Hoertest vom Nutzer als Breadboard-Meilenstein abgenommen.
  Langzeit-/WLAN-Last bleibt spaetere Haertung.
  Quelle: eigene Serial-Tests `docs/testprotokoll-etappe4.md`, installierte
  `Adafruit_PN532.cpp` (`readPassiveTargetID`, `sendCommandCheckAck`,
  `waitready`) und `examples/readMifare` (Adafruit PN532 1.3.4).

- **Beide vorhandenen Tags ueber I2C lesbar, Tagwechsel noch nicht stabil
  nachgewiesen (04.10.2026, ca. 20:20–20:24).** Im unveraenderten
  `etappe4_nfc_i2c` jeweils nach USB-Kaltstart mit allein aufgelegtem Tag:
  Tag 1 `E3:2F:F6:33`, Tag 2 `01:8C:F1:6E`, beide 4 Bytes, jeweils neun
  identische Ausgaben in 12 Sekunden. Beim Wechsel von Tag 1 zu Tag 2
  ohne Neustart zuvor keine UID, nur wiederholter Bereitschaftstext.
  Dieser Text stammt aus setup() und belegt keine aktuelle Busantwort.
  → Beide Tags sind lesbar; spaeteren erfolgreichen Wechseltest siehe
  Finding oben. Die Einzelreferenz unveraendert erhalten. Ursache
  des Wechsel-Fehlschlags offen, weder Tagdefekt noch bestimmter Bus-/
  Treiberfehler bewiesen. UIDs identifizieren noch keinen genauen Chiptyp.
  Quelle: eigene Serial-Beobachtung, `docs/testprotokoll-etappe4.md`;
  UID-/Dateipfad-Uebersicht: `hardware/nfc-tags.md`.

- **Neu reproduzierter I2C-Leseerfolg und eigene Diagnose-Regression
  (04.10.2026, ca. 20:20).** Unveraenderter `etappe4_nfc_i2c` mit
  Adafruit PN532 1.3.4, I2C 100 kHz, SAMConfig und 500-ms-Host-Timeout:
  nach USB-Power-Cycle mit aufgelegtem Tag 1 neun gleiche Lesungen
  `E3:2F:F6:33` (4 Bytes) in 12 Sekunden. Der neu geschriebene
  `etappe4_inventory` hatte dagegen bei zwei Versuchen keine UID
  geliefert; nach dem ersten Versuch keine I2C-Adressen mehr sichtbar,
  durch Power-Cycle fuer die Chipabfrage behebbar. Inventory unterscheidet
  sich durch zusaetzliche Retry-Konfiguration, kuerzeren Host-Timeout
  und weitere Details; keine einzelne Ursache nachgewiesen.
  → Fuer Boxbert: funktionierenden Einzeltest als Referenz erhalten,
  Inventory nur als SD-Dateilisten-Nachweis verwenden. Keine Hardware-
  oder Clock-Stretching-Ursache aus diesem Vergleich behaupten. Der
  Sketch-Hinweis `NTAG215 auflegen` identifiziert keinen Tagtyp.
  Quelle: neue eigene Serial-Beobachtung, `docs/testprotokoll-etappe4.md`.

- **Installierte Seeed-PN532-Lib verwirft leere Konfigurationsantworten
  (03.10.2026).** `SAMConfig()` und `setPassiveActivationRetries()`
  prüfen `0 < readResponse(...)`; SAMConfiguration und RFConfiguration
  liefern gültige Antworten mit null Nutzdaten. Der Transport gibt
  dafür 0 zurück (>=0 ist laut `PN532Interface.h` Erfolg).
  Lokaler Workaround im Direkttest sendet die beiden Kommandos selbst
  und verlangt ACK plus gültigen Antwortframe mit Länge=0. Danach
  bestätigt: „PN532 bereit“, laufendes Polling mit gültigen Antworten
  (noch null Targets). Quelle: installierte `PN532/src/PN532.cpp`,
  `PN532_SPI.cpp`, `PN532Interface.h`, eigene Hardware-Beobachtung in
  `docs/testprotokoll-etappe4.md`. Globale Bibliothek nicht geändert.
- **Eigener Direkttest: `nfc.begin()` fehlte (03.10.2026).** In der
  installierten Seeed-PN532-Lib setzt erst `begin()` SS als Ausgang und
  ruft Wakeup auf. `SPI.begin()` allein ersetzt das nicht. Korrigierter
  isolierter Test (SD-CS HIGH, 100 kHz, LSBFIRST, MODE0) blieb trotzdem
  ohne Chipantwort; der Fehler erklärt daher nicht nachweislich das
  gesamte Problem. Quelle: lokales Beispiel
  `PN532/examples/iso14443a_uid`, `PN532/src/PN532.cpp`,
  `PN532/src/PN532_SPI.cpp`; eigene Beobachtung:
  `docs/testprotokoll-etappe4.md`.
- **HSU-Pinlabels der Elechouse/HW-147-Platine in unserer Doku zunächst
  vertauscht (04.10.2026).** Web-Gegenprüfung: HSU verwendet bei der
  gemeinsamen I2C/UART-Stiftleiste SDA/TXD als PN532-Ausgang und SCL/RXD als
  PN532-Eingang. Daher: SDA/TXD → Host-RX, SCL/RXD → Host-TX. Tasmota nennt
  explizit `D1 -> SCL/RXD`, `D2 -> SDA/TXD`; eine zweite Verdrahtungsquelle
  nennt `SDA/TxD`, `SCL/RxD`. Unsere frühere Tabelle war umgekehrt. Der
  isolierte HSU-Test meldete `Ack: Timeout`, was bei TX→TX/RX→RX passt;
  nach Korrektur noch nicht neu getestet. Clone-Rückseiten-Silkscreen prüfen.
  Quellen: [Elechouse V3 Manual](https://www.elechouse.com/elechouse/images/product/PN532_module_V3/PN532_%20Manual_V3.pdf),
  [Tasmota-Issue #5497](https://github.com/arendst/Tasmota/issues/5497),
  [Raspberry-Pi-StackExchange](https://raspberrypi.stackexchange.com/questions/82220/connecting-elechouse-pn532-v3-to-raspberry-pi-5v-or-3-3v),
  eigene HSU-Messung in `docs/testprotokoll-etappe4.md`.
- **Serial1-Loopback am Feather bestanden (04.10.2026).** Mit PN532-Daten-
  leitungen getrennt und IO39/TX direkt auf IO38/RX zurückgeführt, empfängt
  die installierte HSU-Diagnose den eigenen Frame (`00 00 FF 02 FE D4`) statt
  eines Timeouts. Damit sind Feather-UART, Pinroute und Sketch-Baudrate
  funktionsfähig; der echte PN532-HSU-Test liefert nach Power-Cycle weiterhin
  keinen ACK. Quelle: eigene Hardwaremessung,
  `docs/testprotokoll-etappe4.md`.
- **PN532-HSU-Pegel nicht direkt Feather-kompatibel (04.10.2026).**
  Elechouse V3 nennt den eingebauten Level-Shifter „Standard 5V TTL for I2C
  and UART, 3.3V TTL SPI“; V4 nennt dieselben Pegel und V3/V4-Kompatibilität.
  Nutzer maß bei VCC=3,27 V **4,1 V am TXD/SDA, isoliert vom Feather**.
  Das bestätigt >3,3 V am Modul-Ausgang: nicht direkt an den nicht
  5V-toleranten Feather-RX/IO38 anschließen. Das kann den GPIO beschädigen
  und kann den HSU-Ausfall erklären. Noch kein Pegelwandler-Test; bis dahin
  HSU stoppen. Inzwischen laeuft unser konkreter Aufbau per I2C mit
  geprueftem Ruhepegel; kein neuer SPI-/HSU-Versuch noetig. Quellen: [Elechouse V3 Manual](https://www.elechouse.com/elechouse/images/product/PN532_module_V3/PN532_%20Manual_V3.pdf),
  [Elechouse V4 Specs](https://www.elechouse.com/product/pn532-nfc-rfid-module-v4/),
  eigene Messung in `docs/testprotokoll-etappe4.md`.
- **SWHSU-YouTube-Beispiel nicht direkt auf Feather übertragbar.** `PN532_SWHSU`
  benutzt SoftwareSerial, im Beispiel RX=GPIO3/TX=GPIO2. Bei Boxbert ist IO3
  SDA und IO2 für eine Board-Taste reserviert; außerdem fehlt `SoftwareSerial.h`
  in der installierten Umgebung und SWHSU ist in PN532-Arduino 1.1.0 opt-in.
  Der getestete `PN532_HSU` mit Serial1/IO38/39 ist der passendere Weg.
  Quelle: installierter PN532-Arduino-1.1.0-README/Quellcode, eigene
  Kompilierprobe.
- **Clone-Module sind stark unterschiedlich** (z. B. HW-147C): DIP-Schalter-
  Beschriftung, Pegelwandlung und Library-Kompatibilität variieren.
  Bibliotheken defaulten auf ~1 MHz SPI; manche Setups laufen erst bei
  deutlich weniger.
  → Heißt für Boxbert: Vor dem ersten Anschließen DIP-Stellung physisch
  gegenmodulieren (steht schon so in `breadboard-testing.md`), SPI-Clock
  konservativ starten, falls SPI ueberhaupt verwendet wird. I2C-
  Forenprobleme sind keine Diagnose fuer unser Modul: Entscheidung
  inzwischen durch bestaetigten I2C-Aufbau ueberholt (04.10.2026).
  Quelle: [Arduino-Forum PN532-Thread](https://forum.arduino.cc/t/esp32c6-pn532-nfc-reader-hw-147c-spi-i2c-communication-not-working-didnt-find-pn53x-board/1415164), [esp32.com ESP-IDF/PN532](https://esp32.com/viewtopic.php?p=142068&t=43567)
- **Unser HW-147-Klon läuft über I2C direkt am Feather — Tag-Lesen bestätigt
  (04.10.2026, Abend).** DIP auf I2C (1 ON / 2 OFF), Ruhelage des Busses
  gemessen 3,3 V an SDA/SCL (anders als die 4,1 V am SDA/TXD-Pad im
  HSU-Kontext), direkter Anschluss SDA→IO3, SCL→IO4 ohne Pegelwandler.
  I2C-Scan: PN532 auf 0x24 (plus onboard MAX17048 auf 0x36), FW v1.6;
  Nutzer meldet funktionierenden Tag-Lesetest. Konsequenzen:
  - HSU endgültig verworfen (Pegelwandlung nötig, kein Vorteil) und
    Plan B (eigener SPI-Bus) nicht mehr nötig; SD hat den SPI-Bus allein,
    das MISO-Bussharing-Problem ist obsolet. IO9/IO38 frei.
  - Inzwischen UID-/Wechseltests neu reproduziert und neuer NFC+SD+Audio-
    Player mit optimiertem Hoertest vom Nutzer abgenommen. Timeout 0 in
    eigener Task, Queue zum Audio-Hauptloop, NFC-Pause 200 ms. Weitere
    Wire-Clients spaeter synchronisieren. Fruehere 500-ms-Suchfehler
    bleiben nicht abschliessend diagnostiziert; keine pauschale Clock-
    Stretching-/Hardwaredefekt-Erklaerung. Minutenlast/20 kontrollierte
    Wechsel als spaetere Haertung offen, nicht als bestanden behaupten.
  Quelle: eigene Messung und Beobachtung, `docs/testprotokoll-etappe4.md`
  (04.10.2026, Abend).

## WS2812 / NeoPixel

- **3,3-V-Logik an 5-V-versorgten WS2812 liegt unter dem Dateneingang-**
  Schwellwert (~3,5 V) → Flackern. Bewährte Fixes in der Community:
  echter Level-Shifter (74AHCT125), oder Versorgung des Sticks per
  Dioden-Drop auf ~4,3 V senken, oder ein „Opfer-Pixel" als Puffer.
  → Für Boxbert keine pauschale 1N4148-Lastdiode für den ganzen 8-LED-
  Stick freigeben. Pegelwandler oder passend belastbare Alternative
  nach Strom-/Spannungsprüfung planen; Forumslösung ist keine Abnahme
  für unseren Stick. Prüfgrenzen in `docs/power-plan.md`.
  Quelle: [AllAboutCircuits-Level-Shifter-Thread](https://forum.allaboutcircuits.com/threads/fast-and-accurate-3-3v-to-5v-level-shifter-for-neopixel-addressable-led-ws2812b-wled-esp32-project-needed.207614/), [r/WLED](https://www.reddit.com/r/WLED/comments/1hdlz6e/esp32_logic_level_shifter_ws2812b_keeps_flickering/)
- **FastLED-Flackern auf ESP32:** Umstellen von `FASTLED_SHOW_CORE` 0 → 1
  (WLAN-Kram läuft auf Core 0 und stört das Bit-Banging).
  → Heißt für Boxbert: Falls wir FastLED statt NeoPixel-Lib nutzen und es
  flackert, sobald WLAN an ist — erst diese Konstante drehen.

## TFT (ST7789, onboard Reverse-TFT-Feather)

- **`tft.init(240, 135)` ist falsch für das 1,14"-240×135-Panel (eigener
  Befund, 07.10.2026).** Die Lib rechnet die GRAM-Offsets nur bei
  `init(135, 240)` (Portrait-Maße) richtig — das steht im Lib-Beispiel
  `graphicstest_st7789` („//tft.init(135, 240); // Init ST7789 240x135“).
  Mit (240, 135) fällt der Aufruf durch keinen Offsets-Sonderfall:
  Inhalt landet in der Display-Mitte, Ränder zeigen geflecktes
  uninitialisiertes GRAM; Zeilen oben fehlen sichtbar. Korrektur im
  `etappe7_gesamtmonitor` mit `init(135, 240)` + Rotation 1 bestätigt
  (Nutzer: „sieht alles super aus, funktioniere alles“).
  **Achtung:** Die Etappe-0-Referenz `etappe0_tft` nutzt denselben
  falschen `init(240, 135)` — sie „lief“ bei der Abnahme, weil der
  kleine Text links oben zufällig lesbar war; Abnahmebefund „TFT ok“
  gilt nur eingeschränkt. Sketch bleibt als Referenz unangetastet;
  jeder neue TFT-Code benutzt `init(135, 240)`.
  Quelle: installierte Adafruit-ST7735/ST7789-Lib 1.11.0,
  `Adafruit_ST7789.cpp` Offset-Sonderfälle + Beispiele.

## AW9523 (GPIO-Expander)

- **GPIO-Modus und LED-Stromsenke unterscheiden (Herstellerprüfung,
  04.10.2026).** Adafruit zeigt GPIO-LED mit Widerstand; erst
  `AW9523_LED_MODE` bietet Konstantstrom-Senke (Kathode an Port),
  `analogWrite` setzt den Dimmwert. VIN am Feather laut Hersteller
  **3V3**, keine +5 V auf diese Rail. AB30L5-Widerstände bleiben erhalten.
  5-V-Portspannung, Reset-/Gesamtstromgrenzen und Stromsenken-Reserve
  noch anhand Datenblatt/Schaltplan prüfen; kein bereits bestandener
  Button-LED-Test und keine ungeprüfte Maximalstrom-/API-Angabe.
  Quelle: [Adafruit Arduino-Beispiele](https://learn.adafruit.com/adafruit-aw9523-gpio-expander-and-led-driver/arduino),
  [Pinouts](https://learn.adafruit.com/adafruit-aw9523-gpio-expander-and-led-driver/pinouts);
  aktueller Prüfplan `docs/power-plan.md`.
- **Register-Map aus dem Gedaechtnis = gefaehrlich (eigene Messung,
  07.10.2026).** Erste Etappe-6-Version las den Eingangszustand aus Reg
  0x06 (ist laut Bibliothek **INTENABLE0**) und schrieb "LEDMODE" ins
  Reg 0x11 (ist **GCR**) mit 0xFF -> globaler Konstantstrom-LED-Modus,
  A0 dauerhaft LOW. Symptom: I2C fehlerfrei, CONFIG-Readback plausibel,
  Pin trotzdem immer 0 — ACK beweist nicht, dass der Wert das Register
  erreicht, das man im Kopf hat. Korrektes Map laut Adafruit_AW9523.h:
  INPUT0=0x00, OUTPUT0=0x02, CONFIG0=0x04 (Bit 1=Eingang), CHIPID=0x10
  (liest 0x23), GCR=0x11, LEDMODE0=0x12/0x13, SOFTRESET=0x7F (0
  schreiben = Reset). LEDMODE-**und** CONFIG-Bits sind invertiert
  (Bibliothek schreibt ~pins; Registerbit 0 = LED-Sink, 1 = GPIO).
  Chip-ID-Check + Soft-Reset wie lib begin() sind billige Absicherung.
  Quelle: [Adafruit_AW9523.h/.cpp](https://github.com/adafruit/Adafruit_AW9523),
  Rohlogs `docs/serial/etappe6-aw9523-*`; Protokoll Etappe 6, Teil 2.
- **LED-Last klemmt den Eingangspin (eigene Beobachtung, 07.10.2026).**
  LED (Anode A0, Kathode GND) am Taster-Eingangspin: LED leuchtete
  unbetaetigt (ueber den 10k-Pull-up), Chip las trotzdem dauerhaft LOW
  — Pegelklemmung durch LED-Vorwaertsspannung unterhalb der HIGH-
  Schwelle. Regel: Eingangspins nur Pull-up + Taster sehen lassen;
  LED auf eigenen Port mit definierter Ansteuerung.
  Rohlog: `docs/serial/etappe6-aw9523-diag-a0.log`.
- **Breakout hat 17 VIN-Pads (Nutzer-Silkscreen-Check, 07.10.2026).**
  16 Port-VIN-Pads neben den GPIOs + 1 Haupt-VIN, intern dieselbe Rail
  (Adafruit-Guide: "connect the LED anode to one of the many VIN pads").
  Zweck: kurze LED-Anoden-Anschluesse ohne lange Draehte. Bei Boxbert:
  VIN=3,3 V — 5-V-LED-Einheiten (AB30L5) darueber nur schwach/dunkel,
  getrennte 5-V-LED-Rail bleibt Pruefthema in `docs/power-plan.md`.
  Quelle: [Adafruit AW9523-Guide](https://learn.adafruit.com/adafruit-aw9523-gpio-expander-and-led-driver/overview)
  ("one of the many VIN pads").
- **A0/A1-Adress-Pads live umzulöten kann den Chip einfrieren** (Community-
  Berichte) und **3,3-V-Outputs schalten manche 5-V-Verbraucher nicht
  sicher**.
  → Heißt für Boxbert: Adresse einmal setzen (0x58 passt, nichts anderes am
  Bus), dann nie wieder anfassen. Die 12-V-44-mm-LEDs hängen ohnehin nicht
  am AW9523 (siehe entscheidungen.md).
  Quelle: [Adafruit-Forum AW9523](https://forums.adafruit.com/viewtopic.php?p=1014497)

## Strom / Deep Sleep

- **Chip-Datenblatt ≠ Board-Realität.** Der nackte ESP32-S3 zieht im Deep
  Sleep ~7–8 µA; komplette Dev-Boards gemessen zwischen **25 µA und
  692 µA**, je nach Lade-IC, Regler, Pegelwandlern und Peripherie. Adafruit
  gibt für unser Feather ~40–50 µA an — das ist ein *Board-Sollwert*, kein
  Gesamtsystem.
  → Sleep-Strom mit geeignetem uA-Messaufbau messen, kein gewöhnlicher
  USB-Meter als uA-Nachweis. PN532 hängt aktuell am 3V3-Header, nicht
  hinter Boost-EN oder der TFT/STEMMA-Rail. Separate abschaltbare
  3,3-V-Versorgung erst planen; den externen Stick seiner realen Rail
  zuordnen, Rückspeisung prüfen (`docs/power-plan.md`). Herstellerprüfung
  04.10.2026: [Feather Power Management](https://learn.adafruit.com/esp32-s3-reverse-tft-feather/power-management).
  Quelle: [lucidar.me ESP32-S3-Deep-Sleep-Messungen](https://lucidar.me/en/esp32/power-consumption-of-esp32-s3-devkitm-1/), [Espressif Current-Consumption-Doku](https://docs.espressif.com/projects/esp-idf/en/stable/esp32s3/api-guides/current-consumption-measurement-modules.html)
- **WLAN-TX-Spikes bis ~310 mA.** Beim Abspecken des Akkus/Boosts
  einkalkulieren, nicht nur den Audiogrundlast-Fall.
  → Heißt für Boxbert: Beim Boost-Hörtest prüfen, ob Audioverzerrungen und
  WLAN-TX gleichzeitig auftreten können (Brownout-Symptom: spontaner
  Reboot). Ggf. Kondensator an VIN des Verstärkers.

## arduino-esp32-Core 3.x (Migration)

- **3.x ist kein Drop-in von 2.x:** Standard-UART-Pins wurden auf mehreren
  SoCs geändert (z. B. ESP32 UART1 auf GPIO26/27), und direkte Upgrades von
  1.x/2.x brechen SPIFFS (`SPIFFS.begin()` schlägt fehl).
  → Heißt für Boxbert: Wir starten frisch auf 3.x und halten Pins nur in
  `firmware/Config.h` — dann betrifft uns UART-Default-Änderung nicht, und
  SPIFFS-Never-Used-Szenarien vermeiden wir, indem wir für Konfigdaten
  (falls überhaupt nötig) von Anfang an LittleFS nutzen, nicht SPIFFS.
  Quelle: [Offizielle Migrations-Guide 2.x→3.0](https://docs.espressif.com/projects/arduino-esp32/en/latest/migration_guides/2.x_to_3.0.html), [Random Nerd Tutorials dazu](https://randomnerdtutorials.com/esp32-migrating-version-2-to-3-arduino/)

## 3D-Druck / Einzel-Mounts / OpenSCAD

- **AW9523: enge Loch-/Pinabstände erfordern keine dünne Einsatzwand
  (erneute Original-PCB-Auswertung und eigener CAD-Neuaufbau, 09.10.2026).**
  Vier Ø-2,5-Montagebohrungen, nächste Pins 3,81 mm entfernt. Ein breiter
  Pfosten bis zur PCB-Unterseite überschneidet mögliche Löt-/Pinbereiche.
  Die alte Behauptung „kein coaxialer Heat-Set-Pfosten ohne Freistich“ war
  zu pauschal: **Höhenstaffelung** löst die Kollision im neuen Entwurf.
  Ø-8,2-Gewindebereich endet 4 mm unter PCB; oben Ø-4,6-Auflage. Einsätze
  von unten, volle 1,8-mm-Wand um max. Einsatz-Ø 4,6; 0,41 mm nominale
  obere Freigängigkeit bei angenommener Lot-Hülle r=1,1. Pin-/Lot-Hüllen
  sind Entwurfsgrenzen, keine gemessene Hardware. Unterseiten-Einsätze
  weichen vom bündigen Obermontage-Wunsch ab und brauchen Nutzer-OK.
  Vorgänger mit 0,61-mm-Wand vom Nutzer verworfen und archiviert, niemals
  als freigegebene Konstruktion verwenden. **Zusätzlicher Quellenfehler
  korrigiert:** Layer-20-Ecken enthalten curve=90, also Radius 2,54 mm,
  keine Fasen. Quellenkopie/Pad-Rotationsprüfung und neue STL-Rohlogs in
  `docs/cad/2026-10-09-aw9523-redesign/`; Prüfstand in
  `docs/testprotokoll-aw9523-mount.md`. Kein physischer Passungsnachweis.

- **Ein Boden mit Ausschnitten ist nicht automatisch das gewünschte Gitter
  (Nutzer-Sichtprüfung, 09.10.2026).** Der Vorgänger war ein Rahmen mit
  unregelmäßigen Öffnungen und erhöhter L-Auflage und wurde ausdrücklich
  abgelehnt. Neuaufbau mit regelmäßigem 4-mm-Zellraster/2-mm-Rippen und
  einzelnen Pfosten wurde nach Senkkopf-Anpassung ausdrücklich gelobt.
  → Bestätigte Form beibehalten, nicht den verworfenen Entwurf schrittweise
  reparieren. Lokale Pads sind erlaubt; Raster bleibt die Grundstruktur.
  Quelle: Nutzerentscheidungen `hardware/gehaeuse-konzept.md`,
  aktuelle/archivierte Bilder in `3d-print/mounts/stepup-mount/`.

- **Einbauzeichnung statt Einsatz-Außenmaß/STEP-Kontrollpunkten
  (Herstellerprüfung, 09.10.2026).** ruthex RX-M2,5×5,7: Einbauloch
  **Ø 4,0 mm**, Mindesttiefe **L + 1 = 6,7 mm**, Mindestwand **1,6 mm**
  radial. Einsatz-Maximal-Ø 4,6 mm ist nicht der Einbauloch-Ø. Die alten
  Ø-4,2-/5,8-mm-Pocketwerte waren nicht hergeleitet und bleiben verworfen.
  → Bei neuen Pfosten diese Herstellerwerte verwenden; Einschmelzpassung
  trotzdem zunächst am Probestück mit realem Material/Druckprofil prüfen.
  Quelle: [ruthex-Maßtabelle mit Einbauzeichnung](https://cdn.shopify.com/s/files/1/0567/7019/9760/files/1Tabelle.PT05_eb2a30fa-5c34-46f8-b557-a6c432354560.jpg?v=1748341911),
  `docs/kernwerte.md`, `docs/testprotokoll-stepup-mount.md`.

- **PCB-Kontur und Bohrwert direkt lesen; Foto ersetzt keine Überstandsmessung
  (Herstellerprüfung, 09.10.2026).** Originale MiniBoost-Eagle-Datei hat
  11,43 × 17,78 mm Kontur und genau ein Montageloch; tatsächliches
  Package-Pad `drill="2.5"` bestätigt Ø 2,5 mm. Unterseitenfoto zeigt keine
  aufgesetzten Bauteile, aber keine am Boxbert-Modul angelöteten Pins.
  → Herstellerfotos selbst recherchieren, PCB-`drill` und Koordinaten
  auswerten. Für den AW9523 weder MiniBoost-Maße noch M2,5-Kompatibilität
  aus Wiederholung ableiten. 8-mm-Luftreserve ist keine gemessene Lötfreiheit.
  Quellen: [Adafruit-PCB](https://github.com/adafruit/Adafruit-TPS61023-PCB),
  [Unterseitenfoto](https://cdn-shop.adafruit.com/970x728/4654-08.jpg),
  `docs/testprotokoll-stepup-mount.md`.

- **Gleich hohe Pfosten können versehentlich miteinander verschmelzen
  (eigene CAD-Prüfung, 09.10.2026).** Ein früher Zwischenstand setzte den
  hinteren Ø-2,8-mm-Stützpfosten bei PCB-y=11: Abstand zum Ø-8,2-mm-
  Schraubpfosten nur ca. 5,30 mm bei Radien-Summe 5,50 mm, also Überlappung.
  Stützpunkte neu bei y=6,5/10; kleinster Zylinderabstand nun ca. 0,63 mm,
  zwischen Stützpfosten 0,7 mm. Lokale Fußpads dürfen verbunden sein,
  die oberen Pfosten sollen getrennt stehen.
  → Zentrumabstände gegen Radien prüfen, im SCAD Assertions und in der STL
  Luft-Punktprüfungen verwenden; nicht nur hübsche Isoansicht betrachten.
  Quelle: eigener CAD-Zwischenvergleich; aktuelle Parameter/Assertions in
  `stepup_mount.scad`, Prüfprotokoll und `check_mesh.py` im Mount-Ordner.

- **OpenSCAD „Manifold / NoError“ reicht nicht für die exportierte STL
  (eigener digitaler Befund, 09.10.2026).** Im zunächst exportierten
  Manifold-Binär-STL kollabierten Dreiecke an fast deckungsgleichen
  Kreis-/Fußkanten zu Nullflächen, trotz erfolgreicher CAD-Meldung.
  Durchgehende Pfostenkerne, radial 0,2 mm größere ebene Pads als konische
  Füße und endgültiger CGAL-Export lieferten eine sauber geprüfte STL.
  → Nicht nur Renderstatus prüfen: tatsächliche Binär-STL auf winzige/
  degenerierte Dreiecke, Kantenorientierung, Zusammenhang und Bounds
  prüfen. Fehler nicht durch bloßes Verschweigen oder Mesh-Reparatur
  überdecken. Befund gilt für diesen Aufbau/Toolstand, nicht pauschal
  als Aussage, dass jeder Manifold-Export defekt sei.
  Quelle: `docs/testprotokoll-stepup-mount.md`, erfolgreiche Rohlogs
  `docs/cad/2026-10-09-stepup/` und `senkkopf/`, `check_mesh.py`.

- **Senkkopf braucht lokal Material — nicht den ganzen Gitterboden verdicken
  (Konstruktion/Rechnung, 09.10.2026; kein physischer Test).** Nutzer wählt
  3 × 12 mm Senkkopf-Holzschrauben in 12-mm-Pappel. Im 2-mm-Boden ließe
  eine Ø-6,2-/90°-Senkung bei Ø-3,2-Durchgang nur 0,5 mm Restmaterial.
  Lokales 3,5-mm-Polster lässt unter 1,5-mm-Senkung wieder 2 mm stehen.
  Länge bei Senkkopf inklusive Kopf: nominal 8,5 mm Holzeingriff und
  3,5 mm Reserve bei bündigem Kopf. Kopf kann tiefer sitzen; keine reale
  Sicherheitsfreigabe aus dieser Rechnung ableiten.
  → Nur Schraubpolster erhöhen; Holzschraube nicht mit M3-Gewinde verwechseln.
  Konkrete Kopfgeometrie, Ist-Holzstärke, Vorbohrung und Halt am Reststück
  prüfen, von Hand anziehen, Tiefe begrenzen.
  Quellen: Nutzerentscheidung `hardware/gehaeuse-konzept.md`, Rechnung/
  Geometrieprüfungen im Senkkopf-Nachtrag des Testprotokolls; Kopf-Ø-
  Referenz [SPAX-Tabelle beim Händler](https://1aschrauben.de/mediafiles/Sonstiges/Spax/KopfdurchmesserSPAX-Schrauben.pdf).

- **Transparente PCB-Vorschau: Kontaktflächen flackern, Dummies nicht exportieren
  (eigene Sichtprüfung, 09.10.2026).** Exakt deckungsgleiche PCB-Unterseite
  und Pfostenoberkanten erzeugten sichtbare Streifen. 0,03 mm reiner
  Anzeigeversatz beseitigte sie, ohne Mountgeometrie zu ändern. Symbolischer
  Einsatz-Dummy ist zur kollisionsfreien Anzeige schlanker als real.
  → Anzeigeannahmen benennen, nicht als mechanische Toleranz/Messung nutzen.
  Dummies mit `$preview` schützen; STL nur Mount. Bilder mit
  `QT_QPA_PLATFORM=offscreen`/`--preview`, STL mit CGAL reproduziert.
  Quellen: aktuelles SCAD/`render.sh`/Bilder, CAD-Testprotokoll.

- **Prüfskript und Ein-Loch-Lösung sind modulspezifisch
  (Übergabe, 09.10.2026).** Das Step-Up-Prüfskript hat feste STL-Datei,
  Bounds und Prüfkoordinaten. Unverändert weiterverwendet würde es den
  Step-Up statt eines neuen Expanders prüfen. Dessen zwei mittige massive
  Stützpfosten sind ein Workaround für genau ein Montageloch, keine
  allgemeine Vorgabe für Boards mit mehreren Löchern.
  → Für jedes Modul eigenes CAD/STL und passende Prüfungen/Logs; vorhandene
  PCB-Montagepunkte nutzen. Reine Auflagen sind keine Verdrehsicherung,
  Kabel/Nachbarmodule keine Halterungen. Neue Session: Übergabe lesen.
  Quellen: `check_mesh.py`, `hardware/gehaeuse-konzept.md`,
  `docs/mounts-weiterarbeit.md`.

## Projekt-Referenzen (nicht nur lesen, sondern benutzen)

- **[ESPuino](https://github.com/joker-mik/ESPuino)** — inkl. wertvoller
  Konfig-Flags wie `SD_NOT_MANDATORY_ENABLE` (startet ohne SD-Karte zum
  Debuggen). Heißt für Boxbert: Beim Firmware-Bau an ähnliche Debug-Flags
  denken (z. B. „audio ohne NFC testen", „NFC ohne SD testen").
- **[Tonuino-ESP32-I2S](https://github.com/mariolukas/Tonuino-ESP32-I2S)** —
  die I2S-Variante des Tonuino-Konzepts; Wertfrei archivieren als
  Referenz für Button-NFC-Playlist-Logik.

---

## Noch offen / später recherchieren

- Erfahrungswerte zu TPS61023-Boost am ESP32 (wir haben ihn, Community-
  Threads dazu sind dünn — beim eigenen Test dokumentieren und hier
  ergänzen).
- 44-mm-Button-LEDs an 12 V: Foren-Erfahrungswerte, ob sie an 5 V „irgendwas
  schwach glimmen" oder komplett dunkel bleiben — wir testen selbst und
  tragen es hier nach (besser als fremde Spekulation).
- React-PWA + ESP32-Webserver: Upload-Chunks, Bootstrap-Größe, Offline-
  Verhalten — recherchieren, wenn Etappe 5 ansteht (jetzt zu früh).
