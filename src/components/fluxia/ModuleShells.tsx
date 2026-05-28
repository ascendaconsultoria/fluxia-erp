import { ReactNode } from "react";
import {
  LayoutDashboard, CreditCard, WalletCards, ReceiptText,
  ArrowDownToLine, ArrowUpFromLine, LineChart, Repeat, BarChart3,
  Package, ArrowLeftRight, ClipboardCheck, MapPin, RefreshCw, Truck, TrendingDown, PackageCheck,
  ShoppingBag, ClipboardList, FileText, Building2, SearchCheck,
} from "lucide-react";
import { ModuleSideNav, ModuleNavItem } from "./ModuleSideNav";

const financeiroItems: ModuleNavItem[] = [
  { to: "/financeiro", label: "Visão geral", icon: LayoutDashboard, exact: true },
  { to: "/financeiro/contas-a-pagar", label: "Contas a pagar", icon: ArrowUpFromLine },
  { to: "/financeiro/contas-a-receber", label: "Contas a receber", icon: ArrowDownToLine },
  { to: "/financeiro/cobrancas", label: "Cobranças", icon: ReceiptText, badge: 7 },
  { to: "/financeiro/fluxo-caixa", label: "Fluxo de caixa", icon: LineChart },
  { to: "/financeiro/dre", label: "DRE", icon: BarChart3 },
  { to: "/financeiro/contas-carteiras", label: "Contas e carteiras", icon: WalletCards },
  { to: "/financeiro/cartoes", label: "Cartões", icon: CreditCard },
  { to: "/financeiro/conciliacao", label: "Conciliação", icon: Repeat },
];

const estoqueItems: ModuleNavItem[] = [
  { to: "/estoque", label: "Visão geral", icon: LayoutDashboard, exact: true },
  { to: "/estoque/produtos", label: "Produtos", icon: Package },
  { to: "/estoque/movimentacoes", label: "Movimentações", icon: ArrowLeftRight },
  { to: "/estoque/recebimento", label: "Recebimento", icon: PackageCheck },
  { to: "/estoque/inventario", label: "Inventário", icon: ClipboardCheck },
  { to: "/estoque/consulta", label: "Consulta", icon: SearchCheck },
  { to: "/estoque/locais", label: "Locais", icon: MapPin },
  { to: "/estoque/reposicao", label: "Reposição", icon: RefreshCw, badge: 4 },
  { to: "/estoque/transferencias", label: "Transferências", icon: Truck },
  { to: "/estoque/perdas", label: "Perdas", icon: TrendingDown },
];

const comprasItems: (ModuleNavItem & { tab: string })[] = [
  { to: "/compras", tab: "Visão geral", label: "Visão geral", icon: LayoutDashboard, exact: true },
  { to: "/compras", tab: "Solicitações", label: "Solicitações", icon: ClipboardList },
  { to: "/compras", tab: "Pedidos", label: "Pedidos", icon: FileText, badge: 12 },
  { to: "/compras", tab: "Fornecedores", label: "Fornecedores", icon: Building2 },
  { to: "/compras", tab: "Cotação", label: "Cotação", icon: ShoppingBag },
];

export function FinanceiroShell({ children }: { children: ReactNode }) {
  return <ModuleSideNav title="Financeiro" items={financeiroItems}>{children}</ModuleSideNav>;
}

export function EstoqueShell({ children }: { children: ReactNode }) {
  return <ModuleSideNav title="Estoque" items={estoqueItems}>{children}</ModuleSideNav>;
}

export function ComprasShell({ children, activeTab, onTabChange }: { children: ReactNode; activeTab?: string; onTabChange?: (tab: string) => void }) {
  if (!onTabChange) {
    return <ModuleSideNav title="Compras" items={comprasItems}>{children}</ModuleSideNav>;
  }

  return (
    <div className="grid min-w-0 gap-4 overflow-hidden max-h-[calc(100vh-8rem)] lg:grid-cols-[168px_1fr]">
      <aside className="custom-scrollbar min-w-0 overflow-x-auto border-b pb-2 lg:sticky lg:top-0 lg:h-[calc(100vh-8rem)] lg:overflow-y-auto lg:overflow-x-hidden lg:border-b-0 lg:pr-2">
        <p className="mb-2 hidden px-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground lg:block">Compras</p>
        <div className="flex gap-2 lg:block lg:space-y-1">
          {comprasItems.map((item) => {
            const active = activeTab === item.tab;
            return (
              <button
                key={item.tab}
                type="button"
                onClick={() => onTabChange(item.tab)}
                className={`flex min-w-max items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition lg:w-full lg:min-w-0 ${active ? "bg-primary-soft font-medium text-primary" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"}`}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
                {item.badge !== undefined && <span className="ml-auto rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary">{item.badge}</span>}
              </button>
            );
          })}
        </div>
      </aside>
      <div className="custom-scrollbar min-w-0 overflow-y-auto pr-1">{children}</div>
    </div>
  );
}
