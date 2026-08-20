import {
  LayoutDashboard,
  Folders,
  FileText,
  AlertTriangle,
  Lightbulb,
  ShieldCheck,
  TrendingUp,
  Users,
  Clock,
  ArrowRight,
  Activity,
  CheckCircle2,
  MessageSquareText,
  FileBarChart,
  Mic,
  GitCompareArrows,
  Eye,
} from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { ProgressBar, AIDisclaimer } from '@/components/ui/Alert';
import { useData } from '@/context/DataContext';
import { sampleCase, timelineEvents } from '@/data/mockData';
import { commonFacts, comparisonRows } from '@/data/member2Data';
import { eventConfidenceItems } from '@/data/member3Data';
import { formatDateTime, cn } from '@/lib/utils';
import type { ViewId } from '@/types';

interface DashboardProps {
  onNavigate: (view: ViewId) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { cases, witnesses, statements, contradictions, insights } = useData();

  const avgConfidence = 86;

  const stats = [
    { label: 'Total Cases', value: String(cases.length), icon: <Folders size={20} />, color: 'text-primary-600', bg: 'bg-primary-50' },
    { label: 'Registered Witnesses', value: String(witnesses.length), icon: <Users size={20} />, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Statements Recorded', value: String(statements.length), icon: <CheckCircle2 size={20} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Contradictions Detected', value: String(contradictions.length), icon: <AlertTriangle size={20} />, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Average Confidence', value: `${avgConfidence}%`, icon: <ShieldCheck size={20} />, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Investigation Leads', value: String(insights.length), icon: <Activity size={20} />, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const quickActions: { label: string; icon: React.ReactNode; view: ViewId; desc: string }[] = [
    { label: 'Collect Statements', icon: <Mic size={18} />, view: 'statement-collection', desc: 'Record witness input' },
    { label: 'AI Follow-up Questions', icon: <MessageSquareText size={18} />, view: 'followup', desc: 'Generate targeted questions' },
    { label: 'View Timeline', icon: <Clock size={18} />, view: 'timeline', desc: 'Reconstruct event sequence' },
    { label: 'Compare Witnesses', icon: <GitCompareArrows size={18} />, view: 'comparison', desc: 'Side-by-side analysis' },
    { label: 'Detect Contradictions', icon: <AlertTriangle size={18} />, view: 'contradictions', desc: 'Cross-reference statements' },
    { label: 'AI Insights', icon: <Lightbulb size={18} />, view: 'insights', desc: 'Surface investigative leads' },
    { label: 'Confidence Analysis', icon: <ShieldCheck size={18} />, view: 'confidence', desc: 'Assess reliability' },
    { label: 'Generate Report', icon: <FileBarChart size={18} />, view: 'reports', desc: 'Compile final report' },
  ];

  // Chart data
  const agreementData = comparisonRows.map((r) => ({
    topic: r.topic.length > 18 ? r.topic.slice(0, 18) + '...' : r.topic,
    classification: r.classification,
  }));

  const categoryCounts = timelineEvents.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const maxCategoryCount = Math.max(...Object.values(categoryCounts));

  return (
    <div>
      <PageHeader
        title="Investigation Dashboard"
        description="Overview of the active case, evidence status, and AI-assisted analysis progress."
        icon={<LayoutDashboard size={22} />}
        badge={<Badge variant="warning" size="md">Active Case</Badge>}
      />

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {stats.map((stat, i) => (
          <Card key={stat.label} hover className="animate-fade-in">
            <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-3`}>
              {stat.icon}
            </div>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Active case card */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Active Investigation"
            subtitle={sampleCase.caseNumber}
            icon={<Folders size={20} />}
            action={<Badge variant="warning">High Priority</Badge>}
          />
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{sampleCase.title}</h3>
              <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">{sampleCase.description}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t border-slate-100">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Location</p>
                <p className="text-sm font-medium text-slate-700">5th Avenue, Downtown</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Incident</p>
                <p className="text-sm font-medium text-slate-700">Nov 14, 21:15</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Witnesses</p>
                <p className="text-sm font-medium text-slate-700">{witnesses.length} interviewed</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Investigator</p>
                <p className="text-sm font-medium text-slate-700">Det. S. Brennan</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {sampleCase.tags.map((tag) => (
                <Badge key={tag} variant="neutral">{tag}</Badge>
              ))}
            </div>
          </div>
        </Card>

        {/* Confidence ring */}
        <Card>
          <CardHeader title="Case Confidence" icon={<ShieldCheck size={20} />} />
          <div className="flex flex-col items-center gap-4">
            <ScoreRing score={avgConfidence} size={120} strokeWidth={10} label="Avg Confidence" />
            <div className="w-full space-y-2.5">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600">AI analysis complete</span>
                  <span className="font-semibold text-slate-900">100%</span>
                </div>
                <ProgressBar value={100} color="bg-success-500" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600">Contradictions resolved</span>
                  <span className="font-semibold text-slate-900">33%</span>
                </div>
                <ProgressBar value={33} color="bg-warning-500" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600">Report generated</span>
                  <span className="font-semibold text-slate-900">0%</span>
                </div>
                <ProgressBar value={0} color="bg-slate-300" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Visual charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Witness agreement chart */}
        <Card>
          <CardHeader
            title="Witness Agreement"
            subtitle="Classification of comparison points"
            icon={<GitCompareArrows size={20} />}
          />
          <div className="space-y-3">
            {agreementData.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs text-slate-600 w-32 flex-shrink-0 truncate">{item.topic}</span>
                <div className="flex-1 h-6 bg-slate-100 rounded-md overflow-hidden flex">
                  <div
                    className={cn(
                      'h-full flex items-center justify-center text-[10px] font-semibold text-white transition-all',
                      item.classification === 'common' && 'bg-success-500',
                      item.classification === 'difference' && 'bg-warning-500',
                      item.classification === 'contradiction' && 'bg-danger-500',
                    )}
                    style={{ width: '100%', animationDelay: `${i * 50}ms` }}
                  >
                    {item.classification === 'common' ? 'Common' : item.classification === 'difference' ? 'Difference' : 'Contradiction'}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="w-3 h-3 rounded bg-success-500" /> Common ({comparisonRows.filter((r) => r.classification === 'common').length})
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="w-3 h-3 rounded bg-warning-500" /> Difference ({comparisonRows.filter((r) => r.classification === 'difference').length})
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="w-3 h-3 rounded bg-danger-500" /> Contradiction ({comparisonRows.filter((r) => r.classification === 'contradiction').length})
            </div>
          </div>
        </Card>

        {/* Timeline events by category chart */}
        <Card>
          <CardHeader
            title="Timeline Events"
            subtitle="Events by category"
            icon={<Clock size={20} />}
          />
          <div className="space-y-3">
            {Object.entries(categoryCounts).map(([cat, count], i) => (
              <div key={cat} className="flex items-center gap-3">
                <span className="text-xs text-slate-600 w-24 flex-shrink-0">{cat}</span>
                <div className="flex-1 h-7 bg-slate-100 rounded-md overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-md transition-all flex items-center px-2',
                      cat === 'Incident' && 'bg-danger-500',
                      cat === 'Flight' && 'bg-warning-500',
                      cat === 'Pre-incident' && 'bg-slate-400',
                      cat === 'Post-incident' && 'bg-primary-500',
                    )}
                    style={{ width: `${(count / maxCategoryCount) * 100}%`, animationDelay: `${i * 50}ms` }}
                  >
                    <span className="text-[10px] font-semibold text-white">{count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Confidence levels chart */}
        <Card>
          <CardHeader
            title="Confidence Levels"
            subtitle="Per-event confidence scores"
            icon={<ShieldCheck size={20} />}
          />
          <div className="space-y-2.5">
            {eventConfidenceItems.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <span className="text-xs text-slate-600 w-28 flex-shrink-0 truncate" title={item.event}>{item.event}</span>
                <div className="flex-1"><ProgressBar value={item.confidence} /></div>
                <span className={cn(
                  'text-xs font-semibold w-8 text-right',
                  item.confidence >= 75 ? 'text-success-600' : item.confidence >= 55 ? 'text-warning-600' : 'text-danger-600'
                )}>
                  {item.confidence}%
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Witness reliability chart */}
        <Card>
          <CardHeader
            title="Witness Reliability"
            subtitle="AI-assisted reliability scores per witness"
            icon={<Users size={20} />}
            action={<button onClick={() => onNavigate('confidence')} className="text-xs text-primary-600 hover:text-primary-700 font-medium">Details</button>}
          />
          <div className="space-y-3">
            {statements.map((s) => (
              <div key={s.id} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{s.witnessName}</p>
                  <p className="text-xs text-slate-400">{s.tags[0]}</p>
                </div>
                <div className="w-28 flex-shrink-0">
                  <ProgressBar value={s.reliabilityScore} />
                </div>
                <span className={cn(
                  'text-sm font-semibold w-8 text-right',
                  s.reliabilityScore >= 75 ? 'text-success-600' : s.reliabilityScore >= 55 ? 'text-warning-600' : 'text-danger-600'
                )}>
                  {s.reliabilityScore}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick actions */}
      <Card className="mb-6">
        <CardHeader title="Investigation Workflow" subtitle="Complete analysis pipeline" icon={<TrendingUp size={20} />} />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => onNavigate(action.view)}
              className="group flex items-center gap-3 p-4 rounded-lg border border-slate-200 hover:border-primary-300 hover:bg-primary-50/50 transition-all text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary-700 flex items-center justify-center group-hover:bg-primary-100 transition-colors flex-shrink-0">
                {action.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900">{action.label}</p>
                <p className="text-xs text-slate-400 truncate">{action.desc}</p>
              </div>
              <ArrowRight size={16} className="text-slate-300 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
            </button>
          ))}
        </div>
      </Card>

      <AIDisclaimer />

      <div className="mt-6 flex items-center gap-2 text-xs text-slate-400">
        <CheckCircle2 size={14} className="text-success-500" />
        <span>All systems operational</span>
        <span className="mx-2">•</span>
        <span>Last updated: {formatDateTime(new Date())}</span>
      </div>
    </div>
  );
}
