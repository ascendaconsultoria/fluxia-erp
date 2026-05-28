import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/fluxia/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModalForm } from "@/components/fluxia/ModalForm";
import { ConfirmDialog } from "@/components/fluxia/ConfirmDialog";
import { useStore } from "@/mock/store";
import { brl, formatDateTime } from "@/lib/format";
import { Search, Eye, Printer, Ban, RotateCcw } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/pdv/historico")({ component: HistoricoPage });

function HistoricoPage() {
  const { s } = useStore();
  const [q, setQ] = useState("");
  const [detalhe, setDetalhe] = useState<(typeof s.vendas)[number] | null>(null);
  const [cancelar, setCancelar] = useState<(typeof s.vendas)[number] | null>(null);
  const vendas = s.vendas.filter((v) => [v.codigo, v.cliente, v.operador, v.formaPagamento].some((x) => String(x ?? "").toLowerCase().includes(q.toLowerCase())));

  return (
    <div className="max-h-[calc(100vh-7rem)] overflow-hidden">
      <PageHeader title="Histórico do PDV" description="Consulte vendas, recibos, cancelamentos e estornos." />
      <Card className="flex h-[calc(100vh-13rem)] min-h-[460px] flex-col overflow-hidden rounded-2xl shadow-soft">
        <div className="sticky top-0 z-10 flex flex-col gap-3 border-b bg-card p-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-md"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar venda, cliente ou operador" className="pl-9" /></div>
          <div className="flex gap-2"><Button variant="outline" size="sm">Hoje</Button><Button variant="outline" size="sm">7 dias</Button><Button size="sm">Mês atual</Button></div>
        </div>
        <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto">
          {vendas.map((v) => (
            <div key={v.id} className="grid gap-3 border-b p-4 text-sm lg:grid-cols-[120px_190px_1fr_150px_150px_160px] lg:items-center">
              <strong>{v.codigo}</strong>
              <span>{formatDateTime(v.data)}</span>
              <span className="text-muted-foreground">{v.cliente || "Consumidor final"}</span>
              <span>{v.formaPagamento}</span>
              <strong className="text-primary">{brl(v.total)}</strong>
              <div className="flex justify-end gap-1"><Button variant="ghost" size="icon" onClick={() => setDetalhe(v)}><Eye className="h-4 w-4" /></Button><Button variant="ghost" size="icon" onClick={() => toast.success("Recibo enviado para impressão")}><Printer className="h-4 w-4" /></Button><Button variant="ghost" size="icon" onClick={() => setCancelar(v)}><Ban className="h-4 w-4" /></Button><Button variant="ghost" size="icon" onClick={() => toast.info("Fluxo de estorno aberto")}><RotateCcw className="h-4 w-4" /></Button></div>
            </div>
          ))}
        </div>
      </Card>
      <ModalForm open={!!detalhe} onOpenChange={(v) => !v && setDetalhe(null)} title={`Venda ${detalhe?.codigo ?? ""}`} saveText="Fechar" onSave={async () => {}}>
        {detalhe && <div className="space-y-2 text-sm"><p><strong>Cliente:</strong> {detalhe.cliente || "Consumidor final"}</p><p><strong>Operador:</strong> {detalhe.operador}</p><p><strong>Pagamento:</strong> {detalhe.formaPagamento}</p><p><strong>Total:</strong> {brl(detalhe.total)}</p></div>}
      </ModalForm>
      <ConfirmDialog open={!!cancelar} onOpenChange={(v) => !v && setCancelar(null)} title="Cancelar venda" description="O cancelamento deve ser autorizado e ficará registrado no histórico." confirmText="Cancelar venda" variant="destructive" successMessage="Venda cancelada" onConfirm={async () => {}} />
    </div>
  );
}
