import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/fluxia/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useStore } from "@/mock/store";
import { User, ShieldCheck, Clock, Upload, Save, KeyRound, Store, MonitorCog } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/perfil")({ component: PerfilPage });

function PerfilPage() {
  const { s } = useStore();
  const [nome, setNome] = useState("Carlos Silva");
  const [email, setEmail] = useState("carlos@techsolutions.com.br");
  return <div className="hide-main-scrollbar h-[calc(100vh-8rem)] overflow-y-auto pr-1">
    <PageHeader title="Perfil do usuário" description="Dados pessoais, acesso, segurança, preferências do PDV e histórico de atividade." action={<Button size="sm" onClick={() => toast.success("Perfil salvo no mock") }><Save className="mr-2 h-4 w-4" />Salvar perfil</Button>} />
    <div className="grid gap-4 xl:grid-cols-[340px_1fr]">
      <Card className="rounded-3xl p-6 text-center shadow-soft">
        <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-secondary text-secondary-foreground"><User className="h-12 w-12" /></div>
        <h2 className="mt-4 text-xl font-semibold">{nome}</h2>
        <p className="text-sm text-muted-foreground">{s.perfil} • {s.empresaAtual}</p>
        <Button variant="outline" className="mt-5 w-full"><Upload className="mr-2 h-4 w-4" />Alterar foto</Button>
        <div className="mt-5 space-y-2 text-left text-sm">
          <div className="rounded-xl border p-3"><strong>Último acesso</strong><p className="text-xs text-muted-foreground">Hoje às 10:42</p></div>
          <div className="rounded-xl border p-3"><strong>Status</strong><p className="text-xs text-primary">Ativo e verificado</p></div>
        </div>
      </Card>
      <div className="grid gap-4">
        <Card className="rounded-3xl p-5 shadow-soft"><div className="mb-4 flex items-center gap-2"><User className="h-5 w-5 text-primary" /><h3 className="font-semibold">Dados do usuário</h3></div><div className="grid gap-3 sm:grid-cols-2"><div><Label>Nome</Label><Input value={nome} onChange={(e)=>setNome(e.target.value)} /></div><div><Label>E-mail</Label><Input value={email} onChange={(e)=>setEmail(e.target.value)} /></div><div><Label>Telefone</Label><Input defaultValue="(11) 99999-0000" /></div><div><Label>Cargo</Label><Input defaultValue="Administrador" /></div></div></Card>
        <Card className="rounded-3xl p-5 shadow-soft"><div className="mb-4 flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" /><h3 className="font-semibold">Acesso e segurança</h3></div><div className="grid gap-3 sm:grid-cols-2"><div><Label>Perfil</Label><Select defaultValue={s.perfil}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["Administrador","Operador PDV","Gestor Financeiro","Gestor de Estoque","Vendedor"].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select></div><div><Label>Senha</Label><Button variant="outline" className="w-full justify-start"><KeyRound className="mr-2 h-4 w-4" />Alterar senha</Button></div><label className="flex items-center justify-between rounded-xl border p-3"><span><strong>2FA</strong><p className="text-xs text-muted-foreground">Autenticação em duas etapas</p></span><Switch defaultChecked /></label><label className="flex items-center justify-between rounded-xl border p-3"><span><strong>Alertas de login</strong><p className="text-xs text-muted-foreground">Avisar novos dispositivos</p></span><Switch defaultChecked /></label></div></Card>
        <Card className="rounded-3xl p-5 shadow-soft"><div className="mb-4 flex items-center gap-2"><MonitorCog className="h-5 w-5 text-primary" /><h3 className="font-semibold">Preferências operacionais</h3></div><div className="grid gap-3 sm:grid-cols-3"><div><Label>Tela inicial</Label><Input defaultValue="Dashboard" /></div><div><Label>PDV padrão</Label><Input defaultValue="PDV 01" /></div><div><Label>Loja</Label><Input defaultValue="Loja Matriz" /></div><div><Label>Tema</Label><Input defaultValue="Sistema" /></div><div><Label>Notificações</Label><Input defaultValue="Todas" /></div><div><Label>Calendário</Label><Input defaultValue="Google Agenda" /></div></div></Card>
        <Card className="rounded-3xl p-5 shadow-soft"><div className="mb-4 flex items-center gap-2"><Clock className="h-5 w-5 text-primary" /><h3 className="font-semibold">Histórico recente</h3></div><div className="space-y-2 text-sm">{["Login realizado", "Venda PDV V1024 finalizada", "Conta a pagar cadastrada", "Produto editado"].map((h,i)=><div key={h} className="flex items-center justify-between rounded-xl border p-3"><span>{h}</span><span className="text-xs text-muted-foreground">{i+1}h atrás</span></div>)}</div></Card>
      </div>
    </div>
  </div>
}
