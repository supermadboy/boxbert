# Testprotokoll — Etappe 1: I2S + Lautsprecher

**Datum:** 02.10.2026
**Sketch:** `firmware/tests/etappe1_audio_led/` (v2, mit `i2s.setPins()`)
**Core:** arduino-cli 1.5.1, esp32 3.3.12
**Ergebnis: BESTANDEN** (siehe unten), mit zwei wichtigen Lehrstücken.

## Nachtrag zur Modulidentifikation — 09.10.2026

Nutzer bestätigt, dass das fotografierte Modul das bestellte ADA3006 ist.
Fotos beider Seiten stimmen mit Adafruit-Herstellerfoto und Mono-PCB-Layout
visuell überein (auch grüne Schraubklemme und Pinreihe). Die folgenden
historischen „Klon / schwarz / anderes Layout“-Deutungen sind damit
widersprochen, nicht als aktuelle Modulidentifikation verwenden.
Pinbeschriftungen und bestätigte Verdrahtung bleiben unverändert.
Quellenvergleich: `docs/cad/2026-10-09-max98357-mount/`.
Der Nachtrag ändert nicht die Mess-/Hörergebnisse des damaligen Tests.

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

**Klarstellung 04.10.2026:** Höreindrücke bleiben als Beobachtungen
bestehen. Relative digitale Pegel und elektrische Leistungsschätzungen
sind keine gemessenen dB(A)-Werte. Es wurde keine kalibrierte akustische
Messung oder Normprüfung dokumentiert (`docs/audio-safety.md`).

| AMP (of 32767) | relativer digitaler Pegel | idealisierte Leistungsschätzung, NICHT gemessen | Höreindruck |
|---|---|---|---|
| 10 | −70 dB | ~0,23 µW | **noch gut hörbar** (Zirpen) |
| 100 | −50 dB | ~23 µW | leise, gut hörbar |
| 500–3000 | −36…−21 dB | mW-Bereich | angenehm leise |
| 12000 | ~−8,7 dB | ~0,34 W | laut, klar |
| 32000 | ~0 dB | ~2,4 W | **„extrem laut"** (Kind im Raum — Test abgebrochen) |

- Damaliges idealisiertes Rechenmodell: P = 2,5 W (Datenblattwert)
  × (AMP/32767)², ohne Ausgangsmessung/Kalibrierung. **Nachtrag 04.10.2026:**
  Rechenfehler bei AMP 10 korrigiert (0,23 statt 23 µW), AMP-12000-Wert
  präzisiert. Modellannahmen beweisen weder reale Leistung noch Schalldruck.
- Verzerrungen: bei AMP ≤ 12000 keine hörbar.
- Frühere pauschale Zuordnung 65/85 dB(A) und Ableitung aus 3,2 W
  **nicht als Normvorgabe oder Sicherheitsnachweis verwenden**. Kategorien,
  Messbedingungen und Grenzwerte noch anhand anwendbarer Norm prüfen;
  aus Watt/AMP allein folgt kein Schalldruckwert.

## Fazit / Konsequenzen

- [x] **Etappe 1 BESTANDEN:** I2S läuft, beide Testfrequenzen hörbar,
      verzerrungsfrei im getesteten Bereich.
- **Software-Limit weiter erforderlich, konkreter Wert offen.** Frühere
  Idee MAX_AMP 6000–8000 und „≈80 dB @0,5 m“ ist nicht akustisch
  verifiziert und keine kindersichere Grenzwertfreigabe. AMP 32000 war
  subjektiv extrem laut; keine Wiederholung mit Kind. Messplan in
  `docs/audio-safety.md`, Hörtest nicht in Normmessung umdeuten.
- **Fade-in/out** bei Play/Pause später einbauen (Pop-Prävention,
  siehe `docs/findings.md`).
- **Klon-Modul dokumentiert** — bei Ersatz/Ergänzung gilt:
  Pinreihenfolge IMMER am Silkscreen gegenprüfen, nicht von Adafruit
  oder anderen Klons übertragen.
- Boost-Ausgang am Verstärker (5,2 V statt 5 V): Hörtest-Erkenntnis —
  bei 5 V ist selbst AMP 100 deutlich hörbar. 5,2 V-Boost bringt
  +0,4 dB — **lautstärkeseitig unnötig**, Entscheidung vorerst: kein Boost
  auf den Verstärker (revisit im Gehäuse-Hörtest).
