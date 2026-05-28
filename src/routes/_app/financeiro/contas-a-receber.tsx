import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/fluxia/PageHeader";
import { FinanceiroShell } from "@/components/fluxia/ModuleShells";
import { DataTable } from "@/components/fluxia/DataTable";
import { StatCard } from "@/components/fluxia/StatCard";
import { StatusBadge } from "@/components/fluxia/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ModalForm } from "@/components/fluxia/ModalForm";
import { ConfirmDialog } from "@/components/fluxia/ConfirmDialog";
import { useStore } from "@/mock/store";
import { brl, formatDate, uid } from "@/lib/format";
import { Plus, MoreHorizontal, CheckCircle2, Edit, Trash2, CalendarClock, AlertTriangle, Wallet } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Lancamento } from "@/mock/data";

export const Route = createFileRoute("/_app/financeiro/contas-a-receber")({ component: ContasReceberPage });

function ContasReceberPage() {
  const { s, update } = useStore();
  const [novo, setNovo] = useState(false);
  const [receber, setReceber] = useState<Lancamento | null>(null);
  const [excluir, setExcluir] = useState<Lancamento | null>(null);
  const data = s.lancamentos.filter((l) => l.tipo === "receita");

  return (
    <FinanceiroShell>
      <PageHeader
        title="Contas a receber"
        description="Recebimentos previstos, vencidos e carteira de cobrança."
        action={<Button size="sm" onClick={() => setNovo(true)}><Plus className="mr-2 h-4 w-4" />Cadastrar conta a receber</Button>}
      />
      <div className="mb-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total a receber" value={brl(data.reduce((a, l) => a + l.valor, 0))} icon={Wallet} />
        <StatCard title="Vencidas" value={String(data.filter((l) => l.status === "atrasado").length)} icon={AlertTriangle} tone="destructive" />
        <StatCard title="Próximos 7 dias" value="11" icon={CalendarClock} tone="warning" />
        <StatCard title="Recebidas no mês" value={String(data.filter((l) => l.status === "recebido").length)} icon={CheckCircle2} tone="primary" />
      </div>

      <DataTable
        data={data}
        searchKeys={["descricao", "contraparte", "categoria"]}
        columns={[
          { key: "c", header: "Cliente", cell: (r) => <span className="font-medium">{r.contraparte}</span> },
          { key: "d", header: "Descrição", cell: (r) => r.descricao },
          { key: "v", header: "Vencimento", cell: (r) => formatDate(r.vencimento) },
          { key: "vl", header: "Valor", cell: (r) => <span className="font-semibold">{brl(r.valor)}</span> },
          { key: "s", header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
          { key: "a", header: "", className: "text-right", cell: (r) => (
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setReceber(r)}><CheckCircle2 className="mr-2 h-4 w-4" />Marcar como recebida</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setNovo(true)}><Edit className="mr-2 h-4 w-4" />Editar</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive" onClick={() => setExcluir(r)}><Trash2 className="mr-2 h-4 w-4" />Excluir</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) },
        ]}
      />

      <ModalForm open={novo} onOpenChange={setNovo} title="Cadastrar conta a receber" successMessage="Conta criada" onSave={async () => update((st) => ({ ...st, lancamentos: [{ id: uid(), tipo: "receita", descricao: "Nova receita", categoria: "Receita operacional", contraparte: s.clientes[0]?.nome ?? "Cliente", vencimento: new Date().toISOString().slice(0, 10), valor: 750, status: "pendente", conta: "Conta Itaú PJ", forma: "Pix" }, ...st.lancamentos] }))}>
        <div className="grid gap-3 sm:grid-cols-2"><div><Label>Cliente</Label><Input defaultValue={s.clientes[0]?.nome} /></div><div><Label>Valor</Label><Input type="number" /></div><div><Label>Vencimento</Label><Input type="date" /></div><div><Label>Forma</Label><Input defaultValue="Pix" /></div><div className="sm:col-span-2"><Label>Descrição</Label><Input /></div></div>
      </ModalForm>

      <ConfirmDialog open={!!receber} onOpenChange={(v) => !v && setReceber(null)} title="Confirmar recebimento" description="Deseja marcar esta conta como recebida?" successMessage="Conta recebida" onConfirm={() => receber && update((st) => ({ ...st, lancamentos: st.lancamentos.map((l) => l.id === receber.id ? { ...l, status: "recebido" } : l) }))} />
      <ConfirmDialog open={!!excluir} onOpenChange={(v) => !v && setExcluir(null)} title="Excluir conta" description="Essa ação remove o lançamento do financeiro." confirmText="Excluir" variant="destructive" successMessage="Conta excluída" onConfirm={() => excluir && update((st) => ({ ...st, lancamentos: st.lancamentos.filter((l) => l.id !== excluir.id) }))} />
    </FinanceiroShell>
  );
}
