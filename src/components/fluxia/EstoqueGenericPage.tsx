import { useState } from "react";
import { PageHeader } from "@/components/fluxia/PageHeader";
import { StatCard } from "@/components/fluxia/StatCard";
import { EstoqueShell } from "@/components/fluxia/ModuleShells";
import { DataTable } from "@/components/fluxia/DataTable";
import { ModalForm } from "@/components/fluxia/ModalForm";
import { ConfirmDialog } from "@/components/fluxia/ConfirmDialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStore } from "@/mock/store";
import { brl } from "@/lib/format";
import { AlertTriangle, ArrowLeftRight, BarChart3, CheckCircle2, MapPin, Package, Plus, RefreshCw, TrendingDown, Truck, Warehouse, ScanSearch, Route, ClipboardCheck, ShieldAlert } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, AreaChart, Area } from "recharts";

export type EstoqueGenericKind = "consulta" | "locais" | "reposicao" | "transferencias" | "perdas";

const cfgs = {
  consulta: { title: "Consulta de estoque", description: "Busca rápida por disponibilidade, endereço, status e valor em estoque.", action: "" },
  locais: { title: "Locais de estoque", description: "Gestão de depósitos, corredores, prateleiras, capacidade e endereçamento.", action: "Cadastrar local" },
  reposicao: { title: "Reposição", description: "Fila de compra sugerida por giro, mínimo, ruptura e fornecedor preferencial.", action: "Criar reposição" },
  transferencias: { title: "Transferências internas", description: "Movimentações entre depósito, loja, quarentena e área de separação.", action: "Nova transferência" },
  perdas: { title: "Perdas e avarias", description: "Controle de quebras, vencimentos, extravios, divergências e recuperação de perdas.", action: "Registrar perda" },
} as const;

const locais = [
  { local: "Depósito A", tipo: "Principal", capacidade: 82, itens: 1280, responsavel: "Carlos Silva", status: "Operacional", zona: "Rua 01 a 06" },
  { local: "Loja Centro", tipo: "PDV", capacidade: 61, itens: 420, responsavel: "Marina Lopes", status: "Operacional", zona: "Balcão + vitrine" },
  { local: "Quarentena", tipo: "Conferência", capacidade: 34, itens: 62, responsavel: "Ana Souza", status: "Revisão", zona: "Recebimento" },
  { local: "Prateleira B2", tipo: "Endereço", capacidade: 94, itens: 210, responsavel: "Carlos Silva", status: "Lotado", zona: "Corredor B" },
];
const transferRows = [
  { codigo: "TR-204", produto: "Mouse Wireless", origem: "Loja Centro", destino: "Depósito A", qtd: 8, status: "Em separação", prazo: "Hoje" },
  { codigo: "TR-203", produto: "Caderno A4 96f", origem: "Depósito A", destino: "PDV 01", qtd: 24, status: "Concluída", prazo: "Ontem" },
  { codigo: "TR-202", produto: "Caneta Gel azul", origem: "Depósito A", destino: "Loja Centro", qtd: 40, status: "Aguardando conferência", prazo: "Amanhã" },
  { codigo: "TR-201", produto: "Garrafa Térmica 500ml", origem: "Quarentena", destino: "Depósito A", qtd: 6, status: "Conferência", prazo: "Hoje" },
];
const lossChart = [
  { motivo: "Avaria", valor: 820, eventos: 4 },
  { motivo: "Vencimento", valor: 540, eventos: 2 },
  { motivo: "Extravio", valor: 310, eventos: 1 },
  { motivo: "Divergência", valor: 690, eventos: 4 },
];
const giro = [
  { mes: "Jan", giro: 71, cobertura: 28 }, { mes: "Fev", giro: 64, cobertura: 31 }, { mes: "Mar", giro: 78, cobertura: 24 }, { mes: "Abr", giro: 83, cobertura: 21 }, { mes: "Mai", giro: 89, cobertura: 18 },
];
const COLORS = ["oklch(0.58 0.16 152)", "oklch(0.58 0.21 27)", "oklch(0.76 0.16 75)", "oklch(0.62 0.14 235)"];

