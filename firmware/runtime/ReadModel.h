#pragma once
#include <ArduinoJson.h>
namespace boxbert::runtime {
// An SD file added outside the app is a real medium, not an invalid state.
// Reading supplies default metadata without changing persisted configuration.
inline void categoryView(JsonObjectConst stored,JsonArrayConst files,JsonObject out){
 out.clear();
 for(JsonVariantConst file:files){
  const char* path=file.as<const char*>();
  const char* category=stored[path].as<const char*>();
  out[path]=category?category:"musik";
 }
}
}
