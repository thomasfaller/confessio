import React from 'react';
import type { Screen } from '../types';

interface ConfessionScreenProps {
  onNavigate: (screen: Screen) => void;
}

export default function ConfessionScreen({ onNavigate }: ConfessionScreenProps) {
  return (
    <div>
      <h2>Confession Screen</h2>
      <button onClick={() => onNavigate('home')}>Back to Home</button>
    </div>
  );
}