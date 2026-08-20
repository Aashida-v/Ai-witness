import {
  Rocket,
  ScanFace,
  Camera,
  Mic,
  MapPin,
  Languages,
  ShieldCheck,
  Clock,
  ArrowRight,
  Network,
  FileSearch,
  Link2,
  Boxes,
  AlertTriangle,
} from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';

export function FutureScope() {
  const features = [
    {
      icon: <ScanFace size={22} />,
      title: 'AI Suspect Sketch',
      description: 'Generate a suspect sketch from witness descriptions. The AI will combine physical attributes reported by multiple witnesses — height, build, facial features, clothing — into a composite sketch that investigators can refine and distribute.',
      status: 'Concept',
      timeline: 'Q4 2025',
      category: 'Identification',
    },
    {
      icon: <Camera size={22} />,
      title: 'CCTV Integration',
      description: 'Compare witness timelines with CCTV events. Upload surveillance footage and the AI will cross-reference visual evidence with witness accounts, automatically matching timestamps and flagging discrepancies or corroboration.',
      status: 'Research',
      timeline: 'Q3 2025',
      category: 'Evidence Integration',
    },
    {
      icon: <Mic size={22} />,
      title: 'Emotion / Stress Analysis',
      description: 'Analyze voice characteristics as an optional supporting signal. The AI may detect stress patterns, hesitation markers, and emotional states in recorded statements to help investigators understand witness state during recall.',
      status: 'Experimental',
      timeline: '2026',
      category: 'Voice Analysis',
      isExperimental: true,
    },
    {
      icon: <MapPin size={22} />,
      title: 'GPS Crime Reconstruction',
      description: 'Visualize reported movement on a map. Plot witness positions, suspect approach and flight paths, and vehicle routes on an interactive geographic map with time-based playback to reconstruct the crime spatially.',
      status: 'Concept',
      timeline: 'Q4 2025',
      category: 'Visualization',
    },
    {
      icon: <Languages size={22} />,
      title: 'Multilingual Witness Support',
      description: 'Support English, Tamil, Hindi and other languages. Real-time translation of witness statements ensures non-native speakers can provide accurate accounts without language barriers affecting reliability scores.',
      status: 'Planned',
      timeline: 'Q2 2025',
      category: 'Accessibility',
    },
    {
      icon: <Network size={22} />,
      title: 'Police Case Management Integration',
      description: 'Connect with authorized investigation systems. Integrate with existing police case management platforms, evidence databases, and records systems to streamline workflow and maintain chain of custody.',
      status: 'Planned',
      timeline: 'Q3 2025',
      category: 'Integration',
    },
    {
      icon: <Boxes size={22} />,
      title: 'Interactive 3D Timeline',
      description: 'Visualize events spatially and chronologically. A 3D reconstruction of the crime scene lets investigators walk through the timeline from any vantage point, seeing what each witness could see at each moment.',
      status: 'Concept',
      timeline: '2026',
      category: 'Visualization',
    },
    {
      icon: <Link2 size={22} />,
      title: 'Evidence Linking',
      description: 'Connect witness statements with CCTV, photos, documents and forensic evidence. The AI will create a linked evidence graph showing how each piece of evidence corroborates or challenges witness accounts.',
      status: 'Research',
      timeline: 'Q3 2025',
      category: 'Evidence Integration',
    },
  ];

  const statusVariant: Record<string, 'info' | 'warning' | 'neutral' | 'danger'> = {
    Planned: 'info',
    Research: 'warning',
    Concept: 'neutral',
    Experimental: 'danger',
  };

  const roadmap = [
    {
      phase: 'Phase 1 — Near Term',
      timeline: 'Q1–Q2 2025',
      items: ['Multilingual witness support', 'Police case management integration'],
      color: 'bg-primary-500',
    },
    {
      phase: 'Phase 2 — Mid Term',
      timeline: 'Q3 2025',
      items: ['CCTV integration', 'Evidence linking', 'Police system integration'],
      color: 'bg-warning-500',
    },
    {
      phase: 'Phase 3 — Long Term',
      timeline: 'Q4 2025 — 2026',
      items: ['AI suspect sketch', 'GPS crime reconstruction', '3D timeline', 'Emotion/stress analysis'],
      color: 'bg-slate-400',
    },
  ];

  return (
    <div>
      <PageHeader
        title="Future Scope & Roadmap"
        description="Planned enhancements for the AI Witness Memory Reconstruction System. These features are in concept, research, or planning stages — they demonstrate the vision for future capabilities while maintaining strict legal and ethical safeguards."
        icon={<Rocket size={22} />}
      />

      {/* Experimental disclaimer */}
      <Alert variant="warning" className="mb-6">
        <p className="font-semibold">Future features are experimental and in development.</p>
        <p className="mt-0.5">
          These capabilities are shown as planned enhancements, not current functionality. Features like emotion and
          stress analysis are explicitly experimental and should never be used to determine witness credibility.
          All future features will maintain the core principle: AI supports investigations, it does not replace
          investigator judgment or determine guilt.
        </p>
      </Alert>

      {/* Roadmap */}
      <Card className="mb-6">
        <CardHeader title="Development Roadmap" subtitle="Phased rollout of new capabilities" icon={<Clock size={20} />} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {roadmap.map((phase, i) => (
            <div key={i} className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-3 h-3 rounded-full ${phase.color}`} />
                <div>
                  <p className="text-sm font-semibold text-slate-900">{phase.phase}</p>
                  <p className="text-xs text-slate-400">{phase.timeline}</p>
                </div>
              </div>
              <div className="ml-1.5 pl-4 border-l-2 border-slate-100 space-y-2">
                {phase.items.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-slate-600">
                    <ArrowRight size={14} className="text-slate-300" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Feature cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        {features.map((feature, i) => (
          <Card key={i} hover className="animate-fade-in flex flex-col">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="w-11 h-11 rounded-xl bg-primary-50 text-primary-700 flex items-center justify-center">
                {feature.icon}
              </div>
              <Badge variant={statusVariant[feature.status]} size="sm">{feature.status}</Badge>
            </div>
            <h3 className="text-base font-semibold text-slate-900 mb-1.5">{feature.title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-3 flex-1">{feature.description}</p>
            {feature.isExperimental && (
              <div className="p-2 bg-danger-50 border border-danger-200 rounded-lg mb-3 flex items-start gap-2">
                <AlertTriangle size={14} className="text-danger-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-danger-700">Experimental — should not determine credibility.</p>
              </div>
            )}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <Badge variant="neutral" size="sm">{feature.category}</Badge>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock size={12} />
                {feature.timeline}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Ethical framework */}
      <Card className="mb-6">
        <CardHeader title="Ethical & Legal Framework" subtitle="Commitments guiding all future development" icon={<ShieldCheck size={20} />} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: 'Human-in-the-loop', desc: 'AI never makes determinations of guilt or innocence. All conclusions are verified by qualified investigators.' },
            { title: 'Transparency', desc: 'All AI analysis is labeled as "AI-assisted" with methodology documented for legal scrutiny.' },
            { title: 'Bias mitigation', desc: 'Regular audits of AI outputs for demographic, cultural, and cognitive biases in statement analysis.' },
            { title: 'Data privacy', desc: 'Witness identities and statements protected with encryption and strict access controls.' },
            { title: 'Evidentiary integrity', desc: 'Immutable audit trails and chain-of-custody tracking for all evidence processed through the system.' },
            { title: 'Right to explanation', desc: 'Every AI-generated insight, contradiction, or score must be explainable in plain language to investigators and legal counsel.' },
          ].map((principle) => (
            <div key={principle.title} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
              <ShieldCheck size={18} className="text-primary-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-slate-900">{principle.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{principle.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* SDG 16 statement */}
      <div className="p-5 rounded-xl bg-primary-950 text-white">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
            <FileSearch size={24} />
          </div>
          <div>
            <h3 className="text-base font-semibold mb-1">Aligned with UN Sustainable Development Goal 16</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Peace, Justice & Strong Institutions. This system supports SDG 16 by strengthening investigative
              capabilities, promoting accountable justice systems, and ensuring that witness evidence is
              analyzed fairly, transparently, and with respect for the rights of all parties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
