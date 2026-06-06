"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface Row {
  pedido: string;
  data: string;
  cliente: string;
  email: string;
  status: string;
  metodo: string;
  total: string;
}

export function ExportButton({ rows, period }: { rows: Row[]; period: string }) {
  const handleExport = () => {
    const headers = ["Pedido", "Data", "Cliente", "E-mail", "Status", "Método", "Total (R$)"];
    const escape = (v: string) => `"${String(v).replace(/"/g, '""')}"`;
    const lines = [
      headers.join(";"),
      ...rows.map((r) =>
        [r.pedido, r.data, r.cliente, r.email, r.status, r.metodo, r.total].map(escape).join(";")
      ),
    ];
    const csv = "﻿" + lines.join("\n"); // BOM for Excel/pt-BR
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `financeiro-lojai-${period}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Button onClick={handleExport} variant="outline" className="gap-2" disabled={rows.length === 0}>
      <Download className="h-4 w-4" />
      Exportar CSV
    </Button>
  );
}
