import { getAdminReviews } from "@/actions/admin";
import { PageHeader, AdminPagination } from "@/components/admin/ui";
import { DataTable } from "@/components/admin/data-table";
import { ReviewActions } from "@/components/admin/reviews/review-actions";
import { CreateReviewButton } from "@/components/admin/reviews/review-actions";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

interface PageProps {
  searchParams: Promise<{ page?: string; ativas?: string }>;
}

export default async function AdminReviewsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const page = Number(sp.page) || 1;
  const onlyActive = sp.ativas === "true" ? true : undefined;

  const { reviews, total, pages } = await getAdminReviews({
    isActive: onlyActive,
    page,
    limit: 20,
  });

  return (
    <div>
      <PageHeader
        title="Avaliações"
        description={`${total} avaliações no sistema`}
        actions={<CreateReviewButton />}
      />

      {/* Filter tabs */}
      <div className="flex gap-1 mb-6">
        {[
          { label: "Todas", href: "/admin/avaliacoes?page=1" },
          { label: "Ativas", href: "/admin/avaliacoes?ativas=true&page=1" },
        ].map((tab) => {
          const isActive = tab.href.includes("ativas=true")
            ? sp.ativas === "true"
            : !sp.ativas;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`px-4 py-1.5 border-2 border-foreground font-mono text-xs font-semibold uppercase tracking-wide transition-colors ${
                isActive
                  ? "bg-foreground text-background"
                  : "bg-card text-muted-foreground hover:bg-muted"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      <DataTable
        data={reviews}
        columns={[
          {
            header: "Produto",
            cell: (row) => (
              <Link
                href={`/produto/${row.product.slug}`}
                target="_blank"
                className="text-xs font-semibold text-primary hover:underline"
              >
                {row.product.name}
              </Link>
            ),
          },
          {
            header: "Cliente",
            cell: (row) => (
              <div>
                <p className="text-sm font-medium text-foreground">{row.name}</p>
                {row.city && (
                  <p className="text-xs text-muted-foreground">{row.city}</p>
                )}
              </div>
            ),
          },
          {
            header: "Nota",
            cell: (row) => (
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i} className={i < row.rating ? "text-yellow-400" : "text-muted-foreground/30"}>
                    ★
                  </span>
                ))}
                <span className="text-xs text-muted-foreground ml-1">({row.rating})</span>
              </div>
            ),
          },
          {
            header: "Comentário",
            cell: (row) => (
              <p className="text-xs text-muted-foreground line-clamp-2 max-w-xs">{row.comment}</p>
            ),
          },
          {
            header: "Data",
            cell: (row) => (
              <span className="text-xs text-muted-foreground">{formatDate(row.createdAt)}</span>
            ),
          },
          {
            header: "Status",
            cell: (row) => (
              <span className={`inline-flex border-2 border-foreground px-2 py-0.5 font-mono text-[10px] font-semibold uppercase ${row.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                {row.isActive ? "Publicada" : "Oculta"}
              </span>
            ),
          },
          {
            header: "",
            cell: (row) => <ReviewActions review={row} />,
            className: "w-24",
          },
        ]}
        emptyMessage="Nenhuma avaliação encontrada."
      />

      <AdminPagination
        currentPage={page}
        totalPages={pages}
        total={total}
        limit={20}
        baseHref="/admin/avaliacoes"
        searchParams={onlyActive ? { ativas: "true" } : {}}
      />
    </div>
  );
}
