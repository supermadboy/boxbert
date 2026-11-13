#pragma once
#include <stdint.h>
// Core 3.3.12 board variant; measured inputs: hardware/pinout.md, 2026-11-11.
// SD/audio user-tested; power/sleep/NFC/stick still not accepted in this build.
namespace boxbert::pins {
constexpr uint8_t Sda=3,Scl=4,SdCs=8,SdSck=36,SdMosi=35,SdMiso=37;
constexpr uint8_t AudioData=16,AudioBclk=17,AudioLrc=18;
constexpr uint8_t BoostEn=9,Stick=10,BoardPixel=33,BoardPixelPower=21;
constexpr uint8_t EncoderA=15,EncoderB=14,EncoderSwitch=5,RadioButton=0;
constexpr uint8_t WakeOne=5,WakeTwo=6,ReservedNfcIrq=12,ToggleTwo=11;
// UI rows: top-left, top-right, bottom-left, bottom-right for 30/24 mm;
// 44 mm top/bottom. AW bit n = P(n/8)(n%8), 255 = not on this bus.
constexpr uint8_t ButtonGpio[10]={255,255,255,255,255,255,255,255,6,255};
constexpr uint8_t ButtonAw[10]={12,6,7,8,5,9,10,0,255,11};
// Mini left-to-right: yellow unknown/disabled, green P17, red P15.
constexpr uint8_t MiniAw[3]={255,15,13};
}
namespace boxbert::commissioning {
// Temporary first integrated-device profile. No claims of production readiness.
constexpr bool Nfc=true,Stick=false,BoostControl=false,AutoSleep=false,UsbDiagnostics=true;
constexpr int BootVolume=1,MaxVolume=6;
}
