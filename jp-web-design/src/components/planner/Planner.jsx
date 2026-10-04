import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  BUSINESS_TYPES, SITUATIONS, GOALS, PACKAGE_CHOICES, FEATURE_GROUPS,
  TIMELINES, RECOMMEND_CHOICES, PACKAGE_META,
  recommendPackage, composePages, deriveFeatures, seoFocus,
  cutAdvice, riskCallout, timeline,
} from './logic.js';
import Diagram from './Diagram.jsx';
import './planner.css';

import { sendInquiry, mailtoFor } from '../../lib/inquiry';
import { INTAKE_FIELDS, validateIntake } from '../../lib/intake';
import { track, EVENTS, serviceEvent } from '../../lib/analytics';
import { EMAIL, REPLY_SLA, DEMO_TURNAROUND } from '../../data/site';

const KEY = 'jpwd.planner.v1';
const TOTAL = 8;

/* This flow only handles website projects, and it asks its own timeline
   question at step 6 — so those two canonical fields are preset rather than
   re-asked. Everything else on the final step is the canonical intake. */
const PLANNER_NEED = 'Website / Web Development';
const PLANNER_INTAKE = { preset: ['need', 'timeline'], optional: ['message'] };
const PLANNER_LABELS = { message: 'Anything else worth knowing?' };

const EMPTY = {
  businessType: '', businessTypeOther: '',
  situation: '', goal: '',
  packageChoice: '', packageChoiceOther: '',
  features: [], timeline: '', wantsRecommendation: '',
  name: '', company: '', email: '', phone: '', website: '',
  budget: '', notes: '',
};

/* Answers persist across Back/Forward and refresh (WCAG 2.2 — 3.3.7
   Redundant Entry). sessionStorage, not localStorage: we don't retain a
   stranger's details beyond the session. */
function load() {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
  } catch { return EMPTY; }
}

