/* =========================================================================
   O5 — What you know about your partner's finances · Expressive
   Mobile frames for suspicion-option treatment (A), helper-text framing (B),
   option order (C). Calmer EXPRESSIVE_BG, inherits O1 / O4.
   ========================================================================= */
const o5 = (() => {
  const INK    = "#1A1A1A";
  const SUB    = "#57534E";
  const MUTE   = "#78716C";
  const FAINT  = "#A8A29E";
  const LINE   = "#E5E3DC";
  const HAIR   = "#D6D3CC";
  const SOFT   = "#FAFAF7";
  const PAPER  = "#F5F5F4";
  const DIS    = "#A8A29E";
  const VIOLET = "#7C3AED";
  const INDIGO = "#4F46E5";
  const MAGENTA= "#BE185D";
  /* Same recipe as O4 — calmer expressive bg. */
  const EXPRESSIVE_BG = "linear-gradient(180deg, #EEEAF4 0%, #F8F5EF 300px, #F5F5F4 600px)";

  const Arrow = ({ size = 13, sw = 1.8, dir = "right" }) => {
    const r = { right: 0, left: 180, down: 90, up: 270 }[dir] || 0;
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ transform: `rotate(${r}deg)` }}>
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    );
  };

  /* ------- progress rail ------- */
  function StepRail({ current = 5, total = 8 }) {
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

  /* ============== MOBILE FRAME SHELL ============== */
  function MobileFrame({ children, height = 760, label, scale = 1 }) {
    return (
      <div style={{ width: 375 * scale, height: height * scale }}>
        <div style={{
          width: 375,
          height,
          borderRadius: 36,
          padding: 8,
          background: "#1A1A1A",
          boxShadow: "0 24px 60px rgba(79,70,229,0.14), 0 6px 16px rgba(26,26,26,0.06)",
          transform: `scale(${scale})`,
          transformOrigin: "top left"
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
        <StepRail current={5} total={8} />
        <div style={{ width: 36 }} aria-hidden="true" />
      </div>
    );
  }

  /* ------- the four knowledge options ------- */
  /* C1 spec-65 verbatim order: full / some / little / suspect */
  const OPT_FULL    = { key: "full",    primary: "I have a good idea of everything" };
  const OPT_SOME    = { key: "some",    primary: "I know some things but not all" };
  const OPT_LITTLE  = { key: "little",  primary: "Very little",            detail: "they managed the money" };
  const OPT_SUSPECT = { key: "suspect", primary: "I suspect they may be hiding things" };

  /* ------- a single radio row ------- */
  function OptionRow({ opt, selected, deemphasised = false, footnote = null, onSelect }) {
    return (
      <button type="button" aria-pressed={selected} onClick={onSelect} style={{
        display: "flex", alignItems: "flex-start", gap: 12,
        width: "100%",
        background: selected ? INK : "#FFFFFF",
        border: `1px solid ${selected ? INK : LINE}`,
        borderRadius: 14,
        padding: "14px 14px",
        textAlign: "left",
        cursor: "pointer",
        transition: "background 120ms ease-out, border-color 120ms ease-out",
        opacity: deemphasised && !selected ? 0.78 : 1
      }}>
        <span style={{
          flex: "none",
          marginTop: 2,
          width: 18, height: 18, borderRadius: 999,
          border: `1.5px solid ${selected ? "#FFFFFF" : "#C9C5BD"}`,
          background: selected ? INK : "#FFFFFF",
          display: "inline-flex", alignItems: "center", justifyContent: "center"
        }}>
          {selected && (<span style={{ width: 8, height: 8, borderRadius: 999, background: "#FFFFFF" }} />)}
        </span>
        <span style={{ flex: 1, lineHeight: 1.3 }}>
          <span style={{
            display: "block",
            fontSize: 14,
            fontWeight: 600,
            color: selected ? "#FFFFFF" : (deemphasised ? SUB : INK)
          }}>
            {opt.primary}
            {opt.detail && (
              <span className="serif italic" style={{ fontWeight: 400, color: selected ? "rgba(255,255,255,0.7)" : SUB, marginLeft: 6 }}>
                — {opt.detail}
              </span>
            )}
          </span>
          {footnote && (
            <span style={{
              display: "block",
              fontSize: 11.5,
              color: selected ? "rgba(255,255,255,0.7)" : MUTE,
              marginTop: 4,
              lineHeight: 1.4
            }}>
              {footnote}
            </span>
          )}
        </span>
      </button>
    );
  }

  /* ------- helper-text strings ------- */
  const HELPERS = {
    B1: "There's no wrong answer. Many people don't know everything.",
    B2: "This helps us know how much support you'll need with disclosure.",
    B3: null
  };

  /* ------- Hero — varies by B framing ------- */
  function Hero({ framing = "B1" }) {
    const helper = HELPERS[framing];
    return (
      <div className="px-5 pt-4 pb-3">
        <div className="label-xs flex items-center gap-1.5" style={{ color: INDIGO, fontSize: 9.5 }}>
          <span style={{ width: 5, height: 5, borderRadius: 999, background: INDIGO, display: "inline-block" }} />
          <span>Money · their side</span>
        </div>
        <h2 className="serif mt-2" style={{ fontSize: 21, lineHeight: 1.18, letterSpacing: "-0.015em", fontWeight: 600 }}>
          How much do you know about your partner's financial situation?
        </h2>
        {helper && (
          <p className="mt-2 text-[12px]" style={{ color: SUB, lineHeight: 1.45 }}>
            {helper}
          </p>
        )}
      </div>
    );
  }

  /* ------- Footer / continue ------- */
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
          <span>Continue</span>
          <Arrow dir="right" size={13} sw={2} />
        </button>
      </div>
    );
  }

  /* ============== Build the option list per C variant ============== */
  /* Returns either an array of rows, or — for separated layouts — a tuple
     of two arrays + a divider header. */
  function orderedOptions(variant) {
    if (variant === "C1") {
      return { kind: "flat", rows: [OPT_FULL, OPT_SOME, OPT_LITTLE, OPT_SUSPECT] };
    }
    if (variant === "C2") {
      // most-knowing → least-knowing, with "suspect" set apart at the bottom
      return {
        kind: "split",
        primary: [OPT_FULL, OPT_SOME, OPT_LITTLE],
        secondary: [OPT_SUSPECT]
      };
    }
    // C3 — reversed: very little → good idea, with suspect last (still last,
    // but kept inline with the rest — no separator)
    return { kind: "flat", rows: [OPT_LITTLE, OPT_SOME, OPT_FULL, OPT_SUSPECT] };
  }

  /* ============== Render the body of the form, given:
        - aTreatment: A1 / A2 / A3
        - cVariant: C1 / C2 / C3
        - selectedKey, onSelect: live state plumbing
     ============== */
  function FormBody({ aTreatment, cVariant, selectedKey = null, onSelect = () => {} }) {
    const ord = orderedOptions(cVariant);

    /* Decide where the suspicion row lives, and what visual treatment it gets. */
    /* A1 — identical weight, plain row.
       A2 — slightly muted + smaller helper caption underneath.
       A3 — separated below a hairline divider with "If you have concerns…" header. */
    const renderSuspectRow = () => {
      const base = OPT_SUSPECT;
      if (aTreatment === "A2") {
        return (
          <OptionRow
            key={base.key}
            opt={base}
            selected={selectedKey === base.key}
            deemphasised={true}
            footnote={"We'll show you what to look for if so."}
            onSelect={() => onSelect(base.key)}
          />
        );
      }
      return (
        <OptionRow
          key={base.key}
          opt={base}
          selected={selectedKey === base.key}
          onSelect={() => onSelect(base.key)}
        />
      );
    };

    const renderPlain = (opt) => (
      <OptionRow
        key={opt.key}
        opt={opt}
        selected={selectedKey === opt.key}
        onSelect={() => onSelect(opt.key)}
      />
    );

    /* A3 wants a divider above the suspicion option regardless of C ordering.
       It's the strongest piece of treatment — the option literally lives
       under a "If you have concerns…" header. */
    if (aTreatment === "A3") {
      const nonSuspect = ord.kind === "split"
        ? ord.primary
        : ord.rows.filter((r) => r.key !== "suspect");
      return (
        <div className="px-5 pt-1 pb-3 flex-1 overflow-hidden flex flex-col">
          <div className="space-y-2">
            {nonSuspect.map(renderPlain)}
          </div>
          <div className="mt-5 mb-3" style={{ borderTop: `1px solid ${HAIR}` }} />
          <div className="text-[11px] mb-2 flex items-center gap-2" style={{ color: SUB }}>
            <span className="serif italic">If you have concerns…</span>
          </div>
          <div className="space-y-2">
            {renderSuspectRow()}
          </div>
        </div>
      );
    }

    /* A1 / A2 — body follows the C ordering as-is, no divider above suspect. */
    if (ord.kind === "split") {
      return (
        <div className="px-5 pt-1 pb-3 flex-1 overflow-hidden flex flex-col">
          <div className="space-y-2">
            {ord.primary.map(renderPlain)}
          </div>
          {/* C2 in A1/A2 — still sits "below" but without a heavy header. */}
          <div className="mt-3 space-y-2">
            {renderSuspectRow()}
          </div>
        </div>
      );
    }

    return (
      <div className="px-5 pt-1 pb-3 flex-1 overflow-hidden flex flex-col">
        <div className="space-y-2">
          {ord.rows.map((opt) => (
            opt.key === "suspect" ? renderSuspectRow() : renderPlain(opt)
          ))}
        </div>
      </div>
    );
  }

  /* ============== Default footer caption (calm, generic) ============== */
  function defaultCaption(enabled) {
    return enabled
      ? <span className="serif italic">Answer recorded — continue when ready.</span>
      : <span style={{ color: MUTE }}>Pick the answer closest to what's true today.</span>;
  }

  /* ============== A — SUSPICION-OPTION TREATMENT ============== */
  /* All A frames hold B1 + C1 (verbatim order) constant so the ONLY thing
     varying is how the fourth option presents. */
  function FrameA({ treatment, label }) {
    return (
      <MobileFrame label={label}>
        <TopBar />
        <Hero framing="B1" />
        <FormBody aTreatment={treatment} cVariant="C1" />
        <Footer enabled={false} caption={defaultCaption(false)} />
      </MobileFrame>
    );
  }
  function A1() { return <FrameA treatment="A1" label="A1 · IDENTICAL WEIGHT" />; }
  function A2() { return <FrameA treatment="A2" label="A2 · SUBTLE DE-EMPHASIS" />; }
  function A3() { return <FrameA treatment="A3" label="A3 · IF YOU HAVE CONCERNS…" />; }

  /* ============== B — HELPER-TEXT FRAMING ============== */
  /* All B frames hold A1 (identical weight) + C1 constant. */
  function FrameB({ framing, label }) {
    return (
      <MobileFrame label={label}>
        <TopBar />
        <Hero framing={framing} />
        <FormBody aTreatment="A1" cVariant="C1" />
        <Footer enabled={false} caption={defaultCaption(false)} />
      </MobileFrame>
    );
  }
  function B1() { return <FrameB framing="B1" label="B1 · NO WRONG ANSWER" />; }
  function B2() { return <FrameB framing="B2" label="B2 · DISCLOSURE FRAMING" />; }
  function B3() { return <FrameB framing="B3" label="B3 · NO HELPER" />; }

  /* ============== C — ORDER OF OPTIONS ============== */
  /* All C frames hold A1 + B1 constant. */
  function FrameC({ variant, label }) {
    return (
      <MobileFrame label={label}>
        <TopBar />
        <Hero framing="B1" />
        <FormBody aTreatment="A1" cVariant={variant} />
        <Footer enabled={false} caption={defaultCaption(false)} />
      </MobileFrame>
    );
  }
  function C1() { return <FrameC variant="C1" label="C1 · VERBATIM" />; }
  function C2() { return <FrameC variant="C2" label="C2 · KNOWING → LEAST" />; }
  function C3() { return <FrameC variant="C3" label="C3 · REVERSED" />; }

  return {
    A1, A2, A3, B1, B2, B3, C1, C2, C3,
    OPT_FULL, OPT_SOME, OPT_LITTLE, OPT_SUSPECT,
    OptionRow, Hero, Footer, TopBar, MobileFrame, StepRail, Arrow,
    FormBody, orderedOptions, HELPERS, defaultCaption,
    INK, SUB, MUTE, FAINT, LINE, HAIR, PAPER, SOFT, DIS,
    VIOLET, INDIGO, MAGENTA, EXPRESSIVE_BG
  };
})();

Object.assign(window, { o5 });
