// Boxbert integrated V1. References under firmware/tests are intentionally unchanged.
#include "Transport.h"
using namespace boxbert::integrated;
Hardware hardware;
ConfigStore config;
Rpc rpc(hardware,config);
Transport transport(rpc);
int requestedVolume=6;
bool volumePending=false;
uint32_t volumeChanged=0;
uint32_t seenVolumeRevision=0;

void changeVolume(int step){
 if(rpc.progress.active)return;
 requestedVolume=constrain(requestedVolume+step,0,21);hardware.audio.setVolume(requestedVolume);volumePending=true;volumeChanged=millis();hardware.activity=millis();
}
void playTag(int index){
 if(rpc.progress.active)return;
 hardware.stop();String song=config.data["tags"][index]["path"].as<String>(),intro=config.data["tags"][index]["introPath"].as<String>();
 if(!hardware.start(song,intro,TagUids[index])){hardware.playback=5;Serial.printf("Tag start failed: %s\n",TagUids[index]);}
}
void encoderPressed(){
 switch(playPauseAction(hardware.paused,hardware.playback==2,!hardware.path.isEmpty(),rpc.progress.active)){
  case PlayerAction::Pause:hardware.pause();break;
  case PlayerAction::Resume:hardware.resume();break;
  case PlayerAction::Restart:{String song=hardware.path;hardware.start(song);break;}
  case PlayerAction::None:break;
 }
}
void buttonPressed(int id){
 if(rpc.progress.active)return;
 String assigned=config.data["buttons"][id-1]["path"].as<String>();
 if(!assigned.isEmpty()){if(!hardware.start(assigned))Serial.println("Button media start failed");return;}
 // Ten media assignments override these conservative, explicit defaults.
 switch(id){
  case 1:encoderPressed();break;
  case 2:hardware.stop();break;
  case 3:changeVolume(-1);break;
  case 4:changeVolume(1);break;
  case 9:playTag(0);break;
  case 10:playTag(1);break;
  default:break; // 24-mm buttons remain activity-only until assigned.
 }
}
void setup(){
 Serial.begin(115200);
 hardware.begin();
 if(hardware.sd){if(!config.begin())Serial.println("Configuration unavailable/corrupt; mutations disabled");}else{config.defaults();Serial.println("No SD; RPC returns SD errors");}
 requestedVolume=config.data["volume"];hardware.audio.setVolume(requestedVolume);transport.begin();
}
void loop(){
 const uint32_t now=millis();hardware.tickAudio();rpc.tick(now);
 transport.tick(now);hardware.tickAudio();hardware.i2cTick(now);
 // RPC executes on this loop: accept its committed volume before processing new input.
 if(seenVolumeRevision!=rpc.volumeRevision){seenVolumeRevision=rpc.volumeRevision;volumePending=false;requestedVolume=config.data["volume"];}
 hardware.inputs(now,buttonPressed,encoderPressed,[]{transport.nextRadio();},changeVolume);
 Hardware::TagEvent event;
 if(hardware.tags&&xQueueReceive(hardware.tags,&event,0)==pdTRUE){hardware.activity=now;for(int i=0;i<2;i++)if(!strcmp(event.uid,TagUids[i]))playTag(i);}
 if(!volumePending)requestedVolume=config.data["volume"];
 if(volumePending&&uint32_t(now-volumeChanged)>=750&&!rpc.progress.active){
  JsonDocument next;next.set(config.data);next["volume"]=requestedVolume;
  if(!config.save(next)){Serial.println("Encoder volume persistence failed; reverting to saved setting");requestedVolume=config.data["volume"];hardware.audio.setVolume(requestedVolume);}volumePending=false;
 }
 static uint32_t ledAt=0,drawAt=0;
 if(uint32_t(now-ledAt)>=40){ledAt=now;hardware.pixels(config.data,now);}
 if(uint32_t(now-drawAt)>=200){drawAt=now;int wifi=rpc.radio!=boxbert::runtime::Radio::Wifi?0:WiFi.getMode()==WIFI_AP||WiFi.status()==WL_CONNECTED?2:1;hardware.draw(config.data,rpc.radio,wifi,now);}
 if(boxbert::runtime::shouldSleep(millis(),hardware.activity,hardware.playback==2,rpc.progress.active,hardware.held)&&!volumePending){
  const auto previousRadio=rpc.radio;transport.off();
  if(!hardware.sleep()){transport.setRadio(previousRadio);hardware.activity=millis();}
 }
 delay(1);
}
