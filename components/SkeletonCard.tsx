// components/SkeletonCard.tsx
import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[160px] w-[232px] rounded-md" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[232px]" />
      </div>
    </div>
  )
}
