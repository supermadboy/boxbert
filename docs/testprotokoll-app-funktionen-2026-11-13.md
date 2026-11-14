# Appfunktionen nach BLE-Verbindungsfix — 13.11.2026

## Nutzerbestätigung und neue Symptome

Handyverbindung, Lautstärke und Start/Stopp laut Nutzer erfolgreich. Kein neuer
Flash seit `prnsjyfe`, Kennung`boxbert-v1-commissioning-20261113-v21-blefix1`.
Button1 inUI mitPups belegt, physischer grüner30mm stoppt aktuellenSong stattPups.
Ob Zuordnung ausdrücklich gespeichert/bestätigt wurde, noch nicht unabhängig
ausgelesen. Laut verbindlicher Pinout-ID-Tabelle und Flash: Grün=ID2(AWP06),
Gelb=ID1(AWP14/Bit12); unbelegteID2 hat DefaultSTOP. Nutzer meint alsZiel UI1Grün.
Vorschlag1Grün/2Gelb festgehalten, aber keine IDs oder gespeicherten Medien verändert.

`docs/serial/2026-11-13-app-button-upload-status.log`: Revision131,Volume12,
playback1/gestoppt,Peer1/sub1/auth1,SD/I2S/AW/Gauge/config1,NFC1/pause0,
weiterhin8bestehendeMP3,Tag2Fart und keineTag-Intros. USB-Diag zeigt derzeit keine
Button-Pfade; deshalb keinen gespeichertenPfad daraus behaupten.

## Upload: angenäherte Fehlermeldung und widerlegte Hypothese

Nutzer beschreibt Intro-Fehler ungefähr als „abgebrochen nachZeit“, danach
„oder so“. Kein exakter Fehlertext/keine Live-Uploadphase bekannt. Kein Beweis
für Firmware-Inaktivitätszeitlimit, BLE-RPC-Zeitlimit oder SD-Fehler.

Agent vermutete fälschlich fehlendes `{upload:true}` beiIntro. NeuerQuellvertrag
besteht jedoch bereits gegen unveränderten Produktcode: Intro setzt dasFlag
schon, Gesamtbudget1h statt30s. Vermutung ausdrücklich zurückgenommen.

Vorhandenen HTTP-Browser-Vertragstest erweitert: native synthetische Aufnahme,
echte lokaleMP3-Kodierung, simulierte UploadChunks jeweils2s virtuellerZeit,
Gesamtdauer nachweislich>30s, Commit und Introzuordnung erfolgreich. Keine echte
BLE-/SD-/Geräteabnahme, keine geänderten Produkt-Timeouts. Neuer Quellvertrag +
übrigeApp-Tests:69grün. Log`2026-11-13-app-intro-simulated-slow.log`.
Browser reproduziert über`tools/firmware/browser-env.py` (gepinntes Chromium),
`node app/tests/device-browser.mjs`; nativeTests per`cd app && npm test`.
Keine Veröffentlichung, keine Firmwareänderung/kein Flash während Nutzer weg.

## PC-Vergleich: Adapter ohneBLE

Nutzer möchte stattHandy denPC nutzen. Read-only geprüft, Quelle
`docs/serial/2026-11-13-pc-bluetooth-capabilities.log`:
HCI-Version3,Manufacturer10; supported settings enthaltenBR/EDR, **keinLE**.
BlueZ`Adapter1.Roles`: leeresArray. VorhandenerController somit nicht für
BLE-GATT-Reproduktion geeignet. KeinPC-Scan/Pairing/Connect, keineInstallation
einesBLE-Clients und keineTrennung derHandyverbindung durchgeführt.

## Echter Intro-Versuch ca.17:05–17:13: RX-Timeout nach Display aus

Nutzer nahm laut eigener Angabe ca.4s auf, klickte nach gestarteter Aufzeichnung
Übertragen und meldete unveränderten Text „Übertragung zum Gerät / bestätigte
Bytes“. `phone-attempt` und `phone-followup` zeigen regelmäßig573–575Byte lange
Anfragen, `response-ready detail=1` und `response-sent` etwa alle2,6s. Passt zu
384Byte-Nutzdatenchunks, also Größenordnung145Byte/s; kein Opcode-/Payload-Dump.
Agent bestätigte währenddessen tatsächlich laufende Pakete, nicht einen Commit.
Fortschritt war im damaligen Produktcode nur im Medienreiter, nicht beim Intro.

