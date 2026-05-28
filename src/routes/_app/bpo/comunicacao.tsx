import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/fluxia/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Search, Send, Building2, Headphones, Users } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/bpo/comunicacao")({ component: ComunicacaoBpoPage });

const conversas = [
  { id: "tech", nome: "Tech Solutions", tipo: "Cliente BPO", ultima: "Enviou extrato bancário", hora: "10:42", icon: Building2, status: "online" },
  { id: "studio", nome: "Studio Bella", tipo: "Cliente BPO", ultima: "Aguardando comprovantes", hora: "09:18", icon: Building2, status: "pendente" },
  { id: "suporte", nome: "Suporte Fluxia", tipo: "Canal técnico", ultima: "Integração bancária ativa", hora: "Ontem", icon: Headphones, status: "online" },
  { id: "interno", nome: "Equipe BPO", tipo: "Canal interno", ultima: "Revisar fechamento crítico", hora: "Ontem", icon: Users, status: "interno" },
];

const mensagens = [
  { meu: false, autor: "Cliente", texto: "Bom dia, subi o extrato e os comprovantes na pasta de maio.", hora: "10:42" },
  { meu: true, autor: "BPO", texto: "Recebido. Vamos validar a conciliação e sinalizo se houver divergência.", hora: "10:44" },
  { meu: false, autor: "Cliente", texto: "Perfeito. O relatório precisa ser enviado até amanhã de manhã.", hora: "10:45" },
];

function ComunicacaoBpoPage() {
  const [ativa, setAtiva] = useState(conversas[0]);
  const [texto, setTexto] = useState("");
  return (
    <div className="flex h-[calc(100vh-8rem)] min-h-0 flex-col overflow-hidden">
      <PageHeader title="Comunicação BPO" description="Chat interno entre analistas BPO, clientes da carteira, usuários da empresa e suporte técnico da plataforma." />
      <Card className="grid min-h-0 flex-1 overflow-hidden rounded-2xl shadow-soft lg:grid-cols-[340px_1fr]">
        <aside className="flex min-h-0 flex-col border-r bg-surface/70">
          <div className="border-b p-3"><div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input className="pl-9" placeholder="Buscar cliente, canal ou mensagem" /></div></div>
          <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto p-2">
            {conversas.map((c) => { const Icon = c.icon; const active = ativa.id === c.id; return <button key={c.id} onClick={() => setAtiva(c)} className={`mb-2 flex w-full items-start gap-3 rounded-2xl p-3 text-left transition ${active ? "bg-primary-soft text-primary" : "hover:bg-muted"}`}><div className="rounded-xl bg-background p-2"><Icon className="h-5 w-5" /></div><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><p className="truncate font-semibold">{c.nome}</p>{c.status === "online" && <span className="h-2 w-2 rounded-full bg-primary" />}</div><p className="text-xs text-muted-foreground">{c.tipo}</p><p className="mt-1 truncate text-xs text-muted-foreground">{c.ultima}</p></div><span className="text-[11px] text-muted-foreground">{c.hora}</span></button> })}
          </div>
        </aside>
        <section className="flex min-h-0 flex-col">
          <header className="flex items-center justify-between border-b p-4"><div><h2 className="font-semibold">{ativa.nome}</h2><p className="text-xs text-muted-foreground">{ativa.tipo} • comunicação interna auditável</p></div><Button variant="outline" size="sm" onClick={() => toast.info("Resumo operacional gerado")}>Resumo</Button></header>
          <div className="custom-scrollbar min-h-0 flex-1 space-y-3 overflow-y-auto bg-muted/20 p-5">
            {mensagens.map((m) => <div key={`${m.hora}-${m.texto}`} className={`flex ${m.meu ? "justify-end" : "justify-start"}`}><div className={`max-w-[74%] rounded-2xl p-3 text-sm shadow-soft ${m.meu ? "bg-primary text-primary-foreground" : "bg-surface"}`}><p>{m.texto}</p><p className={`mt-1 text-[11px] ${m.meu ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{m.autor} • {m.hora}</p></div></div>)}
          </div>
          <footer className="border-t p-3"><div className="grid grid-cols-[1fr_auto] gap-2"><Textarea value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Responder no canal interno..." className="min-h-12 resize-none" /><Button className="h-full px-5" disabled={!texto.trim()} onClick={() => { toast.success("Mensagem enviada"); setTexto(""); }}><Send className="mr-2 h-4 w-4" />Enviar</Button></div></footer>
        </section>
      </Card>
    </div>
  );
}
