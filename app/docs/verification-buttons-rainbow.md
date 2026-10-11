# Prüfung Buttons, Regenbogen und Tag-Namen — 11.10.2026

## Ergebnis

Grafische Demo-Soundbelegung mit zehn stabilen Button-IDs: 1–4 links (30 mm), 5–8 Mitte (24 mm), 9–10 rechts (44 mm). Jede Belegung nimmt vorhandene Demo-MP3 oder leer an, wird explizit gespeichert und bleibt nach Reload erhalten. Reset leert alle zehn. Das Layout ist schematisch, kein Bohrplan oder Auftrag, alle zehn real anzuschließen.

Regenbogen ist eine statische Vorschau von acht verschiedenfarbigen NeoPixeln; Helligkeit 0–100 wird berücksichtigt. Die monochrome Farbe bleibt erhalten.

Tags sind frei und wiederholt umbenennbar (etwa Schleichstegosaurus, Dino 🦕). Die UID bleibt Identität, MP3-Zuordnung unverändert. Namen werden getrimmt und Unicode-NFC normalisiert; UI-Entwurfsgrenze 80 Unicode-Codepoints, keine behauptete Firmwaregrenze. Leer setzt Tag 1/2 zurück. Migration ergänzt Namen und Buttonfelder, ohne alte Dateien, Zuordnungen, Lautstärke oder Pixel zu löschen.

## Tatsächlich ausgeführte Prüfungen

- `npm test`: **26 Tests, 26 bestanden, 0 Fehler**. Beide Builds, Buttons, Namen, Migration, Speicher-/Fehlerfälle, Unicode/Grenzen und bestehender HTTP-Vertrag.
- `node tests/tag-names-browser.mjs`: PASS. Wiederholtes Umbenennen, Unicode, Reload-Persistence, unveränderte UID/MP3, mobile Breite.
- `npm run test:browser`: PASS. Alle zehn Buttons, Auswahl/Unbelegt/Reset/Persistence, v1-Migration, Regenbogen/Farbe/Helligkeit, Layout 320/390/1280 ohne Überlappung, bestehende Upload/RFID/Fehlertests.
- `node tests/local-browser.mjs`: PASS. Bestehende HTTP-Testfixture, Buttons ausgegraut, keine neue Geräteschnittstelle, Auth/Origin/Form/Multipart/Fehler unverändert. Kein echter ESP-Nachweis.
- `./build.sh boxbert`: beide Builds erstellt und Hosted-Build live; finale CSS-Hoverkorrektur enthalten. HTTPS HTTP 200.
- `npm run test:https`: PASS auf echtem HTTPS. Buttons, Regenbogen und Tag-Name offline gespeichert und nach neuem Offline-Dokument erhalten, Manifest/Icons/ServiceWorker, Mobile/Desktop, keine Geräteanfragen oder JS-/HTTP-Fehler.

Browser: vorhandener Nix-Chromium über `CHROMIUM_PATH`, wie im Grundgerüst-Protokoll. RED-Nachweise wurden vor Implementierung beobachtet; bei Namensintegration scheiterte zusätzlich die alte exakte Schemaerwartung im Migrationstest an den neuen Defaultnamen. Die Erwartung wurde ausdrücklich um Defaultnamen ergänzt, alle alten Felder bleiben geprüft.

Unabhängige Read-only-Codeprüfung bestanden, keine blockierenden Sicherheits-/Logikfehler. Den Layout-Hinweis für lange Namen korrigiert: Tag-Formulare einspaltig, Namen umbrechbar. Browser-Regressionscheck mit 80 ungetrennten Zeichen bei 390/1280 vor CSS-Fix fehlgeschlagen, danach bestanden. Unit-Tests und echte HTTPS-Offline-/Demo-Browserprüfung nach finalem Build erneut bestanden.

Firefox zeigte beim Nutzer noch die ältere gecachte Oberfläche. Ein URL-Query (`?stand=buttons-tags-2`) umgeht den Shell-Cache dieses Service Workers; Server/Bundleversion geprüft und Nutzer bestätigt neue Ansicht. Das löscht keine Demo-Daten. Updatekomfort bleibt zu verbessern; kein Firefox-BLE-Nachweis.

## Grenzen und spätere SD-Anbindung

Keine Firmware geändert oder geflasht; kein TFT, BLE, OTA, echtes Soundboard-Playback oder RFID-Aktivierung umgesetzt. Demo speichert Namen/Belegungen nur in localStorage und Uploads nur als Metadaten. Im HTTP-Modus sind Namensänderungen, Buttonbelegung und NeoPixel nicht verfügbar.

Für die spätere Firmware sollen Tag-Namen auf SD gespeichert werden, per UID zugeordnet und nach Neustart gelesen werden. Beispiel für einen **vorgeschlagenen, noch nicht implementierten** Konfigurationsdatensatz:

```json
{"version":1,"tags":[{"uid":"E3:2F:F6:33","name":"Schleichstegosaurus","path":"/arcade-music-loop.mp3"}]}
```

Dateipfad und API erst bei Firmwareintegration festlegen. Firmware muss Namen/UIDs/Pfade validieren, Schreibfehler und Stromunterbrechungen sicher behandeln und Speicherung erst nach tatsächlicher SD-Bestätigung melden. Bestehende NVS-Musikzuordnung nicht still migrieren oder überschreiben. Browsernamen nicht als SD-Daten ausgeben. Echte SD-/Neustart-/Lasttests bleiben offen.
