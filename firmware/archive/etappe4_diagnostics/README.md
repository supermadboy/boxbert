# Etappe-4-Diagnosen — historisch, nicht flashen

Archiviert am 04.10.2026 beim Abschluss des Breadboard-Meilensteins.
Die alten .ino-Dateien wurden unveraendert nach .ino.txt verschoben,
damit sie nicht als aktive Arduino-Sketches angeboten werden. Alte
Quellpfade im chronologischen Protokoll bezeichnen ihren damaligen Ort.

| Ordner | Einordnung |
|---|---|
| etappe4_i2cscan | frueher isolierter Bus-Scan, kein Musik-/UID-Integrationstest |
| etappe4_inventory | SD-Dateiliste/PN532-Firmware bestaetigt; UID-Pfad zweimal gescheitert, keine NFC-Referenz |
| etappe4_nfc | alter SPI-Test, inklusive damaliger MISO-Experimente |
| etappe4_nfc_direct | alter SPI-Direkttest mit lokalem Seeed-Library-Workaround |
| etappe4_nfc_hsu | alter UART-Test, ohne Pegelwandler NICHT wiederholen |
| etappe4_nfc_hsu_diag | UART-/Loopback-Diagnose, keine funktionierende PN532-HSU-Referenz |
| etappe4_nfc_seed | frueher SPI-Test mit Seeed-PN532-Library |

**Sicherheit:** HSU-TXD/SDA hatte isoliert 4,1 V bei VCC=3,27 V.
Feather-GPIOs sind nicht 5-V-tolerant. Historische UART-Verkabelung nicht
uebernehmen. Aktuell PN532 per I2C, DIP 1 ON / 2 OFF, SDA IO3/SCL IO4.
Buspegel fuer jedes andere Modul separat pruefen.

Aktive und bestaetigte Referenzen: `firmware/tests/README.md`.
Testchronologie/Unsicherheiten: `docs/testprotokoll-etappe4.md`.
Aktuell verbindliche Verkabelung: `hardware/pinout.md`.
Keine globalen Bibliotheken beim Aufraeumen geaendert.
