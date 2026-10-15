# NEOPS8 — Quellen und offene Maße

Recherche 15.10.2026 zum beauftragten Deckel-Mount, noch kein fertiger CAD-Entwurf.

## Nutzerauftrag

- NeoPixel-Stick oben am Deckel ganz hinten.
- DIN links **von außen auf Deckel/LEDs gesehen**, ausdrücklich bestätigt.
- Holzbefestigung im mittleren Bereich des Halters, nicht vorne und hinten
  wie beim Feather; Rückwand und Kabel berücksichtigen.
- Gemeinsames Modell für Druckhalter, CNC-Durchbruch und äußere Glasfalz.
  CNC nur von außen; keine Innentasche/Wendeaufspannung.
- Links/rechts der PCB-Lochseite bei DIN links ist noch am echten Teil zu klären.

## Tatsächlich eingesehene Quellen

[BerryBase NEOPS8](https://www.berrybase.de/neopixel-stick-mit-8-ws2812-5050-rgb-leds),
SKU NEOPS8, Produkttext abgerufen und Fotos angesehen:

> LED Abmessung: 5 x 5 x 1,50 mm
> Abmessungen ca.: 54 x 10,5 x 3,15 mm

Die letzte Angabe beschreibt das bestückte Modul, nicht ausdrücklich allein
PCB-Dicke oder Höhe der Lötstellen. Keine Nutzermessung.

- `shop-front.webp`: [unbeleuchtete LED-Seite](https://www.berrybase.de/media/da/5a/dc/1729395207/NeoPixelStickmit8WS28125050RGBLEDs-77021.webp?ts=1750795082).
- `shop-lit.webp`: [beleuchtete LED-Seite mit Kabeln](https://www.berrybase.de/media/cd/46/f9/1729395205/NeoPixelStickmit8WS28125050RGBLEDs-77022.webp?ts=1750795081).

Beide Original-Shopfotos sind hier unverändert als Quellenkopien gespeichert,
nicht als eigene technische Zeichnungen. Sichtbar sind zwei Befestigungslöcher
an einer **langen Kante**, ungefähr im Bereich zwischen zweiter/dritter bzw.
sechster/siebter LED. Nicht an den Stirnenden. Auf diesen Bildern keine
lesbare DIN-/DOUT-Beschriftung und keine bemaßte Lochzeichnung. Aus dem
beleuchteten Demo allein folgt keine eindeutige DIN-Orientierung.

## Vor fertigungstauglichem Modell offen

Foto des echten Moduls mit lesbarer DIN-/DOUT-Beschriftung und Lochseite;
Lochdurchmesser, Lochmittenabstand und Lage zur Platinenkante; tatsächliche
Löt-/Kabel-/Steckerüberstände. Kein Original-Adafruit-Lochbild ungeprüft für
diesen BerryBase-Stick übernehmen. M2,5-ruthex nicht durch mögliche M2-Löcher
zwingen. Die Shopbilder reichen nicht für eine Bohrfreigabe.

Die frühere Kernwertangabe „~10 mm LED-Abstand“ ist unplausibel: acht Zentren
hätten dann 70 mm Spannweite auf einem angeblich 54 mm langen Modul. Auch
„Löcher an den Enden“ sowie Ø2,1/M2 waren nicht durch eine Maßzeichnung belegt.
Es wurden noch keine STL/DXF exportiert oder Passungsprüfungen durchgeführt.
