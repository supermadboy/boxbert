# TFT V1 · gemeinsamer Pixelrenderer · 17.10.2026

Release: https://habibi.supermittel.com/boxbert/?stand=tft-v1-10

## Umfang

Daddelbert hat DejaVu Sans und den Start mit V1 ohne Sprite bestätigt.
`firmware/ui/` enthält den Arduino-freien C++-Kern, `tools/tft/` den gepinnten
Native-/WASM-Build und dessen Pixelprüfungen. Im TFT-Reiter zeichnet Canvas
nur den fertigen RGB565-Buffer; Text, Icons und Zeit-/Fortschrittslayout kommen
ausschließlich aus C++. Kein `fillText`, kein SVG-Statusoverlay, kein CSS-3D.

DejaVu Sans Bold 16 px für Figuren-/Songnamen, Regular 12 px für Status/Zeiten.
Fontquellen, Lizenz und generierte Bitmapdaten sind versioniert. Umlaute und ß,
UTF-8-Decodierung sowie Ersatzzeichen sind Bestandteil des gemeinsamen Kerns.

Beispieltitel, Play/Pause, Position und Titelverschiebung bleiben isoliert von
Geräteadapter und persistenten Demo-Daten. Beispiele decken Start, keine Figur,
Dateifehler, unbekannte Dauer/Messwerte, Laden/Mute, WLAN aus/verbindet/verbunden/
unbekannt ab. Reduced Motion stoppt die automatische Titelverschiebung; Buttons
und aufklappbarer vollständiger Anzeigetext erhalten manuelle Zugänglichkeit.

## Bisher ausgeführte Prüfungen

- App-Build-RED: `ENOENT ... dist/tft-renderer.wasm`; danach Build-Vertrag grün.
- Browser-RED: `.tft-screen canvas` fehlte im alten CSS-Preview erwartungsgemäß.
- RGB565-Kanalexpansion und begrenzte UTF-8-Eingabe jeweils erst rot, dann grün.
- `npm test`: 51 Tests grün, inklusive beider Buildvarianten, WASM-Validierung,
  identischem Hosted-/SD-WASM und Aufnahme des Renderers in den Offline-Cache.
- `tests/tft-lifecycle-browser.mjs`: HTTP 503 sichtbar ohne Ersatzrenderer,
  verspätete WASM-Antwort nach Reiterwechsel ignoriert, Wiederöffnung möglich,
  Reduced Motion und Hintergrund stoppen die Animationsschleife.
- `tests/ux-browser.mjs` lokal: alle vier Reiter, Tastatur, Kategorien, beide
  LED-Kanäle, Fixed-Bar, Datenpersistenz und 320/390/1280 px in Light/Dark grün.

## Native-/WASM- und Live-Nachweise

Eigene Ausführung `node tools/tft/tests/render.mjs` im Repo lieferte:

```text
PASS initial framebuffer: native/WASM exact 64800 bytes
PASS font UTF8 and glyph pixels
PASS core text layout and scroll
PASS playback states
PASS dynamic status icons
PASS timeline unknown duration and bounded progress
PASS unknown charging status
PASS exact ABI and malformed/full-capacity UTF8 bounds
```

Zusätzlich `node tools/tft/tests/fixtures.mjs`: **16 versionierte Snapshots ×
fünf feste Zeiten = 80 bytegleiche Native-/WASM-Vergleiche mit SHA256-Goldens**.
Die Golden-Datei fehlte zunächst (`ENOENT ... golden-sha256.json`); nach visueller
Prüfung der tatsächlich nativ gerenderten Zustände wurde sie einmal erzeugt,
danach regulär grün getestet. [Geprüfter Kontaktbogen](tft-v1-ui/fixtures-reviewed.png).
`tools/tft/build/tft-native --selftest` bestand mit 128 fehlerhaften UTF-8-
Puffern und vollen nicht terminierten Eingaben. Kein Sanitizerlauf behauptet.
Der Fontgenerator erzeugte exakt dieselbe `FontData.h` (SHA256 vor/nach gleich).

Ein unabhängiger App-Code-Review und ein separater Core-/Toolchain-Review
meldeten keine Sicherheits- oder Logikfehler. Nichtblockierender Härtungshinweis:
fehlerhafte rohe UTF-8-Puffer werden aktuell auf beiden Plattformen separat
geprüft; ein gemeinsamer byteweiser Native-/WASM-Differenzkorpus für genau diese
ungültigen Sequenzen ist noch nicht vorhanden. Die 80 Snapshotvergleiche nutzen
gültige UTF-8-Eingaben und sichtbare Fallbacks.
Zusätzliche Assertions prüfen unbekannte ARIA-Fortschrittswerte und die
RGB565-Konvertierung mit nichtnulligem Speicher-Offset. Der selbst ausgeführte
Browserlauf hatte zwischenzeitlich einen Testselektor-Timeout:
`getByLabel('Beispieltitel', {exact:true})` traf den impliziten Labeltext mit
Optionsinhalt nicht. Mit der tatsächlichen zugänglichen Combobox-Rolle und
exaktem Namen wurde derselbe Ablauf lokal und auf HTTPS erfolgreich geprüft.

