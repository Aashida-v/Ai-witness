import { useState } from 'react';
import {
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Filter,
  GitBranch,
  Loader2,
  Eye,
  MapPin,
  User,
  X,
} from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { AIDisclaimer, ProgressBar } from '@/components/ui/Alert';
import { Modal } from '@/components/ui/Modal';
import { timelineEvents } from '@/data/mockData';
import { formatDateTime } from '@/lib/utils';
import type { TimelineEvent } from '@/types';

export function Timeline() {
  const [events] = useState<TimelineEvent[]>(timelineEvents);
  const [filterCorroborated, setFilterCorroborated] = useState<'all' | 'corroborated' | 'single'>('all');
  const [filterWitness, setFilterWitness] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<'all' | 'pre' | 'incident' | 'flight' | 'post'>('all');
  const [building, setBuilding] = useState(false);
  const [built, setBuilt] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);

  const witnesses = [...new Set(timelineEvents.map((e) => e.witnessName))];

  const timeRangeMap: Record<string, string[]> = {
    pre: ['Pre-incident'],
    incident: ['Incident'],
    flight: ['Flight'],
    post: ['Post-incident'],
  };

  const filtered = events
    .filter((e) => {
      if (filterCorroborated === 'corroborated' && !e.corroborated) return false;
      if (filterCorroborated === 'single' && e.corroborated) return false;
      if (filterWitness !== 'all' && e.witnessName !== filterWitness) return false;
      if (filterCategory !== 'all' && e.category !== filterCategory) return false;
      if (timeRange !== 'all' && !timeRangeMap[timeRange].includes(e.category)) return false;
      return true;
    })
    .sort((a, b) => {
      const parseTime = (t: string) => {
        const match = t.match(/(\d{2}):(\d{2})/);
        if (!match) return 0;
        return parseInt(match[1]) * 60 + parseInt(match[2]);
      };
      return parseTime(a.timestamp) - parseTime(b.timestamp);
    });

  const handleRebuild = () => {
    setBuilding(true);
    setTimeout(() => {
      setBuilding(false);
      setBuilt(true);
      setTimeout(() => setBuilt(false), 4000);
    }, 2500);
  };

  const categoryColors: Record<string, string> = {
    'Pre-incident': 'bg-slate-400',
    'Incident': 'bg-danger-500',
    'Flight': 'bg-warning-500',
    'Post-incident': 'bg-primary-500',
  };

  const categories = [...new Set(timelineEvents.map((e) => e.category))];

  return (
    <div>
      <PageHeader
        title="Investigation Timeline"
        description="AI reconstructs the sequence of events from witness statements. Corroborated events (confirmed by multiple witnesses) are highlighted for higher confidence. Filter by witness, time range, or event category."
        icon={<Clock size={22} />}
        action={
          <Button onClick={handleRebuild} disabled={building}>
            {building ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <GitBranch size={18} />
                Generate Timeline
              </>
            )}
          </Button>
        }
      />

      {built && (
        <div className="mb-5 p-4 bg-success-50 border border-success-200 rounded-lg animate-fade-in flex items-center gap-3">
          <CheckCircle2 size={18} className="text-success-600" />
          <p className="text-sm text-success-800">Timeline reconstructed successfully. {events.length} events sequenced from {witnesses.length} witness statements.</p>
        </div>
      )}

      {/* Filters */}
      <Card className="mb-5">
        <div className="flex items-center gap-2 mb-3">
          <Filter size={16} className="text-slate-400" />
          <span className="text-sm font-semibold text-slate-700">Filters</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="label">Witness</label>
            <select
              value={filterWitness}
              onChange={(e) => setFilterWitness(e.target.value)}
              className="input py-2"
            >
              <option value="all">All witnesses</option>
              {witnesses.map((w) => (
                <option key={w} value={w}>{w}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Time Range</label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="input py-2"
            >
              <option value="all">All time ranges</option>
              <option value="pre">Pre-incident</option>
              <option value="incident">Incident</option>
              <option value="flight">Flight</option>
              <option value="post">Post-incident</option>
            </select>
          </div>
          <div>
            <label className="label">Corroboration</label>
            <select
              value={filterCorroborated}
              onChange={(e) => setFilterCorroborated(e.target.value as any)}
              className="input py-2"
            >
              <option value="all">All events</option>
              <option value="corroborated">Corroborated only</option>
              <option value="single">Single-witness only</option>
            </select>
          </div>
          <div>
            <label className="label">Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="input py-2"
            >
              <option value="all">All categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-slate-100">
          {Object.entries(categoryColors).map(([cat, color]) => (
            <div key={cat} className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
              {cat}
            </div>
          ))}
        </div>
      </Card>

      {building ? (
        <Card className="ai-scanner">
          <div className="flex items-center gap-4 py-8">
            <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center">
              <Sparkles size={24} className="animate-pulse" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-900">AI reconstructing event timeline...</p>
              <p className="text-xs text-slate-500 mt-0.5">Cross-referencing {timelineEvents.length} events from {witnesses.length} witnesses</p>
              <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary-500 rounded-full w-2/3 animate-pulse-soft" />
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <Card>
          <CardHeader
            title="Event Sequence"
            subtitle={`${filtered.length} events reconstructed from witness statements`}
            icon={<Clock size={20} />}
          />

          {filtered.length === 0 ? (
            <div className="py-12 text-center">
              <AlertCircle size={32} className="text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500">No events match the selected filters.</p>
            </div>
          ) : (
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[27px] top-0 bottom-0 w-px bg-slate-200" />

              <div className="space-y-1">
                {filtered.map((event, i) => (
                  <div key={event.id} className="relative flex gap-4 group animate-fade-in" style={{ animationDelay: `${i * 30}ms` }}>
                    {/* Time marker */}
                    <div className="flex-shrink-0 w-14 text-right pt-4">
                      <span className="text-xs font-semibold text-slate-700">{event.timestamp}</span>
                    </div>

                    {/* Dot */}
                    <div className="relative flex-shrink-0 pt-4">
                      <div
                        className={`w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm z-10 relative ${categoryColors[event.category] || 'bg-slate-400'}`}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-5">
                      <button
                        onClick={() => setSelectedEvent(event)}
                        className={`w-full text-left p-3.5 rounded-lg border transition-all group-hover:shadow-soft ${
                          event.corroborated
                            ? 'border-success-200 bg-success-50/50'
                            : 'border-slate-200 bg-white'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <h4 className="text-sm font-semibold text-slate-900">{event.event}</h4>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            {event.corroborated ? (
                              <Badge variant="success" size="sm">
                                <CheckCircle2 size={11} />
                                Corroborated
                              </Badge>
                            ) : (
                              <Badge variant="neutral" size="sm">
                                <AlertCircle size={11} />
                                Single witness
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 mb-2">{event.detail}</p>
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <Badge variant="info" size="sm">{event.category}</Badge>
                            <span className="text-xs text-slate-400">{event.witnessName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-16"><ProgressBar value={event.confidence} /></div>
                            <span className="text-xs text-slate-500 font-medium w-6 text-right">{event.confidence}%</span>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Event detail modal */}
      <Modal
        open={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        title={selectedEvent ? selectedEvent.event : ''}
        subtitle={selectedEvent ? `${selectedEvent.timestamp} • ${selectedEvent.category}` : ''}
        size="md"
        footer={
          selectedEvent && (
            <Button variant="secondary" onClick={() => setSelectedEvent(null)}>
              <X size={16} />
              Close
            </Button>
          )
        }
      >
        {selectedEvent && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={selectedEvent.corroborated ? 'success' : 'neutral'}>
                {selectedEvent.corroborated ? (
                  <><CheckCircle2 size={12} /> Corroborated by multiple witnesses</>
                ) : (
                  <><AlertCircle size={12} /> Single witness account</>
                )}
              </Badge>
              <Badge variant="info">{selectedEvent.category}</Badge>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={16} className="text-slate-400" />
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Time</span>
              </div>
              <p className="text-sm font-semibold text-slate-900">{selectedEvent.timestamp}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Eye size={16} className="text-slate-400" />
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Event Details</span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">{selectedEvent.detail}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <User size={16} className="text-slate-400" />
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Source Witness</span>
              </div>
              <p className="text-sm font-semibold text-slate-900">{selectedEvent.witnessName}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-primary-500" />
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Confidence Level</span>
                </div>
                <span className="text-sm font-bold text-slate-900">{selectedEvent.confidence}%</span>
              </div>
              <ProgressBar value={selectedEvent.confidence} />
              <p className="text-xs text-slate-500 mt-2">
                {selectedEvent.confidence >= 80
                  ? 'High confidence — based on direct observation with good visibility.'
                  : selectedEvent.confidence >= 60
                    ? 'Moderate confidence — some uncertainty in details or timing.'
                    : 'Lower confidence — indirect observation or uncertain recall.'}
              </p>
            </div>
          </div>
        )}
      </Modal>

      <div className="mt-6">
        <AIDisclaimer />
      </div>
    </div>
  );
}
