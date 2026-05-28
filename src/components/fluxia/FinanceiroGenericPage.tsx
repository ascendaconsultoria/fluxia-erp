import { useState } from "react";
import { PageHeader } from "@/components/fluxia/PageHeader";
import { StatCard } from "@/components/fluxia/StatCard";
import { FinanceiroShell } from "@/components/fluxia/ModuleShells";
import { DataTable } from "@/components/fluxia/DataTable";
import { ModalForm } from "@/components/fluxia/ModalForm";
import { ConfirmDialog } from "@/components/fluxia/ConfirmDialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { brl } from "@/lib/format";
import { Bell, CheckCircle2, CreditCard, Plus, ReceiptText, WalletCards, ShieldCheck, TrendingUp, Landmark, AlertTriangle, CalendarClock, Banknote } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts";

export type FinanceiroGenericKind = "cobrancas" | "tarefas" | "notificacoes" | "contas-carteiras" | "cartoes";

const configs = {
  cobrancas: {
    title: "Cobranças",
    description: "Régua de cobrança, boletos, Pix, inadimplência e acordos.",
    action: "Nova cobrança",
    icon: ReceiptText,
    stats: [["Em aberto", brl(14527), ReceiptText], ["Vencidas", "7", Bell], ["Acordos", "3", CheckCircle2]],
    rows: [
      { cliente: "Ana Beatriz Costa", titulo: "Boleto #1044", status: "Vencida há 4 dias", valor: brl(1280), prioridade: "Alta" },
      { cliente: "Bruno Henrique Lima", titulo: "Pix pendente", status: "A vencer", valor: brl(860), prioridade: "Média" },
      { cliente: "Tech Solutions", titulo: "Mensalidade Maio", status: "Em negociação", valor: brl(2400), prioridade: "Alta" },
      { cliente: "Padaria Pão Quente", titulo: "Parcela #3", status: "Acordo", valor: brl(1200), prioridade: "Baixa" },
    ],
  },
  tarefas: {
    title: "Tarefas financeiras",
    description: "Rotina diária do financeiro com responsáveis, prazos e prioridades.",
    action: "Nova tarefa",
    icon: CalendarClock,
    stats: [["Hoje", "9", CalendarClock], ["Atrasadas", "4", Bell], ["Concluídas", "71%", CheckCircle2]],
    rows: [
      { cliente: "Financeiro", titulo: "Conferir contas vencidas", status: "Alta prioridade", valor: "Hoje", prioridade: "Alta" },
      { cliente: "Bancos", titulo: "Conciliar taxas de cartão", status: "Em andamento", valor: "16h", prioridade: "Média" },
      { cliente: "Cobrança", titulo: "Enviar lembrete para 7 clientes", status: "Pendente", valor: "Amanhã", prioridade: "Alta" },
    ],
  },
  notificacoes: {
    title: "Notificações financeiras",
    description: "Alertas de vencimento, divergências bancárias, limites e fechamento.",
    action: "Novo alerta",
    icon: Bell,
    stats: [["Não lidas", "5", Bell], ["Críticas", "2", AlertTriangle], ["Resolvidas", "18", CheckCircle2]],
    rows: [
      { cliente: "Contas a pagar", titulo: "Fornecedor vence hoje", status: "Crítico", valor: brl(3200), prioridade: "Crítica" },
      { cliente: "Conciliação", titulo: "Divergência no extrato Itaú", status: "Revisar", valor: brl(428), prioridade: "Alta" },
      { cliente: "Cartões", titulo: "Taxa acima da média", status: "Acompanhar", valor: "2,9%", prioridade: "Média" },
    ],
  },
  "contas-carteiras": {
    title: "Contas e carteiras",
    description: "Bancos, caixas, carteiras digitais e saldos operacionais.",
    action: "Cadastrar conta ou carteira",
    icon: WalletCards,
    stats: [["Saldo total", brl(38920), WalletCards], ["Contas ativas", "4", CheckCircle2], ["A conciliar", "12", ReceiptText]],
    rows: [
      { cliente: "Itaú PJ", titulo: "Conta corrente", status: "Conectada", valor: brl(19200), prioridade: "Normal" },
      { cliente: "Bradesco", titulo: "Conta corrente", status: "Manual", valor: brl(11840), prioridade: "Normal" },
      { cliente: "Caixa interno", titulo: "Operação PDV", status: "Aberto", valor: brl(7880), prioridade: "Alta" },
      { cliente: "Carteira Pix", titulo: "Recebimentos instantâneos", status: "Conectada", valor: brl(5400), prioridade: "Normal" },
    ],
  },
  cartoes: {
    title: "Cartões",
    description: "Recebíveis, taxas, bandeiras, antecipações e conciliação de cartões.",
    action: "Cadastrar adquirente",
    icon: CreditCard,
    stats: [["Recebíveis", brl(21400), CreditCard], ["Taxa média", "2,38%", ReceiptText], ["Divergências", "6", Bell]],
    rows: [
      { cliente: "Cielo", titulo: "Crédito 2x a 6x", status: "A conciliar", valor: brl(12200), prioridade: "Alta" },
      { cliente: "Rede", titulo: "Débito", status: "Conciliado", valor: brl(6100), prioridade: "Normal" },
      { cliente: "Stone", titulo: "Antecipação", status: "Revisar taxa", valor: brl(3100), prioridade: "Média" },
      { cliente: "InfinitePay", titulo: "Pix + cartão", status: "Em captura", valor: brl(2800), prioridade: "Normal" },
    ],
  },
} as const;

