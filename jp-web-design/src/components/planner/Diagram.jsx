import { useEffect, useRef, useState } from 'react';
import { composePages } from './logic.js';

/* ==========================================================================
   The signature moment.

   Not a progress bar — a live architecture diagram that builds, renames and
   *deletes* nodes as answers change. The wow is causality made visible: you
   watch your own answer restructure the drawing.

   Deletion is the part nothing else in this category does. Removed nodes get
   a brief strike-through before they fade, so the removal is legible rather
   than a flicker.
   ========================================================================== */

export default function Diagram({ answers, plan, step }) {
  const pages = plan ? composePages(answers).pages : [];
  const prev = useRef([]);
  const [leaving, setLeaving] = useState([]);
  const [announcement, setAnnouncement] = useState('');
  const timer = useRef(null);

  useEffect(() => {
    const before = prev.current;
    const removed = before.filter((p) => !pages.includes(p));
    const added = pages.filter((p) => !before.includes(p));

    if (removed.length) {
      setLeaving(removed);
      const t = setTimeout(() => setLeaving([]), 260);
      prev.current = pages;
      // Announce deltas only, debounced and coalesced. Never assertive.
      queueAnnouncement(added.length, removed.length, pages.length);
      return () => clearTimeout(t);
    }
    prev.current = pages;
    if (added.length) queueAnnouncement(added.length, 0, pages.length);
  }, [pages.join('|')]);

  function queueAnnouncement(added, removed, total) {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const bits = [];
      if (added) bits.push(`Added ${added} page${added > 1 ? 's' : ''}.`);
      if (removed) bits.push(`Removed ${removed} page${removed > 1 ? 's' : ''}.`);
      if (bits.length) bits.push(`Plan now has ${total} pages.`);
      setAnnouncement(bits.join(' '));
    }, 500);
  }

  const empty = !plan || !pages.length;

  return (
    <div className="dg">
      <div className="dg__head">
        <span className="dg__label">Your plan, so far</span>
        {!empty && (
          <span className="dg__count">
            {pages.length} <span>pages</span>
          </span>
        )}
      </div>

      {/* Mobile: a one-line structural ticker. A sitemap at 390px mid-flow is
          unreadable, so the full drawing waits for the result screen. */}
      <p className="dg__ticker" aria-hidden="true">
        {empty ? 'Answer the first question to begin' : pages.slice(0, 3).join(' · ') + (pages.length > 3 ? ` · +${pages.length - 3} more` : '')}
      </p>

      <div className="dg__canvas" aria-hidden="true">
        {empty ? (
          <p className="dg__empty">The structure appears here as you answer.</p>
        ) : (
          <ul className="dg__nodes">
            {pages.map((p, i) => (
              <li key={p} className="dg__node" style={{ '--i': Math.min(i, 6) }}>
                <span className="dg__rail" />
                <span className="dg__box">{p}</span>
              </li>
            ))}
            {leaving.map((p) => (
              <li key={`x-${p}`} className="dg__node dg__node--out">
                <span className="dg__rail" />
                <span className="dg__box">{p}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* The real accessible representation of the drawing. */}
      <ul className="vh">
        {pages.map((p) => <li key={`a-${p}`}>{p}</li>)}
      </ul>
      <p className="vh" aria-live="polite">{announcement}</p>

      {step >= 9 && (
        <p className="dg__foot">
          This is a starting point, not a fixed scope. It changes once we talk.
        </p>
      )}
    </div>
  );
}
