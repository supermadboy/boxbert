#include "../Config.h"
#include <cassert>
#include <iostream>
int main(){
 using namespace boxbert::pins;
 static_assert(Sda==3&&Scl==4&&SdCs==10&&SdSck==36&&SdMosi==35&&SdMiso==37);
 static_assert(AudioData==16&&AudioBclk==17&&AudioLrc==18);
 static_assert(BoostEn==9&&Stick==8&&BoardPixel==33&&BoardPixelPower==21);
 static_assert(EncoderA==15&&EncoderB==14&&EncoderSwitch==12&&RadioButton==0);
 static_assert(ToggleTwo==38&&MiniAw[0]==6&&MiniAw[1]==7&&MiniAw[2]==8);
 for(int i=0;i<10;i++)assert((ButtonGpio[i]!=255)!=(ButtonAw[i]!=255));
 static_assert(WakeOne==5&&WakeTwo==6&&ReservedNfcIrq==11);
 static_assert(ButtonGpio[0]==5&&ButtonGpio[1]==6&&ButtonGpio[4]==39&&ButtonGpio[5]==13);
 static_assert(ButtonAw[2]==2&&ButtonAw[3]==3&&ButtonAw[6]==4&&ButtonAw[7]==5&&ButtonAw[8]==0&&ButtonAw[9]==1);
 std::cout<<"pin contract: PASS\n";
}
