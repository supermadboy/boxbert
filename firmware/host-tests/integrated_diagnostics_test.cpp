#include "../boxbert/IntegratedState.h"
#include <cassert>
#include <iostream>
using namespace boxbert::integrated;
static DiagnosticCommand::Command parse(DiagnosticCommand& p,const char* s){auto result=DiagnosticCommand::None;while(*s){auto r=p.feed(*s++);if(r!=DiagnosticCommand::None)result=r;}return result;}
int main(){
 assert(!diagnosticTestExpired(100,101)); // command started after loop-entry time
 assert(!diagnosticTestExpired(20099,100));
 assert(diagnosticTestExpired(20100,100));
 assert(!diagnosticTestExpired(10,0xfffffff0u));
 assert(diagnosticTestExpired(20000,0xfffffff0u));
 DiagnosticCommand p;
 assert(parse(p,"diag\n")==DiagnosticCommand::Inspect);
 assert(parse(p,"test9\r\n")==DiagnosticCommand::ButtonNine);
 assert(parse(p,"test10\n")==DiagnosticCommand::ButtonTen);
 assert(parse(p,"test-stop\n")==DiagnosticCommand::Stop);
 assert(parse(p,"radio-off\n")==DiagnosticCommand::RadioOff);
 assert(parse(p,"radio-ble\n")==DiagnosticCommand::RadioBle);
 assert(parse(p,"radio-wifi\n")==DiagnosticCommand::RadioWifi);
 for(auto s:{"credentials\n","diagX\n","Xdiag\n","DIAG\n"," diag\n","diag \n","di\rag\n","diag\rX\n","diag\0"})assert(parse(p,s)==DiagnosticCommand::None);
 // Unterminated junk cannot authorize the next line; parser recovers after LF.
 assert(parse(p,"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx\n")==DiagnosticCommand::None);
 assert(parse(p,"diag\n")==DiagnosticCommand::Inspect);
 assert(parse(p,"diag")==DiagnosticCommand::None);
 assert(p.feed('\0')==DiagnosticCommand::None);
 assert(p.feed('\n')==DiagnosticCommand::None); // actual NUL, not C-string truncation
 assert(parse(p,"diag\n")==DiagnosticCommand::Inspect);
 std::cout<<"bounded explicit USB commissioning diagnostics: PASS\n";
}
