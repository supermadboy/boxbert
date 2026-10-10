# Machbarkeit: Funkmodi, BLE-Verwaltung und Weboberfläche

Recherche vom 10.10.2026 für **ADA5691, ESP32-S3, 4 MB Flash / 2 MB PSRAM**.
Auftrag: recherchieren und das Folgethema „PWA bauen“ vorbereiten; keine
Firmware implementieren, Partitionierung ändern oder Hardware flashen.

## Ergebnis und Empfehlung

Das Bedienkonzept ist auf Plattformebene plausibel: Der konkrete ESP32-S3
unterstützt WLAN und BLE, und Webseiten können aus Dateien auf der SD-Karte
bedient werden.[1][6] **Die vollständige Boxbert-Firmware mit BLE ist noch
nicht gebaut oder geprüft.** Eine Zusage „passt in den Speicher“ wäre falsch.

Empfohlene Architektur:

- Eine Firmware mit den bestätigten Modi Funk aus, WLAN und BLE; Start in BLE.
- WLAN und BLE auf der Box exklusiv aktivieren. Die Internetverbindung des
  Handys im BLE-Modus ist davon unabhängig.
- Ein gemeinsamer Frontend-Quellcode mit zwei Ausgabevarianten: lokale
  WLAN-Weboberfläche von SD und extern bereitgestellte HTTPS-PWA für BLE.
- Gemeinsame Fachfunktionen für RFID-Zuordnung, Dateien, Lautstärke und
  NeoPixel; HTTP und BLE sind nur verschiedene Transportwege.
- Sounds und Webdateien auf SD. Große Dateien blockweise übertragen, nicht
  vollständig im ESP-RAM sammeln. Upload zunächst nur bei gestoppter Musik.
- Vor dem eigentlichen PWA-Ausbau einen separaten Firmware-Buildvergleich
  durchführen. Falls echte Größen oder Laufzeittests nicht passen, Architektur
  und Updateverfahren neu entscheiden; keine Hardware vorsorglich austauschen.

## 1. Was auf welchem Gerät läuft

Der ESP32 führt C++-Firmware aus: Audio/NFC, WLAN-Webserver, BLE-Dienste,
Dateisystem und Verwaltungskommandos. HTML, CSS und JavaScript werden als
Dateien an den Browser geliefert; die Oberfläche und JavaScript laufen auf
**dem Handy**, nicht als React-/Node-Server auf dem ESP32.

Für die externe BLE-PWA liefert ein HTTPS-Host die Webdateien. Anschließend
spricht der Browser lokal mit dem BLE-Dienst der Box. Die Box braucht dafür
weder Internetzugang noch eine Verbindung zu diesem Host.

Eine rein statische Bereitstellung der PWA ist der empfohlene Einstieg.
Ein ständig laufender eigener Backend-Prozess ist nicht allein wegen der
Oberfläche nötig. Online-Soundquellen, Benutzerkonten oder ein Katalog mit
serverseitiger Verarbeitung wären zusätzliche, getrennte Anforderungen.

## 2. Speicher: Flash, RAM und SD getrennt betrachten

Adafruit nennt für genau dieses Board 4 MB Flash, 2 MB PSRAM und 512 KB SRAM;
der S3 unterstützt BLE, **nicht Bluetooth Classic**.[1] Diese BLE-Verwaltung
ist deshalb nicht der separate Bluetooth-Lautsprecher-/A2DP-Modus.

- **Flash:** Firmwarecode, Konstanten, Bootloader, Partitionstabelle und
  persistente Daten. SD erweitert den ausführbaren Firmware-Slot nicht.
- **Interner RAM:** laufende Tasks, Stack, Treiber und geeignete Arbeitsbuffer.
  Die nominelle Chipgröße ist nicht der freie Heap der Anwendung.
- **PSRAM:** zusätzlicher Arbeits-/Audiopuffer, kein weiterer Firmware-Flash.
  ESP-IDF beschreibt Beschränkungen und einen reservierten internen Pool für
  bestimmte Buffer; PSRAM ist nicht für jede interne Allokation ein Ersatz.[9]
- **SD:** Sounds, fertig gebaute HTML/CSS/JS-Dateien, optionale Bilder und
  größere Datensätze. Dateien müssen nicht vollständig in RAM passen.

