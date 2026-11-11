#pragma once
#include <stdint.h>
// State = (IO15 << 1) | IO14. Measured clockwise: 3,1,0,2,3.
// Switch logic (no flash lookup table needed by the ISR).
namespace volume_diag {
inline __attribute__((always_inline)) int transition(uint8_t previous,uint8_t current) {
 switch((previous<<2)|current){
  case 13: case 4: case 2: case 11: return 1;
  case 14: case 8: case 1: case 7: return -1;
  default: return 0; // same state or invalid two-bit jump
 }
}
inline int boundedVolume(int volume,int steps) {
 int next=volume+steps;return next<0?0:next>6?6:next;
}
}
