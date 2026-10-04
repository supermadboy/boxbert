# BOM — vorhandene Boxbert-Bauteile

Stand: **04.10.2026**. Lieferung laut Nutzer komplett angekommen.
Diese Liste beschreibt den vorhandenen Bestand, keine Einkaufsempfehlung.
Bestellpositionen/Mengen: `docs/bestellliste.md`; reale Anschlussdetails
und Abweichungen: Testprotokolle, `hardware/pinout.md`, `docs/kernwerte.md`.
Bestell-Artikelnummer ist nicht automatisch die Identifikation eines Klons.

| Menge | Bauteil / Bestellreferenz | Aktueller Stand / Hinweis |
|---|---|---|
| 1 | Adafruit ESP32-S3 **Reverse TFT** Feather, ADA5691 | 4 MB Flash / 2 MB PSRAM; LiPo-Lader onboard; Projektkommunikation per WLAN |
| 1 | MAX98357A, Bestellreferenz ADA3006 | Testprotokoll beschreibt abweichendes Klon-Pinlayout; 2,7–5,5 V, I2S; aktuell VIN USB-5V, SD 3V3, GAIN offen |
| 1 | ADA3351 Gehaeuselautsprecher | 4 Ohm / 3 W, 30 × 70 × 17 mm; kein 40/50-mm-Vergleichspaar |
| 1 | PN532-MOD | aktuell I2C, DIP 1 ON / 2 OFF; laut Bestellung inkl. Karte/Dongle; kein NFC-SPI im bestaetigten Aufbau |
| 12 | NFC-Sticker, Bestellbezeichnung NTAG215, 125452 | 2 Packungen zu 6; Lieferbezeichnung, keine neue Chiptyp-Verifikation. Die zwei getesteten UIDs/Chiptypgrenzen stehen in `hardware/nfc-tags.md` |
| 1 | microSD-Modul MSD-AADP | Onboard-3,3-V-Regler, VCC USB-5V; SPI CS IO10 |
| 1 | Verbatim microSDHC, 23942440130 | 32 GB, FAT32; im Player 4 MHz SPI bestaetigt |
| 1 | Soldered LiPo, SOL-333286 / 605080 | 3,7 V / **3000 mAh**, Schutzschaltung, JST-PH 2.0; bislang nicht angeschlossen, Polung vorher pruefen |
| 1 | TPS61023 MiniBoost, ADA4654 | **5,2 V** nominal / 1 A laut Kernwerten, Enable/True Disconnect; noch kein dokumentierter Boost-Hardwaretest, nicht MT3608 |
| 1 | AW9523, ADA4886 | 16 Kanaele, I2C 0x58, keine internen Pull-ups; am Feather VIN 3V3, LED-Versorgung noch nicht freigegeben |
| 1 | NeoPixel Stick, NEOPS8 | **8** WS2812, kein 20-LED-Strip; externe Stick-Versorgung/Pegelwandlung noch zu testen |
| 2 | DT44L12-R / DT44L12-B | 44-mm-Buttons, je 1 rot/blau, **12-V-LEDs**; Schalterfunktion unabhaengig von LED-Versorgung |
| 4 | AB30L5-G/R/Y/W | 30-mm-Buttons, je 1 gruen/rot/gelb/weiss; 5-V-LED-Einheiten mit integriertem Vorwiderstand |
| 4 | AB24OL-G/B/R/Y | 24-mm-Buttons, je 1 gruen/blau/rot/gelb, **unbeleuchtet**; IO5-Tastertest bestaetigt |
| 3 | E-TSS10 / E-TSS13 / E-TSS14 | Mini-Drucktaster, je 1 rot/gelb/gruen |
| 1 | EN2424-6T20 | Drehencoder, 24 Rastungen/Impulse, Drucktaster, Achse 6 × 20 mm |
| 1 | 10020 | Miniatur-Kippschalter, 3-Pin EIN-EIN |
| 1 | 10014 | Subminiatur-Kippschalter, 3-Pin EIN-EIN |

## Nicht als bestellt/vorhanden voraussetzen

- Kein MT3608, MCP23017, Lautsprecher-Vergleichspaar oder 20-LED-Strip.
- Kein bestaetigter 12-V-Step-Up oder zusaetzlicher Pegelwandler im Bestand.
- Jumper, Widerstaende, Elkos, Befestigungsmaterial etc. vor dem jeweiligen
  Aufbau vor Ort pruefen; Verbrauchsmaterial ist hier nicht inventarisiert.
- Nachbestellungen nur recherchieren/vorschlagen; **Daddelbert bestellt**.

## Abnahme- und Sicherheitsgrenzen

Vorhanden ist nicht gleich angeschlossen oder getestet. Etappen 0–4 sind
Breadboard-Meilensteine; Booster, AW9523-LEDs, externer NeoPixel-Stick und
Akku-/Sleep-Versorgung sind noch keine fertig gepruefte Gesamtschaltung.
Verkabelung nur nach `hardware/pinout.md`; LED-/Rail-Planung unter
`docs/power-plan.md`, akustische Sicherheitsgrenzen unter
`docs/audio-safety.md`. Aktueller Arbeitsstand in `To-Do.md`.

Der alte Planungsentwurf mit anderen Mengen/Teilen ist archiviert unter
`docs/archive/BOM-2026-09-25.md` und keine aktuelle Bestandsquelle.
