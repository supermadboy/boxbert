# Übergabe: Endaufbau, Gesamtfirmware und „Dateifehler“ — 11.11.2026

## Aktuell14.11.: SD wieder da, Vorführbuild vorbereitet aber NICHT geflasht

Nach NutzerRESET SD/config1, Karte/Dateien wiederda. Ursache frühererSD0 offen.
SollTag1Arcade/Tag2HappyTune; tatsächlich bleibtTag2Fart. NeuerGesamtbuilduluu6evy
mit exaktem USB-Setupbefehl`demo-songs` gebaut/Quellen+Hashes geprüft,
20native/6RPC-/9Quellverträge grün. KeineBootmigration/sonstigeZuordnungsänderung.
**Nichtgeflasht:** bei zweitemParkversuch NFC1 statt3; Nutzer istinzwischenweg.
Keine Sicherheitsregelumgehung. Pause wiederaufgehoben; finalSD/config1,Rev150,
Volume1/playback1,NFC1/pause0,keinPeer. AlleLeserbeendet, keinegeplanteFlashaufgabe.
Tag2HappyTune NICHTalsfertigmelden. Weiter Karte→Park3→exakterFlash→explizites
`demo-songs`→Readback/Persistenz/leiserTagtest. Details
`testprotokoll-vorfuehrung-2026-11-14.md`. Danach Web-/Introprüfung fortsetzen.

## Historischer Zwischenstand vor NutzerRESET: SD nicht erkannt

Nutzer bittet den Web-Arbeitspunkt zu merken und für Besuch zwei RFID-Songs zu
flashen. Soll Tag1Arcade/Tag2HappyTune, übrige Daten erhalten, leiserBoot.
Vorab-USB-Diag (`2026-11-13-demo-before.log`) meldet aber SD0/config0,Revision0,
Volume1/playback5, Tagpfade leer/exists0, NFC1. Nicht als gelöschte SD-Konfiguration
interpretieren; bei fehlendemSD sind das RAM-Defaults. Noch kein neuer Flash/
Mappingänderung. Nutzer gefragt, ob microSD entnommen wurde; Klärung ausstehend.
Kein blinder Flash. Vor Flash NFC-Park3 und genaue Build-/Hashprüfung weiterhin.

Nach Vorführung beim **ersten echten Android-Wachhalte-/Introabschlussversuch**
weiter; neue Website bereits online, aber Nutzer hat neuen Versuch noch nicht
gemacht. BLE-Durchsatz und Button-ID-Ziel1Grün weiterhin offen. Details To-Do.

## Web-Wachhalten online, echter Android-Vergleich noch offen

Nutzer hat Website-Aktivierung und danach den Root-SSH-Launcher ausdrücklich
freigegeben. Nur als `habibi`/UID1001 statische Boxbert-Dateien aktualisiert,
keine Host-/Zugangs-/Dienständerung und kein Restart/Flash. Hostingartefakt83edc20
in isoliertem lokalen Worktree über Buildbrücke erstellt und gepusht. Alle elf
öffentlichen Dateien haben erwartete SHA256; HTTPS-/Offline-Browsertest grün.
Neuer Link: **https://habibi.supermittel.com/boxbert/?stand=upload-wach-14**.
Alte Boxbert-Tabs schließen, neuen Link öffnen, keine Browserdaten löschen:
lokale Aufnahme soll erhalten bleiben. Android-Display-/Intro-Commitprüfung offen.

Direkter nginx-Bind-Mount: Webroot-Verzeichnis nicht ausgetauscht, neue Dateien
atomar proDatei, index/sw zuletzt; alte Hashassets bleiben. Backup außerhalb
Webroot `/home/habibi/.cache/boxbert-web-activation.zIljGc/previous`.
Live-Hostingcheckout bleibt7329e39, nur sites/boxbert absichtlich geändert,
vorhandene fremde Änderungen erhalten; Boxbert-Servercheckout bleibt6e14e5e.
Details/Logs im App-Protokoll. Nachfolgend historische Vorbereitung.

## Intro-Abbruch nach Display aus; App-Wachhalten lokal fertig (vor Aktivierung)

13.11., ca.17:05–17:13: Clip laut Nutzer4s. Erst passende Upload-Anfragen alle2,6s
bestätigt, dann nächste Anfrage bei480ByteRX unvollständig; t=3132481 echter
`drop-timeout detail=0`, danachDisconnect534. Nutzer bestätigt Display aus.
Plausible Android-Hintergrundpause, kein endgültiger Beweis; kein alter Sofort-
Unterlauf. Nachdiag SD/config1,Revision135,Volume21/playback4, achtMP3-Namen/Größen
weiterhin gelistet, beide Tag-Intros leer. Keine vollständige Daten-/SD-Integritäts-
prüfung und kein erfolgreicher Intro-Commit. Vor nächstem Hörtest leise drehen.

Auf ausdrücklichen Nutzerauftrag Screen Wake Lock und globalen Prozentfortschritt
inkl. Abbrechen eingebaut. Best effort mit Warnung/Visibility-Reacquire und sauberer
Freigabe bei Ende/Abort/Unmount/späterGrant. 81App-Tests, simulierter HTTP-/Demo-
Browser, echtes HTTPS/offline und beide Builds grün. WakeLock im Browser gemockt;
physischer Android-Test offen. Kandidat `app/dist/assets/index-7Ehl6x5w.js`.
**Nicht deployed, Hostingrepo unverändert, kein Flash.** Erst Aktivierung klären,
danach kontrollierter Live-Vergleich. Alle USB-Leser beendet. Logs/Details siehe
`testprotokoll-app-funktionen-2026-11-13.md`; BLE-Tempo und Button-ID-Tausch bleiben
separate offene Punkte. Nachfolgende Abschnitte dokumentieren vorherige Zwischenstände.

## Neueste Nutzerprüfung: Appbedienung klappt, Button-ID/Upload noch offen

