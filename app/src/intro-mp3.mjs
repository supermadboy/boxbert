import {Mp3Encoder} from '@breezystack/lamejs';
export async function encodeMp3(pcm,sampleRate,{signal}={}){
 signal?.throwIfAborted();if(!pcm?.length)throw Error('Aufnahme ist leer.');if(![32000,44100,48000].includes(sampleRate))throw Error('MP3-Samplerate nicht unterstützt.');
 const encoder=new Mp3Encoder(1,sampleRate,96),parts=[];
 for(let offset=0;offset<pcm.length;offset+=1152){signal?.throwIfAborted();const chunk=pcm.subarray(offset,offset+1152),samples=new Int16Array(chunk.length);for(let i=0;i<chunk.length;i++){const n=Math.max(-1,Math.min(1,chunk[i]));samples[i]=Math.round(n*(n<0?32768:32767));}const encoded=encoder.encodeBuffer(samples);if(encoded.length)parts.push(new Uint8Array(encoded));if(offset%(1152*32)===0)await new Promise(r=>setTimeout(r,0));}
 const tail=encoder.flush();if(tail.length)parts.push(new Uint8Array(tail));signal?.throwIfAborted();return new Blob(parts,{type:'audio/mpeg'});
}
export async function recordingToMp3(blob,{signal}={}){
 signal?.throwIfAborted();if(!blob?.size)throw Error('Keine lokale Aufnahme.');if(blob.size>32*1024*1024)throw Error('Lokale Aufnahme zu groß (max. 32 MiB).');
 const Offline=globalThis.OfflineAudioContext||globalThis.webkitOfflineAudioContext;if(!Offline)throw Error('Lokale Audiodekodierung im Browser nicht verfügbar.');
 // decodeAudioData resamples to context rate, never starts an audio source.
 const decoder=new Offline(1,1,44100);let audio;try{audio=await decoder.decodeAudioData(await blob.arrayBuffer());}catch{throw Error('Browser kann diese Aufnahme nicht dekodieren. Lokale Aufnahme bleibt erhalten.');}
 signal?.throwIfAborted();if(audio.duration>600)throw Error('Intro länger als 10 Minuten. Bitte kürzer aufnehmen.');const mono=new Float32Array(audio.length);for(let ch=0;ch<audio.numberOfChannels;ch++){const samples=audio.getChannelData(ch);for(let i=0;i<mono.length;i++)mono[i]+=samples[i]/audio.numberOfChannels;}
 return encodeMp3(mono,audio.sampleRate,{signal});
}
export async function transferIntro(adapter,uid,blob,{convert=recordingToMp3,signal,onProgress}={}){
 const mp3=await convert(blob,{signal});signal?.throwIfAborted();const name='intro-'+globalThis.crypto.randomUUID()+'.mp3';const result=await adapter.upload(new File([mp3],name,{type:'audio/mpeg'}),{signal,onProgress,category:'sounds'});await adapter.read({signal});await adapter.assignIntro(uid,result.path,{signal});return result;
}
