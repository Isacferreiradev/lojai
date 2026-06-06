import { PageHeaderSkeleton, TableSkeleton } from "@/components/shared/skeletons";

export default function AdminReviewsLoading() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />
      <TableSkeleton rows={10} cols={7} />
    </div>
  );
}
