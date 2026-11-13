import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('../../firmware/boxbert/Transport.h',import.meta.url),'utf8');

test('BLE callback diagnostics only enqueue; disconnect reason reaches main loop',()=>{
 const callbacks=source.slice(source.indexOf('class ServerCallbacks'),source.indexOf('void enqueue('));
 assert.match(callbacks,/e\.reason=reason;t\.enqueue\(e\)/);
 assert.doesNotMatch(callbacks,/Serial\.|traceBle\(|delay\(/);
 assert.match(source,/traceBle\("disconnect",e\.reason\)/);
});
test('BLE trace emits only event and numeric state, without payloads or blocking flush',()=>{
 const trace=source.split('\n').find(line=>line.includes('void traceBle('));
 assert.ok(trace);
 assert.match(trace,/if\(commissioning::UsbDiagnostics\)/);
 assert.doesNotMatch(trace,/password|proof|nonce|parser\.data|c_str|flush|delay/);
 assert.equal((trace.match(/%s/g)||[]).length,1);
 assert.match(source,/traceBle\(op=="hello"\?"request-hello":op=="auth"\?"request-auth":op=="read"\?"request-read":"request-other"\)/);
});
test('diagnostic drops have fixed reasons and existing authentication remains required',()=>{
 for(const reason of ['drop-event-overflow','drop-write-size','drop-not-subscribed','drop-response-pending','drop-parser','drop-trailing-data','drop-timeout'])assert.ok(source.includes('"'+reason+'"'),reason);
 assert.match(source,/else if\(!authenticated\)Rpc::error\(out,"auth","hello \/ auth required"\)/);
 assert.match(source,/authenticated=rc==0&&constantEqual/);
 assert.doesNotMatch(source,/BleWithoutPassword|accessAllowed/);
});
