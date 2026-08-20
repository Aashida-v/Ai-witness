import { useState } from 'react';
import {
  FileText,
  Plus,
  User,
  Eye,
  Clock,
  Sun,
  Heart,
  Tag,
  ListChecks,
  Sparkles,
  Search,
} from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ProgressBar, AIDisclaimer } from '@/components/ui/Alert';
import { EmptyState } from '@/components/ui/EmptyState';
import { useData } from '@/context/DataContext';
import { formatDateTime } from '@/lib/utils';
import type { WitnessStatement } from '@/types';

export function WitnessStatements() {
  const { statements, witnesses } = useData();
  const [selected, setSelected] = useState<WitnessStatement | null>(null);
  const [search, setSearch] = useState('');
  const [filterWitness, setFilterWitness] = useState<string>('all');
  const [showAdd, setShowAdd] = useState(false);
  const [analysing, setAnalysing] = useState(false);
  const [newStatement, setNewStatement] = useState('');

  const filtered = statements.filter((s) => {
    const matchSearch =
      s.witnessName.toLowerCase().includes(search.toLowerCase()) ||
      s.rawStatement.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filterWitness === 'all' || s.witnessId === filterWitness;
    return matchSearch && matchFilter;
  });

  const handleAnalyze = () => {
    setAnalysing(true);
    setTimeout(() => {
      setAnalysing(false);
      setShowAdd(false);
      setNewStatement('');
    }, 2000);
  };

  const statusVariant: Record<string, 'success' | 'warning' | 'neutral'> = {
    analyzed: 'success',
    recorded: 'warning',
    draft: 'neutral',
  };

  return (
    <div>
      <PageHeader
        title="Witness Statements"
        description="Recorded statements from witnesses interviewed for the active case. Each statement is processed by AI to extract key details and assess reliability."
        icon={<FileText size={22} />}
        action={
          <Button onClick={() => setShowAdd(true)}>
            <Plus size={18} />
            Add Statement
          </Button>
        }
      />

      {/* Filters */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search statements..."
            className="input pl-11"
          />
        </div>
        <select
          value={filterWitness}
          onChange={(e) => setFilterWitness(e.target.value)}
          className="input max-w-[200px]"
        >
          <option value="all">All witnesses</option>
          {witnesses.map((w) => (
            <option key={w.id} value={w.id}>{w.name}</option>
          ))}
        </select>
        <Badge variant="neutral" size="md">{filtered.length} statements</Badge>
      </div>

      {/* Statement cards */}
      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={<FileText size={28} />}
            title="No statements found"
            description="No statements match your search. Try adjusting filters or add a new statement."
            action={<Button onClick={() => setShowAdd(true)}><Plus size={18} />Add Statement</Button>}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filtered.map((s) => {
            const witness = witnesses.find((w) => w.id === s.witnessId);
            return (
              <Card key={s.id} hover className="cursor-pointer" >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold text-sm">
                      {s.witnessName.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">{s.witnessName}</h3>
                      <p className="text-xs text-slate-400">{witness?.occupation} • {witness?.relationship}</p>
                    </div>
                  </div>
                  <Badge variant={statusVariant[s.status]}>{s.status}</Badge>
                </div>

                <p className="text-sm text-slate-600 line-clamp-3 mb-3">{s.rawStatement}</p>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {s.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="neutral" size="sm">{tag}</Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Clock size={13} />{formatDateTime(s.recordedAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Reliability</span>
                    <span className={`text-sm font-semibold ${
                      s.reliabilityScore >= 75 ? 'text-success-600' : s.reliabilityScore >= 55 ? 'text-warning-600' : 'text-danger-600'
                    }`}>
                      {s.reliabilityScore}
                    </span>
                  </div>
                </div>

                <Button variant="secondary" className="w-full mt-3" onClick={() => setSelected(s)}>
                  <Eye size={16} />
                  View Full Statement
                </Button>
              </Card>
            );
          })}
        </div>
      )}

      {/* Statement detail modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.witnessName ? `${selected.witnessName} — Witness Statement` : 'Witness Statement'}
        subtitle={selected ? `Recorded ${formatDateTime(selected.recordedAt)}` : ''}
        size="xl"
      >
        {selected && (
          <div className="space-y-5">
            {/* Witness info */}
            {(() => {
              const w = witnesses.find((x) => x.id === selected.witnessId);
              if (!w) return null;
              return (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Age</p>
                    <p className="text-sm font-medium text-slate-700">{w.age}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Occupation</p>
                    <p className="text-sm font-medium text-slate-700">{w.occupation}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Relationship</p>
                    <p className="text-sm font-medium text-slate-700">{w.relationship}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Interview</p>
                    <p className="text-sm font-medium text-slate-700">{formatDateTime(w.interviewDate)}</p>
                  </div>
                </div>
              );
            })()}

            {/* Raw statement */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText size={16} className="text-primary-600" />
                <h4 className="text-sm font-semibold text-slate-900">Raw Statement</h4>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                {selected.rawStatement}
              </div>
            </div>

            {/* AI-extracted key details */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={16} className="text-primary-600" />
                <h4 className="text-sm font-semibold text-slate-900">AI-Extracted Key Details</h4>
                <Badge variant="info" size="sm">AI-assisted</Badge>
              </div>
              <div className="space-y-1.5">
                {selected.keyDetails.map((detail, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 flex-shrink-0" />
                    {detail}
                  </div>
                ))}
              </div>
            </div>

            {/* Observation conditions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Eye size={14} className="text-slate-400" />
                  <span className="text-xs text-slate-400 uppercase tracking-wide">Visibility</span>
                </div>
                <p className="text-sm text-slate-700">{selected.lightingConditions}</p>
              </div>
              <div className="p-3 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Tag size={14} className="text-slate-400" />
                  <span className="text-xs text-slate-400 uppercase tracking-wide">Distance</span>
                </div>
                <p className="text-sm text-slate-700">{selected.distanceFromScene}</p>
              </div>
              <div className="p-3 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Heart size={14} className="text-slate-400" />
                  <span className="text-xs text-slate-400 uppercase tracking-wide">Emotional State</span>
                </div>
                <p className="text-sm text-slate-700">{selected.emotionalState}</p>
              </div>
            </div>

            {/* Timeline events from statement */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ListChecks size={16} className="text-primary-600" />
                <h4 className="text-sm font-semibold text-slate-900">Extracted Timeline</h4>
              </div>
              <div className="space-y-2">
                {selected.timelineEvents.map((ev, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <span className="text-xs font-semibold text-primary-700 bg-primary-100 px-2 py-1 rounded">
                      {ev.time}
                    </span>
                    <p className="text-sm text-slate-700 flex-1">{ev.observation}</p>
                    <div className="flex items-center gap-2">
                      <div className="w-16"><ProgressBar value={ev.confidence} /></div>
                      <span className="text-xs text-slate-500 font-medium w-6 text-right">{ev.confidence}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reliability */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">AI Reliability Assessment</p>
                <p className="text-sm font-medium text-slate-700">
                  Level: <span className={`font-semibold ${
                    selected.reliabilityLevel === 'high' ? 'text-success-600' : selected.reliabilityLevel === 'medium' ? 'text-warning-600' : 'text-danger-600'
                  }`}>{selected.reliabilityLevel.toUpperCase()}</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-slate-900">{selected.reliabilityScore}</p>
                <p className="text-xs text-slate-400">/ 100</p>
              </div>
            </div>

            <AIDisclaimer />
          </div>
        )}
      </Modal>

      {/* Add statement modal */}
      <Modal
        open={showAdd}
        onClose={() => !analysing && setShowAdd(false)}
        title="Add Witness Statement"
        subtitle="Record a new witness statement. AI will extract key details and assess reliability."
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowAdd(false)} disabled={analysing}>Cancel</Button>
            <Button onClick={handleAnalyze} disabled={analysing || !newStatement.trim()}>
              {analysing ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  AI analyzing...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Record & Analyze
                </>
              )}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="label">Select Witness</label>
            <select className="input">
              <option>Select a witness...</option>
              {witnesses.map((w) => (
                <option key={w.id} value={w.id}>{w.name} — {w.occupation}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Statement Transcript</label>
            <textarea
              value={newStatement}
              onChange={(e) => setNewStatement(e.target.value)}
              className="input min-h-[160px] resize-y"
              placeholder="Type or paste the witness's statement here..."
            />
            <p className="text-xs text-slate-400 mt-1.5">
              The AI will extract key details, build a timeline, and assess reliability once submitted.
            </p>
          </div>
          {analysing && (
            <div className="p-4 bg-primary-50 rounded-lg ai-scanner">
              <div className="flex items-center gap-3">
                <Sparkles size={18} className="text-primary-600 animate-pulse" />
                <div>
                  <p className="text-sm font-medium text-primary-800">AI processing statement...</p>
                  <p className="text-xs text-primary-600 mt-0.5">Extracting key details, building timeline, assessing reliability</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
