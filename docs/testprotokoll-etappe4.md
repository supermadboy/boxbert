# Etappe 4 — PN532: Testprotokoll

## Abschluss — BESTANDEN als Breadboard-Meilenstein, 04.10.2026

Nutzer bestaetigt nach Optimierung: **„hoertest war auch super. ich denke
das passt fuers erste“** und gibt Aufraeumen, Commit und Abschluss frei.
Damit Etappe 4 fuer den vereinbarten Zwei-Tag-/Zwei-Lied-Aufbau abgenommen.

- Aktuell geflasht: `firmware/tests/etappe4_tag_player/`, SD **4 MHz**,
  NFC **I2C 100 kHz**, Erfolgs-Pause **200 ms**, Timeout 0 in eigener
  Task, Volume **6/21**, USB-only. Keine Firmwareaenderung beim Aufraeumen.
- Tag 1 `E3:2F:F6:33` → `/arcade-music-loop.mp3`, Tag 2 `01:8C:F1:6E`
  → `/happy-tune.mp3`. Hoerbarer Wechsel und kein Neustart bei gleicher
  UID bestaetigt; optimierter Hoertest ebenfalls erfolgreich.
- Happy Tune intern UID→stream-ready **5499→1555–1562 ms**, Arcade
  **1369–1372 ms**. Rohlogs in `docs/serial/`; keine physische
  Auflege→erster-Ton-Messung, keine akustische Normpruefung.
- Host-UID-Test, Board-Compile und Upload-Hashes erfolgreich; im letzten
  Kurzlog vier vollstaendige Wechselstarts, START_ERRORS 0.
- **Abnahmegrenze:** Kein Nachweis fuer 20 kontrollierte Wechsel/
  Minutenlast, separat beobachtetes Entfernen/EOF, unbekanntes Tag auf
  Hardware oder Player-Kaltstart ohne Tag. Diese Tests sind auf Wunsch
  spaetere Haertung (`To-Do.md`), keine behaupteten Testerfolge. NFC-only-
  Kaltstarttest und Host-Test fuer unbekannte UIDs sind separat belegt.
- V1 ohne Entfernen-Event: dieselbe UID startet auch nach Neuauflegen
  nicht erneut ohne zwischenzeitlich andere UID. Keine Tagbeschreibung,
  kein Fallback-/Boot-Lied, kein WLAN-/Button-Zusatz.

Aktive Referenzen: `firmware/tests/README.md`. Verworfene Diagnosen unter
`firmware/archive/etappe4_diagnostics/`, v1 und Timing-Zwischenstaende
unter `firmware/archive/etappe4_tag_player_v1/`. Alte Quellpfade unten
bezeichnen den damaligen Ort; .ino-Dateien archiviert als .ino.txt.
Verbindlicher I2C-Pinplan `hardware/pinout.md`; alte Plaene nur noch in
`docs/archive/pinout-etappe4-legacy.md`. **Naechster Schritt: Etappe 5.**

## Neue Bestandsaufnahme — chronologische Verifikation, 04.10.2026

**Nutzerkorrektur zu Beginn:** Nur funktionierendes Tag-Lesen ueber I2C
war zu diesem Zeitpunkt vom Nutzer bestaetigt. Die nachfolgenden Arbeiten des vorherigen Agenten am
kombinierten Sketch wurden nicht vom Nutzer kontrolliert/bestaetigt.
Alte Eintraege unten sind historische Aufzeichnungen, keine neue
Verifikation des aktuellen Aufbaus. Insbesondere keine bestaetigte
NFC-/SD-/Audio-Integration daraus ableiten.

Neues Ziel: zwei konkret ausgelesene Tags fest mit zwei tatsaechlich auf
der Karte gefundenen Liedpfaden verbinden. Zu Beginn waren UIDs und
Dateipfade unbekannt; Dateipfade inzwischen neu gelesen (siehe Live-Test).
Beide Tags inzwischen neu mehrfach gelesen: Tag 1 `E3:2F:F6:33`,
Tag 2 `01:8C:F1:6E` (jeweils 4 Bytes). Liedzuordnung vom Nutzer bestaetigt:
Tag 1 → `/arcade-music-loop.mp3`, Tag 2 → `/happy-tune.mp3`.
Im Verlauf unten im neuen Player implementiert und mit Nutzer getestet;
nicht aus den alten kombinierten Agenten-Sketches uebernommen.
Verbindliche Uebersicht: `hardware/nfc-tags.md`.

Neu direkt geprueft (04.10.2026, ab ca. 20:01):

- Feather als `/dev/ttyACM0` mit Adafruit-USB-Kennung sichtbar.
- PC-Kartenleser meldet keine eingesteckte Karte (`sda` 0 B);
  `~/sd-card` ist nicht gemountet. SD-Inhalt nicht am PC untersucht.
- 12 Sekunden Serial passiv gelesen: keine Ausgabe. Laufender Sketch
  nicht identifiziert; kein Reset und kein Upload ausgefuehrt.
- Kombinierter Sketch aus aktiven Tests entfernt, nur historisch als
  `firmware/archive/etappe4_tag_music/etappe4_tag_music.ino.txt` abgelegt.
- Neuer stummer Diagnose-Sketch `firmware/tests/etappe4_inventory/`:
  befehlsgesteuerter I2C-/PN532-Test, lesende SD-Dateiliste mit vollen
  Pfaden, getrennte UID-Erfassung fuer Tag 1/2. API gegen installierte
  Adafruit-PN532-1.3.4-Beispiele/Treiber und Core-SD_Test geprueft;
  Pins gegen `hardware/pinout.md` und lokale Board-Definition geprueft.
- Compile erfolgreich: Core 3.3.12, Board-Default-FQBN
  `esp32:esp32:adafruit_feather_esp32s3_reversetft`, 457204 Bytes Flash,
  56344 Bytes globale Variablen. **Nicht geflasht, Hardwaretest offen.**

### Neuer Live-Test nach Nutzerbestaetigung — 04.10.2026

Nutzer bestaetigt USB-Betrieb ohne Akku, PN532 im funktionierenden
I2C-Aufbau (SDA IO3, SCL IO4, DIP 1 ON / 2 OFF), Karte im SD-Modul.

- Diagnose erneut erfolgreich kompiliert (457204 Bytes Flash), dann
  `/dev/ttyACM0` geflasht. Upload erfolgreich, Datenhashes verifiziert.
- Laufenden Sketch danach per Befehl `h` eindeutig identifiziert:
  `BOXBERT ETAPPE4 INVENTORY v1 — KEIN AUDIO`.
- Befehl `n`: I2C-Scan bei 100 kHz findet 0x24 und 0x36. PN532 antwortet
  mit Firmware 1.6; `SAMConfig()` und
  `setPassiveActivationRetries(0x00)` liefern Erfolg. Ausgabe `NFC bereit`.
  Das ist ein neuer Chip-/Initialisierungstest, noch kein neuer UID-Test.
- Befehl `d`: SD erreichbar bei explizit 1 MHz, Kartengroesse
  **31266439168 Bytes**. Vollstaendige Dateiliste (7 Eintraege, keine
  Unterverzeichnisse gefunden):

  | Vollstaendiger Pfad | Dateigroesse (Bytes) |
  |---|---:|
  | `/arcade-music-loop.mp3` | 549988 |
  | `/pups01.mp3` | 10702 |
  | `/test440.mp3` | 13209 |
  | `/test880.mp3` | 13209 |
  | `/subbasesoft.mp3` | 48180 |
  | `/happy-tune.mp3` | 642028 |
  | `/fart.mp3` | 23461 |

Alle Dateien liegen im Wurzelverzeichnis der Karte. Nachgewiesen sind
Dateipfade und Groessen, nicht Decode, Dateiintegritaet oder hoerbare
Wiedergabe. Die beiden beabsichtigten Lieder und deren Zuordnung waehlt
der Nutzer; keine Auswahl automatisch uebernommen.

**Aktuell geflasht:** `etappe4_tag_player` v1-timing (Zwei-Tag-
Musiktest, Volume 6, eigene NFC-Task, **SD 4 MHz / NFC-Pause 200 ms**),
optimierter Stand ab ca. 21:20; erster Player-Flash ca. 20:54. Referenzen
`etappe4_nfc_i2c`/`etappe4_nfc_switch` unveraendert. Beide Tags erfasst;
Liedzuordnung bestaetigt und implementiert. Erste Player-Logs zeigen
zwei connecttoFS-Erfolge, UID-Wechsel und aktiven Happy-Tune-MP3-Stream.
**Nutzer bestaetigt hoerbare Wiedergabe, Liedwechsel und keinen Neustart
bei erneut aufgelegter gleicher UID.** Geschaetzte Wechselzeit ca. 5 s;
Inzwischen intern gemessen/optimiert: UID→stream-ready ca. 1,37–1,56 s
statt 5,499 s fuer Happy Tune; keine physische Auflege→Ton-Messung.
Optimierter Hoertest spaeter bestaetigt; Breadboard-Abnahme siehe oben.
Weitere Tests/Dauertest als spaetere Haertung offen.