### Tatsächlich dokumentierte Boxbert-Größen

Aus [Etappe 5](../../docs/testprotokoll-etappe5.md), nicht neu gemessen:

- Letzter dort bezifferter WLAN-/mDNS-Build: **2.133.003 Bytes Firmware**,
  **96.444 Bytes globale Variablen**.
- Der frühere Build meldete ein Anwendungslimit von **2.883.584 Bytes**.
  Das entspricht der TinyUF2-No-OTA-App-Größe der Core-Partitionstabelle.[3]
  Die aktuell auf der Hardware verwendete Partitionstabelle ist damit noch
  nicht direkt ausgelesen oder aus einem vorhandenen Buildartefakt verifiziert.
- Globale Variablen aus der Compile-Ausgabe sind **kein Laufzeit-Heap-Nachweis**.
- Im aktuellen Etappe-5-Quellcode umfasst das eingebettete HTML/CSS/JS-Literal
  **2.363 UTF-8-Bytes**, durch Quelltextauswertung bestimmt. Es erklärt nicht
  die Firmwaregröße im Megabyte-Bereich. Die exakte Einsparung eines SD-Umbaus
  wäre erst durch einen neuen Build nachzuweisen.

### Reale Partitionierungsoptionen im Arduino-Core 3.3.12

Die folgenden Zahlen wurden aus den abgerufenen CSV-Dateien berechnet.
Reserve ist Slotgröße minus dokumentierter Etappe-5-Firmwaregröße;
**BLE und spätere Funktionen sind darin noch nicht enthalten**.

| Partitionierung | App-Größe in Bytes | Rechnerische Reserve | Konsequenz |
|---|---:|---:|---|
| TinyUF2 4MB No OTA | 2.883.584 | 750.581 | Ein Haupt-App-Slot, zusätzlicher UF2-Bereich; kein gewöhnliches Zwei-Slot-OTA.[3] |
| Huge APP | 3.145.728 | 1.012.725 | Ein App-Slot, kein gewöhnliches Zwei-Slot-OTA; anderes Layout.[5] |
| Minimal SPIFFS mit OTA | 1.966.080 je Slot | −166.923 | Der dokumentierte WLAN-Build passt bereits ohne BLE nicht hinein.[4] |

Schon zwei Kopien des dokumentierten Builds sind zusammen **4.266.006 Bytes**,
also **71.702 Bytes mehr als 4 MiB**, noch ohne Bootloader, NVS und weitere
Daten. Gewöhnliches Zwei-Slot-OTA benötigt daher Optimierung oder einen anderen
späteren Entwurf. SD-gehostete Webdateien lösen diese Codegrößenfrage nicht.
Das betrifft auch die frühere [SD-/Update-Idee](../sd-boot/README.md).

Die Board-Menüs bieten diese Layouts ausdrücklich an.[2] Es wurde **keine
Partitionierung ausgewählt oder geändert**. Größeres App-Layout und sicherer
Updateweg sind gemeinsam zu entscheiden; nicht für etwas mehr Platz
stillschweigend OTA oder Wiederherstellung opfern.

### BLE-Stack und RAM-Empfehlung

**NimBLE-Arduino** ist ein sinnvoller erster Kandidat: Das Projekt nennt den
ESP32-S3 als unterstützt und geringeren Ressourcenbedarf gegenüber dem
Bluedroid-basierten Arduino-BLE-Stack.[8] Das ist keine konkrete Einsparzahl
für Boxbert. Version und Kompatibilität mit Core 3.3.12 müssen im Testbuild
festgehalten werden.

Als Startkonfiguration eine Handy-Verbindung und nur benötigte BLE-Rollen
anstreben. Die Bibliothek bietet Konfigurationen für Verbindungszahl, MTU und
Rollen.[14] Keine globale Bibliothek blind patchen; wirksam verwendete
Buildkonfiguration nachweisen.

Laufzeittest muss mindestens freien internen Heap, kleinsten freien Heap,
größten zusammenhängenden Block, PSRAM und Task-Stack-Reserven erfassen:
Boot, Audio+NFC, BLE-Verbindung, WLAN, Upload sowie wiederholte Moduswechsel.
Die aktuelle Toolchain und USB-Hardware liegen auf Daddelberts Rechner; hier
ist `arduino-cli` nicht installiert. Deshalb wurde kein neuer Build oder
RAM-/Funk-/Audio-Hardwaretest durchgeführt.

