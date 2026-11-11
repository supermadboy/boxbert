// End-build 2026-11-11: ONE PN532 target search and IRQ observation.
// Confirmed wiring: hardware/pinout.md, SDA3/SCL4,3V3/GND,DIP1ON/2OFF,IRQ12.
// No audio, SD writes, automatic retries, or tag writes. Separate from init probe.
// Adafruit PN532 1.3.4 readMifareClassicIrq + actual sendCommandCheckAck semantics:
// startPassiveTargetIDDetection waits up to its default timeout for target ready.
// A false return is NOT proof no command was sent: never resubmit on timeout.
#include <Arduino.h>
#include <Wire.h>
#include <Adafruit_PN532.h>
constexpr uint8_t Sda=3,Scl=4,Irq=12;
Adafruit_PN532 nfc(Irq,255,&Wire); // no real reset GPIO; 255 stored as signed -1
bool initialized=false,issued=false,readyReturn=false,consumed=false,uidOk=false;
int irqBefore=-1,irqReady=-1,irqAfter=-1;
char uidText[24]="";
volatile uint32_t irqLowEdges=0,irqHighEdges=0;
void ARDUINO_ISR_ATTR irqEdge(){
 if(digitalRead(Irq)==LOW)irqLowEdges=irqLowEdges+1;
 else irqHighEdges=irqHighEdges+1;
}
void status(){
 Serial.printf("NFC-UID once initialized=%d issued=%d readyReturn=%d consumed=%d uidOk=%d UID='%s' IRQ12=%d before=%d ready=%d after=%d (cached result)\n",initialized,issued,readyReturn,consumed,uidOk,uidText,digitalRead(Irq),irqBefore,irqReady,irqAfter);
 Serial.printf("NFC-UID IRQ edges during search/read: LOW=%lu HIGH=%lu\n",(unsigned long)irqLowEdges,(unsigned long)irqHighEdges);
}
void setup(){
 Serial.begin(115200);
 pinMode(TFT_BACKLITE,OUTPUT);digitalWrite(TFT_BACKLITE,LOW);
 pinMode(Irq,INPUT);
 delay(2000);
 Serial.println("Boxbert NFC-UID v2: one search, IRQ edge observer; no audio or automatic retries");
 if(!Wire.begin(Sda,Scl)){Serial.println("NFC-UID Wire failed");return;}
 Wire.setClock(100000);Wire.setTimeOut(300);
 if(!nfc.begin()){Serial.println("NFC-UID begin failed");return;}
 delay(100);
 uint32_t version=nfc.getFirmwareVersion();
 initialized=version&&nfc.SAMConfig();
 Serial.printf("NFC-UID version=0x%08lX init=%d\n",(unsigned long)version,initialized);
 if(!initialized)return;
 irqBefore=digitalRead(Irq);
 attachInterrupt(digitalPinToInterrupt(Irq),irqEdge,CHANGE);
 issued=true;
 readyReturn=nfc.startPassiveTargetIDDetection(PN532_MIFARE_ISO14443A);
 Serial.printf("NFC-UID search issued ONCE readyReturn=%d IRQ12=%d; no retransmission\n",readyReturn,digitalRead(Irq));
}
void loop(){
 // The library already polls I2C RDY. A true return authorizes reading even
 // if that transaction has deasserted IRQ; do not require a second LOW.
 if(issued&&!consumed&&(readyReturn||digitalRead(Irq)==LOW)){
  irqReady=digitalRead(Irq);
  consumed=true;
  // Library copies its reported uint8_t UID length before returning; reserve
  // full length range, then accept only its supported 4/7-byte UIDs for output.
  uint8_t uid[255]={},length=0;
  bool ok=nfc.readDetectedPassiveTargetID(uid,&length);
  irqAfter=digitalRead(Irq);
  uidOk=ok&&(length==4||length==7);
  if(uidOk)for(uint8_t i=0;i<length;i++)snprintf(uidText+i*3,sizeof(uidText)-i*3,i+1==length?"%02X":"%02X:",uid[i]);
  Serial.printf("NFC-UID result libraryOk=%d length=%u accepted=%d UID='%s' IRQ12 ready=%d after=%d\n",ok,unsigned(length),uidOk,uidText,irqReady,irqAfter);
  status();
 }
 static uint32_t at=0;
 if(uint32_t(millis()-at)>=3000){at=millis();status();}
 delay(10);
}
