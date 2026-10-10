# Gute-Nacht-Figur

## Beschreibung

Eine bestimmte RFID-Figur startet eine ruhige Playlist, dimmt die Beleuchtung
und beendet die Wiedergabe nach der letzten Geschichte.

## Bisheriger Stand

Daddelbert hat am 10.10.2026 die Aufnahme in die Ideendatenbank freigegeben.
Die konkrete Gestaltung und Umsetzung sind noch offen; kein Bauauftrag.
Vorbild: [ESPuino](https://github.com/biologist79/ESPuino), das Abschaltung
nach Track/Playlist und einen gedimmten Nachtmodus unterstützt.

## Noch zu besprechen / prüfen

- Playlist, Lautstärke und gewünschtes Lichtverhalten bestimmen.
- Verhalten bei Tagwechsel, Unterbrechung und erneutem Auflegen klären.
- Abschaltung nach Playlistende mit dem beschlossenen Sleep-Plan abstimmen.
- Bewusst gestartetes Einschlafprogramm, nicht dasselbe wie Auto-Sleep nach
  Inaktivität; bestehende Hardware-/Sleep-Entscheidungen bleiben erhalten.

## Entscheidungen und Nachweise

Nur die Aufnahme als offene Idee ist freigegeben. Keine Implementierung oder
Hardwareprüfung erfolgt. Bestehender Schlafplan: [Deep Sleep und
Wiederaufnahme](../deep-sleep/README.md).
