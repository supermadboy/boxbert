#include "../boxbert/JsonInput.h"
#include <cassert>
#include <cstdio>
using namespace boxbert::integrated;
int main(){JsonDocument d;
 assert(parseStrictJson(d,"{\"id\":1,\"args\":{}}"));
 assert(!parseStrictJson(d,"{\"id\":1}garbage"));
 assert(!parseStrictJson(d,"{\"id\":1}{\"id\":2}"));
 assert(parseStrictJson(d,"{\"x\":\"ä\\\"z\",\"nested\":[1,2]} \r\n\t"));
 assert(!parseStrictJson(d,"{\"broken\":}"));
 assert(!parseStrictJson(d,"{\"x\":NaN}"));
 assert(!parseStrictJson(d,"{\"x\":Infinity}"));
 assert(!parseStrictJson(d,"{unquoted:1}"));
 assert(!parseStrictJson(d,"{'single':1}"));
 puts("integrated strict JSON: PASS");}
