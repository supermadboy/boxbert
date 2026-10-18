# TFT V1 — gemeinsamer Pixelrenderer

**V1 abgeschlossen; aktuelle optionale V2-Erweiterung:** [Boxbert-Frames](tft-v2.md).

Stand 17.10.2026. Daddelbert bestätigte DejaVu Sans und die spritefreie Basis.
**Gebaut/geprüft: Native C++ und Browser-WASM, nicht die ESP-Geräteintegration.**
Aktueller Nachweis: [TFT-V1-Prüfbericht](../app/docs/verification-tft-v1.md).
Fahrplan: [V1/V2](../.hermes/plans/2026-10-16_151332-tft-v1-v2.md).

## Eine Pixelquelle

`firmware/ui/TftRenderer.cpp` ist Arduino-frei und zeichnet sämtliche Schrift,
Symbole, Titelbewegung, Zeit und Fortschritt in einen statischen 240×135-Buffer
mit RGB565. `TftRenderer.h` ist die gemeinsame C-ABI; `TftState.h` benennt die
Statuskonstanten. Es gibt keine Uhr, Tasks, Netzwerk-/Dateizugriffe oder
Peripherie im Renderer. Er verändert seine Eingabetexte nicht.

Nativ und als WASM wird exakt diese Quelldatei mit denselben Glyphen aus
`FontData.h` und derselben Geometrie aus `StatusGeometry.h` kompiliert.
Die Icon-Geometrie wurde aus dem bisherigen `app/src/tft-status-icons.json`
übernommen; die aktive Darstellung kommt ausschließlich aus C++.
Die alte JSON ist historische Entwurfsreferenz, kein Browser-Zeichenweg mehr.

Die Browserhülle `app/src/TftCanvas.jsx` übergibt den Snapshot und explizite
Zeit, liest den fertigen Buffer und verwendet `putImageData`. Sie zeichnet
keinen Text und keine Icons nach. `rgb565ToRgba` expandiert lediglich die
Kanäle mit `(r5<<3)|(r5>>2)`, `(g6<<2)|(g6>>4)`, `(b5<<3)|(b5>>2)`;
Alpha ist 255. WASM-Bytes sind Little Endian. Native Vergleichsausgabe schreibt
jedes uint16 explizit als Low-/High-Byte. Browservergrößerung ohne Interpolation.
Physische Helligkeit und Farbwirkung zweier Displays sind damit nicht identisch.

Ein Framebuffer benötigt 64.800 Bytes. Historischer V1-Build: WASM 47.559 Bytes; fixe
WASM-Memory 262.144 Bytes, keine Imports/JS-Glue. Dies ist **kein** freies
ESP-Speicherbudget; native/WASM-Dateigröße sagt nichts über das gesamte
Arduino-Firmwareimage oder dessen freien Heap/PSRAM aus.

## Snapshotvertrag / C-ABI

```cpp
char* tft_figure_input(); // 512 Bytes, inklusive abschließender Null
char* tft_title_input();  // 2048 Bytes, inklusive abschließender Null
uint16_t* tft_render(
  int playback, int elapsedSeconds, int durationSeconds,
  int volume, int batteryPercent, int charging, int wifi,
  uint32_t timeMs, int scrollOverride);
```

Die beiden Eingabebuffer gehören dem Renderer und werden vor Aufruf mit
begrenztem UTF-8 gefüllt. Browser nutzt `TextEncoder.encodeInto` und reserviert
ein Nullbyte, ohne UTF-8-Sequenzen anzuschneiden. Der C++-Kern liest auch bei
fehlender Null niemals über die jeweilige Kapazität. Der Rückgabepuffer gehört
dem Renderer und wird beim nächsten Renderaufruf überschrieben; nicht parallel
aus mehreren Tasks verwenden. Ein Buffer, keine DMA-/Doppelbuffer-Abstraktion.

- `playback`: 0 Boot, 1 Idle/kein Tag, 2 Playing, 3 Paused, 4 Ended,
  5 FileError. Andere Werte ergeben sichtbar `Status ?`, nicht Idle.
- `figure` und `title`: bereitgestellte Anzeigenamen. Keine Namens-/Titelquelle,
  kein UID-/Player-/SD-Zugriff wird hier erfunden. Lange Figurennamen werden mit
  gemessenen Glyphenbreiten und Ellipse gekürzt; Titel laufen in eigener Fläche.
