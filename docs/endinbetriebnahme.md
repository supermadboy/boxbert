# Endinbetriebnahme: vorbereiten statt erst dann entwickeln

## Daddelberts Ziel

Nach dem fertigen, geprüften Aufbau soll ein kurzer Auftrag reichen:

> Box ist fertig gebaut. Lass uns Website und ESP jetzt testen.

Der Auftrag soll eine **vorbereitete** Firmware bauen/flashen und einen klaren
Funktionstest starten. Er ist nicht der Start einer weiteren Entwicklungsrunde.
Flashen kann bei vorbereitetem Build ein kurzer Schritt sein; dass die erste
Geräteprüfung samt Fehlerbehebung in wenigen Minuten fertig ist, ist nicht
nachgewiesen und wird nicht versprochen.

## Tatsächlicher Stand · 11.10.2026

- PWA ist als Browser-Demo mit lokaler Speicherung geprüft.
- Der `HttpAdapter` spricht den Etappe-5-Vertrag `/files`, `/tags`, `/upload`.
  Namen, Buttonbelegung, Lautstärke, beide LED-Kanäle und Introaufnahme haben
  keine vollständige Geräteanbindung. Externe HTTPS-Seite ist nicht mit dem
  HTTP-ESP verbunden; BLE-Transport ist noch nicht implementiert.
- Firmware liegt als getrennte, erfolgreich geprüfte Etappen/Experimente vor,
  nicht als abgenommene Gesamtfirmware für alle neuen PWA-Funktionen.
- Mikrofonaufnahme produziert browserabhängige Audiodateien. Intro benötigt
  Formatkonvertierung, Transport, UID-/SD-Persistenz und Gerätewiedergabe.
- SD-Webhosting sowie BLE/WLAN-Gesamtbuild, Speicherreserve und Laufzeitverhalten
  müssen tatsächlich geprüft werden; eine Recherche ersetzt diesen Build nicht.

Belege: [Aufgaben](../To-Do.md),
[Geräteadapter](../app/src/adapters.mjs),
[Intro-Grenzen](../ideen/rfid-intro/README.md),
[Funk-/Speicherrecherche](../ideen/ble-wifi-wechsel/machbarkeit.md),
[reproduzierbarer Toolchain-/Flashweg](dev-setup.md).

## TFT-Vorbereitung · 17.10.2026

Für V1 liegt ein gemeinsamer Arduino-freier C++-Pixelrenderer mit DejaVu-Sans-
Bitmapglyphen vor. Native Ausführung und Browser-WASM verwenden denselben Kern;
die PWA zeigt dessen RGB565-Buffer ohne CSS-/Systemfont-Nachzeichnung. Der
Anzeigevertrag ist in [tft-rendering.md](tft-rendering.md) beschrieben, der
abgenommene Browserumfang in [TFT-V1-Prüfung](../app/docs/verification-tft-v1.md).
Das ist ein Integrationsbaustein, **keine ESP-Firmware-/Geräteabnahme**.

**Statuskorrektur 18.10.2026:** Daddelbert bestätigt V1 als abgeschlossen
und beauftragt direkt V2. Die hier verbleibende ESP-Gesamtintegration ist
ein separater Arbeitsblock, kein offenes V1-Abschlusstor: Integrationssketch,
echte Player-/Gauge-/WLAN-Zustände und ST7789-Ausgabe, tatsächlicher Build
mit Speicherwerten; anschließend gesondert freigegebener Flash und reale
Audio-/SPI-/Display-/Neustartprüfung. Referenz-Sketches bleiben unverändert.
Diese Tests wurden durch die Statuskorrektur nicht nachträglich ausgeführt.

V2-Software: [gemeinsames Frameformat, Renderer und Fallback](tft-v2.md).
Die spätere Gesamtfirmware muss die optionalen Assets aus dauerhaft gültigem
Speicher einbinden, reale Reserve/Last prüfen und V1 ohne Asset erhalten.
Browser-WASM verwendet einen eigenen Stagingbuffer; diesen nicht blind
als Speicherstrategie in die ESP-Firmware übernehmen.

## Vor dem Endaufbau vorzubereiten

Die gemeinsame Firmware und die echten Frontend-Geräteadapter müssen als eigener
Integrationsauftrag vorgezogen werden. Der Umfang ist größer als die Intro-Idee:
Gerätesteuerung, Status, Persistenz, SD-Webdateien und der tatsächlich gewählte
Funkweg müssen zusammen funktionieren. Individuelle Referenz-Sketches bleiben
unverändert als Rückfall-/Vergleichsstand erhalten.

Für Intro allein ist dies ein eigener, mittelgroßer Audio-/Transport-Arbeitsblock,
keine kleine Button-Ergänzung. Als grobe Planung sind mehrere Implementierungs-
und Testtage plausibel; es ist keine belastbare Stunden- oder Terminzusage.
Besonders Transport, Flashbudget und nahtloser Übergang können erst nach einem
konkreten integrierten Build und Geräteversuch bewertet werden.

## Eintrittskriterien für den kurzen Abschluss-Prompt

- Bestätigte finale Verkabelung/Pins und erlaubter Flashumfang sind dokumentiert.
- Ein gemeinsamer Build mit gepinnten Bibliotheken kompiliert tatsächlich,
  einschließlich Flash-/RAM-Grenzen; genau dieses Artefakt wird geflasht.
- Zum Firmwarevertrag passender Webbuild und notwendige SD-Dateien sind bereit.
- Hardware-/USB-Zugriff und lokale Toolchain sind verfügbar. Dieser Hetzner-Agent
  hat dadurch nicht automatisch Zugriff auf Daddelberts USB-Gerät.
- Automatisierbare API-/Persistenzprüfungen und eine kurze Geräteprüfliste sind
  vorbereitet. Hören, reale Taster, Licht, Akku/Sleep und elektrische Sicherheit
  benötigen weiterhin Beobachtung bzw. Messung am Gerät.

## Freigabegrenze

Die Aussage dieses Ziels ist keine automatische Freigabe für eine beliebige
Gesamtfirmware, neue Partitionierung, Umverdrahtung oder Flashen. Der aktuelle
Intro-Auftrag schließt Daueranzeige und Sprachaufnahme-Bedienung ab.
Die Idee ist damit besprochen; ihre Geräteintegration bleibt explizit offen.
