import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/fluxia/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Wallet, ShoppingCart, Package, Boxes, Users, BarChart3, Briefcase,
  FileText, ChevronRight, Search, Download, BadgePercent, Banknote, UserCog,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/relatorios")({ component: RelatoriosPage });

const categorias = [
  { id: "financeiro", label: "Financeiro", icon: Wallet },
  { id: "vendas", label: "Vendas", icon: ShoppingCart },
  { id: "produtos", label: "Produtos", icon: Package },
  { id: "estoque", label: "Estoque", icon: Boxes },
  { id: "clientes", label: "Clientes", icon: Users },
  { id: "pdv", label: "PDV", icon: Banknote },
  { id: "bpo", label: "BPO Financeiro", icon: Briefcase },
  { id: "dre", label: "DRE", icon: BarChart3 },
  { id: "descontos", label: "Descontos", icon: BadgePercent },
  { id: "operadores", label: "Operadores", icon: UserCog },
];

const relatorios: Record<string, string[]> = {
  financeiro: ["Fluxo de caixa", "DRE gerencial", "Contas a pagar", "Contas pagas", "Contas a receber", "Contas recebidas", "Movimentação bancária", "Conciliação pendente", "Previsão de caixa", "Centro de custo", "Categorias financeiras", "Inadimplência"],
  vendas: ["Vendas por período", "Vendas por cliente", "Ticket médio", "Orçamentos convertidos", "Pedidos em aberto", "Ranking de vendedores", "Metas comerciais", "Comissões"],
  produtos: ["Produtos mais vendidos", "Produtos sem giro", "Margem por produto", "Curva ABC", "Preço x custo", "Vendas por categoria"],
  estoque: ["Estoque atual", "Estoque baixo", "Movimentações", "Inventário", "Entradas e saídas", "Ajustes manuais", "Produtos sem estoque"],
  clientes: ["Clientes ativos", "Clientes inativos", "Top clientes", "Última compra", "Histórico de compras", "Clientes inadimplentes"],
  pdv: ["Resumo de caixa", "Vendas por operador", "Vendas por forma de pagamento", "Cancelamentos", "Sangrias e suprimentos", "Fechamentos de caixa"],
  bpo: ["Fechamento mensal", "Pendências por cliente", "Documentos pendentes", "Conciliação por cliente", "Honorários", "SLA operacional", "Produtividade da equipe"],
  dre: ["DRE mensal", "Evolução de resultado", "Margem bruta", "Margem líquida", "Custos e despesas", "Comparativo mensal"],
  descontos: ["Descontos por venda", "Descontos por operador", "Descontos por cliente", "Autorizações de desconto", "Descontos por produto"],
  operadores: ["Performance por operador", "Caixas abertos", "Vendas canceladas", "Tempo médio de atendimento", "Divergências de caixa"],
};

function RelatoriosPage() {
  const [cat, setCat] = useState("financeiro");
  const [q, setQ] = useState("");
  const list = (relatorios[cat] ?? []).filter((r) => r.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="max-h-[calc(100vh-7rem)] overflow-hidden">
      <PageHeader title="Relatórios" description="Análises financeiras, operacionais e estratégicas organizadas por área." />
      <div className="grid h-[calc(100vh-13rem)] gap-4 lg:grid-cols-[240px_1fr]">
        <Card className="overflow-hidden rounded-2xl p-2 shadow-soft">
          <div className="sticky top-0 bg-card p-2">
            <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Categorias</p>
          </div>
          <div className="custom-scrollbar h-[calc(100%-36px)] overflow-y-auto pr-1">
            {categorias.map((c) => (
              <button
                key={c.id}
                onClick={() => setCat(c.id)}
                className={`mb-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm transition ${cat === c.id ? "bg-primary-soft font-medium text-primary" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"}`}
              >
                <c.icon className="h-4 w-4" /> {c.label}
              </button>
            ))}
          </div>
        </Card>

        <Card className="flex min-w-0 flex-col overflow-hidden rounded-2xl shadow-soft">
          <div className="flex flex-col gap-3 border-b bg-card p-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="font-semibold">{categorias.find((c) => c.id === cat)?.label}</h3>
              <p className="text-xs text-muted-foreground">{list.length} relatórios disponíveis</p>
            </div>
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar relatório..." className="pl-9" />
            </div>
          </div>
          <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto">
            {list.map((r, idx) => (
              <button key={r} onClick={() => toast.info(`Abrindo relatório: ${r}`)} className="group flex w-full items-center justify-between gap-4 border-b p-4 text-left transition hover:bg-muted/40">
                <div className="flex items-center gap-4">
                  <div className="rounded-xl bg-muted p-2 text-muted-foreground"><FileText className="h-4 w-4" /></div>
                  <div>
                    <p className="font-medium">{r}</p>
                    <p className="text-xs text-muted-foreground">Última atualização: {String(18 + (idx % 9)).padStart(2, "0")}/05/2026</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); toast.success("Exportação iniciada"); }}><Download className="mr-2 h-4 w-4" />Exportar</Button>
                  <ChevronRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5" />
                </div>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
