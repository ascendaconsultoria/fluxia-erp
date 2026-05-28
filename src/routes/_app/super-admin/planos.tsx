import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/fluxia/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ModalForm } from "@/components/fluxia/ModalForm";
import { ConfirmDialog } from "@/components/fluxia/ConfirmDialog";
import { brl } from "@/lib/format";
import { CheckCircle2, Edit, Plus, Trash2, Users, Package, CreditCard } from "lucide-react";

export const Route = createFileRoute("/_app/super-admin/planos")({ component: PlanosPage });

const planos = [
  { nome: "Starter", desc: "Ideal para pequenas empresas iniciando no digital", preco: 299, empresas: 2, usuarios: "Até 3 usuários", bpo: "Sem BPO", modulos: ["Dashboard", "PDV", "Estoque"] },
  { nome: "Profissional", desc: "Para empresas em crescimento que precisam de gestão completa", preco: 599, empresas: 1, usuarios: "Até 10 usuários", bpo: "Sem BPO", modulos: ["Dashboard", "PDV", "Estoque", "Financeiro", "Relatórios"] },
  { nome: "BPO", desc: "Completo para escritórios de BPO financeiro", preco: 899, empresas: 2, usuarios: "Até 20 usuários", bpo: "Até 25 clientes BPO", modulos: ["Todos os módulos Profissional", "BPO Financeiro Completo", "Portal do Cliente"] },
  { nome: "Enterprise", desc: "Plano personalizado para grandes operações", preco: 0, empresas: 1, usuarios: "Usuários ilimitados", bpo: "BPO ilimitado", modulos: ["Todos os módulos", "API personalizada", "Suporte dedicado"] },
];

function PlanosPage() {
  const [novo, setNovo] = useState(false);
  const [excluir, setExcluir] = useState<string | null>(null);
  const totalMrr = planos.reduce((a, p) => a + p.preco * p.empresas, 0);
  const max = Math.max(...planos.map((p) => p.preco * p.empresas), 1);
  return (
    <div className="hide-main-scrollbar h-[calc(100vh-8rem)] overflow-y-auto pr-1">
      <PageHeader title="Planos" description={`${planos.length} planos • MRR estimado: ${brl(totalMrr)}`} action={<Button onClick={() => setNovo(true)}><Plus className="mr-2 h-4 w-4" />Novo Plano</Button>} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {planos.map((p) => <Card key={p.nome} className="flex min-h-[430px] flex-col rounded-2xl p-6 shadow-soft"><div className="flex items-start justify-between"><div><h3 className="text-lg font-semibold">{p.nome}</h3><p className="mt-2 min-h-[54px] text-sm text-muted-foreground">{p.desc}</p></div><span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary">{p.empresas} empresa{p.empresas > 1 ? "s" : ""}</span></div><div className="mt-7"><span className="text-3xl font-semibold text-primary">{p.preco ? brl(p.preco) : "Custom"}</span>{p.preco > 0 && <span className="text-sm text-muted-foreground">/mês</span>}<p className="mt-1 text-xs text-muted-foreground">MRR: {brl(p.preco * p.empresas)}</p></div><div className="mt-5 space-y-2 text-sm"><p className="flex items-center gap-2"><Users className="h-4 w-4 text-muted-foreground" />{p.usuarios}</p><p className="flex items-center gap-2"><Package className="h-4 w-4 text-muted-foreground" />{p.bpo}</p></div><div className="mt-5 space-y-2 text-sm">{p.modulos.map((m) => <p key={m} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" />{m}</p>)}</div><div className="mt-auto flex gap-2 pt-5"><Button variant="outline" className="flex-1"><Edit className="mr-2 h-4 w-4" />Editar</Button><Button variant="ghost" size="icon" className="text-destructive" onClick={() => setExcluir(p.nome)}><Trash2 className="h-4 w-4" /></Button></div></Card>)}
      </div>
      <Card className="mt-6 rounded-2xl p-6 shadow-soft"><div className="mb-5 flex items-center gap-2"><CreditCard className="h-4 w-4 text-primary" /><h3 className="font-semibold">Receita por Plano</h3></div><div className="space-y-5">{planos.map((p) => { const mrr = p.preco * p.empresas; return <div key={p.nome}><div className="mb-2 flex items-center justify-between gap-3 text-sm"><span><strong>{p.nome}</strong> <span className="text-muted-foreground">{p.empresas} empresa{p.empresas > 1 ? "s" : ""}</span></span><strong className="text-primary">{brl(mrr)}</strong></div><div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${Math.max(3, (mrr / max) * 100)}%` }} /></div></div>; })}<div className="border-t pt-4 flex items-center justify-between"><strong>MRR Total</strong><strong className="text-2xl text-primary">{brl(totalMrr)}</strong></div></div></Card>
      <ModalForm open={novo} onOpenChange={setNovo} title="Novo plano" successMessage="Plano salvo" onSave={async () => {}}><div className="grid gap-3 sm:grid-cols-2"><div><Label>Nome do plano</Label><Input /></div><div><Label>Valor mensal</Label><Input type="number" /></div><div><Label>Limite de usuários</Label><Input type="number" /></div><div><Label>Limite BPO</Label><Input type="number" /></div><div className="sm:col-span-2"><Label>Módulos inclusos</Label><Input placeholder="Dashboard, PDV, Estoque..." /></div></div></ModalForm>
      <ConfirmDialog open={!!excluir} onOpenChange={(v) => !v && setExcluir(null)} title="Excluir plano" description={`Confirma a exclusão do plano ${excluir ?? ""}?`} confirmText="Excluir" variant="destructive" successMessage="Plano excluído" onConfirm={async () => {}} />
    </div>
  );
}
