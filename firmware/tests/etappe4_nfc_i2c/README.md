# Unveraenderte PN532-I2C-Einzelreferenz

Quelle und Sketch bei Etappe-4-Aufraeumen am 04.10.2026 unveraendert
belassen. Beide Tags jeweils neunmal in 12 s nach USB-Power-Cycle neu
reproduziert. Dies ist ein **UID-Einzeltest**, nicht der Player-/Wechselpfad.
Fuer Live-Wechsel `etappe4_nfc_switch`, fuer Musik `etappe4_tag_player`.

PN532 SDA IO3, SCL IO4, VCC 3V3, GND; DIP 1 ON / 2 OFF, SPI/UART/IRQ/
Reset getrennt. USB-only, Akku ab. Ruhepegel am konkreten Modul pruefen;
HSU-TXD/SDA hatte isoliert 4,1 V, niemals direkt an Feather-RX anschliessen.

Adafruit PN532 1.3.4, BusIO 1.17.4, esp32-Core 3.3.12, Board-Defaults.
Text „NTAG215 auflegen“ ist kein Chiptypnachweis; beide ausgelesenen
UIDs haben 4 Bytes. Verbindliche UIDs in `hardware/nfc-tags.md`.
Ursache frueherer Such-/Initfehler nicht abschliessend geklaert;
Feather-Flash/Reset schaltet PN532-Versorgung nicht zwangslaeufig aus.

Protokoll/Abnahmeumfang: `docs/testprotokoll-etappe4.md`.
