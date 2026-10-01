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
- [ ] Preisrecherche → `docs/preisvergleich.md`
- [ ] Bestellliste → `docs/bestellliste.md` (Daddelbert bestellt selbst)
- [ ] Button-Layout und Pin-Belegung → `hardware/`
- [ ] Firmware-Grundgerüst → `firmware/`
- [ ] App-Grundgerüst → `app/`
- [ ] 3D-Druckdaten → `3d-print/`
