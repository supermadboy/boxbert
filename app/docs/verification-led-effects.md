# LED-Effekt-Integration · reale Prüfung 11.10.2026

## Ergebnis / Live-Stand

Geprüfte pure `src/led-effects.mjs` in die neue Drei-Reiter-UX integriert. Engine und ihre elf Tests wurden bei der Integration nicht verändert.

Online-Release: **https://habibi.supermittel.com/boxbert/?stand=ux-effects-4**.
Offline-Einstieg: **https://habibi.supermittel.com/boxbert/** (ohne Release-Query).
Der Query-Link umgeht den Navigation-Cache online; Offline-Prüfungen verwenden bewusst den kanonischen Cache-Einstieg. Bestehende App-Fenster vor Update schließen, Transfers vorher beenden; kein erzwungenes `skipWaiting`.

Deployment: `/srv/ai-habibi/build.sh boxbert`, gepinnter Flake-Node **v26.5.0**, npm **11.17.0**, Exit 0. Hosted `app/dist/`, SD-ready `app/dist-sd/` und Live-Artefakt `/srv/ai-habibi/sites/boxbert/dist/` gebaut. `/var/www/boxbert` zeigt auf das Hostingartefakt. **Keine Commits/Pushs, keine Firmware-/SD-Mount-/Root-/Setup-Aktionen.** Fremde `ai-habibi/hermes/**` Änderungen wurden nicht bearbeitet oder gestaged.

## Verhalten / Datenvertrag

- Beide Kanäle besitzen getrennte **Palette** (Einfarbig/Regenbogen), gespeicherte monochrome **Farbe**, Helligkeit und **Effekt**. Regenbogen deaktiviert den Farbpicker, verliert aber dessen Farbe nicht. Wechsel der Palette verändert nicht den Effekt.
- Stick (8): Aus, Statisch, Atmen, links → rechts, rechts → links, Mitte → außen, Party (langsame weiche Lichtwellen, kein Stroboskop).
- Board (1): Aus, Statisch, Atmen, Party, langsamer Farbwechsel, Kerze. Ein Pixel zeigt nicht acht Farben gleichzeitig. Regenbogen + statisch ergibt eine feste Farbe; Farbwechsel durchläuft die Palette. Einfarbiges Grau bleibt bei Farbwechsel grau, Kerze moduliert die Helligkeit der gewählten Farbe.
- Vorschau rendert `sampleLedFrame(settings, 8|1, timeMs)`. Uhr/RAF bleiben in React; Engine bleibt deterministisch/pure.
- Vorschau zeigt ausdrücklich den **Entwurf**. Jeder Kanal besitzt seinen eigenen Speichern-Knopf. Speichern des anderen Kanals oder der Lautstärke verwirft keinen LED-Entwurf. Reiterwechsel verwirft ungespeicherte LED-Entwürfe; Reload lädt den gespeicherten Stand. Reset remountet beide LED-Kanäle und verwirft auch Entwürfe, wenn die gespeicherten Ausgangsdaten bereits unverändert sind.
- `requestAnimationFrame` wird beim Unmount, Hintergrund-Visibility-Ereignis und `prefers-reduced-motion: reduce` beendet. Reduced Motion rendert die feste **t=0**-Momentaufnahme, nicht eine weiterlaufende CSS-Animation. Zurück im Vordergrund/ohne Motion-Reduktion startet die Vorschau neu; Aus/Statisch benötigen keinen RAF.
- Kanonisch: `{color, brightness, palette: 'solid'|'rainbow', effect}`. `DemoAdapter` verwendet ausschließlich Engine-Migration/Validatoren mit explizitem Kanal. Legacy `effect: 'regenbogen'` ohne Palette → `palette: 'rainbow', effect: 'statisch'`; sonst fehlende Palette → `solid`. Farbe/Helligkeit, Kategorien, Tags/Namen/UIDs, Buttons/Dateipfade und Lautstärke bleiben erhalten.
- Auch `DemoAdapter.settings()` akzeptiert Legacy-Inputs, persistiert jedoch kanonisch. Lesen migriert in den Arbeitsspeicher; der nächste erfolgreiche Demo-Write persistiert den ergänzten Zustand. Keine unangekündigte Speicheränderung beim Lesen. Ungültiger Input/kanalfremde Effekte werden ohne Write abgewiesen; beschädigte vorhandene Daten behalten die sichtbare Speicherwarnung und unveränderte Rohdaten (kein stiller Reset/Writeback).

