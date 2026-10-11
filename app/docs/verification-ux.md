# UX-Prüfprotokoll · 11.10.2026

Historischer Zwischenstand vor der erweiterten LED-Effektintegration.
Aktueller Stand und Release-Link: [LED-Effekt-Prüfprotokoll](verification-led-effects.md).
Die dort beschriebenen getrennten Paletten/Effekte ersetzen den hier noch
als eigenen Effekt beschriebenen Regenbogen.

## Ergebnis und Umfang

Autorisierte Browser-PWA-Erweiterung gebaut und unter
**https://habibi.supermittel.com/boxbert/?stand=ux-3** live geprüft.
Quelle ausschließlich `boxbert/app/`, Hostingartefakt
`/srv/ai-habibi/sites/boxbert/dist/`. Kein Commit/Push, kein Setup-/Dienstneustart,
keine Firmware-, GPIO-, Hardware- oder BLE-Änderung.

- Drei echte Reiter: Medienbibliothek / Zuordnung / LEDs; nur aktiver Inhalt
  gerendert. `tablist`, `tab`, `tabpanel`, `aria-selected`, `aria-controls`,
  Pfeiltasten/Home/End und Fokus geprüft.
- Sounds/Musik nur für MP3: Auswahl beim Demo-Upload, Filter, spätere Änderung
  und Persistenz. Keine WAV, kein echtes Audio, keine SD-Kategorisierungszusage.
- Altdaten erhalten Musik-Kategorien und einen ausgeschalteten Onboard-Pixel.
  UID, MP3-Pfade, Namen, zehn Buttonbelegungen, Lautstärke und `pixel` bleiben
  erhalten. `boardPixel` ist unabhängig. Jeder Kanal und Volume speichern separat.
- Acht Stick-Pixel und ein Onboard-Pixel: Aus/Statisch/Atmen/Regenbogen,
  unabhängige Farbe/Helligkeit. Regenbogen bleibt statische bunte Simulation.
- Fixed Lautstärke am Viewport-Boden, explizites Speichern, Demo 0–21;
  Safe-Area und Seitenabstand verhindern Überdeckung am Seitenende. Reset leert
  auch einen ungespeicherten Volume-Entwurf bei bereits gespeichertem Default 6.
- System-Dark/Light einschließlich Formularen, Icons und Demo-Grafik;
  `prefers-reduced-motion` berücksichtigt. Kein Theme-Schalter.
- HTTP: nur /files, /tags, /upload; Kategorien, beide LEDs, Lautstärke, Button-
  und Namensänderungen deaktiviert. HTTP-Test ist Fixture, kein echter ESP-Nachweis.

## Test-first-Nachweise

Vor Implementierung real rot ausgeführt, dann grün:

1. `tests/ux.test.mjs`: Kategorie-Migration erwartete Musik-Map, erhielt
   `undefined`; Upload nach Sounds erwartete `sounds`, erhielt `undefined`.
2. Separater Zweitkanal-Test erwartete ausgeschalteten `boardPixel`, erhielt
   `undefined`; nach Implementierung unabhängige Stick-/Onboard-Writes und Reload grün.
3. `tests/ux-browser.mjs`: erwartete 3 Tabs, erhielt 0. Nach UX-Implementierung
   Keyboard, Kategorien, Zweitkanal, Fixed-Bar und Systemthemes grün.
4. Kompakte Verbindung: erwartete geschlossene Details, erhielt `undefined`;
   nach Umsetzung Upload-Entwurf beim Reiterwechsel zunächst fälschlich aktiv,
   anschließend ausdrücklich verworfen und Test grün.
5. Volume-Reset-Regression: erwartete 6, erhielt Entwurf 9. Reset-Key korrigiert;
   lokale UX-Prüfung einschließlich Regression grün.

Bestehende Browserassertionen erhalten, echte Navigation über
`tests/navigation.mjs` ergänzt; Labels für Stick exakt, damit sie nicht auch
Onboard treffen. Keine künstlich versteckten Panels für alte Tests.

## Reale Abschlussläufe

`CHROMIUM_PATH=/nix/store/crfx5mjs2k6sdw45kbs9404h575mmwlk-playwright-chromium/chrome-linux64/chrome`

