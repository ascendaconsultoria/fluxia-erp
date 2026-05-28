import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/fluxia/PageHeader";
import { DataTable } from "@/components/fluxia/DataTable";
import { StatusBadge } from "@/components/fluxia/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ModalForm } from "@/components/fluxia/ModalForm";
import { ConfirmDialog } from "@/components/fluxia/ConfirmDialog";
import { useStore } from "@/mock/store";
import { formatDate } from "@/lib/format";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/_app/bpo/pendencias")({ component: PendenciasPage });

function PendenciasPage() {
  const { s } = useStore();
  const [nova, setNova] = useState(false);
  const [concluir, setConcluir] = useState<string | null>(null);
  return (
    <>
      <PageHeader title="Painel de pendências" description="Acompanhe pendências de toda a carteira BPO com prazo, responsável e status." action={<Button size="sm" onClick={() => setNova(true)}><Plus className="mr-2 h-4 w-4" />Nova pendência</Button>} />
      <DataTable data={s.pendencias} searchKeys={["cliente", "tipo", "responsavel"]} pageSize={10} maxHeight="calc(100vh - 20rem)" columns={[
        { key: "c", header: "Cliente", cell: (r) => <span className="font-medium">{r.cliente}</span> },
        { key: "t", header: "Tipo", cell: (r) => r.tipo },
        { key: "p", header: "Prioridade", cell: (r) => <StatusBadge status={r.prioridade} /> },
        { key: "pz", header: "Prazo", cell: (r) => formatDate(r.prazo) },
        { key: "r", header: "Responsável", cell: (r) => r.responsavel },
        { key: "s", header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
        { key: "a", header: "", className: "text-right", cell: (r) => <Button variant="ghost" size="sm" onClick={() => setConcluir(r.cliente)}>Concluir</Button> },
      ]} />
      <ModalForm open={nova} onOpenChange={setNova} title="Nova pendência BPO" successMessage="Pendência criada" onSave={async () => {}}>
        <div className="grid gap-3 sm:grid-cols-2"><div><Label>Cliente</Label><Select defaultValue="tech"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{s.clientesBPO.map((c) => <SelectItem key={c.id} value={c.id}>{c.empresa}</SelectItem>)}</SelectContent></Select></div><div><Label>Tipo</Label><Select defaultValue="documento"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="documento">Documento</SelectItem><SelectItem value="conciliacao">Conciliação</SelectItem><SelectItem value="lancamento">Lançamento</SelectItem><SelectItem value="fechamento">Fechamento</SelectItem></SelectContent></Select></div><div><Label>Prioridade</Label><Select defaultValue="media"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="baixa">Baixa</SelectItem><SelectItem value="media">Média</SelectItem><SelectItem value="alta">Alta</SelectItem></SelectContent></Select></div><div><Label>Prazo</Label><Input type="date" /></div><div><Label>Responsável</Label><Input /></div><div><Label>Canal</Label><Select defaultValue="portal"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="portal">Portal</SelectItem><SelectItem value="whatsapp">WhatsApp</SelectItem><SelectItem value="email">E-mail</SelectItem></SelectContent></Select></div><div className="sm:col-span-2"><Label>Descrição</Label><Input placeholder="Detalhe a pendência e o documento necessário" /></div></div>
      </ModalForm>
      <ConfirmDialog open={!!concluir} onOpenChange={(v) => !v && setConcluir(null)} title="Concluir pendência" description={`Confirma a conclusão da pendência de ${concluir ?? "este cliente"}?`} successMessage="Pendência concluída" onConfirm={async () => {}} />
    </>
  );
}
