/* =========================================================================
   O2 — Your Situation · Expressive
   Mobile frames for grouping (A), children reveal (B), continue affordance (C)
   ========================================================================= */
const o2 = (() => {
  const INK    = "#1A1A1A";
  const SUB    = "#57534E";
  const MUTE   = "#78716C";
  const LINE   = "#E5E3DC";
  const SOFT   = "#FAFAF7";
  const PAPER  = "#F5F5F4";
  const DIS    = "#A8A29E";
  const VIOLET = "#7C3AED";
  const MAGENTA= "#BE185D";
  /* calmer expressive bg — lilac → cream, no magenta stop */
  const EXPRESSIVE_BG = "linear-gradient(180deg, #F3EEFE 0%, #FAF6F0 320px, #F5F5F4 600px)";

  const Arrow = ({ size = 13, sw = 1.8, dir = "right" }) => {
    const r = { right: 0, left: 180, down: 90, up: 270 }[dir] || 0;
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ transform: `rotate(${r}deg)` }}>
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    );
  };
  const Check = ({ size = 10, sw = 2.5 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );

  /* ------- progress rail (matches O1 compact stepper) ------- */
  function StepRail({ current = 2, total = 8 }) {
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

  /* ------- chip group ------- */
  function Chip({ label, selected, disabled, focus, dim, onClick }) {
    return (
      <button type="button" onClick={onClick} aria-pressed={selected} disabled={disabled}
              style={{
                background: selected ? INK : "#FFFFFF",
                color: selected ? "#FFFFFF" : (disabled || dim ? DIS : INK),
                border: `1px solid ${selected ? INK : (disabled || dim ? "#EBE9E2" : LINE)}`,
                borderRadius: 999,
                padding: "9px 13px",
                fontSize: 12.5,
                fontWeight: selected ? 600 : 500,
                lineHeight: 1.1,
                whiteSpace: "nowrap",
                outline: focus ? `2px solid ${INK}` : "none",
                outlineOffset: focus ? 2 : 0,
                cursor: disabled ? "not-allowed" : "pointer",
                transition: "background 120ms ease-out, border-color 120ms ease-out, color 120ms ease-out",
                opacity: dim ? 0.55 : 1
              }}>
        {label}
      </button>
    );
  }

  function ChipRow({ items, selectedIdx = -1, dim = false, disabled = false }) {
    return (
      <div className="flex flex-wrap gap-1.5">
        {items.map((it, i) => (
          <Chip key={i} label={it} selected={i === selectedIdx} dim={dim} disabled={disabled} />
        ))}
      </div>
    );
  }

  /* ------- sub-question label (small caps, equal weight) ------- */
  function SubLabel({ children, n }) {
    return (
      <div className="flex items-baseline gap-2 mb-2">
        <span className="mono" style={{ fontSize: 9.5, color: MUTE, letterSpacing: "0.1em" }}>
          {n ? `${n} · ` : ""}
        </span>
        <div className="serif" style={{ fontSize: 14, fontWeight: 600, color: INK, lineHeight: 1.2 }}>
          {children}
        </div>
      </div>
    );
  }

  /* ------- the four sub-question definitions ------- */
  const Q = {
    relationship: {
      label: "Relationship",
      items: ["Married", "Civil partnership", "Cohabiting", "Other"]
    },
    living: {
      label: "Living together",
      items: ["Yes", "No", "Complicated"]
    },
    children: {
      label: "Children under 18",
      items: ["No", "Yes"]
    },
    childrenCount: {
      label: "How many?",
      items: ["1", "2", "3", "4+"]
    },
    home: {
      label: "Your home",
      items: ["Own with mortgage", "Own outright", "Rent", "Other"]
    }
  };

  /* ============== MOBILE FRAME SHELL ============== */
  function MobileFrame({ children, height = 760, label }) {
    return (
      <div style={{
        width: 375,
        height,
        borderRadius: 36,
        padding: 8,
        background: "#1A1A1A",
        boxShadow: "0 24px 60px rgba(124,58,237,0.16), 0 6px 16px rgba(26,26,26,0.06)"
      }}>
        <div style={{
          width: "100%", height: "100%",
          background: EXPRESSIVE_BG,
          borderRadius: 28, overflow: "hidden",
          position: "relative",
          display: "flex", flexDirection: "column"
        }}>
          {/* status bar (faint) */}
          <div className="flex items-center justify-between px-6 pt-3 pb-1"
               style={{ fontSize: 11, color: INK, fontWeight: 600 }}>
            <span>9:41</span>
            <span style={{ letterSpacing: 1, fontSize: 9, color: MUTE }}>{label}</span>
            <span className="mono" style={{ fontSize: 10, color: MUTE }}>●●●</span>
          </div>
          {children}
        </div>
      </div>
    );
  }

  /* topbar inside the screen — back + step rail */
  function TopBar({ current = 2 }) {
    return (
      <div className="px-5 pt-2 pb-3 flex items-center justify-between"
           style={{ borderBottom: `1px solid ${LINE}` }}>
        <a href="#" className="inline-flex items-center gap-1.5 text-[11px]" style={{ color: SUB }}>
          <Arrow dir="left" size={11} />
          <span>Back</span>
        </a>
        <StepRail current={current} total={8} />
        <div style={{ width: 36 }} aria-hidden="true" />
      </div>
    );
  }

  /* hero block — eyebrow + headline */
  function Hero() {
    return (
      <div className="px-5 pt-4 pb-2">
        <div className="label-xs" style={{ color: VIOLET, fontSize: 9.5 }}>Tell us about you</div>
        <h2 className="serif mt-2" style={{ fontSize: 26, lineHeight: 1.05, letterSpacing: "-0.02em", fontWeight: 600 }}>
          Your <span className="italic" style={{ fontWeight: 400 }}>situation</span>.
        </h2>
      </div>
    );
  }

  /* ============== CTA FOOTER ============== */
  function Footer({ variant = "C1", answered = 0, total = 4 }) {
    /* C1 — disabled until all 4 answered */
    /* C2 — enabled after first answer, X/N progress indicator */
    /* C3 — always enabled, soft hint if some unanswered */
    const c1Enabled = variant === "C1" && answered === total;
    const c2Enabled = variant === "C2" && answered >= 1;
    const c3Enabled = variant === "C3";
    const enabled = c1Enabled || c2Enabled || c3Enabled;

    return (
      <div className="px-5 pt-3 pb-4 mt-auto" style={{
        borderTop: `1px solid ${LINE}`,
        background: "rgba(255,255,255,0.6)",
        backdropFilter: "blur(10px)"
      }}>
        {variant === "C1" && (
          <div className="flex items-center justify-center gap-1.5 text-[10px] mb-2.5" style={{ color: MUTE }}>
            <span>{answered} of {total} answered</span>
          </div>
        )}
        {variant === "C2" && (
          <div className="flex items-center justify-center gap-2 text-[10px] mb-2.5" style={{ color: MUTE }}>
            <div className="flex items-center gap-1">
              {Array.from({ length: total }).map((_, i) => (
                <div key={i} style={{
                  width: 14, height: 3, borderRadius: 2,
                  background: i < answered ? INK : "#D6D3CC"
                }} />
              ))}
            </div>
            <span className="tabular">{answered} / {total}</span>
          </div>
        )}
        {variant === "C3" && answered < total && (
          <div className="text-center text-[10.5px] mb-2.5 px-2" style={{ color: SUB, lineHeight: 1.35 }}>
            <span className="italic serif">You've left {total - answered} question{total - answered === 1 ? "" : "s"} unanswered — that's OK.</span>
          </div>
        )}
        {variant === "C3" && answered === total && (
          <div className="text-[10.5px] mb-2.5 text-center" style={{ color: MUTE }}>All four answered.</div>
        )}

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

  /* ============== A — SUB-QUESTION GROUPING ============== */

  /* card style */
  const cardStyle = {
    background: "#FFFFFF",
    border: `1px solid ${LINE}`,
    borderRadius: 14,
    padding: "14px 14px",
    boxShadow: "0 1px 0 rgba(26,26,26,0.02)"
  };

  /* A1 — 4 cards stacked, one sub-question per card */
  function A1({ footerVariant = "C1", answered = 4, childCountVisible = false }) {
    return (
      <MobileFrame label="A1 · 4 CARDS">
        <TopBar />
        <Hero />
        <div className="px-5 pt-2 pb-3 space-y-2.5 overflow-hidden flex-1">
          <div style={cardStyle}>
            <SubLabel>Relationship</SubLabel>
            <ChipRow items={Q.relationship.items} selectedIdx={0} />
          </div>
          <div style={cardStyle}>
            <SubLabel>Living together</SubLabel>
            <ChipRow items={Q.living.items} selectedIdx={0} />
          </div>
          <div style={cardStyle}>
            <SubLabel>Children under 18</SubLabel>
            <ChipRow items={Q.children.items} selectedIdx={1} />
            {childCountVisible && (
              <div className="mt-2.5 pt-2.5" style={{ borderTop: `1px dashed ${LINE}` }}>
                <div className="text-[11px] mb-1.5" style={{ color: SUB }}>How many?</div>
                <ChipRow items={Q.childrenCount.items} selectedIdx={1} />
              </div>
            )}
          </div>
          <div style={cardStyle}>
            <SubLabel>Your home</SubLabel>
            <ChipRow items={Q.home.items} selectedIdx={0} />
          </div>
        </div>
        <Footer variant={footerVariant} answered={answered} total={4} />
      </MobileFrame>
    );
  }

  /* A2 — paired into 2 cards */
  function A2() {
    return (
      <MobileFrame label="A2 · 2 PAIRED CARDS">
        <TopBar />
        <Hero />
        <div className="px-5 pt-2 pb-3 space-y-3 overflow-hidden flex-1">
          <div style={cardStyle}>
            <div className="mono mb-2.5" style={{ fontSize: 9.5, color: VIOLET, letterSpacing: "0.12em" }}>HOUSEHOLD STATUS</div>
            <SubLabel>Relationship</SubLabel>
            <ChipRow items={Q.relationship.items} selectedIdx={0} />
            <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${LINE}` }}>
              <SubLabel>Living together</SubLabel>
              <ChipRow items={Q.living.items} selectedIdx={0} />
            </div>
          </div>
          <div style={cardStyle}>
            <div className="mono mb-2.5" style={{ fontSize: 9.5, color: VIOLET, letterSpacing: "0.12em" }}>DEPENDENTS &amp; HOUSING</div>
            <SubLabel>Children under 18</SubLabel>
            <ChipRow items={Q.children.items} selectedIdx={0} />
            <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${LINE}` }}>
              <SubLabel>Your home</SubLabel>
              <ChipRow items={Q.home.items} selectedIdx={0} />
            </div>
          </div>
        </div>
        <Footer variant="C1" answered={4} total={4} />
      </MobileFrame>
    );
  }

  /* A3 — single tall card, hairline-divided */
  function A3() {
    const Section = ({ label, items, selectedIdx, last }) => (
      <div className={"py-3" + (last ? "" : "")} style={!last ? { borderBottom: `1px solid ${LINE}` } : {}}>
        <SubLabel>{label}</SubLabel>
        <ChipRow items={items} selectedIdx={selectedIdx} />
      </div>
    );
    return (
      <MobileFrame label="A3 · ONE TALL CARD">
        <TopBar />
        <Hero />
        <div className="px-5 pt-2 pb-3 overflow-hidden flex-1">
          <div style={{ ...cardStyle, padding: "4px 14px" }}>
            <Section label="Relationship"      items={Q.relationship.items} selectedIdx={0} />
            <Section label="Living together"   items={Q.living.items}       selectedIdx={0} />
            <Section label="Children under 18" items={Q.children.items}     selectedIdx={0} />
            <Section label="Your home"         items={Q.home.items}         selectedIdx={0} last />
          </div>
        </div>
        <Footer variant="C1" answered={4} total={4} />
      </MobileFrame>
    );
  }

  /* ============== B — CHILDREN "YES" REVEAL ============== */

  /* B1 — inline reveal: count chips appear under Yes */
  function B1() {
    return (
      <MobileFrame label="B1 · INLINE REVEAL">
        <TopBar />
        <Hero />
        <div className="px-5 pt-2 pb-3 space-y-2.5 overflow-hidden flex-1">
          <div style={{ ...cardStyle, opacity: 0.55 }}>
            <SubLabel>Relationship</SubLabel>
            <ChipRow items={Q.relationship.items} selectedIdx={0} dim />
          </div>
          <div style={{ ...cardStyle, opacity: 0.55 }}>
            <SubLabel>Living together</SubLabel>
            <ChipRow items={Q.living.items} selectedIdx={0} dim />
          </div>
          {/* focused: children with inline reveal */}
          <div style={{ ...cardStyle, border: `1.5px solid ${INK}`, boxShadow: "0 4px 14px rgba(26,26,26,0.06)" }}>
            <SubLabel>Children under 18</SubLabel>
            <ChipRow items={Q.children.items} selectedIdx={1} />
            <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${LINE}` }}>
              <div className="text-[11.5px] mb-1.5" style={{ color: SUB }}>How many?</div>
              <ChipRow items={Q.childrenCount.items} selectedIdx={1} />
            </div>
          </div>
          <div style={{ ...cardStyle, opacity: 0.55 }}>
            <SubLabel>Your home</SubLabel>
            <ChipRow items={Q.home.items} selectedIdx={-1} dim />
          </div>
        </div>
        <Footer variant="C1" answered={3} total={4} />
      </MobileFrame>
    );
  }

  /* B2 — separate row always visible, greyed until Yes */
  function B2() {
    return (
      <MobileFrame label="B2 · ALWAYS-VISIBLE">
        <TopBar />
        <Hero />
        <div className="px-5 pt-2 pb-3 space-y-2.5 overflow-hidden flex-1">
          <div style={{ ...cardStyle, opacity: 0.55 }}>
            <SubLabel>Relationship</SubLabel>
            <ChipRow items={Q.relationship.items} selectedIdx={0} dim />
          </div>
          <div style={{ ...cardStyle, opacity: 0.55 }}>
            <SubLabel>Living together</SubLabel>
            <ChipRow items={Q.living.items} selectedIdx={0} dim />
          </div>
          <div style={{ ...cardStyle, border: `1.5px solid ${INK}`, boxShadow: "0 4px 14px rgba(26,26,26,0.06)" }}>
            <SubLabel>Children under 18</SubLabel>
            <ChipRow items={Q.children.items} selectedIdx={0} />
            {/* always-visible follow-up, dimmed because No was selected */}
            <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${LINE}` }}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="text-[11.5px]" style={{ color: DIS }}>How many?</div>
                <div className="mono text-[9.5px]" style={{ color: DIS, letterSpacing: "0.08em" }}>SELECT YES TO ENABLE</div>
              </div>
              <ChipRow items={Q.childrenCount.items} selectedIdx={-1} dim disabled />
            </div>
          </div>
          <div style={{ ...cardStyle, opacity: 0.55 }}>
            <SubLabel>Your home</SubLabel>
            <ChipRow items={Q.home.items} selectedIdx={-1} dim />
          </div>
        </div>
        <Footer variant="C1" answered={3} total={4} />
      </MobileFrame>
    );
  }

  /* B3 — bottom-sheet micro-modal */
  function B3() {
    return (
      <MobileFrame label="B3 · BOTTOM SHEET">
        <TopBar />
        <Hero />
        {/* faded background content */}
        <div className="px-5 pt-2 pb-3 space-y-2.5 overflow-hidden flex-1" style={{ filter: "blur(0.5px)", opacity: 0.5 }}>
          <div style={cardStyle}>
            <SubLabel>Relationship</SubLabel>
            <ChipRow items={Q.relationship.items} selectedIdx={0} />
          </div>
          <div style={cardStyle}>
            <SubLabel>Living together</SubLabel>
            <ChipRow items={Q.living.items} selectedIdx={0} />
          </div>
          <div style={cardStyle}>
            <SubLabel>Children under 18</SubLabel>
            <ChipRow items={Q.children.items} selectedIdx={1} />
          </div>
          <div style={cardStyle}>
            <SubLabel>Your home</SubLabel>
            <ChipRow items={Q.home.items} selectedIdx={-1} />
          </div>
        </div>
        {/* scrim */}
        <div className="absolute inset-0" style={{ background: "rgba(26,26,26,0.32)" }} />
        {/* sheet */}
        <div className="absolute left-0 right-0 bottom-0" style={{
          background: "#FFFFFF",
          borderTopLeftRadius: 22,
          borderTopRightRadius: 22,
          padding: "14px 20px 20px",
          boxShadow: "0 -10px 30px rgba(26,26,26,0.16)"
        }}>
          <div className="mx-auto mb-3" style={{ width: 36, height: 4, borderRadius: 2, background: "#D6D3CC" }} />
          <div className="serif mb-1" style={{ fontSize: 17, fontWeight: 600, color: INK, lineHeight: 1.2 }}>How many children?</div>
          <div className="text-[11.5px] mb-3" style={{ color: SUB }}>Under 18, in your household.</div>
          <div className="flex gap-2 mb-3">
            {Q.childrenCount.items.map((it, i) => (
              <button key={i} type="button"
                      style={{
                        flex: 1,
                        background: i === 1 ? INK : "#FFFFFF",
                        color:      i === 1 ? "#FFFFFF" : INK,
                        border: `1px solid ${i === 1 ? INK : LINE}`,
                        borderRadius: 12,
                        padding: "14px 0",
                        fontSize: 16, fontWeight: 600
                      }}>
                {it}
              </button>
            ))}
          </div>
          <button style={{
            width: "100%", background: INK, color: "#FFF",
            padding: "12px 18px", borderRadius: 999,
            fontSize: 13, fontWeight: 600, border: "none"
          }}>
            Done
          </button>
        </div>
      </MobileFrame>
    );
  }

  /* ============== C — CONTINUE AFFORDANCE ============== */

  /* C1 — disabled until all 4 answered (3/4 shown) */
  function C1() {
    return (
      <MobileFrame label="C1 · GATED">
        <TopBar />
        <Hero />
        <div className="px-5 pt-2 pb-3 space-y-2.5 overflow-hidden flex-1">
          <div style={cardStyle}>
            <SubLabel>Relationship</SubLabel>
            <ChipRow items={Q.relationship.items} selectedIdx={0} />
          </div>
          <div style={cardStyle}>
            <SubLabel>Living together</SubLabel>
            <ChipRow items={Q.living.items} selectedIdx={0} />
          </div>
          <div style={cardStyle}>
            <SubLabel>Children under 18</SubLabel>
            <ChipRow items={Q.children.items} selectedIdx={0} />
          </div>
          <div style={cardStyle}>
            <SubLabel>Your home</SubLabel>
            <ChipRow items={Q.home.items} selectedIdx={-1} />
          </div>
        </div>
        <Footer variant="C1" answered={3} total={4} />
      </MobileFrame>
    );
  }

  /* C2 — progress dots, enabled after first */
  function C2() {
    return (
      <MobileFrame label="C2 · PROGRESS">
        <TopBar />
        <Hero />
        <div className="px-5 pt-2 pb-3 space-y-2.5 overflow-hidden flex-1">
          <div style={cardStyle}>
            <SubLabel>Relationship</SubLabel>
            <ChipRow items={Q.relationship.items} selectedIdx={0} />
          </div>
          <div style={cardStyle}>
            <SubLabel>Living together</SubLabel>
            <ChipRow items={Q.living.items} selectedIdx={0} />
          </div>
          <div style={cardStyle}>
            <SubLabel>Children under 18</SubLabel>
            <ChipRow items={Q.children.items} selectedIdx={-1} />
          </div>
          <div style={cardStyle}>
            <SubLabel>Your home</SubLabel>
            <ChipRow items={Q.home.items} selectedIdx={-1} />
          </div>
        </div>
        <Footer variant="C2" answered={2} total={4} />
      </MobileFrame>
    );
  }

  /* C3 — always enabled, soft hint */
  function C3() {
    return (
      <MobileFrame label="C3 · SOFT HINT">
        <TopBar />
        <Hero />
        <div className="px-5 pt-2 pb-3 space-y-2.5 overflow-hidden flex-1">
          <div style={cardStyle}>
            <SubLabel>Relationship</SubLabel>
            <ChipRow items={Q.relationship.items} selectedIdx={0} />
          </div>
          <div style={cardStyle}>
            <SubLabel>Living together</SubLabel>
            <ChipRow items={Q.living.items} selectedIdx={-1} />
          </div>
          <div style={cardStyle}>
            <SubLabel>Children under 18</SubLabel>
            <ChipRow items={Q.children.items} selectedIdx={-1} />
          </div>
          <div style={cardStyle}>
            <SubLabel>Your home</SubLabel>
            <ChipRow items={Q.home.items} selectedIdx={-1} />
          </div>
        </div>
        <Footer variant="C3" answered={1} total={4} />
      </MobileFrame>
    );
  }

  return { A1, A2, A3, B1, B2, B3, C1, C2, C3, INK, SUB, MUTE, LINE, VIOLET, MAGENTA };
})();

Object.assign(window, { o2 });
