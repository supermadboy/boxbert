#include "../boxbert/IntegratedState.h"
#include <cassert>
#include <cstdio>
using namespace boxbert::integrated;
static int commands(CredentialCommand& parser,const char* s){int count=0;while(*s)count+=parser.feed(*s++);return count;}
int main(){
 CredentialCommand p;
 assert(commands(p,"credentials")==0);assert(p.feed('\n'));
 assert(commands(p,"credentials\r\n")==1);
 assert(commands(p,"\nhelp\ncredential\ncredentialsX\nXcredentials\n")==0);
 assert(commands(p,"cre\rdentials\ncredentials\rX\n")==0);
 for(int i=0;i<10000;i++)assert(!p.feed('x'));
 assert(commands(p,"credentials\n")==0);assert(commands(p,"credentials\n")==1);
 assert(commands(p,"CREDENTIALS\n credentials\ncredentials \n")==0);
 assert(commands(p,"credentials\ncredentials\n")==2);
 puts("integrated explicit USB credentials: PASS");
}