### 04.10.2026, ca. 20:11–20:12 — erste Tag-1-Erfassung fehlgeschlagen

- Nutzer meldet `tag 1 bereit`. Laufenden Sketch erneut mit `h`
  identifiziert, dann Befehl `1` gesendet. Nach ca. 20 s:
  `TAG 1: Keine UID erfasst. Das ist kein Beweis fuer einen I2C-Busfehler.`
- Einmalige erneute Initialisierung per `n`, ohne Flash oder
  Umverdrahtung: Scan gibt **keine einzige Adresse** aus, auch nicht
  die zuvor gefundenen 0x24/0x36. Danach:
  `FEHLER: keine PN532-Firmwareantwort`.
- Keine weitere UID-Abfrage ausgefuehrt, weil die Initialisierung
  scheiterte. Sketch setzt `nfcReady` dabei auf false. USB-Serial-Port
  weiterhin vorhanden. Keine neue elektrische Messung.
- Ursache offen: kein Nachweis fuer Tagdefekt, Bus-Lockup,
  Clock-Stretching oder konkreten Sketchfehler. Neuer Diagnose-Sketch
  reproduziert den vom Nutzer bestaetigten I2C-Leseerfolg bislang nicht.
- Naechster Schritt: Tag entfernen, Nutzer zieht USB fuer ca. 5 s und
  steckt wieder ein (Akku weiterhin ab, kein Umstecken von Leitungen),
  dann Chip-/Buszustand neu pruefen. Keine weiteren Flashversuche.

### 04.10.2026, ca. 20:14 — Kommunikation nach USB-Power-Cycle wieder da

- Nutzer meldet nach angefordertem USB-Power-Cycle ohne Tag `bereit`.
- Per `h` denselben Inventory-Sketch identifiziert, kein neuer Flash.
- Einmal `n` gesendet: Scan findet wieder **0x24 und 0x36**;
  Ausgabe `PN532, Firmware 1.6` und `NFC bereit`. SAMConfig und
  endliche Suchversuche erfolgreich.
- Damit ist die Chip-/Buskommunikation wieder nachgewiesen, **keine
  Tag-UID erfasst**. Der Power-Cycle beseitigte den beobachteten
  Ausfall fuer diesen Initialisierungstest; seine Ursache bleibt offen.
- Naechster Schritt: Tag 1 erneut einzeln auflegen und einmal erfassen.

### 04.10.2026, ca. 20:16–20:17 — erneuter UID-Fehlschlag, Rueckwechsel zum Einzeltest

- Nutzer meldet `tag 1 liegt`. Nach vorher erfolgreicher Initialisierung
  genau einmal Befehl `1` im Inventory-Sketch gesendet. Erneut nach ca.
  20 s keine UID. Keine erneute Initialisierung/Scan-Schleife versucht.
- Eigener Inventory-Sketch weicht vom bisherigen I2C-Einzeltest ab:
  zusaetzlich `setPassiveActivationRetries(0x00)`, Host-Timeout 150 statt
  500 ms, expliziter Wire-Timeout, Reset-Sentinel 255 statt Dummy 254.
  **Keine dieser Abweichungen ist als Ursache nachgewiesen.**
- Findings vor weiterer Fehlersuche gelesen; bestehenden Einzeltest und
  installierten Treiber geprueft. Unveraenderten
  `firmware/tests/etappe4_nfc_i2c/etappe4_nfc_i2c.ino` frisch kompiliert
  und einmal geflasht (404864 Bytes Flash, 56152 Bytes globale Variablen;
  Core 3.3.12, Board-Defaults, Adafruit PN532 1.3.4). Upload erfolgreich,
  Hashes verifiziert. Quelldatei nicht veraendert.
- Danach 12 s Serial gelesen: viermal
  `FEHLER: PN532 antwortet nicht (DIP auf I2C? SDA/SCL vertauscht?)`.
  Das ist die Firmware-Abfrage-Fehlermeldung des Einzeltests, **kein
  Nachweis fuer falsche DIP-Stellung/Verkabelung**. Kein UID-Erfolg.
- Seit der zweiten fehlgeschlagenen Inventory-Abfrage noch kein
  USB-Power-Cycle; Flash/Feather-Reset schaltet den PN532 nicht stromlos.
  Naechster Schritt: USB ca. 5 s abziehen, Tag 1 fuer den nun automatisch
  lesenden Einzeltest liegen lassen, danach einmal Serial lesen.
- Inventory fuer SD-Bestandsaufnahme erfolgreich, **nicht als bewiesene
  Grundlage fuer NFC-Taglesen oder Musik-Firmware verwenden**.

### 04.10.2026, ca. 20:20 — Tag 1 im unveraenderten I2C-Einzeltest erkannt

- Nutzer meldet `bereit` nach angefordertem USB-Power-Cycle mit
  aufgelegtem Tag 1. Kein neuer Flash, keine Quellcodeaenderung.
- 12 Sekunden Serial rein lesend beobachtet: **neunmal dieselbe UID**
  und dazwischen der wiederholte Bereitschaftsstatus:

  ```text
  Tag UID (4 Bytes): E3:2F:F6:33
  PN532 bereit (I2C) — NTAG215 auflegen
  ```

- **Tag 1 = E3:2F:F6:33, UID-Laenge 4 Bytes**, mehrfach neu bestaetigt.
  Der feste Hinweistext `NTAG215 auflegen` ist keine Typidentifikation;
  fuer diesen Tag kein NTAG215-Nachweis und keine neue SAK-Messung.
- I2C-Taglesen auf diesem Aufbau nun selbst reproduziert. Als Referenz
  den unveraenderten `etappe4_nfc_i2c` verwenden; keine zusaetzliche
  Retry-Konfiguration/kurzen Timeouts aus Inventory uebernehmen.
- Der erfolgreiche Rueckvergleich grenzt die eigene Inventory-Variante
  als Problemfall ein; er identifiziert **nicht** eine einzelne Ursache.
- Naechster Schritt: Nutzer entfernt Tag 1, legt nur Tag 2 auf und meldet
  `Tag 2 liegt`; danach dessen UID mehrfach passiv erfassen. Keine Musik
  und noch keine bestaetigte Liedzuordnung.

### 04.10.2026, ca. 20:22 — Tagwechsel auf Tag 2 noch ohne UID

- Nutzer meldet `tag 2 liegt` nach Anweisung, Tag 1 zu entfernen und
  Tag 2 allein aufzulegen. Kein Neustart, kein Flash, kein Serial-Befehl.
- 12 s Serial passiv gelesen: viermal
  `PN532 bereit (I2C) — NTAG215 auflegen`, **keine UID**.
- Der Bereitschaftstext wird aus dem in setup() gesetzten Status
  wiederholt; er ist kein aktueller erfolgreicher Bus-/Chiptest.
- Ursache offen: weder Tagdefekt/Inkompatibilitaet noch blockierter
  Leser/Tagwechselproblem nachgewiesen. Tag 2 nicht zugeordnet.
- Naechster isolierter Vergleich: USB-Power-Cycle bei weiterhin allein
  aufgelegtem Tag 2; unveraenderten Einzeltest direkt ab Kaltstart mit
  diesem Tag beobachten, wie zuvor bei erfolgreichem Tag-1-Test.

### 04.10.2026, ca. 20:24 — Tag 2 ab Kaltstart erkannt

- Nutzer meldet `bereit` nach angefordertem USB-Power-Cycle mit allein
  aufgelegtem Tag 2. Kein Flash/Codewechsel.
- 12 s Serial rein lesend beobachtet: **neun gleiche UID-Ausgaben**:

  ```text
  Tag UID (4 Bytes): 01:8C:F1:6E
  ```

- **Tag 2 = 01:8C:F1:6E, 4 Bytes**, mehrfach bestaetigt und eindeutig
  verschieden von Tag 1. Kein Tagtyp aus UID-Laenge allein bestimmt.
