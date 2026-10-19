#pragma once
#include <ArduinoJson.h>
#include <cctype>
#include "TagLabel.h"
#if __has_include("src/runtime/Policy.h")
#include "src/runtime/Policy.h"
#else
#include "../runtime/Policy.h"
#endif
namespace boxbert::integrated {
constexpr const char* TagUids[]={"E3:2F:F6:33","01:8C:F1:6E"};
inline bool mediaPath(const char* s,bool empty=false){return s&&((empty&&!*s)||(*s=='/'&&runtime::validMediaName(s+1)));}
// A present but unusable legacy assignment never falls back to another song.
template<class Exists> std::string initialTagPath(const char* saved,const char* fallback,Exists exists){
 const char* selected=saved?saved:fallback;
 return mediaPath(selected)&&exists(selected)?selected:"";
}
inline bool stringValue(JsonVariantConst v){return v.is<const char*>()&&strlen(v.as<const char*>())==v.as<JsonString>().size();}
inline bool validLed(JsonVariantConst v,bool board){
 if(!v.is<JsonObjectConst>()||v.size()!=4||!stringValue(v["color"])||!stringValue(v["palette"])||!stringValue(v["effect"])||!v["brightness"].is<int>())return false;
 const char* color=v["color"];if(strlen(color)!=7||*color!='#')return false;for(int i=1;i<7;i++)if(!isxdigit((unsigned char)color[i]))return false;
 int b=v["brightness"];if(b<0||b>100)return false;
 const char* p=v["palette"];if(strcmp(p,"solid")&&strcmp(p,"rainbow"))return false;
 const char* effect=v["effect"];
 const char* common[]={"aus","statisch","atmen","party"};for(auto e:common)if(!strcmp(e,effect))return true;
 const char* stick[]={"links-rechts","rechts-links","mitte-aussen"};const char* onboard[]={"farbwechsel","kerze"};
 if(board){for(auto e:onboard)if(!strcmp(e,effect))return true;}else{for(auto e:stick)if(!strcmp(e,effect))return true;}return false;
}
inline bool category(JsonVariantConst v){return stringValue(v)&&(!strcmp(v.as<const char*>(),"musik")||!strcmp(v.as<const char*>(),"sounds"));}
inline bool tagName(const char* s){std::string normalized;return s&&normalizeTagLabel(s,0,normalized);}
inline bool validConfig(JsonVariantConst c){
 if(!c.is<JsonObjectConst>()||c["schema"]!=1||!c["volume"].is<int>()||c["volume"].as<int>()<0||c["volume"].as<int>()>21||!validLed(c["pixel"],false)||!validLed(c["boardPixel"],true))return false;
 if(!c["tags"].is<JsonArrayConst>()||c["tags"].size()!=2||!c["buttons"].is<JsonArrayConst>()||c["buttons"].size()!=10||!c["categories"].is<JsonObjectConst>())return false;
 for(int i=0;i<2;i++){auto t=c["tags"][i];if(!stringValue(t["uid"])||strcmp(t["uid"],TagUids[i])||!stringValue(t["name"])||!tagName(t["name"])||!stringValue(t["path"])||!mediaPath(t["path"],true)||!stringValue(t["introPath"])||!mediaPath(t["introPath"],true))return false;}
 for(int i=0;i<10;i++){auto b=c["buttons"][i];if(!b["id"].is<int>()||b["id"]!=i+1||!stringValue(b["path"])||!mediaPath(b["path"],true))return false;}
 for(JsonPairConst p:c["categories"].as<JsonObjectConst>())if(!mediaPath(p.key().c_str())||!category(p.value()))return false;
 return true;
}
}