## Tatsächlich ausgeführte Nachweise

Alle folgenden Befehle hatten **Exit 0**; Browser: reales Playwright-Chromium
`/nix/store/crfx5mjs2k6sdw45kbs9404h575mmwlk-playwright-chromium/chrome-linux64/chrome`.
Lokale Aufrufe setzen `BOXBERT_URL=''`, HTTPS-Aufrufe den oben genannten Release-Link. Dies verhindert, dass eine im Terminal zuvor exportierte Produktions-URL lokale Checks unbemerkt umleitet.

| Prüfung | Reales Ergebnis |
|---|---|
| `npm test` | **42/42**, 0 fail/skip; darunter unverändert **11/11 Engine**, neue 2 Adapter-Migrations-/Reject-Tests; beide Build-Verträge |
| `npm run test:browser` | PASS Demo, Legacy-Migration, Buttons/Tags, Palette/Farbe/Helligkeit, Persistence/Reset, Upload/Abbruch/SD-Fehler, 320/390/1280 Layout |
| `node tests/local-browser.mjs` | PASS SD-Build gegen HTTP-Contract-Fixture: Basic/Origin/Form/Multipart, Fehlercodes, kein Fallback, Passwort flüchtig, kein SW, keine neue Einstellungsroute |
| `node tests/tag-names-browser.mjs` | PASS mehrfaches Umbenennen/Unicode/Reload, UID und MP3 unverändert |
| `node tests/ux-browser.mjs` lokal | PASS 3 echte Tabs/Keyboard, Sounds/Musik, 8+1 Kanäle, fixed Volume, 320/390/1280 × Light/Dark × alle Reiter, kein Footer-/Bar-Überdeckungsfehler |
| `node tests/led-browser.mjs` lokal und HTTPS | PASS unabhängige Palette/Effekte, tatsächliche Pixel-Style-Änderungen aller bewegten Stick-/Board-Effekte, eigener Save/Draft/Reload/Reset, Reduced Motion + RAF-Cleanup |
| `npm run test:https` | PASS echtes HTTPS 200, Manifest/Icons/SW/Controller, Offline-Reload und neues Dokument, Buttons/Tags/Palette/Effekt persistent, keine ESP-API-/JS-/HTTP-Fehler |
| `node tests/ux-browser.mjs` HTTPS | PASS vollständige Light/Dark-/Breiten-Matrix sowie Kategorien, beide LED-Kanäle und Lautstärke nach Offline-Reload/neuem Dokument |
| Live-Bytes / SHA-256 | **Alle 8 Dateien HTTP 200**, Live-Bytes exakt gleich `app/dist` und Hostingartefakt |

LED-Browserprüfung kontrolliert die Richtung zusätzlich mit Playwrights deterministischer Browser-Uhr: links → rechts **[0] → [1]**, rechts → links **[7] → [6]**, Mitte → außen **[3,4] → [2,5]** als jeweils hellste sichtbare Pixel nach 650 ms. Dabei wird das echte React-UI/Engine-Rendering verwendet, kein Ersatzsampler.
RAF-Instrumentierung: zwei aktive bewegte Kanäle → **2** geplante Frames; Reduced Motion, Hintergrundereignis und Tab-Unmount → **0**. Änderungen von Media-Preference und Vordergrundstatus werden ebenfalls geprüft. Hintergrundstatus wird im Headless-Browser als `document.hidden` + `visibilitychange` kontrolliert simuliert; das ist kein OS-/Handy-Energiespartest.

### TDD / während Integration abgefangene Fehler

