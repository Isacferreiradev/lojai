import { PageHeaderSkeleton, TableSkeleton } from "@/components/shared/skeletons";

export default function AdminOrdersLoading() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />
      <TableSkeleton rows={10} cols={8} />
    </div>
  );
}
