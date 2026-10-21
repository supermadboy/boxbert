# Boxbert — To-Do

## In Arbeit / Nächste Schritte

- [x] **Gesamtfirmware softwareseitig integriert (19.10.2026):** vollständig mit BLE und WLAN,
  bestehenden PWA-Funktionen, RFID-Intro, TFT V2, Buttons/Encoder, NeoPixel und
  Auto-Sleep. Gemeinsame Geräte-RPC in `docs/firmware-api-v1.md`, neuer
  Integrationsstand `firmware/boxbert/`, private reproduzierbare Buildausgabe
  über `tools/firmware/build.py`. 68 App-Tests, 15 native Hostprogramme mit
  ASan/UBSan und fünf zusätzliche Encoder/RPC-Ereignisfolgen bestanden.
  Browser: Gerätevertrag mit nativem synthetischem Testmikrofon, echtes HTTPS,
  neue Offline-Dokumente, Mobile/Light/Dark geprüft. **Kein Flash und keine
  Geräteabnahme**. Neue Ideen wie
  Spotify, OTA, Soundkatalog und RFID-Spiele sind nicht eingeschlossen.
  [Build/Handoff](docs/gesamtfirmware-build.md),
  [noch auszuführende Geräteabnahme](docs/gesamtgeraet-abnahme.md).

- [x] **TFT V1 abgeschlossen (Nutzerbestätigung 18.10.2026):** DejaVu Sans
  bestätigt, gemeinsamer C++-/WASM-Pixelrenderer mit identischen RGB565-Pixeln,
  Bitmap-Schrift, Icons und Zeit/Fortschritt. Browser nutzt nur das fertige
  240×135-Canvas ohne Sprite. Native-/WASM-Pixeltests, 51 App-Tests sowie
  Browser/HTTPS/Offline bestanden. [V1-Nachweis](app/docs/verification-tft-v1.md),
  [Anzeigevertrag/Build](docs/tft-rendering.md), Release `?stand=tft-v1-10`.
- [x] **TFT V2 Software abgeschlossen (18.10.2026):** optionale,
  reproduzierbare Blender-/RGB565-Frames im gemeinsamen Renderer mit V1-Fallback.
  53 App-Tests, sechs Assettests, 240 V2- und 80 unveränderte V1-Pixelvergleiche
  grün; Browser/HTTPS/Offline und erneuter Assetbuild geprüft.
  [Nachweis](app/docs/verification-tft-v2.md), Release `?stand=tft-v2-cachefix-12`.
  **Updatefehler behoben:** inhaltsabhängige WASM-/Frame-Dateinamen verhindern
  V1/V2-Mischstände; echter V1-Service-Worker als Upgrade-Regression geprüft.
  V1 ist abgeschlossen; die spätere ESP-Gesamtintegration bleibt separat
  in `docs/endinbetriebnahme.md`, keine Voraussetzung für diesen V2-Auftrag.
  Fahrplan und Checkliste: [TFT-Plan](.hermes/plans/2026-10-16_151332-tft-v1-v2.md).

- [x] **Historischer Browser-Designstand vor V1 (16.10.2026):** App-Reiter
  mit vollständiger 240×135-Ansicht, 3D-Boxbert mit Augen/Bewegung, Akku, WLAN,
  Lautstärke, Titel-Laufschrift, Fortschritt und Spielzeit. Nur Beispieldaten,
  keine Firmwareänderung. 47 Tests und HTTPS-/Offline-/UX-Prüfungen bestanden.
  Designfeedback und späterer Geräte-Render-/Statusvertrag bleiben offen.
  Nachweise: `app/docs/verification-tft.md`. Statusleiste anschließend auf
  Nutzerwunsch als Smartphone-Icons oben rechts umgesetzt; portierbare
  Symbolgeometrie, 48 Tests und HTTPS/offline geprüft. Aktueller Nachweis:
  `app/docs/verification-tft-statusbar.md`, Release `?stand=tft-statusbar-9`.

**Fertigungscheck 16.10.2026:** Alle zwölf erneut ausgeführten Mesh-/Schablonen-/
CNC-Prüfaufrufe bestanden. **SD-Halter inzwischen fertig konstruiert**, siehe
aktueller Eintrag unten und `3d-print/mounts/sd-mount/README.md`. Gehäuselayout,
Positionen, Leisten/Kabelräume und Lautsprecher-Rückwand übernimmt Daddelbert
selbst; keine Voraussetzung für weitere Einzelhalter. Plexiglas-Schraubfixierung
von Hand vorgeschlagen. Akkuhalter vorhanden, nur reale Haltewirkung ungeprüft.
Prüfgrenzen, Teileliste und Nachweise: [`docs/fertigungsstatus.md`](docs/fertigungsstatus.md).