const chart = [{ nome: "Itaú", valor: 19200 }, { nome: "Bradesco", valor: 11840 }, { nome: "Caixa", valor: 7880 }, { nome: "Pix", valor: 5400 }];
const fees = [{ nome: "Crédito", valor: 2.7 }, { nome: "Débito", valor: 1.4 }, { nome: "Pix", valor: 0.4 }, { nome: "Antecipação", valor: 3.1 }];
const pie = [{ name: "Em dia", value: 58 }, { name: "Atenção", value: 27 }, { name: "Crítico", value: 15 }];
const COLORS = ["oklch(0.58 0.16 152)", "oklch(0.76 0.16 75)", "oklch(0.58 0.21 27)"];

export function FinanceiroGenericPage({ kind }: { kind: FinanceiroGenericKind }) {
  const config = configs[kind];
  const [modal, setModal] = useState(false);
  const [confirmar, setConfirmar] = useState<string | null>(null);
  const Icon = config.icon;
  const isWallet = kind === "contas-carteiras";
  const isCard = kind === "cartoes";

  return (
    <FinanceiroShell>
      <PageHeader title={config.title} description={config.description} action={<Button size="sm" onClick={() => setModal(true)}><Plus className="mr-2 h-4 w-4" />{config.action}</Button>} />

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {config.stats.map(([label, value, StatIcon]) => <StatCard key={label as string} title={label as string} value={value} icon={StatIcon} />)}
      </div>

      {(isWallet || isCard) && (
        <div className="mt-5 grid gap-4 xl:grid-cols-2">
          <Card className="rounded-2xl p-5 shadow-soft">
            <div className="mb-4 flex items-center gap-2"><Landmark className="h-4 w-4 text-primary" /><h3 className="font-semibold">{isWallet ? "Saldo por conta" : "Recebíveis por adquirente"}</h3></div>
            <div className="h-56"><ResponsiveContainer width="100%" height="100%"><BarChart data={isWallet ? chart : chart.map((c, i) => ({ ...c, valor: [12200, 6100, 3100, 2800][i] }))}><CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.005 145)" /><XAxis dataKey="nome" /><YAxis tickFormatter={(v) => isWallet ? `R$${(v / 1000).toFixed(0)}k` : `R$${(v / 1000).toFixed(0)}k`} /><Tooltip formatter={(v: number) => isWallet ? brl(v) : brl(v)} contentStyle={{ borderRadius: 12 }} /><Bar dataKey="valor" fill="oklch(0.58 0.16 152)" radius={[8,8,0,0]} /></BarChart></ResponsiveContainer></div>
          </Card>
          <Card className="rounded-2xl p-5 shadow-soft">
            <div className="mb-4 flex items-center gap-2">{isWallet ? <ShieldCheck className="h-4 w-4 text-primary" /> : <Banknote className="h-4 w-4 text-primary" />}<h3 className="font-semibold">{isWallet ? "Saúde das carteiras" : "Taxas por operação"}</h3></div>
            <div className="h-56"><ResponsiveContainer width="100%" height="100%">{isWallet ? <PieChart><Pie data={pie} dataKey="value" nameKey="name" innerRadius={60} outerRadius={86}>{pie.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}</Pie><Tooltip formatter={(v: number) => `${v}%`} /></PieChart> : <BarChart data={fees}><CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.005 145)" /><XAxis dataKey="nome" /><YAxis tickFormatter={(v) => `${v}%`} /><Tooltip formatter={(v: number) => `${v}%`} contentStyle={{ borderRadius: 12 }} /><Bar dataKey="valor" fill="oklch(0.58 0.21 27)" radius={[8,8,0,0]} /></BarChart>}</ResponsiveContainer></div>
          </Card>
        </div>
      )}

      <div className="mt-5">
        <DataTable
          data={config.rows.map((row) => ({ ...row }))}
          pageSize={isWallet || isCard ? 15 : 10}
          maxHeight={isWallet || isCard ? "calc(100vh - 16rem)" : "calc(100vh - 25rem)"}
          searchKeys={["cliente", "titulo", "status", "prioridade"]}
          columns={[
            { key: "cliente", header: "Origem", cell: (r) => <span className="font-medium">{r.cliente}</span> },
            { key: "titulo", header: "Descrição", cell: (r) => r.titulo },
            { key: "status", header: "Status", cell: (r) => r.status },
            { key: "prioridade", header: "Prioridade", cell: (r) => <span className={r.prioridade === "Crítica" ? "font-semibold text-destructive" : r.prioridade === "Alta" ? "font-semibold text-warning-foreground" : ""}>{r.prioridade}</span> },
            { key: "valor", header: "Valor/Prazo", cell: (r) => <strong>{r.valor}</strong> },
            { key: "acao", header: "", className: "text-right", cell: (r) => <Button variant="ghost" size="sm" onClick={() => setConfirmar(r.titulo)}>Resolver</Button> },
          ]}
        />
      </div>

      <ModalForm open={modal} onOpenChange={setModal} title={config.action} successMessage="Registro salvo" onSave={async () => {}}>
        <div className="grid gap-3 sm:grid-cols-2">
          <div><Label>{isWallet ? "Banco/carteira" : isCard ? "Adquirente" : "Responsável"}</Label><Input placeholder={isWallet ? "Ex.: Itaú PJ" : isCard ? "Ex.: Cielo" : "Nome ou equipe"} /></div>
          <div><Label>{isWallet ? "Tipo" : isCard ? "Bandeira/operação" : "Prazo"}</Label><Input type={isWallet || isCard ? "text" : "date"} /></div>
          <div><Label>Status</Label><Select defaultValue="ativo"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="ativo">Ativo</SelectItem><SelectItem value="pendente">Pendente</SelectItem><SelectItem value="revisao">Revisão</SelectItem></SelectContent></Select></div>
          <div><Label>Valor</Label><Input type="number" /></div>
          <div className="sm:col-span-2"><Label>Descrição</Label><Input placeholder="Detalhe a solicitação" /></div>
        </div>
      </ModalForm>

      <ConfirmDialog open={!!confirmar} onOpenChange={(v) => !v && setConfirmar(null)} title="Confirmar atualização" description={`Deseja atualizar ${confirmar ?? "este item"}?`} confirmText="Confirmar" successMessage="Item atualizado" onConfirm={async () => {}} />
    </FinanceiroShell>
  );
}
