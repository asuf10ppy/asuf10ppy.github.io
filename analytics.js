(()=>{
 const GC_CODE='';   // your GoatCounter site code, e.g. 'asuf10ppy' (from asuf10ppy.goatcounter.com). Leave empty to keep analytics off.
 if(!GC_CODE)return;
 const s=document.createElement('script');s.async=true;s.src='https://gc.zgo.at/count.js';s.dataset.goatcounter='https://'+GC_CODE+'.goatcounter.com/count';document.head.append(s);
 addEventListener('DOMContentLoaded',()=>{const f=document.querySelector('footer');if(f)f.append(' Anonymous visit counts via GoatCounter, no cookies.')});
})();
