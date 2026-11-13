#include "../runtime/Policy.h"
#include <cassert>
#include <cstdint>
#include <iostream>
int main(){
 using boxbert::runtime::bleSessionExpired;
 // Representative loop-entry values just before response creation in the trace.
 // Actual loop-entry timestamps were not logged. The old subtraction underflows.
 constexpr uint32_t entry=104089,response=104090;
 assert(uint32_t(entry-response)>30000);
 assert(!bleSessionExpired(entry,response,false,true));
 assert(!bleSessionExpired(128434,128435,false,true));
 assert(!bleSessionExpired(100,101,true,false));
 assert(!bleSessionExpired(100,101,true,true));
 assert(!bleSessionExpired(100,100,true,true));
 assert(!bleSessionExpired(10100,100,true,false));
 assert(bleSessionExpired(10101,100,true,false));
 assert(!bleSessionExpired(30100,100,false,true));
 assert(bleSessionExpired(30101,100,false,true));
 assert(bleSessionExpired(10101,100,true,true));
 assert(!bleSessionExpired(100000,100,false,false));
 // Real millis wrap still counts forward, including exact timeout boundaries.
 constexpr uint32_t start=UINT32_MAX-100;
 assert(!bleSessionExpired(start+uint32_t(30000),start,false,true));
 assert(bleSessionExpired(start+uint32_t(30001),start,false,true));
 assert(!bleSessionExpired(4,UINT32_MAX-5,true,true));
 // Ambiguous half-range or older loop stamps must not cause a false timeout.
 assert(!bleSessionExpired(0x80000000u,0,true,true));
 assert(!bleSessionExpired(0,1,true,true));
 std::cout<<"BLE timeout / future activity / millis wrap: PASS\n";
}
