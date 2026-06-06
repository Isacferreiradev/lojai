import { PageHeaderSkeleton, TableSkeleton } from "@/components/shared/skeletons";

export default function AdminCouponsLoading() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />
      <TableSkeleton rows={8} cols={8} />
    </div>
  );
}
