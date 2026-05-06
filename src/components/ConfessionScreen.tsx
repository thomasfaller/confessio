import React, { useState } from 'react';
import type { Screen } from '../types';
import styles from './ConfessionScreen.module.css';

interface ConfessionScreenProps {
  onNavigate: (screen: Screen) => void;
}

interface Step {
  label: string;
  prayerTitle: string;
  body: React.ReactNode;
}

const STEPS: Step[] = [
  {
    label: 'Step 1 — Preparing your heart',
    prayerTitle: 'Act of Contrition',
    body: (
      <>
        O my God, I am heartily sorry for having offended Thee, and I detest all my sins because of Thy
        just punishments, but most of all because they offend Thee, my God, who art all good and
        deserving of all my love.{'\n\n'}I firmly resolve, with the help of Thy grace, to sin no more
        and to avoid the near occasions of sin.
      </>
    ),
  },
  {
    label: 'Step 2 — Entering the confessional',
    prayerTitle: 'Opening words',
    body: (
      <>
        After making the Sign of the Cross, say to the priest:{'\n\n'}
        “Bless me, Father, for I have sinned. It has been [time] since my last confession. These are
        my sins…”{'\n\n'}Then confess your sins simply and honestly, without excessive detail. Speak
        with sincerity and trust in God’s mercy.
      </>
    ),
  },
  {
    label: 'Step 3 — Confessing your sins',
    prayerTitle: 'Your sins',
    body: (
      <>
        Recall the areas you reflected upon in your examination. Speak clearly and without excessive
        detail.{'\n\n'}After confessing, listen carefully to the priest’s counsel and note your
        penance.
      </>
    ),
  },
  {
    label: 'Step 4 — Receiving absolution',
    prayerTitle: 'The absolution',
    body: (
      <>
        The priest will say the words of absolution. Bow your head and receive God’s forgiveness with
        faith:{'\n\n'}“God the Father of mercies, through the death and resurrection of his Son, has
        reconciled the world to himself… I absolve you from your sins in the name of the Father, and
        of the Son, and of the Holy Spirit.”
      </>
    ),
  },
];

const TOTAL_DOTS = STEPS.length + 1; // +1 for the final absolution screen

export default function ConfessionScreen({ onNavigate }: ConfessionScreenProps) {
  const [step, setStep] = useState(0);

  const isFinal = step === STEPS.length;

  return (
    <div className={styles.container}>
      <div className={styles.dots} aria-hidden="true">
        {Array.from({ length: TOTAL_DOTS }, (_, i) => (
          <span
            key={i}
            className={`${styles.dot}${i === step ? ` ${styles.dotActive}` : ''}`}
          />
        ))}
      </div>

      {isFinal ? (
        <div className={styles.absolution} role="region" aria-label="Final blessing">
          <div className={styles.cross} aria-hidden="true">✝</div>
          <h2 className={styles.absTitle}>Go in Peace</h2>
          <p className={styles.absText}>
            Your sins are forgiven.<br />
            Complete your penance, give thanks to God,<br />
            and walk forward in his grace.
          </p>
          <button
            type="button"
            className={`${styles.btn} ${styles.primary}`}
            onClick={() => {
              setStep(0);
              onNavigate('home');
            }}
          >
            Return Home
          </button>
        </div>
      ) : (
        <div className={styles.stepBody}>
          <div className={styles.stepLabel}>{STEPS[step]!.label}</div>
          <div className={styles.prayerBox}>
            <div className={styles.prayerTitle}>{STEPS[step]!.prayerTitle}</div>
            <div className={styles.prayerText}>{STEPS[step]!.body}</div>
          </div>
          <div className={styles.nav}>
            {step > 0 ? (
              <button
                type="button"
                className={styles.btn}
                onClick={() => setStep(s => s - 1)}
              >
                ← Back
              </button>
            ) : (
              <span />
            )}
            <button
              type="button"
              className={`${styles.btn} ${styles.primary}`}
              onClick={() => setStep(s => s + 1)}
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