- Beide Tags damit ueber I2C am selben Aufbau lesbar, jeweils mit Tag
  auf dem Leser beim Kaltstart. Der zuvor erfolglose Wechsel von Tag 1
  zu Tag 2 ohne Neustart ist **nicht** dadurch als bestanden anzusehen.
  Tagwechsel/Polling-Verhalten bleibt eigenes offenes Problem; Ursache
  noch nicht identifiziert. Keine weiteren Debug-/Flashversuche jetzt.
- Dateipfade und beide UIDs in `hardware/nfc-tags.md` gebuendelt.
  Vorschlag zur Nutzerbestaetigung: Tag 1 → `/arcade-music-loop.mp3`,
  Tag 2 → `/happy-tune.mp3`. Noch nicht als Firmware-Zuordnung umgesetzt.
- Naechster Schritt: Liedzuordnung bestaetigen lassen, dann gemeinsam
  ueber neue minimale Musik-Firmware und Etappenabschluss sprechen.

### 04.10.2026, ca. 20:26 — feste Liedzuordnung bestaetigt

- Nutzer bestaetigt vorgeschlagene Tabelle mit `yes ist gut`:
  `E3:2F:F6:33` → `/arcade-music-loop.mp3`,
  `01:8C:F1:6E` → `/happy-tune.mp3`.
- Bestaetigung in `hardware/nfc-tags.md` und To-Do nachgezogen.
  Kein neuer Sketch/Flash, kein Audio- oder weiterer Hardwaretest.
- Naechster Plan: zuerst Tagwechsel im NFC-Einzeltest klaeren, dann
  neue minimale Musik-Firmware mit diesen exakten Zuordnungen; keine
  Wiederverwendung des verworfenen kombinierten Sketches.

### 04.10.2026, ca. 20:30–20:34 — Wechseltest vorbereitet und erste UID-Aenderung beobachtet

- Nutzer bestaetigt den vorgeschlagenen Plan inklusive Verhalten:
  Lied einmal durchspielen, Entfernen stoppt nicht, anderes bekanntes
  Tag wechselt. Zusatzbefund des Nutzers: Live-Tagwechsel hatte frueher
  schon funktioniert, damaliger Code unbekannt. Das ist eine
  Nutzerbeobachtung, keine neue Messung und kein Grund fuer Buswechsel.
- Codepruefung Adafruit PN532 1.3.4: `readPassiveTargetID()` sendet
  Suchbefehl, wartet auf ACK/Antwort; `waitready(timeout)` liefert bei
  Host-Timeout false. In diesem Rueckweg kein explizites PN532-Abbruch-
  Kommando. Erneuter Aufruf schreibt neuen Suchbefehl. Ueberlappung mit
  noch laufender Suche als **Hypothese**, nicht bewiesene Fehlerursache.
- Separater Sketch `etappe4_nfc_switch`: wichtigste Versuchsaenderung
  Host-Timeout 500 → **0** (API-Default, Bibliotheksbeispiel `readMifare`).
  Sonst Referenz-Init und Erfolgs-Pause beibehalten; keine Retry-/RF-
  Konfiguration/Library-Patches. Diagnose UID-/Lese-/Wechselzaehler;
  bei false stoppen statt weiter Befehle senden. Ohne Tag absichtlich
  blockierend, nicht fuer den spaeteren Audio-Hauptloop geeignet.
- Compile 405136 Bytes Flash, 56168 Bytes globale Variablen, Core 3.3.12,
  Board-Defaults. Ein Upload auf `/dev/ttyACM0`, Hashes verifiziert.
- Danach 10 s Serial passiv gelesen, genau diese zwei Ereignisse:

  ```text
  TAG1 | UID E3:2F:F6:33 | LEN 4 | READS 1 | SWITCHES 0 | NEUE UID
  TAG2 | UID 01:8C:F1:6E | LEN 4 | READS 2 | SWITCHES 1 | NEUE UID
  ```

- Damit beide UIDs in demselben Sketchlauf und eine UID-Aenderung ohne
  Neustart zwischen den Ereignissen nachgewiesen. Zeitpunkt/Dauer einer
  taglosen Pause und konkrete Nutzerbewegungen nicht erfasst; daraus
  **keinen abgeschlossenen kontrollierten Wechsel-/Dauertest ableiten**.
- Naechster kontrollierter Schritt: Nutzer entfernt beide Tags fuer
  mindestens 10 s und legt danach ausschliesslich Tag 1 auf; Serial
  und Zaehler pruefen. Kein Flash/Reset zwischen Wechseln.

### 04.10.2026, ca. 20:37 — Rueckwechsel auf Tag 1 erfolgreich

- Nutzer meldet `tag 1 liegt` nach Anweisung, beide Tags mindestens
  10 s zu entfernen und danach Tag 1 allein aufzulegen, USB verbunden
  zu lassen. Pausendauer nicht unabhaengig gemessen.
- 12 s Serial rein lesend beobachtet: neun Ausgaben von Tag 1,
  `READS 17` bis `READS 25`, durchgehend **SWITCHES 2**.
- Damit erwartete UID `E3:2F:F6:33` wiederholt erkannt; fortlaufende
  Zaehler belegen Rueckwechsel TAG2→TAG1 im selben Lauf. Gehaltenes
  Tag erhoeht READS, nicht SWITCHES. Kein Flash/Reset/Neustart durch
  Agenten ausgefuehrt.
- Naechster Schritt: gleiche taglose Pause, danach Tag 2, Zaehler
  pruefen. Dauer-/Audio-/Kaltstart-ohne-Tag-Test weiterhin offen.

### 04.10.2026, ca. 20:39 — erneuter Wechsel auf Tag 2 erfolgreich

- Nutzer meldet `tag 2 liegt` nach gleicher Anweisung (beide Tags
  mindestens 10 s entfernen, Tag 2 allein auflegen, kein Reset).
  Pausendauer nicht unabhaengig gemessen.
- 12 s Serial passiv gelesen: neunmal Tag 2 `01:8C:F1:6E`,
  READS **91→99**, SWITCHES durchgehend **3**.
- Folge TAG1→TAG2→TAG1→TAG2 mit fortlaufenden Zaehlern im selben
  Sketchlauf beobachtet. Beide angeforderten Wechsel nach tagloser
  Pause erfolgreich; gehaltenes Tag erhoeht nicht den Wechselzaehler.
- Grundlegender NFC-Wechseltest damit erfolgreich. Nicht gleichsetzen
  mit 20-Wechsel-Dauertest oder Audio-Integration. Timeout-Hypothese
  durch Vergleich gestuetzt, genaue Ursache nicht bewiesen.
- Naechster Test: Kaltstart OHNE Tag, danach mindestens 10 s leer lassen,
  dann Tag 1 auflegen und Lesung pruefen. Noch kein neuer Flash.

### 04.10.2026, ca. 20:42 — Kaltstart ohne Tag, danach Tag 1 erkannt

- Nutzer meldet `tag 1 liegt` nach Anweisung: beide Tags entfernen,
  USB-Power-Cycle, Leser mindestens 10 s leer lassen, dann Tag 1 auflegen.
  Boot-/Pausenablauf vom Nutzer, Dauer nicht unabhaengig gemessen.
- Danach 12 s Serial gelesen: neun Ausgaben TAG1 `E3:2F:F6:33`,
  READS **14→22**, SWITCHES **0**. Zurueckgesetzter Wechselzaehler passt
  zum neuen Lauf; UID-Erkennung nach angefordertem taglosem Start gelungen.
- Kein Flash. Grundlegende NFC-Wechsel-/Starttests erfolgreich;
  20-Wechsel-Dauertest und Audio weiterhin offen.

### 04.10.2026, ca. 20:43–20:50 — neuer minimaler Player vorbereitet, nicht geflasht

- `firmware/tests/etappe4_tag_player/` neu geschrieben. UID-/Dateipfade
  in `TagMap.h`, fixe Lautstaerke 6, keine Boot-Musik/Autotests/Buttons.
- NFC-Task uebernimmt bewiesenen Timeout-0-Lesepfad. Events/Zaehler als
  Datenkopien ueber FreeRTOS-Queue; Audio/SD-Aufrufe ausschliesslich im
  Hauptloop. Kein blockierendes NFC-Lesen im Audio-Hauptloop; globale
  Bibliotheken unveraendert. Noch kein Laufzeitnachweis der Task-Variante.
- APIs gegen PN532-Treiber, Audio-4.0.0-I2Saudio_SD/Treiber und Core-
  FreeRTOS-Queue/BasicMultiThreading-Beispiele inkl. READMEs geprueft.
