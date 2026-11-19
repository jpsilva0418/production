/* STUB — replaced by the hero module (three compositions + entrance). */
import { SITE, HERO, DIRS, inquire, book } from './site.mjs';
export const heroHead = () => '';
export const heroCss = ['hero'];
export const heroJs = ['hero'];
export const hero = (d) => `<section class="plg" id="hero" data-pin data-chapter="hero" data-tone="${DIRS[d].heroTone}" aria-label="${HERO.label}">
  <div class="plg-c"><h1 class="plg-logo">${SITE.name}</h1><div class="plg-ctas">${inquire(d, HERO.cta, 'btn btn--ivory')}${book('event', HERO.second, 'btn btn--ghost')}</div></div>
</section>`;
