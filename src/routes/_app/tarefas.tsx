import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/fluxia/PageHeader";
import { DataTable } from "@/components/fluxia/DataTable";
import { ModalForm } from "@/components/fluxia/ModalForm";
import { ConfirmDialog } from "@/components/fluxia/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit3, Trash2, Eye } from "lucide-react";

export const Route = createFileRoute("/_app/tarefas")({ component: TarefasPage });

type Tarefa = { id: number; titulo: string; modulo: string; responsavel: string; prazo: string; prioridade: string; status: string; descricao: string };
const seed: Tarefa[] = [
  { id: 1, titulo: "Conferir contas vencidas", modulo: "Financeiro", responsavel: "Marina Lopes", prazo: "Hoje 16h", prioridade: "Alta", status: "Em andamento", descricao: "Validar títulos críticos e enviar cobrança." },
  { id: 2, titulo: "Repor Mouse Wireless", modulo: "Estoque", responsavel: "Carlos Silva", prazo: "Hoje", prioridade: "Média", status: "Pendente", descricao: "Abrir solicitação de compra." },
  { id: 3, titulo: "Aprovar pedido #442", modulo: "Compras", responsavel: "Ana Souza", prazo: "Amanhã", prioridade: "Alta", status: "Pendente", descricao: "Aguardando cotação final." },
  { id: 4, titulo: "Responder cliente BPO", modulo: "BPO", responsavel: "Paulo Lima", prazo: "Hoje 11h", prioridade: "Crítica", status: "Atrasada", descricao: "Cliente enviou documentação incompleta." },
  { id: 5, titulo: "Atualizar meta de vendas", modulo: "Vendas", responsavel: "Carlos Silva", prazo: "27/05", prioridade: "Baixa", status: "Planejada", descricao: "Revisar meta semanal por vendedor." },
];
const cols = ["Planejada", "Pendente", "Em andamento", "Atrasada", "Concluída"];

function TarefasPage() {
  const [tarefas, setTarefas] = useState(seed);
  const [view, setView] = useState("Kanban");
  const [modal, setModal] = useState<Tarefa | "nova" | null>(null);
  const [excluir, setExcluir] = useState<Tarefa | null>(null);
  const openNew = () => setModal("nova");

  return (
    <div className="flex h-[calc(100vh-8rem)] min-h-0 flex-col overflow-hidden">
      <PageHeader title="Tarefas" description="Central operacional para criar, acompanhar, abrir detalhes, editar e excluir tarefas." action={<Button size="sm" onClick={openNew}><Plus className="mr-2 h-4 w-4" />Nova tarefa</Button>} />
      <div className="mb-4 flex flex-shrink-0 gap-2 rounded-2xl border bg-surface p-2"><button onClick={()=>setView("Kanban")} className={`rounded-xl px-3 py-2 text-sm ${view==="Kanban"?"bg-primary text-primary-foreground":"hover:bg-muted"}`}>Kanban</button><button onClick={()=>setView("Lista")} className={`rounded-xl px-3 py-2 text-sm ${view==="Lista"?"bg-primary text-primary-foreground":"hover:bg-muted"}`}>Lista</button></div>
      <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto pr-1">
        {view === "Kanban" ? <div className="grid gap-3 xl:grid-cols-5">{cols.map(col=><Card key={col} className="min-h-[520px] rounded-2xl p-4 shadow-soft"><h3 className="mb-3 font-semibold">{col}</h3><div className="space-y-3">{tarefas.filter(t=>t.status===col).map(t=><div key={t.id} className="rounded-xl border bg-surface p-3 text-sm"><strong>{t.titulo}</strong><p className="text-xs text-muted-foreground">{t.modulo} • {t.responsavel}</p><p className="mt-1 text-xs">{t.prazo} • {t.prioridade}</p><div className="mt-3 flex gap-1"><Button size="sm" variant="ghost" onClick={()=>setModal(t)}><Eye className="h-4 w-4"/></Button><Button size="sm" variant="ghost" onClick={()=>setModal(t)}><Edit3 className="h-4 w-4"/></Button><Button size="sm" variant="ghost" onClick={()=>setExcluir(t)}><Trash2 className="h-4 w-4 text-destructive"/></Button></div></div>)}</div></Card>)}</div> : <DataTable data={tarefas} searchKeys={["titulo","modulo","responsavel","prioridade","status"]} pageSize={10} maxHeight="calc(100vh - 18rem)" columns={[{key:"titulo",header:"Tarefa",cell:r=><strong>{r.titulo}</strong>},{key:"modulo",header:"Módulo",cell:r=>r.modulo},{key:"responsavel",header:"Responsável",cell:r=>r.responsavel},{key:"prazo",header:"Prazo",cell:r=>r.prazo},{key:"status",header:"Status",cell:r=>r.status},{key:"acao",header:"",className:"text-right",cell:r=><div className="flex justify-end gap-1"><Button variant="ghost" size="sm" onClick={()=>setModal(r)}>Abrir/Editar</Button><Button variant="ghost" size="sm" onClick={()=>setExcluir(r)}><Trash2 className="h-4 w-4 text-destructive"/></Button></div>}]} />}
      </div>
      <ModalForm open={!!modal} onOpenChange={(v)=>!v && setModal(null)} title={modal === "nova" ? "Nova tarefa" : "Detalhe e edição da tarefa"} successMessage="Tarefa salva" onSave={async()=>{}}>
        <div className="grid gap-3 sm:grid-cols-2"><div className="sm:col-span-2"><Label>Título</Label><Input defaultValue={modal && modal !== "nova" ? modal.titulo : ""}/></div><div><Label>Módulo</Label><Input defaultValue={modal && modal !== "nova" ? modal.modulo : ""}/></div><div><Label>Responsável</Label><Input defaultValue={modal && modal !== "nova" ? modal.responsavel : ""}/></div><div><Label>Prioridade</Label><Select defaultValue={modal && modal !== "nova" ? modal.prioridade : "Média"}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Baixa">Baixa</SelectItem><SelectItem value="Média">Média</SelectItem><SelectItem value="Alta">Alta</SelectItem><SelectItem value="Crítica">Crítica</SelectItem></SelectContent></Select></div><div><Label>Status</Label><Select defaultValue={modal && modal !== "nova" ? modal.status : "Planejada"}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{cols.map(c=><SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div><div className="sm:col-span-2"><Label>Descrição</Label><Textarea defaultValue={modal && modal !== "nova" ? modal.descricao : ""}/></div></div>
      </ModalForm>
      <ConfirmDialog open={!!excluir} onOpenChange={(v)=>!v && setExcluir(null)} title="Excluir tarefa" description={`Deseja excluir ${excluir?.titulo ?? "esta tarefa"}?`} variant="destructive" confirmText="Excluir" successMessage="Tarefa excluída" onConfirm={async()=>{ if (excluir) setTarefas(prev=>prev.filter(t=>t.id!==excluir.id)); setExcluir(null); }} />
    </div>
  );
}
