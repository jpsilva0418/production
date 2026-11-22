# Premiere Insurance — website modernization (demo build)

A rebuild of `premiereinsuranceinc.com` that keeps the agency's identity, copy, URLs and
contact channels, and adds a prominent **Português | English** switch, a real two-way
**voice / text AI assistant**, and a **lead backend** that stores every inquiry and routes it
to the right queue.

**Status: demo for the agency to review. Not deployed, not connected to their systems.**
What is real, what is waiting on a decision, and what it costs: [`docs/OPEN_QUESTIONS.md`](docs/OPEN_QUESTIONS.md).

```bash
npm install
npm run dev                      # http://localhost:4321 — pages work; inquiries need a database
DATABASE_URL=postgres://… npm run db:migrate
```

## Two voice experiences (A / B)

Both are in every build; `PUBLIC_VOICE_MODE=panel|call` picks which one leads, and `?voice=panel`
or `?voice=call` switches it on any page for side-by-side review.

| | **A — assistant panel** (`panel`, default) | **B — tap once and talk** (`call`) |
|---|---|---|
| Entry | Card under the hero with **English \| Português** buttons; one tap opens the panel and starts talking in that language | Orb in the hero with **English \| Português** right under it; one tap asks for the microphone and starts a hands-free call |
| During | Transcript bubbles, mic button, typing box always available | Live captions; it listens again after every reply; tap to interrupt, tap to end |
| Finish | Editable review card in the panel | Editable review card in a bottom sheet |
| No microphone | Explains, switches to typing, offers a sample call | Explains, offers a sample call and typing |

Both use the same conversation engine, the same lead pipeline and the browser's own speech
services (free; no audio recorded). The **sample call** plays scripted customer lines against
the real engine and is labelled as a demonstration; it never sends a lead.

## What the audit of the live site found (2026-11-21)

| | Live site | This build |
|---|---|---|
| Platform | Webflow | Astro 7 (static pages + 5 server routes), deployable to Vercel |
| Languages | EN at `/`, `/en/*`; PT `/pt/*`; ES `/es/*` — switch buried in the menu and footer | Same URLs, unchanged. `Português \| English` always in the header; Spanish kept in the menu and footer |
| Brand | "Premiere Insurance" / "Premiere Insurance Agency" / "Premiere Insurance Inc" | Same spellings, same logo files, same orange/black, Impact-style display type |
| Form | Webflow native form (recipients are set inside Webflow — not visible from outside) | Same fields + contact preference; posts to `/api/leads` |
| Chat | Callbell widget, auto-loaded, typed only, asks name + phone in five languages at once | Kept, but opt-in and behind one contact menu so there are never two chat bubbles |
| Other | WhatsApp link, Google Maps embed, GTM `GTM-N358X889`, Elfsight Google reviews, an ads-measurement pixel | WhatsApp and the map are live. GTM, Elfsight and Callbell are wired behind `PUBLIC_ENABLE_*` flags (off in the demo). The ads pixel is **not** carried over — the agency decides whether it still wants it |

## Layout

```
src/
  content/      site.ts (verified business facts, asset URLs) · services.json · privacy.json (verbatim from the live site)
  i18n/         one dictionary, three locales; new strings marked NEW for the agency's review
  pages/        / · /pt/home · /es/home · /[lang]/[slug] · /staff/leads · /api/*
  components/   Header (language switch) · HomePage · Sections (contact/visit/carriers) · Assistant · ContactForm
  client/       assistant.ts (voice + text) · site.ts (menu, language memory, form)
  server/
    leads/      schema (validation) · routing (queues) · store (Postgres) · delivery (email/CRM, retries) · pipeline
    assistant/  guided.ts (no-provider engine) · llm.ts (Claude) · kb.ts (facts from the site only)
db/schema.sql   leads, lead_deliveries, lead_events (audit), rate_limits — RLS on, no policies
tests/unit      54 tests — validation, routing, pipeline against real PostgreSQL, conversation engine
tests/e2e       browser tests — both languages, both voice modes, text, failures, security, phone intake
```

## Tests

Both suites need a real PostgreSQL and **fail rather than skip** without one, so green always
means the database behaviour was exercised.

```bash
TEST_DATABASE_URL=postgres://postgres@127.0.0.1:5432/premiere_test npm test
npm run build:node
E2E_DATABASE_URL=postgres://postgres@127.0.0.1:5432/premiere_e2e npm run e2e
```

In the browser tests the microphone and loudspeaker are stand-ins (CI has neither); the
conversation engine, the API routes and the database behind them are the real ones.
**No test here proves behaviour on a physical iPhone** — see the open questions.

## Single-file previews

```bash
PUBLIC_DEMO_BANNER=true npm run build:node
node scripts/preview/build.mjs preview/premiere-A-panel.html --mode=panel
node scripts/preview/build.mjs preview/premiere-B-call.html --mode=call
```
Photos, textures, logos, fonts and the two homepage videos are embedded (videos need `ffmpeg`),
so the file works offline. There is no server in a preview: nothing is stored and reference
numbers read `SAMPLE-…`. Voice works only where the viewer grants microphone access — a real
browser does; most in-app file viewers do not.

## Media

Photos, video and logos load from the agency's existing Webflow CDN, exactly as their live
site does. Nothing of theirs is copied into this repository. If they leave Webflow the files
must be moved first (one manifest: `src/content/site.ts`).
