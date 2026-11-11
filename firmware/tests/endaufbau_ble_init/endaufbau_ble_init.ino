// Isolated NimBLE init test. No SD/audio/external GPIO output.
// 'b' starts init once; after a reset it waits again instead of reboot-looping.
#include <Arduino.h>
#include <NimBLEDevice.h>
#include <esp_system.h>
bool attempted=false,initialized=false,advertising=false;
void setup(){
 Serial.begin(115200);pinMode(TFT_BACKLITE,OUTPUT);digitalWrite(TFT_BACKLITE,LOW);
 pinMode(9,INPUT);
}
void loop(){
 int command=Serial.available()?Serial.read():-1;
 if(command=='d'&&initialized){
  Serial.println("BLE-DEINIT before");Serial.flush();delay(100);
  bool ok=NimBLEDevice::deinit(true);
  Serial.printf("BLE-DEINIT returned=%d\n",ok);
  if(ok){initialized=advertising=attempted=false;}
 }
 if(!attempted&&command=='b'){
  attempted=true;Serial.println("BLE-INIT before NimBLEDevice::init");Serial.flush();delay(100);
  initialized=NimBLEDevice::init("Boxbert-Diagnose");
  Serial.printf("BLE-INIT returned=%d\n",initialized);Serial.flush();
  if(initialized){NimBLEDevice::createServer();auto ad=NimBLEDevice::getAdvertising();ad->setName("Boxbert-Diagnose");ad->enableScanResponse(true);advertising=ad->start();Serial.printf("BLE advertising=%d\n",advertising);}
 }
 static uint32_t last=0;
 if(millis()-last>=2000){last=millis();Serial.printf("BLE-DIAG attempted=%d initialized=%d advertising=%d resetReason=%u heap=%u\n",attempted,initialized,advertising,unsigned(esp_reset_reason()),ESP.getFreeHeap());}
 delay(10);
}
