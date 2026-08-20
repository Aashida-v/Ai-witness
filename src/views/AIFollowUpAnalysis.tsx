import { useState } from 'react';
import {
  MessageSquareText,
  Sparkles,
  Loader2,
  Send,
  CheckCircle2,
  Circle,
  SkipForward,
  Clock,
  MapPin,
  Users,
  Shirt,
  Car,
  Activity,
  Navigation,
  Package,
  Eye,
  ArrowRight,
  FileText,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { AIDisclaimer, ProgressBar } from '@/components/ui/Alert';
import { EmptyState } from '@/components/ui/EmptyState';
import { collectedStatements } from '@/data/member1Data';
import { formatDateTime, cn } from '@/lib/utils';
import type { ViewId, ExtractedCategory, CollectedStatement, GeneratedQuestion } from '@/types';

interface AIFollowUpAnalysisProps {
  onNavigate: (view: ViewId) => void;
}

const categoryConfig: Record<ExtractedCategory, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
  time: { label: 'Time', icon: <Clock size={16} />, color: 'text-primary-700', bg: 'bg-primary-50' },
  location: { label: 'Location', icon: <MapPin size={16} />, color: 'text-blue-700', bg: 'bg-blue-50' },
  people: { label: 'People', icon: <Users size={16} />, color: 'text-success-700', bg: 'bg-success-50' },
  clothing: { label: 'Clothing', icon: <Shirt size={16} />, color: 'text-warning-700', bg: 'bg-warning-50' },
  vehicles: { label: 'Vehicles', icon: <Car size={16} />, color: 'text-slate-700', bg: 'bg-slate-100' },
  actions: { label: 'Actions', icon: <Activity size={16} />, color: 'text-danger-700', bg: 'bg-danger-50' },
  direction: { label: 'Direction of Movement', icon: <Navigation size={16} />, color: 'text-primary-700', bg: 'bg-primary-50' },
  objects: { label: 'Objects', icon: <Package size={16} />, color: 'text-blue-700', bg: 'bg-blue-50' },
  observations: { label: 'Important Observations', icon: <Eye size={16} />, color: 'text-success-700', bg: 'bg-success-50' },
};

