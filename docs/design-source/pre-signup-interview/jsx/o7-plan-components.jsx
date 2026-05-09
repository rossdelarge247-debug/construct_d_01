/* =========================================================================
   O7 — "Your plan" — shared atoms, tokens, icons, page chrome
   Locked style: Expressive (Inter / Source Serif Pro / JetBrains Mono)
   Accents: VIOLET / MAGENTA on lilac→blush hero, neutral paper for body.
   ========================================================================= */
const { useState, useEffect, useRef, useMemo } = React;

/* TOKENS ------------------------------------------------------------------ */
const INK   = "#1A1A1A";
const SUB   = "#57534E";
const MUTE  = "#78716C";
const SOFTMUTE = "#9A968E";
const LINE  = "#E5E3DC";
const PAPER = "#F5F5F4";
const SOFT  = "#FAFAF7";
const PAPER_WARM = "#FBFAF6";

const VIOLET       = "#7C3AED";
const VIOLET_SOFT  = "#F3EEFE";
const MAGENTA      = "#BE185D";
const MAGENTA_SOFT = "#FCE7F3";
const INDIGO       = "#4338CA";

const EXPRESSIVE_HERO = "linear-gradient(180deg, #F3EEFE 0%, #FCE7F3 200px, #FBFAF6 460px)";
const EXPRESSIVE_BG   = "linear-gradient(180deg, #EFE7F8 0%, #F5F1F8 480px, #EFEEE9 100%)";

/* ICONS ------------------------------------------------------------------- */
const Arrow = ({size=14, sw=1.8, dir="right"}) => {
  const r = { right: 0, left: 180, down: 90, up: 270 }[dir] || 0;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{transform:`rotate(${r}deg)`}}>
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>
  );
};
const Download = ({size=14, sw=1.8}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);
const Mail = ({size=14, sw=1.8}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="14" rx="2"/>
    <polyline points="3 7 12 13 21 7"/>
  </svg>
);
const Edit = ({size=12, sw=1.8}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9"/>
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z"/>
  </svg>
);
const Info = ({size=12, sw=1.8}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="16" x2="12" y2="12"/>
    <line x1="12" y1="8" x2="12.01" y2="8"/>
  </svg>
);
const Heart = ({size=12, sw=1.8}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);
const Spark = ({size=12, sw=1.8}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2 2M16.4 16.4l2 2M5.6 18.4l2-2M16.4 7.6l2-2"/>
  </svg>
);
const QuoteMark = ({size=18, color=MAGENTA}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{display:"inline-block"}}>
    <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
  </svg>
);

/* SHARED — eyebrow / pill / caption ---------------------------------------- */
function Eyebrow({ children, color = MUTE }) {
  return <div className="label-xs" style={{ color }}>{children}</div>;
}

function Pill({ children, color = "#1A1A1A" }) {
  return (
    <span className="mono inline-block px-2 py-1 rounded"
          style={{ background: color, color: "#FFFFFF", fontSize: 10.5, letterSpacing: "0.04em" }}>
      {children}
    </span>
  );
}

function StateCaption({ no, name, hint }) {
  return (
    <div className="mb-5">
      <div className="flex items-baseline gap-3 flex-wrap">
        <span className="label-xs" style={{ color: VIOLET }}>State {no}</span>
        <span className="serif" style={{ fontSize: 19, fontWeight: 600, letterSpacing: "-0.01em" }}>{name}</span>
      </div>
      {hint && <div className="mt-1 text-[12.5px]" style={{ color: SUB, lineHeight: 1.5, maxWidth: 540 }}>{hint}</div>}
    </div>
  );
}

/* MOBILE FRAME (375 wide) — fixed-height (667) for "viewport" states,
   or growing-height for "long-scroll content" states ------------------------ */
function MobileFrame({ children, height = 720, fixed = false, bg = "#FFFFFF" }) {
  return (
    <div style={{
      width: 391, padding: 8, borderRadius: 38,
      background: "#1A1A1A",
      boxShadow: "0 30px 60px rgba(124,58,237,0.18), 0 1px 0 rgba(255,255,255,0.04) inset",
    }}>
      <div style={{
        width: 375, height,
        background: bg,
        borderRadius: 30, overflow: fixed ? "hidden" : "visible",
        position: "relative",
      }}>
        {children}
      </div>
    </div>
  );
}

