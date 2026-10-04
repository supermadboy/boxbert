# Etappe 5 — WLAN, Upload, Tag-Zuordnung

## Abschluss — BESTANDEN als Breadboard-Meilenstein, 04.10.2026

Nutzer bestaetigt Handy-Webseite/Dateiliste, Upload, Zuweisung und
hoerbare Wiedergabe sowie nach RESET **beides**: Zuordnung bleibt
bestehen und derselbe Tag spielt die neu zugewiesene MP3 ohne erneutes
Zuordnen. Damit ist der vereinbarte Etappe-5-Happy-Path abgenommen.
Aktuell geflasht: `firmware/tests/etappe5_web_upload/` (Arduino-Core
3.3.12, WLAN-Station, `boxbert.local` bzw. IP, SD 4 MHz, NFC I2C,
Volume 6/21); **nur USB, Akku ab**. Etappe-4-Player bleibt als
unveraenderte Referenz im Repo, nicht mehr auf dem Board. Lokale
`Secrets.h` ist git-ignored, Zugangsdaten nicht in Doku/Logs notiert.

**Keine Produkt-/Dauerabnahme:** Weder paralleler Upload bei Audio,
Fehler-/Abbruchfaelle, beliebige Tags noch langer NFC-/WLAN-Lasttest
wurden nachgewiesen. Sync-Webserver kann Audio bei Upload blockieren;
Uploads bisher nur bei idle Musik freigegeben. HTTP Basic Auth laeuft
unverschluesselt: nur im vertrauenswuerdigen lokalen WLAN, nie per
Port-Forwarding ins Internet. mDNS-Komfort im Serial initialisiert;
ob der Handy-Zugriff per `.local` oder IP erfolgte, nicht getrennt
protokolliert. Diese Punkte sind **spaetere Haertung**, keine offenen
Bedingungen der Breadboard-Abnahme.

## Vorbereitung und chronologischer Live-Test

Etappe-4-Player bleibt unveraendert. Neuer isolierter Sketch:
`firmware/tests/etappe5_web_upload/`.

## Festgelegter Umfang

- Arduino-Core 3.3.12 wie Etappe 4; 2,4-GHz-Station im vorhandenen WLAN,
  kein eigenes AP, kein BLE, keine React-PWA in dieser Etappe.
- Lokaler HTTP-Server: `GET /`, `GET /files`, `GET /tags`, `POST /upload`,
  `POST /tags`. Einfache Handy-Webseite wird direkt aus dem Sketch bedient.
- **Nur die zwei bereits bestaetigten UIDs** koennen neu zugeordnet werden;
  weitere Tags hinzufuegen, Tag beschreiben, Loeschen/Umbenennen von Dateien
  und beliebige SD-Verzeichnisse sind bewusst nicht implementiert.
- Tag-Zuordnungen liegen in NVS (`boxbert-tags`, `tag0`/`tag1`); bei leerem
  NVS gelten die zwei bekannten Etappe-4-Pfade. Ein fehlender Pfad startet
  **kein** anderes Lied. NVS-Loeschung/Flash-Erase kann Zuordnungen loeschen.
- MP3-Upload nur bei idle Audio, flacher ASCII-Name max. 64 Zeichen,
  `.mp3`, max. 16 MiB; keine bestehenden Dateien ueberschreiben. Empfang
  in `/.boxbert-upload.tmp`, erst nach vollstaendigem Upload umbenennen.
  Existiert die Temp-Datei nach Stromausfall, wird sie **nicht** automatisch
  entfernt: SD am PC pruefen und gezielt bereinigen.
- Dateiendung/Dateigroesse belegen **keinen** gueltigen MP3-Stream; noch
  kein Transcoding/Dateiintegritaetstest. Keine Produktfreigabe.
- Passwortschutz via HTTP Basic Auth (`boxbert` + lokales Passwort),
  Schreibrequests erfordern same-origin. **HTTP ist nicht verschluesselt:**
  ausschliesslich in vertrauenswuerdigem WLAN benutzen, kein Port-Forwarding,
  kein Gastnetz, kein Internet-Zugriff. Kein dauerhaft eingebautes Geheimnis.
  `Secrets.h` mit WLAN-/Web-Passwort bleibt lokal und git-ignored.

## Vorbereitung / Compile (ohne Flash)

Beispieldatei `Secrets.example.h` nach `Secrets.h` im selben Ordner kopieren,
Platzhalter **lokal** durch eigene 2,4-GHz-WLAN-Daten und ein langes,
einmaliges Web-Passwort ersetzen. Keine Passwoerter in Chat, Log oder Git
schreiben. Ohne `Secrets.h` scheitert der Compile absichtlich. Test-Compile
mit reinen Platzhalterwerten erfolgreich (04.10.2026):

```
arduino-cli compile --fqbn esp32:esp32:adafruit_feather_esp32s3_reversetft firmware/tests/etappe5_web_upload
```

