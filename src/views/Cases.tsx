import { useState } from 'react';
import {
  Folders,
  Plus,
  MapPin,
  Calendar,
  User,
  FileText,
  AlertTriangle,
  Search,
  ChevronRight,
} from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import { Alert } from '@/components/ui/Alert';
import { sampleCase, witnesses, statements, contradictions } from '@/data/mockData';
import { formatDateTime } from '@/lib/utils';
import type { InvestigationCase, CasePriority } from '@/types';

interface CasesProps {
  onNavigate: (view: any) => void;
}

export function Cases({ onNavigate }: CasesProps) {
  const [showCreate, setShowCreate] = useState(false);
  const [cases, setCases] = useState<InvestigationCase[]>([sampleCase]);
  const [search, setSearch] = useState('');
  const [creating, setCreating] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    priority: 'medium' as CasePriority,
    leadInvestigator: 'Det. Sarah Brennan',
    incidentDate: '',
  });

  const filtered = cases.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.caseNumber.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = () => {
    setCreating(true);
    setTimeout(() => {
      const newCase: InvestigationCase = {
        id: `case-${Date.now()}`,
        caseNumber: `CASE-2024-${String(900 + cases.length).padStart(4, '0')}`,
        title: form.title || 'Untitled Case',
        description: form.description || 'No description provided.',
        status: 'open',
        priority: form.priority,
        location: form.location || 'Location TBD',
        incidentDate: form.incidentDate ? new Date(form.incidentDate).toISOString() : new Date().toISOString(),
        createdAt: new Date().toISOString(),
        leadInvestigator: form.leadInvestigator,
        witnesses: [],
        tags: [],
      };
      setCases([newCase, ...cases]);
      setCreating(false);
      setShowCreate(false);
      setSuccess(true);
      setForm({ title: '', description: '', location: '', priority: 'medium', leadInvestigator: 'Det. Sarah Brennan', incidentDate: '' });
      setTimeout(() => setSuccess(false), 4000);
    }, 1500);
  };

  const priorityVariant: Record<CasePriority, 'danger' | 'warning' | 'info' | 'neutral'> = {
    critical: 'danger',
    high: 'warning',
    medium: 'info',
    low: 'neutral',
  };

  return (
    <div>
      <PageHeader
        title="Investigation Cases"
        description="Create and manage investigation cases. Each case organizes witness statements, analysis, and reports."
        icon={<Folders size={22} />}
        action={
          <Button onClick={() => setShowCreate(true)}>
            <Plus size={18} />
            New Case
          </Button>
        }
      />

      {success && (
        <Alert variant="success" className="mb-5 animate-fade-in">
          <p>Case created successfully. You can now add witness statements and begin analysis.</p>
        </Alert>
      )}

      {/* Search */}
      <div className="mb-5 flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by case title or number..."
            className="input pl-11"
          />
        </div>
        <Badge variant="neutral" size="md">{filtered.length} case{filtered.length !== 1 && 's'}</Badge>
      </div>

      {/* Case cards */}
      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Folders size={28} />}
            title="No cases found"
            description="Try a different search term or create a new investigation case."
            action={<Button onClick={() => setShowCreate(true)}><Plus size={18} />New Case</Button>}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filtered.map((c) => {
            const caseWitnesses = witnesses.filter((w) => w.caseId === c.id);
            const caseStatements = statements.filter((s) => s.caseId === c.id);
            const caseContradictions = contradictions.filter((cr) => cr.caseId === c.id);

            return (
              <Card key={c.id} hover className="cursor-pointer" >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-700 flex items-center justify-center flex-shrink-0">
                      <Folders size={22} />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">{c.title}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{c.caseNumber}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 items-end">
                    <Badge variant={c.status === 'active' ? 'warning' : c.status === 'closed' ? 'neutral' : 'info'}>
                      {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                    </Badge>
                    <Badge variant={priorityVariant[c.priority]}>
                      {c.priority.charAt(0).toUpperCase() + c.priority.slice(1)} priority
                    </Badge>
                  </div>
                </div>

                <p className="text-sm text-slate-600 line-clamp-2 mb-4">{c.description}</p>

                <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                  <div className="flex items-center gap-2 text-slate-500">
                    <MapPin size={15} className="text-slate-400" />
                    <span className="truncate">{c.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <Calendar size={15} className="text-slate-400" />
                    <span>{formatDateTime(c.incidentDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <User size={15} className="text-slate-400" />
                    <span className="truncate">{c.leadInvestigator}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <FileText size={15} className="text-slate-400" />
                    <span>{caseStatements.length} statements</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {c.tags.map((tag) => (
                    <Badge key={tag} variant="neutral">{tag}</Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <User size={14} /> {caseWitnesses.length} witnesses
                    </span>
                    <span className="flex items-center gap-1.5">
                      <AlertTriangle size={14} /> {caseContradictions.length} contradictions
                    </span>
                  </div>
                  <button
                    onClick={() => onNavigate('statements')}
                    className="flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700"
                  >
                    Open case <ChevronRight size={14} />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create case modal */}
      <Modal
        open={showCreate}
        onClose={() => !creating && setShowCreate(false)}
        title="Create New Investigation Case"
        subtitle="Open a new case file to begin collecting witness statements"
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowCreate(false)} disabled={creating}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={creating || !form.title.trim()}>
              {creating ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus size={18} />
                  Create Case
                </>
              )}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="label">Case Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="input"
              placeholder="e.g. Downtown Shop Robbery"
            />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input min-h-[80px] resize-y"
              placeholder="Brief summary of the incident..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Incident Location</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="input"
                placeholder="e.g. 214 5th Avenue, Downtown"
              />
            </div>
            <div>
              <label className="label">Incident Date & Time</label>
              <input
                type="datetime-local"
                value={form.incidentDate}
                onChange={(e) => setForm({ ...form, incidentDate: e.target.value })}
                className="input"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Priority Level</label>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value as CasePriority })}
                className="input"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="label">Lead Investigator</label>
              <input
                type="text"
                value={form.leadInvestigator}
                onChange={(e) => setForm({ ...form, leadInvestigator: e.target.value })}
                className="input"
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