## 3. HTML, JavaScript und CSS von SD ausliefern

**Ja.** Das offizielle `SDWebServer`-Beispiel des verwendeten Arduino-Cores
öffnet eine Datei mit `SD.open(...)` und liefert sie mit
`server.streamFile(...)` aus.[6] `WebServer` bietet außerdem
`serveStatic(..., fs::FS&, ...)` und `streamFile(...)`.[7]

Vorgeschlagene Ablage: `/www/index.html` und `/www/assets/` auf SD;
Musik getrennt davon. Das Frontend wird vorab am Rechner gebaut, nicht auf
Boxbert. Die Firmware liest und sendet Dateien in begrenzten Buffern.

Für eine Umsetzung erforderlich:

- Korrekte MIME-Typen, Routen für `index.html`, Cache-Header und gegebenenfalls
  vorkomprimierte Assets; keine Annahme, dass jede Kompression automatisch geht.
- Nur den Webordner ausliefern; Pfadtraversal und Zugriff auf Konfiguration,
  temporäre Uploads oder beliebige SD-Dateien verhindern.
- API und Webdateien versionieren, damit ein neuer SD-Webbuild nicht
  unbemerkt mit einer alten Firmware unvereinbar wird.
- Kleinste Fehler-/Recovery-Seite in Flash empfehlen, wenn SD fehlt oder
  Webdateien defekt sind. Damit ist die vollständige UI noch nicht verfügbar.
- SD-Zugriffe mit Audioplayer und Upload koordinieren. Das Vorhandensein
  eines Bibliotheksbeispiels beweist keine störungsfreie Parallelität.
- Große Uploads zunächst wie Etappe 5 nur bei idle Audio erlauben. Für die
  laufende Wiedergabe sind erst echte Lasttests notwendig.

Die historischen 8.3-Dateinamenshinweise im Beispiel werden hier nicht als
verbindliche Grenze für unsere SD/Core-Kombination übernommen. Der aktuelle
Projektcode nutzt schon längere MP3-Dateinamen; konkrete Asset-Namen und
Filesystem-Verhalten sind bei der Umsetzung zu prüfen.

## 4. Funkmodi und D0

Bestätigtes Konzept siehe [Ausarbeitung](README.md). Konkreter Vorschlag:

| Modus | Box-Verhalten | Verwaltung |
|---|---|---|
| Funk aus | WLAN und BLE stoppen, Audio/NFC weiter | Nur lokale Bedienung |
| WLAN | BLE stoppen; Heimnetz versuchen, bei Fehlschlag geschütztes eigenes AP starten | Lokale SD-Weboberfläche über HTTP |
| BLE | WLAN stoppen; BLE-Dienst bewerben | HTTPS-PWA auf Android Chrome |

Start: BLE. D0 schaltet zyklisch; TFT zeigt Funkmodus, WLAN-Unterzustand,
Verbindung und Fehler. D0 ist laut [Pinbelegung](../../hardware/pinout.md)
GPIO0/BOOT: kein Festhalten beim Reset als normale Bediengeste vorsehen.

Als Architektur eine ereignisgesteuerte Zustandsmaschine, keine blockierenden
Warteschleifen im Audiopfad. WLAN-Timeout, gespeicherte Zugangsdaten, AP-Passwort
und Verhalten nach Verlust eines bereits verbundenen Heimnetzes festlegen.
Automatische Hintergrundsuche aus dem AP ist nicht entschieden; sie darf
bestehende Uploads nicht unerwartet abbrechen. IP muss auch ohne mDNS sichtbar
sein. Captive Portal ist Komfort, keine Voraussetzung der ersten Version.

Arduino dokumentiert Station-/AP-Funktionen und das Stoppen/Neustarten von
WLAN.[11] NimBLE-Arduino enthält `init` und `deinit`; die konkrete fehlerfreie
Mehrfachumschaltung ist trotzdem auf unserer Version zu testen.[13]

**Wichtig:** Controller-Memory-Release ist nicht normales Abschalten.
Espressif warnt, dass freigegebener Bluetooth-Controller-Speicher im selben
Bootzyklus nicht wiederhergestellt werden kann.[10] Beim Umschalten darf keine
solche irreversible Freigabe stattfinden, wenn BLE später wieder starten soll.