Alle Vergleiche nutzen echte native Ausführung und echtes WASM. Die Prüfungen
umfassen Bytegleichheit, Determinismus, Umlaute, Fallback pro Codepoint, lange
Namen/Titel, automatische/manuelle Verschiebung, alle Playback-/WLAN-Zustände,
Mute/Volume, Gauge/Laden/ungültige Werte, unbekannte und begrenzte Dauer sowie
volle/nicht terminierte fehlerhafte UTF-8-Puffer. Kein Ersatz-WASM aus JS.

- `tests/tft-browser.mjs` lokal **und gegen echtes HTTPS** grün: 240×135-Canvas,
  kein CSS-/SVG-Nachbild, reale Pixelbewegung statt Animationsnamen, Reduced
  Motion und manuelles Verschieben, Play/Pause/Seek/Ende/Titelwechsel, Fehler-
  und UTF-8-Fälle, Tastatur sowie Light/Dark bei 320/390/1280 px.
- `tests/tft-hosted-browser.mjs` gegen echtes HTTPS grün: WASM HTTP 200,
  gespeicherte Demodaten vor/nach TFT-Bedienung identisch, neuer Offline-Tab als
  neues App-Dokument unter der kanonischen `/boxbert/`-URL startet auch den
  WASM-Pixelrenderer. Keine JS-/HTTP-Fehler oder ESP-Requests.
- `tests/ux-browser.mjs` auch gegen echtes HTTPS grün: Kategorien, beide LED-
  Kanäle und Lautstärke über Offline-Reload und ein neues Dokument erhalten;
  vier Reiter, beide Themes, drei Breiten und feste Lautstärkebar ohne Überdeckung.
- `/srv/ai-habibi/build.sh boxbert` erfolgreich ausgeführt. `curl -sI` lieferte
  für `http://localhost/boxbert/` HTTP 200 und für HTTPS-WASM HTTP 200,
  `Content-Type: application/wasm`, `Content-Length: 47559`.
- nginx-Fehlerlog gelesen: keine TFT-/WASM-Fehler im geprüften Ausschnitt;
  vorhandene Einträge betreffen fremde Requests auf die Verzeichniswurzel.
- Echte Screenshots selbst visuell geprüft: scharfe Pixel, lesbare Umlaute/ß,
  Statussymbole oben rechts ohne Überlappung. Horizontales Abschneiden langer
  Titel ist die vorgesehene Scrollfläche, kein zweiter Text-Renderweg.

Screenshots: [Display](tft-v1-ui/display-dark.png),
[Umlaute](tft-v1-ui/display-umlauts.png),
[unbekannte Werte](tft-v1-ui/display-unknown.png),
[Handy](tft-v1-ui/preview-mobile-dark.png),
[Desktop](tft-v1-ui/preview-desktop-dark.png).

Testumgebung: Node v26.5.0, Vite 7.3.7, Playwright 1.56.1, Chromium
150.0.7871.186 aus dem vorhandenen gepinnten Nixpkgs-Stand. Der alte temporäre
Chromium-Wrapper zeigte nach GC zunächst auf einen fehlenden Storepfad;
Chromium wurde aus derselben Revision wieder über Nix bezogen, nicht als
Systempaket installiert. Browser- und Kern-Toolchain ändern weder Root-Setup
noch Ports oder `flake.lock`. Der Hostingbuild meldete nur den vorhandenen
npm-Hinweis zum esbuild-Installskript und war erfolgreich.

## Grenzen

Native-/WASM-Gleichheit ist ein Software-Pixelvergleich, keine Messung der
physischen TFT-Farbwirkung. Es wurde keine ESP-Firmware kompiliert oder geflasht,
kein USB-Gerät angesprochen und kein echter TFT-/Audio-/SD-/NFC-/WLAN-Lasttest
behauptet. Unveränderte Referenz-Sketches bleiben erhalten.
**Statuskorrektur 18.10.2026:** Daddelbert hat V1 als fertig bestätigt und V2
beauftragt. V1 ist damit abgeschlossen; die spätere ESP-Gesamtintegration
bleibt separat dokumentiert, ohne hier nicht ausgeführte Tests als bestanden
zu markieren. V2 hat einen eigenen Nachweis. Details: [Anzeigevertrag](../../docs/tft-rendering.md)
und [Fahrplan](../../.hermes/plans/2026-10-16_151332-tft-v1-v2.md).
