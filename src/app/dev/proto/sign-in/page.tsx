'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { APP_NAME } from '@/constants';
import styles from './sign-in.module.css';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MARKETING_ROUTE = '/dev/proto/marketing-landing';
const SIGN_UP_ROUTE = '/dev/proto/sign-up';
const DASHBOARD_ROUTE = '/dev/proto/post-connect-dashboard';

// Remembered-device state the canvas depicts; a real session store replaces this.
const REMEMBERED = {
  firstName: 'Sarah',
  email: 'sarah.harris@gmail.com',
  day: 7,
  answered: 19,
  questions: 22,
};

const FIELD_ORDER = ['email', 'password'] as const;
type FieldName = (typeof FIELD_ORDER)[number];
type Problems = Partial<Record<FieldName, string>>;

const RULES: Record<FieldName, (value: string) => string | null> = {
  email: (value) => {
    const email = value.trim();
    if (!email) return 'Please enter your email address.';
    return EMAIL_PATTERN.test(email) ? null : "That email address doesn't look right.";
  },
  password: (value) => (value ? null : 'Please enter your password.'),
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
  return `signin-${field}-error`;
}

function Wordmark() {
  return (
    <span className={styles.wordmark}>
      {APP_NAME}
      <span className={styles.wordmarkDot}>.</span>
    </span>
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

export default function SignInPage() {
  const router = useRouter();
  const [problems, setProblems] = useState<Problems>({});
  const [announced, setAnnounced] = useState<FieldName | null>(null);
  const [submitCount, setSubmitCount] = useState(0);
  const [resetRequested, setResetRequested] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const next = findProblems(new FormData(form));
    const firstInvalid = FIELD_ORDER.find((field) => next[field]);

    setProblems(next);
    setAnnounced(firstInvalid ?? null);
    setSubmitCount((count) => count + 1);

    if (!firstInvalid) {
      router.push(DASHBOARD_ROUTE);
      return;
    }
    (form.elements.namedItem(firstInvalid) as HTMLInputElement | null)?.focus();
  }

  function revalidate(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    const field = name as FieldName;
    if (!problems[field]) return;

    const message = RULES[field](value);
    setProblems((previous) => {
      const updated = { ...previous };
      if (message) updated[field] = message;
      else delete updated[field];
      return updated;
    });
  }

  const invalid = (field: FieldName) => (problems[field] ? true : undefined);
  const describedBy = (field: FieldName) => (problems[field] ? errorId(field) : undefined);
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
          <Link href={MARKETING_ROUTE} className={styles.backArrow} aria-label="Back">
            ←
          </Link>
        </div>
        <div className={styles.topBarSide}>
          <Link href={SIGN_UP_ROUTE} className={styles.needAccount}>
            Need an account?
          </Link>
        </div>
      </header>

      <div className={styles.body}>
        <div>
          <Wordmark />
          <h1 className={styles.title}>Welcome back, {REMEMBERED.firstName}.</h1>
          <p className={styles.lede}>
            Sign in to pick up where you left off — Day {REMEMBERED.day}, {REMEMBERED.answered} of{' '}
            {REMEMBERED.questions} questions.
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.fields}>
            <div>
              <label htmlFor="signin-email" className={styles.fieldLabel}>
                Email
              </label>
              <input
                id="signin-email"
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                defaultValue={REMEMBERED.email}
                className={styles.input}
                aria-invalid={invalid('email')}
                aria-describedby={describedBy('email')}
                onChange={revalidate}
              />
              {renderError('email')}
            </div>
            <div>
              <div className={styles.labelRow}>
                <label htmlFor="signin-password" className={styles.fieldLabel}>
                  Password
                </label>
                <button
                  type="button"
                  className={styles.forgot}
                  aria-expanded={resetRequested}
                  aria-controls="signin-reset-note"
                  onClick={() => setResetRequested(true)}
                >
                  Forgot?
                </button>
              </div>
              <input
                id="signin-password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••••••"
                className={styles.input}
                aria-invalid={invalid('password')}
                aria-describedby={describedBy('password')}
                onChange={revalidate}
              />
              {renderError('password')}
              <p id="signin-reset-note" role="status" className={styles.resetNote}>
                {resetRequested &&
                  `We'll email ${REMEMBERED.email} a reset link. That step is next to be built; your details here are safe.`}
              </p>
            </div>
            <label htmlFor="signin-remember" className={styles.remember}>
              <input
                id="signin-remember"
                type="checkbox"
                name="remember"
                defaultChecked
                className={styles.rememberBox}
              />
              <span>Remember this device · 30 days</span>
            </label>
          </div>

          <button type="submit" className={styles.submit}>
            Sign in
          </button>
        </form>

        <p className={styles.newHere}>
          New here?{' '}
          <Link href={SIGN_UP_ROUTE} className={styles.newHereLink}>
            Start your case
          </Link>
        </p>
      </div>
    </main>
  );
}
