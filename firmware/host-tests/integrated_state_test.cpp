#include "../boxbert/IntegratedState.h"
#include <cassert>
#include <cstdio>
using namespace boxbert::integrated;
int main(){
 LineParser p; for(int i=0;i<4096;i++) assert(p.feed('a')==LineParser::More);
 assert(p.feed('\n')==LineParser::Ready); assert(p.size()==4096);p.reset();
 for(int i=0;i<4097;i++)p.feed('x');assert(p.feed('\n')==LineParser::Overflow);p.reset();
 assert(p.feed('{')==LineParser::More);assert(p.feed('\0')==LineParser::Invalid);p.reset();
 IntroChain c;c.start("/song.mp3","/intro.mp3");assert(c.intro());assert(c.eof()=="/song.mp3");assert(c.eof().empty());
 c.start("/song.mp3","/intro.mp3");c.stop();assert(c.eof().empty());
 c.start("/old.mp3","/intro.mp3");c.start("/new.mp3","");assert(c.eof().empty());
 assert(validStaticPath("/assets/index-a.js"));assert(validStaticPath("/"));
 for(auto s:{"/../config","/%2e/config","//x","/Secrets.h","/a\\b","/a?x","/.hidden"})assert(!validStaticPath(s));
 assert(selectSlot(true,4,true,5)==1);assert(selectSlot(true,9,false,0)==0);assert(selectSlot(false,0,false,0)==-1);
 puts("integrated state: PASS");
}
