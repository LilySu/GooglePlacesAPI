import { useState } from 'react';
import Header from './components/Header';
import LongevityScoreHero from './components/LongevityScoreHero';
import Navigation from './components/Navigation';
import DashboardView from './components/DashboardView';
import SuggestionsView from './components/SuggestionsView';
import MetricsView from './components/MetricsView';
import UploadView from './components/UploadView';
import { defaultSessionData } from './data/defaultSessionData';
import { calculateLongevityScore } from './utils/calculations';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [sessionData, setSessionData] = useState(defaultSessionData);
  const [currentSession, setCurrentSession] = useState('session12');
  const [plantGrowth, setPlantGrowth] = useState(75);
  const [currentDay, setCurrentDay] = useState('day1');

  const longevityScore = calculateLongevityScore(sessionData, currentSession);
  const session1Score = calculateLongevityScore(sessionData, 'session1');
  const session12Score = calculateLongevityScore(sessionData, 'session12');

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-orange-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Header />
        <LongevityScoreHero
          longevityScore={longevityScore}
          session1Score={session1Score}
          session12Score={session12Score}
          plantGrowth={plantGrowth}
        />
        <Navigation currentView={currentView} setCurrentView={setCurrentView} />

        {currentView === 'dashboard' && (
          <DashboardView
            sessionData={sessionData}
            currentSession={currentSession}
            setCurrentSession={setCurrentSession}
          />
        )}
        {currentView === 'suggestions' && (
          <SuggestionsView currentDay={currentDay} setCurrentDay={setCurrentDay} />
        )}
        {currentView === 'metrics' && (
          <MetricsView sessionData={sessionData} currentSession={currentSession} />
        )}
        {currentView === 'upload' && (
          <UploadView
            sessionData={sessionData}
            setSessionData={setSessionData}
            plantGrowth={plantGrowth}
            setPlantGrowth={setPlantGrowth}
          />
        )}
      </div>
    </div>
  );
}