Letzte vollständige Antwort t=3120345. Folgende Anfrage blieb bei480ByteRX
unvollständig, t=3132481 `drop-timeout detail=0`, t=3132530 Disconnect534.
Anders als der ältere Zeitstempel-Unterlauf verging hier echte Zeit ohne
vollständige neue Anfrage. Nutzer meldete „Getrennt: BLE-Verbindung verloren;
Gerätestand bei Schreibfehler unklar; neu laden“ und bestätigte anschließend,
dass das Display ausgegangen war. Android-Hintergrundpause ist damit eine
plausible Erklärung, aber ohne kontrollierten Vergleich kein Kausalitätsbeweis.
Kein Beweis für SD-Schaden und kein Grund, die Timeouts pauschal zu verlängern.

Nach beendetem Reader `diag`: SD/I2S/config1,Revision135,Volume21/playback4,
acht bekannte MP3 mit bisherigen Namen/Größen gelistet, beide Intros weiterhin
leer. Kein erfolgreicher Intro-Commit/Zuordnung und keine vollständige SD-
Integritätsprüfung. Lautstärke nicht verändert; vor Hörtest wieder leise einstellen.

Logs unter`docs/serial/2026-11-13-intro-upload-`:
- `phone-attempt.log`, `phone-followup.log`: passive begrenzte Captures, keine
  DTR/RTS-ioctls; Lücken und angeschnittene/verklebte Zeilen beim Leserwechsel
  erhalten, keine durchgängige Vollerfassung behaupten. Nicht parallele Reader.
- `after-disconnect.log`: frischer bounded USB-Diag, keine Funkumschaltung.

## Nutzerauftrag: Upload-Wachhalten und Fortschritt lokal umgesetzt

Nach Rückmeldung Display aus bat Nutzer ausdrücklich um die vorgeschlagenen
Verbesserungen. Neue `upload-wake-lock.mjs` fragt best-effort `request('screen')`
an, ohne die Dateiübertragung auf einen eventuell hängenden Grant warten zu
lassen. API fehlt/Request abgelehnt/Systemfreigabe/Hintergrund werden erklärt.
Bei Sichtbarkeit zurück neue Sperre, ohne automatische Upload-Wiederholung.
Freigabe bei Erfolg/Fehler/Abort/Unmount; späte Grants nach Ende ebenfalls
freigegeben. Abbruchsignal löst Sperre sofort, selbst wenn RPC-Abbruchcleanup
noch läuft. Pending-/Release-Rennen und wiederholtes Cleanup sind getestet.
Quelle: https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API
(abgerufen13.11.2026). Keine Garantie gegen manuelles Sperren, Energiesparen
oder Hintergrundthrottling. Lokales ungesichertes HTTP erhält Warnung statt
hartem Uploadfehler; Browser/Plattform können die API verweigern.

Prozentanzeige und eine Abbrechen-Schaltfläche stehen nun global außerhalb
des Medienreiters, daher auch bei Intro und BLE-Chooser sichtbar. Nur bestätigte
Chunk-Prozente,100% erst nach Datei-Commit; finale Zuordnung/Readback separat mit
Abschlussmeldung. Lokale Konvertierung kann zunächst0% zeigen, explizit erklärt.
Kein Firmware-/RPC-/Gesamtzeitlimit, keine Button-ID, kein Passwort geändert.

Nachweise lokal:
- `npm test`: **81grün**, einschließlich11Wake-Lock-Lifecyclefällen und UI-Vertrag.
- `tests/device-browser.mjs`: native synthetische Aufnahme/lokale echte MP3,
  **gemockter** WakeLock gehalten, globaler Fortschritt/Abbrechen im Zuordnungs-
  reiter sichtbar, Prozent nach erstem Chunk>0, >30s virtuellerHTTP-Upload,
  Commit/Zuordnung; Sperre nach Erfolg und simuliertem SD-Fehler freigegeben.
