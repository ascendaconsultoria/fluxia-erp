import { createFileRoute } from "@tanstack/react-router";
import { useState, type Dispatch, type SetStateAction } from "react";
import { PageHeader } from "@/components/fluxia/PageHeader";
import { ComprasShell } from "@/components/fluxia/ModuleShells";
import { StatCard } from "@/components/fluxia/StatCard";
import { DataTable } from "@/components/fluxia/DataTable";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ModalForm } from "@/components/fluxia/ModalForm";
import { ConfirmDialog } from "@/components/fluxia/ConfirmDialog";
import { brl } from "@/lib/format";
import { ShoppingBag, Truck, FileText, Clock3, Plus, PackageCheck, Building2, Receipt, ClipboardList, GitCompareArrows, CheckCircle2, AlertTriangle, WalletCards, SearchCheck } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts";

export const Route = createFileRoute("/_app/compras")({ component: ComprasPage });

const tabs = ["Visão geral", "Solicitações", "Pedidos", "Fornecedores", "Cotação"];
const categoriaData = [{ cat: "Eletrônicos", valor: 42000 }, { cat: "Papelaria", valor: 12800 }, { cat: "Limpeza", valor: 7300 }, { cat: "Embalagens", valor: 9100 }];
const baseRows = [
  { codigo: "SOL-102", origem: "Estoque", fornecedor: "Atacado Norte", status: "Pendente", valor: brl(6800), prazo: "Hoje" },
  { codigo: "PED-442", origem: "Reposição", fornecedor: "Vision Distribuidora", status: "Aguardando entrega", valor: brl(18400), prazo: "28/05" },
  { codigo: "COT-088", origem: "Compras", fornecedor: "3 fornecedores", status: "Comparar", valor: "Cotação", prazo: "Amanhã" },
  { codigo: "REC-112", origem: "Recebimento", fornecedor: "Beta Import", status: "Conferência", valor: brl(32000), prazo: "Hoje" },
];
const COLORS = ["oklch(0.58 0.16 152)", "oklch(0.62 0.14 235)", "oklch(0.76 0.16 75)", "oklch(0.58 0.21 27)"];

// Score do fornecedor = média ponderada: prazo de entrega (35%), qualidade (40%) e custo (25%).
// Quanto maior o score, maior a prioridade operacional desse fornecedor em cotações e compras recorrentes.
function calculateSupplierScore(prazo: number, qualidade: number, custo: number) {
  return Math.round(prazo * 0.35 + qualidade * 0.4 + custo * 0.25);
}



