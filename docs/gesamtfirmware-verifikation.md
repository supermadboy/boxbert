# Gesamtfirmware V1 — Softwareprüfung 19.10.2026

## Ausgeführt und bestanden

Finaler ESP32-S3-Build: **2.559.075 / 2.883.584 Bytes Flash (88%)**,
**172.948 / 327.680 Bytes statisches RAM (52%)**, 154.732 Bytes Rest laut
Linker. Das ist keine gemessene freie Heap-/PSRAM-Reserve im Betrieb.
Geprüfter generischer Release unter `firmware/releases/gesamtfirmware-v1/`
mit SHA256-Manifest, Binaries und passendem `sd-www/`; Quellenstaging stimmt
byteweise mit den endgültigen Firmwarequellen überein.

- Reproduzierbare Installation Arduino CLI 1.5.1, ESP32 Core 3.3.12 und gepinnte
  Bibliotheken; Linux x86_64, keine Rootinstallation, keine Referenzsketchänderung.
- `npm test`: **68/68**, einschließlich separater Demo-/Geräteaufnahme-Namespaces,
  lokalem MP3-Encoding, HTTP-/BLE-Vertragslogik und beider Webbuilds.
- `tools/firmware/test-host.py`: **15 Hostprogramme**, ASan und UBSan aktiv.
- `app/tests/firmware-volume-host.mjs`: fünf konkrete Ereignisfolgen mit den
  tatsächlichen Encoder-/RPC-Codeabschnitten, native ASan/UBSan: Rename,
  explizite PWA-Lautstärke, LED-only, fehlgeschlagener RPC und gleicher Wert.
- `app/tests/device-browser.mjs`: **simulierte HTTP-V1-Gerätegrenze**, echte
  Browser-Mikrofon-API mit synthetischer Testaufnahme, lokale MP3-Frames,
  Chunkübertragung und Zuordnung, Player/Pause, Einstellungen und Fehlerpfade.
- `tools/firmware/verify-hosted.mjs`: **echtes HTTPS-Hosting** mit BLE-Auswahl-UI,
  ohne Funkversuch, HTTP-Gerätemodus separat; TFT V2 und neues Offline-Dokument.
- `app/tests/ux-browser.mjs`: Mobile 320/390 und Desktop 1280, Light/Dark,
  alle Reiter, Tastatur, Kategorien, unabhängige LEDs, Lautstärke und Offline.
  Screenshot der tatsächlichen mobilen Offline-Seite visuell geprüft.
- `npm audit --omit=dev`: keine bekannten gemeldeten Schwachstellen.
- `git diff --cached --check`: eigene Quellen sauber; unverändert übernommener
  Drittanbieter-Lizenztext und generiertes JS enthalten Original-Trailing-Spaces
  (inklusive Stringliteralen). Diese Distributionsdateien bewusst nicht umformatiert.
- Unabhängiger Code-Review: keine Security-Findings; zwei Logikfehler gefunden,
  anschließend mit RED/GREEN-Regressionen behoben. Demo-Reset erhält
  Geräteoriginale; bestätigte RPC-Lautstärke gewinnt gegen pending Encoderwerte.

## Fehlversuche und Grenzen

Erster Gesamtcompile scheiterte an nicht vorhandenem `NimBLEAttValue.empty()`;
auf dokumentiertes `size()==0` korrigiert. Spätere Gesamtcompiles erfolgreich.
ArduinoJson 7.4.2 erzeugt bei `--warnings all` GCC-Arraybounds-Warnungen aus
seinen Headern; keine Behauptung eines warnungsfreien Firmwarebuilds.

Ein Browserlauf scheiterte an fehlenden Systemfonts mit
`SkFontMgr_FontConfigInterface ... FATAL: Not implemented`.
`browser-env.py` stellt gepinntes Chromium plus echte Fonts bereit und hält
sie per Nix-Outlink. Ein weiterer Fixturelauf wurde durch Vite-Hot-Reload
während paralleler Quelländerungen unterbrochen; unveränderter Endstand
anschließend erfolgreich ausgeführt. Der erste App-Testlauf nach neuer
nativer Regression fand `clang++` nicht (`ENOENT`); mit explizitem Compiler
wiederholt und bestanden. Keine dieser Ausgaben ist als Erfolg umgedeutet.

**Nicht ausgeführt:** Flash, reale BLE-/WLAN-Kommunikation mit Boxbert,
Android-Gerätewahl, Hörtest, RFID-/Button-Endaufbau, Last-/RAM-Stresstest,
SD-Stromausfallversuch, Akku/Boost/Backfeed, Sleep/Wake oder Ruhestrommessung.
Crosscompile und Browserfixtures ersetzen diese Nachweise nicht.
[`gesamtgeraet-abnahme.md`](gesamtgeraet-abnahme.md) hält sie offen.

Das gemeinsame TFT-Modul verwendet unveränderten V2-Renderer/Assets.
Der vorliegende Scope fügt keine Spotify-/OTA-/Soundkatalog-/RFID-Spielideen hinzu.
