#pragma once
#include <ArduinoJson.h>
#include <cstddef>
#include <cstring>
namespace boxbert::integrated {
// ArduinoJson intentionally accepts several JS extensions and ignores trailing input.
// Validate RFC JSON grammar first, so both transports accept exactly one strict value.
class JsonSyntax {
 const unsigned char* p;
 void ws(){while(*p==' '||*p=='\r'||*p=='\n'||*p=='\t')++p;}
 bool hex(){for(int i=0;i<4;i++){unsigned char c=*p;if(!((c>='0'&&c<='9')||(c>='a'&&c<='f')||(c>='A'&&c<='F')))return false;++p;}return true;}
 bool string(){if(*p++!='"')return false;while(*p&&*p!='"'){unsigned char c=*p++;if(c<32)return false;if(c=='\\'){c=*p++;if(c=='u'){if(!hex())return false;}else if(c!='"'&&c!='\\'&&c!='/'&&c!='b'&&c!='f'&&c!='n'&&c!='r'&&c!='t')return false;}}if(*p!='"')return false;++p;return true;}
 bool number(){if(*p=='-')++p;if(*p=='0')++p;else{if(*p<'1'||*p>'9')return false;while(*p>='0'&&*p<='9')++p;}if(*p=='.'){++p;if(*p<'0'||*p>'9')return false;while(*p>='0'&&*p<='9')++p;}if(*p=='e'||*p=='E'){++p;if(*p=='+'||*p=='-')++p;if(*p<'0'||*p>'9')return false;while(*p>='0'&&*p<='9')++p;}return true;}
 bool value(int depth){if(depth>10)return false;ws();if(*p=='"')return string();
  if(*p=='{'||*p=='['){bool object=*p++=='{';unsigned char close=object?'}':']';ws();if(*p==close){++p;return true;}
   for(;;){if(object){ws();if(*p!='"'||!string())return false;ws();if(*p++!=':')return false;}if(!value(depth+1))return false;ws();if(*p==close){++p;return true;}if(*p!=',')return false;++p;}
  }
  for(auto literal:{"true","false","null"}){size_t n=std::strlen(literal);if(!std::strncmp((const char*)p,literal,n)){p+=n;return true;}}
  return number();
 }
 public:
 explicit JsonSyntax(const char* text):p((const unsigned char*)text){}
 bool valid(){if(!value(0))return false;ws();return !*p;}
};
inline bool parseStrictJson(JsonDocument& out,const char* text){return JsonSyntax(text).valid()&&!deserializeJson(out,text);}
}
