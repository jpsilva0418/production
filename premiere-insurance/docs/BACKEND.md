# Lead backend

## The path of an inquiry

```
form ─┐
voice ─┼─► POST /api/leads ─► validate ─► rate limit ─► idempotency + de-dupe ─► route to queue
text ─┘                                                                              │
phone AI ─► POST /api/phone/lead (signed) ───────────────────────────────────────────┤
                                                                                     ▼
                                          ONE TRANSACTION: leads + lead_deliveries + lead_events
                                                                                     │  ← the customer is told
                                                                                     ▼    "received" only after this commits
                                          deliver now: email to the queue's reps / CRM webhook
                                                     │ fails
                                                     ▼
                                          retry job (1m, 5m, 15m, 1h, 6h) ─► dead ─► alert email + red in the inbox
```

The database is the system of record. Email and CRM delivery are copies; losing one never
loses the lead.

## Routing

| Queue | When | Delivered to |
|---|---|---|
| `personal` | life, homeowners/renters, personal auto, boat/PWC/snowmobile | `LEAD_ROUTE_PERSONAL` |
| `commercial` | commercial auto, BOP/general liability, workers' comp, commercial property, inland marine, umbrella | `LEAD_ROUTE_COMMERCIAL` |
| `general` | both lines at once, or the customer did not say | `LEAD_ROUTE_GENERAL` |
| `quarantine` | honeypot tripped | inbox only, flagged `spam`, never emailed |

An unset queue falls back to `general`. **The actual representatives are not known yet** — the
live Webflow form's recipients are configured inside Webflow. Until the agency supplies them,
the staff inbox is the only destination, and the inbox says so on screen.

## What is stored per lead

Stable id · customer reference (`PI-XXXXXX`) · source (`web_voice`, `web_text`, `form`, `phone`) ·
timestamp · language · name, phone (E.164), email · contact preference and best time ·
personal/commercial · categories · state · timing · summary · address fields from the classic
form · SMS consent · queue · delivery status (per channel, with attempts and last error) ·
follow-up status · a salted hash of the IP (never the address) · every event in `lead_events`.

A transcript is stored **only** when the customer ticks the box on the review card (or, on the
phone, when the call result says the caller consented). Audio is never received or stored.
SSN- and card-shaped numbers are removed before anything is saved or sent to a provider.

## Controls, and the test that proves each

| Control | Proof |
|---|---|
| Success shown only after a durable write | `pipeline.test` "only then reports success"; e2e "never claims success when the server could not store" |
| Idempotent (same key → same reference, one delivery) | `pipeline.test` "is idempotent", "survives a double-tap"; e2e "response that never arrives" |
| De-duplication of the same inquiry within 10 minutes | `pipeline.test` "de-duplicates" |
| Retries with backoff, dead-letter, staff alert | `pipeline.test` "retries until the provider recovers", "gives up after the last attempt" |
| Provider timeout ≠ hang | `pipeline.test` "treats a provider timeout as a failed attempt" |
| Strict validation, unknown fields rejected, size cap | `schema.test`; e2e "refuses cross-site posts, oversized bodies…" |
| Mail-header injection | `schema.test` "strips line breaks" |
| Rate limiting (durable, per address) | `pipeline.test`, e2e "rate-limits a single address" |
| Staff inbox requires the access code; output escaped | e2e "the inbox needs the staff code", "shown to staff as text, never executed" |
| Supabase REST roles cannot read leads (RLS, no policies) | `pipeline.test` "has row level security on every table" |
| Assistant cannot be marked ready or submit by the model | `assistant.test` "cannot be marked ready by the model"; nothing submits without the customer's tap |

## Known limits (interim, stated plainly)

- **Staff inbox auth is one shared access code**, rate-limited, HttpOnly session cookie. Fine for
  a small-office pilot; per-person sign-in is a launch item.
- **The retry job needs a scheduler** hitting `GET /api/cron/deliver` with
  `Authorization: Bearer $CRON_SECRET` every ~10 minutes (Vercel Cron on a paid plan, or any
  uptime pinger). Without it, failed deliveries wait for a person to press "Retry now".
- **Retention is not decided.** Nothing is purged automatically yet; the agency has to set the period.
- **No CRM is connected.** `CRM_WEBHOOK_URL` sends a signed JSON POST; a specific CRM (the
  agency has not said which they use) may need its own small adapter in `delivery.ts`.
- **Email delivery was tested against a scripted provider, not against Resend itself.**

## CRM webhook payload

```json
{ "type": "lead.created",
  "lead": { "id": "uuid", "reference": "PI-7K3M9Q", "created_at": "ISO-8601", "source": "web_voice",
            "language": "pt", "queue": "commercial", "line": "commercial", "categories": ["workers_comp"],
            "contact": { "name": "", "phone": "+1…", "email": null, "preferred": "whatsapp", "best_time": "", "sms_consent": false },
            "state": "MA", "urgency": "this_week", "summary": "", "details": {}, "transcript": null } }
```
Headers: `x-premiere-timestamp`, `x-premiere-signature: sha256=HMAC(secret, "<timestamp>.<body>")`, `idempotency-key: <lead id>`.
