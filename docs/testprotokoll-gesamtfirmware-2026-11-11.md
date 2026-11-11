# Gesamtfirmware — Erstinbetriebnahme 11.11.2026

## Ausgangslage / Auftrag

Nach erfolgreichen Eingangs-, SD-, Audio-/TFT- und Encoder-Lautstärketests
bittet Nutzer um Fortsetzung. Diagnosen und Hör-/Sichtbestätigungen:
`docs/testprotokoll-endaufbau-inputs.md`. Akku bleibt auf Nutzerwunsch dran,
USB zusätzlich. PN532 und externer NeoPixel nicht angeschlossen.
Gelber Mini-Taster ungeklärt; Versorgung/Boost-/Sleep-System nicht abgenommen.

## Änderungen vor Gesamtflash

- Gemessene Eingänge aus `hardware/pinout.md` übernommen; UI-IDs folgen
  vorhandener App-Geometrie:30/24 mm oben links/rechts, unten links/rechts,
 44 mm oben/unten. Keine vorhandenen Medienbelegungen umnummeriert.
- Gelber Mini-Taster deaktiviert (`255`, vor Bitshift geprüft).
- Encoder-Flankenzählung per Interrupt wie im bestätigten Diagnosetest,
  vier gültige Übergänge pro Schritt; Header `firmware/runtime/Quadrature.h`,
  Hauptloop übernimmt Schritte geschützt. TFT zeigt direkt Audio.getVolume()
  statt bis zum verzögerten SD-Speichern den alten Konfigurationswert.
- **Temporäres Inbetriebnahmeprofil** im aktuellen `firmware/Config.h`:
  Bootvolume1, Encoder/RPC begrenzt0..6/21;NFC/Stick/Boost-Ausgang/Auto-Sleep
  deaktiviert. Boot setzt RAM-Lautstärke1, späteres Speichern schreibt den
  aktuellen RAM-Stand; keine vollständige Bootvolume-Persistenz zugesagt.
  Onboard-Pixel,TFT,Audio,SD,Gauge,AW und BLE/WLAN bleiben integriert.
- Firmwarekennung `boxbert-v1-commissioning-20261111`, keine Produktfreigabe.

## Lesende Sicherung vor erster SD-Konfiguration

Separater Sketch `firmware/tests/endaufbau_backup/` mit bestätigten
SD-Signalen/4 MHz; keine Audio-/Boost-Ausgänge, TFT dunkel. Nur Befehl `b`
exportiert die zwei bekannten Konfigurationsslots, Root-Inventar und die
zwei alten NVS-Tagpfade. Keine Musik-/Konfigurationsschreibvorgänge.

Build `~/.cache/boxbert-backup-8yJS4jpi`,ArduinoCLI1.5.1/Core3.3.12,
Board-Defaults/QSPI,424652 Byte Sketch/54856 Byte RAM; Compile+Upload
verkettet erfolgreich, Hashprüfung erfolgreich, Reset durch Uploader.
USB-Export vollständig `BACKUP_BEGIN SD=1` bis`BACKUP_END`, privat gesichert:
`~/.cache/boxbert-preintegrated-ggzks21p/raw.txt` und `manifest.json`,
Verzeichnis0700. **Beide SD-Konfigurationsslots fehlen**, somit keine alten
Slotdateien zu sichern. Root enthält acht vorhandene MP3. Legacy NVS:
tag0-Schlüssel fehlt, tag1 zeigt auf `/fart.mp3`. Import muss den vorhandenen
Tag1-Pfad erhalten; für Tag0 erlaubt bestehender Migrationsvertrag den
vorhandenen Fallback `/arcade-music-loop.mp3`. Original-NVS bleibt lesend.
Dies ist keine Vollsicherung der MP3-Inhalte; Code verändert sie nicht.
Aktuell in dieser Phase geflasht: **lesender Backup-Sketch**.

## Softwareprüfungen (Zwischenstand)

- Vier Node-Pinregressionen bestanden.
- Native Pin-/Quadraturtests mit g++17,Address-/UndefinedBehavior-Sanitizer:
  bestanden. Erster Compile des aktualisierten Pintests meldete mehrdeutigen
  Namen `Stick` aus zwei Namespaces; Test vollständig qualifiziert und erneut
  erfolgreich ausgeführt. Kein Geräteflash aus diesem Fehler.
