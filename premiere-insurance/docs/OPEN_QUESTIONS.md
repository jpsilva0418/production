# Approvals, unknowns and costs

Nothing below has been done. Each item is waiting on a named person's yes.

## A. Needs approval before it is switched on

| # | Item | Why it is gated | Recurring cost (estimates — confirm before approving) |
|---|---|---|---|
| A1 | **Preview deployment** (Vercel project + a Postgres database, e.g. Supabase) | Creates infrastructure under an account and puts the agency's brand on a public URL | Vercel Hobby is free but is for non-commercial use; a business site needs Pro, about $20/month per seat. Supabase: free tier may be enough for a pilot; Pro is about $25/month |
| A2 | **Claude as the assistant's brain** (`ANTHROPIC_API_KEY`) | Paid, and sends customer conversation text to a third-party AI provider | Default model `claude-opus-5-5`: roughly $0.12–$0.25 per ten-turn conversation, so about $35–$75/month at 300 conversations. `claude-haiku-5-5` is faster and far cheaper (about $1–$2/month at the same volume) — a cost/quality choice for the agency. Computed from list prices and an assumed conversation length; not measured |
| A3 | **Email delivery of leads** (Resend key + a verified sending domain) | Needs DNS records on a domain the agency controls, and real rep addresses | Free tier is expected to cover this volume; confirm on Resend's pricing page |
| A4 | **Premium realtime voice for B** (server-side streaming speech, like the reference site's call widget) | Paid per minute; sends customer **audio** to a provider, which changes the privacy disclosure. It is what makes B fully hands-free on every phone, understand either language without choosing, and work inside Instagram's browser | Not quoted. Per-minute pricing varies by provider and changes often — get a current quote |
| A5 | **Phone-answering AI** | Touches live call routing; recording law; paid per minute | See `PHONE.md`. Not quoted |
| A6 | **Turning on GTM, Elfsight reviews and Callbell** on the new site (flags exist), and deciding whether to re-add the ads-measurement pixel (not carried over) | They write into the agency's real analytics and chat inbox | Already paid for by the agency, if they are still subscribed |
| A7 | **Production cutover** (DNS from Webflow to the new host) | Replaces the live site | — |

Until A2 is approved the assistant runs on the **guided engine**: a real, deterministic
conversation (no AI provider, no cost) that answers only from the site's published content.
It is less flexible with unusual phrasing than a language model. Until A1/A3, leads are
proven against a local PostgreSQL and a scripted email provider only.

## B. Facts only the agency can confirm

1. **Who receives leads today**, and who should receive personal vs commercial inquiries. The
   live form's recipients live inside Webflow.
2. **Which CRM / agency management system** they use, if any. None is visible from the website.
3. **Is the Clinton office current?** It appears on every service page and on the Portuguese
   and Spanish home pages, but not on the English home page. This build shows it everywhere.
4. **Phone carrier and after-hours handling** for (978) 221-0139.
5. **Is Callbell still staffed?** It greets in five languages (English, Spanish, Portuguese,
   Kreyòl, French). This build keeps it available but does not auto-load it.
6. **Legal name / brand.** The site uses "Premiere Insurance", "Premiere Insurance Agency" and
   "Premiere Insurance Inc"; the privacy policy says "Premiere Advisors" and
   `helpdesk@premiereadvisors.com`; the map pin is "Premiere Advisors, Inc – Premiere Broker,
   Inc". This build repeats each exactly where the live site uses it and changes none.
7. **Copyright year.** Home says 2026, inner pages say 2024. This build uses the current year.

## C. Needs the agency's (and their counsel's) review — written by an engineer, not a lawyer

- The assistant's **AI disclosure and consent text** in all three languages (`src/i18n`, strings marked NEW).
- The **Portuguese and Spanish SMS-consent text** on the form. The live Portuguese and Spanish
  forms have *no* SMS consent line at all; these are translations of the English one.
- The **privacy policy is reproduced verbatim**, including the fact that the live Portuguese
  version is in English. It does not yet mention the AI assistant, conversation data, or the
  speech processing done by the visitor's browser vendor. It needs an update before launch.
- **Data retention** for leads and consented transcripts.
- Any **recording or transcription of phone calls** (`PHONE.md`).

## D. Not verified

- **No physical iPhone or Android device was used.** Voice was exercised in Chromium with
  stand-in microphone and speaker; the layout was checked at phone sizes in the same browser.
- **In-app browsers.** The reference recordings were made inside Instagram's browser. To my
  knowledge those embedded browsers generally do not offer speech recognition, so visitors
  arriving from Instagram would get the typing fallback rather than voice. I have not tested
  this. If voice for Instagram traffic matters, that is the case for A4.
- **iOS Safari voice** depends on dictation being enabled on the phone, and may need a tap on
  the microphone for each turn rather than hands-free listening. The interface handles both;
  neither was observed on a device.
- **The Claude engine has never run against the real API** — no key was available. Its
  request shape, field re-validation and fallback are tested with the provider stubbed.
- **Resend and any CRM** have not received a real message from this build.
- **Performance** was not measured with Lighthouse. Pages are static HTML with about 6 KB of
  gzipped script; media loads lazily from the existing CDN.
- **Portuguese and Spanish wording** of the new strings was written natively but has not been
  read by a native-speaking reviewer at the agency.

- **B's hands-free loop on iPhone.** B restarts listening by itself after each reply. Whether
  iOS Safari allows that without a tap each turn was not observed on a device; if it does not,
  B shows "Tap to keep talking" and continues on the next tap.
- **Language detection by voice.** Browser speech recognition listens in one language at a
  time — the one chosen on screen. Saying "Português" / "English" switches it. Speaking
  Portuguese while English is selected is not understood automatically; A4 would remove that limit.

## E. Rollout and rollback, once approved

1. Preview on a throwaway URL with `PUBLIC_DEMO_BANNER=true` (adds `noindex`).
2. Agency confirms section B, reviews section C, supplies rep addresses; send real test leads to each queue.
3. Device pass on real iPhone Safari, Android Chrome and the Instagram in-app browser.
4. Cutover: lower DNS TTL a day ahead, point the domain, keep the Webflow site published and untouched.
5. **Rollback is one DNS change** back to Webflow; URLs are identical on both, so nothing indexed breaks either way.
