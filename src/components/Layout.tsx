import { type ReactNode, useState } from 'react';
import {
  LayoutDashboard,
  Folders,
  FileText,
  MessageSquareText,
  Clock,
  GitCompareArrows,
  AlertTriangle,
  Lightbulb,
  FileBarChart,
  Rocket,
  ShieldCheck,
  Menu,
  Search,
  Bell,
  ChevronDown,
  X,
  Mic,
  FileSearch,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ViewId } from '@/types';

interface LayoutProps {
  children: ReactNode;
  currentView: ViewId;
  onNavigate: (view: ViewId) => void;
}

interface NavItem {
  id: ViewId;
  label: string;
  icon: ReactNode;
  group: string;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={19} />, group: 'Overview' },
  { id: 'cases', label: 'Cases', icon: <Folders size={19} />, group: 'Overview' },
  { id: 'statement-collection', label: 'Statement Collection', icon: <Mic size={19} />, group: 'Evidence' },
  { id: 'ai-followup-analysis', label: 'AI Follow-up Analysis', icon: <Sparkles size={19} />, group: 'Evidence' },
  { id: 'witness-summary', label: 'Witness Summary', icon: <FileSearch size={19} />, group: 'Evidence' },
  { id: 'statements', label: 'Witness Statements', icon: <FileText size={19} />, group: 'Evidence' },
  { id: 'followup', label: 'AI Follow-up Questions', icon: <MessageSquareText size={19} />, group: 'Evidence' },
  { id: 'timeline', label: 'Timeline', icon: <Clock size={19} />, group: 'Analysis' },
  { id: 'comparison', label: 'Comparison', icon: <GitCompareArrows size={19} />, group: 'Analysis' },
  { id: 'contradictions', label: 'Contradictions', icon: <AlertTriangle size={19} />, group: 'Analysis' },
  { id: 'insights', label: 'AI Insights', icon: <Lightbulb size={19} />, group: 'Intelligence' },
  { id: 'confidence', label: 'Confidence Analysis', icon: <ShieldCheck size={19} />, group: 'Intelligence' },
  { id: 'reports', label: 'Reports', icon: <FileBarChart size={19} />, group: 'Intelligence' },
  { id: 'future', label: 'Future Scope', icon: <Rocket size={19} />, group: 'System' },
];

const groups = ['Overview', 'Evidence', 'Analysis', 'Intelligence', 'System'];

export function Layout({ children, currentView, onNavigate }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const currentItem = navItems.find((n) => n.id === currentView);

  const handleNav = (view: ViewId) => {
    onNavigate(view);
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:sticky top-0 left-0 z-40 h-screen w-72 bg-primary-950 text-slate-300 flex flex-col transition-transform duration-300 lg:translate-x-0 flex-shrink-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="px-5 py-5 flex items-center gap-3 border-b border-white/10">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
            <ShieldCheck size={22} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-bold text-white leading-tight">AI Witness</h1>
            <p className="text-[11px] text-slate-400 leading-tight">Memory Reconstruction</p>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {groups.map((group) => (
            <div key={group}>
              <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                {group}
              </p>
              <div className="space-y-0.5">
                {navItems
                  .filter((n) => n.group === group)
                  .map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleNav(item.id)}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                        currentView === item.id
                          ? 'bg-white/10 text-white shadow-soft'
                          : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                      )}
                    >
                      <span className={cn(currentView === item.id ? 'text-primary-300' : 'text-slate-500')}>
                        {item.icon}
                      </span>
                      <span className="flex-1 text-left">{item.label}</span>
                      {currentView === item.id && (
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-400" />
                      )}
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary-500/20 flex items-center justify-center text-sm font-semibold text-primary-300">
              SB
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Det. Sarah Brennan</p>
              <p className="text-[11px] text-slate-400 truncate">Lead Investigator</p>
            </div>
            <ChevronDown size={16} className="text-slate-500" />
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top nav */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200">
          <div className="flex items-center justify-between gap-4 px-5 lg:px-8 py-3.5">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden text-slate-500 hover:text-slate-900 p-1"
              >
                <Menu size={22} />
              </button>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-400">Investigation</span>
                <span className="text-slate-300">/</span>
                <span className="font-medium text-slate-700">{currentItem?.label}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-3.5 py-2 bg-slate-100 rounded-lg w-64">
                <Search size={16} className="text-slate-400" />
                <input
                  type="text"
                  placeholder="Search cases, witnesses..."
                  className="bg-transparent text-sm outline-none flex-1 placeholder:text-slate-400"
                />
              </div>
              <button className="relative p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger-500" />
              </button>
              <div className="hidden md:flex items-center gap-2 pl-3 border-l border-slate-200">
                <span className="text-xs text-slate-500">CASE-2024-0847</span>
                <span className="px-2 py-0.5 rounded-full bg-warning-100 text-warning-700 text-[11px] font-semibold">
                  Active
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-5 lg:p-8 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
