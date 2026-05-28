import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/fluxia/PageHeader";
import { StatCard } from "@/components/fluxia/StatCard";
import { DataTable } from "@/components/fluxia/DataTable";
import { ModalForm } from "@/components/fluxia/ModalForm";
import { ConfirmDialog } from "@/components/fluxia/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { brl } from "@/lib/format";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell } from "recharts";
import { BadgeDollarSign, ClipboardList, Edit3, PackageCheck, Plus, Target, Trash2, TrendingUp, Trophy, Users } from "lucide-react";

export const Route = createFileRoute("/_app/vendas")({ component: VendasPage });

type Lead = { id: number; nome: string; empresa: string; valor: number; origem: string; responsavel: string; notas: string[]; contatos: string[] };
type Column = { id: string; title: string; leads: Lead[] };
const initialColumns: Column[] = [
  { id: "novo", title: "Novo", leads: [{ id: 1, nome: "Ana Beatriz", empresa: "Clínica Vida", valor: 4200, origem: "Meta Ads", responsavel: "Carlos", notas: ["Pediu retorno amanhã"], contatos: ["WhatsApp 24/05"] }] },
  { id: "qualificado", title: "Qualificado", leads: [{ id: 2, nome: "Bruno Lima", empresa: "Transportadora BL", valor: 8900, origem: "Indicação", responsavel: "Marina", notas: ["Tem equipe comercial"], contatos: ["Ligação 23/05"] }] },
  { id: "proposta", title: "Proposta", leads: [{ id: 3, nome: "Studio Bella", empresa: "Estética", valor: 2500, origem: "Google", responsavel: "Ana", notas: ["Aguardando aprovação"], contatos: ["E-mail 22/05"] }] },
  { id: "negociacao", title: "Negociação", leads: [] },
  { id: "fechado", title: "Fechado", leads: [] },
];
const tabs = ["Visão geral", "Leads", "Pedidos", "Orçamentos", "Clientes", "Funil", "Metas", "Comissões", "Entregas"];
const red = "oklch(0.58 0.21 27)";
const green = "oklch(0.58 0.16 152)";