- [ ] **PWA-Grundgerüst gebaut (11.10.2026)** — schlichte Verwaltung unter
  https://habibi.supermittel.com/boxbert/, eigene MP3, zwei RFID-Zuordnungen,
  Lautstärke/NeoPixel als eindeutig persistente Browser-Simulation. Kein
  Online-Soundkatalog im aktuellen Auftrag. 11 Unit-/Vertragstests und Browser-
  Tests inklusive echtem HTTPS-Offline-Neustart bestanden. Quelle `app/`,
  Übergabe `app/README.md`, Nachweise `app/docs/verification.md`.
  Relativer SD-Webbuild und bestehende Etappe-5-HTTP-API vorbereitet.
  **PWA-Teilfreigabe erweitert (11.10.2026):** grafische Demo-MP3-Belegung
  aller zehn Buttons (4 × 30 mm links, 4 × 24 mm Mitte, 2 × 44 mm rechts),
  persistenter bunter Regenbogen mit Helligkeitsvorschau. Alte Demo-v1-Daten
  bleiben bei Migration erhalten. Tests/HTTPS-Offline erneut bestanden:
  `app/docs/verification-buttons-rainbow.md`. Keine Freigabe aller zehn
  Hardwarebuttons zur Verkabelung, kein RFID-Soundboard oder echtes Demo-Audio;
  Geräte-Button-/NeoPixel-APIs fehlen weiterhin und sind ausgegraut.
  **Tag-Namen ergänzt:** frei und wiederholt änderbare Namen, UID stabil,
  Browser-Persistenz und Migration geprüft. Später Namen auf SD speichern;
  Namens-/SD-API und echte SD-/Neustarttests fehlen noch. 26 Unit-/Vertragstests
  plus Namens-, Button- und HTTPS-Offline-Browserprüfungen bestanden.
  **Autorisierte UX-Erweiterung umgesetzt (11.10.2026):** drei echte Reiter
  Medienbibliothek / Zuordnung / LEDs, fixed Lautstärkebar mit Safe-Area,
  Sounds/Musik ausschließlich für MP3 als Browser-Metadaten, zwei unabhängige
  NeoPixel-Kanäle (Stick 8 + Onboard 1), automatisches System-Dark/Light.
  Altdatenmigration und Browserregressionen bestanden, beide Builds gebaut und HTTPS deployed;
  HTTPS-UX 320/390/1280 in Light/Dark sowie Offline-Reload/neues Dokument
  geprüft. Release `https://habibi.supermittel.com/boxbert/?stand=ux-3`,
  Nachweise `app/docs/verification-ux.md`. Keine Firmware-/GPIO-Änderungen.
  **UX-/Effekt-Ausbau für diese Session abgeschlossen:** unabhängige Palette
  Einfarbig/Regenbogen plus animierte Stick-Laufrichtungen, Mitte nach außen,
  Atmen und sanfte Party; Onboard zusätzlich Farbwechsel/Kerzen-Licht.
  Migration, Reduced Motion und RAF-Lifecycle geprüft. 42 Tests und echte
  HTTPS-Offline-/UX-/Effektprüfungen bestanden. Neuer Release-Link:
  `https://habibi.supermittel.com/boxbert/?stand=ux-effects-4`.
  Nachweise `app/docs/verification-led-effects.md`.
  **Historischer Zwischenstand: Intro-Zuordnung als Mock (11.10.2026):** optionale vorhandene MP3
  pro RFID, unabhängig vom Song; Browser-Persistenz, Migration, Entfernen,
  Reset und HTTP-Deaktivierung geprüft. 46 Tests und echte HTTPS-/Offline-
  Browserprüfungen bestanden. Release `?stand=rfid-intro-5`, Nachweis
  `app/docs/verification-intro.md`. Kein Audio, keine Firmware-/Timingzusage.
  **Nutzerkorrektur Intro (11.10.2026):** direkt je RFID aufnehmen und Aufnahme
  löschen, keine Bibliotheksauswahl. Browser-Mikrofon/IndexedDB umgesetzt und
  mit synthetischem Testmikrofon auf echtem HTTPS inklusive Offline-Neustart
  geprüft; Aufnahme-/Resetfehlerregressionen bestanden. Release
  `?stand=rfid-record-6`, Nachweis `app/docs/verification-recording.md`.
  **Intro-Idee/UI abgeschlossen (11.10.2026):** laufende und gespeicherte
  mm:ss-Dauer, Mikrofon-/Stop-/Abbruch-/Löschen-Icons, bestehende Blobs erhalten
  und Legacy-Dauer lokal dekodiert (sonst unbekannt). Nachweis
  `app/docs/verification-recording-ux.md`, Release `?stand=rfid-record-ui-7`.
  Echte HTTPS-/Offline-Dauerprüfung und Aufnahmeregressionen bestanden.
  **Endinbetriebnahme-Ziel:** gemeinsame Firmware und Geräteadapter sollen
  vor dem fertigen Aufbau vorbereitet sein. Ein späterer kurzer Flash-/
  Testprompt darf nicht erst die Softwareentwicklung starten. Aktuell fehlt
  diese Integration; Grenzen und Voraussetzungen: `docs/endinbetriebnahme.md`.
  MP3-Konvertierung, HTTPS-PWA-Gerätetransport, SD-Introzuordnung und echte
  Player-/Timingtests bleiben separate Arbeit. Keine Firmwarefreigabe daraus.
  **Noch offen:** Nutzer beurteilt Look-and-feel; später SD-Webhosting in
  Firmware, weitere Status-/Einstellungs-APIs und BLE integrieren und am ESP
  testen. Kein Flash, keine TFT-/OTA-Änderung; kein Plug-and-play-Nachweis.

