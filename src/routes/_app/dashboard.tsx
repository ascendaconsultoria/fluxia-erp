import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/fluxia/PageHeader";
import { StatCard } from "@/components/fluxia/StatCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Wallet, TrendingUp, ShoppingCart, AlertTriangle, Calendar, Lightbulb,
  Users, Trophy, Package, Target, CircleDollarSign, HeartHandshake, BellRing,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
  BarChart, Bar, PieChart, Pie, Cell, CartesianGrid, Legend,
} from "recharts";
import { brl } from "@/lib/format";
import { fluxoMensal, formasPagamento } from "@/mock/data";

export const Route = createFileRoute("/_app/dashboard")({
  component: DashboardPage,
});

const COLORS = ["oklch(0.58 0.16 152)", "oklch(0.62 0.14 235)", "oklch(0.76 0.16 75)", "oklch(0.58 0.21 27)", "oklch(0.52 0.12 285)"];

const vendasMeta = [
  { mes: "Jan", realizado: 68000, meta: 70000 },
  { mes: "Fev", realizado: 72000, meta: 69000 },
  { mes: "Mar", realizado: 76000, meta: 75000 },
  { mes: "Abr", realizado: 80500, meta: 74000 },
  { mes: "Mai", realizado: 84750, meta: 80000 },
];

const categorias = [
  { name: "Informática", value: 42 },
  { name: "Periféricos", value: 28 },
  { name: "Papelaria", value: 15 },
  { name: "Limpeza", value: 10 },
  { name: "Outros", value: 5 },
];

const topProdutos = [
  { nome: "Notebook Dell Inspiron", detalhe: "24 unidades", valor: 93576 },
  { nome: "Monitor LG 24\"", detalhe: "18 unidades", valor: 17982 },
  { nome: "Mouse Logitech M185", detalhe: "45 unidades", valor: 4045 },
  { nome: "Teclado Mecânico Redragon", detalhe: "12 unidades", valor: 3598 },
  { nome: "Resma Papel A4", detalhe: "67 unidades", valor: 2606 },
];

const topClientes = [
  { nome: "Empresa ABC Ltda", detalhe: "12 compras", valor: 46780 },
  { nome: "Supermercado Delta", detalhe: "8 compras", valor: 48920 },
  { nome: "Farmácia Centro", detalhe: "15 compras", valor: 22340 },
  { nome: "João da Silva", detalhe: "5 compras", valor: 3280 },
  { nome: "Maria Santos", detalhe: "3 compras", valor: 890 },
];

