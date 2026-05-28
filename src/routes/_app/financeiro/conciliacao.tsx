import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/fluxia/PageHeader";
import { FinanceiroShell } from "@/components/fluxia/ModuleShells";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ButtonWithLoading } from "@/components/fluxia/ButtonWithLoading";
import { sleep, brl } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/financeiro/conciliacao")({ component: ConciliacaoPage });

function ConciliacaoPage() {
  const [loading, setLoading] = useState(false);
  const conciliar = async () => { setLoading(true); await sleep(900); setLoading(false); toast.success("Lançamentos conciliados"); };
  return (
    <FinanceiroShell>
      <PageHeader title="Conciliação bancária" description="Confronte extrato com lançamentos do sistema e trate divergências." />
      <Card className="p-5 shadow-soft">
        <div className="grid gap-3 sm:grid-cols-3">
          <div><Label>Conta</Label><Select defaultValue="itau"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="itau">Itaú PJ</SelectItem><SelectItem value="bb">Banco do Brasil</SelectItem></SelectContent></Select></div>
          <div><Label>Período</Label><Select defaultValue="mes"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="mes">Maio/2026</SelectItem><SelectItem value="abr">Abril/2026</SelectItem></SelectContent></Select></div>
          <div className="flex items-end gap-2"><ButtonWithLoading loading={loading} onClick={conciliar}>Conciliar selecionados</ButtonWithLoading></div>
        </div>
      </Card>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card className="p-5 shadow-soft"><h3 className="mb-3 font-semibold">Lançamentos do sistema</h3>{Array.from({ length: 5 }).map((_, i) => <div key={i} className="flex items-center justify-between border-b py-2 text-sm last:border-0"><div><p className="font-medium">Pagamento fornecedor {i + 1}</p><p className="text-xs text-muted-foreground">05/05/2026</p></div><span className="font-semibold">{brl(1200 + i * 230)}</span></div>)}</Card>
        <Card className="p-5 shadow-soft"><h3 className="mb-3 font-semibold">Extrato bancário</h3>{Array.from({ length: 5 }).map((_, i) => <div key={i} className="flex items-center justify-between border-b py-2 text-sm last:border-0"><div><p className="font-medium">DOC TED Saída {i + 1}</p><p className="text-xs text-muted-foreground">05/05/2026</p></div><span className="font-semibold">{brl(1200 + i * 230)}</span></div>)}</Card>
      </div>
    </FinanceiroShell>
  );
}
