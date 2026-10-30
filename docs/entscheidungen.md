# Aktuelle Entscheidungen — Boxbert

Stand: **19.10.2026**. Diese Datei beschreibt geltende Entscheidungen und
Begruendungen, nicht alte Auswahlentwuerfe. Vorhandene Teile/Mengen in
`hardware/BOM.md`, Pins in `hardware/pinout.md`, Arbeitsstand in `To-Do.md`.
Urspruengliche Entscheidungen bleiben im Archiv erhalten (siehe unten).

## Board und Kommunikation

**Adafruit ESP32-S3 Reverse TFT Feather, ADA5691**, 4 MB Flash / 2 MB PSRAM.
LiPo-Lader und Display onboard, PSRAM fuer Audio vorhanden. Breadboard-Referenzen
bleiben WLAN-only. **Freigabe 19.10.2026: Die neue Gesamtfirmware enthält BLE und
WLAN**, einschließlich bestehender PWA-Gerätefunktionen und Intro. D0 wechselt
BLE → aus → WLAN → BLE, Einschalt-/Wake-Startmodus BLE. WLAN versucht mit
privat vorgegebenen Zugangsdaten zuerst das Heimnetz und öffnet andernfalls
sein eigenes geschütztes AP. Android Chrome ist das Ziel für die BLE-PWA.

Die Integration setzt auf die bereits geprüfte Arduino-Basis: Core 3.3.12,
Board-Defaults/QSPI-PSRAM, Bibliotheken gepinnt. Der neue Softwarevertrag steht
in [firmware-api-v1.md](firmware-api-v1.md), Build und Nachweise in
[gesamtfirmware-build.md](gesamtfirmware-build.md) und `To-Do.md`.
Der Auftrag umfasst weder OTA noch eine Hardwareabnahme durch Crosscompile.
Die ältere Konzept-/Machbarkeitsrecherche bleibt als Hintergrund erhalten:
[BLE/WLAN](../ideen/ble-wifi-wechsel/machbarkeit.md). Ein großer SD-Speicher
ersetzt keinen Firmwareflash; Flash-/RAM-Grenzen werden am tatsächlichen
Gesamtbuild geprüft, nicht aus Laufzeitabschaltung von BLE abgeleitet.

## Audio

**MAX98357A I2S**, aktuell USB-5V. Getestetes Modul hat laut Protokoll
abweichendes Pinlayout; Bestellreferenz ADA3006 ersetzt nicht den
Silkscreen. SD/Mode an 3V3, GAIN offen. Ein **ADA3351 Gehaeuselautsprecher
4 Ohm / 3 W**, kein Vergleichspaar. Finale Amp-Versorgung (Akku oder
Boost) bleibt bis zum vorgesehenen Gehaeuse-/Versorgungstest offen.

Volume 6/21 ist die bestaetigte leise Etappe-4-Einstellung, kein akustischer
Normnachweis. Digitale Amplituden-/Volumegrenzen nicht mit festen dB(A)
gleichsetzen; Sicherheits-/Messplan in `docs/audio-safety.md`.

## NFC und Speicher

**PN532 per I2C statt SPI/HSU**, Etappe 4 als Breadboard-Meilenstein
abgenommen am 04.10.2026. Konkretes Modul neu mit UID-/Wechseltests und
SD-/Audio-Player reproduziert, optimierter Nutzer-Hoertest erfolgreich.

- PN532 I2C 100 kHz, DIP 1 ON / 2 OFF, Adresse 0x24, VCC 3V3.
- SD bleibt SPI, im Player 4 MHz. Anschlussplanung ab 30.10.2026:
  CS IO8 (A5), NeoPixel DIN IO10 für kurze SD-Leitungen; Gesamtfirmware
  angepasst, Gerätetest offen. Breadboard-Referenzsketche bleiben bei CS IO10.
  Kein gemeinsamer SD-/NFC-
  MISO. Onboard-TFT ist ein separates SPI-Geraet, im Player nicht bedient.
- Timeout-0-Lesen darf ohne Tag warten: nur in eigener NFC-Task, Queue
  zum Audio-Hauptloop, Erfolgs-Pause 200 ms. Weitere Wire-Clients spaeter
  synchronisieren, nicht parallel ungeschuetzt zugreifen.