| Befehl | Ergebnis |
|---|---|
| `npm test` | 40/40 grün im aktuellen gemeinsamen Baum; 29 App-/Vertrags-/UX-Tests plus 11 zeitgleich vorhandene `led-effects`-Tests |
| `npm run test:browser` | PASS: zehn Buttons, Migration, Regenbogen, Upload/RFID, Persistenz, Abbruch, SD-Fehler, Reset |
| `node tests/local-browser.mjs` | PASS: HTTP Basic/Origin/Form/Multipart, 401/403/409/413/500, neue Controls deaktiviert, keine erfundenen API-Routen |
| `node tests/tag-names-browser.mjs` | PASS: wiederholte Namen, Unicode, UID/MP3 stabil, Reload, 80 Codepoints bei 390/1280 |
| `node tests/ux-browser.mjs` | PASS: inklusive Upload-Draft und Volume-Reset-Regression |
| `npm run test:https` | PASS: echte HTTPS-PWA, SW/Manifest/Icons, Offline-Reload und neues Dokument, zehn Buttons/Tag-Namen/Regenbogen |
| `BOXBERT_URL='https://habibi.supermittel.com/boxbert/?stand=ux-3' node tests/ux-browser.mjs` | PASS: neue UX auf echtem HTTPS, Offline-Kategorien/beide LED-Kanäle/Volume nach Reload und neuem Dokument |
| `/srv/ai-habibi/build.sh boxbert` | PASS: gepinnter Node v26.5.0/npm 11.17.0, Hosted + SD-ready gebaut, acht Hostingdateien live |
| `curl -sI https://habibi.supermittel.com/boxbert/?stand=ux-3` | HTTP/2 200 |
| `git diff --check` (Boxbert + Hostingpfade) | keine Whitespace-Fehler |

Roh-Ausgabe: `app/test-results/ux-verification.log` (generiert, git-ignored).
18 echte HTTPS-Screenshots: `app/test-results/ux-{320,390,1280}-{light,dark}-{media,mapping,leds}.png`.
Alle drei Reiter pro Größe/Theme ohne horizontales Overflow, Bar bei Anfang/Ende
per Position und `elementFromPoint` wirklich erreichbar, Footer oberhalb der Bar.
Screenshots 320 Dark LEDs und 390 Light Zuordnung zusätzlich tatsächlich angesehen:
kein abgeschnittener Regenbogen-Text mehr, lesbare Controls, Buttons ohne Überlappung.
Keine JS-Seitenfehler; HTTPS-Regression zusätzlich keine HTTP-Fehler/ESP-Requests.

Hosted und Source-`dist/index.html` identischer SHA-256:
`49dcd49514b69a8c1190c198d495c18e22e169dcb098fb9cbfafe5a56e0484b5`.

## Cache-Hilfe, reproduzierbar ohne Datenverlust

1. Online den Release-Link `?stand=ux-3` öffnen: neue Query umgeht die bereits
   gecachte kanonische Navigation. Drei Reiter sind der sichtbare Standcheck.
2. Transfers beenden und alle Boxbert-Tabs/installierten App-Fenster schließen,
   damit ein wartender neuer Worker regulär aktivieren kann; online neu öffnen.
3. Nach „Offline-Cache bereit“ die kanonische URL `/boxbert/` online öffnen.
   Diese URL ist die gecachte Offline-Shell. Danach sind Offline-Reload und
   Neustart in neuem Dokument geprüft.
4. Release-Queries sind ein **Online-Cache-Bypass**, nicht separat vorgecachet:
   ein Offline-Reload direkt auf `?stand=ux-3` ergab zunächst
   `ERR_INTERNET_DISCONNECTED`. Deshalb Offline-Prüfung explizit auf der
   kanonischen URL, nicht abgeschwächt oder als Query-Offline-Erfolg ausgegeben.
5. Nicht pauschal Website-Daten/localStorage löschen: das entfernt Demo-Namen,
   Zuordnungen und Einstellungen. SW-Aktivierungslogik nicht blind verändert.

## Offen / Grenzen

Nutzer-Look-and-feel-Abnahme, echte Handyinstallation, Firmware-SD-Hosting,
Kategorie-/Namens-/Volume-/LED-/Button-APIs und echter ESP-/SD-/Audio-/Sicherheitstest
bleiben offen. Kein Flash, kein physischer SD-Deploy. Build meldet vorhandene
npm-allow-scripts-Warnung für esbuild, Build und Browserprüfungen trotzdem erfolgreich.
Zeitgleich erschienene `src/led-effects.mjs`/zugehörige Tests wurden hier nicht
geändert oder als integriertes UI-Feature ausgegeben. Keine fremden Hermes-Dateien
geändert/staged; sämtliche Arbeit uncommitted für Parent-Review.