- Host-Test `firmware/host-tests/tag_map_test.cpp` erfolgreich mit
  g++ C++17, -Wall/-Wextra/-Werror: beide exakten Zuordnungen,
  unbekannte UID, falsche Laengen und null-Zeiger ohne Fallback.
- Board-Compile erfolgreich: Core 3.3.12, Board-Defaults/QSPI,
  **1645392 Bytes Flash**, **77176 Bytes globale Variablen**.
  Build `/tmp/boxbert-etappe4-tag-player.2KsE8i`. **Nicht geflasht.**
- Vor Audio-Flash aktuellen MAX98357A-/Lautsprecher-Aufbau vom Nutzer
  bestaetigen lassen. Aufgelegtes Tag kann nach Boot sofort Musik starten.
- V1-Grenze dokumentiert: kein Entfernen-Event, deshalb gleiches Tag
  nach Entfernen/Neuauflegen ohne zwischenzeitlich andere UID kein
  Neustart. Gehaltenes Tag/EOF loesen keinen Loop aus. Audio/EOF/unknown-
  Tag-Verhalten noch nicht auf Hardware getestet.

### 04.10.2026, ca. 20:54–20:55 — Player erstmals geflasht, Audio-Stream laut Log aktiv

- Nutzer bestaetigt aktuellen Audio-Aufbau mit `audio bereit`.
- Host-TagMap-Test erneut bestanden, Board erneut erfolgreich kompiliert
  (1645392 Bytes Flash, 77176 Bytes globale Variablen). Ein Upload auf
  `/dev/ttyACM0`, alle Hashes verifiziert. Keine Quellcodeaenderung seit
  dem vorherigen Compile, keine Library-Patches.
- Nach Boot 3 s Serial gelesen, dann einzig Befehl `s` (Status, kein
  Wiedergabe-Kommando) gesendet und 15 s weiter mitgelesen.
- Decoder-Ausgabe: MP3Decoder initialisiert, File-Size **642028 Bytes**,
  ID3 v2.4, Duration **40 s**, Bitrate **128396 bit/s**, `stream ready`,
  `syncword found at pos 0`, MPEG-1 Layer III, **44100 Hz**, **2 Kanaele**,
  **16 BitsPerSample**.
- Status waehrend Beobachtung: `Bereit`, NFC-Task aktiv,
  READS **2→4**, SWITCHES **1**, STARTS **2**, START_ERRORS **0**,
  AUDIO `laeuft`, FILE **`/happy-tune.mp3`**, LOOPS **11981→20961**.
- Zwei erfolgreiche connecttoFS-Aufrufe und UID-Wechsel im Player
  nachgewiesen; Hauptloop schreitet parallel fort, weitere NFC-Lesungen
  waehrend Audio-Stream. Konkrete Tagbewegungen nicht vom Agenten
  ausgefuehrt und Startmeldungen vor Mitschnitt nicht aufgezeichnet.
- **Keine Hoerbestaetigung:** Stream-/Statusmeldungen beweisen weder
  tatsaechlichen Ton noch richtige Songidentitaet/stoerungsfreien Ton.
  Kein Nachweis fuer EOF-/Entfernen-/unknown-Tag-Verhalten oder Dauertest.
- Naechster Schritt: Nutzer bestaetigt, ob Happy Tune tatsaechlich leise
  und sauber hoerbar ist; danach Tag-1-Song und Wechsel unter Audio pruefen.

### 04.10.2026, ab ca. 20:58 — Hoerbestaetigung und Untersuchung der Wechselzeit

- Nutzer: `ja safe, perfekt alles hat funktioniert. lied wecshelt bei
  tag wechsel und wenn der selbe tag nochmal drauf gehalten wird
  passiert nix perfekt!` Damit Wiedergabe/Liedwechsel und beabsichtigte
  Keine-Neustart-Logik vom Nutzer bestaetigt, nicht nur aus Logs abgeleitet.
- Nutzer schaetzt Liedwechsel auf **etwa 5 Sekunden**. Keine Stoppuhr-
  oder instrumentierte Latenzmessung, keine neue Flash-/Codeaenderung.
- Codepruefung des unveraenderten Players und Audio-Lib 4.0.0:
  - NFC-Task pausiert nach jeder erfolgreichen Lesung **1300 ms**.
    Das kann bis ca. 1,3 s zusaetzliche Erkennungswartezeit beitragen,
    erklaert alleine aber keine gesamten 5 s.
  - SD laeuft absichtlich konservativ mit **1 MHz SPI**: theoretisches
    Nutzdatenlimit ohne Protokolloverhead 125000 Bytes/s.
  - Audio::processLocalFile() liest vor jedem Header-Verarbeitungsschritt
    zunaechst bis **65535 Bytes** von SD. read_ID3_Header() arbeitet den
    MP3-Header ueber mehrere Aufrufe/Zustaende ab. So werden beim Start
    moeglicherweise bereits mehrere grosse Bloecke gelesen, obwohl
    Header selbst klein ist. Ein voller 65535-Byte-Block benoetigt bei
    1 MHz bereits idealisiert **0,524 s**, real mit Overhead mehr.
  - Die Library verlangt nicht pauschal, den kompletten ca. 655-KB-Puffer
    vor Audio zu fuellen; daraus keinen falschen generellen Full-Buffer-
    Startzwang ableiten. stopSong/Decoder-/Datei-Init kommen ebenfalls dazu.
- Wahrscheinliche Hauptbremse: langsame SD-Startphase plus konservative
  NFC-Pause; genaue Laufzeitanteile ohne Zeitstempel noch nicht gemessen.
- Vorschlag: zuerst Zeitstempel UID-Erkennung/File-Open/stream-ready,
  dann SD 1→4 MHz testen, danach separat Erfolgs-Pause 1300→100–200 ms.
  Timeout 0/Task-/UID-Logik dabei beibehalten, funktionierenden Stand
  sichern, keine globalen Library-Patches. Noch nicht umgesetzt/geflasht.

### 04.10.2026, ca. 21:04–21:20 — Latenz gemessen, SD und NFC-Pause getrennt optimiert

Nutzer gibt Optimierung mit `ja mach` frei. USB-/Audio-Aufbau unveraendert,
Volume 6, Timeout 0 in eigener Task, keine Library-/Pin-/RF-Aenderungen.

1. Funktionierenden v1-Player unveraendert gesichert:
   `firmware/archive/etappe4_tag_player_v1/` (.ino.txt + TagMap.h).
   Dann ausschliesslich Messmarker ergaenzt: detectedMs im kopierten
   NFC-Event, Queue-/connecttoFS-/stream-ready-Zeitstempel. Audio-Callback-
   Marker atomar, keine Audio-/SD-Zugriffe aus NFC-Task.
2. **Baseline 1 MHz / Pause 1300 ms**, Mitschnitt endet ca. 21:09:
   Tag 2 UID **29200 ms**, Handler **29201 ms**, File-Open **29232 ms**,
   stream-ready **34699 ms**. Queue **1 ms**, connecttoFS **30 ms**,
   UID→stream-ready **5499 ms**. Damit lange Startphase *nach* UID
   nachgewiesen; NFC-Pause liegt vor dieser Messstrecke und erklaert
   diese 5,499 s nicht. Tag-1-Start am Mitschnittende unvollstaendig;
   daraus keine Tag-1-Baseline-Zeit ableiten.
3. **Nur SD-Takt 1→4 MHz**, Pause weiterhin 1300 ms. Mitschnitt ca. 21:14:
   Tag 1→Tag 2→Tag 1, UID→stream-ready **1362 / 1548 / 1368 ms**.
   Queue **1–2 ms**, connecttoFS **26–32 ms**. Gleicher Happy-Tune-Pfad
   damit **5499→1548 ms**, rund **72 % kuerzer** durch SD-Taktaenderung.
4. **Nur NFC-Erfolgspause 1300→200 ms**, SD weiterhin 4 MHz.
   Mitschnitt ca. 21:20: Tag 2→Tag 1→Tag 2→Tag 1, vier vollstaendige
   Startsequenzen, UID→stream-ready **1562 / 1372 / 1555 / 1369 ms**.
   Queue **1–2 ms**, connecttoFS **26–33 ms**; am Ende READS **9**,
   SWITCHES **4**, STARTS **5**, START_ERRORS **0**, NFC-Task aktiv,
   AUDIO laeuft. Hauptloop LOOPS **9312→23006**. Kuerzere Pause hat
   im Mitschnitt keine Such-/Startfehler erzeugt; Audio-Startzeit bleibt
   erwartungsgemaess ca. 1,4–1,6 s. Physischer Auflegezeitpunkt wurde
   nicht gemessen: eingesparte Zeit *vor* UID nicht als Messwert ausgeben.

