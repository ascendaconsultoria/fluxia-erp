import { Badge } from "@/components/ui/badge";

type Tone = "success" | "warning" | "destructive" | "info" | "neutral";

const tones: Record<Tone, string> = {
  success: "bg-primary-soft text-primary border-primary/20",
  warning: "bg-warning/15 text-warning-foreground border-warning/30",
  destructive: "bg-destructive/10 text-destructive border-destructive/20",
  info: "bg-info/10 text-info border-info/20",
  neutral: "bg-muted text-muted-foreground border-border",
};

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { tone: Tone; label: string }> = {
    ativo: { tone: "success", label: "Ativo" },
    inativo: { tone: "neutral", label: "Inativo" },
    suspenso: { tone: "warning", label: "Suspenso" },
    pago: { tone: "success", label: "Pago" },
    recebido: { tone: "success", label: "Recebido" },
    pendente: { tone: "warning", label: "Pendente" },
    atrasado: { tone: "destructive", label: "Atrasado" },
    concluida: { tone: "success", label: "Concluída" },
    concluido: { tone: "success", label: "Concluído" },
    cancelada: { tone: "destructive", label: "Cancelada" },
    aberta: { tone: "info", label: "Aberta" },
    andamento: { tone: "info", label: "Em andamento" },
    nao_iniciado: { tone: "neutral", label: "Não iniciado" },
    atrasada: { tone: "destructive", label: "Atrasada" },
    alta: { tone: "destructive", label: "Alta" },
    media: { tone: "warning", label: "Média" },
    baixa: { tone: "neutral", label: "Baixa" },
  };
  const item = map[status] ?? { tone: "neutral" as Tone, label: status };
  return (
    <Badge variant="outline" className={`${tones[item.tone]} font-medium`}>
      {item.label}
    </Badge>
  );
}
