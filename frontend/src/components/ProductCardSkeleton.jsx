export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="aspect-[4/3] animate-pulse bg-slate-200" />

      <div className="space-y-4 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
        <div className="flex gap-2">
          <div className="h-7 w-20 animate-pulse rounded-full bg-slate-200" />
          <div className="h-7 w-16 animate-pulse rounded-full bg-slate-200" />
        </div>
      </div>
    </div>
  );
}