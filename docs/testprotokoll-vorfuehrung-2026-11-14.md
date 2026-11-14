# Vorführung vorbereiten — 14.11.2026

## Letzte Korrektur: Nutzer will ausdrücklich Happy Tune auf RFID2

Nach Flash/Arcade-Pups-Bericht stellte Nutzer klar: **„ich will happy tune auf2“**.
Daher jetzt gezielt lokalenUSB-`demo-songs`-Befehl ausgeführt, keine neueFirmware.
SD-Save meldetRevision151; anschließenderDiag bestätigt **Tag1Arcade549988Bytes,
Tag2HappyTune642028Bytes**, beideexists1/Introsempty,SD/config1,NFC1/pause0.
ConfigStore.save hat den geschriebenenSlot mitRevision/Checksum/validConfig
verifiziert; zusätzlicherDiag liest aktuellenStand. Kein erneuterRESET zur
separatenKaltstartprüfung, gespeicherteZuordnung nicht bloß RAM-Override.
SonstigeKonfiguration durchCopy erhalten,Setup setztVolume1. KeineMedienlöschung.

USBTest10 nutzt echtenButton-/TaghandlerIndex1: HappyTuneöffnet,MP3Decoderund
Streambereit,40sDateidauer berichtet. Nach4s expliziterTeststop; kein40s-Ende-Test.
DanachLive-Encoderbewegungen2..8, nicht vomAgenten ausgelöst; finalDiag
**Rev161,Volume7/playback2,SD/config1,NFC1/pause0,korrekteTagpfade**.
KeineweitereAudio-/Lautstärkeänderung durchAgent nachdiesenNutzereingaben.
NeuephysischeTag-/Hörabnahme nicht ausUSBtestsbehaupten.

Belege:`2026-11-14-demo-happytune-{mapping,player,final}.log`.
InstallierterFlash bleibtuluu6evy/demo1,Boot1/max21,keineReaderaktiv. Vorherige
Arcade/Pups-Angaben gelten nurhistorisch. NachVorführung Web-/Introcheckpoint
fortsetzen, wieinTo-Do. SD-Init-Ausfall weiterhinnichtalsbehobenbehaupten.

## Vorheriger Flashanlauf: geflasht, zunächst Zuordnung Arcade/Pups

Nach obigem Arbeitsstillstand bat Nutzer erneut um Flash „diese beiden“.
Agent benannte zweimal ausdrücklich RFID1Arcade/RFID2Pups, Nutzer bestätigte
mit „ok“. Deshalb bestehende Zuordnung erhalten, **kein `demo-songs`** und keine
ungefragte HappyTune-Migration. Neue Abnahme ersetzt das frühere Soll für diese
Vorführung; kein allgemeiner Wunsch nach HappyTune als erledigt behaupten.

Karte aufgelegt: `NFC parked: no pending command; safe for planned board reset`,
NFC3 im`2026-11-14-demo1-final-park.log`. Leser43592 vorUpload beendet.
Erneut24Source-/Runtime-/UI-/Configdateien gegenStaging und sämtlicheManifest-
Artefakthashes geprüft. Code/Flags unverändert wie unten beschrieben.

Upload exakt`uluu6evy/artifacts` mitCLI1.5.1/FQBNReverseTFT: Anwendungsport
Fehler5/Input-output währendReenumeration, danach bekannterUSB-JTAG-Bootloader
verfügbar. GleicheArtefakte dort erfolgreichhochgeladen,geschriebeneDatenHashes
verifiziert,HardReset bestätigt. **Jetzt tatsächlicherFlash**
`boxbert-v1-commissioning-20261114-demo1`. 2561323ByteSketch lautCompiler,
AppBIN2561472Bytes lautUpload,173468Globals; keine verwechslungsfreie Gleichsetzung
vonCompiler-Sketchgröße und tatsächlicherBIN-Länge. Core3.3.12/QSPI/NimBLE2.3.8,
Boot1/max21,NFCtrue,Stick/BoostControl/AutoSleepfalse,Authentifizierung erhalten.
KeineNeuformatierung/keinNVS-/SD-Erase, nur reguläreFirmwarepartitionen geflasht.

DanachDiag: **SD/I2S/config1,Revision150,Volume1,NFC1/pauseRequested0**, beide
Introfelderleer, achtbestehendeMP3mitbisherigenNamen/Größen gelistet. Tag0Arcade,
Tag1Fart; gewünschte letzteZuordnung hatFlash/Reset überstanden. Keine neue
Konfigurationsschreiboperation, keine Änderung andererButtons/Kategorien/Namen.

USBTest9→TAGindex0→Arcade549988Bytes/MP3Decoderbereit/Streamready.
USBTest10→TAGindex1→Fart23461Bytes/MP3Decoderbereit/Streamready/natürlichesEOF.
Danachexplizit`test-stop`,Volume1/NFC1/SD1/config1. Das prüft echteHandler und
Datei-/Decoderpfade, **kein neuerphysischerTag2-/Hörnachweis**, keinDauertest.
AlleLeserbeendet, keineverzögerteFlashaufgabe. SD-Startproblem weiterungeklärt.

Logs: `2026-11-14-demo1-{upload-app,upload-bootloader,after-flash,two-song-check}.log`.
NachVorführung wiegemerkt Android-Wake-Lock/Introabschluss zuerst; nichts an
Website oder Buttons währenddiesesFlashs geändert. FolgendeAbschnitte sind
historischeVorbereitung und anfänglicheBlockade, nichtaktuellerFlashstatus.

## Historischer Erstversuch: Auftrag und damalige Ergebnisgrenze

