# Intro je RFID

## Beschreibung

Ein eigenes aufgenommenes Intro pro RFID-Figur soll vor dem zugeordneten Song
abgespielt werden. Daddelberts Hauptidee ist, die Startverzögerung zu überbrücken:
kurzes Intro (beispielsweise 4–10 Sekunden), während der eigentliche Song
vorbereitet wird. Die Dauer richtet sich nach der Aufnahme, kein festes Limit
von fünf Sekunden.

## Freigegebener Umfang · 11.10.2026

Daddelberts Korrektur: **direkt je Tag aufnehmen und dort speichern**, keine
Dateiauswahl aus der Bibliothek. Eine zusätzliche Löschen-Taste entfernt nur
die Aufnahme dieses Tags, niemals Tag oder Song-Zuordnung.

Reale Mikrofonaufnahme in der HTTPS-PWA mit Browser-Berechtigung. Aufnahme
stoppen und speichern; Browser-Speicherung pro UID in IndexedDB. Keine
Server-/SD-Speicherung, keine Aufnahme auf dem ESP und keine automatische
Intro-/Song-Wiedergabe. Browserformate sind nicht automatisch MP3; eine spätere
Geräteintegration benötigt einen passenden Konvertierungs-/Decoderweg.

Vorherige Bibliothekszuordnung ist ein überholter Zwischenstand. Bestehende
Song-/Namens-/LED-/Button-Daten bleiben erhalten; alte Intro-Pfadmetadaten
werden nicht als Mikrofonaufnahmen ausgegeben.

## Geprüfter Browser-Teilumfang

Aufnahme, Blob-Persistenz, Reload, Lösch-/Abbruch-/Resetfehler und echter
HTTPS-Offline-Neustart wurden mit synthetischem Chromium-Testmikrofon geprüft.
Kein Handy-Mikrofon-, Hör- oder ESP-Test. Nachweis im Aufnahme-Prüfprotokoll.

## Geräteintegration — wiederverwendbar, noch nicht nachgewiesen

Die taggebundene Aufnahmeoberfläche und UID-Zuordnung bleiben für den späteren
Gerätebetrieb nutzbar. Browser-Speicherung ist ein lokaler Zwischenspeicher,
kein Ersatz für SD-/Gerätespeicherung. Der Geräteweg benötigt noch:

1. Browseraufnahme in ein unterstütztes Format konvertieren. Aktuelle Firmware
   akzeptiert ausschließlich MP3; Browser-WebM/Opus oder MP4/AAC nicht einfach
   mit einer `.mp3`-Endung hochladen. Kein Konvertierungsweg implementiert.
2. Aufnahme auf SD übertragen, Intro-Pfad je UID am Gerät speichern/löschen.
   Die existierenden `/upload`-/`/tags`-Routen haben noch keinen Intro-Vertrag.
3. Intro und anschließenden Song im Player abarbeiten; echtes Timing messen.
   Parallele Song-Vorbereitung ist keine bereits nachgewiesene Library-Funktion.

Mikrofonzugriff benötigt einen Secure Context: normale lokale HTTP-WebUI
auf dem ESP reicht nicht. Aufnahme über die HTTPS-PWA; der anschließende
HTTPS-PWA-zu-Gerät-Transport ist weiterhin separat umzusetzen und zu prüfen.

Bedienoberfläche, Transport/Format und ESP-Wiedergabe sind getrennte Bausteine.
Keine Plug-and-play- oder Gesamtmachbarkeitszusage ohne integrierten Build und
Hardwaretest; besonders „instant/seamless“ bleibt ein offener Nachweis.

## Noch umzusetzen / prüfen

- Echte Intro-Wiedergabe am Gerät, SD-Speicherung und Intro-API fehlen.
- SD-Musik wird gestreamt, nicht komplett in Flash geladen. Liedlänge allein
  erklärt die Startverzögerung nicht; tatsächliche Ursachen am ESP messen.
- Ein Intro allein garantiert keinen nahtlosen Übergang. Vorbereiten des Songs
  während der Intro-Wiedergabe und schnelle Intro-Bereitstellung erst entwerfen,
  mit bestehender Audio-Bibliothek prüfen und auf Hardware messen.
- Tagwechsel, Intro-Abbruch, wiederholtes Auflegen und Fehlerverhalten auf dem
  ESP später festlegen. Keine Garantie für „instant“ oder „seamless“ aus der PWA.

## Entscheidungen und Nachweise

Aufnahme-Prüfverfahren und Grenzen: [Aufnahme-Prüfprotokoll](../../app/docs/verification-recording.md).
Vorheriger Zuordnungs-Mock: [historisches Intro-Prüfprotokoll](../../app/docs/verification-intro.md).
Verbindliche Tags: [NFC-Zuordnung](../../hardware/nfc-tags.md).
