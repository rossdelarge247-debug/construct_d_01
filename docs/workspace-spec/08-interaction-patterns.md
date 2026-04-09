# Workspace Design Spec — 08: Interaction Patterns

## Core principle: Reduce clicks, maintain context

Every interaction should be evaluated against: "Does the user need to leave the current page for this?" If no, it stays inline or uses a modal.

---

## When to use each pattern

### Page navigation (full page change)

Use ONLY for moving between fundamentally different views:
- Home → Phase (e.g., /workspace → /workspace/build)
- Phase → Category (e.g., /workspace/build → /workspace/build/pensions)
- Phase → Phase (e.g., /workspace/build → /workspace/disclose)
- Any sidebar navigation click

**Transition:** Instant. No animation on page change. The sidebar provides visual continuity.

### Modal

Use for focused tasks that don't require a new context:
- Adding an item manually
- Editing an existing item
- Viewing a document in detail
- Uploading a document (when triggered from a category detail page)
- Confirming a destructive action (remove item)
- CETV tracking: logging a request, entering a received value

**Modal design:**
- Centred panel on desktop: max-width 520px, rounded-lg (16px), shadow-lg
- Full-screen on mobile (slides up from bottom)
- Dark overlay backdrop (ink/20 opacity)
- Close button (✕) top-right
- ESC key closes
- Click outside closes (unless form has unsaved changes)
- Content scrolls within the modal if long
- One primary CTA, one cancel/close

**Modal animation:**
- Open: fade in backdrop (150ms) + modal slides up 20px and fades in (200ms ease-out)
- Close: reverse (150ms)

### Inline expansion

Use for revealing more detail without losing context:
- Expanding a spending category to see transactions
- Expanding an AI insight for more detail
- "Why we ask this" explainers
- CETV guidance panels

**Design:** Content expands below the trigger element. Smooth height animation (200ms). Indented or background-shifted to show hierarchy.

### Inline state change

Use for actions that transform content in place:
- Upload zone → processing state → review state → complete state
- Item status change (confirm → confirmed, with green flash)
- Confidence state toggle (known/estimated/unknown)

**Design:** The element transforms in place. Smooth transition between states. No page change, no modal.

---

## The upload flow — entirely inline

This is the most important interaction in V2. It must feel seamless.

### On /workspace/build (the phase hub)

1. **Idle:** Upload zone is large, inviting, always visible at the top of the page.
2. **File dropped/selected:** Zone border goes solid, background shifts to warmth-light. File name appears.
3. **Processing:** Zone transforms to processing state. Conversational messages cycle. Progress indicator. "You can leave and come back."
4. **Extraction complete:** A review panel slides in BELOW the upload zone. Upload zone shrinks slightly but remains visible (for uploading another doc).
5. **Review:** User confirms/rejects items. Each confirmation adds a micro-animation (green flash on the item, then it fades). Category cards in the grid below update in real-time.
6. **All reviewed:** Review panel shows celebration moment, then collapses. Upload zone returns to full size.

### On /workspace/build/{category} (category detail)

Upload triggered from the "Upload document" button. Two options:
- **Option A (preferred):** An upload zone expands inline at the top of the items list. Same flow as above but within the category context.
- **Option B:** A modal with the upload zone. Processing and review happen within the modal. On confirm, modal closes and items appear in the list.

Recommendation: **Option A** for consistency. The upload zone should feel like a natural part of the page, not a separate interaction.

---

## Confirmation patterns

### Adding an item
- User fills modal form → clicks "Save"
- Modal closes
- New item appears in the list with a brief highlight animation (fade from warmth-light to surface)
- Toast notification at bottom: "Income item added" (auto-dismiss after 3s)

### Confirming an extracted item
- User clicks "Looks right"
- Item card transitions: border shifts to sage, subtle green flash, checkmark appears
- If all items confirmed: celebration micro-moment

### Removing an item
- User clicks "Remove"
- Confirmation modal: "Remove this item? This can't be undone."
- Two buttons: "Remove" (danger variant) + "Keep it" (secondary)
- On confirm: item fades out (300ms), list reflows

### Changing confidence state
- User clicks Known/Estimated/Unknown toggle
- Instant visual change (pill colour shifts)
- No confirmation needed — it's a toggle, not a destructive action

---

## Toast notifications

For non-blocking confirmations:

```
┌─────────────────────────────────┐
│ ✓ Income item added             │
└─────────────────────────────────┘
```

- Bottom-centre of the viewport
- Above the mobile bottom tabs
- Auto-dismiss after 3 seconds
- Can be manually dismissed
- Background: ink with cream text (dark toast on light page — high contrast)
- Max 1 toast visible at a time

---

## Error handling

### Upload fails
- Upload zone shows error state: warmth-light background, error message
- "Try again" button + "Enter details manually" fallback
- Never a dead end

### Extraction fails
- "We couldn't extract from this document. You can enter the details manually or try a different file."
- The manual entry modal is one click away

### Network error
- Gentle inline message: "Connection lost. Your work is saved locally. Changes will sync when you're back online."
- Auto-retry in background

### Form validation
- Inline, under the field, in warmth colour
- Never block form submission entirely — empty/optional fields are always allowed
- Only validate format (numbers should be numbers, etc.)

---

## Keyboard navigation

- **Tab** cycles through interactive elements in reading order
- **ESC** closes any modal
- **Enter** confirms the primary action in a modal
- Focus rings use warmth colour, 2px, 2px offset

---

## Loading states

### Page load
- Sidebar renders instantly (static)
- Phase header renders instantly (static)
- Content area: skeleton shimmer for cards/data (cream-dark animated bars)
- Data loads in < 500ms from localStorage

### AI processing
- Conversational messages that change over time (not a spinner)
- "Reading your document..." → "Extracting financial details..." → "Nearly there..."
- Progress bar fills gradually
- Estimated time if possible: "Usually takes 5-15 seconds"

### Data saving
- Auto-save with debounce (500ms)
- No visible save button — everything saves automatically
- Small, subtle "Saved" indicator that appears briefly after changes

---

## Responsive breakpoints

| Breakpoint | Layout |
|-----------|--------|
| ≥ 1024px | Full sidebar (240px) + main content |
| 768-1023px | Collapsed sidebar (64px) + main content |
| < 768px | No sidebar, bottom tab bar, full-width content |

Content adapts:
- Category grid: 4 columns → 2 columns → 1 column
- Financial summary: 3 columns → 2 columns → stacked
- Modals: centred panel → full-screen slide-up