Nutzer möchte für Besuch Tag1Arcade/Tag2HappyTune, Web-/Introarbeit später fortsetzen.
**Nicht als erledigt melden:** Noch kein neuer Flash und keine Zuordnungsänderung.
Nutzer ist inzwischen weg. Notwendiger NFC-Park3 vor Flash war zuletzt nicht
gegeben (offene Targetsuche ohne Karte); nicht ohne Freigabenachweis resetten.
NFC-Pause wieder aufgehoben, damit vorhandener Stand benutzbar bleibt.

## SD nach Nutzer-RESET wieder erkannt

Anfangs SD0/config0, beide RAM-Pfade leer. Nutzer bestätigt Karte steckt und
Verkabelung seit gestern unverändert. Keine Kabel geändert/keine Daten gelöscht.
Vor erstem Neustart NFC3 nach Kartenauflage bestätigt. Esptool-Run konnte über
Anwendungs-USB nicht verbinden; kein Flash. Passiver Leser vor angefordertem
RESET gestartet, endete aber vor Nutzeraktion; deshalb keine Bootzeilen erfinden.
Dateinamen `2026-11-13-demo-*` stammen aus vorigem Arbeitskontext, Captureheader
zeigen tatsächlich14.11.2026.

Nach Nutzer-RESET frischerDiag: **SD/I2S/config1**,Revision143,Volume15/playback2,
Tag0Arcade/Tag1Fart, beideIntrofelderleer, HappyTune642028Bytes vorhanden,
NFC1. SpäterRevision150/Volume12/playback4. Lautstärkeänderungen nicht automatisch
vom Agenten veranlasst. Quelle `2026-11-14-demo-after-user-reset.log` undParklog.
SD-Startfehler nicht erklärt/behoben; Dateiliste kein Vollkartenintegritätsbeweis.

## Lokal vorbereiteter neuer Gesamtbuild, NICHT geflasht

Minimaler Zusatz: exakter lokaler USB-Befehl **`demo-songs`**, keine neue HTTP-/
BLE-Operation, keine Bootmigration. Prüft SD/config gesund, keinUpload aktiv,
beide Dateien existieren. Kopiert vollständigeKonfiguration, ändert nur die zwei
Tagpfade undVolume1, speichert über bestehenden zweigenerationigen ConfigStore,
stoppt Player. Buttons, Namen, Introzuordnungen, LEDs, Kategorien unverändert.
Auch bei späterem Reset keine automatische erneute Mappingänderung.

Kandidat **`~/.cache/boxbert-build-uluu6evy/manifest.json`**,
Kennung`boxbert-v1-commissioning-20261114-demo1`,Core3.3.12/QSPI,NimBLE2.3.8,
2561323ByteFlash/173468ByteGlobals,Boot1/max21,NFCtrue; übrigeFlags unverändert.
BIN-SHA256`336c5ab5990fb84d5f253a3a0abb68fc1dee29d62d396f708771f372c0ab1627`.
Erster isolierterBuild durch Harness120s-Timeout beendet, **kein Flash daraus**.
Compile desselben überprüften Stagings mit identischemCLI/FQBN/Jobs fortgesetzt,
Exit0. DanachManifest erzeugt,24Quell-/Runtime-/UI-/Configdateien bytegleich mit
Repo geprüft, keinSecrets.h, Artefakthashes berechnet. Manifest markiert Resume.

20native Sanitizerprogramme inkl.neuer exakter USB-Parserfälle,6Encoder/RPC-
Szenarien (7Node inkl.Parent),9Pin-/Trace-/Demoquellverträge grün. Sourceverträge
sind keine tatsächliche SD-Konfigurations-/Demo-Abnahme.
Logs `2026-11-14-demo1-{host,contracts}.log`; Compilerlog bleibt imBuildcache.
Rollback letzter bestätigterFlash: `boxbert-build-prnsjyfe`,blefix1.

## Wieder in sicheren, nicht geparkten Zustand zurückgesetzt

Vor Flash Pause angefragt, aber durchgehend NFC1/pauseRequested1, keinPark3.
Einmal bestehender USB-`test9` mitVolume1/20s-Stopp: Arcade öffnet, Decoder/Stream
bereit; kein eigener Hörnachweis. Automatischer20s-Stopp geloggt.
Nutzer meldet danach weg, Agent soll allein fertigstellen. Keine verfügbare
BLE-fähigePC-Hardware und kein WLAN-Interface; kein verbotener Reset/Flash eines
ungeparkten PN532 als Abkürzung. Noch keine Ausführung des neuenSetupbefehls.

**Abschließend `nfc-resume` und frischerDiag:** SD/I2S/config1,Revision150,
Volume1/playback1,Tag1Arcade/Tag2Fart, beideIntrosleer,NFC1/pauseRequested0,
keinBLEPeer. Alle Leser beendet. Benutzer kann vorhandene Zuordnung weiter
verwenden; **HappyTune auf Tag2 fehlt noch**. Keine später automatisch startende
Flashaufgabe eingerichtet.

Weiter: Karte kurz auflegen →Pause+Park3 nachweisen →genauKandidat/Hashes/Quellen
prüfen →flashen →beiSD/config1 explizit `demo-songs` →DiagReadback/Persistenz und
beide realenTags leise prüfen. Keine Firmware aus2.3.6 oder unsicherenBuilds nehmen.

Danach Web-Arbeitspunkt: `?stand=upload-wach-14` ist online/öffentlich geprüft,
echter Android-Wachhalten-/vollständigerIntro-Commitvergleich fehlt; BLE-Tempo
und Button-ID-Ziel1Grün weiterhin offen. Keine Browserdaten löschen.
