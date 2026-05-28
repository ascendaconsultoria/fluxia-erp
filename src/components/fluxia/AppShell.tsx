import { ReactNode, useEffect, useMemo, useState } from "react";
import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  BarChart3,
  Bell,
  Building2,
  ChevronDown,
  ClipboardList,
  CreditCard,
  DatabaseZap,
  FileText,
  Folder,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  Moon,
  MousePointer2,
  Package,
  PanelLeftClose,
  PanelLeftOpen,
  Repeat,
  ReceiptText,
  Search,
  Send,
  Settings,
  Shield,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Sun,
  TrendingUp,
  User,
  Users,
  Wallet,
  X,
  Monitor,
  CalendarDays,
  HeartHandshake,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ButtonWithLoading } from "@/components/fluxia/ButtonWithLoading";
import { sleep } from "@/lib/format";
import { PerfilUsuario, SidebarMode, ThemeMode, useStore } from "@/mock/store";
import { toast } from "sonner";

type NavItem = { to: string; label: string; icon: any; profiles?: PerfilUsuario[] };

const operationalNav: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, profiles: ["Administrador", "Gestor Financeiro", "Gestor de Estoque", "Vendedor", "Visualizador"] },
  { to: "/pdv", label: "PDV", icon: ShoppingCart, profiles: ["Administrador", "Operador PDV"] },
  { to: "/estoque", label: "Estoque", icon: Package, profiles: ["Administrador", "Gestor de Estoque", "Operador PDV"] },
  { to: "/financeiro", label: "Financeiro", icon: Wallet, profiles: ["Administrador", "Gestor Financeiro"] },
  { to: "/vendas", label: "Vendas", icon: TrendingUp, profiles: ["Administrador", "Vendedor"] },
  { to: "/pos-venda", label: "Pós-venda", icon: HeartHandshake, profiles: ["Administrador", "Vendedor", "Gestor Financeiro"] },
  { to: "/fiscal", label: "Fiscal", icon: ReceiptText, profiles: ["Administrador", "Gestor Financeiro"] },
  { to: "/agenda", label: "Agenda", icon: CalendarDays, profiles: ["Administrador", "Gestor Financeiro", "Gestor de Estoque", "Vendedor"] },
  { to: "/compras", label: "Compras", icon: ShoppingBag, profiles: ["Administrador", "Gestor Financeiro", "Gestor de Estoque"] },
  { to: "/tarefas", label: "Tarefas", icon: ClipboardList, profiles: ["Administrador", "Gestor Financeiro", "Gestor de Estoque", "Vendedor"] },
  { to: "/notificacoes", label: "Notificações", icon: Bell, profiles: ["Administrador", "Gestor Financeiro", "Gestor de Estoque", "Vendedor", "Visualizador"] },
  { to: "/chat", label: "Chat interno", icon: MessageCircle, profiles: ["Administrador", "Gestor Financeiro", "Gestor de Estoque", "Vendedor", "Visualizador"] },
  { to: "/importacao", label: "Importação", icon: DatabaseZap, profiles: ["Administrador", "Gestor Financeiro", "Gestor de Estoque"] },
  { to: "/cadastros", label: "Cadastros", icon: ClipboardList, profiles: ["Administrador", "Gestor Financeiro", "Gestor de Estoque", "Vendedor"] },
  { to: "/relatorios", label: "Relatórios", icon: BarChart3, profiles: ["Administrador", "Gestor Financeiro", "Gestor de Estoque", "Vendedor", "Visualizador"] },
  { to: "/configuracoes", label: "Configurações", icon: Settings, profiles: ["Administrador"] },
];

const bpoNav: NavItem[] = [
  { to: "/bpo", label: "Visão Geral BPO", icon: LayoutDashboard },
  { to: "/bpo/lancamentos", label: "Lançamentos", icon: FileText },
  { to: "/bpo/conciliacao", label: "Conciliação", icon: Repeat },
  { to: "/bpo/documentos", label: "Documentos", icon: Folder },
  { to: "/bpo/relatorios", label: "Relatórios Multi-Cliente", icon: BarChart3 },
  { to: "/bpo/tarefas", label: "Tarefas", icon: ClipboardList },
  { to: "/bpo/analise", label: "Análise", icon: TrendingUp },
  { to: "/bpo/comunicacao", label: "Comunicação", icon: MessageCircle },
  { to: "/bpo/honorarios", label: "Honorários", icon: CreditCard },
];

