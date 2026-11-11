# Step-Up standardmäßig aus — Vorschlag, noch nicht aufgebaut

Stand 11.11.2026. Nutzerziel: normaler Betrieb, nach fünf Minuten ohne
Nutzung Deep Sleep, mit Hauptschalter noch geringerer Verbrauch. Der Amp
hängt laut aktueller Nutzerbestätigung am Step-Up-Ausgang, nicht an BAT.
Der vorhandene Hauptkippschalter hat drei Anschlüsse und bleibt zwischen
Feather-EN und GND. Keine Firmware oder reale Verdrahtung durch diese
Dokumentation geändert; keine gemessenen Ruheströme zugesagt.

## Quellen und elektrische Prüfung

- [Adafruit-Schaltplan](https://raw.githubusercontent.com/adafruit/Adafruit-TPS61023-PCB/master/Adafruit%20TPS61023.sch):
  R1 = 100 kΩ zwischen VIN und EN. Eagle-Netzliste per Node direkt gelesen
  und Wert sowie beide Netze geprüft; der Original-Pull-up darf bleiben.
- [TI TPS61023 Datenblatt](https://www.ti.com/lit/ds/symlink/tps61023.pdf),
  Abschnitt 6.5: EN-Low-Abschaltschwelle mindestens 0,35 V;
  Einschalten oberhalb 1,2 V. True Disconnect im Shutdown.
- [ESP32-S3 Datenblatt](https://documentation.espressif.com/esp32_s3_datasheet_en.pdf),
  DC Characteristics: GPIO-Eingangspegel maximal VDD + 0,3 V. Daraus keine
  pauschale Freigabe für Rückspeisung bei ausgeschaltetem Chip ableiten;
  die externe Beschaltung muss EN niedrig halten und real geprüft werden.

## Vorgeschlagene Verdrahtung

Ein externer **3,3-kΩ-Widerstand, Toleranz höchstens 5 %**, zwischen
**EN und GND am TPS61023-Step-Up**. Kein Widerstand am Feather-EN!
Step-Up-EN bleibt mit Feather **9 / IO9** verbunden; gemeinsame Masse.
Der Hauptschalter bleibt nur an Feather-EN/GND. EN-Leitungen nicht verbinden.
Die GPIO-Leitung nicht mit einem weiteren Schalter direkt gegen GND kurzschließen.

Rechnung mit dem vorhandenen 100-kΩ-Pull-up:

- Feather aus/IO9 hochohmig: EN = VIN × 3,3 / 103,3.
- Bei VIN = 4,2 V: EN nominal 0,134172 V; bei ungünstigen ±5-%-
  Widerstandstoleranzen höchstens 0,147799 V.
- Selbst bei VIN = 5,5 V und denselben Toleranzen höchstens 0,193546 V.
  Damit rechnerisch unter 0,35 V und unter 0,3 V bei VDD = 0.
- Nur der Widerstandsteiler zieht bei 4,2 V nominal 40,658 µA. Das ist
  **nicht** der gesamte Ausschaltverbrauch von Feather/Lader/Gauge/Boost.
- IO9 aktiv HIGH: zusätzlicher Pull-down-Strom nominal 1 mA bei 3,3 V.
- Ein einzelner 10-kΩ-Pull-down ist hier nicht ausreichend abgesichert:
  nominal 0,381818 V bei 4,2 V, oberhalb der kleinsten Abschaltschwelle.

Die Rechnungen wurden mit Node.js ausgeführt, einschließlich der genannten
Toleranzecken. Sie ersetzen weder Leckstrom-/Rückspeisemessung noch die
Abnahme am realen Board. Keine Aussage über Abschaltzeit oder Gesamtstrom.

## Firmware zuerst berücksichtigen

Im geprüften aktuellen Repo-Stand `58208da` ist
`commissioning::BoostControl=false` und `commissioning::AutoSleep=false`
in `firmware/Config.h`. Der dokumentierte Flash
`boxbert-v1-commissioning-20261111` ist ein Inbetriebnahmestand.
`Hardware::begin()` lässt IO9 deshalb als Eingang. Mit dem vorgeschlagenen
Pull-down wäre der Step-Up dann auch bei eingeschaltetem Feather AUS.
**Daher nicht jetzt einfach anlöten oder Auto-Sleep als aktiv voraussetzen.**

Vor Einbau muss ein separat geprüfter Build die Boost-Steuerung aktivieren:
IO9 beim Start vor SD-/Audioinitialisierung HIGH, vor Deep Sleep LOW und
gehalten, nach Aufwachen wieder aktiv. Erst nach Hardwareprüfung den
gewünschten Auto-Sleep aktivieren und dessen Zeitverhalten am Gerät prüfen.
Keine Flagänderung, kein Build und kein Flash Teil dieser Recherche.

## Reale Abnahme vor Nutzung

1. USB und Akku zum Löten trennen. Widerstandswert und Netze stromlos prüfen.
2. Firmware und Pull-down gemeinsam kontrolliert in Betrieb nehmen; Versorgung
   des Step-Up für einen Test bewusst sicherstellen. Der vorhandene Plan nimmt
   Step-Up-IN am Akku an; aus USB allein keine Versorgung dieses Eingangs ableiten.
3. Feather an: IO9/EN muss HIGH sein; Boost-Ausgang unter Last messen und
   Amp, SD und NeoPixel auf korrekte Versorgung prüfen.
4. Hauptschalter aus: Feather-3V3 und Step-Up-EN gegen GND messen. Ziel
   EN unter 0,2 V, nach Entladung der Ausgangskondensatoren keine weiter
   aktive Boost-Versorgung. Rückspeisung über sämtliche Signalleitungen
   ausschließen. Bei Abweichung nicht weiterbetreiben.
5. Nach Firmwarefreigabe Deep Sleep und Wake prüfen: Boost aus im Schlaf,
   wieder an vor SD-/Audiostart. Den 5-Minuten-Wunsch tatsächlich testen.
6. Gesamt-Akkustrom in Betrieb, Deep Sleep und Schalter-Aus getrennt messen.
   Nicht den Widerstandsteilerstrom als Gesamtverbrauch ausgeben.

Physische Batterieabtrennung ist dies nicht; Laden über USB bleibt möglich.
Für Arbeiten an der Verdrahtung reichen weder Deep Sleep noch Feather-EN.
