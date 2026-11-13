import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,mkdtemp,writeFile,rm} from 'node:fs/promises';
import {tmpdir,homedir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';

// Execute the actual sketch encoder/debounce code and RPC persistence/apply tail.
// Only Arduino hardware/SD boundaries are substituted; no copied volume algorithm.
test('review17 encoder/RPC event sequences use actual production C++ paths',async t=>{
 const root=new URL('../../',import.meta.url);
 const ino=await readFile(new URL('firmware/boxbert/boxbert.ino',root),'utf8');
 const rpc=await readFile(new URL('firmware/boxbert/Rpc.h',root),'utf8');
 const globalsAndEncoder=ino.slice(ino.indexOf('int requestedVolume='),ino.indexOf('void playTag('));
 const afterTransport=ino.slice(ino.indexOf(' transport.tick(now);'),ino.indexOf(' Hardware::TagEvent event;'));
 const debounce=ino.slice(ino.indexOf(' if(!volumePending)'),ino.indexOf(' static uint32_t ledAt='));
 const rpcSave=rpc.slice(rpc.indexOf('  if(!hw.sd||!store.save(next))'),rpc.lastIndexOf('\n }'));
 assert.ok(globalsAndEncoder&&afterTransport&&debounce&&rpcSave,'production seams must exist');
 const dir=await mkdtemp(join(tmpdir(),'boxbert-volume-'));t.after(()=>rm(dir,{recursive:true,force:true}));
 const source=`
#include <ArduinoJson.h>
#include <cassert>
#include <algorithm>
#include <cstdint>
#include <cstring>
#include <cstdio>
#include "${new URL('firmware/Config.h',root).pathname}"
#include "${new URL('firmware/runtime/Quadrature.h',root).pathname}"
namespace commissioning=boxbert::commissioning;
namespace runtime=boxbert::runtime;
uint32_t clockNow=0;
uint32_t millis(){return clockNow;}
int constrain(int n,int lo,int hi){return std::clamp(n,lo,hi);}
struct {void println(const char*){} template<class... T> void printf(const char*,T...) {}} Serial;
struct Hardware {
 bool sd=true; uint32_t activity=0;
 struct {int actual=3;void setVolume(int v){actual=v;} unsigned getVolume(){return actual;}} audio;
 void tickAudio(){} void i2cTick(uint32_t){}
 template<class... T> void inputs(T...){}
} hardware;
struct ConfigStore {
 JsonDocument data;bool writable=true;
 bool save(const JsonDocument& next){if(!writable)return false;data.set(next);return true;}
} config;
struct Rpc {
 Hardware& hw;ConfigStore& store;
 Rpc(Hardware& h,ConfigStore& s):hw(h),store(s){}
 struct {bool active=false;} progress;
 ${rpc.match(/uint32_t volumeRevision=0;[^\n]*/)?.[0]||''}
 void saveMutation(const char* op,int volume=-1){
  JsonDocument next;next.set(store.data);JsonDocument args,out;
  if(volume>=0){args["volume"]=volume;next["volume"]=volume;}
  else if(!strcmp(op,"settings")){args["pixel"]["brightness"]=5;next["pixel"].set(args["pixel"]);}
  else next["tagName"]="Renamed";
  JsonObjectConst a=args.as<JsonObjectConst>();JsonObject result=out["result"].to<JsonObject>();
  auto fail=[](const char*,const char*){};
  (void)op;(void)a;(void)fail;
  ${rpcSave}
 }
} rpc{hardware,config};
struct {void tick(uint32_t){}void nextRadio(){}} transport;
${globalsAndEncoder}
void buttonPressed(int){}void encoderPressed(){}
void tick(){const uint32_t now=millis();${afterTransport}\n${debounce}}
int main(int argc,char** argv){
 assert(argc==2);config.data["volume"]=3;requestedVolume=3;
 if(!strcmp(argv[1],"limits")){
  changeVolume(1000);assert(hardware.audio.actual==commissioning::MaxVolume);
  changeVolume(-1000);assert(hardware.audio.actual==0);
  changeVolume(commissioning::MaxVolume);assert(hardware.audio.actual==commissioning::MaxVolume);
  puts("volume limits PASS");return 0;
 }
 clockNow=100;changeVolume(1);assert(hardware.audio.actual==4);
 clockNow=200;
 if(!strcmp(argv[1],"rename")||!strcmp(argv[1],"led")||!strcmp(argv[1],"failed")){
  const bool failed=!strcmp(argv[1],"failed");
  config.writable=!failed;
  rpc.saveMutation(!strcmp(argv[1],"rename")?"renameTag":"settings",failed?2:-1);
  config.writable=true;
  assert(hardware.audio.actual==4 && "rename must not reapply stale saved volume 3");
  tick();assert(hardware.audio.actual==4);
  clockNow=850;tick();
  assert(config.data["volume"].as<int>()==4);assert(hardware.audio.actual==4);assert(!volumePending);
 }else{
  const int committed=!strcmp(argv[1],"sameSaved")?3:2;
  rpc.saveMutation("settings",committed);assert(config.data["volume"].as<int>()==committed);assert(hardware.audio.actual==committed);
  tick();clockNow=850;tick();
  assert(config.data["volume"].as<int>()==committed && "confirmed RPC volume must supersede pending encoder 4");
  assert(hardware.audio.actual==committed);assert(!volumePending);
  clockNow=900;changeVolume(1);assert(hardware.audio.actual==committed+1);
  clockNow=1650;tick();assert(config.data["volume"].as<int>()==committed+1);
 }
 puts("volume sequence PASS");
}
`;
 await writeFile(join(dir,'volume.cpp'),source);
 const include=process.env.ARDUINOJSON_INCLUDE||join(homedir(),'.local/share/boxbert-toolchain/user/libraries/ArduinoJson/src');
 const compiler=process.env.CXX||'clang++';
 const build=spawnSync(compiler,['-std=c++17','-Wall','-Wextra','-Werror','-fsanitize=address,undefined','-fno-omit-frame-pointer','-I',include,join(dir,'volume.cpp'),'-o',join(dir,'volume')],{encoding:'utf8'});
 assert.equal(build.status,0,build.error?.message||build.stderr);
 for(const sequence of ['rename','volume','led','failed','sameSaved','limits'])await t.test(sequence,()=>{
  const run=spawnSync(join(dir,'volume'),[sequence],{encoding:'utf8'});
  assert.equal(run.status,0,run.stderr||run.error?.message);assert.match(run.stdout,/PASS/);
 });
});