- Exaktes UID→Dateipfad-Mapping, keine Tag-Beschreibung erforderlich.
  Gleiche UID ohne zwischenzeitlich andere UID startet nicht erneut;
  Entfernen stoppt nicht, kein automatischer EOF-Loop/Boot-Song/Fallback.
- HSU ohne Pegelwandler gesperrt: isoliert 4,1 V am TXD/SDA bei VCC=3,27 V.
  I2C-Ruhepegel laut Nutzer 3,3 V. Anderes Modul/Versorgung neu pruefen;
  VCC=3,3 V allein ist kein Signalpegel-Nachweis.

Karte: vorhandene Verbatim microSDHC **32 GB, FAT32**, externes MSD-AADP
mit Onboard-Regler und USB-5V-VCC. Akkubetrieb braucht eine separat
gepruefte 5-V-Versorgung fuer dieses SD-Modul (`docs/power-plan.md`).
Verbindliches Mapping `hardware/nfc-tags.md`, Abnahmeumfang/Quellen im
`docs/testprotokoll-etappe4.md`. Kein erfundener Dauer-/Produktnachweis.

## Bedienung, LED-Ansteuerung und Boost

Nur 5–8 Bedienelemente sollen echte Funktionen erhalten; Rest mechanisches
Busyboard. Aktuelle Mengen/Typen in der BOM. Zuordnung im Aufbau testen,
keine weiteren Buttons aus elektrischer Aehnlichkeit als abgenommen werten.

**AW9523/ADA4886 statt MCP23017**: I2C-Expander, externe Taster-Pull-ups,
LED-Konstantstrom-Senkenmodus. Am Feather VIN **3V3**, keine 5 V auf diese
Rail. AB30L5 sind 5-V-LED-Einheiten mit integriertem Vorwiderstand; dieser
bleibt erhalten. Direkte 5-V-Portansteuerung ist noch nicht freigegeben.
Zuerst GPIO-/Tastertest, dann Datenblatt-/Schaltplanpruefung und LED-Test.
**DT44L12-LEDs brauchen 12 V**; kein 12-V-Step-Up im bestaetigten Bestand.
Bei Bedarf Verhalten an kleinerer Spannung pruefen und dann entscheiden:
LED weglassen/geeignet umbauen oder Nachbestellung vorschlagen.

**TPS61023 MiniBoost/ADA4654 statt MT3608**: nominal 5,2 V, Enable mit
True Disconnect. Nur Verbraucher hinter seinem Ausgang werden getrennt.
Vor Ausbau Ausgang/Last pruefen; vorhandener Boost ist noch kein
fertiger Rail-Schaltplan. Keine ungepruefte 5,2-V-Versorgung an PN532.
LED-Port-/Rail-Freigaben und NeoPixel-Pegel/Strom in `docs/power-plan.md`.

## Akku und Stromsparen

Vorhanden: **LiPo 3,7 V / 3000 mAh mit Schutzschaltung**, SOL-333286,
JST-PH 2.0. **Akku zuletzt anschliessen**, vorher Polung gegen Feather
pruefen. USB-Breadboard-Erfolg ersetzt keinen Lade-/Akkubetriebs-/Sleep-Test.

Geplant: Deep Sleep, Auto-Sleep und Wake-Buttons auf RTC-GPIOs aus dem
Pinplan. Board-Richtwert ~40–50 uA ist kein gemessener Gesamtsystemstrom.
Hauptschalter zwischen Feather-EN/GND deaktiviert Board-Regler, Laden
ueber USB bleibt moeglich.

**Entscheidung (Nutzer, 07.10.2026):** PN532 bleibt dauerhaft am
3V3-Header, keine eigene Abschalt-Rail (fruehere Option A/MOSFET
verworfen). Begründung: Einfachheit; die Box wird regelmaessig per
Hauptschalter ausgemacht. **Bekannte Folge:** Im Auto-Sleep zieht der
PN532-Standby 10–13 mA weiter — bei 3000 mAh reicht der Akku im
Schlafzustand nur fuer ca. 10–12 Tage, nicht fuer Wochen (Rechnung,
keine Messung). Der Hauptschalter ist der eigentliche Null-Strom-Weg.

