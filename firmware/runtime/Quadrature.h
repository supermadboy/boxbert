#pragma once
#include <stdint.h>
namespace boxbert::runtime {
// Two-bit Gray state. Positive sequence 3 -> 1 -> 0 -> 2 -> 3.
// Always inline: callable from ESP GPIO ISR without a flash lookup table.
inline __attribute__((always_inline)) int quadratureTransition(uint8_t previous,uint8_t current) {
 switch((previous<<2)|current){
  case 13: case 4: case 2: case 11: return 1;
  case 14: case 8: case 1: case 7: return -1;
  default: return 0;
 }
}
inline int takeEncoderSteps(int& edges){int steps=edges/4;edges-=steps*4;return steps;}
inline int clampVolume(int volume,int maximum){return volume<0?0:volume>maximum?maximum:volume;}
}
