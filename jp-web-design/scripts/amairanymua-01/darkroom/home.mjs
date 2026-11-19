/* /demo/amairanymua-01 — site "darkroom": the home page.

   1. The opening: under a red safelight a blank print lies in a tray; her photograph develops
      on it (precomputed stages, never a CSS filter), "Glam By Amairanymua" is written on its
      border in grease pencil, and the print lifts out of the tray into its place as the first
      print of the hero's stack while the room lights to the page.
   2. The hero: a stack of prints coming up. Every few seconds a new print drops onto the stack
      and develops on top (paper -> faint -> mid -> her photograph); her reels arrive as strips
      of 35mm. Never two faces dissolved through each other.
   3. Two ways to book (the bride, the event), her About right under.
   4. The contact sheet: choose a frame and it develops as a print beside a reel of her work.
   5. The price board, Love Notes on a line, the journal, the end card. */
import { SITE, HER, HERO, MONTAGE, PATHS, FINAL, LOOKS, PHOTOS, href, inquire, book, arrow, src, srcset, esc } from '../site.mjs';
import { S, D, page, print, strip, sheet, kick, h, note, ring, booking, actions, more, edge, chapter, band, board, loveNotes, POSTS, postCard, cta, signature, tick } from './shell.mjs';

const pad = (n) => String(n).padStart(2, '0');

/* ---------- 1 + 2: the opening and the hero ---------- */
const STACK_SIZES = '(max-width:759px) 76vw, (max-width:1279px) 40vw, 480px';
const LEAD = MONTAGE[0].photo; /* bride-crystal: the print that develops in the opening (LCP) */

const stackItem = (beat, i) => {
  /* resting stack: the first print on top, the last two beneath it (the next to drop is MONTAGE[1]) */
  const last = MONTAGE.length - 1;
  const d = i === 0 ? 'd0' : i === last ? 'd1' : i === last - 1 ? 'd2' : 'dx';
  const n = `${pad(i + 1)}A`;
  const hidden = i === 0 ? '' : ' aria-hidden="true"';
  if (beat.film) {
    return `<div class="st-i st-i--film ${d}" data-i="${i}" data-label="Film &middot; ${beat.label}"${hidden}>${strip(beat.film, { n, label: beat.label })}</div>`;
  }
  let pr = print(beat.photo, {
    n, sizes: STACK_SIZES, eager: i === 0, dev: 'manual',
    note: i === 0 ? `<span class="p0-sig">${signature()}</span>` : beat.label,
    cls: i === 0 ? 'p0' : '',
  });
  /* the three resting prints and the next to drop load with the page; the rest load a turn ahead */
  if (d === 'dx' && i !== 1) pr = pr.replace(' srcset="', ' data-srcset="').replace(' src="', ' data-src="');
  /* the opening's safelight wash and liquid sheen, on the first print only (transitions only) */
  if (i === 0) pr = pr.replace('</figure>', '<i class="pr-wash" aria-hidden="true"></i><i class="pr-shim" aria-hidden="true"><i></i></i></figure>');
  return `<div class="st-i ${d}" data-i="${i}" data-label="${beat.label}"${hidden}>${pr}</div>`;
};

/* Decides, before the hero is parsed, whether the opening plays (contract in BRIEF.md). */
const GATE = `<script>(function(){var d=document.documentElement;try{var q=location.search,force=/[?&]intro=1(&|$)/.test(q);if(/[?&]intro=0(&|$)/.test(q))return;if(!document.body.animate)return;
if(!force){if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;if(navigator.connection&&navigator.connection.saveData)return;if(sessionStorage.getItem('am01-intro-darkroom'))return;if(location.hash||window.scrollY>40)return;}
try{sessionStorage.setItem('am01-intro-darkroom','1')}catch(e){}
d.classList.add('intro');['l','m'].forEach(function(k){var i=new Image();i.src='${D}/dev/${LEAD}-'+k+'-800.webp'});
setTimeout(function(){if(!d.classList.contains('intro-run'))d.classList.remove('intro')},2500);}catch(e){d.classList.remove('intro')}})();</script>`;

