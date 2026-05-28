import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/fluxia/PageHeader";
import { DataTable } from "@/components/fluxia/DataTable";
import { StatusBadge } from "@/components/fluxia/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ModalForm } from "@/components/fluxia/ModalForm";
import { ConfirmDialog } from "@/components/fluxia/ConfirmDialog";
import { useStore } from "@/mock/store";
import { brl, uid } from "@/lib/format";
import { Plus, MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ClienteBPO } from "@/mock/data";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/bpo/clientes")({
  component: () => {
    const { s, update } = useStore();
    const [novo, setNovo] = useState(false);
    const [excluir, setExcluir] = useState<ClienteBPO | null>(null);
    const [form, setForm] = useState({ empresa: "", cnpj: "", responsavel: "", plano: "BPO Essencial", valor: 890 });

    return (
      <>
        <PageHeader title="Clientes BPO" description="Carteira de clientes do BPO financeiro."
          action={<Button size="sm" onClick={() => setNovo(true)}><Plus className="mr-2 h-4 w-4" />Novo cliente BPO</Button>} />
        <DataTable data={s.clientesBPO} searchKeys={["empresa", "cnpj", "responsavel"]}
          columns={[
            { key: "e", header: "Empresa", cell: (r) => <div><p className="font-medium">{r.empresa}</p><p className="text-xs text-muted-foreground">{r.cnpj}</p></div> },
            { key: "r", header: "Responsável", cell: (r) => r.responsavel },
            { key: "p", header: "Plano", cell: (r) => r.plano },
            { key: "v", header: "Valor", cell: (r) => brl(r.valorMensal) },
            { key: "f", header: "Fechamento", cell: (r) => r.fechamentoAtual },
            { key: "pd", header: "Pendências", cell: (r) => r.pendencias > 0 ? <span className="font-medium text-warning-foreground">{r.pendencias}</span> : <span className="text-muted-foreground">—</span> },
            { key: "s", header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
            { key: "a", header: "", className: "text-right", cell: (r) => (
              <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => toast.info(`Acessando ${r.empresa}`)}><Eye className="mr-2 h-4 w-4" />Ver painel</DropdownMenuItem>
                  <DropdownMenuItem><Edit className="mr-2 h-4 w-4" />Editar</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.success("Relatório gerado")}>Gerar relatório</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive" onClick={() => setExcluir(r)}><Trash2 className="mr-2 h-4 w-4" />Excluir</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) },
          ]} />

        <ModalForm open={novo} onOpenChange={setNovo} title="Novo cliente BPO" size="lg" successMessage="Cliente BPO cadastrado"
          onSave={async () => {
            if (!form.empresa || !form.cnpj) throw new Error("Empresa e CNPJ obrigatórios");
            update((st) => ({
              ...st, clientesBPO: [{
                id: uid(), empresa: form.empresa, cnpj: form.cnpj, responsavel: form.responsavel,
                plano: form.plano, status: "ativo", valorMensal: form.valor, pendencias: 0,
                fechamentoAtual: "Mai/26", ultimoAcesso: new Date().toISOString().slice(0, 10),
              }, ...st.clientesBPO],
            }));
            setForm({ empresa: "", cnpj: "", responsavel: "", plano: "BPO Essencial", valor: 890 });
          }}>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2"><Label>Empresa*</Label><Input value={form.empresa} onChange={(e) => setForm({ ...form, empresa: e.target.value })} /></div>
            <div><Label>CNPJ*</Label><Input value={form.cnpj} onChange={(e) => setForm({ ...form, cnpj: e.target.value })} /></div>
            <div><Label>Responsável</Label><Input value={form.responsavel} onChange={(e) => setForm({ ...form, responsavel: e.target.value })} /></div>
            <div><Label>Plano</Label><Input value={form.plano} onChange={(e) => setForm({ ...form, plano: e.target.value })} /></div>
            <div><Label>Valor mensal</Label><Input type="number" value={form.valor} onChange={(e) => setForm({ ...form, valor: Number(e.target.value) })} /></div>
          </div>
        </ModalForm>

        <ConfirmDialog open={!!excluir} onOpenChange={(v) => !v && setExcluir(null)}
          title="Confirmar exclusão" description="Essa ação não poderá ser desfeita. Deseja excluir este cliente BPO?"
          variant="destructive" confirmText="Excluir definitivamente" successMessage="Cliente excluído"
          onConfirm={() => excluir && update((st) => ({ ...st, clientesBPO: st.clientesBPO.filter((c) => c.id !== excluir.id) }))} />
      </>
    );
  },
});
