# Findings — Wissen aus Foren & Blogs (kuratiert)

Praxis-Wissen von Leuten, die es selbst gebaut haben (Foren-Threads, Blogs,
GitHub-Issues) — gesammelt am **01.10.2026**, sortiert nach unseren
Baugruppen. Kein Ersatz für `docs/kernwerte.md` (dort stehen *unsere*
Bauteile), sondern das, was schiefgeht, bevor wir es selbst erleben.

Pflegeregel: Nur echte Quellen von echten Menschen (Forum, Blog, Issue) —
keine KI-generierten „Top-10-Artikel". Jedes Finding mit Link und, wenn
relevant, mit „Heißt für Boxbert". Neues oben dran? Nein — beim passenden
Thema einfügen, Datum dazu.

---

## I2S-Audio / MAX98357A

- **Knackser beim Start/Stop sind normal und behandelbar.** Der MAX98357A
  zentriert seinen Analog-Ausgang bei VCC/2; fährt der I2S-Stream mit
  Nullen hoch/runter, hörst du einen Pop. Abhilfe: Samples am Anfang und
  Ende des Streams softwareseitig ein-/ausblenden (Fade-in/Fade-out).
  → Heißt für Boxbert: In die Firmware — Play/Pause mit kurzem Fade bauen,
  nicht hart abschalten.
  Quelle: [EE StackExchange „MAX98357A popping noise"](https://electronics.stackexchange.com/questions/723166/max98357a-creating-popping-noise-understanding-i2s-for-stm32), [esp32.com I2S-Crackling-Thread](https://www.esp32.com/viewtopic.php?t=4872)
- **32-bit-Samples auf 16-bit-Format → Dauerknacksen.** Der Chip will
  16-bit-Daten; wenn die Library 32 bit schickt, knistert es dauerhaft.
  → Heißt für Boxbert: Bei ständigen Knacksern zuerst das Sample-Format
  prüfen (`I2S_DATAFORMAT_16B` bzw. 16-bit-Standard der gewählten Library).
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
- **MAX98357A-Klons: Pinreihenfolge am Silkscreen prüfen, nicht raten.**
  Unser Modul (schwarz, grüne Schraubklemme): `VIN, GND, SD, GAIN, DIN,
  BCLK, LRC` — völlig anders als Adafruit-Layout. Positionsgleich
  „durchverdrahtete" Kabel piepen beim Durchgangstest perfekt und
  funktionieren trotzdem nicht. IMMER Beschriftung gegenprüfen.
- **MAX98357A: SD-Pin ist ein Analog-Schwellwert-Pin, kein Digital-Ein/Aus.**
  Datenblatt-Modi: < 0,16 V = Shutdown · 0,16–0,77 V = nur rechter Kanal ·
  0,77–1,4 V = nur linker Kanal · > 1,4 V = Mono-Mix (L+R)/2. Ein „halbhoch
  hängender" Pin (z. B. halber Kontakt) kann also rechte-Kanal-Modus
  erzeugen: Das Mono-Links-Slot-Signal wird dann nicht ausgegeben →
  unsichtbar stumm. Fix: SD fest an 3,3 V.
- **Lautstärke-Dynamik ist enorm:** AMP 10/32767 (≈ −70 dB) am 4-Ω-LS
  ist noch deutlich hörbar. Für Kindersicherheit: MAX_AMP per Software
  begrenzen (EN 71-1: 85 dB(A) für Hand-/Tischspielzeug, 65 dB(A)
  nah-am-Ohr — Messung Quelle: STC-Infosheet, STC Group 2020).
  Eigene Messreihe: `docs/testprotokoll-etappe1.md`

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

- **Gemeinsamer Bus zwischen SD-Reader und RFID führt häufig zu Bus-Lockups**
  — es ist DIE bekannte Schwachstelle solcher Projekte. Forumslage: Uneins,
  ob Pull-ups/CS-Widerstände das zuverlässig fixen; als zuverlässiger gilt
  ein zweiter SPI-Bus.
  → Heißt für Boxbert: Wir bleiben beim geteilten Bus (nur 2 Geräte, eigener
  CS je Gerät, laut Plan beginnen bei 4 MHz und hochtasten) — aber wenn
  Etappe 4 hakt, ist das der erste verdächtige Punkt, und ein zweiter Bus
  (z. B. SD an FSPI, PN532 an HSPI) ist der Plan B. Nicht stundenlang am
  gleichen Bus dubeln.
  Quelle: [StackExchange RFID+SD-Thread](https://stackoverflow.com/questions/75639315/using-rfid-and-sd-card-reader-at-the-same-time-with-spi-and-esp32-not-working)

## PN532 (NFC)

- **Clone-Module sind stark unterschiedlich** (z. B. HW-147C): DIP-Schalter-
  Beschriftung, Pegelwandlung und Library-Kompatibilität variieren.
  Bibliotheken defaulten auf ~1 MHz SPI; manche Setups laufen erst bei
  deutlich weniger.
  → Heißt für Boxbert: Vor dem ersten Anschließen DIP-Stellung physisch
  gegenmodulieren (steht schon so in `breadboard-testing.md`), SPI-Clock
  konservativ starten. Der I2C-Modus gilt in Foren als unzuverlässig an
  geteilten Bussen — unsere SPI-Entscheidung wird bestätigt.
  Quelle: [Arduino-Forum PN532-Thread](https://forum.arduino.cc/t/esp32c6-pn532-nfc-reader-hw-147c-spi-i2c-communication-not-working-didnt-find-pn53x-board/1415164), [esp32.com ESP-IDF/PN532](https://esp32.com/viewtopic.php?p=142068&t=43567)

## WS2812 / NeoPixel

- **3,3-V-Logik an 5-V-versorgten WS2812 liegt unter dem Dateneingang-**
  Schwellwert (~3,5 V) → Flackern. Bewährte Fixes in der Community:
  echter Level-Shifter (74AHCT125), oder Versorgung des Sticks per
  Dioden-Drop auf ~4,3 V senken, oder ein „Opfer-Pixel" als Puffer.
  → Heißt für Boxbert: Unser Plan (330 Ω in Reihe, fallback 1N4148 in die
  VCC-Leitung des Sticks) ist genau der Community-Standard — wenn
  geflickert wird,Diode rein, kein Geld für einen Shifter nötig.
  Quelle: [AllAboutCircuits-Level-Shifter-Thread](https://forum.allaboutcircuits.com/threads/fast-and-accurate-3-3v-to-5v-level-shifter-for-neopixel-addressable-led-ws2812b-wled-esp32-project-needed.207614/), [r/WLED](https://www.reddit.com/r/WLED/comments/1hdlz6e/esp32_logic_level_shifter_ws2812b_keeps_flickering/)
- **FastLED-Flackern auf ESP32:** Umstellen von `FASTLED_SHOW_CORE` 0 → 1
  (WLAN-Kram läuft auf Core 0 und stört das Bit-Banging).
  → Heißt für Boxbert: Falls wir FastLED statt NeoPixel-Lib nutzen und es
  flackert, sobald WLAN an ist — erst diese Konstante drehen.

## AW9523 (GPIO-Expander)

- **Konstantstrom-Modus treibt bis ~45 mA pro Pin** — für unsere
  5-V-Button-LEDs potentiell zu viel, wenn man die Default-Helligkeit
  einfach voll aufdreht.
  → Heißt für Boxbert: In der Firmware den Strom per Library drosseln
  (z. B. `setMaxCurrent` / Port-Config), bevor die LEDs mit voller Pulle
  laufen; Dimmwerte ohnehin per I2C — da ist der Stromlimit-Mechanismus
  gratis dabei.
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
  → Heißt für Boxbert: Nach dem ersten Sleep-Test selbst messen (USB-Meter
  zwischen Akku/Board), PN532- und NeoPixel-Versorgung müssen im Sleep
  über Boost-EN oder Rail-Switch wirklich stromlos sein — sonst dominieren
  die Peripheral-Ströme den Board-Sleep-Strom locker um Faktor 10.
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
