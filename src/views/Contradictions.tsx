import { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  Clock,
  Loader2,
  Sparkles,
  ArrowRight,
  Users,
  X,
} from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { AIDisclaimer, Alert } from '@/components/ui/Alert';
import { contradictions } from '@/data/mockData';
import { commonFacts, differences } from '@/data/member2Data';
import { formatDateTime, cn } from '@/lib/utils';
import type { Contradiction } from '@/types';

type FilterTab = 'all' | 'common' | 'differences' | 'contradictions';

export function Contradictions() {
  const [items, setItems] = useState<Contradiction[]>(contradictions);
  const [selected, setSelected] = useState<Contradiction | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setScanned(true);
      setTimeout(() => setScanned(false), 4000);
    }, 2500);
  };

  const handleResolve = (id: string) => {
    setItems((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'resolved' } : c))
    );
    setSelected(null);
  };

  const handleReview = (id: string) => {
    setItems((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'reviewed' } : c))
    );
  };

  const severityConfig = {
    major: { variant: 'danger' as const, bg: 'border-danger-200 bg-danger-50/30', label: 'Medium', iconBg: 'bg-danger-100 text-danger-600' },
    moderate: { variant: 'warning' as const, bg: 'border-warning-200 bg-warning-50/30', label: 'Medium', iconBg: 'bg-warning-100 text-warning-600' },
    minor: { variant: 'info' as const, bg: 'border-slate-200', label: 'Low', iconBg: 'bg-blue-100 text-blue-600' },
  };

  const statusConfig = {
    unresolved: { variant: 'danger' as const, label: 'Requires Verification' },
    reviewed: { variant: 'warning' as const, label: 'Reviewed' },
    resolved: { variant: 'success' as const, label: 'Resolved' },
  };

  const tabConfig: { id: FilterTab; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: contradictions.length + commonFacts.length + differences.length },
    { id: 'common', label: 'Common Facts', count: commonFacts.length },
    { id: 'differences', label: 'Differences', count: differences.length },
    { id: 'contradictions', label: 'Contradictions', count: contradictions.length },
  ];

  return (
    <div>
      <PageHeader
        title="Contradiction Detection"
        description="The AI cross-references all witness statements and automatically classifies information as common facts, differences requiring verification, or contradictions. Each item is categorized with severity and recommended action."
        icon={<AlertTriangle size={22} />}
        action={
          <Button onClick={handleScan} disabled={scanning}>
            {scanning ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Rescan Statements
              </>
            )}
          </Button>
        }
      />

      {scanned && (
        <Alert variant="info" className="mb-5 animate-fade-in">
          <p>AI scan complete. {commonFacts.length} common facts, {differences.length} differences, and {contradictions.length} contradictions detected across witness statements.</p>
        </Alert>
      )}

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="text-center py-4">
          <div className="w-10 h-10 rounded-lg bg-success-50 text-success-600 flex items-center justify-center mx-auto mb-2">
            <CheckCircle2 size={18} />
          </div>
          <p className="text-2xl font-bold text-slate-900">{commonFacts.length}</p>
          <p className="text-xs text-slate-500">Common Facts</p>
        </Card>
        <Card className="text-center py-4">
          <div className="w-10 h-10 rounded-lg bg-warning-50 text-warning-600 flex items-center justify-center mx-auto mb-2">
            <AlertTriangle size={18} />
          </div>
          <p className="text-2xl font-bold text-slate-900">{differences.length}</p>
          <p className="text-xs text-slate-500">Differences</p>
        </Card>
        <Card className="text-center py-4">
          <div className="w-10 h-10 rounded-lg bg-danger-50 text-danger-600 flex items-center justify-center mx-auto mb-2">
            <X size={18} />
          </div>
          <p className="text-2xl font-bold text-slate-900">{contradictions.length}</p>
          <p className="text-xs text-slate-500">Contradictions</p>
        </Card>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-5">
        {tabConfig.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all',
              activeTab === tab.id
                ? 'bg-primary-500 text-white shadow-soft'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
            )}
          >
            {tab.label}
            <span className={cn(
              'px-1.5 py-0.5 rounded text-[10px] font-semibold',
              activeTab === tab.id ? 'bg-white/20' : 'bg-slate-100 text-slate-500'
            )}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {scanning ? (
        <Card className="ai-scanner">
          <div className="flex items-center gap-4 py-8">
            <div className="w-12 h-12 rounded-xl bg-danger-100 text-danger-600 flex items-center justify-center">
              <AlertTriangle size={24} className="animate-pulse" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-900">AI scanning for contradictions...</p>
              <p className="text-xs text-slate-500 mt-0.5">Cross-referencing all witness statements across key topics</p>
              <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-danger-500 rounded-full w-3/4 animate-pulse-soft" />
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Common facts */}
          {(activeTab === 'all' || activeTab === 'common') && commonFacts.map((fact) => (
            <Card key={fact.id} hover className="border-success-200 bg-success-50/20 animate-fade-in">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-success-100 text-success-600 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">{fact.category}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="success" size="sm">Common Fact</Badge>
                        <Badge variant="neutral" size="sm">Consistent</Badge>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{fact.description}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Users size={13} className="text-slate-400" />
                    <span className="text-xs text-slate-500">Corroborated by:</span>
                    {fact.witnesses.map((w) => (
                      <Badge key={w} variant="neutral" size="sm">{w}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {/* Differences */}
          {(activeTab === 'all' || activeTab === 'differences') && differences.map((diff) => (
            <Card key={diff.id} hover className="border-warning-200 bg-warning-50/20 animate-fade-in">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-warning-100 text-warning-600 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">{diff.category}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="warning" size="sm">Difference</Badge>
                        <Badge variant="warning" size="sm">Requires Verification</Badge>
                        <Badge variant={diff.severity === 'medium' ? 'warning' : 'neutral'} size="sm">
                          {diff.severity === 'medium' ? 'Medium Severity' : 'Low Severity'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    {diff.witnessClaims.map((claim, ci) => (
                      <div key={ci} className="p-3 bg-white rounded-lg border border-slate-200">
                        <div className="flex items-center gap-2 mb-1.5">
                          <Users size={14} className="text-slate-400" />
                          <span className="text-xs font-semibold text-slate-700">{claim.witnessName}</span>
                        </div>
                        <p className="text-sm text-slate-600">{claim.claim}</p>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 bg-warning-50/50 rounded-lg flex gap-2">
                    <Sparkles size={14} className="text-warning-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-600">
                      <span className="font-semibold text-warning-800">AI Note: </span>{diff.note}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {/* Contradictions */}
          {(activeTab === 'all' || activeTab === 'contradictions') && items.map((c) => {
            const sev = severityConfig[c.severity];
            const stat = statusConfig[c.status];
            return (
              <Card key={c.id} hover className={cn(sev.bg, 'animate-fade-in')}>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-start gap-3">
                    <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0', sev.iconBg)}>
                      <AlertTriangle size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">{c.topic}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="danger" size="sm">Contradiction</Badge>
                        <Badge variant={sev.variant} size="sm">{sev.label} Severity</Badge>
                        <Badge variant={stat.variant} size="sm">{stat.label}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {c.status === 'unresolved' && (
                      <Button variant="ghost" size="sm" onClick={() => handleReview(c.id)}>
                        Mark Reviewed
                      </Button>
                    )}
                    <Button variant="secondary" size="sm" onClick={() => setSelected(c)}>
                      <Eye size={15} />
                      Details
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Users size={14} className="text-slate-400" />
                      <span className="text-xs font-semibold text-slate-700">{c.witness1Name}</span>
                    </div>
                    <p className="text-sm text-slate-600">{c.witness1Claim}</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Users size={14} className="text-slate-400" />
                      <span className="text-xs font-semibold text-slate-700">{c.witness2Name}</span>
                    </div>
                    <p className="text-sm text-slate-600">{c.witness2Claim}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock size={12} />
                  Detected {formatDateTime(c.detectedAt)}
                </p>
              </Card>
            );
          })}
        </div>
      )}

      {/* Detail modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? `Contradiction: ${selected.topic}` : ''}
        subtitle={selected ? `Severity: ${selected.severity} • Status: ${selected.status}` : ''}
        size="lg"
        footer={
          selected && (
            <>
              <Button variant="secondary" onClick={() => setSelected(null)}>
                <X size={16} />
                Close
              </Button>
              {selected.status !== 'resolved' && (
                <Button onClick={() => handleResolve(selected.id)}>
                  <CheckCircle2 size={18} />
                  Mark as Resolved
                </Button>
              )}
            </>
          )
        }
      >
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-semibold">
                    {selected.witness1Name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <span className="text-sm font-semibold text-slate-900">{selected.witness1Name}</span>
                </div>
                <p className="text-sm text-slate-600">{selected.witness1Claim}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-semibold">
                    {selected.witness2Name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <span className="text-sm font-semibold text-slate-900">{selected.witness2Name}</span>
                </div>
                <p className="text-sm text-slate-600">{selected.witness2Claim}</p>
              </div>
            </div>

            <div className="p-4 bg-primary-50/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={16} className="text-primary-600" />
                <h4 className="text-sm font-semibold text-slate-900">AI Explanation</h4>
              </div>
              <p className="text-sm text-slate-600">{selected.explanation}</p>
            </div>

            <div className="p-4 bg-warning-50 border border-warning-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <ArrowRight size={16} className="text-warning-600" />
                <h4 className="text-sm font-semibold text-slate-900">Recommended Action</h4>
              </div>
              <p className="text-sm text-slate-600">{selected.recommendation}</p>
            </div>

            <AIDisclaimer />
          </div>
        )}
      </Modal>

      <div className="mt-6">
        <AIDisclaimer />
      </div>
    </div>
  );
}
