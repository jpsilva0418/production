/* STUB — replaced by the bridal + services + about module. */
import { page, cover } from './layout.mjs';
import { BRIDAL, SERVICES, ABOUT } from './site.mjs';
export const bridal = (d) => page(d, { path: 'bridal', title: 'Bridal', description: 'Bridal.', css: ['story'], main: cover({ ghost: BRIDAL.ghost, kick: BRIDAL.kick, heading: BRIDAL.heading, sub: BRIDAL.sub }) });
export const services = (d) => page(d, { path: 'services', title: 'Services', description: 'Services.', css: ['story'], main: cover({ ghost: SERVICES.ghost, kick: SERVICES.kick, heading: SERVICES.heading, sub: SERVICES.sub }) });
export const about = (d) => page(d, { path: 'about', title: 'About', description: 'About.', css: ['story'], main: cover({ kick: ABOUT.kick, heading: ABOUT.heading, sub: '' }) });
