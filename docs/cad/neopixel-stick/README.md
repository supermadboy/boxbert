# NEOPS8 — Quellen und offene Maße

Recherche 15.10.2026 zum beauftragten Deckel-Mount, noch kein fertiger CAD-Entwurf.

## Nutzerauftrag

- NeoPixel-Stick oben am Deckel ganz hinten.
- DIN links **von außen auf Deckel/LEDs gesehen**, ausdrücklich bestätigt.
- Holzbefestigung im mittleren Bereich des Halters, nicht vorne und hinten
  wie beim Feather; Rückwand und Kabel berücksichtigen.
- Gemeinsames Modell für Druckhalter, CNC-Durchbruch und äußere Glasfalz.
  CNC nur von außen; keine Innentasche/Wendeaufspannung.
- Beim Shopmodul liegen bei DIN links von der LED-Seite gesehen die Löcher
  an der hinteren langen Kante (Kondensatorreihe hinten). Am echten Teil abgleichen.

## Tatsächlich eingesehene Quellen

[BerryBase NEOPS8](https://www.berrybase.de/neopixel-stick-mit-8-ws2812-5050-rgb-leds),
SKU NEOPS8, Produkttext abgerufen und Fotos angesehen:

> LED Abmessung: 5 x 5 x 1,50 mm
> Abmessungen ca.: 54 x 10,5 x 3,15 mm

Die letzte Angabe beschreibt das bestückte Modul, nicht ausdrücklich allein
PCB-Dicke oder Höhe der Lötstellen. Keine Nutzermessung.

- `shop-front.webp`: [unbeleuchtete LED-Seite](https://www.berrybase.de/media/da/5a/dc/1729395207/NeoPixelStickmit8WS28125050RGBLEDs-77021.webp?ts=1750795082).
- `shop-lit.webp`: [beleuchtete LED-Seite mit Kabeln](https://www.berrybase.de/media/cd/46/f9/1729395205/NeoPixelStickmit8WS28125050RGBLEDs-77022.webp?ts=1750795081).

Zusätzlich `shop-back.webp`: [Rückseite](https://www.berrybase.de/media/57/54/c3/1729395209/NeoPixelStickmit8WS28125050RGBLEDs-77020.webp).
Bei lesbarer Schrift und Lochreihe oben steht dort DOUT links und DIN rechts;
von der LED-Seite mit weiterhin oben liegender Lochreihe ist DIN somit links.
Auf der Unterseite sind keine aufgesetzten SMD-Bauteile erkennbar; das misst
nicht die späteren Nutzer-Lötstellen.

Die drei Original-Shopfotos sind hier unverändert als Quellenkopien gespeichert,
nicht als eigene technische Zeichnungen. Sichtbar sind zwei Befestigungslöcher
an einer **langen Kante**, ungefähr im Bereich zwischen zweiter/dritter bzw.
sechster/siebter LED. Nicht an den Stirnenden. Auf den LED-Bildern keine
lesbare DIN-/DOUT-Beschriftung und keine bemaßte Lochzeichnung. Die Orientierung
wird durch das separat geprüfte Rückseitenfoto belegt, nicht durch das Leucht-Demo.

## Vor fertigungstauglichem Modell offen

Ergänzende Internetrecherche samt tatsächlich geprüftem BerryBase-PDF und
Original-Adafruit-CAD: [internet-recherche.md](internet-recherche.md).
Das Original hat 25,4 mm Lochabstand und Ø2,2 mm, aber eine andere Außenkontur;
das ist **noch kein bestätigtes NEOPS8-Lochbild**. Daddelbert möchte momentan
nicht selbst messen; deshalb nicht erneut eine Messung als nächsten Schritt verlangen.

Zum gelieferten Modul fehlen weiterhin bestätigte Lochdurchmesser, Lochmittenabstand
und Lage zur Platinenkante sowie tatsächliche Löt-/Kabel-/Steckerüberstände.
Ein Nutzerfoto könnte später die Modulgleichheit abgleichen, ist aber jetzt
nicht zugesagt. Kein Original-Adafruit-Lochbild ungeprüft für
diesen BerryBase-Stick übernehmen. M2,5-ruthex nicht durch mögliche M2-Löcher
zwingen. Die Shopbilder reichen nicht für eine Bohrfreigabe.

Die frühere Kernwertangabe „~10 mm LED-Abstand“ ist unplausibel: acht Zentren
hätten dann 70 mm Spannweite auf einem angeblich 54 mm langen Modul. Auch
„Löcher an den Enden“ sowie Ø2,1/M2 waren nicht durch eine Maßzeichnung belegt.
Es wurden noch keine STL/DXF exportiert oder Passungsprüfungen durchgeführt.
