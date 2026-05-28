import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/fluxia/PageHeader";
import { DataTable } from "@/components/fluxia/DataTable";
import { StatusBadge } from "@/components/fluxia/StatusBadge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/fluxia/ConfirmDialog";
import { useStore } from "@/mock/store";
import { useState } from "react";
import { Fechamento } from "@/mock/data";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/bpo/fechamento")({
  component: () => {
    const { s, update } = useStore();
    const [concluir, setConcluir] = useState<Fechamento | null>(null);

    return (
      <>
        <PageHeader title="Fechamento mensal" description="Acompanhe o progresso dos fechamentos da carteira." />
        <DataTable data={s.fechamentos} searchKeys={["cliente", "responsavel"]}
          columns={[
            { key: "c", header: "Cliente", cell: (r) => <span className="font-medium">{r.cliente}</span> },
            { key: "m", header: "Mês", cell: (r) => r.mes },
            { key: "p", header: "Progresso", cell: (r) => (
              <div className="flex w-40 items-center gap-2"><Progress value={r.progresso} className="h-2" /><span className="text-xs">{r.progresso}%</span></div>
            ) },
            { key: "r", header: "Responsável", cell: (r) => r.responsavel },
            { key: "s", header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
            { key: "a", header: "", className: "text-right", cell: (r) => (
              <div className="flex justify-end gap-1">
                <Button variant="ghost" size="sm" onClick={() => toast.info("Continuando fechamento")}>Continuar</Button>
                <Button variant="ghost" size="sm" onClick={() => setConcluir(r)}>Concluir</Button>
              </div>
            ) },
          ]} />

        <ConfirmDialog open={!!concluir} onOpenChange={(v) => !v && setConcluir(null)}
          title="Concluir fechamento mensal" description="Confirma a conclusão deste fechamento? O cliente receberá a notificação."
          successMessage="Fechamento concluído"
          onConfirm={() => concluir && update((st) => ({ ...st, fechamentos: st.fechamentos.map((f) => f.id === concluir.id ? { ...f, status: "concluido", progresso: 100 } : f) }))} />
      </>
    );
  },
});
