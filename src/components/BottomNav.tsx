import React from 'react';
import { Screen } from '../App';

interface BottomNavProps {
  current: Screen;
  onNavigate: (screen: Screen) => void;
}

export default function BottomNav({ current, onNavigate }: BottomNavProps) {
  return (
    <nav>
      <button onClick={() => onNavigate('home')} disabled={current === 'home'}>
        Home
      </button>
      <button onClick={() => onNavigate('churches')} disabled={current === 'churches'}>
        Churches
      </button>
      <button onClick={() => onNavigate('ai-exam')} disabled={current === 'ai-exam'}>
        AI Exam
      </button>
      <button onClick={() => onNavigate('schedule')} disabled={current === 'schedule'}>
        Schedule
      </button>
      <button onClick={() => onNavigate('confession')} disabled={current === 'confession'}>
        Confession
      </button>
    </nav>
  );
}