# Entscheidungen — Boxbert

Stand: 25.09.2026. Jede Entscheidung mit Warum und Konsequenz. Neue
Entscheidungen hier ergänzen, alte nicht auslöschen sondern mit Datum
überbieten.

## Board

**Adafruit ESP32-S3 Reverse TFT Feather** (Prod.-Nr. 5480, 4 MB Flash /
2 MB PSRAM).
- *Warum:* LiPo-Lader onboard (kein separates Lade-/Boost-Modul fürs
  Grundsystem), TFT als Statusdisplay, genug PSRAM für Audio-Puffer,
  Deep Sleep laut Adafruit ~40–50 µA.
- *Konsequenz:* Kein Bluetooth LE — passt nicht mehr in die 4 MB Flash,
  wenn WLAN + Audio + TFT drin sind. WLAN (HTTP vom ESP-Webserver) ist
  der einzige Kommunikationsweg zur App. NFC/SD/Audio teilen sich die
  SPI-Pins — Pinbelegung sorgfältig planen (`hardware/pinbelegung.md`).

## Audio

**MAX98357A** (I2S Class-D), versorgt direkt aus der Akkuspannung
(3,0–4,2 V).
- *Warum:* Standard-Breakout, kein zusätzliches Netzteil nötig, läuft
  mit 3,3 V-Logik problemlos.
- *Konsequenz:* Mit 3,0–4,2 V etwas leiser als mit 5 V. Gegenmassnahme
  bestellt: **MT3608 Boost-Modul auf 5 V mit Enable-Pin** — wird zuhause
  getestet. Wenn benutzt, versorgt es Verstärker und Button-LEDs; Enable
  hängt an einem GPIO, damit es im Deep Sleep abgeschaltet ist.

**Lautsprecher: 4 Ω / 3 W, zwei Größen zum Vergleich** (40 mm und 50 mm).
- *Warum:* Alter Lautsprecher ist entsorgt; Bass/Dynamik bei kleiner
  Öffnung im Holzgehäuse ist nicht vorhersehbar.
- *Konsequenz:* Entscheidung nach Hörtest, Einbaugröße im Gehäuse-Design
  für beide Größen offenhalten.

## NFC

**PN532-Modul**, Bus-Modus per DIP-Schalter (I2C/SPI/UART).
- *Warum:* Günstig, verbreitet, NTAG-kompatibel.
- *Konsequenz:* **SPI als Primärweg.** I2C hat am ESP32 Probleme mit dem
  Clock-Stretching des PN532. Vor dem ersten Anschließen: Pegel prüfen —
  es gibt 3,3-V- und 5-V-TTL-Varianten; nur die 3,3-V-feste ans Feather.
  Tags: **NTAG215**-Sticker (540 Byte, genug für URL/ID-Mapping).

## Speicher

**Externes microSD-Modul über SPI.**
- *Warum:* Feather hat keinen Slot; Audio von SD entlastet den Flash.
- *Konsequenz:* SD und PN532 teilen sich den SPI-Bus mit separaten
  CS-Pins — im Pinplan festzulegen.

## Akku

**LiPo 3,7 V, 2000–2500 mAh, mit Schutzschaltung (PCM), JST-PH 2.0.**
- *Warum:* Kindersicherheit hat Vorrang: nur Zellen mit Überspannungs-/
  Tiefentladungs-/Kurzschlussschutz. JST-PH passt direkt ans Feather.
- *Konsequenz:* **Polung vor dem ersten Anschließen gegen das
  Feather-Pinout prüfen** — JST-Stecker sind nicht polarisationsgenormt,
  verpolte LiPos zerstören den Lader.

## Bedienelemente

**Arcade-Buttons 24/30 mm (mit LED), Kippschalter, EC11-Drehencoder,
WS2812-LEDs.** Nur 5–8 Buttons bekommen echte Funktionen, der Rest ist
rein mechanisch (Busyboard-Gefühl fürs Kind).
- *Warum:* Das Kind soll "Vollausstattung" anfassen können; die
  Elektronik bleibt dahinter klein.
- *Konsequenz:* Button-LEDs an Akkuspannung (3,0–4,2 V) meist gedimmt,
  aber sichtbar; falls zu dunkel: 5 V über MT3608 (siehe Audio).
  Schalter selbst brauchen keine 5 V. Bei >~15 GPIO-Bedarf: **MCP23017**
  (I2C-Port-Expander) oder Tastenmatrix — Breakout ist als Option
  mitbestellt.

**44-mm-Button-LEDs brauchen 12 V.** Die DT44L12-LEDs sind laut Datenblatt
12-V-Version (die 30-mm-AB30L5 sind 5 V). Am Akku oder 5-V-Boost leuchten sie
vermutlich gar nicht oder nur sehr schwach — nach dem Breadboard-Test
entscheiden: kleinen 12-V-Step-Up nachbestellen oder die LED-Einheiten
ignorieren (Taster-Funktion bleibt unabhängig davon).

## Stromsparen

**Deep Sleep, Aufwachen per Button, Auto-Sleep nach Inaktivität.**
- *Warum:* Kindergerät wird eingeschaltet liegen gelassen; 40–50 µA
  statt Akku-Leerlauf schont Zelle und Spielabend.
- *Konsequenz:* Enable-Pins von Boost/LED-Power müssen im Schlaf sicher
  aus sein; Aufwach-Quelle (RTC-GPIO) im Pinplan reservieren.

## Bestellprozess & Zoll

**Daddelbert bestellt selbst — Agenten bestellen nie.** Recherche und
Warenkorb-Texte kommen von den Agenten, 1:1 zum Übertragen.
- *Warum:* Kontrolle über Ausgaben und Anbieter, keine automatisierten
  Käufe.
- *Konsequenz:* Bestellungen bündeln: **Zollpauschale 3 € pro Warenposition
  außerhalb EU (Stand: Angabe Daddelberts, seit 1.7.2026)**, ab November
  zusätzlich ~2 € Bearbeitungsgebühr pro Paket — vor jeder Bestellung auf
  zoll.de gegenprüfen. Nicht-EU nur, wenn EU-Shops das Teil nicht (besser)
  liefern.
