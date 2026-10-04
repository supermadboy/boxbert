# Etappe 4 — NFC-Wechseltest (ohne Audio)

## Versuchsfrage

Im unveraenderten `etappe4_nfc_i2c` wurden beide UIDs ab Kaltstart gelesen,
ein Wechsel ohne Neustart blieb aber ohne UID. Der Nutzer berichtet auch
von frueher bereits funktionierendem Live-Tagwechsel; damaliger Code
unbekannt. Daher weder Hardware-Unmoeglichkeit noch bestimmten Treiberfehler
behaupten.

Adafruit PN532 1.3.4: `readPassiveTargetID()` sendet einen Suchbefehl und
wartet in `sendCommandCheckAck()` erst auf ACK, dann auf die Antwort. Bei
Host-Timeout wird false geliefert; dieser Pfad sendet keinen expliziten
PN532-Abbruch. Erneut aufrufen sendet einen neuen Suchbefehl. Ob dies
unsere Fehlschlaege verursacht, ist eine **Hypothese**.

## Gezielte Aenderung

Separate Kopie der erfolgreichen Referenz, Referenzdatei unveraendert.
Host-Timeout **500 ms → 0** (dokumentierter Default, wie Bibliotheksbeispiel
`readMifare`). Das wartet auf eine Suchantwort, statt den Aufruf bei
fehlendem Tag nach 500 ms zu verlassen. Keine Retry-/RFConfiguration,
keine zusaetzlichen Wire-Einstellungen, keine globalen Library-Patches.
Init und Erfolgs-Pause aus Referenz beibehalten: 1200 ms plus 100 ms
am Loop-Ende, insgesamt 1300 ms.

Zusaetzliche reine Diagnose: UID, bekannter Tagname, Lesezaehler und
UID-Wechselzaehler. Bei false/unplausibler UID Test stoppen, statt weitere
Kommandos zu senden. `SWITCHES` zaehlt nur geaenderte UIDs nach der ersten
Erkennung, NICHT Entfernen/Neuauflegen desselben Tags.

**Kein Tag = dieser NFC-Aufruf darf unbegrenzt warten.** Stille Serial-
Ausgabe beweist weder Defekt noch Erfolg; entscheidend ist anschliessende
Erkennung bei Auflegen. Der zugrunde liegende Wire-Transaktions-Timeout
bleibt unveraendert. Dies ist kein Audio-Sketch: niemals dieses blockierende
Lesen direkt in einen Audio-Hauptloop uebernehmen. Audio-Integration erst
nach erfolgreichem Wechseltest und getrennter Architekturpruefung.

## Testfolge mit Nutzer

1. Erfolgreich kompilieren, genau diesen Build flashen. Laufende Ausgabe
   pruefen. Falls Modul nach vorherigem Test nicht antwortet: einmaliger
   USB-Power-Cycle, kein blinder zweiter Flash.
2. Tag 1 und Tag 2 abwechselnd EINZELN auflegen, zwischendurch mindestens
   5–10 s keine Tags auf dem Leser. Keine USB-Neustarts zwischen Wechseln.
3. Nach jedem Nutzer-`liegt` passende UID mehrfach beobachten; Zaehler
   und fehlgeschlagene Aktionen protokollieren. Gehaltenes Tag liefert
   regelmaessig weitere READS, aber keine zusaetzlichen SWITCHES.
4. Spaeter Kaltstart ohne Tag testen, 10–20 s warten, dann Tag auflegen.
5. Kein Musik-/Etappenabschluss allein aus diesem Test ableiten.

Verdrahtung unveraendert laut `hardware/pinout.md`: PN532 SDA IO3, SCL IO4,
VCC 3V3/GND, DIP 1 ON / 2 OFF, IRQ/Reset offen, kein SPI/UART am PN532.
Nur USB, Akku ab. Dummy-Pins 255/254 aus Referenz bleiben erhalten;
keine echten zusaetzlichen GPIOs. Bibliothek Adafruit PN532 1.3.4,
Core 3.3.12, I2C 100 kHz. FQBN/PSRAM: Board-Defaults, kein OPI-Override.

## Status

04.10.2026, ca. 20:34: erfolgreich kompiliert (405136 Bytes Flash,
56168 Bytes globale Variablen), einmal geflasht/Hashes verifiziert.
Erste Serial-Beobachtung: READS 1 TAG1, READS 2 TAG2, SWITCHES 1 im
selben Lauf. Danach zwei angeforderte Wechsel nach tagloser Pause
TAG2→TAG1→TAG2 erfolgreich (ca. 20:39, SWITCHES 3, READS bis 99).
Pausendauer nicht unabhaengig gemessen. Grundlegender Wechseltest
bestanden; danach angeforderter Kaltstart ohne Tag erfolgreich (ca.
20:42, Tag 1 spaeter erkannt, READS 14→22). Dauertest bleibt spaetere
Haertung. Audio ist im separaten `etappe4_tag_player` inzwischen mit
optimiertem Nutzer-Hoertest als Breadboard-Etappe 4 abgenommen; dieser
NFC-only-Sketch selbst liefert keinen Audio-Nachweis.
Vollstaendige Testergebnisse stehen in
`docs/testprotokoll-etappe4.md` und `To-Do.md`. Feste spaetere Liedzuordnung: `hardware/nfc-tags.md`.
