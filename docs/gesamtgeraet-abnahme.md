# Gesamtgerät — reale Abnahme nach Softwarebuild

Dieser Ablauf ist **nicht ausgeführt**. Er ergänzt Host-, Browser- und
Crosscompile-Tests um die Nachweise, die nur die echte Box liefern kann.
Referenzsketche bleiben als Rückfall erhalten. Erst finalen Softwarestand
bauen, dessen Manifest sichern und genau diese Artefakte flashen, niemals ein
älteres Binary nach einem Compilefehler. Kein automatischer Flash im Build.

## Vorher

- Endaufbau gegen `hardware/verkabelung-endaufbau.md` und `firmware/Config.h`
  prüfen. Rails, I2C-Pegel, JST-Polung und gemeinsame Masse messen; SD und
  Stick am Boost, keine Button-LEDs. PN532 bleibt an 3V3, IO11 reserviert.
- USB und Akku vor jeder Verdrahtungsänderung trennen. Versorgungstests gemäß
  Endaufbauplan ausführen, Akku erst zuletzt. Nur vorhandene geprüfte Rails.
- SD-Inhalt und bestehende Konfiguration vorher extern sichern. Testdateien
  eindeutig benennen; keine Musik löschen/überschreiben. Genügend freien
  Kartenplatz vorsehen. SD-Webbuild unter dem dokumentierten Webverzeichnis.
- Werkzeuge auf Daddelberts Arch-Rechner installieren, USB-Port und `uucp`
  prüfen. Keine Geheimnisse in Git oder Releasepakete übernehmen.

## Boot, Bedienung und TFT

- Kaltstart ohne Tag; Fehleranzeige bei fehlender SD, kein Bootloop.
- TFT vollständiger 240×135-Inhalt, keine falschen Ränder; echte Akku-/
  Playerdaten, laufende V2-Figur nur beim Abspielen. Fehlendes Asset muss V1
  erlauben; fehlende Gauge darf keine erfundenen Akkuzahlen zeigen.
- Alle zehn UI-Button-IDs gegen echte Schalter prüfen, Entprellung, Encoder
  links/rechts/Taster und gehaltene Taster beim Boot. NFC-IRQ ist kein Button.
- Leise starten. Softwarevolume ist kein dB(A)-Nachweis; akustische Bewertung
  am fertigen Gehäuse separat, keine Maximaltests mit Kind im Raum.

## WLAN und BLE

- Boot-BLE, D0-Wechsel BLE → aus → WLAN → BLE; D0 beim Reset nicht halten.
- Musik läuft bei Funk aus weiter. Erfolgreiches Heim-WLAN und automatisch
  eigenes passwortgeschütztes WLAN bei unerreichbarem Heimnetz prüfen.
- HTTP-Webbuild von SD öffnen; externe HTTPS-PWA über Android Chrome per
  echtem Bluetooth-Chooser verbinden. Firefox-/iOS-Grenzen beachten.
- Falsches Passwort: alle Geräteoperationen abgelehnt. Verbindung trennen und
  neu aufbauen: vorherige BLE-Authentisierung/Nonce dürfen nicht weiter gelten.
- Namen, Zuordnungen, Kategorien, beide LED-Kanäle, Buttons und Lautstärke
  ändern; nach echtem Strom-Aus/Ein unverändert vorhanden. Im Browser keine
  Zugangsdaten persistiert, kein stiller Demomodus bei Funkverlust.
- Längere BLE-Übertragung mit Fortschritt, Abbruch, Verbindungsverlust und
  Moduswechsel prüfen. Durchsatz tatsächlich messen statt aus MTU abzuleiten.

## Audio, Intro und Persistenz

- Beide bekannten Tags; mindestens 20 kontrollierte Wechsel, unbekannter Tag
  unterbricht nichts, gleiches liegendes Tag startet nicht endlos neu.
- Entfernen, erneutes Auflegen und Liedende getrennt prüfen. Intro vollständig,
  danach zugehöriges Lied. Stop/Tagwechsel während Intro verwirft alte Kette.
- Echte Handyaufnahme hochladen, hörbar korrekt, Neustart behält Zuordnung.
  Gerätezuordnung entfernen: keine fremden Dateien gelöscht, Browseraufnahme
  weiterhin lokal vorhanden. Keine Zusage lückenloser Übergänge.
- Upload bei Wiedergabe abweisen; Stop ermöglicht Upload. Doppelte Namen,
  Pfadtraversal, leere/zu große Dateien, falscher Chunkoffset, Überlänge,
  unvollständiger Commit und SD-Schreibfehler dürfen keinen Erfolg melden.
- Abgebrochene Transfers hinterlassen keine sichtbare halbe MP3. Stromausfall
  während Konfigurationswechsel gezielt mit Sicherung prüfen: vorheriger oder
  neuer gültiger Stand, niemals kommentarlos zurückgesetzte Zuordnungen.

## Sleep und Last

- Fünf Minuten ohne Lied und Bedienung: sauber schlafen. Pausierte Wiedergabe
  entsprechend Softwarevertrag; aktive Aufnahme/Transfers schützen vor Sleep.
- Boost-Ausgang tatsächlich 0 V messen; Wake einzeln mit IO5 und IO6, kein
  sofortiger Wieder-Einschlaf-/Wake-Loop bei gehaltenem Taster.
- PN532 bleibt versorgt: kein µA-Gesamtsystemversprechen. Sleep-Strom und
  Akku-only-Spannung bei idle/playback erfassen, Hauptschalter separat prüfen.
- Audio mit NFC, Gauge, LED-Effekten, TFT und Funk gemeinsam betreiben;
  Fehlerzähler, Heap-/PSRAM-Minimum und Neustarts protokollieren.

Nachweis mit Datum, Buildmanifest, tatsächlicher Verkabelung, Serial-Rohlog
und Nutzer-Hör-/Bedienbeobachtung in `docs/` sichern. Nicht geprüfte Punkte
bleiben offen, ein Compile ist keine Hardwareabnahme.
