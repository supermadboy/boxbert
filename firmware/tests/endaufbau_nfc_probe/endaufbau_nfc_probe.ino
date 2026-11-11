// Read-only PN532 initialization probe, end-build 2026-11-11.
// Confirmed by user: I2C SDA3/SCL4, 3V3/GND, DIP1 ON/2 OFF, IRQ12.
// Based on Adafruit PN532 1.3.4 readMifare/readMifareClassicIrq and
// unchanged firmware/tests/etappe4_nfc_i2c. No tag search, no audio/SD writes.
#include <Arduino.h>
#include <Wire.h>
#include <Adafruit_PN532.h>
constexpr uint8_t Sda=3,Scl=4,Irq=12;
// Reset not connected. Library stores 255 as signed -1 and skips reset().
// Its constructor still calls pinMode(255,...); Core rejects this invalid pin.
Adafruit_PN532 nfc(Irq,255,&Wire);
bool wireReady=false,started=false,sam=false;
uint32_t version=0;
void status(){
 Serial.printf("NFC-PROBE init-only wire=%d begin=%d version=0x%08lX SAM=%d IRQ12=%d heap=%u (boot query; no tag search)\n",wireReady,started,(unsigned long)version,sam,digitalRead(Irq),ESP.getFreeHeap());
}
void setup(){
 Serial.begin(115200);
 pinMode(TFT_BACKLITE,OUTPUT);digitalWrite(TFT_BACKLITE,LOW);
 pinMode(Irq,INPUT); // PN532 output; no pull-up or output drive from Feather.
 delay(2000);
 Serial.println("Boxbert NFC-PROBE v1: init only, no tag search; IRQ12 input");
 wireReady=Wire.begin(Sda,Scl);
 Wire.setClock(100000);Wire.setTimeOut(300);
 if(wireReady){started=nfc.begin();delay(100);if(started)version=nfc.getFirmwareVersion();if(version)sam=nfc.SAMConfig();}
 status();
}
void loop(){
 static uint32_t at=0;
 if(uint32_t(millis()-at)>=3000){at=millis();status();}
 delay(10);
}
