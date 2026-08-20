import { useState } from 'react';
import {
  FileText,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileSearch,
  MessageSquareText,
  ClipboardList,
  Clock,
  MapPin,
  Users,
  Shirt,
  Car,
  Activity,
  Navigation,
  Package,
  Eye,
  Download,
  ArrowRight,
  AlertCircle,
  Info,
} from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { AIDisclaimer, ProgressBar } from '@/components/ui/Alert';
import { EmptyState } from '@/components/ui/EmptyState';
import { collectedStatements } from '@/data/member1Data';
import { formatDateTime, cn } from '@/lib/utils';
import type { ViewId, ExtractedCategory } from '@/types';

interface WitnessSummaryProps {
  onNavigate: (view: ViewId) => void;
}

const categoryConfig: Record<ExtractedCategory, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
  time: { label: 'Time', icon: <Clock size={15} />, color: 'text-primary-700', bg: 'bg-primary-50' },
  location: { label: 'Location', icon: <MapPin size={15} />, color: 'text-blue-700', bg: 'bg-blue-50' },
  people: { label: 'People', icon: <Users size={15} />, color: 'text-success-700', bg: 'bg-success-50' },
  clothing: { label: 'Clothing', icon: <Shirt size={15} />, color: 'text-warning-700', bg: 'bg-warning-50' },
  vehicles: { label: 'Vehicles', icon: <Car size={15} />, color: 'text-slate-700', bg: 'bg-slate-100' },
  actions: { label: 'Actions', icon: <Activity size={15} />, color: 'text-danger-700', bg: 'bg-danger-50' },
  direction: { label: 'Direction', icon: <Navigation size={15} />, color: 'text-primary-700', bg: 'bg-primary-50' },
  objects: { label: 'Objects', icon: <Package size={15} />, color: 'text-blue-700', bg: 'bg-blue-50' },
  observations: { label: 'Observations', icon: <Eye size={15} />, color: 'text-success-700', bg: 'bg-success-50' },
};

const severityConfig: Record<string, { variant: 'danger' | 'warning' | 'neutral'; label: string }> = {
  high: { variant: 'danger', label: 'High Priority' },
  medium: { variant: 'warning', label: 'Medium Priority' },
  low: { variant: 'neutral', label: 'Low Priority' },
};