ESP-IDF beschreibt auch WLAN/BLE-Koexistenz auf dem S3 mit gemeinsamem Funk
und Zeitscheiben; die SoftAP-Kombinationen sind nicht sämtlich als stabil
bewertet.[12] Für das gewünschte exklusive Modusmodell ist Koexistenz zunächst
nicht nötig. Eine Firmware enthält trotzdem beide Codepfade im Flash.

Uploads und Moduswechsel brauchen eine klare Regel: Während eines Transfers
Moduswechsel sperren oder kontrolliert abbrechen und Teilstand behandeln.
Nicht einfach die Verbindung abschneiden und die Datei als erfolgreich zeigen.

## 5. BLE-PWA und Dateitransfer

### Browser und Offline-Betrieb

Chrome dokumentiert BLE-GATT-Zugriff auf Android: Charakteristiken lesen und
schreiben, Notifications empfangen und Disconnects erkennen. Die API benötigt
einen sicheren Kontext und die Geräteauswahl einen Nutzerklick.[15] „BLE beim
Boot bereit“ bedeutet daher nicht, dass eine unbekannte Webseite die Box ohne
Handlung des Nutzers automatisch verbindet.

Die externe PWA wird über HTTPS geladen. Ein Service Worker kann die für
Offline-Bedienung benötigten Dateien cachen; MDN verlangt dafür einen sicheren
Kontext und nennt `localhost` als Entwicklungs-Ausnahme.[16] Die lokale
Box-IP auf dem Handy ist **nicht** dessen `localhost`. Die normale
HTTP-Weboberfläche von SD ist deshalb ein eigenständiger lokaler Bedienweg,
nicht automatisch eine offline-fähige Web-Bluetooth-PWA.

Offline-Verfügbarkeit braucht vorab ein erfolgreiches Laden und Caching.
Erstbesuch ohne erreichbaren Host funktioniert nicht; gelöschte App-Daten oder
verlorener Cache sind ein eigener Fehlerfall. Kein dauerhaft garantierter
Offline-Speicher allein durch die Bezeichnung PWA. Caching, Neustart und
Versionswechsel müssen in Chrome auf Daddelberts Handy geprüft werden.

### Sound direkt aus dem Internet auf die Box

Empfohlener Datenweg: Der Browser lädt den Sound und sendet Binärblöcke per
GATT an die Box, die auf SD schreibt. Die Box benötigt dabei kein WLAN.
„Ohne manuelles Speichern“ heißt nicht, dass keine Daten auf dem Handy
gepuffert werden. Das konkrete Download-/Puffermodell muss Dateigröße,
Handyspeicher und Wiederaufnahme berücksichtigen.

Web Bluetooth stellt keinen fertigen Dateiupload bereit. Die API kann
Byte-Arrays in eine Charakteristik schreiben, beispielsweise mit
`writeValueWithResponse`, dessen Ergebnis ein Promise ist.[17] Das Projekt
muss daraus ein Transferprotokoll bauen:

- Transfer starten mit Dateiname, Größe, Format und Transferkennung.
- Begrenzte Blöcke mit eindeutigem Offset/Sequenz senden, Größen passend zur
  ausgehandelten Verbindung und Browser-API wählen; keine feste hohe MTU
  oder theoretische Funkrate als garantierte Nutzdatenrate behandeln.
- Anfangs bestätigte Writes und serielle Verarbeitung empfehlen. Spätere
  schnellere Writes benötigen zusätzliche Flusskontrolle und Empfangsbestätigung.
- BLE-Callbacks nur kurz halten; SD-Schreibaufträge durch eine begrenzte Queue
  abarbeiten. Rückstau/volle Queue als Protokollzustand behandeln.
- Fortschritt anhand bestätigter Empfangs-/Schreibstände, nicht gesendeter
  Browserbytes anzeigen. GATT-Bestätigung ist nicht automatisch dauerhaftes
  Speichern auf SD.
- Temporäre Zieldatei, Größen-/Integritätsprüfung und erst danach Freigabe als
  Musikdatei. Abbruch, Reset, voller Speicher, Doppelupload und Wiederaufnahme
  ausdrücklich definieren. Hash schützt Dateiintegrität, ersetzt keine Anmeldung.
