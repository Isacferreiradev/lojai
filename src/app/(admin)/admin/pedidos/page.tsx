import Link from "next/link";
import { getAdminOrders } from "@/actions/admin";
import { DataTable } from "@/components/admin/data-table";
import { PageHeader, StatusBadge, AdminPagination } from "@/components/admin/ui";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderStatus } from "@prisma/client";

const ORDER_STATUSES = [
  { value: "", label: "Todos" },
  { value: "PENDING", label: "Pendente" },
  { value: "AWAITING_PAYMENT", label: "Aguard. Pgto" },
  { value: "PAID", label: "Pago" },
  { value: "PROCESSING", label: "Em Preparo" },
  { value: "SHIPPED", label: "Enviado" },
  { value: "DELIVERED", label: "Entregue" },
  { value: "CANCELLED", label: "Cancelado" },
  { value: "REFUNDED", label: "Reembolsado" },
];

interface PageProps {
  searchParams: Promise<{ busca?: string; status?: string; page?: string }>;
}

export default async function AdminOrdersPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const page = Number(sp.page) || 1;
  const search = sp.busca || "";
  const status = (sp.status as OrderStatus) || undefined;

  const { orders, total, pages } = await getAdminOrders({
    search,
    status,
    page,
    limit: 20,
  });

  const buildFilterUrl = (params: Record<string, string>) => {
    const p = new URLSearchParams({ ...(search && { busca: search }), ...(status && { status }), ...params });
    return `/admin/pedidos?${p.toString()}`;
  };

  return (
    <div>
      <PageHeader
        title="Pedidos"
        description={`${total} pedidos encontrados`}
      />

      {/* Filters bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search */}
        <form method="get" action="/admin/pedidos" className="flex gap-2">
          {status && <input type="hidden" name="status" value={status} />}
          <input
            type="search"
            name="busca"
            defaultValue={search}
            placeholder="Nº pedido, e-mail ou nome..."
            className="h-9 w-full sm:w-72 rounded-none border-2 border-foreground bg-card px-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
          />
          <Button type="submit" size="sm" className="h-9 px-4">
            Buscar
          </Button>
        </form>

        {/* Status tabs */}
        <div className="flex gap-1 flex-wrap">
          {ORDER_STATUSES.map((s) => (
            <Link
              key={s.value}
              href={buildFilterUrl(s.value ? { status: s.value, page: "1" } : { page: "1" })}
              className={`px-3 py-1.5 border-2 border-foreground font-mono text-xs font-semibold uppercase tracking-wide transition-colors ${
                (status || "") === s.value
                  ? "bg-foreground text-background"
                  : "bg-card text-muted-foreground hover:bg-muted"
              }`}
            >
              {s.label}
            </Link>
          ))}
        </div>
      </div>

      <DataTable
        data={orders}
        columns={[
          {
            header: "Pedido",
            cell: (row) => (
              <span className="font-mono text-xs font-semibold text-foreground">
                {row.orderNumber}
              </span>
            ),
          },
          {
            header: "Cliente",
            cell: (row) => (
              <div>
                <p className="font-medium text-foreground text-xs">{row.shippingName} {row.shippingSurname}</p>
                <p className="text-muted-foreground text-[11px]">{row.shippingEmail}</p>
              </div>
            ),
          },
          {
            header: "Itens",
            cell: (row) => (
              <span className="text-xs text-muted-foreground">
                {row.items.reduce((acc: number, i: any) => acc + i.quantity, 0)} item(s)
              </span>
            ),
          },
          {
            header: "Total",
            cell: (row) => (
              <span className="font-semibold text-foreground text-sm">
                {formatCurrency(Number(row.total))}
              </span>
            ),
          },
          {
            header: "Status",
            cell: (row) => <StatusBadge status={row.status} />,
          },
          {
            header: "Pagamento",
            cell: (row) => row.payment ? (
              <StatusBadge status={row.payment.status} />
            ) : (
              <span className="text-xs text-muted-foreground">—</span>
            ),
          },
          {
            header: "Data",
            cell: (row) => (
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {formatDate(row.createdAt)}
              </span>
            ),
          },
          {
            header: "",
            cell: (row) => (
              <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0">
                <Link href={`/admin/pedidos/${row.id}`} title="Ver detalhes">
                  <Eye className="h-4 w-4" />
                </Link>
              </Button>
            ),
            className: "text-right w-12",
          },
        ]}
        emptyMessage="Nenhum pedido encontrado."
      />

      <AdminPagination
        currentPage={page}
        totalPages={pages}
        total={total}
        limit={20}
        baseHref="/admin/pedidos"
        searchParams={{ ...(search && { busca: search }), ...(status && { status }) }}
      />
    </div>
  );
}
