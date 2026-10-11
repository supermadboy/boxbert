# Boxbert-Verwaltung · React-PWA

Live: **https://habibi.supermittel.com/boxbert/**

Eine schlichte gemeinsame Oberfläche, ausschließlich für **eigene MP3**.
Kein Online-Soundkatalog, keine Downloads, kein Backend, keine Firmware-,
TFT- oder OTA-Änderungen. Ohne ESP vollständig als **sichtbare Simulation**
bedienbar. Der Quellcode liegt nur hier in `boxbert/app/`.

## Jetzt benutzen — Demo

1. HTTPS-Link öffnen. Oben steht immer **Demo · Simulation**.
2. Eigene `.mp3` auswählen → **MP3 hochladen**. In der Demo werden **nur
   Dateinamen** gespeichert; keine Audiodaten kopiert oder abgespielt.
3. Für einen der zwei bekannten Tags eine Datei wählen → Zuordnung speichern.
4. Lautstärke, Farbe, Helligkeit und Verhalten auswählen → Einstellungen speichern.
   Das ist nur Browser-Vorschau, keine echte Box-Steuerung und kein Sicherheitslimit.
5. Optional Musik aktiv / SD-Fehler / Verbindung verloren simulieren. Während
   des simulierten Transfers kann abgebrochen werden. Fehler erzeugen keinen
   erfolgreichen Eintrag. **Demo zurücksetzen** mit Bestätigung stellt alle
   Ausgangsdaten wieder her; reale SD-Dateien bleiben unberührt.

Demo-Modus, Dateimetadaten, Zuordnungen und Einstellungen bleiben in diesem
Browser (localStorage). Browserdaten können gelöscht werden; kein Backup und
keine Synchronisierung. Fehler bei beschädigtem/vollem Speicher werden sichtbar.
Reset setzt nur Demo-Daten zurück. Es gibt keinen heimlichen Demo-Fallback
nach einer gescheiterten Geräteanfrage.

## Grafische Demo-Button-Belegung & Regenbogen (11.10.2026)

- In **Demo-Soundbelegung** einen der zehn nummerierten Buttons anklicken:
  **1–4 links (30 mm), 5–8 in der Mitte (24 mm), 9–10 rechts (44 mm)**.
  Die Darstellung ist schematisch; kleine Displays stapeln die vier linken
  und mittleren Buttons jeweils senkrecht. Kein maßhaltiges Bohrbild.
- Die Auswahl zeigt die gespeicherte MP3. Vorhandene Demo-Datei oder
  **Unbelegt** wählen → **Button-Belegung speichern**. Auswahl allein
  speichert nichts. Beim Wechsel des Buttons werden ungespeicherte Entwürfe
  verworfen. Die Belegungen bleiben nach Reload; Demo-Reset leert alle zehn.
- Alle zehn sind ausdrücklich **nur in der Demo** belegbar. Das entscheidet
  weder Verkabelung noch echte Hardwarefunktionen. Eigenständige Soundbelegung,
  kein Ersatz für Play/Pause/Lautstärke. **RFID-Soundboard-Aktivierung ist
  weiterhin nicht gebaut**, ebenso wenig echtes Demo-Audio/Playback.
- **Regenbogen** im Verhalten-Dropdown zeigt acht verschiedenfarbige Pixel
  als bunte, statische Vorschau; Helligkeit wird berücksichtigt (0 = unsichtbar).
  Die Farbe bleibt für Statisch/Atmen erhalten. Einstellungen speichern und
  Reload erhalten den Modus. Keine reale NeoPixel-Ansteuerung.
- Im lokalen HTTP-Gerätemodus sind Button-Auswahl, MP3-Belegung und Speichern
  ausgegraut: **Button-API fehlt**. Es gibt keinen erfundenen `/buttons`-Request,
  keinen Speichererfolg und keine Übernahme der Demo-Belegung als Gerätedaten.
- Vorhandene gültige `boxbert-demo-v1`-Daten werden beim Lesen um zehn leere
  Buttons ergänzt; Dateien, Tags, Lautstärke und Pixel bleiben erhalten. Die
  nächste erfolgreiche Demo-Änderung persistiert den ergänzten Zustand.
  Beschädigte Daten melden weiterhin eine sichtbare Warnung statt stiller Migration.

Nachweise: [Prüfprotokoll Button-/Regenbogen-Erweiterung](docs/verification-buttons-rainbow.md).

## Tags umbenennen

