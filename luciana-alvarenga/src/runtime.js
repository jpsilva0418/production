/* Shared runtime — ported from the Leti Silva v2 runtime (menu, stagger, reveals, ghost words,
   runway) plus demo additions: PT|EN, lazy in-view video, hero crossfade, mobile booking bar. */
(() => {
  const d = document, root = d.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = !!(navigator.connection && navigator.connection.saveData);
  const still = reduced || saveData;

  /* ---------- language ---------- */
  const DICT = window.__DICT;
  const KEY = 'la-lang';
  const applyLang = (lang) => {
    const t = DICT[lang] || DICT.pt;
    root.lang = lang === 'en' ? 'en' : 'pt-BR';
    d.querySelectorAll('[data-i18n]').forEach((el) => {
      const v = t[el.dataset.i18n]; if (v != null) el.innerHTML = v;
    });
    d.querySelectorAll('[data-i18n-label]').forEach((el) => {
      const v = t[el.dataset.i18nLabel]; if (v != null) el.setAttribute('aria-label', v);
    });
    d.title = t['meta.title'];
    d.querySelectorAll('.lang button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
  };
  let lang = 'pt';
  try { lang = localStorage.getItem(KEY) === 'en' ? 'en' : 'pt'; } catch (e) {}
  if (lang !== 'pt') applyLang(lang);
  d.querySelectorAll('.lang button').forEach((b) => b.addEventListener('click', () => {
    lang = b.dataset.lang; applyLang(lang);
    try { localStorage.setItem(KEY, lang); } catch (e) {}
  }));

  /* ---------- menu (inert + focus trap + Esc) ---------- */
  const menu = d.getElementById('menu'), openBtn = d.getElementById('menuOpen'), closeBtn = d.getElementById('menuClose');
  if (menu && openBtn && closeBtn) {
    const setMenu = (open) => {
      menu.classList.toggle('open', open);
      d.body.classList.toggle('menu-open', open);
      menu.setAttribute('aria-hidden', String(!open));
      menu.inert = !open;
      openBtn.setAttribute('aria-expanded', String(open));
      (open ? closeBtn : openBtn).focus();
    };
    openBtn.addEventListener('click', () => setMenu(true));
    closeBtn.addEventListener('click', () => setMenu(false));
    menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
    d.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu.classList.contains('open')) setMenu(false); });
    menu.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const f = menu.querySelectorAll('a[href],button'); const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && d.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && d.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  /* ---------- stagger + reveals ---------- */
  d.querySelectorAll('[data-stag]').forEach((s) => {
    const step = parseFloat(s.dataset.stag) || 0.08;
    [...s.children].forEach((c, i) => c.style.setProperty('--d', (i * step).toFixed(2) + 's'));
  });
  d.querySelectorAll('.swash path').forEach((p) => {
    try { p.style.setProperty('--len', Math.ceil(p.getTotalLength()) + 1); } catch (e) {}
  });
  const toReveal = d.querySelectorAll('.rv,.rv-im,.fade,.swash,.sheen');
  if (reduced || !('IntersectionObserver' in window)) toReveal.forEach((el) => el.classList.add('in'));
  else {
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -8% 0px' });
    toReveal.forEach((el) => io.observe(el));
  }
  if (!reduced && 'IntersectionObserver' in window) {
    const gio = new IntersectionObserver((es) => es.forEach((e) => e.target.classList.toggle('in', e.isIntersecting)), { threshold: 0.2 });
    d.querySelectorAll('.ghost-w').forEach((g) => gio.observe(g));
  }

  /* ---------- in-view video: load on approach, play in view, pause off-screen ---------- */
  const vids = d.querySelectorAll('video[data-src]:not(.hero-v)');
  if (!still && 'IntersectionObserver' in window) {
    const vio = new IntersectionObserver((es) => es.forEach((e) => {
      const v = e.target;
      if (e.isIntersecting) {
        if (!v.src) { v.src = v.dataset.src; }
        const p = v.play(); if (p && p.catch) p.catch(() => {});
      } else if (v.src) v.pause();
    }), { rootMargin: '200px 0px' });
    vids.forEach((v) => vio.observe(v));
  }

  /* ---------- hero: reel 1 → crossfade → reel 2 → back, poster-only when still ---------- */
  const hv = [...d.querySelectorAll('video.hero-v')];
  if (hv.length && !still) {
    let cur = 0;
    const start = (i) => {
      const v = hv[i];
      if (!v.src) v.src = v.dataset.src;
      v.currentTime = 0;
      const p = v.play(); if (p && p.catch) p.catch(() => {});
      v.classList.add('on');
      hv.forEach((o, j) => { if (j !== i) setTimeout(() => o.classList.remove('on'), 50); });
      // preload the next reel while this one plays
      const n = hv[(i + 1) % hv.length]; if (n !== v && !n.src) setTimeout(() => { n.src = n.dataset.src; n.load(); }, 2500);
    };
    hv.forEach((v, i) => {
      v.addEventListener('timeupdate', () => {
        if (hv.length > 1 && i === cur && v.duration && v.duration - v.currentTime < 1.3 && !v.dataset.x) {
          v.dataset.x = '1'; cur = (i + 1) % hv.length; start(cur);
          setTimeout(() => { delete v.dataset.x; v.pause(); }, 1500);
        }
      });
      if (hv.length === 1) v.loop = true;
    });
    start(0);
    // pause the hero when it is scrolled away
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((es) => es.forEach((e) => {
        const v = hv[cur]; if (!v.src) return;
        if (e.isIntersecting) { const p = v.play(); if (p && p.catch) p.catch(() => {}); } else v.pause();
      })).observe(hv[0].closest('section'));
    }
  }

  /* ---------- runway: pinned horizontal track ≥900px, native swipe below ---------- */
  const runway = d.querySelector('.runway');
  if (runway) {
    const wide = matchMedia('(min-width:900px)');
    const track = runway.querySelector('.rw-track'), vp = runway.querySelector('.rw-vp');
    let tick = false;
    const frame = () => {
      tick = false;
      if (!runway.classList.contains('rw-js')) return;
      const r = runway.getBoundingClientRect(), total = r.height - innerHeight;
      if (total <= 0) return;
      const p = Math.min(1, Math.max(0, -r.top / total));
      const maxX = Math.max(0, track.scrollWidth - vp.clientWidth);
      track.style.transform = `translate3d(${(-p * maxX).toFixed(1)}px,0,0)`;
    };
    const req = () => { if (!tick) { tick = true; requestAnimationFrame(frame); } };
    const mode = () => {
      const on = wide.matches && !reduced;
      runway.classList.toggle('rw-js', on);
      if (on) {
        const overflow = Math.max(0, track.scrollWidth - vp.clientWidth);
        runway.style.height = `calc(100svh + ${overflow}px)`;
        req();
      } else { runway.style.height = ''; track.style.transform = 'none'; }
    };
    mode();
    wide.addEventListener ? wide.addEventListener('change', mode) : wide.addListener(mode);
    addEventListener('scroll', req, { passive: true });
    addEventListener('resize', () => { mode(); req(); }, { passive: true });
    addEventListener('load', mode);
  }

  /* ---------- mobile booking bar (after the hero), back-to-top, edge-rail tone ---------- */
  const bar = d.querySelector('.mbar'), hero = d.querySelector('.hero');
  if (bar && hero && 'IntersectionObserver' in window) {
    new IntersectionObserver((es) => es.forEach((e) => bar.classList.toggle('show', !e.isIntersecting)), { threshold: 0.08 }).observe(hero);
  }
  const tt = d.getElementById('toTop');
  const edges = d.querySelectorAll('.edge');
  let et = false;
  const onScroll = () => {
    if (tt) tt.classList.toggle('show', scrollY > 600);
    if (edges.length && !et) {
      et = true;
      requestAnimationFrame(() => {
        et = false;
        edges.forEach((e) => {
          const x = e.classList.contains('edge--l') ? 20 : innerWidth - 20;
          const el = d.elementFromPoint(x, innerHeight / 2);
          const dark = !!(el && el.closest('.tone-dk,.tone-dk2,.hero--dark,.finale,.foot,.menu,.studio-tail'));
          e.classList.toggle('on-dark', dark);
        });
      });
    }
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  if (tt) tt.addEventListener('click', () => scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }));
})();
