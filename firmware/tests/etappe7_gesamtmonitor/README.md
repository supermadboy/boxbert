# etappe7_gesamtmonitor (07.10.2026)

Integrations-Test: bewährter Etappe-4-Tag-Player plus TFT-Statusanzeige
(Akku %, Laden/Entladen, Spannung, aktuelles Lied, Lautstärke, WLAN-Status).

**Abgedeckte Bewährtes:**
- NFC/SD/Audio-Logik unverändert aus `etappe4_tag_player` übernommen
  (SD 4 MHz, NFC-Erfolgspause 200 ms, Volume 6/21, Queue an Hauptloop)
- TFT-Init aus `etappe0_tft` (ST7789 240x135, Rotation 1)
- WLAN-STA-Muster aus `etappe5_web_upload` (Secrets.h git-ignored)

**Bewusste Abweichungen von der Etappe-4-Referenz (nur hier, Referenz
unverändert):**
1. **NFC-Timeout 250 ms statt 0** — der Referenz-Timeout 0 wartet
   blockierend bis zum nächsten Tag, dann könnte der MAX17048 am selben
   Bus nie drankommen. Kosten: bis 250 ms mehr Verzögerung ohne Tag.
   **Nicht nachgewiesen:** Unterscheidung "kein Tag" vs. Busfehler —
   im Monitor-Modus zeigt beides "kein Tag". Wechsel-/Last-Abnahmen der
   Etappe 4 gelten dafür NICHT automatisch.
2. **Wire-Mutex** für PN532 (NFC-Task) und MAX17048 (Gauge-Task), weil
   beide an SDA=IO3/SCL=IO4 hängen (AGENTS-Regel Bus-Sharing).
3. **Kein Web-Upload** (in Etappe 5 separat bestanden) — bewusst
   rausgehalten, um den Integrationsumfang zu begrenzen.

Anzeige: Akku %, Spannung, Ladestatus (+LÄDT/entlädt/ruht anhand
chargeRate %/h), Liedname aus TagMap, [läuft]/[idle], Volume x/21,
WLAN SSID + IP, STARTS/ERR/uptime.
