# Gesamtfirmware-Vertrag V1

Arbeitsvertrag für den freigegebenen Gesamtfirmware-Auftrag (19.10.2026).
BLE und WLAN, bestehende PWA-Funktionen einschließlich Intro, TFT V2,
Taster/Encoder, NeoPixel und Auto-Sleep. Kein Spotify, OTA, Soundkatalog
oder RFID-Spiel. Kein Flash/Hardware-Nachweis durch Softwaretests.

## Gemeinsame RPC

HTTP: authentifiziertes `POST /api/rpc`, JSON-Request `{id,op,args}`,
JSON-Antwort `{id,ok:true,result}` oder `{id,ok:false,error:{code,message}}`.
`id` positive Ganzzahl; `args` Objekt. HTTP Basic, Benutzer `boxbert`, nur
Same Origin im vertrauten lokalen WLAN. Keine Cross-Origin-Freigaben.
GET /api/status und alte Etappe-5-Endpunkte sind nicht der neue Vertrag.

BLE Service `6f786265-7274-4000-8000-000000000001`, RX Write
`6f786265-7274-4000-8000-000000000002`, TX Read/Notify
`6f786265-7274-4000-8000-000000000003`.
UTF-8-JSON als NDJSON; maximale Requestzeile 4096 Bytes, Response 24576 Bytes.
Client schreibt sequenzielle Chunks von höchstens 20 Bytes; Firmware liefert
Notify-Fragmente mit höchstens 20 Bytes. Jede vollständige Zeile endet in LF.
Nur eine RPC gleichzeitig. Notify-Versand darf Audio-Loop nicht blockieren.
Verbindung/Moduswechsel verwirft Parser, Session und unvollständigen Upload.
Keine Übertragung unendlicher Zeilen; Zeitlimits und begrenzte Queues.

BLE zunächst nur `hello` ohne Auth: result `{nonce}` (zufällige 32-Byte-Hexnonce).
`auth` args `{proof}`: HMAC-SHA256(Passwort-UTF8, Nonce-ASCII), Hexkleinschrift.
Nonce nur einmal verwenden; neue Verbindung = neue Auth. Keine Klartextpasswörter
über GATT. Das ist Zugriffsschutz, keine Zusage verschlüsselter BLE-Nutzdaten.
Kein Internetdienst, nur physisch vertrauenswürdige Umgebung.

## Operationen

- `read`: result `{files,tags,buttons,categories,volume,pixel,boardPixel,status}`.
  `files` flache `/name.mp3`-Pfade. Für jede gelistete MP3 liefert `categories`
  einen Wert; extern auf SD vorhandene Dateien ohne Metadaten erhalten `musik`
  in der Leseansicht, ohne einen ungefragten Schreibvorgang auszulösen.
  Gespeicherte Tag-/Button-Pfade dürfen auf inzwischen fehlende Dateien zeigen;
  solche Zuordnungen bleiben sichtbar und korrigierbar, sind aber nicht spielbar.
  Neue Mutationen dürfen weiterhin nur tatsächlich vorhandene Medien zuordnen.
  `tags` die zwei bekannten UIDs mit
  `{uid,name,path,introPath}`. `buttons` zehn `{id:1..10,path}`.
  `categories` Objekt Pfad -> `musik|sounds`. LED-Schema unverändert aus
  `app/src/led-effects.mjs`: color,brightness,palette,effect.
  `status`: `{playing,paused,path,tagUid,positionSeconds,durationSeconds,
  batteryPercent,batteryVoltage,radio,wifiConnected,ip,firmware}`.
  Fehlende Gauge-Werte sind null, keine erfundenen Messwerte.
- `assign`: `{uid,path}` vorhandene Datei.
- `renameTag`: `{uid,name}` bestehende Namenregeln; leer = Standardname.
- `assignIntro`: `{uid,path}` vorhandene Datei oder leer zum Entfernen.
- `assignButton`: `{id,path}` vorhandene Datei oder leer.
- `categorize`: `{path,category}`.
- `settings`: partielle `{volume,pixel,boardPixel}`; Validierung vor Speicherung.
- `play`: `{path}` vorhandene MP3; `pause`, `resume`, `stop`: `{}`.
- `uploadBegin`: `{name,size,category}` -> `{offset:0}`. Name 5–64 ASCII-Zeichen,
  Endung .mp3, kein führender Punkt, keine Pfade; 1..16777216 Bytes,
  kein Überschreiben; nur bei gestoppter Wiedergabe. Ein Upload zugleich.
- `uploadChunk`: `{offset,data}` Base64, maximal 384 dekodierte Bytes,
  exakter erwarteter Offset -> `{offset}` erst nach erfolgreichem SD-Schreiben.
- `uploadCommit`: `{}` prüft deklarierte Länge, schließt/speichert unter finalem
  Namen und persistiert Kategorie -> `{path,size}`. Erst danach Erfolg.
- `uploadAbort`: `{}` entfernt ausschließlich eigene unvollständige temporäre
  Datei, niemals vorhandene Nutzermusik. Timeout 30s, max Request-Inaktivität.

Mutationen result `{saved:true}` nach erfolgreicher Persistenz, Playerbefehle
`{accepted:true}`. Fehlercodes: `auth`, `invalid`, `busy`, `exists`, `sd`,
`offset`, `incomplete`, `unknown`, `timeout`. Keine stillen Demo-Fallbacks.
Konfiguration mit Schema/Revision auf SD; vor beschädigtem Bestand nicht still
Default zurückschreiben. Temporäre Config atomar ersetzen und Wiederanlauf
bei Stromausfall absichern. Auch leere Karte bootet ohne erfundene Dateien.

## Intro

Browseraufnahme lokal erhalten. Explizites Übertragen konvertiert lokal zu MP3
(kein externer Konvertierungsserver), lädt eindeutigen flachen MP3-Namen hoch
und setzt erst danach `introPath`. Entfernen der Gerätezuordnung löscht keine
Medien. Intro-EOF startet Song, Stop/Tagwechsel bricht die alte Kette ab.
Keine Zusage nahtloser Audioübergänge.

## UI / Bereitstellung

Demo bleibt getrennt und rückwärtskompatibel. Neues `DeviceAdapter` und
`BleTransport`/`HttpTransport` verwenden diesen Vertrag; alte `HttpAdapter`
bleibt als explizite Etappe-5-Referenz erhalten. Geräteschreiben ausdrücklich
sichtbar. SD-Build ohne Service Worker; externe HTTPS-PWA über BLE, kein
HTTPS-zu-HTTP-Versprechen. BLE nur nach Nutzeraktion, Disconnect als Fehler,
Zugangsdaten nicht in localStorage/IndexedDB speichern. Größere BLE-Uploads
haben längere Gesamtzeitlimits, aber bounded RPC-Zeitlimits und Abbrechen.