Alle drei Varianten vor Upload erfolgreich kompiliert, Host-TagMap-Test
jeweils bestanden, Upload-Hashes verifiziert. Board-Defaults/QSPI-PSRAM,
**1646096 Bytes Flash / 77184 Bytes globale Variablen**.
Builds: `/tmp/boxbert-player-timing-1mhz.hoArYg`,
`/tmp/boxbert-player-timing-4mhz.xRqUo2`,
**aktuell** `/tmp/boxbert-player-timing-4mhz-200ms.U6Vqv7`.

Rohlogs dauerhaft unter `docs/serial/etappe4-player-latency-*.log`.
Timing-Quellstaende 1 MHz/1300 ms und 4 MHz/1300 ms ebenfalls im Archiv.
Mitschnitte starten nach Boot; nicht aufgezeichnete Starts/Tagbewegungen
nicht rekonstruieren. Keine Tagbewegung durch Agenten ausgefuehrt.

**Fazit:** SD-Takt ist als dominante Stellschraube fuer die gemessene
Audio-Startstrecke belegt. Kein generelles PN532-/I2C-Problem daraus
ableiten. stream-ready ist Library-Bereitschaft, nicht Mikrofon-/I2S-
Messung des ersten Tons. Neue Hoerbestaetigung fuer optimierten Stand,
20 kontrollierte Wechsel/Minutenlast, Entfernen/EOF und Kaltstart im
Player noch offen; keine komplette Etappen-Abnahme aus diesen Kurzlogs.

Zu diesem Zeitpunkt noch keine Abschlussfreigabe.

### 04.10.2026 — abschliessender Nutzer-Hoertest und Freigabe

- Nutzer bestaetigt auch den optimierten Hoertest als „super“ und
  fordert explizit Aufraeumen, Commit und Abschluss der Etappe.
- Etappe 4 **BESTANDEN als Breadboard-Meilenstein**, Abnahmeumfang und
  nicht durchgefuehrte Haertung im Abschlussblock oben dokumentiert.
- Kein neuer Flash/Hardwareeingriff beim Aufraeumen, funktionierenden
  aktuellen Player und unveraenderte NFC-Referenzen erhalten. Alte
  Diagnosen/Pinplaene archiviert, Hauptdokumentation auf I2C aktualisiert.
- Abschlusspruefung: Host-TagMap-Test mit g++ C++17 / -Wall / -Wextra /
  -Werror erneut bestanden; aktiver Player mit Board-Defaults erneut
  erfolgreich kompiliert (1646096 B Flash / 77184 B globale Variablen).
  SHA-256 von Einzelreferenz, Wechselreferenz und Player vor/nach dem
  Aufraeumen identisch. Kein erneuter Upload, keine Library-Aenderung.
- Naechster geplanter Meilenstein: Etappe 5, WLAN-Webserver + Upload;
  Framework-/Umfangsentscheidung vor Umsetzung.

---

## Historische Aufzeichnungen vor der Nutzerkorrektur

## 03.10.2026, ca. 21:20 — nicht bestanden

- Nutzerbefund: Verdrahtung und Durchgang geprüft, 3,3 V am Modul,
  externer Pull-up an SS/IO9 vorhanden. Keine neue elektrische Messung
  durch den Agenten; Verdrahtung unverändert.
- Codeprüfung: Im bisherigen `etappe4_nfc_direct.ino` fehlte `nfc.begin()`.
  Damit fehlten insbesondere SS-Ausgangskonfiguration und Wakeup.
  Außerdem wurde SD-CS/IO10 nicht explizit HIGH gesetzt. Im separaten
  `etappe4_nfc.ino` ist weiterhin `MISO_SWAP_TEST=1` aktiv; dieser alte
  Sketch wurde bei diesem Versuch weder geflasht noch korrigiert.
- Genau ein korrigierter Sketch kompiliert und geflasht:
  `firmware/tests/etappe4_nfc_direct/etappe4_nfc_direct.ino`.
  Pins gemäß `hardware/pinout.md`: SCK=36, MISO=37, MOSI=35, SS=9.
  SD-CS=10 HIGH, kein Audio/SD-Zugriff, `nfc.begin()` vor Firmware-Abfrage;
  danach 100 kHz, LSBFIRST, MODE0 explizit gesetzt. Ablauf gegen das
  installierte Beispiel `PN532/examples/iso14443a_uid` und den Treibercode
  geprüft. Bibliotheken global unverändert.
- Build: ESP32-Core 3.3.12, PN532-Arduino 1.1.0,
  FQBN `esp32:esp32:adafruit_feather_esp32s3_reversetft`, Board-Defaults.
  Kompilierung erfolgreich (393816 Bytes), Upload `/dev/ttyACM0`
  erfolgreich, Hashes verifiziert.
- Firmware-Abfrage genau einmal pro Boot; im Fehlerfall nur Ausgabe
  wiederholt, keine erneuten Initialisierungsversuche.
- Serial-Ausgabe nach Upload dreimal beobachtet:
  `FEHLER: PN532 antwortet auch mit korrigierter Initialisierung nicht`
- Ergebnis: Konkreten Softwarefehler beseitigt, dennoch keine Chipantwort.
  Das beweist weder einen Moduldefekt noch korrekte Buspegel im Betrieb.
  UID-Erkennung und geteilter Bus unter Audio-Last nicht erreicht.
  Auf Nutzerwunsch hier gestoppt: kein zweiter Flashversuch.

## 03.10.2026, 21:23 — erneuter Test nach DIP-Änderung

- Nutzer hat DIP geändert und bestätigt USB abgezogen/wieder eingesteckt.
- Bestehenden Sketch unverändert gelassen, kein weiterer Flash.
- Danach am Serial-Port erneut dreimal beobachtet:
  `FEHLER: PN532 antwortet auch mit korrigierter Initialisierung nicht`
- Weiterhin keine Chipantwort; konkrete DIP-Stellung nicht bekannt.
- Header-Nachbarschaft im offiziellen Adafruit-Pinout geprüft:
  D11 — D10 (GPIO10) — D9 (GPIO9) — D6. D9 liegt direkt neben D10.
  Quelle: https://learn.adafruit.com/esp32-s3-reverse-tft-feather/pinouts

## 03.10.2026, 21:28 — SD-MISO isoliert: Chip antwortet erstmals

- Modul-Foto `PXL_20261003_180840185.jpg`: Aufdruck HW-147, SPI laut
  Tabelle 1=OFF/2=ON. Das ältere Foto zeigt I2C; Nutzer bestätigt die
  inzwischen korrigierte SPI-Stellung.
- Nutzer wurde angewiesen, stromlos ausschließlich SD-MISO vom gemeinsamen
  Bus zu trennen (PN532-MISO bleibt IO37), dann USB wieder anzuschließen,
  und meldet anschließend „bereit“.
- Kein Codewechsel und kein weiterer Flash. Serial dreimal beobachtet:
  `FEHLER: Chip erkannt, Tag-Konfiguration fehlgeschlagen`
- Diese Ausgabe wird im Sketch erst nach nicht-null Firmware-Antwort
  erreicht. Konkrete Chip-/Firmware-Version wegen verpasster Boot-Ausgabe
  nicht aufgezeichnet. Tag-Konfiguration scheitert bei
  `setPassiveActivationRetries(0x00)` oder `SAMConfig()`; welcher Aufruf
  scheitert, ist wegen Kurzschlussauswertung noch nicht bestimmt.
- Deutlicher Hinweis auf Störung durch den SD-MISO-Zweig trotz SD-CS HIGH.
  Kein endgültiger elektrischer Nachweis (Buspegel nicht gemessen,
  Rückvergleich durch Wiederanschließen noch nicht erfolgt).
- Nächster Schritt: Tag-Konfiguration getrennt diagnostizieren; SD-MISO
  vorerst isoliert lassen. UID-Test und geteilter Bus noch nicht bestanden.

## 03.10.2026, 21:33 — Konfigurationsfehler behoben, Tag-Polling läuft

- Codeprüfung der installierten PN532-Lib: `SAMConfig()` und
  `setPassiveActivationRetries()` prüfen `0 < readResponse(...)`.
  Beide Kommandos antworten ohne Nutzdaten; Transport dokumentiert
  dagegen Rückgabewerte >=0 als Erfolg. Gültige leere Antwort wird
  fälschlich als Fehler behandelt, Retry-Fehler verhindert durch `||`
  außerdem den anschließenden SAMConfig-Aufruf im bisherigen Sketch.
