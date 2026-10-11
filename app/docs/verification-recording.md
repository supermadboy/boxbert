# Prüfung: taggebundene Introaufnahme · 11.10.2026

Historischer Aufnahme-Zwischenstand ohne Dauer-/Icon-Ausbau. Aktuelle
Oberfläche und Nachweise: [Sprachaufnahme-UI](verification-recording-ux.md).

## Umfang

Die vorherige Bibliotheksauswahl ist entfernt. Pro bekannter UID direkt
**Aufnehmen**, **Stoppen und speichern**, **Aufnahme abbrechen** und
**Aufnahme löschen**. Löschen betrifft nur den Audio-Blob dieser UID;
Tag, Song, Name und die Medienbibliothek bleiben erhalten. Eine bestehende
Aufnahme wird erst nach erfolgreichem Speichern der Neuaufnahme ersetzt.

Aufnahme ist echter `getUserMedia`-/`MediaRecorder`-Zugriff, keine simulierte
Dateiliste. Blob-Speicherung in IndexedDB `boxbert-intros-v1`, Store `recordings`,
UID als Schlüssel. Kein Audio-Upload oder Kopieren auf SD. Browserformat,
keine automatische MP3-Konvertierung und kein Playback. Gerätemodus gesperrt.

## Prüfverfahren

Chromium verwendet für automatisierte Aufnahmetests ausschließlich
`--use-fake-ui-for-media-stream --use-fake-device-for-media-stream`.
Das Eingangssignal ist synthetisch; Recorder, Streams und IndexedDB sind echte
Browser-APIs. Das ist kein Hör-/Mikrofontest am Handy oder ESP.

Fehlerfälle (Berechtigung, Quota, verzögerte Freigabe, IDB-Fehler) werden gezielt
injiziert und separat von echter API-Persistenz geprüft. Aufnahmeabbruch,
Unmount und verspätete Freigabe dürfen keine weiterlaufenden Tracks oder
nachträglich gespeicherte Aufnahmen erzeugen. Reset muss Teilfehler explizit
anzeigen, nicht Atomarität über zwei Speicher behaupten.

## Tatsächlich ausgeführte Prüfungen

Release: https://habibi.supermittel.com/boxbert/?stand=rfid-record-6

- `npm test`: 46 Tests bestanden; unveränderte Legacy-Intro-Pfadtests prüfen
  weiterhin die Datenkompatibilität, nicht den neuen Aufnahmeweg.
- `tests/intro-browser.mjs`: lokal und gegen echtes Hosting bestanden.
  Reale MediaRecorder-/IndexedDB-API mit synthetischem Chromium-Mikrofon:
  gespeicherter Blob 4924 Bytes, `audio/webm;codecs=opus`, UID E3:2F:F6:33.
  Kein physischer Mikrofon-/Hörtest.
- Berechtigungsverweigerung, Quota, erfolgreicher Ersatz, Abbruch, unerwarteter
  Recorder-Stop, Reiterwechsel, verspätete Freigabe und verzögerter IDB-Write
  nach Unmount, Tracks `ended`, Löschen/Bestätigung, Reset und unsupported
  Controls bestanden. Fehlerfälle gezielt injiziert. Layout 320/390/1280 grün.
- Nach letztem Produktionsfix über `./build.sh boxbert` deployed; `curl -sI`
  ohne TLS-Ausnahme liefert HTTP/2 200. Bestehender npm-`allow-scripts`-Hinweis
  zu esbuild erschien, Build erfolgreich.
- Echte HTTPS-Aufnahme und neues Offline-Dokument unter `/boxbert/` bestanden;
  Blob dort aus IndexedDB lesbar: 5890 Bytes, `audio/webm;codecs=opus`, dieselbe
  UID und unveränderte Song-Zuordnung. Query-Release-Link beim Erstladen,
  Offline-Neustart unter tatsächlichem Basispfad.
- `tests/recording-reset-browser.mjs`: lokal und gegen echtes HTTPS bestanden.
  Fehlgeschlagener localStorage-Reset bewahrt Audio bytegenau, versucht keine
  IDB-Löschung und lässt den UI-/Reload-Stand korrekt. Blockierter/fehlender
  IDB-Zugriff verhindert nicht den Metadatenreset; Teilreset klar als Fehler
  gemeldet, Aufnahmen bleiben erhalten und nach Wiederzugriff sichtbar.
- TDD-Nachweis: Aufnahmebutton zunächst fehlend (Implementierer-RED),
  unerwarteter Recorder-Stop zunächst gesperrt, anschließend korrigiert.
  Parent-Resetregression zunächst rot: erwarteter Audio-Blob versus leere
  Liste nach Speicherfehler; nach Reihenfolge-/Teilfehlerkorrektur grün.
- `tests/local-browser.mjs`: HTTP-Vertragsfixture bestanden; Aufnahme/Löschen
  gesperrt, keine neue Geräte-API erfunden. Fixture bleibt kein ESP-Test.
- `npm run test:https`: bestehende HTTPS-/Offline-/Button-/LED-/RFID-Regression
  gegen echten Host bestanden, keine Console-/HTTP-Fehler oder ESP-API-Anfragen.

## Review

Statischer Security-Scan ohne Treffer. Unabhängiges Quellreview fand zwei
Resetfehler (Audioverlust vor localStorage-Fehler, IDB-Fehler blockiert Reset).
Fix-Agent scheiterte am Providerlimit (HTTP 429); Parent hat beide Fehler
minimal behoben und die echten Browserregressionen lokal und auf HTTPS
geprüft. Kein erneutes unabhängiges Review des Resetfixes erfolgt.

Nichtblockierender Reviewhinweis bleibt: Eine verspätet erfolgreiche
IndexedDB-Open-Anfrage nach `onblocked` sollte ihre Verbindung schließen.
Dies wurde nicht als normaler Browserfall nachgewiesen und hier nicht erweitert.
Zusätzliche Reviewempfehlungen bleiben offen: verzögerter Transaktionsabbruch
nach erfolgreichem put und Löschisolation bei zwei zugleich gespeicherten UIDs.

## Geräteintegration und Grenzen

Mikrofon verlangt einen Secure Context: HTTPS-PWA oder localhost beim Entwickeln,
nicht normale lokale HTTP-Auslieferung des ESP. Für Gerätebetrieb fehlen noch
Formatkonvertierung (aktueller Etappe-5-Vertrag akzeptiert nur `.mp3`),
HTTPS-PWA-zu-Gerät-Transport, SD-Speicherung und Intro-/Player-Schnittstellen.
Keine Garantie für sofortigen/nahtlosen Wechsel oder Flash-/RAM-Machbarkeit
einer Gesamtfirmware. Offline-Persistenz ist kein Geräte-/Audionachweis.

Referenzen:
- [MediaRecorder](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder)
- [getUserMedia / Secure Context und Berechtigung](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)
- [IndexedDB / Blobs und Same Origin](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)

Der vorherige Zuordnungs-Mock ist im
[historischen Prüfprotokoll](verification-intro.md) dokumentiert.
