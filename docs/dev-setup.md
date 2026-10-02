# Dev-Setup — Entwicklungsumgebung für Boxbert

Stand: **01.10.2026 — installiert und per Compile-Test verifiziert.**
Offen: Gruppenwechsel (Logout/Login) und der echte Hardware-Test (Etappe 0
aus `docs/breadboard-testing.md`) — Werkzeug dafür ist komplett bereit.

Beim Aufsetzen hier eintragen: Versionsnummern, Distribution, jede Abweichung
von diesem Plan und jede gefundene Lösung (mit Datum). Diese Datei ist das
Protokoll, nicht nur die Anleitung — der nächste Rechner (oder ein neu
aufgesetztes System) soll denselben Weg gehen können.

## Werkzeug-Entscheidung

- [x] **arduino-cli** ( pacman, offizielles Repo) statt GUI-IDE — Gründe:
  kein AUR-Bau, kein Electron; der Agent kann damit selbst kompilieren,
  flashen und den Serial-Monitor lesen; Arduino IDE 2 / VS Code + PlatformIO
  können sich später *zusätzlich* anschließen (geteilter `~/.arduino15`).
  Die Framework-Endscheidung (Arduino vs. ESP-IDF) bleibt separat offen
  (AGENTS.md, Offene Fragen) — der CLI-Weg läuft mit beidem weiter.
- [ ] Arduino IDE 2.x / PlatformIO — bewusst offengelassen, bei Bedarf später.

## Systembefund (01.10.2026, markusinhos Rechner)

- **Arch Linux** (rolling), Hyprland/Wayland, x86_64, 15 GB RAM, ~95 GB frei.
- **Nicht installiert:** Arduino IDE, VS Code, PlatformIO, flatpak, snap,
  AUR-Helper (yay/paru) — also purer pacman-Weg.
- **Kein `brltty`, kein `ModemManager`** — die zwei üblichen Serial-Port-
  Saboteure fehlen, keine Konflikte zu erwarten.
- **Arch-Besonderheit:** Serial-Ports gehören der Gruppe **`uucp`**, nicht
  `dialout` (Ubuntu-Konvention). Siehe `/usr/lib/udev/rules.d/50-udev-default.rules`.
- `arduino-cli` liegt im **offiziellen Repo** (`extra`), Stand 01.10.2026:
  **1.5.1-1**.
- Kosmetik, nicht blockierend: PATH enthält tote `/mnt/c/Windows/...`-Einträge
  (WSL-Überbleibsel in einer Shell-Config) — später mal aufräumen.

## Recherche-Stand (01.10.2026 — geprüft, bevor installiert wurde)

