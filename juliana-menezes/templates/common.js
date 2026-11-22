(function(){
  var root=document.documentElement; root.classList.add('js');
  try{var saved=localStorage.getItem('jm-lang'); if(saved) root.lang=saved;}catch(e){}
  function sync(){document.querySelectorAll('[data-lang]').forEach(function(b){
    b.setAttribute('aria-pressed', String((root.lang==='en')===(b.dataset.lang==='en')));});}
  document.querySelectorAll('[data-lang]').forEach(function(b){b.addEventListener('click',function(){
    root.lang=b.dataset.lang==='en'?'en':'pt-BR'; try{localStorage.setItem('jm-lang',root.lang);}catch(e){} sync();});});
  sync();
  var nav=document.querySelector('[data-nav-toggle]');
  if(nav){nav.addEventListener('click',function(){var o=document.body.classList.toggle('nav-open');nav.setAttribute('aria-expanded',String(o));});
    document.querySelectorAll('.nav a').forEach(function(a){a.addEventListener('click',function(){document.body.classList.remove('nav-open');nav.setAttribute('aria-expanded','false');});});}
  function sc(){document.body.classList.toggle('scrolled',scrollY>innerHeight*.75)} addEventListener('scroll',sc,{passive:true}); sc();
  var els=document.querySelectorAll('.reveal');
  if(!('IntersectionObserver' in window)||matchMedia('(prefers-reduced-motion: reduce)').matches){els.forEach(function(e){e.classList.add('in')});return;}
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}})},{rootMargin:'0px 0px -8% 0px'});
  els.forEach(function(e){io.observe(e)});
})();
