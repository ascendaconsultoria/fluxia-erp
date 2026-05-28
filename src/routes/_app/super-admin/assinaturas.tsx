import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/fluxia/PageHeader";
import { StatCard } from "@/components/fluxia/StatCard";
import { DataTable } from "@/components/fluxia/DataTable";
import { StatusBadge } from "@/components/fluxia/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/fluxia/ConfirmDialog";
import { ModalForm } from "@/components/fluxia/ModalForm";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore } from "@/mock/store";
import { brl, formatDate } from "@/lib/format";
import { AlertCircle, Building2, CreditCard, DollarSign, MoreHorizontal, Pause, RefreshCw, TrendingUp } from "lucide-react";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Empresa } from "@/mock/data";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/super-admin/assinaturas")({
  component: AssinaturasPage,
});

function AssinaturasPage() {
  const { s, update } = useStore();
  const [pausar, setPausar] = useState<Empresa | null>(null);
  const [trocarPlano, setTrocarPlano] = useState<Empresa | null>(null);
  const empresasAtivas = s.empresas.filter((e) => e.status === "ativo");
  const mrr = empresasAtivas.reduce((acc, e) => acc + e.valorMensal, 0);
  const atrasadas = s.empresas.filter((e) => e.status === "suspenso").length;

  return (
    <>
      <PageHeader
        title="SaaS vendidos e assinaturas"
        description="Acompanhamento das empresas provisionadas, planos vendidos, MRR, status de pagamento e risco de churn."
        action={<Button size="sm" onClick={() => toast.success("Cobrança criada")}><CreditCard className="mr-2 h-4 w-4" />Nova cobrança</Button>}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="SaaS vendidos" value={s.empresas.length} icon={Building2} tone="primary" />
        <StatCard title="MRR atual" value={brl(mrr)} icon={DollarSign} variation={12.4} />
        <StatCard title="Assinaturas ativas" value={empresasAtivas.length} icon={TrendingUp} />
        <StatCard title="Atrasadas/suspensas" value={atrasadas} icon={AlertCircle} tone="warning" />
      </div>

      <Card className="mt-6 p-5 shadow-soft">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold">Controle comercial do SaaS</h3>
            <p className="text-xs text-muted-foreground">Use esta tela para acompanhar contratos vendidos, pagamento, plano e uso do cliente.</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => toast.info("Sincronização concluída")}> <RefreshCw className="mr-2 h-4 w-4" />Sincronizar status</Button>
        </div>
        <DataTable
          data={s.empresas}
          searchKeys={["nomeFantasia", "razaoSocial", "plano", "responsavel", "cnpj"]}
          searchPlaceholder="Buscar empresa, plano, responsável..."
          columns={[
            { key: "empresa", header: "Empresa", cell: (r) => <div><p className="font-medium">{r.nomeFantasia}</p><p className="text-xs text-muted-foreground">{r.cnpj}</p></div> },
            { key: "plano", header: "Plano vendido", cell: (r) => <span className="font-medium">{r.plano}</span> },
            { key: "valor", header: "Mensalidade", cell: (r) => brl(r.valorMensal) },
            { key: "cadastro", header: "Início", cell: (r) => formatDate(r.dataCadastro) },
            { key: "acesso", header: "Último acesso", cell: (r) => formatDate(r.ultimoAcesso) },
            { key: "usuarios", header: "Usuários", cell: (r) => r.usuarios },
            { key: "status", header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
            { key: "acoes", header: "", className: "text-right", cell: (r) => (
              <DropdownMenu>
                <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => toast.info(`Abrindo painel de ${r.nomeFantasia}`)}>Ver uso e cobrança</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTrocarPlano(r)}>Alterar plano</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPausar(r)}><Pause className="mr-2 h-4 w-4" />Pausar assinatura</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) },
          ]}
        />
      </Card>

      <ConfirmDialog open={!!pausar} onOpenChange={(v) => !v && setPausar(null)} title="Pausar assinatura" description="A empresa ficará com status suspenso e perderá acesso até reativação." confirmText="Pausar assinatura" successMessage="Assinatura pausada" onConfirm={() => { if (pausar) update((st) => ({ ...st, empresas: st.empresas.map((e) => e.id === pausar.id ? { ...e, status: "suspenso" } : e) })); }} />

      <ModalForm open={!!trocarPlano} onOpenChange={(v) => !v && setTrocarPlano(null)} title="Alterar plano da assinatura" description="Altere o plano contratado com confirmação antes de salvar." successMessage="Plano atualizado" onSave={async () => { if (trocarPlano) update((st) => ({ ...st, empresas: st.empresas.map((e) => e.id === trocarPlano.id ? { ...e, plano: "Enterprise", valorMensal: 1290 } : e) })); }}>
        <div className="grid gap-3 sm:grid-cols-2">
          <div><Label>Empresa</Label><Input value={trocarPlano?.nomeFantasia ?? ""} readOnly /></div>
          <div><Label>Novo plano</Label><Input defaultValue="Enterprise" /></div>
          <div><Label>Novo valor mensal</Label><Input type="number" defaultValue={1290} /></div>
          <div><Label>Motivo</Label><Input placeholder="Upgrade, negociação, correção..." /></div>
        </div>
      </ModalForm>
    </>
  );
}
