import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/fluxia/PageHeader";
import { StatCard } from "@/components/fluxia/StatCard";
import { EstoqueShell } from "@/components/fluxia/ModuleShells";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ModalForm } from "@/components/fluxia/ModalForm";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useStore } from "@/mock/store";
import { brl } from "@/lib/format";
import { AlertTriangle, DollarSign, Package, PackageX, Plus, RefreshCw } from "lucide-react";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { useState } from "react";

export const Route = createFileRoute("/_app/estoque/")({ component: EstoquePage });

function EstoquePage() {
  const { s } = useStore();
  const [acao, setAcao] = useState(false);
  const baixo = s.produtos.filter((p) => p.estoque > 0 && p.estoque <= p.estoqueMinimo).length;
  const semEstoque = s.produtos.filter((p) => p.estoque === 0).length;
  const valorEstoque = s.produtos.reduce((acc, p) => acc + p.estoque * p.custo, 0);
  const giroCritico = s.produtos.filter((p) => p.estoque <= p.estoqueMinimo).slice(0, 5);

  return (
    <EstoqueShell>
      <PageHeader title="Estoque" description="Dashboard de produtos, giro, ruptura, reposição, locais e inventário." action={<Button size="sm" onClick={() => setAcao(true)}><Plus className="mr-2 h-4 w-4" />Planejar reposição</Button>} />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Produtos ativos" value={s.produtos.length} icon={Package} />
        <StatCard title="Estoque baixo" value={baixo} icon={AlertTriangle} tone="warning" />
        <StatCard title="Sem estoque" value={semEstoque} icon={PackageX} tone="destructive" />
        <StatCard title="Valor em estoque" value={brl(valorEstoque)} icon={DollarSign} />
      </div>
      <div className="mt-5 grid gap-4 xl:grid-cols-[1fr_330px]">
        <Card className="rounded-2xl p-5 shadow-soft"><h3 className="font-semibold">Itens que exigem ação</h3><div className="mt-3 divide-y">{giroCritico.map((p) => <div key={p.id} className="flex items-center justify-between py-3 text-sm"><div><p className="font-medium">{p.nome}</p><p className="text-xs text-muted-foreground">Estoque {p.estoque} • mínimo {p.estoqueMinimo}</p></div><span className="rounded-full bg-warning/15 px-2 py-1 text-xs text-warning-foreground">Repor</span></div>)}</div></Card>
        <Card className="rounded-2xl p-5 shadow-soft"><div className="flex items-center justify-between"><div><h3 className="font-semibold">Cobertura por categoria</h3><p className="text-xs text-muted-foreground">Dias estimados de estoque disponível</p></div><RefreshCw className="h-5 w-5 text-primary" /></div><div className="mt-4 h-40"><ResponsiveContainer width="100%" height="100%"><BarChart data={[{cat:"Bebidas",dias:42},{cat:"Padaria",dias:6},{cat:"Eletr.",dias:18},{cat:"Vestu.",dias:28}]}><CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.005 145)" /><XAxis dataKey="cat" fontSize={11} /><YAxis fontSize={11} /><Tooltip contentStyle={{ borderRadius: 12 }} /><Bar dataKey="dias" fill="oklch(0.58 0.16 152)" radius={[8,8,0,0]} /></BarChart></ResponsiveContainer></div></Card>
      </div>
      <ModalForm open={acao} onOpenChange={setAcao} title="Planejar reposição de estoque" successMessage="Ação registrada" onSave={async () => {}}>
        <div className="grid gap-3 sm:grid-cols-2"><div><Label>Produto crítico</Label><Input placeholder="Ex.: Pão Francês kg" /></div><div><Label>Quantidade sugerida</Label><Input type="number" /></div><div><Label>Fornecedor preferencial</Label><Input placeholder="Fornecedor" /></div><div><Label>Prazo desejado</Label><Input type="date" /></div><div className="sm:col-span-2"><Label>Observação</Label><Input placeholder="Motivo da reposição ou risco de ruptura" /></div></div>
      </ModalForm>
    </EstoqueShell>
  );
}
