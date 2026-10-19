#pragma once
// Copy OUTSIDE the repository and pass its path to tools/firmware/build.py --secrets.
// Blank SSID uses the password-protected Boxbert AP instead of a home network.
#define BOXBERT_WIFI_SSID ""
#define BOXBERT_WIFI_PASSWORD ""
// Blank: generate a device-specific password and retain it in NVS.
// Optional override must contain 16..63 bytes. Never commit the private header or binary.
#define BOXBERT_WEB_PASSWORD ""
