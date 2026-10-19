#include "../boxbert/IntegratedState.h"
#include <cassert>
#include <cmath>
#include <cstdio>
using namespace boxbert::integrated;
int main(){
 assert(chargingState(NAN)==-1);
 assert(chargingState(INFINITY)==-1);
 assert(chargingState(-INFINITY)==-1);
 assert(chargingState(3)==1);
 assert(chargingState(2)==0);
 assert(chargingState(-3)==0);
 puts("integrated charging: PASS");
}
