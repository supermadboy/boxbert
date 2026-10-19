#include "../boxbert/Validation.h"
#include "../boxbert/IntegratedState.h"
#include <cassert>
#include <cstdio>
using namespace boxbert::integrated;
int main(){
 auto playable=[](const char* path){return !strcmp(path,"/custom.mp3")||!strcmp(path,"/default.mp3");};
 assert(initialTagPath("/custom.mp3","/default.mp3",playable)=="/custom.mp3");
 assert(initialTagPath(nullptr,"/default.mp3",playable)=="/default.mp3");
 // An explicit old mapping must not silently become a different song.
 assert(initialTagPath("/missing.mp3","/default.mp3",playable).empty());
 assert(initialTagPath("/../bad.mp3","/default.mp3",playable).empty());
 assert(initialTagPath("","/default.mp3",playable).empty());
 assert(initialTagPath(nullptr,"/missing.mp3",playable).empty());
 puts("integrated migration: PASS");
}
