'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { tokens } from '@/styles/tokens';
import { ProtoHeader } from '../_components/ProtoHeader';
import { useProfiling } from '../_context/profiling-context';

type PropertyStatus = 'mortgage' | 'rent' | 'own_outright' | 'other';
type SelfEmployment = 'me' | 'both' | 'neither';
type StepId = 'p1' | 'p2a' | 'p2b' | 'p2c' | 'p4a' | 'p4b' | 'p4c' | 'p6';

function useSteps(property: PropertyStatus, selfEmp: SelfEmployment): StepId[] {
  return useMemo(() => {
    const steps: StepId[] = [];
    if (property !== 'own_outright') steps.push('p1');
    if (selfEmp === 'me' || selfEmp === 'both') steps.push('p2a', 'p2b', 'p2c');
    steps.push('p4a', 'p4b', 'p4c', 'p6');
    return steps;
  }, [property, selfEmp]);
}

const label: React.CSSProperties = {
  display: 'block', margin: '0 0 6px', fontSize: 13,
  fontWeight: 600, color: tokens.color.ink,
};
const input: React.CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: 8,
  border: `1px solid ${tokens.color.border}`, fontFamily: tokens.font.sans,
  fontSize: tokens.type['14-5'],
};
const radioRow: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 10,
  padding: '12px 0', borderBottom: `1px solid ${tokens.color.border}`,
  fontSize: tokens.type['14-5'], color: tokens.color.ink, cursor: 'pointer',
};

function StepP1({ property, setAnswer }: StepProps) {
  if (property === 'mortgage') return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: tokens.type['21'], fontWeight: 600, color: tokens.color.ink }}>
        Who&rsquo;s your mortgage with?
      </h2>
      <label style={label}>Mortgage provider</label>
      <select style={input} defaultValue="" onChange={(e) => setAnswer('mortgageProvider', e.target.value)}>
        <option value="" disabled>Select provider…</option>
        <option>Halifax</option><option>Nationwide</option>
        <option>Santander</option><option>Barclays</option><option>NatWest</option>
      </select>
      <p style={{ margin: '8px 0 0', fontSize: 12, color: tokens.color.text.muted }}>
        Or type to search
      </p>
    </div>
  );
  if (property === 'rent') return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: tokens.type['21'], fontWeight: 600, color: tokens.color.ink }}>
        Who do you pay rent to?
      </h2>
      <label style={label}>Landlord or agent</label>
      <input type="text" placeholder="e.g. Countrywide Lettings" style={input} onChange={(e) => setAnswer('rentLandlord', e.target.value)} />
      <label style={{ ...label, marginTop: 16 }}>Monthly amount</label>
      <input type="text" placeholder="e.g. £950" style={input} onChange={(e) => setAnswer('rentAmount', e.target.value)} />
      <label style={{ ...label, marginTop: 16 }}>Payment day</label>
      <input type="text" placeholder="e.g. 1st" style={input} />
    </div>
  );
  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: tokens.type['21'], fontWeight: 600, color: tokens.color.ink }}>
        Tell us about your property situation
      </h2>
      <label style={label}>Please describe</label>
      <textarea rows={3} placeholder="e.g. Living with parents, council housing…" style={{ ...input, resize: 'vertical' }} />
    </div>
  );
}

function StepP2a({ setAnswer }: StepProps) {
  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: tokens.type['21'], fontWeight: 600, color: tokens.color.ink }}>
        Tell us about your business
      </h2>
      <label style={label}>Company / trading name</label>
      <input type="text" style={input} onChange={(e) => setAnswer('businessName', e.target.value)} />
      <fieldset style={{ border: 'none', padding: 0, margin: '20px 0 0' }}>
        <legend style={label}>Structure</legend>
        {['Sole trader', 'Limited company', 'Partnership', 'Other'].map((o) => (
          <label key={o} style={radioRow}>
            <input type="radio" name="structure" value={o} onChange={() => setAnswer('businessType', o)} /> {o}
          </label>
        ))}
      </fieldset>
    </div>
  );
}

function StepP2b({ setAnswer }: StepProps) {
  const options = [
    'Salary only (PAYE through the company)',
    'Dividends only',
    'Salary and dividends',
    'Drawings / ad hoc',
    'Not sure / varies',
  ];
  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: tokens.type['21'], fontWeight: 600, color: tokens.color.ink }}>
        How do you pay yourself?
      </h2>
      <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
        <legend className="sr-only">Pay method</legend>
        {options.map((o) => (
          <label key={o} style={radioRow}>
            <input type="radio" name="pay-method" value={o} onChange={() => setAnswer('businessPayMethod', o)} /> {o}
          </label>
        ))}
      </fieldset>
    </div>
  );
}

