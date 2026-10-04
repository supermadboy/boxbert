# Testprotokoll — Etappe 3: Buttons — „Button drückt, Pups kommt raus"

**Datum:** 02.10.2026
**Sketch:** `firmware/tests/etappe3_button/` (Button an IO5 → `subbasesoft.mp3`, Boot-Loop `arcade-music-loop.mp3`)
**Ergebnis: BESTANDEN** — Button-Druck unterbricht Boot-Loop und spielt Pups ✔

## Verkabelung

| 24-mm-Button (AB24OL, unbeleuchtet) | Feather | |
|---|---|---|
| Terminal A | IO5 (D5) | `INPUT_PULLUP`, LOW = gedrückt |
| Terminal B | GND | |

Kein AW9523 nötig — direkter GPIO. IO5 bewusst gewählt: Deep-Sleep-Wake-GPIO
für später (Wake-Buttons auf IO5/IO6/IO11). Button-LEDs (wie im Fahrplan)
noch nicht angeschlossen.

Unverändert aus Etappe 2: SD (CS=IO10, SCK=IO36, MOSI=IO35, MISO=IO37,
VCC=USB-5V), MAX98357A (DOUT=IO16, BCLK=IO17, LRC=IO18, SD-Pin an 3V3).

## Ablauf

1. Button Terminal A → IO5, Terminal B → GND (Schließer, OFF-(ON)).
2. Sketch geflasht: Boot → Arcade-Loop (Volume 6), NeoPixel blau → grün.
3. Button gedrückt → Loop bricht ab, `subbasesoft.mp3` (2,9 s) läuft,
   NeoPixel dunkelt ab (blaugrün → dunkelgrün).

## Messwerte / Beobachtungen

| Wert | Messung |
|---|---|
| Entprellen | 20 ms einfache Flankenerkennung — kein Doppel-Trigger beobachtet |
| Boot-Loop | startet zuverlässig nach Reset, läuft stabil |
| Button-Druck während Wiedergabe | unterbricht laufenden Track sauber (`connecttoFS` bricht ab) |
| Volume 6 | Boot-Loop angenehm leise (Komfortstufe aus Etappe 2) |
| Volume 12 (Hörtest) | Pups deutlich präsenter — **6 → 12 als Kompromiss im Sketch** |
| Pups | `subbasesoft.mp3`, 2,9 s, kindgerecht leise |
| Störungen | keine; Button und I2S-Wiedergabe stören sich nicht |

## Konsequenzen

- [x] **Etappe 3 BESTANDEN:** GPIO-Button mit INPUT_PULLUP getestet,
      Wiedergabe per Button-Druck ausgelöst.
- Volume-Stand im Sketch: **12** (Hörtest — zwischen „leise-schön" (6)
  und max (21)). **Klarstellung 04.10.2026:** kein gemessener dB(A)-Wert,
  kein Normnachweis; späteres akustisches Limit nach `docs/audio-safety.md`
  bestimmen. Historischer Volume-12-Sketch ersetzt nicht Volume-6-
  Referenz des Etappe-4-Players.
- IO6/IO11 und 44-mm-Wechselschalter (COM/NO) waren hier **nicht getestet**.
  Vor Nutzung eigene Anschluss-/Durchgangs- und Funktionstests durchführen;
  elektrische Ähnlichkeit ist keine Abnahme.
- Damaliger nächster Plan war NFC auf geteiltem SPI. **Inzwischen
  überholt:** Etappe 4 mit PN532-I2C bestanden, keine Wiederaufnahme der
  alten SS-IO9-/SPI-Anleitung (`hardware/pinout.md`).
