#pragma once
#include <cmath>
#include <cstdint>
#include <cstring>
#include <algorithm>
namespace boxbert::runtime {
struct Rgb {uint8_t r,g,b;};
inline Rgb sampleLed(uint32_t color,int brightness,bool rainbow,const char* effect,int index,int count,uint32_t ms){
 constexpr double pi=3.14159265358979323846;
 const auto is=[&](const char* value){return std::strcmp(effect,value)==0;};
 double rgb[]={double((color>>16)&255),double((color>>8)&255),double(color&255)};
 double cycle=is("farbwechsel")?(ms%12000)/12000.0:0;
 if(rainbow){
  double sector=std::fmod(double(index)/count+cycle,1.0)*6,rise=sector-std::floor(sector),fall=1-rise;
  double wheel[6][3]={{1,rise,0},{fall,1,0},{0,1,rise},{0,fall,1},{rise,0,1},{1,0,fall}};
  for(int c=0;c<3;c++)rgb[c]=std::round(wheel[int(sector)][c]*255);
 }else if(cycle>0){
  double stops[4][3]={{rgb[0],rgb[1],rgb[2]},{rgb[2],rgb[0],rgb[1]},{rgb[1],rgb[2],rgb[0]},{rgb[0],rgb[1],rgb[2]}};
  int at=int(cycle*3);double fraction=cycle*3-at;
  for(int c=0;c<3;c++)rgb[c]=std::round(stops[at][c]+(stops[at+1][c]-stops[at][c])*fraction);
 }
 double level=1,phase=(ms%4000)/4000.0;
 if(is("aus"))level=0;
 else if(is("party")){double wave=(1+std::cos((ms%3600)/3600.0*2*pi-index*2.399963229728653))/2;level=.2+.8*wave*wave;}
 else if(is("kerze"))level=.7+.18*std::sin((ms%3000)/3000.0*2*pi)+.1*std::sin((ms%5000)/5000.0*2*pi);
 else if(is("atmen"))level=.25+.75*(1+std::cos(phase*2*pi))/2;
 else if(is("links-rechts")||is("rechts-links")){double target=is("rechts-links")?count-1-index:index;double distance=std::abs(target-phase*count);level=std::max(0.0,1-std::min(distance,count-distance));}
 else if(is("mitte-aussen")){double center=(count-1)/2.0,inner=count%2==0?.5:0;double ring=std::abs(index-center)-inner;level=std::max(0.0,1-std::abs(ring-phase*(std::floor(center)+1)));}
 double scale=brightness/100.0*level;
 return {uint8_t(std::round(rgb[0]*scale)),uint8_t(std::round(rgb[1]*scale)),uint8_t(std::round(rgb[2]*scale))};
}
}