export function WitnessSummary({ onNavigate }: WitnessSummaryProps) {
  const [selectedId, setSelectedId] = useState<string>(collectedStatements[0]?.id || '');
  const [generating, setGenerating] = useState(false);

  const selected = collectedStatements.find((s) => s.id === selectedId);

  const handleGenerateSummary = () => {
    setGenerating(true);
    setTimeout(() => setGenerating(false), 2000);
  };

  if (collectedStatements.length === 0) {
    return (
      <div>
        <PageHeader
          title="Witness Summary"
          description="Consolidated summary of each witness's statement, extracted information, follow-up answers, and identified gaps."
          icon={<FileSearch size={22} />}
        />
        <Card>
          <EmptyState
            icon={<FileText size={28} />}
            title="No witness summaries available"
            description="Collect and analyze witness statements first to generate summaries."
            action={<Button onClick={() => onNavigate('statement-collection')}>Go to Statement Collection</Button>}
          />
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Witness Summary"
        description="Consolidated view of each witness's original statement, AI-extracted information, follow-up question answers, missing information, and the AI-updated witness summary."
        icon={<FileSearch size={22} />}
        action={
          selected && (
            <Button variant="secondary">
              <Download size={18} />
              Export Summary
            </Button>
          )
        }
      />

      {/* Witness selector */}
      <Card className="mb-5">
        <CardHeader title="Select Witness" subtitle="View summary for a specific witness" icon={<Users size={20} />} />
        <div className="flex flex-wrap gap-2">
          {collectedStatements.map((cs) => (
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
                <p className="text-xs text-slate-400">
                  {cs.generatedQuestions.filter((q) => q.status === 'answered').length}/{cs.generatedQuestions.length} answered • {cs.missingInfo.length} gaps
                </p>
              </div>
            </button>
          ))}
        </div>
      </Card>

      {selected && (
        <div className="space-y-5">
          {/* Summary metadata bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="py-4">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Clock size={14} />
                <span className="text-xs">Saved</span>
              </div>
              <p className="text-sm font-medium text-slate-700">{formatDateTime(selected.savedAt)}</p>
            </Card>
            <Card className="py-4">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Sparkles size={14} />
                <span className="text-xs">Analyzed</span>
              </div>
              <p className="text-sm font-medium text-slate-700">{selected.analyzedAt ? formatDateTime(selected.analyzedAt) : 'Not yet'}</p>
            </Card>
            <Card className="py-4">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <MessageSquareText size={14} />
                <span className="text-xs">Questions</span>
              </div>
              <p className="text-sm font-medium text-slate-700">{selected.generatedQuestions.length} total</p>
            </Card>
            <Card className="py-4">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <AlertTriangle size={14} />
                <span className="text-xs">Missing Info</span>
              </div>
              <p className="text-sm font-medium text-slate-700">{selected.missingInfo.length} gaps identified</p>
            </Card>
          </div>

          {/* Section 1: Original Statement */}
          <Card>
            <CardHeader
              title="1. Original Statement"
              subtitle={selected.witnessLabel}
              icon={<FileText size={20} />}
              action={
                <Badge variant="neutral">
                  {selected.inputMethod === 'voice' ? 'Voice Input' : selected.inputMethod === 'audio-upload' ? 'Audio Upload' : 'Text Input'}
                </Badge>
              }
            />
            <div className="p-4 bg-slate-50 rounded-lg text-sm text-slate-700 leading-relaxed">
              {selected.statement}
            </div>
          </Card>

          {/* Section 2: Extracted Information */}
          <Card>
            <CardHeader
              title="2. AI-Extracted Information"
              subtitle="Entities identified from the statement"
              icon={<Sparkles size={20} />}
              action={<Badge variant="info" size="md">AI-assisted</Badge>}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {selected.extractedEntities.map((entity, i) => {
                const config = categoryConfig[entity.category];
                return (
                  <div key={i} className={cn('p-4 rounded-lg border border-slate-200', config.bg)}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={config.color}>{config.icon}</span>
                        <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">{config.label}</span>
                      </div>
                      <Badge variant={entity.confidence >= 70 ? 'success' : entity.confidence >= 45 ? 'warning' : 'danger'} size="sm">
                        {entity.confidence}%
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-800 leading-relaxed">{entity.value}</p>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Section 3: Follow-up Q&A */}
          <Card>
            <CardHeader
              title="3. Follow-up Question Answers"
              subtitle={`${selected.generatedQuestions.filter((q) => q.status === 'answered').length} of ${selected.generatedQuestions.length} answered`}
              icon={<MessageSquareText size={20} />}
            />
            <div className="space-y-3">
              {selected.generatedQuestions.map((q, i) => (
                <div
                  key={q.id}
                  className={cn(
                    'p-4 rounded-lg border',
                    q.status === 'answered' ? 'border-success-200 bg-success-50/30' :
                    q.status === 'skipped' ? 'border-slate-200 bg-slate-50' :
                    'border-warning-200 bg-warning-50/30'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <Badge variant="neutral" size="sm">{q.category}</Badge>
                        {q.status === 'answered' && <Badge variant="success" size="sm"><CheckCircle2 size={11} /> Answered</Badge>}
                        {q.status === 'pending' && <Badge variant="warning" size="sm"><AlertCircle size={11} /> Pending</Badge>}
                        {q.status === 'skipped' && <Badge variant="neutral" size="sm">Skipped</Badge>}
                      </div>
                      <p className="text-sm font-medium text-slate-900 mb-1.5">{q.question}</p>
                      {q.answer ? (
                        <p className="text-sm text-slate-700 pl-3 border-l-2 border-success-300">
                          <span className="text-xs text-slate-400 font-medium">Answer: </span>
                          {q.answer}
                        </p>
                      ) : (
                        <p className="text-xs text-slate-400 italic">No answer recorded yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Section 4: Missing Information */}
          <Card>
            <CardHeader
              title="4. Missing Information"
              subtitle="Information gaps identified by AI that may require further investigation"
              icon={<AlertTriangle size={20} />}
              action={<Badge variant="warning" size="md">{selected.missingInfo.length} gaps</Badge>}
            />
            <div className="space-y-2">
              {selected.missingInfo.map((item, i) => {
                const sev = severityConfig[item.severity];
                return (
                  <div key={i} className="flex items-start gap-3 p-3 border border-slate-200 rounded-lg">
                    <div className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                      item.severity === 'high' ? 'bg-danger-100 text-danger-600' :
                      item.severity === 'medium' ? 'bg-warning-100 text-warning-600' :
                      'bg-slate-100 text-slate-500'
                    )}>
                      <AlertCircle size={16} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-medium text-slate-900">{item.category}</span>
                        <Badge variant={sev.variant} size="sm">{sev.label}</Badge>
                      </div>
                      <p className="text-xs text-slate-500">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Section 5: Updated Witness Summary */}
          <Card>
            <CardHeader
              title="5. AI-Updated Witness Summary"
              subtitle="Consolidated summary incorporating original statement, extracted info, and follow-up answers"
              icon={<ClipboardList size={20} />}
              action={
                <Button size="sm" onClick={handleGenerateSummary} disabled={generating}>
                  {generating ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-primary-600/30 border-t-primary-600 rounded-full animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} />
                      Regenerate
                    </>
                  )}
                </Button>
              }
            />
            {generating ? (
              <div className="p-8 flex items-center justify-center gap-3">
                <span className="w-5 h-5 border-2 border-primary-600/30 border-t-primary-600 rounded-full animate-spin" />
                <span className="text-sm text-slate-500">AI is consolidating all information into an updated summary...</span>
              </div>
            ) : (
              <div className="p-4 bg-primary-50/30 border border-primary-100 rounded-lg">
                <p className="text-sm text-slate-800 leading-relaxed">{selected.updatedSummary}</p>
              </div>
            )}

            {/* Verification notice */}
            <div className="mt-4 p-4 bg-warning-50 border border-warning-200 rounded-lg flex items-start gap-3">
              <Info size={18} className="text-warning-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-warning-800">AI-assisted analysis — Verify information with the original witness.</p>
                <p className="text-xs text-warning-700 mt-0.5">
                  This summary is generated by AI and may contain inaccuracies. All extracted information and follow-up
                  answers should be verified against the original witness statement and through direct follow-up interviews.
                </p>
              </div>
            </div>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-2">
            <Button variant="ghost" onClick={() => onNavigate('ai-followup-analysis')}>
              <ArrowRight size={16} className="rotate-180" />
              Back to AI Analysis
            </Button>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => onNavigate('statement-collection')}>
                <FileText size={16} />
                Collect More Statements
              </Button>
              <Button onClick={() => onNavigate('dashboard')}>
                Back to Dashboard
                <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6">
        <AIDisclaimer />
      </div>
    </div>
  );
}
