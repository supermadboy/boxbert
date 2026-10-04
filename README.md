# Boxbert

Selbstgebaute Musikbox im Toniebox-Stil für Daddelberts Kind. Kein
Tonie-Ökosystem, eigene Firmware: NFC-Tag auf die Box → Playlist von der
microSD. Steuerung per React-PWA im WLAN.

- Hardware-Kern: ESP32-S3 (Adafruit Reverse TFT Feather), MAX98357A,
  PN532, microSD, LiPo mit Schutzschaltung, Arcade-Buttons, WS2812.
- Gehäuse: Holz + 3D-Druck.

**Arbeitsanleitung für Agenten:** [AGENTS.md](AGENTS.md) — insbesondere:
Agenten bestellen nichts, Daddelbert bestellt selbst. Kindersicherheit
hat Vorrang.

## Status

- [x] Projektstruktur, AGENTS.md, BOM, Entscheidungen
- [x] Preisrecherche → `docs/preisvergleich.md`
- [x] Bestellliste, Bestellung und Lieferung (Daddelbert bestellt selbst)
- [x] Entwicklungsumgebung und Breadboard-Etappen 0–4
- [x] Zwei NFC-Tags wechseln SD-Musik; optimierter Hoertest bestaetigt
  (04.10.2026). PN532 I2C, SD 4 MHz, Volume 6/21, USB-only.
  [Etappe-4-Protokoll](docs/testprotokoll-etappe4.md),
  [aktive Referenzen](firmware/tests/README.md).
- [ ] Als Naechstes: Etappe 5, WLAN-Webserver + Upload (Umfang/Framework
  zuerst abstimmen). Spaetere Haertung und Detailstatus: [To-Do.md](To-Do.md).
- [ ] Button-Layout und Pin-Belegung → `hardware/`
- [ ] Firmware-Grundgerüst → `firmware/`
- [ ] App-Grundgerüst → `app/`
- [ ] 3D-Druckdaten → `3d-print/`
