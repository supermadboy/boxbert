#include "../boxbert/Validation.h"
#include <cassert>
#include <cstdio>
using namespace boxbert::integrated;
int main(){
 JsonDocument d;deserializeJson(d,R"({"schema":1,"volume":6,"pixel":{"color":"#1122ff","brightness":10,"palette":"solid","effect":"statisch"},"boardPixel":{"color":"#1122ff","brightness":10,"palette":"rainbow","effect":"farbwechsel"},"tags":[{"uid":"E3:2F:F6:33","name":"Tag 1","path":"/a.mp3","introPath":""},{"uid":"01:8C:F1:6E","name":"Tag 2","path":"","introPath":""}],"buttons":[],"categories":{}})");
 for(int i=1;i<=10;i++){auto b=d["buttons"].as<JsonArray>().add<JsonObject>();b["id"]=i;b["path"]="";}
 assert(validConfig(d.as<JsonVariantConst>()));
 d["volume"]=true;assert(!validConfig(d.as<JsonVariantConst>()));d["volume"]=22;assert(!validConfig(d.as<JsonVariantConst>()));d["volume"]=6;
 d["tags"][0]["uid"]="01:8C:F1:6E";assert(!validConfig(d.as<JsonVariantConst>()));d["tags"][0]["uid"]="E3:2F:F6:33";
 d["pixel"]["effect"]="farbwechsel";assert(!validConfig(d.as<JsonVariantConst>()));d["pixel"]["effect"]="statisch";
 d["buttons"][4]["path"]="/../secret.mp3";assert(!validConfig(d.as<JsonVariantConst>()));d["buttons"][4]["path"]="";
 d["categories"]["/a.mp3"]="invalid";assert(!validConfig(d.as<JsonVariantConst>()));d["categories"]["/a.mp3"]="musik";assert(validConfig(d.as<JsonVariantConst>()));
 d["pixel"]["color"]="bad";assert(!validConfig(d.as<JsonVariantConst>()));
 puts("integrated config validation: PASS");
}
