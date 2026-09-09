'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { APP_NAME } from '@/constants';
import { tokens } from '@/styles/tokens';
import styles from './sign-up.module.css';

const MIN_PASSWORD_LENGTH = 12;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const STEPS = ['Account', 'About you', 'Pay'] as const;

type FieldName = 'name' | 'email' | 'password' | 'terms';

interface Problem {
  field: FieldName;
  message: string;
}

function findProblem(form: FormData): Problem | null {
  const name = String(form.get('name') ?? '').trim();
  const email = String(form.get('email') ?? '').trim();
  const password = String(form.get('password') ?? '');
  const terms = form.get('terms') === 'on';

  if (!name) return { field: 'name', message: 'Please enter your full name.' };
  if (!email) return { field: 'email', message: 'Please enter your email address.' };
  if (!EMAIL_PATTERN.test(email)) return { field: 'email', message: "That email address doesn't look right." };
  if (password.length < MIN_PASSWORD_LENGTH) {
    return { field: 'password', message: `Your password needs at least ${MIN_PASSWORD_LENGTH} characters.` };
  }
  if (!terms) return { field: 'terms', message: 'Please agree to the Terms and Privacy Policy to continue.' };
  return null;
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

export default function SignUpPage() {
  const router = useRouter();
  const [problem, setProblem] = useState<Problem | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = findProblem(new FormData(event.currentTarget));
    setProblem(next);
    if (!next) router.push('/dev/proto/welcome-tour');
  }

  const invalid = (field: FieldName) => (problem?.field === field ? true : undefined);

  return (
    <main className={styles.page}>
      <header className={styles.topBar}>
        <div className={styles.topBarSide}>
          <Link href="/dev/proto/pre-signup-interview" className={styles.backArrow} aria-label="Back">
            ←
          </Link>
        </div>
        <div className={styles.topBarSide}>
          <span className={styles.haveAccount}>Have an account?</span>
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
              />
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
              />
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
                aria-describedby="signup-password-hint"
                aria-invalid={invalid('password')}
              />
              <div id="signup-password-hint" className={styles.hint}>
                Min {MIN_PASSWORD_LENGTH} characters
              </div>
            </div>
          </div>

          <label className={styles.terms}>
            <input
              type="checkbox"
              name="terms"
              className={styles.termsBox}
              aria-invalid={invalid('terms')}
            />
            <span>
              I agree to {APP_NAME}&apos;s <span className={styles.termsLink}>Terms</span> and{' '}
              <span className={styles.termsLink}>Privacy Policy</span>.
            </span>
          </label>

          {problem && (
            <p role="alert" className={styles.alert}>
              {problem.message}
            </p>
          )}

          <button type="submit" className={styles.submit}>
            Create account →
          </button>
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
