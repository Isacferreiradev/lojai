import { PageHeaderSkeleton } from "@/components/shared/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminSettingsLoading() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="border-2 border-foreground bg-card overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b-2 border-foreground bg-muted/30">
            <Skeleton className="w-9 h-9" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
          <div className="p-6 grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, j) => (
              <div key={j} className={j === 0 ? "col-span-2" : ""}>
                <Skeleton className="h-3 w-24 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