/* The opening itself (runs right after the hero is parsed). One continuous print: the hero's own
   first print is measured in its resting place, started from the tray at the centre of the screen
   (inverted transform) and played back to its own layout, so the end state IS the page.
     0.00–0.60  the safelight glow fades up; the tray and its blank sheet appear; a sheen crosses the paper
     0.30–1.70  the print develops: paper -> faint -> mid -> her photograph (opacity on stacked layers)
     1.40–2.00  "Glam By Amairanymua" is written on the border (clip-path wipe)
     2.00–3.00  the print lifts out of the tray, straightens and settles into the stack; the wash of
                red light leaves it; the header, the headline, the actions and the stack arrive
   Only transform, opacity and clip-path, on wrappers. When it ends, every animation is cancelled in
   the same frame as the pre-state class is removed. Any wheel, touch, pointer or key finishes it. */
const RUN = `<script>(function(){var d=document.documentElement;if(!d.classList.contains('intro'))return;d.classList.add('intro-run');
var q=function(s,c){return (c||document).querySelector(s)},qa=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
var anims=[],ended=false,T=3000,evs=['wheel','touchmove','pointerdown','keydown'];
var done=function(){if(ended)return;ended=true;d.classList.remove('intro','intro-run');anims.forEach(function(a){try{a.cancel()}catch(e){}});evs.forEach(function(t){removeEventListener(t,skip,true)});window.__drIntroDone=true;try{document.dispatchEvent(new CustomEvent('dr:intro-end'))}catch(e){}};
var skip=function(e){if(e&&e.type==='keydown'&&(e.key==='Tab'||e.key==='Shift'))return;anims.forEach(function(a){try{a.finish()}catch(x){}});done();};
try{
var it=q('.stack .st-i.d0'),pr=it&&q('.pr',it),tray=q('.hero .tray');if(!pr)throw 0;
var W=pr.offsetWidth,H=pr.offsetHeight,r=pr.getBoundingClientRect(),vw=innerWidth,vh=window.visualViewport?visualViewport.height:innerHeight;
var cx=r.left+r.width/2,cy=r.top+r.height/2,s0=Math.max(.8,Math.min(1.5,Math.min(vw*.72/W,vh*.6/H)));
var sx=vw/2-cx,sy=vh*.5-cy,a=-2*Math.PI/180,lx=sx*Math.cos(a)+sy*Math.sin(a),ly=-sx*Math.sin(a)+sy*Math.cos(a);
tray.style.width=Math.round(W*s0+Math.min(64,vw*.1))+'px';tray.style.height=Math.round(H*s0+Math.min(64,vw*.1))+'px';tray.style.left=Math.round(vw/2)+'px';tray.style.top=Math.round(vh*.5)+'px';
var A=function(el,kf,o){if(!el)return;var x=el.animate(kf,Object.assign({duration:T,fill:'both'},o));anims.push(x);return x};
var f=function(t){return t/T};
var from='translate('+lx.toFixed(1)+'px,'+ly.toFixed(1)+'px) rotate(-2deg) scale('+s0.toFixed(3)+')';
var lift='translate('+(lx*.86).toFixed(1)+'px,'+(ly*.86-22).toFixed(1)+'px) rotate(-1deg) scale('+(s0*1.035).toFixed(3)+')';
A(pr,[{transform:from},{transform:from,offset:f(2000),easing:'cubic-bezier(.45,0,.3,1)'},{transform:lift,offset:f(2340),easing:'cubic-bezier(.3,0,.15,1)'},{transform:'none'}]);
A(tray,[{opacity:0,transform:'translate(-50%,-50%) rotate(-4deg) scale(.96)'},{opacity:1,transform:'translate(-50%,-50%) rotate(-4deg) scale(1)',offset:f(420)},{opacity:1,transform:'translate(-50%,-50%) rotate(-4deg) scale(1)',offset:f(2050)},{opacity:0,transform:'translate(-50%,-50%) rotate(-4deg) scale(.985)',offset:f(2700)},{opacity:0,transform:'translate(-50%,-50%) rotate(-4deg) scale(.985)'}]);
A(q('.hero-glow'),[{opacity:0,easing:'ease-out'},{opacity:1,offset:f(650)},{opacity:1}]);
var DE='cubic-bezier(.55,.06,.45,.94)';
A(q('.dv-p',pr),[{opacity:1},{opacity:1,offset:f(300),easing:DE},{opacity:0,offset:f(760)},{opacity:0}]);
A(q('.dv-l',pr),[{opacity:1},{opacity:1,offset:f(760),easing:DE},{opacity:0,offset:f(1250)},{opacity:0}]);
A(q('.dv-m',pr),[{opacity:1},{opacity:1,offset:f(1250),easing:DE},{opacity:0,offset:f(1720)},{opacity:0}]);
A(q('.pr-wash',pr),[{opacity:1},{opacity:1,offset:f(1950),easing:'ease-in-out'},{opacity:0,offset:f(2650)},{opacity:0}]);
A(q('.pr-shim i',pr),[{opacity:0,transform:'translate3d(-120%,0,0) skewX(-14deg)'},{opacity:1,offset:f(250)},{opacity:.85,offset:f(1250)},{opacity:0,transform:'translate3d(140%,0,0) skewX(-14deg)',offset:f(1700)},{opacity:0,transform:'translate3d(140%,0,0) skewX(-14deg)'}]);
A(q('.p0-sig',pr),[{clipPath:'inset(-30% 100% -30% -4%)'},{clipPath:'inset(-30% 100% -30% -4%)',offset:f(1400)},{clipPath:'inset(-30% -4% -30% -4%)',offset:f(2050)},{clipPath:'inset(-30% -4% -30% -4%)'}],{easing:'linear'});
var fade=function(el,delay,dur,y){if(!el)return;A(el,[y?{opacity:0,transform:'translate3d(0,'+y+'px,0)',offset:0}:{opacity:0,offset:0}],{duration:dur,delay:delay,easing:'cubic-bezier(.2,.8,.2,1)'})};
fade(q('.hd-inq'),450,600);
qa('.hd-wm,.hd-nav,.hd-ev,.hd-menu',q('#siteHeader')).forEach(function(el){fade(el,2150,700)});
qa('.stack .st-i.d1>*,.stack .st-i.d2>*').forEach(function(el,i){fade(el,2700+i*60,420)});
qa('.hero-txt>*').forEach(function(el,i){fade(el,2150+i*80,760,i>2?14:20)});
fade(q('.st-ctl'),2650,600);
Promise.all(anims.map(function(x){return x.finished})).then(done,done);
evs.forEach(function(t){addEventListener(t,skip,{capture:true,passive:true})});
addEventListener('pagehide',done,{once:true});setTimeout(done,T+1800);
}catch(e){done()}})();</script>`;

