import { CreditCard, Award, HeartHandshake, ShieldCheck } from "lucide-react";

const benefits = [
  {
    icon: CreditCard,
    title: "Até 12x Sem Juros",
    description: "Parcelamento flexível em todos os cartões de crédito via Mercado Pago.",
  },
  {
    icon: Award,
    title: "Qualidade Artesanal",
    description: "Peças selecionadas com acabamento impecável e durabilidade garantida.",
  },
  {
    icon: HeartHandshake,
    title: "Suporte Personalizado",
    description: "Atendimento exclusivo via WhatsApp para escolher o tamanho e a cor ideais.",
  },
  {
    icon: ShieldCheck,
    title: "Garantia de Satisfação",
    description: "Não gostou? Fazemos a devolução ou troca sem complicações.",
  },
];

export function BenefitsSection() {
  return (
    <section className="py-2">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="group flex flex-col gap-4 border-2 border-foreground bg-card p-6 transition-all duration-200 hover:-translate-y-1 hover:bg-foreground hover:text-background hover:shadow-[5px_5px_0_0_var(--color-primary)]"
            >
              <div className="flex items-center justify-between">
                <div className="flex size-11 items-center justify-center border-2 border-foreground bg-primary text-primary-foreground transition-colors group-hover:border-background">
                  <Icon className="h-5 w-5" strokeWidth={2.25} />
                </div>
                <span className="font-mono text-2xl font-bold text-muted-foreground/40 transition-colors group-hover:text-background/40">
                  0{index + 1}
                </span>
              </div>
              <div className="space-y-1.5">
                <h4 className="font-heading text-sm font-bold">{item.title}</h4>
                <p className="text-xs leading-relaxed text-muted-foreground transition-colors group-hover:text-background/70">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
