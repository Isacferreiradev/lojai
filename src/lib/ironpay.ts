/**
 * IronPay API client — https://docs.ironpayapp.com.br/
 * Base: https://api.ironpayapp.com.br/api/public/v1
 * Auth: api_token via query parameter.
 */

const BASE_URL = "https://api.ironpayapp.com.br/api/public/v1";

export interface IronpayCartItem {
  product_hash: string;
  title: string;
  cover?: string | null;
  price: number; // centavos
  quantity: number;
  operation_type: number; // 1 = sale
  tangible: boolean;
}

export interface IronpayCustomer {
  name: string;
  email: string;
  phone_number: string; // digits only
  document: string; // CPF/CNPJ digits only
  street_name?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zip_code?: string;
}

export interface CreateTransactionInput {
  amount: number; // centavos
  payment_method: "pix" | "credit_card" | "billet";
  installments?: number;
  customer: IronpayCustomer;
  cart: IronpayCartItem[];
  postback_url?: string;
  expire_in_days?: number;
  card?: {
    number: string;
    holder_name: string;
    exp_month: number;
    exp_year: number;
    cvv: string;
  };
}

export interface IronpayTransaction {
  id: number;
  hash: string;
  payment_method: string;
  payment_status: string; // paid | pending | canceled | refunded
  amount: number;
  pix?: { pix_url: string | null; pix_qr_code: string | null } | null;
  billet?: { billet_url?: string | null; billet_barcode?: string | null } | null;
  [key: string]: unknown;
}

function getToken(): string {
  const token = process.env.IRONPAY_API_TOKEN;
  if (!token) throw new Error("IRONPAY_API_TOKEN não configurado.");
  return token;
}

function getOfferHash(): string {
  const hash = process.env.IRONPAY_OFFER_HASH;
  if (!hash) throw new Error("IRONPAY_OFFER_HASH não configurado.");
  return hash;
}

export function isIronpayConfigured(): boolean {
  return !!process.env.IRONPAY_API_TOKEN && !!process.env.IRONPAY_OFFER_HASH;
}

export async function createTransaction(input: CreateTransactionInput): Promise<IronpayTransaction> {
  const url = `${BASE_URL}/transactions?api_token=${encodeURIComponent(getToken())}`;

  const body = {
    offer_hash: getOfferHash(),
    transaction_origin: "api",
    installments: input.installments ?? 1,
    ...input,
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = (data && (data.message || data.error)) || `Erro IronPay (${res.status})`;
    throw new Error(typeof msg === "string" ? msg : "Falha ao criar transação IronPay");
  }

  return data as IronpayTransaction;
}

/** Re-fetch a transaction to confirm its real status (used to verify webhooks). */
export async function getTransaction(hash: string): Promise<IronpayTransaction | null> {
  const url = `${BASE_URL}/transactions/${encodeURIComponent(hash)}?api_token=${encodeURIComponent(getToken())}`;
  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) return null;
  return (await res.json().catch(() => null)) as IronpayTransaction | null;
}

/** Map IronPay payment_status → our domain. */
export function mapIronpayStatus(status: string): {
  payment: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED" | "REFUNDED" | "IN_PROCESS";
  order: "PENDING" | "AWAITING_PAYMENT" | "PAID" | "CANCELLED" | "REFUNDED";
} {
  switch ((status || "").toLowerCase()) {
    case "paid":
    case "approved":
      return { payment: "APPROVED", order: "PAID" };
    case "pending":
    case "waiting_payment":
    case "processing":
      return { payment: "IN_PROCESS", order: "AWAITING_PAYMENT" };
    case "refunded":
      return { payment: "REFUNDED", order: "REFUNDED" };
    case "canceled":
    case "cancelled":
    case "refused":
    case "chargedback":
      return { payment: "CANCELLED", order: "CANCELLED" };
    default:
      return { payment: "PENDING", order: "AWAITING_PAYMENT" };
  }
}
