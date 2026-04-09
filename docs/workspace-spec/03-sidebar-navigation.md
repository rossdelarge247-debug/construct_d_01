# Workspace Design Spec — 03: Sidebar & Navigation

## The sidebar is the backbone

The sidebar is always visible on desktop. It tells the user three things at all times:
1. Where am I in the journey?
2. What's my current phase?
3. What can I navigate to?

---

## Desktop sidebar — expanded (240px)

```
┌───────────────────────────┐
│                           │
│  Decouple                 │  ← Logo, links to /workspace
│                           │
│  ─────────────────────    │
│                           │
│  YOUR JOURNEY             │  ← Section label (11px bold uppercase)
│                           │
│  ██ Build your picture ██ │  ← Active phase: warmth bg, white text, bold
│     · Income        ✓    │  ← Sub-items (when in this phase)
│     · Savings       ✓    │     Dot colour = status
│     · Property      ◐    │     Green dot = done
│     · Pensions      ⏳    │     Amber dot = in progress/awaiting
│     · Debts         ○    │     Grey dot = not started
│     · Outgoings     ○    │
│     · Other         ○    │
│                           │
│  ○ Share & disclose       │  ← Future phase: muted, clickable (→ zero state)
│  ○ Work through it        │
│  ○ Reach agreement        │
│  ○ Make it official       │
│                           │
│  ─────────────────────    │
│                           │
│  📄 Documents             │  ← Utility items
│  📋 Timeline              │
│  ⚙ Settings              │
│                           │
│  ─────────────────────    │
│                           │
│  ⏏ Exit this page        │  ← Always at the bottom
│                           │
└───────────────────────────┘
```

### Expanded sidebar detail

**Logo area:**
- "Decouple" in Inter 20px bold, ink colour
- Clicking logo → /workspace (home)
- Below logo: subtle separator line

**Phase items:**
- Each phase is a row: icon + label
- Active phase: warmth background (#C67D5A), white text, font-weight 600, rounded-lg (8px), padding 10px 14px
- Complete phases: sage text, checkmark icon, clickable
- Future phases: ink-faint text, circle icon, clickable (→ zero state page)
- Hover on non-active: cream-dark background transition

**Sub-items (within active phase):**
- Indented under the active phase
- Connected by a 2px warmth-light vertical line on the left
- Each sub-item: small text (13px), dot indicator + label
- Active sub-item: warmth-dark text, bold, warmth-light background
- Other sub-items: ink-light text, hover → cream-dark bg
- Dot colours: sage (done), amber (in progress), ink-faint (not started)

**Utility items:**
- Separated by a divider line
- Smaller text (13px), ink-faint colour
- Icon + label
- Hover: ink-light text

**Exit this page:**
- Separated by a divider line
- Always at the very bottom
- Muted by default, warmth on hover
- Clicking → immediately blanks page → redirects to BBC Weather

---

## Desktop sidebar — collapsed (64px)

When the user collapses the sidebar (via a toggle button):

```
┌────┐
│ D  │  ← Logo initial or icon
│    │
│ ── │
│    │
│ ◉  │  ← Active phase icon (warmth bg)
│ ○  │  ← Future phase icons
│ ○  │
│ ○  │
│ ○  │
│    │
│ ── │
│    │
│ 📄 │
│ 📋 │
│ ⚙  │
│    │
│ ── │
│ ⏏  │
└────┘
```

- Icons only, no labels
- Active phase icon has warmth background circle
- Hover on any icon: tooltip with label appears to the right
- Sub-items are NOT shown in collapsed mode
- Clicking the active phase icon → navigates to the phase page

### Collapse toggle

- A small button at the bottom of the sidebar or at the top-right corner of the sidebar
- Icon: « (collapse) / » (expand)
- State persisted in localStorage
- Transition: smooth width animation (200ms ease)

---

## Mobile navigation — bottom tab bar

On mobile (< 768px), the sidebar disappears. Navigation moves to a bottom tab bar:

```
┌──────────────────────────────────────────────┐
│  ◉ Build    ○ Share    ○ Work    ○ Agree   ○ Final │
│  (active)                                         │
└──────────────────────────────────────────────┘
```

- 5 phase icons with short labels
- Active phase: warmth colour
- Complete: sage colour
- Future: ink-faint
- Fixed to bottom of viewport
- Height: 56px
- Background: cream with top border (2px cream-dark)

### Mobile sub-navigation

When inside a phase, sub-items appear as a horizontal scrollable pill bar below the page title:

```
[Income ✓] [Savings ✓] [Property ◐] [Pensions ⏳] [Debts ○] →
```

- Scrollable horizontally if more items than fit
- Active sub-item: warmth background, white text
- Done: sage background
- Awaiting: amber background
- Not started: cream-dark background

---

## Navigation behaviours

### Logo click
Always → /workspace (home). From any page, any depth.

### Phase click (sidebar)
- Active phase → /workspace/build (or whichever phase)
- Future phase → /workspace/disclose, /workspace/negotiate, etc. (zero state)
- Complete phase → that phase's page (can revisit completed work)

### Sub-item click (sidebar)
Direct navigation to /workspace/build/{category}. No intermediate steps.

### Back navigation
- The sidebar IS the back navigation. You don't need a "back" button because the sidebar always shows where you are and lets you go anywhere.
- EXCEPTION: within a modal or inline flow (like document review), a "close" or "done" action returns to the parent context.
- We do NOT rely on browser back button. The sidebar replaces it.

### Page transitions
- Navigation between pages: instant (no animation). The sidebar provides continuity.
- Content within a page: smooth transitions (fade, slide) for state changes (upload → review → confirm).
