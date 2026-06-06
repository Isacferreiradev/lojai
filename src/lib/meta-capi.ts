import crypto from "crypto";

const GRAPH_VERSION = "v21.0";

function sha256(value?: string | null): string | undefined {
  if (!value) return undefined;
  const normalized = value.trim().toLowerCase();
  if (!normalized) return undefined;
  return crypto.createHash("sha256").update(normalized).digest("hex");
}

function digits(value?: string | null): string | undefined {
  if (!value) return undefined;
  const d = value.replace(/\D/g, "");
  return d || undefined;
}

export function isCapiConfigured(): boolean {
  return !!process.env.META_CAPI_TOKEN && !!process.env.NEXT_PUBLIC_META_PIXEL_ID;
}

interface PurchaseInput {
  eventId: string; // dedup with the browser pixel (use order id)
  value: number;
  currency?: string;
  email?: string | null;
  phone?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  country?: string;
  contentIds?: string[];
  fbp?: string | null;
  fbc?: string | null;
  eventSourceUrl?: string;
  clientIp?: string | null;
  clientUserAgent?: string | null;
}

/** Envia um evento Purchase server-side para a Conversions API do Meta. */
export async function sendPurchaseEvent(input: PurchaseInput): Promise<boolean> {
  if (!isCapiConfigured()) return false;

  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID!;
  const token = process.env.META_CAPI_TOKEN!;

  const userData: Record<string, unknown> = {
    em: sha256(input.email) ? [sha256(input.email)] : undefined,
    ph: digits(input.phone) ? [sha256(digits(input.phone))] : undefined,
    fn: sha256(input.firstName) ? [sha256(input.firstName)] : undefined,
    ln: sha256(input.lastName) ? [sha256(input.lastName)] : undefined,
    ct: sha256(input.city) ? [sha256(input.city)] : undefined,
    st: sha256(input.state) ? [sha256(input.state)] : undefined,
    zp: digits(input.zip) ? [sha256(digits(input.zip))] : undefined,
    country: sha256(input.country || "br") ? [sha256(input.country || "br")] : undefined,
    fbp: input.fbp || undefined,
    fbc: input.fbc || undefined,
    client_ip_address: input.clientIp || undefined,
    client_user_agent: input.clientUserAgent || undefined,
  };
  // remove undefined
  Object.keys(userData).forEach((k) => userData[k] === undefined && delete userData[k]);

  const payload = {
    data: [
      {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        event_id: input.eventId,
        action_source: "website",
        event_source_url: input.eventSourceUrl,
        user_data: userData,
        custom_data: {
          currency: input.currency || "BRL",
          value: Number(input.value.toFixed(2)),
          content_type: "product",
          content_ids: input.contentIds && input.contentIds.length ? input.contentIds : undefined,
        },
      },
    ],
  };

  try {
    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${pixelId}/events?access_token=${encodeURIComponent(token)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
      }
    );
    if (!res.ok) {
      const err = await res.text().catch(() => "");
      console.error("Meta CAPI Purchase failed:", res.status, err);
      return false;
    }
    return true;
  } catch (e) {
    console.error("Meta CAPI request error:", e);
    return false;
  }
}
