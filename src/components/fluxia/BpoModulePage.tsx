import { useState } from "react";
import { PageHeader } from "@/components/fluxia/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ModalForm } from "@/components/fluxia/ModalForm";
import { ConfirmDialog } from "@/components/fluxia/ConfirmDialog";
import { DataTable } from "@/components/fluxia/DataTable";
import { ButtonWithLoading } from "@/components/fluxia/ButtonWithLoading";
import { brl, sleep } from "@/lib/format";
import { toast } from "sonner";
import {
  AlertTriangle, BarChart3, CheckCircle2, Clock3, Download, FileCheck2, FilePlus2,
  FileSignature, FileText, Folder, GitCompareArrows, Landmark, ListChecks, ListTodo,
  MessageSquare, Plus, ReceiptText, Repeat, Search, Settings, ShieldCheck, TrendingUp,
  UploadCloud, WalletCards, Workflow, Building2, Send, CalendarClock, UserRoundCheck,
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  AreaChart, Area, PieChart, Pie, Cell, LineChart, Line,
} from "recharts";

export type BpoKind = "lancamentos" | "conciliacao" | "documentos" | "relatorios" | "tarefas" | "analise" | "comunicacao" | "honorarios" | "configuracoes";

type ModalKind = "lancamento" | "match" | "documento" | "relatorio" | "tarefa" | "analise" | "honorario" | "regra" | "mensagem" | null;

const oklch = {
  green: "oklch(0.58 0.16 152)",
  red: "oklch(0.58 0.21 27)",
  yellow: "oklch(0.76 0.16 75)",
  blue: "oklch(0.62 0.14 235)",
};

const ledgerRows = [
  { cliente: "Tech Solutions", origem: "Itaú PJ", tipo: "Receita", valor: brl(4280), categoria: "Vendas", status: "Classificado" },
  { cliente: "Studio Bella", origem: "Bradesco", tipo: "Despesa", valor: brl(980), categoria: "Fornecedor", status: "Revisar" },
  { cliente: "Mercado Bom Preço", origem: "Caixa", tipo: "Despesa", valor: brl(1640), categoria: "Estoque", status: "Pendente" },
  { cliente: "Padaria Pão Quente", origem: "Itaú PJ", tipo: "Receita", valor: brl(2200), categoria: "PDV", status: "Classificado" },
];

const docs = [
  { nome: "Extrato Itaú Maio.pdf", tipo: "Extrato", cliente: "Tech Solutions", status: "Validado", prazo: "Hoje" },
  { nome: "XML NF-e 1044.xml", tipo: "XML", cliente: "Mercado Bom Preço", status: "Importado", prazo: "24/05" },
  { nome: "Comprovante aluguel.pdf", tipo: "Comprovante", cliente: "Studio Bella", status: "Pendente análise", prazo: "Vencido" },
  { nome: "Relatório cartão.xlsx", tipo: "Cartão", cliente: "Padaria Pão Quente", status: "Conciliado", prazo: "25/05" },
];

const conciliacaoExtrato = [
  { id: "E-01", data: "24/05", desc: "PIX recebido", valor: brl(1280), status: "Match sugerido" },
  { id: "E-02", data: "24/05", desc: "Tarifa banco", valor: brl(42), status: "Sem par" },
  { id: "E-03", data: "23/05", desc: "Cartão crédito", valor: brl(3920), status: "Conferir taxa" },
  { id: "E-04", data: "22/05", desc: "Fornecedor Alpha", valor: brl(860), status: "Match sugerido" },
];
const conciliacaoSistema = [
  { id: "S-11", data: "24/05", desc: "Receita PDV", valor: brl(1280), status: "Aguardando" },
  { id: "S-12", data: "23/05", desc: "Recebíveis cartão", valor: brl(3948), status: "Divergente" },
  { id: "S-13", data: "22/05", desc: "Compra Alpha", valor: brl(860), status: "Aguardando" },
  { id: "S-14", data: "21/05", desc: "Honorário BPO", valor: brl(2400), status: "Pago" },
];