/* MOBILE TOP BAR ----------------------------------------------------------- */
function MobileTopBar({ step = 7, total = 8, remaining = "~30s remaining" }) {
  const pct = (step / total) * 100;
  return (
    <div className="px-5 pt-4 pb-3 flex items-center justify-between"
         style={{ borderBottom: `1px solid ${LINE}`, background: "transparent" }}>
      <a href="#" className="inline-flex items-center gap-1.5 text-[12px]" style={{ color: SUB }}>
        <Arrow dir="left" size={11}/>
        <span>Home</span>
      </a>
      <div className="flex flex-col items-center gap-1">
        <div className="relative h-[3px] rounded-full" style={{ width: 110, background: "#E5E3DC" }}>
          <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${pct}%`, background: INK }}/>
        </div>
        <div className="label-xs" style={{ color: MUTE, fontSize: 9 }}>STEP {step} / {total} · {remaining}</div>
      </div>
      <a href="#" className="text-[11px] underline-offset-4 hover:underline" style={{ color: SUB }}>Save</a>
    </div>
  );
}

/* MOBILE HERO — eyebrow / display headline / sub / action cluster ---------- */
function MobileHero() {
  return (
    <div style={{
      padding: "26px 20px 22px 20px",
      background: EXPRESSIVE_HERO,
      borderBottom: `1px solid ${LINE}`,
      position: "relative",
      overflow: "hidden",
    }}>
      {/* soft halo */}
      <div style={{
        position: "absolute", top: -120, right: -100,
        width: 320, height: 320, borderRadius: "50%",
        background: "radial-gradient(closest-side, rgba(255,255,255,0.7), transparent 70%)",
        pointerEvents: "none",
      }}/>
      <div className="relative">
        <div className="label-xs" style={{ color: VIOLET }}>Your plan is ready</div>
        <h1 className="serif mt-3" style={{ fontSize: 38, lineHeight: 1.04, letterSpacing: "-0.025em", fontWeight: 600, color: INK }}>
          Here's <span className="italic" style={{ fontWeight: 400, color: MAGENTA }}>your plan</span>.
        </h1>
        <p className="serif italic mt-3" style={{ fontSize: 15, lineHeight: 1.5, color: SUB, maxWidth: 320 }}>
          Built from your six answers — a warm picture of where you are, what's ahead, and what your options are.
        </p>
        <div className="mt-5 flex items-center gap-2.5 flex-wrap">
          <button className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full"
                  style={{ background: "#FFFFFF", border: `1px solid ${INK}`, color: INK, fontSize: 12, fontWeight: 600 }}>
            <Download size={12}/><span>Save as PDF</span>
          </button>
          <a href="#" className="inline-flex items-center gap-1.5 text-[12px] px-2 py-1.5" style={{ color: SUB }}>
            <Mail size={11}/>
            <span className="underline-offset-4 hover:underline">Email it to me</span>
          </a>
        </div>
        <div className="mt-3 text-[10.5px]" style={{ color: MUTE }}>
          ~5 min read · 4 pages · yours to keep
        </div>
      </div>
    </div>
  );
}

/* SECTION HEADER (mobile) -------------------------------------------------- */
function MobileSectionHeader({ eyebrow, title, sub, eyebrowColor = MUTE }) {
  return (
    <div style={{ marginBottom: 18 }}>
      {eyebrow && <Eyebrow color={eyebrowColor}>{eyebrow}</Eyebrow>}
      <h2 className="serif mt-2" style={{ fontSize: 24, lineHeight: 1.12, letterSpacing: "-0.018em", fontWeight: 600, color: INK }}>
        {title}
      </h2>
      {sub && (
        <p className="serif italic mt-2.5" style={{ fontSize: 14, color: SUB, lineHeight: 1.5 }}>
          {sub}
        </p>
      )}
    </div>
  );
}

/* PAPER CARD --------------------------------------------------------------- */
function PaperCard({ children, style = {}, ...rest }) {
  return (
    <div style={{
      background: "#FFFFFF",
      border: `1px solid ${LINE}`,
      borderRadius: 16,
      ...style,
    }} {...rest}>
      {children}
    </div>
  );
}

/* ANNOTATION ROW (canvas chrome) ------------------------------------------- */
function Annot({ pill, title, body }) {
  return (
    <div className="flex items-start gap-3">
      <div className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center mono"
           style={{ background: VIOLET, color: "#FFF", fontSize: 11, fontWeight: 600 }}>
        {pill}
      </div>
      <div className="flex-1">
        <div className="serif" style={{ fontSize: 14.5, fontWeight: 600, color: INK, lineHeight: 1.3 }}>{title}</div>
        <p className="mt-1 text-[12.5px]" style={{ color: SUB, lineHeight: 1.5 }}>{body}</p>
      </div>
    </div>
  );
}

/* BREATHING DOT (used in generating state) --------------------------------- */
function BreathingHalo({ size = 200 }) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <div className="absolute inset-0 rounded-full" style={{
        background: "radial-gradient(closest-side, rgba(190,24,93,0.18), rgba(124,58,237,0.10) 55%, transparent 75%)",
        animation: "o7-breath 3.6s ease-in-out infinite",
      }}/>
      <div className="absolute inset-0 rounded-full" style={{
        background: "radial-gradient(closest-side, rgba(255,255,255,0.85), transparent 60%)",
        transform: "scale(0.55)",
        animation: "o7-breath 3.6s ease-in-out infinite reverse",
      }}/>
      <div className="absolute" style={{
        left: "50%", top: "50%", width: 8, height: 8,
        marginLeft: -4, marginTop: -4,
        borderRadius: "50%",
        background: MAGENTA,
        boxShadow: `0 0 0 6px ${MAGENTA_SOFT}, 0 0 0 14px rgba(190,24,93,0.06)`,
      }}/>
    </div>
  );
}

/* expose to other scripts -------------------------------------------------- */
Object.assign(window, {
  // tokens
  INK, SUB, MUTE, SOFTMUTE, LINE, PAPER, SOFT, PAPER_WARM,
  VIOLET, VIOLET_SOFT, MAGENTA, MAGENTA_SOFT, INDIGO,
  EXPRESSIVE_HERO, EXPRESSIVE_BG,
  // icons
  Arrow, Download, Mail, Edit, Info, Heart, Spark, QuoteMark,
  // atoms
  Eyebrow, Pill, StateCaption, MobileFrame, MobileTopBar, MobileHero,
  MobileSectionHeader, PaperCard, Annot, BreathingHalo,
});
