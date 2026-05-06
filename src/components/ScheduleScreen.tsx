import React from 'react';
import { Screen } from '../App';

interface ScheduleScreenProps {
  onNavigate: (screen: Screen) => void;
}

export default function ScheduleScreen({ onNavigate }: ScheduleScreenProps) {
  return (
    <div>
      <h2>Schedule Screen</h2>
      <button onClick={() => onNavigate('home')}>Back to Home</button>
    </div>
  );
}