Nutzer bestätigt Handy-Lautstärke undStart/Stopp. UI1mitPups belegt, grüner30mm
stopptjedoch nur: aktuellGrün=ID2 mitDefaultSTOP, UI1=Gelb. NutzerzielUI1Grün;
Tausch1/2vorgeschlagen, noch nichtdurchgeführt/keinegespeichertenBelegungen verändert.
Upload/Introfehlgeschlagen, Meldung nurungefähr„abgebrochen nachZeit“.
EigeneVermutung30sGesamtlimit **widerlegt**: Intro verwendetbereitsUploadbudget1h.
NeuerQuellvertrag plusnativeBrowser-Simulation mit>30svirtuellemUpload bestehen,
69App-Tests grün, keinerleiProduktcodefix daraus. EchterBLE-Timeoutgrundnochunbekannt.

PC-Vergleich ausdrücklichgewünscht, aber`btmgmt`meldetnurBR/EDR, keinLE,
BlueZ-Rolesleer. VorhandenerAdapter **nichtBLE-fähig**, keinPC-GATT/Pairing/Scan
oderVerbindungswechsel. KeinFlash/Deploy währendNutzerabwesenheit vorgenommen.
Details:`testprotokoll-app-funktionen-2026-11-13.md`; aktuellerFlash weiterhinprnsjyfe.

## BLE-Soforttimeout korrigiert, echter Handshake/read durchgelaufen

**Geräteflash prnsjyfe**, Kennung`boxbert-v1-commissioning-20261113-v21-blefix1`,
2560235Byte Flash/173468Byte Globals. Nach bestätigtem Park3 exakt Quellen/Runtime/
SHA256 geprüft und hochgeladen. Danach Volume1/Decoder/NFC1,SD/I2S/AW/Gauge/config1,
Revision113. Passwortschutz, Boot1/Max21 und übrige Flags unverändert.

Tracebuilddepm3fts zeigte zweimalhello→105BytesAntwortbereit→lokalen drop-timeout
innerhalb1ms, vorAuth. `now` vomLoop-Eintritt älter als neues`bleAt=millis()`:
unsignedSubtraktion unterläuft. EchterTimeout nichtverstrichen. Produktionshelper
mitHalbintervallprüfung korrigiert,10sRX/30sTX-Grenzen unverändert; nativerTest
zuerstRED,danachGREEN.20native Sanitizerprogramme/4Pin-/3Trace-Tests und6Encoder/
RPC-Szenarien bestanden. KeinepauschaleErklärung allerälterenFunkauffälligkeiten.

`docs/serial/2026-11-13-blefix1-phone-attempt.log`: danachhelloAntwortsent,
auth1bestätigt undread1268Bytes vollständig übertragen; weitereauth/read-Strecke
beiDecoder/Volume16ebenfalls. Weitereanonymisierte Anfrage einmalabgelehnt,
späterandereok; genaueBedienaktion nicht ausNutzdaten rekonstruieren.
**Nutzersicht/Dateizugriff/Lautstärke/Start-Stopp inzwischen bestätigt**, HappyTune-Zuordnung nochoffen,
Upload/Persistenz.120-s-LeserPID24820 beendet, keinHintergrundlesermehr;
spätererDiagRevision123/Volume16/playback4/NFC1/pause0/keinPeer. Verbindungsende
außerhalbCapture, keineUrsache dafürbelegt. KeinparallelerPC-GATT. Ausführlich:`testprotokoll-ble-verbindung-2026-11-13.md`.
AlteFrames/Builds infolgendenAbschnitten sindChronologie, nicht aktuellerFlash.

## Chronologie: BLE-Abbruch und erster Tracebuild vor dem Fix

Nutzer hat das vorhandene Passwort verwendet. Appfehler: „Getrennt: BLE-Verbindung
verloren. Gerätestand bei Schreibfehler unklar; neu laden“. Welche Aktion und
Phase: laut Nutzer **direkt nach Geräteauswahl, noch vor Dateiliste**;
GATT/hello/auth/erster Read sind innerhalb des Aufbaus noch nicht unterschieden.
**Diagnosebuild jetzt geflasht:** `boxbert-build-depm3fts`, Kennung
`boxbert-v1-commissioning-20261113-v21-bletrace`,2560263Byte Flash/173468Byte Globals.
Nach Nutzer „liegt“ Park3 bestätigt, Quellen/Runtime/Artefakt-SHA256 geprüft und
exaktdepm3fts hochgeladen. Danach NFC1/pauseRequested0,Volume1/Decoderläuft,
SD/I2S/AW/Gauge/config1,Revision113,Heap30796/maxAlloc21492; keine Geheimnislogs.
120-s-Handyleser PID22048 gestartet,`docs/serial/2026-11-13-bletrace-phone-attempt.log`;
vor weiterem USB-Reader Prozess/Laufzeit prüfen. Nutzer zum einmaligen Connect
aufgefordert, kein paralleler PC-GATT-Client. PC-BlueZ-Adapter aktiv/unblockiert,
Bleak im System-Python nicht installiert; PC-GATT noch nicht getestet.
Neues detailliertes Protokoll: `testprotokoll-ble-verbindung-2026-11-13.md`. Der pauschale
Zusatz stammt aus`app/src/main.jsx:run` und wird auch bei lesendem Connect gesetzt;
kein Nachweis für SD-Schreibfehler oder erfolgreichen HMAC-Login. Keine unklaren
Speicher-/Uploadaktionen blind wiederholen.

`docs/serial/2026-11-13-ble-first-disconnect.log`: SD/I2S/AW/Gauge/config1,
Radio2,NFC1,Revision113,Volume17,playback4,Heap36260. Noch kein Gerätemitschnitt
des eigentlichen Verbindungsabbruchs, Ursache offen.

Vom Nutzer genanntes Hostingrepo`/home/markusinho/projects/ai-habibi` nur lesend
geprüft: `apps/boxbert` ist Buildbrücke, Quellen ausschließlich`boxbert/app`.
Live-JS`index-DzBpNY4D.js` ist bytegleich mit dortigem`sites/boxbert` und lokalem
`app/dist`,SHA256`36aeff09fd679202221a8ff99d97b4d18993ecb722f18e21acd126dce0e34ed8`.
Keine Veröffentlichung, kein Dienst-/Branchwechsel im Hostingrepo.