const fechamentoTasks = [
  { cliente: "Tech Solutions", etapa: "Classificação", progresso: 92, responsavel: "Marina", status: "Revisão final" },
  { cliente: "Studio Bella", etapa: "Documentos", progresso: 48, responsavel: "Lucas", status: "Aguardando cliente" },
  { cliente: "Mercado Bom Preço", etapa: "Conciliação", progresso: 63, responsavel: "Patrícia", status: "Divergências" },
  { cliente: "Padaria Pão Quente", etapa: "Relatório", progresso: 78, responsavel: "Rafael", status: "Em montagem" },
];

const fluxoAnalise = [
  { mes: "Jan", saldo: 38000, receita: 72000, despesa: 51000 },
  { mes: "Fev", saldo: 42000, receita: 76000, despesa: 54000 },
  { mes: "Mar", saldo: 36500, receita: 73000, despesa: 59000 },
  { mes: "Abr", saldo: 49500, receita: 85000, despesa: 57000 },
  { mes: "Mai", saldo: 58400, receita: 92000, despesa: 61000 },
];
const honorariosData = [
  { cliente: "Tech Solutions", contrato: brl(2400), status: "Em dia", vencimento: "05/06" },
  { cliente: "Studio Bella", contrato: brl(1800), status: "A vencer", vencimento: "02/06" },
  { cliente: "Mercado Bom Preço", contrato: brl(2200), status: "Vencido", vencimento: "18/05" },
  { cliente: "Padaria Pão Quente", contrato: brl(1600), status: "Em dia", vencimento: "10/06" },
];

function Metric({ label, value, hint, tone = "default" }: { label: string; value: string; hint?: string; tone?: "default" | "primary" | "warning" | "danger" }) {
  const toneClass = tone === "primary" ? "bg-primary-soft border-primary/25" : tone === "warning" ? "bg-warning/10 border-warning/35" : tone === "danger" ? "bg-destructive/10 border-destructive/35" : "bg-card";
  return <Card className={`rounded-2xl border p-4 shadow-soft ${toneClass}`}><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>{hint && <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>}</Card>;
}

function ModalBody({ modal }: { modal: ModalKind }) {
  if (modal === "match") return <div className="grid gap-3 sm:grid-cols-2"><div><Label>Extrato</Label><Input defaultValue="E-01 • PIX recebido" /></div><div><Label>Lançamento do sistema</Label><Input defaultValue="S-11 • Receita PDV" /></div><div><Label>Diferença tolerada</Label><Input defaultValue="R$ 0,00" /></div><div><Label>Regra futura</Label><Select defaultValue="criar"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="criar">Criar regra automática</SelectItem><SelectItem value="nao">Não criar regra</SelectItem></SelectContent></Select></div></div>;
  if (modal === "documento") return <div className="grid gap-3 sm:grid-cols-2"><div><Label>Cliente</Label><Input placeholder="Cliente" /></div><div><Label>Tipo de arquivo</Label><Select><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent><SelectItem value="xml">XML</SelectItem><SelectItem value="extrato">Extrato</SelectItem><SelectItem value="comprovante">Comprovante</SelectItem></SelectContent></Select></div><div className="sm:col-span-2"><Label>Arquivo</Label><Input type="file" /></div><div className="sm:col-span-2"><Label>Observação</Label><Textarea placeholder="Instrução para o cliente ou analista" /></div></div>;
  if (modal === "relatorio") return <div className="grid gap-3 sm:grid-cols-2"><div><Label>Tipo</Label><Select><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent><SelectItem value="fechamento">Fechamento mensal</SelectItem><SelectItem value="dre">DRE simplificado</SelectItem><SelectItem value="pendencias">Pendências</SelectItem></SelectContent></Select></div><div><Label>Formato</Label><Select><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent><SelectItem value="pdf">PDF</SelectItem><SelectItem value="xlsx">Planilha</SelectItem><SelectItem value="link">Link dashboard</SelectItem></SelectContent></Select></div><div><Label>Competência</Label><Input type="month" /></div><div><Label>Cliente</Label><Input placeholder="Todos ou cliente específico" /></div></div>;
  if (modal === "tarefa") return <div className="grid gap-3 sm:grid-cols-2"><div className="sm:col-span-2"><Label>Tarefa</Label><Input placeholder="Ex.: Revisar conciliação bancária" /></div><div><Label>Cliente</Label><Input /></div><div><Label>Responsável</Label><Input /></div><div><Label>Prazo</Label><Input type="date" /></div><div><Label>Prioridade</Label><Select><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent><SelectItem value="alta">Alta</SelectItem><SelectItem value="media">Média</SelectItem><SelectItem value="baixa">Baixa</SelectItem></SelectContent></Select></div></div>;
  if (modal === "honorario") return <div className="grid gap-3 sm:grid-cols-2"><div><Label>Cliente</Label><Input /></div><div><Label>Valor mensal</Label><Input type="number" /></div><div><Label>Vencimento</Label><Input type="date" /></div><div><Label>Status</Label><Select><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent><SelectItem value="em-dia">Em dia</SelectItem><SelectItem value="a-vencer">A vencer</SelectItem><SelectItem value="vencido">Vencido</SelectItem></SelectContent></Select></div><div className="sm:col-span-2"><Label>Contrato/escopo</Label><Textarea /></div></div>;
  if (modal === "regra") return <div className="grid gap-3 sm:grid-cols-2"><div><Label>Nome da regra</Label><Input /></div><div><Label>Módulo</Label><Select><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent><SelectItem value="sla">SLA</SelectItem><SelectItem value="permissao">Permissão</SelectItem><SelectItem value="template">Template</SelectItem><SelectItem value="automacao">Automação</SelectItem></SelectContent></Select></div><div className="sm:col-span-2"><Label>Descrição</Label><Textarea /></div></div>;
  return <div className="grid gap-3 sm:grid-cols-2"><div><Label>Cliente</Label><Input /></div><div><Label>Valor</Label><Input type="number" /></div><div><Label>Categoria</Label><Input /></div><div><Label>Data</Label><Input type="date" /></div><div className="sm:col-span-2"><Label>Descrição</Label><Textarea /></div></div>;
}