Build: 2 097 119 B Flash (72 % von 2 883 584 B), 94 012 B globale
Variablen (28 % von 327 680 B). Board-Defaults/QSPI; **nicht geflasht**.
Host-Test `firmware/host-tests/etappe5_tag_map_test.cpp` mit g++
C++17 `-Wall -Wextra -Werror` bestanden (beide UIDs, unbekannte UID,
Laengen/Null). Keine Netzwerk-/SD-/Audio-Laufzeittests.

Nach Nutzerhinweis „Zugangsdaten bereit“: `Secrets.h` vorhanden und
ignoriert (Inhalt nicht gelesen/ausgegeben). Etappe 5 mit lokaler Datei
nochmals frisch erfolgreich kompiliert: 2 097 087 B Flash, 94 012 B
globale Variablen, Build `/tmp/boxbert-etappe5.zBksVY`.
`/dev/ttyACM0` sichtbar. Nutzer hat USB-only, Akku ab und bestehende
SD-/NFC-/Audio-Verkabelung mit „yes“ bestaetigt. Daraufhin dasselbe frisch
kompilierte Binary nach `/dev/ttyACM0` geflasht: esptool v5.3.1 meldet
fuer alle geschriebenen Images **Hash verifiziert**, Port nach Reset
wieder `/dev/ttyACM0` (04.10.2026). Keine Firmwareaenderung danach.

Erster `arduino-cli monitor` lieferte 0 B; passives 15-s-Serial per
`stty` + `dd` lieferte ca. 1,5 KB (Rohlog
`/tmp/boxbert-etappe5-serial-second.log`, temporaer). Darin
`WLAN=an`, `NFC=ok`, beide bekannten Song-Dateien als Audio-Stream
initialisiert, `STARTS=2→3`, `ERRORS=0`, Wechsel-Log TAG1;
konkrete Tagbewegung und Hoerbefund nicht protokolliert. Boot-IP beim
Mitschnitt bereits vorbei, **Webseite/Upload noch nicht geprueft**.
Keine Produkt-/Breadboard-Abnahme aus dem Serial-Ausschnitt ableiten.

Nach Nutzerfrage zur merkbaren Adresse: mDNS `boxbert.local` mit
`ESPmDNS.h`, `MDNS.begin("boxbert")`, `_http._tcp:80` nach WLAN-Connect
ergänzt; DHCP-Hostname `boxbert` gesetzt. API gegen das installierte
Core-3.3.12-Beispiel `ESPmDNS/examples/mDNS_Web_Server` geprüft.
Neu gebaut mit privater (nicht gelesener) `Secrets.h`:
2 132 875 B Flash / 96 444 B globale Variablen,
Build `/tmp/boxbert-etappe5-mdns.zJbkVi`. Zweiter Upload auf
`/dev/ttyACM0` erfolgreich, **alle fünf Images hash-verifiziert**,
Port wieder da. IP-Fallback bleibt; mDNS und Webseite am Handy noch
**nicht** getestet. `getent`/`curl` von diesem PC auf `boxbert.local`
loesten bislang nicht auf. Diagnose nach Nutzerbefund „address unreachable“:
PC hat Ethernet `192.168.0.36/24` und keinen laufenden Avahi-Daemon;
Box-Serial nach einem **dritten, nur um wiederholte IP-/mDNS-Statusausgabe
ergaenzten Compile/Upload**: `WLAN=an IP=192.168.28.186 MDNS=an`,
`NFC=ok`, `ERRORS=0`. Build
`/tmp/boxbert-etappe5-ip.GSbRWK` (2 133 003 B Flash,
96 444 B global), Upload-Hashes fuenfmal verifiziert. PC-Zugriff
auf `http://192.168.28.186/files` timed out; PC und Box sind damit
**auf verschiedenen IPv4-Subnetzen** (0/24 vs. 28.x; Routing/Isolation
ungeklaert). `MDNS=an` beweist nur lokale Initialisierung, nicht
Erreichbarkeit vom Handy. Handy-IP/Netz und direkte IP-URL noch pruefen.

Nutzer meldet Umstellung auf das PC-Netz und bittet um erneutes
Compile/Flash (erster Build wurde unterbrochen, **nicht** geflasht).
Zweiter Build `/tmp/boxbert-etappe5-samenet.l2Lxy7` erfolgreich:
2 133 003 B Flash / 96 444 B global. Upload aller fuenf Images auf
`/dev/ttyACM0` verifiziert. **Danach mehrfach Serial:**
`NFC=ok`, `ERRORS=0`, aber `WLAN=aus IP=0.0.0.0 MDNS=aus` ueber
mindestens ca. 28 s. Kein HTTP-Test moeglich. Ursache ungeklaert:
Zugangsdaten nicht gelesen, keine SSID-/WPA-Diagnose und kein Nachweis,
ob neues WLAN fuer ESP32-S3 auf 2,4 GHz sichtbar ist. Nutzer lokal
SSID/Passwort/2,4 GHz pruefen lassen, nicht Passwoerter erfragen.

