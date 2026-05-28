import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/fluxia/PageHeader";
import { StatCard } from "@/components/fluxia/StatCard";
import { FinanceiroShell } from "@/components/fluxia/ModuleShells";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ModalForm } from "@/components/fluxia/ModalForm";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStore } from "@/mock/store";
import { brl } from "@/lib/format";
import {
  Wallet, TrendingUp, TrendingDown, BarChart3, ArrowDownToLine, AlertTriangle,
  CalendarDays, FileText, ReceiptText, Landmark, CreditCard, Bell,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, PieChart, Pie, Cell,
} from "recharts";
import { fluxoMensal } from "@/mock/data";

export const Route = createFileRoute("/_app/financeiro/")({ component: FinanceiroPage });

const bancoData = [
  { name: "Itaú PJ", entradas: 42000, saidas: 18500 },
  { name: "Bradesco", entradas: 28700, saidas: 15100 },
  { name: "Caixa", entradas: 14050, saidas: 8780 },
];

const contasStatus = [
  { name: "Em dia", value: 52 },
  { name: "A vencer", value: 31 },
  { name: "Vencidas", value: 17 },
];

const COLORS = ["oklch(0.58 0.16 152)", "oklch(0.76 0.16 75)", "oklch(0.58 0.21 27)"];

function FinanceiroPage() {
  const { s } = useStore();
  const [acao, setAcao] = useState<string | null>(null);
  const aReceber = s.lancamentos.filter((l) => l.tipo === "receita" && l.status !== "recebido").reduce((a, l) => a + l.valor, 0);
  const aPagar = s.lancamentos.filter((l) => l.tipo === "despesa" && l.status !== "pago").reduce((a, l) => a + l.valor, 0);
  const vencidas = s.lancamentos.filter((l) => l.status === "atrasado").length;

  return (
    <FinanceiroShell>
      <PageHeader
        title="Financeiro"
        description="Visão limpa de caixa, contas, bancos, cartões, cobranças, fluxo de caixa e resultado."
      />

      <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
        <StatCard title="Saldo atual" value={brl(38920)} icon={Wallet} tone="primary" />
        <StatCard title="Receitas" value={brl(84750)} icon={TrendingUp} variation={12.1} />
        <StatCard title="Despesas" value={brl(42380)} icon={TrendingDown} variation={-3.2} />
        <StatCard title="Resultado" value={brl(42370)} icon={BarChart3} />
        <StatCard title="A receber" value={brl(aReceber)} icon={ArrowDownToLine} />
        <StatCard title="Vencidas" value={vencidas} icon={AlertTriangle} tone="destructive" />
      </div>

      <div className="mt-4 grid gap-4 2xl:grid-cols-[1.25fr_0.95fr]">
        <Card className="rounded-2xl p-4 shadow-soft">
          <div className="mb-2 flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Fluxo de caixa</h3>
              <p className="text-xs text-muted-foreground">Entradas x saídas por competência</p>
            </div>
            <CalendarDays className="h-4 w-4 text-primary" />
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={fluxoMensal}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.005 145)" />
                <XAxis dataKey="mes" fontSize={11} />
                <YAxis fontSize={11} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => brl(v)} contentStyle={{ borderRadius: 12 }} />
                <Area dataKey="entradas" name="Entradas" stroke="oklch(0.58 0.16 152)" fill="oklch(0.58 0.16 152 / 0.16)" />
                <Area dataKey="saidas" name="Saídas" stroke="oklch(0.58 0.21 27)" fill="oklch(0.58 0.21 27 / 0.08)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            <div className="rounded-xl border bg-muted/25 p-3"><p className="text-xs text-muted-foreground">Saldo projetado</p><p className="font-semibold text-primary">{brl(46800)}</p></div>
            <div className="rounded-xl border bg-muted/25 p-3"><p className="text-xs text-muted-foreground">Queima média</p><p className="font-semibold">{brl(42380)}</p></div>
            <div className="rounded-xl border bg-muted/25 p-3"><p className="text-xs text-muted-foreground">Cobertura</p><p className="font-semibold">32 dias</p></div>
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            <div className="flex min-h-[150px] items-center gap-3 rounded-xl border bg-muted/20 p-3">
              <div className="h-28 w-28 flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={[{ name: "Fornecedores", value: 42 }, { name: "Pessoal", value: 31 }, { name: "Marketing", value: 17 }, { name: "Outros", value: 10 }]} dataKey="value" innerRadius={32} outerRadius={50} paddingAngle={3}>
                      {["oklch(0.58 0.16 152)", "oklch(0.58 0.21 27)", "oklch(0.76 0.16 75)", "oklch(0.62 0.14 235)"].map((color) => <Cell key={color} fill={color} />)}
                    </Pie>
                    <Tooltip formatter={(v: number) => `${v}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="min-w-0"><p className="text-xs text-muted-foreground">Despesas por categoria</p><p className="text-lg font-bold">42%</p><p className="text-xs text-muted-foreground">Fornecedores lideram o mês.</p></div>
            </div>
            <div className="min-h-[150px] rounded-xl border border-destructive/20 bg-destructive/5 p-4"><p className="text-xs text-muted-foreground">Inadimplência realizada</p><p className="mt-2 text-3xl font-bold text-destructive">8,7%</p><p className="mt-2 text-xs text-muted-foreground">Risco real medido sobre títulos vencidos e não renegociados.</p></div>
            <div className="min-h-[150px] rounded-xl border bg-muted/20 p-4"><p className="text-xs text-muted-foreground">Prazo médio recebimento</p><p className="mt-2 text-3xl font-bold">11 dias</p><p className="mt-2 text-xs text-muted-foreground">Redução de 2 dias em relação à competência anterior.</p></div>
          </div>
        </Card>

        <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-1">
          <Card className="rounded-2xl p-4 shadow-soft">
            <h3 className="mb-2 font-semibold">Movimentação bancária</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bancoData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.005 145)" />
                  <XAxis dataKey="name" fontSize={11} />
                  <YAxis fontSize={11} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: number) => brl(v)} contentStyle={{ borderRadius: 12 }} />
                  <Bar dataKey="entradas" name="Entradas" fill="oklch(0.58 0.16 152)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="saidas" name="Saídas" fill="oklch(0.58 0.21 27)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="rounded-2xl p-4 shadow-soft">
            <h3 className="mb-2 font-semibold">Status das contas</h3>
            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={contasStatus} dataKey="value" nameKey="name" innerRadius={38} outerRadius={58} paddingAngle={3}>
                    {contasStatus.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1 text-xs">
              {contasStatus.map((c, i) => <div key={c.name} className="flex justify-between"><span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ background: COLORS[i] }} />{c.name}</span><strong>{c.value}%</strong></div>)}
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Card className="rounded-2xl p-4 shadow-soft"><div className="flex gap-3"><Landmark className="h-5 w-5 text-primary" /><div><h3 className="font-semibold">Contas e carteiras</h3><p className="mt-1 text-sm text-muted-foreground">3 contas ativas, com Itaú PJ concentrando 49% da movimentação.</p></div></div></Card>
        <Card className="rounded-2xl p-4 shadow-soft"><div className="flex gap-3"><CreditCard className="h-5 w-5 text-primary" /><div><h3 className="font-semibold">Cartões</h3><p className="mt-1 text-sm text-muted-foreground">Taxas e recebíveis precisam ser conciliados antes do fechamento.</p></div></div></Card>
        <Card className="rounded-2xl p-4 shadow-soft"><div className="flex gap-3"><FileText className="h-5 w-5 text-primary" /><div><h3 className="font-semibold">Inadimplência</h3><p className="mt-1 text-sm text-muted-foreground">7 cobranças vencidas somando {brl(aPagar * 0.18)} em risco operacional.</p></div></div></Card>
      </div>

      <ModalForm open={!!acao} onOpenChange={(v) => !v && setAcao(null)} title={acao === "notificacao" ? "Criar alerta financeiro" : "Novo lançamento financeiro"} successMessage="Registro salvo" onSave={async () => {}}>
        <div className="grid gap-3 sm:grid-cols-2">
          <div><Label>Tipo</Label><Select defaultValue="receita"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="receita">Receita</SelectItem><SelectItem value="despesa">Despesa</SelectItem><SelectItem value="alerta">Alerta</SelectItem></SelectContent></Select></div>
          <div><Label>Valor</Label><Input type="number" /></div>
          <div className="sm:col-span-2"><Label>Descrição</Label><Input placeholder="Descreva a movimentação" /></div>
        </div>
      </ModalForm>
    </FinanceiroShell>
  );
}