export function BpoModulePage({ kind }: { kind: BpoKind }) {
  const [modal, setModal] = useState<ModalKind>(null);
  const [confirmar, setConfirmar] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [clienteRelatorio, setClienteRelatorio] = useState("Tech Solutions");
  const run = async (label: string) => { setLoading(true); await sleep(450); setLoading(false); toast.success(label); };

  if (kind === "lancamentos") {
    return <><PageHeader title="Lançamentos BPO" description="Entrada rápida, classificação e auditoria de receitas/despesas por cliente." action={<Button size="sm" onClick={() => setModal("lancamento")}><Plus className="mr-2 h-4 w-4" />Novo lançamento</Button>} />
      <div className="mt-2 min-h-0">
        <DataTable data={ledgerRows} pageSize={12} maxHeight="calc(100vh - 17rem)" searchKeys={["cliente", "origem", "tipo", "categoria", "status"]} columns={[{ key: "cliente", header: "Cliente", cell: (r) => <strong>{r.cliente}</strong> }, { key: "origem", header: "Origem", cell: (r) => r.origem }, { key: "tipo", header: "Tipo", cell: (r) => r.tipo }, { key: "valor", header: "Valor", cell: (r) => <strong>{r.valor}</strong> }, { key: "categoria", header: "Categoria", cell: (r) => r.categoria }, { key: "status", header: "Status", cell: (r) => r.status }, { key: "acao", header: "", className: "text-right", cell: (r) => <Button variant="ghost" size="sm" onClick={() => setConfirmar(r.cliente)}>Aprovar</Button> }]} />
      </div>
      <ModalForm open={!!modal} onOpenChange={(v) => !v && setModal(null)} title="Novo lançamento BPO" successMessage="Lançamento criado" onSave={async () => {}}><ModalBody modal={modal} /></ModalForm><ConfirmDialog open={!!confirmar} onOpenChange={(v) => !v && setConfirmar(null)} title="Aprovar lançamento" description={`Confirma a aprovação de ${confirmar ?? "este item"}?`} onConfirm={async () => {}} /></>;
  }

  if (kind === "conciliacao") {
    return <><PageHeader title="Conciliação BPO" description="Comparação lado a lado entre extrato bancário e lançamentos do sistema." action={<Button size="sm" onClick={() => setModal("match")}><GitCompareArrows className="mr-2 h-4 w-4" />Novo match</Button>} />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4"><Metric label="Match automático" value="72%" tone="primary" /><Metric label="Sem par" value="9" tone="warning" /><Metric label="Diferença total" value="R$ 428,00" tone="danger" /><Metric label="Contas importadas" value="11" /></div>
      <div className="mt-5 grid h-[calc(100vh-24rem)] min-h-[420px] gap-4 overflow-hidden xl:grid-cols-2"><Card className="flex min-h-0 flex-col rounded-2xl shadow-soft"><div className="border-b p-4"><h3 className="font-semibold">Extrato bancário</h3><p className="text-xs text-muted-foreground">Movimentações vindas do banco.</p></div><div className="custom-scrollbar flex-1 overflow-y-auto p-3">{conciliacaoExtrato.map((r) => <div key={r.id} className="mb-2 rounded-2xl border p-3"><div className="flex justify-between gap-2"><strong>{r.desc}</strong><span>{r.valor}</span></div><p className="text-xs text-muted-foreground">{r.data} • {r.status}</p><Button variant="outline" size="sm" className="mt-2" onClick={() => setModal("match")}>Aplicar match</Button></div>)}</div></Card><Card className="flex min-h-0 flex-col rounded-2xl shadow-soft"><div className="border-b p-4"><h3 className="font-semibold">Sistema Fluxia</h3><p className="text-xs text-muted-foreground">Lançamentos aguardando conciliação.</p></div><div className="custom-scrollbar flex-1 overflow-y-auto p-3">{conciliacaoSistema.map((r) => <div key={r.id} className="mb-2 rounded-2xl border p-3"><div className="flex justify-between gap-2"><strong>{r.desc}</strong><span>{r.valor}</span></div><p className="text-xs text-muted-foreground">{r.data} • {r.status}</p><Button variant="ghost" size="sm" className="mt-2" onClick={() => setConfirmar(r.id)}>Ignorar/justificar</Button></div>)}</div></Card></div>
      <ModalForm open={!!modal} onOpenChange={(v) => !v && setModal(null)} title="Conciliação por match" successMessage="Match registrado" onSave={async () => {}}><ModalBody modal={modal} /></ModalForm><ConfirmDialog open={!!confirmar} onOpenChange={(v) => !v && setConfirmar(null)} title="Justificar divergência" description="Registrar justificativa para item sem correspondência?" onConfirm={async () => {}} /></>;
  }

  if (kind === "documentos") {
    return <><PageHeader title="Documentos BPO" description="Repositório de anexos, XMLs, extratos, comprovantes e arquivos de fechamento." action={<Button size="sm" onClick={() => setModal("documento")}><UploadCloud className="mr-2 h-4 w-4" />Enviar arquivo</Button>} />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4"><Metric label="Arquivos recebidos" value="64" tone="primary" /><Metric label="XML importados" value="21" /><Metric label="Pendentes" value="18" tone="warning" /><Metric label="Vencidos" value="6" tone="danger" /></div>
      <div className="mt-5 grid gap-4 xl:grid-cols-[1fr_340px]"><Card className="rounded-2xl p-5 shadow-soft"><div className="mb-4 flex items-center justify-between"><h3 className="font-semibold">Repositório visual</h3><div className="relative max-w-xs"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input className="pl-9" placeholder="Buscar arquivo" /></div></div><div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">{docs.map((d) => <div key={d.nome} className="rounded-2xl border p-4"><FileCheck2 className="mb-3 h-5 w-5 text-primary" /><p className="font-semibold">{d.nome}</p><p className="mt-1 text-xs text-muted-foreground">{d.cliente} • {d.tipo}</p><div className="mt-3 flex justify-between text-xs"><span>{d.status}</span><strong>{d.prazo}</strong></div></div>)}</div></Card><Card className="rounded-2xl p-5 shadow-soft"><h3 className="font-semibold">Fila de solicitação</h3><div className="mt-4 space-y-3">{["Extrato bancário", "Notas de fornecedor", "Comprovante de pagamento", "Relatório de cartão"].map((d, i) => <div key={d} className="rounded-xl border p-3"><strong>{d}</strong><p className="text-xs text-muted-foreground">{[5, 8, 3, 2][i]} cliente(s) pendente(s)</p></div>)}</div><Button className="mt-4 w-full" onClick={() => setModal("documento")}><FilePlus2 className="mr-2 h-4 w-4" />Solicitar documento</Button></Card></div>
      <ModalForm open={!!modal} onOpenChange={(v) => !v && setModal(null)} title="Adicionar documento" successMessage="Documento registrado" onSave={async () => {}}><ModalBody modal={modal} /></ModalForm></>;
  }

  if (kind === "relatorios") {
    const reportCards = ["Fechamento mensal", "DRE simplificado", "Pendências", "Conciliação", "Honorários", "Carteira BPO"];
    return <><PageHeader title="Relatórios Multi-Cliente" description="Selecione um cliente da carteira para isolar contexto, competência e relatórios gerados." action={<Button size="sm" onClick={() => setModal("relatorio")}><Download className="mr-2 h-4 w-4" />Gerar relatório</Button>} />
      <Card className="mb-4 rounded-2xl p-4 shadow-soft"><div className="grid gap-3 md:grid-cols-[260px_1fr_auto] md:items-end"><div><Label>Cliente da carteira</Label><Select value={clienteRelatorio} onValueChange={setClienteRelatorio}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["Tech Solutions", "Studio Bella", "Mercado Bom Preço", "Padaria Pão Quente"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div><div><Label>Competência</Label><Input type="month" defaultValue="2026-05" /></div><Button variant="outline" onClick={() => toast.success(`Contexto carregado para ${clienteRelatorio}`)}>Carregar contexto</Button></div></Card>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4"><Metric label="Gerados no mês" value="22" tone="primary" /><Metric label="A revisar" value="5" tone="warning" /><Metric label="Exportações" value="31" /><Metric label="Cliente selecionado" value={clienteRelatorio} /></div>
      <div className="mt-5 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">{reportCards.map((r) => <Card key={r} className="rounded-2xl p-5 shadow-soft"><FileText className="mb-3 h-5 w-5 text-primary" /><h3 className="font-semibold">{r}</h3><p className="mt-1 text-sm text-muted-foreground">Relatório gerado com dados isolados de {clienteRelatorio}, período, status e centro de custo.</p><div className="mt-4 flex gap-2"><Button variant="outline" size="sm" onClick={() => setModal("relatorio")}>Configurar</Button><Button size="sm" onClick={() => toast.success(`${r} exportado para ${clienteRelatorio}`)}>Exportar</Button></div></Card>)}</div>
      <ModalForm open={!!modal} onOpenChange={(v) => !v && setModal(null)} title="Gerar relatório BPO" successMessage="Relatório gerado" onSave={async () => {}}><ModalBody modal={modal} /></ModalForm></>;
  }

  if (kind === "tarefas") {
    const columns = ["A fazer", "Em execução", "Revisão", "Concluído"];
    return <><PageHeader title="Tarefas BPO" description="Checklist operacional de fechamento financeiro por cliente." action={<Button size="sm" onClick={() => setModal("tarefa")}><Plus className="mr-2 h-4 w-4" />Nova tarefa</Button>} />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4"><Metric label="Hoje" value="14" /><Metric label="Atrasadas" value="4" tone="danger" /><Metric label="Recorrentes" value="23" /><Metric label="Concluídas" value="68%" tone="primary" /></div>
      <div className="mt-5 grid h-[calc(100vh-25rem)] min-h-[420px] gap-3 overflow-x-auto pb-2 xl:grid-cols-4">{columns.map((col, idx) => <Card key={col} className="min-w-[250px] overflow-hidden rounded-2xl shadow-soft"><div className="border-b p-3"><h3 className="font-semibold">{col}</h3><p className="text-xs text-muted-foreground">{idx + 2} itens</p></div><div className="custom-scrollbar max-h-full space-y-2 overflow-y-auto p-3">{fechamentoTasks.slice(0, idx + 1).map((t) => <div key={`${col}-${t.cliente}`} className="rounded-xl border p-3"><strong>{t.cliente}</strong><p className="text-xs text-muted-foreground">{t.etapa} • {t.responsavel}</p><p className="mt-2 text-xs text-muted-foreground">Status operacional: {t.status}</p><Button variant="ghost" size="sm" className="mt-2" onClick={() => setConfirmar(t.cliente)}>Concluir</Button></div>)}</div></Card>)}</div>
      <ModalForm open={!!modal} onOpenChange={(v) => !v && setModal(null)} title="Nova tarefa BPO" successMessage="Tarefa criada" onSave={async () => {}}><ModalBody modal={modal} /></ModalForm><ConfirmDialog open={!!confirmar} onOpenChange={(v) => !v && setConfirmar(null)} title="Concluir tarefa" description="Confirma conclusão da tarefa selecionada?" onConfirm={async () => {}} /></>;
  }

  if (kind === "analise") {
    return <><PageHeader title="Análise BPO" description="Performance financeira, DRE simplificado, evolução de saldos e alertas por cliente." action={<Button size="sm" onClick={() => setModal("analise")}><TrendingUp className="mr-2 h-4 w-4" />Nova análise</Button>} />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4"><Metric label="Margem média" value="18,4%" tone="primary" /><Metric label="Clientes em risco" value="3" tone="danger" /><Metric label="Economia indicada" value="R$ 12,8k" /><Metric label="Saldo médio" value="R$ 58,4k" /></div>
      <div className="mt-5 grid gap-4 xl:grid-cols-[1.15fr_.85fr]"><Card className="rounded-2xl p-5 shadow-soft"><h3 className="font-semibold">Evolução de saldos</h3><div className="h-72"><ResponsiveContainer width="100%" height="100%"><AreaChart data={fluxoAnalise}><CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.005 145)" /><XAxis dataKey="mes" /><YAxis tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} /><Tooltip formatter={(v: number) => brl(v)} contentStyle={{ borderRadius: 12 }} /><Area dataKey="saldo" stroke={oklch.green} fill="oklch(0.58 0.16 152 / .16)" /></AreaChart></ResponsiveContainer></div></Card><Card className="rounded-2xl p-5 shadow-soft"><h3 className="font-semibold">DRE simplificado</h3><div className="mt-4 space-y-3 text-sm">{[["Receita", brl(92000), "text-primary"], ["Custos", `-${brl(61000)}`, "text-destructive"], ["Lucro bruto", brl(31000), ""], ["Despesas", `-${brl(15400)}`, "text-destructive"], ["Resultado", brl(15600), "text-primary"]].map(([a,b,c]) => <div key={a} className="flex justify-between rounded-xl bg-muted/30 p-3"><span>{a}</span><strong className={c}>{b}</strong></div>)}</div></Card></div>
      <div className="mt-4 grid gap-4 xl:grid-cols-2"><Card className="rounded-2xl p-5 shadow-soft"><h3 className="font-semibold">Receita x despesa</h3><div className="h-56"><ResponsiveContainer width="100%" height="100%"><BarChart data={fluxoAnalise}><CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.005 145)" /><XAxis dataKey="mes" /><YAxis tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} /><Tooltip formatter={(v: number) => brl(v)} contentStyle={{ borderRadius: 12 }} /><Bar dataKey="receita" fill={oklch.green} radius={[8,8,0,0]} /><Bar dataKey="despesa" fill={oklch.red} radius={[8,8,0,0]} /></BarChart></ResponsiveContainer></div></Card><Card className="rounded-2xl p-5 shadow-soft"><h3 className="font-semibold">Insights</h3><div className="mt-4 space-y-3">{["Studio Bella precisa reforçar envio de documentos.", "Mercado Bom Preço tem pressão em margem por fornecedor.", "Tech Solutions possui caixa suficiente para 32 dias."].map((i) => <div key={i} className="rounded-xl border p-3 text-sm">{i}</div>)}</div></Card></div>
      <ModalForm open={!!modal} onOpenChange={(v) => !v && setModal(null)} title="Nova análise" successMessage="Análise salva" onSave={async () => {}}><ModalBody modal={modal} /></ModalForm></>;
  }

  if (kind === "honorarios") {
    return <><PageHeader title="Honorários BPO" description="Faturamento do próprio BPO, contratos, status de cobrança e inadimplência dos clientes." action={<Button size="sm" onClick={() => setModal("honorario")}><FileSignature className="mr-2 h-4 w-4" />Novo honorário</Button>} />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4"><Metric label="MRR BPO" value="R$ 13.230" tone="primary" /><Metric label="A receber" value="R$ 4.600" tone="warning" /><Metric label="Vencidos" value="R$ 2.200" tone="danger" /><Metric label="Contratos ativos" value="7" /></div>
      <div className="mt-5 grid gap-4 xl:grid-cols-[1fr_360px]"><DataTable data={honorariosData} searchKeys={["cliente", "status"]} pageSize={10} maxHeight="calc(100vh - 25rem)" columns={[{ key: "cliente", header: "Cliente", cell: (r) => <strong>{r.cliente}</strong> }, { key: "contrato", header: "Contrato", cell: (r) => r.contrato }, { key: "vencimento", header: "Vencimento", cell: (r) => r.vencimento }, { key: "status", header: "Status", cell: (r) => <span className={r.status === "Vencido" ? "font-semibold text-destructive" : "font-semibold text-primary"}>{r.status}</span> }, { key: "acao", header: "", className: "text-right", cell: (r) => <Button variant="ghost" size="sm" onClick={() => setConfirmar(r.cliente)}>Cobrar</Button> }]} /><Card className="rounded-2xl p-5 shadow-soft"><h3 className="font-semibold">Status da carteira</h3><div className="h-60"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={[{ name: "Em dia", value: 62 }, { name: "A vencer", value: 25 }, { name: "Vencido", value: 13 }]} dataKey="value" innerRadius={62} outerRadius={92} paddingAngle={3}>{[oklch.green, oklch.yellow, oklch.red].map((c) => <Cell key={c} fill={c} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></div></Card></div>
      <ModalForm open={!!modal} onOpenChange={(v) => !v && setModal(null)} title="Novo honorário" successMessage="Honorário salvo" onSave={async () => {}}><ModalBody modal={modal} /></ModalForm><ConfirmDialog open={!!confirmar} onOpenChange={(v) => !v && setConfirmar(null)} title="Enviar cobrança" description={`Enviar cobrança para ${confirmar ?? "cliente"}?`} onConfirm={async () => {}} /></>;
  }

  if (kind === "configuracoes") {
    const regras = ["SLA por plano", "Templates", "Permissões BPO", "Rotinas", "Checklist", "Alertas automáticos"];
    return <><PageHeader title="Configurações BPO" description="Regras operacionais do BPO: SLA, templates, permissões, automações e fechamento." action={<Button size="sm" onClick={() => setModal("regra")}><Settings className="mr-2 h-4 w-4" />Nova regra</Button>} />
      <div className="grid gap-4 xl:grid-cols-[300px_1fr]"><Card className="rounded-2xl p-5 shadow-soft"><h3 className="font-semibold">Menu BPO</h3><div className="mt-4 space-y-2">{regras.map((r, i) => <button key={r} className={`w-full rounded-xl border p-3 text-left text-sm ${i === 0 ? "border-primary bg-primary-soft text-primary" : "hover:bg-muted/40"}`}>{r}</button>)}</div></Card><div className="grid gap-4 md:grid-cols-2"><Metric label="SLA padrão" value="48h" hint="Resposta por cliente" /><Metric label="Templates" value="7" hint="WhatsApp, e-mail e relatório" /><Metric label="Automações" value="12" hint="Lembretes e fechamento" /><Metric label="Perfis BPO" value="4" hint="Analista, gestor, cliente, admin" /><Card className="md:col-span-2 rounded-2xl p-5 shadow-soft"><h3 className="font-semibold">Matriz de permissões BPO</h3><div className="mt-4 grid gap-2 md:grid-cols-4">{["Analista", "Gestor BPO", "Cliente", "Admin"].map((p) => <div key={p} className="rounded-xl border p-3"><ShieldCheck className="mb-2 h-4 w-4 text-primary" /><strong>{p}</strong><p className="text-xs text-muted-foreground">Ações por módulo, aprovação e auditoria.</p></div>)}</div></Card></div></div>
      <ModalForm open={!!modal} onOpenChange={(v) => !v && setModal(null)} title="Nova regra BPO" successMessage="Regra salva" onSave={async () => {}}><ModalBody modal={modal} /></ModalForm></>;
  }

  return <PageHeader title="BPO" description="Módulo BPO" />;
}