- Lokaler Workaround nur in `etappe4_nfc_direct.ino`: gleiche
  Konfigurationskommandos direkt über `pn532spi.writeCommand/readResponse`
  senden. ACK und validierter leerer Antwortframe (Länge=0) erforderlich;
  getrennte Fehlermeldungen. Globale Bibliothek unverändert.
- Einmal erfolgreich kompiliert und geflasht, SD-MISO bleibt getrennt.
- Serial: mehrfach `PN532 bereit — NTAG215 auflegen`, dazu regelmäßig
  `write: 4A 01 00` / `read: 4B 00` (gültige Antwort mit null Targets).
  Damit Konfiguration und wiederholte NFC-Kommunikation erfolgreich.
- Noch keine Tag-UID beobachtet. Nutzer soll nun NTAG215 auflegen;
  SD/Audio und gemeinsamer Bus bleiben anschließend zu lösen.

## 03.10.2026, 21:34 — UID erkannt, kombinierter Sketch vorbereitet

- Nutzer meldet aufgelegtes Tag. Serial wiederholt:
  `Tag UID: E3:2F:F6:33`.
  Transportdaten: `4B 01 01 00 04 08 04 E3 2F F6 33`.
  UID-Länge 4, SAK=0x08, ATQA=0x0004. Das passt zu einem MIFARE-Classic-
  kompatiblen Tag, nicht zum erwarteten NTAG215 (7-Byte-UID). Der konkrete
  Chiptyp ist damit nicht eindeutig bestimmt; NTAG215-Eigentest noch offen.
- NFC-Tag-Erkennung bei isoliertem SD-MISO nachgewiesen. Kein Audio-Test.
- `firmware/tests/etappe4_nfc/etappe4_nfc.ino` komplett überarbeitet und
  erfolgreich kompiliert, **noch nicht geflasht**:
  - Kein MISO/MOSI-Swap; SD zuerst mit 4 MHz initialisieren.
  - Bewährte Seeed-Lib und lokaler Workaround für leere Antworten.
  - Lokaler Transport-Wrapper setzt bei jedem NFC-Kommandoschreiben und
    Antwortlesen SPI-Transaktionen mit 100 kHz, LSBFIRST, MODE0, damit
    SD-Transaktionen mit MSBFIRST und NFC nicht falsche Einstellungen teilen.
  - Boot-Musik `/arcade-music-loop.mp3`, Tag startet `/subbasesoft.mp3`,
    Volume 6. NFC-Polling alle 200 ms, Antworttimeout 100 ms, keine
    500-ms-Pause im Audio-Loop. Wiedertrigger des gehaltenen Tags gebremst.
- Nächster Hardware-Schritt: stromlos SD-MISO wieder anschließen, dann
  diesen kombinierten Sketch einmal flashen. Hypothese: SD muss erst in
  SPI-Modus gebracht werden, bevor NFC den gemeinsamen MISO nutzen kann.
  Wenn erfolglos, Hardware-Buskonflikt gezielt lösen; nicht als bestanden
  markieren. Boot-/Pups-Erfolg und Audio-Aussetzer tatsächlich prüfen.

## 03.10.2026, 21:40 — SD-zuerst-Test: geteilter Bus weiterhin gestört

- Nutzer meldet nach Anweisung zum Wiederanschließen von SD-MISO „bereit“.
- Zuvor erfolgreich kompiliertes Binary aus `/tmp/boxbert-etappe4-shared`
  einmal erfolgreich auf `/dev/ttyACM0` geflasht; Build 1634160 Bytes.
- Boot-Ausgabe vollständig beobachtet:
  ```
  Etappe 4: SD ZUERST, dann NFC; gemeinsame Pins 36/37/35
  SD ok (4 MHz, SPI-Modus)
  write: 02
  Invalid ACK
  PN532 antwortet trotz SD-Init nicht — MISO-Buskonflikt weiter moeglich
  Boot-Musik gestartet (Volume 6)
  NFC fehlt — Etappe 4 NICHT bestanden
  ```
- Audio-Lib meldet Datei `/arcade-music-loop.mp3`, Stream bereit,
  MP3-Syncword gefunden, 44100 Hz, Stereo. Hörbestätigung des Nutzers
  fehlt noch; aus Log allein kein Nachweis für störungsfreien Ton.
- SD-Initialisierung vor NFC behebt den Fehler nicht. Vergleich mit
  erfolgreichem UID-Test bei getrenntem SD-MISO verstärkt den Verdacht
  auf elektrische Busstörung. Keine Buspegelmessung, konkrete Ursache
  (z. B. fehlendes Tristate am SD-Modul) noch nicht bewiesen.
- Nächster sinnvoller Schritt: NFC auf eigenen SPI-Bus legen (Plan B aus
  `docs/findings.md`), Pins vorher gegen `hardware/pinout.md` und lokale
  Board-Definition prüfen. SD und Audio können unverändert bleiben.
  UID + Pups und Etappe 4 insgesamt weiterhin nicht bestanden.

## 03.10.2026, 21:43 — konkreten Tipp für Plan B festgehalten

- Auf Nutzerwunsch empfohlen und dokumentiert, noch nicht umgesetzt:
  PN532 eigener HSPI-Bus, SCK=IO15/A3, MOSI=IO14/A4, MISO=IO38/RX.
  SS=IO9 samt Pull-up, VCC=3V3 und GND bleiben; SD/Audio unverändert.
- Pins gegen lokale Reverse-TFT-Board-Definition (Core 3.3.12) geprüft,
  Controller gegen `esp32-hal-spi.h` und `SPI.cpp` (globaler SPI=FSPI,
  zweiter Controller=HSPI). Init-Reihenfolge `begin(15, 38, 14)`.
- Späterer Encoder-Konflikt an IO14/15 ausdrücklich dokumentiert.
- Verbindlicher Vorschlag und stromlose Umsteckanleitung:
  `hardware/pinout.md`, Abschnitt „Etappe 4 — Plan B“.
- Keine weitere Firmwareänderung und kein Flash in diesem Schritt.

## 04.10.2026 — Plan C vorbereitet: PN532 über HSU (UART), Musikzuordnung 2 Tags

- Nutzerentscheidung: PN532 soll HSU statt SPI nutzen (umgeht den
  gestörten MISO-Bus komplett). Nutzer hat bereits UART-Kabel gekreuzt
  verbunden; konkrete Feather-Pins vom Nutzer noch nicht bestätigt.
  **Damals angenommene, später korrigierte** Zielverdrahtung laut unserer
  Auslegung des Elechouse-Handbuchs (HSU = DIP OFF/OFF): **SDA = RXD →
  Feather TX/IO39, SCL = TXD → Feather RX/IO38**. Die Web-Gegenprüfung
  12:26 korrigiert diese SDA/SCL-Richtung; siehe Abschnitt unten.
- Quelle festgehalten: Elechouse V3 Manual (elechouse.com, PDF): HSU
  OFF/OFF, I2C ON/OFF, SPI OFF/ON; „I2C and HSU shares the same pins“.
- Musik: `335361__cabled_mess__little-happy-tune-2210.wav` (40,06 s,
  44,1 kHz, Stereo, 7,1 MB) mit ffmpeg zu `/happy-tune.mp3` konvertiert
  (128 kbps, 44,1 kHz, 642 kB). Datei liegt in `~/Downloads` — **Auf die
  SD muss sie nur per Kartenlesegerät** (Karte kurz rausnehmen); WLAN-
  Upload kommt erst mit der PWA. `arcade-music-loop.mp3` ist schon auf
  der Karte.
- Neuer Sketch `firmware/tests/etappe4_nfc_hsu/etappe4_nfc_hsu.ino`:
  PN532_HSU auf Serial1 (RX=38, TX=39), SD allein am SPI-Bus (MISO=37
  wieder angeschlossen), Seeed-Lib + Workaround für leere Antworten,
  Boot-Musik `/arcade-music-loop.mp3`, Volume 6, Polling 200 ms/
  Timeout 100 ms, Anti-Retrigger. Zuordnung: UID `E3:2F:F6:33` →
  arcade-music-loop, jede andere UID → happy-tune (UID wird ausgegeben,
  damit Tag 2 danach fest verdrahtet werden kann).
- Build: ESP32-Core 3.3.12, PN532-Arduino 1.1.0, FQBN
  `esp32:esp32:adafruit_feather_esp32s3_reversetft`. Kompilierung
  erfolgreich (1643416 Bytes). **Noch nicht geflasht.**