**Offenen BLE-Versuch verworfen, nie geflasht. Alle Codeänderungen zurückgesetzt.**
Insecure Cache`boxbert-build-a0ukgnbl` NICHT verwenden. Aktuell bleibt darunter
beschriebener geschützter BLE-Diagnosestanddepm3fts, b9h_54sn ist Rückfall.
Vor erneutem Flash wie bisher Park3 nötig.
Nächster Schritt: Fehleraktion klären, lesenden Verbindungsversuch beobachten;
bei Bedarf gezielte Traces für Connect/Disconnectgrund/Parser-Drop/Auth/Read,
keine spekulativen Bibliotheks- oder Timeoutänderungen.

## Neueste Nutzerabnahme / nächstes To-Do

Nutzer bestätigt vorgeschlagenen Test: Karte weg, blauer Startbutton,
Encoder-Pause/Weiter, Volume0 stumm und zurück2..3 — alles klappt. Zweite Karte/
Kartenwechsel ebenfalls bereits erfolgreich getestet. Nutzerbeobachtung, keine
neuen vollständigen seriellen Ablaufbelege oder Abnahme aller AW-Eingänge.
Tag2 soll **HappyTune** bekommen; letzter Diag Revision100 zeigt weiterhinFart.
Soll und Ist nicht vermischen; noch nichts geändert.
**Als Nächstes Handy-Weboberfläche:** Nutzer bestätigt Android/BLE/Chrome,
vorhandenes BLE2 nutzen. Passwort nur über USB in lokale private Datei
`~/.cache/boxbert-ble-passwort.txt` (0600) gesichert, nicht in Chat/Git ausgegeben.
HTTPS-App-HTML abrufbar, noch kein Beleg für reale Handy-/BLE-Verbindung.
Verbindung/Status, dann HappyTune-Zuordnung und Persistenz prüfen. Weitere Funk-/Last-/Power-/Sicherheitsprüfungen bleiben offen.

## Vorheriger Gerätestand ohne BLE-Traces: Regelbereich0..21 geflasht

Nutzer möchte bis21drehen. Aktueller Quell-/Geräte-/Buildstand:
`boxbert-v1-commissioning-20261113-nfc-v21`,
`~/.cache/boxbert-build-b9h_54sn/manifest.json`,2559211Byte Flash/173468Byte
Globale, MaxVolume21/Boot1.19native Programme,4Pin-Tests und6Encoder/RPC-
Szenarien (7Node inkl.Parent) grün. Keine automatische Erhöhung auf21, keine
Maximal-/Kindersicherheitsabnahme; nur Erwachsene ohne Kind im Raum langsam testen.

Nach Nutzer „ok super mach danke“ **NFC3/pauseRequested1 bestätigt**, dann
Quellen inkl.Runtimeheader und Artefakt-SHA256 geprüft, exaktv21geflasht.
`docs/serial/2026-11-13-volume21-{nfc-park,after-flash}.log`.
Nach Flash: NFC1/pauseRequested0,SD/I2S/PSRAM/AW/Gauge/config1,Radio2,Decoderläuft,
Revision91 beimDiag. Erster Mitschnitt bereitsVolume5, danach Encoderereignisse
requested=actual6..21 und erneut auf21begrenzt. Letzter SnapshotVolume21/
running1,Heap30824; keine automatische Hochregelung durch Agenten. **Boot1 ist
Codekonfiguration, nicht in diesem Mitschnitt beobachtet.** Keine akustische
Sicherheitsabnahme hoher Stufen. v12/n1_lldq4 jetzt historischer Zwischenstand.

## Vorheriger Schritt: Nutzer bestätigt Ton/TFT; Volume12 geflasht

Auf Frage zu Musik/TFT im gerade getesteten NFC-Gesamtstand bestätigt Nutzer:
**„ja safe hat gut geklappt alles danke“**. Das nimmt Tag1-Musik/TFT ab, nicht
ungeprüfte Mute/Pause/Tagwechsel-/Power-/Transportfälle.

Danach Auftrag, höher drehen zu können. **Jetzt Maximum12 statt6 geflasht,
Boot bleibt1:** `boxbert-v1-commissioning-20261113-nfc-v12`,
`~/.cache/boxbert-build-n1_lldq4/manifest.json`,2559227Byte Flash/173468Byte
Globale.19native Programme +6Encoder/RPC-Szenarien (7Node inkl.Parent) grün.
Nach Nutzer „liegt“ **NFC3/pauseRequested1 bestätigt**, Quellen/Runtimeheader/
SHA256 verifiziert, exakt neuen Build erfolgreich hochgeladen. Danach NFC1/
pauseRequested0,Volume1/playback2/running1,SD/PSRAM/AW/Gauge/config1,Revision81.
Musik startet wieder leise; späterer7-s-Passivlog zeigt Volume1/running0,
NFC1,Heap36748. Höhere Stufen vom Nutzer erst schrittweise prüfen,
keine akustische Norm-/Sicherheitsfreigabe. Keine weitere Firmwareänderung.
Details/Logs: `testprotokoll-nfc-integration-2026-11-13.md`,
`docs/serial/2026-11-13-volume12-{nfc-park,after-flash,passive}.log`.

## Vorheriger Geräteflash13.11.2026 — NFC aktiviert, noch Grenze6

**Historischer Zwischenstand vor Volume12:**
`boxbert-v1-commissioning-20261111-nfc`, Build
`~/.cache/boxbert-build-c0n11gac/manifest.json`,2559211Byte Flash/173468Byte
Globale. NFC aktiviert mit neuer kurzer I2C-Zustandsmaschine, kein Tagwarten
unter Wire-Mutex. Stick/BoostControl/AutoSleep bleiben AUS. Amp laut parallel
übernommener Nutzerbestätigung am Boost; Pull-down-Vorschlag nicht umgesetzt.

