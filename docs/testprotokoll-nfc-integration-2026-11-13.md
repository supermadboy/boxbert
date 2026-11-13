# NFC-Laufzeit im Gesamtstand — 13.11.2026

Fortsetzung der Endaufbauarbeit vom11.11. nach Nutzer „bist gehangen mach weiter“.
Tatsächliches Hostdatum beim Geräteversuch:13.11.2026. Die Firmwarekennung behält
als Entwicklungsstand den11.11. im Namen; nicht mit dem Testdatum verwechseln.
Frühere UID-/IRQ-Proben: `testprotokoll-gesamtfirmware-2026-11-11.md`.

## Ausgangslage / Änderung

PN532/Firmware1.6, UID Tag1 E3:2F:F6:33 und IRQ12-Flanken waren isoliert bestätigt.
Gesamtstand bisher NFC aus. Der alte250-ms-Leseaufruf hielt den Wire-Mutex über
Tagwarten; Timeout0 wäre dort keine Lösung (AW/Gauge unbegrenzt ausgesperrt).
Adafruit1.3.4 `startPassiveTargetIDDetection()` wartet ebenfalls auf die Zielantwort.

**Eine funktionale Erweiterung: NFC-Laufzeit aktivieren, ohne Busbesitz beim
Tagwarten.** Keine neue Verdrahtung, kein Core-/Library-/SD-Taktwechsel. Lautstärke
Boot1/max6, Stick/BoostControl/AutoSleep bleiben unverändert aus. Amp am Step-Up
laut parallel aktualisierter Nutzerbestätigung; der vorgeschlagene Pull-down ist
weiter nicht Teil dieses Auftrags/Tests. Keine Strom-/Sleep-Freigabe.

### Implementierung

- `runtime/Pn532Scan.h`: Send→ACK→Target→200-ms-Cooldown. InListPassiveTarget-
  Frame exakt nach Adafruit1.3.4 I2C-`writecommand`: D4 4A 01 00, Rahmen/LCS/DCS.
  Jede Zustandsmaschinenrunde hat nur kurzen Write oder Status-/Frameread.
  Kein Sleep/Tagwait in `tick`; eigene Task gibt Wire-Mutex nach jeder Runde frei.
- ACK nur bis1000ms; nach ACK beliebig lange auf Karte warten, ausschließlich
  kurze RDY-Reads, keine erneuten Suchbefehle solange Antwort aussteht.
  Bus-/ACK-/Frame-/Timeoutfehler gehen fail-closed inFault, keine automatische
  Reinitialisierung/zweideutige Befehlswiederholung. Wire-Transfers weiter300ms
  Fehler-Timeout, Task wartet höchstens25ms auf Mutex, außerhalb10ms Pause.
- Antwort64Bytes mit gemeinsamem Parser, nur gültige4-/7-Byte-UIDs. Gleiche UID
  wird wie Referenz erst nach anderer UID wieder gemeldet, kein EOF-Autoloop.
- GPIO12 bleibt Eingang; laufender Scanner nutzt I2C-RDY, kein GPIO-Wake/ISR.
  Adafruit-Library nur für Init/Version/SAM vor Taskstart, kein paralleler Zugriff
  auf deren gemeinsames Paketbuffer. Queue zum Hauptloop bleibt erhalten.
- `NFC` im Serialstatus:0disabled,1Scanner,2Fault,3sauber geparkt.
  USB `nfc-pause` fordert Parken erst ohne ausstehenden Befehl an; bei wartender
  Suche muss ein Tag die Antwort ermöglichen. Erst **NFC=3/parked** erlaubt den
  vorgesehenen Boardreset ohne bewusst zurückgelassene Suchantwort. `nfc-resume`
  setzt die Anforderung zurück, behebt keinenFault. Kein Peripherie-Power-Cycle.

## Tests / Build / Flash

-4Pin-Node-Tests,19native Programme mit gepinntem Clang/ASan/UBSan grün; neuer
  Scan-Mock prüft exakten TX-Frame, keine Wiederholung bei wartendem Target,
  ACK-Deadline, Wraparound/Cooldown, Transfer-/Status-/Framefehler und Faultruhe.
  5Encoder/RPC-Szenarien (6Node-Tests inkl.Parent) und68App-Tests erneut grün.
  USB-CLI syntaktisch geprüft, `git diff --check` ohne Befund.
