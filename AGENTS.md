# AGENTS.md — Boxbert

Projektordner für Daddelberts DIY-Toniebox: eine selbstgebaute Musikbox im
Toniebox-Stil für sein Kind. ESP32-S3, NFC-Tags starten Playlists von der
microSD, Bedienung über Arcade-Buttons und eine React-PWA im WLAN. Gehäuse:
Holz + 3D-Druck. Diese Datei gilt für alle Agenten, die in diesem Ordner
arbeiten. Server-übergreifende Regeln stehen in der `../AGENTS.md`.

## Rollen

- **Daddelbert bestellt.** Agenten recherchieren Preise und schreiben
  Bestelllisten bzw. Texte zum Übertragen in Warenkörbe — aber es wird nie
  selbst bestellt, nie etwas veröffentlicht oder versendet. Kein Checkout,
  keine Warenkorb-Aktionen, nur lesend.
- Agenten tun: Recherche, Doku, Firmware (C++), App (React PWA),
  3D-Druckdaten, Verkabelungspläne.

## Kindersicherheit — Vorrang vor Kosten und Ästhetik

- Nur Akkus und Lademodule mit Schutzschaltung (PCM).
- Keine scharfen Kanten, keine verschluckbaren Kleinteile außerhalb des
  verschraubten Innenraums.
- Alles von hinten verschraubt; Akku sitzt fest und ist gegen Kurzschluss
  gesichert.

## Fixe Hardware-Entscheidungen

Details und Begründungen: `docs/entscheidungen.md`. Kurz:

- **Board:** Adafruit ESP32-S3 Reverse TFT Feather (4 MB Flash / 2 MB PSRAM,
  LiPo-Lader onboard). BLE passt nicht in den Flash — WLAN ist der einzige
  Kommunikationsweg, nicht drauf bauen.
- **Audio:** MAX98357A (I2S) direkt an Akkuspannung (3,0–4,2 V, etwas leiser
  als mit 5 V). MT3608-Boost (5 V, mit Enable-Pin) ist mitbestellt und wird
  zuhause getestet — versorgt bei Bedarf Verstärker lauter und Button-LEDs;
  Enable trennt ihn im Deep Sleep.
- **Lautsprecher:** 4 Ω / 3 W, zwei Größen (40 mm und 50 mm) zum Vergleich.
- **NFC:** PN532-Modul, Modus per DIP-Schalter. SPI ist Primärweg
  (I2C-Clock-Stretching macht am ESP32 Probleme), Pegel (3,3 V vs. 5 V TTL)
  vor dem ersten Anschließen am Modul nachmessen. Tags: NTAG215-Sticker.
- **SD:** externes microSD-Modul über SPI (Feather hat keinen Slot).
- **Akku:** LiPo 3,7 V, 2000–2500 mAh, mit Schutzschaltung, JST-PH 2.0.
  **Polung vor dem ersten Anschließen gegen das Feather-Pinout prüfen** —
  JST ist nicht polarisationsgenormt.
- **Bedienung:** Arcade-Buttons 24/30 mm (LEDs laufen an Akkuspannung, meist
  gedimmt sichtbar), Kippschalter, Drehencoder EC11, WS2812. Nur 5–8 Buttons
  bekommen echte Funktionen, der Rest ist rein mechanisch
  (Busyboard-Gefühl). Bei >~15 GPIO-Bedarf: MCP23017 (I2C) oder Tastenmatrix.
- **Stromsparen:** Deep Sleep (~40–50 µA am Feather), Aufwachen per Button,
  Auto-Sleep nach Inaktivität.

## Pins — nie aus dem Gedächtnis

Pin-Vorschläge ausschließlich aus `hardware/pinout.md`. Neue Pins vorher
gegen die Board-Definition prüfen (`pins_arduino.h` der Variante
`adafruit_feather_esp32s3_reversetft` im arduino-esp32-Repo, Befehl steht in
pinout.md). Der erste Breadboard-Plan hatte sechs falsche Pins, weil sie
aus allgemeinem ESP32-Wissen geraten waren.

## Struktur

```
hardware/   BOM, Verkabelung, Pinbelegung
firmware/   ESP32-S3, C++ (Arduino-Framework oder ESP-IDF — noch offen)
app/        React PWA (Steuerung, Upload, Tag-Zuweisung)
3d-print/   STL/STEP (Halterungen, Buttons)
docs/       Entscheidungen, Preisvergleich, Bestelllisten, Testprotokolle
```

## Kernwerte-Dokument

Elektrische Kernwerte (Spannungen, Pegel, Ströme, I2C-Adressen) und
mechanische Maße (Bohrungen, Kragen, Bauraum) aller bestellten Bauteile
stehen gebündelt in `docs/kernwerte.md` — zuerst dort nachsehen, bevor
ein Datenblatt-PDF geöffnet wird.

## Referenzen

- **ESPuino** (ESP32 + RFID + SD + I2S + Web-UI) — direkteste
  Plattform-Referenz für unsere Hardware.
- **Phoniebox** (Raspberry Pi) — Reifegrad-Referenz für UI/UX-Ideen.

## Offene Fragen (nächste Schritte)

- Layout der Bedienoberfläche: Anzahl/Anordnung Buttons, Schalter, Encoder
- Pin-Belegung Feather (I2S, SPI für SD/NFC, I2C, Buttons, LEDs)
- Lautsprecher-Entscheidung nach Größenvergleich
- Arduino-Framework vs. ESP-IDF für die Firmware

## Konventionen

- Preise immer mit Datum und Quelle notieren — Live-Preise veralten schnell.
- Bestelllisten gebündelt nach Händler, Zollpauschale einrechnen (Stand und
  Quelle in `docs/bestellliste.md` pflegen).
- Testprotokolle (z. B. Boost-Modul-Test) landen in `docs/`.
