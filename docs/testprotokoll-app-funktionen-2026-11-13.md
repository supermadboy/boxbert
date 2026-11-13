# Appfunktionen nach BLE-Verbindungsfix — 13.11.2026

## Nutzerbestätigung und neue Symptome

Handyverbindung, Lautstärke und Start/Stopp laut Nutzer erfolgreich. Kein neuer
Flash seit `prnsjyfe`, Kennung`boxbert-v1-commissioning-20261113-v21-blefix1`.
Button1 inUI mitPups belegt, physischer grüner30mm stoppt aktuellenSong stattPups.
Ob Zuordnung ausdrücklich gespeichert/bestätigt wurde, noch nicht unabhängig
ausgelesen. Laut verbindlicher Pinout-ID-Tabelle und Flash: Grün=ID2(AWP06),
Gelb=ID1(AWP14/Bit12); unbelegteID2 hat DefaultSTOP. Nutzer meint alsZiel UI1Grün.
Vorschlag1Grün/2Gelb festgehalten, aber keine IDs oder gespeicherten Medien verändert.

`docs/serial/2026-11-13-app-button-upload-status.log`: Revision131,Volume12,
playback1/gestoppt,Peer1/sub1/auth1,SD/I2S/AW/Gauge/config1,NFC1/pause0,
weiterhin8bestehendeMP3,Tag2Fart und keineTag-Intros. USB-Diag zeigt derzeit keine
Button-Pfade; deshalb keinen gespeichertenPfad daraus behaupten.

## Upload: angenäherte Fehlermeldung und widerlegte Hypothese

Nutzer beschreibt Intro-Fehler ungefähr als „abgebrochen nachZeit“, danach
„oder so“. Kein exakter Fehlertext/keine Live-Uploadphase bekannt. Kein Beweis
für Firmware-Inaktivitätszeitlimit, BLE-RPC-Zeitlimit oder SD-Fehler.

Agent vermutete fälschlich fehlendes `{upload:true}` beiIntro. NeuerQuellvertrag
besteht jedoch bereits gegen unveränderten Produktcode: Intro setzt dasFlag
schon, Gesamtbudget1h statt30s. Vermutung ausdrücklich zurückgenommen.

Vorhandenen HTTP-Browser-Vertragstest erweitert: native synthetische Aufnahme,
echte lokaleMP3-Kodierung, simulierte UploadChunks jeweils2s virtuellerZeit,
Gesamtdauer nachweislich>30s, Commit und Introzuordnung erfolgreich. Keine echte
BLE-/SD-/Geräteabnahme, keine geänderten Produkt-Timeouts. Neuer Quellvertrag +
übrigeApp-Tests:69grün. Log`2026-11-13-app-intro-simulated-slow.log`.
Browser reproduziert über`tools/firmware/browser-env.py` (gepinntes Chromium),
`node app/tests/device-browser.mjs`; nativeTests per`cd app && npm test`.
Keine Veröffentlichung, keine Firmwareänderung/kein Flash während Nutzer weg.

## PC-Vergleich: Adapter ohneBLE

Nutzer möchte stattHandy denPC nutzen. Read-only geprüft, Quelle
`docs/serial/2026-11-13-pc-bluetooth-capabilities.log`:
HCI-Version3,Manufacturer10; supported settings enthaltenBR/EDR, **keinLE**.
BlueZ`Adapter1.Roles`: leeresArray. VorhandenerController somit nicht für
BLE-GATT-Reproduktion geeignet. KeinPC-Scan/Pairing/Connect, keineInstallation
einesBLE-Clients und keineTrennung derHandyverbindung durchgeführt.

## Nächster kontrollierter Versuch

Bei Rückkehr einmal kleinen normalenMP3-Upload oder kurzesIntro bei wirklich
gestoppterWiedergabe mit begrenztemUSB-Trace beobachten. Vorher keine weiteren
Versuche blind wiederholen. Zeitlimit/Phase sowie App-Fehler möglichst exakt
festhalten. KeinePasswörter/Nonce/Proof/Payloads protokollieren. Button-ID-Tausch
separat bestätigen/testen; keine stillen Belegungs-/Musikänderungen.
