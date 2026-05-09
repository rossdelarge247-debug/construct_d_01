/* =========================================================================
   O7 — page composition
   - Section bands (situation, journey, what-needs-to-happen, paths,
     decouple-helps, personalised-notes, plan-actions, bottom-row)
   - Four states laid out on a canvas
   ========================================================================= */
/* All atoms (TopBar, Hero, etc) and icons are declared in o7-components.jsx
   and live in the shared script scope — reference them directly, no re-import. */

/* =========================================================================
   SAMPLE preSignupState (drives copy across the page)
   ========================================================================= */
const STATE = {
  stage: "decided",
  relationship_status: "married",
  living_together: "yes",
  has_children: true,
  children_count: 2,
  property_status: "mortgage",
  relationship_quality: "difficult",
  device_private: "yes",
  self_employment: "neither",
  partner_awareness: "some_things",
  priorities: ["fair_split", "keeping_home", "stability_for_children"],
  worries: ["hidden_assets", "process_cost", "ex_not_cooperating"],
};

/* =========================================================================
   BAND 1 — Situation summary
   ========================================================================= */
function SituationSummary() {
  return (
    <section aria-labelledby="o7-situation">
      <h2 id="o7-situation" className="sr-only">Your situation</h2>
      <div className="paper-card relative" style={{ padding: "36px 40px 32px", boxShadow: "0 1px 0 rgba(26,26,26,0.02)" }}>
        {/* edit link */}
        <a href="#" className="absolute top-5 right-5 inline-flex items-center gap-1.5 text-[12px]" style={{ color: SUB }}>
          <Edit size={11}/>
          <span className="underline-offset-4 hover:underline">Edit</span>
        </a>

        <div className="label-xs mb-5" style={{ color: MUTE }}>What we heard</div>

        <div className="space-y-3.5 max-w-[680px]">
          <p className="serif italic" style={{ fontSize: 21, lineHeight: 1.4, color: INK, fontWeight: 500 }}>
            You've decided to separate.
          </p>
          <p className="serif italic" style={{ fontSize: 19, lineHeight: 1.45, color: INK, fontWeight: 400 }}>
            You're married, living together, with two children under 18, in your own home with a mortgage.
          </p>
          <p className="serif italic" style={{ fontSize: 17, lineHeight: 1.5, color: SUB }}>
            What matters most to you: a fair split of everything · keeping the family home · stability for the children.
          </p>
          <p className="serif italic" style={{ fontSize: 17, lineHeight: 1.5, color: SUB }}>
            What worries you most: hidden assets or dishonesty · the cost of the process itself · my ex not cooperating.
          </p>
        </div>

        <div className="mt-6 pt-5" style={{ borderTop: `1px solid ${LINE}` }}>
          <p className="text-[13.5px]" style={{ color: MUTE, lineHeight: 1.5, maxWidth: 640 }}>
            You've told us things between you and your ex are difficult. We'll keep the rest of this plan grounded in that reality.
          </p>
        </div>
      </div>

      <div className="mt-5">
        <TrustBand/>
      </div>
    </section>
  );
}

/* =========================================================================
   BAND 2 — Divorce journey timeline (legal process — distinct from product stepper)
   ========================================================================= */
const JOURNEY = [
  { n: 1, name: "File for divorce",   desc: "Apply online (~£593). 20-week reflection period begins." },
  { n: 2, name: "Disclose finances",  desc: "Both parties share full financial information." },
  { n: 3, name: "Negotiate",          desc: "Agree how to split assets, debts, pensions, child arrangements." },
  { n: 4, name: "Document agreement", desc: "A consent order makes the financial agreement legally binding." },
  { n: 5, name: "Court submission",   desc: "Judge reviews and seals the order (~6–10 weeks)." },
  { n: 6, name: "Implement",          desc: "Transfer property, share pensions, update records, set up contact schedule." },
];

function DivorceJourney() {
  return (
    <section aria-labelledby="o7-journey">
      <SectionHeader
        title={<>What divorce <span className="italic" style={{ fontWeight: 400 }}>actually</span> involves.</>}
        sub="Six stages, regardless of route."
      />

      <ol className="relative">
        {/* horizontal line */}
        <div className="absolute" style={{ left: 18, right: 18, top: 13, height: 1, background: "#D6D3CC" }}/>
        <div className="grid grid-cols-6 gap-4 relative">
          {JOURNEY.map((s) => (
            <li key={s.n} className="flex flex-col items-start">
              {/* node */}
              <div className="relative" style={{ marginLeft: 10 }}>
                <div className="w-[14px] h-[14px] rounded-full"
                     style={{ background: "#FFFFFF", border: `1.5px solid ${INK}` }}/>
              </div>
              <div className="mt-4 pl-0">
                <div className="text-[10.5px] mono mb-1.5" style={{ color: MUTE, letterSpacing: "0.08em" }}>
                  STAGE {s.n}
                </div>
                <div className="serif" style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.2, color: INK }}>
                  {s.name}
                </div>
                <p className="mt-2 text-[12.5px]" style={{ color: SUB, lineHeight: 1.5 }}>
                  {s.desc}
                </p>
              </div>
            </li>
          ))}
        </div>
      </ol>
    </section>
  );
}

/* =========================================================================
   BAND 3 — What needs to happen (stage-specific intro + numbered list)
   ========================================================================= */
const STEPS = [
  "Get clear on what you have together — a complete financial picture both of you trust.",
  "Agree the split across finances, children, housing, and future needs.",
  "File for divorce online (you can do this at any point alongside the financial work).",
  "Get your financial agreement sealed by a judge — the consent order makes it legally binding.",
  "Implement — transfer property, share pensions, close joint accounts, set up contact schedule.",
];

const STEPS_SUBLINE = {
  decided:    "Five steps. They can run in parallel — file for divorce alongside the financial work.",
  thinking:   "Five steps you might walk through. Take them at your own pace.",
  in_process: "Five steps to focus on next.",
};

