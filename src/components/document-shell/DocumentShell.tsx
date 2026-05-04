'use client'

import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import type { DocumentShellProps } from './types'
import { STATE_LABELS } from './types'

const FOCUSABLE_SELECTOR =
  'a, button, [tabindex]:not([tabindex="-1"]), input, select, textarea'

export function DocumentShell({
  title,
  state,
  autosaveStamp,
  leftRail,
  body,
  rightRail,
  bodyAs = 'main',
}: DocumentShellProps) {
  const [leftOpen, setLeftOpen] = useState(false)
  const [rightOpen, setRightOpen] = useState(false)
  const bodyId = useId()
  const leftRailId = useId()
  const rightRailId = useId()
  const leftRailRef = useRef<HTMLElement>(null)
  const rightRailRef = useRef<HTMLElement>(null)
  const leftToggleRef = useRef<HTMLButtonElement>(null)
  const rightToggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (leftOpen) {
      leftRailRef.current
        ?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)
        ?.focus()
    }
  }, [leftOpen])

  useEffect(() => {
    if (rightOpen) {
      rightRailRef.current
        ?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)
        ?.focus()
    }
  }, [rightOpen])

  const handleLeftKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Escape') {
      setLeftOpen(false)
      leftToggleRef.current?.focus()
    }
  }

  const handleRightKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Escape') {
      setRightOpen(false)
      rightToggleRef.current?.focus()
    }
  }

  const bodyProps = {
    id: bodyId,
    'data-shell-region': 'body' as const,
    className: 'min-w-0 p-4',
  }

  return (
    <div className="document-shell flex flex-col">
      <a
        data-shell-skip-link
        href={`#${bodyId}`}
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
            ref={leftToggleRef}
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
            ref={leftRailRef}
            id={leftRailId}
            data-shell-region="leftRail"
            data-state={leftOpen ? 'open' : 'closed'}
            aria-label="Document sections"
            onKeyDown={handleLeftKeyDown}
            className="hidden border-r p-4 transition-[opacity,transform] data-[state=open]:block motion-reduce:transition-none lg:!block"
          >
            {leftRail}
          </nav>
        ) : null}

        {bodyAs === 'section' ? (
          <section {...bodyProps}>{body}</section>
        ) : (
          <main {...bodyProps}>{body}</main>
        )}

        {rightRail ? (
          <aside
            ref={rightRailRef}
            id={rightRailId}
            data-shell-region="rightRail"
            data-state={rightOpen ? 'open' : 'closed'}
            aria-label="Document context"
            onKeyDown={handleRightKeyDown}
            className="hidden border-l p-4 transition-[opacity,transform] data-[state=open]:block motion-reduce:transition-none md:!block"
          >
            {rightRail}
          </aside>
        ) : null}
      </div>

      {rightRail ? (
        <button
          ref={rightToggleRef}
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
