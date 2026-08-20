import { useState, useRef } from 'react';
import {
  FileText,
  Mic,
  Upload,
  Save,
  User,
  UserCog,
  Plus,
  CheckCircle2,
  Loader2,
  Sparkles,
  ArrowRight,
  Trash2,
  Play,
  Square,
  FileAudio,
  AlertCircle,
} from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Alert, AIDisclaimer } from '@/components/ui/Alert';
import { EmptyState } from '@/components/ui/EmptyState';
import { collectedStatements } from '@/data/member1Data';
import { sampleCase } from '@/data/mockData';
import { formatDateTime, cn } from '@/lib/utils';
import type { ViewId, InputMethod } from '@/types';

interface WitnessStatementCollectionProps {
  onNavigate: (view: ViewId) => void;
}

interface WitnessDraft {
  slot: number;
  label: string;
  isAnonymous: boolean;
  statement: string;
  inputMethod: InputMethod;
  audioFileName?: string;
  isRecording: boolean;
}

const sampleTranscriptions = [
  'I was walking past the store around 9 PM when I heard shouting from inside. I looked through the window and saw two men. One was tall wearing a dark hoodie, the other was shorter with a red hat. I saw the tall one holding something shiny — maybe a gun. They grabbed stuff from behind the counter and ran out to a dark car parked on the street. They drove off heading north. I stayed back because I did not want to get involved.',
  'I live in the apartment above the pharmacy next door. I heard a loud noise around 9:15. I looked out my window and saw two people running from the store to a dark car. The car was an older sedan. They got in and drove north on 5th Avenue. I could not see their faces. One was wearing a hoodie, the other had a red cap.',
  'I was at the bus stop across the street. I saw two guys run out of the convenience store and get into a car. It happened really fast. The car was dark colored, maybe a Honda. They went north. I noticed one guy was tall with a hoodie and the other was shorter. That is all I really saw.',
];

