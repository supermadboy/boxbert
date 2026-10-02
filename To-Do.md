# Boxbert — To-Do

## In Arbeit / Nächste Schritte

- [ ] **Etappe 4:** PN532 (NFC) am geteilten SPI-Bus (SS=IO9) — DIP auf
  SPI, VCC an 3V3. Test: Tag auflegen → UID. Danach Etappen 5–6 nach
  Fahrplan, je Etappe ein Testprotokoll in `docs/`.
- [ ] Framework-Entscheidung (Arduino vs. ESP-IDF) — erst relevant für
  Sprint 4 (Firmware-Skelett), nicht für die Breadboard-Etappen.

## Erledigt

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
  Software-Lautstärkedekel für `Config.h` vereinbart (MAX_AMP ~6000–8000,
  EN 71-1: 85 dB(A) Spielzeug).

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