- [ ] **MAX98357A-Verstärker-Mount als Vorschlag erstellt (09.10.2026)**:
  `3d-print/mounts/max98357-mount/`, 38 × 26 × 12 mm, Gitter,
  zwei gestufte Gewindepfosten + zwei massive Stützen, Einsätze von unten,
  zwei seitliche Senkkopflöcher. Nutzerfotos und Bestätigung passen zum
  bestellten ADA3006; alte Klon-Einordnung widersprochen. Original-Mono-PCB
  geprüft: 17,78 × 19,05, zwei Ø2,5-Löcher im Abstand 12,70 mm.
  STL/Quellprüfung PASS, sechs Vorschauen tatsächlich angesehen.
  **Nächster Schritt: Nutzer schaut Vorschlag an.** Druck-, Einsatz-/Last-,
  Lot-/Stecker-, PCB-Schrauben- und Holzpassung weiter offen.
  Details: `docs/testprotokoll-max98357-mount.md` und Mount-README.

- [ ] **SD-Halter fertig konstruiert (16.10.2026)** auf ausdrücklichen
  Fertigstellungsauftrag: HW-125, Gitter44×56×12, vier gestufte Pfosten mit
  ruthex RX-M2,5×5,7 von unten, zwei seitliche3×12-Senkkopf-Holzschrauben.
  SCAD/STL, echte Vorschauen, Mesh-/Solid-Prüfungen im Mount-Ordner.
  Lochraster20×38 bleibt akzeptierte Annahme; physische Passprobe offen.
  M2,5×12 als Längenbeispiel, reduzierte Köpfe max.Ø4/Höhe1,8 mm erforderlich.
  Reale Unterseite, Schrauben-/Heat-Set-/Last-/Kartenpassung prüfen; keine
  Druck-/Einbaufreigabe. README: `3d-print/mounts/sd-mount/README.md`.

- [ ] **Feather-Fenster / CNC-Front — aktuelle Außenfräs-Version 15.10.2026:**
  Nur Durchbruch + äußere Glasfalz, keine Innenbearbeitung. Führung direkt im
  Durchbruch, Laschen als Anschlag, TFT nominal 2 mm vor Glas. Vormontage
  außerhalb, eingebaut kein Steckzugang nötig. SCAD/STL/DXF und Höhenansicht
  im Fenster-Mount-Ordner. **USB-Aussparung macht Daddelbert von Hand**, nicht
  per CNC; ohne sie bleibt dort eine bewusst dokumentierte Kollision.
  Reale Passprobe, Bauteil-/Headerhöhen, Glasfixierung und Lasttest offen.
  Der NeoPixel-Mount ist inzwischen separat beauftragt und erstellt, siehe unten.
  PN532-MOD ist separat beauftragt und konstruiert, siehe unten.
  Referenz: `docs/mounts-weiterarbeit.md`.