export function AIFollowUpAnalysis({ onNavigate }: AIFollowUpAnalysisProps) {
  const [selectedId, setSelectedId] = useState<string>(collectedStatements[0]?.id || '');
  const [analyzing, setAnalyzing] = useState(false);
  const [statements, setStatements] = useState<CollectedStatement[]>(collectedStatements);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<string | null>(null);

  const selected = statements.find((s) => s.id === selectedId);

  const handleRunAnalysis = () => {
    if (!selected) return;
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
    }, 2500);
  };

  const handleAnswer = (questionId: string) => {
    if (!answers[questionId]?.trim() || !selected) return;
    setSubmitting(questionId);
    setTimeout(() => {
      setStatements((prev) =>
        prev.map((s) =>
          s.id === selected.id
            ? {
                ...s,
                generatedQuestions: s.generatedQuestions.map((q) =>
                  q.id === questionId ? { ...q, status: 'answered', answer: answers[questionId] } : q
                ),
              }
            : s
        )
      );
      setSubmitting(null);
    }, 800);
  };

  const handleSkip = (questionId: string) => {
    if (!selected) return;
    setStatements((prev) =>
      prev.map((s) =>
        s.id === selected.id
          ? {
              ...s,
              generatedQuestions: s.generatedQuestions.map((q) =>
                q.id === questionId ? { ...q, status: 'skipped' } : q
              ),
            }
          : s
      )
    );
  };

  const statusIcon: Record<string, React.ReactNode> = {
    answered: <CheckCircle2 size={16} className="text-success-500" />,
    pending: <Circle size={16} className="text-slate-300" />,
    skipped: <SkipForward size={16} className="text-slate-400" />,
  };

  if (statements.length === 0) {
    return (
      <div>
        <PageHeader
          title="AI Follow-up Analysis"
          description="AI extracts key information from witness statements and generates context-aware follow-up questions."
          icon={<MessageSquareText size={22} />}
        />
        <Card>
          <EmptyState
            icon={<FileText size={28} />}
            title="No statements to analyze"
            description="Collect witness statements first, then return here to run AI analysis."
            action={<Button onClick={() => onNavigate('statement-collection')}>Go to Statement Collection</Button>}
          />
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="AI Follow-up Analysis"
        description="After a statement is submitted, the AI extracts key information (time, location, people, clothing, vehicles, actions, direction, objects, observations) and generates 3–5 context-aware follow-up questions."
        icon={<MessageSquareText size={22} />}
        action={
          <Button onClick={handleRunAnalysis} disabled={analyzing || !selected}>
            {analyzing ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Re-run AI Analysis
              </>
            )}
          </Button>
        }
      />

      {/* Witness selector */}
      <Card className="mb-5">
        <CardHeader title="Select Witness Statement" subtitle="Choose a collected statement to view AI analysis" icon={<FileText size={20} />} />
        <div className="flex flex-wrap gap-2">
          {statements.map((cs) => (
            <button
              key={cs.id}
              onClick={() => setSelectedId(cs.id)}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all text-left',
                selectedId === cs.id ? 'border-primary-500 bg-primary-50/50' : 'border-slate-200 hover:border-slate-300'
              )}
            >
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold',
                selectedId === cs.id ? 'bg-primary-100 text-primary-700' : 'bg-slate-100 text-slate-500'
              )}>
                {cs.witnessSlot}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">{cs.witnessLabel}</p>
                <p className="text-xs text-slate-400">{cs.generatedQuestions.length} questions • {cs.extractedEntities.length} entities</p>
              </div>
            </button>
          ))}
        </div>
      </Card>

      {selected && (
        <>
          {analyzing ? (
            <Card className="ai-scanner">
              <div className="flex items-center gap-4 py-10">
                <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center">
                  <Sparkles size={24} className="animate-pulse" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900">AI analyzing witness statement...</p>
                  <p className="text-xs text-slate-500 mt-0.5">Extracting entities, identifying gaps, generating context-aware follow-up questions</p>
                  <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-500 rounded-full w-3/4 animate-pulse-soft" />
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <>
              {/* Original statement */}
              <Card className="mb-5">
                <CardHeader
                  title="Original Statement"
                  subtitle={`${selected.witnessLabel} • ${formatDateTime(selected.savedAt)}`}
                  icon={<FileText size={20} />}
                  action={<Badge variant="neutral">{selected.inputMethod === 'voice' ? 'Voice Input' : selected.inputMethod === 'audio-upload' ? 'Audio Upload' : 'Text Input'}</Badge>}
                />
                <div className="p-4 bg-slate-50 rounded-lg text-sm text-slate-700 leading-relaxed">
                  {selected.statement}
                </div>
              </Card>

              {/* AI Extraction */}
              <Card className="mb-5">
                <CardHeader
                  title="AI-Extracted Information"
                  subtitle="Entities extracted from the witness statement"
                  icon={<Sparkles size={20} />}
                  action={<Badge variant="info" size="md">AI-assisted</Badge>}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {selected.extractedEntities.map((entity, i) => {
                    const config = categoryConfig[entity.category];
                    return (
                      <div key={i} className={cn('p-4 rounded-lg border', config.bg, 'border-slate-200')}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={config.color}>{config.icon}</span>
                          <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">{config.label}</span>
                        </div>
                        <p className="text-sm text-slate-800 leading-relaxed">{entity.value}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <div className="flex-1"><ProgressBar value={entity.confidence} /></div>
                          <span className="text-xs text-slate-500 font-medium w-6 text-right">{entity.confidence}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* Generated follow-up questions */}
              <Card>
                <CardHeader
                  title="AI-Generated Follow-up Questions"
                  subtitle={`${selected.generatedQuestions.length} context-aware questions based on the statement`}
                  icon={<MessageSquareText size={20} />}
                  action={
                    <div className="flex items-center gap-2">
                      <Badge variant="success" size="sm">
                        {selected.generatedQuestions.filter((q) => q.status === 'answered').length} answered
                      </Badge>
                      <Badge variant="warning" size="sm">
                        {selected.generatedQuestions.filter((q) => q.status === 'pending').length} pending
                      </Badge>
                    </div>
                  }
                />

                <div className="space-y-3">
                  {selected.generatedQuestions.map((q, i) => (
                    <div
                      key={q.id}
                      className={cn(
                        'border rounded-lg transition-all',
                        q.status === 'answered' ? 'border-success-200 bg-success-50/30' : 'border-slate-200'
                      )}
                    >
                      <div className="flex items-start gap-3 p-4">
                        <span className="w-7 h-7 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            {statusIcon[q.status]}
                            <Badge variant="neutral" size="sm">{q.category}</Badge>
                          </div>
                          <p className="text-sm font-medium text-slate-900 mb-2">{q.question}</p>
                          <div className="ml-0 flex items-start gap-2 mb-2">
                            <Sparkles size={13} className="text-primary-500 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-slate-500 italic">{q.rationale}</p>
                          </div>

                          {q.answer && (
                            <div className="p-3 bg-success-50 border border-success-200 rounded-lg mb-2">
                              <div className="flex items-center gap-2 mb-1">
                                <CheckCircle2 size={13} className="text-success-600" />
                                <span className="text-xs font-semibold text-success-800 uppercase tracking-wide">Witness Answer</span>
                              </div>
                              <p className="text-sm text-slate-700">{q.answer}</p>
                            </div>
                          )}

                          {q.status === 'pending' && (
                            <div className="space-y-2">
                              <textarea
                                value={answers[q.id] || ''}
                                onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                                className="input min-h-[60px] resize-y text-sm"
                                placeholder="Record the witness's answer..."
                              />
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleAnswer(q.id)}
                                  disabled={!answers[q.id]?.trim() || submitting === q.id}
                                >
                                  {submitting === q.id ? (
                                    <>
                                      <Loader2 size={14} className="animate-spin" />
                                      Saving...
                                    </>
                                  ) : (
                                    <>
                                      <Send size={14} />
                                      Submit Answer
                                    </>
                                  )}
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleSkip(q.id)}>
                                  <SkipForward size={14} />
                                  Skip
                                </Button>
                              </div>
                            </div>
                          )}

                          {q.status === 'skipped' && (
                            <p className="text-xs text-slate-400 italic">Question skipped by investigator.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Navigate to summary */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <AlertTriangle size={12} />
                    <span>Answers are saved to the witness summary for verification</span>
                  </div>
                  <Button variant="secondary" onClick={() => onNavigate('witness-summary')}>
                    View Witness Summary
                    <ArrowRight size={14} />
                  </Button>
                </div>
              </Card>
            </>
          )}
        </>
      )}

      <div className="mt-6">
        <AIDisclaimer />
      </div>
    </div>
  );
}
