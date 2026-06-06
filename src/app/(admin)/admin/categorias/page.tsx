import { getAdminCategories } from "@/actions/admin";
import { PageHeader } from "@/components/admin/ui";
import { DataTable } from "@/components/admin/data-table";
import { CategoryActions, CreateCategoryButton } from "@/components/admin/categories/category-actions";

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories();

  return (
    <div>
      <PageHeader
        title="Categorias"
        description={`${categories.length} categorias cadastradas`}
        actions={<CreateCategoryButton />}
      />

      <DataTable
        data={categories}
        columns={[
          {
            header: "Imagem",
            cell: (row) => row.image ? (
              <img src={row.image} alt={row.name} className="w-12 h-12 object-cover border-2 border-foreground" />
            ) : (
              <div className="w-12 h-12 border-2 border-foreground bg-muted flex items-center justify-center text-muted-foreground text-xs">
                sem img
              </div>
            ),
          },
          {
            header: "Nome",
            cell: (row) => (
              <div>
                <p className="font-semibold text-sm text-foreground">{row.name}</p>
                <p className="text-xs text-muted-foreground font-mono">{row.slug}</p>
              </div>
            ),
          },
          {
            header: "Descrição",
            cell: (row) => (
              <span className="text-xs text-muted-foreground line-clamp-2">
                {row.description || "—"}
              </span>
            ),
          },
          {
            header: "Produtos",
            cell: (row) => (
              <span className="font-semibold text-sm">{row._count.products}</span>
            ),
          },
          {
            header: "Ordem",
            cell: (row) => (
              <span className="text-sm text-muted-foreground">{row.sortOrder}</span>
            ),
          },
          {
            header: "Status",
            cell: (row) => (
              <span className={`inline-flex border-2 border-foreground px-2 py-0.5 font-mono text-[10px] font-semibold uppercase ${row.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                {row.isActive ? "Ativa" : "Inativa"}
              </span>
            ),
          },
          {
            header: "",
            cell: (row) => <CategoryActions category={row} />,
            className: "text-right w-20",
          },
        ]}
        emptyMessage="Nenhuma categoria encontrada."
      />
    </div>
  );
}