**Auto-Sleep-Trigger (Nutzer, 07.10.2026):** Deep Sleep nach 5 Minuten
ohne Interaktion — kein Lied laeuft (audio.isRunning false) UND kein
Button/Encoder seit dem letzten Ereignis. Tag auflegen zaehlt als
Interaktion (startet ja ein Lied). Encoder ist Endaufbau-Bauteil — auf
dem Breadboard testet nur der Button-Pfad.

**Wake-Quellen (Nutzerentscheidung „Hybrid", 07.10.2026):** Im Deep
Sleep weckt ein Tag den ESP32 NICHT (I2C-Geraete koennen nicht wecken).
Jetzt: Wake per Wake-Button (IO5/IO6), Tag-Erkennung erst nach dem
Aufwachen. Später: PN532-IRQ-Pin auf **IO11** (RTC-GPIO, reserviert)
legen + Low-Power-Card-Detection-Modus — dann weckt das Tag direkt.
IO11 ist dafür nicht als Wake-Button zu belegen (`hardware/pinout.md`).

## Gehäuse / Einzel-Mounts — Nutzerentscheidung 09.10.2026

**12 mm Pappelsperrholz**, Holzbox außen 250 × 180 × 110 mm, Deckel und
Boden abschraubbar. Pappel hält das Gehäuse leicht; weichere Oberfläche
und empfindlichere Schraubklemmung als bei Birke berücksichtigen.
Noch kein gebautes Gehäuse und keine Holzbeschaffung bestätigt.

Einzel-Mounts statt gemeinsamer Tray, mit regelmäßigem durchbrochenem
Gitterboden und einzelnen Abstandspfosten, keine Wände oder L-Auflage.
Step-Up: ein Schraubpfosten mit bündigem ruthex RX-M2,5×5,7 plus zwei
massive Stützpfosten mittig, weg von der gelöteten Anschlussreihe.

**Mount → Holz: 3 × 12 mm Senkkopf-Holzschraube**, kein metrisches M3.
Nur das Schraubloch-Polster des Step-Up-Mounts wird auf insgesamt 3,5 mm
verdickt; Gitter bleibt 2 mm. Nominal etwa 8,5 mm Holzeingriff bei
bündigem Kopf, 3,5 mm Reserve in 12-mm-Holz. Istmaße, Kopfpassung und
Halt am Reststück prüfen, von Hand anziehen und Bohrtiefe begrenzen.
Konkretes Fabrikat ist noch nicht ausgewählt/bestellt; CAD-Senkung
Ø 6,2 mm / 90° ist eine zu prüfende Konstruktionsannahme.

Zuschnitt, Deckel-/Bodenbefestigung und Innenleisten separat planen.
Aktuelle Step-Up-Senkkopf-Form vom Nutzer nach Vorschau ausdrücklich
positiv bewertet. **AW9523-Neustart am 09.10.2026 ausdrücklich beauftragt**,
nachdem der erste Expander-Entwurf verworfen wurde. Neuer Vorschlag mit
Gitter und gestuften Pfosten in `3d-print/mounts/aw9523-mount/`.
**Keine Nutzerentscheidung bislang** zu Unterseiten-Heat-Set-Montage
(statt oben bündig) und zwei Holzschrauben; diese Änderungen nur als
Konzeptvorschlag behandeln. Übergabe: `docs/mounts-weiterarbeit.md`.
Details/aktueller Entwurf:
`hardware/gehaeuse-konzept.md`, `3d-print/mounts/stepup-mount/README.md`.
Keine Druck-/Einbaufreigabe aus CAD-Erfolg oder digitalem Nutzerlob ableiten.

## Bestellprozess und Historie

**Daddelbert bestellt selbst**. Agenten recherchieren, aber keine
Warenkorb-/Checkout-/Veroeffentlichungsaktionen. Preise/Versand/Zoll mit
Datum und Quelle, Live-Zollregeln bei Nachbestellung neu pruefen.
`docs/bestellliste.md` ist Kaufhistorie, nicht aktueller Warenkorb;
`docs/preisvergleich.md` ist historischer Preisvergleich.

Der alte Entscheidungsstand mit 5480/MT3608/MCP23017/Vergleichspaar und
alten Versorgungsannahmen liegt in
`docs/archive/entscheidungen-vor-dokubereinigung-2026-10-04.md`.
Er ist keine aktuelle Bauanleitung. Aenderungen kuenftig mit Datum und
Begruendung festhalten; Beobachtungen/Messwerte nur in echte Testprotokolle.
