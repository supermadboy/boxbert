#pragma once
#include <stdint.h>
extern "C" {
char* tft_figure_input();
char* tft_title_input();
// Retains immutable caller-owned storage; call with nullptr/0 before freeing it.
// Returns 1 for validated BBT2, 0 for disabled/invalid. Never performs I/O.
int tft_set_asset(const uint8_t* data, uint32_t size);
#if defined(__wasm__)
uint8_t* tft_asset_input();
uint32_t tft_asset_capacity();
#endif
uint16_t* tft_render_v2(int playback, int elapsedSeconds, int durationSeconds, int volume, int batteryPercent, int charging, int wifi, uint32_t timeMs, int scrollOverride);
uint16_t* tft_render(int playback, int elapsedSeconds, int durationSeconds, int volume, int batteryPercent, int charging, int wifi, uint32_t timeMs, int scrollOverride);
}
