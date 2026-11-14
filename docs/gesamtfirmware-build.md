# Boxbert-Gesamtfirmware bauen

## Erstinbetriebnahmeprofil 11.11.2026

**Passwortloser Versuch verworfen, nie geflasht:** Cache`boxbert-build-a0ukgnbl`
NICHT verwenden. Nutzer hat vorhandenes Passwort genutzt und meldet BLE-Abbruch;
Auth-Quelländerung vollständig zurückgesetzt, geschützterv21-Diagnosestand aktuell.
Fehlerphase/Ursache noch offen, Details im aktuellen13.11.-Protokoll.

**Aktuell Bereich0..21 geflasht, Boot bleibt1 im Code:** Nutzerwunsch,
Build`boxbert-build-prnsjyfe`,Kennung`boxbert-v1-commissioning-20261113-v21-blefix1`.
Nach bestätigtem NFC-Park3 Artefakte/Quellen geprüft und erfolgreich hochgeladen.
USB-BLE-Traces ohne Nutzdaten; Halbintervallprüfung korrigiert falschen Timeout
bei neuerem Aktivitätsstempel. Keine anderen Auth-/Timeoutgrenzen-/Bibliotheksänderungen.
20native Tests inkl.RED→GREEN-Regression, danach echtehello/auth1/read-Antwort
übertragen; keine komplette PWA-Abnahme. Details im BLE-Protokoll13.11.
Danach NFC1/Volume1/Decoderläuft. Bereich bis21 schon im vorherigenv21beobachtet. Kein automatisches Maximalabspielen/keine akustische Sicherheitsfreigabe.

**Historischer Zwischenstand13.11.: Maximum12/21 geflasht, inzwischen durch21ersetzt**, Boot bleibt1.
Build `boxbert-build-n1_lldq4`, nach bestätigtem NFC-Park3 Quellen/SHA256 geprüft
und hochgeladen. Danach NFC1,Volume1/Decoder läuft,Konfigrevision81. Höhere
Stufen schrittweise testen, keine akustische Sicherheits-/Normabnahme.

**Der aktuelle Quellstand baut ausdrücklich ein temporäres Inbetriebnahmeprofil**
(`firmware/Config.h`, Namespace `commissioning`), keine volle Produktfreigabe:
**Seit13.11. NFC aktiviert** mit kurzer I2C-Zustandsmaschine ohne Tagwarten
unter Wire-Mutex. Physischer Tag1 startet laut Log Arcade bis EOF, Nutzer-
Ton/TFT dieses Starts vom Nutzer bestätigt. Weitere Bedienungs-/Dauerabnahme
offen. Stick/aktive Boost-EN-Steuerung/Auto-Sleep bleiben aus.
Stick fehlt, Power-/Sleep-Verdrahtung noch nicht freigegeben. Aktuelle Nachweise:
`testprotokoll-nfc-integration-2026-11-13.md`.
Onboard-Pixel, TFT, SD/Audio und BLE/WLAN bleiben enthalten. Bootvolume immer1,
Encoder/RPC jetzt0..21; RPC lehnt Werte außerhalb dieses Bereichs ausdrücklich ab.
Gespeicherte Lautstärke wird beim Boot nur im RAM durch1 ersetzt, nicht
ungefragt ein alter hoher Wert abgespielt. Folgende Konfigurationsmutationen
persistieren den aktuellen RAM-Stand; dauerhafte Bootvolumen-Persistenz erst
nach Aufhebung des Profils prüfen. Pins entsprechen dem real gemessenen
Endaufbau, gelber Mini-Taster deaktiviert. Encoder zählt Flanken per Interrupt
statt per TFT-/Funk-abhängigem Loop-Polling. Die vorher getesteten Diagnosen
bleiben unter `firmware/tests/endaufbau_*` als Rückfall.


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

### BLE-Library-Korrektur 11.11.2026

NimBLE-Arduino ist jetzt auf **2.3.8** gepinnt (statt2.3.6). Der isolierte
Gerätetest mit Core3.3.12 reproduzierte einen Panic-Reset bei init mit2.3.6;
identischer Sketch mit2.3.8 initialisiert/advertisiert erfolgreich.
Hersteller-Changelog2.3.8 nennt explizit den Init-Crash mit Core3.3.7+:
https://github.com/h2zero/NimBLE-Arduino/blob/2.3.8/CHANGELOG.md .
Quellen und Gerätenachweise: `testprotokoll-gesamtfirmware-2026-11-11.md`.
Installer setzt nach der Abhängigkeitsauflösung alle expliziten Versionen
nochmals mit `--no-deps`, damit z.B.GFX nicht unbemerkt angehoben bleibt.

