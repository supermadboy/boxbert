#pragma once
#include <Arduino.h>
#include <Audio.h>
#include <Wire.h>
#include <SPI.h>
#include <Adafruit_PN532.h>
#include <Adafruit_MAX1704X.h>
#include <Adafruit_ST7789.h>
#include <Adafruit_NeoPixel.h>
#include <atomic>
#include <esp_sleep.h>
#include <driver/gpio.h>
#include <driver/rtc_io.h>
#include "Config.h"
#include "Storage.h"
#include "src/runtime/LedFrame.h"
#include "src/runtime/Quadrature.h"
#include "src/ui/TftRenderer.h"
#include "TftAsset.h"
namespace boxbert::integrated {
class Hardware {
 public:
 Audio audio;Adafruit_PN532 nfc{255,254,&Wire};Adafruit_MAX17048 gauge;
 Adafruit_ST7789 tft{&SPI,TFT_CS,TFT_DC,TFT_RST};
 Adafruit_NeoPixel stick{8,pins::Stick,NEO_GRB+NEO_KHZ800},board{1,pins::BoardPixel,NEO_GRB+NEO_KHZ800};
 SemaphoreHandle_t wireMutex=nullptr;QueueHandle_t tags=nullptr;TaskHandle_t nfcHandle=nullptr;
 struct TagEvent {char uid[24];};
 bool sd=false,audioReady=false,gaugePresent=false,awPresent=false,held=false;
 float percent=NAN,voltage=NAN,rate=NAN;uint32_t gaugeAt=0,activity=0;
 int playback=1;String path,tagUid;bool paused=false;IntroChain chain;std::atomic<bool> eof{false};
 runtime::Debouncer buttons[10],minis[3],encoderSwitch,radioSwitch,toggle;
 uint16_t awInputs=0xffff;uint32_t awAt=0;
 portMUX_TYPE encoderMux=portMUX_INITIALIZER_UNLOCKED;
 volatile uint8_t encoderState=3;volatile int encoderEdges=0;
 static void encoderEdge(void* arg);
 bool writeAw(uint8_t reg,uint8_t value){Wire.beginTransmission(0x58);Wire.write(reg);Wire.write(value);return Wire.endTransmission()==0;}
 bool readAw(uint16_t& v){Wire.beginTransmission(0x58);Wire.write(0);if(Wire.endTransmission(false))return false;if(Wire.requestFrom(uint8_t(0x58),uint8_t(2))!=2)return false;v=Wire.read();v|=Wire.read()<<8;return true;}
 // V1 semantics (docs/entscheidungen.md): removal does not clear the last UID;
 // the same UID requires an intervening different UID, never an automatic EOF loop.
 static void nfcTask(void* arg){auto& h=*(Hardware*)arg;char last[24]="";
  for(;;){uint8_t uid[7],length=0;bool ok=false;
   if(xSemaphoreTake(h.wireMutex,pdMS_TO_TICKS(500))==pdTRUE){ok=h.nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A,uid,&length,250);xSemaphoreGive(h.wireMutex);}
   if(ok&&length>0&&length<=7){TagEvent event{};for(int i=0;i<length;i++)sprintf(event.uid+i*3,i==length-1?"%02X":"%02X:",uid[i]);
    if(strcmp(last,event.uid)){strcpy(last,event.uid);xQueueOverwrite(h.tags,&event);}}
   vTaskDelay(pdMS_TO_TICKS(ok?200:10));
  }
 }
 void begin(){
  activity=millis();gpio_deep_sleep_hold_dis();
  for(auto pin:{pins::WakeOne,pins::WakeTwo}){rtc_gpio_hold_dis((gpio_num_t)pin);rtc_gpio_deinit((gpio_num_t)pin);}
  gpio_hold_dis((gpio_num_t)pins::BoostEn);gpio_hold_dis((gpio_num_t)pins::Stick);
  if(commissioning::BoostControl){pinMode(pins::BoostEn,OUTPUT);digitalWrite(pins::BoostEn,HIGH);}else pinMode(pins::BoostEn,INPUT);
  pinMode(pins::BoardPixelPower,OUTPUT);digitalWrite(pins::BoardPixelPower,HIGH);
  if(commissioning::Stick){stick.begin();stick.clear();stick.show();}
  board.begin();board.clear();board.show();
  pinMode(TFT_CS,OUTPUT);digitalWrite(TFT_CS,HIGH);pinMode(pins::SdCs,OUTPUT);digitalWrite(pins::SdCs,HIGH);
  pinMode(TFT_BACKLITE,OUTPUT);digitalWrite(TFT_BACKLITE,HIGH);
  SPI.begin(pins::SdSck,pins::SdMiso,pins::SdMosi,pins::SdCs);tft.init(135,240);tft.setRotation(1);tft.fillScreen(ST77XX_BLACK);
  tft_set_asset(BoxbertTftAsset,sizeof(BoxbertTftAsset));
  sd=SD.begin(pins::SdCs,SPI,4000000)&&SD.cardType()!=CARD_NONE;
  audioReady=psramFound()&&audio.setPinout(pins::AudioBclk,pins::AudioLrc,pins::AudioData);
  Audio::audio_info_callback=[this](Audio::msg_t m){
   if(m.e==Audio::evt_eof)eof.store(true);
   if(commissioning::UsbDiagnostics&&(m.e==Audio::evt_info||m.e==Audio::evt_log||m.e==Audio::evt_eof))Serial.printf("[audio] %s: %s\n",m.s?m.s:"?",m.msg?m.msg:"");
  };audio.setVolume(commissioning::BootVolume);
  for(auto pin:pins::ButtonGpio)if(pin!=255)pinMode(pin,INPUT_PULLUP); // IO13 intentionally input, onboard LED follows contact.
  for(auto pin:{pins::EncoderA,pins::EncoderB,pins::EncoderSwitch,pins::RadioButton,pins::ToggleTwo})pinMode(pin,INPUT_PULLUP);
  encoderState=(digitalRead(pins::EncoderA)<<1)|digitalRead(pins::EncoderB);
  attachInterruptArg(digitalPinToInterrupt(pins::EncoderA),encoderEdge,this,CHANGE);
  attachInterruptArg(digitalPinToInterrupt(pins::EncoderB),encoderEdge,this,CHANGE);
  wireMutex=xSemaphoreCreateMutex();tags=xQueueCreate(1,sizeof(TagEvent));
  if(wireMutex&&tags&&Wire.begin(pins::Sda,pins::Scl)){
   Wire.setClock(100000);Wire.setTimeOut(300);
   xSemaphoreTake(wireMutex,portMAX_DELAY);
   gaugePresent=gauge.begin();awPresent=writeAw(0x04,0xff)&&writeAw(0x05,0xff)&&writeAw(0x12,0xff)&&writeAw(0x13,0xff); // all GPIO inputs, external pullups
   bool nfcOk=commissioning::Nfc&&nfc.begin()&&nfc.getFirmwareVersion()&&nfc.SAMConfig();xSemaphoreGive(wireMutex);
   if(nfcOk&&xTaskCreate(nfcTask,"BoxbertNFC",4096,this,1,&nfcHandle)!=pdPASS)Serial.println("NFC task failed");
   if(!nfcOk)Serial.println(commissioning::Nfc?"PN532 unavailable":"PN532 disabled for commissioning");
  }
  Serial.printf("SD=%d Audio/PSRAM=%d Gauge=%d AW9523=%d\n",sd,audioReady,gaugePresent,awPresent);
 }
 bool exists(const char* p){if(!sd||!mediaPath(p))return false;File f=SD.open(p);bool ok=f&&!f.isDirectory()&&f.size()>0;f.close();return ok;}
 void stop(){chain.stop();audio.stopSong();eof.store(false);paused=false;playback=1;path="";tagUid="";activity=millis();}
 bool start(const String& song,const String& intro="",const String& uid=""){
  if(commissioning::UsbDiagnostics)Serial.printf("START requested song='%s' intro='%s' I2S=%d SD=%d heap=%u psram=%u\n",song.c_str(),intro.c_str(),audioReady,sd,ESP.getFreeHeap(),ESP.getFreePsram());
  if(!audioReady){Serial.println("START rejected: audio not ready");return false;}
  if(!exists(song.c_str())){Serial.println("START rejected: song absent/empty/invalid");return false;}
  if(!intro.isEmpty()&&!exists(intro.c_str())){Serial.println("START rejected: intro absent/empty/invalid");return false;}
  stop();chain.start(song.c_str(),intro.c_str());path=intro.isEmpty()?song:intro;tagUid=uid;
  if(!audio.connecttoFS(SD,path.c_str())){Serial.printf("START connecttoFS failed path='%s'\n",path.c_str());chain.stop();playback=5;return false;}playback=2;return true;
 }
 bool pause(){if(paused)return true;if(playback!=2||!audio.isRunning()||!audio.pauseResume())return false;paused=true;playback=3;activity=millis();return true;}
 bool resume(){if(playback==2&&!paused)return true;if(!paused||!audio.pauseResume())return false;paused=false;playback=2;activity=millis();return true;}
 void tickAudio(){if(audioReady)audio.loop();if(eof.exchange(false)){
   String next=chain.eof().c_str();paused=false;
   if(!next.isEmpty()){path=next;playback=audio.connecttoFS(SD,next.c_str())?2:5;}else playback=4;
   activity=millis();
  }
 }
 void i2cTick(uint32_t now){
  if(!wireMutex||xSemaphoreTake(wireMutex,0)!=pdTRUE)return;
  if(awPresent&&uint32_t(now-awAt)>=10){uint16_t v;if(readAw(v)){awInputs=v;awAt=now;}}
  if(gaugePresent&&uint32_t(now-gaugeAt)>=2000){voltage=gauge.cellVoltage();percent=gauge.cellPercent();rate=gauge.chargeRate();gaugeAt=now;if(!isfinite(voltage)||!isfinite(percent)){voltage=percent=rate=NAN;}}
  xSemaphoreGive(wireMutex);
 }
 template<class Button,class Encoder,class Radio,class Volume> void inputs(uint32_t now,Button button,Encoder encoder,Radio radio,Volume volume){
  held=false;
  for(int i=0;i<10;i++){bool down=pins::ButtonGpio[i]!=255?!digitalRead(pins::ButtonGpio[i]):(awPresent&&uint32_t(now-awAt)<1000&&!(awInputs&(1u<<pins::ButtonAw[i])));held|=down;if(buttons[i].update(down,now)){activity=now;button(i+1);}}
  for(int i=0;i<3;i++){bool down=pins::MiniAw[i]!=255&&awPresent&&uint32_t(now-awAt)<1000&&!(awInputs&(1u<<pins::MiniAw[i]));held|=down;if(minis[i].update(down,now))activity=now;}
  bool enc=!digitalRead(pins::EncoderSwitch),rad=!digitalRead(pins::RadioButton);held|=enc||rad;
  if(encoderSwitch.update(enc,now)){activity=now;encoder();}
  if(radioSwitch.update(rad,now)){activity=now;radio();}
  // Unassigned toggle is deliberately activity-only; both edges count.
  static int lastToggle=-1;int value=digitalRead(pins::ToggleTwo);if(lastToggle>=0&&value!=lastToggle)activity=now;lastToggle=value;
  portENTER_CRITICAL(&encoderMux);
  int edges=encoderEdges;int steps=runtime::takeEncoderSteps(edges);encoderEdges=edges;
  portEXIT_CRITICAL(&encoderMux);
  if(steps){activity=now;volume(steps);}
 }
 void pixels(const JsonDocument& cfg,uint32_t now){
  auto paint=[&](Adafruit_NeoPixel& strip,JsonVariantConst v){uint32_t c=strtoul(v["color"].as<const char*>()+1,nullptr,16);for(int i=0;i<strip.numPixels();i++){auto rgb=runtime::sampleLed(c,v["brightness"],!strcmp(v["palette"],"rainbow"),v["effect"],i,strip.numPixels(),now);strip.setPixelColor(i,rgb.r,rgb.g,rgb.b);}strip.show();};
  if(commissioning::Stick)paint(stick,cfg["pixel"]);paint(board,cfg["boardPixel"]);
 }
 void draw(const JsonDocument& cfg,runtime::Radio radio,int wifi,uint32_t now){
  const char* label="Boxbert";for(int i=0;i<2;i++)if(tagUid==TagUids[i])label=cfg["tags"][i]["name"];
  const char* mode=radio==runtime::Radio::Ble?"BLE":radio==runtime::Radio::Off?"Funk aus":WiFi.getMode()==WIFI_AP?"WLAN AP":"WLAN";
  snprintf(tft_figure_input(),512,"%s | %s",mode,label);String title=path.isEmpty()?"Bereit":path.substring(1);snprintf(tft_title_input(),256,"%s",title.c_str());
  auto buffer=tft_render_v2(playback,audioReady?audio.getAudioCurrentTime():0,audioReady?audio.getAudioFileDuration():0,audio.getVolume(),isfinite(percent)?int(percent):-1,chargingState(rate),wifi,now,-1);
  tft.drawRGBBitmap(0,0,buffer,240,135);
 }
 bool sleep(){
  if(!commissioning::AutoSleep||!commissioning::BoostControl)return false;
  if(!digitalRead(pins::WakeOne)||!digitalRead(pins::WakeTwo))return false;
  // ESP32-S3 has independent digital/RTC pull registers. INPUT_PULLUP alone
  // does not configure the RTC pads selected by EXT1 (IDF 5.5.5 gpio.c/sleep_modes.c).
  for(auto pin:{pins::WakeOne,pins::WakeTwo}){
   if(rtc_gpio_pullup_en((gpio_num_t)pin)!=ESP_OK||rtc_gpio_pulldown_dis((gpio_num_t)pin)!=ESP_OK)return false;
  }
  uint64_t mask=(1ULL<<pins::WakeOne)|(1ULL<<pins::WakeTwo);
  if(esp_sleep_enable_ext1_wakeup_io(mask,ESP_EXT1_WAKEUP_ANY_LOW)!=ESP_OK)return false;
  stop();if(nfcHandle){vTaskDelete(nfcHandle);nfcHandle=nullptr;}
  tft.sendCommand(ST77XX_DISPOFF);tft.sendCommand(ST77XX_SLPIN);digitalWrite(TFT_BACKLITE,LOW);
  if(commissioning::Stick){stick.clear();stick.show();}board.clear();board.show();digitalWrite(pins::BoardPixelPower,LOW);
  SD.end();SPI.end();
  // No SD back-power through SPI pins. DIN low before boost true-disconnect.
  for(auto p:{pins::SdCs,pins::SdSck,pins::SdMosi,pins::SdMiso})pinMode(p,INPUT);
  pinMode(pins::Stick,OUTPUT);digitalWrite(pins::Stick,LOW);gpio_hold_en((gpio_num_t)pins::Stick);
  digitalWrite(pins::BoostEn,LOW);gpio_hold_en((gpio_num_t)pins::BoostEn);gpio_deep_sleep_hold_en();
  // PN532 remains on 3V3; IO7 is deliberately untouched. No system-current claim.
  esp_deep_sleep_start();return true;
 }
};
// Out-of-class IRAM definition avoids Xtensa inline/COMDAT literal relocation.
// This device adapter is included by the single sketch translation unit.
void IRAM_ATTR Hardware::encoderEdge(void* arg){
 auto& h=*static_cast<Hardware*>(arg);
 portENTER_CRITICAL_ISR(&h.encoderMux);
 uint8_t current=(gpio_get_level((gpio_num_t)pins::EncoderA)<<1)|gpio_get_level((gpio_num_t)pins::EncoderB);
 h.encoderEdges+=runtime::quadratureTransition(h.encoderState,current);h.encoderState=current;
 portEXIT_CRITICAL_ISR(&h.encoderMux);
}
}
