import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Banknote, Clock3, LockKeyhole, RefreshCw, ShieldCheck, UnlockKeyhole, ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/fluxia/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DataTable } from "@/components/fluxia/DataTable";
import { ConfirmDialog } from "@/components/fluxia/ConfirmDialog";
import { brl, uid } from "@/lib/format";
import { useStore } from "@/mock/store";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/pdv/caixa")({ component: CaixaPage });

const history = [
  { id: "CX-005", status: "Fechado", abertura: "07/05/2026, 16:19", fechamento: "07/05/2026, 16:21", operador: "Flávio Oliveira", inicial: 20, final: 75 },
  { id: "CX-004", status: "Fechado", abertura: "07/05/2026, 14:37", fechamento: "07/05/2026, 14:37", operador: "SIMOKE CONFERE Empresa", inicial: 100, final: 150 },
];

function persistState(next: unknown) {
  try { localStorage.setItem("fluxia-store-v1", JSON.stringify(next)); } catch {}
}

function openPdvWindow() {
  if (typeof window === "undefined") return null;
  const width = window.screen?.availWidth || 1440;
  const height = window.screen?.availHeight || 900;
  const features = `popup=yes,left=0,top=0,width=${width},height=${height},resizable=yes,scrollbars=no`;
  const pdv = window.open("about:blank", "fluxia-pdv", features);
  if (pdv) {
    pdv.document.write(`<!doctype html><html><head><title>Fluxia PDV</title><style>html,body{height:100%;margin:0;background:#0b1110;color:#e5f6ef;font-family:Inter,Arial,sans-serif}main{height:100%;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:14px}.loader{width:44px;height:44px;border:4px solid rgba(16,185,129,.2);border-top-color:#10b981;border-radius:50%;animation:spin .8s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}strong{font-size:22px}</style></head><body><main><div class="loader"></div><strong>Abrindo Fluxia PDV...</strong><span>Preparando frente de caixa em tela maximizada.</span></main></body></html>`);
    pdv.document.close();
    try { pdv.moveTo(0, 0); pdv.resizeTo(width, height); } catch {}
    pdv.focus();
  }
  const url = `${window.location.origin}/pdv?modo=caixa&fullscreen=1`;
  window.setTimeout(() => {
    if (pdv && !pdv.closed) pdv.location.href = url;
    else window.open(url, "fluxia-pdv", features)?.focus();
  }, 60);
  return pdv;
}

