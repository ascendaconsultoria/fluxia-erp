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
import { StatCard } from "@/components/fluxia/StatCard";
import { FileText, ReceiptText, ArrowDownToLine, ArrowUpFromLine, ShieldCheck, Plus, Settings } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/fiscal")({ component: FiscalPage });

const cfopEntrada = [
  { cfop: "1102", tipo: "Entrada", descricao: "Compra para comercialização dentro do estado", modulo: "Estoque > Recebimento" },
  { cfop: "2102", tipo: "Entrada", descricao: "Compra para comercialização interestadual", modulo: "Estoque > Recebimento" },
  { cfop: "1202", tipo: "Entrada", descricao: "Devolução de venda dentro do estado", modulo: "PDV > Trocas e devoluções" },
];
const cfopSaida = [
  { cfop: "5102", tipo: "Saída", descricao: "Venda de mercadoria adquirida ou recebida de terceiros no estado", modulo: "PDV / Vendas" },
  { cfop: "6102", tipo: "Saída", descricao: "Venda interestadual de mercadoria adquirida ou recebida de terceiros", modulo: "PDV / Vendas" },
  { cfop: "5949", tipo: "Saída", descricao: "Outra saída de mercadoria ou prestação não especificada", modulo: "Fiscal / Operações especiais" },
];

function FiscalPage() {
  const [modal, setModal] = useState(false);
  const [tab, setTab] = useState("CFOP de saída");
  const rows = tab === "CFOP de entrada" ? cfopEntrada : cfopSaida;
  return <div className="custom-scrollbar h-[calc(100vh-8rem)] overflow-y-auto pr-1">
    <PageHeader title="Fiscal" description="Central fiscal para NF-e, NFC-e, CFOP de entrada/saída, natureza de operação e integrações com estoque e financeiro." action={<Button size="sm" onClick={() => setModal(true)}><Plus className="mr-2 h-4 w-4" />Nova regra fiscal</Button>} />
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4"><StatCard title="NFC-e emitidas" value="142" icon={ReceiptText} /><StatCard title="NF-e emitidas" value="38" icon={FileText} /><StatCard title="Entradas fiscais" value="27" icon={ArrowDownToLine} tone="primary" /><StatCard title="Pendências fiscais" value="4" icon={ShieldCheck} tone="warning" /></div>
    <div className="mt-5 grid gap-4 xl:grid-cols-[220px_1fr]">
      <Card className="rounded-2xl p-3 shadow-soft"><p className="px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Fiscal</p><div className="mt-2 space-y-1">{["CFOP de saída", "CFOP de entrada", "Natureza da operação", "NFC-e / NF-e", "Certificado e CSC", "Regras por produto"].map(item => <button key={item} onClick={() => setTab(item)} className={`w-full rounded-xl px-3 py-2 text-left text-sm ${tab === item ? "bg-primary-soft font-semibold text-primary" : "hover:bg-muted"}`}>{item}</button>)}</div></Card>
      <div className="min-w-0 space-y-4"><Card className="rounded-2xl p-5 shadow-soft"><div className="flex items-center justify-between"><div><h3 className="font-semibold">{tab}</h3><p className="text-sm text-muted-foreground">A regra fiscal deve ser determinada por natureza da operação, origem/destino, produto, regime tributário e finalidade.</p></div><Settings className="h-5 w-5 text-primary" /></div></Card>{tab.includes("CFOP") ? <DataTable data={rows} searchKeys={["cfop", "descricao", "modulo"]} pageSize={10} maxHeight="calc(100vh - 28rem)" columns={[{ key: "cfop", header: "CFOP", cell: r => <strong>{r.cfop}</strong> }, { key: "tipo", header: "Tipo", cell: r => r.tipo }, { key: "descricao", header: "Descrição", cell: r => r.descricao }, { key: "modulo", header: "Onde aplicar", cell: r => r.modulo }]} /> : <Card className="rounded-2xl p-5 shadow-soft"><h3 className="font-semibold">{tab}</h3><p className="mt-2 text-sm text-muted-foreground">Área preparada para parametrização fiscal, certificado digital, CSC, ambiente de homologação/produção, contingência e vínculo com produtos.</p></Card>}</div>
    </div>
    <ModalForm open={modal} onOpenChange={setModal} title="Nova regra fiscal" successMessage="Regra fiscal salva" onSave={async () => {}}><div className="grid gap-3 sm:grid-cols-2"><div><Label>Tipo</Label><Select defaultValue="saida"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="entrada">Entrada</SelectItem><SelectItem value="saida">Saída</SelectItem></SelectContent></Select></div><div><Label>CFOP</Label><Input placeholder="Ex.: 5102" /></div><div><Label>Natureza da operação</Label><Input placeholder="Venda de mercadoria" /></div><div><Label>UF destino/origem</Label><Input placeholder="SP, MG, RS..." /></div></div></ModalForm>
  </div>;
}
