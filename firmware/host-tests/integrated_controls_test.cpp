#include "../boxbert/IntegratedState.h"
#include <cassert>
#include <cstdio>
using namespace boxbert::integrated;
int main(){
 assert(playPauseAction(false,true,true,false)==PlayerAction::Pause);
 assert(playPauseAction(true,false,true,false)==PlayerAction::Resume);
 assert(playPauseAction(false,false,true,false)==PlayerAction::Restart);
 assert(playPauseAction(false,false,false,false)==PlayerAction::None);
 assert(playPauseAction(true,false,true,true)==PlayerAction::None);
 assert(playPauseAction(false,true,true,true)==PlayerAction::None);
 puts("integrated essential controls: PASS");
}
