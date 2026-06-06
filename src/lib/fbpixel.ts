export const FB_PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID || "2079703992959091";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/** Dispara um evento padrão do Meta Pixel (no client). */
export function fbpTrack(event: string, params?: Record<string, unknown>) {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", event, params);
  }
}
