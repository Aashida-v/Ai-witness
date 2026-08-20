import { useState } from 'react';
import {
  GitCompareArrows,
  Check,
  X,
  AlertTriangle,
  ArrowLeftRight,
  Loader2,
  Sparkles,
  Users,
} from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { AIDisclaimer } from '@/components/ui/Alert';
import { comparisonRows } from '@/data/member2Data';
import { witnesses } from '@/data/mockData';
import { cn } from '@/lib/utils';
import type { ComparisonClassification, ComparisonRow } from '@/types';

const classificationConfig: Record<ComparisonClassification, { label: string; icon: React.ReactNode; cellClass: string; badgeVariant: 'success' | 'warning' | 'danger' }> = {
  common: { label: 'Common', icon: <Check size={14} />, cellClass: 'bg-success-50/40 border-success-200', badgeVariant: 'success' },
  difference: { label: 'Difference', icon: <AlertTriangle size={14} />, cellClass: 'bg-warning-50/40 border-warning-200', badgeVariant: 'warning' },
  contradiction: { label: 'Contradiction', icon: <X size={14} />, cellClass: 'bg-danger-50/40 border-danger-200', badgeVariant: 'danger' },
};

export function Comparison() {
  const [selectedWitnesses, setSelectedWitnesses] = useState<string[]>([
    witnesses[0].id,
    witnesses[1].id,
  ]);
  const [comparing, setComparing] = useState(false);
  const [compared, setCompared] = useState(false);

  const toggleWitness = (id: string) => {
    setSelectedWitnesses((prev) => {
      if (prev.includes(id)) {
        if (prev.length <= 2) return prev;
        return prev.filter((w) => w !== id);
      }
      if (prev.length >= 4) return prev;
      return [...prev, id];
    });
  };

  const selectedWitnessObjects = witnesses.filter((w) => selectedWitnesses.includes(w.id));

  const handleCompare = () => {
    setComparing(true);
    setTimeout(() => {
      setComparing(false);
      setCompared(true);
      setTimeout(() => setCompared(false), 4000);
    }, 2000);
  };

  const stats = {
    common: comparisonRows.filter((r) => r.classification === 'common').length,
    difference: comparisonRows.filter((r) => r.classification === 'difference').length,
    contradiction: comparisonRows.filter((r) => r.classification === 'contradiction').length,
  };

  return (
    <div>
      <PageHeader
        title="Witness Comparison"
        description="Side-by-side comparison of what each witness reported across key topics. Information is automatically classified as common (green), difference requiring verification (orange), or contradiction (red)."
        icon={<GitCompareArrows size={22} />}
        action={
          <Button onClick={handleCompare} disabled={comparing || selectedWitnesses.length < 2}>
            {comparing ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Comparing...
              </>
            ) : (
              <>
                <GitCompareArrows size={18} />
                Compare Witnesses
              </>
            )}
          </Button>
        }
      />

      {compared && (
        <div className="mb-5 p-4 bg-success-50 border border-success-200 rounded-lg animate-fade-in flex items-center gap-3">
          <Check size={18} className="text-success-600" />
          <p className="text-sm text-success-800">Comparison complete. {stats.common} common facts, {stats.difference} differences, {stats.contradiction} contradictions identified.</p>
        </div>
      )}

      {/* Witness selector */}
      <Card className="mb-5">
        <CardHeader
          title="Select Witnesses to Compare"
          subtitle={`Select 2–4 witnesses (currently ${selectedWitnesses.length} selected)`}
          icon={<Users size={20} />}
        />
        <div className="flex flex-wrap gap-2">
          {witnesses.map((w) => {
            const isSelected = selectedWitnesses.includes(w.id);
            const isLocked = isSelected && selectedWitnesses.length <= 2;
            return (
              <button
                key={w.id}
                onClick={() => toggleWitness(w.id)}
                className={cn(
                  'flex items-center gap-2.5 px-4 py-2.5 rounded-lg border-2 transition-all',
                  isSelected
                    ? 'border-primary-500 bg-primary-50/50'
                    : 'border-slate-200 hover:border-slate-300',
                  isLocked && 'cursor-not-allowed opacity-75'
                )}
                title={isLocked ? 'At least 2 witnesses required' : undefined}
              >
                <div className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold',
                  isSelected ? 'bg-primary-100 text-primary-700' : 'bg-slate-100 text-slate-500'
                )}>
                  {w.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <span className="text-sm font-medium text-slate-900">{w.name}</span>
                {isSelected && <Check size={14} className="text-primary-600" />}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        <Card className="text-center py-4">
          <div className="w-10 h-10 rounded-lg bg-success-50 text-success-600 flex items-center justify-center mx-auto mb-2">
            <Check size={18} />
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.common}</p>
          <p className="text-xs text-slate-500">Common Facts</p>
        </Card>
        <Card className="text-center py-4">
          <div className="w-10 h-10 rounded-lg bg-warning-50 text-warning-600 flex items-center justify-center mx-auto mb-2">
            <AlertTriangle size={18} />
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.difference}</p>
          <p className="text-xs text-slate-500">Differences</p>
        </Card>
        <Card className="text-center py-4">
          <div className="w-10 h-10 rounded-lg bg-danger-50 text-danger-600 flex items-center justify-center mx-auto mb-2">
            <X size={18} />
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.contradiction}</p>
          <p className="text-xs text-slate-500">Contradictions</p>
        </Card>
      </div>

      {/* Comparison table */}
      {comparing ? (
        <Card className="ai-scanner">
          <div className="flex items-center gap-4 py-8">
            <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center">
              <GitCompareArrows size={24} className="animate-pulse" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-900">AI comparing witness statements...</p>
              <p className="text-xs text-slate-500 mt-0.5">Cross-referencing {comparisonRows.length} topics across {selectedWitnessObjects.length} witnesses</p>
              <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary-500 rounded-full w-3/4 animate-pulse-soft" />
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <Card>
          <CardHeader
            title="Comparison Table"
            subtitle={`${comparisonRows.length} topics compared across ${selectedWitnessObjects.length} witnesses`}
            icon={<GitCompareArrows size={20} />}
          />

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 mb-4 pb-3 border-b border-slate-100">
            {(Object.entries(classificationConfig) as [ComparisonClassification, typeof classificationConfig[ComparisonClassification]][]).map(([key, config]) => (
              <div key={key} className="flex items-center gap-2">
                <span className={cn('w-4 h-4 rounded border', config.cellClass)} />
                <span className="text-xs text-slate-600">{config.label}</span>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-x-auto -mx-1 px-1">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide py-3 px-3 border-b-2 border-slate-200 min-w-[140px]">
                    Topic
                  </th>
                  {selectedWitnessObjects.map((w) => (
                    <th key={w.id} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide py-3 px-3 border-b-2 border-slate-200 min-w-[160px]">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-[10px] font-semibold flex-shrink-0">
                          {w.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <span className="text-slate-700">{w.name}</span>
                      </div>
                    </th>
                  ))}
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide py-3 px-3 border-b-2 border-slate-200 min-w-[100px]">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => {
                  const config = classificationConfig[row.classification];
                  return (
                    <tr key={i} className="group animate-fade-in" style={{ animationDelay: `${i * 40}ms` }}>
                      <td className="py-3 px-3 border-b border-slate-100">
                        <span className="text-sm font-semibold text-slate-900">{row.topic}</span>
                      </td>
                      {selectedWitnessObjects.map((w) => (
                        <td key={w.id} className={cn('py-3 px-3 border-b border-slate-100 border-l-2', config.cellClass)}>
                          <span className="text-sm text-slate-700">{row.values[w.name] || 'Not reported'}</span>
                        </td>
                      ))}
                      <td className="py-3 px-3 border-b border-slate-100">
                        <Badge variant={config.badgeVariant} size="sm">
                          {config.icon}
                          {config.label}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* AI notes */}
          <div className="mt-4 space-y-2">
            {comparisonRows.map((row, i) => (
              <div key={i} className={cn(
                'p-3 rounded-lg border flex items-start gap-2',
                row.classification === 'common' ? 'border-success-200 bg-success-50/30' :
                row.classification === 'difference' ? 'border-warning-200 bg-warning-50/30' :
                'border-danger-200 bg-danger-50/30'
              )}>
                <Sparkles size={14} className={cn(
                  'flex-shrink-0 mt-0.5',
                  row.classification === 'common' ? 'text-success-600' :
                  row.classification === 'difference' ? 'text-warning-600' :
                  'text-danger-600'
                )} />
                <div>
                  <span className="text-xs font-semibold text-slate-700">{row.topic}: </span>
                  <span className="text-xs text-slate-600">{row.note}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="mt-6">
        <AIDisclaimer />
      </div>
    </div>
  );
}
