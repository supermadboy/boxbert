# Testprotokoll — Etappe 2: SD-Karte + erste mp3-Wiedergabe

**Datum:** 02.10.2026
**Sketches:** `firmware/tests/etappe2_sd/` (Dateiliste), `firmware/tests/etappe2_play/` (mp3 via ESP32-audioI2S v4.0.0)
**Ergebnis: BESTANDEN** — Dateiliste ✔, mp3-Decode + Wiedergabe über I2S ✔

## Verkabelung

| SD-Modul (Soldered MSD-AADP) | Feather | |
|---|---|---|
| VCC | USB (5 V) | Onboard-3,3-V-Regler |
| GND | GND | |
| SCLK | IO36 (SCK) | |
| MOSI | IO35 (MO) | |
| MISO | IO37 (MI) | |
| CS | IO10 | CS vor Init auf HIGH gezogen (Bibliotheksbeispiel-Praxis) |

MAX98357A wie Etappe 1 (SD an 3V3 → Mono, GAIN offen = 9 dB).
Geteilter SPI-Bus noch unkritisch — nur SD angeschlossen (PN532 kommt in Etappe 4).

## Ablauf

1. Karte am PC FAT32 formatiert (war schon `vfat`, geprüft mit `lsblk -f`),
   mp3s per `ffmpeg` aufgespielt (`pups01.mp3` synthetisiert,
   `arcade-music-loop.mp3` konvertiert aus WAV von freesound, 44,1 kHz stereo).
2. `etappe2_sd`: Dateiliste am SPI-Bus ✔ (nach anfänglichem Verkabeln;
   erster Versuch schlug fehl, weil die Karte noch im PC steckte).
3. `ESP32-audioI2S` v4.0.0 installiert (Lib braucht PSRAM).
4. mp3-Wiedergabe: 34-s-Arcade-Loop (44,1 kHz, Stereo) → I2S → Amp.

## Messwerte / Beobachtungen

| Wert | Messung |
|---|---|
| Karte | 29.818 MB, FAT32, erkannt ✔ |
| mp3 | MPEG-1 Layer III, 44,1 kHz, 2 Kanäle, ~129 kbit/s |
| Decode | PSRAM nötig — inputBufferSize 655 KB aus PSRAM |
| Volume 6 (von 21) | **leise-schön** — Daddelberts Komfortstufe |
| Volume 21 (max) | sehr laut, „Oberhammer" — als obere Stufe ok, aber Cap im Blick behalten |
| Störungen | keine hörbaren; SD + I2S parallel laufen stabil |

**⚠️ Build-Falle (kosten einen Flash-Zyklus):** Der Adafruit-Feather hat
**QSPI-PSRAM** (Board-Default `PSRAM=enabled` → `qspi`). Ein erzwungener
`PSRAM=opi`-Build kompiliert sauber, aber zur Laufzeit ist der Decoder
nutzlos (kein PSRAM-Zugriff) → `connecttoFS()` schlägt fehl. Standard-FQBN
verwenden, die Board-Definition weiß es besser.

## Konsequenzen

- [x] **Etappe 2 BESTANDEN:** SD am SPI-Bus gelesen, mp3 dekodiert,
      wiedergegeben; Lautstärke-Skala 0–21 vermessen (6 leise ✔,
      21 max).
- Volume-Regler in der Firmware später: Deckel bei ~10 (die Stufe 21 ist
  ohnehin schon „maximal unangenehm" — Spielzeugnorm-Kriterium erfüllt).
- Bei Etappe 4 (PN532 am selben SPI-Bus): SD-Takt ggf. von 1 MHz hoch-
  tasten; CS idle high hat sich bewährt.
- `pups01.mp3` (eigene ffmpeg-Synthese) wartet auf Etappe 3: Button drücken
  → Pups. Pups-Qualität ist ein eigenes kleines Sprint-Thema. 😄
