import React from 'react';
import { Screen } from '../App';

interface HomeScreenProps {
  onNavigate: (screen: Screen) => void;
}

export default function HomeScreen({ onNavigate }: HomeScreenProps) {
  return (
    <div>
      <h2>Home Screen</h2>
      <button onClick={() => onNavigate('churches')}>Go to Churches</button>
    </div>
  );
}