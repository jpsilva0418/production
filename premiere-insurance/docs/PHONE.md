# Phone-in AI — what exists, and what must be approved first

**Nothing here touches the agency's phone number.** The published number is (978) 221-0139
(Chelmsford) and (978) 549-7676 (Clinton). Who carries those numbers, and whether that
carrier supports forwarding, SIP or webhooks, **is not knowable from the website** — the
agency has to tell us.

## What is built

`POST /api/phone/lead` — a provider-neutral intake. Any phone-answering AI (a Twilio or
Telnyx voice bot, Vapi, Retell, a SIP agent) posts the structured result of a call and it
enters the *same* pipeline as the website: same validation, routing, storage, retries.

- OFF unless `PHONE_WEBHOOK_SECRET` is set (returns 404).
- Authenticated: `x-premiere-timestamp` (±5 min) + `x-premiere-signature: sha256=HMAC(secret, "<ts>.<body>")`.
- Idempotent on `call_id`: a provider retry cannot create a second lead.
- Transcript kept only when `recording_consent` is `true`.

```json
{ "call_id": "CA…", "language": "pt", "name": "Carlos Lima", "caller_number": "+15085550177",
  "callback_number": null, "email": null, "preferred_contact": "phone", "line": "commercial",
  "categories": ["commercial_auto"], "state": "MA", "urgency": "this_week", "best_time": "mornings",
  "summary": "Two vans for a painting company.", "recording_consent": false, "transcript": null }
```
Proven by the e2e group "phone intake adapter" (signed call → lead; replay → no duplicate;
bad/stale signature → refused; transcript only with consent).

## What is NOT built, on purpose

The telephone side itself: answering a call, speech, and transfer to a person. That needs a
paid telephony/voice-AI account and a routing decision that only the agency can make.

## The safe path (for approval, in this order)

1. **Agency confirms** carrier, who answers today, after-hours behaviour, and whether calls are recorded.
2. **Pick the least invasive routing.** Preferred: *conditional forwarding* (no-answer / busy /
   after-hours) from the existing number to a new AI number. The main number is not ported,
   daytime calls still ring the office, and undoing it is one carrier setting.
3. **Trial on a brand-new number** nobody's customers know. Nothing about the real number changes.
4. **Script and disclosures approved** by the agency (and counsel for recording): AI disclosure at
   the start, no quotes/coverage decisions, press-0 / "agent" transfers to a human immediately.
5. **Recording / transcription consent.** Call-recording law varies by state and Massachusetts
   is stricter than most — this is a question for the agency's counsel, not an engineering
   default. The adapter stores no transcript unless consent is flagged.
6. Only then set `PHONE_WEBHOOK_SECRET` and point the provider's end-of-call webhook at the endpoint.

**Cost:** voice-AI and telephony providers bill per minute, plus the number rental. Rates change
often and I have not verified current ones — get a written quote for the expected call volume
before approving anything.
