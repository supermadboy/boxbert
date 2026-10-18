# TFT V2 · Software-Prüfbericht · 18.10.2026

Release: https://habibi.supermittel.com/boxbert/?stand=tft-v2-cachefix-12

## Nachtrag: echter Nutzer-Updatefehler behoben

Daddelberts Screenshot zeigte `f.tft_set_asset is not a function · V1 bleibt
aktiv`, obwohl die Animation angehakt war. Die Ersttests nutzten frische
Browserkontexte und übersahen den Wechsel aus einer bestehenden V1-PWA.

`tests/tft-update-browser.mjs` reproduziert den Fehler mit den **echten alten
V1-Deploymentdateien und deren unverändertem Service Worker** aus dem
ai-habibi-Gitstand `ebaa4ec`. Ein alter Tab bleibt geöffnet und hält den
V1-Worker aktiv. Danach liefert derselbe Testserver den neuen Build an ein
neues Dokument mit Release-Query. Vor dem Fix blieb das Display `v1` statt
`v2`: neues JavaScript traf den im alten Worker gecachten stabilen WASM-Pfad.

Fix: Vite importiert WASM und RGB565 als URL-Assets und versieht beide mit
Inhaltshashes. Es gibt keine überschriebenen stabilen Binärdateinamen mehr.
Neue JS- und WASM-Versionen sind dadurch untrennbar über ihre Dateinamen
zugeordnet, auch wenn ein alter Worker noch aktiv ist. Kein `skipWaiting`,
keine Cache-/localStorage-/IndexedDB-Löschung und kein automatischer Reload.

```text
PASS real V1 offline worker + new V2 document: V2 sprite ready, no mixed WASM, browser data preserved
```

Zusätzlich 53 App-Tests sowie V2-/Lifecycle-Browserprüfungen erneut grün.
Beide Buildvarianten enthalten identische Binärdateien und der neue Shell-
Cache umfasst die gehashten Assets. HTTPS-/Offline-Neustart und V2-Browserlauf
nach Deployment erneut bestanden. Live liefern die gehashten Dateien HTTP
200, WASM mit `application/wasm`, Frames mit `application/octet-stream`.
Der native Renderer und die Bildfolge selbst wurden nicht verändert.

Update-Test aus `app/`: `node tests/tft-update-browser.mjs`, mit einem
`CHROMIUM_PATH` wie unten. Er benötigt die ai-habibi-Githistorie; Standard
`/srv/ai-habibi`, anderswo per `AI_HABIBI_REPO` setzen. Auf Loopback wird der
echte alte Worker explizit registriert, da die App automatische PWA-Registrierung
nur für HTTPS vornimmt. Danach greifen echte Browser-Service-Worker-Caches,
keine simulierten WASM-Antworten.

Die bisherigen stabilen Binärpfade in den folgenden ursprünglichen
Deploymentnachweisen sind historisch; aktuell liegt beides unter `assets/`.


## Umfang

Daddelbert hat V1 als fertig bestätigt und direkt V2 beauftragt. Der V1-Abschluss
wurde zuerst separat committet und gepusht; überholte V1-Geräte-Abschlusstore
wurden von der späteren ESP-Gesamtintegration getrennt.

V2 ergänzt echte vorberechnete Boxbert-Frames im gemeinsamen C++-Kern.
Native C++ und Browser-WASM verwenden dieselbe Frameauswahl, RGB565-Pixel,
Schrift und Statusdarstellung. Keine separate CSS-/SVG-/3D-Browseranimation.
Boxbert steht links, Figur/Titel rechts; Status und Zeitleiste bleiben erhalten.

Eine 12-Frame-Folge mit 64×64 Pixeln, 160 ms je Frame: **98.328 Bytes** inklusive
24-Byte-BBT2-Header. WASM-Build **48.469 Bytes**, fixer linearer WASM-Speicher
**524.288 Bytes**. Speicherwerte beziehen sich auf diesen Browserbuild,
nicht auf Flash-/Heap-/PSRAM-Reserven einer ESP-Gesamtfirmware.

## Eigene ausgeführte Prüfungen

### Renderer / Binärformat

```text
PASS absent sprite: exact V1 fallback
PASS LE frame bounds, exact timing, loop, pause, unchanged timeline
PASS malformed asset fallback, reload, bounded pointers, native/WASM V2 pixels
PASS actual Blender device frames: 240 native/WASM snapshots, all frame selections and unmodified sprite pixels
PASS 16 fixtures x 5 fixed times = 80 exact native/WASM RGB565 comparisons + golden SHA256
PASS native 128 malformed UTF8 cases + full unterminated capacities
```

