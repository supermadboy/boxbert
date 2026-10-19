#pragma once
#include <string>
#include <vector>
#include <algorithm>
#include "UnicodeNfcData.h"
namespace boxbert::integrated {
inline uint8_t combiningClass(uint32_t cp){auto first=std::begin(unicode::classes),last=std::end(unicode::classes);auto found=std::lower_bound(first,last,cp,[](const auto& e,uint32_t c){return e.cp<c;});return found!=last&&found->cp==cp?found->value:0;}
inline void canonicalDecompose(uint32_t cp,std::vector<uint32_t>& out){
 if(cp>=0xac00&&cp<0xd7a4){uint32_t s=cp-0xac00;out.push_back(0x1100+s/588);out.push_back(0x1161+s%588/28);if(s%28)out.push_back(0x11a7+s%28);return;}
 auto first=std::begin(unicode::decompositions),last=std::end(unicode::decompositions);auto found=std::lower_bound(first,last,cp,[](const auto& e,uint32_t c){return e.cp<c;});
 if(found!=last&&found->cp==cp){canonicalDecompose(found->a,out);if(found->b)canonicalDecompose(found->b,out);}else out.push_back(cp);
}
inline uint32_t canonicalCompose(uint32_t a,uint32_t b){
 if(a>=0x1100&&a<0x1113&&b>=0x1161&&b<0x1176)return 0xac00+(a-0x1100)*588+(b-0x1161)*28;
 if(a>=0xac00&&a<0xd7a4&&(a-0xac00)%28==0&&b>0x11a7&&b<0x11c3)return a+b-0x11a7;
 auto first=std::begin(unicode::compositions),last=std::end(unicode::compositions);auto key=std::pair<uint32_t,uint32_t>{a,b};auto found=std::lower_bound(first,last,key,[](const auto& e,const auto& k){return std::pair<uint32_t,uint32_t>{e.a,e.b}<k;});
 return found!=last&&found->a==a&&found->b==b?found->cp:0;
}
inline bool labelSpace(uint32_t cp){return (cp>=9&&cp<=13)||cp==32||cp==0xa0||cp==0x1680||(cp>=0x2000&&cp<=0x200a)||cp==0x2028||cp==0x2029||cp==0x202f||cp==0x205f||cp==0x3000||cp==0xfeff;}
inline bool normalizeTagLabel(const std::string& input,int index,std::string& out){
 // RPC frame limit is lower, but keep this pure entry point bounded too.
 if(input.size()>4096||index<0||index>1)return false;
 std::vector<uint32_t> decoded;
 for(size_t at=0;at<input.size();){uint32_t c=(uint8_t)input[at++],minimum=0;int n=0;
  if(c<0x80){if(!c)return false;}else if(c>=0xc2&&c<=0xdf){c&=31;n=1;minimum=0x80;}else if(c>=0xe0&&c<=0xef){c&=15;n=2;minimum=0x800;}else if(c>=0xf0&&c<=0xf4){c&=7;n=3;minimum=0x10000;}else return false;
  while(n--){if(at==input.size()||((uint8_t)input[at]&0xc0)!=0x80)return false;c=(c<<6)|((uint8_t)input[at++]&63);}if(c<minimum||c>0x10ffff||(c>=0xd800&&c<=0xdfff))return false;decoded.push_back(c);
 }
 size_t begin=0,end=decoded.size();while(begin<end&&labelSpace(decoded[begin]))++begin;while(end>begin&&labelSpace(decoded[end-1]))--end;
 std::vector<uint32_t> decomposed;
 for(size_t i=begin;i<end;i++)canonicalDecompose(decoded[i],decomposed);
 // Canonical ordering within each combining sequence (stable for equal classes).
 for(size_t i=1;i<decomposed.size();i++){uint8_t cls=combiningClass(decomposed[i]);if(!cls)continue;size_t at=i;while(at&&combiningClass(decomposed[at-1])>cls){std::swap(decomposed[at],decomposed[at-1]);--at;}}
 std::vector<uint32_t> composed;size_t starter=0;uint8_t previous=0;
 for(auto cp:decomposed){uint8_t cls=combiningClass(cp);uint32_t merged=composed.empty()?0:canonicalCompose(composed[starter],cp);
  if(merged&&(previous==0||previous<cls)){composed[starter]=merged;}else{if(!cls)starter=composed.size();composed.push_back(cp);previous=cls;}}
 if(composed.size()>80)return false;out.clear();
 if(composed.empty()){out="Tag "+std::to_string(index+1);return true;}
 for(auto cp:composed){if(cp<0x80)out+=char(cp);else if(cp<0x800){out+=char(0xc0|(cp>>6));out+=char(0x80|(cp&63));}else if(cp<0x10000){out+=char(0xe0|(cp>>12));out+=char(0x80|((cp>>6)&63));out+=char(0x80|(cp&63));}else{out+=char(0xf0|(cp>>18));out+=char(0x80|((cp>>12)&63));out+=char(0x80|((cp>>6)&63));out+=char(0x80|(cp&63));}}
 return true;
}
}
