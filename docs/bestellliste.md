# Bestellliste — Boxbert

## Tastenkrone (berrybase.de) — bestellt am 27.09.2026, Status: unterwegs

Gesamt brutto: **109,81 €** (Netto 92,28 €, MwSt 17,53 €, Versand 4,95 €).
Diese Liste ist der tatsächliche Kauf — Abweichungen von `hardware/BOM.md`
sind bewusste Entscheidungen daraus (Details in `docs/entscheidungen.md`).

| Produkt-Nr. | Bezeichnung | Menge | Einzelpreis | Summe |
|---|---|---|---|---|
| ADA4654 | Adafruit MiniBoost 5 V @ 1 A — TPS61023 | 1 | 3,90 € | 3,90 € |
| ADA3006 | Adafruit I2S 3 W Class D Verstärker — MAX98357A | 1 | 5,90 € | 5,90 € |
| ADA3351 | Mono-Gehäuselautsprecher, 3 W 4 Ω | 1 | 4,35 € | 4,35 € |
| PN532-MOD | PN532 NFC/RFID-Modul, UART/I2C/SPI, inkl. Karte & Dongle | 1 | 7,20 € | 7,20 € |
| NEOPS8 | NeoPixel Stick, 8 × WS2812 5050 RGB | 1 | 2,60 € | 2,60 € |
| MSD-AADP | microSD Card Reader Modul, SPI | 1 | 1,40 € | 1,40 € |
| SOL-333286 | Soldered LiPo-Akku 605080, 3,7 V, 3000 mAh, JST 2-Pin | 1 | 12,00 € | 12,00 € |
| ADA5691 | Adafruit ESP32-S3 Reverse TFT Feather | 1 | 24,90 € | 24,90 € |
| 23942440130 | Verbatim microSDHC Class 10, 32 GB | 1 | 9,90 € | 9,90 € |
| 125452 | NTAG215 Tags, 25 mm, selbstklebend, farbig sortiert | 2 | 1,99 € | 3,98 € |
| 10020 | Miniatur-Kippschalter 3-Pin EIN-EIN | 1 | 0,60 € | 0,60 € |
| 10014 | Subminiatur-Kippschalter 3-Pin EIN-EIN | 1 | 0,48 € | 0,48 € |
| EN2424-6T20 | Inkrementalgeber 24 Rastungen/Impulse, mit Taster, 6 × 20 mm | 1 | 2,40 € | 2,40 € |
| DT44L12-R | Arcade-Button 44 mm beleuchtet (LED 12 V), rot | 1 | 2,90 € | 2,90 € |
| DT44L12-B | Arcade-Button 44 mm beleuchtet (LED 12 V), blau | 1 | 2,90 € | 2,90 € |
| AB30L5-G | Arcade-Button 30 mm beleuchtet (LED 5 V), grün | 1 | 2,10 € | 2,10 € |
| AB30L5-R | Arcade-Button 30 mm beleuchtet (LED 5 V), rot | 1 | 2,10 € | 2,10 € |
| AB30L5-Y | Arcade-Button 30 mm beleuchtet (LED 5 V), gelb | 1 | 2,10 € | 2,10 € |
| AB30L5-W | Arcade-Button 30 mm beleuchtet (LED 5 V), weiß | 1 | 2,10 € | 2,10 € |
| AB24OL-G | Mini-Arcade-Button 24 mm, grün | 1 | 0,90 € | 0,90 € |
| AB24OL-B | Mini-Arcade-Button 24 mm, blau | 1 | 0,90 € | 0,90 € |
| AB24OL-R | Mini-Arcade-Button 24 mm, rot | 1 | 0,90 € | 0,90 € |
| AB24OL-Y | Mini-Arcade-Button 24 mm, gelb | 1 | 0,90 € | 0,90 € |
| E-TSS10 | Mini-Drucktaster HQ, Schließer, rot | 1 | 0,85 € | 0,85 € |
| E-TSS13 | Mini-Drucktaster HQ, Schließer, gelb | 1 | 0,85 € | 0,85 € |
| E-TSS14 | Mini-Drucktaster HQ, Schließer, grün | 1 | 0,85 € | 0,85 € |
| ADA4886 | Adafruit AW9523 GPIO-Expander & LED-Treiber | 1 | 4,90 € | 4,90 € |
|  | Versand |  |  | 4,95 € |

## Abweichungen von der BOM (hardware/BOM.md)

- **Boost-Modul:** statt MT3608 der TPS61023 MiniBoost (Adafruit 4654) —
  sauberer gelötet, fixe 5 V/1 A, Enable vorhanden.
- **Lautsprecher:** nur einer bestellt (ADA3351, Gehäuselautsprecher),
  nicht das 40/50-mm-Vergleichspaar.
- **Akku:** 3000 mAh statt 2000–2500 mAh.
- **WS2812:** NeoPixel Stick mit 8 statt Strip mit min. 20.
- **Button-Bestand:** 6 beleuchtete (2 × 44 mm/12 V-LED, 4 × 30 mm/5 V-LED),
  4 unbeleuchtete 24 mm, 3 Mini-Drucktaster — statt 8 + 6 beleuchteter.
- **GPIO-Erweiterung:** AW9523 Breakout statt MCP23017 (kann beides I2C,
  AW9523 kann zusätzlich LED-PWM treiben — passt zu den Button-LEDs).
- **Kippschalter:** zwei Stück, aber ein Miniatur- und ein Subminiatur-Typ
  statt zwei gleiche.
- NFC-Tags: 2 × 6 Stück = 12 statt 10.
