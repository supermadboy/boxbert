# Ergänzende Internetrecherche — NEOPS8-Lochbild

15.10.2026. Daddelbert möchte die Maße jetzt nicht am eigenen Modul ermitteln;
die Recherche soll im Internet erfolgen. Kein neuer Messauftrag an ihn.

## BerryBase, genau NEOPS8

- [Produktseite](https://www.berrybase.de/neopixel-stick-mit-8-ws2812-5050-rgb-leds).
- [Shop-Datenblatt](https://www.berrybase.de/product-datasheet/019234a36695712787cdc8758755e76a/create).
  PDF tatsächlich abgerufen und mit Poppler `pdftotext -layout` gelesen:
  zwei Seiten, Seite 1 Produktbeschreibung/Technik, Seite 2 Produktbilder.
  Identität NEOPS8 / EAN 4251266701682; Modul ca. 54 × 10,5 × 3,15 mm,
  LED 5 × 5 × 1,50 mm. **Kein Bohrbild**, keine Lochdurchmesser/-abstände.
- Shopfoto erlaubt Orientierung, aber keine tolerierte Maßfreigabe.

## Adafruit: echte CAD-Daten, aber anderes Modul

[PCB-Repository](https://github.com/adafruit/NeoPixel-Sticks) tatsächlich geklont,
Revision `73d3e55379367ca0ef051d7c9a8b846b6948b21a`.
Originaldatei `Adafruit NeoPixel 8 Stick.brd` mit XML-Parser ausgewertet:

- Layer-20-Kontur 50,8 × 10,16 mm.
- Elemente U$2/U$3: `MOUNTINGHOLE_2.0_PLATED` bei (12,7; 8,128) und
  (38,1; 8,128) mm ab PCB-Ecke.
- Zugehöriges Package-Pad: Bohrwert `drill="2.2"`, Lötaugen-Ø 3 mm.
- Lochmittenabstand 25,4 mm; Abstand der Lochmitten zur nahen Längskante 2,032 mm.
- Die ausgewerteten Versionen `Adafruit NeoPixel 8 Stick v2.brd` und
  `NeoPixel Stick 8 WWA rev D.brd` haben ebenfalls Layer-20-Außenmaß 50,8 × 10,16;
  daraus folgt keine Gleichheit mit NEOPS8.

[Adafruit Produkt 1426](https://www.adafruit.com/product/1426) nennt
51,10 × 10,22 × 3,19 mm als Produktmaße und verlinkt die CAD-Dateien.
**Weder das abweichende Außenmaß noch Bibliothekskompatibilität belegen,
dass BerryBase NEOPS8 dasselbe Bohrbild besitzt.** Deshalb diese präzisen
Originalmaße nicht als bestätigte NEOPS8-Maße ausgeben.

## Recherchegrenzen

Suchmaschinenabrufe lieferten teils Anti-Bot-Seiten/HTTP 429/403, Bing zudem
inhaltlich unpassende Treffer trotz korrekter Suchbegriffe. Diese Ausgaben sind
keine technische Quelle. Fehlende Treffer belegen nicht die Nichtexistenz einer
Zeichnung; im geprüften BerryBase-PDF ist aber tatsächlich keine enthalten.

Ein aus dem Shopfoto abgeleitetes Raster wäre eine Entwurfsannahme, keine
Herstellerangabe. Noch keine endgültige Lochposition/Fräsfreigabe daraus.
