# Endaufbau — Eingangszuordnung, 11.11.2026

## Aufbau / Grenzen

Nutzer: Endaufbau verkabelt; PN532 und externer NeoPixel fehlen. Akku bleibt
auf ausdrücklichen Nutzerwunsch angeschlossen, zusätzlich USB. Versorgung /
Polung laut Nutzer sicher richtig, nicht durch Agent gemessen. Signalzuordnung
noch unbestätigt. Kein Umstecken und keine Durchgangsmessung unter Spannung.

## Tatsächlich geflasht

- Separater Sketch: `firmware/tests/endaufbau_inputs/endaufbau_inputs.ino`.
  Kein Gesamtplayer; vorhandene Referenzsketche unverändert.
- Lokale Arduino CLI 1.5.1, ESP32-Core 3.3.12, FQBN
  `esp32:esp32:adafruit_feather_esp32s3_reversetft`, Board-Defaults/QSPI.
- Build: `/home/markusinho/.cache/boxbert-inputs-NsM85rNz`;
  `compile.log`, `upload.log` dort. Compile und Upload mit `&&` verknüpft.
- 387548 Byte Sketch, 56152 Byte globale Variablen.
- Upload an `/dev/ttyACM0` erfolgreich, Hashprüfung erfolgreich;
  anschließender beabsichtigter Reset durch Uploader (RTS).
- Laufende Firmware durch wiederholten `INPUT-DIAG v1`-Status bestätigt.

## Diagnoseverhalten

Header-Kandidaten nur INPUT_PULLUP, IO9/Boost-EN nur INPUT ohne Pull-up.
Kein SPI, I2S, SD-Schreiben, Funk oder NeoPixel-Daten. TFT-Backlight bewusst
aus; Anzeige nicht Teil dieses Tests. Core setzt Board-Rails IO7/IO21 HIGH.
I2C ausschließlich auf den dokumentierten IO3/IO4 bei 100 kHz.
AW-Adressen 0x58–0x5B: ID 0x23 erforderlich, CONFIG0/1 erst auf Eingang,
danach GPIO-Modus LEDMODE0/1=0xFF, alle vier Register zurücklesen.
Kein AW-Reset, kein Ausgangsregister, keine aktive HIGH/LOW-Probe.
Interne Pull-ups sind schwache Bias-Ströme, kein Beleg einer elektrisch
richtigen Anschlussführung. Aktive Peripherie-/Boost-/SD-Prüfung bleibt offen.

## Beobachtet

Rohlog: `docs/serial/2026-11-11-endaufbau-inputs.log` (Ausschnitt ab laufendem
Betrieb, Bootausgabe nicht erfasst; keine rekonstruierten Bootmeldungen).

- Zwei erste Statuszeilen bei Uptime 25/30 s: AW9523 auf 0x58 aktiv,
  Eingangsbits 0xF7FF, I2C-Lesefehlerzähler 0.
- Somit P13 LOW; Ursache / zugehöriger Kontakt noch nicht bestätigt.
- Alle überwachten direkten GPIOs HIGH, IO9 passiv HIGH.
- Nutzer meldete anschließend Betätigung erledigt. Im Rohlog mehrere
  Ereignisse: IO11 mehrfach LOW/HIGH (96,709–113,237 s), ab116,589 s
  weiterhin LOW bis mindestens155 s; AW P14(138,022–139,542 s),
  P06(140,297–141,722 s), P07(142,327–144,167 s),
  P10(145,082–147,682 s) jeweils LOW/HIGH. P13 wechselte bereits bei
  39,262 s auf HIGH. Physische Kontakte/Farben noch nicht zugeordnet;
  nicht allein aus der Reihenfolge als Button-IDs übernehmen.

## Physisch zugeordnete Kontakte

Aufzeichnung nach 30-Minuten-Limit beendet und um19:05:05 ohne Reset neu
geöffnet. Dazwischen keine lückenlose Erfassung; erste gepufferte Statuszeile
beim Wiederöffnen unvollständig. Kleinen roten Button deshalb gezielt erneut
betätigen lassen; nur die neu erfasste Wiederholung dient als Nachweis.

