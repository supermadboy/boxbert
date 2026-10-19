# Boxbert-Gesamtfirmware bauen

Der neue Integrationsstand liegt unter `firmware/boxbert/`; die bisherigen
Etappen bleiben unverändert. Der API-Vertrag ist
[`firmware-api-v1.md`](firmware-api-v1.md), die **noch nicht ausgeführte**
Geräteabnahme [`gesamtgeraet-abnahme.md`](gesamtgeraet-abnahme.md).

## Isolierte Toolchain (Linux x86_64, ohne sudo)

```sh
python3 tools/firmware/setup.py
python3 tools/firmware/build.py
```

Der Installer verwendet `~/.local/share/boxbert-toolchain`, nicht das bisherige
`~/.arduino15`. Arduino CLI 1.5.1 und AudioI2S-Archiv 4.0.0 sind mit beim Abruf
ermittelten SHA256 gepinnt; Core 3.3.12 und Bibliotheken mit exakten Versionen.
Die Prüfsummen sind Integritätskontrollen unserer Abrufe, keine separate
Herstellersignatur. Der Build verweigert abweichende Kernbibliotheken.
Die ESP-Toolchain benötigt mehrere GB Platz; sie wird nicht ins Repo kopiert.

Board: `esp32:esp32:adafruit_feather_esp32s3_reversetft`, Board-Defaults
(einschließlich QSPI-PSRAM und USB CDC). Keine OPI-PSRAM-Option.
Die Defaultpartition `tinyuf2_noota` hat nur eine App; OTA ist **nicht** Teil
dieses Auftrags. Ein vergrößerter SD-Speicher erweitert nicht den Firmwareflash.

`build.py` erzeugt pro Aufruf ein eigenes privates Verzeichnis unter
`~/.cache/boxbert-build-*`: Quellenstaging, Compilelog, Build, Firmwareartefakte
und SHA256-Manifest. Pins, Renderer und optionale V2-Frames werden aus ihren
versionierten Quellen ins Staging übernommen. Das Skript flasht **nie**.
Ein fehlgeschlagener Compile erzeugt kein Erfolgsmanifest. Erfolgreicher
Crosscompile ist kein Hardware-/Funk-/Audio-/Stromnachweis.

## Private WLAN-Zugangsdaten

Ein privates `Secrets.h` kann über `--secrets /pfad/ausserhalb/des/repos/Secrets.h`
ins Buildstaging übernommen werden. Die verwendeten Makros stehen in
`firmware/Secrets.example.h`. Keine tatsächlichen Passwörter in die
Arbeitskopie legen. Das private Header und daraus erzeugte Firmwaredateien
niemals committen oder in öffentliche Downloadverzeichnisse kopieren.
Ohne vorgegebene Zugangsdaten ist eigenes WLAN statt Heim-WLAN vorgesehen.
Das Gerätepasswort entsteht einmal zufällig und bleibt im NVS; es steht nicht
im generischen Firmwareimage. Am lokalen USB-Serial-Monitor (115200) die Zeile
`credentials` senden, um es gezielt anzuzeigen. Diese Ausgabe **nicht** in
Testlogs übernehmen oder committen. Bootmeldungen drucken das Passwort nicht
ungefragt. HTTP-Benutzer ist `boxbert`, das Gerätepasswort dient auch dem
Boxbert-AP und der BLE-HMAC-Anmeldung. Die Ausgabe ist lokale Zugangserholung,
keine Firmware-Sicherheitsfreigabe für unverschlüsselte fremde Netzwerke.

## Hostprüfungen

```sh
# Vorhandener C++17-Compiler; z.B. clang++ aus dem gepinnten Nixpkgs:
nix shell github:NixOS/nixpkgs/0954f7ee2f6bb3dc7d4e3d0d8bcb8fd4bde4cfc5#clang \
  --command python3 tools/firmware/test-host.py
nix shell github:NixOS/nixpkgs/0954f7ee2f6bb3dc7d4e3d0d8bcb8fd4bde4cfc5#clang \
  --command sh -c 'cd app && npm test && node tests/firmware-volume-host.mjs'
```

Der Hostlauf aktiviert AddressSanitizer und UndefinedBehaviorSanitizer.
Er prüft echte Produktionsheader, nicht nachgebaute Firmwareausgaben.
Zusätzlich App-/Transport-/Rendererprüfungen gemäß `app/README.md` ausführen.
Browserfixtures prüfen den Vertrag, sie ersetzen keine echte BLE-Verbindung.

Für den tatsächlich ausgeführten Chromium-Stand (154.0.8037.97):

```sh
eval "$(python3 tools/firmware/browser-env.py)"
node tools/firmware/verify-hosted.mjs
```

Dieser Test besucht das echte HTTPS-Hosting, prüft die neue BLE-Oberfläche
**ohne** Funkverbindungsversuch und startet ein neues App-Dokument offline unter
`/boxbert/`. Er überschreibt keine historischen Screenshots im Repo; neue
Aufnahmen landen unter `~/.cache/boxbert-verification/`.

## Sleep-Bindung am ESP32-S3

Die Wake-Taster IO5/IO6 bekommen vor EXT1 zusätzlich **RTC-Pull-ups**; nach
Wake werden ihre RTC-Holds/Mux-Zuordnungen wieder freigegeben. Auf dem S3
sind digitale und RTC-Pulls unabhängig (`SOC_GPIO_SUPPORT_RTC_INDEPENDENT=1`).
`INPUT_PULLUP` alleine ist deshalb kein Beleg für korrekt beschaltete
RTC-Wake-Eingänge. Gegen den tatsächlich verwendeten IDF-5.5.5-Quellstand
geprüft: [gpio_pullup_en](https://github.com/espressif/esp-idf/blob/v5.5.5/components/esp_driver_gpio/src/gpio.c),
[ext1_wakeup_prepare](https://github.com/espressif/esp-idf/blob/v5.5.5/components/esp_hw_support/sleep_modes.c).
Das ist Quellen-/Buildprüfung, **kein ausgeführter Wake- oder Stromtest**.
PN532 und der an BAT/3V3 fest angeschlossene Verstärker werden nicht durch
Boost-EN automatisch stromlos; weder µA-Gesamtsleep noch Amp-Shutdown behaupten.

## SD und Flash

Die PWA hat einen eigenen relativen SD-Build `app/dist-sd/`. Den Inhalt vor
Gerätetests nach `/www/` auf die eingehängte SD kopieren; bestehende Musik und
Konfiguration erhalten. Auf Daddelberts Arch-Rechner ist `~/sd-card` der
vereinbarte Mountpunkt; **zuerst mounten**, danach kopieren und vor dem Ziehen
`sync`/unmounten. Nicht in ein ungemountetes Verzeichnis kopieren.

Flashen ist ein separater, ausdrücklich begleiteter Schritt auf Daddelberts
Rechner. Port/Board und aktuelles Manifest prüfen; exakt das erfolgreiche
Artefakt über `arduino-cli upload --input-dir .../artifacts --port ...`
verwenden. Keine Images aus einer anderen Buildrunde nach Compilefehlern.
USB-Zugriff vom Hetzner-Server besteht nicht automatisch.
