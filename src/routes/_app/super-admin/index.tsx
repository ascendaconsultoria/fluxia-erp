import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/fluxia/PageHeader";
import { StatCard } from "@/components/fluxia/StatCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStore } from "@/mock/store";
import { brl } from "@/lib/format";
import { Building2, CreditCard, AlertTriangle, TrendingUp, Users, Activity, ShieldCheck, Sparkles } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

export const Route = createFileRoute("/_app/super-admin/")({ component: SuperAdminDashboard });

const mrrData = [{ mes: "Jan", mrr: 7200 }, { mes: "Fev", mrr: 9400 }, { mes: "Mar", mrr: 12100 }, { mes: "Abr", mrr: 15800 }, { mes: "Mai", mrr: 18940 }, { mes: "Jun", mrr: 22400 }];
const usoModulos = [{ modulo: "PDV", uso: 84 }, { modulo: "Financeiro", uso: 78 }, { modulo: "Estoque", uso: 69 }, { modulo: "BPO", uso: 42 }, { modulo: "Vendas", uso: 38 }];
const planos = [{ name: "Starter", value: 24 }, { name: "Profissional", value: 44 }, { name: "BPO", value: 22 }, { name: "Enterprise", value: 10 }];
const COLORS = ["oklch(0.58 0.16 152)", "oklch(0.62 0.14 235)", "oklch(0.76 0.16 75)", "oklch(0.58 0.21 27)"];

function SuperAdminDashboard() {
  const { s } = useStore();
  const mrr = s.empresas.filter((e) => e.status === "ativo").reduce((a, e) => a + e.valorMensal, 0);
  const ativas = s.empresas.filter((e) => e.status === "ativo").length;
  const inad = s.empresas.filter((e) => e.status === "suspenso").length;
  return (
    <div className="hide-main-scrollbar h-[calc(100vh-8rem)] overflow-y-auto pr-1">
      <PageHeader title="Dashboard SaaS" description="Painel de controle do Fluxia: empresas, MRR, assinaturas, uso, riscos e provisionamento." action={<Button><Sparkles className="mr-2 h-4 w-4" />Nova empresa</Button>} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><StatCard title="MRR atual" value={brl(mrr)} icon={CreditCard} variation={14.6} tone="primary" /><StatCard title="Empresas ativas" value={ativas} icon={Building2} /><StatCard title="Usuários ativos" value="248" icon={Users} /><StatCard title="Inadimplentes" value={inad} icon={AlertTriangle} tone="destructive" /></div>
      <div className="mt-6 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]"><Card className="rounded-2xl p-5 shadow-soft"><h3 className="mb-1 font-semibold">Crescimento de MRR</h3><p className="mb-3 text-xs text-muted-foreground">Receita recorrente mensal projetada</p><div className="h-72"><ResponsiveContainer width="100%" height="100%"><AreaChart data={mrrData}><CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.005 145)" /><XAxis dataKey="mes" /><YAxis tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} /><Tooltip formatter={(v: number) => brl(v)} contentStyle={{ borderRadius: 12 }} /><Area type="monotone" dataKey="mrr" stroke="oklch(0.58 0.16 152)" fill="oklch(0.58 0.16 152 / 0.18)" /></AreaChart></ResponsiveContainer></div></Card><Card className="rounded-2xl p-5 shadow-soft"><h3 className="mb-1 font-semibold">Empresas por plano</h3><p className="mb-3 text-xs text-muted-foreground">Distribuição da base</p><div className="h-56"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={planos} dataKey="value" nameKey="name" innerRadius={64} outerRadius={92} paddingAngle={3}>{planos.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}</Pie><Tooltip formatter={(v: number) => `${v}%`} /></PieChart></ResponsiveContainer></div><div className="space-y-2 text-sm">{planos.map((p, i) => <div key={p.name} className="flex justify-between"><span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[i] }} />{p.name}</span><strong>{p.value}%</strong></div>)}</div></Card></div>
      <div className="mt-6 grid gap-4 xl:grid-cols-[0.95fr_1.05fr]"><Card className="rounded-2xl p-5 shadow-soft"><h3 className="mb-4 font-semibold">Uso por módulo</h3><div className="h-60"><ResponsiveContainer width="100%" height="100%"><BarChart data={usoModulos}><CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.005 145)" /><XAxis dataKey="modulo" /><YAxis /><Tooltip contentStyle={{ borderRadius: 12 }} /><Bar dataKey="uso" fill="oklch(0.58 0.16 152)" radius={[8, 8, 0, 0]} /></BarChart></ResponsiveContainer></div></Card><Card className="rounded-2xl p-5 shadow-soft"><h3 className="mb-4 font-semibold">Alertas e insights do SaaS</h3><div className="grid gap-3 md:grid-cols-2"><div className="rounded-xl border bg-warning/10 p-3 text-sm"><AlertTriangle className="mr-1 inline h-4 w-4" /> 4 empresas em teste vencem esta semana.</div><div className="rounded-xl border bg-destructive/10 p-3 text-sm text-destructive"><AlertTriangle className="mr-1 inline h-4 w-4" /> 2 empresas suspensas por inadimplência.</div><div className="rounded-xl border bg-primary-soft p-3 text-sm text-primary"><Activity className="mr-1 inline h-4 w-4" /> PDV é o módulo com maior uso.</div><div className="rounded-xl border bg-muted/30 p-3 text-sm"><ShieldCheck className="mr-1 inline h-4 w-4" /> Sem falhas críticas de provisionamento.</div><div className="rounded-xl border bg-muted/30 p-3 text-sm"><TrendingUp className="mr-1 inline h-4 w-4" /> Plano Profissional concentra maior MRR.</div></div></Card></div>
    </div>
  );
}
