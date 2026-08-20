import { useState } from 'react';
import {
  MessageSquareText,
  Sparkles,
  Send,
  ChevronDown,
  ChevronRight,
  Clock,
  CheckCircle2,
  Circle,
  SkipForward,
  Loader2,
  Brain,
} from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { AIDisclaimer, Alert } from '@/components/ui/Alert';
import { useData } from '@/context/DataContext';
import { formatDateTime } from '@/lib/utils';
import type { FollowUpQuestion } from '@/types';

export function FollowUpQuestions() {
  const { followUpQuestions: questions, witnesses, answerFollowUpQuestion } = useData();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const byWitness = witnesses.map((w) => ({
    witness: w,
    questions: questions.filter((q) => q.witnessId === w.id || q.caseId === w.caseId),
  }));

  const handleAnswer = (qId: string) => {
    if (!answers[qId]?.trim()) return;
    setSubmitting(qId);
    setTimeout(() => {
      answerFollowUpQuestion(qId, answers[qId]);
      setSubmitting(null);
      setExpanded(null);
    }, 500);
  };

  const handleSkip = (_qId: string) => {
    setExpanded(null);
  };

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
      setTimeout(() => setGenerated(false), 4000);
    }, 2500);
  };

  const statusIcon: Record<string, React.ReactNode> = {
    answered: <CheckCircle2 size={16} className="text-success-500" />,
    pending: <Circle size={16} className="text-slate-300" />,
    skipped: <SkipForward size={16} className="text-slate-400" />,
  };

  const priorityVariant: Record<string, 'danger' | 'warning' | 'neutral'> = {
    high: 'danger',
    medium: 'warning',
    low: 'neutral',
  };

  const stats = {
    total: questions.length,
    answered: questions.filter((q) => q.status === 'answered').length,
    pending: questions.filter((q) => q.status === 'pending').length,
    skipped: questions.filter((q) => q.status === 'skipped').length,
  };

  return (
    <div>
      <PageHeader
        title="AI Follow-up Questions"
        description="The AI analyzes each witness statement and generates targeted follow-up questions to clarify ambiguities, resolve contradictions, and surface additional leads."
        icon={<MessageSquareText size={22} />}
        action={
          <Button onClick={handleGenerate} disabled={generating}>
            {generating ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Generate New Questions
              </>
            )}
          </Button>
        }
      />

      {generated && (
        <Alert variant="success" className="mb-5 animate-fade-in">
          <p>AI has analyzed all statements and identified 3 new follow-up questions based on emerging patterns.</p>
        </Alert>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Questions', value: stats.total, color: 'text-slate-900', bg: 'bg-slate-50' },
          { label: 'Answered', value: stats.answered, color: 'text-success-600', bg: 'bg-success-50' },
          { label: 'Pending', value: stats.pending, color: 'text-warning-600', bg: 'bg-warning-50' },
          { label: 'Skipped', value: stats.skipped, color: 'text-slate-400', bg: 'bg-slate-50' },
        ].map((s) => (
          <Card key={s.label} className="text-center py-4">
            <div className={`w-10 h-10 rounded-lg ${s.bg} ${s.color} flex items-center justify-center mx-auto mb-2`}>
              <MessageSquareText size={18} />
            </div>
            <p className="text-2xl font-bold text-slate-900">{s.value}</p>
            <p className="text-xs text-slate-500">{s.label}</p>
          </Card>
        ))}
      </div>

      {generating && (
        <Card className="mb-6 ai-scanner">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center">
              <Brain size={24} className="animate-pulse" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-900">AI is analyzing witness statements...</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Cross-referencing statements, identifying gaps, and generating targeted questions
              </p>
              <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary-500 rounded-full w-3/4 animate-pulse-soft" />
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Questions by witness */}
      <div className="space-y-5">
        {byWitness.map(({ witness, questions: wQuestions }) => (
          <Card key={witness.id}>
            <CardHeader
              title={witness.name}
              subtitle={`${witness.occupation} • ${wQuestions.length} question${wQuestions.length !== 1 && 's'}`}
              icon={<MessageSquareText size={20} />}
              action={
                <Badge variant={wQuestions.some((q) => q.status === 'pending') ? 'warning' : 'success'}>
                  {wQuestions.filter((q) => q.status === 'answered').length}/{wQuestions.length} answered
                </Badge>
              }
            />
            <div className="space-y-2">
              {wQuestions.map((q) => (
                <div
                  key={q.id}
                  className={`border rounded-lg transition-all ${
                    expanded === q.id ? 'border-primary-300 bg-primary-50/30' : 'border-slate-200'
                  }`}
                >
                  <button
                    onClick={() => setExpanded(expanded === q.id ? null : q.id)}
                    className="w-full flex items-start gap-3 p-4 text-left"
                  >
                    {statusIcon[q.status]}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <Badge variant={priorityVariant[q.priority]} size="sm">{q.priority}</Badge>
                        <Badge variant="neutral" size="sm">{q.category}</Badge>
                      </div>
                      <p className="text-sm font-medium text-slate-900">{q.question}</p>
                    </div>
                    {expanded === q.id ? (
                      <ChevronDown size={18} className="text-slate-400 flex-shrink-0 mt-1" />
                    ) : (
                      <ChevronRight size={18} className="text-slate-400 flex-shrink-0 mt-1" />
                    )}
                  </button>

                  {expanded === q.id && (
                    <div className="px-4 pb-4 animate-slide-in">
                      <div className="ml-7 space-y-3">
                        {/* Rationale */}
                        <div className="p-3 bg-slate-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Sparkles size={14} className="text-primary-600" />
                            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">AI Rationale</span>
                          </div>
                          <p className="text-sm text-slate-600">{q.rationale}</p>
                        </div>

                        {/* Answer if exists */}
                        {q.answer && (
                          <div className="p-3 bg-success-50 border border-success-200 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <CheckCircle2 size={14} className="text-success-600" />
                              <span className="text-xs font-semibold text-success-800 uppercase tracking-wide">Witness Response</span>
                            </div>
                            <p className="text-sm text-slate-700">{q.answer}</p>
                          </div>
                        )}

                        {/* Answer input */}
                        {q.status === 'pending' && (
                          <div className="space-y-2">
                            <textarea
                              value={answers[q.id] || ''}
                              onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                              className="input min-h-[70px] resize-y"
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
                                    <Loader2 size={16} className="animate-spin" />
                                    Saving...
                                  </>
                                ) : (
                                  <>
                                    <Send size={16} />
                                    Submit Answer
                                  </>
                                )}
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleSkip(q.id)}>
                                <SkipForward size={16} />
                                Skip
                              </Button>
                            </div>
                          </div>
                        )}

                        {q.status === 'skipped' && (
                          <p className="text-xs text-slate-400 italic">Question skipped by investigator.</p>
                        )}

                        <p className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock size={12} />
                          Generated {formatDateTime(q.generatedAt)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6">
        <AIDisclaimer />
      </div>
    </div>
  );
}