function StepP2c({ setAnswer }: StepProps) {
  const options = [
    'Client payments direct to me',
    'Rental income through the company',
    'Other',
    'None — it’s all through the above',
  ];
  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: tokens.type['21'], fontWeight: 600, color: tokens.color.ink }}>
        Any other income sources from the business?
      </h2>
      <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
        <legend className="sr-only">Other income</legend>
        {options.map((o) => (
          <label key={o} style={radioRow}>
            <input type="checkbox" value={o} /> {o}
          </label>
        ))}
      </fieldset>
    </div>
  );
}

function StepP4a({ setAnswer }: StepProps) {
  const options = [
    'Yes, one',
    'Yes, more than one',
    'I’m already drawing a pension',
    'Not sure — maybe from old jobs',
    'No',
  ];
  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: tokens.type['21'], fontWeight: 600, color: tokens.color.ink }}>
        Do you have any pensions?
      </h2>
      <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
        <legend className="sr-only">Pension existence</legend>
        {options.map((o) => (
          <label key={o} style={radioRow}>
            <input type="radio" name="pension-exist" value={o} onChange={() => setAnswer('hasPension', o)} /> {o}
          </label>
        ))}
      </fieldset>
    </div>
  );
}

function StepP4b({ setAnswer }: StepProps) {
  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: tokens.type['21'], fontWeight: 600, color: tokens.color.ink }}>
        Who&rsquo;s your pension provider?
      </h2>
      <label style={label}>Provider 1</label>
      <select style={input} defaultValue="" onChange={(e) => setAnswer('pensionProvider', e.target.value)}>
        <option value="" disabled>Select provider…</option>
        <option>Aviva</option><option>Scottish Widows</option>
        <option>Legal &amp; General</option><option>Standard Life</option>
        <option>NEST</option><option>Teachers&apos; Pension</option>
        <option>NHS Pension</option><option>Civil Service Pension</option>
      </select>
      <button type="button" style={{ marginTop: 12, background: 'none', border: 'none', color: tokens.color.phase.build.accent, fontSize: 13, fontWeight: 600, cursor: 'pointer', padding: 0 }}>
        + Add another pension
      </button>
      <fieldset style={{ border: 'none', padding: 0, margin: '24px 0 0' }}>
        <legend style={label}>Which of these best describe you or your employer?</legend>
        <label style={radioRow}>
          <input type="checkbox" />
          Current or former public sector worker (NHS, teacher, civil servant, police, armed forces, firefighter, local authority)
        </label>
        <label style={radioRow}>
          <input type="checkbox" />
          Current or former large corporate (banking, utilities, manufacturer) — you joined before 2012
        </label>
        <label style={radioRow}>
          <input type="checkbox" />
          None of these / not sure
        </label>
      </fieldset>
    </div>
  );
}

function StepP4c({ setAnswer }: StepProps) {
  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: tokens.type['21'], fontWeight: 600, color: tokens.color.ink }}>
        A quick note about timing
      </h2>
      <p style={{ margin: '0 0 16px', fontSize: tokens.type['14-5'], lineHeight: 1.6, color: tokens.color.text.sub }}>
        Some pensions (especially from public sector jobs or older corporate schemes) need a
        special valuation called a CETV. Your pension provider has to calculate it — it typically
        takes 6-12 weeks, and we can&rsquo;t avoid that wait.
      </p>
      <p style={{ margin: '0 0 24px', fontSize: tokens.type['14-5'], lineHeight: 1.6, color: tokens.color.text.sub }}>
        We&rsquo;ll add this to your to-do list so you can start early. The valuation will be
        ready when you need to share your picture.
      </p>
      <div style={{ display: 'flex', gap: 10 }}>
        <button type="button" style={{ flex: 1, padding: '12px', borderRadius: 8, border: 'none', background: tokens.color.ink, color: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
          OK, add to my to-do list
        </button>
        <button type="button" onClick={() => setAnswer('cetvStatus', 'skipped')} style={{ flex: 1, padding: '12px', borderRadius: 8, border: `1px solid ${tokens.color.border}`, background: 'transparent', color: tokens.color.text.sub, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
          Skip for now
        </button>
      </div>
    </div>
  );
}

function StepP6(_props: StepProps) {
  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: tokens.type['21'], fontWeight: 600, color: tokens.color.ink }}>
        Before we connect, a heads-up
      </h2>
      <p style={{ margin: '0 0 16px', fontSize: tokens.type['14-5'], lineHeight: 1.6, color: tokens.color.text.sub }}>
        We&rsquo;ll connect your main bank(s) in the next step and pull in the last 12 months
        of data. That covers most people. A few things to have in mind:
      </p>
      <ul style={{ margin: '0 0 28px', padding: '0 0 0 20px', fontSize: tokens.type['14-5'], lineHeight: 1.8, color: tokens.color.text.sub }}>
        <li>App-only banks like Monzo, Revolut, Starling, Chase — we can connect these too if you have them</li>
        <li>Savings accounts with providers like NS&amp;I, Marcus, Chip, Atom — bring their most recent statements</li>
        <li>Joint accounts — connect the one you have access to</li>
        <li>Closed accounts in the last 12 months — we&rsquo;ll ask about these after we see what you connect</li>
      </ul>
      <Link
        href="/dev/proto/bank-connect"
        style={{
          display: 'block', width: '100%', padding: '14px 20px',
          background: tokens.color.ink, color: '#fff', borderRadius: 10,
          fontSize: tokens.type['14-5'], fontWeight: 600, textAlign: 'center',
          textDecoration: 'none', fontFamily: tokens.font.sans,
        }}
      >
        Got it — let&rsquo;s connect
      </Link>
    </div>
  );
}

