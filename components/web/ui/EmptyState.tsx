import { PackageSearch } from "lucide-react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mb-6">
        {icon ?? <PackageSearch className="w-10 h-10 text-slate-400" />}
      </div>
      <h3 className="text-xl font-bold text-slate-700 mb-2">{title}</h3>
      {description && (
        <p className="text-slate-400 text-sm max-w-sm leading-relaxed mb-6">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