- [ ] **PN532-Plexiglas-Deckelhalter (Messabgleich 21.10.2026):**
  `3d-print/mounts/pn532-mount/`. Nutzer bestätigt PCB 42,7×40,4;
  Messwerte: Dicke1,15, LöcherØ2,93, vier nahe Kantenabstände bis Lochrand6,26.
  Daraus Raster27,25×24,95. Holzlaschen jetzt links Richtung Button und oben
  beim rechten oberen PCB-Loch (Fotoorientierung), keine rechts/unten.
  Nutzerkorrektur: I2C oben, Kabel-/Zugentlastungsmodell ebenfalls oben;
  Wände unten/rechts. Exakter Stecker-Offset/Hülle bleibt ungemessen.
  Alle Richtungen foto-relativ; Foto-rechts wird später Gehäuse-oben.
  Formkorrektur auf Nutzerauftrag: linker Laschenarm gerade, Gitterbase mit
  geschlossenem flachem2-mm-Randsteg statt offenen Randzähnen; Sichtprüfung offen.
  Zwei neue STL-Fehlvolumen-Tests ergänzen die Prüfungen (jetzt19 Gruppen).
  Auflagen auf24,35 erhöht; PCB→Glas bleibt2 mm. CNC unverändert:
  Durchbruch47,5×45,2 / Falz51,5×49,2×3 / R2, Fräser max.Ø4.
  Zwei M2×25/M2-Muttern, Kopf max.Ø4/Höhe1,5. Neue Prüfungen/Logs im Mount-Ordner.
  **Offen:** Vorläufige15-mm-PCB-Randabstände rechts/unten genau messen:
  bei12-mm-Wand nur0,8 mm nominal Druckteilfreiheit (Durchbruch0,6).
  Buttonmutter/-gehäuse, Leisten, echte Stecker-/Löt-/Kopfhöhen prüfen;
  Druck-/Passungs-/Lasttest, Scheibenfixierung und NFC-Lesen mit fertiger
  Schichtung. Kein reales Gesamtdeckel-/Passungs-/Sicherheitsprüfergebnis.

- [ ] **NeoPixel-Deckelhalter / CNC: Messabgleich 21.10.2026 umgesetzt:**
  `3d-print/mounts/neopixel-stick-mount/README.md`. Nutzer misst PCB54×9,9×1,6,
  PCB+LED3,23, LöcherØ3; Lochrandabstand23, rechts12,8, lange Kante0,7 mm.
  Daraus Lochmitten(13,7;7,7)/(39,7;7,7), Raster26. Neue CNC-Konturen:
  Durchbruch58,4×14,3, Falz62,4×18,3×3, R2; alte DXF überholt.
  Direkte Lötleitungen statt Dupont, Stiftleiste muss entfernt werden.
  **Neueste Nutzerkorrektur:** Kabelausgang samt Zugentlastung ans andere kurze
  Ende verlegt (lokal+x/rechts im Modell). Keine elektrische Padfreigabe daraus.
  PCB-Auflage14,77, LED-/Glasluft weiterhin3 mm. **Nutzerkorrektur:** beide
  Holzlaschen im Foto nach links zur Lochreihe/Deckelmitte, lokal+Y;
  Punkte(20;19,9)/(34;19,9), STL64×27,9×16,5. CNC-Konturen unverändert.
  Referenzwand jetzt gegenüber auf−Y, weiterhin kein gemessener Abstand.
  **BLOCKER:** M2-KöpfeØ3/Höhe2 kollidieren mit angenommenen LED-XY,
  auch im0,5-mm-Spielraumtest. Reale Kopf-/Bauteilfreiheit vor endgültiger
  PCB-Montage klären; kein vollständiger Fit-PASS. LED-/SMD-/Pad-XY nicht
  gemessen. M2×16/M2-Muttern beibehalten, keine größere Kopfgröße freigegeben.
  **Offen:** echte Schrauben/Muttern/Lot-/Kabelhüllen, Holz-/Glasstärke,
  Nutzer-Sicht-/Support-/Passungs-/Last-/Lichtprobe und sichere Scheibenfixierung.
  Foto/Messquelle in `docs/cad/neopixel-stick/measurement-2026-10-21/`.
  Kein Druck-/Fräs-/Fertigungsnachweis; endgültiges Deckellayout macht Nutzer.

