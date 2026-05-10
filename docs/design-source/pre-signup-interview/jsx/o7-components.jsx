/* =========================================================================
   O7 — shared atoms, tokens, icons, page chrome
   ========================================================================= */
const { useState, useEffect, useRef, useMemo } = React;

window.O7 = window.O7 || {};

/* TOKENS */
const INK  = "#1A1A1A";
const SUB  = "#57534E";
const MUTE = "#78716C";
const SOFTMUTE = "#9A968E";
const LINE = "#E5E3DC";
const PAPER= "#F5F5F4";
const SOFT = "#FAFAF7";
const DISABLED_INK = "#A8A29E";

/* phase accents — used ONLY on phase chips */
const PHASE = {
  start:     { fill: "#EDEAE3", ink: "#57534E" }, // neutral
  build:     { fill: "#E6E5F8", ink: "#4338CA" }, // indigo
  reconcile: { fill: "#F8E1EC", ink: "#9D174D" }, // pink
  settle:    { fill: "#DDECF6", ink: "#0369A1" }, // teal-ish blue
  finalise:  { fill: "#DCEAE0", ink: "#166534" }, // green
};

window.O7.tokens = { INK, SUB, MUTE, SOFTMUTE, LINE, PAPER, SOFT, DISABLED_INK, PHASE };

