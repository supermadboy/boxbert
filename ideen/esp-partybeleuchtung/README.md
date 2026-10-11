# ESP-Partybeleuchtung

## Beschreibung

Die LED auf dem ESP soll das Innere der Box beleuchten.

## Bisheriger Stand

Gemeint ist der Onboard-NeoPixel auf dem ESP. Die PWA bietet ihn und den
NeoPixel-Stick als zwei unabhängig einstellbare Kanäle mit Palette, Effekt
und Helligkeit an. Einstellungen werden im Browser gespeichert; animierte
Vorschauen sind umgesetzt. Das ist noch keine echte LED-Ansteuerung am ESP.

## Noch umzusetzen / prüfen

Firmware-Schnittstellen, reale Ansteuerung beider Kanäle und Speicherung am
Gerät fehlen noch. Lichtverhalten im Sleep bei der Firmware-Integration mit
dem bestehenden Schlafplan abstimmen und am Aufbau prüfen. Der Abschluss
der Besprechung ist kein neuer Firmware-Bauauftrag.

## Entscheidungen und Nachweise

Daddelbert hat am 11.10.2026 die Besprechung dieses Ideenpunkts für abgeschlossen
erklärt, da beide LED-Kanäle in der PWA bereits vorgesehen sind.

PWA-Umfang und Grenzen: [App-README](../../app/README.md).
Vorschau-/Persistenztests: [LED-Prüfprotokoll](../../app/docs/verification-led-effects.md).
Verbindliche Hardwarebelegung: [Pinout](../../hardware/pinout.md).
