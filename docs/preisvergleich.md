# Preisvergleich — Boxbert

Erhebung: 25.09.2026, live abgerufen (nicht geschätzt, außer wo markiert).
Markiert als *Geschätzt* = Preis aus Erfahrungswerten, vor Bestellung auf der
Produktseite gegenprüfen. Preise können sich täglich ändern.

## Händler-Übersicht

| Händler | Abgreifbar? | Versand | Anmerkung |
|---|---|---|---|
| **Berrybase** (DE) | ✓ vollständig | ab ~4,95 € | Alle Kern-Teile verfügbar, faire Preise |
| **AZ-Delivery** (DE) | ✓ teilweise | ~4,99 € (frei ab ~60 €?) | MAX98357A & NTAG215 **ausverkauft**, MT3608 3,99 €, KY-040 4,99 €, Speaker-Pärchen 7,99 € (2 Stk, 4 Ω, 3 W, mit JST!) |
| **Reichelt** (DE) | ✓ teilweise | 5,95 € | PN532 nur als Grove (14,95 €) / Shield (14,95 €) — teurer. NTAG-Tags: 14,95 € (Berrybase-Abverkauf) |
| **Exp-Tech** | ✗ | — | Shop tief umgebaut (B2B-Produktanfrage), Adafruit-Sortiment nicht mehr greifbar. **Nicht weiter verfolgt.** |
| **AliExpress** (CN) | ✓ vollständig | meist kostenlos, 1–4 Wochen | Günstigste Quelle für Module/Buttons; Zoll beachten |
| Amazon / eBay | gestrichen (Daddelbert) | — | erfahrungsgemäß teurer |

## Stückliste mit Preisen

| # | Teil | Berrybase | AZ-Delivery | Reichelt | AliExpress |
|---|------|-----------|-------------|----------|------------|
| 1 | ESP32-S3 Reverse TFT Feather | **24,90 €** | — | — | keine Orig.-Adafruit |
| 2 | MAX98357A | **5,90 €** | 7,99 € (ausverk.) | — | (in Boards verbaut) |
| 3 | PN532-Modul (3,3 V, DIP-Buswahl) | **7,20 €** | — | Grove 14,95 € / Shield 14,95 € | 4,42–5,08 € (V3-Modul) |
| 4 | NTAG215-Sticker 25/30 mm | **4,40 €** (10× 25 mm weiß) | ausverkauft | 14,95 € (10×) | ~2–4 € (10–20×) |
| 5 | microSD-SPI-Modul | **1,40 €** | 3,99–5,49 € (D1-Mini-Shield) | — | 1,77 € |
| 6 | microSD-Karte 32 GB | 21,90 € (SanDisk Ext.) | — | — | ~4–6 € *Geschätzt* |
| 7 | LiPo 2500 mAh JST, **mit PCM** | **7,70 €** ✓ Schutzelektronik | — | — | nicht empfohlen (Zellqualität/Transport) |
| 8 | Arcade-Button 30 mm, LED 5 V | 2,10 € | — | — | 2,09–3,31 € (Farb-/Mengenvar.) |
| 9 | Arcade-Button 24 mm (ohne LED) | **0,90 €** | — | — | (im 30mm-Set enthalten) |
| 10 | EC11-Encoder | **1,60 €** | KY-040 4,99 € | — | 2,01 € |
| 11 | Kippschalter EIN-AUS-EIN | **0,61 €** | — | — | (im Button-Set) |
| 12 | WS2812B-Ring 16 | — | 5,99 € (12-bit 50 mm) | — | 3,32–4,98 € |
| 13 | WS2812-Stick 8 | **2,60 €** | — | — | — |
| 14 | Lautsprecher 40 mm 4 Ω (2 Stk) | **4,90 €** (Adafruit 5 W, 1 Stk) | 7,99 € (2 Stk, 3 W, JST-Stecker!) | — | 4,44–5,85 € (2–5 Stk) |
| 15 | Lautsprecher 3 W 4 Ω (Größe ~50 mm) | **4,35 €** (Gehäuselautsprecher) | s. o. (2 Stk-Set) | — | s. o. |
| 16 | MT3608-Boost (Enable-Pin!) | — | 3,99 € | — | 1,80–2,52 € |
| 17 | TP4056-Lademodul (USB-C, Schutz) | — | 5,49 € | — | ~1 € *Geschätzt* |

## vorläufige Gesamt-Kostenkalkulation (Vorschlagsmenge)

Berrybase-Vorschlag (1× jedes Teil, 6× Arcade 30 mm LED, 6× Arcade 24 mm,
2× WS2812-Stick, 10× NTAG215, 2× Lautsprecher-Größen, ohne SD-Karte):

**~94 € ohne Versand** (86,16 € Kern + 2. Lautsprecher).

AliExpress-Mischrechnung (mit Zollpauschale 3 €/Position Nicht-EU) für
Vergleich: ~45–55 € + Ladezeit/Wait + Zollrisiko. **Empfehlung: Berrybase
als Hauptbestellung** (alles sofort, geprüfte Zellqualität, PCM-Akku),
AliExpress nur für die Button-Mengen falls Berrybase-Farbauswahl nicht reicht.

## Zoll-Hinweis (Stand: Angabe Daddelberts, 25.09.2026)

- Seit **1.7.2026**: 3 € Zollpauschale pro Warenposition außerhalb EU.
- Ab November zusätzlich ~2 € Bearbeitungsgebühr pro Paket (Hinweis
  Daddelberts; vor Bestellung auf zoll.de gegenprüfen).
- Empfehlung: Nicht-EU-Bestellungen auf wenige Positionen bündeln oder
  gleich die EU-Alternative nehmen, wenn der Aufpreis < Zollpauschale.

## Empfehlung (Daddelbert-Entscheid)

1. **Berrybase:** Board, MAX98357A, PN532, NTAG215, microSD-Modul, LiPo,
   Encoder, Kippschalter, WS2812-Sticks, beide Lautsprecher (~94 €).
2. **AZ-Delivery:** MT3608 3,99 € + ggf. das 2er-Lautsprecher-Set 7,99 €
   (hat JST-PH-Stecker direkt an Bord — sparend beim Verdrathen). Mindest-
   bestellwert prüfen.
3. **AliExpress (optional):** nur wenn Button-Farben/Mengen bei Berrybase
   nicht reichen (6× 30 mm mit LED, 2,09–3,31 €/Stk) — dann Positionen
   klein halten (Zollpauschale 3 €/Position).
