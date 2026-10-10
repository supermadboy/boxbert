# BLE-/WiFi-Wechsel

## Beschreibung

Eine Verwaltung für RFID-/Sound-Zuordnungen, NeoPixel-Verhalten und Lautstärke,
mit drei wählbaren Funkmodi. Die lokale WLAN-Verwaltung bleibt die unabhängige
Basis; eine extern bereitgestellte BLE-PWA ergänzt Online-Funktionen.

## Besprochenes Bedienkonzept

Daddelbert hat folgendes gewünschtes Verhalten bestätigt:

- Beim Einschalten ist **BLE** für eine Verbindung bereit, ohne vorherigen
  Tastendruck. Das bedeutet nicht automatisch eine Verbindung zum Handy.
- Jeder kurze Druck auf den Onboard-Taster **D0** wechselt zyklisch zwischen
  **Funk aus**, **WLAN** und **BLE**. Der aktuelle Modus erscheint auf dem TFT.
- **Funk aus** schaltet nur die Funkverbindungen ab. Musik von SD, RFID und
  die übrige lokale Bedienung bleiben aktiv.
- **WLAN** versucht zuerst das Heim-WLAN. Ist es nicht erreichbar, öffnet die
  Box automatisch ein eigenes WLAN für die lokale Verwaltung.
- Heim-WLAN und eigenes Box-WLAN bieten dieselben lokalen Verwaltungsfunktionen.
  Gäste benötigen einen erlaubten Netzwerkzugang und Verwaltungszugang;
  das eigene Box-WLAN ist nicht allein für Gäste erforderlich.
- **BLE** dient der lokalen Verwaltung über eine extern bereitgestellte PWA.
  Daddelberts Zielplattform ist **Android mit Chrome**. Das Handy kann dabei
  im Heim-WLAN bleiben und Internetzugang behalten.

D0 ist laut [verbindlicher Pinbelegung](../../hardware/pinout.md) GPIO0 und
zugleich BOOT-Taster. Die spätere Implementierung muss dessen Sonderrolle beim
Einschalten/Reset berücksichtigen; der Taster soll dabei nicht gehalten werden.

## BLE-PWA und Serverfunktionen

Gewünschter zusätzlicher Nutzen: Sounds online auswählen und durch die PWA an
Boxbert übertragen, ohne sie manuell auf dem Handy zu speichern und danach
hochzuladen. Dieser Transferweg ist ein Ziel, kein geprüfter Nachweis.

Als Empfehlung wurde eine offline-fähige PWA besprochen: Nach erfolgreichem
Laden und Caching soll die lokale BLE-Verwaltung ohne laufenden Server nutzbar
bleiben. Erstaufruf, neue Downloads und andere Online-Funktionen benötigen
weiterhin eine erreichbare Quelle. Cache-Persistenz und Offline-Verhalten sind
noch zu entwerfen und zu testen. Die WLAN-Verwaltung der Box bleibt unabhängig
von diesem externen Server verfügbar.

Web Bluetooth wird laut abgerufenen [MDN-Kompatibilitätsdaten][1] von Chrome
auf Android unterstützt, nicht von Safari/iOS oder Firefox. Eine installierte
PWA ersetzt keine fehlende Browser-Schnittstelle.

## Bisheriger Projektstand und Freigabegrenze

Das Bedienkonzept ist bestätigt, **kein Bau- oder Flash-Auftrag** erteilt.
Die derzeitige Projektbasis bleibt WLAN-only gemäß
[Kommunikationsentscheidung](../../docs/entscheidungen.md). Hier wird eine
künftige Erweiterung beschrieben, nicht deren erfolgreiche Umsetzung.

`AGENTS.md` nennt Flash-Platz als BLE-Einschränkung. Für die hier gewünschte
Gesamtfirmware ist in dieser Besprechung weder ein Build noch eine geeignete
Partitionierung geprüft worden. Die Machbarkeit ist deshalb offen; die
bestehende Einschränkung wird nicht stillschweigend aufgehoben.

## Vor einer Umsetzung noch zu prüfen

- Tatsächliche Buildgrößen und Partitionierung mit Audio, SD, NFC, WLAN und BLE;
  Abschalten zur Laufzeit entfernt keinen Programmcode aus dem Flash.
- BLE-Dienste und gemeinsames Befehls-/Datenmodell für beide Verwaltungswege.
- Geschwindigkeit, Zuverlässigkeit und Wiederaufnahme größerer Soundtransfers;
  SD-Schreiben und Funklast während der Audiowiedergabe.
- Zugriffsschutz für Heim-WLAN, Box-WLAN und BLE; sichtbare BLE-Bereitschaft
  ist keine Freigabe für ungeschützte Änderungen durch beliebige Geräte.
- Entprellung von D0, sauberes Beenden aktiver Verbindungen bei Moduswechsel,
  Darstellung auf dem TFT und Verhalten während eines Uploads.
- WLAN-Verbindungswartezeit, AP-Zugang und Rückkehr vom AP ins Heim-WLAN.
- Start nach Deep Sleep und Umgang mit dem zuletzt gewählten Modus. Bestätigt
  ist bislang BLE als Einschaltmodus, nicht dessen abweichende Speicherung.
- Stromverbrauch und Audio-Zuverlässigkeit auf der echten Box messen.

Es wurden keine Firmwareänderungen, Builds, Flash-Versuche oder Hardwaretests
für dieses Konzept durchgeführt.

[1]: https://raw.githubusercontent.com/mdn/browser-compat-data/main/api/Bluetooth.json