| Kontakt laut Nutzer | Gemessener Eingang | Nachweis |
|---|---|---|
| Roter Button unten links (im angeforderten 30-mm-Test) | AW9523 0x58, P07 | LOW bei908238 ms, HIGH bei910133 ms; Nutzer bestätigt „rot unten links“. |
| Gelber Button eine Position über Rot unten links | AW9523 0x58, P14 | LOW bei956688 ms, HIGH bei958258 ms; Nutzer bestätigt „gelb eins drueber“. |
| Weißer Button rechts neben Rot | AW9523 0x58, P10 | LOW bei991338 ms, HIGH bei993263 ms; Nutzer bestätigt „weiss rechts neben rot“. |
| Grüner Button über Weiß | AW9523 0x58, P06 | LOW bei1022788 ms, HIGH bei1025058 ms; Nutzer bestätigt „gruen ueber weiss“. |
| Kleiner roter 24-mm-Button unten links | AW9523 0x58, P12 | Wiederholung: LOW bei7888906 ms, HIGH bei7890171 ms; Nutzer bestätigt Betätigung nach Benennung. |
| Kleiner blauer 24-mm-Button über dem kleinen roten | AW9523 0x58, P05 | LOW bei7942711 ms, HIGH bei7944316 ms; Nutzer benennt „blau oben drueber“. |
| Kleiner gelber 24-mm-Button rechts neben dem kleinen roten | AW9523 0x58, P00 | LOW bei8217061 ms, HIGH bei8218456 ms; Nutzer benennt „rechts neben rot ist der gelbe“. |
| Kleiner grüner 24-mm-Button über dem kleinen gelben | AW9523 0x58, P11 | LOW bei8244156 ms, HIGH bei8245851 ms; Nutzer benennt „gruen und der ist ueber gelb“. |
| Großer roter 44-mm-Button unten rechts | AW9523 0x58, P13 | LOW bei8268296 ms, HIGH bei8270056 ms; Nutzer benennt „grosser roter der ist unten rehcts“. |
| Großer blauer 44-mm-Button über dem großen roten | Feather IO6 | LOW bei8295748 ms, HIGH bei8297901 ms; Nutzer benennt „blau und der ist oben drueber“. |
| Grüner Mini-Drucktaster rechts neben dem gelben Mini-Taster | AW9523 0x58, P17 | LOW bei8396021 ms, HIGH bei8398381 ms; Nutzer benennt „gruen ist rechts daneben“. |
| Roter Mini-Drucktaster rechts neben dem grünen Mini-Taster | AW9523 0x58, P15 | LOW bei8417591 ms, HIGH bei8420001 ms; Nutzer benennt „rot ist rechts daneben“. |
| Drehencoder-Taster (nur gedrückt, Drehen noch ungeprüft) | Feather IO5 | LOW bei8444273 ms, HIGH bei8446943 ms; Nutzer bestätigt gezielten Druckversuch. |
| Zusätzlicher Kippschalter (nicht Hauptschalter) | Feather IO11 | Nutzer bestätigt gezieltes Umlegen/Zurücklegen;8526393–8530531 ms mehrere Flanken, zwischen8527611 und8530531 ms HIGH, danach wieder LOW. |

Damit für diese Kontakte Drücken/Loslassen nachgewiesen, keine vollständige
Buttonbelegung oder endgültige Funktionszuweisung. Planabweichung erst nach
Zuordnung aller Kontakte auswerten. IO11-LOW dem zusätzlichen Kippschalter
zugeordnet; Schaltflanken auffällig mehrfach, Kontaktstabilität separat prüfen.

## Encoder-Drehung

Gezielt angefordert: langsam etwa fünf Rastungen im Uhrzeigersinn, ohne
Druck. Nutzer bestätigt „ok“. Zwischen8469943 und8472188 ms wechseln IO15
und IO14; mehrfach IO15 LOW vor IO14 LOW. Beide Drehleitungen damit am
Feather beobachtet, passend zum Plan IO15/IO14. Kein exakter Rastungszähler
oder vollständiger Quadratur-Nachweis: 3-ms-Filter und I2C-Polling können
Flanken verlieren. Gegenrichtung anschließend gezielt angefordert, Nutzer
bestätigt „ok“:8498399–8500961 ms fünf beobachtete Sequenzen jeweils IO14
LOW → IO15 LOW → IO14 HIGH → IO15 HIGH. Gegenläufige Phasenfolge damit
beobachtet. Spätere echte Lautstärkeregelung/Rastungszuverlässigkeit offen.

## Noch nicht zugeordnete / auffällige Kontakte