function RankingCard({ title, data }: { title: string; data: typeof topProdutos }) {
  return (
    <Card className="rounded-2xl p-5 shadow-soft">
      <h3 className="mb-4 font-semibold">{title}</h3>
      <div className="space-y-1">
        {data.map((item, idx) => (
          <div key={item.nome} className="flex items-center justify-between gap-3 border-b py-3 last:border-b-0">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary">{idx + 1}</span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{item.nome}</p>
                <p className="text-xs text-muted-foreground">{item.detalhe}</p>
              </div>
            </div>
            <span className="shrink-0 text-sm font-semibold text-primary">{brl(item.valor)}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function DashboardPage() {
  return (
    <div className="hide-main-scrollbar h-[calc(100vh-8rem)] overflow-y-auto pr-1">
      <PageHeader
        title="Dashboard"
        description="Visão executiva de vendas, caixa, margem, clientes e alertas operacionais."
        action={
          <>
            <Button variant="outline" size="sm">Hoje</Button>
            <Button variant="outline" size="sm">7 dias</Button>
            <Button variant="outline" size="sm">30 dias</Button>
            <Button size="sm">Mês atual</Button>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard title="Faturamento Mai/26" value={brl(84750)} icon={Wallet} variation={12} />
        <StatCard title="Vendas no mês" value="156" icon={ShoppingCart} hint="Ticket médio: R$ 164,00" />
        <StatCard title="Lucro líquido" value={brl(17616)} icon={CircleDollarSign} hint="Margem: 15,1%" tone="primary" />
        <StatCard title="Clientes ativos" value="18" icon={Users} hint="+2 este mês" />
        <StatCard title="Pós-venda" value="6 alertas" icon={HeartHandshake} hint="Recompra e reativação" tone="warning" />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <Card className="rounded-2xl p-5 shadow-soft">
          <div className="mb-4 flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">Vendas vs Meta — 2026</h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vendasMeta}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.005 145)" />
                <XAxis dataKey="mes" stroke="oklch(0.48 0.01 145)" fontSize={12} />
                <YAxis stroke="oklch(0.48 0.01 145)" fontSize={12} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => brl(v)} contentStyle={{ borderRadius: 12 }} />
                <Legend />
                <Bar dataKey="realizado" name="Realizado" fill="oklch(0.58 0.16 152)" radius={[7, 7, 0, 0]} />
                <Bar dataKey="meta" name="Meta" fill="oklch(0.58 0.21 27)" radius={[7, 7, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="rounded-2xl p-5 shadow-soft">
          <div className="mb-4 flex items-center gap-2">
            <Trophy className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">Vendas por Categoria</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-[1fr_220px] md:items-center">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categorias} dataKey="value" nameKey="name" innerRadius={70} outerRadius={105} paddingAngle={3}>
                    {categorias.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {categorias.map((c, i) => (
                <div key={c.name} className="flex items-center justify-between gap-3 text-sm">
                  <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[i] }} />{c.name}</span>
                  <strong>{c.value}%</strong>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[2fr_1fr]">
        <Card className="rounded-2xl p-5 shadow-soft">
          <h3 className="mb-1 font-semibold">Fluxo de caixa</h3>
          <p className="mb-3 text-xs text-muted-foreground">Entradas x saídas nos últimos 6 meses</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={fluxoMensal}>
                <defs>
                  <linearGradient id="entradasDash" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="oklch(0.58 0.16 152)" stopOpacity={0.35} /><stop offset="100%" stopColor="oklch(0.58 0.16 152)" stopOpacity={0} /></linearGradient>
                  <linearGradient id="saidasDash" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="oklch(0.58 0.21 27)" stopOpacity={0.18} /><stop offset="100%" stopColor="oklch(0.58 0.21 27)" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.005 145)" />
                <XAxis dataKey="mes" fontSize={12} />
                <YAxis fontSize={12} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => brl(v)} contentStyle={{ borderRadius: 12 }} />
                <Area type="monotone" dataKey="entradas" stroke="oklch(0.58 0.16 152)" fill="url(#entradasDash)" name="Entradas" />
                <Area type="monotone" dataKey="saidas" stroke="oklch(0.58 0.21 27)" fill="url(#saidasDash)" name="Saídas" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="rounded-2xl p-5 shadow-soft">
          <div className="mb-3 flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">Insights e alertas</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div className="rounded-xl border bg-primary-soft p-3 text-primary">Produto com maior receita: Notebook Dell Inspiron.</div>
            <div className="rounded-xl border bg-muted/30 p-3">Categoria Informática representa 42% das vendas.</div>
            <div className="rounded-xl border bg-warning/10 p-3 text-warning-foreground">8 contas vencem nos próximos 7 dias.</div>
            <div className="rounded-xl border bg-destructive/10 p-3 text-destructive">12 produtos abaixo do estoque mínimo.</div>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <RankingCard title="Top 5 Produtos" data={topProdutos} />
        <RankingCard title="Top 5 Clientes" data={topClientes} />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <StatCard title="A receber" value={brl(28430)} icon={TrendingUp} hint="14 títulos em aberto" />
        <StatCard title="A pagar" value={brl(18210)} icon={Calendar} hint="9 títulos próximos do vencimento" tone="warning" />
        <StatCard title="Estoque crítico" value="12" icon={AlertTriangle} hint="Produtos abaixo do mínimo" tone="destructive" />
      </div>
    </div>
  );
}
