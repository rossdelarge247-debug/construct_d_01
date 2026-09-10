'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { APP_NAME } from '@/constants';
import { tokens } from '@/styles/tokens';
import styles from './sign-up.module.css';

const MIN_PASSWORD_LENGTH = 12;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const STEPS = ['Account', 'About you', 'Pay'] as const;

const SIGN_IN_ROUTE = '/dev/proto/sign-in';
const LEGAL_ROUTE = '/dev/proto/legal-trio';
const WELCOME_TOUR_ROUTE = '/dev/proto/welcome-tour';

const FIELD_ORDER = ['name', 'email', 'password', 'terms'] as const;
type FieldName = (typeof FIELD_ORDER)[number];
type Problems = Partial<Record<FieldName, string>>;

const RULES: Record<FieldName, (value: string) => string | null> = {
  name: (value) => (value.trim() ? null : 'Please enter your full name.'),
  email: (value) => {
    const email = value.trim();
    if (!email) return 'Please enter your email address.';
    return EMAIL_PATTERN.test(email) ? null : "That email address doesn't look right.";
  },
  password: (value) =>
    value.length >= MIN_PASSWORD_LENGTH
      ? null
      : `Your password needs at least ${MIN_PASSWORD_LENGTH} characters.`,
  terms: (value) => (value === 'on' ? null : 'Please agree to the Terms and Privacy Policy to continue.'),
};

function findProblems(form: FormData): Problems {
  const problems: Problems = {};
  for (const field of FIELD_ORDER) {
    const message = RULES[field](String(form.get(field) ?? ''));
    if (message) problems[field] = message;
  }
  return problems;
}

function errorId(field: FieldName) {
  return `signup-${field}-error`;
}

function SparkGlyph({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={tokens.color.surface.panel}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6" />
    </svg>
  );
}

function Wordmark() {
  return (
    <span className={styles.wordmark}>
      {APP_NAME}
      <span className={styles.wordmarkDot}>.</span>
    </span>
  );
}

function Stepper() {
  return (
    <ol className={styles.stepper} aria-label="Sign-up progress">
      {STEPS.map((label, i) => {
        const active = i === 0;
        return (
          <li
            key={label}
            className={i > 0 ? `${styles.step} ${styles.stepGrow}` : styles.step}
            aria-current={active ? 'step' : undefined}
          >
            {i > 0 && <span className={styles.stepLine} aria-hidden="true" />}
            <span
              className={active ? `${styles.stepDot} ${styles.stepDotActive}` : styles.stepDot}
              aria-hidden="true"
            >
              {i + 1}
            </span>
            <span className={active ? styles.stepLabelActive : undefined}>{label}</span>
          </li>
        );
      })}
    </ol>
  );
}

interface FieldErrorProps {
  field: FieldName;
  message: string;
  announce: boolean;
}

function FieldError({ field, message, announce }: FieldErrorProps) {
  return (
    <p id={errorId(field)} role={announce ? 'alert' : undefined} className={styles.fieldError}>
      {message}
    </p>
  );
}

