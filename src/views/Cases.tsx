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
  QrCode,
  UserPlus,
  Check,
} from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import { Alert } from '@/components/ui/Alert';
import { QRCodeModal } from '@/components/QRCodeModal';
import { useData } from '@/context/DataContext';
import { formatDateTime } from '@/lib/utils';
import type { InvestigationCase, CasePriority, Witness } from '@/types';

interface CasesProps {
  onNavigate: (view: any) => void;
}

export function Cases({ onNavigate }: CasesProps) {
  const { cases, witnesses, statements, contradictions, addCase, addWitness } = useData();

  const [showCreate, setShowCreate] = useState(false);
  const [showAddWitness, setShowAddWitness] = useState<string | null>(null); // caseId
  const [selectedQRWitness, setSelectedQRWitness] = useState<{ witness: Witness; caseTitle: string } | null>(null);
  const [search, setSearch] = useState('');
  const [creating, setCreating] = useState(false);
  const [success, setSuccess] = useState('');

  // New Case Form
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    priority: 'medium' as CasePriority,
    leadInvestigator: 'Det. Sarah Brennan',
    incidentDate: '',
  });

  // New Witness Form
  const [witnessForm, setWitnessForm] = useState({
    name: '',
    age: 30,
    occupation: 'Eyewitness',
    relationship: 'Bystander',
    contactInfo: '',
    interviewLocation: 'Scene / Online Portal',
  });

  const filtered = cases.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.caseNumber.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateCase = () => {
    if (!form.title.trim()) return;
    setCreating(true);
    setTimeout(() => {
      const created = addCase({
        title: form.title.trim(),
        description: form.description.trim() || 'No description provided.',
        status: 'open',
        priority: form.priority,
        location: form.location.trim() || 'Location TBD',
        incidentDate: form.incidentDate ? new Date(form.incidentDate).toISOString() : new Date().toISOString(),
        leadInvestigator: form.leadInvestigator || 'Det. Sarah Brennan',
      });

      setCreating(false);
      setShowCreate(false);
      setSuccess(`Case "${created.title}" created successfully and saved.`);
      setForm({ title: '', description: '', location: '', priority: 'medium', leadInvestigator: 'Det. Sarah Brennan', incidentDate: '' });
      setTimeout(() => setSuccess(''), 4000);
    }, 500);
  };

  const handleAddWitnessSubmit = () => {
    if (!witnessForm.name.trim() || !showAddWitness) return;
    const targetCase = cases.find((c) => c.id === showAddWitness);
    const caseTitle = targetCase ? targetCase.title : 'Active Case';

    const newWitness = addWitness({
      caseId: showAddWitness,
      name: witnessForm.name.trim(),
      age: witnessForm.age || 30,
      occupation: witnessForm.occupation || 'Eyewitness',
      relationship: witnessForm.relationship || 'Bystander',
      contactInfo: witnessForm.contactInfo || 'witness@investigation.gov',
      interviewLocation: witnessForm.interviewLocation || 'Online Witness Portal',
    });

    setShowAddWitness(null);
    setWitnessForm({ name: '', age: 30, occupation: 'Eyewitness', relationship: 'Bystander', contactInfo: '', interviewLocation: 'Scene / Online Portal' });

    // Open QR Code modal for the new witness!
    setSelectedQRWitness({ witness: newWitness, caseTitle });
  };

  const getQRUrl = (w: Witness) => {
    const origin = window.location.origin + window.location.pathname;
    return `${origin}?view=witness-portal&witnessId=${w.id}&caseId=${w.caseId}`;
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
        description="Create and manage investigation cases. Add witnesses and generate unique QR codes for instant statement collection."
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
          <p>{success}</p>
        </Alert>
      )}

      {/* Search Bar */}
      <div className="mb-5 flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by case title or case number..."
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
              <Card key={c.id} hover className="flex flex-col justify-between">
                <div>
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

                  {/* Witnesses List & QR Buttons */}
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Witnesses ({caseWitnesses.length})
                      </span>
                      <button
                        onClick={() => setShowAddWitness(c.id)}
                        className="flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700"
                      >
                        <UserPlus size={14} /> Add Witness & QR
                      </button>
                    </div>

                    {caseWitnesses.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No witnesses added to this case yet.</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {caseWitnesses.map((w) => (
                          <div
                            key={w.id}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700"
                          >
                            <User size={13} className="text-slate-400" />
                            <span className="font-medium">{w.name}</span>
                            <Badge variant={w.status === 'submitted' ? 'success' : 'warning'} size="sm">
                              {w.status === 'submitted' ? 'Statement Done' : 'Pending'}
                            </Badge>
                            <button
                              onClick={() => setSelectedQRWitness({ witness: w, caseTitle: c.title })}
                              title="Show Witness QR Code"
                              className="ml-1 p-1 text-primary-600 hover:bg-primary-50 rounded"
                            >
                              <QrCode size={13} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <User size={14} /> {caseWitnesses.length} witnesses
                    </span>
                    <span className="flex items-center gap-1.5">
                      <AlertTriangle size={14} /> {caseContradictions.length} contradictions
                    </span>
                  </div>
                  <button
                    onClick={() => onNavigate('comparison')}
                    className="flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700"
                  >
                    Compare Witnesses <ChevronRight size={14} />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create Case Modal */}
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
            <Button onClick={handleCreateCase} disabled={creating || !form.title.trim()}>
              {creating ? 'Creating...' : 'Create Case'}
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
              placeholder="e.g. Downtown Jewelry Heist"
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
                placeholder="e.g. 5th Avenue & 42nd St"
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

      {/* Add Witness & Generate QR Modal */}
      <Modal
        open={!!showAddWitness}
        onClose={() => setShowAddWitness(null)}
        title="Add Witness & Generate QR Code"
        subtitle="Register a witness for this case to generate their unique statement QR Code"
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowAddWitness(null)}>
              Cancel
            </Button>
            <Button onClick={handleAddWitnessSubmit} disabled={!witnessForm.name.trim()}>
              <QrCode size={16} />
              Generate QR Code
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="label">Witness Full Name *</label>
            <input
              type="text"
              value={witnessForm.name}
              onChange={(e) => setWitnessForm({ ...witnessForm, name: e.target.value })}
              className="input"
              placeholder="e.g. Marcus Vance"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Age</label>
              <input
                type="number"
                value={witnessForm.age}
                onChange={(e) => setWitnessForm({ ...witnessForm, age: parseInt(e.target.value) || 30 })}
                className="input"
              />
            </div>
            <div>
              <label className="label">Role / Relationship</label>
              <input
                type="text"
                value={witnessForm.relationship}
                onChange={(e) => setWitnessForm({ ...witnessForm, relationship: e.target.value })}
                className="input"
                placeholder="e.g. Store Manager, Bystander"
              />
            </div>
          </div>
          <div>
            <label className="label">Contact Info / Email</label>
            <input
              type="text"
              value={witnessForm.contactInfo}
              onChange={(e) => setWitnessForm({ ...witnessForm, contactInfo: e.target.value })}
              className="input"
              placeholder="e.g. +1 (555) 234-5678"
            />
          </div>
        </div>
      </Modal>

      {/* QR Code Viewer Modal */}
      {selectedQRWitness && (
        <QRCodeModal
          open={!!selectedQRWitness}
          onClose={() => setSelectedQRWitness(null)}
          witnessName={selectedQRWitness.witness.name}
          caseTitle={selectedQRWitness.caseTitle}
          qrUrl={getQRUrl(selectedQRWitness.witness)}
        />
      )}
    </div>
  );
}
