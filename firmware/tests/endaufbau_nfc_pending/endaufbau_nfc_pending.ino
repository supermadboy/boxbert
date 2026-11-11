// Recovery probe: read an EXISTING PN532 response exactly once, no commands.
// The preceding UID probe reported readyReturn=1 but IRQ12 remained HIGH.
// Feather reset/upload is NOT a PN532 power cycle: preserve/read that response.
// No PN532 begin/SAM/search, no audio, SD writes or tag writes.
#include <Arduino.h>
#include <Wire.h>
#include "../../runtime/Pn532UidFrame.h"
constexpr uint8_t Sda=3,Scl=4,Irq=12,Address=0x24;
uint8_t frame[64]={},uid[7]={},uidLength=0;
size_t received=0;bool wireReady=false,valid=false;
int irqBefore=-1,irqAfter=-1;
char uidText[24]="";
void status(){
 Serial.printf("NFC-PENDING cached wire=%d bytes=%u valid=%d length=%u UID='%s' IRQ12 before=%d after=%d now=%d\n",wireReady,unsigned(received),valid,unsigned(uidLength),uidText,irqBefore,irqAfter,digitalRead(Irq));
}
void setup(){
 Serial.begin(115200);
 pinMode(TFT_BACKLITE,OUTPUT);digitalWrite(TFT_BACKLITE,LOW);pinMode(Irq,INPUT);
 delay(2000);
 Serial.println("NFC-PENDING v1: one raw I2C response read; no search/init commands");
 wireReady=Wire.begin(Sda,Scl);Wire.setClock(100000);Wire.setTimeOut(300);
 if(!wireReady)return;
 irqBefore=digitalRead(Irq);
 Wire.requestFrom(Address,uint8_t(sizeof(frame)));
 while(Wire.available()&&received<sizeof(frame))frame[received++]=Wire.read();
 irqAfter=digitalRead(Irq);
 Serial.print("NFC-PENDING frame:");for(size_t i=0;i<received;i++)Serial.printf(" %02X",frame[i]);Serial.println();
 valid=boxbert::runtime::pn532UidFrame(frame,received,uid,uidLength);
 if(valid)for(uint8_t i=0;i<uidLength;i++)snprintf(uidText+i*3,sizeof(uidText)-i*3,i+1==uidLength?"%02X":"%02X:",uid[i]);
 status();
}
void loop(){
 static uint32_t at=0;
 if(uint32_t(millis()-at)>=3000){at=millis();status();}
 delay(10);
}
