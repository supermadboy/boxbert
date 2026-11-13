# Android-Chrome/BLE-Verbindungsaufbau — 13.11.2026

## Nutzerbefund und aktuell installiertes Gerät

Nutzer bestätigt: Fehler **direkt nach Auswahl von Boxbert beim Verbinden**, noch
bevor echte Dateien erscheinen: „Getrennt: BLE-Verbindung verloren. Gerätestand
bei Schreibfehler unklar; neu laden“. Letzteres ist pauschaler UI-Zusatz auch
für lesendes Connect, kein Beweis für SD-Schaden oder erfolgreiche Anmeldung.
Unbekannt bleibt, ob GATT-Setup, hello, auth oder erster read scheitert.

Stand vor dem Diagnoseflash: `boxbert-v1-commissioning-20261113-nfc-v21`, Build
`~/.cache/boxbert-build-b9h_54sn/manifest.json`. Passwortschutz bleibt erhalten.
Letzter Diag: SD/I2S/AW/Gauge/config1,Radio2,NFC1,Volume17/playback4,Revision113,
Heap36260/maxAlloc17396. Musik/Zuordnungen unverändert, Tag2 nochFart,
gewünschtes HappyTune noch nicht eingestellt. Keine Webseite veröffentlicht.
Live-JS entspricht lokalem Hostingartefakt/App-Build, Handy-Cache nicht gesondert
geprüft. Verworfenen offenen BLE-Cachea0ukgnbl **niemals flashen**.

## Gezielt vorbereiteter Diagnosestand — inzwischen geflasht

- Kennung `boxbert-v1-commissioning-20261113-v21-bletrace`.
- Manifest `~/.cache/boxbert-build-depm3fts/manifest.json`.
- 2560263Byte Flash (88%),173468Byte Globals (52%),Core3.3.12/QSPI,NimBLE2.3.8.
- Boot1/Max21,NFC an,Stick/BoostControl/AutoSleep aus; Passwort/HMAC unverändert.
- Keine geänderten Bibliotheken, Timeouts, Paketgrößen oder Autorisierungsregeln.
- Callback stellt lediglich Disconnectgrund/ungültige Write-Länge in bestehende
  Queue. Keine Serialausgabe in NimBLE-Callbacks. Zusätzliches int pro Queue-Event.
- Mainloop protokolliert connect, subscribe, hello/auth/read (nur feste Labels),
  Response bereit/versendet, Controller-Disconnectgrund, gezielte Parser-/Queue-/
  Pending-response-/Timeout-Dropgründe sowie Heap/MaxAlloc und Zähler.
- Kein Passwort, Nonce, Proof oder RPC-Payload in den neuen Traces. Kein neuer
  flush/delay; trotzdem können Serialausgaben Timing verändern, kein Fixnachweis.
- 19native Sanitizerprogramme,4Pinregressionen,3Trace-Quellverträge und6Encoder/
  RPC-Szenarien (7Node inkl.Parent) grün. Keine Funkabnahme durch Hosttests.

## Parken und Upload

NFC-Pause angefordert. `docs/serial/2026-11-13-bletrace-nfc-park.log` weiterhin
zunächstNFC1/pauseRequested1 statt3,Revision113. Nach Nutzer „liegt“ neuer Diag
bestätigt **NFC3/pauseRequested1**. Alle Stagingquellen/Runtimeheader und
Artefakt-SHA256 geprüft, exaktdepm3fts erfolgreich hochgeladen/Hashes verifiziert.
Uploadlogs im Buildverzeichnis. Offenera0ukgnbl bleibt verworfen, nicht verwenden.

`2026-11-13-bletrace-after-flash.log`: SD/I2S/AW/Gauge/PSRAM/config1,NFC1/
pauseRequested0,Volume1/playback2/running1,Revision113. Traceinspect bei t4532ms:
peer65535/keinPeer,sub0/auth0,rx0/tx0,Heap30796/maxAlloc21492. Bootzeilen selbst
nicht vorliegend, aber Volume1 und Decoderlauf danach beobachtet.

Begrenzter120-s-Handyleser gestartet,PID22048,Ausgabe
`docs/serial/2026-11-13-bletrace-phone-attempt.log`. Vor weiterem USB-Zugriff
Prozess/Laufzeit prüfen. Nutzer aufgefordert, einmal inChrome mit bisherigem
Passwort zu verbinden, nichts speichern/hochladen. PC währenddessen keinGATT-
Client. PC-BlueZ-Adapter aktiv/unblockiert, keinScanner aktiv; Bleak im System-
Python nicht vorhanden, noch keine Desktop-Reproduktion oder Werkzeuginstallation.

