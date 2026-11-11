#include "../runtime/Pn532UidFrame.h"
#include <array>
#include <cassert>
#include <iostream>
using Frame=std::array<uint8_t,64>;
static void seal(Frame& f){uint8_t sum=0;for(size_t i=6;i<6+f[4];i++)sum=uint8_t(sum+f[i]);f[6+f[4]]=uint8_t(0-sum);}
static Frame frame(uint8_t count){Frame f{};f[0]=1;f[3]=0xff;f[4]=8+count;f[5]=uint8_t(0-f[4]);f[6]=0xd5;f[7]=0x4b;f[8]=1;f[9]=1;f[13]=count;for(uint8_t i=0;i<count;i++)f[14+i]=i+1;seal(f);return f;}
int main(){
 uint8_t uid[7]={},length=99;
 auto valid=[&](const Frame& f,size_t n=64){return boxbert::runtime::pn532UidFrame(f.data(),n,uid,length);};
 for(uint8_t count:{4,7}){
  auto f=frame(count);assert(valid(f));assert(length==count);for(uint8_t i=0;i<count;i++)assert(uid[i]==i+1);
  for(size_t n=0;n<size_t(f[4])+8;n++){assert(!valid(f,n));assert(length==0);}
  for(size_t i=0;i<size_t(f[4])+8;i++){auto bad=f;bad[i]^=1;assert(!valid(bad));assert(length==0);}
 }
 for(uint8_t count:{0,3,5,6,8,10})assert(!valid(frame(count)));
 auto f=frame(7);f[4]=255;f[5]=1;assert(!valid(f));
 f=frame(7);f[13]=255;seal(f);assert(!valid(f));
 f=frame(7);f[8]=2;seal(f);assert(!valid(f));
 assert(!boxbert::runtime::pn532UidFrame(nullptr,64,uid,length));
 f=frame(4);assert(!boxbert::runtime::pn532UidFrame(f.data(),64,nullptr,length));
 std::cout<<"PN532 normal I2C UID frame: checksums/bounds/4+7-byte UIDs PASS\n";
}