- `elapsedSeconds`: >=0 bekannt, negative Werte unbekannt (`--:--`).
- `durationSeconds`: >0 bekannt, <=0 unbekannt. Bei bekanntem Ende werden
  Fortschritt und verstrichene Zeit auf die Dauer begrenzt. Unbekannte Zeit oder
  Dauer ergibt eine gestrichelte, nicht als Prozentposition gefüllte Leiste.
  Keine Demo-Gesamtdauer als Ersatz für eine nicht gelieferte MP3-Dauer.
- `volume`: 0–21 gültig, 0 Mute, andere Werte sichtbar unbekannt.
  Die Skala ist kein akustisches Sicherheitslimit.
- `batteryPercent`: 0–100 gültig, andere Werte unbekannt. `charging`: 0 nein,
  1 ja (Blitz), andere Werte unbekannter Ladezustand. Keine Spannungsumrechnung
  oder Gauge-Datenbeschaffung im Renderer.
- `wifi`: 0 aus, 1 verbindet, 2 verbunden, 3 unbekannt; sonst auch unbekannt.
  Verbindungsanimation nutzt ausschließlich `timeMs`, keinen eigenen Timer.
- `timeMs`: expliziter Renderzeitpunkt; identischer Snapshot + Zeitpunkt ergibt
  identische Pixel. Unsigned 32 Bit, einschließlich geprüftem Maximalwert.
- `scrollOverride`: <0 automatische Titelbewegung, >=0 manueller Pixelversatz,
  im Kern auf die tatsächlich mögliche Strecke begrenzt. Automatisch 40 ms
  je Pixel mit Haltepause an beiden Enden; kurze Titel bleiben zentriert.

Leerer Titel: Boot zeigt `Boxbert`, Idle `Figur auflegen`; andere Zustände einen
unbekannten Platzhalter. Kein Tag, Pause, Ende und Dateifehler sind eigene
sichtbare Zustände. Dies ist ein **Rendervertrag**, keine implementierte
Geräte-Status-API. V2 nutzt denselben Vertrag mit optionalem Asset; Erweiterung siehe
[tft-v2.md](tft-v2.md). Die hier beschriebene V1-ABI bleibt erhalten.

## Layout und Font

240×135 logische Pixel. Dunkler Hintergrund `0x1082`, helle Schrift `0xf7be`,
Akzent `0x4e19`, inaktive Farbe `0x7bef`. Status links oben, drei kompakte
Smartphone-Symbole rechts oben. Figur im Bereich ab y=32, Titel ab y=58,
Fortschrittsleiste y=91–94, Zeiten ab y=103. Horizontaler Inhaltsbereich
x=8 bis ausschließlich 232; automatische Titelbewegung wird dort beschnitten.
V1 nutzt den freien Mittelbereich für lesbare Information, kein Maskottchen.
Das optionale V2-Layout/Frame-Blitting ist separat in [tft-v2.md](tft-v2.md) dokumentiert.

Schrift: **DejaVu Sans 2.37 Bold 16 px**, **Regular 12 px**. Quelldateien unter
`assets/tft/fonts/`, vollständige Original-Lizenz in `assets/tft/fonts/LICENSE`.
Hersteller-/Lizenzreferenz: https://dejavu-fonts.github.io/License.html.
Die Fontdateien und Lizenz bleiben im Repo, kein Laufzeit-Fontdownload.

Generierte monochrome Glyphen: ASCII U+0020–007E, Latin-1 U+00A0–00FF und
Ellipse U+2026, insgesamt 192 Glyphen pro Schnitt. Umlaute/ß sind echte Glyphen.
Nicht enthaltene Codepoints, auch Emoji und CJK, werden pro Codepoint durch
`?` ersetzt. Fehlerhafte UTF-8-Leit-/Fortsetzungsbytes werden begrenzt konsumiert;
keine Endlosschleife/ungeprüften Lesezugriffe. Keine Unicode-Normalisierung im
Gerät: vorkomponierte Umlaute verwenden; zerlegte kombinierende Zeichen können
Ersatzzeichen erzeugen.

`tools/tft/generate-fonts.py` nutzt Pillow/FreeType aus gepinntem Nixpkgs,
BASIC-Layout, Schwelle 128, 24×24-Bitmasken, Baseline 18, gerundeten Advance.
`FontData.h` ist getrackt; normaler Build regeneriert es nicht. Eine identische
Neugenerierung wurde geprüft: SHA256 vor/nach
`ee8da30bc21b88c028ba75c91b544fc4172d0395a4cb931024d47d5554b3559c`.

## Reproduktion