function ActionForm({ kind }: { kind: EstoqueGenericKind }) {
  const isLocal = kind === "locais";
  const isTransfer = kind === "transferencias";
  const isLoss = kind === "perdas";
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div><Label>{isLocal ? "Nome do local" : "Produto"}</Label><Input placeholder={isLocal ? "Ex.: Prateleira C4" : "Buscar produto"} /></div>
      <div><Label>{isTransfer ? "Quantidade" : isLoss ? "Valor estimado" : isLocal ? "Capacidade" : "Quantidade sugerida"}</Label><Input type="number" /></div>
      {isTransfer && <><div><Label>Origem</Label><Input placeholder="Depósito A" /></div><div><Label>Destino</Label><Input placeholder="Loja Centro" /></div></>}
      {isLocal && <><div><Label>Tipo de local</Label><Select defaultValue="deposito"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="deposito">Depósito</SelectItem><SelectItem value="pdv">PDV</SelectItem><SelectItem value="quarentena">Quarentena</SelectItem><SelectItem value="endereco">Endereço físico</SelectItem></SelectContent></Select></div><div><Label>Responsável</Label><Input /></div></>}
      {kind === "reposicao" && <><div><Label>Fornecedor preferencial</Label><Input /></div><div><Label>Previsão de chegada</Label><Input type="date" /></div></>}
      {isLoss && <><div><Label>Motivo</Label><Select defaultValue="avaria"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="avaria">Avaria</SelectItem><SelectItem value="vencimento">Vencimento</SelectItem><SelectItem value="extravio">Extravio</SelectItem><SelectItem value="divergencia">Divergência</SelectItem></SelectContent></Select></div><div><Label>Responsável</Label><Input /></div></>}
      <div className="sm:col-span-2"><Label>Observação</Label><Input placeholder="Detalhe a operação" /></div>
    </div>
  );
}

