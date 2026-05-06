import React, { useMemo, useState } from 'react';
import type { Screen } from '../types';
import styles from './ScheduleScreen.module.css';

interface ScheduleScreenProps {
  onNavigate: (screen: Screen) => void;
}

interface ScheduleChurch {
  id: string;
  name: string;
  addressLine: string;
  slots: string[];
}

const CHURCHES: ScheduleChurch[] = [
  {
    id: 'navan',
    name: "St. Mary's Parish, Navan",
    addressLine: 'Church Hill, Navan — 1.2 km',
    slots: ['Sat 11:00–12:00', 'Sat 17:30–18:00'],
  },
  {
    id: 'kells',
    name: "St. Colmcille's, Kells",
    addressLine: 'Farrell St, Kells — 8.4 km',
    slots: ['Sat 10:30–11:30', 'Fri after 10:00 Mass'],
  },
  {
    id: 'trim',
    name: "St. Patrick's, Trim",
    addressLine: 'Market St, Trim — 13.1 km',
    slots: ['Sat 12:00–13:00'],
  },
];

const REMINDERS = ['None', '1 day before', '2 days before', '1 week before'] as const;
type Reminder = typeof REMINDERS[number];

export default function ScheduleScreen({ onNavigate }: ScheduleScreenProps) {
  const today = useMemo(() => new Date().toISOString().split('T')[0]!, []);

  const [churchId, setChurchId]   = useState<string | null>(null);
  const [slot, setSlot]           = useState<string | null>(null);
  const [date, setDate]           = useState('');
  const [reminder, setReminder]   = useState<Reminder>('1 day before');
  const [intention, setIntention] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const selectedChurch = CHURCHES.find(c => c.id === churchId) ?? null;

  function handleSelectChurch(id: string) {
    setChurchId(id);
    setSlot(null);
    setFormError(null);
  }

  function handleConfirm() {
    if (!selectedChurch) { setFormError('Please choose a church.'); return; }
    if (!slot)           { setFormError('Please choose a confession time.'); return; }
    if (!date)           { setFormError('Please choose a date.'); return; }
    setFormError(null);
    setConfirmed(true);
  }

  function handleReset() {
    setChurchId(null);
    setSlot(null);
    setDate('');
    setReminder('1 day before');
    setIntention('');
    setConfirmed(false);
    setFormError(null);
  }

  if (confirmed && selectedChurch && slot && date) {
    const formattedDate = new Date(date).toLocaleDateString('en-IE', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });

    return (
      <div className={styles.container}>
        <div className={styles.confirmBox}>
          <div className={styles.confirmCross} aria-hidden="true">✝</div>
          <h2 className={styles.confirmTitle}>Confession Scheduled</h2>
          <p className={styles.confirmText}>
            {selectedChurch.name}<br />
            {formattedDate} · {slot}
            {reminder !== 'None' && (<><br />Reminder: {reminder}</>)}
            {intention.trim() && (<><br /><br />Intention: {intention.trim()}</>)}
          </p>
        </div>
        <div className={styles.confirmActions}>
          <button
            type="button"
            className={`${styles.btn} ${styles.primary}`}
            onClick={() => onNavigate('ai-exam')}
          >
            Prepare my examination →
          </button>
          <button type="button" className={styles.btn} onClick={handleReset}>
            Schedule another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.sectionTitle}>Schedule your Confession</h2>
      <p className={styles.sectionSub}>Choose a church, time, and set a reminder</p>

      <div className={styles.stepLabel}>1. Choose a church</div>
      {CHURCHES.map(church => {
        const isSelected = churchId === church.id;
        return (
          <div
            key={church.id}
            role="button"
            tabIndex={0}
            aria-pressed={isSelected}
            className={`${styles.churchCard}${isSelected ? ` ${styles.selected}` : ''}`}
            onClick={() => handleSelectChurch(church.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSelectChurch(church.id);
              }
            }}
          >
            <div className={styles.churchName}>{church.name}</div>
            <div className={styles.churchAddr}>{church.addressLine}</div>
            {isSelected && (
              <div className={styles.slots}>
                {church.slots.map(s => (
                  <button
                    key={s}
                    type="button"
                    className={`${styles.slot}${slot === s ? ` ${styles.slotSelected}` : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSlot(s);
                      setFormError(null);
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}

      <div style={{ height: 14 }} />
      <label className={styles.stepLabel} htmlFor="sched-date">2. Choose a date</label>
      <input
        id="sched-date"
        type="date"
        className={styles.dateInput}
        min={today}
        value={date}
        onChange={(e) => { setDate(e.target.value); setFormError(null); }}
      />

      <div className={styles.stepLabel}>3. Set a reminder</div>
      <div className={styles.reminders}>
        {REMINDERS.map(r => (
          <button
            key={r}
            type="button"
            className={`${styles.reminderBtn}${reminder === r ? ` ${styles.reminderSelected}` : ''}`}
            onClick={() => setReminder(r)}
          >
            {r}
          </button>
        ))}
      </div>

      <label className={styles.stepLabel} htmlFor="sched-intention">4. Intention (optional)</label>
      <textarea
        id="sched-intention"
        className={styles.textarea}
        placeholder='E.g. "For healing in my family" or "To renew my commitment to prayer"…'
        value={intention}
        onChange={(e) => setIntention(e.target.value)}
      />

      {formError && (
        <p style={{
          color: '#7F1D1D', background: '#FEF2F2', border: '0.5px solid #FECACA',
          borderRadius: 8, padding: 10, fontSize: 12, marginBottom: 12,
        }}>
          {formError}
        </p>
      )}

      <button type="button" className={styles.confirmBtn} onClick={handleConfirm}>
        ✦ Confirm my confession
      </button>
    </div>
  );
}
