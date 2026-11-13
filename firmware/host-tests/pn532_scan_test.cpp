#include "../runtime/Pn532Scan.h"
#include <array>
#include <cassert>
#include <deque>
#include <iostream>
#include <vector>
using Scan=boxbert::runtime::Pn532Scan;
struct Bus {
 bool writeOk=true;unsigned writes=0,reads=0;std::deque<std::vector<uint8_t>> replies;
 bool write(const uint8_t* p,size_t n){
  static const std::vector<uint8_t> expected={0,0,255,4,252,212,74,1,0,225,0};
  assert(std::vector<uint8_t>(p,p+n)==expected);++writes;return writeOk;
 }
 bool read(uint8_t* p,size_t n){++reads;assert(!replies.empty());auto r=replies.front();replies.pop_front();if(r.size()!=n)return false;for(size_t i=0;i<n;i++)p[i]=r[i];return true;}
 void ack(){replies.push_back({1});replies.push_back({1,0,0,255,0,255,0});}
 void target(){std::vector<uint8_t> f(64);f[0]=1;f[3]=255;f[4]=12;f[5]=244;f[6]=213;f[7]=75;f[8]=1;f[9]=1;f[13]=4;f[14]=227;f[15]=47;f[16]=246;f[17]=51;uint8_t sum=0;for(int i=6;i<18;i++)sum=uint8_t(sum+f[i]);f[18]=uint8_t(0-sum);replies.push_back({1});replies.push_back(f);}
};
int main(){
 uint8_t uid[7]={},length=99;
 Scan s;Bus b;assert(s.idle());assert(!s.tick(b,100,uid,length));assert(length==0&&!s.idle());assert(b.writes==1);
 b.replies.push_back({0});assert(!s.tick(b,110,uid,length));assert(b.writes==1);
 b.ack();assert(!s.tick(b,120,uid,length));assert(s.phase()==Scan::Phase::Target);
 for(uint32_t now:{1000u,1000000u,0xfffffff0u,20u}){b.replies.push_back({0});assert(!s.tick(b,now,uid,length));assert(b.writes==1);}
 b.target();assert(s.tick(b,100,uid,length));assert(length==4&&uid[0]==227&&uid[3]==51&&s.idle());
 auto reads=b.reads;assert(!s.needsBus(299));assert(!s.tick(b,299,uid,length));assert(b.reads==reads&&b.writes==1);
 assert(!s.tick(b,300,uid,length));assert(b.writes==2&&s.phase()==Scan::Phase::Ack);
 // Deadline fails closed; repeated ticks never resend or read after fault.
 assert(!s.tick(b,1300,uid,length));assert(s.error()==Scan::Error::AckTimeout);
 reads=b.reads;assert(!s.tick(b,1400,uid,length));assert(b.writes==2&&b.reads==reads);
 {Scan x;Bus f;f.writeOk=false;assert(!x.tick(f,0,uid,length));assert(x.error()==Scan::Error::Write);}
 {Scan x;Bus f;x.tick(f,0xfffffff0u,uid,length);f.ack();assert(!x.tick(f,20,uid,length));assert(x.phase()==Scan::Phase::Target);}
 {Scan x;Bus f;x.tick(f,0,uid,length);f.replies.push_back({2});x.tick(f,1,uid,length);assert(x.error()==Scan::Error::Status);}
 {Scan x;Bus f;x.tick(f,0,uid,length);f.replies.push_back({});x.tick(f,1,uid,length);assert(x.error()==Scan::Error::Status);}
 {Scan x;Bus f;x.tick(f,0,uid,length);f.ack();f.replies.back()[3]=0;x.tick(f,1,uid,length);assert(x.error()==Scan::Error::AckFrame);}
 {Scan x;Bus f;x.tick(f,0,uid,length);f.replies.push_back({1});f.replies.push_back({});x.tick(f,1,uid,length);assert(x.error()==Scan::Error::Read);}
 {Scan x;Bus f;x.tick(f,0,uid,length);f.ack();x.tick(f,1,uid,length);f.target();f.replies.back()[18]^=1;x.tick(f,2,uid,length);assert(x.error()==Scan::Error::UidFrame&&length==0);}
 {Scan x;Bus f;x.tick(f,0,uid,length);f.ack();x.tick(f,1,uid,length);f.target();assert(x.tick(f,0xfffffff0u,uid,length));assert(!x.needsBus(20));assert(x.needsBus(200));}
 std::cout<<"PN532 split search: pending/no resend, deadlines, wrap, cooldown, faults PASS\n";
}
