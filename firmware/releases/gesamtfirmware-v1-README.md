# Gesamtfirmware V1 — Flashvorbereitung

Dieser Pfad enthält ausschließlich den **generischen Build ohne Secrets.h**.
Gerätepasswort entsteht auf der Box und wird nur auf USB-Befehl `credentials`
ausgegeben. Firmware nicht aus fremden Builds ohne Manifest übernehmen.

`manifest.json` enthält Board, Core, Bibliotheksversionen und SHA256 aller
mitgelieferten Binaries. `sd-www/` ist der dazugehörige relative Webbuild;
seinen Inhalt auf der SD nach `/www/` übernehmen, nicht Musik oder Konfiguration
überschreiben. Vorher SD und bekannte Tagzuordnungen sichern.

**Kein Gerät wurde mit diesem Release geflasht oder abgenommen.**
Vor dem Flash Board/Port prüfen, die bisherige Firmware sichern und die
Checkliste `docs/gesamtgeraet-abnahme.md` lesen. Generischer Stand startet BLE;
D0 schaltet BLE → Funk aus → WLAN → BLE. Ohne Heimnetz-Secrets nutzt WLAN
nach der Umschaltung den geschützten Boxbert-AP.

Der installierte Arduino CLI 1.5.1 dokumentiert für den später freigegebenen
Upload `--input-dir`, `--fqbn`, `--port` und `--verify`. Beispiel **nicht ausgeführt**
(Port ersetzen):

```sh
~/.local/share/boxbert-toolchain/bin/arduino-cli \
  --config-file ~/.local/share/boxbert-toolchain/arduino-cli.yaml upload \
  --fqbn esp32:esp32:adafruit_feather_esp32s3_reversetft \
  --port /dev/ttyACM0 --verify --input-dir firmware/releases/gesamtfirmware-v1
```

Die Dateien `boxbert.ino.bin`, `.bootloader.bin` und `.partitions.bin` gehören
zusammen. `.merged.bin` ist ein zusammengeführtes Abbild; nicht zusätzlich
als separate Anwendung an eine geratene Adresse schreiben.

Softwareprüfungen: `docs/gesamtfirmware-verifikation.md`.
Neu bauen/exportieren: `tools/firmware/build.py` und
`tools/firmware/export-release.py BUILD NEW_DESTINATION`.
