export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`bg-white/5 animate-pulse rounded-xl ${className}`} />
}

export function CardSkeleton({ n = 5 }: { n?: number }) {
  return <div className="space-y-2">{[...Array(n)].map((_, i) => <Skeleton key={i} className="h-16" />)}</div>
}
