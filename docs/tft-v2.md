# TFT V2 — optionale Boxbert-Frames

Stand 18.10.2026. V1 ist laut Daddelbert abgeschlossen; V2 wurde ausdrücklich
als nächster Schritt beauftragt. Die ESP-Gesamtintegration ist ein separater
Arbeitsblock, nicht eine noch offene V1-Abschlussbedingung.

## Ein Renderweg, kein Browser-Nachbild

`assets/tft/boxbert/scene.py` erzeugt die 3D-Musikbox mit großen Augen,
Blinzeln und dezenter Bewegung. Die PNG-Master werden offline zu **64×64,
12 RGB565-Frames mit je 160 ms** konvertiert. Die fertige Gerätepixeldatei
`boxbert.rgb565` wird unverändert mit beiden App-Builds ausgeliefert und von
`TftRenderer.cpp` geblittet. Canvas zeichnet nur den kompletten C++-Framebuffer.
Kein CSS-3D, GIF-/PNG-Decoder oder zweiter Animationsalgorithmus im Browser.

Statussymbole, Zeiten und Fortschrittsleiste bleiben an ihren V1-Positionen.
V2 reserviert x=8…71/y=26…89 für die Figur; Figurenname und Songtitel nutzen
rechts x=80…231. Lange Namen werden gekürzt, Titel im gemeinsamen Kern
innerhalb dieser schmaleren Fläche gescrollt. Der vollständige Text bleibt
außerhalb des Pixelbildes zugänglich. Nur Playing bewegt den Boxbert; alle
anderen Zustände zeigen Frame 0. Reduced Motion nutzt Zeit 0; manueller
Titelversatz deaktiviert nicht die laufende Boxbert-Animation.

## Schnittstelle und Eigentum

Die V1-ABI `tft_render(...)` bleibt unverändert; ihre bisherigen Pixel-Goldens
bleiben gültig. `tft_render_v2(...)` verwendet dieselben Snapshotargumente und
fällt ohne gültiges Asset **pixelgenau auf V1** zurück.

`tft_set_asset(const uint8_t*, uint32_t)` prüft Länge, Format, feste Dimensionen,
Frameanzahl, Timing und Payload-CRC32 einmal beim Einbinden. Rückgabe 1 bedeutet
validiert, 0 deaktiviert/ungültig. Vor jeder neuen Prüfung wird das vorherige
Asset deaktiviert. `nullptr,0` schaltet es ausdrücklich ab. Kein Dateizugriff,
Heap-Allokation oder weiterer Framebuffer im Renderer.

Native/ESP: Die Funktion behält einen Zeiger auf **dauerhaft gültigen,
unveränderlichen Caller-Speicher**; vor Freigabe oder Veränderung erst
`tft_set_asset(nullptr,0)` aufrufen. Auf ESP wäre ein Flash-Asset möglich,
aber weder Speicherreserve noch realer Firmwarebuild sind hier nachgewiesen.
Kein SD-Streaming und kein blindes Laden der ganzen Folge ins ESP-RAM.

Nur WASM besitzt `tft_asset_input()` und `tft_asset_capacity()` als begrenzten
Stagingbuffer. Der Setter akzeptiert dort ausschließlich diesen Startzeiger
oder den Deaktivierungsaufruf. Browserfehler/fehlende Dateien zeigen einen
Hinweis **außerhalb** des TFT, ohne das weiter nutzbare V1-Bild zu verdecken.
WASM-Ladefehler bleiben eigene sichtbare Fehler ohne Ersatzrenderer.

BBT2: Header 24 Bytes, Little Endian: `BBT2`, uint32 Breite, Höhe, Frameanzahl,
Millisekunden pro Frame, CRC32 der Payload. Danach zwölf RGB565-Frames ohne
Padding. Paketgröße **98.328 Bytes**, davon **98.304 Pixelbytes**. Manifest
mit SHA256, Frameoffsets und Masterhashes liegt neben der Datei. CRC32 dient
Fehlererkennung, nicht Authentifizierung.

WASM: fixer Speicher **524.288 Bytes**, einschließlich browserseitigem
98.328-Byte-Stagingbuffer. Der geteilte Framebuffer bleibt **64.800 Bytes**.
Das ist kein ESP-Heap-/PSRAM-Budget. Die browserseitige RGB565→RGBA-Konvertierung
und Fetch-Buffer haben zusätzlichen Browser-Speicherbedarf.

## Bauen und prüfen

Aus dem Boxbert-Checkout:

```sh
# Assets sind versioniert; nur zum bewussten Neurendern nötig:
sh assets/tft/boxbert/render.sh
sh tools/tft/python-frames.sh assets/tft/boxbert/preview.py
sh tools/tft/python-frames.sh tools/tft/tests/test_frames.py
node tools/tft/build.mjs
node tools/tft/tests/sprite.mjs
node tools/tft/tests/fixtures.mjs
cd app
npm test
CHROMIUM_PATH=/pfad/zu/chromium node tests/tft-v2-browser.mjs
CHROMIUM_PATH=/pfad/zu/chromium node tests/tft-browser.mjs
CHROMIUM_PATH=/pfad/zu/chromium node tests/tft-lifecycle-browser.mjs
CHROMIUM_PATH=/pfad/zu/chromium node tests/tft-hosted-browser.mjs
```

Blender/Pillow werden separat gepinnt verwendet, nicht bei jedem App-Build
neu installiert oder gerendert. App-Build kompiliert den C++-Kern und kopiert
getrackte Frames nach `public/` und in Hosted-/SD-Build. Der Hosted-SW nimmt
WASM und Framepaket in seinen versionierten Offline-Shell-Cache auf.

Nachweise: [V2-Prüfbericht](../app/docs/verification-tft-v2.md),
[Asset-Reproduktion](../assets/tft/boxbert/README.md),
[V1-Rendervertrag](tft-rendering.md).

## Getrennt offen

Kein neuer ESP-Build, Flash oder Hardwarekontakt. Reale SPI-/SD-/Audio-/NFC-/
WLAN-Last, Heap/PSRAM, Helligkeit/Farbwirkung, Framerate und Boot/Sleep bleiben
bei der [Endinbetriebnahme](endinbetriebnahme.md). Die getestete Software und
Frameauswahl sind keine Hardware- oder Kindersicherheitsabnahme.
