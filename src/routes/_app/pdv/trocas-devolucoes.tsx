import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/fluxia/PageHeader";
import { DataTable } from "@/components/fluxia/DataTable";
import { StatCard } from "@/components/fluxia/StatCard";
import { ModalForm } from "@/components/fluxia/ModalForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { brl } from "@/lib/format";
import { Repeat2, Undo2, PackageCheck, AlertTriangle, Plus } from "lucide-react";

export const Route = createFileRoute("/_app/pdv/trocas-devolucoes")({ component: TrocasPage });

const rows = [
  { protocolo: "TD-1041", cliente: "Ana Beatriz", origem: "Venda V1008", tipo: "Troca", item: "Mouse Wireless", valor: brl(89.9), status: "Aguardando conferência" },
  { protocolo: "TD-1040", cliente: "Consumidor final", origem: "NFC-e 000123", tipo: "Devolução", item: "Caderno A4", valor: brl(12.9), status: "Crédito gerado" },
  { protocolo: "TD-1039", cliente: "Tech Solutions", origem: "NF-e 000077", tipo: "Garantia", item: "Notebook Pro", valor: brl(4599), status: "Fornecedor acionado" },
];

function TrocasPage() {
  const [modal, setModal] = useState(false);
  return <div className="h-full overflow-hidden">
    <PageHeader title="Trocas e devoluções" description="Controle operacional de troca, devolução, garantia, crédito ao cliente e retorno ao estoque." action={<Button size="sm" onClick={() => setModal(true)}><Plus className="mr-2 h-4 w-4" />Nova troca/devolução</Button>} />
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      <StatCard title="Aguardando conferência" value="4" icon={PackageCheck} tone="warning" />
      <StatCard title="Créditos gerados" value={brl(1280)} icon={Undo2} />
      <StatCard title="Garantias abertas" value="3" icon={AlertTriangle} tone="destructive" />
      <StatCard title="Finalizadas" value="18" icon={Repeat2} tone="primary" />
    </div>
    <div className="mt-5"><DataTable data={rows} searchKeys={["protocolo", "cliente", "origem", "item", "status"]} pageSize={10} maxHeight="calc(100vh - 24rem)" columns={[
      { key: "protocolo", header: "Protocolo", cell: r => <strong>{r.protocolo}</strong> },
      { key: "cliente", header: "Cliente", cell: r => r.cliente },
      { key: "origem", header: "Origem", cell: r => r.origem },
      { key: "tipo", header: "Tipo", cell: r => r.tipo },
      { key: "item", header: "Item", cell: r => r.item },
      { key: "valor", header: "Valor", cell: r => <strong>{r.valor}</strong> },
      { key: "status", header: "Status", cell: r => r.status },
      { key: "acao", header: "", className: "text-right", cell: r => <Button variant="ghost" size="sm">Abrir</Button> },
    ]} /></div>
    <ModalForm open={modal} onOpenChange={setModal} title="Nova troca/devolução" successMessage="Solicitação registrada" onSave={async () => {}}>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><Label>Venda/NF de origem</Label><Input placeholder="V1008 ou NFC-e" /></div>
        <div><Label>Tipo</Label><Select defaultValue="troca"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="troca">Troca</SelectItem><SelectItem value="devolucao">Devolução</SelectItem><SelectItem value="garantia">Garantia</SelectItem></SelectContent></Select></div>
        <div><Label>Cliente</Label><Input placeholder="Cliente" /></div>
        <div><Label>Produto</Label><Input placeholder="Produto" /></div>
        <div><Label>Destino do item</Label><Select defaultValue="conferencia"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="conferencia">Conferência</SelectItem><SelectItem value="estoque">Retornar ao estoque</SelectItem><SelectItem value="perda">Registrar perda</SelectItem><SelectItem value="fornecedor">Enviar ao fornecedor</SelectItem></SelectContent></Select></div>
        <div><Label>Valor/crédito</Label><Input type="number" /></div>
      </div>
    </ModalForm>
  </div>
}
