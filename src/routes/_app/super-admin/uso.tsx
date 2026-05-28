import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/fluxia/PageHeader";
import { StatCard } from "@/components/fluxia/StatCard";
import { DataTable } from "@/components/fluxia/DataTable";
import { Card } from "@/components/ui/card";
import { Activity, AlertTriangle, Building2, Clock3, Database, MousePointerClick, TrendingUp, Users } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area, PieChart, Pie, Cell, LineChart, Line } from "recharts";

export const Route = createFileRoute("/_app/super-admin/uso")({ component: UsoPage });

const acessos = [
  { empresa: "Tech", acessos: 248, usuarios: 18, eventos: 1420 },
  { empresa: "Pão", acessos: 134, usuarios: 9, eventos: 780 },
  { empresa: "BPO", acessos: 312, usuarios: 22, eventos: 2140 },
  { empresa: "Mercado", acessos: 201, usuarios: 14, eventos: 1220 },
  { empresa: "Veloz", acessos: 178, usuarios: 11, eventos: 990 },
];
const serie = [
  { dia: "Seg", sessoes: 160, erros: 3 },
  { dia: "Ter", sessoes: 184, erros: 2 },
  { dia: "Qua", sessoes: 220, erros: 4 },
  { dia: "Qui", sessoes: 238, erros: 2 },
  { dia: "Sex", sessoes: 276, erros: 5 },
  { dia: "Sáb", sessoes: 118, erros: 1 },
  { dia: "Dom", sessoes: 88, erros: 1 },
];
const modulos = [
  { name: "Financeiro", value: 34 },
  { name: "PDV", value: 22 },
  { name: "Estoque", value: 18 },
  { name: "Vendas", value: 15 },
  { name: "BPO", value: 11 },
];
const COLORS = ["#009B50", "#E52B2E", "#F0A000", "#1596C8", "#6E61B5"];

function UsoPage() {
  return (
    <div className="h-[calc(100vh-7rem)] overflow-hidden">
      <div className="custom-scrollbar h-full overflow-y-auto pr-1">
        <PageHeader title="Uso do sistema" description="Visão de adoção, engajamento, consumo por módulo, eventos críticos e saúde operacional do SaaS." />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <StatCard title="Sessões no mês" value="1.284" icon={Activity} />
          <StatCard title="Empresas ativas" value="36" icon={Building2} />
          <StatCard title="Usuários ativos" value="248" icon={Users} tone="primary" />
          <StatCard title="Tempo médio" value="18min" icon={Clock3} />
          <StatCard title="Erros críticos" value="7" icon={AlertTriangle} tone="destructive" />
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-[1.25fr_.9fr]">
          <Card className="rounded-2xl p-5 shadow-soft">
            <h3 className="mb-1 font-semibold">Sessões e estabilidade</h3>
            <p className="mb-3 text-xs text-muted-foreground">Acompanhamento semanal de acesso e erros reportados.</p>
            <div className="h-72"><ResponsiveContainer width="100%" height="100%"><AreaChart data={serie}><defs><linearGradient id="uso" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#009B50" stopOpacity={0.26}/><stop offset="95%" stopColor="#009B50" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.005 145)" /><XAxis dataKey="dia" /><YAxis /><Tooltip contentStyle={{ borderRadius: 12 }} /><Area type="monotone" dataKey="sessoes" stroke="#009B50" fill="url(#uso)" strokeWidth={2} /><Line type="monotone" dataKey="erros" stroke="#E52B2E" strokeWidth={2} /></AreaChart></ResponsiveContainer></div>
          </Card>

          <Card className="rounded-2xl p-5 shadow-soft">
            <h3 className="mb-1 font-semibold">Uso por módulo</h3>
            <p className="mb-3 text-xs text-muted-foreground">Distribuição de eventos operacionais.</p>
            <div className="h-72"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={modulos} innerRadius={70} outerRadius={105} paddingAngle={4} dataKey="value">{modulos.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}</Pie><Tooltip contentStyle={{ borderRadius: 12 }} /></PieChart></ResponsiveContainer></div>
            <div className="grid gap-2 text-xs">{modulos.map((m, i) => <div key={m.name} className="flex items-center justify-between"><span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />{m.name}</span><strong>{m.value}%</strong></div>)}</div>
          </Card>
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-[1fr_360px]">
          <Card className="rounded-2xl p-5 shadow-soft">
            <h3 className="mb-1 font-semibold">Acessos por empresa</h3>
            <p className="mb-3 text-xs text-muted-foreground">Comparativo de sessões, usuários e eventos nos últimos 30 dias.</p>
            <div className="h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={acessos}><CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.005 145)" /><XAxis dataKey="empresa" /><YAxis /><Tooltip contentStyle={{ borderRadius: 12 }} /><Bar dataKey="acessos" fill="#009B50" radius={[8,8,0,0]} /><Bar dataKey="usuarios" fill="#E52B2E" radius={[8,8,0,0]} /></BarChart></ResponsiveContainer></div>
          </Card>
          <Card className="rounded-2xl p-5 shadow-soft">
            <h3 className="font-semibold">Insights de operação</h3>
            <div className="mt-4 space-y-3">
              <div className="rounded-2xl border p-3"><MousePointerClick className="mb-2 h-4 w-4 text-primary" /><p className="font-medium">PDV concentra picos de uso às 10h e 16h.</p><p className="text-xs text-muted-foreground">Priorize performance nesse período.</p></div>
              <div className="rounded-2xl border p-3"><Database className="mb-2 h-4 w-4 text-primary" /><p className="font-medium">3 empresas estão sem backup recente.</p><p className="text-xs text-muted-foreground">Criar alerta automático de infraestrutura.</p></div>
              <div className="rounded-2xl border p-3"><TrendingUp className="mb-2 h-4 w-4 text-primary" /><p className="font-medium">Uso do Financeiro subiu 18%.</p><p className="text-xs text-muted-foreground">Bom sinal de adesão ao módulo principal.</p></div>
            </div>
          </Card>
        </div>

        <div className="mt-5 pb-4">
          <DataTable
            data={acessos}
            searchKeys={["empresa"]}
            pageSize={10}
            maxHeight="340px"
            columns={[
              { key: "empresa", header: "Empresa", cell: (r) => <strong>{r.empresa}</strong> },
              { key: "acessos", header: "Sessões", cell: (r) => r.acessos },
              { key: "usuarios", header: "Usuários ativos", cell: (r) => r.usuarios },
              { key: "eventos", header: "Eventos", cell: (r) => r.eventos.toLocaleString("pt-BR") },
              { key: "saude", header: "Saúde", cell: (r) => <span className={r.acessos > 180 ? "font-semibold text-primary" : "font-semibold text-warning-foreground"}>{r.acessos > 180 ? "Alta adoção" : "Acompanhar"}</span> },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
