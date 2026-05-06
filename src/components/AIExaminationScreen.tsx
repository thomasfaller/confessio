import React from 'react';
import { Screen } from '../App';

interface AIExaminationScreenProps {
  onNavigate: (screen: Screen) => void;
}

export default function AIExaminationScreen({ onNavigate }: AIExaminationScreenProps) {
  return (
    <div>
      <h2>AI Examination Screen</h2>
      <button onClick={() => onNavigate('home')}>Back to Home</button>
    </div>
  );
}