function CaixaPage() {
  const { s, update } = useStore();
  const [openingAmount, setOpeningAmount] = useState("0,00");
  const [closingAmount, setClosingAmount] = useState("0,00");
  const [closingNote, setClosingNote] = useState("");
  const [closeConfirm, setCloseConfirm] = useState(false);
  const isOpen = s.caixaAberto;
  const vendasDoCaixa = s.vendas.filter((v) => v.status === "concluida").slice(0, 8);
  const totalVendas = vendasDoCaixa.reduce((acc, venda) => acc + venda.total, 0);

  const openCash = () => {
    const pdvWindow = openPdvWindow();
    const value = Number(openingAmount.replace(/\./g, "").replace(",", ".")) || 0;
    update((state) => {
      const next = { ...state, caixaAberto: true, caixaSaldoInicial: value, caixaOperador: state.caixaOperador || "Carlos Silva" };
      persistState(next);
      try { window.dispatchEvent(new Event("fluxia-store-sync")); } catch {}
      return next;
    });
    try { pdvWindow?.focus(); } catch {}
    toast.success("Caixa aberto. Frente de caixa aberta em guia maximizada.");
  };

  const closeCash = async () => {
    update((state) => {
      const next = { ...state, caixaAberto: false, caixaSaldoInicial: 0, caixaOperador: "" };
      persistState(next);
      return next;
    });
    toast.success("Caixa fechado. PDV bloqueado para novas vendas.");
  };

  return (
    <div className="custom-scrollbar h-[calc(100vh-8rem)] overflow-y-auto pr-1">
      <PageHeader
        title="Abertura e Fechamento de Caixa"
        description="Controle operacional do caixa obrigatório para iniciar vendas no PDV."
        action={<Button variant="outline" size="sm" onClick={() => toast.success("Status do caixa atualizado.")}><RefreshCw className="mr-2 h-4 w-4" />Atualizar</Button>}
      />

      <section className={`rounded-2xl border p-4 ${isOpen ? "border-primary/30 bg-primary/10 text-primary" : "border-sky-300 bg-sky-50 text-sky-900"}`}>
        <div className="flex items-start gap-3">
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-background/80">
            {isOpen ? <UnlockKeyhole size={20} /> : <LockKeyhole size={20} />}
          </span>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide">{isOpen ? "Caixa aberto para venda" : "Venda bloqueada"}</p>
            <h2 className="text-xl font-bold text-foreground">{isOpen ? "Frente de caixa liberada" : "Abra o caixa do dia antes de iniciar vendas."}</h2>
            {isOpen && <p className="mt-1 text-sm text-muted-foreground">Operador: {s.caixaOperador || "Carlos Silva"} • Saldo inicial {brl(s.caixaSaldoInicial)}</p>}
          </div>
        </div>
      </section>

      <section className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Card className="rounded-2xl p-4 shadow-soft">
          <div className="mb-4 flex items-center gap-2 text-foreground"><Banknote size={18} /><h2 className="text-lg font-semibold">{isOpen ? "Fechar caixa atual" : "Abrir caixa do dia"}</h2></div>
          {isOpen ? (
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border bg-muted/30 p-3"><p className="text-xs text-muted-foreground">Valor inicial</p><p className="mt-1 text-lg font-bold">{brl(s.caixaSaldoInicial)}</p></div>
                <div className="rounded-xl border bg-muted/30 p-3"><p className="text-xs text-muted-foreground">Vendas no caixa</p><p className="mt-1 text-lg font-bold text-primary">{brl(totalVendas)}</p></div>
                <div className="rounded-xl border bg-muted/30 p-3"><p className="text-xs text-muted-foreground">Status</p><p className="mt-1 text-lg font-bold">Regular</p></div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div><Label>Valor final conferido</Label><Input value={closingAmount} onChange={(e) => setClosingAmount(e.target.value)} /></div>
                <div><Label>Operador</Label><Input value={s.caixaOperador || "Carlos Silva"} readOnly /></div>
                <div className="sm:col-span-2"><Label>Observações do fechamento</Label><Textarea value={closingNote} onChange={(e) => setClosingNote(e.target.value)} placeholder="Divergência, sangria, conferência de cartões..." /></div>
              </div>
              <div className="flex flex-wrap gap-2"><Button onClick={openPdvWindow}><ExternalLink className="mr-2 h-4 w-4" />Abrir frente de caixa</Button><Button variant="destructive" onClick={() => setCloseConfirm(true)}>Fechar caixa</Button></div>
            </div>
          ) : (
            <div className="max-w-xl space-y-3">
              <div><Label>Valor inicial</Label><Input value={openingAmount} onChange={(e) => setOpeningAmount(e.target.value)} placeholder="0,00" /></div>
              <Button onClick={openCash}><UnlockKeyhole className="mr-2 h-4 w-4" />Abrir caixa e iniciar PDV</Button>
            </div>
          )}
        </Card>

        <Card className="rounded-2xl p-4 shadow-soft">
          <div className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" /><h3 className="font-semibold">Regras aplicadas</h3></div>
          <div className="mt-4 space-y-3 text-sm text-muted-foreground">
            <p>Venda só é confirmada se existir caixa aberto no dia.</p>
            <p>Caixa aberto por mais de 24 horas bloqueia novas vendas.</p>
            <p>Caixa vencido precisa ser fechado antes de uma nova abertura.</p>
            <div className="rounded-xl border bg-muted/40 p-3"><Clock3 className="mb-2 h-4 w-4 text-primary" /><strong className="text-foreground">Última movimentação</strong><p>Fechado em 07/05/2026, 16:21</p></div>
          </div>
        </Card>
      </section>

      <Card className="mt-4 overflow-hidden rounded-2xl shadow-soft">
        <div className="border-b p-4"><h3 className="font-semibold">Histórico de caixa</h3><p className="text-xs text-muted-foreground">Últimas aberturas e fechamentos em memória da API.</p></div>
        <DataTable data={history} pageSize={10} compact searchKeys={["status", "operador"]} columns={[
          { key: "status", header: "Status", cell: (r) => <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">{r.status}</span> },
          { key: "abertura", header: "Abertura", cell: (r) => r.abertura },
          { key: "fechamento", header: "Fechamento", cell: (r) => r.fechamento },
          { key: "operador", header: "Operador", cell: (r) => r.operador },
          { key: "inicial", header: "Inicial", className: "text-right", cell: (r) => <strong>{brl(r.inicial)}</strong> },
          { key: "final", header: "Final", className: "text-right", cell: (r) => brl(r.final) },
        ]} />
      </Card>

      <ConfirmDialog open={closeConfirm} onOpenChange={setCloseConfirm} title="Fechar caixa atual" description="Confirme somente após conferir dinheiro, cartões, Pix, sangrias e suprimentos." variant="destructive" confirmText="Fechar caixa" successMessage="Caixa fechado" onConfirm={closeCash} />
    </div>
  );
}