function CotacaoView({ cotacoesSelecionadas, setCotacoesSelecionadas, setAcao }: { cotacoesSelecionadas: string[]; setCotacoesSelecionadas: Dispatch<SetStateAction<string[]>>; setAcao: (value: string | null) => void }) {
  const cotacoes = [
    { fornecedor: "Fornecedor A", codigo: "COT-088", item: "Notebook Pro", custo: 4590, prazo: 7, score: 92 },
    { fornecedor: "Fornecedor B", codigo: "COT-089", item: "Notebook Pro", custo: 4720, prazo: 2, score: 84 },
    { fornecedor: "Fornecedor C", codigo: "COT-090", item: "Notebook Pro", custo: 4680, prazo: 5, score: 79 },
  ];
  const selecionadas = cotacoes.filter((c) => cotacoesSelecionadas.includes(c.fornecedor));
  const menorCusto = selecionadas.reduce((best, atual) => (!best || atual.custo < best.custo ? atual : best), selecionadas[0]);
  const menorPrazo = selecionadas.reduce((best, atual) => (!best || atual.prazo < best.prazo ? atual : best), selecionadas[0]);
  const insight = selecionadas.length < 2
    ? "Selecione duas ou mais cotações para gerar uma recomendação comparativa."
    : menorCusto?.fornecedor === menorPrazo?.fornecedor
      ? `${menorCusto?.fornecedor} é a melhor opção porque combina o menor custo (${brl(menorCusto?.custo ?? 0)}) e o menor prazo (${menorCusto?.prazo} dias).`
      : `${menorCusto?.fornecedor} oferece o menor custo (${brl(menorCusto?.custo ?? 0)}), mas ${menorPrazo?.fornecedor} entrega ${Math.abs((menorCusto?.prazo ?? 0) - (menorPrazo?.prazo ?? 0))} dias mais rápido. Recomendamos ${menorPrazo?.fornecedor} quando houver risco de ruptura de estoque.`;
  return <div className="grid gap-4 xl:grid-cols-[1fr_380px]"><DataTable data={cotacoes} searchKeys={["codigo","item","fornecedor"]} pageSize={10} maxHeight="calc(100vh - 22rem)" columns={[{key:"sel",header:"",cell:r=><Checkbox checked={cotacoesSelecionadas.includes(r.fornecedor)} onCheckedChange={(checked)=>setCotacoesSelecionadas((prev)=>checked ? [...prev, r.fornecedor] : prev.filter((x)=>x!==r.fornecedor))}/>},{key:"codigo",header:"Cotação",cell:r=><strong>{r.codigo}</strong>},{key:"fornecedor",header:"Fornecedor",cell:r=>r.fornecedor},{key:"item",header:"Item",cell:r=>r.item},{key:"custo",header:"Custo",cell:r=><span className="font-semibold text-primary">{brl(r.custo)}</span>},{key:"prazo",header:"Prazo",cell:r=>`${r.prazo} dias`},{key:"score",header:"Score",cell:r=>r.score},{key:"acao",header:"",className:"text-right",cell:r=><Button variant="ghost" size="sm" onClick={()=>setAcao(r.codigo)}>Abrir</Button>}]}/><Card className="rounded-2xl p-5 shadow-soft"><GitCompareArrows className="h-5 w-5 text-primary" /><h3 className="mt-2 font-semibold">Insight de decisão</h3><p className="mt-1 text-sm text-muted-foreground">O sistema compara custo, prazo e score das cotações marcadas.</p><div className="mt-4 rounded-2xl border bg-primary-soft p-4 text-sm text-primary">{insight}</div><div className="mt-4 space-y-2">{cotacoes.map((c)=><label key={c.fornecedor} className="flex cursor-pointer items-center gap-3 rounded-xl border p-3"><Checkbox checked={cotacoesSelecionadas.includes(c.fornecedor)} onCheckedChange={(checked)=>setCotacoesSelecionadas((prev)=>checked ? [...prev, c.fornecedor] : prev.filter((x)=>x!==c.fornecedor))}/><span><strong>{c.fornecedor}</strong><p className="text-xs text-muted-foreground">{brl(c.custo)} • {c.prazo} dias • score {c.score}</p></span></label>)}</div></Card></div>;
}

