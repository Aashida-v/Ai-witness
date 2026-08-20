import { useState } from 'react';
import type { ViewId } from '@/types';
import { Layout } from '@/components/Layout';
import { Login } from '@/views/Login';
import { Dashboard } from '@/views/Dashboard';
import { Cases } from '@/views/Cases';
import { WitnessStatements } from '@/views/WitnessStatements';
import { FollowUpQuestions } from '@/views/FollowUpQuestions';
import { Timeline } from '@/views/Timeline';
import { Comparison } from '@/views/Comparison';
import { Contradictions } from '@/views/Contradictions';
import { Insights } from '@/views/Insights';
import { Confidence } from '@/views/Confidence';
import { Reports } from '@/views/Reports';
import { FutureScope } from '@/views/FutureScope';
import { WitnessStatementCollection } from '@/views/WitnessStatementCollection';
import { AIFollowUpAnalysis } from '@/views/AIFollowUpAnalysis';
import { WitnessSummary } from '@/views/WitnessSummary';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [view, setView] = useState<ViewId>('dashboard');

  if (!loggedIn) {
    return <Login onLogin={() => setLoggedIn(true)} />;
  }

  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard onNavigate={setView} />;
      case 'cases':
        return <Cases onNavigate={setView} />;
      case 'statements':
        return <WitnessStatements />;
      case 'followup':
        return <FollowUpQuestions />;
      case 'timeline':
        return <Timeline />;
      case 'comparison':
        return <Comparison />;
      case 'contradictions':
        return <Contradictions />;
      case 'insights':
        return <Insights />;
      case 'confidence':
        return <Confidence />;
      case 'reports':
        return <Reports />;
      case 'future':
        return <FutureScope />;
      case 'statement-collection':
        return <WitnessStatementCollection onNavigate={setView} />;
      case 'ai-followup-analysis':
        return <AIFollowUpAnalysis onNavigate={setView} />;
      case 'witness-summary':
        return <WitnessSummary onNavigate={setView} />;
      default:
        return <Dashboard onNavigate={setView} />;
    }
  };

  return (
    <Layout currentView={view} onNavigate={setView}>
      {renderView()}
    </Layout>
  );
}

export default App;
