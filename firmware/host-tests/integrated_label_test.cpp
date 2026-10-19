#include "../boxbert/TagLabel.h"
#include <cassert>
#include <cstdio>
using namespace boxbert::integrated;
int main(){std::string out;
 assert(normalizeTagLabel("  e\xcc\x81  ",0,out)&&out=="\xc3\xa9");
 assert(normalizeTagLabel("\xef\xbb\xbf \xc2\xa0",1,out)&&out=="Tag 2");
 assert(normalizeTagLabel("\xe1\x84\x80\xe1\x85\xa1",0,out)&&out=="\xea\xb0\x80");
 assert(normalizeTagLabel("A\xcc\x95\xcc\x80",0,out)&&out=="\xc3\x80\xcc\x95");
 assert(!normalizeTagLabel("\xc0\xaf",0,out));assert(!normalizeTagLabel("\xed\xa0\x80",0,out));
 assert(normalizeTagLabel(std::string(80,'a')+"  ",0,out));
 assert(!normalizeTagLabel(std::string(81,'a'),0,out));
 std::string decomposed;for(int i=0;i<80;i++)decomposed+="e\xcc\x81";
 assert(normalizeTagLabel(decomposed,0,out));
 puts("integrated NFC tag names: PASS");
}
