import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/fluxia/PageHeader";
import { FinanceiroShell } from "@/components/fluxia/ModuleShells";
import { StatCard } from "@/components/fluxia/StatCard";
import { DataTable } from "@/components/fluxia/DataTable";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { brl } from "@/lib/format";
import { fluxoMensal } from "@/mock/data";
import { ArrowDownToLine, ArrowUpFromLine, CalendarDays, Download, LineChart, Wallet } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from "recharts";

export const Route = createFileRoute("/_app/financeiro/fluxo-caixa")({ component: FluxoCaixaPage });

const projecao = [
  { semana: "S1", entrada: 18400, saida: 12800 }, { semana: "S2", entrada: 22600, saida: 16900 }, { semana: "S3", entrada: 19800, saida: 14200 }, { semana: "S4", entrada: 31400, saida: 20300 },
];
const lancamentos = [
  { data: "24/05", descricao: "Recebimento Tech Solutions", tipo: "Entrada", valor: brl(2400), status: "Previsto" },
  { data: "25/05", descricao: "Fornecedor Atacado Norte", tipo: "Saída", valor: brl(6800), status: "A pagar" },
  { data: "28/05", descricao: "Vendas cartão", tipo: "Entrada", valor: brl(12800), status: "A receber" },
  { data: "30/05", descricao: "Folha e encargos", tipo: "Saída", valor: brl(15400), status: "Agendado" },
];

function FluxoCaixaPage() {
  return (
    <FinanceiroShell>
      <PageHeader title="Fluxo de caixa" description="Entradas, saídas, saldo projetado, cobertura e compromissos futuros." action={<Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4" />Exportar</Button>} />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Saldo projetado" value={brl(46800)} icon={Wallet} tone="primary" />
        <StatCard title="Entradas 30 dias" value={brl(92200)} icon={ArrowDownToLine} variation={9.4} />
        <StatCard title="Saídas 30 dias" value={brl(64200)} icon={ArrowUpFromLine} variation={-2.1} />
        <StatCard title="Cobertura" value="32 dias" icon={CalendarDays} />
      </div>
      <div className="mt-5 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="rounded-2xl p-5 shadow-soft">
          <div className="mb-4 flex items-center gap-2"><LineChart className="h-4 w-4 text-primary" /><h3 className="font-semibold">Realizado mensal</h3></div>
          <div className="h-64"><ResponsiveContainer width="100%" height="100%"><AreaChart data={fluxoMensal}><defs><linearGradient id="entFluxo" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="oklch(0.58 0.16 152)" stopOpacity={0.35} /><stop offset="100%" stopColor="oklch(0.58 0.16 152)" stopOpacity={0} /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.005 145)" /><XAxis dataKey="mes" /><YAxis tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} /><Tooltip formatter={(v: number) => brl(v)} contentStyle={{ borderRadius: 12 }} /><Area type="monotone" dataKey="entradas" name="Entradas" stroke="oklch(0.58 0.16 152)" fill="url(#entFluxo)" /><Area type="monotone" dataKey="saidas" name="Saídas" stroke="oklch(0.58 0.21 27)" fill="oklch(0.58 0.21 27 / .10)" /></AreaChart></ResponsiveContainer></div>
        </Card>
        <Card className="rounded-2xl p-5 shadow-soft">
          <h3 className="mb-4 font-semibold">Projeção semanal</h3>
          <div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={projecao}><CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.005 145)" /><XAxis dataKey="semana" /><YAxis tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} /><Tooltip formatter={(v: number) => brl(v)} contentStyle={{ borderRadius: 12 }} /><Bar dataKey="entrada" name="Entradas" fill="oklch(0.58 0.16 152)" radius={[8,8,0,0]} /><Bar dataKey="saida" name="Saídas" fill="oklch(0.58 0.21 27)" radius={[8,8,0,0]} /></BarChart></ResponsiveContainer></div>
        </Card>
      </div>
      <div className="mt-5"><DataTable data={lancamentos} searchKeys={["data", "descricao", "tipo", "status"]} pageSize={10} maxHeight="calc(100vh - 33rem)" columns={[
        { key: "data", header: "Data", cell: (r) => <strong>{r.data}</strong> },
        { key: "desc", header: "Descrição", cell: (r) => r.descricao },
        { key: "tipo", header: "Tipo", cell: (r) => <span className={r.tipo === "Saída" ? "text-destructive" : "text-primary"}>{r.tipo}</span> },
        { key: "valor", header: "Valor", cell: (r) => <strong>{r.valor}</strong> },
        { key: "status", header: "Status", cell: (r) => r.status },
      ]} /></div>
    </FinanceiroShell>
  );
}
