#include "../runtime/Quadrature.h"
#include <cassert>
#include <iostream>
int main(){
 using namespace boxbert::runtime;
 const uint8_t cw[]={3,1,0,2,3},ccw[]={3,2,0,1,3};
 int edges=0;
 for(int i=1;i<5;i++)edges+=quadratureTransition(cw[i-1],cw[i]);
 assert(takeEncoderSteps(edges)==1&&edges==0);
 for(int i=1;i<5;i++)edges+=quadratureTransition(ccw[i-1],ccw[i]);
 assert(takeEncoderSteps(edges)==-1&&edges==0);
 assert(quadratureTransition(3,1)+quadratureTransition(1,3)==0);
 assert(quadratureTransition(3,0)==0&&quadratureTransition(0,3)==0);
 edges=3;assert(takeEncoderSteps(edges)==0&&edges==3);
 edges=9;assert(takeEncoderSteps(edges)==2&&edges==1);
 edges=-9;assert(takeEncoderSteps(edges)==-2&&edges==-1);
 for(int a=0;a<4;a++)for(int b=0;b<4;b++)assert(quadratureTransition(a,b)==-quadratureTransition(b,a));
 for(int v=-20;v<50;v++){int clamped=clampVolume(v,6);assert(clamped>=0&&clamped<=6);}
 std::cout<<"encoder direction, bounce, backlog, remainder and volume cap: PASS\n";
}