const hero = () => `${GATE}
<section class="hero" id="top" aria-label="${esc(HERO.label)}">
<span class="grain" aria-hidden="true"></span>
<span class="hero-glow" aria-hidden="true"></span>
<span class="tray" aria-hidden="true"></span>
<div class="hero-in">
<div class="stack-w">
<div class="stack" id="stack" role="group" aria-roledescription="slideshow" aria-label="${SITE.first}’s looks, one print after another">
${MONTAGE.map(stackItem).join('\n')}
</div>
<div class="st-ctl" id="stackCtl">
<button class="st-b" id="stPause" type="button" aria-pressed="false"><span class="st-ic" aria-hidden="true"></span><span class="st-bt">Pause</span></button>
<p class="st-count edge" id="stCount"><span class="st-n">01</span> / ${pad(MONTAGE.length)} <span class="st-l">${MONTAGE[0].label}</span></p>
<button class="st-b st-next" id="stNext" type="button" aria-label="Next print"><span class="st-bt" aria-hidden="true">Next</span> ${arrow}</button>
</div>
</div>
<div class="hero-txt">
<p class="hero-k edge">${SITE.name} &middot; ${SITE.tagline} &middot; ${SITE.area}</p>
<h1 class="hero-h d-xl"><span class="hero-l"><span class="nw">Real-life</span> filter skin.</span> <span class="hero-l hero-l2">Never <span class="hero-cake">cakey.${note('Cake free!', { rot: -8, cls: 'hero-gp' })}</span></span></h1>
<p class="hero-line">${HERO.line}</p>
${booking('hero-nowb')}
${actions()}
</div>
</div>
</section>
${RUN}`;

