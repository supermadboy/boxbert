#pragma once
#include <ArduinoJson.h>
#include <SD.h>
#include <Preferences.h>
#include <mbedtls/sha256.h>
#include "IntegratedState.h"
#include "Validation.h"
#include "src/runtime/Policy.h"
namespace boxbert::integrated {
inline String sha256(const String& s){uint8_t hash[32];mbedtls_sha256((const uint8_t*)s.c_str(),s.length(),hash,0);char hex[65];for(int i=0;i<32;i++)sprintf(hex+i*2,"%02x",hash[i]);return String(hex);}
class ConfigStore {
 static constexpr const char* slots[2]={"/.boxbert/config0.json","/.boxbert/config1.json"};
 bool readSlot(int slot,JsonDocument& out,uint32_t& rev){
  File f=SD.open(slots[slot]);if(!f||f.size()>24576){f.close();return false;}JsonDocument env;auto err=deserializeJson(env,f);f.close();
  if(err||!env["revision"].is<uint32_t>()||!stringValue(env["payload"])||!stringValue(env["checksum"]))return false;
  String payload=env["payload"].as<String>();rev=env["revision"];if(!rev||env["checksum"].as<String>()!=sha256(String(rev)+":"+payload))return false;
  return !deserializeJson(out,payload)&&validConfig(out.as<JsonVariantConst>());
 }
 public:
 JsonDocument data;bool ready=false,damaged=false;uint32_t revision=0;int active=-1;
 void defaults(){
  data.clear();data["schema"]=1;data["volume"]=6;
  for(auto channel:{"pixel","boardPixel"}){data[channel]["color"]="#ff782d";data[channel]["brightness"]=10;data[channel]["palette"]="solid";data[channel]["effect"]="statisch";}
  auto tags=data["tags"].to<JsonArray>();
  for(int i=0;i<2;i++){auto t=tags.add<JsonObject>();t["uid"]=TagUids[i];t["name"]=i?"Tag 2":"Tag 1";t["path"]="";t["introPath"]="";}
  auto buttons=data["buttons"].to<JsonArray>();
  for(int i=0;i<10;i++){auto b=buttons.add<JsonObject>();b["id"]=i+1;b["path"]="";}
  data["categories"].to<JsonObject>();
 }
 bool begin(){
  JsonDocument a,b;uint32_t ar=0,br=0;bool av=readSlot(0,a,ar),bv=readSlot(1,b,br);active=selectSlot(av,ar,bv,br);
  if(active>=0){data.set(active?b:a);revision=active?br:ar;ready=true;return true;}
  damaged=SD.exists(slots[0])||SD.exists(slots[1]);defaults();ready=!damaged;
  if(damaged){Serial.println("CONFIG CORRUPT: preserving both slots; mutations locked");return false;}
  // First SD generation only: retain playable Etappe-5 NVS assignments.
  // Read-only access leaves the original namespace intact, also on SD write failure.
  Preferences legacy;bool legacyOpen=legacy.begin("boxbert-tags",true);
  const char* fallbacks[]={"/arcade-music-loop.mp3","/happy-tune.mp3"};
  for(int i=0;i<2;i++){
   const char* key=i?"tag1":"tag0";bool assigned=legacyOpen&&legacy.isKey(key);
   String saved=assigned?legacy.getString(key,""):String();
   auto path=initialTagPath(assigned?saved.c_str():nullptr,fallbacks[i],[](const char* p){File f=SD.open(p);bool ok=f&&!f.isDirectory()&&f.size()>0;f.close();return ok;});
   data["tags"][i]["path"]=path.c_str();
  }
  if(legacyOpen)legacy.end();
  JsonDocument initial;initial.set(data);return save(initial);
 }
 bool save(const JsonDocument& next){
  if(!ready||damaged||revision==UINT32_MAX||!validConfig(next.as<JsonVariantConst>()))return false;
  String payload;serializeJson(next,payload);if(payload.length()>12000)return false;
  if(!SD.exists("/.boxbert")&&!SD.mkdir("/.boxbert"))return false;
  int target=active==0?1:0;uint32_t rev=revision+1;JsonDocument env;env["revision"]=rev;env["payload"]=payload;env["checksum"]=sha256(String(rev)+":"+payload);
  // Only the inactive slot is truncated; the previous valid generation remains intact.
  File f=SD.open(slots[target],"w");if(!f)return false;size_t expected=measureJson(env),written=serializeJson(env,f);f.flush();bool io=written==expected&&!f.getWriteError();f.close();
  JsonDocument verify;uint32_t verified=0;if(!io||!readSlot(target,verify,verified)||verified!=rev)return false;
  data.set(next);active=target;revision=rev;return true;
 }
};
}
