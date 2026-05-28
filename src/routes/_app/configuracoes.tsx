import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/fluxia/PageHeader";
import { StatCard } from "@/components/fluxia/StatCard";
import { DataTable } from "@/components/fluxia/DataTable";
import { ModalForm } from "@/components/fluxia/ModalForm";
import { ConfirmDialog } from "@/components/fluxia/ConfirmDialog";
import { ButtonWithLoading } from "@/components/fluxia/ButtonWithLoading";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStore, SidebarMode, ThemeMode } from "@/mock/store";
import { sleep } from "@/lib/format";
import { toast } from "sonner";
import { Building2, CreditCard, Database, KeyRound, Link2, LockKeyhole, Monitor, Moon, MousePointer2, PanelLeftClose, PanelLeftOpen, Plus, ShieldCheck, SlidersHorizontal, Sun, UsersRound, Workflow } from "lucide-react";

export const Route = createFileRoute("/_app/configuracoes")({ component: ConfigPage });

const themeOptions: { value: ThemeMode; label: string; description: string; icon: typeof Sun }[] = [
  { value: "light", label: "Tema claro", description: "Interface clara para operação em ambientes iluminados.", icon: Sun },
  { value: "dark", label: "Tema escuro", description: "Interface escura para operação com menos brilho.", icon: Moon },
  { value: "system", label: "Automático", description: "Segue o tema configurado no dispositivo.", icon: Monitor },
];

const sidebarOptions: { value: SidebarMode; label: string; description: string; icon: typeof PanelLeftOpen }[] = [
  { value: "expanded", label: "Expandido", description: "Menu aberto com ícones e textos.", icon: PanelLeftOpen },
  { value: "collapsed", label: "Recolhido", description: "Menu compacto apenas com ícones.", icon: PanelLeftClose },
  { value: "auto", label: "Automático por hover", description: "Abre ao passar o mouse e recolhe ao sair.", icon: MousePointer2 },
];

const perfis = [
  { perfil: "Administrador", usuarios: 2, nivel: "Total", descricao: "Acesso completo à empresa e módulos operacionais." },
  { perfil: "Gestor Financeiro", usuarios: 3, nivel: "Financeiro", descricao: "Aprova lançamentos, DRE, conciliação, contas e cartões." },
  { perfil: "Operador PDV", usuarios: 5, nivel: "Operação", descricao: "Opera caixa, vende, cancela com autorização e consulta produtos." },
  { perfil: "BPO Financeiro", usuarios: 4, nivel: "BPO", descricao: "Gerencia clientes BPO, pendências, documentos e comunicação." },
  { perfil: "Vendedor", usuarios: 6, nivel: "Comercial", descricao: "Atua em vendas, clientes, pedidos, funil e comissões." },
];

const modulos = ["Dashboard", "PDV", "Estoque", "Financeiro", "Vendas", "Compras", "BPO", "Relatórios", "Configurações"];
const acoesCriticas = ["Excluir registros", "Alterar preços", "Fechar caixa", "Aprovar descontos", "Exportar dados", "Gerenciar usuários"];

