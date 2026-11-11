// Endaufbau SD read-only diagnostic, 2026-11-11.
// Planned pins from hardware/pinout.md, local Core 3.3.12 variant checked.
// User reports 5 V at SD VCC. No boost output, audio, NFC or pixel data.
#include <Arduino.h>
#include <SPI.h>
#include <SD.h>
constexpr uint8_t SdCs=8,SdSck=36,SdMosi=35,SdMiso=37;
bool mounted=false,rootOk=false;
uint32_t entries=0,readOk=0,readFail=0;
uint64_t capacity=0;
void status(){Serial.printf("[STATUS %lu] SD-DIAG v3 mounted=%d root=%d entries=%lu readOK=%lu readFAIL=%lu capacityMiB=%llu IO9(passive)=%d\n",(unsigned long)millis(),mounted,rootOk,(unsigned long)entries,(unsigned long)readOk,(unsigned long)readFail,(unsigned long long)(capacity/1024/1024),digitalRead(9));}
void setup(){
 Serial.begin(115200);
 pinMode(9,INPUT);
 pinMode(TFT_BACKLITE,OUTPUT);digitalWrite(TFT_BACKLITE,LOW);
 // Deselect the known onboard SPI display; do not initialize its renderer.
 pinMode(TFT_CS,OUTPUT);digitalWrite(TFT_CS,HIGH);
 pinMode(SdCs,OUTPUT);digitalWrite(SdCs,HIGH);
 uint32_t start=millis();while(!Serial&&millis()-start<2000)delay(10);
 Serial.println("Boxbert SD-DIAG v3: CS8 SCK36 MOSI35 MISO37; 4MHz; read only");
 SPI.begin(SdSck,SdMiso,SdMosi,SdCs);
 mounted=SD.begin(SdCs,SPI,4000000)&&SD.cardType()!=CARD_NONE;
 if(mounted){
  capacity=SD.cardSize();File root=SD.open("/",FILE_READ);rootOk=root&&root.isDirectory();
  if(rootOk){
   for(;;){File entry=root.openNextFile(FILE_READ);if(!entry)break;
    entries++;Serial.printf("ENTRY %s %s bytes=%llu\n",entry.isDirectory()?"DIR":"FILE",entry.name(),(unsigned long long)entry.size());
    if(!entry.isDirectory()&&entry.size()>0){uint8_t buffer[512];size_t wanted=entry.size()<sizeof(buffer)?entry.size():sizeof(buffer);int got=entry.read(buffer,wanted);if(got==int(wanted))readOk++;else readFail++;}
    entry.close();if(entries>=32){Serial.println("Listing capped at 32 entries (not a full-card check)");break;}
   }
  }
  root.close();
 }
 status();
}
void loop() {
 static uint32_t last=0;
 if(millis()-last>=5000){last=millis();status();}
 delay(10);
}
