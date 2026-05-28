import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/fluxia/PageHeader";
import { StatCard } from "@/components/fluxia/StatCard";
import { useStore } from "@/mock/store";
import { brl } from "@/lib/format";
import { Banknote, ReceiptText, ShieldCheck, TrendingUp, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/pdv/visao-geral")({ component: VisaoGeralCaixaPage });

function VisaoGeralCaixaPage() {
  const { s } = useStore();
  const vendas = s.vendas.filter((v) => v.status === "concluida").slice(0, 12);
  const total = vendas.reduce((acc, venda) => acc + venda.total, 0);
  const openPdv = () => {
    if (!s.caixaAberto) {
      toast.warning("Abra o caixa antes de iniciar vendas.");
      return;
    }
    window.open(`${window.location.origin}/pdv?modo=caixa&fullscreen=1`, "fluxia-pdv", "popup=yes,width=1440,height=900")?.focus();
  };
  return <div className="custom-scrollbar h-[calc(100vh-8rem)] overflow-y-auto pr-1">
    <PageHeader title="Visão geral do caixa" description="Resumo operacional do caixa atual, status da frente de caixa e últimas vendas." action={<Button onClick={openPdv}><ExternalLink className="mr-2 h-4 w-4" />Abrir frente de caixa</Button>} />
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4"><StatCard title="Status do caixa" value={s.caixaAberto ? "Aberto" : "Fechado"} icon={ShieldCheck} tone={s.caixaAberto ? "primary" : "warning"} /><StatCard title="Saldo inicial" value={brl(s.caixaSaldoInicial)} icon={Banknote} /><StatCard title="Vendas recentes" value={String(vendas.length)} icon={ReceiptText} /><StatCard title="Total vendido" value={brl(total)} icon={TrendingUp} /></div>
    <div className="mt-5 grid gap-4 xl:grid-cols-[1fr_340px]"><Card className="rounded-2xl p-5 shadow-soft"><h3 className="font-semibold">Últimas vendas</h3><div className="mt-4 divide-y rounded-xl border">{vendas.slice(0,8).map(v => <div key={v.id} className="grid gap-2 p-3 text-sm sm:grid-cols-[120px_1fr_120px]"><strong>{v.codigo}</strong><span>{v.cliente || "Consumidor final"} • {v.formaPagamento}</span><strong className="text-right text-primary">{brl(v.total)}</strong></div>)}</div></Card><Card className="rounded-2xl p-5 shadow-soft"><h3 className="font-semibold">Checklist do caixa</h3><div className="mt-4 space-y-3 text-sm"><p className="rounded-xl border p-3">Conferir abertura e operador responsável.</p><p className="rounded-xl border p-3">Acompanhar vendas, cancelamentos e sangrias.</p><p className="rounded-xl border p-3">Fechar caixa no fim do expediente.</p></div></Card></div>
  </div>;
}
