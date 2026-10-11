# Intro je RFID

## Beschreibung

Eine optionale eigene Intro-MP3 pro RFID-Figur soll vor dem zugeordneten Song
abgespielt werden. Daddelberts Hauptidee ist, die Startverzögerung zu überbrücken:
kurzes Intro (beispielsweise 4–10 Sekunden), während der eigentliche Song
vorbereitet wird. Die Dauer richtet sich nach der Aufnahme, kein festes Limit
von fünf Sekunden.

## Bisheriger Stand

Am 11.10.2026 ist ausschließlich die **Zuordnung als PWA-Mock** zum Testen
freigegeben. Keine hörbare Vorschau, Aufnahmefunktion oder Firmware-Änderung.

Unter Zuordnung kann je bekannter RFID eine vorhandene MP3 als Intro gewählt
oder mit „Kein Intro“ deaktiviert werden. Separates Speichern im Browser;
Song-Zuordnung bleibt unverändert. Alte Demo-Daten erhalten leere Intros.
Keine Audiodaten oder Einstellungen werden auf dem Hostingserver gespeichert.
Im HTTP-Gerätemodus ist die Intro-Zuordnung deaktiviert: Firmware-API fehlt.

## Noch umzusetzen / prüfen

- Echte Intro-Wiedergabe, Speicherung am Gerät und Intro-API fehlen.
- SD-Musik wird gestreamt, nicht komplett in Flash geladen. Liedlänge allein
  erklärt die Startverzögerung nicht; tatsächliche Ursachen am ESP messen.
- Ein Intro allein garantiert keinen nahtlosen Übergang. Vorbereiten des Songs
  während der Intro-Wiedergabe und schnelle Intro-Bereitstellung erst entwerfen,
  mit bestehender Audio-Bibliothek prüfen und auf Hardware messen.
- Tagwechsel, Intro-Abbruch, wiederholtes Auflegen und Fehlerverhalten später
  festlegen. Keine Garantie für „instant“ oder „seamless“ aus dem Mock ableiten.

## Entscheidungen und Nachweise

Freigabe: optionale MP3-Zuordnung in der Browser-Demo, keine Wiedergabe.
Prüfungen: [Intro-Prüfprotokoll](../../app/docs/verification-intro.md).
Verbindliche Tags: [NFC-Zuordnung](../../hardware/nfc-tags.md).