- Plan B (eigener SPI-Bus IO15/14/38) verworfen; Encoder-Konflikt
  IO14/15 entfällt. Neu: IO39-Konflikt mit Boost-EN dokumentiert
  (`hardware/pinout.md`, Abschnitt Plan C).
- Nächste Schritte für den Nutzer: stromlos SPI-Leitungen vom PN532
  lösen, MISO an SD wieder anschließen, UART gemäß oben kreuzen, DIP
  beide OFF, happy-tune.mp3 auf die Karte, dann flashen und Serial
  beobachten.

## 04.10.2026, 12:04 — SD bestückt, Fart-Button ergänzt

- Mount-Falle dokumentiert: erste Kopien gingen ins ungemountete
  `~/sd-card` (Root-FS, unter der Karte verschwunden). Konvention jetzt
  in `AGENTS.md`: **erst mounten, dann kopieren**, Mountpunkt
  `~/sd-card`, `sync` + `sudo umount` vor dem Ziehen.
- Karte (Verbatim 32 GB, FAT32, per Kartenleser gemountet) enthält jetzt:
  `arcade-music-loop.mp3` (540 kB), `subbasesoft.mp3` (48 kB),
  `pups01.mp3`, `test440/880.mp3` (alte Etappen-Dateien) und neu
  **`happy-tune.mp3`** (642 kB, 40,06 s) sowie **`fart.mp3`**
  (23 kB, 1,39 s) — beide mit Bitvergleich (cmp) bestätigt.
- Neue Tonquelle: `94989__deleted_user_1391979__bad-chili-fart.wav`
  (freesound) → ffmpeg zu `/fart.mp3` (128 kbps, 44,1 kHz, 1,39 s).
- Sketch erweitert: **Button IO5** (Terminal A → IO5, B → GND,
  INPUT_PULLUP, Verdrahtung aus Etappe 3) spielt `/fart.mp3` —
  fallende Flanke mit 20-ms-Entprellen wie bewährt, einmal pro
  Druckvorgang. Kompiliert erfolgreich (1643732 Bytes). **Noch nicht
  geflasht.**

## 04.10.2026, 12:20–12:25 — HSU-Live-Test: kein ACK, keine Firmwareantwort

- Vor dem Minimaltest meldete der angeschlossene Feather über Serial
  wiederholt `NFC fehlt — Etappe 4 Plan C NICHT bestanden`. Der vorherige
  HSU-Gesamtsketch wurde daraufhin mit dauerhaft wiederholtem NFC-Status
  neu gebaut und mit Verify geflasht (Build 1644036 Bytes).
- Zur Isolation neuer Sketch
  `firmware/tests/etappe4_nfc_hsu_diag/etappe4_nfc_hsu_diag.ino`: nur
  PN532_HSU auf `Serial1` (RX=IO38, TX=IO39), keinerlei SD-, Audio- oder
  NeoPixel-Initialisierung. Build 400584 Bytes, Upload und Hash-Verify
  erfolgreich.
- Serial-Ausgabe in vier aufeinanderfolgenden Firmware-Abfragen:
  ```
  Write: 02
  Ack: Timeout
  Keine PN532-Firmware-Antwort; HSU-ACK/Antwort siehe Debugzeilen davor.
  ```
  `0x02` ist die PN532-Abfrage der Firmwareversion. Es kommt nicht einmal
  das HSU-ACK zurück; SAMConfig, Polling und Tag-Erkennung werden daher
  noch gar nicht erreicht. Keine UID gelesen.
- Damit sind SD, Audio, NeoPixel, Tag-Zuordnung und der gemeinsame SPI-Bus
  als Ursache dieses HSU-Fehlers ausgeschlossen. Der ESP32 sendet den
  Befehl, erhält aber keine gültige Antwort. Softwarefehler in der
  HSU-Pininitialisierung ist nicht ersichtlich: die installierte
  PN532-Arduino-Lib 1.1.0 erwartet beim ESP32-Konstruktor RX dann TX;
  der Sketch übergibt 38, 39 in dieser Reihenfolge.
