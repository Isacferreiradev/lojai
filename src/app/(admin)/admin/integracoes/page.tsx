import { PageHeader } from "@/components/admin/ui";
import { CreditCard, Truck, BarChart3, MessageCircle, Mail, Check, X } from "lucide-react";

function StatusPill({ ok }: { ok: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 border-2 border-foreground px-2 py-0.5 font-mono text-[0.65rem] font-bold uppercase ${
        ok ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
      }`}
    >
      {ok ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
      {ok ? "Conectado" : "Não configurado"}
    </span>
  );
}

export default function AdminIntegrationsPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const ironpayOk = !!process.env.IRONPAY_API_TOKEN && !!process.env.IRONPAY_OFFER_HASH;

  return (
    <div className="space-y-8">
      <PageHeader title="Integrações" description="Conecte gateways, frete, analytics e comunicação." />

      {/* Payment — IronPay */}
      <section className="border-2 border-foreground bg-card">
        <div className="flex items-center justify-between border-b-2 border-foreground bg-muted/30 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center border-2 border-foreground bg-primary text-primary-foreground">
              <CreditCard className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-heading text-sm font-bold text-foreground">IronPay — Pagamento PIX</h2>
              <p className="font-mono text-[0.65rem] uppercase tracking-wide text-muted-foreground">Gateway ativo do checkout</p>
            </div>
          </div>
          <StatusPill ok={ironpayOk} />
        </div>
        <div className="space-y-4 p-6 text-sm">
          <p className="text-muted-foreground">
            O checkout gera cobranças PIX via IronPay com confirmação automática por webhook. Configure as variáveis no
            arquivo <code className="border border-foreground/30 bg-muted px-1 font-mono text-xs">.env</code>:
          </p>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <span className="font-mono text-xs">IRONPAY_API_TOKEN</span>
              <StatusPill ok={!!process.env.IRONPAY_API_TOKEN} />
            </li>
            <li className="flex items-center gap-2">
              <span className="font-mono text-xs">IRONPAY_OFFER_HASH</span>
              <StatusPill ok={!!process.env.IRONPAY_OFFER_HASH} />
            </li>
          </ul>
          <div className="border-2 border-foreground bg-muted/30 p-4">
            <p className="label-mono mb-1 text-primary">[ URL de Postback (Webhook) ]</p>
            <code className="block break-all font-mono text-xs text-foreground">{siteUrl}/api/webhooks/ironpay</code>
            <p className="mt-2 text-xs text-muted-foreground">
              Cadastre esta URL no painel da IronPay (ou ela é enviada automaticamente em cada transação via
              <span className="font-mono"> postback_url</span>).
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Passo a passo: 1) gere o <strong>API Token</strong> em IronPay → API; 2) crie uma <strong>oferta</strong> genérica
            e copie o <strong>hash</strong> dela para <span className="font-mono">IRONPAY_OFFER_HASH</span>; 3) reinicie a aplicação.
          </p>
        </div>
      </section>

      {/* Coming soon integrations */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {[
          { icon: Truck, title: "Frete (Correios / Melhor Envio)", desc: "Cálculo de frete real por CEP e geração de etiquetas." },
          { icon: BarChart3, title: "Meta Pixel + Google Analytics", desc: "Rastreamento de conversões e remarketing de anúncios." },
          { icon: MessageCircle, title: "WhatsApp", desc: "Notificações de pedido e recuperação de carrinho." },
          { icon: Mail, title: "E-mail transacional", desc: "Confirmações de pedido e atualizações de status por e-mail." },
        ].map((it) => {
          const Icon = it.icon;
          return (
            <div key={it.title} className="flex items-start gap-3 border-2 border-foreground bg-card p-5">
              <div className="flex size-9 shrink-0 items-center justify-center border-2 border-foreground bg-muted text-foreground">
                <Icon className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-heading text-sm font-bold text-foreground">{it.title}</h3>
                  <span className="border-2 border-foreground bg-muted px-1.5 py-0.5 font-mono text-[0.6rem] font-bold uppercase text-muted-foreground">
                    em breve
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{it.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
