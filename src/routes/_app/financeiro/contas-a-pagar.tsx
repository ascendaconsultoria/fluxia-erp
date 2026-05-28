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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ModalForm } from "@/components/fluxia/ModalForm";
import { ConfirmDialog } from "@/components/fluxia/ConfirmDialog";
import { useStore } from "@/mock/store";
import { brl, formatDate, uid } from "@/lib/format";
import { Plus, MoreHorizontal, CheckCircle2, Trash2, Edit, CalendarClock, AlertTriangle, Wallet } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Lancamento } from "@/mock/data";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/financeiro/contas-a-pagar")({
  component: ContasPagarPage,
});

function ContasPagarPage() {
  const { s, update } = useStore();
  const [novo, setNovo] = useState(false);
  const [marcar, setMarcar] = useState<Lancamento | null>(null);
  const [excluir, setExcluir] = useState<Lancamento | null>(null);
  const data = s.lancamentos.filter((l) => l.tipo === "despesa");

  return (
    <FinanceiroShell>
      <>
      <PageHeader
        title="Contas a pagar"
        description="Títulos a pagar e vencimentos próximos."
        breadcrumb={[{ label: "Financeiro" }, { label: "Contas a pagar" }]}
        action={<Button size="sm" onClick={() => setNovo(true)}><Plus className="mr-2 h-4 w-4" />Cadastrar conta a pagar</Button>}
      />

      <div className="mb-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total a pagar" value={brl(data.reduce((a, l) => a + l.valor, 0))} icon={Wallet} />
        <StatCard title="Vencidas" value={String(data.filter((l) => l.status === "atrasado").length)} icon={AlertTriangle} tone="destructive" />
        <StatCard title="Próximos 7 dias" value="8" icon={CalendarClock} tone="warning" />
        <StatCard title="Pagas no mês" value={String(data.filter((l) => l.status === "pago").length)} icon={CheckCircle2} tone="primary" />
      </div>

      <DataTable
        data={data}
        searchKeys={["descricao", "contraparte", "categoria"]}
        columns={[
          { key: "f", header: "Fornecedor", cell: (r) => <span className="font-medium">{r.contraparte}</span> },
          { key: "d", header: "Descrição", cell: (r) => r.descricao },
          { key: "c", header: "Categoria", cell: (r) => r.categoria },
          { key: "v", header: "Vencimento", cell: (r) => formatDate(r.vencimento) },
          { key: "vl", header: "Valor", cell: (r) => <span className="font-semibold">{brl(r.valor)}</span> },
          { key: "s", header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
          {
            key: "a", header: "", className: "text-right",
            cell: (r) => (
              <DropdownMenu>
                <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setMarcar(r)}><CheckCircle2 className="mr-2 h-4 w-4" />Marcar como paga</DropdownMenuItem>
                  <DropdownMenuItem><Edit className="mr-2 h-4 w-4" />Editar</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive" onClick={() => setExcluir(r)}><Trash2 className="mr-2 h-4 w-4" />Excluir</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ),
          },
        ]}
      />

      <ModalForm open={novo} onOpenChange={setNovo} title="Cadastrar conta a pagar" size="lg"
        onSave={async () => {
          update((st) => ({
            ...st,
            lancamentos: [{
              id: uid(), tipo: "despesa", descricao: "Nova despesa", categoria: "Fornecedores",
              contraparte: s.fornecedores[0].nomeFantasia, vencimento: new Date().toISOString().slice(0, 10),
              valor: 500, status: "pendente", conta: "Conta Itaú PJ", forma: "Boleto",
            }, ...st.lancamentos],
          }));
        }}>
        <div className="grid gap-3 sm:grid-cols-2">
          <div><Label>Fornecedor</Label>
            <Select><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
              <SelectContent>{s.fornecedores.map((f) => <SelectItem key={f.id} value={f.id}>{f.nomeFantasia}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label>Categoria</Label><Input placeholder="Ex.: Fornecedores" /></div>
          <div className="sm:col-span-2"><Label>Descrição</Label><Input /></div>
          <div><Label>Valor</Label><Input type="number" /></div>
          <div><Label>Vencimento</Label><Input type="date" /></div>
          <div><Label>Conta bancária</Label><Input defaultValue="Conta Itaú PJ" /></div>
          <div><Label>Forma de pagamento</Label>
            <Select defaultValue="Boleto"><SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{["Boleto", "Pix", "Cartão", "Transferência"].map((x) => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
      </ModalForm>

      <ConfirmDialog open={!!marcar} onOpenChange={(v) => !v && setMarcar(null)}
        title="Confirmar pagamento" description="Marcar este lançamento como pago?"
        successMessage="Conta marcada como paga"
        onConfirm={() => marcar && update((st) => ({ ...st, lancamentos: st.lancamentos.map((l) => l.id === marcar.id ? { ...l, status: "pago" } : l) }))} />

      <ConfirmDialog open={!!excluir} onOpenChange={(v) => !v && setExcluir(null)}
        title="Confirmar exclusão" description="Essa ação não poderá ser desfeita. Deseja excluir?"
        confirmText="Excluir definitivamente" variant="destructive" successMessage="Lançamento excluído"
        onConfirm={() => excluir && update((st) => ({ ...st, lancamentos: st.lancamentos.filter((l) => l.id !== excluir.id) }))} />
      </>
    </FinanceiroShell>
  );
}
