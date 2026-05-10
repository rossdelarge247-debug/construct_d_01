/* =========================================================================
   O7 — Page composition
   Three states laid out on a canvas:
   01. Mobile · ready (375 wide, full-content height)
   02. Mobile · generating (375 × 667, fixed)
   03. Desktop adaptation (compressed)
   ========================================================================= */

/* USER INPUT — drives every section ---------------------------------------- */
const ANSWERS = {
  stage: "decided",
  relationship: "married",
  living: "still living together",
  children: 2,
  housing: "own with mortgage",
  ex_dynamic: "difficult but workable",
  employment: "both employed (PAYE)",
  awareness: "I know some of what they have",
  priorities: ["a fair split of everything", "keeping the family home", "stability for the children"],
  worries:    ["my ex hiding assets", "the cost of the process itself", "my ex not cooperating"],
};

/* =========================================================================
   SECTION 1 — Situation summary (EXPLICIT echoes — A3 hybrid)
   ========================================================================= */
function SituationSummary() {
  return (
    <section style={{ padding: "32px 20px 8px 20px" }}>
      <div className="flex items-center justify-between mb-3">
        <Eyebrow color={VIOLET}>Section 1 · what you told us</Eyebrow>
        <a href="#" className="inline-flex items-center gap-1 text-[11.5px]" style={{ color: SUB }}>
          <Edit size={10}/><span className="underline-offset-4 hover:underline">Edit answers</span>
        </a>
      </div>

      <PaperCard style={{ padding: "20px 20px 16px 20px", position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%",
          background: "radial-gradient(closest-side, rgba(124,58,237,0.07), transparent 70%)",
        }}/>

        <div className="relative">
          <div className="flex items-start gap-2">
            <QuoteMark size={20} color={MAGENTA}/>
            <div>
              <p className="serif italic" style={{ fontSize: 17, lineHeight: 1.42, color: INK, fontWeight: 500 }}>
                You've decided to separate.
              </p>
              <p className="serif italic mt-3" style={{ fontSize: 14.5, lineHeight: 1.5, color: INK }}>
                You're <span style={{ color: MAGENTA, fontStyle: "italic" }}>married</span>, still living together, with{" "}
                <span style={{ color: MAGENTA }}>two children under 18</span>, and you own your home with a mortgage.
              </p>
              <p className="serif italic mt-2.5" style={{ fontSize: 14.5, lineHeight: 1.5, color: INK }}>
                Things between you are <span style={{ color: MAGENTA }}>difficult but workable</span>, and you both work in regular employment.
              </p>
            </div>
          </div>

          <div className="mt-5 pt-4 grid grid-cols-1 gap-3" style={{ borderTop: `1px solid ${LINE}` }}>
            <div>
              <div className="label-xs" style={{ color: VIOLET, fontSize: 9.5 }}>WHAT MATTERS MOST TO YOU</div>
              <ul className="mt-2 space-y-1.5">
                {ANSWERS.priorities.map(p => (
                  <li key={p} className="flex items-start gap-2 text-[13px]" style={{ color: INK, lineHeight: 1.45 }}>
                    <span style={{ width: 4, height: 4, borderRadius: "50%", background: VIOLET, marginTop: 7, flexShrink: 0 }}/>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-3" style={{ borderTop: `1px dashed ${LINE}` }}>
              <div className="label-xs" style={{ color: MAGENTA, fontSize: 9.5 }}>WHAT WORRIES YOU MOST</div>
              <ul className="mt-2 space-y-1.5">
                {ANSWERS.worries.map(p => (
                  <li key={p} className="flex items-start gap-2 text-[13px]" style={{ color: INK, lineHeight: 1.45 }}>
                    <span style={{ width: 4, height: 4, borderRadius: "50%", background: MAGENTA, marginTop: 7, flexShrink: 0 }}/>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </PaperCard>

      <p className="serif italic mt-4 text-[12.5px]" style={{ color: MUTE, lineHeight: 1.5 }}>
        Everything below this point is shaped by these answers. If something here doesn't feel right, edit and your plan re-shapes.
      </p>
    </section>
  );
}

/* =========================================================================
   SECTION 2 — The divorce journey (the strongest visual anchor)
   Horizontal scroll-rail of six stages — roadmap feel, not checklist.
   ========================================================================= */
const STAGES = [
  { n: 1, plain: "File for divorce",      legal: "Issue divorce application",          line: "Apply online together or alone. A 20-week reflection period begins." },
  { n: 2, plain: "Open the books",        legal: "Financial disclosure",               line: "Both of you share a full picture of money, property, pensions and debts." },
  { n: 3, plain: "Agree the split",       legal: "Negotiation",                        line: "Decide together: finances, children, housing, future needs." },
  { n: 4, plain: "Make it binding",       legal: "Consent order",                      line: "A short legal document so the agreement holds in years to come." },
  { n: 5, plain: "Court signs it off",    legal: "Court submission & sealing",         line: "A judge reviews and seals the order. Around 6 to 10 weeks." },
  { n: 6, plain: "Put it into practice",  legal: "Implementation",                     line: "Transfer property, split pensions, update records, set the schedule." },
];

function DivorceJourney({ wide = false }) {
  return (
    <section style={{ padding: wide ? "40px 20px 8px 20px" : "32px 0 8px 0" }}>
      <div style={{ padding: wide ? 0 : "0 20px" }}>
        <MobileSectionHeader
          eyebrow="Section 2 · the road ahead"
          eyebrowColor={VIOLET}
          title={<>What divorce <span className="italic" style={{ fontWeight: 400, color: MAGENTA }}>actually</span> involves.</>}
          sub="Six stages, regardless of which route you take. Plain language first; the legal name underneath."
        />
      </div>

      {/* horizontal scroll rail */}
      <div style={{ position: "relative", paddingLeft: 20 }}>
        <div className="o7-no-scrollbar" style={{
          overflowX: "auto", overflowY: "visible", paddingBottom: 14, paddingRight: 20,
          scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch",
        }}>
          <div style={{ display: "flex", gap: 12, position: "relative" }}>
            {/* connecting line behind cards */}
            <div style={{
              position: "absolute", left: 16, right: 16, top: 22, height: 1.5,
              background: `linear-gradient(90deg, ${VIOLET} 0%, ${MAGENTA} 100%)`,
              opacity: 0.35, zIndex: 0,
            }}/>
            {STAGES.map(s => (
              <div key={s.n} style={{
                width: 220, flexShrink: 0, scrollSnapAlign: "start", position: "relative", zIndex: 1,
              }}>
                {/* node */}
                <div style={{
                  width: 30, height: 30, borderRadius: "50%",
                  background: "#FFFFFF", border: `1.5px solid ${VIOLET}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "JetBrains Mono, monospace", fontSize: 12, fontWeight: 600, color: VIOLET,
                  marginBottom: 12,
                }}>
                  {String(s.n).padStart(2, "0")}
                </div>
                <div className="serif" style={{ fontSize: 17, lineHeight: 1.18, fontWeight: 600, color: INK, letterSpacing: "-0.01em" }}>
                  {s.plain}
                </div>
                <div className="mono mt-1.5" style={{ fontSize: 9.5, color: MUTE, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  {s.legal}
                </div>
                <p className="mt-2 text-[12.5px]" style={{ color: SUB, lineHeight: 1.5 }}>
                  {s.line}
                </p>
              </div>
            ))}
          </div>
        </div>
        {/* scroll affordance */}
        <div className="mt-1 flex items-center gap-1.5 text-[10.5px]" style={{ color: MUTE, paddingRight: 20 }}>
          <Arrow size={10} sw={1.6} dir="right"/>
          <span>Scroll through the six stages</span>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   SECTION 3 — What needs to happen (TAILORED)
   Implicit reflection — sections written in plain prose that obviously
   incorporates user input, no quoting (A3 hybrid).
   ========================================================================= */
const TAILORED_STEPS = [
  {
    n: "01",
    title: "Get a complete picture of what you have together.",
    body: "Money, property, pensions, debts — both sides, in one place. Bank-evidenced where possible so neither of you has to take the other's word for it.",
    why: "Because you said you're worried your ex may not have shared everything.",
  },
  {
    n: "02",
    title: "Decide what happens to the family home.",
    body: "You can sell, one of you can buy the other out, or you can defer the decision until the children are older. Each comes with an affordability check before anyone commits.",
    why: "Because keeping the family home matters to you, and there's a mortgage to consider.",
  },
  {
    n: "03",
    title: "Set out arrangements for the children.",
    body: "Where they live, when they see each parent, holidays, school decisions, and how you'll handle changes as they grow. Written down, not assumed.",
    why: "Because stability for two children under 18 is one of your priorities.",
  },
  {
    n: "04",
    title: "File for divorce — at your own pace.",
    body: "You can do this online together or alone, before, during, or after the financial work. There's a 20-week reflection period built in.",
    why: "Because you've decided to separate, but the timing of filing is yours.",
  },
  {
    n: "05",
    title: "Make the financial agreement legally binding.",
    body: "Once you've agreed the split, a short document called a consent order is sent to a judge. They check it's fair and seal it. The agreement then holds for the future.",
    why: "Because anything not sealed by a court can be reopened later — and many people don't realise this.",
  },
];

function WhatNeedsToHappen() {
  return (
    <section style={{ padding: "40px 20px 8px 20px" }}>
      <MobileSectionHeader
        eyebrow="Section 3 · what needs to happen"
        eyebrowColor={VIOLET}
        title={<>Five things, <span className="italic" style={{ fontWeight: 400, color: MAGENTA }}>for your situation</span>.</>}
        sub="Specific to your answers — not generic advice. They can run alongside each other, in the order that suits you."
      />

      <ol className="space-y-4">
        {TAILORED_STEPS.map((s, i) => (
          <li key={i}>
            <PaperCard style={{ padding: "18px 18px 16px 18px" }}>
              <div className="flex items-baseline gap-3">
                <div className="serif" style={{ fontSize: 32, lineHeight: 1, fontWeight: 400, color: VIOLET, letterSpacing: "-0.04em" }}>
                  {s.n}
                </div>
                <h3 className="serif flex-1" style={{ fontSize: 16, lineHeight: 1.3, fontWeight: 600, color: INK }}>
                  {s.title}
                </h3>
              </div>
              <p className="mt-3 text-[13.5px]" style={{ color: SUB, lineHeight: 1.55 }}>
                {s.body}
              </p>
              <div className="mt-3 pt-3 flex items-start gap-2 text-[12px] serif italic"
                   style={{ borderTop: `1px dashed ${LINE}`, color: MAGENTA, lineHeight: 1.45 }}>
                <Heart size={11}/>
                <span>{s.why}</span>
              </div>
            </PaperCard>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* =========================================================================
   SECTION 4 — The conventional path (C2 warm reference card)
   "The path most people take" — described in prose with inline data.
   Decouple is the alternative, presented separately in section 5.
   ========================================================================= */
function ConventionalPath() {
  return (
    <section style={{ padding: "40px 20px 8px 20px" }}>
      <MobileSectionHeader
        eyebrow="Section 4 · the path most people take"
        eyebrowColor={VIOLET}
        title={<>The <span className="italic" style={{ fontWeight: 400, color: MAGENTA }}>conventional</span> path.</>}
        sub="Useful to know whether you go further with us or not. We're not pretending this doesn't exist — and for some situations it's the right call."
      />

      <PaperCard style={{ padding: "22px 20px 20px 20px", background: PAPER_WARM }}>
        <p className="serif" style={{ fontSize: 16, lineHeight: 1.5, color: INK }}>
          Most separating couples each instruct a family solicitor. The solicitors handle disclosure between them, draft the financial agreement, and apply for the consent order on your behalf.
        </p>
        <p className="serif italic mt-3 text-[14px]" style={{ color: SUB, lineHeight: 1.55 }}>
          It works. It's also the most expensive route, and for many couples — particularly those who can still talk — it can feel slower and more adversarial than it needs to be.
        </p>

        <div className="mt-5 pt-5 grid grid-cols-2 gap-4" style={{ borderTop: `1px solid ${LINE}` }}>
          <div>
            <div className="label-xs" style={{ color: MUTE, fontSize: 9.5 }}>AVERAGE COST</div>
            <div className="serif tabular mt-1.5" style={{ fontSize: 26, fontWeight: 600, color: INK, letterSpacing: "-0.02em" }}>
              £14,561
            </div>
            <div className="text-[11.5px] mt-1" style={{ color: MUTE }}>both sides combined</div>
          </div>
          <div>
            <div className="label-xs" style={{ color: MUTE, fontSize: 9.5 }}>HOW LONG</div>
            <div className="serif tabular mt-1.5" style={{ fontSize: 26, fontWeight: 600, color: INK, letterSpacing: "-0.02em" }}>
              18–24 mo
            </div>
            <div className="text-[11.5px] mt-1" style={{ color: MUTE }}>typical timeline</div>
          </div>
        </div>

        <div className="mt-5 pt-4" style={{ borderTop: `1px solid ${LINE}` }}>
          <div className="label-xs mb-2.5" style={{ color: MUTE, fontSize: 9.5 }}>USEFUL STARTING POINTS</div>
          <ul className="space-y-2">
            {[
              ["Find a family solicitor", "Resolution finder"],
              ["Find a mediator",        "Family Mediation Council"],
              ["Do it yourself online",  "GOV.UK divorce guide"],
            ].map(([k, v]) => (
              <li key={k} className="flex items-baseline justify-between gap-3">
                <a href="#" className="text-[13px] underline underline-offset-4" style={{ color: INK }}>{k}</a>
                <span className="text-[11.5px]" style={{ color: MUTE }}>{v}</span>
              </li>
            ))}
          </ul>
        </div>
      </PaperCard>

      <p className="serif italic mt-4 text-[12.5px]" style={{ color: MUTE, lineHeight: 1.5 }}>
        These figures come from Resolution and Legal Services Board research. We've cited them so you can check.
      </p>
    </section>
  );
}

/* =========================================================================
   SECTION 5 — How Decouple helps (soft introduction, three pillars)
   Position as "complete settlement workspace" (load-bearing framing).
   ========================================================================= */
const PILLARS = [
  { tag: "Shared, not adversarial", body: "One workspace you both build together. No back-and-forth between two solicitors. No two pictures, just one shared one." },
  { tag: "Evidenced, not asserted",  body: "Bank data, statements and documents become the source of truth. Nobody has to take the other's word for what's there." },
  { tag: "End-to-end, not hand-off", body: "From first picture through to consent order and life after — one place, one continuous thread, no expensive hand-offs." },
];

function DecoupleHelps() {
  return (
    <section style={{ padding: "40px 20px 8px 20px" }}>
      <MobileSectionHeader
        eyebrow="Section 5 · another way"
        eyebrowColor={VIOLET}
        title={<><span className="italic" style={{ fontWeight: 400, color: MAGENTA }}>Decouple</span> is the complete<br/>settlement workspace.</>}
        sub="One place where both of you build the same picture — finances, children, housing, future needs — through to consent order and life after."
      />

      {/* three pillars */}
      <div className="space-y-2.5">
        {PILLARS.map((p, i) => (
          <div key={i} style={{
            padding: "16px 16px",
            background: "#FFFFFF",
            border: `1px solid ${LINE}`,
            borderLeft: `3px solid ${i === 0 ? VIOLET : i === 1 ? MAGENTA : INDIGO}`,
            borderRadius: 12,
          }}>
            <div className="serif" style={{ fontSize: 14.5, fontWeight: 600, color: INK, lineHeight: 1.25 }}>
              {p.tag}
            </div>
            <p className="mt-1.5 text-[12.5px]" style={{ color: SUB, lineHeight: 1.55 }}>
              {p.body}
            </p>
          </div>
        ))}
      </div>

      {/* soft cost / time comparison — placed AFTER the pillars, not front-loaded */}
      <div className="mt-5" style={{
        padding: "18px 18px",
        background: `linear-gradient(180deg, ${VIOLET_SOFT} 0%, ${MAGENTA_SOFT} 100%)`,
        borderRadius: 14,
        border: `1px solid ${LINE}`,
      }}>
        <Eyebrow color={VIOLET}>For comparison</Eyebrow>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <div className="text-[10.5px]" style={{ color: MUTE, letterSpacing: "0.04em" }}>CONVENTIONAL</div>
            <div className="serif tabular mt-1" style={{ fontSize: 18, fontWeight: 600, color: SUB, textDecoration: "line-through", textDecorationColor: SOFTMUTE }}>
              £14,561
            </div>
            <div className="text-[11px] mt-0.5" style={{ color: MUTE }}>~18 months</div>
          </div>
          <div>
            <div className="text-[10.5px]" style={{ color: VIOLET, letterSpacing: "0.04em" }}>WITH DECOUPLE</div>
            <div className="serif tabular mt-1" style={{ fontSize: 22, fontWeight: 600, color: INK, letterSpacing: "-0.02em" }}>
              £800–£1,100
            </div>
            <div className="text-[11px] mt-0.5" style={{ color: MUTE }}>~3 months typical</div>
          </div>
        </div>
        <p className="serif italic mt-4 text-[12px]" style={{ color: SUB, lineHeight: 1.5 }}>
          You only pay when you decide to keep going. The first picture you build is free.
        </p>
      </div>
    </section>
  );
}

/* =========================================================================
   SECTION 6 — Personalised notes (call-outs based on answers)
   ========================================================================= */
const NOTES = [
  {
    tag: "On stability for the children",
    body: "Because this matters most to you, the children's section comes first in your settlement document — not as a footnote. Living arrangements, contact, holidays and school decisions are written down so neither of you is guessing later.",
  },
  {
    tag: "On hidden assets",
    body: "A bank-evidenced approach replaces \"trust me\" with statements. A soft credit search (around £15) often surfaces accounts that didn't come up in the conversation. No accusations — just the data, side by side.",
  },
  {
    tag: "On keeping the family home",
    body: "Whether one of you can keep it on a single income is a maths question, not an opinion. We'll run an affordability check using your bank data before anyone commits to anything.",
  },
  {
    tag: "On the cost of the process",
    body: "There are no hourly bills here. You pay one fixed amount per phase, only when you choose to move forward. If you stop after the picture, that's where it ends.",
  },
];

function PersonalisedNotes() {
  return (
    <section style={{ padding: "40px 20px 8px 20px" }}>
      <MobileSectionHeader
        eyebrow="Section 6 · for your specific situation"
        eyebrowColor={VIOLET}
        title={<>A few things <span className="italic" style={{ fontWeight: 400, color: MAGENTA }}>worth knowing</span>.</>}
        sub="Drawn from what you told us — not generic guidance."
      />

      <div className="space-y-3">
        {NOTES.map((n, i) => (
          <article key={i} style={{
            padding: "18px 18px 16px 18px",
            background: i % 2 === 0 ? "#FFFFFF" : PAPER_WARM,
            border: `1px solid ${LINE}`,
            borderRadius: 14,
          }}>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="mono" style={{ fontSize: 9.5, color: VIOLET, letterSpacing: "0.06em" }}>
                NOTE {String(i + 1).padStart(2, "0")}
              </span>
              <span className="serif italic text-[12.5px]" style={{ color: MAGENTA }}>{n.tag}</span>
            </div>
            <p className="text-[13.5px]" style={{ color: INK, lineHeight: 1.55 }}>
              {n.body}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

/* =========================================================================
   SECTION 7 — Find out more + CTA  (sticky thumb-zone)
   ========================================================================= */
function PlanFooter({ sticky = false }) {
  return (
    <>
      <section style={{ padding: "40px 20px 28px 20px" }}>
        <h2 className="serif" style={{ fontSize: 22, lineHeight: 1.15, fontWeight: 600, letterSpacing: "-0.02em" }}>
          Take this <span className="italic" style={{ fontWeight: 400, color: MAGENTA }}>with you</span>.
        </h2>
        <p className="serif italic mt-2.5 text-[13.5px]" style={{ color: SUB, lineHeight: 1.5 }}>
          Yours, whether you go further or not. No account, no email needed.
        </p>

        <div className="mt-5 space-y-2.5">
          <button className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-full"
                  style={{ background: "#FFFFFF", color: INK, border: `1px solid ${INK}`, fontSize: 13.5, fontWeight: 600 }}>
            <Download size={13}/>
            <span>Download your plan as PDF</span>
          </button>
          <button className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full"
                  style={{ background: "transparent", color: SUB, border: "none", fontSize: 13 }}>
            <Mail size={12}/>
            <span className="underline-offset-4 underline">Email me the link instead</span>
          </button>
        </div>

        <div className="mt-7 pt-6 flex items-center justify-between" style={{ borderTop: `1px solid ${LINE}` }}>
          <a href="#" className="text-[12.5px] underline-offset-4 underline" style={{ color: SUB }}>
            Find out more about Decouple
          </a>
          <span className="text-[11px]" style={{ color: MUTE }}>pricing · how it works</span>
        </div>
      </section>

      {/* sticky thumb-zone CTA */}
      <div style={{
        position: sticky ? "sticky" : "static",
        bottom: 0,
        padding: "14px 20px 20px 20px",
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(10px)",
        borderTop: `1px solid ${LINE}`,
      }}>
        <div className="flex items-center justify-between gap-3">
          <a href="#" className="inline-flex items-center gap-1.5 text-[12.5px] px-2 py-2" style={{ color: SUB }}>
            <Arrow dir="left" size={12}/><span>Back</span>
          </a>
          <button className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full"
                  style={{ background: INK, color: "#FFF", fontSize: 14, fontWeight: 600, border: "none", flex: 1, justifyContent: "center" }}>
            <span>What's next</span>
            <Arrow size={13} sw={2}/>
          </button>
        </div>
      </div>
    </>
  );
}

/* =========================================================================
   STATE 01 — MOBILE READY (long scroll, full content)
   ========================================================================= */
function MobileReady() {
  return (
    <MobileFrame height="auto" bg="#FFFFFF">
      <div style={{ borderRadius: 30, overflow: "hidden", background: "#FFFFFF" }}>
        <MobileTopBar/>
        <MobileHero/>
        <SituationSummary/>
        <DivorceJourney/>
        <WhatNeedsToHappen/>
        <ConventionalPath/>
        <DecoupleHelps/>
        <PersonalisedNotes/>
        <PlanFooter sticky/>
      </div>
    </MobileFrame>
  );
}

/* =========================================================================
   STATE 02 — MOBILE GENERATING (375 × 720 fixed)
   The "warm hand on a cold day" moment.
   ========================================================================= */
function MobileGenerating() {
  return (
    <MobileFrame height={720} fixed bg="transparent">
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, #F3EEFE 0%, #FCE7F3 360px, #FBFAF6 720px)",
      }}/>
      <div style={{ position: "relative", height: "100%", display: "flex", flexDirection: "column" }}>
        <MobileTopBar step={6} total={8} remaining="just a moment"/>

        {/* breathing visual + copy */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 28px", textAlign: "center" }}>
          <BreathingHalo size={180}/>

          <div className="mt-7">
            <Eyebrow color={VIOLET}>Building your plan</Eyebrow>
            <h2 className="serif mt-3" style={{ fontSize: 28, lineHeight: 1.1, fontWeight: 600, letterSpacing: "-0.02em", color: INK }}>
              Take a <span className="italic" style={{ fontWeight: 400, color: MAGENTA }}>breath</span>.
            </h2>
            <p className="serif italic mt-3 text-[14px]" style={{ color: SUB, lineHeight: 1.55, maxWidth: 280, marginInline: "auto" }}>
              We're shaping this around the six things you've told us. There's no clock here — we'll be ready when you are.
            </p>
          </div>

          {/* progressive disclosure of micro-steps */}
          <ul className="mt-7 space-y-2.5 text-left" style={{ width: "100%", maxWidth: 280 }}>
            {[
              ["Listening to your situation",   true],
              ["Mapping the journey",           true],
              ["Tailoring next steps",          true],
              ["Comparing the conventional path",false],
              ["Writing your specific notes",   false],
            ].map(([label, done], i) => (
              <li key={i} className="flex items-center gap-2.5 text-[13px]"
                  style={{ color: done ? INK : MUTE, opacity: done ? 1 : 0.55 }}>
                <span style={{
                  width: 14, height: 14, borderRadius: "50%",
                  background: done ? VIOLET : "transparent",
                  border: done ? "none" : `1.5px solid ${MUTE}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  {done && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                </span>
                <span>{label}</span>
                {!done && i === 3 && (
                  <span className="ml-auto mono text-[10px]" style={{ color: VIOLET }}>working…</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div style={{ padding: "16px 24px 22px 24px" }}>
          <div className="serif italic text-center text-[12.5px]" style={{ color: MUTE, lineHeight: 1.5 }}>
            "A warm hand on a cold day."
          </div>
        </div>
      </div>
    </MobileFrame>
  );
}

/* =========================================================================
   STATE 03 — DESKTOP ADAPTATION (compressed, two-column)
   ========================================================================= */
function DesktopAdaptation() {
  return (
    <div style={{
      width: 1100,
      borderRadius: 18, overflow: "hidden",
      border: `1px solid ${LINE}`,
      background: "#FFFFFF",
      boxShadow: "0 24px 50px rgba(124,58,237,0.10)",
    }}>
      {/* top bar */}
      <div className="flex items-center justify-between" style={{ padding: "18px 28px", borderBottom: `1px solid ${LINE}` }}>
        <a href="#" className="inline-flex items-center gap-2 text-[12.5px]" style={{ color: SUB }}>
          <Arrow dir="left" size={12}/><span>Back to home</span>
        </a>
        <div className="flex flex-col items-center gap-1">
          <div className="relative h-[3px] rounded-full" style={{ width: 220, background: "#E5E3DC" }}>
            <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: "88%", background: INK }}/>
          </div>
          <div className="label-xs" style={{ color: MUTE }}>STEP 7 / 8 · ~30 SECONDS REMAINING</div>
        </div>
        <div className="flex items-center gap-3 text-[12px]" style={{ color: SUB }}>
          <a href="#" className="underline-offset-4 underline">Save &amp; return</a>
        </div>
      </div>

      {/* hero */}
      <div style={{ background: EXPRESSIVE_HERO, padding: "44px 56px 36px 56px", position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", top: -160, right: -80,
          width: 480, height: 480, borderRadius: "50%",
          background: "radial-gradient(closest-side, rgba(255,255,255,0.6), transparent 70%)",
        }}/>
        <div className="grid grid-cols-[1fr_auto] gap-10 items-end relative">
          <div>
            <Eyebrow color={VIOLET}>Your plan is ready</Eyebrow>
            <h1 className="serif mt-3" style={{ fontSize: 56, lineHeight: 1.02, letterSpacing: "-0.025em", fontWeight: 600 }}>
              Here's <span className="italic" style={{ fontWeight: 400, color: MAGENTA }}>your plan</span>.
            </h1>
            <p className="serif italic mt-4" style={{ fontSize: 17, lineHeight: 1.5, color: SUB, maxWidth: 540 }}>
              Built from your six answers — a warm picture of where you are, what's ahead, and what your options are. Yours to keep, whether you go further or not.
            </p>
          </div>
          <div className="flex flex-col items-end gap-2 pb-2">
            <div className="flex items-center gap-2.5">
              <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full"
                      style={{ background: "#FFF", border: `1px solid ${INK}`, color: INK, fontSize: 13, fontWeight: 600 }}>
                <Download size={13}/><span>Save as PDF</span>
              </button>
              <a href="#" className="inline-flex items-center gap-1.5 text-[12.5px]" style={{ color: SUB }}>
                <Mail size={12}/><span className="underline-offset-4 hover:underline">Email me the link</span>
              </a>
            </div>
            <div className="text-[11px]" style={{ color: MUTE }}>~5 min read · 4 pages PDF</div>
          </div>
        </div>
      </div>

      {/* two-column body — situation pinned left, scroll content right */}
      <div className="grid grid-cols-[360px_1fr]">
        <aside style={{ padding: "32px 28px", borderRight: `1px solid ${LINE}`, background: PAPER_WARM }}>
          <Eyebrow color={VIOLET}>What you told us</Eyebrow>
          <div className="mt-3 flex items-start gap-2">
            <QuoteMark size={18} color={MAGENTA}/>
            <div>
              <p className="serif italic" style={{ fontSize: 16, lineHeight: 1.42, color: INK, fontWeight: 500 }}>
                You've decided to separate.
              </p>
              <p className="serif italic mt-3 text-[13.5px]" style={{ lineHeight: 1.5, color: INK }}>
                Married, still living together, with two children under 18, and you own your home with a mortgage. Things are difficult but workable.
              </p>
            </div>
          </div>

          <div className="mt-5 pt-4" style={{ borderTop: `1px solid ${LINE}` }}>
            <div className="label-xs" style={{ color: VIOLET, fontSize: 9.5 }}>WHAT MATTERS MOST</div>
            <ul className="mt-2 space-y-1.5 text-[12.5px]" style={{ color: INK, lineHeight: 1.45 }}>
              {ANSWERS.priorities.map(p => <li key={p} className="flex gap-2"><span style={{width:3,height:3,borderRadius:"50%",background:VIOLET,marginTop:7,flexShrink:0}}/>{p}</li>)}
            </ul>
          </div>
          <div className="mt-4 pt-4" style={{ borderTop: `1px dashed ${LINE}` }}>
            <div className="label-xs" style={{ color: MAGENTA, fontSize: 9.5 }}>WHAT WORRIES YOU</div>
            <ul className="mt-2 space-y-1.5 text-[12.5px]" style={{ color: INK, lineHeight: 1.45 }}>
              {ANSWERS.worries.map(p => <li key={p} className="flex gap-2"><span style={{width:3,height:3,borderRadius:"50%",background:MAGENTA,marginTop:7,flexShrink:0}}/>{p}</li>)}
            </ul>
          </div>

          <a href="#" className="mt-5 inline-flex items-center gap-1 text-[11.5px]" style={{ color: SUB }}>
            <Edit size={10}/><span className="underline-offset-4 underline">Edit your answers</span>
          </a>
        </aside>

        <div style={{ padding: "12px 0 0 0" }}>
          <DivorceJourney wide/>
          <div style={{ padding: "0 32px" }}>
            <WhatNeedsToHappen/>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   APP — CANVAS LAYOUT
   ========================================================================= */
function App() {
  return (
    <div style={{
      minHeight: "100vh",
      background: EXPRESSIVE_BG,
      paddingBottom: 96,
    }}>
      {/* CANVAS HEADER */}
      <header style={{ padding: "56px 56px 32px 56px", maxWidth: 1840, margin: "0 auto" }}>
        <div className="flex items-baseline justify-between flex-wrap gap-y-3">
          <div>
            <div className="label-xs" style={{ color: VIOLET }}>
              Decouple · Pre-signup interview · Wireframe O7 · Expressive
            </div>
            <h1 className="serif mt-3" style={{ fontSize: 40, lineHeight: 1.05, letterSpacing: "-0.025em", fontWeight: 600 }}>
              Your plan — <span className="italic" style={{ fontWeight: 400, color: MAGENTA }}>screen 7 of 8</span>
            </h1>
            <p className="mt-3 text-[14px] max-w-[760px]" style={{ color: SUB, lineHeight: 1.55 }}>
              The first moment the user receives anything back. Mobile-first canvas (375 primary). Style anchored to the locked Expressive palette and type. Three loveability decisions resolved here:{" "}
              <span style={{ color: INK, fontWeight: 600 }}>A3 hybrid</span> personalisation,{" "}
              <span style={{ color: INK, fontWeight: 600 }}>B3 hero + scroll</span> disclosure,{" "}
              <span style={{ color: INK, fontWeight: 600 }}>C2 warm reference card</span> for the conventional path.
            </p>
          </div>
          <div className="flex items-center gap-3 text-[12px] mono" style={{ color: SUB }}>
            <Pill color={VIOLET}>O7</Pill>
            <span>preSignupState → personalised plan</span>
          </div>
        </div>
      </header>

      {/* CANVAS — three states laid out side-by-side, then full-width desktop */}
      <main style={{ padding: "0 56px", maxWidth: 1840, margin: "0 auto" }}>

        {/* ROW 1 — MOBILE STATES + ANNOTATIONS */}
        <section className="grid gap-12 items-start" style={{ gridTemplateColumns: "auto auto 1fr" }}>
          {/* State 02 — generating */}
          <div>
            <StateCaption no="02"
                          name="Mobile · generating"
                          hint="The moment after submitting O6, before the plan resolves. The 'warm hand on a cold day' is most tested here."/>
            <MobileGenerating/>
          </div>

          {/* State 01 — ready */}
          <div>
            <StateCaption no="01 · primary"
                          name="Mobile · ready"
                          hint="Full plan rendered — 375 wide, content-height. B3 hero+scroll: hero & situation summary above the fold; sections 2–7 unspool below."/>
            <MobileReady/>
          </div>

          {/* annotations */}
          <div style={{ position: "sticky", top: 32 }}>
            <div style={{
              background: "#FFFFFF",
              border: `1px solid ${LINE}`,
              borderRadius: 16, padding: 24,
            }}>
              <Eyebrow color={VIOLET}>Annotations</Eyebrow>
              <div className="mt-4 space-y-5">
                <Annot pill="A" title="Hero + scroll disclosure (B3)"
                       body="Eyebrow / display headline / italic sub / save-as-PDF + email cluster sit on the lilac→blush wash. Below the gradient, the situation summary echo — both fit above the fold."/>
                <Annot pill="B" title="Explicit echo, situation only (A3)"
                       body="Italic-quoted answers in section 1, with magenta highlights on the specific terms (married, two children, difficult-but-workable). Sections 2–7 are implicit prose — they incorporate user input without quoting."/>
                <Annot pill="C" title="Visual timeline anchor"
                       body="Horizontal scroll-rail of six stages, violet→magenta connecting line, hollow ink-bordered nodes. Plain language first, legal term in mono caption. Strongest visual on the screen."/>
                <Annot pill="D" title="Tailored, not generic"
                       body="Each step ends with a magenta italic 'because…' line that ties it back to one specific answer. No 'get a solicitor'. Numerals in violet keep the section visually distinct from the legal-journey timeline."/>
                <Annot pill="E" title="Warm reference card (C2)"
                       body="The conventional path is a single card on warm paper with prose first, figures second, and three external links. Useful even if the user never returns. The price is not front-loaded."/>
                <Annot pill="F" title="Three pillars, not two columns"
                       body="Decouple's value sits in three short pillars (shared / evidenced / end-to-end), each with a coloured spine. The lilac→blush comparison panel comes after, so the user has read the value before the price."/>
                <Annot pill="G" title="Personalised notes — alternating paper"
                       body="Four call-outs, alternating between #FFF and warm paper for visual rhythm. Each is tagged with the specific concern it addresses ('On hidden assets', 'On stability for the children')."/>
                <Annot pill="H" title="Thumb-zone CTA, agency-preserving"
                       body="Sticky 'What's next' primary plus back link. PDF and email are also offered earlier in the flow so users who bounce here still get the artefact."/>
                <Annot pill="I" title="Generating state — breathing halo"
                       body="180px breathing radial wash (3.6s loop), centred, reduced-motion respected. Five micro-steps progressively complete; copy explicitly says 'no clock here'."/>
              </div>
            </div>
          </div>
        </section>

        {/* ROW 2 — DESKTOP ADAPTATION */}
        <section className="mt-20">
          <StateCaption no="03"
                        name="Desktop adaptation · secondary"
                        hint="Two-column layout: situation summary pinned in the warm-paper sidebar, journey + steps + remaining sections in the main column. Same content, same tone — laid out for a wider canvas."/>
          <DesktopAdaptation/>
        </section>

        {/* CONTINUITY / NEGATIVE-CONSTRAINT CHECK */}
        <section className="mt-20 grid grid-cols-2 gap-8">
          <div style={{ background: "#FFFFFF", border: `1px solid ${LINE}`, borderRadius: 16, padding: 28 }}>
            <Eyebrow color={VIOLET}>Continuity with O1–O6</Eyebrow>
            <div className="mt-4 space-y-3 text-[13.5px]" style={{ color: SUB, lineHeight: 1.55 }}>
              <div><span className="serif" style={{ color: INK, fontWeight: 600, fontSize: 14.5 }}>Same chrome.</span> Top bar with home / compressed stepper / save returns from O1. Italic-accent serif headlines continue. Lilac→blush hero gradient is the only place that wash appears.</div>
              <div><span className="serif" style={{ color: INK, fontWeight: 600, fontSize: 14.5 }}>Different shape.</span> Long-scroll output instead of one centred question card. No radio cards. The thumb-zone CTA reads "What's next" instead of "Continue", because the artefact has already been delivered.</div>
              <div><span className="serif" style={{ color: INK, fontWeight: 600, fontSize: 14.5 }}>One new pattern.</span> Horizontal scroll-rail for the six legal stages — the only horizontal scroll in the whole pre-signup flow. Used here because the journey is the strongest visual anchor.</div>
            </div>
          </div>

          <div style={{ background: "#FFFFFF", border: `1px solid ${LINE}`, borderRadius: 16, padding: 28 }}>
            <Eyebrow color={MAGENTA}>Negative-constraint audit</Eyebrow>
            <ul className="mt-4 space-y-2.5 text-[13px]" style={{ color: SUB, lineHeight: 1.55 }}>
              {[
                ["Framing", "Decouple positioned as 'complete settlement workspace'. Not 'financial disclosure tool', not 'Form E alternative'."],
                ["Language", "'You can', 'many people choose', 'yours to keep' — never 'you must' or 'you need to'. No prescriptive verbs."],
                ["Urgency", "No countdowns, no scarcity, no fear. The generating state explicitly says 'no clock here'."],
                ["Jargon", "'Consent order' glossed as 'a short legal document so the agreement holds'. 'Disclosure' glossed as 'open the books'. No legal term stands alone."],
                ["Pricing", "Cost comparison appears in section 5, after the value pillars. Not front-loaded in the hero."],
                ["Imagery", "No stock photos of humans. No 'happy family' illustrations. Subtle warmth from radial gradients, generous spacing, soft shadows."],
              ].map(([k, v]) => (
                <li key={k} className="flex items-start gap-3">
                  <span className="serif" style={{ fontSize: 13, fontWeight: 600, color: INK, minWidth: 70 }}>{k}</span>
                  <span style={{ flex: 1 }}>{v}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
