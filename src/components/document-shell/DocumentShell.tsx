'use client'

import { useId, useState } from 'react'
import type { DocumentShellProps } from './types'
import { STATE_LABELS } from './types'

const BODY_ID = 'document-shell-body'

export function DocumentShell({
  title,
  state,
  autosaveStamp,
  leftRail,
  body,
  rightRail,
}: DocumentShellProps) {
  const [leftOpen, setLeftOpen] = useState(false)
  const [rightOpen, setRightOpen] = useState(false)
  const leftRailId = useId()
  const rightRailId = useId()

  return (
    <div className="document-shell flex flex-col">
      <a
        data-shell-skip-link
        href={`#${BODY_ID}`}
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:shadow"
      >
        Skip to document content
      </a>

      <header
        data-shell-region="header"
        className="flex flex-wrap items-center gap-3 border-b px-4 py-3"
      >
        <h1 className="text-lg font-semibold">{title}</h1>
        <span
          data-shell-state-chip
          className="inline-flex items-center rounded-sm border px-2 py-0.5 text-xs tracking-wide"
        >
          {STATE_LABELS[state]}
        </span>
        {autosaveStamp ? (
          <span className="text-xs text-neutral-500">{autosaveStamp}</span>
        ) : null}
        {leftRail ? (
          <button
            type="button"
            data-shell-toggle="leftRail"
            aria-expanded={leftOpen}
            aria-controls={leftRailId}
            onClick={() => setLeftOpen((open) => !open)}
            className="ml-auto rounded border px-2 py-1 text-sm lg:hidden"
          >
            Sections
          </button>
        ) : null}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] lg:grid-cols-[240px_1fr_280px]">
        {leftRail ? (
          <nav
            id={leftRailId}
            data-shell-region="leftRail"
            data-state={leftOpen ? 'open' : 'closed'}
            aria-label="Document sections"
            className="hidden border-r p-4 transition-[opacity,transform] data-[state=open]:block motion-reduce:transition-none lg:!block"
          >
            {leftRail}
          </nav>
        ) : null}

        <main
          id={BODY_ID}
          data-shell-region="body"
          className="min-w-0 p-4"
        >
          {body}
        </main>

        {rightRail ? (
          <aside
            id={rightRailId}
            data-shell-region="rightRail"
            data-state={rightOpen ? 'open' : 'closed'}
            aria-label="Document context"
            className="hidden border-l p-4 transition-[opacity,transform] data-[state=open]:block motion-reduce:transition-none md:!block"
          >
            {rightRail}
          </aside>
        ) : null}
      </div>

      {rightRail ? (
        <button
          type="button"
          data-shell-toggle="rightRail"
          aria-expanded={rightOpen}
          aria-controls={rightRailId}
          onClick={() => setRightOpen((open) => !open)}
          className="border-t px-4 py-2 text-sm md:hidden"
        >
          Document context
        </button>
      ) : null}
    </div>
  )
}