Gerätenachweis13.11.: NFC UID E3:2F:F6:33 → Arcade-Decoder läuft → natürliches
EOF, Encoder requested=actual2..6, kein erneuter Start im Ausschnitt. **Hör-/
Sichtbestätigung des Nutzers inzwischen vorhanden, siehe oben.**19native Programme/4Pin-Tests und
5Encoder/RPC-Szenarien grün. Letzter Zustand: Volume6,radio2,NFC1,playback4/
running0,Heap36516,Konfigrevision39. Die angeforderte NFC-Pause blieb bei
laufender Suche pending, danach wieder zurückgenommen; **Parken nicht abgenommen**.
Vor neuem Flash `nfc-pause`, Tag ggf. auflegen, **NFC=3/parked abwarten**;
`nfc-resume` hebt Anforderung auf. Fault2 nicht automatisch neu initialisieren.

Ausführliches aktuelles Protokoll und noch offene Geräteprüfungen:
[`testprotokoll-nfc-integration-2026-11-13.md`](testprotokoll-nfc-integration-2026-11-13.md).
Ton/TFT für Tag1 bestätigt; noch reale AW-Taster während taglosem Warten,
Tagwechsel/Parken und übrige Abnahme. Tag2-Mapping weiterhin vor Änderung klären.
**Die folgenden Fortsetzungsabschnitte sind Chronologie älterer Probe-/Restore-
Stände; dortiges „NFC aus/auvtr3vh“ beschreibt nicht mehr den aktuellen Flash.**

## Fortsetzung nach Abschluss-Commit58208da

Nutzer setzt dieselbe Session fort und bestätigt **PN532 jetzt angeschlossen**:
VCC3V3/GND, SDA3/SCL4, DIP1ON/2OFF, **IRQ anIO12**. Resetleitung nicht zusätzlich
bestätigt; Probe verwendet keinen Reset-GPIO. Dies ersetzt „Leser fehlt“ für den weiteren Verlauf; die
untenstehenden ersten Tests fanden noch ohne Leser statt. Externer Stick
weiterhin zuletzt nicht angeschlossen.

**Isolierte Initialisierungsprobe erfolgreich:** neuer Sketch
`firmware/tests/endaufbau_nfc_probe/`, Build
`~/.cache/boxbert-nfc-probe-yE5RKbtz`,404400Byte Flash/56160Byte globale Variablen,
Core3.3.12/QSPI, AdafruitPN5321.3.4. Rohlog
`docs/serial/2026-11-11-nfc-init-probe.log`: Wire/begin/SAM=1,
Version0x32010607 = PN532/Firmware1.6, IRQ12=HIGH im Ruhezustand.
Das ist eine Boot-Chipabfrage, **keine UID-/IRQ-Ereignis-/RF-Abnahme**; keine
Suchbefehle gesendet. TFT während separater Probe absichtlich dunkel/kein Ton.
Erster Compile scheiterte an Arduino-Autoprototypen bei einzeiligem Loop,
kein Upload dieses Fehlbuilds (`boxbert-nfc-probe-4N11ksGA`). Korrigierter
Build erfolgreich. Application-Upload meldete CDC-I/O-Fehler, danach Bootloader
identifiziert und exakt erfolgreich gebaute Probe hochgeladen.

**Danach Gesamtfirmware aus `boxbert-build-auvtr3vh` wiederhergestellt**, Quellen
und SHA256 erneut verifiziert. Auch hier CDC→Bootloader-Übergang, Upload über
Espressif-by-id erfolgreich; Logs im Buildverzeichnis
`upload-after-nfc-probe*.log`. Zwischenstand nach Initprobe also wieder Gesamtstand, **NFC-
Laufzeit weiterhin softwareseitig deaktiviert**, nicht die Probe! Neues Log
`2026-11-11-nfc-connected-integrated-restored.log`: SD/I2S/PSRAM/AW/Gauge/config=1,
Volume1,radio2,running0,Heap42632,Konfigrevision16,GPIO5/6HIGH,GPIO11LOW.
Revision/Schalterzustand unterscheiden sich vom früheren Abschluss; keine
Ursache ohne Nutzerbeobachtung erfinden. Tagpfade vorhanden/unverändert.

### UID/IRQ nachgewiesen; Karte war durchgehend aufgelegt

Nutzer bestätigt ausdrücklich: **Karte lag während der ganzen Untersuchung
auf dem Leser**. Keine spätere Auflage/Entfernung/Wechsel-/Reichweitenprüfung.

- `endaufbau_nfc_uid` v1, Build `~/.cache/boxbert-nfc-uid-bdobYBZU`,405136Byte
  Flash/56200Byte globale Variablen: eine Suche, readyReturn=1, GPIO12 danach
  HIGH. V1 wartete fälschlich zusätzlich auf LOW und las deshalb nicht aus.
  Kein Beleg für defekte/falsch angeschlossene IRQ-Leitung!
- Bestehende Antwort ohne neuen PN532-Befehl gelesen: separater
  `endaufbau_nfc_pending`, Build `~/.cache/boxbert-nfc-pending-qAne7Q3Y`,
  387036Byte Flash/56096Byte globale Variablen. PN532 blieb beim Feather-
  Reset/Flash versorgt. Ein Rohread64Byte ergibt checksum-validierte
  4-Byte-UID **E3:2F:F6:33**, Tag1. Log `2026-11-11-nfc-pending-response.log`.
  Parser `firmware/runtime/Pn532UidFrame.h`, Bounds/Checksummen/4+7Bytes host-
  getestet; alle18nativen ASan/UBSan-Programme grün. Kein Rohframe-Hexdump im
  erfassten Ausschnitt, nur gespeicherte Auswertung; nichts rekonstruieren.
