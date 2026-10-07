# akku_fuel_gauge (Test-Sketch, 07.10.2026)

Separater Test-Sketch: liest den onboard MAX17048 Fuel Gauge (Zellspannung,
Ladezustand %, Laderate %/h) und gibt alles alle 2 s am Serial-Monitor aus.

- **Basis:** Bibliotheksbeispiel `MAX17048_basic` (Adafruit MAX1704X 1.0.3),
  API gegen den Header geprüft.
- **I2C:** Onboard SDA=IO3 / SCL=IO4, derselbe Bus wie der PN532. Dieser
  Sketch nutzt nur den Gauge; kein NFC/SD/Audio.
- **Zweck:** ersten Akku-Tag dokumentieren (Laden, Entladen, Spannungs-
  verlauf), Werte in `docs/testprotokoll-akku.md`.
- Der bewährte Etappe-4-Player (`firmware/tests/etappe4_tag_player/`)
  bleibt unangetastete Referenz.
