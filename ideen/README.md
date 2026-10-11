# Boxbert-Ideendatenbank

**Ein Punkt pro Session.** Zu Beginn gemeinsam genau einen Eintrag wählen;
keinen anderen Punkt ungefragt weiterbearbeiten. Diese Session richtet die
Datenbank ein und entscheidet noch kein weiteres Feature.

Diese Übersicht ist der Index. Jede Idee hat einen eigenen Ordner mit
`README.md` als Ausarbeitung; Bilder, Skizzen und weitere Unterlagen kommen
bei Bedarf in denselben Ordner. Kein Datenbankdienst nötig.

## Status

- **offen:** erfasst, Entscheidung oder weitere Ausarbeitung steht aus.
- **besprochen:** beraten, aber nicht automatisch beschlossen oder umgesetzt.
- **beschlossen:** ausdrücklich freigegeben; Umsetzung kann noch ausstehen.
- **in Umsetzung:** tatsächliche Arbeit an der freigegebenen Umsetzung läuft.
- **geprüft:** definierter Umfang durch echte Tests bestätigt; Nachweis verlinken.
- **verworfen:** nicht weiterverfolgen, Begründung in der Ausarbeitung.

Besprechungsabschluss und technische Umsetzung sind getrennt: **besprochen**
heißt nicht gebaut oder getestet. Schon beschlossene Teilaspekte stehen in der
Ausarbeitung; ein offener Eintrag macht sie nicht rückgängig.
Kein Datum oder Agentenkommentar allein gilt als Abnahme.

## Ideen

| Status | Name | Beschreibung |
|---|---|---|
| offen | [TFT-Anzeige](tft-anzeige/README.md) | Akkustand und aktuellen Song übersichtlich anzeigen. |
| offen | [ESP-Partybeleuchtung](esp-partybeleuchtung/README.md) | Die LED auf dem ESP soll das Innere der Box beleuchten. |
| offen | [Intro je RFID](rfid-intro/README.md) | Zu jeder RFID-Figur ein eigenes Intro aufnehmen und vor dem Inhalt abspielen. |
| offen | [Bilderbibliothek in der App](bilderbibliothek/README.md) | Bilder für die Gestaltung auswählen und zuordnen können. |
| offen | [Belegung der kleinen TFT-Knöpfe](tft-knopfbelegung/README.md) | Praktische Funktionen für die mit einem Zahnstocher erreichbaren Onboard-Knöpfe bestimmen. |
| besprochen | [BLE-/WiFi-Wechsel](ble-wifi-wechsel/README.md) | D0 wählt Funk aus, WLAN oder BLE; Start mit BLE, WLAN mit Heimnetz-/AP-Fallback. Machbarkeit recherchiert, Gesamtbuild und Hardwaretests offen; kein Bauauftrag. |
| in Umsetzung | [PWA bauen](pwa-bauen/README.md) | Schlichte HTTPS-Demo-PWA für eigene MP3 gebaut und browsergeprüft; relativer SD-Webbuild und Etappe-5-HTTP-Adapter vorbereitet. ESP-SD-Hosting, weitere APIs und BLE noch offen; kein Online-Soundkatalog im aktuellen Auftrag. |
| besprochen | [Firmware-Archiv auf SD und WLAN-Updates](sd-boot/README.md) | Als spätere Option erhalten: Images per Upload auf SD speichern, bei Bedarf in Flash installieren und neu starten; kein direktes Ausführen von SD, kein Bauauftrag. |
| offen | [Auto-Play-Modus](autoplay/README.md) | Musik automatisch starten lassen. |
| offen | [Spotify-Verbindung](spotify/README.md) | Boxbert mit Spotify verbinden. |
| offen | [Bluetooth-Lautsprecher-Modus](bluetooth-lautsprecher/README.md) | Boxbert als Bluetooth-Lautsprecher für externe Geräte verwenden. |
| offen | [Hör-Memory mit RFID-Karten](hoer-memory/README.md) | Geräuschpaare durch nacheinander aufgelegte RFID-Karten finden. |
| offen | [Gute-Nacht-Figur](gute-nacht-figur/README.md) | Ruhige Playlist starten, Beleuchtung dimmen und nach der letzten Geschichte abschalten. |
| offen | [Soundboard für die Arcade-Knöpfe](soundboard/README.md) | Eine RFID-Figur schaltet funktionale Knöpfe vorübergehend auf kurze Geräusche um. |

## Bereits besprochener Aufbau und Zubehör

Diese Punkte sind **für die Besprechung abgeschlossen** und keine offenen
Feature-Ideen. Noch ausstehende Ausführung, Einkauf oder Messungen werden
in den zuständigen Hardwaredateien und `To-Do.md` verfolgt.

| Status | Name | Beschreibung |
|---|---|---|
| besprochen | [Lautsprecher-Einbau konkretisieren](lautsprecher-einbau/README.md) | Beschlossene rückseitige Montage mit 2-mm-Lochraster und innerer Ausfräsung ausarbeiten. |
| besprochen | [Verteiler und Deckelverbindung](stromverteiler/README.md) | Stromverteilung oben/unten und lösbare Deckelverbindung konkretisieren. |
| besprochen | [Kabellängen und Einkaufsmengen](kabellaengen/README.md) | Nach der Anordnung benötigte Kabellängen und Mengen bestimmen. |
| besprochen | [Deep Sleep und Wiederaufnahme](deep-sleep/README.md) | Beschlossenen Schlafplan umsetzen und am vollständigen Aufbau prüfen. |
| besprochen | [Mini-Heißklebepistole](mini-heisskleber/README.md) | Kleine temperaturgeregelte Heißklebepistole als Montagehilfe. |

## Zuständigkeit und Pflege

- Status ausschließlich hier führen, damit keine zweite Statusliste driftet.
- Am Ende der besprochenen Session Ausarbeitung und Status aktualisieren.
- Beschlossene Hardware/Pins/Rails weiterhin in den maßgeblichen Dateien
  unter `hardware/` und `docs/` dokumentieren; die Ideendatenbank ersetzt sie nicht.
- Freigegebene konkrete Arbeit in `To-Do.md` aufnehmen. Eine Idee ist noch kein Bauauftrag.
- Nur die selbst geänderten Dateien committen und pushen.