Quellen: [Espressif-Doku „Installing“](https://docs.espressif.com/projects/arduino-esp32/en/latest/installing.html),
[Arduino-Support „Fix port access on Linux“](https://support.arduino.cc/hc/en-us/articles/360016495679-Fix-port-access-on-Linux),
[espboards.dev zum Reverse-TFT-Feather](https://www.espboards.dev/esp32/adafruit-feather-esp32s3-reversetft/),
GitHub-Issue espressif/arduino-esp32#8704 (CDC-on-Boot),
[Adafruit-Learn-Guide](https://learn.adafruit.com/esp32-s3-reverse-tft-feather).

- **arduino-cli ist der intendierte Weg** für Terminal-/automatisierte
  Workflows (offiziell so positioniert; Arduino IDE 2 bleibt die GUI-Option
  und kann sich `~/.arduino15` teilen — später zusätlich möglich).
- **Boards-Manager-URL, aktuell (aus der Espressif-Doku):**
  `https://espressif.github.io/arduino-esp32/package_esp32_index.json`
  (die in älteren Guides verbreitete `raw.githubusercontent.com/.../gh-pages`-
  Variante ist veraltet).
- **ESP32-S3-Spezialität USB CDC on Boot:** Der S3 hat natives USB statt
  eines separaten USB-Serial-Chips. Ohne **CDC on boot** gibt es keinen
  `Serial.print`-Output. Beim Reverse-TFT-Feather über die Board-Option
  **`CDCOnBoot=cdc`** gelöst — nach der Core-Installation mit
  `arduino-cli board details` verifizieren und in der Firmware/Build-Config
  festnageln. Bekanntes Randproblem (Issue #8704): mit CDC on boot kann der
  Port nach dem Flashen mal nicht sofort wieder erkannt werden.
- **Falls der Upload den Board-Port nicht findet:** BOOT-Taste gedrückt
  halten, RESET drücken, BOOT loslassen → Bootloader-Modus. Danach flasht es.
  (Steht auch im Adafruit-Guide; für morgen einplanen.)
- **`uucp`-Gruppe für Arch** bestätigt (Arduino-Doku nennt `dialout` nur für
  Debian/Ubuntu-Familie). Gruppenwechsel greift erst nach Logout/Login.
- **Download-Größe:** ESP32-Core-Toolchain ~200–300 MB beim ersten
  `core install`.

## Installationsplan (unser Weg, aus der Recherche abgeleitet)

```bash
# 1. sudo (einmalig, durch Daddelbert):
sudo pacman -Syu --needed arduino-cli usbutils
sudo usermod -aG uucp markusinho      # danach Logout/Login nötig

# 2. ohne sudo (Agent kann das):
arduino-cli config init
arduino-cli config set board_manager.additional_urls \
  https://espressif.github.io/arduino-esp32/package_esp32_index.json
arduino-cli core update-index
arduino-cli core install esp32:esp32
arduino-cli board details -b esp32:esp32:adafruit_feather_esp32s3_reversetft
```

## Schritte (ausgeführt am 01.10.2026)

1. **Distribution / Version:** Arch Linux, Kernel
   `7.2.4-arch1-2` (Stand 08.09.2026), Hyprland/Wayland, x86_64.
2. **Werkzeug installiert:** `sudo pacman -Syu --needed arduino-cli usbutils`
   → **arduino-cli 1.5.1** (pacman-Paket `1.5.1-1`, Commit
   `01f3d4f2ba7c2eaafb5dc710c8a1903af7762fea`), usbutils 019-1.
3. **ESP32-S3 Board-Support:** URL in
   `~/.arduino15/arduino-cli.yaml` konfiguriert (espressif.github.io, siehe
   oben), dann `core update-index` + `core install esp32:esp32` →
   **Plattform esp32:esp32 3.3.12** (aktuellste). Board-Target verifiziert:
   FQBN **`esp32:esp32:adafruit_feather_esp32s3_reversetft`** (identifiziert
   sich mit VID 0x239A / PID 0x8123/0x0123/0x8124).
   **USB CDC on Boot (`CDCOnBoot=cdc`) ist bei dieser Board-Variante bereits
   Default** — kein Zusatzkonfigurationsaufwand nötig, `Serial.print` läuft
   übers native USB. CPUFreq-Default: 240 MHz (WiFi). UploadMode-Default:
   USB-OTG CDC (TinyUSB).
4. **USB-Serial:** `sudo usermod -aG uucp markusinho` ausgeführt —
   Gruppenzugehörigkeit bestätigt (`getent group uucp`), **gilt in der
   laufenden Session noch nicht** (Logout/Login nötig, erst danach flashen).
   Board noch nicht angesteckt; beim ersten Anstecken prüfen:
   `ls /dev/ttyACM*` (natives USB — beim S3 zu erwarten). Kein `brltty`,
   kein `ModemManager` im Weg (siehe Systembefund).
5. **Bibliotheken:** noch keine installiert (`arduino-cli lib list` = leer).
   WiFiScan braucht nur den Core. Je Etappe nachinstallieren: Adafruit
   TFT/Board-Lib (Etappe 0), SD (Etappe 2), PN532 (Etappe 4), NeoPixel
   (Etappe 6), AW9523-Lib (Etappe 6).
6. **Test (Etappe 0, Teil 1 — bestanden am 01.10.2026):** Nach Kernel-
   Reboot (siehe Fehlertabelle) Feather angesteckt:
   - Port: `/dev/ttyACM0` (cdc_acm, Gruppe uucp — flashen ohne sudo)
   - Upload: WiFiScan geflasht, Chip korrekt erkannt (ESP32-S3 QFN56
     rev v0.2, 4 MB Flash XMC, 2 MB PSRAM AP_3v3, MAC d0:cf:13:0b:fb:c8),
     alle Hashes verifiziert, ~870 kbit/s beim Schreiben
   - **WLAN-Scan findet 4 Netze** — Ausgabe siehe unten. Damit sind
     Flashen, Sketch-Lauf, Serial über natives USB (CDC) und WLAN
     nachgewiesen.
   - **Offen (Teil 2 von Etappe 0):** TFT-Beispiel — dafür erst die
     Adafruit-TFT-Board-Bibliothek installieren, dann flashen und
     in `docs/breadboard-testing.md` abhaken.

   Serial-Ausgabe des Tests (Auszug):
   ```
   Scan start / Scan done / 4 networks found
   1 Vodafone-56CC -69 11 WPA2      2 Walan -69 11 WPA2
   3 WLAN-3PGTAJ -92 6 WPA2         4 WLAN-8RNGQA -95 11 WPA2
   ```

## Befehle für den Hardware-Test (nach dem Re-Login)

```bash
ls /dev/ttyACM*                                  # Port finden
arduino-cli upload -p /dev/ttyACM0 \
  --fqbn esp32:esp32:adafruit_feather_esp32s3_reversetft \
  ~/Arduino/WiFiScan
arduino-cli monitor -p /dev/ttyACM0 -c baudrate=115200
```

(TTY-Nummer kann abweichen. Wenn der Upload den Port nicht findet:
BOOT halten + RESET drücken → Bootloader-Modus, siehe oben.)

## Fehler & Lösungen (Protokoll)

| Datum | Problem | Lösung |
|---|---|---|
| 01.10.2026 | `arduino-cli core install esp32:esp32` im Vordergrund-Lauf scheinbar „abhängen“ (langer Download von 24 Toolchain-Paketen, kein Fortschritt sichtbar) | Nicht neu anfangen: Staging-Cache unter `~/.arduino15/staging/packages/` prüfen — dort lagen alle 24 Pakete vollständig; erneuter Aufruf entpackt nur noch und läuft in ~1 Min durch. Merksatz: Bei arduino-cli-Abbruch erst Cache checken, dann neu starten. |
| 01.10.2026 | Nach dem Upload lief `arduino-cli monitor` bzw. `cat /dev/ttyACM0` ins Leere — kein Serial-Output, obwohl der Sketch läuft | Beim Öffnen des Ports resettet das Board und die Ausgabe ist schon vorbei, bevor der Leser offen ist. Lösung: Leser zuerst starten (z. B. `timeout 60 cat /dev/ttyACM0 > log`), dann einmal kurz die **Reset-Taste** am Feather drücken → Boot-Output landet komplett im Log. |
| 01.10.2026 | Session-Shell zeigt `uucp`-Mitgliedschaft nicht, obwohl `usermod -aG` gelaufen ist | Normal: Gruppenzugehörigkeit wird nur beim Login frisch gesetzt. Logout/Login (oder `newgrp uucp` für eine Testshell), dann `id -nG` prüfen. |
| 01.10.2026 | Feather wird per `lsusb` erkannt (239a:8123), aber `/dev/ttyACM0` fehlt; `modinfo cdc_acm` sagt „Module not found“ | Arch-Klassiker nach `-Syu`: Es lief noch **Kernel 7.2.4**, installiert war schon **7.2.8** — `/lib/modules/` enthielt nur noch das neue Verzeichnis, das alte wurde beim Upgrade gelöscht, also konnte `cdc_acm` (in der Kernel-Config als `=m` vorhanden) nicht nachgeladen werden. Lösung: **Neustart**, danach lädt der passende Kernel das Modul beim Anstecken automatisch. Merksatz: Nach Kernel-Update vor dem ersten Flashen immer neu starten. |
