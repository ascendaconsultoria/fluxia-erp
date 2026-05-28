import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/fluxia/PageHeader";
import { EstoqueShell } from "@/components/fluxia/ModuleShells";
import { DataTable } from "@/components/fluxia/DataTable";
import { StatCard } from "@/components/fluxia/StatCard";
import { ModalForm } from "@/components/fluxia/ModalForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStore } from "@/mock/store";
import { brl, uid } from "@/lib/format";
import { PackageCheck, FileText, Wallet, AlertTriangle, Plus } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/estoque/recebimento")({ component: RecebimentoPage });

const rows = [
  { nota: "NF-8841", fornecedor: "Beta Import", produto: "Notebook Pro 14\"", qtd: 6, valor: brl(19200), pagamento: "Boleto 3x", status: "A conferir" },
  { nota: "NF-5520", fornecedor: "Alfa Dist", produto: "Café Especial", qtd: 40, valor: brl(740), pagamento: "Pix à vista", status: "Recebido" },
  { nota: "NF-7712", fornecedor: "Delta", produto: "Açúcar Refinado", qtd: 120, valor: brl(540), pagamento: "Boleto 30 dias", status: "A pagar" },
];

function RecebimentoPage() {
  const { s, update } = useStore();
  const [modal, setModal] = useState(false);
  const [pagamento, setPagamento] = useState("Boleto 30 dias");
  const [valor, setValor] = useState(1200);
  const [fornecedor, setFornecedor] = useState(s.fornecedores[0]?.nomeFantasia ?? "Fornecedor");
  const registrar = async () => {
    update((st) => ({
      ...st,
      lancamentos: [{
        id: uid(), tipo: "despesa", descricao: `Recebimento de mercadoria - ${fornecedor}`, categoria: "Compras/Estoque", contraparte: fornecedor,
        vencimento: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10), valor, status: "pendente", conta: "Conta Itaú PJ", forma: pagamento,
      }, ...st.lancamentos],
    }));
    toast.success("Recebimento registrado e conta a pagar criada para conferência.");
  };
  return <EstoqueShell>
    <PageHeader title="Recebimento de mercadorias" description="Entrada de notas, conferência física, vínculo com estoque e geração automática de contas a pagar." action={<Button size="sm" onClick={() => setModal(true)}><Plus className="mr-2 h-4 w-4" />Novo recebimento</Button>} />
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4"><StatCard title="Notas recebidas" value="18" icon={FileText} /><StatCard title="A conferir" value="5" icon={PackageCheck} tone="warning" /><StatCard title="Gerado a pagar" value={brl(21480)} icon={Wallet} /><StatCard title="Divergências" value="2" icon={AlertTriangle} tone="destructive" /></div>
    <div className="mt-5"><DataTable data={rows} searchKeys={["nota", "fornecedor", "produto", "status"]} pageSize={10} maxHeight="calc(100vh - 24rem)" columns={[
      { key: "nota", header: "Nota", cell: r => <strong>{r.nota}</strong> }, { key: "fornecedor", header: "Fornecedor", cell: r => r.fornecedor }, { key: "produto", header: "Produto", cell: r => r.produto }, { key: "qtd", header: "Qtd.", cell: r => r.qtd }, { key: "valor", header: "Valor", cell: r => <strong>{r.valor}</strong> }, { key: "pagamento", header: "Pagamento", cell: r => r.pagamento }, { key: "status", header: "Status", cell: r => r.status },
    ]} /></div>
    <ModalForm open={modal} onOpenChange={setModal} title="Novo recebimento" successMessage="Recebimento salvo" onSave={registrar}>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><Label>Fornecedor</Label><Input value={fornecedor} onChange={(e) => setFornecedor(e.target.value)} /></div>
        <div><Label>Número da nota</Label><Input placeholder="NF-0000" /></div>
        <div><Label>Produto</Label><Input placeholder="Produto recebido" /></div>
        <div><Label>Quantidade</Label><Input type="number" /></div>
        <div><Label>Valor da nota</Label><Input type="number" value={valor} onChange={(e) => setValor(Number(e.target.value))} /></div>
        <div><Label>Pagamento da nota</Label><Select value={pagamento} onValueChange={setPagamento}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["Pix à vista", "Boleto 30 dias", "Boleto 3x", "Cartão", "Transferência"].map(x => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent></Select></div>
      </div>
    </ModalForm>
  </EstoqueShell>
}