- Gelber Mini-Drucktaster ganz links: Nutzer meldet ersten Versuch und
  gezielte Wiederholung (angefordert: fünf Sekunden halten). Im laufenden
  Log bis Uptime8375074 ms kein neuer Zustandswechsel seit dem großen
  blauen Button. AW weiterhin0xFFFF/errors0, IO11 weiterhinLOW, übrige
  überwachte GPIOsHIGH. **Nicht zugeordnet**, keine Defektdiagnose.
  Zusätzlich gezielter Halteversuch: Nutzer meldet „halte“, laufende
  Statuszeilen bis8570074 ms unverändert (AW0xFFFF/errors0, IO11LOW,
  sonstHIGH, IO9 passivHIGH). Kein Signal auch während bestätigtem Halten.
  Nicht überwachte Leitungen (z.B. Board-Taster0/1/2, I2C, EN) sind damit
  nicht ausgeschlossen. Erst übrige Kontakte testen, dann gezielt klären.

## SD-Versorgung

Nutzer misst auf Aufforderung Gleichspannung zwischen SD-Modul-VCC und GND:
**5 V**, gemeldet11.11.2026, USB und Akku laut bisherigem Aufbau angeschlossen.
Nutzer-Messwert, keine eigene Fernmessung; Genauigkeit/Lastspitzen nicht erfasst.
Diagnose treibt IO9/Boost-EN weiterhin nicht aktiv. Damit Versorgung vorhanden,
aber weder Quelle/Railführung noch SPI-Verdrahtung oder SD-Funktion bewiesen.

## SD-Lesetest — erster Versuch

Separater Sketch `firmware/tests/endaufbau_sd/`, ausschließlich geplante
SPI-Zuordnung CS8/SCK36/MOSI35/MISO37,4 MHz. Kein aktives Boost-EN, kein Audio,
keine Schreibdateien; TFT bewusst dunkel, TFT-CS42 HIGH zur Deselektion.

- Erster Compile in `~/.cache/boxbert-sd-NoGxAwLX` scheiterte am Arduino-
  Prototypgenerator (einzeiliges loop mit static-Lokalvariable); **kein Upload**.
  Mehrzeilige loop-Formatierung behebt den Compilerfehler.
- Erfolgreicher Build+Upload: `~/.cache/boxbert-sd-mEFInhOC`, CLI1.5.1,
  Core3.3.12, gleiche FQBN/Board-Defaults. 415596 Byte Sketch,54872 Byte RAM;
  lokale Compile-/Uploadlogs, Upload-Hashes erfolgreich, Reset durch Uploader.
- Eingangsmonitor vor Upload beendet. Neuer passiver Ausschnitt:
  `docs/serial/2026-11-11-endaufbau-sd.log`, Laufzeit10/15/20 s.
- **mounted=0**, somit kein erfolgreicher Karten-/Dateizugriff; IO9 passivHIGH.
  Keine Bootdiagnose erfasst. Nicht als Pinfehler oder defekte Karte werten:
  Einsetzen/Kartenformat/Verdrahtung/Signalqualität noch zu klären.
- Danach Nutzer bestätigt: richtige bisherige Karte steckt vollständig.
- Vergleich nur Takt4 MHz →400 kHz (Versionskennung v2), Pins unverändert.
  Build `~/.cache/boxbert-sd-slow-1FfCWaVU`,415592 Byte Sketch/54872 Byte RAM,
  Compile und Upload erfolgreich verkettet, Hashprüfung erfolgreich.
  `docs/serial/2026-11-11-endaufbau-sd-400khz.log` zeigt bei10/15/20 s
  weiterhin **mounted=0**. Langsamerer Takt behebt den Fehler nicht;
  keine Aussage über Defekt oder eindeutige Fehlerursache.
- Nutzer bittet anschließend „probier jetzt mal“; konkrete zwischenzeitliche
  Änderung unbekannt. Gleiche Quellen/Pins/400 kHz neu gebaut und geflasht:
  `~/.cache/boxbert-sd-retry-pKsZqdqc`,415592 Byte Sketch/54872 Byte RAM,
  Upload erfolgreich mit Hashprüfung und anschließendem Reset.
  **Jetzt erfolgreich:** Rohlog
  `docs/serial/2026-11-11-endaufbau-sd-400khz-retry.log`, Status bei15/20/25 s:
  mounted=1,root=1,entries=8,readOK=8,readFAIL=0,capacityMiB=29818.
  Acht nichtleere Dateien im Root jeweils mit bis512 Byte gelesen;
  kein vollständiger Datei-/Karten-/Dauertest, keine Schreibprobe.
  Boot-/Dateinamensliste nicht erfasst. Fehlerursache nicht aus Erfolg ableiten.
  Nutzer erklärt anschließend die Änderung: **die vier SD-Signalkabel waren
  am Modul falsch herum gesteckt und wurden korrigiert** (Nutzerbericht).
  Versorgungskabel nicht als vertauscht gemeldet. Frühere Fehler damit
  plausibel zur Signalverkabelung passend, nicht als SPI-Taktproblem bewerten.
  4 MHz nach dieser Änderung noch nicht erneut geprüft.
