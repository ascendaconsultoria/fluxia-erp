import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { BellRing, KanbanSquare, ListChecks, Plus, Repeat, ShoppingCart, UserCheck, Zap } from "lucide-react";
import { PageHeader } from "@/components/fluxia/PageHeader";
import { StatCard } from "@/components/fluxia/StatCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ModalForm } from "@/components/fluxia/ModalForm";
import { DataTable } from "@/components/fluxia/DataTable";
import { brl } from "@/lib/format";
import { useStore } from "@/mock/store";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/pos-venda")({ component: PosVendaPage });

type PosVendaTab = "visao" | "lista" | "kanban" | "automacoes";
type Deal = { id: string; cliente: string; telefone: string; ultimaCompra: string; dias: number; periodicidade: number; ticket: number; acao: string; etapa: string; tarefa?: string; notificado?: boolean };
const etapas = ["Alerta", "Contato planejado", "Em conversa", "Oferta enviada", "Recompra feita"];
const tabs: Array<{ id: PosVendaTab; label: string; icon: any; badge?: number }> = [
  { id: "visao", label: "Visão geral", icon: Repeat },
  { id: "lista", label: "Lista", icon: ListChecks },
  { id: "kanban", label: "Kanban", icon: KanbanSquare },
  { id: "automacoes", label: "Automações", icon: BellRing },
];

