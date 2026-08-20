import { useState, useEffect } from 'react';
import type { ViewId } from '@/types';
import { DataProvider, useData } from '@/context/DataContext';
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
import { WitnessPortal } from '@/views/WitnessPortal';

function AppContent() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [view, setView] = useState<ViewId>('dashboard');
  const [witnessPortalParams, setWitnessPortalParams] = useState<{ witnessId?: string; caseId?: string } | null>(null);

  // Check URL search parameters for QR Code links (e.g. ?view=witness-portal&witnessId=wit-123&caseId=case-1)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');
    const witnessId = params.get('witnessId');
    const caseId = params.get('caseId');

    if (viewParam === 'witness-portal' || witnessId) {
      setView('witness-portal');
      setWitnessPortalParams({ witnessId: witnessId || undefined, caseId: caseId || undefined });
    }
  }, []);

  // If user opened a Witness Portal QR link directly, display the witness portal without requiring officer login
  if (view === 'witness-portal') {
    return (
      <WitnessPortal
        witnessId={witnessPortalParams?.witnessId}
        caseId={witnessPortalParams?.caseId}
        onExitPortal={() => setView('dashboard')}
      />
    );
  }

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

export default function App() {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
}