const superAdminNav: NavItem[] = [
  { to: "/super-admin", label: "Dashboard SaaS", icon: Shield },
  { to: "/super-admin/empresas", label: "Empresas", icon: Building2 },
  { to: "/super-admin/planos", label: "Planos e Assinaturas", icon: CreditCard },
  { to: "/super-admin/uso", label: "Uso do Sistema", icon: Activity },
  { to: "/super-admin/nova-empresa", label: "Provisionamento", icon: DatabaseZap },
  { to: "/chat", label: "Chat de suporte", icon: MessageCircle },
];

const themeIcon: Record<ThemeMode, typeof Sun> = { light: Sun, dark: Moon, system: Monitor };
const sidebarLabels: Record<SidebarMode, string> = {
  expanded: "Menu expandido",
  collapsed: "Menu recolhido",
  auto: "Menu automático por hover",
};

export function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [dailyAlertsOpen, setDailyAlertsOpen] = useState(false);
  const [supportMessage, setSupportMessage] = useState("");
  const [supportLoading, setSupportLoading] = useState(false);
  const [hovered, setHovered] = useState(false);
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const navigate = useNavigate();
  const { s, set } = useStore();

  const isStandalonePdv = typeof window !== "undefined" && window.location.search.includes("modo=caixa");
  const isPdvFocused = pathname.startsWith("/pdv") && isStandalonePdv;
  const isSuperAdminMode = s.perfil === "Super Admin";
  const isBpoMode = s.perfil === "BPO Financeiro";

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const applyTheme = () => {
      const dark = s.themeMode === "dark" || (s.themeMode === "system" && media.matches);
      document.documentElement.classList.toggle("dark", dark);
      document.documentElement.style.colorScheme = dark ? "dark" : "light";
    };
    applyTheme();
    media.addEventListener?.("change", applyTheme);
    return () => media.removeEventListener?.("change", applyTheme);
  }, [s.themeMode]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const today = new Date().toISOString().slice(0, 10);
    const key = `fluxia-daily-alerts-${today}`;
    if (!localStorage.getItem(key) && !s.caixaAberto) {
      setDailyAlertsOpen(true);
      localStorage.setItem(key, "shown");
    }
  }, [s.caixaAberto]);

  useEffect(() => {
    if (s.perfil !== "BPO Financeiro" && pathname.startsWith("/bpo")) navigate({ to: "/dashboard" });
    if (s.perfil !== "Super Admin" && pathname.startsWith("/super-admin")) navigate({ to: "/dashboard" });
  }, [s.perfil, pathname, navigate]);

  const visibleNav = useMemo(() => {
    if (s.perfil === "Super Admin") return superAdminNav;
    if (s.perfil === "BPO Financeiro") return bpoNav;
    return operationalNav.filter((item) => item.profiles?.includes(s.perfil));
  }, [s.perfil]);

  const expanded = s.sidebarMode === "expanded" || (s.sidebarMode === "auto" && hovered);
  const sidebarWidth = expanded ? "w-72" : "w-[76px]";
  const ThemeIcon = themeIcon[s.themeMode];
  const isActive = (to: string) => pathname === to || pathname.startsWith(to + "/");

  const cycleSidebar = () => {
    const next: SidebarMode = s.sidebarMode === "auto" ? "expanded" : s.sidebarMode === "expanded" ? "collapsed" : "auto";
    setHovered(false);
    set("sidebarMode", next);
    toast.info(sidebarLabels[next]);
  };

  const cycleTheme = () => {
    const next: ThemeMode = s.themeMode === "system" ? "light" : s.themeMode === "light" ? "dark" : "system";
    set("themeMode", next);
    toast.info(next === "system" ? "Tema seguindo o sistema" : next === "light" ? "Tema claro ativado" : "Tema escuro ativado");
  };

  const changeProfile = (perfil: PerfilUsuario) => {
    set("perfil", perfil);
    toast.info(`Perfil alterado para ${perfil}`);
    if (perfil === "Super Admin") navigate({ to: "/super-admin" });
    else if (perfil === "BPO Financeiro") navigate({ to: "/bpo" });
    else navigate({ to: "/dashboard" });
  };

  const enviarSuporte = async () => {
    setSupportLoading(true);
    await sleep(500);
    setSupportLoading(false);
    toast.success("Mensagem enviada para o BPO");
    setSupportMessage("");
    setSupportOpen(false);
  };

  const renderNavLink = (item: NavItem, mobile = false) => {
    const active = isActive(item.to);
    const content = (
      <Link
        key={item.to}
        to={item.to}
        onClick={() => mobile && setMobileOpen(false)}
        className={`group relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition-all ${
          active
            ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-card"
            : "text-sidebar-foreground/78 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        } ${!expanded && !mobile ? "justify-center" : ""}`}
        title={!expanded && !mobile ? item.label : undefined}
      >
        <item.icon className="h-5 w-5 flex-shrink-0" />
        {(expanded || mobile) && <span className="truncate font-medium">{item.label}</span>}
      </Link>
    );
    if (expanded || mobile) return content;
    return (
      <Tooltip key={item.to}>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right">{item.label}</TooltipContent>
      </Tooltip>
    );
  };

  const home = isSuperAdminMode ? "/super-admin" : isBpoMode ? "/bpo" : "/dashboard";

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <aside
        onMouseEnter={() => s.sidebarMode === "auto" && setHovered(true)}
        onMouseLeave={() => s.sidebarMode === "auto" && setHovered(false)}
        className={`${isPdvFocused ? "hidden" : sidebarWidth} sticky top-0 hidden h-screen flex-shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-300 ease-out md:flex`}
      >
        <div className="flex h-16 flex-shrink-0 items-center justify-between border-b border-sidebar-border px-3">
          <Link to={home} className={`flex items-center gap-3 ${!expanded ? "mx-auto" : ""}`}>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-card"><Sparkles className="h-5 w-5" /></div>
            {expanded && (
              <div>
                <span className="block text-lg font-semibold tracking-tight text-white">Fluxia</span>
                <span className="block text-[11px] text-sidebar-foreground/60">{isSuperAdminMode ? "Super Admin" : isBpoMode ? "BPO Financeiro" : "ERP operacional"}</span>
              </div>
            )}
          </Link>
          {expanded && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button onClick={cycleSidebar} className="rounded-xl p-2 text-sidebar-foreground/60 transition hover:bg-sidebar-accent hover:text-white" aria-label="Alternar comportamento do menu">
                  {s.sidebarMode === "auto" ? <MousePointer2 className="h-4 w-4" /> : s.sidebarMode === "expanded" ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
                </button>
              </TooltipTrigger>
              <TooltipContent>{sidebarLabels[s.sidebarMode]}</TooltipContent>
            </Tooltip>
          )}
        </div>
        <nav className="custom-scrollbar flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {expanded && (isSuperAdminMode || isBpoMode) && <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-sidebar-foreground/45">{isSuperAdminMode ? "Administração SaaS" : "BPO Financeiro"}</p>}
          {visibleNav.map((item) => renderNavLink(item))}
        </nav>
        <div className="flex-shrink-0 border-t border-sidebar-border p-3">
          {expanded ? (
            <div className="rounded-2xl bg-sidebar-accent p-3 text-xs">
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium text-white">{isSuperAdminMode ? "Fluxia SaaS" : isBpoMode ? "Carteira BPO" : s.empresaAtual}</p>
                <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-semibold text-primary">{s.perfil}</span>
              </div>
              <p className="mt-1 text-sidebar-foreground/65">{isSuperAdminMode ? "36 empresas ativas • MRR projetado" : isBpoMode ? "Operação multi-cliente isolada" : `Plano ${s.empresas.find((e) => e.nomeFantasia === s.empresaAtual)?.plano ?? "Profissional"}`}</p>
            </div>
          ) : (
            <Tooltip><TooltipTrigger asChild><button onClick={cycleSidebar} className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-sidebar-accent text-sidebar-foreground/80 hover:text-white"><PanelLeftOpen className="h-4 w-4" /></button></TooltipTrigger><TooltipContent side="right">{sidebarLabels[s.sidebarMode]}</TooltipContent></Tooltip>
          )}
        </div>
      </aside>

      {mobileOpen && !isPdvFocused && (
        <div className="fixed inset-0 z-50 md:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <aside className="absolute left-0 top-0 h-full w-72 bg-sidebar p-4 text-sidebar-foreground" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between"><span className="text-lg font-semibold text-white">Fluxia</span><button onClick={() => setMobileOpen(false)}><X className="h-5 w-5" /></button></div>
            <div className="space-y-1">{visibleNav.map((item) => renderNavLink(item, true))}</div>
          </aside>
        </div>
      )}

      <div className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
        <header className={`${isPdvFocused ? "hidden" : ""} sticky top-0 z-40 flex h-16 items-center gap-3 border-b bg-surface/82 px-4 backdrop-blur-xl md:px-6`}>
          <button className="md:hidden" onClick={() => setMobileOpen(true)} aria-label="Abrir menu"><Menu className="h-5 w-5" /></button>
          <div className="relative hidden max-w-md flex-1 md:block"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Buscar produto, venda, cliente ou relatório..." className="bg-muted/50 pl-9" /></div>
          <div className="flex flex-1 items-center justify-end gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="outline" size="sm" className="hidden gap-2 sm:flex"><Building2 className="h-4 w-4 text-primary" /><span className="max-w-[180px] truncate">{isSuperAdminMode ? "Fluxia SaaS" : isBpoMode ? "Carteira BPO" : s.empresaAtual}</span><ChevronDown className="h-3 w-3 opacity-60" /></Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72"><DropdownMenuLabel>{isSuperAdminMode ? "Ambiente SaaS" : isBpoMode ? "Carteira BPO" : "Trocar empresa"}</DropdownMenuLabel><DropdownMenuSeparator />{!isSuperAdminMode && !isBpoMode && s.empresas.slice(0, 6).map((e) => <DropdownMenuItem key={e.id} onClick={() => { set("empresaAtual", e.nomeFantasia); toast.success(`Acessando ${e.nomeFantasia}`); }}><Building2 className="mr-2 h-4 w-4 text-muted-foreground" />{e.nomeFantasia}</DropdownMenuItem>)}{isSuperAdminMode && <DropdownMenuItem onClick={() => navigate({ to: "/super-admin" })}>Ver Super Admin</DropdownMenuItem>}{isBpoMode && <DropdownMenuItem onClick={() => navigate({ to: "/bpo" })}>Ver Visão Geral BPO</DropdownMenuItem>}</DropdownMenuContent>
            </DropdownMenu>
            <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" aria-label="Alternar tema" onClick={cycleTheme}><ThemeIcon className="h-4 w-4" /></Button></TooltipTrigger><TooltipContent>{s.themeMode === "system" ? "Tema automático" : s.themeMode === "light" ? "Tema claro" : "Tema escuro"}</TooltipContent></Tooltip>
            <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" aria-label="Notificações" className="relative"><Bell className="h-4 w-4" /><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-80"><DropdownMenuLabel>Notificações recentes</DropdownMenuLabel><DropdownMenuSeparator />{[["Conta vencida", "Financeiro • R$ 3.200,00 vence hoje"], ["Estoque mínimo", "Café Especial abaixo do ponto de reposição"], ["Pedido atrasado", "Compra #442 sem confirmação de entrega"]].map(([title, text]) => <DropdownMenuItem key={title} className="flex flex-col items-start gap-1 whitespace-normal py-3"><span className="font-medium">{title}</span><span className="text-xs text-muted-foreground">{text}</span></DropdownMenuItem>)}<DropdownMenuSeparator /><DropdownMenuItem onClick={() => navigate({ to: "/notificacoes" })}>Abrir central de notificações</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
            <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" aria-label="Chat com BPO" className="relative"><MessageCircle className="h-4 w-4" /><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-80"><DropdownMenuLabel>Mensagens e suporte</DropdownMenuLabel><DropdownMenuSeparator />{[["BPO Financeiro", "Existem 5 pendências antes do fechamento."], ["Suporte", "Nova resposta sobre conciliação bancária."]].map(([title, text]) => <DropdownMenuItem key={title} className="flex flex-col items-start gap-1 whitespace-normal py-3" onClick={() => setSupportOpen(true)}><span className="font-medium">{title}</span><span className="text-xs text-muted-foreground">{text}</span></DropdownMenuItem>)}<DropdownMenuSeparator /><DropdownMenuItem onClick={() => setSupportOpen(true)}>Abrir chat</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild><button className="flex items-center gap-2 rounded-2xl p-1.5 transition hover:bg-muted"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground"><User className="h-4 w-4" /></div><div className="hidden text-left text-xs sm:block"><p className="font-medium leading-tight">Carlos Silva</p><p className="text-muted-foreground">{s.perfil}</p></div></button></DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64"><DropdownMenuLabel>Conta</DropdownMenuLabel><DropdownMenuItem onClick={() => navigate({ to: "/perfil" })}>Meu perfil</DropdownMenuItem><DropdownMenuItem onClick={() => navigate({ to: "/configuracoes" })}>Configurações</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuLabel className="text-xs text-muted-foreground">Perfil de teste</DropdownMenuLabel>{(["Administrador", "Operador PDV", "Gestor Financeiro", "Gestor de Estoque", "BPO Financeiro", "Vendedor", "Visualizador", "Super Admin"] as PerfilUsuario[]).map((p) => <DropdownMenuItem key={p} onClick={() => changeProfile(p)}><Users className="mr-2 h-4 w-4 text-muted-foreground" />{p}</DropdownMenuItem>)}<DropdownMenuSeparator />{(isSuperAdminMode || isBpoMode) && <DropdownMenuItem onClick={() => navigate({ to: "/dashboard" })}><Shield className="mr-2 h-4 w-4" />Voltar para operação</DropdownMenuItem>}<DropdownMenuSeparator /><DropdownMenuItem onClick={() => { toast.success("Sessão encerrada"); navigate({ to: "/login" }); }} className="text-destructive"><LogOut className="mr-2 h-4 w-4" /> Sair</DropdownMenuItem></DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className={`${isPdvFocused ? "fixed inset-0 z-[9998] h-screen w-screen overflow-hidden p-0" : "hide-main-scrollbar h-[calc(100vh-4rem)] overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8"} min-h-0 min-w-0 flex-1`}>
          <Outlet />
        </main>
      </div>

      <Dialog open={dailyAlertsOpen} onOpenChange={setDailyAlertsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Pendências do dia</DialogTitle>
            <DialogDescription>Resumo automático exibido uma vez por dia ao abrir o sistema.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <div className="rounded-2xl border bg-warning/10 p-3 text-warning-foreground"><strong>Financeiro:</strong> 7 contas vencidas exigem conferência.</div>
            <div className="rounded-2xl border bg-primary-soft p-3 text-primary"><strong>Pós-venda:</strong> 6 clientes estão no ponto de recompra.</div>
            <div className="rounded-2xl border bg-muted/40 p-3"><strong>Estoque:</strong> 4 produtos precisam de reposição ou recebimento.</div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDailyAlertsOpen(false)}>Fechar</Button>
            <Button onClick={() => { setDailyAlertsOpen(false); navigate({ to: "/notificacoes" }); }}>Abrir central</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={supportOpen} onOpenChange={setSupportOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>Chat e suporte</DialogTitle><DialogDescription>Canal rápido para mensagens do BPO e solicitações de suporte do usuário.</DialogDescription></DialogHeader>
          <div className="space-y-3"><div className="rounded-2xl bg-primary-soft p-3 text-sm text-primary"><strong>BPO Financeiro:</strong> Existem 5 pendências para revisão antes do fechamento mensal.</div><div className="rounded-2xl bg-muted p-3 text-sm text-muted-foreground">Use este espaço para solicitar suporte, documentos, dúvidas de conciliação ou acompanhamento operacional.</div><Textarea value={supportMessage} onChange={(e) => setSupportMessage(e.target.value)} placeholder="Digite sua mensagem..." /></div>
          <DialogFooter><Button variant="outline" onClick={() => setSupportOpen(false)} disabled={supportLoading}>Cancelar</Button><ButtonWithLoading loading={supportLoading} onClick={enviarSuporte} disabled={!supportMessage.trim()}><Send className="mr-2 h-4 w-4" />Enviar</ButtonWithLoading></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function AppLayoutWrapper({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
