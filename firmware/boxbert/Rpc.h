#pragma once
#include <mbedtls/base64.h>
#include "Hardware.h"
#include "src/runtime/ReadModel.h"
namespace boxbert::integrated {
class Rpc {
 public:
 Hardware& hw;ConfigStore& store;runtime::Radio radio=runtime::Radio::Wifi;
 uint32_t volumeRevision=0; // Successful explicit RPC volume writes supersede encoder drafts.
 runtime::UploadProgress progress;File upload;String temp,finalPath,uploadCategory;bool uploadBle=false,timedOut=false;uint32_t uploadAt=0;
 Rpc(Hardware& h,ConfigStore& s):hw(h),store(s){}
 void abort(){upload.close();if(!temp.isEmpty())SD.remove(temp);temp="";finalPath="";progress.abort();}
 void tick(uint32_t now){if(progress.active&&uint32_t(now-uploadAt)>=30000){abort();timedOut=true;}}
 void disconnect(){if(progress.active&&uploadBle)abort();}
 static void error(JsonDocument& out,const char* code,const char* message){out.remove("result");out["ok"]=false;out["error"]["code"]=code;out["error"]["message"]=message;}
 static bool fields(JsonObjectConst a,std::initializer_list<const char*> names){if(a.size()!=names.size())return false;for(auto n:names)if(a[n].isUnbound())return false;return true;}
 bool media(JsonVariantConst v,bool empty=false){return stringValue(v)&&((empty&&!*v.as<const char*>())||hw.exists(v));}
 bool status(JsonObject out){
  out["playing"]=hw.playback==2&&!hw.paused;out["paused"]=hw.paused;out["path"]=hw.path;out["tagUid"]=hw.tagUid;
  out["positionSeconds"]=hw.audioReady?hw.audio.getAudioCurrentTime():0;out["durationSeconds"]=hw.audioReady?hw.audio.getAudioFileDuration():0;
  if(isfinite(hw.percent))out["batteryPercent"]=hw.percent;else out["batteryPercent"]=nullptr;
  if(isfinite(hw.voltage))out["batteryVoltage"]=hw.voltage;else out["batteryVoltage"]=nullptr;
  out["radio"]=radio==runtime::Radio::Wifi?"wifi":radio==runtime::Radio::Ble?"ble":"off";out["wifiConnected"]=WiFi.status()==WL_CONNECTED;
  out["ip"]=radio!=runtime::Radio::Wifi?"":WiFi.getMode()==WIFI_AP?WiFi.softAPIP().toString():WiFi.status()==WL_CONNECTED?WiFi.localIP().toString():"";
  out["firmware"]="boxbert-v1";out["configHealthy"]=store.ready&&!store.damaged;return true;
 }
 void execute(JsonVariantConst req,JsonDocument& out,bool ble){
  out.clear();out["id"]=req["id"].is<uint32_t>()?req["id"].as<uint32_t>():0;out["ok"]=true;
  auto fail=[&](const char* c,const char* m){error(out,c,m);};
  if(!req.is<JsonObjectConst>()||req.size()!=3||!req["id"].is<uint32_t>()||!req["id"].as<uint32_t>()||!stringValue(req["op"])||!req["args"].is<JsonObjectConst>()){fail("invalid","Expected {id:positive integer,op:string,args:object}");return;}
  const char* op=req["op"];JsonObjectConst a=req["args"];JsonObject result=out["result"].to<JsonObject>();
  if(!strcmp(op,"read")){
   if(a.size()){fail("invalid","read takes no arguments");return;}
   if(!hw.sd){fail("sd","SD unavailable");return;}
   JsonArray files=result["files"].to<JsonArray>();File root=SD.open("/");if(!root){fail("sd","Cannot read SD root");return;}
   for(File f=root.openNextFile();f;f=root.openNextFile()){String p=String("/")+f.name();if(!f.isDirectory()&&f.size()>0&&mediaPath(p.c_str()))files.add(p);f.close();if(measureJson(out)>22000){root.close();fail("busy","File catalogue exceeds response limit");return;}}root.close();
   for(auto key:{"tags","buttons","volume","pixel","boardPixel"})result[key].set(store.data[key]);
   runtime::categoryView(store.data["categories"].as<JsonObjectConst>(),files,result["categories"].to<JsonObject>());
   status(result["status"].to<JsonObject>());return;
  }
  if(!strcmp(op,"play")||!strcmp(op,"pause")||!strcmp(op,"resume")||!strcmp(op,"stop")){
   bool play=!strcmp(op,"play");if((play&&(!fields(a,{"path"})||!media(a["path"])))||(!play&&a.size())){fail("invalid","Invalid player arguments or missing file");return;}
   if(progress.active){fail("busy","Upload active");return;}
   bool accepted=true;if(play)accepted=hw.start(a["path"].as<String>());else if(!strcmp(op,"pause"))accepted=hw.pause();else if(!strcmp(op,"resume"))accepted=hw.resume();else hw.stop();
   if(!accepted){fail(hw.audioReady?"invalid":"sd","Player could not perform command");return;}hw.activity=millis();result["accepted"]=true;return;
  }
  if(!strcmp(op,"uploadBegin")){
   if(!fields(a,{"name","size","category"})||!stringValue(a["name"])||!runtime::validMediaName(a["name"])||!a["size"].is<uint32_t>()||!a["size"].as<uint32_t>()||a["size"].as<uint32_t>()>16777216||!category(a["category"])){fail("invalid","Invalid upload metadata");return;}
   if(progress.active||hw.playback==2||hw.paused){fail("busy","Stop playback / finish current upload first");return;}
   if(!hw.sd||!store.ready||store.damaged){fail("sd","Writable healthy SD configuration required");return;}
   finalPath=String("/")+a["name"].as<const char*>();if(SD.exists(finalPath)){fail("exists","File already exists");return;}
   for(int i=0;i<4;i++){char name[60];snprintf(name,sizeof(name),"/.boxbert/upload-%08lx.part",(unsigned long)esp_random());temp=name;if(!SD.exists(temp))break;temp="";}
   if(temp.isEmpty()){fail("sd","Cannot allocate temporary path");return;}
   upload=SD.open(temp,"w");if(!upload){temp="";fail("sd","Cannot create upload");return;}
   progress.begin(a["size"]);uploadCategory=a["category"].as<String>();uploadBle=ble;timedOut=false;uploadAt=hw.activity=millis();result["offset"]=0;return;
  }
  if(!strcmp(op,"uploadChunk")||!strcmp(op,"uploadCommit")||!strcmp(op,"uploadAbort")){
   bool chunk=!strcmp(op,"uploadChunk"),commit=!strcmp(op,"uploadCommit");
   if((chunk&&!fields(a,{"offset","data"}))||(!chunk&&a.size())){fail("invalid","Invalid upload arguments");return;}
   if(!progress.active){if(!commit&&!chunk){result["accepted"]=true;return;}fail(timedOut?"timeout":"incomplete","No active upload");return;}
   if(ble!=uploadBle){fail("busy","Upload belongs to other transport");return;}uploadAt=hw.activity=millis();
   if(chunk){
    if(!a["offset"].is<uint32_t>()||!stringValue(a["data"])){fail("invalid","Invalid chunk types");return;}
    if(a["offset"].as<uint32_t>()!=progress.offset){fail("offset","Unexpected offset");return;}
    const char* text=a["data"];size_t len=strlen(text);if(len<4||len>512||len%4){fail("invalid","Invalid Base64 length");return;}
    for(size_t i=0;i<len;i++)if(!isalnum((unsigned char)text[i])&&text[i]!='+'&&text[i]!='/'&&text[i]!='='){fail("invalid","Invalid Base64");return;}
    uint8_t bytes[384],canonical[513];size_t n=0,cn=0;
    if(mbedtls_base64_decode(bytes,sizeof(bytes),&n,(const uint8_t*)text,len)||n==0||n>384||mbedtls_base64_encode(canonical,sizeof(canonical),&cn,bytes,n)||cn!=len||memcmp(canonical,text,len)||n>progress.size-progress.offset){fail("invalid","Invalid Base64 chunk / exceeds declared size");return;}
    size_t written=upload.write(bytes,n);upload.flush();if(written!=n||upload.getWriteError()){abort();fail("sd","SD chunk write failed; upload discarded");return;}
    progress.chunk(progress.offset,n);result["offset"]=progress.offset;return;
   }
   if(!commit){abort();result["accepted"]=true;return;}
   if(!progress.complete()){fail("incomplete","Declared length not reached");return;}
   upload.flush();uint32_t size=progress.size;bool valid=upload.size()==size&&!upload.getWriteError();upload.close();
   if(!valid){abort();fail("sd","Temporary length / flush error");return;}
   if(SD.exists(finalPath)){abort();fail("exists","Destination appeared during upload");return;}
   if(!SD.rename(temp,finalPath)){abort();fail("sd","Cannot finalize upload");return;}
   JsonDocument next;next.set(store.data);next["categories"][finalPath]=uploadCategory;
   if(!store.save(next)){
    // Roll back only this newly created file. Never touch pre-existing music.
    if(!SD.rename(finalPath,temp)){temp="";progress.abort();fail("sd","Category save and rollback failed; media preserved at final path");return;}
    abort();fail("sd","Category persistence failed; upload rolled back");return;
   }
   result["path"]=finalPath;result["size"]=size;temp="";finalPath="";progress.abort();return;
  }
  JsonDocument next;next.set(store.data);
  if(!strcmp(op,"assign")||!strcmp(op,"renameTag")||!strcmp(op,"assignIntro")){
   bool rename=!strcmp(op,"renameTag"),intro=!strcmp(op,"assignIntro");
   if(!fields(a,{"uid",rename?"name":"path"})||!stringValue(a["uid"])){fail("invalid","Invalid tag arguments");return;}
   int i=-1;for(int n=0;n<2;n++)if(!strcmp(a["uid"],TagUids[n]))i=n;if(i<0){fail("invalid","Unknown tag UID");return;}
   if(rename){if(!stringValue(a["name"])||!tagName(a["name"])){fail("invalid","Tag name must contain at most 80 UTF-8 characters");return;}std::string normalized;if(!normalizeTagLabel(a["name"].as<const char*>(),i,normalized)){fail("invalid","Invalid tag label");return;}next["tags"][i]["name"]=normalized.c_str();}
   else{if(!media(a["path"],intro)){fail("invalid","Media missing or invalid");return;}next["tags"][i][intro?"introPath":"path"]=a["path"];}
  }else if(!strcmp(op,"assignButton")){
   if(!fields(a,{"id","path"})||!a["id"].is<int>()||a["id"].as<int>()<1||a["id"].as<int>()>10||!media(a["path"],true)){fail("invalid","Invalid button assignment");return;}next["buttons"][a["id"].as<int>()-1]["path"]=a["path"];
  }else if(!strcmp(op,"categorize")){
   if(!fields(a,{"path","category"})||!media(a["path"])||!category(a["category"])){fail("invalid","Invalid category assignment");return;}next["categories"][a["path"].as<const char*>()]=a["category"];
  }else if(!strcmp(op,"settings")){
   if(!a.size()){fail("invalid","No settings supplied");return;}
   for(JsonPairConst pair:a){const char* key=pair.key().c_str();if(!strcmp(key,"volume")){if(!pair.value().is<int>()||pair.value().as<int>()<0||pair.value().as<int>()>21){fail("invalid","Volume must be 0..21");return;}}
    else if(!strcmp(key,"pixel")||!strcmp(key,"boardPixel")){if(!validLed(pair.value(),!strcmp(key,"boardPixel"))){fail("invalid","Invalid LED settings");return;}}
    else{fail("invalid","Unknown setting");return;}next[key]=pair.value();}
  }else{fail("unknown","Unknown operation");return;}
  if(progress.active){fail("busy","Configuration locked during upload");return;}
  if(!hw.sd||!store.save(next)){fail("sd","Configuration not saved; previous generation retained");return;}
  if(!strcmp(op,"settings")&&!a["volume"].isUnbound()){hw.audio.setVolume(store.data["volume"]);++volumeRevision;}
  hw.activity=millis();result["saved"]=true;
 }
};
}