- Build `~/.cache/boxbert-build-c0n11gac/manifest.json`,2559211Byte Flash (88%),
  173468Byte globale Variablen (52%), Core3.3.12/QSPI/NimBLE2.3.8. Bestehende
  Makro-Whitespacewarnungen bleiben. Quellen inklusive Runtimeheader und alle
  Artefakt-SHA256 vor Upload abgeglichen.
- Application-Upload CDC-I/O-Fehler, danach identifizierter Espressif-Bootloader,
  dort exakte Artefakte erfolgreich hochgeladen/Flash-Hashes bestätigt.
  `upload.log`/`upload-bootloader.log` im Buildverzeichnis.
- Erster Capture vor Bootloaderupload45s lief vor Uploadende aus; Datei
  `2026-11-11-nfc-integrated-first-boot.log` ist zudem falsch vordatiert und
  enthält nur Capturemarker. **Kein Boot-/Panic-/Funktionserfolg daraus.**
  Neue Nachweise korrekt mit13.11. benannt, fehlende Bootzeilen nicht ergänzt.

## Gerätebeobachtung

1. `docs/serial/2026-11-13-nfc-integrated-status.log`:
   PN532 init1/Version0x32010607; SD/I2S/PSRAM/AW/Gauge/config=1,NFC=1,
   Volume1,radio2(BLE),running0,Heap37352,größter Block26612,Konfigrevision26.
   Das sind teils Initflags, keine aktuelle unabhängige Prüfung jedes Peripherals.
2. Nutzer gebeten, Tag1 abzuheben/aufzulegen. Frühere Aussage „Karte liegt die
   ganze Zeit auf“ galt der älteren Probe; neuer physischer Zeitpunkt nicht
   unabhängig gemessen.90-s-Capture `2026-11-13-nfc-tag-physical.log`:
   **NFC UID=E3:2F:F6:33 → TAG index0 → Arcade geöffnet → Stream bereit**,
   Stereo44,1kHz/16Bit, gemeldete34s. Laufender Decoder, danach natürliches EOF.
   Kein20-s-Teststopp, kein erneuter Start im restlichen Ausschnitt.
   **Nutzer bestätigt anschließend auf Nachfrage zu Musik/TFT:**
   „ja safe hat gut geklappt alles danke“. Hör-/Sichttest dieses Tag1-Starts
   damit bestätigt, nicht pauschal Mute/Pause/Tagwechsel oder Gesamtprodukt.
3. Im selben Log Encoderereignisse requested=actual2→6, anschließend mehrfach
   auf6begrenzt. Keine Quelle für Handbewegung/akustischen Eindruck erfinden;
   Log beweist Werte/Limit, nicht wahrgenommene Lautstärke. Während Decoder
   Heap30828, nach EOF36516. Das ersetzt keine Radio-/HTTP-/Upload-Lastreserve.
4. `2026-11-13-nfc-pause-resume.log`: Pause angefordert, während dieses kurzen
   Ausschnitts **kein Parken**, NFC bleibt1/pauseRequested1. Ausstehende Suche
   durfte nicht einfach verworfen werden. Danach Resumeanforderung, Scanner
   wieder/unverändert1. Dies ist **kein bestandener Park-/Reset-Test**.
   Diag danach playback4(Ende),Volume6,radio2,Heap36516,größter Block17396,
   freiePSRAM839076,Konfigrevision39,GPIO5/6HIGH,GPIO11LOW. Tagpfade unverändert.

## Aktueller Stand / noch offen

**Zwischenstand vor der folgenden Volume12-Erhöhung:** `boxbert-v1-commissioning-20261111-nfc` ausc0n11gac,
NFC aktiv, zuletzt natürlicher EOF/keine laufende Musik,Volume6,Scanner1,
Parkanforderung zurückgenommen. Kein serieller Hintergrundleser mehr aus diesen
begrenzten Captures. Vor erneutem Flash kontrolliert parken und bestätigen;
bei Fault/unklarem Pendingzustand nicht blind weiterflashen, nötigenfalls
gezielten echten Peripherie-Power-Cycle mit Nutzer abstimmen.

