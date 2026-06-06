"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ─── Status Badge ─────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, string> = {
  // Order statuses
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  AWAITING_PAYMENT: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  PAID: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  PROCESSING: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  SHIPPED: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
  DELIVERED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  REFUNDED: "bg-gray-100 text-gray-800 dark:bg-gray-800/60 dark:text-gray-300",
  // Payment
  APPROVED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  REJECTED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  IN_PROCESS: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendente",
  AWAITING_PAYMENT: "Aguard. Pgto",
  PAID: "Pago",
  PROCESSING: "Em Preparo",
  SHIPPED: "Enviado",
  DELIVERED: "Entregue",
  CANCELLED: "Cancelado",
  REFUNDED: "Reembolsado",
  APPROVED: "Aprovado",
  REJECTED: "Rejeitado",
  IN_PROCESS: "Em Processo",
  PIX: "Pix",
  CREDIT_CARD: "Cartão de Crédito",
  DEBIT_CARD: "Cartão de Débito",
  BOLETO: "Boleto",
  PERCENTAGE: "Porcentagem",
  FIXED: "Valor Fixo",
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const style = STATUS_STYLES[status] ?? "bg-muted text-muted-foreground";
  const label = STATUS_LABELS[status] ?? status;

  return (
    <span
      className={cn(
        "inline-flex items-center border-2 border-foreground px-2 py-0.5 font-mono text-[0.65rem] font-semibold uppercase tracking-wider",
        style,
        className
      )}
    >
      {label}
    </span>
  );
}

// ─── Page Header ─────────────────────────────────────────────────────────────

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  backHref?: string;
}

export function PageHeader({ title, description, actions, backHref }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div className="flex items-center gap-3">
        {backHref && (
          <Link
            href={backHref}
            className="flex items-center justify-center w-9 h-9 border-2 border-foreground bg-card hover:bg-foreground hover:text-background transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>
        )}
        <div>
          <h1 className="display text-3xl sm:text-4xl text-foreground">{title}</h1>
          {description && (
            <p className="font-mono text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  total: number;
  limit: number;
  baseHref: string;
  searchParams?: Record<string, string>;
}

export function AdminPagination({
  currentPage,
  totalPages,
  total,
  limit,
  baseHref,
  searchParams = {},
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const buildHref = (page: number) => {
    const params = new URLSearchParams({ ...searchParams, page: String(page) });
    return `${baseHref}?${params.toString()}`;
  };

  const start = (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, total);

  return (
    <div className="flex items-center justify-between mt-4 px-1">
      <p className="text-sm text-muted-foreground">
        Mostrando <span className="font-medium">{start}–{end}</span> de{" "}
        <span className="font-medium">{total}</span> registros
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          asChild
          disabled={currentPage <= 1}
          className="h-8 w-8 p-0"
        >
          <Link href={buildHref(currentPage - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <span className="text-sm font-medium px-2">
          {currentPage} / {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          asChild
          disabled={currentPage >= totalPages}
          className="h-8 w-8 p-0"
        >
          <Link href={buildHref(currentPage + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

// ─── Search Input ─────────────────────────────────────────────────────────────

interface AdminSearchProps {
  placeholder?: string;
  defaultValue?: string;
  className?: string;
}

export function AdminSearch({ placeholder = "Buscar...", defaultValue, className }: AdminSearchProps) {
  return (
    <input
      type="search"
      name="busca"
      defaultValue={defaultValue}
      placeholder={placeholder}
      className={cn(
        "h-10 w-full sm:w-64 rounded-none border-2 border-foreground bg-card px-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30",
        className
      )}
    />
  );
}

// ─── Confirm Delete Modal ─────────────────────────────────────────────────────

interface ConfirmDialogProps {
  title?: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  title = "Confirmar exclusão",
  description = "Esta ação não pode ser desfeita. Deseja continuar?",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-card border-2 border-foreground shadow-[6px_6px_0_0_var(--color-foreground)] p-6 max-w-sm w-full mx-4">
        <h3 className="font-heading text-lg font-extrabold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-6">{description}</p>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Confirmar
          </Button>
        </div>
      </div>
    </div>
  );
}
