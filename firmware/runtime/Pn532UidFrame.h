#pragma once
#include <stddef.h>
#include <stdint.h>
namespace boxbert::runtime {
// One I2C read: RDY byte + normal PN532 frame, optional trailing padding.
// Accept only checksum-valid InListPassiveTarget responses for one 4/7-byte UID.
inline bool pn532UidFrame(const uint8_t* p,size_t n,uint8_t* uid,uint8_t& length){
 length=0;
 if(!p||!uid||n<8||p[0]!=1||p[1]!=0||p[2]!=0||p[3]!=0xff)return false;
 size_t len=p[4];
 if(uint8_t(p[4]+p[5])!=0||len<12||len+8>n)return false;
 uint8_t sum=0;for(size_t i=6;i<=6+len;i++)sum=uint8_t(sum+p[i]);
 if(sum||p[7+len]!=0||p[6]!=0xd5||p[7]!=0x4b||p[8]!=1)return false;
 uint8_t count=p[13];
 if((count!=4&&count!=7)||size_t(count)+8>len)return false;
 for(uint8_t i=0;i<count;i++)uid[i]=p[14+i];
 length=count;return true;
}
}
