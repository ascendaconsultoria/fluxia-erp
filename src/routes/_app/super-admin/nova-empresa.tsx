import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/fluxia/PageHeader";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ButtonWithLoading } from "@/components/fluxia/ButtonWithLoading";
import { ModalForm } from "@/components/fluxia/ModalForm";
import { useStore } from "@/mock/store";
import { brl, sleep, uid } from "@/lib/format";
import { CheckCircle2, Building2, CreditCard, UserPlus, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/super-admin/nova-empresa")({ component: NovaEmpresa });

function NovaEmpresa() {
  const { update } = useStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [form, setForm] = useState({ razaoSocial: "", nomeFantasia: "", cnpj: "", email: "", telefone: "", segmento: "Serviços", plano: "Profissional", responsavel: "", valorMensal: 599, adminEmail: "", adminNome: "" });
  const modulos = ["Financeiro", "PDV", "Estoque", "BPO", "Vendas", "Compras", "Relatórios", "Portal do Cliente"];
  const salvar = async () => {
    if (!form.razaoSocial || !form.cnpj || !form.adminEmail) { toast.error("Preencha razão social, CNPJ e e-mail do administrador"); return; }
    setLoading(true); await sleep(700);
    update((st) => ({ ...st, empresas: [{ id: uid(), razaoSocial: form.razaoSocial, nomeFantasia: form.nomeFantasia || form.razaoSocial, cnpj: form.cnpj, email: form.email, telefone: form.telefone, segmento: form.segmento, plano: form.plano, status: "ativo", responsavel: form.responsavel, valorMensal: form.valorMensal, dataCadastro: new Date().toISOString().slice(0, 10), ultimoAcesso: new Date().toISOString().slice(0, 10), usuarios: 1 }, ...st.empresas] }));
    setLoading(false); setSucesso(true);
  };
  return (
    <div className="hide-main-scrollbar h-[calc(100vh-8rem)] overflow-y-auto pr-1">
      <PageHeader title="Provisionar nova empresa" description="Cadastre a empresa, defina plano, módulos liberados e usuário administrador em uma única tela." />
      <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="rounded-2xl p-5 shadow-soft"><div className="mb-4 flex items-center gap-2"><Building2 className="h-4 w-4 text-primary" /><h3 className="font-semibold">Dados da empresa</h3></div><div className="grid gap-3 sm:grid-cols-2"><div className="sm:col-span-2"><Label>Razão social*</Label><Input value={form.razaoSocial} onChange={(e) => setForm({ ...form, razaoSocial: e.target.value })} /></div><div><Label>Nome fantasia</Label><Input value={form.nomeFantasia} onChange={(e) => setForm({ ...form, nomeFantasia: e.target.value })} /></div><div><Label>CNPJ*</Label><Input value={form.cnpj} onChange={(e) => setForm({ ...form, cnpj: e.target.value })} placeholder="00.000.000/0000-00" /></div><div><Label>E-mail</Label><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div><div><Label>Telefone</Label><Input value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} /></div></div></Card>
          <Card className="rounded-2xl p-5 shadow-soft"><div className="mb-4 flex items-center gap-2"><CreditCard className="h-4 w-4 text-primary" /><h3 className="font-semibold">Plano e assinatura</h3></div><div className="grid gap-3 sm:grid-cols-2"><div><Label>Segmento</Label><Select value={form.segmento} onValueChange={(v) => setForm({ ...form, segmento: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["Tecnologia", "Alimentação", "Serviços", "Varejo", "Beleza", "Automotivo", "Contabilidade"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div><div><Label>Plano</Label><Select value={form.plano} onValueChange={(v) => setForm({ ...form, plano: v, valorMensal: v === "Starter" ? 299 : v === "Profissional" ? 599 : v === "BPO" ? 899 : 0 })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["Starter", "Profissional", "BPO", "Enterprise"].map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select></div><div><Label>Valor mensal</Label><Input type="number" value={form.valorMensal} onChange={(e) => setForm({ ...form, valorMensal: Number(e.target.value) })} /></div><div><Label>Responsável comercial</Label><Input value={form.responsavel} onChange={(e) => setForm({ ...form, responsavel: e.target.value })} /></div></div></Card>
          <Card className="rounded-2xl p-5 shadow-soft"><div className="mb-4 flex items-center gap-2"><UserPlus className="h-4 w-4 text-primary" /><h3 className="font-semibold">Administrador da empresa</h3></div><div className="grid gap-3 sm:grid-cols-2"><div><Label>Nome</Label><Input value={form.adminNome} onChange={(e) => setForm({ ...form, adminNome: e.target.value })} /></div><div><Label>E-mail*</Label><Input value={form.adminEmail} onChange={(e) => setForm({ ...form, adminEmail: e.target.value })} /></div><div className="sm:col-span-2"><Label>Convite</Label><div className="mt-1 flex items-center justify-between rounded-xl border p-3 text-sm"><span>Enviar convite por e-mail</span><Switch defaultChecked /></div></div></div></Card>
          <Card className="rounded-2xl p-5 shadow-soft"><div className="mb-4 flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /><h3 className="font-semibold">Módulos liberados</h3></div><div className="grid gap-2 sm:grid-cols-2">{modulos.map((m, i) => <div key={m} className="flex items-center justify-between rounded-xl border bg-muted/20 p-3 text-sm"><span>{m}</span><Switch defaultChecked={i < 6 || form.plano === "BPO" || form.plano === "Enterprise"} /></div>)}</div></Card>
        </div>
        <Card className="h-fit rounded-2xl p-5 shadow-soft"><h3 className="font-semibold">Resumo do provisionamento</h3><div className="mt-4 space-y-3 text-sm"><div className="flex justify-between"><span className="text-muted-foreground">Empresa</span><strong className="text-right">{form.nomeFantasia || form.razaoSocial || "Não informado"}</strong></div><div className="flex justify-between"><span className="text-muted-foreground">Plano</span><strong>{form.plano}</strong></div><div className="flex justify-between"><span className="text-muted-foreground">Mensalidade</span><strong className="text-primary">{form.valorMensal ? brl(form.valorMensal) : "Custom"}</strong></div><div className="flex justify-between"><span className="text-muted-foreground">Admin</span><strong className="text-right">{form.adminEmail || "Não informado"}</strong></div></div><div className="mt-5 flex flex-col gap-2"><ButtonWithLoading loading={loading} onClick={salvar}>Provisionar empresa</ButtonWithLoading><Button variant="outline" onClick={() => navigate({ to: "/super-admin/empresas" })}>Cancelar</Button></div></Card>
      </div>
      <ModalForm open={sucesso} onOpenChange={setSucesso} title="Empresa provisionada com sucesso" saveText="Ir para empresas" successMessage="Redirecionando" onSave={async () => navigate({ to: "/super-admin/empresas" })}><div className="flex flex-col items-center gap-3 py-4 text-center"><div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft text-primary"><CheckCircle2 className="h-7 w-7" /></div><p className="text-sm text-muted-foreground">A empresa <strong className="text-foreground">{form.nomeFantasia || form.razaoSocial}</strong> foi cadastrada e já aparece na base de controle.</p></div></ModalForm>
    </div>
  );
}
