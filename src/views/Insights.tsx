import { useState } from 'react';
import {
  Lightbulb,
  Sparkles,
  TrendingUp,
  Loader2,
  Target,
  Users,
  Search,
  Fingerprint,
  FileSearch,
  CheckCircle2,
  AlertTriangle,
  Info,
  ClipboardCheck,
  ArrowRight,
} from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { AIDisclaimer, ProgressBar, Alert } from '@/components/ui/Alert';
import { insights, witnesses } from '@/data/mockData';
import { investigationSummary } from '@/data/member2Data';
import { formatDateTime } from '@/lib/utils';

export function Insights() {
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
      setTimeout(() => setGenerated(false), 4000);
    }, 2500);
  };

  const categoryIcons: Record<string, React.ReactNode> = {
    'Investigative Lead': <Target size={18} />,
    'Suspect Profile': <Users size={18} />,
    'Conflict Resolution': <Search size={18} />,
    'Witness Assessment': <Users size={18} />,
    'Witness Identification': <Users size={18} />,
    'Forensic Opportunity': <Fingerprint size={18} />,
  };

  const significanceConfig = {
    high: { variant: 'danger' as const, label: 'High Priority' },
    medium: { variant: 'warning' as const, label: 'Medium Priority' },
    low: { variant: 'neutral' as const, label: 'Low Priority' },
  };

  const sorted = [...insights].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.significance] - order[b.significance];
  });

  return (
    <div>
      <PageHeader
        title="AI Investigation Insights"
        description="The AI synthesizes all witness statements, contradictions, and timeline data to generate an investigator-friendly summary with key agreements, contradictions, missing information, and recommended verification steps."
        icon={<Lightbulb size={22} />}
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
                Generate Insights
              </>
            )}
          </Button>
        }
      />

      {generated && (
        <div className="mb-5 p-4 bg-success-50 border border-success-200 rounded-lg animate-fade-in flex items-center gap-3">
          <Sparkles size={18} className="text-success-600" />
          <p className="text-sm text-success-800">AI has generated {insights.length} insights and a consolidated investigation summary from the current evidence.</p>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'High Priority', value: insights.filter((i) => i.significance === 'high').length, color: 'text-danger-600', bg: 'bg-danger-50' },
          { label: 'Medium Priority', value: insights.filter((i) => i.significance === 'medium').length, color: 'text-warning-600', bg: 'bg-warning-50' },
          { label: 'Low Priority', value: insights.filter((i) => i.significance === 'low').length, color: 'text-slate-600', bg: 'bg-slate-100' },
        ].map((s) => (
          <Card key={s.label} className="py-4">
            <div className={`w-10 h-10 rounded-lg ${s.bg} ${s.color} flex items-center justify-center mb-2`}>
              <TrendingUp size={18} />
            </div>
            <p className="text-2xl font-bold text-slate-900">{s.value}</p>
            <p className="text-xs text-slate-500">{s.label}</p>
          </Card>
        ))}
      </div>

      {generating ? (
        <Card className="ai-scanner">
          <div className="flex items-center gap-4 py-8">
            <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center">
              <Sparkles size={24} className="animate-pulse" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-900">AI synthesizing investigation insights...</p>
              <p className="text-xs text-slate-500 mt-0.5">Analyzing {insights.length} data points across statements, timeline, and contradictions</p>
              <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary-500 rounded-full w-3/4 animate-pulse-soft" />
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <div className="space-y-5">
          {/* Investigator-friendly summary */}
          <Card>
            <CardHeader
              title="Investigation Summary"
              subtitle="AI-generated investigator-friendly narrative"
              icon={<FileSearch size={20} />}
              action={<Badge variant="info">AI-assisted</Badge>}
            />
            <div className="p-4 bg-primary-50/30 border border-primary-100 rounded-lg">
              <p className="text-sm text-slate-800 leading-relaxed">{investigationSummary.summary}</p>
            </div>
            <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
              <ClipboardCheck size={12} />
              Generated {formatDateTime(investigationSummary.generatedAt)}
            </p>
          </Card>

          {/* Four sections grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Key Agreements */}
            <Card>
              <CardHeader
                title="Key Agreements"
                subtitle="Information consistently reported across witnesses"
                icon={<CheckCircle2 size={20} />}
                action={<Badge variant="success">{investigationSummary.keyAgreements.length}</Badge>}
              />
              <div className="space-y-2">
                {investigationSummary.keyAgreements.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-success-50/30 border border-success-200 rounded-lg animate-fade-in" style={{ animationDelay: `${i * 40}ms` }}>
                    <CheckCircle2 size={16} className="text-success-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-slate-700">{item}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Key Contradictions */}
            <Card>
              <CardHeader
                title="Key Contradictions"
                subtitle="Conflicting information requiring verification"
                icon={<AlertTriangle size={20} />}
                action={<Badge variant="danger">{investigationSummary.keyContradictions.length}</Badge>}
              />
              <div className="space-y-2">
                {investigationSummary.keyContradictions.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-danger-50/30 border border-danger-200 rounded-lg animate-fade-in" style={{ animationDelay: `${i * 40}ms` }}>
                    <AlertTriangle size={16} className="text-danger-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-slate-700">{item}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Missing Information */}
            <Card>
              <CardHeader
                title="Missing Information"
                subtitle="Gaps in the current evidence that need to be filled"
                icon={<Info size={20} />}
                action={<Badge variant="warning">{investigationSummary.missingInformation.length}</Badge>}
              />
              <div className="space-y-2">
                {investigationSummary.missingInformation.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-warning-50/30 border border-warning-200 rounded-lg animate-fade-in" style={{ animationDelay: `${i * 40}ms` }}>
                    <Info size={16} className="text-warning-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-slate-700">{item}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recommended Verification */}
            <Card>
              <CardHeader
                title="Recommended Verification"
                subtitle="Suggested next steps for the investigation"
                icon={<ArrowRight size={20} />}
                action={<Badge variant="info">{investigationSummary.recommendedVerification.length}</Badge>}
              />
              <div className="space-y-2">
                {investigationSummary.recommendedVerification.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-primary-50/30 border border-primary-200 rounded-lg animate-fade-in" style={{ animationDelay: `${i * 40}ms` }}>
                    <ArrowRight size={16} className="text-primary-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-slate-700">{item}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Detailed AI insights */}
          <Card>
            <CardHeader
              title="Detailed AI Insights"
              subtitle="Prioritized investigative leads and observations"
              icon={<Lightbulb size={20} />}
            />
            <div className="space-y-4">
              {sorted.map((insight, i) => {
                const sig = significanceConfig[insight.significance];
                const relatedWitnesses = witnesses.filter((w) => insight.relatedWitnesses.includes(w.id));
                return (
                  <Card key={insight.id} hover className="animate-fade-in">
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                        insight.significance === 'high' ? 'bg-danger-100 text-danger-600' :
                        insight.significance === 'medium' ? 'bg-warning-100 text-warning-600' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {categoryIcons[insight.category] || <Lightbulb size={18} />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h3 className="text-base font-semibold text-slate-900">{insight.title}</h3>
                          <Badge variant={sig.variant} size="md">{sig.label}</Badge>
                        </div>

                        <p className="text-sm text-slate-600 leading-relaxed mb-3">{insight.description}</p>

                        <div className="flex items-center justify-between gap-3 flex-wrap">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="info" size="sm">{insight.category}</Badge>
                            {relatedWitnesses.map((w) => (
                              <Badge key={w.id} variant="neutral" size="sm">
                                <Users size={11} />
                                {w.name}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400">Evidence Strength</span>
                            <div className="w-20"><ProgressBar value={insight.evidenceStrength} /></div>
                            <span className="text-xs font-semibold text-slate-700">{insight.evidenceStrength}%</span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                          <FileSearch size={12} />
                          Generated {formatDateTime(insight.generatedAt)}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {/* Critical disclaimer */}
      <Alert variant="warning" className="mt-6">
        <p className="font-semibold">AI-assisted analysis. Final conclusions must be verified by authorized investigators.</p>
        <p className="mt-0.5">
          This system is an investigation support tool only. The AI does not determine guilt or innocence.
          All findings must be independently verified by qualified investigators before any action is taken.
        </p>
      </Alert>

      <div className="mt-6">
        <AIDisclaimer />
      </div>
    </div>
  );
}