export function EstoqueGenericPage({ kind }: { kind: EstoqueGenericKind }) {
  const { s } = useStore();
  const [modal, setModal] = useState(false);
  const [confirmar, setConfirmar] = useState<string | null>(null);
  const cfg = cfgs[kind];
  const baixo = s.produtos.filter((p) => p.estoque > 0 && p.estoque <= p.estoqueMinimo).length;
  const semEstoque = s.produtos.filter((p) => p.estoque === 0).length;
  const rows = s.produtos.map((p) => ({ produto: p.nome, codigo: p.codigo, categoria: p.categoria, local: p.categoria === "Eletrônicos" ? "Depósito A" : p.categoria === "Vestuário" ? "Loja Centro" : "Prateleira B2", estoque: p.estoque, minimo: p.estoqueMinimo, valor: brl(p.custo * p.estoque), status: p.estoque === 0 ? "Sem estoque" : p.estoque <= p.estoqueMinimo ? "Reposição" : "Disponível" }));
  const reposicao = rows.filter((r) => r.status !== "Disponível").map((r) => ({ ...r, sugerido: Math.max(10, r.minimo * 2 - r.estoque), fornecedor: r.categoria === "Eletrônicos" ? "Vision Distribuidora" : "Atacado Norte", prioridade: r.status === "Sem estoque" ? "Crítica" : "Alta" }));

  if (kind === "consulta") {
    return (
      <EstoqueShell>
        <PageHeader title={cfg.title} description={cfg.description} />
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Produtos ativos" value={s.produtos.length} icon={Package} />
          <StatCard title="Estoque baixo" value={baixo} icon={AlertTriangle} tone="warning" />
          <StatCard title="Sem estoque" value={semEstoque} icon={TrendingDown} tone="destructive" />
          <StatCard title="Locais rastreados" value="4" icon={Warehouse} />
        </div>
        <div className="mt-5">
          <DataTable data={rows} searchKeys={["produto", "codigo", "categoria", "local", "status"]} searchPlaceholder="Buscar produto, código, categoria, local ou status..." pageSize={12} maxHeight="calc(100vh - 27rem)" compact columns={[
            { key: "produto", header: "Produto", cell: (r) => <span className="font-medium">{r.produto}</span> },
            { key: "codigo", header: "Código", cell: (r) => r.codigo },
            { key: "categoria", header: "Categoria", cell: (r) => r.categoria },
            { key: "local", header: "Local", cell: (r) => r.local },
            { key: "estoque", header: "Estoque", cell: (r) => <strong>{r.estoque}</strong> },
            { key: "status", header: "Status", cell: (r) => <span className={r.status === "Sem estoque" ? "font-medium text-destructive" : r.status === "Reposição" ? "font-medium text-warning-foreground" : "text-primary"}>{r.status}</span> },
            { key: "valor", header: "Valor", cell: (r) => r.valor },
          ]} />
        </div>
      </EstoqueShell>
    );
  }

  if (kind === "locais") {
    return (
      <EstoqueShell>
        <PageHeader title={cfg.title} description={cfg.description} action={<Button size="sm" onClick={() => setModal(true)}><Plus className="mr-2 h-4 w-4" />{cfg.action}</Button>} />
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4"><StatCard title="Locais ativos" value="4" icon={MapPin} /><StatCard title="Capacidade média" value="68%" icon={Warehouse} /><StatCard title="Locais lotados" value="1" icon={AlertTriangle} tone="warning" /><StatCard title="Em revisão" value="1" icon={CheckCircle2} /></div>
        <div className="mt-5 grid gap-4 xl:grid-cols-[360px_1fr]">
          <Card className="rounded-2xl p-5 shadow-soft"><h3 className="font-semibold">Mapa de capacidade</h3><div className="mt-4 space-y-3">{locais.map((l) => <div key={l.local} className="rounded-xl border p-3"><div className="flex justify-between text-sm"><strong>{l.local}</strong><span>{l.capacidade}%</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${l.capacidade}%` }} /></div><p className="mt-2 text-xs text-muted-foreground">{l.tipo} • {l.zona}</p></div>)}</div></Card>
          <DataTable data={locais} searchKeys={["local", "tipo", "responsavel", "status", "zona"]} pageSize={10} maxHeight="calc(100vh - 27rem)" columns={[
            { key: "local", header: "Local", cell: (r) => <span className="font-medium">{r.local}</span> },
            { key: "tipo", header: "Tipo", cell: (r) => r.tipo },
            { key: "cap", header: "Cap.", cell: (r) => `${r.capacidade}%` },
            { key: "zona", header: "Zona", cell: (r) => r.zona },
            { key: "resp", header: "Responsável", cell: (r) => r.responsavel },
            { key: "status", header: "Status", cell: (r) => r.status },
            { key: "acao", header: "", className: "text-right", cell: (r) => <Button variant="ghost" size="sm" onClick={() => setConfirmar(r.local)}>Revisar</Button> },
          ]} />
        </div>
        <ModalForm open={modal} onOpenChange={setModal} title={cfg.action} successMessage="Local salvo" onSave={async () => {}}><ActionForm kind={kind} /></ModalForm>
        <ConfirmDialog open={!!confirmar} onOpenChange={(v) => !v && setConfirmar(null)} title="Revisar local" description={`Deseja revisar ${confirmar ?? "este local"}?`} successMessage="Local marcado para revisão" onConfirm={async () => {}} />
      </EstoqueShell>
    );
  }

  if (kind === "reposicao") {
    return (
      <EstoqueShell>
        <PageHeader title={cfg.title} description={cfg.description} action={<Button size="sm" onClick={() => setModal(true)}><RefreshCw className="mr-2 h-4 w-4" />{cfg.action}</Button>} />
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4"><StatCard title="Itens para repor" value={reposicao.length} icon={RefreshCw} tone="warning" /><StatCard title="Ruptura" value={semEstoque} icon={TrendingDown} tone="destructive" /><StatCard title="Compra sugerida" value={brl(6840)} icon={Package} /><StatCard title="Fornecedores" value="6" icon={Truck} /></div>
        <div className="mt-5 grid gap-4 xl:grid-cols-[1fr_320px]">
          <DataTable data={reposicao} searchKeys={["produto", "codigo", "fornecedor", "status", "prioridade"]} pageSize={10} maxHeight="calc(100vh - 28rem)" columns={[
            { key: "produto", header: "Produto", cell: (r) => <span className="font-medium">{r.produto}</span> },
            { key: "estoque", header: "Atual", cell: (r) => r.estoque },
            { key: "minimo", header: "Mínimo", cell: (r) => r.minimo },
            { key: "sug", header: "Sugerido", cell: (r) => <strong>{r.sugerido}</strong> },
            { key: "forn", header: "Fornecedor", cell: (r) => r.fornecedor },
            { key: "prio", header: "Prioridade", cell: (r) => <span className={r.prioridade === "Crítica" ? "font-semibold text-destructive" : "font-semibold text-warning-foreground"}>{r.prioridade}</span> },
            { key: "acao", header: "", className: "text-right", cell: (r) => <Button variant="ghost" size="sm" onClick={() => setConfirmar(r.produto)}>Gerar compra</Button> },
          ]} />
          <Card className="rounded-2xl p-5 shadow-soft"><h3 className="font-semibold">Giro e cobertura</h3><div className="mt-4 h-60"><ResponsiveContainer width="100%" height="100%"><AreaChart data={giro}><CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.005 145)" /><XAxis dataKey="mes" /><YAxis /><Tooltip contentStyle={{ borderRadius: 12 }} /><Area type="monotone" dataKey="giro" stroke="oklch(0.58 0.16 152)" fill="oklch(0.58 0.16 152 / .18)" name="Giro" /><Area type="monotone" dataKey="cobertura" stroke="oklch(0.58 0.21 27)" fill="oklch(0.58 0.21 27 / .12)" name="Cobertura" /></AreaChart></ResponsiveContainer></div></Card>
        </div>
        <ModalForm open={modal} onOpenChange={setModal} title={cfg.action} successMessage="Reposição criada" onSave={async () => {}}><ActionForm kind={kind} /></ModalForm>
        <ConfirmDialog open={!!confirmar} onOpenChange={(v) => !v && setConfirmar(null)} title="Gerar compra" description={`Deseja gerar solicitação de compra para ${confirmar ?? "este item"}?`} successMessage="Compra sugerida" onConfirm={async () => {}} />
      </EstoqueShell>
    );
  }

  if (kind === "transferencias") {
    return (
      <EstoqueShell>
        <PageHeader title={cfg.title} description={cfg.description} action={<Button size="sm" onClick={() => setModal(true)}><Plus className="mr-2 h-4 w-4" />{cfg.action}</Button>} />
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4"><StatCard title="Em trânsito" value="3" icon={Truck} /><StatCard title="A conferir" value="2" icon={AlertTriangle} tone="warning" /><StatCard title="Concluídas" value="28" icon={CheckCircle2} /><StatCard title="Locais ativos" value="4" icon={MapPin} /></div>
        <div className="mt-5 grid gap-4 xl:grid-cols-[330px_1fr]">
          <Card className="rounded-2xl p-5 shadow-soft"><div className="flex items-center gap-2"><Route className="h-5 w-5 text-primary" /><h3 className="font-semibold">Fluxo interno</h3></div><div className="mt-5 space-y-4 text-sm">{["Solicitação", "Separação", "Trânsito", "Conferência", "Entrada no local"].map((step, i) => <div key={step} className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary">{i + 1}</span><span>{step}</span></div>)}</div></Card>
          <DataTable data={transferRows} searchKeys={["codigo", "produto", "origem", "destino", "status"]} pageSize={10} maxHeight="calc(100vh - 28rem)" columns={[
            { key: "cod", header: "Código", cell: (r) => <strong>{r.codigo}</strong> },
            { key: "prod", header: "Produto", cell: (r) => r.produto },
            { key: "origem", header: "Origem", cell: (r) => r.origem },
            { key: "destino", header: "Destino", cell: (r) => r.destino },
            { key: "qtd", header: "Qtd.", cell: (r) => r.qtd },
            { key: "prazo", header: "Prazo", cell: (r) => r.prazo },
            { key: "status", header: "Status", cell: (r) => r.status },
            { key: "acao", header: "", className: "text-right", cell: (r) => <Button variant="ghost" size="sm" onClick={() => setConfirmar(r.codigo)}>Conferir</Button> },
          ]} />
        </div>
        <ModalForm open={modal} onOpenChange={setModal} title={cfg.action} successMessage="Transferência registrada" onSave={async () => {}}><ActionForm kind={kind} /></ModalForm>
        <ConfirmDialog open={!!confirmar} onOpenChange={(v) => !v && setConfirmar(null)} title="Conferir transferência" description={`Deseja conferir ${confirmar ?? "esta transferência"}?`} successMessage="Transferência conferida" onConfirm={async () => {}} />
      </EstoqueShell>
    );
  }

  return (
    <EstoqueShell>
      <PageHeader title={cfg.title} description={cfg.description} action={<Button size="sm" onClick={() => setModal(true)}><Plus className="mr-2 h-4 w-4" />{cfg.action}</Button>} />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4"><StatCard title="Perdas no mês" value={brl(2360)} icon={TrendingDown} tone="destructive" /><StatCard title="Eventos" value="11" icon={AlertTriangle} tone="warning" /><StatCard title="Maior motivo" value="Avaria" icon={BarChart3} /><StatCard title="Recuperável" value={brl(480)} icon={CheckCircle2} tone="primary" /></div>
      <div className="mt-5 grid gap-4 xl:grid-cols-[1fr_360px]">
        <Card className="rounded-2xl p-5 shadow-soft"><h3 className="mb-1 font-semibold">Perdas por motivo</h3><p className="mb-3 text-xs text-muted-foreground">Valor acumulado no mês</p><div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={lossChart}><CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.005 145)" /><XAxis dataKey="motivo" fontSize={12} /><YAxis fontSize={12} tickFormatter={(v) => `R$${v}`} /><Tooltip formatter={(v: number) => brl(v)} contentStyle={{ borderRadius: 12 }} /><Bar dataKey="valor" fill="oklch(0.58 0.21 27)" radius={[8,8,0,0]} /></BarChart></ResponsiveContainer></div></Card>
        <Card className="rounded-2xl p-5 shadow-soft"><h3 className="font-semibold">Insights operacionais</h3><div className="mt-3 space-y-3 text-sm"><div className="rounded-xl border bg-warning/10 p-3">Avarias são o maior impacto. Priorize revisão no recebimento e armazenagem.</div><div className="rounded-xl border bg-muted/30 p-3">Prateleira B2 concentra risco por capacidade acima de 90%.</div><div className="rounded-xl border bg-primary-soft p-3 text-primary">R$ 480 podem ser recuperados com troca junto ao fornecedor.</div></div><div className="mt-5 h-40"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={lossChart} dataKey="valor" nameKey="motivo" innerRadius={38} outerRadius={62}>{lossChart.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}</Pie><Tooltip formatter={(v: number) => brl(v)} /></PieChart></ResponsiveContainer></div></Card>
      </div>
      <div className="mt-5"><DataTable data={lossChart.map((l, i) => ({ codigo: `PE-${201+i}`, produto: ["Pão Francês kg", "Café Especial", "Mouse Wireless", "Camiseta Premium M"][i], motivo: l.motivo, valor: brl(l.valor), responsavel: ["Marina", "Carlos", "Ana", "Paulo"][i], status: i === 0 ? "Investigar" : "Registrada" }))} searchKeys={["codigo", "produto", "motivo", "status"]} pageSize={10} maxHeight="220px" compact columns={[
        { key: "codigo", header: "Código", cell: (r) => <strong>{r.codigo}</strong> }, { key: "produto", header: "Produto", cell: (r) => r.produto }, { key: "motivo", header: "Motivo", cell: (r) => r.motivo }, { key: "valor", header: "Valor", cell: (r) => r.valor }, { key: "resp", header: "Responsável", cell: (r) => r.responsavel }, { key: "status", header: "Status", cell: (r) => r.status },
      ]} /></div>
      <ModalForm open={modal} onOpenChange={setModal} title={cfg.action} successMessage="Registro salvo" onSave={async () => {}}><ActionForm kind={kind} /></ModalForm>
      <ConfirmDialog open={!!confirmar} onOpenChange={(v) => !v && setConfirmar(null)} title="Confirmar operação" description={`Confirma a ação para ${confirmar ?? "este item"}?`} successMessage="Operação registrada" onConfirm={async () => {}} />
    </EstoqueShell>
  );
}
