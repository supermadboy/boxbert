export async function loadTftRenderer(url){
 const response=await fetch(url);
 if(!response.ok)throw new Error(`TFT-Renderer konnte nicht geladen werden (HTTP ${response.status})`);
 const {instance}=await WebAssembly.instantiate(await response.arrayBuffer(),{});
 return instance.exports;
}

export async function loadTftAsset(renderer,url,signal){
 renderer.tft_set_asset(0,0);
 const response=await fetch(url,{signal});
 if(!response.ok)throw new Error(`Boxbert-Frames konnten nicht geladen werden (HTTP ${response.status})`);
 const data=new Uint8Array(await response.arrayBuffer());
 if(signal?.aborted)throw new DOMException('Abgebrochen','AbortError');
 if(data.length!==renderer.tft_asset_capacity())throw new Error('Boxbert-Frames: falsche Größe');
 new Uint8Array(renderer.memory.buffer,renderer.tft_asset_input(),data.length).set(data);
 if(!renderer.tft_set_asset(renderer.tft_asset_input(),data.length))throw new Error('Boxbert-Frames: Format oder Prüfsumme ungültig');
}

// TextEncoder.encodeInto never emits a partial UTF-8 sequence.
export function writeUtf8(target,text){
 target.fill(0);new TextEncoder().encodeInto(text,target.subarray(0,target.length-1));
}

// The only browser pixel operation: expand the shared renderer's little-endian RGB565.
export function rgb565ToRgba(bytes){
 const view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
 const rgba=new Uint8ClampedArray(bytes.length*2);
 for(let i=0;i<bytes.length;i+=2){
  const pixel=view.getUint16(i,true),r=(pixel>>11)&31,g=(pixel>>5)&63,b=pixel&31,j=i*2;
  rgba[j]=(r<<3)|(r>>2);rgba[j+1]=(g<<2)|(g>>4);rgba[j+2]=(b<<3)|(b>>2);rgba[j+3]=255;
 }
 return rgba;
}