- `tests/browser.mjs`: Demo, Mobile/Desktop, Abbruch, Persistence/Layout bestanden.
- `tests/hosted-browser.mjs`: echtes lokalesHTTPS/ServiceWorker/offline bestanden,
  keine öffentliche Veröffentlichung und kein physischer Android-Wake-Lock-Test.
- `npm run build`: HTTPS `index-7Ehl6x5w.js`, SD `index-CWCh9PvO.js` gebaut.
  Tests über gepinnten Chromium aus `tools/firmware/browser-env.py`.
- Logs `2026-11-13-upload-wake-{tests,browser-build,https}.log` unter`docs/serial/`.

Zu diesem Vorbereitungszeitpunkt noch nicht deployed, Firmware auf Gerät weiter
`prnsjyfe`. Aktivierung inzwischen wie nachfolgend erfolgt. BLE-Durchsatz und
Button-ID-Tausch separat offen, Musik-/Belegungsdaten unverändert.

## Aktivierung nach ausdrücklicher Website- und Root-Launcher-Freigabe

SSH als `habibi` wurde abgelehnt. Erst nach zusätzlicher ausdrücklicher Nutzer-
freigabe Root-SSH als Launcher genutzt, alle eigentlichen Serveroperationen mit
`runuser -u habibi`, Aktivierungsskript prüftUID1001. Keine Root-Skripte aus Repo,
keine Host-/Zugangs-/Konfigänderung, kein Restart und kein Root-Docker verwendet.
Read-only Rootless-Docker-Mountprüfung ergab direkten Bind von
`/srv/ai-habibi/sites/boxbert`; deshalb dessen Verzeichnis/Inode erhalten.

Hostingbuild lokal über bestehende Brücke in separatem Worktree
`~/.cache/boxbert-hosting-wake-20261113`, `BOXBERT_APP` zeigt ausschließlich auf
Boxbert-App. Erneuter Build erzeugt unveränderten getesteten JS-SHA256:
`e2a2ae0a0475ce6666a3d075faae70ee0130dd0a072afdd1ad949b390a651fda`.
Hosting-Artefaktcommit **83edc20** aufmain gepusht, keine Projektquellen kopiert.

Alle elf Builddateien perManifest geprüft, vor Aktivierung bisherige Site gesichert:
`/home/habibi/.cache/boxbert-web-activation.zIljGc/previous`.
Abhängigkeiten zuerst, danach index undsw, einzeln über temporäreDatei+Rename
atomar veröffentlicht; alteHashassets nicht gelöscht. Root-Inode undUID geprüft.
LiveHostingHEAD bleibt7329e39, absichtlich sites/boxbert-Artefakte im Arbeitsbaum
aktualisiert; vorhandene fremde Änderungen unberührt, kein Checkoutwechsel.
Boxbert-Serverquellcheckout bleibt6e14e5e; Geräteflash bleibtprnsjyfe.

Öffentliche Prüfung:
- **https://habibi.supermittel.com/boxbert/?stand=upload-wach-14**: HTTP200,
  referenziert`index-7Ehl6x5w.js`. Alle elf Dateien haben erwartete SHA256.
- Permissions-Policy-Header nicht gesetzt, damit keine explizite serverseitige
  Wake-Lock-Sperre festgestellt; daraus keine Android-Funktionsgarantie ableiten.
- Vorhandener`tools/firmware/verify-hosted.mjs` gegen öffentlichenneuenLink grün:
  echtesHTTPS, BLE-UI ohneFunkversuch, Offline-Neudokument/TFT/Buttons,
  keineConsole-/HTTP-Fehler und keineGeräte-API-Anfragen.
- Logs`2026-11-13-upload-wake-public-{artifacts,browser}.log` und
  `2026-11-13-upload-wake-server-activation.log`.

Noch offen: alteBoxbert-Tabs schließen, neuenLink ohneBrowserdatenlöschung laden
(lokaleAufnahme erhalten), neuverbinden und echtenAndroid-Display-/Introabschluss
kontrolliert prüfen. Vor Wiedergabetest leiseLautstärke einstellen; zuletzt21.
KeineweiterenblindenMehrminutenversuche, zuerst sichtbaresWachhalten/Prozent prüfen.