function PosVendaPage() {
  const { s } = useStore();
  const [modal, setModal] = useState(false);
  const [tab, setTab] = useState<PosVendaTab>("visao");
  const [deals, setDeals] = useState<Deal[]>(() => s.clientes.slice(0, 10).map((c, i) => ({
    id: c.id,
    cliente: c.nome,
    telefone: c.telefone,
    ultimaCompra: `${String(8 + i).padStart(2, "0")}/05/2026`,
    dias: [18, 32, 45, 12, 60, 21, 38, 15, 52, 29][i],
    periodicidade: [30, 30, 45, 15, 60, 21, 30, 15, 45, 30][i],
    ticket: 280 + i * 97,
    acao: ["WhatsApp", "Ligação", "Oferta de recompra", "Aguardar", "Reativação", "WhatsApp", "Ligação", "Aguardar", "Cupom", "Ligação"][i],
    etapa: ["Alerta", "Contato planejado", "Em conversa", "Oferta enviada", "Alerta", "Recompra feita", "Contato planejado", "Alerta", "Em conversa", "Oferta enviada"][i],
  })));
  const [dragged, setDragged] = useState<string | null>(null);
  const alertas = useMemo(() => deals.filter((d) => d.dias >= d.periodicidade), [deals]);
  const tarefas = useMemo(() => deals.filter((d) => d.tarefa), [deals]);
  const potencial = alertas.reduce((acc, deal) => acc + deal.ticket, 0);

  const moveDeal = (etapa: string) => {
    if (!dragged) return;
    setDeals((prev) => prev.map((d) => d.id === dragged ? { ...d, etapa } : d));
    setDragged(null);
  };

  const gerarTarefa = (deal: Deal) => {
    setDeals((prev) => prev.map((d) => d.id === deal.id ? { ...d, tarefa: `Reativar cliente por ${deal.acao}` } : d));
    toast.success(`Tarefa automática criada para ${deal.cliente}.`);
  };

  const gerarAlertas = () => {
    setDeals((prev) => prev.map((d) => d.dias >= d.periodicidade ? { ...d, notificado: true, tarefa: d.tarefa || `Contato de recompra por ${d.acao}` } : d));
    toast.warning(`${alertas.length} alertas e tarefas de pós-venda gerados.`);
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] min-h-0 flex-col overflow-hidden">
      <PageHeader title="Pós-venda" description="Recompra, reativação, periodicidade de compra, tarefas automáticas e histórico de relacionamento." action={<div className="flex gap-2"><Button variant="outline" size="sm" onClick={gerarAlertas}><BellRing className="mr-2 h-4 w-4" />Gerar alertas</Button><Button size="sm" onClick={() => setModal(true)}><Plus className="mr-2 h-4 w-4" />Nova ação</Button></div>} />

      <div className="grid min-h-0 flex-1 gap-4 overflow-hidden lg:grid-cols-[260px_1fr]">
        <aside className="custom-scrollbar min-h-0 overflow-y-auto rounded-2xl border bg-card p-2 shadow-soft">
          <p className="px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Pós-venda</p>
          <div className="space-y-1">
            {tabs.map((item) => {
              const Icon = item.icon;
              return (
                <button key={item.id} onClick={() => setTab(item.id)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${tab === item.id ? "bg-primary-soft text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                  {item.id === "visao" && alertas.length > 0 && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] text-primary">{alertas.length}</span>}
                </button>
              );
            })}
          </div>
        </aside>

        <section className="custom-scrollbar min-h-0 overflow-y-auto pr-1">
          {tab === "visao" && <div className="space-y-5">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4"><StatCard title="Alertas de recompra" value={String(alertas.length)} icon={BellRing} tone="warning" /><StatCard title="Potencial estimado" value={brl(potencial)} icon={ShoppingCart} /><StatCard title="Clientes recorrentes" value="38" icon={Repeat} tone="primary" /><StatCard title="Tarefas geradas" value={String(tarefas.length)} icon={UserCheck} /></div>
            <div className="grid gap-4 xl:grid-cols-[1fr_360px]"><Card className="rounded-2xl p-5 shadow-soft"><h3 className="font-semibold">Motor automático de recompra</h3><p className="mt-1 text-sm text-muted-foreground">Quando dias sem comprar ≥ periodicidade, o sistema marca o cliente como alerta, gera notificação e cria tarefa comercial para reativação.</p><div className="mt-4 grid gap-3 md:grid-cols-3">{["Periodicidade por cliente", "Criação automática de tarefa", "Notificação para vendedor"].map((item) => <div key={item} className="rounded-xl border p-3 text-sm font-medium">{item}</div>)}</div></Card><Card className="rounded-2xl p-5 shadow-soft"><h3 className="font-semibold">Próximas prioridades</h3><div className="mt-4 space-y-2 text-sm">{alertas.slice(0, 5).map((deal) => <div key={deal.id} className="rounded-xl border p-3"><strong>{deal.cliente}</strong><p className="text-muted-foreground">{deal.dias} dias sem comprar • {deal.acao}</p></div>)}</div></Card></div>
          </div>}

          {tab === "lista" && <Card className="overflow-hidden rounded-2xl shadow-soft"><DataTable data={deals} pageSize={10} searchKeys={["cliente", "telefone", "acao", "etapa"]} columns={[{ key: "cliente", header: "Cliente", cell: (r) => <strong>{r.cliente}</strong> }, { key: "telefone", header: "Telefone", cell: (r) => r.telefone }, { key: "ultimaCompra", header: "Última compra", cell: (r) => r.ultimaCompra }, { key: "dias", header: "Dias sem comprar", cell: (r) => <span className={r.dias >= r.periodicidade ? "font-semibold text-warning-foreground" : ""}>{r.dias}</span> }, { key: "periodicidade", header: "Periodicidade", cell: (r) => `${r.periodicidade} dias` }, { key: "ticket", header: "Ticket médio", cell: (r) => brl(r.ticket) }, { key: "etapa", header: "Etapa", cell: (r) => r.etapa }, { key: "acao", header: "Ação", className: "text-right", cell: (r) => <Button variant="ghost" size="sm" onClick={() => gerarTarefa(r)}>Gerar tarefa</Button> }]} /></Card>}

          {tab === "kanban" && <Card className="rounded-2xl p-4 shadow-soft"><div className="mb-4 flex items-center justify-between"><div><h3 className="font-semibold">Funil de pós-venda</h3><p className="text-xs text-muted-foreground">Arraste clientes entre etapas. As tarefas e notificações ficam preparadas para o backend.</p></div><KanbanSquare className="h-5 w-5 text-primary" /></div><div className="grid min-w-[980px] gap-3 overflow-x-auto lg:grid-cols-5">{etapas.map((etapa) => <div key={etapa} onDragOver={(e)=>e.preventDefault()} onDrop={()=>moveDeal(etapa)} className="min-h-[420px] rounded-2xl border bg-muted/25 p-3"><div className="mb-3 flex items-center justify-between"><h4 className="font-semibold">{etapa}</h4><span className="rounded-full bg-background px-2 py-0.5 text-xs">{deals.filter((d)=>d.etapa===etapa).length}</span></div><div className="space-y-2">{deals.filter((d)=>d.etapa===etapa).map((deal) => <div key={deal.id} draggable onDragStart={()=>setDragged(deal.id)} className="cursor-grab rounded-xl border bg-background p-3 shadow-sm"><div className="flex items-start justify-between gap-2"><strong className="text-sm">{deal.cliente}</strong>{deal.dias >= deal.periodicidade && <span className="rounded-full bg-warning/15 px-2 py-0.5 text-[10px] font-semibold text-warning-foreground">Alerta</span>}</div><p className="mt-1 text-xs text-muted-foreground">{deal.telefone}</p><p className="mt-2 text-xs">Última compra: {deal.ultimaCompra} • {deal.dias} dias</p><p className="text-xs">Ticket médio: <strong>{brl(deal.ticket)}</strong></p><Button variant="outline" size="sm" className="mt-3 w-full" onClick={() => gerarTarefa(deal)}>Gerar tarefa</Button></div>)}</div></div>)}</div></Card>}

          {tab === "automacoes" && <div className="grid gap-4 lg:grid-cols-2"><Card className="rounded-2xl p-5 shadow-soft"><h3 className="flex items-center gap-2 font-semibold"><Zap className="h-5 w-5 text-primary" />Regras automáticas</h3><div className="mt-4 space-y-3 text-sm">{["Cliente passou da periodicidade → gerar tarefa", "Cliente recompra → mover para Recompra feita", "Oferta sem resposta por 3 dias → notificar vendedor", "Cliente VIP parado → alerta prioritário"].map((rule) => <div key={rule} className="rounded-xl border p-3">{rule}</div>)}</div></Card><Card className="rounded-2xl p-5 shadow-soft"><h3 className="font-semibold">Tarefas geradas</h3><div className="mt-4 space-y-3 text-sm">{tarefas.length ? tarefas.map((deal) => <div key={deal.id} className="rounded-xl border p-3"><strong>{deal.cliente}</strong><p className="text-muted-foreground">{deal.tarefa}</p></div>) : <p className="text-muted-foreground">Nenhuma tarefa automática gerada ainda.</p>}</div></Card></div>}
        </section>
      </div>

      <ModalForm open={modal} onOpenChange={setModal} title="Nova ação de pós-venda" successMessage="Ação registrada" onSave={async () => {}}><div className="grid gap-3 sm:grid-cols-2"><div><Label>Cliente</Label><Input placeholder="Nome do cliente" /></div><div><Label>Canal</Label><Select defaultValue="whatsapp"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="whatsapp">WhatsApp</SelectItem><SelectItem value="ligacao">Ligação</SelectItem><SelectItem value="email">E-mail</SelectItem></SelectContent></Select></div><div><Label>Data de retorno</Label><Input type="date" /></div><div><Label>Oferta sugerida</Label><Input placeholder="Produto ou cupom" /></div></div></ModalForm>
    </div>
  );
}