function ConfigPage() {
  const { s, set, reset } = useStore();
  const [loading, setLoading] = useState(false);
  const [novoPerfil, setNovoPerfil] = useState(false);
  const [confirmar, setConfirmar] = useState<string | null>(null);
  const [perfilSelecionado, setPerfilSelecionado] = useState(perfis[0].perfil);

  const salvar = async () => {
    setLoading(true);
    await sleep(700);
    setLoading(false);
    toast.success("Configurações salvas");
  };

  return (
    <div className="h-[calc(100vh-7rem)] overflow-hidden">
      <div className="custom-scrollbar h-full overflow-y-auto pr-1">
        <PageHeader title="Configurações" description="Controle empresa, usuários, permissões, automações, integrações, segurança e aparência do Fluxia." />

        <Tabs defaultValue="permissoes">
          <TabsList className="flex w-full flex-wrap justify-start gap-1 rounded-2xl bg-muted/40 p-1">
            <TabsTrigger value="empresa"><Building2 className="mr-2 h-4 w-4" />Empresa</TabsTrigger>
            <TabsTrigger value="usuarios"><UsersRound className="mr-2 h-4 w-4" />Usuários</TabsTrigger>
            <TabsTrigger value="permissoes"><ShieldCheck className="mr-2 h-4 w-4" />Permissões</TabsTrigger>
            <TabsTrigger value="automacoes"><Workflow className="mr-2 h-4 w-4" />Automações</TabsTrigger>
            <TabsTrigger value="integracoes"><Link2 className="mr-2 h-4 w-4" />Integrações</TabsTrigger>
            <TabsTrigger value="fiscal"><CreditCard className="mr-2 h-4 w-4" />Fiscal/financeiro</TabsTrigger>
            <TabsTrigger value="seguranca"><LockKeyhole className="mr-2 h-4 w-4" />Segurança</TabsTrigger>
            <TabsTrigger value="aparencia"><SlidersHorizontal className="mr-2 h-4 w-4" />Aparência</TabsTrigger>
          </TabsList>

          <TabsContent value="empresa" className="mt-4">
            <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
              <Card className="rounded-2xl p-6 shadow-soft">
                <h3 className="font-semibold">Dados da empresa</h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div><Label>Razão social</Label><Input defaultValue="Tech Solutions LTDA" /></div>
                  <div><Label>CNPJ</Label><Input defaultValue="12.345.678/0001-99" /></div>
                  <div><Label>Nome fantasia</Label><Input defaultValue="Tech Solutions" /></div>
                  <div><Label>Segmento</Label><Input defaultValue="Varejo e serviços" /></div>
                  <div><Label>E-mail financeiro</Label><Input defaultValue="financeiro@techsolutions.com.br" /></div>
                  <div><Label>Telefone</Label><Input defaultValue="(11) 91000-2000" /></div>
                </div>
                <ButtonWithLoading className="mt-5" loading={loading} onClick={salvar}>Salvar empresa</ButtonWithLoading>
              </Card>
              <Card className="rounded-2xl p-6 shadow-soft">
                <h3 className="font-semibold">Ambiente</h3>
                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between rounded-xl bg-muted/40 p-3"><span>Plano</span><strong>Profissional</strong></div>
                  <div className="flex justify-between rounded-xl bg-muted/40 p-3"><span>Usuários</span><strong>18 ativos</strong></div>
                  <div className="flex justify-between rounded-xl bg-muted/40 p-3"><span>Último backup</span><strong>Hoje 02:00</strong></div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="usuarios" className="mt-4">
            <DataTable
              data={s.usuarios}
              searchKeys={["nome", "email", "perfil", "status"]}
              pageSize={10}
              maxHeight="calc(100vh - 26rem)"
              toolbar={<Button size="sm" onClick={() => setNovoPerfil(true)}><Plus className="mr-2 h-4 w-4" />Cadastrar usuário</Button>}
              columns={[
                { key: "nome", header: "Usuário", cell: (r) => <div><p className="font-medium">{r.nome}</p><p className="text-xs text-muted-foreground">{r.email}</p></div> },
                { key: "perfil", header: "Perfil", cell: (r) => r.perfil },
                { key: "ultimo", header: "Último acesso", cell: (r) => r.ultimoAcesso },
                { key: "status", header: "Status", cell: (r) => r.status },
                { key: "acao", header: "Ações", className: "text-right", cell: (r) => <div className="flex justify-end gap-1"><Button variant="ghost" size="sm" onClick={() => setConfirmar(`Editar usuário ${r.nome}`)}>Editar</Button><Button variant="ghost" size="sm" onClick={() => setConfirmar(`Arquivar usuário ${r.nome}`)}>Arquivar</Button><Button variant="ghost" size="sm" className="text-destructive" onClick={() => setConfirmar(`Excluir usuário ${r.nome}`)}>Excluir</Button></div> },
              ]}
            />
          </TabsContent>

          <TabsContent value="permissoes" className="mt-4">
            <div className="grid h-[calc(100vh-16rem)] min-h-0 gap-4 xl:grid-cols-[minmax(240px,25%)_1fr]">
              <Card className="flex min-h-0 flex-col rounded-2xl p-5 shadow-soft">
                <div className="mb-4 flex items-center justify-between gap-2">
                  <div><h3 className="font-semibold">Gerenciador de perfis</h3><p className="text-xs text-muted-foreground">Crie e selecione o perfil antes de ajustar a matriz.</p></div>
                  <Button size="sm" onClick={() => setNovoPerfil(true)}><Plus className="mr-2 h-4 w-4" />Criar Novo Perfil</Button>
                </div>
                <div className="custom-scrollbar min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
                  {perfis.map((p) => (
                    <button key={p.perfil} onClick={() => setPerfilSelecionado(p.perfil)} className={`w-full rounded-2xl border p-3 text-left transition ${perfilSelecionado === p.perfil ? "border-primary bg-primary-soft text-primary" : "hover:bg-muted/40"}`}>
                      <div className="flex items-center justify-between"><p className="font-semibold">{p.perfil}</p><span className="rounded-full bg-background px-2 py-0.5 text-xs font-medium">{p.usuarios} usuários</span></div>
                      <p className="mt-1 text-xs text-muted-foreground">{p.descricao}</p>
                    </button>
                  ))}
                </div>
              </Card>
              <Card className="flex min-h-0 flex-col rounded-2xl p-5 shadow-soft">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div><h3 className="font-semibold">Matriz de ajuste fino: {perfilSelecionado}</h3><p className="text-xs text-muted-foreground">Marque exatamente o que este perfil pode acessar, criar, editar ou excluir.</p></div>
                  <ButtonWithLoading loading={loading} onClick={salvar} size="sm">Salvar permissões</ButtonWithLoading>
                </div>
                <div className="custom-scrollbar min-h-0 flex-1 overflow-auto rounded-2xl border">
                  <table className="w-full min-w-[820px] text-sm">
                    <thead className="sticky top-0 z-10 bg-surface shadow-[0_1px_0_var(--border)]"><tr><th className="p-3 text-left">Módulo / Aba</th>{["Acessar", "Criar", "Editar", "Excluir"].map((h) => <th key={h} className="p-3 text-center">{h}</th>)}</tr></thead>
                    <tbody>{modulos.concat(["Usuários", "Permissões", "Automações", "Segurança", "Importação"]).map((m, i) => <tr key={m} className="border-t"><td className="p-3"><p className="font-medium">{m}</p><p className="text-xs text-muted-foreground">Controle granular aplicado ao perfil selecionado.</p></td>{[0,1,2,3].map((n) => <td key={n} className="p-3 text-center"><Checkbox defaultChecked={perfilSelecionado === "Administrador" || (i < 7 && n < 3)} /></td>)}</tr>)}</tbody>
                  </table>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="automacoes" className="mt-4">
            <Card className="rounded-2xl p-5 shadow-soft">
              <h3 className="font-semibold">Regras automáticas</h3>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {["Gerar tarefa quando conta vencer", "Criar alerta quando estoque atingir mínimo", "Bloquear caixa aberto ao trocar de módulo", "Notificar BPO quando cliente enviar documento", "Gerar cobrança após vencimento", "Nota Fiscal emitida no faturamento → Conciliar automaticamente no Contas a Receber", "Alerta de Inadimplência acima de X% → Bloquear emissão de novos pedidos para o cliente", "Contas a receber vencida há 3 dias → Disparar régua de cobrança via WhatsApp BPO"].map((r) => <div key={r} className="flex items-center justify-between rounded-2xl border p-4"><span className="text-sm font-medium">{r}</span><Switch defaultChecked /></div>)}
              </div>
              <ButtonWithLoading className="mt-5" loading={loading} onClick={salvar}>Salvar automações</ButtonWithLoading>
            </Card>
          </TabsContent>

          <TabsContent value="integracoes" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {["APIs bancárias / Open Finance", "Gateway de pagamento", "Emissor de nota fiscal", "Google Sheets", "WhatsApp operacional", "Webhooks de automação"].map((i) => <Card key={i} className="rounded-2xl p-5 shadow-soft"><Database className="mb-3 h-5 w-5 text-primary" /><h3 className="font-semibold">{i}</h3><p className="mt-1 text-sm text-muted-foreground">Integração coerente para ERP, BPO financeiro e conciliação operacional.</p><Button variant="outline" size="sm" className="mt-4" onClick={() => setConfirmar(`Reconfigurar ${i}`)}>Configurar</Button></Card>)}
            </div>
          </TabsContent>

          <TabsContent value="fiscal" className="mt-4">
            <Card className="rounded-2xl p-6 shadow-soft">
              <h3 className="font-semibold">Parâmetros fiscais e financeiros</h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <div><Label>Regime tributário</Label><Select defaultValue="simples"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="simples">Simples Nacional</SelectItem><SelectItem value="lucro-presumido">Lucro Presumido</SelectItem><SelectItem value="lucro-real">Lucro Real</SelectItem></SelectContent></Select></div>
                <div><Label>Conta padrão de recebimento</Label><Input defaultValue="Itaú PJ" /></div>
                <div><Label>Centro de custo padrão</Label><Input defaultValue="Operacional" /></div>
                <div><Label>Juros por atraso</Label><Input defaultValue="1,00%" /></div>
                <div><Label>Multa por atraso</Label><Input defaultValue="2,00%" /></div>
                <div><Label>Prazo padrão de cobrança</Label><Input defaultValue="7 dias" /></div>
              </div>
              <ButtonWithLoading className="mt-5" loading={loading} onClick={salvar}>Salvar parâmetros</ButtonWithLoading>
            </Card>
          </TabsContent>

          <TabsContent value="seguranca" className="mt-4">
            <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
              <Card className="rounded-2xl p-6 shadow-soft">
                <h3 className="font-semibold">Segurança e conformidade</h3>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {["Autenticação em duas etapas", "Bloquear sessão inativa", "Registrar trilha de auditoria", "Confirmar exclusões críticas", "Exigir motivo para cancelamento", "Restringir exportações", "Expiração automática de sessão", "Rotação de chaves API"].map((item) => <div key={item} className="flex items-center justify-between rounded-2xl border p-4"><span className="text-sm font-medium">{item}</span><Switch defaultChecked /></div>)}
                </div>
                <ButtonWithLoading className="mt-5" loading={loading} onClick={salvar}>Salvar segurança</ButtonWithLoading>
              </Card>
              <Card className="rounded-2xl p-6 shadow-soft">
                <h3 className="font-semibold">Sessões ativas por usuário</h3>
                <div className="mt-4 space-y-3">
                  {["Carlos Silva • 189.44.10.20 • Chrome • agora", "Marina Lopes • 201.13.90.77 • Edge • 18 min", "Operador Caixa • 177.33.41.8 • PDV • 42 min"].map((row) => <div key={row} className="flex items-center justify-between rounded-2xl border p-3 text-sm"><span>{row}</span><Button size="sm" variant="outline" onClick={() => setConfirmar(`Derrubar sessão: ${row}`)}>Derrubar sessão</Button></div>)}
                </div>
              </Card>
              <Card className="xl:col-span-2 rounded-2xl p-6 shadow-soft">
                <h3 className="font-semibold">Logs de exportação de relatórios</h3>
                <div className="mt-4 custom-scrollbar overflow-auto rounded-2xl border" style={{ maxHeight: "280px" }}>
                  <table className="w-full min-w-[760px] text-sm"><thead className="sticky top-0 bg-surface"><tr><th className="p-3 text-left">Usuário</th><th className="p-3 text-left">Cliente</th><th className="p-3 text-left">Arquivo</th><th className="p-3 text-left">Data/Hora</th><th className="p-3 text-left">IP</th></tr></thead><tbody>{[["Marina", "Tech Solutions", "DRE Maio.pdf", "Hoje 10:22", "201.13.90.77"], ["Carlos", "Studio Bella", "Fechamento.xlsx", "Ontem 17:40", "189.44.10.20"], ["Paulo", "Mercado Bom Preço", "Conciliação.pdf", "23/05 09:10", "177.33.41.8"]].map((r) => <tr key={r.join()} className="border-t">{r.map((c) => <td key={c} className="p-3">{c}</td>)}</tr>)}</tbody></table>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="aparencia" className="mt-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <Card className="p-6 shadow-soft"><h3 className="mb-4 font-semibold">Tema do sistema</h3><div className="grid gap-3">{themeOptions.map((option) => { const Icon = option.icon; const active = s.themeMode === option.value; return <button key={option.value} onClick={() => set("themeMode", option.value)} className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition ${active ? "border-primary bg-primary-soft text-primary" : "bg-surface hover:bg-muted/40"}`}><div className={`rounded-xl p-2 ${active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}><Icon className="h-5 w-5" /></div><div><p className="font-semibold">{option.label}</p><p className="mt-1 text-sm text-muted-foreground">{option.description}</p></div></button>; })}</div></Card>
              <Card className="p-6 shadow-soft"><h3 className="mb-4 font-semibold">Menu lateral</h3><div className="grid gap-3">{sidebarOptions.map((option) => { const Icon = option.icon; const active = s.sidebarMode === option.value; return <button key={option.value} onClick={() => set("sidebarMode", option.value)} className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition ${active ? "border-primary bg-primary-soft text-primary" : "bg-surface hover:bg-muted/40"}`}><div className={`rounded-xl p-2 ${active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}><Icon className="h-5 w-5" /></div><div><p className="font-semibold">{option.label}</p><p className="mt-1 text-sm text-muted-foreground">{option.description}</p></div></button>; })}</div><Button variant="outline" className="mt-5" onClick={() => { reset(); toast.info("Dados de demonstração restaurados"); }}>Restaurar demo</Button></Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <ModalForm open={novoPerfil} onOpenChange={setNovoPerfil} title="Novo usuário ou perfil" description="Crie um acesso controlado por função e módulo." successMessage="Acesso criado" onSave={async () => {}}>
        <div className="grid gap-3 sm:grid-cols-2">
          <div><Label>Nome</Label><Input placeholder="Nome do usuário ou perfil" /></div>
          <div><Label>E-mail</Label><Input placeholder="usuario@empresa.com" /></div>
          <div><Label>Perfil base</Label><Select defaultValue="vendedor"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{perfis.map((p) => <SelectItem key={p.perfil} value={p.perfil.toLowerCase().replaceAll(" ", "-")}>{p.perfil}</SelectItem>)}</SelectContent></Select></div>
          <div><Label>Status</Label><Select defaultValue="ativo"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="ativo">Ativo</SelectItem><SelectItem value="bloqueado">Bloqueado</SelectItem></SelectContent></Select></div>
        </div>
      </ModalForm>
      <ConfirmDialog open={!!confirmar} onOpenChange={(v) => !v && setConfirmar(null)} title="Confirmar configuração" description={confirmar ?? "Confirma esta alteração?"} successMessage="Configuração atualizada" onConfirm={async () => {}} />
    </div>
  );
}
