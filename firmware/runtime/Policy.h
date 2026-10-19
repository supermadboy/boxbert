#pragma once
#include <cstddef>
#include <cstdint>
#include <cstring>
namespace boxbert::runtime {
inline bool validMediaName(const char* name) {
 const size_t n=std::strlen(name);
 if(n<5||n>64||name[0]=='.'||std::strcmp(name+n-4,".mp3"))return false;
 for(size_t i=0;i<n;i++) {const char c=name[i];if(!((c>='a'&&c<='z')||(c>='A'&&c<='Z')||(c>='0'&&c<='9')||c=='_'||c=='-'||c=='.'))return false;}
 return true;
}
struct UploadProgress {
 bool active=false; uint32_t size=0,offset=0;
 bool begin(uint32_t n){if(active||n==0||n>16777216)return false;active=true;size=n;offset=0;return true;}
 bool chunk(uint32_t at,uint32_t n){if(!active||at!=offset||n==0||n>384||n>size-offset)return false;offset+=n;return true;}
 bool complete()const{return active&&size==offset;}
 void abort(){active=false;size=offset=0;}
};
enum class Radio:uint8_t {Off,Wifi,Ble};
inline Radio nextRadio(Radio r){return r==Radio::Ble?Radio::Off:r==Radio::Off?Radio::Wifi:Radio::Ble;}
// Half-range comparison also rejects an activity update newer than the caller's
// loop-entry timestamp. The five-minute deadline is far below half the millis range.
inline bool shouldSleep(uint32_t now,uint32_t activity,bool playing,bool uploading,bool held){const uint32_t elapsed=now-activity;return !playing&&!uploading&&!held&&elapsed>=300000&&elapsed<0x80000000u;}
class Debouncer {
 bool initialized=false,raw=false,stable=false,armed=false;uint32_t changed=0;
 public:
 bool update(bool pressed,uint32_t now){
  if(!initialized){initialized=true;raw=stable=pressed;armed=!pressed;changed=now;return false;}
  if(raw!=pressed){raw=pressed;changed=now;}
  if(raw!=stable&&uint32_t(now-changed)>=20){stable=raw;if(!stable)armed=true;else if(armed){armed=false;return true;}}
  return false;
 }
};
}
