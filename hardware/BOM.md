# BOM — Boxbert (Stückliste)

Stand: 25.09.2026 · Preise: siehe `docs/preisvergleich.md` ·
Bestelllisten: `docs/bestellliste.md`

Mengen mit *(Vorschlag)* sind Annahmen und vor der Bestellung mit
Daddelbert abzustimmen.

| # | Stück | Bauteil | Spezifikation | Zweck / Hinweis |
|---|-------|---------|---------------|-----------------|
| 1 | 1 | ESP32-S3 Reverse TFT Feather | Adafruit 5480, 4 MB Flash / 2 MB PSRAM, LiPo-Lader onboard | Hauptboard. Kein BLE möglich (Flash), nur WLAN. |
| 2 | 1 | MAX98357A | I2S Class-D Breakout, 3,2–5,5 V | Verstärker, läuft an Akkuspannung (3,0–4,2 V, etwas leiser). |
| 3 | 1 | Lautsprecher 40 mm | 4 Ω, 3 W, Fullrange | Vergleichskandidat klein. |
| 4 | 1 | Lautsprecher 50 mm | 4 Ω, 3 W, Fullrange | Vergleichskandidat groß. |
| 5 | 1 | PN532 NFC-Modul | I2C/SPI/UART per DIP-Schalter | Tag-Reader. SPI als Primärweg. Pegel (3,3 V vs. 5 V TTL) vor Anschluss prüfen! |
| 6 | 10 | NTAG215 NFC-Sticker | rund, 25–30 mm | Tags für Playlist-Mapping. |
| 7 | 1 | microSD-Modul | SPI | Audio-Speicher. |
| 8 | 1 | microSD-Karte | 32 GB, Klasse 10 | Nur falls nicht im Bestand. |
| 9 | 1 | LiPo-Akku | 3,7 V, 2000–2500 mAh, Schutzschaltung (PCM), JST-PH 2.0 | Kindersicherheit: nur mit PCM. Polung gegen Feather-Pinout prüfen! |
| 10 | 8 *(Vorschlag)* | Arcade-Button 30 mm | mit LED (5 V), Panel-Montage, Farben gemischt | Funktionale Buttons + Busyboard. |
| 11 | 6 *(Vorschlag)* | Arcade-Button 24 mm | mit LED | Mechanische Buttons / Reserve. |
| 12 | 2 *(Vorschlag)* | Kippschalter | Panel-Montage, 3,3–5 V-Logik ok | Hauptschalter / Modusschalter. |
| 13 | 1 | Drehencoder | EC11 mit Drucktaster | Lautstärke / Auswahl. |
| 14 | 1 | WS2812B-LEDs | Strip oder Ring, min. 20 LEDs, 5 V | Beleuchtung / Feedback. |
| 15 | 1 | MT3608 Boost-Modul | Step-Up auf 5 V, mit Enable-Pin | Test zuhause: lautere Audio + hellere Button-LEDs; Enable für Deep-Sleep. |
| 16 | 1 *(optional)* | MCP23017 Breakout | I2C Port-Expander | Nur falls >15 GPIO-Bedarf — kann weggelassen werden. |

## Sonstiges (nur bestellen, falls nicht im Bestand)

- Dupont-/Jumper-Kabel (male-female, female-female)
- M3-Schrauben/-Muttern + Einschlagmuttern für die 3D-Druck-Teile
- JST-PH 2-Pol-Kabelset (falls der Akku-Stecker nicht passt — danach
  Polung erst recht prüfen!)
- Lötzinn, Schrumpfschlauch (falls leer)
