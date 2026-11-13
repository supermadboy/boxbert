#include "../Config.h"
#include <cassert>
#include <iostream>
int main(){
 using namespace boxbert::pins;
 static_assert(Sda==3&&Scl==4&&SdCs==8&&SdSck==36&&SdMosi==35&&SdMiso==37);
 static_assert(AudioData==16&&AudioBclk==17&&AudioLrc==18);
 static_assert(BoostEn==9&&Stick==10&&BoardPixel==33&&BoardPixelPower==21);
 static_assert(EncoderA==15&&EncoderB==14&&EncoderSwitch==5&&RadioButton==0);
 static_assert(ToggleTwo==11&&MiniAw[0]==255&&MiniAw[1]==15&&MiniAw[2]==13);
 static_assert(WakeOne==5&&WakeTwo==6&&ReservedNfcIrq==12);
 const uint8_t expectedAw[]={12,6,7,8,5,9,10,0,255,11};
 bool usedAw[16]={};
 for(int i=0;i<10;i++){
  assert((ButtonGpio[i]!=255)!=(ButtonAw[i]!=255));
  assert(ButtonGpio[i]==(i==8?6:255));assert(ButtonAw[i]==expectedAw[i]);
  if(ButtonAw[i]!=255){assert(ButtonAw[i]<16&&!usedAw[ButtonAw[i]]);usedAw[ButtonAw[i]]=true;}
 }
 for(auto pin:MiniAw)if(pin!=255){assert(pin<16&&!usedAw[pin]);usedAw[pin]=true;}
 using namespace boxbert::commissioning;
 static_assert(Nfc&&!boxbert::commissioning::Stick&&!BoostControl&&!AutoSleep&&BootVolume==1&&MaxVolume==21);
 std::cout<<"measured endaufbau pin contract: PASS\n";
}
