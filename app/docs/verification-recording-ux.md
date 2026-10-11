# Introaufnahme: Dauer und Sprachnachrichten-Bedienung

## Auftrag · 11.10.2026

Die bestehende taggebundene Aufnahme soll wie eine Sprachnachricht verständlich
bedienbar sein: Mikrofon, Aufnahmezustand, Stoppen/Speichern, Abbrechen und
Löschen mit passenden Icons. Aufnahmedauer während der Aufnahme sowie für das
gespeicherte Intro anzeigen. Bestehende Aufnahmen und Song-/Tag-Daten erhalten.
Keine Firmware, Wiedergabe, tatsächliche Pegelkurve oder Gerätesynchronisierung
allein aus diesem UI-Auftrag ableiten.

## Abnahmekriterien

- Laufende Zeit beginnt mit tatsächlicher Aufnahme, nicht mit Mikrofonanfrage.
- Gespeicherte Dauer bleibt nach Reload/offline sichtbar und gehört zur UID.
- Ältere Blob-only-Datensätze bleiben erhalten. Ermittelbare Audiodauer anzeigen;
  nicht ermittelbare Dauer als unbekannt kennzeichnen, nicht schätzen/erfinden.
- Icons ergänzen verständliche Beschriftung und Screenreader-Labels.
  Aufnahmeanimation ist ein Zustandsindikator, keine gemessene Wellenform.
- Abbruch/Unmount stoppen Mikrofon und Timer; fehlgeschlagene Neuaufnahme
  verändert weder Altaufnahme noch ihre Dauer. Löschung ist UID-isoliert.
- Touch-/Overflowprüfung schmaler/normale Mobilansicht und Desktop in beiden
  Systemthemes. Nach dem letzten Produktionsfix echte HTTPS-Aufnahme und
  neues Offline-Dokument unter `/boxbert/` prüfen.

## Prüfstatus

Release: https://habibi.supermittel.com/boxbert/?stand=rfid-record-ui-7

- `npm test`: 46 bestanden, 0 fehlgeschlagen; beide Frontend-Builds gebaut.
- `intro-duration-browser.mjs` lokal und gegen echtes HTTPS bestanden: laufender
  monotonic Zähler, Dauer zusammen mit Blob persistiert, unverändert nach Reload.
  HTTPS-Beispiel: 1981,8 ms, 24558 Bytes, `audio/webm;codecs=opus`.
- Legacy-Decode und unbekannte Dauer geprüft: künstlicher 2-Sekunden-PCM-WAV-
  Testdatensatz sowie absichtlich nicht dekodierbarer Blob im vorherigen Schema;
  beide bleiben unverändert. Zusätzlich ein echter MediaRecorder-Blob aus dem
  synthetischen Mikrofon ohne durationMs getestet: 41632 Bytes, ursprüngliche
  Aufnahmezeit 3055,4 ms, lokal aus dem Audio dekodierte Dauer sichtbar.
- Icons, Aufnahmeindikator, kein MIME-/Byte-Primärstatus, Timer-/Track-Cleanup
  nach Abbruch/Reiterwechsel und isoliertes Löschen bei zwei gespeicherten UIDs
  bestanden. Aufnahmekarte und Gesamtseite 320/390/1280 × Light/Dark geprüft.
- Nach `./build.sh boxbert` gegen echtes HTTPS erneut getestet. Neues
  Offline-Dokument unter tatsächlichem `/boxbert/`: gespeicherte Dauer
  1912,3 ms und Blob 22312 Bytes unverändert lesbar. Lokaler Vite-Test hatte
  diesen Produktions-SW-Fall ausdrücklich übersprungen; Live-Prüfung bestanden.
- `intro-browser.mjs` lokal/HTTPS bestanden: echte API, Reload, UID/Song,
  Altaufnahme bei Speicherfehler, Abbruch, verspätete Freigabe/IDB-Write,
  unerwarteter Recorder-Stop, Berechtigung/Quota, Löschbestätigung und Reset.
  Echter Hosting-Offline-Neustart mit lesbarem Blob zusätzlich bestanden.
- `recording-reset-browser.mjs` lokal: Speicherfehler-/Teilresetregressionen
  weiterhin grün. `local-browser.mjs`: HTTP-Vertragsfixture weiterhin grün;
  keine neue Firmwarefunktion daraus.
- Bestehende `test:browser`, `ux-browser.mjs`, `tag-names-browser.mjs` und
  echtes `test:https` bestanden. Keine globale UX-/Tag-/Offline-Regression.
- `intro-ui-preview.mjs` gegen echtes HTTPS: Dark-Mode-Mobilbilder erzeugt,
  mindestens 44 × 44 px Controls und keine Kartenüberbreite geprüft. Bilder
  tatsächlich visuell angesehen: Laufzeit/Iconbeschriftung sichtbar, keine
  Überlappung oder abgeschnittene Controls. Der anfängliche Preview-Test war
  zeitlich zu starr (Screenshot lief während Aufnahme weiter: 3 statt 2 s);
  angepasst an tatsächliche Aufnahmezeit, nicht die Funktion umgeschrieben.

Screenshots des tatsächlichen HTTPS-Builds, synthetisches Testmikrofon:
[Während der Aufnahme](recording-ui/recording-mobile.png),
[gespeicherte Aufnahme](recording-ui/saved-mobile.png).

Statischer Security-Scan neuer Produktionszeilen: keine Treffer.
Zwei unabhängige Read-only-Quellreviews abgeschlossen: keine neuen konkreten
Security-/Logikfehler gefunden. Abschließendes JSON-Urteil `passed: true`,
`security_concerns: []`, `logic_errors: []`; keine eigenen Builds/Tests der
Reviewer als Laufzeitfreigabe ausgegeben. Nichtblockierende Folgeempfehlungen:
Dauerformatierung an Minutengrenzen und verzögerter Legacy-Decode bei
Löschen/Neuaufnahme gezielt zusätzlich testen. Bestehender Identitätsguard
verhindert das Überschreiben einer inzwischen neuen gespeicherten Aufnahme.

TDD-Nachweis im tatsächlichen Implementierertrace: neue Aufnahmedauer zunächst
rot (`Aufnahmedauer für E3:2F:F6:33`, erwartetes `00:01`, Element nicht gefunden),
danach grün. Legacy-/Icon-Ausbau mit weiteren roten Browserprüfungen begonnen.
Auch dort wurden zeitlich zu starre Assertions auf tatsächliche gespeicherte
Dauer umgestellt, nicht eine erfundene feste Aufnahmelänge eingeführt.

Frühere nichtblockierende onblocked-Verbindungsbereinigung und verzögerter
Transaktionsabbruch bleiben im [Aufnahme-Grundprotokoll](verification-recording.md)
dokumentiert; zusätzliche Zwei-UID-Löschisolation ist jetzt geprüft.


## Grenzen und Folgeauftrag

Synthetisches Chromium-Testmikrofon ist kein Handy-Mikrofon-/Hörtest.
Lokale Browseraufnahme ist keine ESP-Funktion. Aufwand/Grenzen für den von
Daddelbert gewünschten kurzen Endinbetriebnahme-Prompt:
[Endinbetriebnahme](../../docs/endinbetriebnahme.md).
