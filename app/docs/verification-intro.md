# Prüfung: optionale Intro-Zuordnung · 11.10.2026

Aktueller Release: https://habibi.supermittel.com/boxbert/?stand=rfid-intro-5

## Umfang

Pro bekannter RFID eine vorhandene MP3 als optionales Intro zuordnen oder
„Kein Intro“ wählen. Separat speichern; Song bleibt unabhängig. Nur Mock:
localStorage im Browser, keine Audiodaten, kein Server-Speicher, keine
Wiedergabe, kein neuer Firmware-Endpunkt. HTTP-Controls deaktiviert.

## Tatsächlich ausgeführte Prüfungen

- `npm test`: 46 Tests bestanden, darunter vier Intro-Tests (Persistenz,
  leere Intros/Migration, Validierung/Fehler/Quota, HTTP ohne Request).
- TDD: erster Test scheiterte vor Implementierung an fehlendem `assignIntro`;
  Migration/Validierung und HTTP-Verweigerung ebenfalls zunächst rot.
- Lokaler `tests/intro-browser.mjs`: Speichern, Reload, Deaktivieren, unveränderte
  Song-/zweite Tag-Zuordnung, Verwerfen beim Reiterwechsel, Reset eines
  ungespeicherten Entwurfs und Layout 320/390/1280 bestanden.
- Reset-Test war zunächst rot (Intro-Entwurf blieb stehen, obwohl gespeicherter
  Wert bereits leer war). TagRow wird bei Demo-Reset neu initialisiert; derselbe
  Browserfall danach grün.
- `./build.sh boxbert`: beide Builds erzeugt, Hostingartefakt deployed.
  npm meldet bestehenden `allow-scripts`-Hinweis zu esbuild; Build erfolgreich.
- Nach letzter Produktionsänderung gegen echtes HTTPS: `BOXBERT_URL=...`
  mit `tests/intro-browser.mjs` bestanden, einschließlich neuem Offline-Dokument
  unter `/boxbert/` mit gespeicherter Intro-Zuordnung.
- `tests/local-browser.mjs`: echter HTTP-Vertragsfixture-Test bestanden;
  Intro-Auswahl und Speichern nach Verbindung deaktiviert, nur vorhandene API-Routen.
  Fixture ist kein ESP-Nachweis.
- `npm run test:https`: vorhandene HTTPS-/Offline-/RFID-/LED-/Button-Regression
  bestanden; keine Console-/HTTP-Fehler und keine ESP-Requests.
- `npm run test:browser`: bestehende lokale Demo-Regression bestanden.

## Grenzen

Kein Audio oder physischer Tagwechsel getestet. Keine garantierte Intro-Dauer,
sofortige Wiedergabe oder nahtloser Übergang. Firmware-Vorbereitung des Songs
während des Intros, SD-Speicherung und echte Audio-/Timingtests stehen aus.
Ältere Prüfprotokolle beschreiben die jeweiligen früheren Teilstände.
