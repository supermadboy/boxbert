# Testprotokoll — Akku-Betrieb (Etappe Akku 1)

**Datum:** 07.10.2026
**Aufbau:** Breadboard-Stand Etappe 5/6, zusätzlich LiPo 3000 mAh (Soldered
SOL-333286, mit Schutzschaltung) am Feather-BAT-Anschluss.
**Sketch:** `firmware/tests/etappe4_tag_player` (unveränderte Referenz,
07.10.2026 neu kompiliert und geflasht, Build `/tmp/boxbert-player.wFPR30`,
alle Partitionen Hash-verifiziert).

## Vorbereitung / Sicherheit

- [x] **Polung geprüft** — Akku-Plus gegen Feather-Plus durchgemessen vor
  dem ersten Anschließen (JST ist nicht polarisationsgenormt). Nutzer
  bestätigt Prüfung, 07.10.2026.
- [x] **Akkuspannung gemessen** — Nutzer: „passt". **Offen: exakter Wert
  in V hier nachtragen:** ______ V (gemessen am Akku/Stecker).
- [x] Schutzschaltung (PCM) im Akku vorhanden (kernwerte.md, SOL-333286).
- [x] Akku mechanisch noch Breadboard-lose gelegt; gegen Verrutschen/
  Kurzschluss erst im Gehäuse sichern (3D-Druck steht aus).

## Ablauf & Beobachtungen (Nutzer, 07.10.2026)

1. Akku angeschlossen, Board läuft.
2. USB-C parallel angesteckt: Board läuft, **Akku lädt**, alles bleibt
   kühl (Fingerprüfung, keine Geruchsentwicklung berichtet).
3. Lautstärke-Eindruck USB vs. Akku: **kein hörbarer Unterschied** bei
   Volume 6/21. (Anmerkung: Bei der kleinen Aussteuerung plausibel; der
   Pegelunterschied 5 V ↔ ~3,7–4,0 V am MAX98357A macht sich eher bei
   höherer Lautstärke bemerkbar — bei Gelegenheit mit höherer Volume
   gegenhören.)

## Bewertung

- Erstes Anschließen + Laden + Betrieb am USB **bestanden** (Nutzer-
  beobachtung, 07.10.2026).
- Keine Messwerte von Fuel Gauge MAX17048 — nur visuelle/taktile Prüfung.

## Fuel-Gauge-Test (07.10.2026, Nachtrag)

**Sketch:** `firmware/tests/akku_fuel_gauge/` (separater Test-Sketch,
Etappe-4-Referenz unangetastet). Basis: Bibliotheksbeispiel
`MAX17048_basic` (Adafruit MAX1704X **1.0.3**, neu installiert), API gegen
Header geprüft. Onboard MAX17048 am I2C-Bus SDA=IO3/SCL=IO4 (pins_arduino.h
der Variante gegengeprüft — derselbe Bus wie der PN532; Sketch redet nur
mit dem Gauge). Build `/tmp/boxbert-gauge.RheOIU`, Hash verifiziert,
13 % Flash.

- [x] Sketch läuft laut Nutzer, Ausgabe plausibel („es scheint alles zu
  klappen“). **Keine Rohwerte gesichert** — USB-Ziehen beendet den
  Serial-Monitor, deshalb wurden die geplanten drei Schnappschüsse
  (laden / idle / playback) nicht dokumentiert. Keine Messwerte, nur
  Nutzerbeobachtung.

## Bewertung Akku 1 (Abschluss)

- Erstes Anschließen, Laden, USB+Akku-Betrieb: **bestanden** (Nutzer,
  07.10.2026).
- Fuel-Gauge-Auslesung: **technisch lauffähig**, Messwerte nicht
  nachgewiesen — keine Zahlen in die Doku übernommen.
- Akku-Element ist damit anschlussfrei erprobt; **kein** Dauertest und
  keine Produktreife.

## Offen (nächste Schritte)

- [ ] Betrieb **nur am Akku** mit gesicherten Serial-Rohwerten: Snapshot
  laden / idle / playback; USB-Ziehen beendet den Monitor → Werte vorher
  lesen bzw. nach Wiedereinstieg Snapshot sichern (roh nach
  `docs/serial/`).
- [ ] Exakte Akkuspannung in V hier nachtragen: ______ V.
- [ ] Verhalten bei niedriger Akkuspannung (Untergrenze/abschalten).
- [ ] Gesamt-Sleep-Strom messen (µA-Bereich), erst nach Rails-Klärung
  in `docs/power-plan.md` (PN532-Standby 10–13 mA!).
- [ ] Später: Gauge + NFC im selben Sketch → Wire-Zugriffe mit der
  NFC-Task synchronisieren (AGENTS.md, I2C-Bussharing).
