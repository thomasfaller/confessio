import React from 'react';
import type { Screen } from '../types';
import styles from './BottomNav.module.css';

interface BottomNavProps {
  current: Screen;
  onNavigate: (screen: Screen) => void;
}

const ITEMS: { screen: Screen; label: string; icon: React.ReactNode }[] = [
  {
    screen: 'home',
    label: 'Home',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
        <path d="M9 21V12h6v9" />
      </svg>
    ),
  },
  {
    screen: 'churches',
    label: 'Churches',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <circle cx={12} cy={10} r={3} />
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
      </svg>
    ),
  },
  {
    screen: 'ai-exam',
    label: 'Examine',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
      </svg>
    ),
  },
  {
    screen: 'schedule',
    label: 'Schedule',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <rect x={3} y={4} width={18} height={18} rx={2} />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
  },
  {
    screen: 'confession',
    label: 'Confess',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
];

export default function BottomNav({ current, onNavigate }: BottomNavProps) {
  return (
    <nav className={styles.nav} aria-label="Primary">
      {ITEMS.map(({ screen, label, icon }) => {
        const isActive = current === screen;
        return (
          <button
            key={screen}
            type="button"
            onClick={() => onNavigate(screen)}
            className={`${styles.btn}${isActive ? ` ${styles.active}` : ''}`}
            aria-current={isActive ? 'page' : undefined}
          >
            <span className={styles.icon} aria-hidden="true">{icon}</span>
            <span className={styles.label}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
