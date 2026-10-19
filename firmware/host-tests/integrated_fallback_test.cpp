#include "../boxbert/IntegratedState.h"
#include <cassert>
#include <cstdio>
using namespace boxbert::integrated;
int main(){
 StationFallback f;
 assert(!f.due(20000,false));
 f.start(100);assert(!f.due(99,false));assert(!f.due(15099,false));assert(f.due(15100,false));assert(!f.due(15101,false));
 f.start(100);assert(!f.due(16000,true));assert(!f.due(30999,false));assert(f.due(31000,false));
 f.start(0xfffffff0u);assert(!f.due(0xfffffff1u,false));assert(!f.due(14983,false));assert(f.due(14984,false));
 f.start(10);f.cancel();assert(!f.due(50000,false));
 puts("integrated station fallback: PASS");
}