- Webrecherche im Anschluss (12:26) fand einen wahrscheinlichen
  Dokumentationsfehler in der HSU-Pinzuordnung: Beim Elechouse/HW-147 werden
  die gemeinsamen Pads als **SDA/TXD** (Modulausgang) und **SCL/RXD**
  (Moduleingang) benutzt. Richtige Kreuzung zur Feather-Serial1-Belegung:
  **PN532 SDA/TXD → Feather IO38/RX; PN532 SCL/RXD → Feather IO39/TX**.
  `hardware/pinout.md` und die Sketch-Kommentare hatten es umgekehrt
  angegeben. Falls danach verdrahtet wurde, waren TX und RX auf der
  Modul-Seite gleichnamig statt gekreuzt — das passt exakt zum `Ack: Timeout`.
  Hinweise: [Tasmota-Issue #5497](https://github.com/arendst/Tasmota/issues/5497)
  nennt `SCL/RXD` und `SDA/TXD`; [Raspberry-Pi-StackExchange](https://raspberrypi.stackexchange.com/questions/82220/connecting-elechouse-pn532-v3-to-raspberry-pi-5v-or-3-3v)
  nennt `SDA/TxD` und `SCL/RxD`. Rückseiten-Silkscreen des konkreten Moduls
  bleibt maßgeblich.
- Das ist eine **starke Hypothese, noch kein bestätigter Fix**: nach
  stromlosem Tauschen der beiden UART-Drähte wurde noch nicht erneut getestet.
  IO39 bleibt zusätzlich als möglicher Boost-EN-Konflikt zu beachten; keine
  Pegel am UART gemessen.
- Prüfung des nachgereichten YouTube-Beispiels: `PN532_SWHSU` ist
  SoftwareSerial, nicht der Hardware-UART `PN532_HSU`; sein
  `SoftwareSerial(3, 2)` erwartet MCU-RX=GPIO3 und MCU-TX=GPIO2. Das passt
  nicht zu IO38/39 und ist am Feather keine freie Pinwahl (IO3=SDA, IO2
  Board-Taster/reserviert). Mit der hier installierten PN532-Arduino 1.1.0
  fehlt außerdem `SoftwareSerial.h`, und SWHSU ist laut Library-Quellcode
  opt-in. Minimale Kompilierprobe des Beispiels scheitert bereits an
  `SoftwareSerial.h`; daher nicht geflasht.
- Nutzer weist darauf hin, dass `~/Downloads/PXL_20261004_103141596.jpg`
  das aktuelle Setup zeigt. Korrektur der früheren Foto-Einschätzung:
  darauf steckt der 4-polige gemeinsame I2C/HSU-Anschluss; die 7-polige
  SPI-Leiste ist sichtbar unbeschaltet. Die Kabelfarben/Pins SDA/SCL sind
  durch den Stecker verdeckt, daher lässt sich die UART-Richtung aus dem
  Foto nicht ablesen. Es ist kein Beleg für noch angeschlossene SPI-Leitungen.
- **Aktueller Flash-Inhalt:** die minimale HSU-Diagnose oben. Sie spielt
  keine Musik und fragt die Firmware alle 3 Sekunden erneut ab.

## 04.10.2026, ca. 12:40 — Mapping bestätigt, Power-Cycle ändert nichts

- Nutzer bestätigt ausdrücklich die gekreuzte Verbindung nach den
  Rückseitenlabels: PN532 TXD → Feather RX/IO38 und PN532 RXD → Feather
  TX/IO39. Damit ist der zuvor vermutete Anschlussfehler durch Befolgen
  unserer alten Tabelle für den aktuellen Aufbau **nicht** die Erklärung.
- Nutzer hat USB ab-/angesteckt. Direkt danach erneuter Serial-Mitschnitt
  der bereits geflashten Minimaldiagnose: zweimal `Write: 02 / Ack: Timeout`.
  Kein ACK/keine Firmwareantwort, weiterhin keine UID.
- Neue Bilder `PXL_20261004_103902386.jpg` und
  `PXL_20261004_103917817.jpg`: der 4-polige GND/VCC/SDA/SCL-Anschluss ist
  benutzt, SPI-Leiste unbeschaltet. DIP-Stellung sieht nach HSU 0/0 aus,
  ist im Foto aber nicht völlig eindeutig. Feather-RX/TX-Leiste ist im Bild;
  die Kabelfarben sind nicht sicher bis zu den Pads zu verfolgen. Kein Boost
  im Bild erkennbar.
- Nächster isolierender Test: PN532-UART-Datenleitungen abnehmen,
  Feather TX/IO39 direkt mit RX/IO38 brücken und Serial1-Loopback prüfen.
  Damit wird die ESP32-UART-Pinroute von PN532-Modus/Modul getrennt.

## 04.10.2026, 12:54 — Serial1-Loopback bestanden

- PN532-UART-Signalleitungen abgezogen, Feather TX/IO39 direkt mit RX/IO38
  gebrückt; vorhandene HSU-Minimaldiagnose weiterverwendet, kein neuer Flash.
- Serial wiederholt:
  ```
  Write: 02
  Ack: 00 00 FF 02 FE D4Invalid
  ```
  Das ist beim Loopback der eigene Befehlsrahmen, kein PN532-ACK. Die
  zurückgelesenen Bytes beweisen aber, dass Serial1 sendet und über die
  Feather-Pins RX=38/TX=39 wieder empfängt. Feather-UART und Sketch-Pinroute
  sind damit als Ursache weitgehend ausgeschlossen.
- Vor dem Loopback, mit PN532 wieder angeschlossen und nach USB-Power-Cycle,
  gab es weiterhin `Ack: Timeout`. Der PN532 selbst ist während des
  Loopbacktests von den UART-Datenleitungen getrennt.
- **Zustand während dieses Tests:** Loopback-Brücke IO39↔IO38; PN532-UART-
  Datenleitungen ab.

## 04.10.2026, 13:04 — PN532 wieder angeschlossen, VCC 3,27 V

- Nutzer hat Loopback-Brücke entfernt und PN532 wieder angeschlossen.
  Gemessene PN532-Versorgung VCC–GND: **3,27 V**.
- Direkt danach erneut Serial gelesen: zweimal `Write: 02 / Ack: Timeout`.
  Versorgung ist plausibel; HSU-Antwort bleibt aus.
- Nutzer meldet anschließend **4,1 V am TXD/SDA gegen GND**, bei weiterhin
  3,27 V VCC; danach bestätigt er den Wert auch direkt am isolierten Modul-
  Ausgang (TXD von Feather-RX getrennt). Damit ist ein Pegel >3,3 V am PN532-
  Ausgang bestätigt. Nicht direkt an Feather IO38 anschließen.
- Webrecherche: Elechouse V3-Handbuch und V4-Spezifikation nennen eingebauten
  Level-Shifter mit **5V TTL für HSU/UART und I2C, 3,3V TTL für SPI**. Das
  passt zur Messung; exakte 4,1 V sind nicht als allgemeiner Sollwert belegt.
  Quellen: [Elechouse V3 Manual](https://www.elechouse.com/elechouse/images/product/PN532_module_V3/PN532_%20Manual_V3.pdf),
  [Elechouse V4 specs](https://www.elechouse.com/product/pn532-nfc-rfid-module-v4/).
- HSU ist vorläufig gesperrt, bis RX/TXD-Pegel angepasst werden. Optionen:
  geeigneter Pegelwandler für UART oder Plan B — separater SPI-Bus mit
  3,3-V-TTL, ohne zusätzlichen Pegelwandler. Keine weiteren HSU-Flashversuche
  mit direktem Anschluss.
- DIP-Stellung am konkreten Modul zusätzlich sicher als HSU 0/0 bestätigen.

## 04.10.2026 — Electronic Clinic-Artikel zu I2C/UART gelesen

- Der Artikel verwendet einen **Arduino Nano** und schreibt ausdrücklich:
  UART/I2C auf dem Modul = **5V TTL**, SPI = **3,3V TTL**. Seine
  UART-Schaltung speist das Modul mit Nano-5V; sein I2C-Beispiel nutzt Nano
  A4/A5 und DIP Kanal 1 ON/Kanal 2 OFF.
- Das ist nicht direkt auf den Feather übertragbar: IO3/SDA und IO4/SCL sind
  3,3-V-GPIOs und nicht 5V-tolerant. Wegen der isoliert gemessenen 4,1 V am
  gemeinsamen SDA/TXD-Pad I2C nicht direkt anschließen. Für I2C wäre ein
  externer bidirektionaler Pegelwandler nötig; dazu kommt das bekannte
  Clock-Stretching-Risiko am ESP32.
- Der Artikel erklärt damit die Pegeldifferenz, aber belegt keinen HSU-Code-
  Fehler. Sicherer Weg ohne zusätzliche Teile bleibt der getestete 3,3-V-SPI-
  Transport auf separatem Bus (Plan B). Quelle:
  [Electronic Clinic – PN532 UART/SPI/I2C](https://www.electroniclinic.com/pn532-rfid-nfc-module-with-arduino-how-to-use-hsu-uart-spi-i2c/).

## 04.10.2026 (Abend) — PN532 über I2C direkt am Feather: LEBT

Ausgangslage: HSU gestoppt (4,1 V am TXD/SDA), Nutzer entscheidet sich für
I2C-Test. **Vor dem Anschließen Pegel gemessen** (Modul isoliert, DIP auf
I2C = 1 ON / 2 OFF):

- SDA gegen GND: **3,3 V**
- SCL gegen GND: **3,3 V**

→ Diesmal kein 4,1-V-Befund; direkter Anschluss SDA→IO3, SCL→IO4 zulässig.
Interpretation: Der 4,1-V-Wert vom Vormittag trat am SDA/TXD-Pad im
HSU-/TXD-Kontext auf; im I2C-Modus mit DIP in I2C-Stellung liegt die
Ruhelage des Busses bei 3,3 V (Pull-ups). Modul lief dabei an VCC 3,3 V.

Test: Sketch `firmware/tests/etappe4_i2cscan` (I2C-Bus-Scan 0x01–0x7E bei
100 kHz + Firmware-Abfrage über Adafruit_PN532 mit Dummy-IRQ/Reset-Pins).

Ergebnis (Serial, 115200):

```
I2C-Geraet gefunden: 0x24  -> PN532
I2C-Geraet gefunden: 0x36  -> onboard MAX17048 (Fuel Gauge, erwartet)
PN532 LEBT: Chip PN532, FW v1.6
```

Schlussfolgerungen:

- Modul heil, DIP-Moduswechsel greift, I2C am Feather-Standardbus (Wire,
  IO3/IO4) funktioniert. Die früheren SPI-„Invalid ACK“-Probleme lagen an
  der SPI-Verkabelung/Bus-Sharing, nicht am Chip.
- 0x36 ist die onboard-Fuel-Gauge (MAX17048) — gehört auf den Bus, kein
  Adresskonflikt mit 0x24.
- Bisherige Bedenken aus dem Electronic-Clinic-Artikel (5V-TTL am I2C-Pad)
  trifft für dieses konkrete Modul in I2C-Stellung nicht zu (Messung oben);
  der Pegelwandler war hier nicht nötig.
- Offen: Tag-Lesetest über I2C (readPassiveTargetID-Loop) und später
  Musik-Pfad SD + NFC.

## 04.10.2026 (Abend) — Tag-Lesetest über I2C: bestanden (Nutzerbefund)

- Nutzer meldet: NFC-Lesen über I2C funktioniert (Tag erkannt/gelesen).
  Details (UID, Chip-Typ, Anzahl Lesezyklen, Verhalten unter Audio-Last)
  noch nicht protokolliert.
- Konsequenzen:
  - Plan C (HSU) endgültig verworfen — braucht wegen 4,1 V am TXD weiterhin
    Pegelwandlung und bietet keinen Vorteil gegenüber I2C.
  - Plan B (eigener SPI-Bus IO15/14/38) verworfen — nicht mehr nötig, damit
    entfällt auch der dokumentierte Encoder-Konflikt IO14/15.
  - SD hat den SPI-Bus (IO36/35/37, CS IO10) jetzt allein; MISO-Bussharing-
    Problem aus Etappe 4 obsolet.
  - IO9 (PN532 SS) und IO38 werden frei — Belegung in `hardware/pinout.md`
    entsprechend nachziehen.
- Noch offen vor Etappe-4-Abschluss:
  - Stresstest: NFC-Polling 50–100 Lesezyklen **während Musik läuft** —
    zählen, ob Clock-Stretching-Timeouts auftreten (der Grund, warum I2C
    ursprünglich nicht Primärweg war).
  - Tag-Typ prüfen: UID vom 03.10. (E3:2F:F6:33, 4 Byte, SAK 0x08) war
    MIFARE-Classic-kompatibel, nicht NTAG215 (7 Byte, SAK 0x04). Die
    bestellten NTAG215-Sticker müssen über I2C als solche identifiziert
    werden.
  - Kombinierter Sketch NFC (I2C) + SD + Audio wie bei den SPI-Versuchen,
    dann Etappe 4 als bestanden markieren.
