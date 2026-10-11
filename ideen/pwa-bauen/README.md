# PWA bauen

## Stand 11.10.2026

Daddelbert hat das Grundgerüst zur Umsetzung freigegeben: schlichte Verwaltung
für ihn, zunächst nur eigene MP3, kein Online-Soundkatalog. Live-Demo unter
https://habibi.supermittel.com/boxbert/, Quellcode ausschließlich `app/`.
Dateiliste/Upload/RFID-Zuordnung und Lautstärke/NeoPixel-Simulation sind
browserseitig bedienbar und persistent; Demo-Uploads speichern nur Metadaten.
Hosted-HTTPS-PWA inklusive Offline-Neustart browsergeprüft; relativer SD-Build
und HTTP-Adapter für die vorhandene Etappe-5-API vorbereitet.

**Erweiterte PWA-Teilfreigabe (11.10.2026):** alle zehn grafischen Demo-Buttons
sind mit vorhandenen MP3-Metadaten oder leer belegbar, mit stabilen IDs,
Reload-Persistenz und Reset. 4 × 30 mm links, 4 × 24 mm Mitte, 2 × 44 mm
rechts; nur schematische Vorschau, keine Verkabelungsentscheidung. Regenbogen
zeigt acht bunte Pixel mit Helligkeit, persistent und HTTPS-offline geprüft.
Alte Demo-v1-Dateien/Tags/Volume/Pixel bleiben erhalten. Im lokalen HTTP-Modus
bleibt die Button-Belegung deaktiviert (API fehlt). Kein reales Demo-Audio,
keine RFID-Soundboard-Aktivierung, keine Freigabe der allgemeinen Soundboard-Idee.
Tag-Namen sind ebenfalls frei und wiederholt änderbar, UID und MP3 bleiben
unverändert. Aktuell browserpersistent; spätere Speicherung auf SD ist
gefordert, noch nicht implementiert. Im HTTP-Gerätemodus Namensfelder gesperrt.
Nachweise: [Erweiterungsprotokoll](../../app/docs/verification-buttons-rainbow.md).

Firmware, TFT, BLE und OTA wurden nicht geändert. Die alte Firmware liefert
weiterhin ihre eingebettete Seite; SD-Webhosting und weitere Geräte-APIs sind
Folgearbeit. Keine Zusage sofortiger Hardwarekompatibilität. Bedienung,
Schnittstellen und Nachweise: [App-README](../../app/README.md),
[Prüfprotokoll](../../app/docs/verification.md).

Die folgenden Abschnitte beschreiben auch spätere Ziele; Online-Soundtransfer
ist **nicht** Teil des freigegebenen ersten Grundgerüsts.

## Ziel

Eine gemeinsame, mobil bedienbare Verwaltung für Boxbert bauen. Daddelbert hat
am 10.10.2026 dieses eigene Folgethema zur Funkmodus-Recherche angelegt.
Am 11.10.2026 wurde das oben beschriebene Demo-Grundgerüst zur Umsetzung
freigegeben; die weitergehende Firmwareintegration bleibt Folgearbeit.

Grundlagen: [Funkmodus-Konzept](../ble-wifi-wechsel/README.md) und
[Machbarkeitsrecherche](../ble-wifi-wechsel/machbarkeit.md).

## Gewünschte Funktionen

- RFID-Tags erfassen und Sounds beziehungsweise Playlists zuordnen.
- Sounds auf der SD-Karte auflisten, auswählen und hochladen.
- Lautstärke und NeoPixel-Verhalten einstellen; definierte zulässige Werte
  aus der Firmware übernehmen, Kindersicherheitsgrenzen nicht umgehen.
- Verbindungsstatus, aktiven Funkmodus, Fehler und Transferfortschritt zeigen.
- Online-Sounds auswählen/herunterladen und ohne manuelles Zwischenspeichern
  auf dem Handy an Boxbert übertragen.
- Lokal auch dann administrieren können, wenn der externe PWA-Host ausfällt.