- UIDprobe **v2** berücksichtigt readyReturn auch ohne nachträgliches LOW und
  beobachtet GPIO12-CHANGE-Flanken **nach** Init/während Suche+Auslesen.
  Build `~/.cache/boxbert-nfc-uid-edges-lSrT0Jgz`,407672Byte Flash/56792Byte
  globale Variablen, alle erfolgreichen Uploads hashverifiziert. Log
  `2026-11-11-nfc-uid-irq-edges.log`: UID E3:2F:F6:33 gelesen,
  **LOW=2/HIGH=2**, Leitung nachher HIGH. IRQ-Aktivität damit nachgewiesen.
  API pollt vorher I2C-RDY; HIGH erst nach API-Rückkehr beweist keinen Fehler.
  Keine Zuordnung jeder Flanke zu ACK/Tag, kein Wake-/Entfernungstest behaupten.
- Danach wieder **derselbe Gesamtbuild auvtr3vh**, NFC-Laufzeit weiter AUS.
  `upload-after-nfc-edges*.log` im Buildverzeichnis; aktuelle Bestätigung
  `2026-11-11-nfc-edges-integrated-restored.log`: SD/I2S/PSRAM/AW/Gauge/config=1,
  playback1/running0,Volume1,radio2,Heap42640,Konfigrevision26,GPIO5/6HIGH,
  GPIO11LOW. Kein serieller Hintergrundleser, Musik aus. Zwischenrestore nach
  Rohread ist separat als `nfc-uid-integrated-restored.log` aufgezeichnet.

**Nächster NFC-Schritt:** busverträgliche Laufzeitintegration und Tagwechsel/
Audio/Taster gemeinsam prüfen, ohne weitere Verdrahtungsänderung aufgrund des
HIGH-Snapshots. Tag1 soll wie bisher Arcade; vor Tag2-Wiedergabe beachten:
`hardware/nfc-tags.md` nennt historisch Happy Tune, tatsächliche migrierte SD-
Konfig zeigt `/fart.mp3`. Nicht stillschweigend überschreiben, Nutzerklärung.
Nicht einfach `Nfc=true` setzen: vorhandene Task
hält den gemeinsamen Wire-Mutex über `readPassiveTargetID(...,250)`; bekannte
Timeout-/überlappende-Suchbefehls-Problematik beachten. Timeout0 unter diesem
Mutex würde AW/Gauge ohne Tag unbeschränkt aussperren. Adafruit1.3.4-IRQ-Beispiel
und Implementierung gelesen: auch `startPassiveTargetIDDetection()` ruft
`sendCommandCheckAck()` auf, das zusätzlich auf die **Zielantwort** wartet
(Default1000ms); ist daher nicht vollständig busmutex-freundlich/nonblocking.
Bloßes Umbenennen der API löst das nicht. In der Gesamtfirmware IRQ12 bislang
passiv; CHANGE-ISR nur in der isolierten UIDprobev2. Kein Wake-Nachweis und
keine endgültige NFC-Aktivierung zugesagt.

## Auftrag und nächster Einstieg

Daddelbert hat die Box zusammengebaut. Verdeckte Signalverkabelung wurde durch
Einzelbetätigung ermittelt; SD war am Modul falsch herum angeschlossen und ist
inzwischen korrigiert. Seine Priorität ist eine funktionierende Lautstärkeregelung.
Einzeltest hierfür ausdrücklich bestätigt. Nach Gesamtflash meldete er
**„dateifehler steht da“**, ging duschen und beauftragte selbstständige gründliche
Diagnose, vollständige Übergabe sowie Commit/Push. Hör-/Sichttests dürfen nur mit
seiner Bestätigung abgeschlossen werden.

**Erster Schritt der neuen Session:** diesen Stand lesen, vorhandenen Flash nicht
blind ersetzen. USB-Capture starten, Nutzer den **großen blauen Button oben**
drücken lassen. TFT-Text, hörbaren Ton und Log gemeinsam abgleichen. Der Fehler
ist bislang nicht erneut reproduziert und **nicht nachweislich behoben**.

## 1. Physischer Aufbau / Grenzen

- Board Adafruit ESP32-S3 Reverse TFT Feather,4MB Flash/2MB PSRAM.
- Akku bleibt laut ausdrücklichem Nutzerwunsch während Flash/Funktionstests
  angeschlossen, zusätzlich USB. Versorgung/Polung laut Nutzer richtig, SD-VCC
  mit5V gemessen. Keine eigene elektrische Gesamtprüfung behaupten.
- **PN532 inzwischen angeschlossen/UID+IRQ geprüft und NFC integriert.**
  Externer NeoPixel-Stick fehlt weiterhin; keine Sticktests erwarten.
- Vor Umstecken/Durchgangsprüfung **USB UND Akku abtrennen**. Keine unbekannten
  GPIOs als Outputs suchen. Kein Löten/Powerumbau ohne separaten Auftrag.
- Booststeuerung, finale Sleep-Rails und tatsächliche Abschaltung nicht geprüft.
  GPIO9 ist im Inbetriebnahmeprofil kein aktiver Boost-Ausgang.
- Leise Tests: Boot1/21, temporäres Maximum6/21,0 stumm. Kein Nachweis einer
  akustischen Norm-/Kindersicherheitsgrenze; keine hohen Lautstärken ausprobieren.

Verbindliche reale Pins: `hardware/pinout.md`, ergänzt durch
`hardware/verkabelung-endaufbau.md`. Nicht aus alten Breadboard-Sketchen ableiten.

### Bestätigte Signale

- SD CS8/SCK36/MOSI35/MISO37,4MHz; TFT onboard CS42,135×240/Rotation1→240×135.
- Audio DIN16/BCLK17/LRC18, leiser Ton vom Nutzer bestätigt.
- Encoder A15/B14, Taste5; rechts lauter, links leiser; Zusatzkippschalter11.
- Zehn Arcade-IDs nach App-Geometrie, **nicht nach Farbe migrieren**:

| ID | Echter Button | Signal |
|---|---|---|
|1|30mm gelb oben links|AW Bit12=P14|
|2|30mm grün oben rechts|AW Bit6=P06|
|3|30mm rot unten links|AW Bit7=P07|
|4|30mm weiß unten rechts|AW Bit8=P10|
|5|24mm blau oben links|AW Bit5=P05|
|6|24mm grün oben rechts|AW Bit9=P11|
|7|24mm rot unten links|AW Bit10=P12|
|8|24mm gelb unten rechts|AW Bit0=P00|
|9|44mm blau oben|GPIO6|
|10|44mm rot unten|AW Bit11=P13|