function WhatNeedsToHappen({ stage = "decided" }) {
  return (
    <section aria-labelledby="o7-steps">
      <SectionHeader
        title={<>What needs <span className="italic" style={{ fontWeight: 400 }}>to happen</span> for you.</>}
        sub={STEPS_SUBLINE[stage]}
      />

      <ol className="space-y-7">
        {STEPS.map((text, i) => (
          <li key={i} className="grid grid-cols-[88px_1fr] gap-6 items-start">
            <div className="serif" style={{ fontSize: 56, lineHeight: 1, fontWeight: 400, color: INK, letterSpacing: "-0.04em" }}>
              {String(i + 1).padStart(2, "0")}
            </div>
            <div className="pt-3">
              <p className="serif" style={{ fontSize: 19, lineHeight: 1.45, color: INK, fontWeight: 500, maxWidth: 640 }}>
                {text}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* =========================================================================
   BAND 4 — Conventional paths
   ========================================================================= */
const PATHS = [
  {
    name: "Solicitor route",
    body: "Each side instructs a solicitor. They handle disclosure, negotiation, and document drafting.",
    figures: [
      ["Average cost", "£14,561 combined"],
      ["Timeline", "12–18 months"],
    ],
    link: "Find a family solicitor — Resolution finder",
  },
  {
    name: "Mediation route",
    body: "A neutral mediator facilitates joint sessions. Cheaper than solicitors but you may still need separate legal advice.",
    figures: [
      ["Cost", "£1,500–£3,000 per couple"],
      ["Timeline", "3–6 months"],
    ],
    link: "Find a mediator — Family Mediation Council",
  },
  {
    name: "DIY route",
    body: "You can do all of this yourselves with court forms. Lowest cost, highest workload.",
    figures: [
      ["Cost", "£593 court fee + your time"],
      ["Timeline", "Variable"],
    ],
    link: "GOV.UK divorce guide",
  },
];

function ConventionalPaths() {
  return (
    <section aria-labelledby="o7-paths">
      <SectionHeader
        title={<>The conventional paths — <span className="italic" style={{ fontWeight: 400 }}>what most people do</span>.</>}
        sub="Honest comparison. We're not pretending these don't exist."
      />

      <div className="grid grid-cols-3 gap-5">
        {PATHS.map((p) => (
          <div key={p.name} className="paper-card flex flex-col" style={{ padding: 24 }}>
            <div className="serif" style={{ fontSize: 19, fontWeight: 600, lineHeight: 1.25, color: INK }}>
              {p.name}
            </div>
            <p className="mt-3 text-[13.5px]" style={{ color: SUB, lineHeight: 1.6, minHeight: 96 }}>
              {p.body}
            </p>
            <div className="mt-4 pt-4 space-y-2.5" style={{ borderTop: `1px solid ${LINE}` }}>
              {p.figures.map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-3">
                  <span className="text-[11.5px] uppercase tracking-wider" style={{ color: MUTE, letterSpacing: "0.08em", fontWeight: 600 }}>
                    {k}
                  </span>
                  <span className="serif tabular" style={{ fontSize: 14, fontWeight: 600, color: INK }}>
                    {v}
                  </span>
                </div>
              ))}
            </div>
            <a href="#" className="mt-5 inline-flex items-center gap-1.5 text-[12.5px]" style={{ color: INK }}>
              <span className="underline underline-offset-4">{p.link}</span>
              <Arrow size={11} sw={1.6}/>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

/* =========================================================================
   BAND 5 — How Decouple helps
   ========================================================================= */
const PHASES = [
  { n: 1, key: "start",     name: "Start",     doc: "Stage router",        line: "Route by where you're at." },
  { n: 2, key: "build",     name: "Build",     doc: "Your Picture",        line: "A complete financial picture, evidenced." },
  { n: 3, key: "reconcile", name: "Reconcile", doc: "Our Household",       line: "Two pictures merged into one shared truth." },
  { n: 4, key: "settle",    name: "Settle",    doc: "Settlement",          line: "Decide finances, children, housing, future." },
  { n: 5, key: "finalise",  name: "Finalise",  doc: "Consent order",       line: "Court-sealed and legally binding." },
];

function DecoupleHelps() {
  return (
    <section aria-labelledby="o7-decouple">
      <SectionHeader
        title={<>How <span className="italic" style={{ fontWeight: 400 }}>Decouple</span> helps.</>}
        sub="We help you do the financial work — together, with evidence, end-to-end."
      />

      {/* 5-phase strip */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        {PHASES.map((p) => (
          <div key={p.n} className="paper-card flex flex-col" style={{ padding: 18 }}>
            <div className="flex items-center justify-between mb-3">
              <span className="serif tabular" style={{ fontSize: 22, fontWeight: 400, color: INK, letterSpacing: "-0.02em" }}>
                {String(p.n).padStart(2, "0")}
              </span>
              <PhaseChip phase={p.key}>{p.name}</PhaseChip>
            </div>
            <div className="serif italic" style={{ fontSize: 14, color: SUB, lineHeight: 1.3 }}>
              {p.doc}
            </div>
            <p className="mt-3 text-[12.5px]" style={{ color: SUB, lineHeight: 1.5 }}>
              {p.line}
            </p>
          </div>
        ))}
      </div>

      {/* comparison sub-card */}
      <div className="soft-card grid grid-cols-2 divide-x" style={{ borderColor: LINE }}>
        <div style={{ padding: "26px 30px" }}>
          <div className="label-xs mb-3" style={{ color: MUTE }}>The conventional path</div>
          <div className="flex items-baseline gap-2 mb-1.5">
            <span className="serif tabular" style={{ fontSize: 32, fontWeight: 600, color: INK, letterSpacing: "-0.02em" }}>
              £14,561
            </span>
            <span className="text-[12.5px]" style={{ color: MUTE }}>average</span>
          </div>
          <div className="text-[13px]" style={{ color: SUB }}>
            18 months · two solicitors, two pictures
          </div>
        </div>
        <div style={{ padding: "26px 30px", borderLeft: `1px solid ${LINE}` }}>
          <div className="label-xs mb-3" style={{ color: MUTE }}>With Decouple</div>
          <div className="flex items-baseline gap-2 mb-1.5">
            <span className="serif tabular" style={{ fontSize: 32, fontWeight: 600, color: INK, letterSpacing: "-0.02em" }}>
              £800–£1,100
            </span>
            <span className="text-[12.5px]" style={{ color: MUTE }}>all-in</span>
          </div>
          <div className="text-[13px]" style={{ color: SUB }}>
            ~3 months typical · one shared, evidenced workspace
          </div>
        </div>
      </div>

      <div className="mt-5">
        <a href="#" className="inline-flex items-center gap-1.5 text-[13px]" style={{ color: INK }}>
          <span className="underline underline-offset-4">See how Decouple works</span>
          <Arrow size={12} sw={1.8}/>
        </a>
      </div>
    </section>
  );
}

/* =========================================================================
   BAND 6 — Personalised notes (callouts)
   ========================================================================= */
const NOTES = [
  {
    tag: "On hidden assets",
    title: "You're worried your ex may not have shared everything.",
    body: "A soft credit check (~£15) often reveals undisclosed accounts. Decouple includes this — and we walk you through the data together. No accusations, just evidence.",
  },
  {
    tag: "On the mortgage",
    title: "If one of you wants to keep the home, the mortgage needs to support that on one income.",
    body: "We'll run an affordability check using your bank data — before you commit to anything.",
  },
  {
    tag: "On the children",
    title: "Children's arrangements aren't a footnote on Decouple.",
    body: "They're Section 1 of your settlement document. Living, contact, holidays, school decisions — all addressed up front.",
  },
  {
    tag: "On a difficult relationship",
    title: "We've designed Decouple specifically for couples who can't sit in a room together.",
    body: "Asynchronous reconciliation, side-by-side comparison, structured proposals — no-one needs to meet in person.",
  },
  {
    tag: "On the cost of the process",
    title: "Decouple is one fixed price tier.",
    body: "Build & Reconcile, then optionally Settle, then optionally Finalise. You only pay when you decide to keep going. No hourly billing surprises.",
  },
];

function PersonalisedNotes() {
  return (
    <section aria-labelledby="o7-notes">
      <SectionHeader
        title={<>Notes for <span className="italic" style={{ fontWeight: 400 }}>your</span> specific situation.</>}
        sub="Based on what you've told us."
      />

      <div className="space-y-3">
        {NOTES.map((n, i) => (
          <article key={i} className="paper-card grid grid-cols-[180px_1fr] gap-8" style={{ padding: "26px 28px" }}>
            <div className="pt-1">
              <div className="label-xs" style={{ color: MUTE }}>Note {String(i + 1).padStart(2, "0")}</div>
              <div className="serif italic mt-2" style={{ fontSize: 13.5, color: SUB, lineHeight: 1.4 }}>
                {n.tag}
              </div>
            </div>
            <div>
              <h3 className="serif" style={{ fontSize: 19, lineHeight: 1.35, fontWeight: 600, color: INK }}>
                {n.title}
              </h3>
              <p className="mt-2.5 text-[14px]" style={{ color: SUB, lineHeight: 1.6, maxWidth: 720 }}>
                {n.body}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* =========================================================================
   BAND 7 — Plan-artefact actions
   ========================================================================= */
function PlanActions({ onOpenEmail }) {
  return (
    <section aria-labelledby="o7-actions" className="text-center">
      <SectionHeader
        title={<>Take this <span className="italic" style={{ fontWeight: 400 }}>with you</span>.</>}
        sub="Yours, whether you go further or not."
      />

      <div className="grid grid-cols-2 gap-5 max-w-[860px] mx-auto">
        <div className="paper-card flex flex-col items-start text-left" style={{ padding: 28 }}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center mb-4"
               style={{ background: "#FFFFFF", border: `1px solid ${INK}` }}>
            <Download size={16}/>
          </div>
          <div className="serif" style={{ fontSize: 20, fontWeight: 600, lineHeight: 1.25, color: INK }}>
            Download as PDF
          </div>
          <p className="mt-2.5 text-[13.5px]" style={{ color: SUB, lineHeight: 1.55 }}>
            4 pages · ~5 min read · everything you've just seen, in a document you can keep, print, or share with a solicitor.
          </p>
          <a href="#" download className="mt-5 inline-flex items-center gap-2 px-5 py-3 rounded-full"
             style={{ background: INK, color: "#FFFFFF", fontSize: 13.5, fontWeight: 600 }}>
            <Download size={14}/>
            <span>Download PDF</span>
          </a>
        </div>

        <div className="paper-card flex flex-col items-start text-left" style={{ padding: 28 }}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center mb-4"
               style={{ background: "#FFFFFF", border: `1px solid ${INK}` }}>
            <Mail size={16}/>
          </div>
          <div className="serif" style={{ fontSize: 20, fontWeight: 600, lineHeight: 1.25, color: INK }}>
            Email it to me
          </div>
          <p className="mt-2.5 text-[13.5px]" style={{ color: SUB, lineHeight: 1.55 }}>
            We'll send the link to your inbox. Use an email account your ex can't access if that's a concern.
          </p>
          <button onClick={onOpenEmail} className="mt-5 inline-flex items-center gap-2 px-5 py-3 rounded-full"
                  style={{ background: "#FFFFFF", color: INK, border: `1px solid ${INK}`, fontSize: 13.5, fontWeight: 600, cursor: "pointer" }}>
            <Mail size={14}/>
            <span>Send link</span>
          </button>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   BOTTOM ROW — back · continue
   ========================================================================= */
function BottomRow() {
  return (
    <div className="px-10 py-6 flex items-center justify-between gap-5"
         style={{ borderTop: `1px solid ${LINE}`, background: "rgba(245,245,244,0.7)", backdropFilter: "blur(8px)" }}>
      <a href="#" className="inline-flex items-center gap-2 text-[13px]" style={{ color: SUB }}>
        <Arrow dir="left" size={13}/>
        <span className="underline-offset-4 hover:underline">Back</span>
      </a>

      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2 text-[11.5px]" style={{ color: MUTE }}>
          <span>Press</span>
          <span className="kbd">→</span>
          <span>to continue</span>
        </div>
        <button className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full"
                style={{ background: INK, color: "#FFFFFF", fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer" }}>
          <span>Continue</span>
          <Arrow dir="right" size={14} sw={2}/>
        </button>
      </div>
    </div>
  );
}

/* =========================================================================
   PAGE SHELL — desktop long-scroll (one full state)
   variant: 'desktop' | 'desktop-thinking'
   ========================================================================= */
function DesktopPage({ width = 1280, height = 2400, stage = "decided", showEmailModal = false }) {
  return (
    <div className="relative" style={{ width, background: PAPER, borderRadius: 18, overflow: "hidden", border: `1px solid ${LINE}` }}>
      <TopBar/>

      {/* HERO */}
      <div className="px-10 pt-8">
        <div className="max-w-[1080px] mx-auto">
          <Hero stage={stage}/>
        </div>
      </div>

      {/* MAIN — bands */}
      <main className="px-10 pt-14 pb-20">
        <div className="max-w-[1080px] mx-auto space-y-24">
          <SituationSummary/>
          <DivorceJourney/>
          <WhatNeedsToHappen stage={stage}/>
          <ConventionalPaths/>
          <DecoupleHelps/>
          <PersonalisedNotes/>
          <PlanActions onOpenEmail={() => {}}/>
        </div>
      </main>

      <BottomRow/>

      {/* EMAIL MODAL OVERLAY */}
      {showEmailModal && <EmailModal/>}
    </div>
  );
}

/* =========================================================================
   EMAIL MODAL
   ========================================================================= */
function EmailModal() {
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="email-modal-title"
         className="absolute inset-0 flex items-center justify-center"
         style={{ background: "rgba(26,26,26,0.42)", zIndex: 50 }}>
      <div className="paper-card relative" style={{ width: 460, padding: 32, boxShadow: "0 30px 80px rgba(26,26,26,0.25)" }}>
        <button aria-label="Close" className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: "transparent", color: SUB, border: "none", cursor: "pointer" }}>
          <X size={16}/>
        </button>

        <div className="label-xs mb-3" style={{ color: MUTE }}>Email this plan</div>
        <h3 id="email-modal-title" className="serif" style={{ fontSize: 26, lineHeight: 1.15, fontWeight: 600, letterSpacing: "-0.02em" }}>
          Send the link to <span className="italic" style={{ fontWeight: 400 }}>your inbox</span>.
        </h3>
        <p className="serif italic mt-3" style={{ fontSize: 15, color: SUB, lineHeight: 1.5 }}>
          We'll keep your plan ready for whenever you come back.
        </p>

        <form className="mt-6 space-y-4">
          <label className="block">
            <span className="label-xs block mb-2" style={{ color: MUTE }}>Email address</span>
            <input type="email" placeholder="you@example.com"
                   className="w-full px-4 py-3 rounded-lg text-[14px]"
                   style={{ background: "#FFF", border: `1px solid ${LINE}`, color: INK, outline: "none" }}/>
          </label>

          <div className="flex items-start gap-2.5 px-4 py-3 rounded-lg"
               style={{ background: SOFT, border: `1px solid ${LINE}` }}>
            <div style={{ color: SUB, marginTop: 1 }}><Info size={13}/></div>
            <div className="text-[12.5px]" style={{ color: SUB, lineHeight: 1.5 }}>
              <span style={{ color: INK, fontWeight: 600 }}>Use an email account your ex can't access</span>{" "}
              if that's a concern. The link in this email is the only way back to your plan.
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" className="text-[13px] px-4 py-2.5" style={{ color: SUB, background: "transparent", border: "none", cursor: "pointer" }}>
              Cancel
            </button>
            <button type="submit" className="inline-flex items-center gap-2 px-5 py-3 rounded-full"
                    style={{ background: INK, color: "#FFFFFF", fontSize: 13.5, fontWeight: 600, border: "none", cursor: "pointer" }}>
              <Mail size={13}/>
              <span>Send link</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* =========================================================================
   MOBILE — 375 wide; long scrollable inner content shown at full height
   ========================================================================= */
function MobilePage() {
  return (
    <div className="mobile-frame" style={{ height: 1900 }}>
      <div className="mobile-screen flex flex-col">
        {/* TOP BAR (mobile) */}
        <div className="px-4 pt-3 pb-3 flex items-center justify-between" style={{ borderBottom: `1px solid ${LINE}`, background: "#FAFAF7" }}>
          <a href="#" className="inline-flex items-center gap-1 text-[11.5px]" style={{ color: SUB }}>
            <Arrow dir="left" size={11}/><span>Home</span>
          </a>
          <div className="flex flex-col items-center gap-1">
            <div className="relative h-[3px] rounded-full" style={{ width: 110, background: "#E0DDD5" }}>
              <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: "88%", background: INK }}/>
            </div>
            <div className="label-xs" style={{ color: MUTE, fontSize: 9 }}>STEP 7 / 8 · ~30s LEFT</div>
          </div>
          <a href="#" className="text-[11px]" style={{ color: SUB }}>Save</a>
        </div>

        {/* HERO */}
        <div className="px-5 pt-5 pb-5">
          <div className="label-xs" style={{ color: MUTE }}>Your plan is ready</div>
          <h1 className="serif mt-2.5" style={{ fontSize: 34, lineHeight: 1.04, letterSpacing: "-0.02em", fontWeight: 600 }}>
            Here's <span className="italic" style={{ fontWeight: 400 }}>your plan</span>.
          </h1>
          <p className="serif italic mt-3" style={{ fontSize: 14.5, lineHeight: 1.5, color: SUB }}>
            Built from your six answers. Yours to keep.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <button className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full"
                    style={{ background: "#FFF", border: `1px solid ${INK}`, color: INK, fontSize: 12, fontWeight: 600 }}>
              <Download size={12}/><span>PDF</span>
            </button>
            <a href="#" className="text-[12px]" style={{ color: SUB }}>Email it</a>
            <span className="text-[10.5px]" style={{ color: MUTE }}>· ~5 min · 4 pp</span>
          </div>
        </div>

        {/* SITUATION (mobile) */}
        <div className="px-5">
          <div className="paper-card relative" style={{ padding: 18 }}>
            <a href="#" className="absolute top-3 right-3 text-[11px]" style={{ color: SUB }}>Edit</a>
            <div className="label-xs mb-3" style={{ color: MUTE }}>What we heard</div>
            <p className="serif italic" style={{ fontSize: 16, lineHeight: 1.4, color: INK, fontWeight: 500 }}>
              You've decided to separate.
            </p>
            <p className="serif italic mt-2.5" style={{ fontSize: 14, lineHeight: 1.45, color: INK }}>
              Married, living together, two children, mortgaged home.
            </p>
            <p className="serif italic mt-2.5" style={{ fontSize: 13, lineHeight: 1.5, color: SUB }}>
              Priorities: fair split · keeping the home · stability for the children.
            </p>
            <p className="serif italic mt-1.5" style={{ fontSize: 13, lineHeight: 1.5, color: SUB }}>
              Worries: hidden assets · process cost · ex not cooperating.
            </p>
            <div className="mt-3 pt-3 text-[11.5px]" style={{ color: MUTE, lineHeight: 1.5, borderTop: `1px solid ${LINE}` }}>
              Things between you are difficult. We'll keep this plan grounded in that reality.
            </div>
          </div>
          <div className="mt-3 mb-2"><TrustBand/></div>
        </div>

        {/* DIVORCE JOURNEY (mobile — vertical) */}
        <div className="px-5 pt-7">
          <div className="label-xs mb-2" style={{ color: MUTE }}>The divorce journey</div>
          <h2 className="serif" style={{ fontSize: 22, lineHeight: 1.15, fontWeight: 600, letterSpacing: "-0.02em" }}>
            What divorce <span className="italic" style={{ fontWeight: 400 }}>actually</span> involves.
          </h2>
          <p className="serif italic mt-2 text-[13px]" style={{ color: SUB, lineHeight: 1.5 }}>
            Six stages, regardless of route.
          </p>
          <ol className="mt-5 relative">
            <div className="absolute" style={{ left: 6, top: 6, bottom: 6, width: 1, background: "#D6D3CC" }}/>
            {JOURNEY.map((s) => (
              <li key={s.n} className="grid grid-cols-[24px_1fr] gap-3 pb-5 last:pb-0">
                <div className="relative" style={{ marginTop: 4 }}>
                  <div className="w-[13px] h-[13px] rounded-full"
                       style={{ background: "#FFF", border: `1.5px solid ${INK}`, position: "relative", zIndex: 2 }}/>
                </div>
                <div>
                  <div className="text-[10px] mono" style={{ color: MUTE, letterSpacing: "0.08em" }}>STAGE {s.n}</div>
                  <div className="serif" style={{ fontSize: 14.5, fontWeight: 600, lineHeight: 1.2, color: INK, marginTop: 2 }}>
                    {s.name}
                  </div>
                  <p className="mt-1 text-[12px]" style={{ color: SUB, lineHeight: 1.5 }}>{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* WHAT NEEDS TO HAPPEN (mobile) */}
        <div className="px-5 pt-7">
          <h2 className="serif" style={{ fontSize: 22, lineHeight: 1.15, fontWeight: 600, letterSpacing: "-0.02em" }}>
            What needs <span className="italic" style={{ fontWeight: 400 }}>to happen</span>.
          </h2>
          <p className="serif italic mt-2 text-[13px]" style={{ color: SUB, lineHeight: 1.5 }}>
            Five steps. They can run in parallel.
          </p>
          <ol className="mt-4 space-y-4">
            {STEPS.map((t, i) => (
              <li key={i} className="grid grid-cols-[36px_1fr] gap-3">
                <div className="serif" style={{ fontSize: 28, lineHeight: 1, color: INK, letterSpacing: "-0.04em", fontWeight: 400 }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <p className="serif text-[14.5px]" style={{ lineHeight: 1.4, color: INK, fontWeight: 500 }}>{t}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* CONVENTIONAL PATHS (mobile — stacked) */}
        <div className="px-5 pt-7">
          <h2 className="serif" style={{ fontSize: 22, lineHeight: 1.15, fontWeight: 600, letterSpacing: "-0.02em" }}>
            Conventional paths.
          </h2>
          <div className="mt-4 space-y-3">
            {PATHS.map((p) => (
              <div key={p.name} className="paper-card" style={{ padding: 16 }}>
                <div className="serif" style={{ fontSize: 15, fontWeight: 600, color: INK }}>{p.name}</div>
                <p className="mt-1.5 text-[12.5px]" style={{ color: SUB, lineHeight: 1.55 }}>{p.body}</p>
                <div className="mt-3 pt-3 flex items-baseline justify-between" style={{ borderTop: `1px solid ${LINE}` }}>
                  <span className="serif tabular text-[13px]" style={{ color: INK, fontWeight: 600 }}>{p.figures[0][1]}</span>
                  <span className="text-[11px]" style={{ color: MUTE }}>{p.figures[1][1]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DECOUPLE HELPS (mobile — stacked) */}
        <div className="px-5 pt-7">
          <h2 className="serif" style={{ fontSize: 22, lineHeight: 1.15, fontWeight: 600, letterSpacing: "-0.02em" }}>
            How <span className="italic" style={{ fontWeight: 400 }}>Decouple</span> helps.
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            {PHASES.map((p) => (
              <div key={p.n} className="paper-card" style={{ padding: 12 }}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="serif tabular text-[14px]" style={{ color: INK }}>{String(p.n).padStart(2, "0")}</span>
                  <PhaseChip phase={p.key}>{p.name}</PhaseChip>
                </div>
                <div className="serif italic text-[11.5px]" style={{ color: SUB }}>{p.doc}</div>
              </div>
            ))}
          </div>
          <div className="soft-card mt-4" style={{ padding: 16 }}>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="label-xs mb-1.5" style={{ color: MUTE, fontSize: 9 }}>CONVENTIONAL</div>
                <div className="serif tabular text-[18px]" style={{ color: INK, fontWeight: 600 }}>£14,561</div>
                <div className="text-[11px]" style={{ color: SUB }}>~18 months</div>
              </div>
              <div>
                <div className="label-xs mb-1.5" style={{ color: MUTE, fontSize: 9 }}>DECOUPLE</div>
                <div className="serif tabular text-[18px]" style={{ color: INK, fontWeight: 600 }}>£800–£1,100</div>
                <div className="text-[11px]" style={{ color: SUB }}>~3 months</div>
              </div>
            </div>
          </div>
        </div>

        {/* PERSONALISED NOTES (mobile) */}
        <div className="px-5 pt-7">
          <h2 className="serif" style={{ fontSize: 22, lineHeight: 1.15, fontWeight: 600, letterSpacing: "-0.02em" }}>
            Notes for <span className="italic" style={{ fontWeight: 400 }}>your</span> situation.
          </h2>
          <div className="mt-4 space-y-3">
            {NOTES.slice(0, 3).map((n, i) => (
              <article key={i} className="paper-card" style={{ padding: 16 }}>
                <div className="label-xs mb-2" style={{ color: MUTE, fontSize: 9.5 }}>NOTE {String(i + 1).padStart(2, "0")} · {n.tag.toUpperCase()}</div>
                <h3 className="serif text-[14.5px]" style={{ fontWeight: 600, lineHeight: 1.3, color: INK }}>{n.title}</h3>
                <p className="mt-2 text-[12.5px]" style={{ color: SUB, lineHeight: 1.55 }}>{n.body}</p>
              </article>
            ))}
            <div className="text-center text-[11.5px]" style={{ color: MUTE }}>+ 2 more notes</div>
          </div>
        </div>

        {/* TAKE WITH YOU (mobile) */}
        <div className="px-5 pt-7 pb-6">
          <h2 className="serif" style={{ fontSize: 22, lineHeight: 1.15, fontWeight: 600, letterSpacing: "-0.02em" }}>
            Take this <span className="italic" style={{ fontWeight: 400 }}>with you</span>.
          </h2>
          <div className="mt-4 space-y-3">
            <button className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-full"
                    style={{ background: INK, color: "#FFF", fontSize: 13.5, fontWeight: 600, border: "none" }}>
              <Download size={14}/>
              <span>Download PDF · 4 pp</span>
            </button>
            <button className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-full"
                    style={{ background: "#FFF", color: INK, border: `1px solid ${INK}`, fontSize: 13.5, fontWeight: 600 }}>
              <Mail size={14}/>
              <span>Email me the link</span>
            </button>
          </div>
        </div>

        {/* STICKY BOTTOM */}
        <div className="mt-auto px-5 pt-3 pb-4 flex items-center justify-between"
             style={{ borderTop: `1px solid ${LINE}`, background: "rgba(245,245,244,0.92)", backdropFilter: "blur(8px)" }}>
          <a href="#" className="text-[12.5px]" style={{ color: SUB }}>← Back</a>
          <button className="inline-flex items-center gap-2 px-5 py-3 rounded-full"
                  style={{ background: INK, color: "#FFF", fontSize: 13, fontWeight: 600, border: "none" }}>
            <span>Continue</span><Arrow size={13} sw={2}/>
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   HERO STAGE VARIANT — small comparison card (third state)
   ========================================================================= */
function HeroVariantCard({ stage, label }) {
  const h = HERO_BY_STAGE[stage];
  const stageStems = {
    decided:    "Five steps. They can run in parallel — file for divorce alongside the financial work.",
    thinking:   "Five steps you might walk through. Take them at your own pace.",
    in_process: "Five steps to focus on next.",
  };
  return (
    <div className="paper-card" style={{ padding: 32, minHeight: 320 }}>
      <div className="flex items-center justify-between mb-5">
        <div className="label-xs" style={{ color: MUTE }}>STAGE · {stage.replace("_", " ")}</div>
        <AnnotPill tone="outline">{label}</AnnotPill>
      </div>
      <h2 className="serif" style={{ fontSize: 38, lineHeight: 1.04, letterSpacing: "-0.02em", fontWeight: 600 }}>
        {h.lead} <span className="italic" style={{ fontWeight: 400 }}>{h.accent}</span>{h.tail}
      </h2>
      <p className="serif italic mt-4" style={{ fontSize: 15.5, color: SUB, lineHeight: 1.5 }}>
        Built from your six answers. Yours to keep — whether you go further or not.
      </p>
      <div className="mt-7 pt-5" style={{ borderTop: `1px solid ${LINE}` }}>
        <div className="label-xs mb-2" style={{ color: MUTE }}>"What needs to happen" sub-line</div>
        <p className="serif italic text-[14px]" style={{ color: SUB, lineHeight: 1.5 }}>
          "{stageStems[stage]}"
        </p>
      </div>
    </div>
  );
}

/* =========================================================================
   ANNOTATIONS PANEL
   ========================================================================= */
function AnnotationsPanel() {
  return (
    <div className="plate p-8">
      <div className="label-xs mb-5" style={{ color: MUTE }}>Annotations · what's new on this screen</div>
      <div className="space-y-6">
        <Annot pill="A" title="Compressed stepper at 88%"
               body="Same C-V3a thin progress rail introduced at O1 — caption now reads 'Step 7 of 8 · ~3 min total · ~30 seconds remaining'. Save & return action becomes available top bar (the user has 6 screens of input worth saving)."
               meta="aria-valuenow=7 · aria-valuemax=8"/>
        <Annot pill="B" title="Hero action cluster"
               body="PDF (white-fill outlined pill) + Email-it-to-me text link, plus a time-estimate (C-V14). Lives in the hero so users who bounce here still get the artefact."/>
        <Annot pill="C" title="Situation summary card"
               body="Italic-mid-weight serif lines reflecting O1–O6 answers. Edit link top-right returns to O1. Tone-context line lives below a hairline divider, lighter weight."/>
        <Annot pill="D" title="Divorce-journey timeline (legal)"
               body="Distinct from Decouple's 5-phase product stepper. Thin horizontal line + hollow ink-bordered nodes + label-below pattern. Brand-neutral throughout. Mobile rotates to vertical."
               meta="<ol> · li per stage · 'Stage N of 6: …' SR sequence"/>
        <Annot pill="E" title="What-needs-to-happen list"
               body="Large 01–05 numerals in serif, generous gutters, no icons, no inline CTAs. Sub-line varies by stage; same data, different tone."/>
        <Annot pill="F" title="Conventional paths — three even cards"
               body="No path is given more visual prominence. Each ends with an external link to a real-world directory. Useful regardless of Decouple."/>
        <Annot pill="G" title="5-phase product strip with phase chips"
               body="Phase accents (Build indigo · Reconcile pink · Settle teal · Finalise green) appear ONLY on the small chips here — nowhere else on this screen. Numeral + name + document name + one-liner. Compressed compared to the welcome-tour C-V5 demo cards."
               meta="phase colour is decorative; numeral + label carry identity"/>
        <Annot pill="H" title="Cost-comparison sub-card"
               body="Paired layout — conventional path on the left, Decouple on the right. Plain serif tabular figures. No graphs."/>
        <Annot pill="I" title="Personalised notes"
               body="Two-column rows: short context tag in italic serif on the left, headline + body on the right. Order by relevance (most-cited concern first). No CTAs — informational only."/>
        <Annot pill="J" title="Plan-artefact actions band"
               body="Two side-by-side cards. PDF is a real <a download>. Email triggers the modal (state 3). Safeguarding copy on the email card directly, not just inside the modal."/>
        <Annot pill="K" title="Bottom row + keyboard hint"
               body="Back to O6 (in case the user wants to revise priorities/worries after seeing the plan). Continue → O8. Reuses C-V4 keyboard hint pattern from O1."/>
      </div>
    </div>
  );
}

/* =========================================================================
   APP — canvas of states
   ========================================================================= */
function App() {
  return (
    <div className="min-h-screen" style={{ background: "#EFEEE9" }}>

      {/* CANVAS HEADER */}
      <header className="px-12 pt-12 pb-8 max-w-[1840px] mx-auto">
        <div className="flex items-baseline justify-between flex-wrap gap-y-3">
          <div>
            <div className="label-xs" style={{ color: MUTE }}>
              Decouple · Pre-signup interview · Wireframe O7
            </div>
            <h1 className="serif mt-2" style={{ fontSize: 36, lineHeight: 1.1, letterSpacing: "-0.02em", fontWeight: 600 }}>
              AI plan output — <span className="italic" style={{ fontWeight: 400 }}>screen 7 of 8</span>
            </h1>
          </div>
          <div className="flex items-center gap-3 text-[12px] mono" style={{ color: SUB }}>
            <AnnotPill>O7</AnnotPill>
            <span>preSignupState → personalised plan</span>
            <span style={{ color: "#C9C5BD" }}>·</span>
            <span>output, not input</span>
          </div>
        </div>
        <p className="mt-4 max-w-[860px] text-[14px]" style={{ color: SUB, lineHeight: 1.6 }}>
          The artefact the whole interview existed to produce. Long-scroll output page, structurally
          different from O1–O6 (no question stem, no radio cards) but continuous in chrome and typography.
          Plan must be useful regardless of Decouple — situation summary, divorce journey (legal),
          what-needs-to-happen, conventional paths, how Decouple helps, personalised notes, take-it-with-you.
          Phase accents appear only on the small phase chips inside the "How Decouple helps" band.
        </p>
      </header>

      <main className="px-12 pb-32 max-w-[1840px] mx-auto space-y-16">

        {/* STATE 01 — DEFAULT DESKTOP */}
        <section>
          <StateCaption no="01" name="Default · desktop long-scroll" hint="1280 × full · 7 bands · brand-neutral chrome"/>
          <DesktopPage stage="decided"/>
        </section>

        {/* STATE 02 — MOBILE */}
        <section>
          <div className="grid grid-cols-[auto_1fr] gap-12 items-start">
            <div>
              <StateCaption no="02" name="Mobile · 375 × 667+ scroll" hint="Single column · vertical journey · stacked notes · sticky bottom"/>
              <MobilePage/>
            </div>

            {/* annotations */}
            <div className="pt-12">
              <AnnotationsPanel/>
            </div>
          </div>
        </section>

        {/* STATE 03 — EMAIL MODAL OPEN */}
        <section>
          <StateCaption no="03" name="Email-modal open" hint="Overlaid on plan · safeguarding copy · focus-trap"/>
          <DesktopPage stage="decided" showEmailModal={true} height={1400}/>
        </section>

        {/* STATE 04 — HERO STAGE VARIANT */}
        <section>
          <StateCaption no="04" name="Hero stage variant — 'thinking'" hint="Same data, different tone (Spec 65 Principle 6)"/>
          <div className="grid grid-cols-3 gap-6">
            <HeroVariantCard stage="decided" label="default"/>
            <HeroVariantCard stage="thinking" label="variant"/>
            <HeroVariantCard stage="in_process" label="variant"/>
          </div>
        </section>

        {/* ANIMATION + ACCESSIBILITY */}
        <section className="grid grid-cols-2 gap-8">
          <div className="plate p-8">
            <div className="label-xs mb-4" style={{ color: MUTE }}>Animation spec</div>
            <ul className="space-y-3 text-[13.5px]" style={{ color: SUB, lineHeight: 1.55 }}>
              <li><span className="mono" style={{color: INK}}>section entry</span> — 8px upward translate + opacity 0→1, 320ms ease-out, 100ms stagger across siblings within a band.</li>
              <li><span className="mono" style={{color: INK}}>notes cascade</span> — first scroll-into-view: each callout fades + lifts in turn (120ms stagger).</li>
              <li><span className="mono" style={{color: INK}}>callout hover</span> — 1px upward translate + slight elevation, 160ms.</li>
              <li><span className="mono" style={{color: INK}}>email-modal</span> — backdrop fade 200ms; modal scale 0.96→1.0 + opacity, 240ms.</li>
              <li><span className="mono" style={{color: INK}}>pdf click</span> — button compresses (scale 0.98) for 120ms.</li>
              <li><span className="mono" style={{color: INK}}>reduced-motion</span> — all of the above become instant fades; no translate, no scale.</li>
            </ul>
          </div>
          <div className="plate p-8">
            <div className="label-xs mb-4" style={{ color: MUTE }}>Accessibility</div>
            <ul className="space-y-3 text-[13.5px]" style={{ color: SUB, lineHeight: 1.55 }}>
              <li><span className="mono" style={{color: INK}}>landmarks</span> — header / main / section[aria-labelledby] for each band / footer.</li>
              <li><span className="mono" style={{color: INK}}>journey timeline</span> — semantic <code>&lt;ol&gt;</code>; SR reads "Stage 1 of 6: File for divorce…".</li>
              <li><span className="mono" style={{color: INK}}>steps</span> — <code>&lt;ol&gt;</code> carries the numbering; large numerals are decorative.</li>
              <li><span className="mono" style={{color: INK}}>phase chip</span> — colour is decorative; numeral + label carry identity.</li>
              <li><span className="mono" style={{color: INK}}>email modal</span> — focus-trap; Esc closes; backdrop-click closes; focus returns to "Send link".</li>
              <li><span className="mono" style={{color: INK}}>pdf</span> — real <code>&lt;a download&gt;</code>, not JS-only.</li>
              <li><span className="mono" style={{color: INK}}>contrast</span> — body ≥ 7:1 · phase-chip text ≥ 4.5:1 against chip fill.</li>
            </ul>
          </div>
        </section>

        {/* CONTINUITY */}
        <section className="plate p-8">
          <div className="label-xs mb-4" style={{ color: MUTE }}>Continuity check</div>
          <div className="grid grid-cols-3 gap-8 text-[13px]" style={{ color: SUB, lineHeight: 1.6 }}>
            <div>
              <div className="serif mb-2" style={{ fontSize: 15, fontWeight: 600, color: INK }}>Resemble</div>
              <p>O1's shell — same top bar, compressed stepper (C-V3a), brand-neutral chrome, italic-accent serif, trust band, keyboard hint. Landing's 5-phase journey strip + cost-comparison band reused, compressed.</p>
            </div>
            <div>
              <div className="serif mb-2" style={{ fontSize: 15, fontWeight: 600, color: INK }}>Differ from O1–O6</div>
              <p>Long-scroll output, not a single-question card. Multiple bands sequenced. No radio cards, no centred question stem. Save & return now visible top bar.</p>
            </div>
            <div>
              <div className="serif mb-2" style={{ fontSize: 15, fontWeight: 600, color: INK }}>Differ from welcome-tour C-V5</div>
              <p>Decouple's 5-phase strip is compressed (numeral + name + chip + one-liner) — no product-screenshot demo cards on this screen. The legal-divorce timeline is a third, distinct visual treatment to avoid confusion with the product stepper.</p>
            </div>
          </div>
        </section>

        {/* OPEN QUESTIONS */}
        <section className="plate p-8">
          <div className="label-xs mb-5" style={{ color: MUTE }}>Open questions for you</div>
          <ol className="space-y-4 text-[13.5px]" style={{ color: SUB, lineHeight: 1.6 }}>
            <li><span style={{ color: INK, fontWeight: 600 }}>1. PDF/email at O7 vs O8?</span> Currently both — hero action cluster + dedicated band. Spec 65 §O8 also offers download. Confirm both, or O8-only?</li>
            <li><span style={{ color: INK, fontWeight: 600 }}>2. Email-save safeguarding copy.</span> "Use an email account your ex can't access if that's a concern." — confirm phrasing for both Save & return (O2–O8) and Email-it-to-me (O7).</li>
            <li><span style={{ color: INK, fontWeight: 600 }}>3. Personalised callout library.</span> Draft full 12–20-entry library as a separate spec for the AI generator slice, or shape-by-example sufficient at wireframe stage?</li>
            <li><span style={{ color: INK, fontWeight: 600 }}>4. Stage variation depth.</span> Currently encoded in (a) hero headline, (b) what-needs-to-happen sub-line. Go further? E.g. soften the divorce-journey for "thinking" users?</li>
            <li><span style={{ color: INK, fontWeight: 600 }}>5. Edit affordance.</span> Currently "Edit" link returns to O1. Right model, or in-place editing of individual fields?</li>
            <li><span style={{ color: INK, fontWeight: 600 }}>6. Page length.</span> ~3–4 viewports of long scroll. Acceptable, or split O7a (situation + journey + steps) → O7b (paths + Decouple + notes + actions)?</li>
            <li><span style={{ color: INK, fontWeight: 600 }}>7. Band order for "thinking" stage.</span> Flip to paths-first / Decouple-after, or keep one canonical order?</li>
          </ol>
        </section>

      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
