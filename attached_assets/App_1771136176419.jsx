import { useState } from 'react';
import Header from './components/Header';
import LongevityScoreHero from './components/LongevityScoreHero';
import Navigation from './components/Navigation';
import DashboardView from './components/DashboardView';
import SuggestionsView from './components/SuggestionsView';
import MetricsView from './components/MetricsView';
import UploadView from './components/UploadView';
import MessagingPortal from './components/MessagingPortal';
import { defaultSessionData } from './data/defaultSessionData';
import { matchedUser } from './data/communityData';
import { FIRST_SESSION, LAST_SESSION } from './data/sessions';
import { calculateLongevityScore } from './utils/calculations';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [sessionData, setSessionData] = useState(defaultSessionData);
  const [currentSession, setCurrentSession] = useState(LAST_SESSION);
  const [plantGrowth, setPlantGrowth] = useState(75);
  const [currentDay, setCurrentDay] = useState('day1');
  const [showChat, setShowChat] = useState(false);

  const longevityScore = calculateLongevityScore(sessionData, currentSession);
  const firstScore = calculateLongevityScore(sessionData, FIRST_SESSION);
  const lastScore = calculateLongevityScore(sessionData, LAST_SESSION);

  const handleOpenChat = () => {
    setShowChat(true);
  };

  const handleBackFromChat = () => {
    setShowChat(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-orange-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Header />
        <LongevityScoreHero
          longevityScore={longevityScore}
          firstScore={firstScore}
          lastScore={lastScore}
          plantGrowth={plantGrowth}
        />

        {!showChat && (
          <>
            <Navigation currentView={currentView} setCurrentView={setCurrentView} />

            {currentView === 'dashboard' && (
              <DashboardView
                sessionData={sessionData}
                currentSession={currentSession}
                setCurrentSession={setCurrentSession}
                onOpenChat={handleOpenChat}
              />
            )}
            {currentView === 'suggestions' && (
              <SuggestionsView currentDay={currentDay} setCurrentDay={setCurrentDay} sessionData={sessionData} />
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
          </>
        )}

        {showChat && (
          <MessagingPortal
            matchedUser={matchedUser}
            sessionData={sessionData}
            onBack={handleBackFromChat}
          />
        )}
      </div>
    </div>
  );
}
