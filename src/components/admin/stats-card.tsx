import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
}

export function StatsCard({ title, value, icon: Icon, description }: StatsCardProps) {
  return (
    <Card className="bg-card transition-all hover:-translate-y-1 hover:shadow-[5px_5px_0_0_var(--color-foreground)]">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="label-mono text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-5 w-5 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="font-heading text-3xl font-extrabold text-foreground">{value}</div>
        {description && (
          <p className="font-mono text-[10px] text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