- Danach nur Takt zurück auf4 MHz (Kennung v3), korrigierte Verkabelung:
  Build `~/.cache/boxbert-sd-4mhz-vZRtQhvU`,415580 Byte Sketch/54872 Byte RAM,
  Compile+Upload erfolgreich, Hashprüfung erfolgreich. Rohlog
  `docs/serial/2026-11-11-endaufbau-sd-4mhz-korrigiert.log` bei10/15/20 s:
  **mounted=1,root=1,entries=8,readOK=8,readFAIL=0,capacityMiB=29818**.
  Somit auch4-MHz-Lesetest erfolgreich; weiterhin nur Datei-Anfänge,
  kein vollständiger Streaming-/Schreib-/Dauertest.
- Aktuell geflasht ist **SD-DIAG v3 (4 MHz)**, nicht mehr die Eingangsdiagnose.

## Audio-Diagnose

Nutzer bestätigt vor Aktivierung I2S-Verkabelung DIN→IO16,BCLK→IO17,LRC→IO18
mit „ja passt“. Separater Sketch `firmware/tests/endaufbau_audio/`, SD4 MHz,
Volume1/21, IO5 zum Start/Stop, Limit20 s, TFT dunkel, kein Boost-Ausgang.
API vor Build gegen installiertes audioI2S4.0.0-Beispiel I2Saudio_SD geprüft:
setPinout vor connecttoFS, audio.loop im Loop. Board-QSPI-Defaults beibehalten.

Build `~/.cache/boxbert-audio-b2r8lLW9`,1604228 Byte Sketch/75664 Byte RAM,
Compile+Upload erfolgreich verkettet, Hashprüfung erfolgreich, Uploader-Reset.
Aktuell geflasht **AUDIO-DIAG v1**. Rohlog:
`docs/serial/2026-11-11-endaufbau-audio.log` (Ausschnitt ab laufendem Betrieb).

Bei15/20 s:SD=1,PSRAM=1,I2S=1,active/running=1, Decoderzeit10/15 s,
Datei `/arcade-music-loop.mp3`,Volume1. Anschließend20-s-Limit STOP,
Datei geschlossen, Decoder zerstört; bei25/30 s active/running=0.
Startflanke nicht erfasst, daher keine Aussage, ob Nutzer neu gedrückt oder
IO5 beim Start gehalten war (v1 interpretiert auch gehaltenesLOW als Druck).
Kein automatischer Neustart am Liedende. **Hörbestätigung noch offen**;
Decoder-/I2S-Status allein beweist keinen Lautsprecherton oder akustische Sicherheit.
Anschließend bestätigt Nutzer ausdrücklich: **„yes hab gehoert“**.
Damit SD-MP3 über I2S/Verstärker/Lautsprecher beiVolume1/21 hörbar bestätigt.
Keine Aussage über Klangqualität, Dauertest, Maximalpegel oder akustische Sicherheit.

## TFT + SD + Audio

Separater Sketch `firmware/tests/endaufbau_audio_tft/` auf erfolgreicher
Audio-Diagnose aufbauend; zusätzliche TFT-Anzeige als Vergleichsänderung.
SD4 MHz,Volume1/21,IO5 Start/Stop,20-s-Limit unverändert. Gemeinsames
SPI-Objekt, SD-CS8/TFT-CS42 vor InitHIGH; TFT.init(135,240),Rotation1
nach lokalem Bibliotheksbeispiel und Findings. Keine Änderung an IO7.
Diagnoseansicht mit Rahmen/farbigen Ecken, Dateiname, Decoderzeit und Bildzähler;
noch nicht integrierter Boxbert-Renderer.

Build `~/.cache/boxbert-audio-tft-fdorkAGj`,1640672 Byte Sketch/77208 Byte RAM,
Core3.3.12,Board-Defaults, Compile+Upload erfolgreich mit Hashprüfung/Reset.
Aktuell **AUDIO-TFT-DIAG v1** statt Audio-only-Diagnose.
Rohlog `docs/serial/2026-11-11-endaufbau-audio-tft.log`:
bei10 s SD/PSRAM/I2S=1, inaktiv; danach Manual START connect=1,
MP3 stream ready (Stereo44,1 kHz,16 Bit); bei15/20 s running=1,
Decoderzeit3/8 s, TFT-Bildzähler48/68, gemeldete240×135 Pixel.
Das belegt ausgeführte Renderaufrufe und Decoderfortschritt, nicht sichtbare
Pixel oder störungsfreien Ton. Anschließend Nutzerbestätigung:
**„ja sieht super aus und musik auch“** auf gezielte Sicht-/Hörfragen.
Damit Diagnoseanzeige und hörbare SD-Musik im Parallelbetrieb als kurzer
Funktionstest bestätigt, keine Dauer-/Last-/Produktabnahme.

