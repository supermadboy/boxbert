#pragma once
#include <stdint.h>
// Core 3.3.12 pins_arduino.h and hardware/verkabelung-endaufbau.md §§2–4.
// Header tables labelled 'planned' remain physically unverified.
namespace boxbert::pins {
constexpr uint8_t Sda=3,Scl=4,SdCs=10,SdSck=36,SdMosi=35,SdMiso=37;
constexpr uint8_t AudioData=16,AudioBclk=17,AudioLrc=18;
constexpr uint8_t BoostEn=9,Stick=8,BoardPixel=33,BoardPixelPower=21;
constexpr uint8_t EncoderA=15,EncoderB=14,EncoderSwitch=12,RadioButton=0;
constexpr uint8_t WakeOne=5,WakeTwo=6,ReservedNfcIrq=11,ToggleTwo=38;
// UI IDs: 1–4 = 30mm, 5–8 = 24mm, 9–10 = 44mm; 255 means not on that bus.
constexpr uint8_t ButtonGpio[10]={5,6,255,255,39,13,255,255,255,255};
constexpr uint8_t ButtonAw[10]={255,255,2,3,255,255,4,5,0,1};
constexpr uint8_t MiniAw[3]={6,7,8};
}
