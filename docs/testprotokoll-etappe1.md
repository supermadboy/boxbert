# Testprotokoll — Etappe 1: I2S + Lautsprecher

**Datum:** 02.10.2026
**Sketch:** `firmware/tests/etappe1_audio_led/` (v2, mit `i2s.setPins()`)
**Core:** arduino-cli 1.5.1, esp32 3.3.12
**Ergebnis: BESTANDEN** (siehe unten), mit zwei wichtigen Lehrstücken.

## Verkabelung (ist so gebaut, gegen Modul-Silkscreen verifiziert)

Modul ist ein **MAX98357A-Klon** (schwarz, grüne Schraubklemme) — Pin-
Reihenfolge **NICHT** wie das Adafruit-ADA3006-Layout:

| Modul-Pin | Feather | Anmerkung |
|---|---|---|
| VIN | USB (5 V) | läuft auch an 3V3, dann leiser |
| GND | GND | |
| SD | 3V3 | erzwingt Mono-Mix (L+R)/2, Datenblatt-Schwellwerte s. unten |
| GAIN | **offen** | 9 dB |
| DIN | IO16 (A2) | = ESP32-DOUT |
| BCLK | IO17 (A1) | |
| LRC | IO18 (A0) | |

Lautsprecher ADA3351 (4 Ω / 3 W) über JST-PH an OUT.

## Fehlersuche — was passiert ist (Lehrstücke!)

1. **v1-Sketch hatte `setPins()` nicht.** `I2SClass::begin()` läuft ohne
   Pins erfolgreich durch, `write()` zählt Bytes — aber die GPIO-Matrix
   verbindet die Pins nie mit dem I2S-Controller → **grüne LED,
   written=88200/88200, trotzdem tote Stille.** Fix: `i2s.setPins(17, 18, 16)`
   vor `begin()`. Ohne das Piept der Durchgangsprüfer fröhlich weiter.
2. **SD-Pin-Verwirrung:** Erste Messung „SD = 0,45 V" wurde am falschen Pin
   genommen (Klon-Pinout ≠ Adafruit-Reihenfolge). Datenblatt-Schwellwerte
   (aus dem MAX98357A-Datenblatt, SD/SD_MODE): < 0,16 V = Shutdown;
   0,16–0,77 V = nur rechter Kanal; 0,77–1,4 V = nur linker Kanal;
   > 1,4 V = Mono (L+R)/2. Unser Sketch schickt Mono-Daten — mit SD auf
   3,3 V ist der Modus sauber festgenagelt.
3. **Klon-Modul:** 7 Pins in einer Reihe, echte Reihenfolge
   `VIN, GND, SD, GAIN, DIN, BCLK, LRC` (am Modul abgelesen).
   → Nachtrag in `docs/kernwerte.md`.

## Messwerte / Hörtest (Ohr von Daddelbert, 02.10.2026)

| AMP (of 32767) | rel. Pegel | Ausgangsleistung ≈ (4 Ω, 1 % THD) | Höreindruck |
|---|---|---|---|
| 10 | −70 dB | ~23 µW | **noch gut hörbar** (Zirpen) |
| 100 | −50 dB | ~23 µW | leise, gut hörbar |
| 500–3000 | −36…−21 dB | mW-Bereich | angenehm leise |
| 12000 | −8,5 dB | ~0,4 W | laut, klar |
| 32000 | ~0 dB | ~2,4 W | **„extrem laut"** (Kind im Raum — Test abgebrochen) |

- Rechenweg: P = 2,5 W (1 % THD @ 5 V/4 Ω lt. Datenblatt) × (AMP/32767)².
- Verzerrungen: bei AMP ≤ 12000 keine hörbar.
- Bezug max.: EN 71-1 (nah am Ohr) verlangt 65 dB(A), Hand-/Tischspielzeug
  85 dB(A) — 3,2 W@4 Ω (10 % THD) wären weit darüber, daher
  **Software-Limit nötig** (siehe Empfehlung unten).

## Fazit / Konsequenzen

- [x] **Etappe 1 BESTANDEN:** I2S läuft, beide Testfrequenzen hörbar,
      verzerrungsfrei im getesteten Bereich.
- **Software-Lautstärkedekel:** MAX_AMP in `firmware/Config.h` auf
  ~6000–8000 begrenzen (≈ 80 dB @ 0,5 m Region, Spielzeugnorm-nah).
  AMP 10–32000 ist technisch möglich, aber 32000 + Kind = nein.
- **Fade-in/out** bei Play/Pause später einbauen (Pop-Prävention,
  siehe `docs/findings.md`).
- **Klon-Modul dokumentiert** — bei Ersatz/Ergänzung gilt:
  Pinreihenfolge IMMER am Silkscreen gegenprüfen, nicht von Adafruit
  oder anderen Klons übertragen.
- Boost-Ausgang am Verstärker (5,2 V statt 5 V): Hörtest-Erkenntnis —
  bei 5 V ist selbst AMP 100 deutlich hörbar. 5,2 V-Boost bringt
  +0,4 dB — **lautstärkeseitig unnötig**, Entscheidung vorerst: kein Boost
  auf den Verstärker (revisit im Gehäuse-Hörtest).
