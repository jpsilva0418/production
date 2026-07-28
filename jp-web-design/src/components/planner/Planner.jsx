import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  BUSINESS_TYPES, SITUATIONS, GOALS, PACKAGE_CHOICES, FEATURE_GROUPS,
  TIMELINES, RECOMMEND_CHOICES, PACKAGE_META,
  recommendPackage, composePages, deriveFeatures, seoFocus,
  cutAdvice, riskCallout, timeline,
} from './logic.js';
import Diagram from './Diagram.jsx';
import './planner.css';

const KEY = 'jpwd.planner.v1';
const TOTAL = 8;

const EMPTY = {
  businessType: '', businessTypeOther: '',
  situation: '', goal: '',
  packageChoice: '', packageChoiceOther: '',
  features: [], timeline: '', wantsRecommendation: '',
  name: '', company: '', email: '', phone: '', website: '',
  contactPref: '', notes: '',
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
     announces the option without the question. */
  useEffect(() => {
    if (!mounted.current) return;
    const id = requestAnimationFrame(() => headingRef.current?.focus());
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

  const submit = (e) => {
    e.preventDefault();
    const err = {};
    if (!a.name.trim()) err.name = 'Enter your name so I know who I’m replying to.';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(a.email)) err.email = 'Enter an email address — it needs an @ and a domain.';
    setErrors(err);
    if (Object.keys(err).length) {
      const first = document.getElementById(`f-${Object.keys(err)[0]}`);
      first?.focus();
      return;
    }
    setSending(true);
    /* No endpoint wired yet — see README. The payload shape is CRM-ready and
       identical to what /api/inquiry will receive. */
    setTimeout(() => { setSending(false); setSent('ok'); setDone(true); }, 400);
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

  if (done && sent) return <Result a={a} plan={plan} onRestart={restart} headingRef={headingRef} />;

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
            Rather not do this? <a className="tlink" href="mailto:jp@jpwebdesign.com">Just email me instead.</a>
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
function ContactStep({ a, set, errors, onSubmit, sending }) {
  return (
    <div className="pl__contact">
      <p className="pl__hint pl__hint--top">
        Your plan appears on the next screen either way — nothing is held back. These details
        are so I can send it to you and design your free homepage demo. No cost, and no
        obligation once you have seen it.
      </p>

      <div className="pl__cgrid">
        <div className="pl__field">
          <label htmlFor="f-name">Name</label>
          <input id="f-name" value={a.name} autoComplete="name"
                 aria-invalid={!!errors.name} aria-describedby={errors.name ? 'e-name' : undefined}
                 onChange={(e) => set({ name: e.target.value })} />
          {errors.name && <p className="pl__err" id="e-name">{errors.name}</p>}
        </div>

        <div className="pl__field">
          <label htmlFor="f-company">Business name</label>
          <input id="f-company" value={a.company} autoComplete="organization"
                 onChange={(e) => set({ company: e.target.value })} />
        </div>

        <div className="pl__field">
          <label htmlFor="f-email">Email</label>
          <input id="f-email" type="email" value={a.email} autoComplete="email" inputMode="email"
                 aria-invalid={!!errors.email} aria-describedby={errors.email ? 'e-email' : undefined}
                 onChange={(e) => set({ email: e.target.value })} />
          {errors.email && <p className="pl__err" id="e-email">{errors.email}</p>}
        </div>

        <div className="pl__field">
          <label htmlFor="f-phone">Phone <span className="pl__opt2">optional</span></label>
          <input id="f-phone" type="tel" value={a.phone} autoComplete="tel" inputMode="tel"
                 onChange={(e) => set({ phone: e.target.value })} />
        </div>

        <div className="pl__field pl__field--full">
          <label htmlFor="f-pref">Preferred contact method</label>
          <select id="f-pref" value={a.contactPref} onChange={(e) => set({ contactPref: e.target.value })}>
            <option value="">No preference</option>
            <option>Email</option>
            <option>Phone call</option>
            <option>Text message</option>
          </select>
        </div>

        <div className="pl__field pl__field--full">
          <label htmlFor="f-notes">Anything else worth knowing? <span className="pl__opt2">optional</span></label>
          <textarea id="f-notes" rows="3" value={a.notes}
                    onChange={(e) => set({ notes: e.target.value })} />
        </div>
      </div>

      <p className="pl__privacy">
        Your details go to me directly and are not sold, shared, or added to any list.
      </p>
    </div>
  );
}

/* ----------------------------------------------------------------- Result */
function Result({ a, plan, onRestart, headingRef }) {
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

        <div className="pl__exits">
          <a className="btn btn--primary" href={`mailto:jp@jpwebdesign.com?subject=${encodeURIComponent('Free demo request — ' + (a.company || a.name || 'my business'))}`}>
            Get my free demo
          </a>
          <a className="btn btn--ghost" href="/contact">Book a free consultation</a>
          <button type="button" className="pl__restart" onClick={onRestart}>Start over</button>
        </div>

        <p className="pl__sent">
          Thanks{a.name ? `, ${a.name.split(' ')[0]}` : ''} — I’ll reply within one business day,
          and your free homepage demo usually follows within 3–5 business days. Nothing is owed
          either way. If I don’t reply, email me and say so.
        </p>
      </div>

      <aside className="pl__side" aria-label="Your plan diagram">
        <Diagram answers={a} plan={plan} step={9} />
      </aside>
    </div>
  );
}