- App zunächst63/67 bestanden: fehlende npm-Abhängigkeiten/WASM-Artefakte,
  kein beobachteter Gerätefehler. Nach `npm ci` und `node tools/tft/build.mjs`
  **68/68 App-Tests bestanden**. Kein Deployment/Publizieren ausgeführt.
- Isolierte Toolchain wird mit `tools/firmware/setup.py` installiert;
  globale Diagnose-Toolchain/Referenzsketche bleiben unverändert.
- Anschließend16 native Hostprogramme und fünf Encoder/RPC-Ereignisfolgen
  unter gepinntem Clang21.1.8 mit ASan/UBSan bestanden. Vorheriger g++-
  Komplettlauf stoppte an vorhandener misleading-indentation-Warnung in
  TagLabel.h (Werror); unveränderte Quelle mit vorgesehenem Clang geprüft.
- Setup-Abhängigkeitsauflösung hatte GFX1.12.6 auf1.13.0 angehoben;
  explizite Pins abschließend mit `lib install --no-deps` erneut gesetzt.
  Installer entsprechend korrigiert, Buildversionen weiterhin streng geprüft.

## Erster Gesamtbuild und fehlgeschlagener Geräteboot

- Build `~/.cache/boxbert-build-f6cghniu` scheiterte beim Linken an Xtensa-
  IRAM-Literalrelokation der in der Klasse definierten Encoder-ISR. Kein
  Upload. Definition außerhalb der Klasse beseitigt das Linkproblem.
- Erfolgreicher Build `~/.cache/boxbert-build-9v0v47tb/manifest.json`,
 2541355 Byte Flash/173356 Byte globale Variablen. Core3.3.12/QSPI-Defaults,
  gepinnte Libraries einschließlich NimBLE2.3.6, keine Secrets. Manifest-
  SHA256 und Stagingquellen vor Upload gegen aktuelle Quellen geprüft.
  Upload derselben Artefakte erfolgreich, Hashprüfung erfolgreich.
  Macro-Whitespace-Warnungen wie früher, kein erfolgreicher Lauf daraus ableitbar.
- Gerät startet SD/Audio/PSRAM/Gauge/AW mit Status1, erreicht nach
  `USB recovery...` keinen Ready-/Heartbeat-Status. Wiederholte USB-
  Ab-/Anmeldungen; passives Wiederverbinden zeigt dieselben Bootmeldungen
  mehrfach. **Neustartschleife beim anschließenden Funkstart**, kein eigener
  Panic-/Backtrace im USB-Log erfasst, genaue Absturzstelle noch offen.
- Rohlogs: `docs/serial/2026-11-11-gesamtfirmware-commissioning.log`,
  `docs/serial/2026-11-11-gesamtfirmware-reconnect.log`.

## Rückfall auf bestätigten Stand

Sofortige Rückkehr zum bereits erfolgreich gebauten/geprüften
`~/.cache/boxbert-volume-IHv8dqX0` (keine fehlgeschlagenen Artefakte benutzt).
Erster Upload traf in der Neustartschleife einen bereits verschwundenen
Port und scheiterte. Danach absichtlicher1200-Baud-Bootloader-Touch:
Espressif-USB-JTAG-Bootloader erkannt, Upload überttyACM0 erfolgreich,
Flash-Hashes geprüft. Lokale Logs `rollback-upload*.log` im Diagnosebuild.

**Aktuell wieder VOLUME-DIAG v1**, bereit/stabil bei35/40 s,
SD/PSRAM/I2S=1,Volume1,inaktiv,Bildzähler130/150.
Nachweis `docs/serial/2026-11-11-volume-rollback.log`.
Gesamtfirmware zu diesem Zeitpunkt noch nicht geräteabgenommen.

## Isolierter BLE-Vergleich / belegte Korrektur

`firmware/tests/endaufbau_ble_init/`: kein SD/Audio, TFT dunkel, keine
externen GPIO-Ausgänge außer dokumentiertem I2C/Core-Rails. NimBLE startet
nur einmal auf USB-Befehl`b`; nach einem Reset wartet der Sketch wieder,
sodass kein erneuter Bootloop entsteht.

