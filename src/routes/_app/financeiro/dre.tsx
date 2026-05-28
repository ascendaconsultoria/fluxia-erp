import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/fluxia/PageHeader";
import { FinanceiroShell } from "@/components/fluxia/ModuleShells";
import { StatCard } from "@/components/fluxia/StatCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { brl } from "@/lib/format";
import { Download, TrendingUp, TrendingDown, Percent, Wallet, BarChart3, AlertTriangle } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export const Route = createFileRoute("/_app/financeiro/dre")({
  component: DrePage,
});

const evolucao = [
  { mes: "Jan", receita: 68000, custos: 42000, lucro: 26000 },
  { mes: "Fev", receita: 72000, custos: 43500, lucro: 28500 },
  { mes: "Mar", receita: 76000, custos: 44200, lucro: 31800 },
  { mes: "Abr", receita: 80500, custos: 46200, lucro: 34300 },
  { mes: "Mai", receita: 86000, custos: 42000, lucro: 44000 },
  { mes: "Jun", receita: 92000, custos: 48000, lucro: 44000 },
];

const linhas = [
  { label: "Receita bruta", valor: 128400, nivel: 0, tipo: "positivo" },
  { label: "Deduções, impostos e devoluções", valor: -11840, nivel: 1, tipo: "negativo" },
  { label: "Receita líquida", valor: 116560, nivel: 0, tipo: "subtotal" },
  { label: "Custos dos produtos e serviços", valor: -52400, nivel: 1, tipo: "negativo" },
  { label: "Lucro bruto", valor: 64160, nivel: 0, tipo: "subtotal" },
  { label: "Despesas operacionais", valor: -36220, nivel: 1, tipo: "negativo" },
  { label: "Resultado operacional", valor: 27940, nivel: 0, tipo: "subtotal" },
  { label: "Impostos sobre resultado", valor: -10324, nivel: 1, tipo: "negativo" },
  { label: "Lucro líquido", valor: 17616, nivel: 0, tipo: "final" },
];

function DrePage() {
  return (
    <FinanceiroShell>
      <>
      <PageHeader
        title="DRE | Demonstrativo de Resultado"
        description="Maio 2026"
        action={<Button variant="outline"><Download className="mr-2 h-4 w-4" />Exportar PDF</Button>}
      />

      <div className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
        <StatCard title="Receita líquida" value={brl(116560)} icon={Wallet} tone="primary" />
        <StatCard title="Lucro bruto" value={brl(64160)} icon={TrendingUp} />
        <StatCard title="Lucro líquido" value={brl(17616)} icon={BarChart3} hint="Margem líquida 15,1%" />
        <StatCard title="Margem bruta" value="55,0%" icon={Percent} />
        <StatCard title="Margem líquida" value="15,1%" icon={Percent} tone="warning" />
      </div>

      <div className="mt-6 grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <Card className="min-w-0 overflow-hidden rounded-2xl p-5 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Evolução — 6 meses</h3>
              <p className="text-xs text-muted-foreground">Receita, custos e lucro líquido</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={evolucao}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.005 145)" />
                <XAxis dataKey="mes" fontSize={12} />
                <YAxis fontSize={12} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => brl(v)} contentStyle={{ borderRadius: 12 }} />
                <Legend />
                <Bar dataKey="receita" name="Receita" fill="oklch(0.58 0.16 152)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="custos" name="Custos" fill="oklch(0.58 0.21 27)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="lucro" name="Lucro" fill="oklch(0.62 0.14 235)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full bg-primary-soft px-3 py-1 text-primary"><TrendingUp className="mr-1 inline h-3 w-3" /> Crescimento receita: +12%</span>
            <span className="rounded-full bg-destructive/10 px-3 py-1 text-destructive"><TrendingDown className="mr-1 inline h-3 w-3" /> Crescimento custo: +3%</span>
          </div>
        </Card>

        <Card className="min-w-0 overflow-hidden rounded-2xl p-5 shadow-soft">
          <h3 className="mb-4 font-semibold">Detalhamento gerencial</h3>
          <div className="space-y-2">
            {linhas.map((l) => (
              <div key={l.label} className={`flex min-w-0 items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm ${l.tipo === "final" ? "bg-primary-soft text-primary" : l.tipo === "subtotal" ? "bg-muted/50" : ""}`}>
                <span className={`${l.nivel ? "pl-4 text-muted-foreground" : "font-medium"} min-w-0 truncate`}>{l.label}</span>
                <span className={`shrink-0 font-semibold ${l.valor < 0 ? "text-destructive" : l.tipo === "final" ? "text-primary" : ""}`}>{brl(l.valor)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Card className="rounded-2xl border-primary/20 bg-primary-soft p-4 text-primary shadow-soft">
          <h3 className="font-semibold">EBITDA estimado</h3>
          <p className="mt-1 text-sm">{brl(29420)} antes de depreciações e ajustes operacionais.</p>
        </Card>
        <Card className="rounded-2xl p-4 shadow-soft">
          <h3 className="font-semibold">Break-even</h3>
          <p className="mt-1 text-sm text-muted-foreground">Receita mínima estimada para cobrir custos: {brl(88620)}.</p>
        </Card>
        <Card className="rounded-2xl border-warning/30 bg-warning/10 p-4 shadow-soft">
          <div className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-warning-foreground" /><h3 className="font-semibold">Variação de custos</h3></div>
          <p className="mt-1 text-sm text-muted-foreground">Custos cresceram 3% no período comparado.</p>
        </Card>
      </div>
      </>
    </FinanceiroShell>
  );
}