export function WitnessStatementCollection({ onNavigate }: WitnessStatementCollectionProps) {
  const [selectedCaseId, setSelectedCaseId] = useState(sampleCase.id);
  const [drafts, setDrafts] = useState<WitnessDraft[]>([
    { slot: 1, label: '', isAnonymous: false, statement: '', inputMethod: 'text', isRecording: false },
  ]);
  const [activeSlot, setActiveSlot] = useState(1);
  const [saving, setSaving] = useState<number | null>(null);
  const [savedSlots, setSavedSlots] = useState<Set<number>>(new Set());
  const [uploading, setUploading] = useState<number | null>(null);
  const [transcribing, setTranscribing] = useState<number | null>(null);
  const [successMsg, setSuccessMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadTargetSlot = useRef<number>(0);

  const availableCases = [sampleCase];

  const activeDraft = drafts.find((d) => d.slot === activeSlot)!;

  const updateDraft = (slot: number, updates: Partial<WitnessDraft>) => {
    setDrafts((prev) => prev.map((d) => (d.slot === slot ? { ...d, ...updates } : d)));
  };

  const addWitnessSlot = () => {
    if (drafts.length >= 3) return;
    const nextSlot = drafts.length + 1;
    setDrafts([...drafts, { slot: nextSlot, label: '', isAnonymous: false, statement: '', inputMethod: 'text', isRecording: false }]);
    setActiveSlot(nextSlot);
  };

  const removeWitnessSlot = (slot: number) => {
    setDrafts((prev) => prev.filter((d) => d.slot !== slot));
    setSavedSlots((prev) => { const next = new Set(prev); next.delete(slot); return next; });
    if (activeSlot === slot && drafts.length > 1) {
      setActiveSlot(drafts.find((d) => d.slot !== slot)!.slot);
    }
  };

  const handleToggleRecord = (slot: number) => {
    const draft = drafts.find((d) => d.slot === slot)!;
    if (draft.isRecording) {
      updateDraft(slot, { isRecording: false });
      setTranscribing(slot);
      setTimeout(() => {
        const sample = sampleTranscriptions[slot - 1] || sampleTranscriptions[0];
        updateDraft(slot, { statement: draft.statement ? draft.statement + ' ' + sample : sample, inputMethod: 'voice' });
        setTranscribing(null);
      }, 2000);
    } else {
      updateDraft(slot, { isRecording: true, inputMethod: 'voice' });
    }
  };

  const handleFileUpload = (slot: number, file: File) => {
    setUploading(slot);
    setTimeout(() => {
      updateDraft(slot, { audioFileName: file.name, inputMethod: 'audio-upload' });
      setUploading(null);
      const sample = sampleTranscriptions[slot - 1] || sampleTranscriptions[0];
      updateDraft(slot, { statement: sample });
      setSuccessMsg(`Audio file "${file.name}" uploaded and transcribed (simulated).`);
      setTimeout(() => setSuccessMsg(''), 4000);
    }, 1800);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(uploadTargetSlot.current, file);
    e.target.value = '';
  };

  const triggerFileUpload = (slot: number) => {
    uploadTargetSlot.current = slot;
    fileInputRef.current?.click();
  };

  const handleSave = (slot: number) => {
    const draft = drafts.find((d) => d.slot === slot)!;
    if (!draft.statement.trim()) return;
    setSaving(slot);
    setTimeout(() => {
      setSaving(null);
      setSavedSlots((prev) => new Set(prev).add(slot));
      setSuccessMsg(`Witness ${slot} statement saved successfully. AI analysis is ready.`);
      setTimeout(() => setSuccessMsg(''), 4000);
    }, 1200);
  };

  const inputMethodConfig: Record<InputMethod, { label: string; icon: React.ReactNode; color: string }> = {
    text: { label: 'Text Input', icon: <FileText size={14} />, color: 'text-primary-600' },
    voice: { label: 'Voice Recording', icon: <Mic size={14} />, color: 'text-warning-600' },
    'audio-upload': { label: 'Audio Upload', icon: <FileAudio size={14} />, color: 'text-blue-600' },
  };

  return (
    <div>
      <PageHeader
        title="Witness Statement Collection"
        description="Collect witness statements through text input, voice recording, or audio file upload. Select a case, add up to three witnesses, and record each statement."
        icon={<FileText size={22} />}
      />

      <input ref={fileInputRef} type="file" accept="audio/*" className="hidden" onChange={handleFileInputChange} />

      {successMsg && (
        <Alert variant="success" className="mb-5 animate-fade-in">
          <p>{successMsg}</p>
        </Alert>
      )}

      {/* Case selection */}
      <Card className="mb-5">
        <CardHeader title="Select Investigation Case" subtitle="Choose the case this statement belongs to" icon={<UserCog size={20} />} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {availableCases.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCaseId(c.id)}
              className={cn(
                'p-4 rounded-lg border-2 text-left transition-all',
                selectedCaseId === c.id
                  ? 'border-primary-500 bg-primary-50/50'
                  : 'border-slate-200 hover:border-slate-300'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400">{c.caseNumber}</span>
                {selectedCaseId === c.id && <CheckCircle2 size={16} className="text-primary-600" />}
              </div>
              <p className="text-sm font-semibold text-slate-900">{c.title}</p>
              <p className="text-xs text-slate-500 mt-1">{c.location}</p>
            </button>
          ))}
        </div>
      </Card>

      {/* Witness slots */}
      <Card className="mb-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Witness Slots</h3>
            <p className="text-sm text-slate-500 mt-0.5">Add up to 3 witnesses for this case</p>
          </div>
          {drafts.length < 3 && (
            <Button variant="secondary" onClick={addWitnessSlot}>
              <Plus size={16} />
              Add Witness
            </Button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {drafts.map((draft) => (
            <div
              key={draft.slot}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 cursor-pointer transition-all',
                activeSlot === draft.slot
                  ? 'border-primary-500 bg-primary-50/50'
                  : 'border-slate-200 hover:border-slate-300'
              )}
              onClick={() => setActiveSlot(draft.slot)}
            >
              <div className={cn(
                'w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold',
                savedSlots.has(draft.slot)
                  ? 'bg-success-100 text-success-700'
                  : activeSlot === draft.slot
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-slate-100 text-slate-500'
              )}>
                {savedSlots.has(draft.slot) ? <CheckCircle2 size={14} /> : draft.slot}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900">
                  {draft.label || `Witness ${draft.slot}`}
                </p>
                <p className="text-xs text-slate-400">
                  {savedSlots.has(draft.slot) ? 'Saved' : draft.statement ? 'Draft' : 'Empty'}
                </p>
              </div>
              {drafts.length > 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); removeWitnessSlot(draft.slot); }}
                  className="ml-2 text-slate-300 hover:text-danger-500"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Statement form for active slot */}
      <Card className="mb-5">
        <CardHeader
          title={`Witness ${activeSlot} — Statement Entry`}
          subtitle={`Recording statement for: ${availableCases.find((c) => c.id === selectedCaseId)?.title}`}
          icon={<User size={20} />}
          action={
            savedSlots.has(activeSlot) && (
              <Badge variant="success">
                <CheckCircle2 size={12} />
                Saved
              </Badge>
            )
          }
        />

        <div className="space-y-4">
          {/* Witness identity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Witness Name or Anonymous ID</label>
              <input
                type="text"
                value={activeDraft.label}
                onChange={(e) => updateDraft(activeSlot, { label: e.target.value })}
                className="input"
                placeholder={activeDraft.isAnonymous ? 'e.g. WITNESS-A1' : 'e.g. Marcus Chen'}
                disabled={activeDraft.isAnonymous}
              />
            </div>
            <div>
              <label className="label">Identification Mode</label>
              <div className="flex gap-3">
                <button
                  onClick={() => updateDraft(activeSlot, { isAnonymous: false, label: '' })}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all',
                    !activeDraft.isAnonymous ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'
                  )}
                >
                  <User size={16} />
                  Named
                </button>
                <button
                  onClick={() => updateDraft(activeSlot, { isAnonymous: true, label: `WITNESS-A${activeSlot}` })}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all',
                    activeDraft.isAnonymous ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'
                  )}
                >
                  <UserCog size={16} />
                  Anonymous
                </button>
              </div>
            </div>
          </div>

          {/* Input method selector */}
          <div>
            <label className="label">Input Method</label>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => updateDraft(activeSlot, { inputMethod: 'text' })}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all',
                  activeDraft.inputMethod === 'text' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'
                )}
              >
                <FileText size={16} />
                Text Input
              </button>
              <button
                onClick={() => updateDraft(activeSlot, { inputMethod: 'voice' })}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all',
                  activeDraft.inputMethod === 'voice' ? 'border-warning-500 bg-warning-50 text-warning-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'
                )}
              >
                <Mic size={16} />
                Voice Recording
              </button>
              <button
                onClick={() => triggerFileUpload(activeSlot)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all',
                  activeDraft.inputMethod === 'audio-upload' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'
                )}
              >
                <Upload size={16} />
                Upload Audio File
              </button>
            </div>
          </div>

          {/* Voice recording controls */}
          {activeDraft.inputMethod === 'voice' && (
            <div className="p-4 bg-warning-50/50 border border-warning-200 rounded-lg">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleToggleRecord(activeSlot)}
                  className={cn(
                    'w-14 h-14 rounded-full flex items-center justify-center transition-all flex-shrink-0',
                    activeDraft.isRecording
                      ? 'bg-danger-500 text-white animate-pulse-soft'
                      : 'bg-warning-500 text-white hover:bg-warning-600'
                  )}
                >
                  {activeDraft.isRecording ? <Square size={22} /> : <Mic size={22} />}
                </button>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">
                    {activeDraft.isRecording
                      ? 'Recording in progress... (simulated)'
                      : transcribing === activeSlot
                        ? 'Transcribing audio...'
                        : 'Click the microphone to start recording'}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {activeDraft.isRecording
                      ? 'Click again to stop and auto-transcribe'
                      : 'Voice input uses simulated transcription for this prototype'}
                  </p>
                  {activeDraft.isRecording && (
                    <div className="mt-2 flex items-center gap-1">
                      {[...Array(20)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1 bg-danger-500 rounded-full animate-pulse-soft"
                          style={{ height: `${8 + Math.random() * 20}px`, animationDelay: `${i * 50}ms` }}
                        />
                      ))}
                    </div>
                  )}
                  {transcribing === activeSlot && (
                    <div className="mt-2 flex items-center gap-2">
                      <Loader2 size={14} className="animate-spin text-warning-600" />
                      <span className="text-xs text-warning-700">Processing audio waveform and transcribing...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Audio upload status */}
          {activeDraft.inputMethod === 'audio-upload' && (
            <div className="p-4 bg-blue-50/50 border border-blue-200 rounded-lg">
              {uploading === activeSlot ? (
                <div className="flex items-center gap-3">
                  <Loader2 size={20} className="animate-spin text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Uploading and processing audio file...</p>
                    <p className="text-xs text-slate-500">Simulated transcription in progress</p>
                  </div>
                </div>
              ) : activeDraft.audioFileName ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                    <FileAudio size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">{activeDraft.audioFileName}</p>
                    <p className="text-xs text-slate-500">Audio transcribed (simulated)</p>
                  </div>
                  <Badge variant="info" size="sm">Transcribed</Badge>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Upload size={20} className="text-blue-600" />
                  <p className="text-sm text-slate-600">Click "Upload Audio File" above to select an audio file</p>
                </div>
              )}
            </div>
          )}

          {/* Statement textarea */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="label mb-0">Witness Statement</label>
              <Badge variant="neutral" size="sm">
                {inputMethodConfig[activeDraft.inputMethod].icon}
                {inputMethodConfig[activeDraft.inputMethod].label}
              </Badge>
            </div>
            <textarea
              value={activeDraft.statement}
              onChange={(e) => updateDraft(activeSlot, { statement: e.target.value })}
              className="input min-h-[200px] resize-y leading-relaxed"
              placeholder="Enter the witness's statement here. This can be typed directly, transcribed from voice recording, or generated from an uploaded audio file..."
            />
            <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1.5">
              <AlertCircle size={12} />
              {activeDraft.statement.trim()
                ? `${activeDraft.statement.trim().split(/\s+/).length} words captured`
                : 'No statement entered yet'}
            </p>
          </div>

          {/* Save button */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <div className="text-xs text-slate-400">
              {savedSlots.has(activeSlot)
                ? 'Statement saved. Ready for AI analysis.'
                : 'Save the statement to proceed with AI follow-up analysis.'}
            </div>
            <div className="flex gap-2">
              {savedSlots.has(activeSlot) && (
                <Button variant="secondary" onClick={() => onNavigate('ai-followup-analysis')}>
                  <Sparkles size={16} />
                  View AI Analysis
                  <ArrowRight size={14} />
                </Button>
              )}
              <Button
                onClick={() => handleSave(activeSlot)}
                disabled={!activeDraft.statement.trim() || saving === activeSlot || savedSlots.has(activeSlot)}
              >
                {saving === activeSlot ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Saving...
                  </>
                ) : savedSlots.has(activeSlot) ? (
                  <>
                    <CheckCircle2 size={16} />
                    Saved
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save Statement
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Saved statements list */}
      {collectedStatements.length > 0 && (
        <Card>
          <CardHeader
            title="Previously Collected Statements"
            subtitle="Statements already recorded for this case"
            icon={<FileText size={20} />}
          />
          <div className="space-y-3">
            {collectedStatements.map((cs) => (
              <div
                key={cs.id}
                className="flex items-center gap-4 p-4 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary-700 flex items-center justify-center flex-shrink-0">
                  <User size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900">{cs.witnessLabel}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {cs.caseTitle} • {formatDateTime(cs.savedAt)}
                  </p>
                </div>
                <Badge variant={cs.status === 'analyzed' ? 'success' : cs.status === 'saved' ? 'warning' : 'neutral'}>
                  {cs.status}
                </Badge>
                <Button variant="ghost" size="sm" onClick={() => onNavigate('witness-summary')}>
                  View Summary
                  <ArrowRight size={14} />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {savedSlots.size === 0 && collectedStatements.length === 0 && drafts.every((d) => !d.statement.trim()) && (
        <Card>
          <EmptyState
            icon={<FileText size={28} />}
            title="No statements collected yet"
            description="Select a case above and start entering witness statements using text, voice, or audio upload."
          />
        </Card>
      )}

      <div className="mt-6">
        <AIDisclaimer />
      </div>
    </div>
  );
}