function VendasPage() {
  const [tab, setTab] = useState("Visão geral");
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [drag, setDrag] = useState<{ from: string; lead: Lead } | null>(null);
  const [leadDetail, setLeadDetail] = useState<Lead | null>(null);
  const [modal, setModal] = useState<string | null>(null);
  const [deleteColumn, setDeleteColumn] = useState<string | null>(null);
  const allLeads = columns.flatMap((c) => c.leads);

  const moveLead = (to: string) => {
    if (!drag || drag.from === to) return;
    setColumns((prev) => prev.map((col) => col.id === drag.from ? { ...col, leads: col.leads.filter((l) => l.id !== drag.lead.id) } : col.id === to ? { ...col, leads: [...col.leads, drag.lead] } : col));
    setDrag(null);
  };
  const addStage = () => setColumns((prev) => [...prev, { id: `etapa-${Date.now()}`, title: "Nova etapa", leads: [] }]);
  const updateStageTitle = (id: string, title: string) => setColumns((prev) => prev.map((c) => c.id === id ? { ...c, title } : c));
  const removeStage = (id: string) => setColumns((prev) => prev.filter((c) => c.id !== id));

  const vendasMenu = [
    { label: "Visão geral", icon: ClipboardList },
    { label: "Leads", icon: Users },
    { label: "Pedidos", icon: ClipboardList },
    { label: "Orçamentos", icon: BadgeDollarSign },
    { label: "Clientes", icon: Users },
    { label: "Funil", icon: TrendingUp },
    { label: "Metas", icon: Target },
    { label: "Comissões", icon: Trophy },
    { label: "Entregas", icon: PackageCheck },
  ];

  const content = (() => {
    if (tab === "Visão geral") return <VisaoGeralVendas />;
    if (tab === "Leads") return <LeadsView leads={allLeads} onNew={() => setModal("Novo lead")} onOpen={setLeadDetail} />;
    if (tab === "Funil") return <FunilView columns={columns} setDrag={setDrag} moveLead={moveLead} updateStageTitle={updateStageTitle} addStage={addStage} askDelete={setDeleteColumn} openLead={setLeadDetail} />;
    if (tab === "Metas") return <MetasView />;
    if (tab === "Comissões") return <ComissoesView />;
    if (tab === "Pedidos") return <GenericSalesTable title="Pedidos" button="Novo pedido" onNew={() => setModal("Novo pedido")} />;
    if (tab === "Orçamentos") return <GenericSalesTable title="Orçamentos" button="Novo orçamento" onNew={() => setModal("Novo orçamento")} />;
    if (tab === "Clientes") return <GenericSalesTable title="Clientes" button="Novo cliente" onNew={() => setModal("Novo cliente")} />;
    if (tab === "Entregas") return <EntregasView />;
    return <VisaoGeralVendas />;
  })();

  return (
    <div className="flex h-[calc(100vh-8rem)] min-h-0 flex-col overflow-hidden">
      <PageHeader title="Vendas" description="CRM operacional com leads, funil, pedidos, metas, comissões e entregas." />
      <div className="grid min-h-0 flex-1 grid-cols-12 gap-4 overflow-hidden">
        <aside className="col-span-12 min-h-0 overflow-hidden rounded-2xl border bg-surface p-2 shadow-soft lg:col-span-2 xl:col-span-2">
          <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Vendas CRM</p>
          <div className="custom-scrollbar flex gap-2 overflow-x-auto lg:block lg:max-h-[calc(100vh-14rem)] lg:space-y-1 lg:overflow-y-auto lg:overflow-x-hidden">
            {vendasMenu.map((item) => {
              const Icon = item.icon;
              const active = tab === item.label;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setTab(item.label)}
                  className={`flex min-w-max items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition lg:w-full lg:min-w-0 ${active ? "bg-primary font-semibold text-primary-foreground shadow-card" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </aside>
        <section className="custom-scrollbar col-span-12 min-h-0 overflow-y-auto pr-1 lg:col-span-10 xl:col-span-10">
          {content}
        </section>
      </div>
      <ModalForm open={!!modal} onOpenChange={(v) => !v && setModal(null)} title={modal ?? "Registro"} size="lg" successMessage="Registro de vendas salvo" onSave={async () => {}}>
        <div className="grid gap-3 sm:grid-cols-2"><div><Label>Nome / código</Label><Input /></div><div><Label>Valor previsto</Label><Input type="number" /></div><div><Label>Responsável</Label><Input /></div><div><Label>Status</Label><Select defaultValue="ativo"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="ativo">Ativo</SelectItem><SelectItem value="pendente">Pendente</SelectItem><SelectItem value="fechado">Fechado</SelectItem></SelectContent></Select></div><div className="sm:col-span-2"><Label>Observações</Label><Textarea /></div></div>
      </ModalForm>
      <ConfirmDialog open={!!deleteColumn} onOpenChange={(v) => !v && setDeleteColumn(null)} title="Excluir etapa" description="A etapa será removida do funil. Use apenas quando ela estiver vazia ou não fizer mais sentido." variant="destructive" confirmText="Excluir etapa" successMessage="Etapa excluída" onConfirm={async () => { if (deleteColumn) removeStage(deleteColumn); setDeleteColumn(null); }} />
      <ModalForm open={!!leadDetail} onOpenChange={(v) => !v && setLeadDetail(null)} title={leadDetail ? `Detalhes do lead: ${leadDetail.nome}` : "Detalhe do lead"} size="lg" successMessage="Histórico atualizado" onSave={async () => {}}>
        {leadDetail && <div className="grid gap-4 md:grid-cols-[1fr_280px]"><div className="space-y-3"><Label>Nota operacional</Label><Textarea defaultValue={leadDetail.notas.join("\n")} /><Label>Novo contato</Label><Input placeholder="Ex.: Ligação realizada em 25/05" /></div><div className="rounded-2xl border p-4"><p className="font-semibold">{leadDetail.empresa}</p><p className="text-sm text-muted-foreground">{leadDetail.origem} • {leadDetail.responsavel}</p><p className="mt-3 text-2xl font-bold text-primary">{brl(leadDetail.valor)}</p><div className="mt-4 space-y-2 text-xs">{leadDetail.contatos.map(c => <div key={c} className="rounded-xl bg-muted p-2">{c}</div>)}</div></div></div>}
      </ModalForm>
    </div>
  );
}

function VisaoGeralVendas() {
  return <div className="space-y-4"><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4"><StatCard title="Pedidos" value="156" icon={ClipboardList} /><StatCard title="Orçamentos" value="42" icon={BadgeDollarSign} /><StatCard title="Clientes" value="312" icon={Users} /><StatCard title="Entregas" value="23" icon={PackageCheck} tone="warning" /></div><div className="grid gap-4 xl:grid-cols-[1.15fr_.85fr]"><Card className="rounded-2xl p-5 shadow-soft"><h3 className="font-semibold">Pedidos x meta</h3><div className="h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={[{m:"Jan",v:68,meta:70},{m:"Fev",v:72,meta:69},{m:"Mar",v:76,meta:75},{m:"Abr",v:81,meta:74},{m:"Mai",v:85,meta:80}]}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="m"/><YAxis/><Tooltip/><Bar dataKey="v" name="Realizado" fill={green} radius={[8,8,0,0]}/><Bar dataKey="meta" name="Meta" fill={red} radius={[8,8,0,0]}/></BarChart></ResponsiveContainer></div></Card><Card className="rounded-2xl p-5 shadow-soft"><h3 className="font-semibold">Resumo comercial</h3>{["Ticket médio R$ 164,00", "Win rate 31%", "Ciclo médio 11 dias", "Comissões previstas R$ 8.420"].map(i=><div key={i} className="mt-3 rounded-xl border p-3 text-sm">{i}</div>)}</Card></div></div>;
}
function LeadsView({ leads, onNew, onOpen }: { leads: Lead[]; onNew: () => void; onOpen: (l: Lead)=>void }) {
  return <DataTable data={leads} searchKeys={["nome","empresa","origem","responsavel"]} toolbar={<Button size="sm" onClick={onNew}><Plus className="mr-2 h-4 w-4"/>Novo lead</Button>} maxHeight="calc(100vh - 18rem)" columns={[{key:"nome",header:"Lead",cell:r=><strong>{r.nome}</strong>},{key:"empresa",header:"Empresa",cell:r=>r.empresa},{key:"valor",header:"Valor",cell:r=><span className="text-primary font-semibold">{brl(r.valor)}</span>},{key:"origem",header:"Origem",cell:r=>r.origem},{key:"responsavel",header:"Responsável",cell:r=>r.responsavel},{key:"acao",header:"",className:"text-right",cell:r=><div className="flex justify-end gap-1"><Button variant="ghost" size="sm" onClick={()=>onOpen(r)}>Abrir</Button><Button variant="ghost" size="sm"><Edit3 className="h-4 w-4"/></Button><Button variant="ghost" size="sm"><Trash2 className="h-4 w-4 text-destructive"/></Button></div>}]} />;
}
function FunilView({ columns, setDrag, moveLead, updateStageTitle, addStage, askDelete, openLead }: { columns: Column[]; setDrag: (v:{from:string;lead:Lead}|null)=>void; moveLead:(to:string)=>void; updateStageTitle:(id:string,title:string)=>void; addStage:()=>void; askDelete:(id:string)=>void; openLead:(l:Lead)=>void }) {
  return <div className="space-y-4"><div className="flex justify-end"><Button onClick={addStage}><Plus className="mr-2 h-4 w-4"/>Criar etapa</Button></div><div className="custom-scrollbar flex gap-3 overflow-x-auto pb-2">{columns.map(col=><Card key={col.id} onDragOver={(e)=>e.preventDefault()} onDrop={()=>moveLead(col.id)} className="min-h-[560px] w-[300px] flex-shrink-0 rounded-2xl p-3 shadow-soft"><div className="mb-3 flex items-center gap-2"><Input value={col.title} onChange={(e)=>updateStageTitle(col.id,e.target.value)} className="h-9 font-semibold"/><Button variant="ghost" size="icon" onClick={()=>askDelete(col.id)}><Trash2 className="h-4 w-4 text-destructive"/></Button></div><div className="space-y-3">{col.leads.map(lead=><div key={lead.id} draggable onDragStart={()=>setDrag({from:col.id,lead})} onClick={()=>openLead(lead)} className="cursor-grab rounded-xl border bg-surface p-3 text-sm shadow-soft active:cursor-grabbing"><strong>{lead.nome}</strong><p className="text-xs text-muted-foreground">{lead.empresa}</p><p className="mt-2 font-semibold text-primary">{brl(lead.valor)}</p><p className="mt-1 text-xs">{lead.responsavel} • {lead.origem}</p></div>)}</div></Card>)}</div></div>
}
function MetasView() { return <div className="grid gap-4 xl:grid-cols-[380px_1fr]"><Card className="rounded-2xl p-5 shadow-soft"><h3 className="font-semibold">Planejamento de metas</h3><div className="mt-4 space-y-3"><div><Label>Meta de faturamento</Label><Input defaultValue="90000" type="number"/></div><div><Label>Prazo</Label><Input type="date"/></div><div><Label>Métrica principal</Label><Select defaultValue="receita"><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="receita">Receita</SelectItem><SelectItem value="pedidos">Pedidos</SelectItem><SelectItem value="margem">Margem</SelectItem></SelectContent></Select></div><Button className="w-full">Salvar meta</Button></div></Card><Card className="rounded-2xl p-5 shadow-soft"><h3 className="font-semibold">Acompanhamento</h3><div className="h-80"><ResponsiveContainer width="100%" height="100%"><BarChart data={[{m:"Sem 1",v:22,meta:20},{m:"Sem 2",v:34,meta:40},{m:"Sem 3",v:52,meta:60},{m:"Sem 4",v:72,meta:90}]}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="m"/><YAxis/><Tooltip/><Bar dataKey="v" fill={green} radius={[8,8,0,0]}/><Bar dataKey="meta" fill={red} radius={[8,8,0,0]}/></BarChart></ResponsiveContainer></div></Card></div> }
function ComissoesView() { const vendedores=[{nome:"Marina",vendas:42000,comissao:4200},{nome:"Carlos",vendas:38600,comissao:3860},{nome:"Ana",vendas:29500,comissao:2950},{nome:"Paulo",vendas:18800,comissao:1880}]; return <div className="grid gap-4 xl:grid-cols-[360px_1fr]"><Card className="rounded-2xl p-5 shadow-soft"><Trophy className="h-6 w-6 text-primary"/><h3 className="mt-2 font-semibold">Ranking do mês</h3>{vendedores.map((v,i)=><div key={v.nome} className="mt-3 flex items-center justify-between rounded-xl border p-3"><div><strong>#{i+1} {v.nome}</strong><p className="text-xs text-muted-foreground">{brl(v.vendas)} vendidos</p></div><span className="font-semibold text-primary">{brl(v.comissao)}</span></div>)}</Card><DataTable data={vendedores} searchKeys={["nome"]} maxHeight="calc(100vh - 20rem)" columns={[{key:"nome",header:"Vendedor",cell:r=><strong>{r.nome}</strong>},{key:"vendas",header:"Vendas",cell:r=>brl(r.vendas)},{key:"comissao",header:"Comissão",cell:r=><span className="text-primary font-semibold">{brl(r.comissao)}</span>},{key:"acao",header:"",className:"text-right",cell:()=> <Button variant="ghost" size="sm">Detalhar</Button>}]} /></div> }
function GenericSalesTable({ title, button, onNew }: { title: string; button: string; onNew: () => void }) { const rows=[{codigo:"#1024",cliente:"Tech Solutions",status:"Aberto",valor:4280,prazo:"Hoje"},{codigo:"#1025",cliente:"Studio Bella",status:"Aprovação",valor:2500,prazo:"Amanhã"},{codigo:"#1026",cliente:"Mercado Bom Preço",status:"Fechado",valor:8900,prazo:"28/05"}]; return <DataTable data={rows} searchKeys={["codigo","cliente","status"]} toolbar={<Button size="sm" onClick={onNew}><Plus className="mr-2 h-4 w-4"/>{button}</Button>} maxHeight="calc(100vh - 18rem)" columns={[{key:"codigo",header:title,cell:r=><strong>{r.codigo}</strong>},{key:"cliente",header:"Cliente",cell:r=>r.cliente},{key:"status",header:"Status",cell:r=>r.status},{key:"valor",header:"Valor",cell:r=><span className="font-semibold text-primary">{brl(r.valor)}</span>},{key:"prazo",header:"Prazo",cell:r=>r.prazo}]} /> }
function EntregasView() { return <div className="space-y-4"><div className="grid gap-3 md:grid-cols-3"><StatCard title="Em separação" value="9" icon={PackageCheck}/><StatCard title="Em rota" value="12" icon={TrendingUp} tone="primary"/><StatCard title="Atrasadas" value="2" icon={Target} tone="destructive"/></div><GenericSalesTable title="Entregas" button="Nova entrega" onNew={()=>{}} /></div> }