Nutzer meldet korrigiertes Passwort (keine Secret-Werte eingesehen).
Frisch kompiliert mit privater `Secrets.h`:
`/tmp/boxbert-etappe5-pwfix.LCcpKt`, 2 133 003 B Flash /
96 444 B global; danach alle fuenf Flash-Images hash-verifiziert.
Serial: **`WLAN=an IP=192.168.0.186 MDNS=an`, `NFC=ok`,
`ERRORS=0`**. PC `192.168.0.36/24`, HTTP-Aufruf direkt von dort:
`GET /`, `/files`, `/tags` geben ohne Zugangsdaten jeweils erwartetes
**401**, `/not-found` **404**. So sind IP-Routing, Serverantwort und
HTTP-Auth-Abfrage nachgewiesen, **nicht** Anmeldung, Dateiliste,
Upload oder Persistenz. mDNS selbst auf Handy weiter ungetestet;
auf PC ist Avahi-Daemon nicht aktiv.

Nutzer meldet nach Aufforderung, die Handy-Webseite mit `boxbert`
und Web-Passwort aufzurufen und Dateiliste zu pruefen: **„ok klappt
super“**. Damit Browserzugriff laut Nutzer bestaetigt; exakte
Dateinamen und rohe /files-/tags-Antwort nicht separat protokolliert.

Im naechsten Schritt bestaetigt Nutzer: **„upload klappt zuweisung auch
und abspielen dann auch“**. Also Upload, Zuweisung und hoerbare
Wiedergabe des zugewiesenen Liedes am aktuellen Aufbau laut Nutzer
bestanden. Name/Groesse der neuen MP3, verwendete UID, Upload-Dauer,
Audioqualitaet und Fehlerzaehler zu diesem Test nicht gemessen; keine
Norm- oder Stresstest-Aussage. Zu diesem Zeitpunkt **noch nicht nach Neustart geprueft:**
NVS-Persistenz. Kurzer passiver Serial-Schnappschuss nach Nutzertest:
`NFC=ok READS=11 SWITCHES=3 STARTS=4 ERRORS=0 AUDIO=aus
WLAN=an IP=192.168.0.186 MDNS=an` (kein vollstaendiger Mitschnitt
aller Starts; Starts nicht einzeln dem Upload zuordnen). Gezielter
Folgetest: Tag entfernen, RESET (USB bleibt), auf Weboberflaeche
gleiche Zuordnung sehen und dann denselben Tag auflegen; ohne
Flash/Neu-Zuweisung. Nutzer meldet nach der angeforderten Testfolge:
**„behalet zuordnung super“**. Damit Zuordnung nach Neustart laut
Nutzer weiter sichtbar/erhalten; erneute hoerbare Wiedergabe war
**zu diesem Zeitpunkt noch nicht explizit bestaetigt**. Nutzer bestaetigt
anschliessend auf Nachfrage: **„beides“** (Zuordnung und Abspielen
nach RESET). Keine neuen Flash-Aktionen.

## Abnahme-Checkliste (Happy-Path bestanden; Haertung offen)

- [x] Vor Flash USB-only, Akku ab, bestehende Verdrahtung/SD/Audio bestaetigt;
      Etappe-4-Sketch bleibt im Repo als Rueckfallweg. Nur frisch kompiliertes
      Etappe-5-Binary geflasht; Hashes verifiziert. Kein Passwort protokolliert.
- [x] Serial bestaetigt WLAN/IP/mDNS/NFC; Handy erreicht Seite mit
      Passwortabfrage. Vollstaendiger Boot-Mitschnitt nicht protokolliert.
- [x] Nutzer bestaetigt Browserzugriff/Dateiliste; kein separater API-Rohlog.
- [ ] `/tags`: zwei UIDs/Pfade und beide Original-Lieder nach Neu-Flash
      separat pruefen (Volume fest 6/21).
- [x] Nutzer bestaetigt Upload, Tag-Zuweisung und Wiedergabe (Dateiname,
      Groesse und UID nicht protokolliert).
- [ ] Fehlertests noch offen: doppelter/ungueltiger Name, Upload-Abbruch
      und Groessenlimit; Originaldateien intakt. Upload waehrend Audio
      **zunaechst nur mit kleiner Datei** pruefen: selbst eine abgelehnte
      Anfrage kann im synchronen Server den Audio-Loop kurz blockieren.
- [x] Zuordnung nach RESET laut Nutzer erhalten **und** neue MP3 durch
      denselben Tag erneut abgespielt, ohne Neu-Zuweisung.
- [ ] Unbekannter Tag startet kein Lied (noch kein physischer Test).
- [ ] Laengere Audio-/NFC-/WLAN-Last und Wechsel testen; kontrollierte
      Wechsel/Minutenlast sind noch keine belegten Ergebnisse.

**Grenze der ersten Architektur:** synchroner Core-WebServer kann bei einem
Upload laenger im `handleClient()` bleiben. Daher Upload nur wenn Audio idle;
NFC-Task bleibt getrennt, letztes Wechselereignis bleibt in einer 1er-Queue.
Waehrend eines Uploads koennen Zwischen-Wechsel verloren gehen, und ein
Tagwechsel wird ggf. erst nach dem Upload verarbeitet. Das muss am Aufbau
beobachtet werden, bevor wir von gleichzeitigem Betrieb sprechen.
