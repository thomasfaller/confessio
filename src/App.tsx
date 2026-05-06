import React, { useState } from 'react';
import type { Screen } from './types';
import AppHeader from './components/AppHeader';
import BottomNav from './components/BottomNav';
import HomeScreen from './components/HomeScreen';
import ChurchesScreen from './components/ChurchesScreen';
import AIExaminationScreen from './components/AIExaminationScreen';
import ScheduleScreen from './components/ScheduleScreen';
import ConfessionScreen from './components/ConfessionScreen';
import styles from './App.module.css';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');

  const renderScreen = () => {
    switch (screen) {
      case 'home':
        return <HomeScreen onNavigate={setScreen} />;
      case 'churches':
        return <ChurchesScreen onNavigate={setScreen} />;
      case 'ai-exam':
        return <AIExaminationScreen onNavigate={setScreen} />;
      case 'schedule':
        return <ScheduleScreen onNavigate={setScreen} />;
      case 'confession':
        return <ConfessionScreen onNavigate={setScreen} />;
      default:
        return <HomeScreen onNavigate={setScreen} />;
    }
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      <main className={styles.main}>{renderScreen()}</main>
      <BottomNav current={screen} onNavigate={setScreen} />
    </div>
  );
}