## Encoder-Lautstärkeregelung — Gerätetest vorbereitet

Auf Nutzerpriorität separater Sketch `firmware/tests/endaufbau_volume/`,
Basis erfolgreiche Audio-/TFT-Diagnose. Encoder IO15/IO14 per CHANGE-Interrupt,
Quadraturwertung gemessene CW-Folge3→1→0→2→3 positiv; vier gültige
Flanken pro Schritt. ISR nur Zustände zählen, kein Audio/Serial/SD;
Auswertung mutexgeschützt im Hauptloop. GPIOs wie gemessen, IO5 Start/Stop.
Boot mit gehaltenem Taster startet hier nicht vor erstem Loslassen.

Startvolume1, temporäre Testgrenze0..6 von21, TFT zeigt aktuellen Wert,
Stufe0 alsSTUMM. Keine Speicherung oder Wirkung durch Drehung auf Start/Stop.
Audio maximal20 s pro Start, kein Funk/Boost-EN-Ausgang. Kein akustischer
Sicherheitsnachweis allein durch Lautstärkestufe.

Portable Logik `Quadrature.h` nativ mit g++17/-Wall/-Wextra/-Werror geprüft:
CW+4/CCW−4, Rückprellen hebt sich auf, ungültige Zwei-Bit-Sprünge ignoriert,
Volumebegrenzung für alle Startwerte0..6 und Schritte−20..20 bestanden.
Testquelle/Binary lokal `/tmp/boxbert-volume-test.cpp`/`/tmp/boxbert-volume-test`.
Bibliothek setVolume/getVolume im installierten audioI2S4.0.0-Quellstand geprüft.

Build `~/.cache/boxbert-volume-IHv8dqX0`,1643752 Byte Sketch/77824 Byte RAM,
CLI1.5.1/Core3.3.12/QSPI-Defaults; Compile+Upload/Hashprüfung erfolgreich.
Aktueller Flash: **VOLUME-DIAG v1**. Rohlog
`docs/serial/2026-11-11-endaufbau-volume.log`: bei15 s SD/PSRAM/I2S=1,
Volume1, inaktiv, TFT240×135/Bildzähler50.

**Gerätetest anschließend vom Nutzer bestätigt: „passt danke“** auf Fragen
nach Drehrichtung, Anzeige und hörbarer Lautstärke inklusive Stufe0.
Rohlog bestätigt Schritte in beiden Richtungen mit requested=actual,
Grenzwert6 sowie Absenken6→5→4→3→2→1→0 und Wiederanheben0→6.
Bei60 s volume=0,active/running=1,Decoderzeit6 s; anschließend bei65/70 s
Decoderzeit11/16 s, somit Wiedergabe fortlaufend während Lautstärkeänderung.
Manual STOP/START und automatischer20-s-Stop ebenfalls erfasst.
Damit Regelung im kurzen Diagnose-Gerätetest bestätigt; keine Persistenz,
Maximalstufen7..21 oder Übernahme in Gesamtfirmware nachgewiesen.
Beim späteren Gesamtfirmware-Transfer Interrupt-Erfassung mitnehmen bzw.
Polling unter TFT-/Funklast separat auf verlorene Rastungen prüfen.

## Offene Arbeit / Widerspruch vor Gesamtflash

`hardware/verkabelung-endaufbau.md` (28.10.) legt 24-mm-Buttons 1/2 auf
AW P11/P12, zweiten Kippschalter auf AW P13. `firmware/Config.h` erwartet
noch IO39/IO13/IO38. Nicht stillschweigend aufgelöst: reale Kontakte jetzt
einzeln zuordnen, danach Pinvertrag, Implementierung und Tests angleichen.
Die zwei vorhandenen Node-Pintests bestanden, decken diesen Widerspruch
aber nicht ab. Isolierter Gesamtbuild scheiterte zuvor an fehlender
`~/.local/share/boxbert-toolchain/bin/arduino-cli`; kein Gesamtimage geflasht.
