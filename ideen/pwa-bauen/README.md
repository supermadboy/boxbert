# PWA bauen

## Ziel

Eine gemeinsame, mobil bedienbare Verwaltung für Boxbert bauen. Daddelbert hat
am 10.10.2026 dieses eigene Folgethema zur Funkmodus-Recherche beauftragt.
Die Anlage des Themas ist **noch kein Auftrag zur Implementierung**.

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

Noch keine PWA, API oder BLE-Firmware im Rahmen dieses Themas gebaut oder
getestet. Der Status wird ausschließlich im [Ideenindex](../README.md) geführt.
