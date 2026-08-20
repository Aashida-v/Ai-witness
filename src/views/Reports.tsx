import { useState } from 'react';
import {
  FileBarChart,
  Download,
  Sparkles,
  Loader2,
  CheckCircle2,
  FileText,
  Users,
  AlertTriangle,
  Lightbulb,
  ShieldCheck,
  Printer,
  Clock,
  ArrowRight,
  Eye,
} from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { AIDisclaimer, Alert, ProgressBar } from '@/components/ui/Alert';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { sampleCase, witnesses, statements, contradictions, insights, reliabilityAnalyses, timelineEvents } from '@/data/mockData';
import { commonFacts, differences, investigationSummary } from '@/data/member2Data';
import { eventConfidenceItems } from '@/data/member3Data';
import { formatDateTime, formatDate, cn } from '@/lib/utils';

export function Reports() {
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [report, setReport] = useState<any>(null);

  const avgReliability = Math.round(
    reliabilityAnalyses.reduce((sum, r) => sum + r.overallScore, 0) / reliabilityAnalyses.length
  );

  const avgConfidence = Math.round(
    eventConfidenceItems.reduce((sum, e) => sum + e.confidence, 0) / eventConfidenceItems.length
  );

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      const r = {
        caseId: sampleCase.id,
        generatedAt: new Date().toISOString(),
        witnessCount: witnesses.length,
        totalStatements: statements.length,
        contradictionsFound: contradictions.length,
        insightsCount: insights.length,
        averageReliability: avgReliability,
        averageConfidence: avgConfidence,
      };
      setReport(r);
      setGenerating(false);
      setGenerated(true);
      setTimeout(() => setGenerated(false), 4000);
    }, 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    window.print();
  };

  return (
    <div>
      {/* Screen-only header */}
      <div className="print:hidden">
        <PageHeader
          title="Final Investigation Report"
          description="Compile all AI-assisted analysis into a comprehensive investigation report covering case information, witness summary, timeline, common facts, contradictions, confidence analysis, AI insights, and recommended verification."
          icon={<FileBarChart size={22} />}
          action={
            report && (
              <div className="flex gap-2">
                <Button variant="secondary" onClick={handlePrint}>
                  <Printer size={18} />
                  Print Report
                </Button>
                <Button onClick={handleExport}>
                  <Download size={18} />
                  Export PDF
                </Button>
              </div>
            )
          }
        />
      </div>

      <div className="print:hidden">
        {generated && (
          <Alert variant="success" className="mb-5 animate-fade-in">
            <p>Investigation report generated successfully. Review the findings below and print or export for your records.</p>
          </Alert>
        )}

        {!report && !generating && (
          <Card>
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-primary-50 text-primary-700 flex items-center justify-center mx-auto mb-4">
                <FileBarChart size={28} />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No report generated yet</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
                Generate a comprehensive investigation report that synthesizes all witness statements,
                timeline events, contradictions, confidence analysis, and AI insights into a single document.
              </p>

              <div className="grid grid-cols-4 gap-3 max-w-lg mx-auto mb-6">
                {[
                  { label: 'Witnesses', value: witnesses.length, icon: <Users size={16} /> },
                  { label: 'Events', value: timelineEvents.length, icon: <Clock size={16} /> },
                  { label: 'Contradictions', value: contradictions.length, icon: <AlertTriangle size={16} /> },
                  { label: 'Insights', value: insights.length, icon: <Lightbulb size={16} /> },
                ].map((s) => (
                  <div key={s.label} className="p-3 bg-slate-50 rounded-lg">
                    <div className="text-slate-400 flex justify-center mb-1">{s.icon}</div>
                    <p className="text-xl font-bold text-slate-900">{s.value}</p>
                    <p className="text-xs text-slate-500">{s.label}</p>
                  </div>
                ))}
              </div>

              <Button onClick={handleGenerate} className="mx-auto">
                <Sparkles size={18} />
                Generate Investigation Report
              </Button>
            </div>
          </Card>
        )}

        {generating && (
          <Card className="ai-scanner">
            <div className="flex items-center gap-4 py-12">
              <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center">
                <Sparkles size={24} className="animate-pulse" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900">AI compiling investigation report...</p>
                <p className="text-xs text-slate-500 mt-0.5">Synthesizing {witnesses.length} witness statements, {timelineEvents.length} events, {contradictions.length} contradictions, {insights.length} insights</p>
                <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary-500 rounded-full w-3/4 animate-pulse-soft" />
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>

      {report && (
        <div className="space-y-5">
          {/* Printable report */}
          <Card className="print:shadow-none print:border-0">
            <div className="flex items-start justify-between gap-4 mb-4 pb-4 border-b border-slate-100 print:border-slate-300">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary-900 text-white flex items-center justify-center print:bg-slate-800">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Investigation Report</h2>
                  <p className="text-sm text-slate-500">{sampleCase.caseNumber} • {sampleCase.title}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">Generated</p>
                <p className="text-sm font-medium text-slate-700">{formatDateTime(report.generatedAt)}</p>
              </div>
            </div>

            {/* Case information */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wide">Case Information</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Case Number</p>
                  <p className="text-sm font-medium text-slate-700">{sampleCase.caseNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Lead Investigator</p>
                  <p className="text-sm font-medium text-slate-700">{sampleCase.leadInvestigator}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Incident Date</p>
                  <p className="text-sm font-medium text-slate-700">{formatDate(sampleCase.incidentDate)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Location</p>
                  <p className="text-sm font-medium text-slate-700">{sampleCase.location}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Summary stats */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 print:hidden">
            {[
              { label: 'Witnesses', value: report.witnessCount, icon: <Users size={16} /> },
              { label: 'Events', value: timelineEvents.length, icon: <Clock size={16} /> },
              { label: 'Common Facts', value: commonFacts.length, icon: <CheckCircle2 size={16} /> },
              { label: 'Contradictions', value: report.contradictionsFound, icon: <AlertTriangle size={16} /> },
              { label: 'Insights', value: report.insightsCount, icon: <Lightbulb size={16} /> },
            ].map((s) => (
              <Card key={s.label} className="py-3 text-center">
                <div className="w-9 h-9 rounded-lg bg-primary-50 text-primary-700 flex items-center justify-center mx-auto mb-1.5">
                  {s.icon}
                </div>
                <p className="text-xl font-bold text-slate-900">{s.value}</p>
                <p className="text-xs text-slate-500">{s.label}</p>
              </Card>
            ))}
            <Card className="py-3 flex items-center justify-center gap-3">
              <ScoreRing score={report.averageConfidence} size={56} />
              <div>
                <p className="text-xs text-slate-400">Avg Confidence</p>
                <p className="text-xs font-medium text-slate-700">All events</p>
              </div>
            </Card>
          </div>

          {/* Executive summary */}
          <Card>
            <CardHeader title="Executive Summary" subtitle="AI-generated investigation narrative" icon={<FileText size={20} />} />
            <p className="text-sm text-slate-600 leading-relaxed">{investigationSummary.summary}</p>
          </Card>

          {/* Witness summary */}
          <Card>
            <CardHeader title="Witness Summary" subtitle={`${witnesses.length} witnesses interviewed`} icon={<Users size={20} />} />
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left font-semibold text-slate-500 text-xs uppercase tracking-wider py-3 px-4">Witness</th>
                    <th className="text-left font-semibold text-slate-500 text-xs uppercase tracking-wider py-3 px-4">Role</th>
                    <th className="text-left font-semibold text-slate-500 text-xs uppercase tracking-wider py-3 px-4">Reliability</th>
                    <th className="text-left font-semibold text-slate-500 text-xs uppercase tracking-wider py-3 px-4">Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reliabilityAnalyses.map((r) => (
                    <tr key={r.witnessId} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-medium text-slate-900">{r.witnessName}</td>
                      <td className="py-3 px-4 text-slate-600">{witnesses.find((w) => w.id === r.witnessId)?.relationship}</td>
                      <td className="py-3 px-4">
                        <span className={cn(
                          'font-semibold',
                          r.overallScore >= 75 ? 'text-success-600' : r.overallScore >= 55 ? 'text-warning-600' : 'text-danger-600'
                        )}>
                          {r.overallScore}/100
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={r.level === 'high' ? 'success' : r.level === 'medium' ? 'warning' : 'danger'} size="sm">
                          {r.level}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader title="Timeline of Events" subtitle={`${timelineEvents.length} events reconstructed from witness statements`} icon={<Clock size={20} />} />
            <div className="space-y-2">
              {timelineEvents.map((event) => (
                <div key={event.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="flex-shrink-0 w-16">
                    <span className="text-xs font-semibold text-slate-900">{event.timestamp}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900">{event.event}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{event.detail}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{event.witnessName} • {event.category} • {event.confidence}% confidence</p>
                  </div>
                  {event.corroborated && (
                    <Badge variant="success" size="sm">Corroborated</Badge>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Common facts */}
          <Card>
            <CardHeader title="Common Facts" subtitle="Information consistently reported across witnesses" icon={<CheckCircle2 size={20} />} action={<Badge variant="success">{commonFacts.length}</Badge>} />
            <div className="space-y-2">
              {commonFacts.map((fact) => (
                <div key={fact.id} className="flex items-start gap-3 p-3 bg-success-50/30 border border-success-200 rounded-lg">
                  <CheckCircle2 size={16} className="text-success-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{fact.category}</p>
                    <p className="text-sm text-slate-600 mt-0.5">{fact.description}</p>
                    <p className="text-xs text-slate-400 mt-1">Corroborated by: {fact.witnesses.join(', ')}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Contradictions */}
          <Card>
            <CardHeader title="Contradictions" subtitle="Conflicting information requiring verification" icon={<AlertTriangle size={20} />} action={<Badge variant="danger">{contradictions.length}</Badge>} />
            <div className="space-y-3">
              {contradictions.map((c) => (
                <div key={c.id} className="p-4 bg-danger-50/20 border border-danger-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-slate-900">{c.topic}</h4>
                    <Badge variant={c.severity === 'major' ? 'danger' : c.severity === 'moderate' ? 'warning' : 'neutral'} size="sm">
                      {c.severity} severity
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                    <div className="p-2 bg-white rounded border border-slate-200">
                      <p className="text-xs font-semibold text-slate-700">{c.witness1Name}</p>
                      <p className="text-xs text-slate-600 mt-0.5">{c.witness1Claim}</p>
                    </div>
                    <div className="p-2 bg-white rounded border border-slate-200">
                      <p className="text-xs font-semibold text-slate-700">{c.witness2Name}</p>
                      <p className="text-xs text-slate-600 mt-0.5">{c.witness2Claim}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">{c.explanation}</p>
                  <p className="text-xs text-primary-600 mt-1 flex items-start gap-1">
                    <ArrowRight size={12} className="mt-0.5 flex-shrink-0" />
                    {c.recommendation}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* Confidence analysis */}
          <Card>
            <CardHeader title="Confidence Analysis" subtitle="Per-event confidence scores with reasoning" icon={<ShieldCheck size={20} />} />
            <div className="space-y-3">
              {eventConfidenceItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900">{item.event}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.reason}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{item.witnessCount} witnesses • {item.category}</p>
                  </div>
                  <div className="w-24 flex-shrink-0">
                    <ProgressBar value={item.confidence} />
                  </div>
                  <span className={cn(
                    'text-sm font-bold w-10 text-right flex-shrink-0',
                    item.confidence >= 75 ? 'text-success-600' : item.confidence >= 55 ? 'text-warning-600' : 'text-danger-600'
                  )}>
                    {item.confidence}%
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* AI investigation insights */}
          <Card>
            <CardHeader title="AI Investigation Insights" subtitle="Prioritized investigative leads and observations" icon={<Lightbulb size={20} />} action={<Badge variant="info">AI-assisted</Badge>} />
            <div className="space-y-3">
              {insights.map((insight) => (
                <div key={insight.id} className="flex items-start gap-3 p-3 bg-primary-50/20 border border-primary-100 rounded-lg">
                  <div className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                    insight.significance === 'high' ? 'bg-danger-100 text-danger-600' :
                    insight.significance === 'medium' ? 'bg-warning-100 text-warning-600' :
                    'bg-slate-100 text-slate-600'
                  )}>
                    <Lightbulb size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-slate-900">{insight.title}</p>
                      <Badge variant={insight.significance === 'high' ? 'danger' : insight.significance === 'medium' ? 'warning' : 'neutral'} size="sm">
                        {insight.significance}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600">{insight.description}</p>
                    <p className="text-xs text-slate-400 mt-1">{insight.category} • Evidence strength: {insight.evidenceStrength}%</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recommended verification */}
          <Card>
            <CardHeader title="Recommended Verification" subtitle="Suggested next steps for the investigation" icon={<ArrowRight size={20} />} />
            <div className="space-y-2">
              {investigationSummary.recommendedVerification.map((rec, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-primary-50/20 border border-primary-100 rounded-lg">
                  <span className="w-6 h-6 rounded-full bg-primary-600 text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
                    {i + 1}
                  </span>
                  <p className="text-sm text-slate-700">{rec}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Print-only key findings */}
          <Card className="print:hidden">
            <CardHeader title="Key Findings" subtitle="AI-assisted analysis summary" icon={<CheckCircle2 size={20} />} />
            <div className="space-y-2">
              {investigationSummary.keyAgreements.map((finding, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-success-50/30 border border-success-200 rounded-lg">
                  <CheckCircle2 size={14} className="text-success-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-700">{finding}</p>
                </div>
              ))}
              {investigationSummary.keyContradictions.map((finding, i) => (
                <div key={`c-${i}`} className="flex items-start gap-3 p-3 bg-danger-50/30 border border-danger-200 rounded-lg">
                  <AlertTriangle size={14} className="text-danger-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-700">{finding}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Disclaimer */}
          <div className="print:hidden">
            <AIDisclaimer />
          </div>

          {/* Print-only disclaimer */}
          <div className="hidden print:block mt-6 pt-4 border-t border-slate-300 text-xs text-slate-500">
            <p className="font-semibold">AI-assisted analysis — for investigator verification only.</p>
            <p className="mt-1">
              This report is generated by an AI system to support investigation workflows. It does not represent
              legal certainty and must be independently verified by a qualified investigator. Confidence scores
              reflect statement consistency and observation quality, not guilt or innocence.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 print:hidden">
            <Button variant="secondary" onClick={handlePrint}>
              <Printer size={18} />
              Print Report
            </Button>
            <Button onClick={handleExport}>
              <Download size={18} />
              Export PDF
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
