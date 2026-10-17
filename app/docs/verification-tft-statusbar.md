# Smartphone-Statusleiste · 16.10.2026

Historischer CSS-/SVG-Zwischenstand, durch den gemeinsamen C++-/WASM-Renderer
in V1 abgelöst. Aktuelle Nachweise: [TFT-V1-Prüfbericht](verification-tft-v1.md).
Die unten beschriebenen 3D-Bewegungen gehören zur alten Vorschau, nicht zu V1.

Release: https://habibi.supermittel.com/boxbert/?stand=tft-statusbar-9

## Nutzerfeedback und Umsetzung

Daddelbert bewertet Boxbert und die TFT-Vorschau positiv. Akku, Lautstärke und
WLAN sollen aber wie beim Handy als kompakte Statusleiste oben rechts erscheinen,
nicht als ausgeschriebene Beschriftungen. Das ist umgesetzt: Lautsprecher mit
Pegel-Andeutung, WLAN-Bögen und gefüllte Batterie. Werte bleiben als SVG-Titel
und Screenreader-Beschriftung erreichbar. Die sichtbare TFT-Fläche enthält
keine Texte wie „Akku 78 %“ oder „WLAN verbunden“ mehr. Das DEMO-Kennzeichen
bleibt links oben, der Hinweis auf feste Beispieldaten unter der Vorschau.

## Spätere C-/C++-Übertragung

Die Symbole stehen in `app/src/tft-status-icons.json`: jeweils 24×14 logische
Pixel, ausschließlich numerische Koordinaten für Rechtecke, Kreise, Polylinien
und Polygone. Kein Icon-Font, keine externen Bilder, kein SVG-Path-Parser und
keine CSS-Effekte für die Statussymbole. React zeichnet genau diese Geometrie
als SVG. Für C/C++ können dieselben Koordinaten als konstante Tabellen übernommen
und mit den Zeichenprimitiven einer TFT-Bibliothek gezeichnet werden. Die JSON
muss dabei nicht zur Laufzeit auf dem ESP eingelesen werden.

Statusleiste auf dem 240×135-Display: oben 5 px, rechts 7 px; drei 24×14-Symbole
mit je 5 px Zwischenraum. Farben: hell `#eff6ff`, inaktiv `#526373`, Akku-Füllung
`#82e3c2`. Die feste Vorschau zeigt 78 % Akku, 35 % Lautstärke und WLAN verbunden;
keine echten Messwerte. Die Gerätefirmware muss diese Werte später liefern
und passende Füllstände/Zustände zeichnen. Das ist hier noch nicht implementiert.

Auch Textlayout und Fortschrittsleiste sind grundsätzlich einfach nachzuzeichnen.
**Das CSS-3D-Maskottchen ist nicht direkt nach C übersetzbar.** Dafür bleibt ein
separater Renderweg nötig, beispielsweise vorberechnete Frames; Speichermenge,
Bildrate und Gesamtfirmware müssen am Gerät geprüft werden. Kein pauschales
Plug-and-play- oder Performanceversprechen.

## Echte Prüfungen

- TDD-Browser-Rotlauf: Gruppe „Gerätestatus · Beispieldaten“ fehlte erwartungsgemäß.
  Nach Implementierung derselbe Test grün.
- `npm test`: 48 Tests bestanden, darunter Primitive-/Koordinatengrenzen aller
  drei Icons und beide Buildvarianten.
- `tests/tft-browser.mjs` gegen echtes HTTPS bestanden: Icons mit verständlichen
  zugänglichen Werten, keine ausgeschriebenen sichtbaren Statuswerte, Platzierung
  oben rechts, alle Displayregionen enthalten, übrige TFT-Bedienung und
  Reduced Motion sowie Light/Dark und 320/390/1280 px.
- `tests/tft-hosted-browser.mjs`: echte HTTPS-Screenshots, sichtbar veränderte
  3D-Drehung, neues Offline-Dokument mit TFT-Vorschau, keine JS-/HTTP-Fehler
  oder ESP-Anfragen.
- `tests/ux-browser.mjs` gegen echtes HTTPS: alle vier Reiter bei drei Breiten
  und beiden Themes, Fixed-Bar und bestehende Daten-/Offline-Abläufe bestanden.

Screenshots: [Display](tft-statusbar-ui/display-dark.png),
[Handy](tft-statusbar-ui/preview-mobile-dark.png),
[Desktop](tft-statusbar-ui/preview-desktop-dark.png).
Testumgebung wie im [vorigen TFT-Bericht](verification-tft.md); keine neuen
Pakete oder Systemkonfigurationen für diese Änderung. Keine Firmware geändert
oder geflasht, keine C-Implementierung oder echte TFT-Performance geprüft.
