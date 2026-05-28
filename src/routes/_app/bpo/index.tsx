import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/fluxia/PageHeader";
import { StatCard } from "@/components/fluxia/StatCard";
import { Card } from "@/components/ui/card";
import { useStore } from "@/mock/store";
import { brl } from "@/lib/format";
import { Users, AlertTriangle, Folder, Repeat, ListTodo, FileSignature, TrendingUp, Clock3 } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts";

export const Route = createFileRoute("/_app/bpo/")({ component: BpoHome });

const pendenciasPorTipo = [
  { tipo: "Documentos", valor: 18 },
  { tipo: "Conciliação", valor: 11 },
  { tipo: "Lançamentos", valor: 42 },
  { tipo: "Fechamento", valor: 5 },
];
const statusClientes = [
  { name: "Em dia", value: 54 },
  { name: "Atenção", value: 31 },
  { name: "Crítico", value: 15 },
];
const COLORS = ["oklch(0.58 0.16 152)", "oklch(0.76 0.16 75)", "oklch(0.58 0.21 27)"];

function BpoHome() {
  const { s } = useStore();
  const ativos = s.clientesBPO.filter((c) => c.status === "ativo").length;
  const receita = s.clientesBPO.filter((c) => c.status === "ativo").reduce((a, c) => a + c.valorMensal, 0);
  const pendentes = s.pendencias.filter((p) => p.status !== "concluida").length;
  const atrasados = s.fechamentos.filter((f) => f.status === "atrasado").length;

  return (
    <>
      <PageHeader title="Visão geral do BPO" description="Central de operação para acompanhar clientes, fechamentos, pendências, documentos, conciliação e honorários." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Clientes ativos" value={ativos} icon={Users} tone="primary" />
        <StatCard title="Pendências abertas" value={pendentes} icon={AlertTriangle} tone="warning" />
        <StatCard title="Fechamentos críticos" value={atrasados} icon={Clock3} tone="destructive" />
        <StatCard title="Honorários previstos" value={brl(receita)} icon={FileSignature} />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="rounded-2xl p-5 shadow-soft">
          <h3 className="mb-1 font-semibold">Pendências por tipo</h3>
          <p className="mb-3 text-xs text-muted-foreground">Volume operacional que precisa de atenção</p>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pendenciasPorTipo}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.005 145)" />
                <XAxis dataKey="tipo" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: 12 }} />
                <Bar dataKey="valor" fill="oklch(0.58 0.16 152)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="rounded-2xl p-5 shadow-soft">
          <h3 className="mb-1 font-semibold">Status da carteira</h3>
          <p className="mb-3 text-xs text-muted-foreground">Saúde operacional dos clientes BPO</p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={statusClientes} dataKey="value" nameKey="name" innerRadius={58} outerRadius={84} paddingAngle={3}>{statusClientes.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}</Pie><Tooltip formatter={(v: number) => `${v}%`} /></PieChart></ResponsiveContainer>
          </div>
          <div className="space-y-2 text-sm">{statusClientes.map((s, i) => <div key={s.name} className="flex justify-between"><span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[i] }} />{s.name}</span><strong>{s.value}%</strong></div>)}</div>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        <Card className="rounded-2xl p-5 shadow-soft xl:col-span-2">
          <h3 className="mb-4 font-semibold">Clientes com atenção prioritária</h3>
          <div className="space-y-3">
            {s.clientesBPO.slice(0, 5).map((c, i) => (
              <div key={c.id} className="grid gap-3 rounded-2xl border p-4 md:grid-cols-[1fr_130px_140px] md:items-center">
                <div><p className="font-semibold">{c.empresa}</p><p className="text-sm text-muted-foreground">{c.responsavel} • {c.plano}</p></div>
                <span className={`rounded-full px-3 py-1 text-center text-xs font-medium ${i === 2 ? "bg-destructive/10 text-destructive" : i === 1 ? "bg-warning/10 text-warning-foreground" : "bg-primary-soft text-primary"}`}>{c.pendencias} pendências</span>
                <strong className="text-primary">{brl(c.valorMensal)}</strong>
              </div>
            ))}
          </div>
        </Card>
        <Card className="rounded-2xl p-5 shadow-soft">
          <h3 className="mb-3 font-semibold">Insights operacionais</h3>
          <div className="space-y-3 text-sm">
            <div className="rounded-xl border bg-warning/10 p-3"><AlertTriangle className="mr-1 inline h-4 w-4" /> E-commerce Plus concentra o maior volume de pendências.</div>
            <div className="rounded-xl border bg-muted/30 p-3"><Folder className="mr-1 inline h-4 w-4" /> Documentos fiscais são o maior gargalo do mês.</div>
            <div className="rounded-xl border bg-primary-soft p-3 text-primary"><Repeat className="mr-1 inline h-4 w-4" /> 72% das conciliações já foram resolvidas.</div>
            <div className="rounded-xl border bg-muted/30 p-3"><ListTodo className="mr-1 inline h-4 w-4" /> Marina está com 9 tarefas críticas para hoje.</div>
            <div className="rounded-xl border bg-muted/30 p-3"><TrendingUp className="mr-1 inline h-4 w-4" /> Honorários previstos cresceram 14% frente ao mês anterior.</div>
          </div>
        </Card>
      </div>
    </>
  );
}
