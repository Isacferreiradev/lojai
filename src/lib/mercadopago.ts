import { MercadoPagoConfig } from "mercadopago";

if (!process.env.MERCADO_PAGO_ACCESS_TOKEN) {
  console.warn("MERCADO_PAGO_ACCESS_TOKEN environment variable is not defined");
}

export const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || "TEST-ACCESS-TOKEN-PLACEHOLDER",
});
