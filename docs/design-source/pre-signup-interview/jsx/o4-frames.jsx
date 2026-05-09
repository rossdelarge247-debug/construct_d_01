/* =========================================================================
   O4 — Employment complexity · Expressive
   Mobile frames for helper-text treatment (A), plain-language rewording (B),
   empty-state default (C). Calmer EXPRESSIVE_BG, inherits O1.
   ========================================================================= */
const o4 = (() => {
  const INK    = "#1A1A1A";
  const SUB    = "#57534E";
  const MUTE   = "#78716C";
  const LINE   = "#E5E3DC";
  const SOFT   = "#FAFAF7";
  const PAPER  = "#F5F5F4";
  const DIS    = "#A8A29E";
  const VIOLET = "#7C3AED";
  const INDIGO = "#4F46E5";
  const MAGENTA= "#BE185D";
  /* O4 calmer expressive bg — lower the violet, lift the cream end.
     Same recipe as O3, but with the violet stop pulled back by ~30% so
     screen 4 feels gentler than screen 3. */
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
  function StepRail({ current = 4, total = 8 }) {
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
      <div style={{
        width: 375 * scale,
        height: height * scale,
      }}>
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
        <StepRail current={4} total={8} />
        <div style={{ width: 36 }} aria-hidden="true" />
      </div>
    );
  }

  /* ------- the four employment options (B1 / B2) ------- */
  const OPTIONS_FULL = [
    { key: "no",       primary: "No",                     detail: "both employed, or not working" },
    { key: "me",       primary: "Yes",                    detail: "I am" },
    { key: "ex",       primary: "Yes",                    detail: "my ex is" },
    { key: "both",     primary: "Yes",                    detail: "we both are" }
  ];

  /* ------- a single radio row ------- */
  function OptionRow({ opt, selected, emphasized = false }) {
    const padV = emphasized ? 18 : 14;
    const padH = 14;
    const fontS = emphasized ? 15 : 14;
    return (
      <button type="button" aria-pressed={selected} style={{
        display: "flex", alignItems: "center", gap: 12,
        width: "100%",
        background: selected ? INK : "#FFFFFF",
        border: `1px solid ${selected ? INK : LINE}`,
        borderRadius: 14,
        padding: `${padV}px ${padH}px`,
        textAlign: "left",
        cursor: "pointer",
        transition: "background 120ms ease-out, border-color 120ms ease-out",
        boxShadow: emphasized && !selected ? "0 1px 0 rgba(26,26,26,0.04), 0 6px 14px rgba(26,26,26,0.05)" : "none"
      }}>
        <span style={{
          flex: "none",
          width: 18, height: 18, borderRadius: 999,
          border: `1.5px solid ${selected ? "#FFFFFF" : "#C9C5BD"}`,
          background: selected ? INK : "#FFFFFF",
          display: "inline-flex", alignItems: "center", justifyContent: "center"
        }}>
          {selected && (<span style={{ width: 8, height: 8, borderRadius: 999, background: "#FFFFFF" }} />)}
        </span>
        <span style={{ flex: 1, lineHeight: 1.25 }}>
          <span style={{ display: "block", fontSize: fontS, fontWeight: 600, color: selected ? "#FFFFFF" : INK }}>
            {opt.primary}
            {opt.detail && (
              <span className="serif italic" style={{ fontWeight: 400, color: selected ? "rgba(255,255,255,0.7)" : SUB, marginLeft: 6 }}>
                — {opt.detail}
              </span>
            )}
          </span>
        </span>
      </button>
    );
  }

  /* ------- B3 micro-question row: Neither / Me / My ex / Both ------- */
  function MicroQuestion({ label, value }) {
    const opts = [
      { key: "neither", label: "Neither" },
      { key: "me",      label: "Me" },
      { key: "ex",      label: "My ex" },
      { key: "both",    label: "Both" }
    ];
    return (
      <div>
        <div className="text-[12.5px] mb-1.5" style={{ color: INK, fontWeight: 600 }}>
          {label}
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {opts.map((o) => {
            const sel = o.key === value;
            return (
              <button key={o.key} type="button" aria-pressed={sel} style={{
                background: sel ? INK : "#FFFFFF",
                color: sel ? "#FFFFFF" : INK,
                border: `1px solid ${sel ? INK : LINE}`,
                borderRadius: 10,
                padding: "9px 6px",
                fontSize: 12, fontWeight: sel ? 600 : 500,
                cursor: "pointer",
                whiteSpace: "nowrap"
              }}>
                {o.label}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  /* ------- helper-text strings ------- */
  const HELPER = "This affects how we handle income evidence later.";

  /* ------- Hero — varies by A treatment ------- */
  function Hero({ title, treatment = "A1", showA2Pop = false, postSelected = false }) {
    return (
      <div className="px-5 pt-4 pb-3">
        <div className="label-xs flex items-center gap-1.5" style={{ color: INDIGO, fontSize: 9.5 }}>
          <span style={{
            width: 5, height: 5, borderRadius: 999, background: INDIGO, display: "inline-block"
          }} />
          <span>Money</span>
        </div>

        <div className="mt-2 flex items-start gap-2" style={{ position: "relative" }}>
          <h2 className="serif" style={{ fontSize: 21, lineHeight: 1.18, letterSpacing: "-0.015em", fontWeight: 600, flex: 1 }}>
            {title}
          </h2>
          {treatment === "A2" && (
            <button type="button" aria-label="Why we ask" style={{
              flex: "none",
              width: 22, height: 22, borderRadius: 999,
              border: `1px solid ${LINE}`,
              background: showA2Pop ? INK : "#FFFFFF",
              color: showA2Pop ? "#FFFFFF" : SUB,
              fontSize: 12, fontWeight: 700,
              fontFamily: "'Source Serif Pro', Georgia, serif",
              cursor: "pointer",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              marginTop: 4
            }}>?</button>
          )}

          {/* A2 popover, shown above the row */}
          {treatment === "A2" && showA2Pop && (
            <div style={{
              position: "absolute",
              top: 32, right: -4, width: 240,
              background: INK, color: "#FFFFFF",
              borderRadius: 10, padding: "10px 12px",
              fontSize: 12, lineHeight: 1.45,
              boxShadow: "0 8px 24px rgba(26,26,26,0.18)",
              zIndex: 5
            }}>
              <span>{HELPER}</span>
              <span aria-hidden="true" style={{
                position: "absolute", top: -5, right: 14,
                width: 10, height: 10, background: INK,
                transform: "rotate(45deg)"
              }} />
            </div>
          )}
        </div>

        {/* A1 — caption directly below headline */}
        {treatment === "A1" && (
          <p className="mt-2 text-[12px]" style={{ color: SUB, lineHeight: 1.45 }}>
            {HELPER}
          </p>
        )}

        {/* A3 — caption appears only AFTER first selection */}
        {treatment === "A3" && postSelected && (
          <div className="mt-2.5 pl-2" style={{ borderLeft: `2px solid ${INDIGO}` }}>
            <p className="text-[11.5px]" style={{ color: SUB, lineHeight: 1.45 }}>
              <span className="mono" style={{ color: INDIGO, letterSpacing: "0.04em", fontSize: 9.5, fontWeight: 600, marginRight: 6 }}>WHY</span>
              {HELPER}
            </p>
          </div>
        )}
        {treatment === "A3" && !postSelected && (
          <p className="mt-2 text-[11px] mono" style={{ color: MUTE, letterSpacing: "0.04em" }}>
            Pick the option that fits — context appears after.
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

  /* ------- title text per B treatment ------- */
  const TITLES = {
    B1: "Are either of you self-employed or a company director?",
    B2: "Does either of you work for yourself, or run a limited company?",
    B3: "Two quick yes/no on work setup."
  };

  /* ============== A — HELPER-TEXT TREATMENT ============== */
  /* All A frames: B2 (the calmer rewording) and C1 (nothing pre-selected) */

  function FrameA({ treatment, label, postSelected = false }) {
    const selectedKey = postSelected ? "me" : null;
    return (
      <MobileFrame label={label}>
        <TopBar />
        <Hero title={TITLES.B2} treatment={treatment} showA2Pop={treatment === "A2"} postSelected={postSelected} />
        <div className="px-5 pt-1 pb-3 flex-1 overflow-hidden flex flex-col">
          <div className="space-y-2">
            {OPTIONS_FULL.map((opt) => (
              <OptionRow key={opt.key} opt={opt} selected={opt.key === selectedKey} />
            ))}
          </div>
        </div>
        <Footer
          enabled={!!selectedKey}
          caption={selectedKey
            ? <span className="serif italic">Ready to continue.</span>
            : <span style={{ color: MUTE }}>Pick the option that fits to continue.</span>}
        />
      </MobileFrame>
    );
  }

  function A1() { return <FrameA treatment="A1" label="A1 · CAPTION BELOW" />; }
  function A2() { return <FrameA treatment="A2" label="A2 · ? POPOVER" />; }
  function A3() { return <FrameA treatment="A3" label="A3 · REVEAL ON SELECT" postSelected={true} />; }

  /* ============== B — PLAIN-LANGUAGE REWORDING ============== */
  /* All B frames: A1 (caption below) and C1 (nothing pre-selected). */

  function FrameB({ framing, label }) {
    if (framing === "B3") {
      return (
        <MobileFrame label={label}>
          <TopBar />
          <Hero title={TITLES.B3} treatment="A1" />
          <div className="px-5 pt-1 pb-3 flex-1 overflow-hidden flex flex-col">
            <div className="space-y-4">
              <MicroQuestion label="Self-employed?" value={null} />
              <div style={{ borderTop: `1px dashed ${LINE}` }} />
              <MicroQuestion label="Director of a limited company?" value={null} />
            </div>
            <div className="mt-auto pt-4">
              <p className="mono text-[10px]" style={{ color: MUTE, letterSpacing: "0.04em", lineHeight: 1.5 }}>
                We combine your two answers into a single record:
                me / ex / both / neither for each.
              </p>
            </div>
          </div>
          <Footer
            enabled={false}
            caption={<span style={{ color: MUTE }}>Answer both to continue.</span>}
          />
        </MobileFrame>
      );
    }

    return (
      <MobileFrame label={label}>
        <TopBar />
        <Hero title={TITLES[framing]} treatment="A1" />
        <div className="px-5 pt-1 pb-3 flex-1 overflow-hidden flex flex-col">
          <div className="space-y-2">
            {OPTIONS_FULL.map((opt) => (
              <OptionRow key={opt.key} opt={opt} selected={false} />
            ))}
          </div>
        </div>
        <Footer
          enabled={false}
          caption={<span style={{ color: MUTE }}>Pick the option that fits to continue.</span>}
        />
      </MobileFrame>
    );
  }

  function B1() { return <FrameB framing="B1" label="B1 · VERBATIM" />; }
  function B2() { return <FrameB framing="B2" label="B2 · PLAIN" />; }
  function B3() { return <FrameB framing="B3" label="B3 · TWO QUESTIONS" />; }

  /* ============== C — EMPTY-STATE DEFAULT ============== */
  /* All C frames: A1 + B2. */

  function FrameC({ variant, label }) {
    const preSel = variant === "C2" ? "no" : null;
    const emphNo = variant === "C3";

    return (
      <MobileFrame label={label}>
        <TopBar />
        <Hero title={TITLES.B2} treatment="A1" />
        <div className="px-5 pt-1 pb-3 flex-1 overflow-hidden flex flex-col">
          <div className="space-y-2">
            {OPTIONS_FULL.map((opt) => (
              <OptionRow
                key={opt.key} opt={opt}
                selected={opt.key === preSel}
                emphasized={emphNo && opt.key === "no"}
              />
            ))}
          </div>
          {variant === "C3" && (
            <p className="mt-3 mono text-[10px]" style={{ color: MUTE, letterSpacing: "0.04em", lineHeight: 1.5 }}>
              "No" sits a touch larger — easing the most common path
              without pre-selecting it.
            </p>
          )}
          {variant === "C2" && (
            <p className="mt-3 mono text-[10px]" style={{ color: MUTE, letterSpacing: "0.04em", lineHeight: 1.5 }}>
              "No" pre-selected. Tap any other option to change.
            </p>
          )}
        </div>
        <Footer
          enabled={!!preSel}
          caption={preSel
            ? <span className="serif italic">Default selected — change if it doesn't fit.</span>
            : <span style={{ color: MUTE }}>Pick the option that fits to continue.</span>}
        />
      </MobileFrame>
    );
  }

  function C1() { return <FrameC variant="C1" label="C1 · BLANK SLATE" />; }
  function C2() { return <FrameC variant="C2" label="C2 · 'NO' PRESELECTED" />; }
  function C3() { return <FrameC variant="C3" label="C3 · 'NO' EMPHASIZED" />; }

  return {
    A1, A2, A3, B1, B2, B3, C1, C2, C3,
    OPTIONS_FULL, MicroQuestion, OptionRow, Hero, Footer, TopBar, MobileFrame, StepRail, Arrow,
    TITLES, HELPER,
    INK, SUB, MUTE, LINE, PAPER, SOFT, DIS, VIOLET, INDIGO, MAGENTA,
    EXPRESSIVE_BG
  };
})();

Object.assign(window, { o4 });