Die 240 V2-Vergleiche verwenden **die echte Blender-Gerätefolge** über alle
16 vorhandenen Zustandsfixtures und 15 feste Zeiten, einschließlich Framegrenzen,
Loopbeginn und uint32-Maximalzeit. Zusätzlich werden die reservierten 64×64
Spritepixel zeilenweise gegen die Paketpayload geprüft: Texte/Status dürfen
sie nicht überzeichnen. V1-SHA256-Goldens sind unverändert grün.

Beschädigte Magic, Maße, Anzahl, Dauer, CRC und Pixelpayload, abgeschnittene
Dateien, extreme Längen und unzulässige WASM-Pointer werden abgelehnt.
Ein neuer ungültiger Ladevorgang deaktiviert auch ein vorher gültiges Asset;
V1 ist dann wieder exakt pixelgleich. Ein synthetisches rotes/grünes Testpaket
prüft LE-Farbe, Rechteckgrenzen und Framezeit unabhängig vom Designasset.
Diese künstlichen Prüfpixel werden nicht als Blender-Ergebnis ausgegeben.

Separater Native-Build mit `-fsanitize=address,undefined`: UTF-8-Selftest und
echter V2-Assetaufruf mit uint32-Maximalzeit bestanden, keine Sanitizerdiagnose.
Keine allgemeine Fuzz-/Echtzeitgarantie daraus.

### Asset-Reproduktion

Sechs Konverter-/Assettests grün. Loopnaht zuerst rot:
`2.7694498697916665 not less than 2.0`. Drehung/Hub verkleinert statt die
Schwelle aufzuweichen; finale Naht **1,4228515625**, weiterhin <2,0.
Der Kontaktbogen wird aus der finalen RGB565-Payload erzeugt und wurde angesehen.

Zwei separate Blenderläufe lieferten nach expliziter PNG-Normalisierung
**bytegleiche zwölf PNG-Master, Framepaket und Manifest**. Der erste Manifest-
Vergleich scheiterte trotz gleicher Pixel durch Blender-Datei-/Renderzeit-
Metadaten. Neue Normalisierungs-Slice zuerst rot, dann grün; variable PNG-
Metadaten werden im expliziten Buildschritt entfernt. Paket und Masterhashes
sind dadurch reproduzierbar. Blender meldete nur fehlenden PipeWire-Kontext
und eine `Material.use_nodes`-Deprecation, renderte mit Exit 0.
`bash -n` und `shellcheck` für beide neuen Shell-Wrapper bestanden.

Read-only Peer-Review fand im Renderer-/App-Stand keine konkreten Bugs;
eigene obige Läufe bestätigen Pixelgleichheit, Grenzen und Browserverhalten.

### App / Browser

`npm test`: **53 Tests bestanden**. Geprüft werden Adapter/Persistenz sowie Hosted-/SD-Build. Beide Builds liefern
das Framepaket bytegleich zum versionierten Geräteasset; Hosted-SW cached
WASM und Frames. Zwei Asset-Ladetests verwenden echtes WASM und prüfen
unveränderte Daten, CRC-Fehler, falsche Größe, Abbruch und exakten V1-Fallback.

```text
PASS V2 browser: shared sprite pixels, animation, Reduced Motion, toggle, HTTP/corrupt fallback, late unmount/reopen
PASS TFT V1: echtes WASM-Canvas 240×135, keine CSS/SVG-Nachbildung, Status/UTF-8/Fehlerfälle, Play/Pause/Seek/Ende/Titelwahl, bewegte Pixel, Reduced Motion + manuelles Scrollen, Light/Dark 320/390/1280, Tastatur, keine JS-Fehler
PASS TFT WASM lifecycle: HTTP-Fehler sichtbar ohne Ersatz, verspätetes Laden nach Unmount ignoriert, Wiederöffnung, Reduced Motion und Hintergrund stoppen Rendering
PASS UX: echte 4 Tabs/Keyboard, Kategorie Upload/Filter/Änderung, unabhängige 8+1 LEDs, fixed Volume/Persistence, 320/390/1280 × Light/Dark × alle Reiter, keine Überdeckung/JS-Fehler
```

V2-Browserlauf lokal **und gegen echtes HTTPS** mit dem final geglätteten
Paket bestanden. UX-Regression ebenfalls lokal und live einschließlich
Offline-Persistenz geprüft. Bewegung der
tatsächlichen Spritepixel wird geprüft, nicht nur ein Attribut. Reduced Motion
steht still; manueller Titelversatz lässt die laufende Boxbert-Animation weiter
laufen. Der optionale Schalter stellt V1 wieder her. Fehler 503 und kaputte
Dateien behalten ein sichtbares V1-Bild; Warntext steht außerhalb des TFT.
Verspätete Assetantwort nach Reiterwechsel verändert keine unmontierte Komponente.
V2 in Light/Dark und 320/390/1280 px ohne horizontalen Überlauf geprüft.

