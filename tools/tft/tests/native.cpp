#include "../../../firmware/ui/TftRenderer.h"
#include <cstdio>
#include <cstdlib>
#include <cstring>
int main(int argc,char** argv) {
 if(argc==2&&std::strcmp(argv[1],"--selftest")==0){
  uint16_t previous[240*135];
  uint32_t seed=1;
  for(int iteration=0;iteration<128;++iteration){
   for(int i=0;i<512;++i){seed=seed*1664525u+1013904223u;tft_figure_input()[i]=static_cast<char>(seed>>24);}
   for(int i=0;i<2048;++i){seed=seed*1664525u+1013904223u;tft_title_input()[i]=static_cast<char>(seed>>24);}
   auto p=tft_render(2,2147483647,1,99,-9,-1,1,seed,-1);
   std::memcpy(previous,p,sizeof previous);
   if(std::memcmp(previous,tft_render(2,2147483647,1,99,-9,-1,1,seed,-1),sizeof previous))return 3;
  }
  std::memset(tft_figure_input(),'W',512);std::memset(tft_title_input(),'W',2048);
  tft_render(2,0,0,-1,-1,0,3,0xffffffffu,2147483647);
  std::puts("PASS native 128 malformed UTF8 cases + full unterminated capacities");return 0;
 }
 if(argc!=12) return 2;
 std::strncpy(tft_figure_input(),argv[1],511);
 std::strncpy(tft_title_input(),argv[2],2047);
 auto p=tft_render(std::atoi(argv[3]),std::atoi(argv[4]),std::atoi(argv[5]),std::atoi(argv[6]),std::atoi(argv[7]),std::atoi(argv[8]),std::atoi(argv[9]),static_cast<uint32_t>(std::strtoull(argv[10],nullptr,10)),std::atoi(argv[11]));
 for(int i=0;i<240*135;++i) { std::putchar(p[i]&255); std::putchar(p[i]>>8); }
}