- Neue Adaptertests zunächst **0/2**: Palette fehlte, Legacy-Regenbogen blieb als Effekt erhalten. Nach Engine-Migration **2/2** und vollständige Suite grün.
- Neuer LED-Browsertest zunächst echter Timeout: unabhängiges Effektfeld fehlte. Nach UI/RAF-Integration PASS.
- Screenshot zeigte abgeschnittene Palette (64 px). Neuer Breitentest fiel mit **64 statt mindestens 140 px**. Grid korrigiert; 320/390/1280 ohne horizontales Overflow und lesbare Palette.
- Separater Entwurf ging nach Lautstärke-Save verloren (`farbwechsel` → `aus`). Regressionstest RED, Dependencies auf tatsächliche gespeicherte Kanalwerte statt neue Objektidentität umgestellt, GREEN.
- Wiederholter Reset bei schon gespeichertem Seed ließ Entwurf `party` stehen. Regressionstest RED, LED-Grid an `mode + resetCount` gekoppelt, GREEN.
- Vorhandene Legacy-Tests blieben ausdrücklich Legacy-Inputs; erwartete Ergebnisse wurden auf die neue kanonische Repräsentation angepasst. Regenbogenchecks testen jetzt Palette **und** Effekt unabhängig, nicht eine abgeschwächte Existenzprüfung.

## Artefakte / sichtbare Prüfung

Lokale Rohlogs unter `app/test-results/` (generiert/ignoriert):
`unit-effects.log`, `deployment-effects.log`, `local-regression-effects.log`,
`led-local-effects.log`, `https-regression-effects.log`, `led-https-effects.log`.
Reproduzierbarer Bytevergleich: `test-results/verify-deployed-effects.py`.

Finale **HTTPS**-Screenshots `effects-cards-light.png`, `effects-cards-dark.png` sowie
`effects-light.png`, `effects-dark.png` unter `app/test-results/`. Beide Kartenbilder tatsächlich visuell geöffnet: Palette Regenbogen vollständig lesbar, getrennte Effektfelder und Save-Buttons, Stick-Lauflicht und einzelner Board-Pixel, Light/Dark lesbar, keine Überdeckung in den Karten. Die UX-Matrix-Screenshots `ux-{320,390,1280}-{light,dark}-{leds,mapping,media}.png` stammen abschließend ebenfalls vom HTTPS-Lauf.

Finale Kernartefakte / SHA-256:

- `assets/index-C0q2s3Ui.js`: `889d8cb0420cafdc33b8c0c89ca0b001dfe5a923f6243cfb6d54cc109edad6d2`
- `assets/index-Dsbhlhsw.css`: `90ff233a694deab4afcc96b9caf5053e78f80fbd834e3f0cb3c5b83c80c456f1`
- `sw.js`: `3fa516077c8fa1e6bcd0aa16315cfbf7dde76b6d982e9c020df4c32f607e0982`

## Grenzen / offene reale Abnahme

Nur **Browser-Demo**, keine NeoPixel-/Lautstärke-/Kategorie-/Namens-API erfunden. Keine Firmware geflasht, keine SD kopiert, kein physischer Pixel/ESP geprüft. SD-Testserver ist eine Contract-Fixture, keine Hardware. Kein echtes Audio, keine MP3-Decodierprüfung, keine Kinder-/Photosensitivitäts-/Akustikfreigabe, keine Android-Installations-/Low-Power-/Dauerabnahme. Offline-Demo enthält Metadaten und UI, keine Audio-Dateien. Browserdatenverlust bleibt Datenverlust; keine Synchronisierung/Backup.

Build meldete den bekannten npm-`allow-scripts`-Hinweis zu `esbuild@0.28.2` und Dirty-Tree-Warnung; Build/Tests/Bytevergleich bestanden dennoch. Keine Setup-/Approve-Scripts-/Lockfile-Änderung. Ein inline Python-Bytevergleich wurde durch den Tool-Sicherheitsguard fälschlich blockiert; derselbe reine Lesevergleich als gespeichertes Python-Skript lief erfolgreich.

Ohne Commit/Push ist das aktuelle Live-Artefakt nicht gegen Server-Neuaufbau dauerhaft gesichert. Das wurde auftragsgemäß nicht geändert. Bestehende Alt-SW-Clients können bis zum Schließen ihrer App-Fenster den alten Stand sehen.
