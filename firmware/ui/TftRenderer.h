#pragma once
#include <stdint.h>
extern "C" {
char* tft_figure_input();
char* tft_title_input();
uint16_t* tft_render(int playback, int elapsedSeconds, int durationSeconds, int volume, int batteryPercent, int charging, int wifi, uint32_t timeMs, int scrollOverride);
}
