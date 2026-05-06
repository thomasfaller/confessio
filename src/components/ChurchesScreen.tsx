import React from 'react';
import type { Screen } from '../types';
import styles from './ChurchesScreen.module.css';

interface ChurchesScreenProps {
  onNavigate: (screen: Screen) => void;
}

interface ChurchTime {
  label: string;
  soon?: boolean;
}

interface Church {
  name: string;
  address: string;
  distance: string;
  times: ChurchTime[];
}

const CHURCHES: Church[] = [
  {
    name: "St. Mary's Parish, Navan",
    address: 'Church Hill, Navan, Co. Meath',
    distance: '1.2 km',
    times: [
      { label: 'Sat 11:00–12:00', soon: true },
      { label: 'Sat 17:30–18:00' },
      { label: 'By appointment' },
    ],
  },
  {
    name: "St. Colmcille's, Kells",
    address: 'Farrell St, Kells, Co. Meath',
    distance: '8.4 km',
    times: [
      { label: 'Sat 10:30–11:30' },
      { label: 'Fri after 10:00 Mass' },
    ],
  },
  {
    name: "St. Patrick's, Trim",
    address: 'Market St, Trim, Co. Meath',
    distance: '13.1 km',
    times: [
      { label: 'Sat 12:00–13:00' },
      { label: '1st Fri of month' },
    ],
  },
  {
    name: 'Pro-Cathedral, Dublin',
    address: 'Marlborough St, Dublin 1',
    distance: '46 km',
    times: [
      { label: 'Mon–Sat 10:00–18:30' },
    ],
  },
];

export default function ChurchesScreen({ onNavigate }: ChurchesScreenProps) {
  return (
    <div className={styles.container}>
      <h2 className={styles.sectionTitle}>Nearby Churches</h2>
      <p className={styles.sectionSub}>Confession times in County Meath &amp; surroundings</p>

      {CHURCHES.map(church => (
        <article key={church.name} className={styles.card}>
          <div className={styles.cardTop}>
            <h3 className={styles.name}>{church.name}</h3>
            <span className={styles.distance}>{church.distance}</span>
          </div>
          <p className={styles.address}>{church.address}</p>
          <div className={styles.times}>
            {church.times.map(t => (
              <span
                key={t.label}
                className={`${styles.badge}${t.soon ? ` ${styles.soon}` : ''}`}
              >
                {t.label}
              </span>
            ))}
          </div>
        </article>
      ))}

      <div className={styles.footer}>
        <button
          type="button"
          className={styles.scheduleBtn}
          onClick={() => onNavigate('schedule')}
        >
          Schedule a confession →
        </button>
      </div>
    </div>
  );
}