Mini grün AW Bit15=P17, Mini rot Bit13=P15. **Gelber Mini links unbekannt:**
mehrfach drücken/halten ohne Signaländerung, nicht als defekt einstufen. Sentinel255
im Code verhindert ungültige Shifts/Pinzugriffe. Onboard-D0/Radiobutton bleibt IO0;
das ist keine Zuordnung des unbekannten gelben Minis.

## 2. Was tatsächlich bestätigt wurde

`docs/testprotokoll-endaufbau-inputs.md` enthält die Nutzeraussagen und Buildpfade.

1. Inputs einzeln gemessen, Decoder/Mapping dokumentiert.
2. SD bei4MHz und400kHz zunächst nicht mountbar. Nutzer korrigierte **vier falsch
   herum gesteckte Signalkabel am Modul**. Danach beide Taktraten erfolgreich,
   29818MiB, Root und erste≤512Bytes von acht Dateien lesbar. Kein Vollkartentest.
3. Audio bei1/21 gehört: Nutzer „yes hab gehoert“.
4. TFT plus Musik gemeinsam: „ja sieht super aus und musik auch“.
5. Isolierter Volume-Test: „passt danke“ — CW lauter/CCW leiser,0 mute bei weiter
   laufendem Decoder, angeforderter/tatsächlicher Wert0..6 passend. Interrupt-
   Quadratur, nicht Loop-Polling. Diese Abnahme gilt **nicht automatisch** für
   den Gesamtstand mit Radio/API und verzögerter SD-Persistenz.
6. Erster Gesamtflash mit NimBLE2.3.6 bootloopte bei Init. Kontrolliert auf
   Volume-Diagnose zurückgerollt. Isolierter BLE-Vergleich:2.3.6 Panic/resetReason4,
   gleicher Test mit2.3.8 Init/Advertising erfolgreich. Hersteller nennt den
   Core3.3.7+-Initfehler explizit. **2.3.8 bleibt gepinnt, Core3.3.12 unverändert.**

## 3. Aktueller Flash — nicht mit älteren Diagnosen verwechseln

- Quellen `firmware/boxbert/`, Kennung `boxbert-v1-commissioning-20261113-v21-blefix1`.
- **Exaktes aktuell geflashtes Artefakt:**
  `~/.cache/boxbert-build-prnsjyfe/manifest.json`, Dateien unter `artifacts/`.
  Compile-/Uploadlog im selben Verzeichnis. Quellen-/Artefakt-SHA256 vor Upload
  geprüft, Hashprüfung beim Schreiben erfolgreich.
-2560235Byte Flash (88% von2883584),173468Byte globale Variablen (52%).
- Isolierte CLI1.5.1, Core3.3.12, NimBLE2.3.8, QSPI-PSRAM/Boarddefaults.
  Keine OPI-Option. Keine privaten Heim-WLAN-Daten eingebaut.
- `commissioning`: Bootvolume1,max21, NFC=true, Stick=false,
  BoostControl=false, AutoSleep=false, UsbDiagnostics=true.
- SD/PSRAM/AW/Gauge/config=1; BLE-Modus2 und Hauptloop beobachtet.
 1=WiFi,0=Off. Diese Zahlen beweisen **keine Clientverbindung**.
- **Historischer Abschlusszustand11.11. vor NFC-Integration:** damaliges Artefakt nochmals verifiziert, Uploader-
  Reset (`upload-final.log`), danach `abschluss-idle.log`: playback1/idle,
  running0,Volume1,radio2,Heap42640/größter Block31732,PSRAM1576536Byte,
  Konfig gültig/Revision9, GPIO5/6/11 alle HIGH. Keine Musik läuft, kein
  Diagnose-Testtimer/serieller Hintergrundleser bleibt aktiv. Dies ist ein
  kontrollierter Boardreset, kein Power-Cycle der Akku-versorgten Peripherie.
- Groß blau startet Tag0, groß rot Tag1. Encoderpress Pause/Resume bzw.
  Wiederstart des letzten Titels; im Idle ohne Titel zunächst Musik starten.
  Physischer Start besitzt **kein20-s-Limit**.
- Persistierte Lautstärke wird beim Boot nur im RAM durch1 überschrieben;
  spätere Konfigmutationen speichern den aktuellen RAM-Wert mit. Normale
  Lautstärkerestaurierung nach Boot ist im Profil bewusst noch nicht aktiv.
- Aktuelle Firmware enthält Audio-/Button-/Tag-/Encoder-/Radio-Diagnose.
  Radiotrace nutzt `Serial.flush()` und10-ms-Schrittpausen: verändert Timing,
  ist weder ein zeitneutraler Test noch ein gezielter bewiesener Race-Fix.

Ältere Gesamtbuilds `boxbert-build-3qvvzmm_`, `boxbert-build-6ad58nq1` und
`boxbert-build-auvtr3vh` (NFC aus) wurden
abgelöst. Getesteter Rückfall **nur absichtlich**:
`~/.cache/boxbert-volume-IHv8dqX0` (isolierte Volume-Diagnose,20-s-Limit).
Binaries mit NimBLE2.3.6 nicht wieder als Gesamtstand verwenden.

## 4. „Dateifehler“: Befunde und weiterhin offene Ursachen

### Nicht fehlende Standarddateien

SD-Diagnose bestätigt gültige Konfiguration und vorhandene Pfade:

- Tag0 `/arcade-music-loop.mp3`,549988Byte; Tag1 `/fart.mp3`,23461Byte.
- Keine Intros konfiguriert. Weitere MP3: `pups01`, `test440`, `test880`,
  `subbasesoft`, `happy-tune`, `AUD-20231208-WA0004`.
- `.boxbert` vorhanden, **kein `/www`**. Musik nicht verändert/gelöscht.

