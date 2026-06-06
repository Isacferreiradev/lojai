import { getAdminCoupons } from "@/actions/admin";
import { PageHeader } from "@/components/admin/ui";
import { DataTable } from "@/components/admin/data-table";
import { CreateCouponButton } from "@/components/admin/coupons/coupon-actions";
import { CouponActions } from "@/components/admin/coupons/coupon-actions";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function AdminCouponsPage() {
  const raw = await getAdminCoupons();
  // Convert Prisma Decimals to plain numbers so the data is safe to pass
  // to the client component (CouponActions).
  const coupons = raw.map((c) => ({
    ...c,
    value: Number(c.value),
    minOrderValue: c.minOrderValue != null ? Number(c.minOrderValue) : null,
  }));

  return (
    <div>
      <PageHeader
        title="Cupons de Desconto"
        description={`${coupons.length} cupons cadastrados`}
        actions={<CreateCouponButton />}
      />

      <DataTable
        data={coupons}
        columns={[
          {
            header: "Código",
            cell: (row) => (
              <span className="font-mono font-bold text-primary text-sm">{row.code}</span>
            ),
          },
          {
            header: "Tipo",
            cell: (row) => (
              <span className="inline-flex border-2 border-foreground px-2 py-0.5 font-mono text-[10px] font-semibold uppercase bg-muted text-muted-foreground">
                {row.type === "PERCENTAGE" ? "% Porcentagem" : "R$ Fixo"}
              </span>
            ),
          },
          {
            header: "Desconto",
            cell: (row) => (
              <span className="font-semibold text-sm text-foreground">
                {row.type === "PERCENTAGE"
                  ? `${Number(row.value)}%`
                  : formatCurrency(Number(row.value))}
              </span>
            ),
          },
          {
            header: "Pedido mín.",
            cell: (row) => (
              <span className="text-sm text-muted-foreground">
                {row.minOrderValue ? formatCurrency(Number(row.minOrderValue)) : "—"}
              </span>
            ),
          },
          {
            header: "Usos",
            cell: (row) => (
              <span className="text-sm text-muted-foreground">
                {row.usedCount}
                {row.maxUses ? ` / ${row.maxUses}` : ""}
              </span>
            ),
          },
          {
            header: "Validade",
            cell: (row) => (
              <span className="text-xs text-muted-foreground">
                {row.expiresAt ? formatDate(row.expiresAt) : "Sem prazo"}
              </span>
            ),
          },
          {
            header: "Status",
            cell: (row) => {
              const expired = row.expiresAt && new Date(row.expiresAt) < new Date();
              const exhausted = row.maxUses && row.usedCount >= row.maxUses;
              const isValid = row.isActive && !expired && !exhausted;
              return (
                <span className={`inline-flex border-2 border-foreground px-2 py-0.5 font-mono text-[10px] font-semibold uppercase ${isValid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {!row.isActive ? "Inativo" : expired ? "Expirado" : exhausted ? "Esgotado" : "Ativo"}
                </span>
              );
            },
          },
          {
            header: "",
            cell: (row) => <CouponActions coupon={row} />,
            className: "text-right w-20",
          },
        ]}
        emptyMessage="Nenhum cupom cadastrado."
      />
    </div>
  );
}