In der RFID-Zuordnung einen Namen eingeben und **Name speichern** wählen.
Namen wie **Schleichstegosaurus** oder **Dino 🦕** bleiben nach Reload erhalten;
UID und MP3-Zuordnung ändern sich dabei nicht. Leer stellt Tag 1/2 wieder her.
Unicode ist erlaubt, UI-Grenze 80 Codepoints. Alte Demodaten erhalten Defaultnamen,
Dateien und bisherige Einstellungen bleiben erhalten.

**Aktuell nur Browser-Demo**, keine Speicherung auf SD. Im HTTP-Gerätemodus
sind Namensfelder deaktiviert, da der Firmware die Namens-/SD-API fehlt.
SD-Speicherung ist als spätere Anforderung im
[Erweiterungsprotokoll](docs/verification-buttons-rainbow.md) dokumentiert.

## Installation & Offline

HTTPS-PWA mit Manifest, eigenen 192/512-PNG-Icons und Service Worker. Nach
**Offline-Cache bereit** und erfolgreichem ersten Laden funktioniert die Demo
auch ohne Host/Internet. Browsermenü „App installieren“ / „Zum Startbildschirm“;
ein eigener Installieren-Knopf erscheint, wenn Chrome den Installationsdialog
anbietet. Browser-/Android-Menüinstallation nicht automatisiert auf einem echten
Handy getestet. Cache-Verlust/Erstbesuch erfordern Internet.

Nur statische Shell-Dateien werden gecacht, niemals Geräte-API, MP3-Uploads oder
Passwörter. Cache-Version aus Buildinhalten; ein neuer Worker wartet regulär auf
das Schließen alter App-Fenster, aktiviert danach den neuen Shell-Cache und
entfernt alte **Boxbert**-Shell-Caches. Andere Apps bleiben unberührt. Vor einem
Update Transfers beenden und alle Boxbert-Fenster schließen; neu online öffnen.
Normales lokales **HTTP auf dem ESP ist keine zugesagte Offline-PWA**.

## Bauen / testen

Node aus dem ai-habibi-Flake (`--no-update-lock-file`), vorhandener Node funktioniert:

```sh
cd /home/habibi/projects/boxbert/app
npm ci --no-audit --no-fund
npm test                     # Unit + API-Adapter + beide Build-Verträge
npm run build                # dist/ und dist-sd/
npx playwright install chromium
npm run test:browser          # Browser-Demo
node tests/local-browser.mjs # SD-Build gegen lokalen HTTP-Contract-Server
npm run test:https            # echte HTTPS-URL, PWA/Offline/Interaktionen
```

Tests verwenden Playwright. Bei vorhandenem System-/Nix-Browser:
`CHROMIUM_PATH=/absoluter/pfad/zu/chrome npm run test:browser` (auch `test:https`).
Dieser Testserver lauscht nur an 127.0.0.1 mit temporärem Port und wird geschlossen;
kein dauerhaft laufender Dienst. Der HTTP-Contract-Server ist ausdrücklich eine
**Testfixture**, kein ESP-Nachweis. Alle Ergebnisse: [Prüfprotokoll](docs/verification.md).

- `dist/`: Hosted Build mit Basis **/boxbert/**, PWA/SW.
- `dist-sd/`: SD-ready Build, **relative Assets**, vorgesehen unter **/**,
  ohne Manifest/SW. Initial **Lokale Box · HTTP / Nicht verbunden**;
  Demo wird nur ausdrücklich gewählt, und diese Wahl bleibt im Browser.
- `dist*` sind hier generierte/ignorierte Dateien. Das getrackte HTTPS-Artefakt
  liegt ausschließlich in `ai-habibi/sites/boxbert/dist`.
- Deployment: `/srv/ai-habibi/build.sh boxbert` baut diese Quelle und kopiert
  nur das Hostingartefakt. Kein zweiter App-Quellbaum.

## SD später integrieren — noch nicht auf dem ESP implementiert

Inhalt von `dist-sd/` später unter `/www/` auf die **gemountete** SD kopieren;
nicht `dist-sd` als zusätzlicher Pfad und nicht die Node-/React-Quellen kopieren.
Firmware muss `/` auf `/www/index.html` abbilden, Webassets mit richtigen MIME-
Typen aus dem Webordner streamen, `/files`, `/tags`, `/upload` getrennt bedienen
und beliebige SD-Pfade/Secrets/Traversal sperren. Musikdateien bleiben im
Kartenwurzelverzeichnis. Kein root-/SD-Mount wurde hier durchgeführt.

Die aktuelle Etappe-5-Firmware liefert ihr eingebettetes altes HTML und **nicht**
diesen SD-Webbuild. Einfach auf SD kopieren reicht daher noch nicht. Relative
Assets ermöglichen dieselbe Oberfläche unter der Box-Herkunft; API-Anfragen
bleiben absolut same-origin (`/files` etc.). Nach Firmware-Integration dort
öffnen, **Lokale Box (HTTP)** wählen, Box-Passwort eingeben und verbinden.

