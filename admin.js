(()=>{
const REPO='asuf10ppy/asuf10ppy.github.io',BR='main',API='https://api.github.com/repos/'+REPO+'/contents/';
let TOK='',P=null;
const $=s=>P.querySelector(s),mk=(t,x,c)=>{const e=document.createElement(t);if(x)e.textContent=x;if(c)e.className=c;return e};
const say=(m,ok)=>{const e=$('#msg');e.textContent=m;e.className=ok===undefined?'':ok?'ok':'bad'};
const H=()=>({Authorization:'Bearer '+TOK,Accept:'application/vnd.github+json'});
const b64=u=>{let s='';for(let i=0;i<u.length;i+=8192)s+=String.fromCharCode(...u.subarray(i,i+8192));return btoa(s)};
async function getFile(p){const r=await fetch(API+p+'?ref='+BR+'&t='+Date.now(),{headers:H(),cache:'no-store'});if(r.status==404)return null;if(!r.ok)throw new Error('GitHub '+r.status);const j=await r.json();return{sha:j.sha,text:new TextDecoder().decode(Uint8Array.from(atob(j.content.replace(/\n/g,'')),c=>c.charCodeAt(0)))}}
async function putFile(p,u,msg,sha){const r=await fetch(API+p,{method:'PUT',headers:{...H(),'Content-Type':'application/json'},body:JSON.stringify({message:msg,content:b64(u),branch:BR,...(sha?{sha}:{})})});const j=await r.json().catch(()=>({}));if(!r.ok)throw new Error(r.status==409||r.status==422?'File changed on GitHub. Close the panel, log in again and retry.':(j.message||r.status));return j}
const putText=(p,t,m,s)=>putFile(p,new TextEncoder().encode(t),m,s);
const D={};
async function load(n,p,def){const f=await getFile(p);D[n]={sha:f?f.sha:null,obj:f?JSON.parse(f.text):def}}
async function save(n,p,msg){const d=D[n],r=await putText(p,JSON.stringify(d.obj,null,2)+'\n',msg,d.sha);d.sha=r.content.sha}
async function go(label,fn){say(label+'...');try{await fn();say('Done. The live site updates in about a minute.',true)}catch(e){say('Failed: '+e.message,false)}}
/* remember this device: token encrypted with a passphrase, stored only in this browser */
const te=new TextEncoder(),td=new TextDecoder(),B=u=>btoa(String.fromCharCode(...u)),U=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
async function dk(pp,salt){const k=await crypto.subtle.importKey('raw',te.encode(pp),'PBKDF2',false,['deriveKey']);return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:250000,hash:'SHA-256'},k,{name:'AES-GCM',length:256},false,['encrypt','decrypt'])}
async function lock(pp,tok){const s=crypto.getRandomValues(new Uint8Array(16)),i=crypto.getRandomValues(new Uint8Array(12)),c=new Uint8Array(await crypto.subtle.encrypt({name:'AES-GCM',iv:i},await dk(pp,s),te.encode(tok)));localStorage.setItem('ghc',JSON.stringify({s:B(s),i:B(i),c:B(c)}))}
async function unlock(pp){const o=JSON.parse(localStorage.getItem('ghc')||'null');if(!o)throw 0;return td.decode(await crypto.subtle.decrypt({name:'AES-GCM',iv:U(o.i)},await dk(pp,U(o.s)),U(o.c)))}
function rSkills(){const b=$('#skl'),o=D.skills.obj;b.textContent='';
 Object.keys(o).forEach(g=>{const c=mk('div','','card');c.append(mk('h3',g));const t=mk('div','','tags');
  o[g].forEach((s,i)=>{const sp=mk('span',s+' ');const x=mk('button','x','rm');x.type='button';x.setAttribute('aria-label','Remove '+s);x.onclick=()=>{o[g].splice(i,1);rSkills()};sp.append(x);t.append(sp)});c.append(t);b.append(c)});
 const sel=$('#sg');sel.textContent='';Object.keys(o).forEach(g=>sel.append(mk('option',g)))}
