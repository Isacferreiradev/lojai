import { PageHeaderSkeleton, StatsCardsSkeleton } from "@/components/shared/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboardLoading() {
  return (
    <div className="space-y-8">
      <PageHeaderSkeleton />
      <StatsCardsSkeleton />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Skeleton className="h-72 w-full border-2 border-foreground" />
        </div>
        <Skeleton className="h-72 w-full border-2 border-foreground" />
      </div>
    </div>
  );
}
