// Endaufbau input mapping, 2026-11-11. NOT the integrated player.
// Pins checked against hardware/pinout.md and local Core 3.3.12 variant.
// No SPI/I2S, SD writes, radio, pixel data or boost output. I2C is the
// only external driven bus (confirmed SDA=3/SCL=4). Core enables rails 7/21.
#include <Arduino.h>
#include <Wire.h>

constexpr uint8_t inputs[]={5,6,8,10,11,12,13,14,15,16,17,18,35,36,37,38,39};
constexpr size_t count=sizeof(inputs)/sizeof(inputs[0]);
bool stable[count],candidate[count];
uint32_t changed[count]={};
uint8_t aw=0;
uint16_t awStable=0xffff,awCandidate=0xffff;
uint32_t awChanged[16]={};
uint32_t errors=0;

bool regRead(uint8_t address,uint8_t reg,uint8_t &value){
 Wire.beginTransmission(address);Wire.write(reg);
 if(Wire.endTransmission(false)!=0||Wire.requestFrom(address,uint8_t(1))!=1)return false;
 value=Wire.read();return true;
}
bool regWrite(uint8_t address,uint8_t reg,uint8_t value){
 Wire.beginTransmission(address);Wire.write(reg);Wire.write(value);return Wire.endTransmission()==0;
}
bool awRead(uint16_t &value){
 uint8_t lo,hi;if(!regRead(aw,0x00,lo)||!regRead(aw,0x01,hi))return false;
 value=lo|(uint16_t(hi)<<8);return true;
}
void snapshot(){
 Serial.printf("[STATUS %lu] INPUT-DIAG v1 GPIO",(unsigned long)millis());
 for(size_t i=0;i<count;i++)Serial.printf(" %u=%d",inputs[i],stable[i]);
 Serial.printf(" IO9(passive)=%d AW=0x%02X bits=0x%04X errors=%lu\n",digitalRead(9),aw,awStable,(unsigned long)errors);
}
void setup(){
 Serial.begin(115200);
 // Keep TFT dark: no SPI clocks on potentially miswired signal leads.
 pinMode(TFT_BACKLITE,OUTPUT);digitalWrite(TFT_BACKLITE,LOW);
 pinMode(9,INPUT); // Boost EN: do not actively drive or add a pull-up.
 for(auto p:inputs)pinMode(p,INPUT_PULLUP);
 delay(100);
 for(size_t i=0;i<count;i++)stable[i]=candidate[i]=digitalRead(inputs[i]);
 uint32_t start=millis();while(!Serial&&millis()-start<2000)delay(10);
 Serial.println("Boxbert INPUT-DIAG v1; no SD/audio/pixel/boost outputs; TFT dark intentionally");
 Wire.begin(3,4);Wire.setClock(100000);Wire.setTimeOut(50);
 for(uint8_t address=0x58;address<=0x5b;address++){
  uint8_t id=0;if(!regRead(address,0x10,id))continue;
  Serial.printf("AW candidate 0x%02X ID=0x%02X\n",address,id);
  if(id!=0x23||aw)continue;
  // CONFIG first: inputs, then GPIO mode. Never write output or reset regs.
  bool ok=regWrite(address,0x04,0xff)&&regWrite(address,0x05,0xff)&&regWrite(address,0x12,0xff)&&regWrite(address,0x13,0xff);
  for(uint8_t reg:{0x04,0x05,0x12,0x13}){uint8_t v=0;ok=regRead(address,reg,v)&&v==0xff&&ok;}
  if(ok){aw=address;if(!awRead(awStable)){errors++;aw=0;}awCandidate=awStable;}
 }
 Serial.printf("AW input configuration verified: %s\n",aw?"YES":"NO (not detected/configured)");
 snapshot();
}
void loop(){
 uint32_t now=millis();
 for(size_t i=0;i<count;i++){
  bool value=digitalRead(inputs[i]);
  if(value!=candidate[i]){candidate[i]=value;changed[i]=now;}
  if(value!=stable[i]&&uint32_t(now-changed[i])>=3){stable[i]=value;Serial.printf("[%lu] GPIO %u -> %s\n",(unsigned long)now,inputs[i],value?"HIGH/released":"LOW/active");}
 }
 static uint32_t poll=0,beat=0;
 if(aw&&uint32_t(now-poll)>=5){
  poll=now;uint16_t value;
  if(!awRead(value)){errors++;}else for(uint8_t bit=0;bit<16;bit++){
   uint16_t mask=1u<<bit;
   if((value&mask)!=(awCandidate&mask)){awCandidate^=mask;awChanged[bit]=now;}
   if((value&mask)!=(awStable&mask)&&uint32_t(now-awChanged[bit])>=15){awStable^=mask;Serial.printf("[%lu] AW P%u%u -> %s\n",(unsigned long)now,bit/8,bit%8,(value&mask)?"HIGH/released":"LOW/active");}
  }
 }
 if(uint32_t(now-beat)>=5000){beat=now;snapshot();}
 delay(1);
}