function rClub(){const l=$('#cl'),a=D.clubs.obj[$('#cs').value].did;l.textContent='';a.forEach((t,i)=>{const li=mk('li',t+' ');const x=mk('button','remove','rm');x.type='button';x.onclick=()=>{a.splice(i,1);rClub()};li.append(x);l.append(li)})}
function rCerts(){const l=$('#ctl'),a=D.certs.obj;l.textContent='';a.forEach((c,i)=>{const d=mk('div','','card');d.append(mk('h3',c.t),mk('div',c.o+', '+c.n,'mute'));const x=mk('button','Remove from list','rm');x.type='button';x.onclick=()=>{a.splice(i,1);rCerts()};d.append(x);l.append(d)})}
async function shrink(f){const im=await createImageBitmap(f),s=Math.min(1,1400/im.width),c=document.createElement('canvas');c.width=Math.round(im.width*s);c.height=Math.round(im.height*s);c.getContext('2d').drawImage(im,0,0,c.width,c.height);const bl=await new Promise(r=>c.toBlob(r,'image/jpeg',.8));return new Uint8Array(await bl.arrayBuffer())}
let RAW=null;
async function loadRaw(){try{RAW=await getFile($('#rf').value);$('#rt').value=RAW?RAW.text:'[]'}catch(e){say('Failed: '+e.message,false)}}
const HTML=`<div class="ah"><b>Site admin</b><button class="btn" id="x" type="button">Close</button></div>
<div class="tabs" role="group" aria-label="Sections"><button class="btn" data-t="skills" aria-pressed="true">Skills</button><button class="btn" data-t="clubs">Clubs</button><button class="btn" data-t="certs">Certificates</button><button class="btn" data-t="raw">Raw JSON</button></div>
<section id="t-skills"><div id="skl" class="grid"></div><div class="row"><select id="sg" aria-label="Group"></select><input type="text" id="sn" placeholder="Skill name" aria-label="Skill name"><input type="text" id="sng" placeholder="or new group name" aria-label="New group"><button class="btn" id="sa" type="button">Add</button></div><button class="btn" id="ss" type="button">Save skills</button></section>
<section id="t-clubs" hidden><div class="row"><select id="cs" aria-label="Club"><option value="ecell">E-Cell</option><option value="genesys">Gene/sys</option></select></div><ul id="cl"></ul><div class="row"><input type="text" id="cn" placeholder="What I did" aria-label="Contribution"><button class="btn" id="ca" type="button">Add</button></div><button class="btn" id="cv" type="button">Save club</button></section>
<section id="t-certs" hidden><div id="ctl"></div><div class="card"><h3>Add a certificate</h3><div class="row"><input type="text" id="ct" placeholder="Title" aria-label="Title"><input type="text" id="co" placeholder="Issuer, date" aria-label="Issuer and date"></div><div class="row"><input type="text" id="cm" placeholder="Note, e.g. 1st prize" aria-label="Note"><input type="file" id="cf" accept="image/*" aria-label="Certificate image"><button class="btn" id="cadd" type="button">Upload and add</button></div></div><div class="row"><button class="btn" id="csv" type="button">Save certificates list</button></div></section>
<section id="t-raw" hidden><div class="row"><select id="rf" aria-label="File"><option>skills.json</option><option>clubs.json</option><option>certs.json</option><option>projects.json</option></select><button class="btn" id="rs" type="button">Save</button></div><textarea id="rt" spellcheck="false" aria-label="JSON"></textarea></section>
<div class="row dev"><input type="password" id="pp" placeholder="Passphrase (8+ chars) for this device" aria-label="Passphrase" autocomplete="off"><button class="btn" id="rb" type="button">Remember this device</button><button class="btn" id="fb" type="button">Forget</button><button class="btn" id="so" type="button">Sign out</button></div>
<div id="msg" role="status"></div>`;
const CSS=`#adm{background:var(--panel);color:var(--text);border:1px solid var(--line);border-radius:6px;padding:18px;width:min(94vw,900px);max-height:90vh;overflow:auto;margin:auto}#adm::backdrop{background:rgba(0,0,0,.82)}
#adm .ah{display:flex;justify-content:space-between;align-items:center;font:700 1.1rem var(--mono);color:var(--g)}#adm .tabs,#adm .row{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0;align-items:center}
#adm .btn{font:700 13px var(--mono);background:transparent;color:var(--g);border:1px solid var(--g);border-radius:3px;padding:7px 13px;cursor:pointer}#adm .btn:hover{background:rgba(61,255,138,.1)}#adm .btn[aria-pressed=true]{background:var(--g);color:#07100c}
#adm input[type=text],#adm input[type=password],#adm select,#adm textarea{background:var(--bg);border:1px solid var(--line);border-radius:3px;color:var(--text);font:14px var(--mono);padding:8px 10px;max-width:100%}#adm input[type=text]{width:220px}#adm textarea{width:100%;min-height:300px;font-size:12px}
#adm .tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}#adm .tags span{font:12px var(--mono);border:1px solid var(--line);padding:2px 4px 2px 8px;border-radius:3px}#adm .rm{background:none;border:0;color:#ff6b6b;cursor:pointer;font:700 13px var(--mono)}
#adm .card{margin-bottom:10px}#adm .dev{border-top:1px solid var(--line);padding-top:12px;margin-top:18px}#adm #msg{margin-top:12px;font:13px var(--mono)}#adm #msg.ok{color:var(--g)}#adm #msg.bad{color:#ff6b6b}`;
function build(){
 if(P)return;const st=document.createElement('style');st.textContent=CSS;document.head.append(st);
 P=document.createElement('dialog');P.id='adm';P.innerHTML=HTML;document.body.append(P);
 $('#x').onclick=()=>P.close();
 $('#so').onclick=()=>{TOK='';sessionStorage.removeItem('gh');P.close()};
 $('#fb').onclick=()=>{localStorage.removeItem('ghc');say('Forgot this device.',true)};
 $('#rb').onclick=async()=>{const pp=$('#pp').value;if(pp.length<8){say('Use at least 8 characters.',false);return}try{await lock(pp,TOK);$('#pp').value='';say('Remembered. On this device, sudo adminlogin followed by your passphrase will work.',true)}catch(e){say('Could not save: '+e.message,false)}};
 P.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{P.querySelectorAll('[data-t]').forEach(x=>x.setAttribute('aria-pressed',x==b));['skills','clubs','certs','raw'].forEach(n=>$('#t-'+n).hidden=n!=b.dataset.t);if(b.dataset.t=='raw')loadRaw()});
 $('#sa').onclick=()=>{const n=$('#sn').value.trim(),ng=$('#sng').value.trim(),o=D.skills.obj,g=ng||$('#sg').value;if(!n||!g)return;o[g]=o[g]||[];if(!o[g].includes(n))o[g].push(n);$('#sn').value=$('#sng').value='';rSkills()};
 $('#ss').onclick=()=>go('Saving skills',()=>save('skills','skills.json','Update skills (admin)'));
 $('#cs').onchange=rClub;
 $('#ca').onclick=()=>{const t=$('#cn').value.trim();if(!t)return;D.clubs.obj[$('#cs').value].did.push(t);$('#cn').value='';rClub()};
 $('#cv').onclick=()=>go('Saving club',()=>save('clubs','clubs.json','Update clubs (admin)'));
 $('#cadd').onclick=()=>go('Uploading certificate',async()=>{
  const t=$('#ct').value.trim(),o=$('#co').value.trim(),n=$('#cm').value.trim(),f=$('#cf').files[0];if(!t||!f)throw new Error('Title and image are required');
  const p='certs/'+t.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')+'.jpg',old=await getFile(p);
  await putFile(p,await shrink(f),'Add certificate image (admin)',old&&old.sha);
  D.certs.obj.push({t,o,n,f:p});await save('certs','certs.json','Add certificate (admin)');rCerts();$('#ct').value=$('#co').value=$('#cm').value=$('#cf').value=''});
 $('#csv').onclick=()=>go('Saving certificates',()=>save('certs','certs.json','Update certificates (admin)'));
 $('#rf').onchange=loadRaw;
 $('#rs').onclick=()=>go('Saving '+$('#rf').value,async()=>{const t=$('#rt').value;JSON.parse(t);const r=await putText($('#rf').value,t.endsWith('\n')?t:t+'\n','Edit '+$('#rf').value+' (admin)',RAW&&RAW.sha);RAW={sha:r.content.sha,text:t}});
}
window.Admin={async login(pw){
 let t=(pw||'').trim();if(!t)return 'fail';
 if(!/^(github_pat_|ghp_|gho_|ghs_)/.test(t)){try{t=await unlock(t)}catch(e){return 'fail'}}
 TOK=t;let r;try{r=await fetch('https://api.github.com/repos/'+REPO,{headers:H()})}catch(e){TOK='';return 'fail'}
 if(!r.ok){TOK='';return 'fail'}
 sessionStorage.setItem('gh',TOK);build();say('Loading...');P.showModal();
 try{await load('skills','skills.json',{});await load('clubs','clubs.json',{});await load('certs','certs.json',[]);rSkills();rClub();rCerts();say('Signed in. Changes are staged until you press a Save button.',true)}catch(e){say('Failed to load: '+e.message,false)}
 return 'ok'}};
})();
