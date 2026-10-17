#include "TftRenderer.h"
#include "FontData.h"
#include "StatusGeometry.h"
namespace {
char figure[512], title[2048];
uint16_t pixels[240*135];
constexpr uint16_t BG=0x1082, INK=0xf7be;
void pixel(int x,int y,uint16_t color){if(x>=0&&x<240&&y>=0&&y<135)pixels[y*240+x]=color;}
constexpr uint16_t MUTED=0x7bef, ACCENT=0x4e19;
void rect(int x,int y,int w,int h,uint16_t c){for(int yy=y;yy<y+h;++yy)for(int xx=x;xx<x+w;++xx)pixel(xx,yy,c);}
void line(int x,int y,int xx,int yy,uint16_t c){
 int dx=xx>x?xx-x:x-xx,dy=yy>y?y-yy:yy-y,sx=x<xx?1:-1,sy=y<yy?1:-1,err=dx+dy;
 for(;;){pixel(x,y,c);if(x==xx&&y==yy)break;int twice=2*err;if(twice>=dy){err+=dy;x+=sx;}if(twice<=dx){err+=dx;y+=sy;}}
}
template<int N> void poly(const int (&points)[N],int x,int y,uint16_t c){for(int i=2;i<N;i+=2)line(x+points[i-2],y+points[i-1],x+points[i],y+points[i+1],c);}
// Strict, capacity-bounded UTF-8. Invalid lead/continuation consumes one byte;
// a structurally complete but invalid scalar consumes that complete sequence.
uint32_t decode(const char* s,int& pos,int capacity){
 if(pos>=capacity||!s[pos])return 0;
 const unsigned char lead=static_cast<unsigned char>(s[pos++]);
 if(lead<128)return lead;
 int n=lead>=0xc2&&lead<=0xdf?1:lead>=0xe0&&lead<=0xef?2:lead>=0xf0&&lead<=0xf4?3:0;
 if(!n)return '?';
 uint32_t cp=lead&((1u<<(6-n))-1);
 for(int i=0;i<n;++i){if(pos+i>=capacity|| (static_cast<unsigned char>(s[pos+i])&0xc0)!=0x80)return '?';}
 for(int i=0;i<n;++i)cp=(cp<<6)|(static_cast<unsigned char>(s[pos++])&63);
 if((n==1&&cp<128)||(n==2&&cp<2048)||(n==3&&cp<65536)||cp>0x10ffff||(cp>=0xd800&&cp<=0xdfff))return '?';
 return cp;
}
const TftGlyph& glyph(uint32_t cp,bool small){
 int index=cp>=32&&cp<=126?static_cast<int>(cp)-32:cp>=160&&cp<=255?static_cast<int>(cp)-160+95:cp==0x2026?191:'?'-32;
 return small?Regular12[index]:Bold16[index];
}
int measure(const char* s,int cap,bool small){int p=0,w=0;while(auto cp=decode(s,p,cap))w+=glyph(cp,small).advance;return w;}
void text(const char* s,int cap,int x,int y,bool small,int left=8,int right=232){
 int p=0;while(auto cp=decode(s,p,cap)){const auto& g=glyph(cp,small);for(int row=0;row<24;++row)for(int col=0;col<24;++col)if((g.rows[row]>>col)&1u){if(x+col>=left&&x+col<right)pixel(x+col,y+row,INK);}x+=g.advance;}
}
void formatTime(int seconds,char (&out)[20]){
 if(seconds<0){out[0]='-';out[1]='-';out[2]=':';out[3]='-';out[4]='-';out[5]=0;return;}
 int minutes=seconds/60,n=0;char reverse[12];
 do{reverse[n++]=static_cast<char>('0'+minutes%10);minutes/=10;}while(minutes);
 int p=0;while(n)out[p++]=reverse[--n];
 out[p++]=':';out[p++]=static_cast<char>('0'+seconds%60/10);out[p++]=static_cast<char>('0'+seconds%10);out[p]=0;
}
void timeline(int elapsed,int duration){
 if(duration>0&&elapsed>duration)elapsed=duration;
 char left[20],right[20];formatTime(elapsed,left);formatTime(duration>0?duration:-1,right);
 text(left,20,8,103,true);text(right,20,232-measure(right,20,true),103,true);
 rect(8,91,224,4,MUTED);
 if(duration>0&&elapsed>=0){int fill=static_cast<int>(static_cast<uint64_t>(elapsed)*224u/static_cast<unsigned>(duration));rect(8,91,fill,4,ACCENT);}
 else { // Unknown progress: distinct bounded dotted track, no invented position.
  for(int x=8;x<232;x+=8)rect(x,91,4,4,BG);
 }
}
void statusIcons(int volume,int battery,int charging,int wifi,uint32_t time){
 const int y=8,vx=154,wx=181,bx=208;
 rect(vx+2,y+5,5,5,INK);
 for(int xx=6;xx<=11;++xx)rect(vx+xx,y+5-(xx-6)*4/5,1,5+(xx-6)*8/5,INK);
 if(volume<0||volume>21)text("?",2,vx+13,y-5,true,vx+12,vx+24);
 else if(volume==0){line(vx+15,y+5,vx+21,y+11,INK);line(vx+21,y+5,vx+15,y+11,INK);}
 else {poly(VolumeInner,vx,y,volume>0?INK:MUTED);poly(VolumeOuter,vx,y,volume>10?INK:MUTED);}
 if(wifi==0){poly(WifiOuter,wx,y,MUTED);line(wx+2,y+1,wx+21,y+13,INK);}
 else if(wifi==1||wifi==2){
  int level=wifi==2?3:static_cast<int>((time/500u)%3u)+1;
  poly(WifiOuter,wx,y,level>=3?INK:MUTED);poly(WifiMiddle,wx,y,level>=2?INK:MUTED);poly(WifiInner,wx,y,INK);
  rect(wx+11,y+11,3,2,INK);
 }else text("?",2,wx+8,y-5,true,wx,wx+24);
 line(bx+1,y+3,bx+19,y+3,INK);line(bx+1,y+12,bx+19,y+12,INK);
 line(bx+1,y+3,bx+1,y+12,INK);line(bx+19,y+3,bx+19,y+12,INK);rect(bx+21,y+5,2,5,INK);
 if(battery>=0&&battery<=100)rect(bx+3,y+5,battery*15/100,5,ACCENT);
 else text("?",2,bx+6,y-5,true,bx+3,bx+18);
 if(charging!=0&&charging!=1)text("?",2,bx+6,y-5,true,bx+3,bx+18);
 if(charging==1){line(bx+11,y+2,bx+7,y+8,INK);line(bx+7,y+8,bx+13,y+7,INK);line(bx+13,y+7,bx+9,y+13,INK);}
}
}
extern "C" char* tft_figure_input(){return figure;}
extern "C" char* tft_title_input(){return title;}
extern "C" uint16_t* tft_render(int playback,int elapsed,int duration,int volume,int battery,int charging,int wifi,uint32_t timeMs,int scrollOverride){
 for(int i=0;i<240*135;++i)pixels[i]=BG;
 char name[515]; int p=0,end=0,width=0;
 bool truncate=measure(figure,512,false)>224;
 while(auto cp=decode(figure,p,512)){
  int next=width+glyph(cp,false).advance;
  if(truncate&&next+glyph(0x2026,false).advance>224)break;
  width=next;end=p;
 }
 for(int i=0;i<end;++i)name[i]=figure[i];
 if(truncate){name[end++]=static_cast<char>(0xe2);name[end++]=static_cast<char>(0x80);name[end++]=static_cast<char>(0xa6);}
 name[end]=0;
 text(name,515,8,32,false);
 int w=measure(title,2048,false),maximum=w>224?w-224:0,offset=0;
 if(scrollOverride>=0)offset=scrollOverride>maximum?maximum:scrollOverride;
 else if(maximum){
  uint32_t travel=static_cast<uint32_t>(maximum)*40u;
  uint32_t phase=timeMs%(2u*travel+2000u);
  if(phase<1000u)offset=0;
  else if(phase<1000u+travel)offset=static_cast<int>((phase-1000u)/40u);
  else if(phase<2000u+travel)offset=maximum;
  else offset=maximum-static_cast<int>((phase-2000u-travel)/40u);
 }
 text(title,2048,w<224?(240-w)/2:8-offset,58,false);
 const char* labels[]={"Startet…","Kein Tag","Wiedergabe","Pause","Beendet","Dateifehler"};
 const char* label=playback>=0&&playback<=5?labels[playback]:"Status ?";
 text(label,64,8,4,true,8,151);
 statusIcons(volume,battery,charging,wifi,timeMs);
 timeline(elapsed,duration);
 if(!title[0])text(playback==1?"Figur auflegen":playback==0?"Boxbert":"—",64,8,58,false);
 return pixels;
}
