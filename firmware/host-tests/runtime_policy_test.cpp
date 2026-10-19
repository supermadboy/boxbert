#include "../runtime/Policy.h"
#include <cassert>
#include <iostream>
int main() {
 using namespace boxbert::runtime;
 assert(validMediaName("a.mp3"));
 assert(validMediaName("intro-123.mp3"));
 assert(!validMediaName("../a.mp3"));
 assert(!validMediaName(".a.mp3"));
 assert(!validMediaName("x.wav"));
 assert(!validMediaName("a.MP3"));
 assert(!validMediaName("a b.mp3"));
 assert(!validMediaName(""));
 UploadProgress upload;
 assert(!upload.chunk(0,1));
 assert(!upload.begin(0));
 assert(!upload.begin(16777217));
 assert(upload.begin(500));
 assert(!upload.begin(10));
 assert(!upload.chunk(1,100));
 assert(!upload.chunk(0,385));
 assert(upload.chunk(0,384));
 assert(!upload.complete());
 assert(!upload.chunk(384,117));
 assert(upload.chunk(384,116));
 assert(upload.complete());
 upload.abort();
 assert(!upload.complete());
 assert(upload.begin(1));
 assert(upload.chunk(0,1));
 assert(upload.complete());
 assert(!shouldSleep(100,101,false,false,false)); // activity updated after loop-entry clock
 assert(!shouldSleep(300000,0,true,false,false));
 assert(!shouldSleep(300000,0,false,true,false));
 assert(!shouldSleep(300000,0,false,false,true));
 assert(!shouldSleep(299999,0,false,false,false));
 assert(shouldSleep(300000,0,false,false,false));
 assert(shouldSleep(100,0xfffb6c84u,false,false,false));
 assert(nextRadio(Radio::Ble)==Radio::Off);
 assert(nextRadio(Radio::Off)==Radio::Wifi);
 assert(nextRadio(Radio::Wifi)==Radio::Ble);
 Debouncer key;
 assert(!key.update(true,0)); // boot-held must not trigger
 assert(!key.update(false,1));
 assert(!key.update(false,25));
 assert(!key.update(true,30));
 assert(!key.update(true,49));
 assert(key.update(true,50));
 assert(!key.update(true,80));
 assert(!key.update(false,90));
 assert(!key.update(false,110));
 assert(!key.update(true,111));
 assert(key.update(true,131));
 std::cout << "runtime policy: PASS\n";
}
