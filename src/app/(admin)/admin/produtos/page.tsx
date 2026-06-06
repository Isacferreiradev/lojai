import Link from "next/link";
import { getAdminProducts } from "@/actions/admin";
import { getAdminCategories } from "@/actions/admin";
import { DataTable } from "@/components/admin/data-table";
import { PageHeader, AdminPagination } from "@/components/admin/ui";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus, Pencil } from "lucide-react";
import { DeleteProductButton } from "@/components/admin/products/delete-product-button";

interface PageProps {
  searchParams: Promise<{ busca?: string; categoria?: string; page?: string }>;
}

export default async function AdminProductsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const page = Number(sp.page) || 1;
  const search = sp.busca || "";
  const categoryId = sp.categoria || "";

  const [{ products, total, pages }, categories] = await Promise.all([
    getAdminProducts({ search, categoryId: categoryId || undefined, page, limit: 20 }),
    getAdminCategories(),
  ]);

  const buildFilterUrl = (params: Record<string, string>) => {
    const p = new URLSearchParams({
      ...(search && { busca: search }),
      ...(categoryId && { categoria: categoryId }),
      ...params,
    });
    return `/admin/produtos?${p.toString()}`;
  };

  return (
    <div>
      <PageHeader
        title="Produtos"
        description={`${total} produtos cadastrados`}
        actions={
          <Button asChild className="gap-2">
            <Link href="/admin/produtos/novo">
              <Plus className="h-4 w-4" /> Novo Produto
            </Link>
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <form method="get" action="/admin/produtos" className="flex gap-2">
          {categoryId && <input type="hidden" name="categoria" value={categoryId} />}
          <input
            type="search"
            name="busca"
            defaultValue={search}
            placeholder="Nome ou SKU..."
            className="h-9 w-full sm:w-64 rounded-none border-2 border-foreground bg-card px-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
          />
          <Button type="submit" size="sm" className="h-9">Buscar</Button>
        </form>

        <div className="flex gap-1 flex-wrap">
          <Link
            href={buildFilterUrl({ page: "1" })}
            className={`px-3 py-1.5 border-2 border-foreground font-mono text-xs font-semibold uppercase tracking-wide transition-colors ${!categoryId ? "bg-foreground text-background" : "bg-card text-muted-foreground hover:bg-muted"}`}
          >
            Todas
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={buildFilterUrl({ categoria: cat.id, page: "1" })}
              className={`px-3 py-1.5 border-2 border-foreground font-mono text-xs font-semibold uppercase tracking-wide transition-colors ${categoryId === cat.id ? "bg-foreground text-background" : "bg-card text-muted-foreground hover:bg-muted"}`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      <DataTable
        data={products}
        columns={[
          {
            header: "Produto",
            cell: (row) => (
              <div className="flex items-center gap-3">
                {row.images[0] ? (
                  <img
                    src={row.images[0].url}
                    alt={row.name}
                    className="w-10 h-10 object-cover border-2 border-foreground flex-shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 border-2 border-foreground bg-muted flex-shrink-0" />
                )}
                <div>
                  <p className="font-semibold text-sm text-foreground">{row.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">{row.sku}</p>
                </div>
              </div>
            ),
          },
          {
            header: "Categoria",
            cell: (row) => (
              <span className="text-xs text-muted-foreground">{row.category.name}</span>
            ),
          },
          {
            header: "Preço",
            cell: (row) => (
              <div>
                {row.promoPrice ? (
                  <>
                    <p className="text-xs line-through text-muted-foreground">{formatCurrency(Number(row.price))}</p>
                    <p className="font-bold text-sm text-primary">{formatCurrency(Number(row.promoPrice))}</p>
                  </>
                ) : (
                  <p className="font-semibold text-sm">{formatCurrency(Number(row.price))}</p>
                )}
              </div>
            ),
          },
          {
            header: "Estoque",
            cell: (row) => (
              <span className={`font-semibold text-sm ${row.stock === 0 ? "text-destructive" : row.stock <= 5 ? "text-yellow-600" : "text-foreground"}`}>
                {row.stock}
              </span>
            ),
          },
          {
            header: "Aval.",
            cell: (row) => (
              <span className="text-xs text-muted-foreground">{row._count.reviews}</span>
            ),
          },
          {
            header: "Status",
            cell: (row) => (
              <div className="flex gap-1.5">
                <span className={`inline-flex border-2 border-foreground px-2 py-0.5 font-mono text-[10px] font-semibold uppercase ${row.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {row.isActive ? "Ativo" : "Inativo"}
                </span>
                {row.isFeatured && (
                  <span className="inline-flex border-2 border-foreground px-2 py-0.5 font-mono text-[10px] font-semibold uppercase bg-primary text-primary-foreground">
                    Destaque
                  </span>
                )}
              </div>
            ),
          },
          {
            header: "",
            cell: (row) => (
              <div className="flex items-center gap-1 justify-end">
                <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0">
                  <Link href={`/admin/produtos/${row.id}/editar`} title="Editar">
                    <Pencil className="h-3.5 w-3.5" />
                  </Link>
                </Button>
                <DeleteProductButton id={row.id} name={row.name} />
              </div>
            ),
            className: "text-right w-20",
          },
        ]}
        emptyMessage="Nenhum produto encontrado."
      />

      <AdminPagination
        currentPage={page}
        totalPages={pages}
        total={total}
        limit={20}
        baseHref="/admin/produtos"
        searchParams={{ ...(search && { busca: search }), ...(categoryId && { categoria: categoryId }) }}
      />
    </div>
  );
}
