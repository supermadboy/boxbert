#include "../runtime/ReadModel.h"
#include <cassert>
#include <iostream>
int main(){
 JsonDocument config, files, result;
 config["/existing.mp3"]="sounds";
 config["/removed.mp3"]="sounds";
 files.to<JsonArray>().add("/existing.mp3");files.as<JsonArray>().add("/external.mp3");
 result["/stale.mp3"]="sounds";
 boxbert::runtime::categoryView(config.as<JsonObjectConst>(),files.as<JsonArrayConst>(),result.as<JsonObject>());
 assert(result["/existing.mp3"]=="sounds");
 assert(result["/external.mp3"]=="musik");
 assert(result.size()==2);
 assert(config.size()==2);
 assert(config["/external.mp3"].isNull());
 std::cout<<"device read model: PASS\n";
}
