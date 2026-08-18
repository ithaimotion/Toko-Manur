import { Search, Plus } from "lucide-react";

interface TableSkeletonProps {
  columns?: number;
  rows?: number;
  showActions?: boolean;
}

export function TableSkeleton({ columns = 5, rows = 5, showActions = true }: TableSkeletonProps) {
  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm animate-pulse">
      <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <div className="w-full h-10 bg-slate-200 rounded-lg"></div>
          <Search className="w-4 h-4 text-slate-300 absolute left-3 top-3" />
        </div>
        {showActions && (
          <div className="w-full sm:w-32 h-10 bg-slate-200 rounded-lg"></div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {Array.from({ length: columns }).map((_, i) => (
                <th key={i} className="px-5 py-4 font-semibold text-slate-700">
                  <div className="w-20 h-4 bg-slate-200 rounded"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-slate-50/50 transition-colors">
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <td key={colIndex} className="px-5 py-4">
                    {colIndex === 0 ? (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-200 shrink-0"></div>
                        <div className="space-y-2">
                          <div className="h-4 w-32 bg-slate-200 rounded"></div>
                          <div className="h-3 w-20 bg-slate-100 rounded"></div>
                        </div>
                      </div>
                    ) : colIndex === columns - 1 ? (
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-8 h-8 rounded-md bg-slate-200"></div>
                        <div className="w-8 h-8 rounded-md bg-slate-200"></div>
                      </div>
                    ) : (
                      <div className="h-4 w-24 bg-slate-200 rounded"></div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
        <div className="h-4 w-32 bg-slate-200 rounded"></div>
        <div className="flex gap-2">
          <div className="h-8 w-20 bg-slate-200 rounded-md"></div>
          <div className="h-8 w-20 bg-slate-200 rounded-md"></div>
        </div>
      </div>
    </div>
  );
}