## Vorgeschlagene Architektur

Ein Frontend-Quellcode mit gemeinsamer Fachlogik und zwei Bereitstellungen:

1. **Lokale WLAN-Weboberfläche:** statischer Build auf der SD-Karte der Box;
   Auslieferung durch deren HTTP-Webserver, Befehle an gleichnamige lokale API.
   Erreichbar im Heim-WLAN oder im eigenen Box-WLAN.
2. **Externe BLE-PWA:** statischer HTTPS-Host, Web Bluetooth zu Boxbert,
   Zielplattform Android mit Chrome. Nach vorbereitetem Offline-Caching soll
   die lokale BLE-Bedienung auch ohne erreichbaren Host funktionieren.

Nicht voraussetzen, dass die lokale HTTP-Seite alle PWA-/Bluetooth-Fähigkeiten
hat oder dass die externe HTTPS-PWA problemlos eine lokale HTTP-API aufrufen
kann. Browser-Sicherheitsgrenzen sind in der Recherche getrennt beschrieben.

HTTP und BLE sollen auf dieselben Firmware-Fachfunktionen zugreifen. Neue
RFID-/NeoPixel-/Lautstärke-APIs und BLE-Dienste müssen **auf der Box** entstehen;
Frontend-Code allein erweitert die vorhandene Etappe-5-Firmware nicht.

## Abhängigkeiten und offene Festlegungen

- Gesamtfirmware mit BLE passt in eine bewusst gewählte Partitionierung;
  RAM, Audio und Moduswechsel auf echter Hardware geprüft.
- Gemeinsames versioniertes Befehlsmodell, Fehlermeldungen und
  Funktionsabfrage zwischen Frontend und Firmware.
- Berechtigungen und erstmalige Zugriffsfreigabe für WLAN/BLE, kein allgemeiner
  Schreibzugriff allein aufgrund der sichtbaren Box.
- Soundquellen und Nutzungsrechte, Download-CORS oder eigener nötiger Proxy,
  maximale Dateigröße und Verhalten bei unzureichendem Handy-/SD-Speicher.
- BLE-Transferprotokoll mit Flusskontrolle, Integritätsprüfung und Abbruch;
  Durchsatz und Wiederaufnahmefähigkeit messen statt behaupten.
- Welche Funktionen ohne Host/Internet verfügbar sind; Offline-Ersteinrichtung,
  Cache-Verlust und kontrollierte Aktualisierung der PWA.
- Einfacher Zugang zur lokalen Box-Seite ohne mDNS-Abhängigkeit; AP-Zugangsdaten.
- `app/` enthält beim Rechercheabschluss nur `.gitkeep`, noch keine vorhandene
  PWA. Vor einem späteren Bauauftrag erneut sichten, falls zwischenzeitlich
  Code hinzugekommen ist. Erfolgreiche Firmware-Testreferenzen unverändert
  lassen; Erweiterungen getrennt entwickeln.

## Spätere Abnahme

- Gleiche Zuordnung und Einstellungen über WLAN und BLE, nach Reset erhalten.
- Lokale WLAN-Verwaltung bei ausgeschaltetem externem Host bedienbar.
- Bereits offline vorbereitete BLE-PWA nach Schließen/Neustart ohne Host
  bedienbar; fehlende Online-Funktionen verständlich gekennzeichnet.
- Soundtransfer erfolgreich und Zieldatei spielbar; Abbruch und Fehler erzeugen
  keine scheinbar fertigen oder beschädigten Musikdateien.
- D0-Moduswechsel und Uploads verhalten sich kontrolliert; keine unbemerkten
  Rechtefreigaben, keine unzulässigen Lautstärkeänderungen.

Das Grundgerüst ist inzwischen gebaut und geprüft (siehe aktuellen Stand oben).
API-Erweiterungen und BLE-Firmware sind noch nicht gebaut oder hardwaregeprüft.
Der Status wird ausschließlich im [Ideenindex](../README.md) geführt.