- [ ] **Gehäuse / Einzel-Mounts neu planen** — Nutzerentscheidungen in
  `hardware/gehaeuse-konzept.md`: Holzbox außen 250 × 180 × 110 mm,
  **12 mm Pappelsperrholz (09.10.2026 beschlossen)**, Deckel und Boden
  abschraubbar, einzelne Mounts mit regelmäßigem
  Gitterboden und herausragenden Abstandspfosten für ruthex RX-M2,5×5,7.
  **09.10.2026: Konzept zugestimmt und Step-Up-Mount neu entworfen**:
  ein Schraubpfosten am Montageloch + zwei massive Stützpfosten mittig,
  weg von der gelöteten Anschlussreihe. SCAD/STL und transparente
  Platinen-Vorschauen in `3d-print/mounts/stepup-mount/`; Geometrieprüfung
  erfolgreich, noch keine Druck-/Passungsabnahme. Hersteller-PCB und
  ruthex-Einbauzeichnung geprüft (Ø 4,0 / Tiefe min. 6,7 mm / Wand min.
  1,6 mm). **Holzbefestigung beschlossen: 3 × 12 mm Senkkopf-Holzschraube**,
  Mount angepasst: Durchgang Ø 3,2, Senkung Ø 6,2 / 90°, lokales Polster
  insgesamt 3,5 mm dick (Gitter weiter 2 mm). Geometrie erneut geprüft;
  Kopf-Istmaß/Fabrikat, Vorbohrung und tatsächliche Holzstärke offen.
  Abgelehnter Vorgänger unverändert unter `archive/rejected-2026-10-09/`
  im Mount-Ordner; alte Höhen, Pocket-Maße und M4 sind nicht freigegeben.
  **Neue digitale Senkkopf-Form vom Nutzer ausdrücklich positiv bewertet.**
  Physisch offen: Heat-Set-Probedruck, reale Platinen-/Lötstellenpassung,
  PCB-Schraubenauswahl und Kopf-/Holztest am Reststück. Zuschnitt und
  Deckel-/Bodenbefestigung separat planen.
  Prüfprotokoll: `docs/testprotokoll-stepup-mount.md`.
  **AW9523-Mount komplett neu konstruiert (09.10.2026)** nach Nutzer-
  Ablehnung des Vorgängers; dieser unverändert im Mount-Archiv. Neuer
  Vorschlag in `3d-print/mounts/aw9523-mount/`: 56 × 26 × 12 mm,
  2 gestufte Gewindepfosten + 2 Stützen, keine Freistiche. ruthex von
  UNTEN eingeschmolzen (0,2 mm zurückgesetzt), 1,8 mm umlaufende Wand
  um max. Einsatz-Ø; schmale obere Auflagen halten Abstand zu Pin-Hüllen.
  Original-PCB frisch geprüft: 38,1 × 17,78 mm mit GERUNDETEN Ecken,
  4 × Ø 2,5 Montagelöcher; alte Fasen-Angabe falsch. STL + sechs Bilder
  neu exportiert/geprüft, Mesh PASS. **Noch abzustimmen:** Einsatzmontage
  von unten statt bündig oben sowie 2 seitliche Holzschrauben. **Physisch
  offen:** Heat-Set-/Lastprobe, reale Pin-/Lotfreiheit, PCB-Schraubenlänge
  und Kopfpassung; M2,5×12 nur Rechenbeispiel, alte M2,5×8 gilt nicht mehr.
  Keine Druck-/Passungsabnahme. Details: Mount-README,
  `docs/testprotokoll-aw9523-mount.md`, `docs/mounts-weiterarbeit.md`.
  **Akkuhalter-Vorschlag beauftragt und erstellt (09.10.2026):**
  `3d-print/mounts/akku-mount/`, Gitterbasis 100 × 76 mm + separater
  Schraubbügel, zwei ruthex-Pfosten, abgerundete Anschläge. Zwei STLs
  digital geprüft; sechs Vorschauen. Keine Passungs-/Sicherheitsfreigabe.
  Vor realem Einbau: maximale Akku-Hülle, PCM/Kabelseite per Foto/Messung,
  glatte isolierende Unterlage (Entwurfsannahme 0,5 mm), Dummy-Rückhaltung,
  Wärme-/Druck-/Schraubenprüfung. Details im Mount-README, Prüfprotokoll
  `docs/testprotokoll-akku-mount.md`. Nutzer-Sichtentscheidung noch offen.
  SD-/Verstärker-Aufträge inzwischen separat erteilt, siehe Einträge oben.
  Weitere Module nicht ohne separaten Auftrag vorziehen.

