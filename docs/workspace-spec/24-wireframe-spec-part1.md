# Wireframe Spec Part 1 — Onboarding, Bank Connection, Reveal

**Source:** 30 wireframe screens reviewed in session 8. These wireframes are the definitive interaction design — implement as designed, do not reinterpret.

**Visual direction (not yet applied to wireframes):** Airbnb colour palette and minimalism. Emma app forms/IxD approach (not Emma's colour palette). These references supersede spec 18 and will be specced separately.

---

## Screen index (this file)

| Screen | Name | Description |
|--------|------|-------------|
| 1a | Welcome carousel — step 1 | "Connect to your bank and be financially disclosed in minutes" |
| 1b | Welcome carousel — step 2 | "Once you have connected we will process and populate your financial disclosure" |
| 1c | Welcome carousel — step 3 | "About 80% of the data in your bank account is enough for mediation" |
| 2a | Task list home — first time | Three-phase task list, one to-do: connect bank |
| 3 | Bank connection — loader start | Hyperfocus on bank connection, progress bar |
| 3b | Bank connection — screen dims | Dark overlay preparing for Tink modal |
| 3c | Bank connection — Tink modal | Tink Link dialogue in a modal lightbox |
| 3d | Bank connection — reveal | Live progressive tick list of findings |
| 3e | Bank connection — complete | Summary of accounts connected, [Next] button |

---

## 1a–1c: Welcome carousel

**When:** First time the user logs in after sign-up. Before they see the task list.

**Structure:** A single card centred on the page, within the standard page frame (nav bar, "Overview" title, "Welcome" subtitle).

**Components per slide:**
- **Progress indicator** at top of card — segmented bar showing position (filled segment = current step). Number of segments flexible (wireframe shows 5-6, can fine-tune to content needs).
- **Graphic placeholder** — large grey box, roughly 60% of card width. Will contain illustrations/graphics that anchor each step's message. Style TBD during visual design phase.
- **Headline copy** — bold, left-aligned, below the graphic.
- **Supporting copy** — "xxxx" placeholder. Will contain 1-2 sentences expanding on the headline.
- **[Next] button** — primary CTA, bottom-left of card. Advances to next carousel step.

**Slide content:**

| Slide | Headline | Intent |
|-------|----------|--------|
| 1a | "Connect to your bank and be financially disclosed in minutes" | Value proposition — speed |
| 1b | "Once you have connected to your bank account we will process and populate your financial disclosure (form E)" | What happens — the system does the work |
| 1c | "About 80% of the data in your bank account is enough to get most people through mediation" | Expectation setting — bank data alone gets you most of the way |

**Additional slides planned:** Explain the connect → review → share → evidence → finalise process. Exact number of slides to be determined by content needs.

**Behaviour:**
- Carousel advances on [Next] click. No auto-advance.
- Progress indicator fills left-to-right as user advances.
- Final slide [Next] transitions to screen 2a (task list home).
- No back button shown in wireframes — consider adding for accessibility.

---

## 2a: Task list home — first time

**When:** After the welcome carousel completes. This is the home page.

**Page structure:**
```
[NAV BAR]
Overview / Home                    [Share & collaborate]

┌─────────────────────────────────────────────────┐
│ Let's get started                               │
│ We will add to your task list as you progress   │
├─────────────────────────────────────────────────┤
│ Preparation                                     │
│                                                 │
│ Connect your bank account and be    [Get        │
│ ready for financial disclosure      started]    │
│ in 3 minutes                                    │
│                                                 │
│     Skip for now, I want to have a look around  │
├─────────────────────────────────────────────────┤
│                                                 │
│ (empty space — task list grows here)            │
│                                                 │
├─────────────────────────────────────────────────┤
│ Sharing & collaboration  [Available after bank  │
│                           connection]           │
├─────────────────────────────────────────────────┤
│ Finalisation             [Not available yet,    │
│                           collate final         │
│                           evidence]             │
└─────────────────────────────────────────────────┘
```

**Key design decisions:**
1. **Three phases visible from day one** — Preparation, Sharing & collaboration, Finalisation. Locked phases show status labels explaining why they're locked. User sees the full journey.
2. **One task on first visit** — "Connect your bank account." Hyper-focused. The task list starts minimal and grows dynamically.
3. **"We will add to your task list as you progress"** — sets the expectation that the system generates tasks based on what it learns.
4. **"Skip for now, I want to have a look around"** — escape hatch. User can explore without committing. No dead ends.
5. **[Get started]** button — primary CTA. Triggers the bank connection flow (screen 3).
6. **Locked phase labels** — "Available after bank connection" and "Not available yet, collate final evidence" communicate prerequisites without being punitive.

---

## 3: Bank connection — loader start

**When:** User clicks [Get started] on the task list.

**Behaviour:** The page transitions to a hyperfocus state. The task list is replaced by a single card centred on the page:

```
[NAV BAR]
Overview / Home                    [Share & collaborate]

┌─────────────────────────────────────────────────┐
│                                                 │
│ (large white space — graphic placeholder area)  │
│                                                 │
│ Connect to your bank account/s                  │
│ ■━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                 │
│                                                 │
└─────────────────────────────────────────────────┘
```

- Indeterminate progress bar beneath the heading.
- Nothing else on the page — full attention on the connection.
- This screen is brief — transitions to 3b as Tink Link prepares to open.

---

## 3b: Bank connection — screen dims

**When:** Tink Link is about to open.

**Behaviour:** The entire page dims with a dark overlay (approximately 60-70% opacity). The bank connection card remains visible underneath but greyed out. This creates the visual preparation for the modal appearing on top.

---

## 3c: Bank connection — Tink modal

**When:** Tink Link opens.

**Behaviour:** The Tink Link interface appears as a **modal/lightbox** centred on the dimmed page. The user completes their bank selection and authentication within this modal.

**Technical note:** This requires switching from Tink Link's redirect flow to their iframe/drop-in integration mode. The current implementation uses a redirect (callback URL). The modal approach keeps the user in the app context.

**On completion:** The modal closes, the dim overlay lifts, and the page transitions to screen 3d (the reveal).

**On cancellation/error:** The modal closes, dim overlay lifts, user returns to screen 3 with an appropriate error message or the option to retry.

---

## 3d: Bank connection — the reveal

**When:** Tink data has been received and is being processed by `tink-transformer.ts`.

**This is the centrepiece "magic moment" of the entire experience.**

**Layout:** Single card, centred on page. No task list visible — full focus.

```
┌─────────────────────────────────────────────────┐
│ Connected to your bank                          │
│ ■■■■■■■■■■━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                 │
│ Processing Barclays current account xxxx2392    │
│ ✓ Income identified — £3,216/month from ACME Ltd│
│ ✓ Spending mapped — £2,400/month, 8 categories  │
│ ✓ Mortgage found — £1,150/month to Halifax      │
│ ✓ Account balance — Barclays current, £1,842    │
│ ✓ Regular commitments — 12 payments identified  │
│ ✓ Pension contributions — £200/month to Aviva   │
│                                                 │
│ Processing Barclays savings account xxxx2392    │
│ (processing...)                                 │
└─────────────────────────────────────────────────┘
```

**Behaviour — progressive reveal:**
1. "Connected to your bank" heading appears with progress bar.
2. Per-account processing block appears: "Processing Barclays current account xxxx2392"
3. Tick items appear one by one as the transformer processes data:
   - ✓ Income identified — £X/month from [employer]
   - ✓ Spending mapped — £X/month across N categories
   - ✓ Mortgage found — £X/month to [lender]
   - ✓ Account balance — [bank] [type], £X
   - ✓ Regular commitments — N payments identified
   - ✓ Pension contributions — £X/month to [provider]
4. If multiple accounts, each gets its own processing block.
5. Each tick appears with a brief animation (fade-in or slide-in).

**Latency handling — if processing takes longer:**

Phase 1 (raw counts):
```
Processing Barclays current account xxxx2392
2,125 transactions read...

Processing Barclays savings account xxxx2392
234 transactions read...
```

Phase 2 (analytical messages cycle):
```
Processing Barclays current account xxxx2392
Assessing your income...

Processing Barclays savings account xxxx2392
Analysing frequency and patterns...
```

The user always sees progress. Never a static spinner.

---

## 3e: Bank connection — complete

**When:** All accounts have been processed.

```
┌─────────────────────────────────────────────────┐
│ Connected to your bank                          │
│ ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■  │
│                                                 │
│ We have finished having a look                  │
│                                                 │
│ ✓ 1 Barclays current account xxx2323            │
│   12 months of transactions                     │
│                                                 │
│ ✓ 1 Barclays savings account xxxx2657           │
│   12 months of transactions                     │
│                                                 │
│ [Next]                                          │
└─────────────────────────────────────────────────┘
```

**Key details:**
- Progress bar fully filled.
- "We have finished having a look" — warm, human language. Not "Processing complete."
- Each account listed with tick, account details, and months of data.
- **[Next] button gives user control** — the system doesn't auto-advance into the confirmation questions. The user decides when to proceed.
- Title bar has changed to "Connected to your bank" (contextual).