/* ---------- 3: two ways to book, then About right under ---------- */
const promise = HER.afterInquiry.replace('Thank you for reaching out! ', '').replace('24 to 48 hours', ring('24 to 48 hours'));
const ways = () => `<section class="band band--paper ways" id="book" aria-labelledby="ways-h">
<div class="wrap">
<header class="ways-hd">
${kick('Two ways to book', { n: '02', cls: 'rv' })}
<h2 class="d-l rv" id="ways-h" style="--d:.06s">Brides inquire. <span class="h-b">Events book.</span></h2>
</header>
<div class="ways-g">
<article class="way way--bride rv" style="--d:.1s">
${print(PATHS[0].plate, { shape: 'land', n: '02A', note: 'the bride', tilt: -1.4, sizes: '(max-width:759px) 44vw, 40vw', stage: 480 })}
<div class="way-tx">
<p class="edge way-k">${PATHS[0].kicker} &middot; on-site inquiry</p>
<h3 class="d-m way-h">${PATHS[0].title}</h3>
<p class="way-body">${PATHS[0].body}</p>
<p class="way-promise"><span class="edge">From her inquiry form</span><span class="way-q">&ldquo;${promise}&rdquo;</span></p>
${inquire(S, `<span class="l-long">Start your bridal inquiry</span><span class="l-short">Inquire</span> ${arrow}`, 'btn btn--main way-btn')}
</div>
</article>
<article class="way way--event rv" style="--d:.2s">
${print(PATHS[1].plate, { shape: 'land', n: '03A', note: 'the event', tilt: 1.6, sizes: '(max-width:759px) 44vw, 40vw', stage: 480 })}
<div class="way-tx">
<p class="edge way-k">Events &amp; everyday glam &middot; her booking page</p>
<h3 class="d-m way-h">${PATHS[1].title}</h3>
<p class="way-body">${PATHS[1].body}</p>
<ul class="way-pts">${PATHS[1].points.map((p) => `<li>${p}</li>`).join('')}</ul>
${book('event', `<span class="l-long">Book event makeup &amp; hair</span><span class="l-short">Book event</span> ${arrow}`, 'btn btn--line way-btn')}
</div>
</article>
</div>

<div class="about" id="about">
<div class="about-pr">
${print('artist-brushes', { shape: 'tall', n: '04A', tilt: 2.2, sizes: '(max-width:759px) 70vw, 34vw' })}
<p class="about-edge edge" aria-hidden="true">${HER.years.map(([k, v]) => `${v} ${k.toLowerCase()}`).join(' &#9656; ')} &#9656; ${HER.badges.join(' &#9656; ')}</p>
</div>
<div class="about-tx">
${kick(`About ${SITE.first}`, { n: '03', cls: 'rv' })}
<h2 class="d-l about-h rv" style="--d:.06s">Hey Gorgeous! <span class="h-b">I’m Amairany.</span></h2>
<blockquote class="about-q prose rv" style="--d:.12s">
${HER.about.map((p) => `<p>${p.replace('“CAKE FREE”', ring('“CAKE FREE”'))}</p>`).join('\n')}
</blockquote>
<p class="edge about-src rv" style="--d:.16s">${SITE.first}, in her own words</p>
<dl class="about-yrs rv" style="--d:.2s">${HER.years.map(([k, v]) => `<div><dt>${k}</dt><dd>${v.replace(' years', '<span> years</span>')}</dd></div>`).join('')}</dl>
<ul class="about-badges rv" style="--d:.24s">${HER.badges.map((b) => `<li>${tick()}<span class="edge">${b}</span></li>`).join('')}</ul>
<div class="rv" style="--d:.28s">${more(href(S, 'about'), `More about ${SITE.first}`)}</div>
</div>
</div>
</div>
</section>`;