- Ton/TFT für Tag1-Start vom Nutzer bestätigt. Encoder Mute/Pause/Resume
  im aktuellen Gesamtstand weiterhin gesondert offen.
- AW-Taster/Gauge tatsächlich während taglosem Warten bedienen/messen, nicht nur
  Initflags als Nachweis verwenden. Tagwechsel und langes tagloses Warten.
- Tag2-Zuordnung vor Änderung/Wiedergabe klären: historischHappyTune, tatsächlich
  gespeicherte/migrierte KonfigFart. Nichts automatisch überschreiben.
- Sauberes Parken (NFC=3) samt Wiederaufnahme, Neustart-/Peripheriezustände.
- Frühere Dateifehler/Neustartauffälligkeiten nicht als allgemein behoben markieren.
- BLE-HMAC/PWA/AP/HTTP/Uploads/Persistenz und Heapreserve unter kombinierter Last.
- Power-/Boost-Pull-down-/Sleep-/Wake-/akustische Sicherheit bleiben separat offen.

## Folgeauftrag: Lautstärkegrenze erhöhen — nach Parkbestätigung geflasht

Vorbereitung: Nutzer bittet, höher drehen zu können. Als nächste Teststufe6→12/21 vereinbart/
angekündigt, Boot bleibt1; keine akustische Sicherheits-/Maximalpegel-Abnahme.
Vorbereitete Kennung `boxbert-v1-commissioning-20261113-nfc-v12`, Build
`~/.cache/boxbert-build-n1_lldq4/manifest.json`,2559227Byte Flash/173468Byte
globale Variablen.19native Sanitizerprogramme und jetzt6Encoder/RPC-Szenarien
(7Node-Tests inkl.Parent) grün, zusätzlich reale Encoder-Codegrenzen0/Max getestet.
RPC-Grenze/Fehlertext und Bootmeldung auf12angepasst. **Kein Upload**, solange
Leser nicht bestätigt geparkt ist.

`2026-11-13-volume12-nfc-park.log`: erneute Pauseanforderung, weiterhin NFC1/
pauseRequested1, nicht3; Konfigrevision49,Volume6,playback4,Musik aus. Danach
begrenzter120-s-Capture ohne Parkbestätigung. Nutzer aufgefordert, getestete Karte
abzuheben/neu aufzulegen, damit ausstehende Suche beendet werden kann. Aktuell
vor der Parkbestätigung also alter Flash c0n11gac/Maximum6, Quellstand und neuer Build schon Maximum12.
Zu diesem Zeitpunkt blieb Parkanforderung gesetzt; damals noch kein Upload.

**Anschließend Nutzer „liegt“:** neuer Diag im selben Parklog bestätigt
**NFC3/pauseRequested1**,Volume6/playback4,Konfigrevision81. Erst danach
Stagingquellen inkl.Runtimeheader und Artefakt-SHA256 gegen Manifest geprüft,
exakt `boxbert-build-n1_lldq4/artifacts` erfolgreich hochgeladen/Hashes verifiziert.
Uploadlogs im Buildverzeichnis. `2026-11-13-volume12-after-flash.log`:
SD/I2S/PSRAM/AW/Gauge/config1,NFC1/pauseRequested0,Volume1/playback2/running1,
Revision81,Heap31512 beiDiag/31060 im laufenden Decoder. Musik startet wieder
leise. **Aktueller Flash jetzt `boxbert-v1-commissioning-20261113-nfc-v12`,
Maximum12, Boot1**; höhere Stufen noch keine akustische Sicherheitsabnahme.
Nutzer gebeten, langsam zu steigern und bei Verzerrungen zurückzugehen.
Nachfolgender7-s-Passivlog `2026-11-13-volume12-passive.log`: Volume1,
running1→0,NFC1,Heap36748 nach Ende; keine höheren Encoderwerte in diesem
Ausschnitt beobachtet, also noch keine Geräte-/Hörbestätigung von12.
Erster bestätigter Park→Boardreset/Flash→Scanner-/Decoder-Neustart, kein echter
Peripherie-Power-Cycle und keine allgemeine Reset-/Dauerfreigabe.

Weiterarbeit: `uebergabe-endaufbau-2026-11-11.md`, `To-Do.md`.
