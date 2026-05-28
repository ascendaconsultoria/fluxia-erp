import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/fluxia/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ModalForm } from "@/components/fluxia/ModalForm";
import { DataTable } from "@/components/fluxia/DataTable";
import { StatusBadge } from "@/components/fluxia/StatusBadge";
import { useStore } from "@/mock/store";
import { brl } from "@/lib/format";
import { Users, Truck, Package, Tags, UserCog, CreditCard, Landmark, Building2, Plus, WalletCards, Grid2X2 } from "lucide-react";

export const Route = createFileRoute("/_app/cadastros")({ component: CadastrosPage });

type Tab = "clientes" | "fornecedores" | "produtos" | "categorias" | "bancos" | "pagamentos" | "centros" | "empresas";
const tabs: { id: Tab; label: string; icon: any }[] = [
  { id: "clientes", label: "Clientes", icon: Users },
  { id: "fornecedores", label: "Fornecedores", icon: Truck },
  { id: "produtos", label: "Produtos", icon: Package },
  { id: "categorias", label: "Categorias", icon: Tags },
  { id: "bancos", label: "Bancos", icon: Landmark },
  { id: "pagamentos", label: "Formas de pagamento", icon: CreditCard },
  { id: "centros", label: "Centros de custo", icon: Grid2X2 },
  { id: "empresas", label: "Empresas", icon: Building2 },
];

function CadastrosPage() {
  const { s } = useStore();
  const [tab, setTab] = useState<Tab>("clientes");
  const [modal, setModal] = useState(false);
  const title = tabs.find((t) => t.id === tab)?.label ?? "Cadastros";

  const content = () => {
    if (tab === "clientes") return <DataTable data={s.clientes} searchKeys={["nome", "documento", "email"]} columns={[{ key: "nome", header: "Nome", cell: (r) => <div><p className="font-medium">{r.nome}</p><p className="text-xs text-muted-foreground">{r.documento}</p></div> }, { key: "contato", header: "Contato", cell: (r) => <div>{r.telefone}<p className="text-xs text-muted-foreground">{r.email}</p></div> }, { key: "cidade", header: "Cidade", cell: (r) => `${r.cidade}/${r.estado}` }, { key: "total", header: "Total", cell: (r) => brl(r.totalCompras) }, { key: "status", header: "Status", cell: (r) => <StatusBadge status={r.status} /> }]} />;
    if (tab === "fornecedores") return <DataTable data={s.fornecedores} searchKeys={["razaoSocial", "nomeFantasia", "categoria"]} columns={[{ key: "nome", header: "Fornecedor", cell: (r) => <div><p className="font-medium">{r.nomeFantasia}</p><p className="text-xs text-muted-foreground">{r.razaoSocial}</p></div> }, { key: "cnpj", header: "CNPJ", cell: (r) => r.cnpj }, { key: "cat", header: "Categoria", cell: (r) => r.categoria }, { key: "status", header: "Status", cell: (r) => <StatusBadge status={r.status} /> }]} />;
    if (tab === "produtos") return <DataTable data={s.produtos} searchKeys={["nome", "codigo", "categoria"]} columns={[{ key: "nome", header: "Produto", cell: (r) => <div><p className="font-medium">{r.nome}</p><p className="text-xs text-muted-foreground">{r.codigo}</p></div> }, { key: "cat", header: "Categoria", cell: (r) => r.categoria }, { key: "preco", header: "Preço", cell: (r) => brl(r.preco) }, { key: "estoque", header: "Estoque", cell: (r) => r.estoque }, { key: "status", header: "Status", cell: (r) => <StatusBadge status={r.status} /> }]} />;
    if (tab === "empresas") return <DataTable data={s.empresas} searchKeys={["nomeFantasia", "razaoSocial", "cnpj"]} columns={[{ key: "nome", header: "Empresa", cell: (r) => <div><p className="font-medium">{r.nomeFantasia}</p><p className="text-xs text-muted-foreground">{r.razaoSocial}</p></div> }, { key: "plano", header: "Plano", cell: (r) => r.plano }, { key: "valor", header: "Mensalidade", cell: (r) => brl(r.valorMensal) }, { key: "status", header: "Status", cell: (r) => <StatusBadge status={r.status} /> }]} />;
    const lista = tab === "bancos" ? ["Itaú PJ", "Bradesco Empresas", "Caixa", "Santander"] : tab === "pagamentos" ? ["Pix", "Cartão crédito", "Cartão débito", "Dinheiro", "Boleto", "Conta cliente"] : tab === "centros" ? ["Administrativo", "Comercial", "Operacional", "Marketing", "Logística"] : tab === "categorias" ? ["Receita operacional", "Fornecedores", "Pessoal", "Marketing", "Impostos"] : ["Receita operacional", "Fornecedores", "Pessoal", "Marketing", "Impostos"];
    return <Card className="rounded-2xl p-5 shadow-soft"><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{lista.map((l, i) => <div key={l} className="rounded-2xl border p-4"><p className="font-semibold">{l}</p><p className="mt-1 text-sm text-muted-foreground">Código {String(i + 1).padStart(2, "0")} • ativo para operação</p></div>)}</div></Card>;
  };

  return (
    <div className="grid max-h-[calc(100vh-7rem)] gap-6 overflow-hidden lg:grid-cols-[250px_1fr]">
      <aside className="custom-scrollbar h-[calc(100vh-7rem)] overflow-y-auto pr-2"><p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Cadastros</p>{tabs.map((t) => <button key={t.id} onClick={() => setTab(t.id)} className={`mb-1 flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition ${tab === t.id ? "bg-primary-soft font-medium text-primary" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"}`}><t.icon className="h-4 w-4" /><span className="truncate">{t.label}</span></button>)}</aside>
      <div className="custom-scrollbar min-w-0 overflow-y-auto pr-1"><PageHeader title={title} description="Cadastros centrais que alimentam PDV, estoque, financeiro, compras e BPO." action={<Button onClick={() => setModal(true)}><Plus className="mr-2 h-4 w-4" />Novo cadastro</Button>} />{content()}</div>
      <ModalForm open={modal} onOpenChange={setModal} title={`Novo registro em ${title}`} successMessage="Cadastro salvo" onSave={async () => {}}><div className="grid gap-3 sm:grid-cols-2"><div><Label>Nome</Label><Input /></div><div><Label>Documento/Código</Label><Input /></div><div><Label>Status</Label><Select><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent><SelectItem value="ativo">Ativo</SelectItem><SelectItem value="inativo">Inativo</SelectItem></SelectContent></Select></div><div><Label>Responsável</Label><Input /></div></div></ModalForm>
    </div>
  );
}
