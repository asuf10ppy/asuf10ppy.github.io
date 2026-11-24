const $=s=>document.querySelector(s),mk=(t,x,c)=>{const e=document.createElement(t);if(x)e.textContent=x;if(c)e.className=c;return e};
function diagram(d){
 const X=[10,270,540],W=[130,140,130],R=22,P={},cy=[10,10,10];let g='',w='';
 d.parts.forEach((p,k)=>{
  const c=p.c,isL=s=>c==2||s[0]=='<',nl=p.pins.filter(isL).length,h=Math.max(nl,p.pins.length-nl,1)*R+30,y=cy[c];cy[c]+=h+18;
  g+=`<rect class="pt" x="${X[c]}" y="${y}" width="${W[c]}" height="${h}" rx="4"/><text class="pn" x="${X[c]+W[c]/2}" y="${y+17}" text-anchor="middle">${p.n}</text>`;
  let a=0,b=0;
  p.pins.forEach(s=>{const L=isL(s),i=L?a++:b++,x=L?X[c]:X[c]+W[c],yy=y+36+i*R;P[k+'|'+s]=[x,yy];
   g+=`<circle class="dot" cx="${x}" cy="${yy}" r="3.5"/><text class="pl" x="${x+(L?8:-8)}" y="${yy+4}" text-anchor="${L?'start':'end'}">${s.replace('<','')}</text>`});
 });
 d.wires.forEach((e,i)=>{const a=P[e[0]+'|'+e[1]],b=P[e[2]+'|'+e[3]],m=a[0]+(b[0]-a[0])*(.3+.13*(i%4));
  w+=`<path class="w ${e[4]}" pathLength="1" d="M${a[0]} ${a[1]}H${m}V${b[1]}H${b[0]}"/>`});
 return `<svg viewBox="0 0 680 ${Math.max(...cy)}" role="img" aria-label="Wiring diagram">${w}${g}</svg>`;
}
function sec(t){const s=mk('section');s.append(mk('h2',t));$('#body').append(s);return s}
function vid(u){
 const m=String(u).match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);if(!m)return null;
 const id=m[1],b=mk('button','','vid');b.type='button';b.setAttribute('aria-label','Play video');
 const im=mk('img');im.loading='lazy';im.alt='';im.src='https://i.ytimg.com/vi/'+id+'/hqdefault.jpg';b.append(im,mk('span','Play video','pl2'));
 b.onclick=()=>{const f=mk('iframe');f.src='https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0';f.allow='autoplay; encrypted-media; picture-in-picture';f.allowFullscreen=true;f.title='Project video';b.replaceWith(f)};
 return b}
fetch('projects.json').then(r=>r.json()).then(all=>{
 const p=all.find(x=>x.id===new URLSearchParams(location.search).get('p'));
 if(!p){$('#h').textContent='Project not found';const a=mk('a','See all projects');a.href='index.html#projects';$('#sum').append(a);return}
 document.title=p.title+' | Aditya S Uranakar';$('#h').textContent=p.title;$('#meta').textContent=p.date;$('#sum').textContent=p.desc;
 p.tags.forEach(t=>$('#tg').append(mk('span',t)));if(p.next)$('#sum').after(mk('div',p.next,'next'));
 if(p.videos&&p.videos.length){const s=sec('demo');p.videos.forEach(u=>{const v=vid(u);if(v)s.append(v)})}
 if(p.how){const s=sec('how-it-works'),o=mk('ol');p.how.forEach(t=>o.append(mk('li',t)));s.append(o)}
 if(p.parts){const s=sec('parts'),u=mk('ul');u.style.paddingLeft='20px';p.parts.forEach(t=>u.append(mk('li',t)));s.append(u,mk('p','Reference parts list, written from the project description.','mute'))}
 {const s=sec('circuit'),d=mk('div','','dg');d.innerHTML=diagram(p.d);s.append(d,mk('p',p.note,'mute'))}
 {const s=sec('code'),r=mk('div','','row'),c=mk('button','Copy','btn'),dl=mk('button','Download '+p.file,'btn');c.type=dl.type='button';
  c.onclick=async()=>{try{await navigator.clipboard.writeText(p.code);c.textContent='Copied'}catch(e){c.textContent='Copy failed'}setTimeout(()=>c.textContent='Copy',2000)};
  dl.onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([p.code],{type:'text/plain'}));a.download=p.file;a.click();URL.revokeObjectURL(a.href)};
  const pre=mk('pre'),code=mk('code');code.textContent=p.code;pre.append(code);r.append(c,dl);s.append(r,pre,mk('p','Reference code written from the project description, not my original sketch.','mute'))}
 if(p.links&&p.links.length){const s=sec('links'),r=mk('div','','row');p.links.forEach(l=>{const a=mk('a',l.text);a.href=l.url;a.target='_blank';a.rel='noopener';r.append(a)});s.append(r)}
 (window.reveal||(()=>{}))();
}).catch(()=>{$('#h').textContent='This page could not load'});
