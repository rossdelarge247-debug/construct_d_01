/* =========================================================================
   O8 — What's next · Expressive
   Exit screen of the pre-signup interview. Single radio question with four
   options; all four are legitimate exits. The screen must NOT push toward
   signup — visual subtlety is fine; copy pressure is not.

   Decisions resolved on the canvas:
     A — option visual weight  (A1 equal / A2 subtle primary / A3 two-tier)
     B — plan-recall framing   (B1 none  / B2 tiny chip      / B3 mini-card)
     C — empty-state default   (C1 none  / C2 pre-1          / C3 pre-2)
   Resolved: A1 · B2 · C1
   ========================================================================= */
const o8 = (() => {
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
  const VIOLET_SOFT = "#F3EEFE";
  const INDIGO = "#4F46E5";
  const MAGENTA= "#BE185D";
  const MAGENTA_SOFT = "#FCE7F3";
  const TEAL   = "#0D9488";

  /* Inherits O7's expressive hero. The exit screen and the plan are a pair —
     a closing two-step — so the same gradient binds them visually. */
  const EXPRESSIVE_BG  = "linear-gradient(180deg, #F3EEFE 0%, #FCE7F3 220px, #FBFAF6 480px, #FBFAF6 100%)";

  /* =========================
     Options (verbatim spec; order LOCKED — DO NOT REORDER)
     ========================= */
  const OPTIONS = [
    {
      id: "signup",
      title: "Create a free account and start building my picture",
      sub:   "Free to start; no card needed.",
      cta:   "Create my account",
      route: "signup flow"
    },
    {
      id: "download",
      title: "Download my plan and come back later",
      sub:   "We'll keep your answers for 30 days if you want to come back.",
      cta:   "Download my plan",
      route: "PDF + optional email-capture"
    },
    {
      id: "conventional",
      title: "I want to go the conventional route",
      sub:   "We'll point you to good starting places.",
      cta:   "See helpful links",
      route: "external-links page"
    },
    {
      id: "support",
      title: "I need to talk to someone first",
      sub:   "Here are people who can help.",
      cta:   "See support resources",
      route: "support-resources page"
    }
  ];

  /* =========================
     Tiny inline icons (12–18px). Subtle line-weight, no fills.
     ========================= */
  const Arrow = ({ size = 13, sw = 1.8, dir = "right" }) => {
    const r = { right: 0, left: 180, down: 90, up: 270 }[dir] || 0;
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ transform: `rotate(${r}deg)` }}>
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    );
  };

  /* Workspace / picture motif — three nested frames forming a "picture".
     Reads as: building something, layered, your picture. */
  const IconWorkspace = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="4.5" width="17" height="13" rx="2"/>
      <rect x="6.5"  y="7.5"  width="11" height="7"  rx="1"/>
      <circle cx="9"  cy="10.5" r="1.1"/>
      <path d="M7 14 L10 11.5 L13 13.5 L17 10"/>
    </svg>
  );

  /* Document w/ down-arrow — download / save */
  const IconDownload = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 3.5 H7 a1.5 1.5 0 0 0-1.5 1.5 V19 a1.5 1.5 0 0 0 1.5 1.5 H17 a1.5 1.5 0 0 0 1.5-1.5 V8 Z"/>
      <path d="M14 3.5 V8 H18.5"/>
      <line x1="12" y1="11.5" x2="12" y2="16.5"/>
      <polyline points="9.5 14 12 16.5 14.5 14"/>
    </svg>
  );

  /* Outward-pointing arrow from a tile — external / conventional route */
  const IconExternal = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13.5 5 H19 V10.5"/>
      <line x1="19" y1="5" x2="11.5" y2="12.5"/>
      <path d="M17 13.5 V18 a2 2 0 0 1-2 2 H6 a2 2 0 0 1-2-2 V9 a2 2 0 0 1 2-2 H10.5"/>
    </svg>
  );

  /* Speech-bubble pair — a conversation, "talk to someone" */
  const IconSupport = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.5 6 a1.5 1.5 0 0 1 1.5-1.5 H15 a1.5 1.5 0 0 1 1.5 1.5 V12 a1.5 1.5 0 0 1-1.5 1.5 H8.5 L5 16.5 V13.5 a1.5 1.5 0 0 1-1.5-1.5 Z"/>
      <path d="M8 16.5 a1.5 1.5 0 0 0 1.5 1.5 H15 L18.5 21 V18 a1.5 1.5 0 0 0 1.5-1.5 V11.5"/>
    </svg>
  );

  const ICONS = {
    signup:       IconWorkspace,
    download:     IconDownload,
    conventional: IconExternal,
    support:      IconSupport
  };

  /* =========================
     Step rail — step 8 of 8, fully filled (terminal step)
     ========================= */
  function StepRail({ current = 8, total = 8 }) {
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

  /* =========================
     Mobile frame — 375×667 (primary target)
     Smaller than O5/O6's 760 because the exit screen is intentionally short.
     ========================= */
  function MobileFrame({ children, height = 667, label }) {
    return (
      <div style={{ width: 375, height }}>
        <div style={{
          width: 375, height,
          borderRadius: 36, padding: 8,
          background: "#1A1A1A",
          boxShadow: "0 24px 60px rgba(124,58,237,0.14), 0 6px 16px rgba(26,26,26,0.06)"
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
      <div className="px-5 pt-2 pb-2.5 flex items-center justify-between"
           style={{ borderBottom: `1px solid ${LINE}` }}>
        <a href="#" className="inline-flex items-center gap-1.5 text-[11px]" style={{ color: SUB }}>
          <Arrow dir="left" size={11} />
          <span>Back</span>
        </a>
        <StepRail current={8} total={8} />
        <div style={{ width: 36 }} aria-hidden="true" />
      </div>
    );
  }

  /* =========================
     B — Plan-recall variants (rendered between TopBar and Hero)
     B1 nothing · B2 tiny chip · B3 mini-summary card
     ========================= */
  function PlanRecall({ bVariant }) {
    if (bVariant === "B1") return null;

    if (bVariant === "B2") {
      return (
        <div className="px-5 pt-3">
          <a href="#"
             className="inline-flex items-center gap-2"
             style={{
               background: "rgba(255,255,255,0.7)",
               border: `1px solid ${LINE}`,
               borderRadius: 999,
               padding: "5px 11px 5px 9px",
               fontSize: 11,
               color: INK,
               textDecoration: "none",
               backdropFilter: "blur(6px)"
             }}>
            <span aria-hidden="true" style={{
              width: 14, height: 14, borderRadius: 999,
              background: VIOLET_SOFT,
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              flex: "none"
            }}>
              <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                <path d="M2 5.2 L4.2 7.4 L8 3.2" stroke={VIOLET} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <span style={{ fontWeight: 500 }}>Your plan is ready</span>
            <span style={{ color: MUTE, fontSize: 10.5 }}>·</span>
            <span style={{ color: MUTE, fontSize: 10.5, display: "inline-flex", alignItems: "center", gap: 3 }}>
              <Arrow dir="left" size={9} sw={2}/> back to plan
            </span>
          </a>
        </div>
      );
    }

    /* B3 — mini-summary card */
    return (
      <div className="px-4 pt-3">
        <div style={{
          background: "#FFFFFF",
          border: `1px solid ${LINE}`,
          borderRadius: 14,
          padding: "11px 13px",
          display: "flex", alignItems: "flex-start", gap: 11
        }}>
          <div style={{
            flex: "none",
            width: 30, height: 30, borderRadius: 8,
            background: `linear-gradient(135deg, ${VIOLET_SOFT}, ${MAGENTA_SOFT})`,
            border: `1px solid ${LINE}`,
            display: "inline-flex", alignItems: "center", justifyContent: "center"
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={VIOLET} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="4" width="16" height="16" rx="2.5"/>
              <line x1="7" y1="9.5"  x2="14" y2="9.5"/>
              <line x1="7" y1="13"   x2="17" y2="13"/>
              <line x1="7" y1="16.5" x2="11" y2="16.5"/>
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="flex items-center justify-between">
              <div className="label-xs" style={{ color: MAGENTA, fontSize: 9 }}>Your plan</div>
              <a href="#" className="mono" style={{ fontSize: 9.5, color: MUTE, letterSpacing: "0.04em", textDecoration: "underline", textUnderlineOffset: 3 }}>view</a>
            </div>
            <div className="serif" style={{ fontSize: 13, lineHeight: 1.3, color: INK, fontWeight: 600, marginTop: 2 }}>
              5 sections · home, pension, children
            </div>
            <div className="text-[10.5px]" style={{ color: SUB, lineHeight: 1.35, marginTop: 2 }}>
              Saved for 30 days. Continue here or come back any time.
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================
     Hero — same eyebrow + serif title pattern as O6
     ========================= */
  function Hero({ tight = false }) {
    return (
      <div className="px-5" style={{ paddingTop: tight ? 8 : 12, paddingBottom: 10 }}>
        <div className="label-xs flex items-center gap-1.5" style={{ color: MAGENTA, fontSize: 9.5 }}>
          <span style={{ width: 5, height: 5, borderRadius: 999, background: MAGENTA, display: "inline-block" }} />
          <span>What's next · take it from here</span>
        </div>
        <h2 className="serif" style={{ fontSize: 21, lineHeight: 1.18, letterSpacing: "-0.02em", fontWeight: 600, marginTop: 6 }}>
          What would you like to do next?
        </h2>
        <p className="text-[12px]" style={{ color: SUB, lineHeight: 1.45, marginTop: 6 }}>
          There's no wrong answer. <span style={{ color: MUTE }}>You can come back anytime.</span>
        </p>
      </div>
    );
  }

  /* =========================
     OptionCard — the radio card. Inherits O1's hit-area + selected treatment.
     Selected: white bg + INK 1.5px border + filled INK radio.
     A2 "subtle primary" applies a faint tint to the first card when unselected.
     ========================= */
  function OptionCard({ option, selected, focused, primary, onSelect }) {
    const Icon = ICONS[option.id];
    return (
      <button type="button"
              role="radio" aria-checked={selected}
              onClick={onSelect}
              style={{
                display: "block",
                width: "100%",
                background: selected ? "#FFFFFF" : (primary ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.78)"),
                border: selected
                  ? `1.5px solid ${INK}`
                  : (primary ? `1px solid ${VIOLET}` : `1px solid ${LINE}`),
                boxShadow: selected
                  ? "0 1px 0 rgba(0,0,0,0.04), 0 6px 14px rgba(124,58,237,0.10)"
                  : (focused ? `0 0 0 2px ${VIOLET}, 0 1px 0 rgba(0,0,0,0.02)` : "0 1px 0 rgba(0,0,0,0.02)"),
                borderRadius: 16,
                padding: "12px 13px",
                textAlign: "left",
                cursor: "pointer",
                transition: "background 140ms ease-out, border-color 140ms ease-out, box-shadow 140ms ease-out, transform 140ms ease-out",
                transform: selected ? "translateY(-0.5px)" : "translateY(0)"
              }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 11 }}>
          {/* Radio dot */}
          <span aria-hidden="true" style={{
            flex: "none",
            width: 18, height: 18, borderRadius: 999,
            border: `1.5px solid ${selected ? INK : "#C9C5BD"}`,
            background: selected ? INK : "transparent",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            marginTop: 1,
            transition: "background 140ms ease-out, border-color 140ms ease-out"
          }}>
            {selected && (
              <span style={{
                width: 6, height: 6, borderRadius: 999, background: "#FFFFFF"
              }} />
            )}
          </span>

          {/* Title + sub */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="serif" style={{
              fontSize: 14,
              lineHeight: 1.25,
              letterSpacing: "-0.005em",
              fontWeight: 600,
              color: INK,
              textWrap: "pretty"
            }}>
              {option.title}
            </div>
            <div className="text-[11px]" style={{ color: SUB, lineHeight: 1.4, marginTop: 3 }}>
              {option.sub}
            </div>
          </div>

          {/* Icon */}
          <span aria-hidden="true" style={{
            flex: "none",
            width: 32, height: 32, borderRadius: 10,
            background: selected ? "#1A1A1A" : (primary ? VIOLET_SOFT : "#FAFAF7"),
            color: selected ? "#FFFFFF" : (primary ? VIOLET : MUTE),
            border: selected ? "none" : `1px solid ${selected ? "transparent" : LINE}`,
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            marginTop: 1,
            transition: "background 140ms ease-out, color 140ms ease-out"
          }}>
            <Icon size={17} />
          </span>
        </div>
      </button>
    );
  }

  /* =========================
     Options group — varies by A treatment
     A1: equal weight, single column
     A2: subtle primary tint on option 1
     A3: two-tier — engagement vs exit, soft divider
     ========================= */
  function OptionsGroup({ aTreatment, selectedId, focusId, onSelect }) {
    const cards = OPTIONS.map((opt, i) => (
      <OptionCard key={opt.id}
                  option={opt}
                  selected={selectedId === opt.id}
                  focused={focusId === opt.id}
                  primary={aTreatment === "A2" && i === 0}
                  onSelect={() => onSelect(opt.id)} />
    ));

    if (aTreatment === "A3") {
      return (
        <div role="radiogroup" aria-label="What would you like to do next?"
             className="px-4" style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          {cards.slice(0, 2)}
          <div className="flex items-center gap-2" style={{ padding: "2px 4px" }}>
            <span style={{ flex: 1, height: 1, background: HAIR }} />
            <span className="mono" style={{ fontSize: 9, color: MUTE, letterSpacing: "0.06em" }}>OR EXIT</span>
            <span style={{ flex: 1, height: 1, background: HAIR }} />
          </div>
          {cards.slice(2)}
        </div>
      );
    }

    return (
      <div role="radiogroup" aria-label="What would you like to do next?"
           className="px-4" style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {cards}
      </div>
    );
  }

  /* =========================
     Footer — Continue. Label is contextual to the selected option.
     C1: hidden when nothing selected.
     C2/C3: pre-selected, so always shown enabled.
     ========================= */
  function Footer({ selectedId, cVariant }) {
    const opt = OPTIONS.find((o) => o.id === selectedId);
    const enabled = !!opt;
    /* C1 — Continue is hidden until first selection (per spec).
       C2/C3 — pre-selected, so always shown. */
    const visible = cVariant !== "C1" || enabled;

    return (
      <div className="px-5 mt-auto" style={{
        paddingTop: 10, paddingBottom: 14,
        borderTop: `1px solid ${LINE}`,
        background: "rgba(255,255,255,0.62)",
        backdropFilter: "blur(10px)"
      }}>
        <div style={{
          minHeight: 46,
          display: "flex", alignItems: "center"
        }}>
          {visible ? (
            <button disabled={!enabled}
                    aria-disabled={!enabled}
                    style={{
              width: "100%",
              background: enabled ? INK : "#E5E3DC",
              color: enabled ? "#FFFFFF" : DIS,
              padding: "12px 18px",
              borderRadius: 999,
              fontSize: 14, fontWeight: 600,
              border: "none",
              display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
              cursor: enabled ? "pointer" : "not-allowed",
              transition: "background 160ms ease-out, color 160ms ease-out, opacity 160ms ease-out",
              animation: enabled ? "o8-cta-in 220ms ease-out" : "none"
            }}>
              <span>{opt ? opt.cta : "Continue"}</span>
              <Arrow dir="right" size={13} sw={2} />
            </button>
          ) : (
            <p className="text-[11px]" style={{ color: MUTE, lineHeight: 1.45, textAlign: "center", width: "100%" }}>
              Pick an option above to continue.
            </p>
          )}
        </div>
      </div>
    );
  }

  /* =========================
     useChoice — one-of selection state with optional default
     ========================= */
  function useChoice(cVariant) {
    const initial = cVariant === "C2" ? "signup" : (cVariant === "C3" ? "download" : null);
    const [selectedId, setSelectedId] = React.useState(initial);
    const [focusId, setFocusId] = React.useState(null);
    const reset = () => setSelectedId(initial);
    return { selectedId, setSelectedId, focusId, setFocusId, reset };
  }

  /* =========================
     ScreenBody — assembles a screen from A/B/C dimensions
     ========================= */
  function ScreenBody({ aTreatment = "A1", bVariant = "B2", cVariant = "C1", choice }) {
    const localChoice = useChoice(cVariant);
    const c = choice || localChoice;
    return (
      <>
        <TopBar />
        <PlanRecall bVariant={bVariant} />
        <Hero tight={bVariant !== "B1"} />
        <div style={{ flex: 1, minHeight: 0, paddingBottom: 8, overflow: "hidden" }}>
          <OptionsGroup aTreatment={aTreatment}
                        selectedId={c.selectedId}
                        focusId={c.focusId}
                        onSelect={c.setSelectedId} />
        </div>
        <Footer selectedId={c.selectedId} cVariant={cVariant} />
      </>
    );
  }

  /* =========================
     Static frame — used by canvas comparison cells (no shared state)
     ========================= */
  function StaticFrame({ aTreatment, bVariant, cVariant, label, prefill, focus }) {
    const fakeChoice = {
      selectedId: prefill || (cVariant === "C2" ? "signup" : cVariant === "C3" ? "download" : null),
      setSelectedId: () => {},
      focusId: focus || null,
      setFocusId: () => {},
      reset: () => {}
    };
    return (
      <MobileFrame label={label}>
        <ScreenBody aTreatment={aTreatment} bVariant={bVariant} cVariant={cVariant} choice={fakeChoice} />
      </MobileFrame>
    );
  }

  /* A — visual weight (hold B2 + C1 constant) */
  function A1() { return <StaticFrame aTreatment="A1" bVariant="B2" cVariant="C1" label="A1 · EQUAL WEIGHT" prefill={null} />; }
  function A2() { return <StaticFrame aTreatment="A2" bVariant="B2" cVariant="C1" label="A2 · SUBTLE PRIMARY" prefill={null} />; }
  function A3() { return <StaticFrame aTreatment="A3" bVariant="B2" cVariant="C1" label="A3 · TWO-TIER" prefill={null} />; }

  /* B — plan-recall framing (hold A1 + C1 constant) */
  function B1() { return <StaticFrame aTreatment="A1" bVariant="B1" cVariant="C1" label="B1 · NO RECALL" prefill={null} />; }
  function B2() { return <StaticFrame aTreatment="A1" bVariant="B2" cVariant="C1" label="B2 · TINY CHIP" prefill={null} />; }
  function B3() { return <StaticFrame aTreatment="A1" bVariant="B3" cVariant="C1" label="B3 · MINI SUMMARY" prefill={null} />; }

  /* C — empty-state default (hold A1 + B2 constant) */
  function C1() { return <StaticFrame aTreatment="A1" bVariant="B2" cVariant="C1" label="C1 · NO DEFAULT" prefill={null} />; }
  function C2() { return <StaticFrame aTreatment="A1" bVariant="B2" cVariant="C2" label="C2 · PRE-SIGNUP"  prefill="signup" />; }
  function C3() { return <StaticFrame aTreatment="A1" bVariant="B2" cVariant="C3" label="C3 · PRE-DOWNLOAD" prefill="download" />; }

  /* States — Default (nothing picked), Selected, Focus, post-Continue email */
  function StateDefault()  { return <StaticFrame aTreatment="A1" bVariant="B2" cVariant="C1" label="DEFAULT · NO CHOICE" prefill={null} />; }
  function StateSelected() { return <StaticFrame aTreatment="A1" bVariant="B2" cVariant="C1" label="SELECTED · OPTION 2" prefill="download" />; }
  function StateFocus()    { return <StaticFrame aTreatment="A1" bVariant="B2" cVariant="C1" label="FOCUS · OPTION 3"   prefill={null} focus="conventional" />; }

  /* =========================
     Email-capture micro-state — post-Continue for Option 2
     Single email input + secondary CTA. Calm treatment, no urgency.
     ========================= */
  function EmailCaptureMicro() {
    const [email, setEmail] = React.useState("");
    const [sent, setSent] = React.useState(false);
    return (
      <MobileFrame label="POST-CONTINUE · OPTION 2 · EMAIL">
        <div className="px-5 pt-2 pb-2.5 flex items-center justify-between"
             style={{ borderBottom: `1px solid ${LINE}` }}>
          <a href="#" className="inline-flex items-center gap-1.5 text-[11px]" style={{ color: SUB }}>
            <Arrow dir="left" size={11} />
            <span>Back</span>
          </a>
          <span className="mono" style={{ fontSize: 9, color: MUTE, letterSpacing: "0.06em" }}>STEP 8 · DOWNLOAD</span>
          <div style={{ width: 36 }} aria-hidden="true" />
        </div>

        <div className="px-5 pt-5 pb-2">
          <div className="label-xs flex items-center gap-1.5" style={{ color: MAGENTA, fontSize: 9.5 }}>
            <span style={{ width: 5, height: 5, borderRadius: 999, background: MAGENTA, display: "inline-block" }} />
            <span>Take it with you</span>
          </div>
          <h2 className="serif" style={{ fontSize: 20, lineHeight: 1.2, letterSpacing: "-0.02em", fontWeight: 600, marginTop: 6 }}>
            Your plan, ready to download.
          </h2>
          <p className="text-[12px]" style={{ color: SUB, lineHeight: 1.5, marginTop: 6 }}>
            We'll keep your answers for 30 days. Email yourself a copy and a link
            back to where you left off — optional.
          </p>
        </div>

        <div className="px-4" style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
          {/* Email input + send */}
          <div style={{
            background: "#FFFFFF",
            border: `1px solid ${LINE}`,
            borderRadius: 16,
            padding: "14px 14px"
          }}>
            <label htmlFor="o8-email" className="label-xs" style={{ color: MUTE, fontSize: 9.5 }}>
              Email me a copy
            </label>
            <div style={{
              marginTop: 8,
              display: "flex", alignItems: "center", gap: 8,
              borderBottom: `1px solid ${HAIR}`, paddingBottom: 9
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={MUTE} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none" }}>
                <rect x="3" y="5" width="18" height="14" rx="2"/>
                <path d="M3 7 L12 13 L21 7"/>
              </svg>
              <input id="o8-email" type="email"
                     value={email}
                     placeholder="you@example.com"
                     onChange={(e) => setEmail(e.target.value)}
                     style={{
                       flex: 1,
                       border: "none", outline: "none",
                       background: "transparent",
                       fontSize: 14, color: INK,
                       padding: 0
                     }} />
            </div>
            <button disabled={!email || sent}
                    onClick={() => setSent(true)}
                    style={{
                      marginTop: 12, width: "100%",
                      background: email ? INK : "#F0EEE9",
                      color: email ? "#FFFFFF" : MUTE,
                      padding: "11px 14px",
                      borderRadius: 999,
                      fontSize: 13.5, fontWeight: 600,
                      border: "none",
                      cursor: email ? "pointer" : "not-allowed",
                      display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7
                    }}>
              {sent ? (
                <>
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                    <path d="M2.5 7.2 L5.6 10.3 L11.5 4.4" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Sent — check your inbox</span>
                </>
              ) : (
                <>
                  <span>Send me my plan</span>
                  <Arrow dir="right" size={12} sw={2}/>
                </>
              )}
            </button>
            <p className="text-[10.5px]" style={{ color: MUTE, lineHeight: 1.4, marginTop: 8 }}>
              One message. We won't add you to anything.
            </p>
          </div>

          {/* Direct download — secondary, equal but quieter */}
          <button style={{
            width: "100%",
            background: "transparent",
            border: `1px solid ${LINE}`,
            borderRadius: 16,
            padding: "12px 14px",
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
            color: INK, fontSize: 13.5, fontWeight: 500,
            cursor: "pointer"
          }}>
            <IconDownload size={15}/>
            <span>Download the PDF now</span>
          </button>

          <a href="#" className="text-center text-[11px]" style={{ color: MUTE, textDecoration: "underline", textUnderlineOffset: 3, marginTop: 2 }}>
            Skip — I'll come back to it
          </a>
        </div>
      </MobileFrame>
    );
  }

  /* =========================
     Desktop adaptation — secondary
     Same component vocabulary, single column 520px wide, centred.
     Cards keep their mobile shape; container takes the page padding.
     ========================= */
  function DesktopAdaptation() {
    const choice = useChoice("C1");
    return (
      <div style={{
        width: 880, height: 600,
        background: EXPRESSIVE_BG,
        borderRadius: 14,
        border: `1px solid ${LINE}`,
        overflow: "hidden",
        display: "flex", flexDirection: "column"
      }}>
        <div className="flex items-center justify-between px-6 py-3"
             style={{ borderBottom: `1px solid ${LINE}`, background: "rgba(255,255,255,0.4)" }}>
          <div className="flex items-center gap-2.5">
            <div style={{
              width: 22, height: 22, borderRadius: 6,
              background: `linear-gradient(135deg, ${VIOLET_SOFT}, ${MAGENTA_SOFT})`,
              border: `1px solid ${LINE}`,
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              fontSize: 10, fontWeight: 700, color: VIOLET
            }}>D</div>
            <span style={{ fontSize: 12, fontWeight: 600, color: INK }}>Decouple</span>
            <span className="mono" style={{ fontSize: 10, color: MUTE, marginLeft: 6, letterSpacing: "0.04em" }}>· pre-signup interview</span>
          </div>
          <StepRail current={8} total={8} />
          <div className="flex items-center gap-3">
            <a href="#" className="text-[11px]" style={{ color: MUTE, textDecoration: "underline", textUnderlineOffset: 3 }}>Save & exit</a>
          </div>
        </div>

        <div style={{ flex: 1, display: "flex", justifyContent: "center", overflow: "auto" }}>
          <div style={{ width: 540, padding: "28px 24px 24px 24px" }}>
            <a href="#"
               className="inline-flex items-center gap-2"
               style={{
                 background: "rgba(255,255,255,0.7)",
                 border: `1px solid ${LINE}`,
                 borderRadius: 999,
                 padding: "5px 11px 5px 9px",
                 fontSize: 11.5,
                 color: INK,
                 textDecoration: "none"
               }}>
              <span aria-hidden="true" style={{
                width: 14, height: 14, borderRadius: 999, background: VIOLET_SOFT,
                display: "inline-flex", alignItems: "center", justifyContent: "center"
              }}>
                <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5.2 L4.2 7.4 L8 3.2" stroke={VIOLET} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <span style={{ fontWeight: 500 }}>Your plan is ready</span>
              <span style={{ color: MUTE }}>·</span>
              <span style={{ color: MUTE, display: "inline-flex", alignItems: "center", gap: 4 }}>
                <Arrow dir="left" size={10} sw={2}/> back to plan
              </span>
            </a>

            <div className="label-xs flex items-center gap-1.5" style={{ color: MAGENTA, fontSize: 10, marginTop: 22 }}>
              <span style={{ width: 5, height: 5, borderRadius: 999, background: MAGENTA, display: "inline-block" }} />
              <span>What's next · take it from here</span>
            </div>
            <h2 className="serif" style={{ fontSize: 28, lineHeight: 1.15, letterSpacing: "-0.02em", fontWeight: 600, marginTop: 8 }}>
              What would you like to do next?
            </h2>
            <p className="text-[13px]" style={{ color: SUB, lineHeight: 1.5, marginTop: 8 }}>
              There's no wrong answer. <span style={{ color: MUTE }}>You can come back anytime.</span>
            </p>

            <div role="radiogroup" aria-label="What would you like to do next?"
                 style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 22 }}>
              {OPTIONS.map((opt) => (
                <OptionCard key={opt.id}
                            option={opt}
                            selected={choice.selectedId === opt.id}
                            focused={choice.focusId === opt.id}
                            primary={false}
                            onSelect={() => choice.setSelectedId(opt.id)} />
              ))}
            </div>

            <div style={{
              marginTop: 22, paddingTop: 18,
              borderTop: `1px solid ${LINE}`,
              display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12
            }}>
              <p className="text-[11.5px]" style={{ color: MUTE, lineHeight: 1.45 }}>
                {choice.selectedId
                  ? `Continuing as: ${OPTIONS.find((o) => o.id === choice.selectedId).cta.toLowerCase()}.`
                  : "Pick an option to continue. Nothing happens until you choose."}
              </p>
              <button disabled={!choice.selectedId}
                      style={{
                        background: choice.selectedId ? INK : "#E5E3DC",
                        color: choice.selectedId ? "#FFFFFF" : DIS,
                        padding: "11px 20px",
                        borderRadius: 999,
                        fontSize: 13.5, fontWeight: 600,
                        border: "none",
                        cursor: choice.selectedId ? "pointer" : "not-allowed",
                        display: "inline-flex", alignItems: "center", gap: 8
                      }}>
                <span>{choice.selectedId ? OPTIONS.find((o) => o.id === choice.selectedId).cta : "Continue"}</span>
                <Arrow dir="right" size={13} sw={2}/>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return {
    /* Frames for canvas */
    A1, A2, A3, B1, B2, B3, C1, C2, C3,
    StateDefault, StateSelected, StateFocus,
    EmailCaptureMicro, DesktopAdaptation,
    /* Building blocks */
    MobileFrame, TopBar, PlanRecall, Hero, OptionsGroup, OptionCard, Footer, ScreenBody,
    useChoice,
    /* Data */
    OPTIONS, ICONS,
    /* Tokens */
    INK, SUB, MUTE, FAINT, LINE, HAIR, PAPER, SOFT, DIS,
    VIOLET, VIOLET_SOFT, INDIGO, MAGENTA, MAGENTA_SOFT, TEAL,
    EXPRESSIVE_BG
  };
})();

Object.assign(window, { o8 });
