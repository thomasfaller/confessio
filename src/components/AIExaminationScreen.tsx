import React, { useState } from 'react';
import type { Screen } from '../types';
import { useAnthropicAPI } from '../hooks/useAnthropicAPI';
import styles from './AIExaminationScreen.module.css';

interface AIExaminationScreenProps {
  onNavigate: (screen: Screen) => void;
}

interface Category {
  title: string;
  questions: string[];
}

interface ExaminationResponse {
  categories: Category[];
}

const STATE_OPTIONS = [
  { value: 'lay',       label: 'Lay faithful',           prompt: 'a lay Catholic' },
  { value: 'married',   label: 'Married',                 prompt: 'a married Catholic' },
  { value: 'parent',    label: 'Parent',                  prompt: 'a Catholic parent' },
  { value: 'single',    label: 'Single adult',            prompt: 'a single adult Catholic' },
  { value: 'religious', label: 'Religious / Priest',      prompt: 'a religious or priest' },
  { value: 'young',     label: 'Young person',            prompt: 'a young Catholic person' },
] as const;

const TIME_OPTIONS = [
  { value: 'recent', label: 'A few weeks',         prompt: 'a few weeks' },
  { value: 'months', label: 'Several months',      prompt: 'several months' },
  { value: 'year',   label: 'About a year',        prompt: 'about a year' },
  { value: 'long',   label: 'Several years',       prompt: 'several years' },
  { value: 'first',  label: 'First confession',    prompt: 'never (first confession)' },
] as const;

const FOCUS_OPTIONS = [
  { value: 'general', label: 'General examination',     prompt: 'general examination of conscience' },
  { value: 'charity', label: 'Charity & relationships', prompt: 'charity and relationships with others' },
  { value: 'prayer',  label: 'Prayer & faith',          prompt: 'prayer and faith life' },
  { value: 'work',    label: 'Work & justice',          prompt: 'work, justice, and honesty' },
  { value: 'family',  label: 'Family duties',           prompt: 'family duties and responsibilities' },
  { value: 'purity',  label: 'Chastity & purity',       prompt: 'chastity and purity' },
] as const;

const DEPTH_OPTIONS = [
  { value: 'brief',    label: 'Brief (8–10 questions)',  count: '8 to 10' },
  { value: 'thorough', label: 'Thorough (15–20)',         count: '15 to 20' },
] as const;

type StateValue = typeof STATE_OPTIONS[number]['value'];
type TimeValue  = typeof TIME_OPTIONS[number]['value'];
type FocusValue = typeof FOCUS_OPTIONS[number]['value'];
type DepthValue = typeof DEPTH_OPTIONS[number]['value'];

function buildPrompt(state: StateValue, time: TimeValue, focus: FocusValue, depth: DepthValue): string {
  const stateLabel = STATE_OPTIONS.find(o => o.value === state)!.prompt;
  const timeLabel  = TIME_OPTIONS.find(o => o.value === time)!.prompt;
  const focusLabel = FOCUS_OPTIONS.find(o => o.value === focus)!.prompt;
  const count      = DEPTH_OPTIONS.find(o => o.value === depth)!.count;

  return `You are a devout, theologically accurate Catholic spiritual director helping a penitent prepare for the Sacrament of Reconciliation.

Generate a personalised examination of conscience for ${stateLabel}, whose last confession was ${timeLabel} ago, focusing on ${focusLabel}.

Generate exactly ${count} examination questions. Group them into 3–4 meaningful categories relevant to this person's state of life.

Return ONLY valid JSON, no markdown, no explanation:
{
  "categories": [
    {
      "title": "Category Name",
      "questions": ["Question 1?", "Question 2?"]
    }
  ]
}

Questions should be:
- Gentle, compassionate, and spiritually rich
- Concrete and personally applicable to this person's life situation
- Rooted in Scripture and Catholic moral tradition
- Phrased as reflective invitations, not accusations`;
}

export default function AIExaminationScreen({ onNavigate }: AIExaminationScreenProps) {
  const { callClaude, loading, error } = useAnthropicAPI();

  const [state,    setState]    = useState<StateValue>('lay');
  const [time,     setTime]     = useState<TimeValue>('recent');
  const [focus,    setFocus]    = useState<FocusValue>('general');
  const [depth,    setDepth]    = useState<DepthValue>('brief');
  const [result,   setResult]   = useState<ExaminationResponse | null>(null);
  const [checked,  setChecked]  = useState<Set<string>>(new Set());

  async function handleGenerate() {
    setResult(null);
    setChecked(new Set());
    const prompt = buildPrompt(state, time, focus, depth);
    const response = await callClaude(prompt);
    if (response && Array.isArray(response.categories)) {
      setResult(response as ExaminationResponse);
    }
  }

  function toggle(key: string) {
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function reset() {
    setResult(null);
    setChecked(new Set());
  }

  const showForm = !loading && !result;

  return (
    <div className={styles.container}>
      <h2 className={styles.sectionTitle}>AI-Guided Examination</h2>
      <p className={styles.sectionSub}>Receive questions personalised to your state of life</p>

      {showForm && (
        <>
          <div className={styles.profileGrid}>
            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="ai-state">State of life</label>
              <select
                id="ai-state"
                className={styles.select}
                value={state}
                onChange={(e) => setState(e.target.value as StateValue)}
              >
                {STATE_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="ai-time">Time since last confession</label>
              <select
                id="ai-time"
                className={styles.select}
                value={time}
                onChange={(e) => setTime(e.target.value as TimeValue)}
              >
                {TIME_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="ai-focus">Area of focus</label>
              <select
                id="ai-focus"
                className={styles.select}
                value={focus}
                onChange={(e) => setFocus(e.target.value as FocusValue)}
              >
                {FOCUS_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="ai-depth">Depth</label>
              <select
                id="ai-depth"
                className={styles.select}
                value={depth}
                onChange={(e) => setDepth(e.target.value as DepthValue)}
              >
                {DEPTH_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="button" className={styles.generateBtn} onClick={handleGenerate}>
            ✦ Generate my examination
          </button>
        </>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: 24, color: 'var(--ink-soft)', fontStyle: 'italic', fontSize: 13 }}>
          <div style={{ fontSize: 22, color: 'var(--gold)', marginBottom: 8 }}>✝</div>
          Preparing your examination of conscience…
        </div>
      )}

      {!loading && result && (
        <>
          {result.categories.map(cat => (
            <div key={cat.title}>
              <div className={styles.catTitle}>{cat.title}</div>
              {cat.questions.map((q, i) => {
                const key = `${cat.title}::${i}`;
                const isChecked = checked.has(key);
                return (
                  <div
                    key={key}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isChecked}
                    className={`${styles.item}${isChecked ? ` ${styles.checked}` : ''}`}
                    onClick={() => toggle(key)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggle(key);
                      }
                    }}
                  >
                    <span className={styles.check} aria-hidden="true">{isChecked ? '✓' : ''}</span>
                    <p className={styles.question}>{q}</p>
                  </div>
                );
              })}
            </div>
          ))}

          <div className={styles.actions}>
            <button
              type="button"
              className={`${styles.btn} ${styles.primary}`}
              onClick={() => onNavigate('confession')}
            >
              Begin the Sacrament →
            </button>
            <button type="button" className={styles.btn} onClick={reset}>
              Generate a new examination
            </button>
          </div>
        </>
      )}
    </div>
  );
}
