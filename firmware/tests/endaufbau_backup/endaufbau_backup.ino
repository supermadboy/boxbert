// Read-only pre-integration config backup, 2026-11-11. No playback.
#include <Arduino.h>
#include <SPI.h>
#include <SD.h>
#include <Preferences.h>
bool ready=false;
void exportFile(const char* path){
 File f=SD.open(path,FILE_READ);
 if(!f){Serial.printf("MISSING %s\n",path);return;}
 if(f.isDirectory()||f.size()>24576){Serial.printf("REFUSED %s\n",path);f.close();return;}
 Serial.printf("FILE %s %lu\n",path,(unsigned long)f.size());
 while(f.available()){uint8_t bytes[32];int n=f.read(bytes,sizeof(bytes));if(n<=0)break;Serial.print("HEX ");for(int i=0;i<n;i++)Serial.printf("%02x",bytes[i]);Serial.println();}
 f.close();Serial.println("END_FILE");
}
void setup(){
 Serial.begin(115200);pinMode(9,INPUT);
 pinMode(TFT_BACKLITE,OUTPUT);digitalWrite(TFT_BACKLITE,LOW);
 pinMode(TFT_CS,OUTPUT);digitalWrite(TFT_CS,HIGH);
 pinMode(8,OUTPUT);digitalWrite(8,HIGH);
 SPI.begin(36,37,35,8);ready=SD.begin(8,SPI,4000000)&&SD.cardType()!=CARD_NONE;
}
void loop(){
 if(Serial.available()&&Serial.read()=='b'){
  Serial.printf("BACKUP_BEGIN SD=%d\n",ready);
  if(ready){exportFile("/.boxbert/config0.json");exportFile("/.boxbert/config1.json");
   File root=SD.open("/");for(File f=root.openNextFile(FILE_READ);f;f=root.openNextFile(FILE_READ)){Serial.printf("ROOT %s %llu %s\n",f.name(),(unsigned long long)f.size(),f.isDirectory()?"DIR":"FILE");f.close();}root.close();
  }
  Preferences legacy;bool ok=legacy.begin("boxbert-tags",true);
  for(auto key:{"tag0","tag1"}){
   Serial.printf("LEGACY %s present=%d value=",key,ok&&legacy.isKey(key));
   if(ok){String s=legacy.getString(key,"");for(unsigned i=0;i<s.length();i++)Serial.printf("%02x",(uint8_t)s[i]);}Serial.println();
  }
  if(ok)legacy.end();Serial.println("BACKUP_END");
 }
 delay(10);
}
