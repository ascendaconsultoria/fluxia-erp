import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/fluxia/PageHeader";
import { EstoqueShell } from "@/components/fluxia/ModuleShells";
import { DataTable } from "@/components/fluxia/DataTable";
import { ModalForm } from "@/components/fluxia/ModalForm";
import { ConfirmDialog } from "@/components/fluxia/ConfirmDialog";
import { StatCard } from "@/components/fluxia/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeftRight, ArrowDownToLine, ArrowUpFromLine, Plus, CheckCircle2 } from "lucide-react";
import { brl, uid } from "@/lib/format";
import { useStore } from "@/mock/store";

export const Route = createFileRoute("/_app/estoque/movimentacoes")({ component: MovimentacoesPage });

const movimentos = [
  { codigo: "MOV-118", produto: "Café Especial 250g", tipo: "Entrada", qtd: 32, origem: "Compra", valor: brl(560), responsavel: "Carlos" },
  { codigo: "MOV-117", produto: "Pão Francês kg", tipo: "Saída", qtd: 18, origem: "PDV", valor: brl(268.2), responsavel: "Marina" },
  { codigo: "MOV-116", produto: "Mouse Wireless", tipo: "Ajuste", qtd: -2, origem: "Inventário", valor: brl(90), responsavel: "Ana" },
  { codigo: "MOV-115", produto: "Caneta Gel azul", tipo: "Transferência", qtd: 40, origem: "Depósito A", valor: brl(64), responsavel: "Carlos" },
];

function MovimentacoesPage() {
  const { update } = useStore();
  const [modal, setModal] = useState(false);
  const [confirmar, setConfirmar] = useState<string | null>(null);
  const [tipo, setTipo] = useState("entrada");
  const [pagamento, setPagamento] = useState("Boleto 30 dias");
  const [valorNota, setValorNota] = useState(800);
  const [fornecedor, setFornecedor] = useState("Fornecedor não informado");
  return (
    <EstoqueShell>
      <PageHeader title="Movimentações de estoque" description="Histórico de entradas, saídas, ajustes, transferências e perdas." action={<Button size="sm" onClick={() => setModal(true)}><Plus className="mr-2 h-4 w-4" />Nova movimentação</Button>} />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4"><StatCard title="Entradas" value="34" icon={ArrowDownToLine} tone="primary" /><StatCard title="Saídas" value="87" icon={ArrowUpFromLine} /><StatCard title="Ajustes" value="6" icon={ArrowLeftRight} tone="warning" /><StatCard title="Conferidas" value="92%" icon={CheckCircle2} /></div>
      <div className="mt-5"><DataTable data={movimentos} searchKeys={["codigo", "produto", "tipo", "origem", "responsavel"]} pageSize={10} maxHeight="calc(100vh - 27rem)" columns={[
        { key: "codigo", header: "Código", cell: (r) => <strong>{r.codigo}</strong> },
        { key: "produto", header: "Produto", cell: (r) => r.produto },
        { key: "tipo", header: "Tipo", cell: (r) => r.tipo },
        { key: "qtd", header: "Qtd.", cell: (r) => <span className={r.qtd < 0 ? "text-destructive" : "text-primary"}>{r.qtd}</span> },
        { key: "origem", header: "Origem", cell: (r) => r.origem },
        { key: "valor", header: "Valor", cell: (r) => r.valor },
        { key: "acao", header: "", className: "text-right", cell: (r) => <Button variant="ghost" size="sm" onClick={() => setConfirmar(r.codigo)}>Conferir</Button> },
      ]} /></div>
      <ModalForm open={modal} onOpenChange={setModal} title="Nova movimentação de estoque" successMessage="Movimentação registrada" onSave={async () => {
        if (tipo === "entrada") {
          update((st) => ({ ...st, lancamentos: [{ id: uid(), tipo: "despesa", descricao: `Entrada de estoque - ${fornecedor}`, categoria: "Compras/Estoque", contraparte: fornecedor, vencimento: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10), valor: valorNota, status: "pendente", conta: "Conta Itaú PJ", forma: pagamento }, ...st.lancamentos] }));
        }
      }}>
        <div className="grid gap-3 sm:grid-cols-2"><div><Label>Produto</Label><Input /></div><div><Label>Tipo</Label><Select value={tipo} onValueChange={setTipo}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="entrada">Entrada</SelectItem><SelectItem value="saida">Saída</SelectItem><SelectItem value="ajuste">Ajuste</SelectItem><SelectItem value="perda">Perda</SelectItem></SelectContent></Select></div><div><Label>Quantidade</Label><Input type="number" /></div><div><Label>Local</Label><Input /></div><div><Label>Documento/NF</Label><Input placeholder="NF, pedido ou justificativa" /></div><div><Label>Fornecedor/contraparte</Label><Input value={fornecedor} onChange={(e) => setFornecedor(e.target.value)} /></div><div><Label>Valor da nota</Label><Input type="number" value={valorNota} onChange={(e) => setValorNota(Number(e.target.value))} /></div><div><Label>Pagamento da nota</Label><Select value={pagamento} onValueChange={setPagamento}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Pix à vista">Pix à vista</SelectItem><SelectItem value="Boleto 30 dias">Boleto 30 dias</SelectItem><SelectItem value="Boleto parcelado">Boleto parcelado</SelectItem><SelectItem value="Cartão">Cartão</SelectItem></SelectContent></Select></div></div>
      </ModalForm>
      <ConfirmDialog open={!!confirmar} onOpenChange={(v) => !v && setConfirmar(null)} title="Conferir movimentação" description={`Confirma a conferência de ${confirmar ?? "esta movimentação"}?`} successMessage="Movimentação conferida" onConfirm={async () => {}} />
    </EstoqueShell>
  );
}
