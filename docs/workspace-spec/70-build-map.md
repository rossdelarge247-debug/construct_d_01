# Spec 70 — Complete Settlement Workspace Build Map (Hub)

**Date:** 22 April 2026
**Session:** 22 (P2)
**Status:** LIVE hub. Per-phase maps in sibling files 70-build-map-{phase}.md; slice index (70-build-map-slices.md) produced after the phase files.
**Related:** spec 68 (synthesis hub) + 68a-g · spec 42 (positioning) · spec 44 (document-as-spine) · spec 67 (profiling) · CLAUDE.md (positioning + visual direction + quality bar).

---

## Purpose

This map is the full picture of what the Complete Settlement Workspace contains, phase by phase, component by component, with every preserved legacy library tagged and every known-unknown traced back to its 68f/g entry. It is the input to Phase C (execution planning + code extraction + deployable slice selection).

**The map is not a prioritisation doc.** Scope decisions (first slice, MLP vs V1.5 vs V2, sprint-level cuts) happen at Phase C kickoff and per-slice engineering setup — not here. The map stays complete so scope decisions can be made against the full surface.

**MLP not MVP.** When scope conversations happen later, they should be framed as "what the *loveable* version requires vs what can iterate post-launch" — not "what's the minimum viable." Matches CLAUDE.md north star.

---

## Tagging conventions

Every component per phase gets one primary tag. Some may carry a secondary annotation (e.g. Anchor + Variant-producing).

| Tag | Meaning | Example |
|---|---|---|
| **Anchor** | New component. Visual design already in Claude AI Design outputs. Extracted at Phase C Step 1. | Sarah's Picture document shell, 5-phase stepper, phase colour system |
| **Derived** | Variant of an Anchor living in a different phase. Same component family, different context. | Our Household Picture = derived from Sarah's Picture shell |
| **Variant** | State-variation of a component within the same surface. | Dashboard first-time-zero / post-connection / mid-phase |
| **Re-use** | Legacy library kept as-is. Exports + public API preserved. | Signal rules engine, Tink client, extraction schemas |
| **Preserve-with-reskin** | Legacy logic kept, UI rebuilt against new design system. | Confirmation-questions logic (spec 22 decision trees) drives new per-section confirmation UI |
| **Known-unknown** | Component or decision not yet locked. Linked to a 68f/g entry. | Task taxonomy category completeness (68g B-11) |

Tag choice is an engineering judgement — re-classify during Phase C if initial assumption breaks.

---

## Preserved legacy inventory

These are the libraries that carry across the rebuild unchanged (Re-use) or with new UI (Preserve-with-reskin). Catalogued here so every phase file can reference without repeating.

### Bank / Open Banking (Re-use unless noted)

| Library | Path | Notes |
|---|---|---|
| Tink API client | `src/lib/bank/tink-client.ts` | Re-use. Stable integration with Tink Link auth. |
| Tink transformer | `src/lib/bank/tink-transformer.ts` | Re-use. Tink payload → BankStatementExtraction. |
| Bank data utils | `src/lib/bank/bank-data-utils.ts` | Re-use. Extraction → UI types + demo factory + transaction search. |
| Signal rules (17) | `src/lib/bank/signal-rules/` | Re-use. Session 18 level-2 expansion — stable. |
| Confirmation questions | `src/lib/bank/confirmation-questions.ts` | **Preserve-with-reskin.** Spec 22 decision trees still drive question generation; UI around them rebuilds per 68b. |
| Test scenarios (5) | `src/lib/bank/test-scenarios.ts` | Re-use. Dev-only synthetic data. |
| Bank connect API | `src/app/api/bank/connect/route.ts` | Re-use. Tink Link URL generation. |
| Bank callback API | `src/app/api/bank/callback/route.ts` | Re-use. Tink callback (iframe postMessage + redirect). |

### AI / extraction (Re-use)

| Library | Path | Notes |
|---|---|---|
| Extraction schemas | `src/lib/ai/extraction-schemas.ts` | Re-use. Facts-only, Anthropic structured outputs with `additionalProperties: false`. |
| Result transformer | `src/lib/ai/result-transformer.ts` | Re-use. Spec 13 decision trees + spec 19 keyword lookup. |

### Types (Re-use with pruning)

| Library | Path | Notes |
|---|---|---|
| Hub types | `src/types/hub.ts` | Re-use. Contains workspace types (keep) + legacy hub types (prune during rebuild — reference only where actually used). |

### Dev tools (Re-use)

| Tool | Path | Notes |
|---|---|---|
| Engine workbench | `src/app/workspace/engine-workbench/page.tsx` | Re-use. Dev-only page for testing signal rules against scenarios. |

### Discarded (do NOT port)

UI components from the V2 workspace tree (`src/components/workspace/*`) — welcome carousel, task list, confirmation flow, spending flow, financial summary page — **do not port**. The new design system supersedes them. Their logic is already captured in the preserved libraries above (bank-data-utils, confirmation-questions, result-transformer). The components themselves are tied to obsolete visual patterns (spec 18 colours, pre-pivot flow).

Per CLAUDE.md negative constraint: "Do not extend `/src/components/workspace` without the Build Map in place" — once the Build Map is done, the correct action is **replace**, not extend.

---

## How to read the map

1. **Start with the phase you're planning work on.** Open `70-build-map-{phase}.md`.
2. **Scan the Component list by tag.** Anchors + Derived + Variants = what needs to be built; Re-use + Preserve-with-reskin = what carries over; Known-unknowns = what must be locked before build.
3. **Check open dependencies.** Each phase file links back to 68f/g entries — resolve those before committing to scope.
4. **For cross-phase / end-to-end perspectives, open the slice index** (`70-build-map-slices.md`) — it lists delivery units that cut through multiple phases.

---

## Index

| File | Phase / scope | Status |
|---|---|---|
| `70-build-map.md` | Hub (this file) | ✅ |
| `70-build-map-start.md` | Phase 1: Start | — |
| `70-build-map-build.md` | Phase 2: Build — Sarah's Picture | — |
| `70-build-map-reconcile.md` | Phase 3: Reconcile — Our Household Picture | — |
| `70-build-map-settle.md` | Phase 4: Settle — Settlement Proposal | — |
| `70-build-map-finalise.md` | Phase 5: Finalise — Generated legal docs + post-submit | — |
| `70-build-map-slices.md` | Slice index (cross-phase delivery units) | — |

---

## Maintenance

When a Known-unknown locks → update the relevant phase file tag and move the entry in 68f/g to 🟢 with a commit reference. When a new component is surfaced during engineering spikes → add to the relevant phase file with appropriate tag. The map is a living spec — it evolves with the build.
