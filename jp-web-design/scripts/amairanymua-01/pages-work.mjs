/* STUB — replaced by the portfolio + reviews module. */
import { page, cover } from './layout.mjs';
import { PORTFOLIO_PAGE, REVIEWS } from './site.mjs';
export const portfolio = (d) => page(d, { path: 'portfolio', title: 'Portfolio', description: 'Portfolio.', css: ['work'], main: cover({ ghost: PORTFOLIO_PAGE.ghost, kick: PORTFOLIO_PAGE.kick, heading: PORTFOLIO_PAGE.heading, sub: PORTFOLIO_PAGE.sub(0) }) });
export const reviews = (d) => page(d, { path: 'reviews', title: 'Reviews', description: 'Reviews.', css: ['work'], main: cover({ ghost: REVIEWS.ghost, kick: REVIEWS.kick, heading: REVIEWS.heading, sub: REVIEWS.sub }) });
