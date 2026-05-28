import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  value: ReactNode;
  hint?: string;
  variation?: number;
  icon?: LucideIcon;
  tone?: "default" | "primary" | "warning" | "destructive";
}

export function StatCard({ title, value, hint, variation, icon: Icon, tone = "default" }: Props) {
  const toneClasses = {
    default: "bg-card",
    primary: "bg-primary-soft border-primary/20",
    warning: "bg-warning/10 border-warning/30",
    destructive: "bg-destructive/10 border-destructive/30",
  }[tone];

  return (
    <Card className={`p-5 shadow-soft ${toneClasses}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{value}</p>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
          {variation !== undefined && (
            <p className={`mt-2 text-xs font-medium ${variation >= 0 ? "text-success" : "text-destructive"}`}>
              {variation >= 0 ? "▲" : "▼"} {Math.abs(variation).toFixed(1).replace(".", ",")}% vs. mês anterior
            </p>
          )}
        </div>
        {Icon && (
          <div className="rounded-lg bg-primary-soft p-2.5 text-primary">
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </Card>
  );
}
