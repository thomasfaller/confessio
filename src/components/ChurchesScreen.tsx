import React from 'react';
import { Screen } from '../App';

interface ChurchesScreenProps {
  onNavigate: (screen: Screen) => void;
}

export default function ChurchesScreen({ onNavigate }: ChurchesScreenProps) {
  return (
    <div>
      <h2>Churches Screen</h2>
      <button onClick={() => onNavigate('home')}>Back to Home</button>
    </div>
  );
}