## Lokale USB-Diagnose im aktuellen Inbetriebnahmeprofil

**Aktuell14.11. geflasht:** `~/.cache/boxbert-build-uluu6evy/manifest.json`,
Kennung`boxbert-v1-commissioning-20261114-demo1`,2561323ByteSketch/173468Globals,
Core3.3.12/QSPI/NimBLE2.3.8. NachPark3/24Source-/Hashchecks regulär hochgeladen,
SD/config1,Rev150,Volume1,NFC1/pause0. ZuletztbestätigtArcade/Pups erhalten,
`demo-songs` nichtausgeführt. USB9/10 öffnen/decodierenbeideDateien; danachStop.
Details`testprotokoll-vorfuehrung-2026-11-14.md`. ZusätzlicherexakterUSB-Setupbefehl
`demo-songs` würdeArcade/HappyTune+Volume1setzen; **nichtungefragtanwenden**.

VorherigerFlash/Rollback: `~/.cache/boxbert-build-prnsjyfe/manifest.json`,2560235Byte
Flash/173468Byte globale Variablen, Core3.3.12/QSPI/NimBLE2.3.8. Das allein
beweist keine Geräteabnahme. Aktuelle Befunde/Restpunkte:
[`uebergabe-endaufbau-2026-11-11.md`](uebergabe-endaufbau-2026-11-11.md).

`commissioning::UsbDiagnostics=true` erlaubt ausschließlich ganze LF-/CRLF-
Zeilen: `diag`, `test9`, `test10`, `test-stop`, `radio-off`, `radio-ble`,
`radio-wifi`, `nfc-pause`, `nfc-resume`. Kein allgemeiner Kommando-/Dateischreibzugang.

```sh
python3 tools/firmware/usb-diagnostics.py --command diag --seconds 8 \
  --log docs/serial/NEUER-diagnoseausschnitt.log
# Kann hörbaren Ton starten: niedriges Volume1, automatischer20-s-Stopp.
python3 tools/firmware/usb-diagnostics.py --command test9 --seconds 24 \
  --log docs/serial/NEUER-button9-test.log
```

Linux-stdlib,115200, stabiler Feather-by-id-Pfad als Default. Keine DTR/RTS-
Ioctls, keine1200-Baud-Berührung, keine wiederholten Kommandos nach CDC-
Neuanmeldung; nur ein Leser gleichzeitig. `--seconds` höchstens120, ohne
`--command` nur lesend. Log appendend mit Zeit-/Sende-/Verbindungsmarkern.
Exit0 heißt **nur Senden**, nicht erfolgreiches Gerätetestresultat. Logs auf
Antwort, Reset/Portwechsel und vollständigen Teststopp prüfen. Das Werkzeug
akzeptiert absichtlich **kein `credentials`**. Niemals Passwortausgaben in
Nachweislogs schreiben.

`test9`/`test10` verwenden echte Zuordnungshandler9/10, setzen RAM-Volume1
und stoppen spätestens nach20s. Physische Buttons haben **kein** solches
Testlimit; spätere Starts während des Diagnosefensters können ebenfalls vom
Teststopp beendet werden. `test-stop` beendet die Wiedergabe/Testfrist explizit.
USB-Testvolumen ist keine Persistenzprüfung. Funktraces haben `Serial.flush()`
und10-ms-Schrittpausen: hilfreich zur Diagnose, keine zeitneutrale Beobachtung.
Vor produktiver Freigabe Diagnosezugang/Timing prüfen bzw. deaktivieren.

**Vor neuem Flash mit NFC:** `nfc-pause` anfordern und **NFC=3/parked** im
Gerätelog abwarten. Eine ausstehende Suche braucht ggf. einen aufgelegten Tag,
bevor die Task ohne offenen Befehl parken darf; Kommando allein ist kein
Parknachweis. BeiNFC=2Fault nicht automatisch neu initialisieren. `nfc-resume`
hebt die Parkanforderung auf, behebt keinenFault. Die erste kurze Geräteprobe zeigte
nur pending→zurückgenommen; vor dem Volume12-Flash nach Nutzerkartenaktion
**NFC=3bestätigt**, danach erneuter Start mit aktivem Scanner.

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
node --test tools/firmware/pins.test.mjs
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
