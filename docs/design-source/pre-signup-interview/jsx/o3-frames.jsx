/* =========================================================================
   O3 — Your ex & safety · Expressive
   Mobile frames for safety-option treatment (A), device-privacy framing (B),
   continue gating (C). Calmer EXPRESSIVE_BG, inherits O1.
   ========================================================================= */
const o3 = (() => {
  const INK    = "#1A1A1A";
  const SUB    = "#57534E";
  const MUTE   = "#78716C";
  const LINE   = "#E5E3DC";
  const SOFT   = "#FAFAF7";
  const PAPER  = "#F5F5F4";
  const DIS    = "#A8A29E";
  const VIOLET = "#7C3AED";
  const MAGENTA= "#BE185D";
  /* a barely-warmer cream — used for the A2 safety wash. NOT pink-as-alarm.
     this sits between paper-white and the cream end of EXPRESSIVE_BG so it
     reads as "softer", not "different". */
  const SOFTWASH = "#FBF4F1";
  const SOFTWASH_BORDER = "#F1E6E0";
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

  const Lock = ({ size = 12, sw = 1.6 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );

  /* ------- progress rail ------- */
  function StepRail({ current = 3, total = 8 }) {
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

  function TopBar({ current = 3 }) {
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

  function Hero({ eyebrow = "Your ex", title = "How would you describe things between you and your ex?" }) {
    return (
      <div className="px-5 pt-4 pb-3">
        <div className="label-xs" style={{ color: VIOLET, fontSize: 9.5 }}>{eyebrow}</div>
        <h2 className="serif mt-2" style={{ fontSize: 21, lineHeight: 1.18, letterSpacing: "-0.015em", fontWeight: 600 }}>
          {title}
        </h2>
      </div>
    );
  }

  /* ------- the four relationship options ------- */
  const REL_OPTIONS = [
    { key: "amicable",  primary: "Amicable",      detail: "we want to sort this out together" },
    { key: "difficult", primary: "Difficult",     detail: "but manageable" },
    { key: "highconf",  primary: "High conflict", detail: "communication is very hard" },
    { key: "safety",    primary: "I have safety concerns", detail: null }
  ];

  /* ------- a single radio row ------- */
  function RelRow({ opt, selected, treatment }) {
    const isSafety = opt.key === "safety";
    const wash    = isSafety && treatment === "A2";
    const lockEnd = isSafety && treatment === "A3";

    const bg = selected
      ? INK
      : (wash ? SOFTWASH : "#FFFFFF");
    const border = selected
      ? INK
      : (wash ? SOFTWASH_BORDER : LINE);
    const textColor = selected ? "#FFFFFF" : INK;
    const detailColor = selected ? "rgba(255,255,255,0.7)" : SUB;

    return (
      <button type="button" aria-pressed={selected} style={{
        display: "flex", alignItems: "center", gap: 12,
        width: "100%",
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: 14,
        padding: "14px 14px",
        textAlign: "left",
        cursor: "pointer",
        transition: "background 120ms ease-out, border-color 120ms ease-out"
      }}>
        {/* radio dot */}
        <span style={{
          flex: "none",
          width: 18, height: 18, borderRadius: 999,
          border: `1.5px solid ${selected ? "#FFFFFF" : "#C9C5BD"}`,
          background: selected ? INK : "#FFFFFF",
          display: "inline-flex", alignItems: "center", justifyContent: "center"
        }}>
          {selected && (
            <span style={{ width: 8, height: 8, borderRadius: 999, background: "#FFFFFF" }} />
          )}
        </span>
        <span style={{ flex: 1, lineHeight: 1.25 }}>
          <span style={{ display: "block", fontSize: 14, fontWeight: 600, color: textColor }}>
            {opt.primary}
            {opt.detail && (
              <span className="serif italic" style={{ fontWeight: 400, color: detailColor, marginLeft: 6 }}>
                — {opt.detail}
              </span>
            )}
          </span>
        </span>
        {lockEnd && !selected && (
          <span aria-hidden="true" style={{ flex: "none", color: MUTE, opacity: 0.7 }}>
            <Lock size={13} />
          </span>
        )}
      </button>
    );
  }

  /* ------- device privacy block ------- */
  function DevicePrivacy({ framing = "B1", answer = null, dim = false }) {
    /* B1 — two-line caption */
    /* B2 — single line, no preamble */
    /* B3 — "Is now a good time to keep going?" */
    const question = framing === "B3"
      ? "Is now a good time to keep going?"
      : "Is this device private to you?";

    const yesLabel = framing === "B3" ? "Yes, keep going" : "Yes";
    const noLabel  = framing === "B3" ? "Not right now"   : "Not sure";

    const PrivPill = ({ label, selected }) => (
      <button type="button" aria-pressed={selected}
              style={{
                background: selected ? INK : "#FFFFFF",
                color: selected ? "#FFFFFF" : INK,
                border: `1px solid ${selected ? INK : LINE}`,
                borderRadius: 999,
                padding: "8px 16px",
                fontSize: 12.5, fontWeight: selected ? 600 : 500,
                cursor: "pointer",
                whiteSpace: "nowrap"
              }}>
        {label}
      </button>
    );

    return (
      <div style={{ opacity: dim ? 0.6 : 1 }}>
        {framing === "B1" && (
          <p className="text-[11.5px] mb-2" style={{ color: SUB, lineHeight: 1.45 }}>
            Some people read these screens with a partner nearby. We want to know whether you have privacy here.
          </p>
        )}
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-[12.5px]" style={{ color: INK, fontWeight: 500 }}>
            {question}
          </span>
          <div className="flex items-center gap-1.5 ml-auto">
            <PrivPill label={yesLabel}  selected={answer === "yes"} />
            <PrivPill label={noLabel}   selected={answer === "no"} />
          </div>
        </div>
      </div>
    );
  }

  /* ------- footer / continue ------- */
  function Footer({ variant = "C1", relAnswered = false, privAnswered = false }) {
    let enabled = false;
    let caption = null;
    if (variant === "C1") {
      enabled = relAnswered && privAnswered;
      caption = (
        <span>{(relAnswered ? 1 : 0) + (privAnswered ? 1 : 0)} of 2 answered</span>
      );
    } else if (variant === "C2") {
      enabled = relAnswered;
      caption = privAnswered
        ? <span>Both answered.</span>
        : <span className="serif italic">Device privacy is optional — skip if you'd like.</span>;
    } else {
      /* C3 — same gating as C1, but device-privacy was asked first */
      enabled = relAnswered && privAnswered;
      caption = <span>{(relAnswered ? 1 : 0) + (privAnswered ? 1 : 0)} of 2 answered</span>;
    }

    return (
      <div className="px-5 pt-3 pb-4 mt-auto" style={{
        borderTop: `1px solid ${LINE}`,
        background: "rgba(255,255,255,0.6)",
        backdropFilter: "blur(10px)"
      }}>
        <div className="flex items-center justify-center gap-1.5 text-[10px] mb-2.5" style={{ color: MUTE }}>
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

  /* ============== A — SAFETY-OPTION TREATMENT ============== */
  /* All A frames: B1 framing, C1 gating. Selection: "Difficult". */

  function FrameA({ treatment, label }) {
    return (
      <MobileFrame label={label}>
        <TopBar />
        <Hero />
        <div className="px-5 pt-1 pb-3 flex-1 overflow-hidden flex flex-col">
          <div className="space-y-2">
            {REL_OPTIONS.map((opt) => (
              <RelRow key={opt.key} opt={opt} selected={opt.key === "difficult"} treatment={treatment} />
            ))}
          </div>
          <div className="mt-4 pt-4" style={{ borderTop: `1px solid ${LINE}` }}>
            <DevicePrivacy framing="B1" answer="yes" />
          </div>
        </div>
        <Footer variant="C1" relAnswered={true} privAnswered={true} />
      </MobileFrame>
    );
  }

  function A1() { return <FrameA treatment="A1" label="A1 · EQUAL WEIGHT" />; }
  function A2() { return <FrameA treatment="A2" label="A2 · SOFT WASH" />; }
  function A3() { return <FrameA treatment="A3" label="A3 · LOCK GLYPH" />; }

  /* ============== B — DEVICE-PRIVACY FRAMING ============== */
  /* All B frames: A1 treatment, C1 gating. Privacy answer left blank to
     show the prompt clearly. */

  function FrameB({ framing, label }) {
    return (
      <MobileFrame label={label}>
        <TopBar />
        <Hero />
        <div className="px-5 pt-1 pb-3 flex-1 overflow-hidden flex flex-col">
          <div className="space-y-2">
            {REL_OPTIONS.map((opt) => (
              <RelRow key={opt.key} opt={opt} selected={opt.key === "amicable"} treatment="A1" />
            ))}
          </div>
          <div className="mt-4 pt-4" style={{ borderTop: `1px solid ${LINE}` }}>
            <DevicePrivacy framing={framing} answer={null} />
          </div>
        </div>
        <Footer variant="C1" relAnswered={true} privAnswered={false} />
      </MobileFrame>
    );
  }

  function B1() { return <FrameB framing="B1" label="B1 · TWO-LINE CAPTION" />; }
  function B2() { return <FrameB framing="B2" label="B2 · NO PREAMBLE" />; }
  function B3() { return <FrameB framing="B3" label="B3 · GOOD TIME?" />; }

  /* ============== C — CONTINUE GATING ============== */

  /* C1 — both required (default-ish). 1 of 2 answered. */
  function C1() {
    return (
      <MobileFrame label="C1 · BOTH REQUIRED">
        <TopBar />
        <Hero />
        <div className="px-5 pt-1 pb-3 flex-1 overflow-hidden flex flex-col">
          <div className="space-y-2">
            {REL_OPTIONS.map((opt) => (
              <RelRow key={opt.key} opt={opt} selected={opt.key === "amicable"} treatment="A1" />
            ))}
          </div>
          <div className="mt-4 pt-4" style={{ borderTop: `1px solid ${LINE}` }}>
            <DevicePrivacy framing="B1" answer={null} />
          </div>
        </div>
        <Footer variant="C1" relAnswered={true} privAnswered={false} />
      </MobileFrame>
    );
  }

  /* C2 — privacy optional. Continue enabled after relationship answer. */
  function C2() {
    return (
      <MobileFrame label="C2 · PRIVACY OPTIONAL">
        <TopBar />
        <Hero />
        <div className="px-5 pt-1 pb-3 flex-1 overflow-hidden flex flex-col">
          <div className="space-y-2">
            {REL_OPTIONS.map((opt) => (
              <RelRow key={opt.key} opt={opt} selected={opt.key === "amicable"} treatment="A1" />
            ))}
          </div>
          <div className="mt-4 pt-4" style={{ borderTop: `1px solid ${LINE}` }}>
            <DevicePrivacy framing="B1" answer={null} />
          </div>
        </div>
        <Footer variant="C2" relAnswered={true} privAnswered={false} />
      </MobileFrame>
    );
  }

  /* C3 — privacy comes BEFORE relationship. */
  function C3() {
    return (
      <MobileFrame label="C3 · PRIVACY FIRST">
        <TopBar />
        <Hero />
        <div className="px-5 pt-1 pb-3 flex-1 overflow-hidden flex flex-col">
          {/* privacy on top */}
          <div className="pb-3 mb-3" style={{ borderBottom: `1px solid ${LINE}` }}>
            <DevicePrivacy framing="B1" answer="yes" />
          </div>
          <div className="space-y-2">
            {REL_OPTIONS.map((opt) => (
              <RelRow key={opt.key} opt={opt} selected={opt.key === "amicable"} treatment="A1" />
            ))}
          </div>
        </div>
        <Footer variant="C3" relAnswered={true} privAnswered={true} />
      </MobileFrame>
    );
  }

  return {
    A1, A2, A3, B1, B2, B3, C1, C2, C3,
    INK, SUB, MUTE, LINE, VIOLET, MAGENTA, SOFTWASH
  };
})();

Object.assign(window, { o3 });