- Erst kleine Dateien übertragen, dann repräsentative Sounds testen; kein
  belastbarer Durchsatz oder Uploadzeitwert für Boxbert vorhanden.

Wenn die Soundquelle auf einer anderen Domain liegt, muss sie das Lesen durch
Frontend-JavaScript per CORS erlauben. Ohne geeignete Freigabe ist beliebiges
Herunterladen aus einer fremden Seite nicht garantiert.[18] Ein eigener
Katalog mit passenden Headers ist der einfache Einstieg. Ein Download-Proxy
wäre zusätzlicher Serverbetrieb und müsste Ziel-URLs begrenzen; nicht als
notwendige Voraussetzung jeder PWA einplanen.

### Externe PWA zusätzlich über WLAN verbinden?

Das ist ein möglicher späterer Komfortweg, aber nicht die Baseline.
Cross-Origin-HTTP-Zugriff braucht eine passende API-Freigabe.[18] Chrome
beschreibt zudem eine Local-Network-Access-Berechtigung und bestimmte
Mixed-Content-Ausnahmen für lokale Ziele; es ist also weder „immer unmöglich“
noch durch ein CORS-Header allein gelöst.[19] Genaue Unterstützung und
Berechtigungsdialoge in der verwendeten Android-Chrome-Version testen.

Empfehlung bleibt: Im WLAN-Modus die lokal geladene UI mit gleichnamiger API
nutzen; im BLE-Modus die externe/cachende HTTPS-PWA mit GATT. Gemeinsamer Code
muss nicht bedeuten, dass alle Herkunfts-/Sicherheitsregeln identisch sind.

### Zugriffsschutz

Die Chrome-Geräteauswahl schützt den Nutzer vor ungefragtem Webseitenzugriff,
beweist aber nicht, dass ein BLE-Client zur Verwaltung der Box berechtigt ist.
Eine sichtbare Box darf nicht beliebigen Personen Schreibzugriff geben.

Als noch abzustimmendes Konzept eine Erstfreigabe mit auf dem TFT gezeigtem
Code oder anderer physischer Bestätigung, danach gespeicherter Berechtigung.
Transportverschlüsselung/Pairing und Anwendungsberechtigung bewusst prüfen;
kein bloßer Gerätename als Identitätsnachweis. Start mit BLE-Bereitschaft
bleibt dabei möglich. WLAN/AP-Passwörter und lokale Verwaltung benötigen
ebenfalls Schutz; HTTP im Heimnetz ist keine verschlüsselte Ende-zu-Ende-
Verbindung. Keine Verwaltung nach außen freigeben.

## 6. Gemeinsames Verwaltungsmodell

Folgende Firmware-Funktionen werden für beide Bedienwege benötigt; Namen und
HTTP-Routen sind erst bei der Umsetzung festzulegen:

- Status und Fähigkeiten: Firmware-/Protokollversion, Modus, Verbindung,
  SD-Zustand und unterstützte LED-/Audio-Einstellungen abfragen.
- RFID: zuletzt erkanntes Tag anzeigen, bekannte Zuordnungen lesen und neue
  Zuordnung speichern. Etappe 5 verwaltet nur zwei bekannte UIDs; frei
  hinzufügbare Tags sind eine Firmware-Erweiterung, keine reine PWA-Funktion.
- Dateien: begrenzte/paginierte Liste, Upload starten, Fortschritt, Abschluss
  und Abbruch. Löschen/Ersetzen nur nach ausdrücklicher Bedienbestätigung.
- Lautstärke und NeoPixel: aktuellen Wert lesen, gültige Einstellungen ändern,
  validieren und nach gewünschter Persistenz speichern. Zulässige Lautstärke
  wird auf der Box erzwungen, nicht nur durch einen Slider begrenzt.
- WLAN-Konfiguration: Für eine alltagstaugliche Variante Zugangsdaten geschützt
  konfigurieren können, statt dauerhaft nur den lokalen Etappe-5-`Secrets.h`-
  Build zu verwenden. Ob Erstkonfiguration über BLE oder Box-AP erfolgt,
  bleibt eine Entscheidung. Secrets niemals in Browserlogs/Git ausgeben.