function ComprasPage() {
  const [tab, setTab] = useState("Visão geral");
  const [modal, setModal] = useState<string | null>(null);
  const [acao, setAcao] = useState<string | null>(null);
  const [cotacoesSelecionadas, setCotacoesSelecionadas] = useState<string[]>(["Fornecedor A", "Fornecedor B"]);
  const actionLabel = tab === "Solicitações" ? "Nova solicitação" : tab === "Pedidos" ? "Novo pedido" : tab === "Fornecedores" ? "Cadastrar fornecedor" : tab === "Cotação" ? "Nova cotação" : "Nova compra";

  return (
    <ComprasShell activeTab={tab} onTabChange={setTab}>
      <PageHeader title={tab === "Visão geral" ? "Compras" : tab} description="Solicitações, pedidos, fornecedores e cotações. Recebimentos ficam em Estoque." action={<Button onClick={() => setModal(tab)}><Plus className="mr-2 h-4 w-4" />{actionLabel}</Button>} />
      <div className="custom-scrollbar max-h-[calc(100vh-13rem)] overflow-y-auto pr-1">
        {tab === "Visão geral" && (
          <>
            <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-4"><StatCard title="Compras do mês" value={brl(71200)} icon={ShoppingBag} /><StatCard title="Pedidos abertos" value="12" icon={FileText} tone="warning" /><StatCard title="Fornecedores" value="28" icon={Truck} /><StatCard title="A receber" value="9" icon={PackageCheck} /></div>
            <div className="mt-5 grid gap-4 xl:grid-cols-[1.15fr_.85fr]"><Card className="rounded-2xl p-5 shadow-soft"><h3 className="mb-3 font-semibold">Compras por categoria</h3><div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={categoriaData}><CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.005 145)" /><XAxis dataKey="cat" /><YAxis tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} /><Tooltip formatter={(v: number) => brl(v)} contentStyle={{ borderRadius: 12 }} /><Bar dataKey="valor" fill="oklch(0.58 0.16 152)" radius={[8,8,0,0]} /></BarChart></ResponsiveContainer></div></Card><Card className="rounded-2xl p-5 shadow-soft"><h3 className="mb-3 font-semibold">Status operacional</h3><div className="h-52"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={[{ name: "No prazo", value: 62 }, { name: "Atenção", value: 25 }, { name: "Atrasado", value: 13 }]} dataKey="value" nameKey="name" innerRadius={54} outerRadius={82}>{[0,1,2].map((i) => <Cell key={i} fill={COLORS[i]} />)}</Pie><Tooltip formatter={(v: number) => `${v}%`} /></PieChart></ResponsiveContainer></div><div className="mt-2 grid gap-2 text-xs sm:grid-cols-2"><span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-primary"/>Verde: aprovado/no prazo</span><span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-warning"/>Amarelo: atenção</span><span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-destructive"/>Vermelho: atraso/risco</span><span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-blue-500"/>Azul: em cotação</span></div></Card></div>
          </>
        )}

        {tab === "Solicitações" && <div className="grid gap-4 xl:grid-cols-[320px_1fr]"><Card className="rounded-2xl p-5 shadow-soft"><ClipboardList className="h-5 w-5 text-primary" /><h3 className="mt-2 font-semibold">Triagem de solicitações</h3><p className="mt-1 text-sm text-muted-foreground">Priorize demandas internas antes de virar cotação.</p><div className="mt-4 space-y-2">{["Urgente", "Reposição", "Aprovação", "Baixa prioridade"].map((x,i)=><div className="rounded-xl border p-3" key={x}><strong>{x}</strong><p className="text-xs text-muted-foreground">{[3,8,5,12][i]} solicitações</p></div>)}</div></Card><DataTable data={baseRows} searchKeys={["codigo","origem","status"]} pageSize={10} maxHeight="calc(100vh - 24rem)" columns={[{key:"codigo",header:"Solicitação",cell:r=><strong>{r.codigo}</strong>},{key:"origem",header:"Origem",cell:r=>r.origem},{key:"status",header:"Status",cell:r=>r.status},{key:"prazo",header:"Prazo",cell:r=>r.prazo},{key:"acao",header:"",className:"text-right",cell:r=><Button variant="ghost" size="sm" onClick={()=>setAcao(r.codigo)}>Analisar</Button>}]}/></div>}

        {tab === "Pedidos" && <div className="grid gap-4"><div className="grid gap-3 md:grid-cols-3"><StatCard title="Abertos" value="12" icon={FileText} /><StatCard title="Atrasados" value="3" icon={Clock3} tone="destructive" /><StatCard title="Valor aberto" value={brl(58400)} icon={ShoppingBag} /></div><DataTable data={baseRows} searchKeys={["codigo","fornecedor","status"]} pageSize={10} maxHeight="calc(100vh - 27rem)" columns={[{key:"codigo",header:"Pedido",cell:r=><strong>{r.codigo}</strong>},{key:"forn",header:"Fornecedor",cell:r=>r.fornecedor},{key:"valor",header:"Valor",cell:r=><span className="font-semibold text-primary">{r.valor}</span>},{key:"status",header:"Status",cell:r=>r.status},{key:"prazo",header:"Previsão",cell:r=>r.prazo},{key:"acao",header:"",className:"text-right",cell:r=><Button variant="ghost" size="sm" onClick={()=>setAcao(r.codigo)}>Abrir</Button>}]}/></div>}

        {tab === "Fornecedores" && <div className="grid gap-4"><DataTable data={["Atacado Norte","Vision Distribuidora","Beta Import","Alfa Embalagens","Casa Padaria","Mega Office","Norte Papelaria","Aroma Cafés"].map((nome,i)=>({nome,cnpj:`00.000.000/000${i}-00`,prazo:[7,14,21,5,3,9,12,4][i],score:calculateSupplierScore([95,82,72,88,90,77,81,94][i], [94,86,78,91,88,80,83,96][i], [82,84,80,88,75,86,82,79][i]),categoria:["Alimentos","Eletrônicos","Importados","Embalagens","Padaria","Papelaria","Papelaria","Bebidas"][i],status:i===2?"Revisar":"Ativo"}))} searchKeys={["nome","cnpj","status","categoria"]} pageSize={15} maxHeight="calc(100vh - 18rem)" columns={[{key:"nome",header:"Fornecedor",cell:r=><strong>{r.nome}</strong>},{key:"cnpj",header:"CNPJ",cell:r=>r.cnpj},{key:"categoria",header:"Categoria",cell:r=>r.categoria},{key:"prazo",header:"Prazo médio",cell:r=>`${r.prazo} dias`},{key:"score",header:"Score",cell:r=><span className="font-semibold text-primary">{r.score}</span>},{key:"status",header:"Status",cell:r=>r.status},{key:"acao",header:"",className:"text-right",cell:r=><Button variant="ghost" size="sm" onClick={()=>setAcao(r.nome)}>Abrir</Button>}]}/></div>}

        {tab === "Recebimento" && <div className="grid gap-4 xl:grid-cols-[340px_1fr]"><Card className="rounded-2xl p-5 shadow-soft"><PackageCheck className="h-5 w-5 text-primary" /><h3 className="mt-2 font-semibold">Conferência de entrada</h3>{["Nota fiscal", "Quantidade", "Avaria", "Entrada no estoque"].map((s,i)=><div key={s} className="mt-3 flex items-center gap-3 rounded-xl border p-3 text-sm"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-soft text-primary">{i+1}</span>{s}</div>)}</Card><DataTable data={baseRows} searchKeys={["codigo","fornecedor","status"]} pageSize={10} maxHeight="calc(100vh - 22rem)" columns={[{key:"codigo",header:"Recebimento",cell:r=><strong>{r.codigo}</strong>},{key:"forn",header:"Fornecedor",cell:r=>r.fornecedor},{key:"status",header:"Status",cell:r=>r.status},{key:"valor",header:"Valor",cell:r=>r.valor},{key:"acao",header:"",className:"text-right",cell:r=><Button variant="ghost" size="sm" onClick={()=>setAcao(r.codigo)}>Conferir</Button>}]}/></div>}

        {tab === "Cotação" && <CotacaoView cotacoesSelecionadas={cotacoesSelecionadas} setCotacoesSelecionadas={setCotacoesSelecionadas} setAcao={setAcao} />}

        {tab === "Contas vinculadas" && <div className="grid gap-4"><div className="grid gap-3 md:grid-cols-3"><StatCard title="A pagar vinculado" value={brl(58400)} icon={WalletCards} /><StatCard title="Notas sem vínculo" value="4" icon={AlertTriangle} tone="warning" /><StatCard title="Conciliadas" value="87%" icon={CheckCircle2} /></div><DataTable data={baseRows} searchKeys={["codigo","fornecedor","status"]} pageSize={10} maxHeight="calc(100vh - 27rem)" columns={[{key:"codigo",header:"Documento",cell:r=><strong>{r.codigo}</strong>},{key:"forn",header:"Fornecedor",cell:r=>r.fornecedor},{key:"valor",header:"Valor",cell:r=>r.valor},{key:"status",header:"Status financeiro",cell:r=>r.status},{key:"acao",header:"",className:"text-right",cell:r=><Button variant="ghost" size="sm" onClick={()=>setAcao(r.codigo)}>Vincular</Button>}]}/></div>}
      </div>
      <ModalForm open={!!modal} onOpenChange={(v) => !v && setModal(null)} title={actionLabel} successMessage="Registro salvo" onSave={async () => {}}><div className="grid gap-3 sm:grid-cols-2"><div><Label>Fornecedor / origem</Label><Input /></div><div><Label>Valor previsto</Label><Input type="number" /></div><div><Label>Status</Label><Select><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent><SelectItem value="solicitado">Solicitado</SelectItem><SelectItem value="cotacao">Cotação</SelectItem><SelectItem value="pedido">Pedido</SelectItem><SelectItem value="recebimento">Recebimento</SelectItem></SelectContent></Select></div><div><Label>Previsão</Label><Input type="date" /></div><div className="sm:col-span-2"><Label>Observação</Label><Input /></div></div></ModalForm>
      <ConfirmDialog open={!!acao} onOpenChange={(v) => !v && setAcao(null)} title="Confirmar ação" description={`Deseja atualizar ${acao ?? "este registro"}?`} confirmText="Confirmar" successMessage="Registro atualizado" onConfirm={async () => {}} />
    </ComprasShell>
  );
}