/* ---------- 4: the contact sheet and the enlarger ---------- */
const FIRST = 3; /* bride-gold-waves is on the enlarger first */
const work = () => band(`${chapter({ kick: 'The contact sheet', n: '04', heading: ['Pick a frame.', 'Watch it come up.'], lead: 'Real clients in real light. Choose any frame on the sheet and it develops as a print, right beside a reel of her work.', split: true })}
<div class="work-g">
<div class="work-pair">
<div class="enl" id="enl">
${print(LOOKS[FIRST].photo, { n: `${FIRST + 1}A`, dev: 'manual', sizes: '(max-width:759px) 54vw, 30vw', cls: 'enl-pr', attrs: 'id="enlPr"' })}
<p class="enl-cap edge" id="enlCap" aria-live="polite"><span class="enl-n">&#9656; ${FIRST + 1}A</span> ${LOOKS[FIRST].cap}</p>
</div>
<div class="work-film">
${strip('f3', { n: '11A', label: 'Getting ready' })}
<p class="edge work-film-cap">Film 03 &middot; getting ready</p>
</div>
</div>
<div class="work-sheet">
${sheet(LOOKS.map((l, i) => ({ photo: l.photo, cap: l.cap, pick: [0, 5, 8].includes(i) })), { buttons: true, cols: 5, label: 'Contact sheet: choose a frame to print it', sizes: '(max-width:759px) 18vw, 9vw' })}
<div class="work-foot"><p class="edge work-hint">${note('picks', { rot: -6, cls: 'gp--sm' })} ${tick()} <span>Tap any frame to print it</span></p>${more(href(S, 'portfolio'), 'Open the portfolio')}</div>
</div>
</div>`, { tone: 'room', id: 'work', cls: 'work', label: 'The contact sheet' });

/* ---------- 5: the price board ---------- */
const pick = ['The Luxe Bride', 'The Signature Soiree', 'The Luxe Gala'].map((n) => HER.packages.find((p) => p.name === n));
const prices = () => band(`<div class="pb">
<div class="pb-tx">
${kick('The price board', { n: '05', cls: 'rv' })}
${h(2, ['Three bridal', 'packages, as listed.'], 'd-l rv', 'style="--d:.06s"')}
<p class="lead rv" style="--d:.12s">Three of her six bridal packages, with the prices on her booking page. All six, with everything they include, are on the Bridal page.</p>
<div class="pb-acts rv" style="--d:.18s">${inquire(S, `Bridal inquiry ${arrow}`, 'btn btn--main')}${more(href(S, 'bridal'), 'See all six packages')}</div>
</div>
<div class="pb-board rv" style="--d:.1s">${board({ pkgs: pick, points: 3 })}</div>
</div>`, { tone: 'paper', id: 'packages', label: 'Bridal packages' });

/* ---------- 6: Love Notes ---------- */
const love = () => band(`${chapter({ kick: `${HER.links.reviewsName} &middot; ${HER.links.reviewsLine.toLowerCase()}`, n: '06', heading: ['Love Notes,', 'hung up to dry.'], lead: 'Her reviews live where her clients wrote them. One tap opens each site, in full.', split: true })}
<div class="rv" style="--d:.1s">${loveNotes()}</div>`, { tone: 'room', id: 'love', cls: 'love', label: 'Love Notes' });

/* ---------- 7: journal ---------- */
const journal = () => band(`${chapter({ kick: 'Journal', n: '07', heading: ['Notes from', 'the chair.'], lead: 'Her own advice, in her own words, for brides getting ready.', split: true })}
<div class="posts">${POSTS.map((p, i) => `<div class="rv" style="--d:${(0.08 * i).toFixed(2)}s">${postCard(p)}</div>`).join('')}</div>
<div class="posts-more rv">${more(href(S, 'journal'), 'All notes')}</div>`, { tone: 'paper', id: 'journal', cls: 'journal-b', label: 'Journal' });

export const home = () => page({
  path: '',
  title: 'Bridal Hair & Makeup Artist, Orlando + Tampa',
  description: `${SITE.name}, luxury bridal hair and makeup artist in ${SITE.areaLong}: real-life-filter skin, soft glam to full glam and glam waves. ${HER.booking.replace('&amp;', '&')}.`,
  head: `<link rel="preload" as="image" href="${src(LEAD, 800)}" imagesrcset="${srcset(LEAD)}" imagesizes="${STACK_SIZES}" fetchpriority="high">`,
  css: ['home'],
  js: ['home'],
  bodyClass: 'home',
  sprite: 'name',
  main: `${hero()}
${ways()}
${work()}
${prices()}
${love()}
${journal()}
${cta({ heading: FINAL.heading, copy: FINAL.line, scrawl: 'I’d love to have you in my chair!' })}`,
});
