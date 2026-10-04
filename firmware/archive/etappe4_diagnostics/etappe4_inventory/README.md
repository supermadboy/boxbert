# Etappe 4 — neue Bestandsaufnahme (ohne Audio)

## Zweck und Status

Nur bestaetigter Ausgangspunkt laut Nutzer: Tag-Lesen ueber I2C hat
funktioniert. Die bisherige kombinierte Musik-Firmware ist verworfen;
Dateipfade, zwei konkrete UIDs und Musik-Integration werden neu geprueft.

04.10.2026: API/Pinpruefung und Kompilierung erfolgreich. Nach
Nutzerbestaetigung des Aufbaus geflasht, Upload-Hashes verifiziert und
Sketch per Serial-Hilfe identifiziert. Neuer Live-Test: PN532 FW 1.6,
SAMConfig und endliche Suchversuche erfolgreich; SD-Dateiliste gelesen
(7 Dateien im Wurzelverzeichnis). **Beide Tag-UIDs noch zu erfassen;
kein Audiotest.** Spaeterer Tag-1-Versuch ohne UID; erneute
Initialisierung fand keine I2C-Adressen und keine Firmwareantwort.
Ursache offen; dieser Sketch reproduziert den frueheren Tag-Leseerfolg
noch nicht. Auch nach USB-Power-Cycle blieb die zweite Tag-Abfrage
erfolglos. Daher auf den unveraenderten `etappe4_nfc_i2c`-Einzeltest
zurueckgewechselt; dort nach weiterem Power-Cycle Tag 1 neunmal in
12 Sekunden erkannt (E3:2F:F6:33, 4 Bytes). Inventory NICHT als
funktionierende NFC-Grundlage uebernehmen. Ergebnisse:
`docs/testprotokoll-etappe4.md`.

Keine Audio-Library, keine Tag-Schreibkommandos, kein Schreiben auf die
SD-Karte. Die festen Liedzuordnungen werden spaeter in der Firmware
gespeichert, nicht auf Verdacht auf die Tags geschrieben.

## Verdrahtung vor dem Flashen bestaetigen

Pins aus `hardware/pinout.md`, erneut gegen lokale Board-Definition
(Core 3.3.12) geprueft. Nur USB, Akku ab. Stromlos umstecken.

- PN532: VCC an 3V3, GND an GND, SDA an IO3, SCL an IO4.
  DIP 1 ON / 2 OFF. IRQ/Reset offen; keine PN532-SPI-/UART-Leitungen.
  Nur 3,3-V-kompatible Signalpegel am Feather; alte Messprotokolle sind
  keine neue Pegelmessung dieses Aufbaus. HSU-TXD nicht direkt anschliessen.
- SD-Modul: VCC an USB-5V, GND an GND, CS an IO10,
  SCK an IO36, MISO an IO37, MOSI an IO35. Karte steckt im Modul.
- Audio-Verkabelung muss fuer diesen stummen Test nicht erweitert werden.

## Bedienung (Serial 115200)

Jeder Befehl funktioniert auch ohne Zeilenumbruch. Hilfe mit `h` erneut
abrufbar, wenn die Boot-Ausgabe verpasst wurde. Keine automatische
Peripherie-Initialisierung ohne Befehl.

1. `n`: I2C-Scan (100 kHz), Firmwareversion, SAMConfig, endliche
   PN532-Suchversuche. Adressen allein identifizieren keine Chiptypen.
2. `d`: SD-Dateiliste, inklusive voller Pfade und Dateigroessen.
   SD explizit mit 1 MHz. Verzeichnisse bis Tiefe 12, maximal 256
   Eintraege; Limitmeldungen beachten. Wiederholung mit `d` moeglich.
3. Nur Tag 1 auflegen, `1` senden: maximal ca. 20 s suchen, eine UID
   mit Laenge ausgeben. Tag danach entfernen.
4. Nur Tag 2 auflegen, `2` senden. Beide UIDs zur Kontrolle erneut lesen.
5. Nutzer waehlt anhand der echten Dateiliste: Tag 1 → Liedpfad A,
   Tag 2 → Liedpfad B. Keine unbekannte UID als Ersatz fuer Tag 2 verwenden.

Die PN532-API meldet bei erfolglosem Lesen nur `false`; kein Tag,
ACK-/Antwortfehler und Timeout sind damit nicht sauber unterscheidbar.
Der Host-Timeout ist keine harte Laufzeitgrenze fuer den gesamten Aufruf.
Dieser Test ist **kein** Audio- oder Clock-Stretching-Stresstest.

## Build

```bash
arduino-cli compile \
  --fqbn esp32:esp32:adafruit_feather_esp32s3_reversetft \
  firmware/tests/etappe4_inventory
```

Board-Defaults verwenden, kein `PSRAM=opi`. Gepruefte Bibliotheken:
Adafruit PN532 1.3.4, Adafruit BusIO 1.17.4; SPI/SD/Wire aus ESP32-Core
3.3.12 (Kompilieraufloesung). Build 04.10.2026: 457204 Bytes Flash,
56344 Bytes globale Variablen. Nur erfolgreich neu kompilierte Binaries
flashen; vor Upload Verdrahtung mit Nutzer abstimmen.