USB `test9`/`test10` rufen denselben Buttonhandler wie die Hardware auf. Arcade
öffnet/decodiert Stereo44,1kHz/16Bit, gemeldete Dauer34s, läuft im Ausschnitt
bis zum20-s-Teststopp. Fart öffnet/decodiert bis EOF. Später beide Tests im
WiFi-Modus erfolgreich. Damit **Zuordnung plus Dateistartpfad geprüft**, aber
nicht der physische Kontakt, ursprüngliche Bedienfolge oder hörbarer Ausgang.

### Zwei zusätzliche Auffälligkeiten nicht weginterpretieren

1. Erstes `test10` startet nach EOF mehrfach neu, ohne weitere BUTTON-Zeilen.
   Damals fehlten TAG-/ENCODER-Marker. Nach Stop/Neustart und im späteren
   Tracebuild genau ein kurzer Start/EOF. **Ursache offen**; beim Wiederauftreten
   Caller prüfen, u.a. Encoderpress/physische Kontaktzustände. Nicht behaupten,
   dass der Nutzer mehrfach gedrückt hat oder das EOF-Restartproblem behoben ist.
2. Frühes `radio-off` im ersten Diagnosebuild führt zu sichtbarer Neuanmeldung,
   keine `DIAG radio off`, danach wieder radio2. Kein voller Panic-Backtrace.
   Später isoliertes NimBLE2.3.8-Init/Deinit/Reinit erfolgreich, mit und ohne
   Scan-Response. Tracebuild schafft drei BLE→Off-Zyklen sowie BLE→Off→WiFi→BLE
   bei weiter running=1 im Decoder. **Mit verändertem Timing**, Ursache offen.

`dateifehler-test10-radio-off.log` ist irreführend benannt: tatsächlich nach
Neustart wieder BLE, nicht bestätigtes Off. Alle Logs sind Ausschnitte, teils
mit angeschnittener alter Statuszeile. Keine fehlenden Bootdaten ergänzen.

### Speicherreserve kritisch offen

Frisch BLE-idle ca.42640Byte Heap. Nach WLAN-Initialisierung und Rückkehr zu BLE
ca.24316Byte idle, beim Decoder ca.18628Byte. Kein bewiesenes Leck, aber kaum
nachgewiesene Reserve für Auth/JSON/Uploads. PSRAM vorhanden; Audiopuffer dort.
Vor Produktfreigabe internes Heapminimum/größten Block unter realer RPC-/Radio-
Last prüfen; ggf. statische RGB565-TFT-Fläche (64800Byte im Shared-Renderer) mit
sauber getesteter Buffer-Schnittstelle in PSRAM verlagern. **Noch nicht geändert.**
NimBLE2.5.2-Changelog nennt weitere Timer-/Deinit-/Reinit-Fixes, aber2.5.2 hier
**nicht installiert/getestet**. Keine automatische Gleichsetzung mit unserem Reset.

## 5. Diagnose reproduzieren — nur ein serieller Leser

Anwendungsport:
`/dev/serial/by-id/usb-Adafruit_Feather_ESP32-S3_Reverse_TFT_d0:cf:13:0b:fb:c8-if00`

Bootloader ggf. Espressif-by-id
`usb-Espressif_USB_JTAG_serial_debug_unit_D0:CF:13:0B:FB:C8-if00`.
`ttyACM0/1` kann wechseln. OS Arch/uucp, kein WSL/dialout.

```sh
# Ohne --command: nur Capture; zuerst öffnen, dann Nutzer den blauen Button drücken lassen.
python3 tools/firmware/usb-diagnostics.py --seconds 60 \
  --log docs/serial/NEUES-DATUM-physischer-button9.log
python3 tools/firmware/usb-diagnostics.py --command diag --seconds 8 \
  --log docs/serial/NEUES-DATUM-dateipfade.log
# Startet leise echten Handler9, stoppt nach20s; Nutzer informieren.
python3 tools/firmware/usb-diagnostics.py --command test9 --seconds 24 \
  --log docs/serial/NEUES-DATUM-test9.log
python3 tools/firmware/usb-diagnostics.py --command test-stop --seconds 5 \
  --log docs/serial/NEUES-DATUM-stop.log
```

CLI akzeptiert außerdem `test10`, `radio-off`, `radio-ble`, `radio-wifi`.
Senden genau einmal, auch nach CDC-Neuanmeldung keine Wiederholung. Keine
DTR/RTS-Ioctls/1200-Baud-Berührung. Exit0 ist nur Sendeerfolg; Antwort/Reset/
Stopp prüfen. `/tmp/boxbert-*` sind alte Hilfsdateien, keine nötige Schnittstelle.
Vorher `pgrep -af 'boxbert.*monitor|usb-diagnostics'` prüfen, keine Doppelreader.

`credentials` existiert separat als lokale Zugangserholung, wird von der CLI
absichtlich nicht akzeptiert. Nur in eigenem **ungeloggten** Terminal anzeigen;
niemals Passwörter in Git/Testlogs. AP/HTTP-Benutzer `boxbert`, Gerätepasswort aus
NVS gilt auch für BLE-HMAC. Nicht durch einen neuen Default ersetzen.

Bei problematischer CDC-Verbindung nicht sofort umverdrahten oder alte Images
hochladen. Absichtlicher1200-Baud-Bootloader-Touch war bei Rollback notwendig;
kein passives Monitoring. Exakt gebautes Artefakt prüfen, Port identifizieren,
`compile && upload --input-dir` verwenden. Siehe `docs/dev-setup.md` und
`docs/gesamtfirmware-build.md`.

## 6. Offene Abnahme in sinnvoller Reihenfolge

1. **Physischer Button9 → TFT+Ton**, Originalfehler mit frischem Capture.
   Bei Fehler exakten START-Pfad, Dateiöffnung/Größe, Callback und caller prüfen;
   nicht pauschal SD-Defekt vermuten. Gegebenenfalls Zweitvergleich per USBtest9.
