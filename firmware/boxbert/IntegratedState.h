#pragma once
#include <cstddef>
#include <cmath>
#include <cstdint>
#include <cstring>
#include <string>
namespace boxbert::integrated {
inline int chargingState(float rate){return std::isfinite(rate)?(rate>2?1:0):-1;}
enum class PlayerAction {None,Pause,Resume,Restart};
inline PlayerAction playPauseAction(bool paused,bool playing,bool hasPath,bool uploading){
 if(uploading)return PlayerAction::None;
 return paused?PlayerAction::Resume:playing?PlayerAction::Pause:hasPath?PlayerAction::Restart:PlayerAction::None;
}
class StationFallback {
 bool waiting=false;uint32_t since=0;
 public:
 void start(uint32_t now){waiting=true;since=now;}
 void cancel(){waiting=false;}
 bool due(uint32_t now,bool connected){
  if(!waiting)return false;
  if(connected){since=now;return false;}
  const uint32_t elapsed=now-since;
  if(elapsed<15000||elapsed>=0x80000000u)return false;
  waiting=false;return true;
 }
};
// Only an exact, bounded USB line authorizes printing credentials.
class CredentialCommand {
 char line[11]{};size_t used=0;bool bad=false,cr=false;
 public:
 bool feed(char c){
  if(c=='\n'){bool accepted=!bad&&used==sizeof(line)&&!std::memcmp(line,"credentials",sizeof(line));used=0;bad=cr=false;return accepted;}
  if(c=='\r'){if(cr)bad=true;cr=true;return false;}
  if(cr||used==sizeof(line)){bad=true;return false;}
  line[used++]=c;return false;
 }
};
class LineParser {
 char buffer[4097]{};size_t used=0;bool overflow=false,bad=false;
 public:
 enum Result {More,Ready,Overflow,Invalid};
 Result feed(char c){
  if(c=='\n')return overflow?Overflow:bad?Invalid:Ready;
  if(c=='\0'||c=='\r'){bad=true;return Invalid;}
  if(used==4096){overflow=true;return More;}
  buffer[used++]=c;buffer[used]=0;return More;
 }
 const char* data()const{return buffer;}size_t size()const{return used;}
 void reset(){used=0;buffer[0]=0;overflow=bad=false;}
};
class IntroChain {
 std::string next;bool inIntro=false;
 public:
 void start(const std::string& song,const std::string& intro){next=intro.empty()?"":song;inIntro=!intro.empty();}
 void stop(){next.clear();inIntro=false;}
 bool intro()const{return inIntro;}
 std::string eof(){std::string result=next;stop();return result;}
};
inline bool validStaticPath(const char* path){
 if(!path||path[0]!='/')return false;
 if(!std::strcmp(path,"/"))return true;
 bool segment=true;
 for(const char* p=path+1;*p;p++){
  unsigned char c=*p;
  if(c=='/'){if(segment)return false;segment=true;continue;}
  if(segment&&c=='.')return false;
  segment=false;
  if(!((c>='a'&&c<='z')||(c>='A'&&c<='Z')||(c>='0'&&c<='9')||c=='-'||c=='_'||c=='.'))return false;
 }
 return !segment&&std::strstr(path,"Secrets")==nullptr;
}
inline int selectSlot(bool a,uint32_t ar,bool b,uint32_t br){return a&&b?(ar>=br?0:1):a?0:b?1:-1;}
}
