#pragma once
#include <WiFi.h>
#include <NimBLEDevice.h>
#include <Preferences.h>
#include <mbedtls/md.h>
#include <lwip/sockets.h>
#include <errno.h>
#include "Rpc.h"
#include "JsonInput.h"
#if __has_include("Secrets.h")
#include "Secrets.h"
#endif
#ifndef BOXBERT_WIFI_SSID
#define BOXBERT_WIFI_SSID ""
#endif
#ifndef BOXBERT_WIFI_PASSWORD
#define BOXBERT_WIFI_PASSWORD ""
#endif
#ifndef BOXBERT_WEB_PASSWORD
#define BOXBERT_WEB_PASSWORD ""
#endif
namespace boxbert::integrated {
class Transport {
 Rpc& rpc;String password,expectedAuth;
 WiFiServer server{80};WiFiClient client;
 String httpHeader,httpBody,httpTx;size_t httpOffset=0,httpLength=0;bool headerDone=false,httpWriting=false;
 File staticFile;uint32_t httpAt=0;bool originOk=false;
 NimBLEServer* bleServer=nullptr;NimBLECharacteristic* tx=nullptr;
 struct BleEvent {uint8_t type=0,length=0;uint16_t handle=0;uint8_t data[20]{};};
 QueueHandle_t bleEvents=nullptr;std::atomic<bool> bleOverflow{false};uint16_t peer=BLE_HS_CONN_HANDLE_NONE;
 bool subscribed=false,authenticated=false;String nonce,bleTx;size_t bleOffset=0;uint32_t nonceAt=0,bleAt=0,notifyAt=0;
 LineParser parser;StationFallback stationFallback;CredentialCommand usbCommand;
 static constexpr const char* Service="6f786265-7274-4000-8000-000000000001";
 class ServerCallbacks:public NimBLEServerCallbacks {
  Transport& t;public:ServerCallbacks(Transport& owner):t(owner){}
  void onConnect(NimBLEServer*,NimBLEConnInfo& c)override{BleEvent e;e.type=1;e.handle=c.getConnHandle();t.enqueue(e);}
  void onDisconnect(NimBLEServer*,NimBLEConnInfo& c,int)override{BleEvent e;e.type=2;e.handle=c.getConnHandle();t.enqueue(e);}
 } serverCallbacks{*this};
 class RxCallbacks:public NimBLECharacteristicCallbacks {
  Transport& t;public:RxCallbacks(Transport& owner):t(owner){}
  void onWrite(NimBLECharacteristic* c,NimBLEConnInfo& conn)override{auto v=c->getValue();BleEvent e;e.type=3;e.handle=conn.getConnHandle();if(v.size()>20||v.size()==0){e.type=5;}else{e.length=v.size();memcpy(e.data,v.data(),e.length);}t.enqueue(e);}
 } rxCallbacks{*this};
 class TxCallbacks:public NimBLECharacteristicCallbacks {
  Transport& t;public:TxCallbacks(Transport& owner):t(owner){}
  void onSubscribe(NimBLECharacteristic*,NimBLEConnInfo& conn,uint16_t v)override{BleEvent e;e.type=4;e.handle=conn.getConnHandle();e.length=(v&1)?1:0;t.enqueue(e);}
 } txCallbacks{*this};
 void enqueue(const BleEvent& e){if(!bleEvents||xQueueSend(bleEvents,&e,0)!=pdTRUE)bleOverflow.store(true);}
 static bool constantEqual(const String& a,const String& b){size_t n=a.length();unsigned difference=n^b.length();for(size_t i=0;i<n;i++)difference|=(uint8_t)a[i]^(uint8_t)(i<b.length()?b[i]:0);return difference==0;}
 static String randomHex(size_t n){uint8_t bytes[32];esp_fill_random(bytes,n);char hex[65];for(size_t i=0;i<n;i++)sprintf(hex+2*i,"%02x",bytes[i]);return hex;}
 bool provision(){
  if(strlen(BOXBERT_WEB_PASSWORD)>=16&&strlen(BOXBERT_WEB_PASSWORD)<=63){password=BOXBERT_WEB_PASSWORD;return true;}
  Preferences prefs;if(!prefs.begin("boxbert",false))return false;password=prefs.getString("password","");
  if(password.length()<16||password.length()>63){password=randomHex(16);if(prefs.putString("password",password)!=password.length()){password="";prefs.end();return false;}}
  prefs.end();return true;
 }
 void resetHttp(){client.stop();staticFile.close();httpHeader="";httpBody="";httpTx="";httpOffset=httpLength=0;headerDone=httpWriting=originOk=false;}
 void respond(int status,const char* type,const String& body,const char* extra=""){
  httpTx=String("HTTP/1.1 ")+status+(status==200?" OK\r\n":" Error\r\n")+"Content-Type: "+type+"\r\nContent-Length: "+body.length()+"\r\nConnection: close\r\nCache-Control: no-store\r\nX-Content-Type-Options: nosniff\r\n"+extra+"\r\n"+body;httpOffset=0;httpWriting=true;httpAt=millis();
 }
 void httpError(int status,const char* code,const char* message){JsonDocument d;d["id"]=0;Rpc::error(d,code,message);String body;serializeJson(d,body);respond(status,"application/json",body,status==401?"WWW-Authenticate: Basic realm=\"Boxbert\"\r\n":"");}
 static const char* mime(const String& path){if(path.endsWith(".html"))return "text/html; charset=utf-8";if(path.endsWith(".js")||path.endsWith(".mjs"))return "text/javascript";if(path.endsWith(".css"))return "text/css";if(path.endsWith(".json")||path.endsWith(".webmanifest"))return "application/json";if(path.endsWith(".svg"))return "image/svg+xml";if(path.endsWith(".png"))return "image/png";if(path.endsWith(".ico"))return "image/x-icon";if(path.endsWith(".wasm"))return "application/wasm";if(path.endsWith(".bbt"))return "application/octet-stream";return "application/octet-stream";}
 void parseHeaders(){
  int first=httpHeader.indexOf("\r\n");if(first<0){httpError(400,"invalid","Malformed HTTP");return;}
  String request=httpHeader.substring(0,first);bool post=request=="POST /api/rpc HTTP/1.1";bool get=request.startsWith("GET ")&&request.endsWith(" HTTP/1.1");
  if(!post&&!get){httpError(404,"unknown","Unknown endpoint");return;}
  String host,origin,auth,type;bool hasLength=false,transfer=false,duplicate=false;size_t at=first+2;
  while(at<httpHeader.length()-2){int end=httpHeader.indexOf("\r\n",at);if(end<0)break;String line=httpHeader.substring(at,end);at=end+2;int colon=line.indexOf(':');if(colon<=0){httpError(400,"invalid","Malformed header");return;}String key=line.substring(0,colon);key.toLowerCase();String value=line.substring(colon+1);value.trim();
   if(key=="host"){duplicate|=!host.isEmpty();host=value;}else if(key=="origin"){duplicate|=!origin.isEmpty();origin=value;}else if(key=="authorization"){duplicate|=!auth.isEmpty();auth=value;}
   else if(key=="content-type")type=value;
   else if(key=="transfer-encoding")transfer=true;
   else if(key=="content-length"){duplicate|=hasLength;hasLength=true;if(value.isEmpty()||value.length()>5){httpError(413,"invalid","Body length limit");return;}for(char c:value)if(c<'0'||c>'9'){httpError(400,"invalid","Invalid Content-Length");return;}httpLength=strtoul(value.c_str(),nullptr,10);}
  }
  String local=client.localIP().toString();bool hostOk=host==local||host==local+":80"||host=="boxbert"||host=="boxbert:80"||host=="boxbert.local"||host=="boxbert.local:80";
  if(duplicate||transfer||!hostOk||(!origin.isEmpty()&&origin!=String("http://")+host)){httpError(403,"auth","Same-origin requests only");return;}
  if(!constantEqual(auth,expectedAuth)){httpError(401,"auth","Authentication required");return;}
  if(post){if(!hasLength||httpLength<2||httpLength>4096||!(type=="application/json"||type=="application/json; charset=utf-8")){httpError(400,"invalid","JSON body 2..4096 bytes required");return;}headerDone=true;return;}
  if(httpLength){httpError(400,"invalid","GET body not supported");return;}
  String path=request.substring(4,request.length()-9);if(path=="/api/rpc"||!validStaticPath(path.c_str())||path.length()>192){httpError(404,"unknown","Static path not found");return;}
  if(path=="/")path="/index.html";staticFile=SD.open(String("/www")+path);if(!staticFile||staticFile.isDirectory()){staticFile.close();httpError(404,"unknown","SD web file not found");return;}
  httpTx=String("HTTP/1.1 200 OK\r\nContent-Type: ")+mime(path)+"\r\nContent-Length: "+staticFile.size()+"\r\nConnection: close\r\nX-Content-Type-Options: nosniff\r\nCache-Control: no-store\r\n\r\n";httpWriting=true;httpOffset=0;httpAt=millis();
 }
 void executeHttp(){JsonDocument req,out;bool valid=parseStrictJson(req,httpBody.c_str());if(!valid){httpError(400,"invalid","Malformed JSON");return;}rpc.execute(req.as<JsonVariantConst>(),out,false);String body;serializeJson(out,body);if(body.length()>24576){httpError(503,"busy","Response exceeds limit");return;}respond(200,"application/json",body);}
 void httpTick(uint32_t now){
  if(!client){resetHttp();client=server.accept();if(!client)return;client.setNoDelay(true);httpAt=now;}
  if(uint32_t(now-httpAt)>5000){resetHttp();return;}
  if(httpWriting){
   if(httpOffset==httpTx.length()){
    if(staticFile&&staticFile.available()){uint8_t bytes[512];int n=staticFile.read(bytes,sizeof(bytes));if(n<=0){resetHttp();return;}httpTx="";httpTx.concat((const char*)bytes,n);httpOffset=0;}else{resetHttp();return;}
   }
   // Direct nonblocking socket write: a slow browser cannot stall Audio::loop().
   size_t n=std::min(size_t(512),httpTx.length()-httpOffset);int sent=::send(client.fd(),httpTx.c_str()+httpOffset,n,MSG_DONTWAIT);
   if(sent>0){httpOffset+=sent;httpAt=now;}else if(sent<0&&errno!=EAGAIN&&errno!=EWOULDBLOCK)resetHttp();return;
  }
  int budget=512;while(budget--&&client.available()&&!httpWriting){int value=client.read();if(value<0)break;char c=value;httpAt=now;
   if(!headerDone){if(c=='\0'||httpHeader.length()>=2048){httpError(413,"invalid","Header limit");return;}httpHeader+=c;if(httpHeader.endsWith("\r\n\r\n"))parseHeaders();}
   else{if(c=='\0'){httpError(400,"invalid","NUL in JSON");return;}httpBody+=c;if(httpBody.length()==httpLength){executeHttp();return;}}
  }
 }
 void resetBle(){parser.reset();authenticated=false;nonce="";bleTx="";bleOffset=0;subscribed=false;rpc.disconnect();}
 void dropPeer(){if(peer!=BLE_HS_CONN_HANDLE_NONE&&bleServer)bleServer->disconnect(peer);peer=BLE_HS_CONN_HANDLE_NONE;resetBle();}
 void bleResponse(JsonDocument& out){bleTx="";serializeJson(out,bleTx);if(bleTx.length()>24576){out.clear();out["id"]=0;Rpc::error(out,"busy","Response exceeds limit");bleTx="";serializeJson(out,bleTx);}bleTx+='\n';bleOffset=0;bleAt=millis();}
 void bleRequest(){
  JsonDocument req,out;bool valid=parseStrictJson(req,parser.data());out["id"]=req["id"].is<uint32_t>()?req["id"].as<uint32_t>():0;
  if(!valid||!req.is<JsonObject>()||req.size()!=3||!req["id"].is<uint32_t>()||!req["id"].as<uint32_t>()||!stringValue(req["op"])||!req["args"].is<JsonObject>()){Rpc::error(out,"invalid","Malformed RPC envelope");bleResponse(out);return;}
  String op=req["op"].as<String>();JsonObjectConst args=req["args"];
  if(op=="hello"){
   if(args.size())Rpc::error(out,"invalid","hello takes no arguments");else{rpc.disconnect();authenticated=false;nonce=randomHex(32);nonceAt=millis();out["ok"]=true;out["result"]["nonce"]=nonce;}
  }else if(op=="auth"){
   String challenge=nonce;nonce="";authenticated=false;
   if(!Rpc::fields(args,{"proof"})||!stringValue(args["proof"])||challenge.isEmpty()||uint32_t(millis()-nonceAt)>30000)Rpc::error(out,"auth","Missing, consumed or expired challenge");
   else{uint8_t hash[32];char hex[65];int rc=mbedtls_md_hmac(mbedtls_md_info_from_type(MBEDTLS_MD_SHA256),(const uint8_t*)password.c_str(),password.length(),(const uint8_t*)challenge.c_str(),challenge.length(),hash);
    for(int i=0;i<32;i++)sprintf(hex+i*2,"%02x",hash[i]);authenticated=rc==0&&constantEqual(args["proof"].as<String>(),String(hex));if(authenticated){out["ok"]=true;out["result"]["authenticated"]=true;}else Rpc::error(out,"auth","Invalid proof");}
  }else if(!authenticated)Rpc::error(out,"auth","hello / auth required");else rpc.execute(req.as<JsonVariantConst>(),out,true);
  bleResponse(out);
 }
 void bleTick(uint32_t now){
  if(bleOverflow.exchange(false)){dropPeer();xQueueReset(bleEvents);return;}
  BleEvent e;for(int n=0;n<16&&xQueueReceive(bleEvents,&e,0)==pdTRUE;n++){
   if(e.type==1){if(peer!=BLE_HS_CONN_HANDLE_NONE){bleServer->disconnect(e.handle);continue;}resetBle();peer=e.handle;bleAt=now;}
   else if(e.type==2){if(e.handle==peer){peer=BLE_HS_CONN_HANDLE_NONE;resetBle();}if(rpc.radio==runtime::Radio::Ble)NimBLEDevice::startAdvertising();}
   else if(e.handle==peer){if(e.type==4){subscribed=e.length!=0;continue;}if(e.type==5||!subscribed||!bleTx.isEmpty()){dropPeer();break;}
    bleAt=now;for(int i=0;i<e.length;i++){
     auto state=parser.feed(e.data[i]);if(state==LineParser::Invalid&&e.data[i]!='\n'){dropPeer();break;}if(e.data[i]=='\n'){
      if(state==LineParser::Ready)bleRequest();else{JsonDocument out;out["id"]=0;Rpc::error(out,"invalid","Invalid or oversized NDJSON line");bleResponse(out);}parser.reset();
      if(i!=e.length-1){dropPeer();}break;
     }
    }
   }
  }
  if(peer!=BLE_HS_CONN_HANDLE_NONE&&((parser.size()&&uint32_t(now-bleAt)>10000)||(!bleTx.isEmpty()&&uint32_t(now-bleAt)>30000))){dropPeer();return;}
  if(!bleTx.isEmpty()&&peer!=BLE_HS_CONN_HANDLE_NONE&&subscribed&&uint32_t(now-notifyAt)>=10){
   notifyAt=now;size_t n=std::min(size_t(20),bleTx.length()-bleOffset);tx->setValue((const uint8_t*)bleTx.c_str()+bleOffset,n);
   if(tx->notify(peer)){bleOffset+=n;bleAt=now;if(bleOffset==bleTx.length()){bleTx="";bleOffset=0;}}
  }
 }
 void initBle(){
  if(bleServer)return;NimBLEDevice::init("Boxbert");bleServer=NimBLEDevice::createServer();bleServer->setCallbacks(&serverCallbacks,false);bleServer->advertiseOnDisconnect(false);
  auto svc=bleServer->createService(Service);auto rx=svc->createCharacteristic("6f786265-7274-4000-8000-000000000002",NIMBLE_PROPERTY::WRITE,20);rx->setCallbacks(&rxCallbacks);
  tx=svc->createCharacteristic("6f786265-7274-4000-8000-000000000003",NIMBLE_PROPERTY::READ|NIMBLE_PROPERTY::NOTIFY,20);tx->setCallbacks(&txCallbacks);tx->setValue("");svc->start();
  auto ad=NimBLEDevice::getAdvertising();ad->setName("Boxbert");ad->addServiceUUID(Service);ad->enableScanResponse(true);
 }
 public:
 Transport(Rpc& r):rpc(r){}
 void begin(){bleEvents=xQueueCreate(64,sizeof(BleEvent));if(!bleEvents||!provision()){Serial.println("RADIO LOCKED: password / NVS / queue unavailable");rpc.radio=runtime::Radio::Off;return;}
  String credential=String("boxbert:")+password;uint8_t encoded[160];size_t n=0;mbedtls_base64_encode(encoded,sizeof(encoded),&n,(const uint8_t*)credential.c_str(),credential.length());expectedAuth=String("Basic ")+String((char*)encoded,n);Serial.println("USB recovery: send credentials followed by newline to show device / AP access");setRadio(runtime::Radio::Ble);
 }
 void setRadio(runtime::Radio mode){
  stationFallback.cancel();resetHttp();server.end();WiFi.disconnect(true);WiFi.mode(WIFI_OFF);if(bleServer){dropPeer();NimBLEDevice::getAdvertising()->stop();NimBLEDevice::deinit(true);bleServer=nullptr;tx=nullptr;}if(bleEvents)xQueueReset(bleEvents);rpc.abort();
  rpc.radio=mode;if(password.isEmpty()){rpc.radio=runtime::Radio::Off;return;}
  if(mode==runtime::Radio::Wifi){if(strlen(BOXBERT_WIFI_SSID)){WiFi.mode(WIFI_STA);WiFi.setHostname("boxbert");WiFi.begin(BOXBERT_WIFI_SSID,BOXBERT_WIFI_PASSWORD);stationFallback.start(millis());}else{WiFi.mode(WIFI_AP);if(!WiFi.softAP("Boxbert",password.c_str()))Serial.println("AP startup failed");}server.begin();}
  else if(mode==runtime::Radio::Ble){initBle();NimBLEDevice::startAdvertising();}
 }
 void tick(uint32_t now){
  for(int budget=32;budget--&&Serial.available();){int c=Serial.read();if(c<0)break;if(usbCommand.feed(char(c))){
   if(password.isEmpty())Serial.println("Credentials unavailable: provisioning failed");
   else Serial.printf("Boxbert AP: Boxbert\nUser: boxbert\nDevice / AP password: %s\n",password.c_str());
  }}
  if(rpc.radio==runtime::Radio::Wifi){
   if(stationFallback.due(now,WiFi.status()==WL_CONNECTED)){resetHttp();server.end();WiFi.disconnect(true);WiFi.mode(WIFI_AP);if(!WiFi.softAP("Boxbert",password.c_str()))Serial.println("AP fallback failed");server.begin();}
   httpTick(now);
  }
  if(rpc.radio==runtime::Radio::Ble)bleTick(now);
 }
 void nextRadio(){setRadio(runtime::nextRadio(rpc.radio));}
 void off(){setRadio(runtime::Radio::Off);}
};
}
