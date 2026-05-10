/* =========================================================================
   O6 — What matters to you · Expressive
   Two multi-select chip groups, capped at 3 each. The last input screen
   before O7 (the AI plan). Calmer EXPRESSIVE_BG, inherits O1 / O5.

   Decisions resolved on the canvas:
     A — group separation (A1 stacked / A2 single card+hairline / A3 tabbed)
     B — cap-feedback     (B1 disable / B2 oldest-out / B3 calm hint)
     C — empty-state copy (C1 terse / C2 acknowledging / C3 inline counter)
   ========================================================================= */
const o6 = (() => {
  const INK    = "#1A1A1A";
  const SUB    = "#57534E";
  const MUTE   = "#78716C";
  const FAINT  = "#A8A29E";
  const LINE   = "#E5E3DC";
  const HAIR   = "#D6D3CC";
  const PAPER  = "#F5F5F4";
  const SOFT   = "#FAFAF7";
  const DIS    = "#A8A29E";
  const VIOLET = "#7C3AED";
  const INDIGO = "#4F46E5";
  const MAGENTA= "#BE185D";
  const TEAL   = "#0D9488";

  /* Calmer expressive bg — same recipe as O5; violet stop pulled back, cream
     extended so the screen reads as a quiet conclusion to the interview. */
  const EXPRESSIVE_BG = "linear-gradient(180deg, #EEEAF4 0%, #F8F5EF 320px, #F5F5F4 640px)";

  const Arrow = ({ size = 13, sw = 1.8, dir = "right" }) => {
    const r = { right: 0, left: 180, down: 90, up: 270 }[dir] || 0;
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ transform: `rotate(${r}deg)` }}>
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    );
  };

  /* Spec-65 calibrated order — DO NOT alphabetise. */
  const PRIORITIES = [
    "A fair split of everything",
    "Keeping the family home",
    "Protecting my pension",
    "Stability for the children",
    "A clean break — no ongoing ties",
    "Getting this done quickly",
    "Keeping costs low",
    "Ongoing financial support"
  ];
  const WORRIES = [
    "Not having enough to live on",
    "Hidden assets or dishonesty",
    "Losing my pension",
    "Not being able to afford the mortgage alone",
    "The cost of the process itself",
    "The emotional toll",
    "My ex not cooperating",
    "Not knowing what's fair"
  ];

  /* ----- progress rail (step 6 of 8) ----- */
  function StepRail({ current = 6, total = 8 }) {
    return (
      <div className="flex items-center gap-2.5"
           role="progressbar" aria-valuenow={current} aria-valuemin={1} aria-valuemax={total}
           aria-label={`Step ${current} of ${total}`}>
        <span className="label-xs" style={{ color: MUTE, fontSize: 9.5 }}>Step {current} / {total}</span>
        <div className="relative rounded-full overflow-hidden" style={{ width: 96, height: 3, background: "#E5E3DC" }}>
          <div className="absolute rounded-full" style={{ top: 0, bottom: 0, left: 0, width: `${(current / total) * 100}%`, background: INK }} />
        </div>
      </div>
    );
  }

  /* ----- mobile frame shell ----- */
  function MobileFrame({ children, height = 760, label }) {
    return (
      <div style={{ width: 375, height }}>
        <div style={{
          width: 375, height,
          borderRadius: 36, padding: 8,
          background: "#1A1A1A",
          boxShadow: "0 24px 60px rgba(79,70,229,0.14), 0 6px 16px rgba(26,26,26,0.06)"
        }}>
          <div style={{
            width: "100%", height: "100%",
            background: EXPRESSIVE_BG,
            borderRadius: 28, overflow: "hidden",
            position: "relative",
            display: "flex", flexDirection: "column"
          }}>
            <div className="flex items-center justify-between px-6 pt-3 pb-1"
                 style={{ fontSize: 11, color: INK, fontWeight: 600 }}>
              <span>9:41</span>
              <span style={{ letterSpacing: 1, fontSize: 9, color: MUTE }}>{label}</span>
              <span className="mono" style={{ fontSize: 10, color: MUTE }}>●●●</span>
            </div>
            {children}
          </div>
        </div>
      </div>
    );
  }

  function TopBar() {
    return (
      <div className="px-5 pt-2 pb-3 flex items-center justify-between"
           style={{ borderBottom: `1px solid ${LINE}` }}>
        <a href="#" className="inline-flex items-center gap-1.5 text-[11px]" style={{ color: SUB }}>
          <Arrow dir="left" size={11} />
          <span>Back</span>
        </a>
        <StepRail current={6} total={8} />
        <div style={{ width: 36 }} aria-hidden="true" />
      </div>
    );
  }

  /* ----- Hero — short headline, inheriting O1's eyebrow + serif title ----- */
  function Hero() {
    return (
      <div className="px-5 pt-3 pb-2">
        <div className="label-xs flex items-center gap-1.5" style={{ color: MAGENTA, fontSize: 9.5 }}>
          <span style={{ width: 5, height: 5, borderRadius: 999, background: MAGENTA, display: "inline-block" }} />
          <span>What matters · last step before your plan</span>
        </div>
        <h2 className="serif mt-1.5" style={{ fontSize: 19, lineHeight: 1.2, letterSpacing: "-0.015em", fontWeight: 600 }}>
          A few words on what matters to you, and what's worrying you.
        </h2>
      </div>
    );
  }

  /* ============================================================
     Chip
     ============================================================ */
  function Chip({ label, selected, disabled, onClick }) {
    return (
      <button type="button" aria-pressed={selected} disabled={disabled} onClick={onClick}
        style={{
          display: "inline-flex", alignItems: "center", gap: 7,
          background: selected ? INK : "#FFFFFF",
          color: selected ? "#FFFFFF" : (disabled ? FAINT : INK),
          border: `1px solid ${selected ? INK : (disabled ? "#EAE7DF" : LINE)}`,
          borderRadius: 999,
          padding: "8px 12px",
          fontSize: 12.5,
          fontWeight: 500,
          lineHeight: 1.2,
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.3 : 1,
          transition: "background 120ms ease-out, border-color 120ms ease-out, opacity 160ms ease-out",
          textAlign: "left"
        }}>
        <span aria-hidden="true" style={{
          width: 14, height: 14, borderRadius: 999,
          border: `1.5px solid ${selected ? "#FFFFFF" : "#C9C5BD"}`,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          flex: "none"
        }}>
          {selected && (
            <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
              <path d="M2 5.2 L4.2 7.4 L8 3.2" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </span>
        <span>{label}</span>
      </button>
    );
  }

  /* ============================================================
     Group renderer — varies by B (cap feedback) and C (empty state)
     ============================================================ */
  function GroupHeader({ title, count, cap = 3, cVariant }) {
    /* C3 — counter inline with headline; no separate caption row.
       C1 / C2 — caption renders below in <GroupCaption /> instead. */
    return (
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="serif" style={{ fontSize: 15.5, lineHeight: 1.25, letterSpacing: "-0.01em", fontWeight: 600, color: INK }}>
          {title}
        </h3>
        {cVariant === "C3" && (
          <span className="mono tabular" style={{ fontSize: 10.5, color: count >= cap ? INK : MUTE, letterSpacing: "0.04em" }}>
            ({count} of {cap})
          </span>
        )}
      </div>
    );
  }

  function GroupCaption({ cVariant, count, cap = 3 }) {
    /* C1 — terse one-liner.
       C2 — two-line acknowledging caption.
       C3 — no caption at all (counter is in the header). */
    if (cVariant === "C3") return null;
    if (cVariant === "C1") {
      return (
        <p className="text-[11.5px] mt-1" style={{ color: MUTE, lineHeight: 1.4 }}>
          Pick up to {cap}.
        </p>
      );
    }
    /* C2 */
    return (
      <p className="text-[11.5px] mt-1" style={{ color: SUB, lineHeight: 1.45 }}>
        These can be hard to pick — go with what feels true today.
        <span style={{ color: MUTE }}> You can change them later.</span>
      </p>
    );
  }

  /* B2 caption — appears above chips when cap reached. B1/B3 don't render here. */
  function CapCaption({ bVariant, count, cap = 3 }) {
    if (bVariant !== "B2") return null;
    if (count < cap) return null;
    return (
      <p className="mono text-[10.5px] mt-2" style={{ color: INK, letterSpacing: "0.04em" }}>
        ({count} of {cap} selected) · tapping another swaps the oldest
      </p>
    );
  }

  /* B3 hint — appears below chips when cap reached. */
  function CapHint({ bVariant, count, cap = 3 }) {
    if (bVariant !== "B3") return null;
    if (count < cap) return null;
    return (
      <p className="text-[11px] mt-2.5 flex items-start gap-1.5" style={{ color: SUB, lineHeight: 1.4 }}>
        <span aria-hidden="true" style={{
          flex: "none", marginTop: 4,
          width: 5, height: 5, borderRadius: 999, background: TEAL
        }} />
        <span>You can pick up to {cap} — drop one to add another.</span>
      </p>
    );
  }

  function ChipGrid({ items, selectedSet, capReached, bVariant, onToggle }) {
    return (
      <div className="flex flex-wrap gap-1.5">
        {items.map((label) => {
          const selected = selectedSet.has(label);
          /* B1 — disable unselected when cap is reached.
             B2 — chips remain active; tap on 4th rolls oldest out (handled in toggle).
             B3 — chips remain active; hint shown below the group. */
          const disabled = bVariant === "B1" && capReached && !selected;
          return (
            <Chip key={label}
                  label={label}
                  selected={selected}
                  disabled={disabled}
                  onClick={() => onToggle(label)} />
          );
        })}
      </div>
    );
  }

  /* ============================================================
     Group block — header + caption + chip grid + cap feedback
     Used by every A treatment.
     ============================================================ */
  function Group({ title, items, selectedSet, bVariant, cVariant, onToggle, cap = 3 }) {
    const count = selectedSet.size;
    const capReached = count >= cap;
    return (
      <div>
        <GroupHeader title={title} count={count} cap={cap} cVariant={cVariant} />
        <GroupCaption cVariant={cVariant} count={count} cap={cap} />
        <CapCaption bVariant={bVariant} count={count} cap={cap} />
        <div className="mt-2.5">
          <ChipGrid items={items} selectedSet={selectedSet} capReached={capReached} bVariant={bVariant} onToggle={onToggle} />
        </div>
        <CapHint bVariant={bVariant} count={count} cap={cap} />
      </div>
    );
  }

  /* ============================================================
     useGroupState — manages a Set + handles B2's oldest-out logic.
     ============================================================ */
  function useGroupState(bVariant, cap = 3) {
    /* Track insertion order via array to support B2's "drop the oldest". */
    const [order, setOrder] = React.useState([]);
    const set = new Set(order);
    const toggle = (label) => {
      setOrder((prev) => {
        if (prev.includes(label)) return prev.filter((x) => x !== label);
        if (prev.length < cap) return [...prev, label];
        if (bVariant === "B2") return [...prev.slice(1), label];
        return prev; /* B1 disables the input; B3 silently no-ops. */
      });
    };
    const reset = () => setOrder([]);
    return { set, toggle, reset, count: order.length };
  }

  /* ============================================================
     A — group separation
       A1: two stacked plate-cards
       A2: one card with internal hairline divider
       A3: tabbed; group 2 unlocks once group 1 has 1+ selected
     ============================================================ */
  function CardPlate({ children, style }) {
    return (
      <div style={{
        background: "#FFFFFF",
        border: `1px solid ${LINE}`,
        borderRadius: 18,
        padding: 16,
        boxShadow: "0 1px 0 rgba(0,0,0,0.02)",
        ...style
      }}>
        {children}
      </div>
    );
  }

  function FormBody({ aTreatment = "A1", bVariant = "B1", cVariant = "C1",
                       priorities, worries }) {
    /* If state hooks weren't passed in (static A/B/C frames), spin up local. */
    const localPri = useGroupState(bVariant);
    const localWor = useGroupState(bVariant);
    const pri = priorities || localPri;
    const wor = worries    || localWor;

    const [tab, setTab] = React.useState(0); /* A3 only */
    const tab2Unlocked = pri.count >= 1;
    /* Force-revert to tab 0 if user clears group 1 to nothing. */
    React.useEffect(() => {
      if (aTreatment === "A3" && tab === 1 && !tab2Unlocked) setTab(0);
    }, [aTreatment, tab, tab2Unlocked]);

    const G1 = (
      <Group title="What's most important to you right now?"
             items={PRIORITIES}
             selectedSet={pri.set}
             bVariant={bVariant} cVariant={cVariant}
             onToggle={pri.toggle} />
    );
    const G2 = (
      <Group title="What worries you most?"
             items={WORRIES}
             selectedSet={wor.set}
             bVariant={bVariant} cVariant={cVariant}
             onToggle={wor.toggle} />
    );

    if (aTreatment === "A2") {
      return (
        <div className="px-4 pt-2 pb-3 flex-1 overflow-hidden">
          <CardPlate>
            {G1}
            <div className="my-4" style={{ borderTop: `1px solid ${HAIR}` }} />
            {G2}
          </CardPlate>
        </div>
      );
    }

    if (aTreatment === "A3") {
      return (
        <div className="px-4 pt-2 pb-3 flex-1 overflow-hidden flex flex-col">
          <div className="flex items-center gap-1 mb-3"
               style={{ background: "#EFEDE7", borderRadius: 999, padding: 3 }}>
            {[
              { label: "What matters",  i: 0, locked: false },
              { label: "What worries",  i: 1, locked: !tab2Unlocked }
            ].map((t) => {
              const active = tab === t.i;
              return (
                <button key={t.i} type="button"
                        onClick={() => { if (!t.locked) setTab(t.i); }}
                        disabled={t.locked}
                        style={{
                          flex: 1, padding: "7px 10px",
                          background: active ? "#FFFFFF" : "transparent",
                          color: t.locked ? FAINT : (active ? INK : SUB),
                          border: "none",
                          borderRadius: 999,
                          fontSize: 12, fontWeight: 600,
                          cursor: t.locked ? "not-allowed" : "pointer",
                          boxShadow: active ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
                          display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6
                        }}>
                  <span>{t.label}</span>
                  {t.locked && (
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <rect x="2.5" y="5.5" width="7" height="5" rx="1" stroke={FAINT} strokeWidth="1.2"/>
                      <path d="M4 5.5 V4 a2 2 0 0 1 4 0 V5.5" stroke={FAINT} strokeWidth="1.2"/>
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
          <CardPlate style={{ flex: 1 }}>
            {tab === 0 ? G1 : G2}
            {tab === 0 && (
              <p className="text-[10.5px] mt-3" style={{ color: MUTE, lineHeight: 1.35 }}>
                Pick at least one to unlock the next group.
              </p>
            )}
          </CardPlate>
        </div>
      );
    }

    /* A1 — two stacked plates */
    return (
      <div className="px-4 pt-2 pb-3 flex-1 overflow-hidden flex flex-col gap-3">
        <CardPlate>{G1}</CardPlate>
        <CardPlate>{G2}</CardPlate>
      </div>
    );
  }

  /* ----- footer / continue ----- */
  function Footer({ enabled = false, caption = null }) {
    return (
      <div className="px-5 pt-3 pb-4 mt-auto" style={{
        borderTop: `1px solid ${LINE}`,
        background: "rgba(255,255,255,0.6)",
        backdropFilter: "blur(10px)"
      }}>
        <div className="text-center text-[10.5px] mb-2.5 px-2" style={{ color: SUB, lineHeight: 1.35, minHeight: 14 }}>
          {caption}
        </div>
        <button disabled={!enabled} style={{
          width: "100%",
          background: enabled ? INK : "#E5E3DC",
          color: enabled ? "#FFFFFF" : DIS,
          padding: "13px 18px",
          borderRadius: 999,
          fontSize: 14, fontWeight: 600,
          border: "none",
          display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
          cursor: enabled ? "pointer" : "not-allowed"
        }}>
          <span>Build my plan</span>
          <Arrow dir="right" size={13} sw={2} />
        </button>
      </div>
    );
  }

  function defaultCaption(priCount, worCount) {
    /* No min-1 enforcement — Continue is always enabled. Caption nudges
       gently when nothing is picked, celebrates quietly when something is. */
    const total = priCount + worCount;
    if (total === 0) {
      return <span style={{ color: MUTE }}>You can continue without picking — your plan adapts either way.</span>;
    }
    return <span className="serif italic">{total} {total === 1 ? "thing" : "things"} noted — your plan will weight these.</span>;
  }

  /* ============================================================
     Static sample frames (each holds non-varied dimensions constant).
     A frames hold B1 + C1; B frames hold A1 + C1; C frames hold A1 + B1.
     We pre-fill 1–3 chips so reviewers can see the cap behaviours.
     ============================================================ */
  function StaticFrame({ aTreatment, bVariant, cVariant, label, prefill }) {
    /* prefill = { pri: [...], wor: [...] } */
    const pri = {
      set: new Set(prefill?.pri || []),
      toggle: () => {},
      reset: () => {},
      count: (prefill?.pri || []).length
    };
    const wor = {
      set: new Set(prefill?.wor || []),
      toggle: () => {},
      reset: () => {},
      count: (prefill?.wor || []).length
    };
    return (
      <MobileFrame label={label}>
        <TopBar />
        <Hero />
        <FormBody aTreatment={aTreatment} bVariant={bVariant} cVariant={cVariant}
                  priorities={pri} worries={wor} />
        <Footer enabled={true}
                caption={defaultCaption(pri.count, wor.count)} />
      </MobileFrame>
    );
  }

  /* A — group separation. Hold B1 + C1. */
  function A1() {
    return <StaticFrame aTreatment="A1" bVariant="B1" cVariant="C1"
      label="A1 · STACKED CARDS"
      prefill={{ pri: [PRIORITIES[1], PRIORITIES[3]], wor: [WORRIES[2]] }} />;
  }
  function A2() {
    return <StaticFrame aTreatment="A2" bVariant="B1" cVariant="C1"
      label="A2 · HAIRLINE SWITCH"
      prefill={{ pri: [PRIORITIES[1], PRIORITIES[3]], wor: [WORRIES[2]] }} />;
  }
  function A3() {
    return <StaticFrame aTreatment="A3" bVariant="B1" cVariant="C1"
      label="A3 · TABBED · GATED"
      prefill={{ pri: [PRIORITIES[1]], wor: [] }} />;
  }

  /* B — cap feedback. Hold A1 + C1. Prefill exactly 3 to show cap state. */
  function B1() {
    return <StaticFrame aTreatment="A1" bVariant="B1" cVariant="C1"
      label="B1 · DISABLED AT CAP"
      prefill={{ pri: [PRIORITIES[1], PRIORITIES[3], PRIORITIES[6]], wor: [WORRIES[2]] }} />;
  }
  function B2() {
    return <StaticFrame aTreatment="A1" bVariant="B2" cVariant="C1"
      label="B2 · OLDEST ROLLS OUT"
      prefill={{ pri: [PRIORITIES[1], PRIORITIES[3], PRIORITIES[6]], wor: [WORRIES[2]] }} />;
  }
  function B3() {
    return <StaticFrame aTreatment="A1" bVariant="B3" cVariant="C1"
      label="B3 · CALM HINT BELOW"
      prefill={{ pri: [PRIORITIES[1], PRIORITIES[3], PRIORITIES[6]], wor: [WORRIES[2]] }} />;
  }

  /* C — empty-state guidance. Hold A1 + B1. Empty prefill so caption shows. */
  function C1() {
    return <StaticFrame aTreatment="A1" bVariant="B1" cVariant="C1"
      label="C1 · TERSE"
      prefill={{ pri: [], wor: [] }} />;
  }
  function C2() {
    return <StaticFrame aTreatment="A1" bVariant="B1" cVariant="C2"
      label="C2 · ACKNOWLEDGING"
      prefill={{ pri: [], wor: [] }} />;
  }
  function C3() {
    return <StaticFrame aTreatment="A1" bVariant="B1" cVariant="C3"
      label="C3 · INLINE COUNTER"
      prefill={{ pri: [PRIORITIES[1]], wor: [] }} />;
  }

  return {
    /* Frames */
    A1, A2, A3, B1, B2, B3, C1, C2, C3,
    /* Building blocks */
    MobileFrame, TopBar, Hero, FormBody, Footer, Group, Chip, useGroupState,
    defaultCaption,
    /* Data */
    PRIORITIES, WORRIES,
    /* Tokens */
    INK, SUB, MUTE, FAINT, LINE, HAIR, PAPER, SOFT, DIS,
    VIOLET, INDIGO, MAGENTA, TEAL, EXPRESSIVE_BG
  };
})();

Object.assign(window, { o6 });
