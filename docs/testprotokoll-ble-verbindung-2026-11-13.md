# Android-Chrome/BLE-Verbindungsaufbau — 13.11.2026

## Nutzerbefund und aktuell installiertes Gerät

Nutzer bestätigt: Fehler **direkt nach Auswahl von Boxbert beim Verbinden**, noch
bevor echte Dateien erscheinen: „Getrennt: BLE-Verbindung verloren. Gerätestand
bei Schreibfehler unklar; neu laden“. Letzteres ist pauschaler UI-Zusatz auch
für lesendes Connect, kein Beweis für SD-Schaden oder erfolgreiche Anmeldung.
Unbekannt bleibt, ob GATT-Setup, hello, auth oder erster read scheitert.

Aktuell installiert: `boxbert-v1-commissioning-20261113-nfc-v21`, Build
`~/.cache/boxbert-build-b9h_54sn/manifest.json`. Passwortschutz bleibt erhalten.
Letzter Diag: SD/I2S/AW/Gauge/config1,Radio2,NFC1,Volume17/playback4,Revision113,
Heap36260/maxAlloc17396. Musik/Zuordnungen unverändert, Tag2 nochFart,
gewünschtes HappyTune noch nicht eingestellt. Keine Webseite veröffentlicht.
Live-JS entspricht lokalem Hostingartefakt/App-Build, Handy-Cache nicht gesondert
geprüft. Verworfenen offenen BLE-Cachea0ukgnbl **niemals flashen**.

## Gezielt vorbereiteter Diagnosestand — NOCH NICHT GEFLASHT

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

## Upload noch blockiert

NFC-Pause angefordert. `docs/serial/2026-11-13-bletrace-nfc-park.log` weiterhin
NFC1/pauseRequested1 statt3,Revision113. Nutzer gebeten, Karte etwa10cm entfernen,
2s warten und auflegen. **Kein Upload bisher.** Erst NFC3bestätigen, alle
Stagingquellen/Runtimeheader und Artefakt-SHA256 prüfen, exakt diesen Build
hochladen. Offenera0ukgnbl ist nicht dieser Build und bleibt verworfen.

Danach neue Boot-/Diagaufnahme sichern und begrenzten Reader für einen echten
Chrome-Verbindungsversuch starten. Nur verbinden/lesen, nicht speichern/hochladen;
Bediener soll während Capture nicht parallel weitere USB-Reader öffnen. Aus
Drop-Label/Controllergrund und letzter erfolgreicher Phase Ursache eingrenzen,
nicht aus generischer Browsermeldung einen SD-/Passwort-/Funkdefekt ableiten.
