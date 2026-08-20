import { useState, useMemo } from 'react';
import {
  GitCompareArrows,
  Check,
  X,
  AlertTriangle,
  Loader2,
  Sparkles,
  Users,
  ShieldCheck,
  FileText,
  Folders,
} from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { AIDisclaimer } from '@/components/ui/Alert';
import { useData } from '@/context/DataContext';
import { comparisonRows as defaultComparisonRows } from '@/data/member2Data';
import { cn } from '@/lib/utils';
import type { ComparisonClassification, ComparisonRow, Witness, WitnessStatement } from '@/types';

const classificationConfig: Record<ComparisonClassification, { label: string; icon: React.ReactNode; cellClass: string; badgeVariant: 'success' | 'warning' | 'danger' }> = {
  common: { label: 'Common Fact', icon: <Check size={14} />, cellClass: 'bg-emerald-50/40 border-emerald-200', badgeVariant: 'success' },
  difference: { label: 'Difference', icon: <AlertTriangle size={14} />, cellClass: 'bg-amber-50/40 border-amber-200', badgeVariant: 'warning' },
  contradiction: { label: 'Contradiction', icon: <X size={14} />, cellClass: 'bg-rose-50/40 border-rose-200', badgeVariant: 'danger' },
};

export function Comparison() {
  const { cases, witnesses, statements, getWitnessesForCase, getStatementsForCase } = useData();

  const [selectedCaseId, setSelectedCaseId] = useState<string>(cases[0]?.id || 'case-1');
  const activeCase = cases.find((c) => c.id === selectedCaseId) || cases[0];

  const caseWitnesses = useMemo(() => getWitnessesForCase(selectedCaseId), [selectedCaseId, witnesses]);
  const caseStatements = useMemo(() => getStatementsForCase(selectedCaseId), [selectedCaseId, statements]);

  const [selectedWitnessIds, setSelectedWitnessIds] = useState<string[]>([]);
  const [comparing, setComparing] = useState(false);
  const [compared, setCompared] = useState(false);

  // Default selection when case changes
  useMemo(() => {
    const ids = caseWitnesses.map((w) => w.id);
    setSelectedWitnessIds(ids.slice(0, 4));
  }, [selectedCaseId, caseWitnesses.length]);

  const toggleWitness = (id: string) => {
    setSelectedWitnessIds((prev) => {
      if (prev.includes(id)) {
        if (prev.length <= 1) return prev;
        return prev.filter((w) => w !== id);
      }
      if (prev.length >= 4) return prev;
      return [...prev, id];
    });
  };

  const selectedWitnessObjects = caseWitnesses.filter((w) => selectedWitnessIds.includes(w.id));

  // Dynamic Comparison Generation
  const activeComparisonRows = useMemo(() => {
    if (selectedCaseId === 'case-1' && caseWitnesses.length <= 3 && caseStatements.length <= 3) {
      return defaultComparisonRows;
    }

    // Build dynamic rows from witness statements for newly added officer cases
    const topics = ['Incident Time & Sequence', 'Location & Scene Positioning', 'Suspect Description & Attire', 'Getaway Vehicle & Direction'];
    const rows: ComparisonRow[] = [];

    topics.forEach((topic) => {
      const values: Record<string, string> = {};
      selectedWitnessObjects.forEach((w) => {
        const stmt = caseStatements.find((s) => s.witnessId === w.id);
        if (!stmt) {
          values[w.name] = 'Statement Pending';
        } else if (topic.includes('Time')) {
          values[w.name] = stmt.rawStatement.slice(0, 70) + '...';
        } else if (topic.includes('Location')) {
          values[w.name] = stmt.distanceFromScene || 'Observed from nearby location';
        } else if (topic.includes('Suspect')) {
          const detail = stmt.keyDetails.find((d) => d.includes('people') || d.includes('Suspect')) || stmt.rawStatement.slice(0, 60);
          values[w.name] = detail;
        } else {
          const veh = stmt.keyDetails.find((d) => d.includes('vehicles') || d.includes('car')) || 'Dark getaway vehicle fleeing scene';
          values[w.name] = veh;
        }
      });

      // Heuristic classification
      const uniqueVals = new Set(Object.values(values));
      const classification: ComparisonClassification = uniqueVals.size === 1 ? 'common' : uniqueVals.size === 2 ? 'difference' : 'contradiction';

      rows.push({
        topic,
        values,
        classification,
        note: classification === 'common'
          ? 'All selected witnesses provide consistent accounts for this topic.'
          : classification === 'difference'
          ? 'Minor variations in observation details requiring officer verification.'
          : 'Significant discrepancy detected between witness statements.',
      });
    });

    return rows;
  }, [selectedCaseId, selectedWitnessObjects, caseStatements]);

  const handleCompare = () => {
    setComparing(true);
    setTimeout(() => {
      setComparing(false);
      setCompared(true);
      setTimeout(() => setCompared(false), 4000);
    }, 1500);
  };

  const stats = {
    common: activeComparisonRows.filter((r) => r.classification === 'common').length,
    difference: activeComparisonRows.filter((r) => r.classification === 'difference').length,
    contradiction: activeComparisonRows.filter((r) => r.classification === 'contradiction').length,
  };

  return (
    <div>
      <PageHeader
        title="Multi-Witness Comparison & AI Analysis"
        description="Compare witness statements side-by-side across confidence, commonalities, differences, and AI cross-examination summaries."
        icon={<GitCompareArrows size={22} />}
        action={
          <Button onClick={handleCompare} disabled={comparing || selectedWitnessIds.length < 1}>
            {comparing ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Analyzing Statements...
              </>
            ) : (
              <>
                <GitCompareArrows size={18} />
                Run AI Multi-Witness Comparison
              </>
            )}
          </Button>
        }
      />

      {compared && (
        <div className="mb-5 p-4 bg-emerald-50 border border-emerald-200 rounded-xl animate-fade-in flex items-center gap-3">
          <Check size={18} className="text-emerald-600" />
          <p className="text-sm text-emerald-900 font-medium">
            AI Comparison complete. {stats.common} agreed facts, {stats.difference} verified differences, and {stats.contradiction} contradictions identified.
          </p>
        </div>
      )}

      {/* Case Selector Dropdown */}
      <Card className="mb-5 p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-700 flex items-center justify-center flex-shrink-0">
              <Folders size={20} />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Select Case for Comparison</label>
              <h3 className="text-base font-bold text-slate-900">{activeCase?.title}</h3>
            </div>
          </div>

          <select
            value={selectedCaseId}
            onChange={(e) => setSelectedCaseId(e.target.value)}
            className="input max-w-xs text-sm font-semibold"
          >
            {cases.map((c) => (
              <option key={c.id} value={c.id}>
                {c.caseNumber} - {c.title}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Witness Selector Cards */}
      <Card className="mb-5">
        <CardHeader
          title="Select Witnesses to Compare"
          subtitle={`Select up to 4 witnesses for side-by-side analysis (${selectedWitnessIds.length} selected)`}
          icon={<Users size={20} />}
        />

        {caseWitnesses.length === 0 ? (
          <p className="text-sm text-slate-500 italic p-3">No witnesses registered for this case yet. Add witnesses under the Cases view.</p>
        ) : (
          <div className="flex flex-wrap gap-2.5">
            {caseWitnesses.map((w) => {
              const isSelected = selectedWitnessIds.includes(w.id);
              const stmt = caseStatements.find((s) => s.witnessId === w.id);
              return (
                <button
                  key={w.id}
                  onClick={() => toggleWitness(w.id)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-2.5 rounded-xl border-2 transition-all text-left',
                    isSelected
                      ? 'border-primary-500 bg-primary-50/50 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  )}
                >
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold',
                      isSelected ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-500'
                    )}
                  >
                    {w.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-slate-900 block">{w.name}</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Badge variant={w.status === 'submitted' || stmt ? 'success' : 'warning'} size="sm">
                        {stmt ? 'Statement Done' : 'Pending'}
                      </Badge>
                      {stmt && (
                        <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-0.5">
                          <ShieldCheck size={12} /> {stmt.reliabilityScore}% Conf.
                        </span>
                      )}
                    </div>
                  </div>
                  {isSelected && <Check size={16} className="text-primary-600 ml-auto" />}
                </button>
              );
            })}
          </div>
        )}
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        <Card className="text-center py-4 bg-emerald-50/40 border-emerald-200">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2">
            <Check size={20} />
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.common}</p>
          <p className="text-xs font-semibold text-emerald-800">Agreed Common Facts</p>
        </Card>

        <Card className="text-center py-4 bg-amber-50/40 border-amber-200">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-2">
            <AlertTriangle size={20} />
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.difference}</p>
          <p className="text-xs font-semibold text-amber-800">Verified Differences</p>
        </Card>

        <Card className="text-center py-4 bg-rose-50/40 border-rose-200">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto mb-2">
            <X size={20} />
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.contradiction}</p>
          <p className="text-xs font-semibold text-rose-800">Major Contradictions</p>
        </Card>
      </div>

      {/* Main Matrix Table */}
      {comparing ? (
        <Card className="ai-scanner p-8 text-center">
          <div className="flex flex-col items-center justify-center gap-3">
            <GitCompareArrows size={36} className="text-primary-600 animate-spin" />
            <h3 className="text-base font-bold text-slate-900">Cross-Referencing Witness Statements...</h3>
            <p className="text-xs text-slate-500 max-w-sm">
              Analyzing temporal alignment, visual observation angles, suspect descriptions, and reliability weights.
            </p>
          </div>
        </Card>
      ) : (
        <Card>
          <CardHeader
            title="Side-by-Side Witness Matrix"
            subtitle={`Comparing ${activeComparisonRows.length} topics across ${selectedWitnessObjects.length} witness testimonies`}
            icon={<GitCompareArrows size={20} />}
          />

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide py-3 px-3 border-b-2 border-slate-200 min-w-[160px]">
                    Key Topic
                  </th>
                  {selectedWitnessObjects.map((w) => {
                    const stmt = caseStatements.find((s) => s.witnessId === w.id);
                    return (
                      <th key={w.id} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide py-3 px-3 border-b-2 border-slate-200 min-w-[200px]">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-[10px] font-bold">
                            {w.name.split(' ').map((n) => n[0]).join('')}
                          </div>
                          <div>
                            <span className="text-slate-900 font-bold block">{w.name}</span>
                            <span className="text-[10px] text-slate-400 font-normal">{stmt ? `${stmt.reliabilityScore}% Reliability` : 'Pending'}</span>
                          </div>
                        </div>
                      </th>
                    );
                  })}
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide py-3 px-3 border-b-2 border-slate-200 min-w-[120px]">
                    Classification
                  </th>
                </tr>
              </thead>
              <tbody>
                {activeComparisonRows.map((row, i) => {
                  const config = classificationConfig[row.classification];
                  return (
                    <tr key={i} className="group border-b border-slate-100 hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-3">
                        <span className="text-sm font-semibold text-slate-900 block">{row.topic}</span>
                      </td>
                      {selectedWitnessObjects.map((w) => (
                        <td key={w.id} className={cn('py-3.5 px-3 border-l-2', config.cellClass)}>
                          <span className="text-xs text-slate-800 leading-relaxed font-medium">
                            {row.values[w.name] || 'Not reported in statement'}
                          </span>
                        </td>
                      ))}
                      <td className="py-3.5 px-3">
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

          {/* AI Investigative Synthesis Summary */}
          <div className="mt-6 p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100 space-y-3">
            <div className="flex items-center gap-2 text-primary-400">
              <Sparkles size={18} />
              <h4 className="text-sm font-bold uppercase tracking-wider text-white">
                AI Cross-Examination Synthesis & Summary Report
              </h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Based on the statements recorded for <strong>{activeCase?.title}</strong>, witness accounts present a <strong>{stats.common > stats.contradiction ? 'high consensus' : 'moderate conflict'}</strong> regarding event timeline and flee trajectory.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                <span className="font-bold text-emerald-400 block mb-1">Key Consensual Facts:</span>
                <ul className="list-disc list-inside text-slate-300 space-y-1">
                  <li>Incident occurred during night hours with active street light illumination.</li>
                  <li>Getaway vehicle fled north towards main intersection.</li>
                </ul>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                <span className="font-bold text-amber-400 block mb-1">Recommended Follow-up Actions:</span>
                <ul className="list-disc list-inside text-slate-300 space-y-1">
                  <li>Request camera footage from 5th Avenue intersection to clarify vehicle color.</li>
                  <li>Cross-examine witness regarding suspect height & jacket color discrepancies.</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      )}

      <div className="mt-6">
        <AIDisclaimer />
      </div>
    </div>
  );
}
