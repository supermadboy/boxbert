#include "../runtime/LedFrame.h"
#include <cassert>
#include <iostream>
using namespace boxbert::runtime;
int main(){
 const int expected[][8][3]={
 {{0,0,0},{0,0,0},{0,0,0},{0,0,0},{0,0,0},{0,0,0},{0,0,0},{0,0,0}},
 {{44,18,0},{44,18,0},{44,18,0},{44,18,0},{44,18,0},{44,18,0},{44,18,0},{44,18,0}},
 {{22,9,0},{22,9,0},{22,9,0},{22,9,0},{22,9,0},{22,9,0},{22,9,0},{22,9,0}},
 {{0,0,0},{0,0,0},{24,10,0},{21,9,0},{0,0,0},{0,0,0},{0,0,0},{0,0,0}},
 {{0,0,0},{0,0,0},{0,0,0},{0,0,0},{21,9,0},{24,10,0},{0,0,0},{0,0,0}},
 {{0,0,0},{10,4,0},{34,14,0},{0,0,0},{0,0,0},{34,14,0},{10,4,0},{0,0,0}},
 {{11,4,0},{43,18,0},{9,4,0},{24,10,0},{26,11,0},{9,4,0},{42,17,0},{11,5,0}}
 };
 const char* effects[]={"aus","statisch","atmen","links-rechts","rechts-links","mitte-aussen","party"};
 for(int e=0;e<7;e++)for(int i=0;i<8;i++){
  auto rgb=sampleLed(0xdd5b00,20,false,effects[e],i,8,1234);
  assert(rgb.r==expected[e][i][0]);assert(rgb.g==expected[e][i][1]);assert(rgb.b==expected[e][i][2]);
 }
 auto color=sampleLed(0xdd5b00,20,false,"farbwechsel",0,1,1234);
 assert(color.r==31&&color.g==26&&color.b==6);
 auto candle=sampleLed(0xdd5b00,20,false,"kerze",0,1,1234);
 assert(candle.r==40&&candle.g==16&&candle.b==0);
 const int rainbow[][3]={{51,0,0},{51,38,0},{26,51,0},{0,51,13},{0,51,51},{0,13,51},{26,0,51},{51,0,38}};
 for(int i=0;i<8;i++){auto p=sampleLed(0xdd5b00,20,true,"statisch",i,8,0);assert(p.r==rainbow[i][0]&&p.g==rainbow[i][1]&&p.b==rainbow[i][2]);}
 for(auto t:{0u,11999u,12000u}){auto p=sampleLed(0xdd5b00,20,true,"farbwechsel",0,1,t);assert(p.r==51&&p.g==0&&p.b==0);}
 std::cout<<"LED frame parity: PASS\n";
}
