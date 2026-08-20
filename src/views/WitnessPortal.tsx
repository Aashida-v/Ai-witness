import { useState, useEffect } from 'react';
import {
  Shield,
  FileText,
  Mic,
  CheckCircle2,
  Edit3,
  Sparkles,
  Send,
  HelpCircle,
  Clock,
  MapPin,
  User,
  AlertCircle,
  Save,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { useData } from '@/context/DataContext';
import type { Witness, InvestigationCase, WitnessStatement, CollectedStatement } from '@/types';

interface WitnessPortalProps {
  witnessId?: string;
  caseId?: string;
  onExitPortal?: () => void;
}

const sampleVoiceSimulations = [
  "I was walking near the main entrance around 9:15 PM. I noticed a tall suspect wearing a dark hooded sweatshirt and blue jeans running out of the store. He carrying a heavy black backpack and got into a dark blue sedan parked near the alley corner. The car accelerated north towards 5th Avenue.",
  "I heard loud voices and commotion from the store. I saw a male suspect about 6 feet tall with a red baseball cap and jacket. He entered a gray Honda SUV with license plate ending in 89. He drove off heading east.",
];

export function WitnessPortal({ witnessId, caseId, onExitPortal }: WitnessPortalProps) {
  const { witnesses, cases, statements, followUpQuestions, submitWitnessStatement, updateWitnessStatement, answerFollowUpQuestion } = useData();

  // Find witness and case
  const currentWitness = witnesses.find((w) => w.id === witnessId) || witnesses[0];
  const currentCase = cases.find((c) => c.id === (caseId || currentWitness?.caseId)) || cases[0];
  const existingStatement = statements.find((s) => s.witnessId === currentWitness?.id);

  const [statementText, setStatementText] = useState(existingStatement?.rawStatement || '');
  const [isRecording, setIsRecording] = useState(false);
  const [inputMethod, setInputMethod] = useState<'text' | 'voice'>('text');
  const [isSubmitted, setIsSubmitted] = useState(!!existingStatement);
  const [isEditing, setIsEditing] = useState(!existingStatement);
  const [submittedData, setSubmittedData] = useState<{ statement?: WitnessStatement; collected?: CollectedStatement } | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  useEffect(() => {
    if (existingStatement) {
      setStatementText(existingStatement.rawStatement);
      setIsSubmitted(true);
    }
  }, [existingStatement]);

  const handleSimulateVoice = () => {
    setIsRecording(true);
    setInputMethod('voice');
    setTimeout(() => {
      const sample = sampleVoiceSimulations[Math.floor(Math.random() * sampleVoiceSimulations.length)];
      setStatementText((prev) => (prev ? `${prev}\n${sample}` : sample));
      setIsRecording(false);
    }, 2000);
  };

  const handleSubmitStatement = () => {
    if (!statementText.trim() || !currentCase || !currentWitness) return;

    if (existingStatement) {
      updateWitnessStatement(existingStatement.id, statementText);
      setSaveSuccessMsg('Statement successfully updated! Reflected on Officer Dashboard.');
      setIsEditing(false);
      setTimeout(() => setSaveSuccessMsg(''), 4000);
    } else {
      const res = submitWitnessStatement({
        caseId: currentCase.id,
        witnessId: currentWitness.id,
        witnessName: currentWitness.name,
        statementText: statementText.trim(),
        inputMethod,
      });
      setSubmittedData(res);
      setIsSubmitted(true);
      setIsEditing(false);
      setSaveSuccessMsg('Statement submitted and analyzed by AI! Reflected on Officer Dashboard.');
      setTimeout(() => setSaveSuccessMsg(''), 4000);
    }
  };

  const handleAnswerSubmit = (qId: string) => {
    const val = answers[qId];
    if (val && val.trim()) {
      answerFollowUpQuestion(qId, val.trim());
      setSaveSuccessMsg('Answer saved to investigation file!');
      setTimeout(() => setSaveSuccessMsg(''), 3000);
    }
  };

  // Get active follow up questions for this witness
  const witnessQuestions = followUpQuestions.filter(
    (q) => q.witnessId === currentWitness?.id || q.caseId === currentCase?.id
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-600/20 text-primary-400 flex items-center justify-center border border-primary-500/30">
              <Shield size={22} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white flex items-center gap-2">
                AI Witness Portal
                <Badge variant="warning" size="sm">Official Case Portal</Badge>
              </h1>
              <p className="text-xs text-slate-400">Secure Official Statement & Interview System</p>
            </div>
          </div>

          {onExitPortal && (
            <Button variant="secondary" size="sm" onClick={onExitPortal} className="text-xs">
              Officer Dashboard
            </Button>
          )}
        </div>

        {/* Case & Witness Context Banner */}
        <Card className="bg-slate-800/80 border-slate-700/80 p-5 text-slate-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-700/60 pb-4 mb-4">
            <div>
              <span className="text-xs font-mono text-primary-400 uppercase tracking-wider">{currentCase.caseNumber}</span>
              <h2 className="text-xl font-bold text-white mt-0.5">{currentCase.title}</h2>
            </div>
            <Badge variant="neutral" className="bg-slate-700 text-slate-300">
              Official Witness Record
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <User size={15} className="text-slate-400" />
              <span><strong>Witness:</strong> {currentWitness.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={15} className="text-slate-400" />
              <span className="truncate"><strong>Location:</strong> {currentCase.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={15} className="text-slate-400" />
              <span><strong>Date:</strong> {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </Card>

        {/* Success Alert */}
        {saveSuccessMsg && (
          <Alert variant="success" className="bg-emerald-950/80 border-emerald-500/40 text-emerald-200">
            <p>{saveSuccessMsg}</p>
          </Alert>
        )}

        {/* Main Content Area */}
        {isEditing ? (
          <Card className="bg-slate-800/90 border-slate-700 p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Edit3 size={18} className="text-primary-400" />
                  {isSubmitted ? 'Edit Your Witness Statement' : 'Describe What You Observed'}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Please provide details about people, vehicles, clothing, direction of flee, or sequence of events.
                </p>
              </div>

              {/* Mode Selection */}
              <div className="flex items-center gap-2 bg-slate-900/60 p-1 rounded-lg border border-slate-700/60">
                <button
                  type="button"
                  onClick={() => setInputMethod('text')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    inputMethod === 'text' ? 'bg-primary-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Text Entry
                </button>
                <button
                  type="button"
                  onClick={() => setInputMethod('voice')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    inputMethod === 'voice' ? 'bg-primary-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Voice Input
                </button>
              </div>
            </div>

            {/* Voice Dictation Box if selected */}
            {inputMethod === 'voice' && (
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isRecording ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-primary-500/20 text-primary-400'}`}>
                    <Mic size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">Voice Dictation Mode</h4>
                    <p className="text-[11px] text-slate-400">Speak into your microphone or tap simulate audio dictation.</p>
                  </div>
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleSimulateVoice}
                  disabled={isRecording}
                  className="bg-primary-600/20 border-primary-500/40 text-primary-300 hover:bg-primary-600/30 text-xs"
                >
                  {isRecording ? 'Recording...' : 'Dictate Statement'}
                </Button>
              </div>
            )}

            {/* Statement Text Area */}
            <div>
              <textarea
                value={statementText}
                onChange={(e) => setStatementText(e.target.value)}
                placeholder="E.g. At approximately 9:15 PM, I saw two individuals running out of the building. One was wearing a yellow hood..."
                rows={6}
                className="w-full rounded-xl bg-slate-900 border border-slate-700 p-4 text-sm text-slate-100 placeholder-slate-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 resize-y"
              />
              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
                <span>{statementText.length} characters</span>
                <span>Protected by AI Witness Verification</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              {isSubmitted && (
                <Button variant="secondary" onClick={() => setIsEditing(false)} className="text-xs border-slate-700 text-slate-300">
                  Cancel Editing
                </Button>
              )}
              <Button
                variant="primary"
                onClick={handleSubmitStatement}
                disabled={!statementText.trim()}
                className="gap-2 text-xs font-semibold"
              >
                <Save size={16} />
                {isSubmitted ? 'Update Statement' : 'Submit Witness Statement'}
              </Button>
            </div>
          </Card>
        ) : (
          /* Submitted State View */
          <div className="space-y-6">
            {/* Active Statement Box */}
            <Card className="bg-slate-800/90 border-slate-700 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={20} className="text-emerald-400" />
                  <h3 className="text-base font-bold text-white">Your Official Statement</h3>
                  <Badge variant="success" size="sm">Transmitted to Officer Dashboard</Badge>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="gap-1.5 text-xs bg-slate-700 text-slate-200 hover:bg-slate-600"
                >
                  <Edit3 size={14} />
                  Edit Statement
                </Button>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
                "{statementText}"
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span>Status: <strong>Analyzed by AI Witness Engine</strong></span>
                <span>Method: <strong className="capitalize">{inputMethod}</strong></span>
              </div>
            </Card>

            {/* AI Follow-Up Questions Section */}
            <Card className="bg-slate-800/90 border-slate-700 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Sparkles size={18} className="text-primary-400" />
                    AI Investigative Follow-Up Questions
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Our AI cross-examiner analyzed your statement and identified key details to help officers.
                  </p>
                </div>
                <Badge variant="info" size="sm">
                  {witnessQuestions.length} Questions
                </Badge>
              </div>

              <div className="space-y-4">
                {witnessQuestions.map((q, idx) => (
                  <div key={q.id || idx} className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/70 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[11px] font-semibold text-primary-400 uppercase tracking-wider">
                          Question {idx + 1} • {q.category}
                        </span>
                        <h4 className="text-sm font-semibold text-white mt-0.5">{q.question}</h4>
                      </div>
                      <Badge variant={q.status === 'answered' ? 'success' : 'warning'} size="sm">
                        {q.status === 'answered' ? 'Answered' : 'Pending'}
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-400 italic">
                      Rationale: {q.rationale}
                    </p>

                    {/* Answer Box */}
                    {q.status === 'answered' ? (
                      <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/50 text-xs text-emerald-200">
                        <strong>Your Response:</strong> {q.answer}
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={answers[q.id] || ''}
                          onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                          placeholder="Type your response to this follow-up question..."
                          className="flex-1 rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-primary-500 focus:outline-none"
                        />
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleAnswerSubmit(q.id)}
                          disabled={!answers[q.id]?.trim()}
                          className="text-xs"
                        >
                          <Send size={14} />
                          Save Answer
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>

          </div>
        )}

      </div>
    </div>
  );
}
