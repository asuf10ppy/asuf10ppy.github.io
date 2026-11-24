(()=>{
 if(matchMedia('(prefers-reduced-motion:reduce)').matches||!('IntersectionObserver' in window)){window.reveal=()=>{};return}
 const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.06,rootMargin:'0px 0px -5% 0px'});
 window.reveal=()=>document.querySelectorAll('main section:not(.rv)').forEach(s=>{s.classList.add('rv');io.observe(s)});
 window.reveal();
})();
