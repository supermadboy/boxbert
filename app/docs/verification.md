# PWA-Prüfprotokoll — 11.10.2026

## Umfang und Ergebnis

Schlichte React-Verwaltung für eigene MP3: Dateiliste, Upload, zwei RFID-Zuordnungen, Lautstärke und NeoPixel-Vorschau. Extern eindeutig Demo, lokaler HTTP-Adapter ausschließlich für vorhandene Etappe-5-APIs. Keine Firmwareänderung, kein ESP angeschlossen, kein Flash, TFT, BLE oder OTA umgesetzt.

- `npm test`: 11 Tests, 11 bestanden, 0 fehlgeschlagen. Beide Builds, Uploadvalidierung, Persistence/Speicherfehler, HTTP-Vertrag/Auth, Fehler/Abort und bestätigte Writes.
- `npm run test:browser`: PASS. Demo-Upload, Zuordnung, Einstellungen, Reload-Persistence, Abbruch, SD-Fehler, Reset, mobile Darstellung ohne horizontales Scrollen, keine JS-Fehler.
- `node tests/local-browser.mjs`: PASS. Lokaler SD-Build gegen explizite HTTP-Testfixture: Basic Auth, Origin, Form/Multipart, 401/403/409/413/500, kein Demo-Fallback, Passwort nicht persistent, kein Service Worker.
- `npm run test:https`: PASS auf https://habibi.supermittel.com/boxbert/. HTTP 200, Manifest/Icons, Service Worker, Offline-Reload und neues Dokument im Offline-Modus, persistente Demo-Änderungen, Mobile/Desktop, keine ESP-API-Anfragen und keine JS-/HTTP-Fehler.
- `npm audit --omit=optional`: 0 vulnerabilities.
- `git diff --check`: keine Whitespacefehler.
- Mobile HTTPS-Offline-Vorschau tatsächlich angesehen: Demo-Kennzeichnung sichtbar, lesbar, keine sichtbaren Überlappungen.
- Unabhängige Read-only-Codeprüfung: bestanden, keine blockierenden Sicherheits- oder Logikfehler. Nichtblockierende Hinweise: Modus-Speicherwarnung kann beim Wechsel verdeckt werden; Hostingkopie ist nicht atomar. Browser-Testbefehle sind inzwischen getrennt dokumentiert.

Browserbefehle liefen mit `CHROMIUM_PATH=/nix/store/crfx5mjs2k6sdw45kbs9404h575mmwlk-playwright-chromium/chrome-linux64/chrome`. Dieser Pfad ist nur der lokale Prüfstand, kein dauerhaft gepinnter Buildbestandteil. Playwright-Standardbrowser fehlte zunächst, heruntergeladener Chrome scheiterte an `libnspr4.so`; vorhandener Nix-Browser funktionierte.

Der erste Offline-Test fand einen fehlenden Cacheeintrag für `/boxbert/`; korrigiert und auf der echten HTTPS-Seite erneut bestanden. Ein Testselektor für „Verhalten“ wurde auf dessen tatsächlichen zugänglichen Namen angepasst.

## Artefakte und Grenzen

`app/dist/` enthält den Hosted-Build, `app/dist-sd/` den relativen SD-Webbuild. Dauerhaftes Hostingartefakt: `ai-habibi/sites/boxbert/dist/`. Screenshots unter `app/test-results/` sind lokal generiert und ignoriert.

Demo-Uploads speichern nur Dateimetadaten, keine Audiodaten. Der HTTP-Contract-Test ist kein Nachweis am echten ESP. Aktuelle Firmware liefert weiterhin ihre eingebettete Minimal-Webseite; SD-Asset-Auslieferung muss erst implementiert werden. Lautstärke-/NeoPixel-/Status-API und BLE fehlen. Installation über Android-Chrome-Menü und echte Hardware-/Lasttests sind nicht durchgeführt. Details zur späteren Anbindung stehen in `app/README.md`.