## API-Anbindung / ehrliche Grenzen

Quelle des existierenden Vertrags:
`firmware/tests/etappe5_web_upload/etappe5_web_upload.ino` (unverändert).

| Funktion | HTTP Etappe 5 | Demo |
|---|---|---|
| Dateiübersicht | `GET /files` → String-Pfade[] (keine Größen, max. 128 im Sketch) | simulierte Pfade |
| Zuordnung lesen | `GET /tags` → `{uid,path}[]`, zwei bekannte UIDs | dieselben zwei UIDs |
| Zuordnung ändern | `POST /tags`, URLSearchParams `uid,path` → `{ok:true}` | Browser-Persistenz |
| Upload | `POST /upload`, Multipart Feld `file` → `{ok:true}` | zeitgesteuerter Metadaten-Transfer |
| Tag umbenennen | **nicht verfügbar**, Namens-/SD-API fehlt | wiederholt änderbare Namen, UID stabil, Browser-Persistenz |
| Button-Soundbelegung | **nicht verfügbar**, kein Request/kein Erfolg | zehn stabile IDs, MP3 oder leer, Browser-Persistenz |
| Lautstärke/NeoPixel | **nicht verfügbar**, kein Request/kein Erfolg | persistente Simulation |
| Funk-/SD-/Audio-Status | **unbekannt**, keine Status-API | sichtbar simuliert |
| Löschen / Play / neue UID / Playlist / BLE | **nicht verfügbar** | nicht als Gerätefeature erfunden |

`HttpAdapter` in `src/adapters.mjs` validiert Antwortschemas, erwartet bestätigtes
`ok:true` bei Writes, kennt nur diese Routen. Spätere Adapter müssen denselben
Vertrag erfüllen (`read`, `assign`, `upload`, `settings`) und Fähigkeiten/Versionen
mit der künftigen Firmware abstimmen; **keine BLE-UUIDs erfunden**.

HTTP Basic: Benutzer **boxbert**, Passwort nur im App-Arbeitsspeicher für die
aktuelle Verbindung (nie localStorage, Cache, Repo). **Trennen** oder Reload
entfernt es aus der App. HTTP Basic über HTTP ist unverschlüsselt: nur im
vertrauten lokalen WLAN, keine Internetfreigabe. Firmware-Writes verlangen
exaktes `Origin: http://<Host>`; der Browser setzt Origin bei same-origin POST.
Keine externe Zieladresse eintragbar, kein CORS-/HTTPS→HTTP-Umgehungsversuch.
Extern zunächst Demo, BLE klar noch nicht implementiert.

Uploadgrenzen entsprechen dem Sketch: **max. 16 MiB**, nicht leer, Name 5–64
ASCII-Zeichen (A–Z/a–z/0–9/`-_.`), nicht mit Punkt beginnend, flach, **`.mp3`
kleingeschrieben**, kein Überschreiben. Name/Größe beweisen keine MP3-Decodierbarkeit.
Bei Musik aktiv, bestehender Datei oder blockierendem Temp-Upload kann **409**
kommen. Musik vorher an der echten Box stoppen (keine Stop-API vorhanden).
Fetch liefert keinen bestätigten Zwischenfortschritt; reales HTTP zeigt daher
unbestimmten Fortschritt bis Firmware-Bestätigung statt erfundener Prozentwerte.
Demo-Prozentwerte ausdrücklich simuliert.

401/403/409/413/500, Netzwerk, falsches JSON/Schema, Abbruch und 30-s-Zeitlimit
werden angezeigt. Nach einem echten Schreibabbruch/-fehler kann die Box schon
Daten geschrieben haben: **Gerätestand unklar**, Liste neu laden und SD/Temp-Datei
prüfen, nicht blind erneut senden. Keine Wiederaufnahme-/Rollback-/Integritäts-
oder Hardware-Erfolgsgarantie. Stale Daten nach Fehler sind keine aktuelle
Statusbestätigung; Verbindungsbadge wechselt auf Nicht verbunden.

Noch separat erforderlich: Firmware-SD-Hosting/MIME/Recovery, Fähigkeits-/Status-
und Lautstärke/NeoPixel-APIs samt Firmware-Limits, neue Tag-Erfassung/Playlists,
BLE-Protokoll/Autorisierung/Transferabbruch, Android-/ESP-Speicher-/Audio-/Last-
und Sicherheitsprüfung. Keine Firmware geflasht, kein TFT oder OTA gebaut.