export default function Planner() {
  const [step, setStep] = useState(1);
  const [a, setA] = useState(EMPTY);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(null);
  const headingRef = useRef(null);
  const mounted = useRef(false);

  useEffect(() => { setA(load()); }, []);
  useEffect(() => {
    if (!mounted.current) { mounted.current = true; return; }
    try { sessionStorage.setItem(KEY, JSON.stringify(a)); } catch {}
  }, [a]);

  /* Focus the step heading, not the first input — focusing an input
     announces the option without the question.

     preventScroll matters: focusing an element makes the browser scroll it
     into view, which on /free-demo nudged the page a few pixels off the top
     the moment the island hydrated. The visitor is already looking at the
     planner whenever this fires, so the announcement is wanted and the
     scroll is not. */
  useEffect(() => {
    if (!mounted.current) return;
    const id = requestAnimationFrame(() => headingRef.current?.focus({ preventScroll: true }));
    return () => cancelAnimationFrame(id);
  }, [step, done]);

  const set = useCallback((patch) => setA((p) => ({ ...p, ...patch })), []);

  const toggleFeature = (id) => {
    setA((p) => {
      if (id === 'unsure') return { ...p, features: p.features.includes('unsure') ? [] : ['unsure'] };
      const next = p.features.filter((x) => x !== 'unsure');
      return { ...p, features: next.includes(id) ? next.filter((x) => x !== id) : [...next, id] };
    });
  };

  const canAdvance = useMemo(() => {
    switch (step) {
      case 1: return !!a.businessType && (a.businessType !== 'other' || a.businessTypeOther.trim().length > 1);
      case 2: return !!a.situation;
      case 3: return !!a.goal;
      case 4: return !!a.packageChoice && (a.packageChoice !== 'else' || a.packageChoiceOther.trim().length > 1);
      case 5: return a.features.length > 0;
      case 6: return !!a.timeline;
      case 7: return !!a.wantsRecommendation;
      default: return true;
    }
  }, [step, a]);

  const plan = useMemo(() => {
    if (!a.businessType) return null;
    const { pkg, reasons } = recommendPackage(a);
    return {
      pkg, reasons,
      arch: composePages(a),
      features: deriveFeatures(a),
      seo: seoFocus(a),
      cut: cutAdvice(a),
      risk: riskCallout(a),
      time: timeline(a),
    };
  }, [a]);

  const next = () => { if (canAdvance) setStep((s) => Math.min(s + 1, TOTAL)); };
  const back = () => { if (done) { setDone(false); setStep(TOTAL); } else setStep((s) => Math.max(s - 1, 1)); };

  const submit = async (e) => {
    e.preventDefault();
    /* The same validator the contact page uses. `need` and `timeline` are
       preset by this flow, and the plan itself carries the project detail,
       so the message field is optional here. */
    const err = validateIntake({ ...a, message: a.notes }, PLANNER_INTAKE);
    setErrors(err);
    if (Object.keys(err).length) {
      const first = document.getElementById(`f-${Object.keys(err)[0]}`);
      first?.focus();
      return;
    }
    setSending(true);
    /* One transport for the whole site (src/lib/inquiry.ts). The plan is shown
       either way — that was always the promise — but the confirmation text
       below reports what actually happened to the submission. A failure is
       never dressed up as a success. */
    const res = await sendInquiry({
      source: 'planner',
      name: a.name,
      email: a.email,
      phone: a.phone || undefined,
      company: a.company || undefined,
      website: a.website || undefined,
      need: PLANNER_NEED,
      budget: a.budget || undefined,
      timeline: a.timeline || undefined,
      message: a.notes || 'Free homepage demo requested through the website planner.',
      plan: { answers: a, recommendation: plan },
    });
    setSending(false);
    if (res.ok) {
      track(EVENTS.demoComplete, { need: PLANNER_NEED });
      const svc = serviceEvent(PLANNER_NEED);
      if (svc) track(svc, { source: 'free-demo' });
    }
    setSent(res.ok ? 'ok' : res.reason === 'spam' ? 'ok' : res.reason);
    setDone(true);
  };

  const restart = () => {
    setA(EMPTY); setStep(1); setDone(false); setSent(null); setErrors({});
    try { sessionStorage.removeItem(KEY); } catch {}
  };

  const stepTitles = [
    'What type of business do you operate?',
    'What best describes your current situation?',
    'What is the primary goal of your website?',
    'What type of website are you most interested in?',
    'Which features may be important to your business?',
    'When would you ideally like to begin?',
    'Would you like a recommendation?',
    'Where should I send your plan and demo?',
  ];

  if (done && sent) return <Result a={a} plan={plan} sent={sent} onRestart={restart} headingRef={headingRef} />;

  return (
    <div className="pl">
      <div className="pl__main">
        <Progress step={step} total={TOTAL} />

        <form className="pl__form" onSubmit={(e) => e.preventDefault()} noValidate>
          <fieldset className="pl__fs">
            <legend className="vh">{`Step ${step} of ${TOTAL}. ${stepTitles[step - 1]}`}</legend>

            <h3 className="pl__q" tabIndex={-1} ref={headingRef}>
              <span className="pl__qn" aria-hidden="true">{String(step).padStart(2, '0')}</span>
              {stepTitles[step - 1]}
            </h3>

            {step === 1 && (
              <>
                <Options name="businessType" value={a.businessType} items={BUSINESS_TYPES}
                         onChange={(v) => set({ businessType: v })} />
                {a.businessType === 'other' && (
                  <Text id="f-bto" label="Tell me what you do" value={a.businessTypeOther}
                        onChange={(v) => set({ businessTypeOther: v })} />
                )}
              </>
            )}

            {step === 2 && (
              <>
                <Options name="situation" value={a.situation} items={SITUATIONS}
                         onChange={(v) => set({ situation: v })} />
                {a.situation && a.situation !== 'none' && a.situation !== 'new_biz' && (
                  <Text id="f-site" type="url" label="Your current website address (optional)"
                        hint="Paste it and I’ll look at it myself before I reply."
                        value={a.website} onChange={(v) => set({ website: v })} />
                )}
              </>
            )}

            {step === 3 && (
              <Options name="goal" value={a.goal} items={GOALS} onChange={(v) => set({ goal: v })} />
            )}

            {step === 4 && (
              <>
                <Options name="packageChoice" value={a.packageChoice} items={PACKAGE_CHOICES}
                         onChange={(v) => set({ packageChoice: v })} rich />
                {a.packageChoice === 'else' && (
                  <Text id="f-pco" label="Briefly, what do you have in mind?"
                        value={a.packageChoiceOther} onChange={(v) => set({ packageChoiceOther: v })} />
                )}
              </>
            )}

            {step === 5 && (
              <div className="pl__groups">
                {FEATURE_GROUPS.map((g) => (
                  <div key={g.group || 'misc'} className="pl__group">
                    {g.group && <p className="pl__glabel">{g.group}</p>}
                    <div className="pl__opts pl__opts--multi">
                      {g.items.map((i) => (
                        <label key={i.id}
                               className={`pl__opt ${a.features.includes(i.id) ? 'is-on' : ''}`}>
                          <input type="checkbox" checked={a.features.includes(i.id)}
                                 onChange={() => toggleFeature(i.id)} />
                          <span className="pl__tick" aria-hidden="true" />
                          <span className="pl__optl">{i.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {step === 6 && (
              <Options name="timeline" value={a.timeline} items={TIMELINES} onChange={(v) => set({ timeline: v })} />
            )}

            {step === 7 && (
              <Options name="wantsRecommendation" value={a.wantsRecommendation} items={RECOMMEND_CHOICES}
                       onChange={(v) => set({ wantsRecommendation: v })} />
            )}

            {step === 8 && (
              <ContactStep a={a} set={set} errors={errors} onSubmit={submit} sending={sending} />
            )}
          </fieldset>

          <div className="pl__nav">
            <button type="button" className="pl__back" onClick={back} disabled={step === 1}>
              ← Previous
            </button>

            {step < TOTAL ? (
              <button type="button" className="btn btn--primary" onClick={next} disabled={!canAdvance}>
                Next
              </button>
            ) : (
              <button type="button" className="btn btn--primary" onClick={submit} disabled={sending}>
                {sending ? 'Sending…' : 'See my plan'}
              </button>
            )}
          </div>

          {/* Escape hatch on every step. Referrals and people checking you out
              after an email should never be routed through a funnel built
              for strangers. */}
          <p className="pl__escape">
            Rather not do this? <a className="tlink" href="mailto:jpsilva0418@gmail.com">Just email me instead.</a>
          </p>
        </form>
      </div>

      <aside className="pl__side" aria-label="Your plan so far">
        <Diagram answers={a} plan={plan} step={step} />
      </aside>
    </div>
  );
}

/* ---------------------------------------------------------------- Progress */
function Progress({ step, total }) {
  const pct = Math.round(((step - 1) / total) * 100);
  return (
    <div className="pl__prog">
      {/* Text carries the state for assistive tech; the bar is decorative so
          nothing is announced twice. */}
      <p className="pl__progt">
        <span className="pl__progn">Step {step}</span>
        <span className="pl__progd"> of {total}</span>
      </p>
      <div className="pl__bar" aria-hidden="true">
        <span style={{ width: `${Math.max(pct, 4)}%` }} />
      </div>
    </div>
  );
}

/* ----------------------------------------------------------- Radio options */
function Options({ name, value, items, onChange, rich = false }) {
  return (
    <div className={`pl__opts ${rich ? 'pl__opts--rich' : ''}`} role="radiogroup">
      {items.map((i) => (
        <label key={i.id} className={`pl__opt ${value === i.id ? 'is-on' : ''}`}>
          <input type="radio" name={name} value={i.id}
                 checked={value === i.id} onChange={() => onChange(i.id)} />
          <span className="pl__dot" aria-hidden="true" />
          <span className="pl__optl">
            {i.label}
            {rich && i.desc && <span className="pl__optd">{i.desc}</span>}
          </span>
        </label>
      ))}
    </div>
  );
}

function Text({ id, label, value, onChange, hint, type = 'text' }) {
  return (
    <div className="pl__field">
      <label htmlFor={id}>{label}</label>
      {hint && <p className="pl__hint">{hint}</p>}
      <input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

/* ------------------------------------------------------------ Contact step */
function ContactStep({ a, set, errors }) {
  /* Rendered from INTAKE_FIELDS so this step and /contact can never drift
     apart. `notes` is this flow's name for the canonical `message`. */
  const fields = INTAKE_FIELDS.filter((f) => !PLANNER_INTAKE.preset.includes(f.key));
  const valueOf = (k) => (k === 'message' ? a.notes : a[k]) ?? '';
  const setOf = (k, v) => set(k === 'message' ? { notes: v } : { [k]: v });
  const isOptional = (f) => !f.required || PLANNER_INTAKE.optional.includes(f.key);

  return (
    <div className="pl__contact">
      <p className="pl__hint pl__hint--top">
        Your plan appears on the next screen either way — nothing is held back. These details
        are so I can send it to you and design your free homepage demo. No cost, and no
        obligation once you have seen it.
      </p>

      <p className="pl__preset">
        <span>What you need</span>
        <b>{PLANNER_NEED}</b>
      </p>

      <div className="pl__cgrid">
        {fields.map((f) => {
          const err = errors[f.key];
          const id = `f-${f.key}`;
          const label = PLANNER_LABELS[f.key] ?? f.label;
          return (
            <div key={f.key} className={`pl__field${f.full ? ' pl__field--full' : ''}`}>
              <label htmlFor={id}>
                {label}{isOptional(f) && <span className="pl__opt2">optional</span>}
              </label>

              {f.kind === 'select' ? (
                <select id={id} value={valueOf(f.key)} onChange={(e) => setOf(f.key, e.target.value)}>
                  <option value="">{f.empty}</option>
                  {f.options.map((o) => <option key={o}>{o}</option>)}
                </select>
              ) : f.kind === 'textarea' ? (
                <textarea id={id} rows="3" value={valueOf(f.key)}
                          aria-invalid={!!err} aria-describedby={err ? `e-${f.key}` : undefined}
                          onChange={(e) => setOf(f.key, e.target.value)} />
              ) : (
                <input id={id} type={f.kind} value={valueOf(f.key)}
                       autoComplete={f.autocomplete} inputMode={f.inputmode} placeholder={f.placeholder}
                       aria-invalid={!!err} aria-describedby={err ? `e-${f.key}` : undefined}
                       onChange={(e) => setOf(f.key, e.target.value)} />
              )}

              {err && <p className="pl__err" id={`e-${f.key}`}>{err}</p>}
            </div>
          );
        })}
      </div>

      <p className="pl__privacy">
        Your details go to me directly and are not sold, shared, or added to any list.
      </p>
    </div>
  );
}

/* ----------------------------------------------------------------- Result */
function Result({ a, plan, sent, onRestart, headingRef }) {
  const meta = PACKAGE_META[plan.pkg];
  const chose = a.packageChoice;
  const disagrees = ['starter', 'growth', 'custom'].includes(chose) && chose !== plan.pkg;

  return (
    <div className="pl pl--result">
      <div className="pl__main">
        <p className="pl__rlabel">Your plan</p>
        <h3 className="pl__rtitle" tabIndex={-1} ref={headingRef}>{meta.name}</h3>
        <p className="pl__rblurb">{meta.blurb}</p>

        <section className="pl__block">
          <h4>Why this one</h4>
          <p>Based on your answers — {plan.reasons.join(', ')}.</p>
          {disagrees && (
            <p className="pl__disagree">
              You said you were leaning toward the {PACKAGE_META[chose].name}. That may still be
              the right call — it depends on things a form can’t see. Worth ten minutes on a call
              rather than a decision made here.
            </p>
          )}
        </section>

        <section className="pl__block">
          <h4>Suggested structure <span className="pl__count">{plan.arch.label}</span></h4>
          <ul className="pl__list">
            {plan.arch.pages.map((p) => <li key={p}>{p}</li>)}
          </ul>
        </section>

        <section className="pl__block">
          <h4>What it needs to do</h4>
          <ul className="pl__list pl__list--check">
            {plan.features.map((f) => <li key={f}>{f}</li>)}
          </ul>
        </section>

        <section className="pl__block">
          <h4>Search priorities</h4>
          <ul className="pl__list">{plan.seo.map((s) => <li key={s}>{s}</li>)}</ul>
        </section>

        <section className="pl__block pl__block--cut">
          <h4>What I’d leave out</h4>
          <p>{plan.cut}</p>
        </section>

        {plan.risk && (
          <section className="pl__block pl__block--risk">
            <h4>One thing to plan for</h4>
            <p>{plan.risk}</p>
          </section>
        )}

        <section className="pl__block">
          <h4>Next step <span className="pl__count">{meta.cta}</span></h4>
          <p>
            The free demo turns this plan into a designed homepage for your business — your
            services, your work, your words. It costs nothing and obligates nothing.
          </p>
        </section>

        <section className="pl__block">
          <h4>Rough timeline</h4>
          <p>
            <strong>{plan.time.low}–{plan.time.high} weeks</strong> — an estimate, not a commitment.
            {' '}{plan.time.note}
          </p>
        </section>

        <div className="pl__pricing">
          Every project is different. Pricing is provided after a brief consultation based on your
          goals, required pages, features, content, and timeline.
        </div>

        {sent === 'ok' ? (
          <>
            <div className="pl__exits">
              <a className="btn btn--ghost" href="/work">See recent work</a>
              <button type="button" className="pl__restart" onClick={onRestart}>Start over</button>
            </div>
            <p className="pl__sent pl__sent--ok">
              Got it{a.name ? `, ${a.name.split(' ')[0]}` : ''} — your request reached me. I reply
              within {REPLY_SLA}, and the free homepage demo usually follows within {DEMO_TURNAROUND}.
              Nothing is owed either way. If I don’t reply, email me and say so.
            </p>
          </>
        ) : (
          <>
            <div className="pl__exits">
              <a
                className="btn btn--primary"
                href={mailtoFor(
                  {
                    source: 'planner',
                    name: a.name,
                    email: a.email,
                    phone: a.phone,
                    company: a.company,
                    need: 'Website',
                    timeline: a.timeline,
                    message: `Free demo request. Recommended package: ${meta.name}. Pages: ${plan.arch.pages.length}.`,
                  },
                  EMAIL,
                )}
              >
                Send my demo request by email
              </a>
              <a className="btn btn--ghost" href="/contact">Book a free consultation</a>
              <button type="button" className="pl__restart" onClick={onRestart}>Start over</button>
            </div>
            <p className="pl__sent pl__sent--warn">
              {sent === 'unconfigured'
                ? 'Your plan is above — but the form’s delivery address isn’t connected yet, so I’m not going to tell you this was sent when it wasn’t. The button above opens an email with your details already filled in.'
                : 'Your plan is above, but the request didn’t send — something went wrong on the way. The button above carries the same details by email, and it reaches me exactly the same way.'}
            </p>
          </>
        )}
      </div>

      <aside className="pl__side" aria-label="Your plan diagram">
        <Diagram answers={a} plan={plan} step={9} />
      </aside>
    </div>
  );
}