### Deployment / Offline

`/srv/ai-habibi/build.sh boxbert` erfolgreich ausgeführt; nginx liefert Seite
und Framepaket mit HTTP 200, Frames als `application/octet-stream`, Länge 98.328.
HTTPS-Downloads von WASM und Frames gegen lokale Dateien byteweise verglichen:
beide identisch. nginx-Fehlerlog gelesen, keine Boxbert-/Assetfehler im geprüften
Log; vorhandene Fehler betreffen Requests auf die Verzeichniswurzel.

```text
PASS LIVE HTTPS TFT V2: WASM 200, Pixel-Canvas mit Schrift/Status/UTF-8, Screenshots, gespeicherte Demodaten unverändert, WASM-Offline-Neustart als neues Dokument, keine JS-/HTTP-Fehler oder ESP-Requests
```

Der Offline-Test öffnet nach Online-SW-Aktivierung ein **neues Dokument ohne
Netzwerk** und fordert explizit V2 mit geladenem Asset, nicht nur irgendein
Canvas. Vorhandene Demo-Daten bleiben bei der TFT-Bedienung unverändert.

Echte Screenshots angesehen: [Display](tft-v2-ui/display-dark.png),
[Handy Dark](tft-v2-ui/preview-mobile-dark.png),
[Desktop](tft-v2-ui/preview-desktop-dark.png),
[Umlaute](tft-v2-ui/display-umlauts.png),
[unbekannte Werte](tft-v2-ui/display-unknown.png).
Boxbert erkennbar, lesbare Figuren-/Status-/Zeittexte ohne Überlappung.
Abschneiden langer Songtitel ist die begrenzte manuell/automatisch verschiebbare
Textfläche. Der komplette Text bleibt aufklappbar zugänglich.

## Entwicklungsfehler und Korrekturen

- Erster V2-Renderertest rot: `optional V2 render entry point`, danach grün.
- Nächste Slice rot: `bounded WASM staging buffer`; nach Validator/Blit grün.
- Native-V2-Test rot: Runner Exit 2 ohne Assetargument; danach native/WASM grün.
- Browserintegration rot: `data-mode` fehlte; nach Integration grün.
- Zusätzlicher Fallback-Test fand eine Warnung **im** geklippten TFT-Container.
  Der Hinweis verdeckte V1. Außerhalb platziert, derselbe Test danach grün.
- Chromium-Pfad war nach Nix-GC nicht mehr vorhanden. Gepinnte Revision erneut
  bezogen. Erster Start ohne Fonts scheiterte mit `Could not find any font`
  und `FATAL ... SkFontMgr_FontConfigInterface.cpp:163`. Mit gepinnten
  DejaVu-Fonts und lokalem Fontconfig-Prozesspfad erfolgreich; kein Root-Setup
  und kein Flake-Update. Der Hostingbuild meldete nur den bestehenden
  npm-Hinweis zum esbuild-Installskript und war erfolgreich.

Toolchain: Nixpkgs `0954f7ee2f6bb3dc7d4e3d0d8bcb8fd4bde4cfc5`,
Clang/LLD 21.1.8, Node 26.5.0, Vite 7.3.7, Playwright 1.56.1,
Chromium 150.0.7871.186. Auf diesem Headless-Host verwendet der Testprozess
`FONTCONFIG_FILE=/tmp/boxbert-fonts.conf` mit DejaVu Sans/Mono aus derselben
Nix-Revision und Aliasen für system-ui/sans-serif/sans/monospace. Dieser Pfad
ist temporär, nicht Voraussetzung eines normalen Rechners mit Fontconfig.

## Grenzen

Kein neuer ESP-Sketch/-Build, kein Flash und kein Hardwarekontakt. V1 ist
abgeschlossen; spätere ESP-Gesamtintegration bleibt bei
[Endinbetriebnahme](../../docs/endinbetriebnahme.md). Reale Audio-/SPI-/SD-/
NFC-/WLAN-Last, Speicherreserve, TFT-Farbwirkung/Framerate und Sleep/Neustart
sind **nicht** durch native/WASM- oder Browsererfolg abgenommen.

Vertrag, ABI, Speichereigentum und Reproduktion: [TFT V2](../../docs/tft-v2.md).
