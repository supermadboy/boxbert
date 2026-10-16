# TFT-Vorschau · Browser-Abnahme vom 16.10.2026

Release: https://habibi.supermittel.com/boxbert/?stand=tft-boxbert-8

## Umfang

Vierter Reiter **TFT-Vorschau** in derselben App. Ein dunkles 240×135-Display
mit Akku, Lautstärke, WLAN, Figur, Wiedergabestatus, Titel-Laufschrift,
Fortschrittsleiste und Spielzeit. Desktop vergrößert es auf doppelte Größe;
auf schmalen Geräten bleibt die logische Fläche vollständig sichtbar.
Boxbert besteht aus sechs CSS-3D-Seiten mit großen Augen, Blinzeln, Wippen
und sanftem Drehen. Keine externen Grafik-/3D-Abhängigkeiten.

Alles sind ausdrücklich **Beispieldaten**. Play/Pause und Zeitleiste simulieren
nur die Anzeige, ohne Ton. Akku 78 %, Lautstärke 35 % und WLAN verbunden sind
feste Beispiele und unabhängig von der globalen Demo-Lautstärke.
Zwei Beispieltitel, keine Speicherung/Änderung bestehender App-Daten.

## Tatsächlich ausgeführte Prüfungen

- `npm test`: **47 Tests bestanden, 0 fehlgeschlagen**, einschließlich beider
  Builds (Hosted mit SW, relativer SD-Build ohne SW).
- `tests/tft-browser.mjs` lokal und gegen echtes HTTPS bestanden: vollständige
  Inhalte innerhalb des TFT, logische Pixelmaße, 6-Flächen-Körper,
  Play/Pause, Zeitfortschritt, Seek, Titelwechsel, Laufschrift, Reduced Motion,
  Light/Dark und 320/390/1280 px sowie Tastaturnavigation über alle vier Reiter.
- `tests/ux-browser.mjs` gegen echtes HTTPS bestanden: bestehende MP3-/Kategorie-/
  Zuordnungs-/LED-/Lautstärkeabläufe, vier Reiter, Fixed-Bar-Trefferfläche und
  Inhaltsabstand an beiden Scrollenden, sechs Theme-/Breitenkombinationen,
  Offline-Persistenz nach Reload und neuem Dokument.
- `npm run test:https` bestanden: bestehende Demo einschließlich zehn Buttons,
  RFID-Namen/-Zuordnung, Regenbogen, Manifest/Icons und Offline-Neustart.
- `tests/tft-hosted-browser.mjs` gegen echtes HTTPS bestanden: Screenshot der
  tatsächlichen ausgelieferten App und Displayfläche, veränderter gerenderter
  3D-Transform nach 2,8 Sekunden, TFT-Reiter nach komplett neuem Offline-Dokument,
  keine JS-/HTTP-Fehler und keine ESP-API-Requests.
- `git diff --check` ohne Befund.

Screenshots: [Display](tft-ui/display-dark.png),
[Handy](tft-ui/preview-mobile-dark.png),
[Desktop](tft-ui/preview-desktop-dark.png).

## Testumgebung und überwundene Blocker

Playwright 1.56.1 kann auf diesem Ubuntu-26.04-Host seinen Chromium nicht
regulär installieren (`does not support chromium on ubuntu26.04-x64`).
Ein heruntergeladenes Ubuntu-Binary scheiterte außerdem an fehlenden Host-Libs;
der Browser ohne eingerichtete Fonts stürzte ab. Verwendet wurde stattdessen
Chromium 150.0.7871.186 aus dem **bestehenden gepinnten nixpkgs-Input**, ohne
Änderung der Flake/Lockfile, mit temporärer Fontconfig für vorhandene DejaVu-Fonts.
Browser-Tempdateien liegen wegen des knappen `/tmp` unter dem Benutzer-Cache.
Ein anfänglicher `ERR_INSUFFICIENT_RESOURCES` und ein vorzeitiger UX-Timeout
sind keine grünen Tests; die oben aufgeführten finalen HTTPS-Läufe liefen danach
erfolgreich durch.

Für Wiederholungen einen funktionsfähigen Browser samt Fontconfig bereitstellen:

```sh
CHROMIUM_PATH=/path/to/chromium \
  BOXBERT_URL='https://habibi.supermittel.com/boxbert/?stand=tft-boxbert-8' \
  node tests/tft-browser.mjs
CHROMIUM_PATH=/path/to/chromium node tests/tft-hosted-browser.mjs
```

## Grenzen

Keine Firmware, kein Flash, keine echte TFT-Ausgabe, keine Gerätedaten, kein
Ton, kein Performance-/Lesbarkeitsnachweis am eingebauten Display. CSS-3D im
Browser beweist keine ESP-Renderfähigkeit. Hardwareintegration und Designfeedback
bleiben offen. Bei Reduced Motion sind Maskottchen und Laufschrift statisch;
der Titel lässt sich dann manuell horizontal scrollen. Ein frischer Browserlauf
beweist nicht das Update jedes bereits installierten Service Workers. Der
Release-Query wird vom vorhandenen Worker ausdrücklich nicht gecacht und lädt
online den neuen Stand, ohne Browserdaten zu löschen.