- NimBLE2.3.6,Build `~/.cache/boxbert-ble236-KjRj7bVN`,604631 Byte
  Flash/65032 Byte RAM. Compile+Upload erfolgreich. Rohlog
  `docs/serial/2026-11-11-ble-init-2.3.6.log`: „before init“, danach
  Wiederanmeldung mit attempted=0/resetReason=4 (Panic). Kein init-return.
- **Nur Librarywechsel auf2.3.8**, gleicher Sketch/Core/Board:
  Build `~/.cache/boxbert-ble238-tos1TQHU`,604783 Byte Flash/65032 Byte RAM,
  Compile+Upload erfolgreich. Rohlog `docs/serial/2026-11-11-ble-init-2.3.8.log`:
  init returned=1,advertising=1, wiederholte unveränderte Heartbeats.
- [Hersteller-Changelog2.3.8](https://github.com/h2zero/NimBLE-Arduino/blob/2.3.8/CHANGELOG.md)
  nennt „Crash on init ... Arduino core3.3.7 and later“;
  [PR1090](https://github.com/h2zero/NimBLE-Arduino/pull/1090),
  [ESP32-S3-Issue12375](https://github.com/espressif/arduino-esp32/issues/12375).
  `setup.py` und `build.py` jetzt explizit auf2.3.8 gepinnt, keine globale
  Diagnose-Library verändert und Core bleibt3.3.12.

## Erster lauffähiger Gesamtstand mit NimBLE2.3.8 — später durch Diagnose ergänzt

- Build `~/.cache/boxbert-build-3qvvzmm_/manifest.json`,2541527 Byte Flash
  (88% von2883584),173356 Byte globale Variablen (52%). Board/Core wie oben.
  SHA256 aller Artefakte und Stagingquellen vor Upload geprüft; exakt diese
  Artefakte hochgeladen, alle Flash-Hashes bestätigt, Uploader-Reset.
  Compiler-Makro-Whitespace-Warnungen bleiben bestehen.
- Zu diesem Zeitpunkt **boxbert-v1-commissioning-20261111** mit Inbetriebnahmeprofil,
  inzwischen um USB-Diagnose ergänzt. Passivlog ab20:22:34:
  `docs/serial/2026-11-11-gesamtfirmware-nimble238.log`.
  Wiederholte Hauptloop-Statuszeilen:SD=1,PSRAM=1,AW=1,Gauge=1,
  radio=2(BLE),volume=1,running=0,config=1,freeHeap=42688.
  Keine erneute Neustartschleife während dieses Ausschnitts beobachtet.
  42688 Byte freier Heap ist nur Idle-Snapshot, kein Lastminimum.
- Neuer PC-BLE-Scan nicht ausgeführt: BlueZ meldet bereits laufende Discovery
  (`org.bluez.Error.InProgress`), keine passende Boxbert-Zeile in der
  Geräteliste. Nicht als erfolgreicher Scan oder defekter ESP-Funk werten.
  Echte GATT-/PWA-Verbindung bleibt offen.
- **Jetzt Nutzer-Sicht-/Hör-/Encoderprüfung im Gesamtstand erforderlich.**
  Großer blauer Button oben (ID9) startet Tag0/Fallback-Song; großer roter
  unten(ID10) Tag1 (alte Zuordnung `/fart.mp3`). Encoder IO5 Pause/Resume,
  Drehen0..6 mit verzögerter SD-Persistenz; nicht mehr20-s-Teststopp.
  Boot startet weiterhin mit1, da temporäres Profil. WLAN/BLE-Transport,
  vollständige Persistenz/Uploads und Last-/Power-/Sleep-Prüfung offen.

## Nutzer meldet „Dateifehler“ — autonome Untersuchung, keine Abnahme

Der Nutzer meldete nach dem Gesamtflash „dateifehler steht da“. Danach Auftrag,
selbstständig weiterzudiagnostizieren, offene Hör-/Sichttests stehenzulassen und
vollständig für eine neue Session zu dokumentieren. **Kein durchgängiger Fix
nachgewiesen:** die ursprüngliche physische Bedienfolge konnte ohne Nutzer
nicht exakt nachgestellt werden. Fehlerbezeichnung ist generischer TFT-Status5.

### Diagnose-/Quellstand

- Begrenzter USB-Zeilenparser (`IntegratedState.h`), explizites temporäres
  `commissioning::UsbDiagnostics=true`; Kommandos/CLI siehe Builddokument.
  `test9`/`test10` rufen den echten Buttonhandler auf, mitVolume1 und20-s-Stopp.
  Das simuliert die Zuordnung/Wiedergabelogik, **nicht** den physischen Kontakt.
- Audio-Callback, angeforderte Pfade, Dateiexistenz/-größe, Heap/PSRAM und
  Fehlerpfade geloggt. Später zusätzlich Button/Tag/Encoder und Funk-Schritte.
  Funktrace enthält `Serial.flush()` und10-ms-Pausen: verändert das Timing.
- Erster Diagnosebuild `~/.cache/boxbert-build-6ad58nq1`,2544263 Byte Flash /
  173388 Byte globale Variablen. Erfolgreich geflasht, CDC-Port wechselte beim
  ersten Uploadversuch in Bootloader; zweiter Upload aufttyACM0 erfolgreich.
- **Aktuell geflasht:** `~/.cache/boxbert-build-auvtr3vh/manifest.json`,
  **2545151 Byte Flash /173380 Byte globale Variablen**, Board/Core/QSPI/NimBLE
  unverändert. Stagingquellen und Artefakt-SHA256 geprüft, Upload mit bestätigten
  Flash-Hashes. Keine Zugangsdaten ins Image eingebracht. Nachweise liegen als
  `compile.log`, `upload.log` und Manifest privat beim Build.

### Dateipfade und Decoder

- `dateifehler-diagnose.log`: SD/I2S/config gültig, Tag0 `/arcade-music-loop.mp3`
  mit549988 Byte, Tag1 `/fart.mp3` mit23461 Byte, beide vorhanden; keine Intros.
  Root enthält die acht bekannten MP3 und`.boxbert`, **kein `/www`**.
- `dateifehler-test9.log`: echter Handler9 startet Arcade, Stereo44,1kHz/16Bit,
  Dauer34s gemeldet, Decoder wiederholt running=1, Teststopp nach20s.
- `dateifehler-test10.log`: Fart bis EOF, danach mehrere erneute Starts ohne
  neue sichtbare BUTTON-Zeile. **Ursache unbekannt**; damals fehlten die späteren
  TAG-/ENCODER-Marker. Nach `test-stop` zunächst beendet.
- `dateifehler-test10-radio-off.log`: nach zwischenzeitlichem Neustart normaler
  EOF und kein wiederholter Start im24-s-Capture. Der Name ist irreführend:
  Firmware war tatsächlich wieder **radio=2**, nicht nachgewiesen Funk-Aus.
- Neuer Tracebuild: `player-wifi-short.log` zeigt genau einen kurzen Start/EOF,
  `player-wifi-music.log` wiederholt running=1 bis zum20-s-Stopp bei radio=1.
  Beide Tests ohne START failed/Dateifehler im Ausschnitt. Das beweist nicht,
  dass der Nutzerfehler behoben ist, und ersetzt keinen Hör-/Sichttest.

Alle vorgenannten Rohlogs liegen mit Präfix `docs/serial/2026-11-11-` vor.
CLI-Captures sind Ausschnitte, manche beginnen mitten in einer alten Statuszeile.
Keine fehlenden Boot-/Paniczeilen wurden rekonstruiert.

### Funkwechsel und Speicherreserve

- `radio-modes.log`: früheres `radio-off` im ersten Diagnosebuild führt zu
  sichtbarer Neuanmeldung/Boot, ohne `DIAG radio off`. Danach wieder radio=2.
  Kein vollständiger Panic-Backtrace: Ursache und Resetart nicht gesichert.
- Separater BLE-Sketch,2.3.8, Core3.3.12: Init/Deinit ohne Scan-Response
  (`ble-cycle-2.3.8.log`) sowie Init/Deinit/Reinit mit Scan-Response
  (`ble-cycle-2.3.8-scanresponse.log`) erfolgreich. Builds
  `~/.cache/boxbert-ble238-cycle-CANXUcgg` und
  `~/.cache/boxbert-ble238-scanresponse-jqNslohs`. Kein allgemeiner Nachweis,
  dass Deinit in jedem integrierten Lastzustand sicher ist.
- Tracebuild: `radio-off-trace.log` zeigt jeden Schritt bis deinit-ok und
  radio=0; `radio-cycles-trace.log` drei BLE→Off-Zyklen ohne beobachteten Reset;
  `radio-wifi-trace.log` mode1 ohne gemeldeten AP-Startupfehler. Kein echter
  WLAN-Client verbunden, keine GATT-/HTTP-Abnahme.
- `player-radio-switches.log`: bei laufendem Arcade-Decoder BLE→Off→WiFi→BLE,
  running=1 in allen beobachteten Modi, danach20-s-Stopp und explizites Stop.
  **Keine Aussage über hörbare Unterbrechungen.** Im letzten BLE-Modus nur
  ca.18628 Byte freier Heap beim Decoder,24316 Byte nach Stop, verglichen mit
  ca.42640 Byte im frischen BLE-Idle. Nicht als bewiesenes Speicherleck werten;
  nach WLAN-Initialisierung können Ressourcen bestehen bleiben. Reserve für
  Auth/HTTP/Uploads und große Antworten ist **nicht** nachgewiesen.
- Neuere Hersteller-Changelogs erwähnen Timer-/Reinit-/Deinit-Fixes:
  [NimBLE2.5.2](https://github.com/h2zero/NimBLE-Arduino/blob/2.5.2/CHANGELOG.md).
  Das ist Recherche, **keine bestätigte Ursache oder hier getestete2.5.2**.
  Produktiver Pin bleibt2.3.8. Keine zusätzliche funktionale Änderung erraten.

### Offen / nächste Session

Physischer blauer Button und TFT-Dateifehler mit aktuellem Log; realer Ton,
Encoderlautstärke/Mute/Pause/Resume unter Funklast; unerklärte Wiederholungen
und früher Funkreset; Speicherreserve; echte BLE-HMAC/PWA und AP/HTTP; `/www`
bereitstellen; Konfig/Uploads/RESET; Power-/Sleep-/Sicherheit. Vollständige
Reihenfolge und Arbeitsregeln: `uebergabe-endaufbau-2026-11-11.md`.

## Abschlusszustand / Regressionen

- Quellen und Artefakte des aktuellen Builds nochmals gegen Manifest geprüft;
  identisches Image erneut per Uploader geprüft/resetet, `upload-final.log` im
  Buildverzeichnis. Kein Peripherie-Power-Cycle bei angeschlossenem Akku.
- `docs/serial/2026-11-11-abschluss-idle.log`: SD/I2S/PSRAM/AW/Gauge/config=1,
  playback1,idle/running0,Volume1,radio2,Heap42640,größter Block31732,
  freiePSRAM1576536,Konfigrevision9; Tagpfade unverändert vorhanden,
  GPIO5/6/11 HIGH. Kein serieller Hintergrundleser bleibt aktiv.
- Abschließend erneut grün:4Pin-Node-Tests,17native Programme ASan/UBSan,
  5Encoder/RPC-Szenarien (6Node-Tests inkl.Parent),68App-Tests nach TFT-Build.
  Pythondateien syntaktisch geprüft; USB-CLI weist `credentials`,0s und121s
  vor Gerätezugriff zurück. Parser behandelt echten eingebetteten NUL und
  erholt sich nach LF. `git diff --check` ohne Befund. `.gitattributes` erhält
  serielle Rohlogs bytegetreu und erlaubt dort CR am Zeilenende; keine Rohlogs
  zum Beseitigen von Whitespacewarnungen normalisiert.
- Geänderte/neue Text-/Quellpfade geprüft: keine privaten Header,
  Firmwarebinaries oder Passwortausgabe-/Private-Key-Muster in neuen Logs.
  Das ist eine lokale Sichtprüfung, kein formales Geheimnis-/Security-Audit.
