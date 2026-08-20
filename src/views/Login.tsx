import { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  User,
  ArrowRight,
  Brain,
  Clock,
  GitCompareArrows,
  AlertTriangle,
  Scale,
} from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('sarah.brennan@police.gov');
  const [password, setPassword] = useState('••••••••••');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 1200);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-primary-500 blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-blue-500 blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
              <ShieldCheck size={26} />
            </div>
            <div>
              <h1 className="text-lg font-bold">AI Witness</h1>
              <p className="text-xs text-slate-400">Memory Reconstruction System</p>
            </div>
          </div>

          <div className="max-w-md">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-xs font-medium mb-6">
              <Scale size={14} />
              SDG 16 — Peace, Justice & Strong Institutions
            </div>
            <h2 className="text-4xl font-bold leading-tight mb-4">
              Reconstruct the truth from what witnesses remember.
            </h2>
            <p className="text-slate-300 leading-relaxed">
              An AI-assisted investigation support tool that helps investigators collect,
              analyze, and cross-reference witness statements — surfacing contradictions,
              generating follow-up questions, and building a clearer picture of events.
            </p>

            <div className="grid grid-cols-2 gap-4 mt-10">
              {[
                { icon: <Brain size={18} />, label: 'AI-powered analysis' },
                { icon: <Clock size={18} />, label: 'Timeline reconstruction' },
                { icon: <GitCompareArrows size={18} />, label: 'Witness comparison' },
                { icon: <AlertTriangle size={18} />, label: 'Contradiction detection' },
              ].map((f) => (
                <div key={f.label} className="flex items-center gap-2.5 text-sm text-slate-300">
                  <span className="text-primary-300">{f.icon}</span>
                  {f.label}
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-slate-500 max-w-md">
            This is an investigation support tool. AI results are labeled as "AI-assisted analysis"
            and are for investigator verification only. Confidence scores do not represent legal certainty.
          </p>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-slate-50">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary-900 text-white flex items-center justify-center">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900">AI Witness</h1>
              <p className="text-xs text-slate-500">Memory Reconstruction System</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-1">Sign in to your workspace</h2>
          <p className="text-sm text-slate-500 mb-8">
            Enter your investigator credentials to continue.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email address</label>
              <div className="relative">
                <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input pl-11"
                  placeholder="you@police.gov"
                />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-11"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                Remember me
              </label>
              <button type="button" className="text-primary-600 hover:text-primary-700 font-medium">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-base group"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign in to Dashboard
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-xs text-slate-400 text-center">
              Authorized personnel only. All actions are logged for audit compliance.
            </p>
          </div>

          <button
            onClick={onLogin}
            className="mt-4 w-full text-xs text-slate-400 hover:text-slate-600 underline"
          >
            Or skip to demo (hackathon preview)
          </button>
        </div>
      </div>
    </div>
  );
}
