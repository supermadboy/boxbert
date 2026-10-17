#pragma once
#include <stdint.h>
namespace boxbert {
constexpr int Width=240, Height=135;
enum class Playback : int { Boot=0, Idle=1, Playing=2, Paused=3, Ended=4, FileError=5 };
enum class Wifi : int { Off=0, Connecting=1, Connected=2, Unknown=3 };
// No clock, peripheral, fake data, or transport state in the renderer.
// See TftRenderer.h for the stable flat C ABI and docs/tft-rendering.md.
}
