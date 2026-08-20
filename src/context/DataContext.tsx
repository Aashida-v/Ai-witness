import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  InvestigationCase,
  Witness,
  WitnessStatement,
  FollowUpQuestion,
  Contradiction,
  Insight,
  CollectedStatement,
  ExtractedEntity,
  GeneratedQuestion,
} from '@/types';
import { sampleCase, witnesses as initialWitnesses, statements as initialStatements, followUpQuestions as initialQuestions, contradictions as initialContradictions, insights as initialInsights } from '@/data/mockData';
import { collectedStatements as initialCollected } from '@/data/member1Data';

const STORAGE_KEY = 'ai_witness_app_data_v2';

interface DataContextType {
  cases: InvestigationCase[];
  witnesses: Witness[];
  statements: WitnessStatement[];
  followUpQuestions: FollowUpQuestion[];
  contradictions: Contradiction[];
  insights: Insight[];
  collectedStatements: CollectedStatement[];
  
  // Actions
  addCase: (caseData: Omit<InvestigationCase, 'id' | 'caseNumber' | 'createdAt' | 'witnesses' | 'tags'> & { caseNumber?: string; tags?: string[] }) => InvestigationCase;
  addWitness: (witnessData: { caseId: string; name: string; age: number; occupation: string; relationship: string; contactInfo: string; interviewLocation: string }) => Witness;
  submitWitnessStatement: (data: { caseId: string; witnessId: string; witnessName: string; statementText: string; inputMethod?: 'text' | 'voice' }) => { statement: WitnessStatement; collected: CollectedStatement };
  updateWitnessStatement: (statementId: string, updatedText: string) => void;
  answerFollowUpQuestion: (questionId: string, answerText: string) => void;
  getWitnessById: (witnessId: string) => Witness | undefined;
  getCaseById: (caseId: string) => InvestigationCase | undefined;
  getStatementsForCase: (caseId: string) => WitnessStatement[];
  getWitnessesForCase: (caseId: string) => Witness[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [cases, setCases] = useState<InvestigationCase[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_cases`);
    return saved ? JSON.parse(saved) : [sampleCase];
  });

  const [witnesses, setWitnesses] = useState<Witness[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_witnesses`);
    return saved ? JSON.parse(saved) : initialWitnesses;
  });

  const [statements, setStatements] = useState<WitnessStatement[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_statements`);
    return saved ? JSON.parse(saved) : initialStatements;
  });

  const [followUpQuestions, setFollowUpQuestions] = useState<FollowUpQuestion[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_questions`);
    return saved ? JSON.parse(saved) : initialQuestions;
  });

  const [contradictions, setContradictions] = useState<Contradiction[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_contradictions`);
    return saved ? JSON.parse(saved) : initialContradictions;
  });

  const [insights, setInsights] = useState<Insight[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_insights`);
    return saved ? JSON.parse(saved) : initialInsights;
  });

  const [collectedStatements, setCollectedStatements] = useState<CollectedStatement[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_collected`);
    return saved ? JSON.parse(saved) : initialCollected;
  });

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_cases`, JSON.stringify(cases));
  }, [cases]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_witnesses`, JSON.stringify(witnesses));
  }, [witnesses]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_statements`, JSON.stringify(statements));
  }, [statements]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_questions`, JSON.stringify(followUpQuestions));
  }, [followUpQuestions]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_contradictions`, JSON.stringify(contradictions));
  }, [contradictions]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_insights`, JSON.stringify(insights));
  }, [insights]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_collected`, JSON.stringify(collectedStatements));
  }, [collectedStatements]);

  // Actions
  const addCase = (caseData: Omit<InvestigationCase, 'id' | 'caseNumber' | 'createdAt' | 'witnesses' | 'tags'> & { caseNumber?: string; tags?: string[] }) => {
    const newId = `case-${Date.now()}`;
    const newCase: InvestigationCase = {
      ...caseData,
      id: newId,
      caseNumber: caseData.caseNumber || `CASE-2024-${String(900 + cases.length + 1).padStart(4, '0')}`,
      status: caseData.status || 'open',
      priority: caseData.priority || 'medium',
      createdAt: new Date().toISOString(),
      witnesses: [],
      tags: caseData.tags || ['Active Investigation'],
    };
    setCases((prev) => [newCase, ...prev]);
    return newCase;
  };

  const addWitness = (witnessData: {
    caseId: string;
    name: string;
    age: number;
    occupation: string;
    relationship: string;
    contactInfo: string;
    interviewLocation: string;
  }) => {
    const witnessId = `wit-${Date.now()}`;
    const qrToken = `qr-${witnessId}-${Math.random().toString(36).substr(2, 6)}`;
    const newWitness: Witness = {
      ...witnessData,
      id: witnessId,
      interviewDate: new Date().toISOString(),
      qrToken,
      status: 'pending',
    };

    setWitnesses((prev) => [...prev, newWitness]);
    setCases((prev) =>
      prev.map((c) => (c.id === witnessData.caseId ? { ...c, witnesses: [...c.witnesses, witnessId] } : c))
    );

    return newWitness;
  };

  const extractEntitiesFromText = (text: string): ExtractedEntity[] => {
    const entities: ExtractedEntity[] = [];
    const lower = text.toLowerCase();

    // Time detection
    const timeMatch = text.match(/\b(\d{1,2}(:\d{2})?\s*(am|pm|AM|PM)?|\bnight\b|\bevening\b|\bmorning\b|\bafternoon\b)/g);
    if (timeMatch) {
      entities.push({ category: 'time', value: timeMatch[0], confidence: 0.92 });
    }

    // Location
    if (lower.includes('store') || lower.includes('street') || lower.includes('avenue') || lower.includes('park') || lower.includes('building')) {
      const loc = text.match(/(store|street|avenue|park|building|shop|pharmacy|bus stop|corner)/i);
      entities.push({ category: 'location', value: loc ? loc[0] : 'Scene area', confidence: 0.88 });
    }

    // Suspect / People
    if (lower.includes('man') || lower.includes('men') || lower.includes('person') || lower.includes('tall') || lower.includes('short') || lower.includes('hoodie')) {
      entities.push({ category: 'people', value: 'Suspect description mentioned', confidence: 0.85 });
    }

    // Vehicles
    if (lower.includes('car') || lower.includes('sedan') || lower.includes('suv') || lower.includes('vehicle') || lower.includes('truck')) {
      const veh = text.match(/(dark car|sedan|suv|honda|truck|vehicle|black car|red car|blue car)/i);
      entities.push({ category: 'vehicles', value: veh ? veh[0] : 'Vehicle fleeing scene', confidence: 0.9 });
    }

    return entities.length > 0
      ? entities
      : [
          { category: 'observations', value: 'General statement recorded', confidence: 0.8 },
          { category: 'time', value: 'Time of observation', confidence: 0.75 },
        ];
  };

  const generateAIQuestions = (text: string): GeneratedQuestion[] => {
    const questions: GeneratedQuestion[] = [];
    const lower = text.toLowerCase();

    if (!lower.includes('color') && (lower.includes('car') || lower.includes('vehicle'))) {
      questions.push({
        id: `q-${Date.now()}-1`,
        question: 'What specific color or make was the getaway vehicle?',
        rationale: 'Clarifying vehicle parameters helps cross-reference CCTV footage.',
        category: 'Vehicle Details',
        status: 'pending',
      });
    }

    if (lower.includes('hoodie') || lower.includes('man') || lower.includes('person')) {
      questions.push({
        id: `q-${Date.now()}-2`,
        question: 'Did you notice any facial features, height estimates, or distinguishing marks (tattoos, shoes)?',
        rationale: 'Enhancing suspect profile specificity for identification.',
        category: 'Suspect Features',
        status: 'pending',
      });
    }

    questions.push({
      id: `q-${Date.now()}-3`,
      question: 'Which direction did the suspect(s) flee after leaving the immediate scene?',
      rationale: 'Establishing flee corridor to examine intersection surveillance.',
      category: 'Escape Route',
      status: 'pending',
    });

    return questions;
  };

  const submitWitnessStatement = ({
    caseId,
    witnessId,
    witnessName,
    statementText,
    inputMethod = 'text',
  }: {
    caseId: string;
    witnessId: string;
    witnessName: string;
    statementText: string;
    inputMethod?: 'text' | 'voice';
  }) => {
    const statementId = `stmt-${Date.now()}`;
    const entities = extractEntitiesFromText(statementText);
    const aiQuestions = generateAIQuestions(statementText);

    const targetCase = cases.find((c) => c.id === caseId);
    const caseTitle = targetCase ? targetCase.title : 'Active Case';

    // New WitnessStatement
    const newStatement: WitnessStatement = {
      id: statementId,
      caseId,
      witnessId,
      witnessName,
      rawStatement: statementText,
      keyDetails: entities.map((e) => `${e.category}: ${e.value}`),
      timelineEvents: [
        { time: 'Incident Time', observation: statementText.slice(0, 100) + '...', confidence: 85 },
      ],
      status: 'analyzed',
      emotionalState: 'Calm / Observant',
      distanceFromScene: 'Approximately 20-30 meters',
      lightingConditions: 'Street lighting',
      recordedAt: new Date().toISOString(),
      reliabilityScore: 88,
      reliabilityLevel: 'high',
      tags: ['Witness Testimony', inputMethod],
    };

    // New CollectedStatement
    const newCollected: CollectedStatement = {
      id: `col-${Date.now()}`,
      caseId,
      caseTitle,
      witnessLabel: witnessName,
      witnessSlot: Math.max(1, collectedStatements.length + 1),
      isAnonymous: false,
      statement: statementText,
      inputMethod,
      status: 'analyzed',
      savedAt: new Date().toISOString(),
      analyzedAt: new Date().toISOString(),
      extractedEntities: entities,
      generatedQuestions: aiQuestions,
      missingInfo: [
        { category: 'Lighting', description: 'Exact ambient lighting at scene', severity: 'low' },
        { category: 'Duration', description: 'Total duration of event observed', severity: 'medium' },
      ],
      updatedSummary: statementText,
    };

    // FollowUpQuestions for global state
    const newGlobalQuestions: FollowUpQuestion[] = aiQuestions.map((q) => ({
      id: q.id,
      caseId,
      witnessId,
      witnessName,
      question: q.question,
      rationale: q.rationale,
      category: q.category,
      priority: 'high',
      status: 'pending',
      generatedAt: new Date().toISOString(),
    }));

    setStatements((prev) => [newStatement, ...prev.filter((s) => s.witnessId !== witnessId)]);
    setCollectedStatements((prev) => [newCollected, ...prev.filter((c) => c.witnessLabel !== witnessName)]);
    setFollowUpQuestions((prev) => [...newGlobalQuestions, ...prev]);

    // Update witness status
    setWitnesses((prev) =>
      prev.map((w) => (w.id === witnessId ? { ...w, status: 'submitted', statementId } : w))
    );

    return { statement: newStatement, collected: newCollected };
  };

  const updateWitnessStatement = (statementId: string, updatedText: string) => {
    setStatements((prev) =>
      prev.map((s) =>
        s.id === statementId
          ? {
              ...s,
              rawStatement: updatedText,
              keyDetails: extractEntitiesFromText(updatedText).map((e) => `${e.category}: ${e.value}`),
            }
          : s
      )
    );

    setCollectedStatements((prev) =>
      prev.map((c) =>
        c.statement === updatedText || c.id === statementId || c.updatedSummary === updatedText
          ? {
              ...c,
              statement: updatedText,
              updatedSummary: updatedText,
              extractedEntities: extractEntitiesFromText(updatedText),
            }
          : c
      )
    );
  };

  const answerFollowUpQuestion = (questionId: string, answerText: string) => {
    setFollowUpQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, status: 'answered', answer: answerText } : q))
    );

    setCollectedStatements((prev) =>
      prev.map((c) => ({
        ...c,
        generatedQuestions: c.generatedQuestions.map((q) =>
          q.id === questionId ? { ...q, status: 'answered', answer: answerText } : q
        ),
      }))
    );
  };

  const getWitnessById = (witnessId: string) => witnesses.find((w) => w.id === witnessId);
  const getCaseById = (caseId: string) => cases.find((c) => c.id === caseId);
  const getStatementsForCase = (caseId: string) => statements.filter((s) => s.caseId === caseId);
  const getWitnessesForCase = (caseId: string) => witnesses.filter((w) => w.caseId === caseId);

  return (
    <DataContext.Provider
      value={{
        cases,
        witnesses,
        statements,
        followUpQuestions,
        contradictions,
        insights,
        collectedStatements,
        addCase,
        addWitness,
        submitWitnessStatement,
        updateWitnessStatement,
        answerFollowUpQuestion,
        getWitnessById,
        getCaseById,
        getStatementsForCase,
        getWitnessesForCase,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
