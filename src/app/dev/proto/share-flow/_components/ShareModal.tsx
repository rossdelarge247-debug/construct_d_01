'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { tokens } from '@/styles/tokens';
import { SelectivePublishToggles } from './SelectivePublishToggles';

type PartyType = 'ex' | 'solicitor' | 'mediator';

const TABS: { id: PartyType; label: string }[] = [
  { id: 'ex', label: 'Ex' },
  { id: 'solicitor', label: 'Solicitor' },
  { id: 'mediator', label: 'Mediator' },
];

type Props = {
  open: boolean;
  onClose: () => void;
};

export function ShareModal({ open, onClose }: Props) {
  if (!open) return null;
  return <ShareModalInner onClose={onClose} />;
}

function ShareModalInner({ onClose }: { onClose: () => void }) {
  const headingId = useId();
  const [activeTab, setActiveTab] = useState<PartyType>('ex');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const tablistRef = useRef<HTMLDivElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog) {
      const heading = dialog.querySelector<HTMLElement>(`#${CSS.escape(headingId)}`);
      if (heading) {
        heading.setAttribute('tabindex', '-1');
        heading.focus();
      }
    }
  }, [headingId]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Tab') {
        const dialog = dialogRef.current;
        if (!dialog) return;
        const focusable = dialog.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  function handleTabKey(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const currentIndex = TABS.findIndex((t) => t.id === activeTab);
    const nextIndex =
      e.key === 'ArrowRight'
        ? (currentIndex + 1) % TABS.length
        : (currentIndex - 1 + TABS.length) % TABS.length;
    const nextTab = TABS[nextIndex];
    if (nextTab) {
      setActiveTab(nextTab.id);
      const btn = tablistRef.current?.querySelector<HTMLButtonElement>(
        `[data-tab-id="${nextTab.id}"]`,
      );
      btn?.focus();
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  const displayName = name.trim() === '' ? 'Mark' : name.trim();

  return (
    <div
      role="presentation"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(26, 26, 26, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: 16,
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: tokens.color.surface.panel,
          borderRadius: 16,
          width: '100%',
          maxWidth: 480,
          maxHeight: '90vh',
          overflow: 'auto',
          padding: 24,
          fontFamily: tokens.font.sans,
        }}
      >
        {submitted ? (
          <SubmitConfirmation headingId={headingId} displayName={displayName} onClose={onClose} />
        ) : (
          <>
            <h2
              id={headingId}
              style={{ margin: '0 0 16px', fontSize: tokens.type['20'], fontWeight: 600, color: tokens.color.ink }}
            >
              Share with Mark
            </h2>
            <div
              role="tablist"
              aria-label="Party type"
              ref={tablistRef}
              onKeyDown={handleTabKey}
              style={{ display: 'flex', gap: 6, marginBottom: 16, borderBottom: `1px solid ${tokens.color.border}` }}
            >
              {TABS.map((tab) => {
                const isActive = tab.id === activeTab;
                return (
                  <button
                    key={tab.id}
                    role="tab"
                    type="button"
                    id={`tab-${tab.id}`}
                    data-tab-id={tab.id}
                    aria-selected={isActive}
                    aria-controls={`panel-${tab.id}`}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: '10px 14px',
                      fontFamily: tokens.font.sans,
                      fontSize: tokens.type['14-5'],
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? tokens.color.phase.reconcile.accent : tokens.color.text.sub,
                      borderBottom: isActive ? `2px solid ${tokens.color.phase.reconcile.accent}` : '2px solid transparent',
                      cursor: 'pointer',
                      marginBottom: -1,
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
            <form onSubmit={handleSubmit}>
              {activeTab === 'ex' && (
                <div id="panel-ex" role="tabpanel" aria-labelledby="tab-ex">
                  <Field label="Mark's name" id="ex-name">
                    <input
                      id="ex-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={inputStyle}
                    />
                  </Field>
                  <Field label="Mark's email" id="ex-email">
                    <input
                      id="ex-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={inputStyle}
                    />
                  </Field>
                  <SelectivePublishToggles />
                </div>
              )}
              {activeTab === 'solicitor' && (
                <div id="panel-solicitor" role="tabpanel" aria-labelledby="tab-solicitor">
                  <TbdPlaceholder />
                </div>
              )}
              {activeTab === 'mediator' && (
                <div id="panel-mediator" role="tabpanel" aria-labelledby="tab-mediator">
                  <TbdPlaceholder />
                </div>
              )}
              <div
                style={{
                  display: 'flex',
                  gap: 12,
                  justifyContent: 'flex-end',
                  marginTop: 20,
                  paddingTop: 16,
                  borderTop: `1px solid ${tokens.color.border}`,
                }}
              >
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    background: 'none',
                    border: `1px solid ${tokens.color.border}`,
                    color: tokens.color.ink,
                    padding: '10px 18px',
                    borderRadius: 999,
                    fontFamily: tokens.font.sans,
                    fontSize: tokens.type['14-5'],
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    background: tokens.color.phase.reconcile.accent,
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: 999,
                    fontFamily: tokens.font.sans,
                    fontSize: tokens.type['14-5'],
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  Send invite
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  border: `1px solid ${tokens.color.border}`,
  borderRadius: 8,
  fontFamily: tokens.font.sans,
  fontSize: tokens.type['14-5'],
  color: tokens.color.ink,
  background: tokens.color.surface.panel,
};

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label
        htmlFor={id}
        style={{
          display: 'block',
          marginBottom: 6,
          fontFamily: tokens.font.sans,
          fontSize: 13,
          color: tokens.color.text.sub,
          fontWeight: 500,
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function TbdPlaceholder() {
  return (
    <p
      style={{
        margin: 0,
        padding: 20,
        textAlign: 'center',
        fontFamily: tokens.font.sans,
        fontSize: tokens.type['14-5'],
        color: tokens.color.text.muted,
        background: tokens.color.surface.canvas,
        borderRadius: 10,
      }}
    >
      Form fields TBD per 68f S-1.
    </p>
  );
}

function SubmitConfirmation({
  headingId,
  displayName,
  onClose,
}: {
  headingId: string;
  displayName: string;
  onClose: () => void;
}) {
  return (
    <div data-testid="submit-confirmation">
      <h2
        id={headingId}
        style={{ margin: '0 0 12px', fontSize: tokens.type['20'], fontWeight: 600, color: tokens.color.ink }}
      >
        Invite sent to {displayName}.
      </h2>
      <p
        style={{
          margin: '0 0 20px',
          fontFamily: tokens.font.sans,
          fontSize: tokens.type['14-5'],
          color: tokens.color.text.sub,
          lineHeight: 1.5,
        }}
      >
        State-2 &lsquo;Invited &middot; hasn&rsquo;t opened&rsquo; is a future slice; this prototype ends here.
      </p>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={onClose}
          style={{
            background: tokens.color.ink,
            color: '#FFFFFF',
            border: 'none',
            padding: '10px 20px',
            borderRadius: 999,
            fontFamily: tokens.font.sans,
            fontSize: tokens.type['14-5'],
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}
