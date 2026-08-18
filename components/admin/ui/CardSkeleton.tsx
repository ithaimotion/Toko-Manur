interface CardSkeletonProps {
  count?: number;
}

export function CardSkeleton({ count = 3 }: CardSkeletonProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm animate-pulse">
          <div className="w-full h-40 bg-slate-200"></div>
          <div className="p-5 space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2 flex-1 mr-4">
                <div className="h-5 w-3/4 bg-slate-200 rounded"></div>
                <div className="h-4 w-1/2 bg-slate-100 rounded"></div>
              </div>
              <div className="h-6 w-16 bg-slate-200 rounded-full shrink-0"></div>
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full bg-slate-100 rounded"></div>
              <div className="h-3 w-4/5 bg-slate-100 rounded"></div>
            </div>
            <div className="pt-4 border-t border-slate-100 flex justify-between">
              <div className="h-8 w-20 bg-slate-200 rounded-md"></div>
              <div className="flex gap-2">
                <div className="h-8 w-8 bg-slate-200 rounded-md"></div>
                <div className="h-8 w-8 bg-slate-200 rounded-md"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