Voraussetzungen: Nix mit Flakes, Node. Keine Systempaketinstallation, kein Root,
keine Änderung an `ai-habibi/flake.lock`. Die Tools pinnen Nixpkgs direkt auf
`0954f7ee2f6bb3dc7d4e3d0d8bcb8fd4bde4cfc5`. Tatsächlich ausgeführt:
Clang **21.1.8**, LLD **21.1.8**. LLVM-Freestanding-WASM statt Emscripten:
der kleine Kern benötigt weder libc/Arduino noch zusätzliche JS-Laufzeit.

Vom Boxbert-Repo aus:

```sh
node tools/tft/build.mjs
node tools/tft/tests/render.mjs
node tools/tft/tests/fixtures.mjs
tools/tft/build/tft-native --selftest
# Nur zum kontrollierten Neugenerieren der Fontdaten:
node tools/tft/generate-fonts.mjs
```

`tools/tft/build/` ist ignoriert, darin `tft-native` und `tft-renderer.wasm`.
Der native Testrunner gibt genau einen Rohbuffer nach stdout aus; seine
Argumente folgen der C-ABI, vorher die beiden Texte. Die 16 versionierten
Snapshots in `firmware/ui/fixtures/states.json` werden zu fünf festen Zeiten
nativ und als WASM verglichen: **80 bytegleiche RGB565-Vergleiche**, zusätzlich
versionierte SHA256-Goldens. Initial fehlte die Golden-Datei erwartungsgemäß;
nach visueller Prüfung der echten nativen Zustände wurde sie einmal mit
`node tools/tft/tests/fixtures.mjs --update-goldens` erstellt und anschließend
regulär geprüft. Golden-Updates sind keine normale Testreparatur: erst die
gewollte Bildänderung prüfen. Kontaktbogen im [V1-Prüfbericht](../app/docs/verification-tft-v1.md).
Der native Selftest deckt 128 deterministische fehlerhafte UTF-8-Puffer und
vollständig gefüllte, nicht terminierte Eingaben ab; kein Sanitizer-Nachweis.

```sh
cd app
npm ci --no-audit --no-fund
npm test
npm run build
CHROMIUM_PATH=/pfad/zu/chromium node tests/tft-browser.mjs
CHROMIUM_PATH=/pfad/zu/chromium node tests/tft-lifecycle-browser.mjs
CHROMIUM_PATH=/pfad/zu/chromium node tests/ux-browser.mjs
CHROMIUM_PATH=/pfad/zu/chromium node tests/tft-hosted-browser.mjs
```

`app/build.mjs` baut vor Vite den Kern und kopiert das WASM nach
`app/public/tft-renderer.wasm` (ignoriert); Hosted- und relativer SD-Build
enthalten denselben Renderer. Hosted-SW nimmt WASM in den Shell-Cache auf.
Vor einem Entwicklungsserver nach frischem Checkout einmal `npm run build`.
Die Canvas-Komponente lädt asynchron, ignoriert Antworten nach Unmount, meldet
Ladefehler sichtbar und verwendet niemals einen heimlichen Ersatzrenderer.
RAF wird bei Reiterwechsel beendet, bei Hintergrund/Reduced Motion angehalten.
Manuelle Titelknöpfe bleiben erreichbar, voller Text ist separat zugänglich.

## Separat offen — spätere ESP-Gesamtintegration

Kein neuer ESP-Sketch, kein Arduino-Build, kein Flash und kein Hardwarekontakt.
Bestehende Etappen 4/5/7 bleiben unverändert. Phase 2 benötigt einen separaten
Integrationssketch mit geprüftem ST7789-Init aus Etappe 7, realen Player-/Gauge-/
WLAN-Zuständen und tatsächlichem Build samt Flash-/RAM-/Heap-/PSRAM-Werten.
Byteorder/Farbmuster, SPI-Sharing mit SD, nichtblockierendes Renderbudget,
Audio/NFC/WLAN-Last sowie Neustart und echte Beobachtungen bleiben zu prüfen.
USB-Flash erst mit neuer ausdrücklicher Freigabe und Zugriff auf das echte
Gerät; ein Hetzner-Server hat dadurch keinen USB-Zugriff auf Daddelberts Rechner.
V1 ist laut Nutzerbestätigung vom 18.10.2026 abgeschlossen; V2 ist direkt
beauftragt. Die spätere ESP-Gesamtintegration bleibt ein eigener Arbeitsblock,
keine V1-Abschlussbedingung oder Sperre für V2. Keine neuen Messnachweise
aus dieser Statuskorrektur ableiten.
