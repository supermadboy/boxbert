import React,{useEffect,useState} from 'react';
const groups=[{size:30,ids:[1,2,3,4]},{size:24,ids:[5,6,7,8]},{size:44,ids:[9,10]}];
export function ButtonBoard({data,demo,enabled=demo,busy,save}){
 const [selected,setSelected]=useState(1),[path,setPath]=useState('');
 const stored=data?.buttons?.find(b=>b.id===selected)?.path??'';
 useEffect(()=>setPath(stored),[selected,stored,data]);
 return <section className="card button-board"><div className="section-head"><h2>{demo?'Demo-Soundbelegung':'Geräte-Soundbelegung'}</h2><span className="badge">{demo?'10 Demo-Buttons':'10 Geräte-Buttons'}</span></div>
 <p>{demo?'Wähle einen Button an der Box und ordne eine vorhandene MP3 zu. Nur Metadaten in diesem Browser, kein Abspielen.':'Belegung wird auf SD gespeichert und steuert das echte Gerät.'}</p>
 <fieldset disabled={!enabled||busy||!data}><div className="box-view" role="group" aria-label="Grafische Demo-Box: zehn Buttons"><div className="box-caption">BOXBERT · DEMO</div><div className="box-buttons">{groups.map(group=><div className={'button-group size-'+group.size} key={group.size}>{group.ids.map(id=><button type="button" key={id} className="box-button" data-button-id={id} aria-label={'Demo-Button '+id} aria-pressed={selected===id} onClick={()=>setSelected(id)} title={'Button '+id+' · '+(data?.buttons?.find(b=>b.id===id)?.path?.slice(1)||'Unbelegt')}><span>{id}</span><span className="assigned-dot" aria-hidden="true">{data?.buttons?.find(b=>b.id===id)?.path?'●':'○'}</span></button>)}<small>{group.ids.length} × {group.size} mm</small></div>)}</div></div>
 <form className="button-assignment" onSubmit={e=>{e.preventDefault();save(selected,path);}}><h3>Button {selected} · MP3-Belegung</h3><p className="saved-path">{'Gespeichert: '+(stored?stored.slice(1):'Unbelegt')}</p><label>MP3 für ausgewählten Button<select value={path} onChange={e=>setPath(e.target.value)}><option value="">Unbelegt</option>{data?.files.map(f=><option key={f} value={f}>{f.slice(1)}</option>)}</select></label><button>Button-Belegung speichern</button></form></fieldset>
 <p className="small">Eigenständige Soundbelegung, kein Ersatz für Play/Pause oder Lautstärke. Boxansicht schematisch, kein Bohrbild.</p></section>;
}
