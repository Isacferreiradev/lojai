import { getAdminCustomers } from "@/actions/admin";
import { PageHeader, AdminPagination } from "@/components/admin/ui";
import { DataTable } from "@/components/admin/data-table";
import { ToggleCustomerButton } from "@/components/admin/customers/toggle-customer-button";
import { formatDate } from "@/lib/utils";

interface PageProps {
  searchParams: Promise<{ busca?: string; page?: string }>;
}

export default async function AdminCustomersPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const page = Number(sp.page) || 1;
  const search = sp.busca || "";

  const { customers, total, pages } = await getAdminCustomers({
    search,
    page,
    limit: 20,
  });

  return (
    <div>
      <PageHeader
        title="Clientes"
        description={`${total} clientes cadastrados`}
      />

      {/* Search */}
      <form method="get" action="/admin/clientes" className="flex gap-2 mb-6">
        <input
          type="search"
          name="busca"
          defaultValue={search}
          placeholder="Nome ou e-mail..."
          className="h-9 w-full sm:w-72 rounded-none border-2 border-foreground bg-card px-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
        />
        <button
          type="submit"
          className="h-9 px-4 border-2 border-foreground bg-primary text-primary-foreground text-sm font-semibold uppercase tracking-wide hover:bg-primary/90 transition-colors"
        >
          Buscar
        </button>
      </form>

      <DataTable
        data={customers}
        columns={[
          {
            header: "Cliente",
            cell: (row) => (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 border-2 border-foreground bg-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-foreground font-bold text-sm">
                    {row.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">{row.name}</p>
                  <p className="text-xs text-muted-foreground">{row.email}</p>
                </div>
              </div>
            ),
          },
          {
            header: "Telefone",
            cell: (row) => (
              <span className="text-sm text-muted-foreground">{row.phone || "—"}</span>
            ),
          },
          {
            header: "Pedidos",
            cell: (row) => (
              <span className="font-semibold text-sm text-foreground">{row._count.orders}</span>
            ),
          },
          {
            header: "Perfil",
            cell: (row) => (
              <span className={`inline-flex border-2 border-foreground px-2 py-0.5 font-mono text-[10px] font-semibold uppercase ${
                row.role === "ADMIN" || row.role === "SUPER_ADMIN"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-muted text-muted-foreground"
              }`}>
                {row.role === "SUPER_ADMIN" ? "Super Admin" : row.role === "ADMIN" ? "Admin" : "Cliente"}
              </span>
            ),
          },
          {
            header: "Cadastro",
            cell: (row) => (
              <span className="text-xs text-muted-foreground">{formatDate(row.createdAt)}</span>
            ),
          },
          {
            header: "Status",
            cell: (row) => (
              <span className={`inline-flex border-2 border-foreground px-2 py-0.5 font-mono text-[10px] font-semibold uppercase ${row.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                {row.isActive ? "Ativo" : "Bloqueado"}
              </span>
            ),
          },
          {
            header: "",
            cell: (row) => (
              <ToggleCustomerButton
                id={row.id}
                name={row.name}
                isActive={row.isActive}
              />
            ),
            className: "text-right w-16",
          },
        ]}
        emptyMessage="Nenhum cliente encontrado."
      />

      <AdminPagination
        currentPage={page}
        totalPages={pages}
        total={total}
        limit={20}
        baseHref="/admin/clientes"
        searchParams={search ? { busca: search } : {}}
      />
    </div>
  );
}
