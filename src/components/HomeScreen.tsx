import React from 'react';
import type { Screen } from '../types';
import styles from './HomeScreen.module.css';

interface HomeScreenProps {
  onNavigate: (screen: Screen) => void;
}

interface ActionCard {
  screen: Screen;
  icon: string;
  title: string;
  desc: string;
  featured?: boolean;
}

const CARDS: ActionCard[] = [
  { screen: 'churches',   icon: '⛪', title: 'Find a Church',   desc: 'Confession times near you',           featured: true  },
  { screen: 'schedule',   icon: '📅', title: 'Schedule',         desc: 'Plan your confession',                 featured: true  },
  { screen: 'ai-exam',    icon: '✨', title: 'AI Examination',   desc: 'Personalised conscience guide',        featured: true  },
  { screen: 'confession', icon: '🕊', title: 'Guide Me',         desc: 'Step-by-step through the sacrament' },
];

export default function HomeScreen({ onNavigate }: HomeScreenProps) {
  return (
    <div className={styles.container}>
      <blockquote className={styles.quote}>
        “Whose sins you forgive, they are forgiven.”
        <br />
        <span className={styles.reference}>— John 20:23</span>
      </blockquote>
      <div className={styles.grid}>
        {CARDS.map(card => (
          <button
            key={card.screen}
            type="button"
            onClick={() => onNavigate(card.screen)}
            className={`${styles.card}${card.featured ? ` ${styles.featured}` : ''}`}
          >
            <div className={styles.cardIcon} aria-hidden="true">{card.icon}</div>
            <h3 className={styles.cardTitle}>{card.title}</h3>
            <p className={styles.cardDesc}>{card.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