- Einheitliche Fehlermeldungen und korrelierbare Antwortkennungen; eine
  geänderte PWA muss Versionsinkompatibilität erkennen können.

Bei BLE bieten sich getrennte Charakteristiken für Befehle, Antworten/
Status-Notifications und Binärtransfer an. Das ist ein Entwurf, keine bereits
vorhandene UUID-/API-Spezifikation. Notifications für Tag-Erkennung und
Fortschritt ersparen ständiges Polling; die PWA muss verlorene Verbindungen
und eine erneute Anmeldung trotzdem behandeln.

## 7. Umsetzungsreihenfolge und Abnahme

Diese Reihenfolge ist ein Vorschlag für einen späteren Bauauftrag:

1. Unveränderte Referenz in separatem Build neu bauen, Partitionstabelle und
   Größen sichern. Keine bestehenden erfolgreichen Sketches umbauen.
2. Separater Minimalversuch mit NimBLE, einem Kommando und Statusantwort;
   Größe des Gesamtbuilds mit Audio/SD/NFC/WLAN bestimmen.
3. Auf echter Hardware D0-Zustandsmaschine, WLAN-Fallback und wiederholte
   BLE-/WLAN-/Aus-Wechsel testen, ohne zunächst Dateien zu übertragen.
4. Lokale UI aus SD ausliefern und HTTP-API für die benötigten Funktionen
   bereitstellen; ohne externen Host prüfen.
5. HTTPS-PWA auf Android Chrome: BLE-Verbindung, Zugriffsschutz, gleiche
   Fachkommandos und Offline-Neustart der zuvor geladenen App prüfen.
6. BLE-Dateitransfer klein beginnen und bis zur vereinbarten maximalen
   Soundgröße erweitern: Integrität, Durchsatz, Abbruch, voller SD-Speicher,
   Wiederaufnahme und erfolgreicher Audio-Test der Zieldatei.
7. Online-Katalog/Downloads, UI-Update/Versionsprüfung und Energieverbrauch
   ergänzen; keine Produktreife aus einem einzelnen gelungenen Upload ableiten.

Die dokumentierten Nutzungswünsche sind der Zielumfang, keine Abnahme. Vor
Implementierung noch Festlegungen zu Zugriffsfreigabe, Transferratenziel,
Soundquellen, Offline-Speicherung, WLAN-Timeout und Updateverfahren treffen.

## Sources

[1] https://www.adafruit.com/product/5691
[2] https://raw.githubusercontent.com/espressif/arduino-esp32/3.3.12/boards.txt
[3] https://raw.githubusercontent.com/espressif/arduino-esp32/3.3.12/tools/partitions/tinyuf2-partitions-4MB-noota.csv
[4] https://raw.githubusercontent.com/espressif/arduino-esp32/3.3.12/tools/partitions/min_spiffs.csv
[5] https://raw.githubusercontent.com/espressif/arduino-esp32/3.3.12/tools/partitions/huge_app.csv
[6] https://raw.githubusercontent.com/espressif/arduino-esp32/3.3.12/libraries/WebServer/examples/SDWebServer/SDWebServer.ino
[7] https://raw.githubusercontent.com/espressif/arduino-esp32/3.3.12/libraries/WebServer/src/WebServer.h
[8] https://raw.githubusercontent.com/h2zero/NimBLE-Arduino/master/README.md
[9] https://docs.espressif.com/projects/esp-idf/en/stable/esp32s3/api-guides/external-ram.html
[10] https://docs.espressif.com/projects/esp-idf/en/stable/esp32s3/api-reference/bluetooth/controller_vhci.html
[11] https://docs.espressif.com/projects/arduino-esp32/en/latest/api/wifi.html
[12] https://docs.espressif.com/projects/esp-idf/en/stable/esp32s3/api-guides/coexist.html
[13] https://raw.githubusercontent.com/h2zero/NimBLE-Arduino/master/src/NimBLEDevice.cpp
[14] https://raw.githubusercontent.com/h2zero/NimBLE-Arduino/master/src/nimconfig.h
[15] https://developer.chrome.com/docs/capabilities/bluetooth
[16] https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
[17] https://developer.mozilla.org/en-US/docs/Web/API/BluetoothRemoteGATTCharacteristic/writeValueWithResponse
[18] https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS
[19] https://developer.chrome.com/blog/local-network-access
