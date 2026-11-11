// Endaufbau audio diagnostic 2026-11-11. Reference sketches unchanged.
// SD verified CS8/SCK36/MOSI35/MISO37 at 4 MHz; I2S user checked DIN16/BCLK17/LRC18.
// Library API checked against installed audioI2S 4.0.0 examples/I2Saudio_SD.
// User-confirmed encoder switch IO5. Volume 1/21, manual start, max 20 s.
#include <Arduino.h>
#include <Audio.h>
#include <SPI.h>
#include <SD.h>
Audio audio;
String song;
bool sdReady=false,audioReady=false,active=false;
uint32_t started=0;
constexpr uint8_t Volume=1;
void status(){
 Serial.printf("[STATUS %lu] AUDIO-DIAG v1 SD=%d PSRAM=%d I2S=%d active=%d running=%d time=%lu volume=%u file=%s\n",(unsigned long)millis(),sdReady,psramFound(),audioReady,active,audio.isRunning(),(unsigned long)audio.getAudioCurrentTime(),Volume,song.c_str());
}
void audioInfo(Audio::msg_t m){
 if(m.e==Audio::evt_vu||m.e==Audio::evt_spectrum)return;
 Serial.printf("[audio] %s: %s\n",m.s?m.s:"?",m.msg?m.msg:"");
}
void setup(){
 Serial.begin(115200);
 pinMode(9,INPUT); // no active boost-EN control
 pinMode(5,INPUT_PULLUP);
 pinMode(TFT_BACKLITE,OUTPUT);digitalWrite(TFT_BACKLITE,LOW);
 pinMode(TFT_CS,OUTPUT);digitalWrite(TFT_CS,HIGH);
 pinMode(8,OUTPUT);digitalWrite(8,HIGH);
 uint32_t wait=millis();while(!Serial&&millis()-wait<2000)delay(10);
 Serial.println("Boxbert AUDIO-DIAG v1; encoder press starts/stops; volume 1/21; max 20s");
 SPI.begin(36,37,35,8);
 sdReady=SD.begin(8,SPI,4000000)&&SD.cardType()!=CARD_NONE;
 if(sdReady){
  File root=SD.open("/",FILE_READ);
  if(root&&root.isDirectory()){
   for(;;){File f=root.openNextFile(FILE_READ);if(!f)break;
    String name=f.name(),lower=name;lower.toLowerCase();
    bool match=!f.isDirectory()&&f.size()>0&&lower.endsWith(".mp3");
    if(match){song=name.startsWith("/")?name:"/"+name;f.close();break;}f.close();
   }
  }
  root.close();
 }
 Audio::audio_info_callback=audioInfo;
 audioReady=psramFound()&&audio.setPinout(17,18,16);
 audio.setVolume(Volume);
 status();
}
void loop(){
 if(audioReady)audio.loop();
 uint32_t now=millis();
 static bool candidate=true,stable=true;
 static uint32_t changed=0,lastStatus=0;
 bool value=digitalRead(5);
 if(value!=candidate){candidate=value;changed=now;}
 if(value!=stable&&uint32_t(now-changed)>=30){
  stable=value;
  if(!value){
   if(active){audio.stopSong();active=false;Serial.println("Manual STOP");}
   else if(sdReady&&audioReady&&!song.isEmpty()){
    audio.setVolume(Volume);active=audio.connecttoFS(SD,song.c_str());started=millis();
    Serial.printf("Manual START connect=%d volume=%u file=%s\n",active,Volume,song.c_str());
   }else Serial.println("Not ready: SD/I2S/MP3 missing");
  }
 }
 if(active&&uint32_t(millis()-started)>=20000){audio.stopSong();active=false;Serial.println("20-second limit: STOP");}
 if(uint32_t(now-lastStatus)>=5000){lastStatus=now;status();}
 delay(1);
}