2. **Nutzer hört/sieht:** Musik, rechts lauter/links leiser,0 stumm mit weiterem
   Tracklauf, TFT-Wert passend, Encoderpress Pause/Resume. Große Buttons und
   verfügbare Minis im echten Gesamtstand kontrollieren. Zusatzkippschalter und
   D0-Radiobutton erst gezielt testen; bisher keine zugewiesene Produktfunktion
   für alle mechanischen Buttons/Minis abgenommen. Gelber Mini weiter offen.
3. EOF-Wiederholungen und Funkreset weiter beobachten, vorsichtig gezielt
   reproduzieren; Tracepausen als Timingänderung berücksichtigen. Keine gleich-
   zeitigen GPIO-/Takt-/Library-/Poweränderungen. Heapreserve beachten.
4. **Echte BLE/PWA-Verbindung:** PC-BlueZ meldete laufende Discovery
   (`org.bluez.Error.InProgress`), keine Boxbert-Zeile. Kein Funkdefektnachweis.
   Android/Chrome/Web-Bluetooth oder geeigneten Linux-Client nutzen, UUIDs und
   hello→nonce→HMAC-auth→read beachten. Firmwaremodus allein genügt nicht.
5. **WLAN/AP/HTTP tatsächlich testen.** Bisher nur gemeldeter mode1 und Decoder-
   Betrieb, kein verbundener WLAN-Client/GET/POST. SD-PWA `/www` fehlt. Build
   `app/dist-sd/` gemäß `app/README.md`/Builddokument gezielt installieren, Musik
   und `.boxbert` erhalten. Hierfür kein Upload der gesamten SD durch die MP3-API
   möglich. Vor Entnahme SD/Umstecken beide Versorgungen trennen; Rechnerkarte
   zuerst richtig nach `~/sd-card` mounten, dann kopieren, sync/unmount. Kein
   neuer Website-Deploy/externes Veröffentlichen beauftragt.
6. **Reale Konfig-/Uploadprüfung:** Tag/Button/Intro/Kategorie/LED-Settings,
   Volume-Cap0..6 (PWA kann21 anbieten→`invalid` außerhalb Profil), Savefehler,
   RESET-Rekonstruktion, abgebrochener Upload/Moduswechsel, Auth/HTTP-Fehler.
   Nicht mit Etappe5-Abnahme oder Hostfixtures gleichsetzen. Bootvolume1 bleibt
   im Profil absichtlich fest; nicht als Persistenzbug reparieren.
7. **Last/Dauer und Power separat:** API während Audio+TFT, Funkwechsel,
   Heapminimum, Flankenverlust/Inputs, SD-Dateiintegrität, viele Wechsel/EOF.
   Akustische Sicherheitsbewertung, Versorgungs-/Boost-EN-/Amp-/PN532-Rails,
   Akku/USB/Ladung/Schalter, Strommessungen und Sleep/Wake erst nach elektrischer
   Freigabe. Fehlende Hardware und Schutzannahmen niemals als bestanden markieren.
8. Profil/USB-Diagnose erst nach bestätigten Teilen gezielt aufheben. NFC/Stick
   nicht einfach aktivieren, solange sie fehlen; Sleep nicht mit Akku+USB-
   Funktionstest als freigegeben ansehen.

## 7. Hostnachweise / Daten erhalten

- Pin-Node4Tests; native ASan/UBSan19Programme inklusive PN532-Frameparser/Scan-Zuständen, Quadratur und
  USB-Parser/Timer (auch Millis-Wraparound/kein sofortiges Timeout).
- App68Tests; echte Encoder/RPC-Codeabschnitte in6Szenarien,7Node-Tests inkl.
  Parent: Limits/Mute/Drehrichtung, entprellte Persistenz, SD-/Uploadfehler.
- `g++ -Werror` scheitert an bestehender Formatwarnung in`TagLabel.h`; geprüfter
  Weg ist gepinntes Clang21.1.8, kein ungetestetes GCC-Erfolgsversprechen.

```sh
node --test tools/firmware/pins.test.mjs
nix shell github:NixOS/nixpkgs/0954f7ee2f6bb3dc7d4e3d0d8bcb8fd4bde4cfc5#clang \
  --command sh -c 'python3 tools/firmware/test-host.py && node app/tests/firmware-volume-host.mjs'
node tools/tft/build.mjs
(cd app && npm test)
python3 tools/firmware/build.py # baut isoliert, flasht NIE
```

Vor Integration lesende Sicherung in`~/.cache/boxbert-preintegrated-ggzks21p/`
(0700): damals beide SD-Konfigslots abwesend, LegacyNVS-tag0 absent,
tag1`/fart.mp3`. Mittlerweile gültige `.boxbert`-Konfig auf SD vorhanden.
Backup **nicht** als aktuellen Konfigdump oder automatische Restorequelle nutzen.
Keine Musik/SD-Formatierung/NVS-Löschung durchführen. Keine Geheimnisse/Binaries
committen. Toolchain/Builds/Backups bleiben privat außerhalb des Repos.

## 8. Belege / Arbeitsstand

- `docs/testprotokoll-gesamtfirmware-2026-11-11.md`: detaillierte Chronologie,
  Build-/Flash-/Bibliotheksvergleich und neue Diagnosefälle.
- `docs/testprotokoll-endaufbau-inputs.md`: reale Inputs/SD/Audio/TFT/Volume.
- Neue Rohlogs unter `docs/serial/2026-11-11-*.log`, insbesondere
  `dateifehler-*`, `radio-*-trace`, `player-wifi-*`, `player-radio-switches`.
- `firmware/tests/endaufbau_*`, `firmware/tests/README.md`: isolierte Rückfälle.
- `AGENTS.md`, `To-Do.md`, Pinout und Firmwarevertrag auf diesen Stand aktualisiert.
- Diese Übergabe gehört zum Abschluss-Commit dieser Session; genaue Commit-ID
  und bestätigten Pushstatus der Schlussantwort bzw. Git entnehmen:
  `git status --short` und `git rev-list --left-right --count HEAD...origin/main`.
  Nach erfolgreichem Push erwartet: leere Arbeitskopie und`0 0`. Kein Website-
  Deploy, Checkout oder Warenkorb-/Bestellvorgang durchgeführt.
