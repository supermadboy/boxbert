# Testprotokoll — Etappe 7: Gesamtmonitor (Integrations-Test)

**Datum:** 07.10.2026
**Sketch:** `firmware/tests/etappe7_gesamtmonitor/` (separater Sketch;
Etappe-4-Player-Referenz bleibt im Repo unangetastet)
**Build:** `/tmp/boxbert-gesamt.xX7glw`, 2.063.667 Bytes (71 % Flash),
93676 Bytes Global vars (28 %), Hash verifiziert, Board-Defaults
(QSPI-PSRAM), Core 3.3.12.

## Umfang (was zusammen getestet wird)

Bewährtes aus vier Referenzen in einem Lauf:
- NFC/SD/Audio: Etappe-4-Player-Logik (SD 4 MHz, NFC-Pause 200 ms,
  Volume 6/21, Queue an Hauptloop)
- TFT: Etappe-0-Init (mit korrigierten Init-Parametern, siehe Findings)
- Fuel Gauge: onboard MAX17048 (Etappe Akku 1)
- WLAN-STA: Etappe-5-Muster (Secrets.h git-ignored)
Bewusst rausgehalten: Web-Upload (Etappe 5 separat bestanden), BLE,
Encoder, Buttons.

## Dokumentierte Abweichungen von der Etappe-4-Referenz

1. **NFC-Timeout 250 ms statt 0:** nötig, damit die NFC-Task periodisch
   zurückkehrt und der MAX17048 am geteilten Wire-Bus (SDA=IO3/SCL=IO4)
   drankommt. Mögliche Folge: bis 250 ms mehr Tag-Erkennungsverzögerung.
2. **Wire-Mutex** zwischen PN532 (NFC-Task) und Gauge (eigener Task,
   alle 2 s) — AGENTS-Regel zum Bus-Sharing, jetzt erstmals unter Last.
3. **NFC-Fehlertrennung:** "kein Tag im 250-ms-Fenster" und Busstoerung
   sind im Monitorbetrieb nicht unterscheidbar (beide → weiter pollen).
   Die Etappe-4-Abnahme (Timeout 0, harter Task-Stopp bei Fehler) deckt
   dieses Verhalten NICHT ab.

## TFT-Init-Fehler (vor der Bestätigung gefunden und behoben)

Erster Flash zeigte: Inhalt nur in Displaymitte, links/rechts gefleckte
Ränder, obere Zeilen fehlten. Ursache: `tft.init(240, 135)` setzt die
GRAM-Offsets falsch; richtig ist `init(135, 240)` (Portrait-Maße) laut
Lib-Beispiel `graphicstest_st7789`. Doku: `docs/findings.md`, Abschnitt
TFT. **Wichtig:** Die Etappe-0-Referenz nutzt denselben falschen
Aufruf — Abnahmebefund "TFT ok" nur eingeschränkt gültig.

## Beobachtungen (Nutzer, 07.10.2026)

- [x] TFT zeigt nach Korrektur alles wie gewünscht: Akkustand %, Lade-
  status, Spannung, WLAN (SSID/IP), aktuelles Lied, Lautstärke,
  STARTS/ERR/uptime. Nutzer: "sieht alles super aus und funktioniert
  alles, sehe alles wie gewünscht".
- [x] Musik via NFC-Tag läuft, Anzeige aktualisiert sich.

**Nicht gesichert / offen:**
- [ ] Tag-Wechsel-Verhalten unter Gauge-Last: Wie viele Wechsel, keine
  Zählerwerte notiert; keine Serial-Rohlogs gesichert.
- [ ] Akku-only-Betrieb (USB gezogen): Umsprung `+LÄDT` → `entlädt` auf
  dem TFT beobachtet? Nutzer-Hörtest am Akku?
- [ ] NFC-Erkennungsverzögerung mit Timeout 250 ms: subjektiv schneller/
  langsamer als Referenz? Nicht gemessen.
- [ ] Gauge-Werte plausibel gegen Multimeter gegengeprüft? Nein.

## Bewertung

- Integrations-Lauf (TFT + Gauge + WLAN + NFC + SD + Audio gleichzeitig)
  als Breadboard-Test bestanden laut Nutzerbeobachtung — **kein**
  Dauertest, keine 20-Wechsel-Abnahme, keine Produktreife.
- Abweichungen (NFC-Timeout, Wire-Mutex) sind im Sketch dokumentiert und
  müssen bei einer späteren Produktfirmware erneut bewertet werden.