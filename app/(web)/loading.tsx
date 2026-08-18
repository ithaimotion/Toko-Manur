export default function Loading() {
  return (
    <div className="min-h-screen animate-pulse">
      {/* Hero Section Skeleton */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 bg-slate-50 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <div className="w-48 h-8 bg-slate-200 rounded-full mb-6"></div>
              <div className="w-full max-w-lg h-24 bg-slate-200 rounded-2xl mb-6"></div>
              <div className="w-3/4 h-6 bg-slate-200 rounded-lg mb-4"></div>
              <div className="w-2/3 h-6 bg-slate-200 rounded-lg mb-8"></div>
              <div className="flex gap-4">
                <div className="w-40 h-12 bg-slate-200 rounded-xl"></div>
                <div className="w-40 h-12 bg-slate-200 rounded-xl"></div>
              </div>
            </div>
            <div className="hidden lg:block relative aspect-[4/3] w-full bg-slate-200 rounded-3xl"></div>
          </div>
        </div>
      </section>

      {/* Promos Skeleton */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="h-40 bg-slate-100 rounded-2xl"></div>
            <div className="h-40 bg-slate-100 rounded-2xl hidden md:block"></div>
            <div className="h-40 bg-slate-100 rounded-2xl hidden lg:block"></div>
          </div>
        </div>
      </section>

      {/* Products Skeleton */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <div className="w-32 h-6 bg-slate-200 rounded-full mb-3"></div>
              <div className="w-64 h-10 bg-slate-200 rounded-xl"></div>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-4">
                <div className="aspect-square bg-slate-100 rounded-xl mb-4"></div>
                <div className="w-full h-5 bg-slate-100 rounded-lg mb-2"></div>
                <div className="w-2/3 h-5 bg-slate-100 rounded-lg mb-4"></div>
                <div className="w-1/2 h-6 bg-slate-200 rounded-lg mb-4"></div>
                <div className="w-full h-10 bg-slate-200 rounded-xl"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
