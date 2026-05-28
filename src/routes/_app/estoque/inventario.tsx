import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/fluxia/PageHeader";
import { EstoqueShell } from "@/components/fluxia/ModuleShells";
import { DataTable } from "@/components/fluxia/DataTable";
import { ModalForm } from "@/components/fluxia/ModalForm";
import { ConfirmDialog } from "@/components/fluxia/ConfirmDialog";
import { StatCard } from "@/components/fluxia/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClipboardCheck, AlertTriangle, CheckCircle2, Plus, PackageCheck } from "lucide-react";
import { brl } from "@/lib/format";

export const Route = createFileRoute("/_app/estoque/inventario")({ component: InventarioPage });

const itens = [
  { ciclo: "INV-052", local: "Depósito A", itens: 240, divergencias: 4, valor: brl(1280), status: "Em contagem" },
  { ciclo: "INV-051", local: "Loja Centro", itens: 118, divergencias: 1, valor: brl(320), status: "Finalizado" },
  { ciclo: "INV-050", local: "Prateleira B2", itens: 64, divergencias: 6, valor: brl(890), status: "Revisar" },
];

function InventarioPage() {
  const [modal, setModal] = useState(false);
  const [fechar, setFechar] = useState<string | null>(null);
  return (
    <EstoqueShell>
      <PageHeader title="Inventário" description="Conferência física, divergências, ciclos de contagem e ajustes autorizados." action={<Button size="sm" onClick={() => setModal(true)}><Plus className="mr-2 h-4 w-4" />Novo inventário</Button>} />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4"><StatCard title="Ciclos abertos" value="2" icon={ClipboardCheck} /><StatCard title="Divergências" value="11" icon={AlertTriangle} tone="warning" /><StatCard title="Valor divergente" value={brl(2490)} icon={PackageCheck} /><StatCard title="Acuracidade" value="96,4%" icon={CheckCircle2} tone="primary" /></div>
      <div className="mt-5"><DataTable data={itens} searchKeys={["ciclo", "local", "status"]} pageSize={10} maxHeight="calc(100vh - 27rem)" columns={[
        { key: "ciclo", header: "Ciclo", cell: (r) => <strong>{r.ciclo}</strong> },
        { key: "local", header: "Local", cell: (r) => r.local },
        { key: "itens", header: "Itens", cell: (r) => r.itens },
        { key: "div", header: "Divergências", cell: (r) => <span className={r.divergencias > 3 ? "font-semibold text-warning-foreground" : ""}>{r.divergencias}</span> },
        { key: "valor", header: "Valor", cell: (r) => r.valor },
        { key: "status", header: "Status", cell: (r) => r.status },
        { key: "acao", header: "", className: "text-right", cell: (r) => <Button variant="ghost" size="sm" onClick={() => setFechar(r.ciclo)}>Finalizar</Button> },
      ]} /></div>
      <ModalForm open={modal} onOpenChange={setModal} title="Novo inventário" successMessage="Inventário iniciado" onSave={async () => {}}>
        <div className="grid gap-3 sm:grid-cols-2"><div><Label>Local</Label><Select defaultValue="deposito"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="deposito">Depósito A</SelectItem><SelectItem value="loja">Loja Centro</SelectItem><SelectItem value="todos">Todos os locais</SelectItem></SelectContent></Select></div><div><Label>Data de início</Label><Input type="date" /></div><div><Label>Responsável</Label><Input /></div><div><Label>Tipo</Label><Select defaultValue="ciclico"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="ciclico">Cíclico</SelectItem><SelectItem value="geral">Geral</SelectItem><SelectItem value="categoria">Por categoria</SelectItem></SelectContent></Select></div></div>
      </ModalForm>
      <ConfirmDialog open={!!fechar} onOpenChange={(v) => !v && setFechar(null)} title="Finalizar inventário" description={`Deseja finalizar ${fechar ?? "este inventário"} e gerar ajustes autorizados?`} successMessage="Inventário finalizado" onConfirm={async () => {}} />
    </EstoqueShell>
  );
}
