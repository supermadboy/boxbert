# Gesamtfirmware — interner Arbeitsplan

Freigabe 19.10.2026: vollständiger BLE-/WLAN-Umfang einschließlich vorhandener
PWA-Funktionen, Intro, TFT V2, Buttons/Encoder, LEDs, Auto-Sleep. Neue Ideen
und Flashen nicht eingeschlossen. Software-/Hardwareabnahme bleiben getrennt.

1. Vorhandene Referenzen unverändert erhalten; gemeinsame RPC in
   `docs/firmware-api-v1.md` als Integrationsnaht verwenden.
2. Arduino-Core 3.3.12, AudioI2S 4.0.0 und Board-Defaults reproduzierbar bauen;
   BLE/WLAN-Gesamtgröße an realem ESP32-S3-Target prüfen. Kein OTA versprechen.
3. Host-testbare Policies für Namen, Upload-Fortschritt, Sleep/Entprellung;
   Firmware an neuen Ort integrieren, kein Umbau bestehender Testsketche.
4. PWA-Geräteadapter, BLE-Framing/Authentisierung/Transfer und Browser-UI;
   lokale Aufnahmeformatkonvertierung, keine Serverübermittlung.
5. Echte Build-/Testausgaben, Review und Regressionen; App separat deployen
   und Hostingartefakt überprüfen. Keine Hardwareerfolge aus Fixtures ableiten.
6. Build-/SD-/Flash-Handoff, lokale Sicherheits-/Geräteprüfliste; eigene
   Änderungen in Boxbert und gegebenenfalls ai-habibi getrennt sichern.

Schreibzuständigkeiten: Frontend-Agent `app/**`; Parent `docs/**`,
`tools/firmware/**`, `firmware/runtime/Policy.h`, Host-Policytest;
Firmware-Agent wird für `firmware/boxbert/**` separat beauftragt.
