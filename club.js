const $=s=>document.querySelector(s),mk=(t,x,c)=>{const e=document.createElement(t);if(x)e.textContent=x;if(c)e.className=c;return e};
fetch('clubs.json').then(r=>r.json()).then(all=>{
 const c=all[document.body.dataset.club];
 $('#h').textContent=c.name;$('#meta').textContent=c.role+', '+c.dates;$('#sum').textContent=c.summary;
 c.links.forEach(l=>{const a=mk('a',l.text);a.href=l.url;a.target='_blank';a.rel='noopener';$('#links').append(a)});
 c.did.forEach(t=>$('#did').append(mk('li',t)));
 if(c.featured&&c.featured.length){const f=$('#feat');f.append(mk('h2','highlights'));
  c.featured.forEach(x=>{const d=mk('div','','card');d.append(mk('h3',x.title),mk('p',x.text));if(x.url){const a=mk('a',x.linkText||'Open');a.href=x.url;d.append(a)}f.append(d)})}
}).catch(()=>{$('#h').textContent='This page could not load'});