type StepProps = { property: PropertyStatus; setAnswer: (key: string, value: string) => void };

const STEP_COMPONENTS: Record<StepId, React.ComponentType<StepProps>> = {
  p1: StepP1, p2a: StepP2a, p2b: StepP2b, p2c: StepP2c,
  p4a: StepP4a, p4b: StepP4b, p4c: StepP4c, p6: StepP6,
};

export default function Moment2ProfilingPage() {
  const { setAnswer } = useProfiling();
  const [property, setProperty] = useState<PropertyStatus>('mortgage');
  const [selfEmp, setSelfEmp] = useState<SelfEmployment>('neither');
  const steps = useSteps(property, selfEmp);
  const [stepIdx, setStepIdx] = useState(0);
  const clampedIdx = Math.min(stepIdx, steps.length - 1);
  const currentStep = steps[clampedIdx];
  const StepComponent = STEP_COMPONENTS[currentStep];
  const isLast = clampedIdx === steps.length - 1;

  return (
    <div>
      <ProtoHeader backHref="/dev/proto" backLabel="Your profile" />

      <div data-testid="step-indicator" style={{
        display: 'flex', gap: 4, padding: '12px 20px',
      }}>
        {steps.map((s, i) => (
          <div key={s} style={{
            flex: 1, height: 3, borderRadius: 2,
            background: i <= clampedIdx ? tokens.color.phase.build.accent : tokens.color.border,
            transition: 'background 200ms ease',
          }} />
        ))}
      </div>

      <main style={{ maxWidth: 480, margin: '0 auto', padding: '20px 20px 24px' }}>
        <StepComponent property={property} setAnswer={setAnswer} />

        {!isLast && (
          <div style={{ display: 'flex', gap: 10, marginTop: 28 }}>
            {clampedIdx > 0 && (
              <button type="button" onClick={() => setStepIdx(clampedIdx - 1)} style={{
                flex: 1, padding: '12px', borderRadius: 10, border: `1px solid ${tokens.color.border}`,
                background: 'transparent', color: tokens.color.text.sub, fontWeight: 600,
                fontSize: tokens.type['14-5'], cursor: 'pointer', fontFamily: tokens.font.sans,
              }}>
                Back
              </button>
            )}
            <button type="button" onClick={() => setStepIdx(clampedIdx + 1)} style={{
              flex: 2, padding: '12px', borderRadius: 10, border: 'none',
              background: tokens.color.ink, color: '#fff', fontWeight: 600,
              fontSize: tokens.type['14-5'], cursor: 'pointer', fontFamily: tokens.font.sans,
            }}>
              Next
            </button>
          </div>
        )}
      </main>

      <div style={{
        maxWidth: 480, margin: '0 auto', padding: '0 20px 40px',
      }}>
        <div style={{
          padding: '12px 16px', background: tokens.color.surface.panel, borderRadius: 8,
          border: `1px dashed ${tokens.color.border}`, display: 'flex', flexDirection: 'column', gap: 10,
        }}>
          <span style={{ fontSize: 12, color: tokens.color.text.muted, fontFamily: tokens.font.mono }}>
            Dev: pre-signup state
          </span>
          <div style={{ display: 'flex', gap: 12 }}>
            <label style={{ fontSize: 12, color: tokens.color.text.sub, display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
              Property
              <select aria-label="Property status" value={property}
                onChange={(e) => { const v = e.target.value as PropertyStatus; setProperty(v); setAnswer('propertyStatus', v); setStepIdx(0); }}
                style={{ fontSize: 12, padding: '4px 6px', borderRadius: 4, border: `1px solid ${tokens.color.border}` }}
              >
                <option value="mortgage">Mortgage</option>
                <option value="rent">Rent</option>
                <option value="own_outright">Own outright</option>
                <option value="other">Other</option>
              </select>
            </label>
            <label style={{ fontSize: 12, color: tokens.color.text.sub, display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
              Self-employment
              <select aria-label="Self-employment status" value={selfEmp}
                onChange={(e) => { const v = e.target.value as SelfEmployment; setSelfEmp(v); setAnswer('selfEmployment', v); setStepIdx(0); }}
                style={{ fontSize: 12, padding: '4px 6px', borderRadius: 4, border: `1px solid ${tokens.color.border}` }}
              >
                <option value="neither">Neither</option>
                <option value="me">Me</option>
                <option value="both">Both</option>
              </select>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