## Wiederholung mit Trace — lokaler falscher Timeout nachgewiesen

`2026-11-13-bletrace-phone-attempt.log`, zwei Versuche:

- request-hello104089ms → response-ready104090ms/105Bytes → drop-timeout104091ms
  → Controllerdisconnect534. Keine auth-Anfrage zuvor.
- request-hello128434ms → response-ready128435ms/105Bytes → drop-timeout128436ms
  → Controllerdisconnect534.

Firmware trennt selbst, obwohl keine30s verstrichen sind. `now` stammt vom
Loop-Eintritt; `bleResponse` setzt`bleAt=millis()` während derselben Runde später.
`uint32_t(now-bleAt)` unterläuft bei neuerem Aktivitätsstempel und wird sehr groß.
Tatsächlicher Loop-Eintritt nicht geloggt; obige Zeiten sind Traceereignisse.
Traceausgaben ändern Timing, aber der fehlerhafte Rechenpfad ist im echten
Gerät zweimal belegt und stammt aus bereits vorher vorhandenem Timeout-Code.
Keine Aussage, dass dies jede frühere Funkauffälligkeit erklärt.

## Gezielter Fix — geflasht, hello/auth/read danach übertragen

Produktionslogik nach`runtime::bleSessionExpired` extrahiert, zunächst semantisch
unverändert. Neuer nativer Test mit1ms neuerem Aktivitätsstempel scheitert gegen
alte Logik reproduzierbar: `2026-11-13-ble-timeout-regression-red.log`.
Danach Halbintervallprüfung`elapsed<0x80000000u` ergänzt wie bei bestehendem
Sleep-Schutz. Strikte10s-RX/30s-TX-Grenzen bleiben unverändert. Echten millis-Wrap,
exakte Grenzen, neueren Zeitstempel und inaktiven Zustand host-getestet.
20native Sanitizerprogramme/4Pin-/3Trace-Quellverträge und6Encoder/RPC-Szenarien
(7Node inkl.Parent) grün: `2026-11-13-blefix1-host-green.log`.

**Aktueller Flash:** `boxbert-v1-commissioning-20261113-v21-blefix1`,
`~/.cache/boxbert-build-prnsjyfe/manifest.json`,2560235Byte Flash/173468Byte Globals.
NFC-Park3 vor Upload im`2026-11-13-blefix1-nfc-park.log` bestätigt, alle Quellen/
Runtimeheader und Artefakt-SHA256 geprüft, exakt Build erfolgreich hochgeladen.
`2026-11-13-blefix1-after-flash.log`: SD/I2S/AW/Gauge/PSRAM/config1,NFC1/pause0,
Volume1/Decoderläuft,Revision113,Heap30796/maxAlloc21492,keinPeer beimDiag.
Passwortschutz, Audio-/Power-/NFC-Flags, Core/Bibliotheken unverändert.

120-s-ReaderPID24820 gestartet (Prozess/Laufzeit vor neuem USB-Reader prüfen),
`2026-11-13-blefix1-phone-attempt.log`. Erster neuer Handshake:
hello60908/Antwortsent60958,auth61509→auth1/Antwortsent61529,
read61667/1268ByteAntwortsent62406. Kein sofortigerTimeoutabbruch.
Weitereauth/read-Strecke bei Decoderlauf/Volume16 ebenfalls übertragen, später
Vol7; weitereanonymisierte request-other teilsokfalse, teilsoktrue. Daraus keine
konkrete Aktion oder Persistenzabnahme ohne Nutzerklärung ableiten. Nutzer gefragt,
ob echte Dateiliste/APIerreichbar sichtbar, und welche Aktion ggf.abgelehnt wurde.
Erstaufbau technisch belegt, übrige PWA-/Upload-/Persistenz-/Dauerabnahme offen.

CapturePID24820 inzwischen nach120s beendet, ebensoältererPID22048; keine
Hintergrundreader mehr. Späterer `2026-11-13-blefix1-live-status.log` bei368783ms:
Revision123,Volume16/playback4,NFC1/pause0,keinPeer/sub0/auth0,Heap35940/
maxAlloc26612,Tag2weiterFart. Verbindung endete irgendwann außerhalbCapture;
kein Abbruchgrund belegt, nicht pauschal als Fehler oder Bedienertrennung werten.

Nie parallel USB lesen oder PC-BLE-Client starten, während Handyversuch läuft.
Keine Nonce/Proof/Passwörter in diesen Mitschnitten. Kein Website-Deploy oder
pauschaler SD-/Passwort-/Funkdefekt aus generischen UI-Zusätzen ableiten.