/* ICONS */
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
const X = ({size=16, sw=1.8}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const Check = ({size=10, sw=2.5}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
window.O7.icons = { Arrow, Download, Mail, Edit, Info, X, Check };

/* =========================================================================
   COMPRESSED STEPPER (C-V3a) — thin progress rail + caption
   ========================================================================= */
function CompressedStepper({ current = 7, total = 8, remaining = "~30 seconds remaining" }) {
  const pct = (current / total) * 100;
  return (
    <div className="flex flex-col items-center gap-1.5"
         role="progressbar" aria-valuenow={current} aria-valuemin={1} aria-valuemax={total}
         aria-label={`Step ${current} of ${total}`}>
      <div className="relative h-[5px] rounded-full" style={{ width: 240, background: "#E0DDD5" }}>
        <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${pct}%`, background: INK }}/>
      </div>
      <div className="label-xs" style={{ color: MUTE }}>
        Step {current} of {total} · ~3 min total · {remaining}
      </div>
    </div>
  );
}
window.O7.CompressedStepper = CompressedStepper;

/* =========================================================================
   TOP BAR — back · stepper · save&return + badge
   ========================================================================= */
function TopBar({ scale = 1 }) {
  return (
    <div className="relative flex items-center justify-between px-10 pt-7 pb-5">
      <a href="#" className="inline-flex items-center gap-2 text-[12.5px]" style={{ color: SUB }}>
        <Arrow dir="left" size={13}/>
        <span>Back to home</span>
      </a>

      <CompressedStepper current={7} total={8}/>

      <div className="flex items-center gap-3">
        <a href="#" className="text-[12.5px] underline-offset-4 hover:underline" style={{ color: SUB }}>
          Save &amp; return
        </a>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full hairline" style={{ background: "#FFFFFF" }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: INK }}/>
          <span className="text-[11.5px] font-medium" style={{ color: SUB }}>No account needed</span>
        </div>
      </div>
    </div>
  );
}
window.O7.TopBar = TopBar;

/* =========================================================================
   HERO — eyebrow / display headline (italic accent) / sub-stem / action cluster
   stageVariant: 'decided' | 'thinking' | 'in_process'
   ========================================================================= */
const HERO_BY_STAGE = {
  decided:    { lead: "Here's", accent: "your plan", tail: "." },
  thinking:   { lead: "Here's a", accent: "starting point", tail: "." },
  in_process: { lead: "Here's how to", accent: "move faster", tail: "." },
};

function Hero({ stage = "decided" }) {
  const h = HERO_BY_STAGE[stage];
  return (
    <div className="grid grid-cols-[1fr_auto] gap-10 items-end">
      <div>
        <div className="label-xs" style={{ color: MUTE }}>Your plan is ready</div>
        <h1 className="serif mt-4" style={{ fontSize: 64, lineHeight: 1.02, letterSpacing: "-0.025em", fontWeight: 600 }}>
          {h.lead} <span className="italic" style={{ fontWeight: 400 }}>{h.accent}</span>{h.tail}
        </h1>
        <p className="serif italic mt-5" style={{ fontSize: 19, lineHeight: 1.5, color: SUB, maxWidth: 620 }}>
          Built from your six answers. Yours to keep — whether you go further or not.
        </p>
      </div>

      {/* action cluster */}
      <div className="flex flex-col items-end gap-2 pb-2">
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 px-5 py-3 rounded-full"
                  style={{ background: "#FFFFFF", border: `1px solid ${INK}`, color: INK, fontSize: 13.5, fontWeight: 600 }}>
            <Download size={14}/>
            <span>Download PDF</span>
          </button>
          <a href="#" className="inline-flex items-center gap-2 text-[13px]" style={{ color: SUB }}>
            <Mail size={13}/>
            <span className="underline-offset-4 hover:underline">Email it to me</span>
          </a>
        </div>
        <div className="text-[11.5px]" style={{ color: MUTE }}>
          ~5 min read · 4 pages PDF
        </div>
      </div>
    </div>
  );
}
window.O7.Hero = Hero;

/* =========================================================================
   SECTION HEADER — serif title + italic sub-line
   ========================================================================= */
function SectionHeader({ eyebrow, title, sub, right }) {
  return (
    <div className="flex items-end justify-between gap-6 mb-7">
      <div>
        {eyebrow && <div className="label-xs mb-3" style={{ color: MUTE }}>{eyebrow}</div>}
        <h2 className="serif" style={{ fontSize: 34, lineHeight: 1.1, letterSpacing: "-0.02em", fontWeight: 600 }}>
          {title}
        </h2>
        {sub && (
          <p className="serif italic mt-2.5" style={{ fontSize: 16, color: SUB, lineHeight: 1.5 }}>
            {sub}
          </p>
        )}
      </div>
      {right}
    </div>
  );
}
window.O7.SectionHeader = SectionHeader;

/* =========================================================================
   TRUST BAND
   ========================================================================= */
function TrustBand({ items = ["Free", "Yours to keep", "Useful regardless of Decouple"] }) {
  return (
    <div className="flex items-center justify-center gap-3 text-[12px]" style={{ color: MUTE }}>
      {items.map((it, i) => (
        <React.Fragment key={i}>
          <span>{it}</span>
          {i < items.length - 1 && <span style={{ color: "#C9C5BD" }}>·</span>}
        </React.Fragment>
      ))}
    </div>
  );
}
window.O7.TrustBand = TrustBand;

/* =========================================================================
   PHASE CHIP
   ========================================================================= */
function PhaseChip({ phase = "start", children }) {
  const p = PHASE[phase];
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full"
          style={{ background: p.fill, color: p.ink, fontSize: 10.5, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
      {children}
    </span>
  );
}
window.O7.PhaseChip = PhaseChip;

/* =========================================================================
   ANNOTATION PILL
   ========================================================================= */
function AnnotPill({ children, tone = "ink" }) {
  return (
    <span className="mono inline-block px-2 py-1 rounded"
          style={{
            background: tone === "ink" ? "#1A1A1A" : "#FFFFFF",
            color: tone === "ink" ? "#FFFFFF" : "#1A1A1A",
            border: tone === "ink" ? "none" : "1px solid #1A1A1A",
            fontSize: 10.5, letterSpacing: "0.04em"
          }}>
      {children}
    </span>
  );
}
window.O7.AnnotPill = AnnotPill;

/* =========================================================================
   STATE CAPTION (for canvas)
   ========================================================================= */
function StateCaption({ no, name, hint }) {
  return (
    <div className="flex items-baseline gap-3 mb-4">
      <span className="label-xs" style={{ color: INK }}>State {no}</span>
      <span className="serif" style={{ fontSize: 17, fontWeight: 600 }}>{name}</span>
      {hint && <span className="text-[12px]" style={{ color: MUTE }}>{hint}</span>}
    </div>
  );
}
window.O7.StateCaption = StateCaption;

/* =========================================================================
   ANNOTATION ROW
   ========================================================================= */
function Annot({ pill, title, body, meta }) {
  return (
    <div className="flex items-start gap-4">
      <div className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center mono"
           style={{ background: INK, color: "#FFF", fontSize: 11.5, fontWeight: 600 }}>
        {pill}
      </div>
      <div className="flex-1">
        <div className="serif" style={{ fontSize: 16.5, fontWeight: 600, color: INK, lineHeight: 1.25 }}>{title}</div>
        <p className="mt-1.5 text-[13.5px]" style={{ color: SUB, lineHeight: 1.55 }}>{body}</p>
        {meta && <div className="mt-2 mono text-[11px]" style={{ color: MUTE }}>{meta}</div>}
      </div>
    </div>
  );
}
window.O7.Annot = Annot;
