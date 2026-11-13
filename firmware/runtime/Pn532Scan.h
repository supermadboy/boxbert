#pragma once
#include "Pn532UidFrame.h"
namespace boxbert::runtime {
// Split InListPassiveTarget into bounded I2C transactions. No sleeping or
// tag wait inside tick(); caller owns bus mutex only for the duration of tick.
// Bus::write/read must return true only for a complete transfer. On faults,
// never resend an ambiguous pending command automatically.
class Pn532Scan {
 public:
 enum class Phase {Send,Ack,Target,Cooldown,Fault};
 enum class Error {None,Write,Status,Read,AckFrame,UidFrame,AckTimeout};
 private:
 Phase state=Phase::Send;Error failure=Error::None;uint32_t since=0;
 bool fail(Error e){failure=e;state=Phase::Fault;return false;}
 public:
 Phase phase()const{return state;}
 Error error()const{return failure;}
 bool idle()const{return state==Phase::Send||state==Phase::Cooldown;}
 bool needsBus(uint32_t now)const{return state!=Phase::Fault&&(state!=Phase::Cooldown||uint32_t(now-since)>=200);}
 template<class Bus> bool tick(Bus& bus,uint32_t now,uint8_t* uid,uint8_t& length){
  length=0;
  if(!needsBus(now))return false;
  if(state==Phase::Cooldown)state=Phase::Send;
  if(state==Phase::Send){
   // Adafruit PN532 1.3.4 I2C writecommand framing: D4 4A 01 00.
   static constexpr uint8_t search[]={0,0,0xff,4,0xfc,0xd4,0x4a,1,0,0xe1,0};
   if(!bus.write(search,sizeof(search)))return fail(Error::Write);
   state=Phase::Ack;since=now;return false;
  }
  if(state==Phase::Ack&&uint32_t(now-since)>=1000)return fail(Error::AckTimeout);
  uint8_t ready=0;
  if(!bus.read(&ready,1)||ready>1)return fail(Error::Status);
  if(!ready)return false; // Wait for chip/card OUTSIDE bus ownership.
  if(state==Phase::Ack){
   uint8_t ack[7];static constexpr uint8_t expected[]={1,0,0,0xff,0,0xff,0};
   if(!bus.read(ack,sizeof(ack)))return fail(Error::Read);
   for(size_t i=0;i<sizeof(ack);i++)if(ack[i]!=expected[i])return fail(Error::AckFrame);
   state=Phase::Target;return false;
  }
  uint8_t frame[64];
  if(!bus.read(frame,sizeof(frame)))return fail(Error::Read);
  if(!pn532UidFrame(frame,sizeof(frame),uid,length))return fail(Error::UidFrame);
  state=Phase::Cooldown;since=now;return true;
 }
};
}
