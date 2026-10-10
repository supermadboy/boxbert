# Firmware-Archiv auf SD und Updates über WLAN

## Beschreibung

Die microSD bleibt fest in der Box, weil Herausnehmen und Wiedereinsetzen zu
aufwendig wäre. Über einen Upload in der Boxbert-Weboberfläche könnten fertig
kompilierte Firmware-Dateien auf die Karte gelangen. Diese dienen als Archiv
für Updates oder unterschiedliche Firmware-Modi, falls nicht alle gewünschten
Funktionen gemeinsam in den internen Flash passen.

## Besprechungsergebnis — 10.10.2026

Daddelbert möchte diese Möglichkeit für später erhalten. Ein **Neustart beim
Wechsel des Firmware-Modus ist ausdrücklich akzeptabel**. Die Besprechung ist
abgeschlossen; dies ist **kein Auftrag zur Implementierung** und keine
Entscheidung, die Produktfirmware jetzt in mehrere Images aufzuteilen.
Status wird ausschließlich im [Ideenindex](../README.md) geführt.

## Technischer Stand

### Kein direktes Ausführen der normalen Firmware von SD

Beim regulären ESP32-S3-Boot lädt der ROM-Bootloader den zweiten Bootloader aus
dem Flash. Dieser lädt Partitionstabelle und Anwendung aus dem Flash; Teile
der Anwendung liegen im RAM, andere werden über den Flash-Cache eingeblendet.
Die SD-Karte ersetzt in diesem Ablauf nicht den ausführbaren Flash.[3]

Die nutzbare Option lautet daher: **Firmware auf SD aufbewahren, bei Bedarf in
den internen Flash schreiben und anschließend neu starten.** Ein beliebig
großes Firmware-Image wird durch die SD-Karte nicht lauffähig.

### Denkbarer Ablauf — noch nicht implementiert

1. Fertig kompilierte, für unser Board und die vereinbarte Partitionierung
   geeignete Firmware über die Weboberfläche hochladen und auf SD speichern.
2. Gewünschtes Image auswählen, etwa die normale Musik-Firmware oder eine
   separate Experimentier-Firmware. Welche Modi sinnvoll sind, bleibt offen.
3. Die laufende Firmware liest das Image von SD und schreibt es über die
   Update-API in den nicht aktiven OTA-Anwendungsbereich im Flash.
4. Image prüfen, Zielpartition für den nächsten Boot auswählen und neu starten.
5. Jede wechselbare Firmware muss einen kompatiblen Rückweg mitbringen:
   SD-Zugriff, Auswahl/Update und die dafür nötige Bedienung. Gemeinsame
   Konfiguration und Datenformate müssen kompatibel bleiben.

Espressif dokumentiert das Schreiben in den nicht aktiven OTA-Slot und die
anschließende Boot-Auswahl. Die Kombination aus Web-Upload, SD-Archiv und
Modusauswahl ist unser möglicher Entwurf, keine fertig nachgewiesene Funktion
von Boxbert.[1][2]

### Flash-Grenzen und Updatesicherheit

Unser Board hat laut Projekt-Hardwarestand **4 MB Flash**. Für das von
Espressif beschriebene sichere Anwendungsupdate sind mindestens zwei
OTA-Anwendungsbereiche (`ota_0`, `ota_1`) und eine OTA-Datenpartition nötig.
Während des Updates bleibt die bisherige Anwendung erhalten; erst nach
Prüfung wird die neue zum nächsten Boot ausgewählt.[1]

Beide Images müssen in ihre jeweiligen Flash-Slots passen. Bootloader,
Partitionstabelle und Datenpartitionen benötigen ebenfalls Platz. Die SD-Karte
kann mehrere Images archivieren, vergrößert aber keinen OTA-Slot. Konkrete
Slotgrößen sind **noch nicht festgelegt**; sie müssen anhand echter Builds und
der finalen Partitionstabelle bestimmt werden.[2]

Schutz gegen einen unterbrochenen Schreibvorgang und Rückkehr nach einem
fehlerhaften ersten Start sind getrennte Themen. ESP-IDF bietet optionalen
Bootloader-Rollback; dessen Aktivierung und die Bestätigung eines erfolgreichen
ersten Starts müssen bei einer Umsetzung ausdrücklich berücksichtigt werden.
OTA allein ist keine Garantie gegen eine fehlerhafte neue Firmware.[1]

## Empfehlung für später

Zuerst eine gemeinsame Boxbert-Firmware mit WLAN-Updates anstreben. Separate
Firmware-Modi nur dann vorsehen, wenn tatsächliche Buildgrößen oder ein
konkreter Nutzungsfall das rechtfertigen. Ein solcher Moduswechsel bedeutet
Flash-Schreiben plus Neustart, nicht nur das Umschalten einer Einstellung.

Bisher ist **nicht geprüft**, ob die geplante Gesamtfirmware zu groß wird.
Die Existenz eines separaten Images beweist außerdem nicht die Machbarkeit
seiner Funktionen auf der Hardware; insbesondere sind BLE und klassisches
Bluetooth-Audio nicht gleichzusetzen. Keine Bluetooth-Funktionszusage durch
diese Besprechung.

## Bei späterer Umsetzung noch zu prüfen

- Tatsächliche Firmware-Größen, finale Partitionierung und Framework/API.
- Upload- und SD-Fehler, vollständige Image-Prüfung vor der Boot-Auswahl.
- Kompatibilität von Board, Partitionierung und persistenten Daten.
- Geschützter Updatezugang; kein ungeschütztes beliebiges Firmware-Upload.
- Update während Musikwiedergabe: geeigneten Wartungszustand festlegen.
- Verhalten bei Stromausfall, Fehlstart, defekter SD und Rückwechsel; USB als
  Wiederherstellungsweg erhalten.
- Nur geprüfte Beobachtungen als Nachweis dokumentieren. Bislang kein Build,
  kein Flash-Versuch und kein Hardwaretest für diesen Entwurf durchgeführt.

## Quellen

Herstellerdokumentation am 10.10.2026 abgerufen. `stable` ist eine veränderliche
Dokumentationsversion; bei Umsetzung zur gewählten Toolchain erneut prüfen.

[1] https://docs.espressif.com/projects/esp-idf/en/stable/esp32s3/api-reference/system/ota.html

[2] https://docs.espressif.com/projects/esp-idf/en/stable/esp32s3/api-guides/partition-tables.html

[3] https://docs.espressif.com/projects/esp-idf/en/stable/esp32s3/api-guides/startup.html
