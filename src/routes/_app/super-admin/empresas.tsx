import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/fluxia/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/fluxia/StatusBadge";
import { ConfirmDialog } from "@/components/fluxia/ConfirmDialog";
import { useStore } from "@/mock/store";
import { brl, formatDate } from "@/lib/format";
import { Search, Plus, Eye, Edit, Pause, Power, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/super-admin/empresas")({ component: EmpresasPage });

function EmpresasPage() {
  const { s, update } = useStore();
  const [q, setQ] = useState("");
  const [excluir, setExcluir] = useState<string | null>(null);
  const [suspender, setSuspender] = useState<string | null>(null);
  const empresas = s.empresas.filter((e) => [e.nomeFantasia, e.razaoSocial, e.cnpj, e.plano].some((x) => x.toLowerCase().includes(q.toLowerCase())));
  return (
    <div className="max-h-[calc(100vh-7rem)] overflow-hidden">
      <PageHeader title="Empresas" description="Controle de empresas provisionadas, planos, status e acesso." action={<Button><Plus className="mr-2 h-4 w-4" />Nova empresa</Button>} />
      <Card className="flex h-[calc(100vh-13rem)] min-h-[480px] flex-col overflow-hidden rounded-2xl shadow-soft">
        <div className="sticky top-0 z-10 flex flex-col gap-3 border-b bg-card p-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-md"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar empresa, CNPJ ou plano" className="pl-9" /></div>
          <div className="flex gap-2"><Button variant="outline" size="sm">Ativas</Button><Button variant="outline" size="sm">Teste</Button><Button variant="outline" size="sm">Inadimplentes</Button></div>
        </div>
        <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto">
          {empresas.map((e) => <div key={e.id} className="grid gap-3 border-b p-4 text-sm xl:grid-cols-[1.3fr_150px_130px_120px_140px_160px] xl:items-center"><div><p className="font-semibold">{e.nomeFantasia}</p><p className="text-xs text-muted-foreground">{e.razaoSocial} • {e.cnpj}</p></div><span>{e.plano}</span><strong className="text-primary">{brl(e.valorMensal)}</strong><span>{e.usuarios} usuários</span><span>{formatDate(e.dataCadastro)}</span><div className="flex items-center justify-end gap-1"><StatusBadge status={e.status} /><Button variant="ghost" size="icon" onClick={() => toast.info(`Acessando ${e.nomeFantasia}`)}><Eye className="h-4 w-4" /></Button><Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button><Button variant="ghost" size="icon" onClick={() => setSuspender(e.id)}><Pause className="h-4 w-4" /></Button><Button variant="ghost" size="icon" onClick={() => update((st) => ({ ...st, empresas: st.empresas.map((x) => x.id === e.id ? { ...x, status: x.status === "ativo" ? "inativo" : "ativo" } : x) }))}><Power className="h-4 w-4" /></Button><Button variant="ghost" size="icon" className="text-destructive" onClick={() => setExcluir(e.id)}><Trash2 className="h-4 w-4" /></Button></div></div>)}
        </div>
      </Card>
      <ConfirmDialog open={!!excluir} onOpenChange={(v) => !v && setExcluir(null)} title="Confirmar exclusão" description="Essa ação remove a empresa da base de controle." variant="destructive" confirmText="Excluir" successMessage="Empresa excluída" onConfirm={() => excluir && update((st) => ({ ...st, empresas: st.empresas.filter((e) => e.id !== excluir) }))} />
      <ConfirmDialog open={!!suspender} onOpenChange={(v) => !v && setSuspender(null)} title="Suspender empresa" description="A empresa ficará sem acesso até ser reativada." confirmText="Suspender" successMessage="Empresa suspensa" onConfirm={() => suspender && update((st) => ({ ...st, empresas: st.empresas.map((e) => e.id === suspender ? { ...e, status: "suspenso" } : e) }))} />
    </div>
  );
}
