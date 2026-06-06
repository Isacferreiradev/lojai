export const FB_PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID || "2079703992959091";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/** Dispara um evento padrão do Meta Pixel (no client).
 *  `eventId` permite deduplicar com o evento server-side (Conversions API). */
export function fbpTrack(
  event: string,
  params?: Record<string, unknown>,
  eventId?: string
) {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", event, params, eventId ? { eventID: eventId } : undefined);
  }
}

/** Lê um cookie no client (ex.: _fbp / _fbc do Meta Pixel). */
export function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : undefined;
}
