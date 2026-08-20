import { type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  badge?: ReactNode;
}

export function PageHeader({ title, description, icon, action, badge }: PageHeaderProps) {
  return (
    <div className="mb-6 animate-fade-in">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-start gap-3">
          {icon && (
            <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-primary-900 text-white flex items-center justify-center shadow-soft">
              {icon}
            </div>
          )}
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
              {badge}
            </div>
            {description && (
              <p className="text-sm text-slate-500 mt-1 max-w-2xl">{description}</p>
            )}
          </div>
        </div>
        {action}
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
        <AlertTriangle size={12} />
        <span>AI-assisted analysis — for investigator verification only</span>
      </div>
    </div>
  );
}
