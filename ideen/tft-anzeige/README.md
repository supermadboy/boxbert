# TFT-Anzeige

## Aktueller Stand · TFT V1 · 17.10.2026

Daddelbert hat DejaVu Sans und den Bau der spritefreien Basis bestätigt.
Die Vorschau verwendet nun einen gemeinsamen Arduino-freien C++-/WASM-
Pixelrenderer mit 240×135 RGB565, Bitmap-Schrift, Statussymbolen, Figur/Titel,
Zeit und Fortschritt. **Kein CSS-3D-Maskottchen in V1.** Die unten beschriebene
3D-Vorschau ist der historische Designstand; V2 soll später optionale echte
Geräteframes verwenden, nicht eine separate Browseranimation.

Native-/WASM-Pixelgleichheit, App-/Browserregressionen und echtes HTTPS samt
neuem Offline-Dokument sind geprüft: [aktueller V1-Nachweis](../../app/docs/verification-tft-v1.md).
Anzeigevertrag und Reproduktion: [TFT-Rendering](../../docs/tft-rendering.md).
**V1 abgeschlossen laut Daddelbert (18.10.2026); V2 jetzt beauftragt.**
ESP-Integration, Build/Flash und reale Geräte-/Lasttests bleiben separat bei
der Endinbetriebnahme dokumentiert. Daraus folgt kein neuer Hardware-Nachweis.

## Historische Vorschau-Freigabe · 16.10.2026

Daddelbert hat die Umsetzung einer vollständigen TFT-Vorschau direkt in der
bestehenden Boxbert-App freigegeben. Zunächst ausschließlich Beispieldaten,
keine Geräteverbindung und keine Änderung an Firmware oder echtem TFT.

- Schlicht, gut lesbar, dunkle Displayfläche mit heller Schrift.
- Figurenname und Songtitel; lange Songtitel laufen langsam als Laufschrift.
- Fortschrittsleiste mit vergangener Spielzeit und Gesamtdauer.
- Akku, Lautstärke und WLAN-Verbindung **innerhalb der TFT-Vorschau** sichtbar.
  Nutzerfeedback 16.10.: kompakte Smartphone-Symbole oben rechts, keine
  ausgeschriebenen Werte. Boxbert-Look ausdrücklich positiv bewertet.
  Icon-Geometrie für spätere C/C++-Übertragung gebündelt;
  [aktueller Nachweis](../../app/docs/verification-tft-statusbar.md).
- Boxbert als kleine dreidimensionale Box mit großen, ausdrucksstarken Augen
  und Persönlichkeit im Clippy-Stil. Dezentes Blinzeln, Wippen und neugieriges
  Drehen; zunächst keine Sprüche. Die erste ASCII-Idee wurde durch den
  ausdrücklichen 3D-Wunsch abgelöst.
- Browser-Vorschau dient dem direkten Designfeedback, nicht als Nachweis für
  flüssige 3D-Darstellung auf dem ESP. Reduced Motion berücksichtigen.

## Bestehender Hardwarestand und Grenzen

Akku und Lied sind im Etappe-7-Gesamtmonitor laut Nutzer bereits sichtbar.
Das ist noch nicht diese neue Oberfläche. Das Boarddisplay hat 240×135 Pixel;
Vorschau-Lesbarkeit und späterer Hardware-Renderweg sind getrennt zu prüfen.
Vorberechnete Animationsframes sind eine mögliche spätere Umsetzung, keine
bereits gebaute Funktion.

## Noch zu prüfen

- Browserdarstellung, Animationen und Bedienung geprüft: [TFT-Prüfbericht](../../app/docs/verification-tft.md).
- Designfeedback von Daddelbert.
- Für die spätere Geräteintegration: Titelquelle, Player-Zeit/Statusvertrag,
  Rendering/Schrift und tatsächliche Performance auf dem TFT.

## Nachweise

Bestehende Hardwareanzeige: [Etappe-7-Testprotokoll](../../docs/testprotokoll-etappe7.md).
Aktueller Ideenstatus ausschließlich im [Index](../README.md).
