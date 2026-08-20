import { useState } from 'react';
import {
  ShieldCheck,
  TrendingUp,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Award,
  Eye,
  Heart,
  Clock,
  Target,
  Users,
  Sparkles,
  Plus,
  Minus,
  Info,
} from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { AIDisclaimer, ProgressBar, Alert } from '@/components/ui/Alert';
import { reliabilityAnalyses } from '@/data/mockData';
import { eventConfidenceItems } from '@/data/member3Data';
import { cn } from '@/lib/utils';

export function Confidence() {
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setAnalyzed(true);
      setTimeout(() => setAnalyzed(false), 4000);
    }, 2500);
  };

  const levelConfig = {
    high: { variant: 'success' as const, color: 'text-success-600', bg: 'bg-success-50', label: 'High Reliability' },
    medium: { variant: 'warning' as const, color: 'text-warning-600', bg: 'bg-warning-50', label: 'Medium Reliability' },
    low: { variant: 'danger' as const, color: 'text-danger-600', bg: 'bg-danger-50', label: 'Low Reliability' },
  };

  const avgScore = Math.round(
    reliabilityAnalyses.reduce((sum, r) => sum + r.overallScore, 0) / reliabilityAnalyses.length
  );

  const avgConfidence = Math.round(
    eventConfidenceItems.reduce((sum, e) => sum + e.confidence, 0) / eventConfidenceItems.length
  );

  const factorIcons: Record<string, React.ReactNode> = {
    'Proximity to event': <Eye size={14} />,
    'Visibility conditions': <Eye size={14} />,
    'Duration of observation': <Clock size={14} />,
    'Emotional composure': <Heart size={14} />,
    'Detail specificity': <Target size={14} />,
    'Time anchoring': <Clock size={14} />,
  };

  return (
    <div>
      <PageHeader
        title="Confidence & Reliability Analysis"
        description="AI assesses confidence for each key event based on witness agreement, consistency, and evidence quality. Each score includes a transparent explanation of contributing factors."
        icon={<ShieldCheck size={22} />}
        action={
          <Button onClick={handleAnalyze} disabled={analyzing}>
            {analyzing ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <ShieldCheck size={18} />
                Re-run Analysis
              </>
            )}
          </Button>
        }
      />

      {analyzed && (
        <div className="mb-5 p-4 bg-success-50 border border-success-200 rounded-lg animate-fade-in flex items-center gap-3">
          <CheckCircle2 size={18} className="text-success-600" />
          <p className="text-sm text-success-800">Analysis complete. {eventConfidenceItems.length} events scored. Average confidence: {avgConfidence}%.</p>
        </div>
      )}

      {/* Critical disclaimer */}
      <Alert variant="warning" className="mb-6">
        <p className="font-semibold">Confidence score represents AI-assisted consistency analysis, not legal certainty.</p>
        <p className="mt-0.5">
          These scores reflect how consistently information is reported across witnesses and how well it aligns with
          available evidence. They do not determine truth, guilt, or innocence. All findings must be verified by authorized investigators.
        </p>
      </Alert>

      {/* Overall summary */}
      <Card className="mb-6">
        <CardHeader title="Overall Case Confidence" subtitle="Aggregate scores across all events and witnesses" icon={<Award size={20} />} />
        <div className="flex flex-col md:flex-row items-center gap-6">
          <ScoreRing score={avgConfidence} size={120} strokeWidth={10} label="Avg Event Confidence" />
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
            {reliabilityAnalyses.map((r) => {
              const config = levelConfig[r.level];
              return (
                <div key={r.witnessId} className={cn('p-3 rounded-lg border text-center', config.bg, 'border-slate-200')}>
                  <p className="text-xs font-medium text-slate-700 truncate">{r.witnessName}</p>
                  <p className={cn('text-xl font-bold mt-1', config.color)}>{r.overallScore}</p>
                  <Badge variant={config.variant} size="sm" className="mt-1">{config.label}</Badge>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {analyzing ? (
        <Card className="ai-scanner">
          <div className="flex items-center gap-4 py-8">
            <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center">
              <ShieldCheck size={24} className="animate-pulse" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-900">AI assessing event confidence...</p>
              <p className="text-xs text-slate-500 mt-0.5">Cross-referencing {eventConfidenceItems.length} events across {reliabilityAnalyses.length} witnesses</p>
              <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary-500 rounded-full w-3/4 animate-pulse-soft" />
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <div className="space-y-5">
          {/* Event-level confidence items */}
          <Card>
            <CardHeader
              title="Event Confidence Scores"
              subtitle="Each key event with confidence level, reporting witnesses, and reasoning"
              icon={<Target size={20} />}
            />
            <div className="space-y-4">
              {eventConfidenceItems.map((item, i) => (
                <div
                  key={item.id}
                  className={cn(
                    'p-4 rounded-lg border animate-fade-in',
                    item.confidence >= 75 ? 'border-success-200 bg-success-50/20' :
                    item.confidence >= 55 ? 'border-warning-200 bg-warning-50/20' :
                    'border-danger-200 bg-danger-50/20'
                  )}
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <div className="flex items-start gap-4">
                    {/* Circular indicator */}
                    <div className="flex-shrink-0">
                      <ScoreRing score={item.confidence} size={72} strokeWidth={6} />
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Event header */}
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <h4 className="text-sm font-semibold text-slate-900">{item.event}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="neutral" size="sm">{item.category}</Badge>
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                              <Users size={12} />
                              {item.witnessCount} {item.witnessCount === 1 ? 'witness' : 'witnesses'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Reason */}
                      <div className="p-3 bg-white/60 rounded-lg mb-3">
                        <div className="flex items-start gap-2">
                          <Sparkles size={14} className="text-primary-500 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-slate-700">{item.reason}</p>
                        </div>
                      </div>

                      {/* Witnesses */}
                      <div className="flex items-center gap-1.5 flex-wrap mb-3">
                        {item.witnesses.map((w) => (
                          <Badge key={w} variant="info" size="sm">{w}</Badge>
                        ))}
                      </div>

                      {/* Reliability explanation */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {/* Positive factors */}
                        <div className="p-3 bg-success-50/50 rounded-lg border border-success-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Plus size={14} className="text-success-600" />
                            <span className="text-xs font-semibold text-success-800 uppercase tracking-wide">Supporting Factors</span>
                          </div>
                          {item.positiveFactors.length > 0 ? (
                            <ul className="space-y-1">
                              {item.positiveFactors.map((factor, fi) => (
                                <li key={fi} className="text-xs text-slate-600 flex items-start gap-1.5">
                                  <CheckCircle2 size={11} className="text-success-500 mt-0.5 flex-shrink-0" />
                                  {factor}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-xs text-slate-400 italic">No supporting factors identified.</p>
                          )}
                        </div>

                        {/* Negative factors */}
                        <div className="p-3 bg-danger-50/50 rounded-lg border border-danger-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Minus size={14} className="text-danger-600" />
                            <span className="text-xs font-semibold text-danger-800 uppercase tracking-wide">Reducing Factors</span>
                          </div>
                          {item.negativeFactors.length > 0 ? (
                            <ul className="space-y-1">
                              {item.negativeFactors.map((factor, fi) => (
                                <li key={fi} className="text-xs text-slate-600 flex items-start gap-1.5">
                                  <AlertCircle size={11} className="text-danger-500 mt-0.5 flex-shrink-0" />
                                  {factor}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-xs text-slate-400 italic">No reducing factors identified.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Witness reliability breakdown */}
          <Card>
            <CardHeader
              title="AI Reliability Index — Per Witness"
              subtitle="Explainable reliability scores with contributing factors"
              icon={<Users size={20} />}
              action={<Badge variant="info" size="md">Explainable AI</Badge>}
            />
            <div className="space-y-5">
              {reliabilityAnalyses.map((analysis) => {
                const config = levelConfig[analysis.level];
                return (
                  <div key={analysis.witnessId} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-start gap-5">
                      <div className="flex-shrink-0 flex flex-col items-center gap-2">
                        <ScoreRing score={analysis.overallScore} size={80} strokeWidth={6} />
                        <Badge variant={config.variant} size="sm">{config.label}</Badge>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-slate-900 mb-1">{analysis.witnessName}</h3>

                        {/* Factors */}
                        <div className="space-y-2 mb-4">
                          {analysis.factors.map((factor) => (
                            <div key={factor.name} className="flex items-center gap-3">
                              <span className="text-slate-400 flex-shrink-0">{factorIcons[factor.name] || <Target size={14} />}</span>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-0.5">
                                  <span className="text-xs font-medium text-slate-600">{factor.name}</span>
                                  <span className="text-xs text-slate-400">Weight: {factor.weight}%</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="flex-1"><ProgressBar value={factor.score} /></div>
                                  <span className="text-xs font-semibold text-slate-700 w-6 text-right">{factor.score}</span>
                                </div>
                                <p className="text-[11px] text-slate-400 mt-0.5">{factor.note}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Strengths & concerns */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="p-3 bg-success-50/50 rounded-lg border border-success-200">
                            <div className="flex items-center gap-2 mb-2">
                              <Plus size={14} className="text-success-600" />
                              <span className="text-xs font-semibold text-success-800 uppercase tracking-wide">Why Score Is Higher</span>
                            </div>
                            <ul className="space-y-1">
                              {analysis.strengths.map((s, i) => (
                                <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                                  <CheckCircle2 size={11} className="text-success-500 mt-0.5 flex-shrink-0" />
                                  {s}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="p-3 bg-warning-50/50 rounded-lg border border-warning-200">
                            <div className="flex items-center gap-2 mb-2">
                              <Minus size={14} className="text-warning-600" />
                              <span className="text-xs font-semibold text-warning-800 uppercase tracking-wide">Why Score Is Lower</span>
                            </div>
                            <ul className="space-y-1">
                              {analysis.concerns.map((c, i) => (
                                <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                                  <AlertCircle size={11} className="text-warning-500 mt-0.5 flex-shrink-0" />
                                  {c}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* AI reliability explanation notice */}
          <Alert variant="info">
            <div className="flex items-start gap-2">
              <Info size={18} className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">How the AI Reliability Index Works</p>
                <p className="mt-0.5">
                  Each score is computed from six weighted factors: proximity, visibility, observation duration,
                  emotional composure, detail specificity, and time anchoring. Positive factors (marked with +)
                  increase the score; reducing factors (marked with -) decrease it. The AI does not present any
                  score as proof of truth — scores are an explainable consistency assessment to guide investigators.
                </p>
              </div>
            </div>
          </Alert>
        </div>
      )}

      <div className="mt-6">
        <AIDisclaimer />
      </div>
    </div>
  );
}