export default function SignUpPage() {
  const router = useRouter();
  const [problems, setProblems] = useState<Problems>({});
  const [announced, setAnnounced] = useState<FieldName | null>(null);
  const [submitCount, setSubmitCount] = useState(0);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const next = findProblems(new FormData(form));
    const firstInvalid = FIELD_ORDER.find((field) => next[field]);

    setProblems(next);
    setAnnounced(firstInvalid ?? null);
    setSubmitCount((count) => count + 1);

    if (!firstInvalid) {
      router.push(WELCOME_TOUR_ROUTE);
      return;
    }
    (form.elements.namedItem(firstInvalid) as HTMLInputElement | null)?.focus();
  }

  function revalidate(event: ChangeEvent<HTMLInputElement>) {
    const { name, type, checked, value } = event.target;
    const field = name as FieldName;
    if (!problems[field]) return;

    const message = RULES[field](type === 'checkbox' ? (checked ? 'on' : '') : value);
    setProblems((previous) => {
      const updated = { ...previous };
      if (message) updated[field] = message;
      else delete updated[field];
      return updated;
    });
  }

  const invalid = (field: FieldName) => (problems[field] ? true : undefined);
  const describedBy = (field: FieldName, ...extra: string[]) => {
    const ids = [problems[field] ? errorId(field) : null, ...extra].filter(Boolean);
    return ids.length ? ids.join(' ') : undefined;
  };
  const renderError = (field: FieldName) => {
    const message = problems[field];
    if (!message) return null;
    const announce = announced === field;
    // A fresh key remounts the live region so a repeated failure is announced again.
    return <FieldError key={announce ? submitCount : field} field={field} message={message} announce={announce} />;
  };

  return (
    <main className={styles.page}>
      <header className={styles.topBar}>
        <div className={styles.topBarSide}>
          <Link href="/dev/proto/pre-signup-interview" className={styles.backArrow} aria-label="Back">
            ←
          </Link>
        </div>
        <div className={styles.topBarSide}>
          <Link href={SIGN_IN_ROUTE} className={styles.haveAccount}>
            Have an account? <strong className={styles.haveAccountAction}>Sign in</strong>
          </Link>
        </div>
      </header>

      <div className={styles.body}>
        <div>
          <Wordmark />
          <h1 className={styles.title}>Start your case.</h1>
          <p className={styles.lede}>
            We&apos;ll set up a private workspace. Free until you&apos;re ready to share with your partner.
          </p>
        </div>

        <Stepper />

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.fields}>
            <div>
              <label htmlFor="signup-name" className={styles.fieldLabel}>
                Full name
              </label>
              <input
                id="signup-name"
                name="name"
                type="text"
                autoComplete="name"
                className={styles.input}
                aria-invalid={invalid('name')}
                aria-describedby={describedBy('name')}
                onChange={revalidate}
              />
              {renderError('name')}
            </div>
            <div>
              <label htmlFor="signup-email" className={styles.fieldLabel}>
                Email
              </label>
              <input
                id="signup-email"
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                className={styles.input}
                aria-invalid={invalid('email')}
                aria-describedby={describedBy('email')}
                onChange={revalidate}
              />
              {renderError('email')}
            </div>
            <div>
              <label htmlFor="signup-password" className={styles.fieldLabel}>
                Create password
              </label>
              <input
                id="signup-password"
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••••••"
                className={styles.input}
                aria-invalid={invalid('password')}
                aria-describedby={describedBy('password', 'signup-password-hint')}
                onChange={revalidate}
              />
              {renderError('password')}
              <div id="signup-password-hint" className={styles.hint}>
                Min {MIN_PASSWORD_LENGTH} characters
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="signup-terms" className={styles.terms}>
              <input
                id="signup-terms"
                type="checkbox"
                name="terms"
                className={styles.termsBox}
                aria-invalid={invalid('terms')}
                aria-describedby={describedBy('terms')}
                onChange={revalidate}
              />
              <span>
                I agree to {APP_NAME}&apos;s <strong className={styles.termsName}>Terms</strong> and{' '}
                <strong className={styles.termsName}>Privacy Policy</strong>.
              </span>
            </label>
            {renderError('terms')}
          </div>

          <button type="submit" className={styles.submit}>
            Create account →
          </button>

          <p className={styles.legalLinks}>
            Read the{' '}
            <Link href={LEGAL_ROUTE} className={styles.legalLink}>
              Terms
            </Link>{' '}
            and{' '}
            <Link href={LEGAL_ROUTE} className={styles.legalLink}>
              Privacy Policy
            </Link>
            .
          </p>
        </form>

        <div className={styles.aiCard}>
          <span className={styles.aiBadge} aria-hidden="true">
            <SparkGlyph size={11} />
          </span>
          <div className={styles.aiBody}>
            <p className={styles.aiTitle}>Your account is yours.</p>
            <p className={styles.aiText}>
              Mark won&apos;t see anything until you choose to share. You can complete your whole picture
              privately first.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