- [ ] **Etappe 8 planen: Rail-Zusammenbau + Auto-Sleep (Stand 07.10.2026,
  Entscheidungen abgeschlossen)** — Boost-Eingang an Akku-JST-Buchse,
  Ausgang an SD-Rail, EN → IO9 (`rtc_gpio_hold_en`), 0-V-Nachweis am
  Boost-Ausgang im Sleep. Auto-Sleep: 5 min ohne Lied UND ohne
  Button/Encoder-Interaktion. Wake per Button (IO5/IO6); IO11 reserviert
  für spätere PN532-IRQ-Wake-Erweiterung („Hybrid"-Entscheidung). PN532
  bleibt an 3V3 (verworfene Option A: 10–13 mA Standby, Hauptschalter
  als Null-Strom-Weg). Gesamtsystem-Sleep-Strom messen (µA-Bereich).

- [ ] **Etappe 7 Gesamtmonitor (07.10.2026)** — TFT-Anzeige (Akku %/
  Ladestatus/Spannung, WLAN SSID+IP, Lied, Volume, Statistik) läuft mit
  NFC-Player + Gauge + WLAN zusammen, Nutzer: „funktioniert alles“.
  Protokoll mit offenen Punkten (Tagwechsel unter Gauge-Last, Akku-only-
  Beobachtung, NFC-Verzögerung, Gauge-Gegenprüfung):
  `docs/testprotokoll-etappe7.md`. TFT-Init-Finding in `docs/findings.md`
  (init(135,240); Etappe-0-Referenz betroffen).

- [x] **Akku 1 ABGESCHLOSSEN (07.10.2026)** — Polung vorher geprüft,
  läuft am USB + Akku, lädt, alles kühl, Lautstärke-Eindruck gleich.
  Fuel-Gauge-Test-Sketch `firmware/tests/akku_fuel_gauge/` (MAX17048,
  Adafruit MAX1704X 1.0.3) läuft laut Nutzer; **keine Rohwerte
  gesichert** — nur Nutzerbeobachtung, keine Messwerte in der Doku.
  Protokoll inkl. Bewertung und offener Punkte:
  `docs/testprotokoll-akku.md`.
- [ ] Akku-only-Betrieb mit gesicherten Serial-Rohwerten (laden /
  idle / playback), exakte Akkuspannung nachtragen, Verhalten bei
  niedriger Akkuspannung beobachten.

- [ ] **Etappe 6 Breadboard-Programm BESTANDEN (07.10.2026)** — AW9523
  (Scan 0x58, Taster A0), NeoPixel (Minimal-Rot, alle 8 Pixel), DT44L12
  an 5 V „klar sichtbar", Boost isoliert (EN/True Disconnect/5,2 V).
  Ausgeschlossene Reste: Encoder (Endaufbau), 30-mm-LED-Rail/Portgrenzen
  (power-plan), Boost-Lasttest (entfällt laut Nutzer), Akku-Betrieb.
  Protokoll: `docs/testprotokoll-etappe6.md`; Fahrplan-Status:
  `docs/breadboard-testing.md`.
- [ ] Rails/Feinplanung in `docs/power-plan.md` fertigstellen (5-V-LED-
  Rail inkl. AW9523-Portgrenzen, PN532-Abschaltung, NeoPixel-Rail-
  Zuordnung, SD am Akkubetrieb) — Eintrittskarte für Akku-Ausbau.
- [ ] NeoPixel-Stick verlötet (DIN/DOUT geklärt: nur DIN→IO8, DOUT offen);
  1000-µF-Elko+330 Ω einbauen, Minimal-Rot-Test als Teil 3.
- [ ] Langfristige Framework-Entscheidung fuer Produktfirmware (Arduino vs.
  ESP-IDF) separat klaeren; Breadboard-Etappe 5 nutzt Arduino-Core 3.3.12.

### Spaetere Haertung — keine offenen Etappen-4-/5-Abschlussbedingungen

Etappen 4 und 5 sind als Breadboard-Meilensteine abgenommen, nicht als
vollstaendige Produkt-/Dauertests. Noch gezielt pruefen:

- [ ] Etappe 5: abgelehnte/doppelte/ungueltige Uploads, Upload-Abbruch,
  Groessenlimit und SD-Fehler; bestehende Musikdateien intakt halten.
- [ ] Etappe 5: Verhalten bei Upload waehrend Audio/NFC-Last pruefen —
  synchroner WebServer kann den Audio-Loop blockieren; erst danach
  parallelen Upload freigeben. Auth/Netz-Sicherheit vor Produktbetrieb
  bewerten (HTTP Basic nur im vertrauten lokalen WLAN).
- [ ] Etappe 5: physisch unbekanntes Tag, beide urspruenglichen Songs und
  mehrere Neustarts separat testen; bisher Happy-Path mit zugewiesener MP3.

- [ ] Mindestens 20 **kontrollierte** Tagwechsel und mehrere Minuten
  Audio unter NFC-Last, spaeter auch WLAN-/Upload-Last; Fehler zaehlen.
- [ ] Entfernen waehrend Audio und EOF ohne automatischen Neustart
  explizit beobachten. Verhalten ist implementiert, nicht separat abgenommen.
- [ ] Kaltstart ohne Tag im **Player**, spaeteres Auflegen. NFC-only-
  Wechselreferenz bestand diese angeforderte Testfolge bereits.
- [ ] Physisch unbekanntes Tag: kein Start/keine Unterbrechung. UID-
  Mapping host-getestet, noch kein unbekanntes Tag auf Hardware getestet.
- [ ] Tag-Chiptyp bei Bedarf bestimmen; beide bestaetigten Tags haben
  4-Byte-UIDs. Nicht allein aus Hinweistext „NTAG215“ ableiten.
- [ ] Vor AW9523-/Fuel-Gauge-Erweiterung Wire-Zugriffe mit NFC-Task
  synchronisieren. Akku erst ganz zum Schluss, Polung vorher pruefen.

### Vor Etappe-6-/Akku-Ausbau prüfen

- [ ] AW9523 erst an 3V3 im GPIO-/Tastertest; 5-V-LED-Portgrenzen,
  Reset-/Stromverhalten und Schaltplan prüfen. Kein +5 V auf VIN-3V3,
  integrierte Button-Widerstände behalten (`docs/power-plan.md`).
- [ ] Tatsächliche Rails/Abschaltung festlegen: PN532 am Header wird nicht
  durch Boost-EN/IO7 abgeschaltet. SD-Akkuversorgung, NeoPixel-Pegel,
  Sleep-Zustände/Rückspeisung und Gesamtstrom testen, dann erst Akku.
- [ ] Akustische Bewertung am finalen Aufbau planen; Volume/MAX_AMP
  nicht mit festen dB(A) oder Normkonformität gleichsetzen.
- [ ] IO6/IO11 und 44-mm-Schalter einzeln elektrisch/funktional testen.

## Erledigt

- [x] **04.10.2026: Etappe 5 BESTANDEN — Breadboard-Abnahme.**
  `firmware/tests/etappe5_web_upload/` mit Arduino-Core 3.3.12,
  WLAN-Station, einfacher Handy-Seite, `/files`, `/upload`, `/tags`,
  NVS-Zuordnung fuer die zwei bekannten UIDs. Nutzer bestaetigt
  Browser/Dateiliste, MP3-Upload, Tag-Zuweisung, hoerbares Abspielen und
  nach RESET erhaltene Zuordnung **sowie erneutes Abspielen** ohne
  Neuzuweisung. Serial: WLAN/NFC an, letzter Schnappschuss STARTS=4,
  ERRORS=0; Compile und Upload-Hashes ok. Nur USB, kein Akku; keine
  React-PWA, kein BLE. Fehlertests/Dauertest ausstehend, keine
  Produktfreigabe. Protokoll: `docs/testprotokoll-etappe5.md`.

- [x] **04.10.2026: Etappe 4 BESTANDEN — Breadboard-Abnahme.** Neuer
  `etappe4_tag_player`: PN532 I2C IO3/IO4 (DIP ON/OFF, 100 kHz), SD SPI
  IO36/35/37 mit CS IO10 (4 MHz), MAX98357A I2S IO16/17/18, USB-only.
  Tag 1 `E3:2F:F6:33` → `/arcade-music-loop.mp3`, Tag 2 `01:8C:F1:6E`
  → `/happy-tune.mp3`, Volume 6/21. Hoerbarer Liedwechsel und kein
  Neustart bei gleicher UID vom Nutzer bestaetigt; optimierter Hoertest
  ebenfalls „super“, Nutzer gibt Abschluss frei. Happy Tune intern
  UID→stream-ready 5499→ca. 1555–1562 ms; Arcade ca. 1369–1372 ms.
  Host-Test/Compile/Upload-Hashes erfolgreich, keine Startfehler im
  letzten Kurzlog. Timeout 0 in eigener NFC-Task, Pause 200 ms, Queue
  zum Audio-Hauptloop; kein Tag-Schreiben/Fallback/Boot-Song/WLAN.
  v1/Zwischenstaende und alte Diagnosen archiviert; nur bestaetigte
  NFC-Referenzen aktiv, Hauptdoku auf I2C aktualisiert. Protokoll:
  `docs/testprotokoll-etappe4.md`, Rohlogs `docs/serial/`, UID-Tabelle
  `hardware/nfc-tags.md`. Keine erfundene Dauer-/Produktabnahme.

- [x] 02.10.2026: **Etappe 3 BESTANDEN** — Button (AB24OL, Terminal A
  → IO5, B → GND, INPUT_PULLUP) unterbricht Boot-Loop und spielt
  `subbasesoft.mp3` (2,9 s). 20-ms-Entprellen reicht, kein
  Doppel-Trigger. Volume per Hörtest 6 → 12. Protokoll:
  `docs/testprotokoll-etappe3.md`.

- [x] 02.10.2026: **Etappe 2 BESTANDEN** — SD-Karte (FAT32) am SPI-Bus
  (CS=IO10, SCK=IO36, MOSI=IO35, MISO=IO37, VCC=USB-5V), Dateiliste ok,
  mp3-Wiedergabe über ESP32-audioI2S v4 (PSRAM=QSPI Board-Default!) über
  I2S zum MAX98357A. Volume vermessen: 6 = leise-schoen, 21 = max.
  Lehrstück: PSRAM-Modus nicht manuell auf opi drehen. Protokoll:
  `docs/testprotokoll-etappe2.md`.

- [x] 02.10.2026: **Etappe 1 BESTANDEN**
  I2S (DOUT=IO16, BCLK=IO17, LRC=IO18, VIN→USB-5V, SD→3V3, GAIN offen).
  Testtoene 440/880 Hz hörbar und verzerrungsfrei, Dynamik AMP 10–32000
  vermessen. Unterm Strich drei Lehrstücke: Klon-Pinout am Silkscreen
  prüfen (unser Modul: VIN/GND/SD/GAIN/DIN/BCLK/LRC), SD-Pin ist
  Analogschwellwert (Mono-Modus > 1,4 V festlegen), und `ESP_I2S` braucht
  zwingend `setPins()` vor `begin()` — ohne das läuft alles grün, nur
  ohne Ton. Protokoll: `docs/testprotokoll-etappe1.md`.
  Software-Limit vorgesehen; früheres MAX_AMP 6000–8000 ist kein
  akustisch validierter Grenzwert. Norm-/Schalldruckbewertung offen,
  `docs/audio-safety.md`.

- [x] 01.10.2026: Etappe 0 in `docs/breadboard-testing.md` abgehakt — TFT-Test
  bestanden (Sketch: `firmware/tests/etappe0_tft/`, zeigt Text + WLAN-Scan
  + „Etappe 0 BESTANDEN“).
- [x] 27.09.2026: Bestellliste abgeschickt (Tastenkrone, berrybase.de,
  109,81 €) — Details in `docs/bestellliste.md`.
- [x] 01.10.2026: **Lieferung komplett angekommen.**
- [x] 01.10.2026: **Dev-Setup fertig** — arduino-cli 1.5.1, ESP32-Core
  3.3.12, uucp-Gruppe, Kernel-Reboot (cdc_acm), WiFiScan geflasht und
  **4 WLAN-Netze gefunden** → Etappe 0 Teil 1 bestanden. Protokoll:
  `docs/dev-setup.md`.
- [x] 27.09.2026: Preisvergleich + Bestellliste erstellt
  (`docs/preisvergleich.md`, `docs/bestellliste.md`).
- [x] 27.09.2026: Pin-Belegung geprüft und festgelegt
  (`hardware/pinout.md`), Breadboard-Fahrplan geschrieben
  (`docs/breadboard-testing.md`).
- [x] 25.09.2026: Projektstruktur, AGENTS.md, BOM, Entscheidungen
  (`docs/entscheidungen.md`, `docs/kernwerte.md`).
