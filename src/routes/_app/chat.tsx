import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Send, Headphones, Users, Building2, UserRound, Plus, Ticket, CheckCircle2, Paperclip, ImageIcon, FileText, FolderPlus, Archive, CircleCheck, Clock3, PlayCircle, type LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/fluxia/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useStore } from "@/mock/store";
import { uid } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/chat")({ component: ChatInternoPage });

type Conversa = { id: string; nome: string; tipo: "Grupo da empresa" | "Usuário" | "Suporte" | "Grupo criado"; subtitulo: string; ultima: string; online: boolean; icon: LucideIcon };
type Mensagem = { de: string; texto: string; hora: string; meu: boolean; conversaId: string; anexo?: string };
type TicketStatus = "Aberto" | "Em atendimento" | "Finalizado" | "Arquivado";
type Chamado = { id: string; titulo: string; categoria: string; prioridade: string; status: TicketStatus; empresa: string; responsavel: string; descricao: string; hora: string };

const baseMessages: Mensagem[] = [
  { conversaId: "grupo-geral", de: "Micaely", texto: "Pessoal, atualizei as pendências do fechamento e deixei os documentos na área de BPO.", hora: "09:12", meu: false },
  { conversaId: "grupo-geral", de: "Você", texto: "Perfeito. Vou revisar e retorno por aqui.", hora: "09:18", meu: true },
  { conversaId: "suporte", de: "Suporte Fluxia", texto: "Chamados abertos por aqui ficam registrados por protocolo para acompanhamento.", hora: "09:20", meu: false },
];

const ticketStatuses: Array<{ status: TicketStatus; icon: LucideIcon }> = [
  { status: "Aberto", icon: Clock3 },
  { status: "Em atendimento", icon: PlayCircle },
  { status: "Finalizado", icon: CircleCheck },
  { status: "Arquivado", icon: Archive },
];

function ChatInternoPage() {
  const { s } = useStore();
  const [busca, setBusca] = useState("");
  const [texto, setTexto] = useState("");
  const [ticketModal, setTicketModal] = useState(false);
  const [groupModal, setGroupModal] = useState(false);
  const [groupDraft, setGroupDraft] = useState({ nome: "", descricao: "", participantes: "" });
  const [customGroups, setCustomGroups] = useState<Conversa[]>([]);
  const [ticketDraft, setTicketDraft] = useState({ titulo: "", categoria: "Dúvida operacional", prioridade: "Normal", descricao: "" });
  const [chamados, setChamados] = useState<Chamado[]>([
    { id: "CH-1042", titulo: "Integração Google Sheets", categoria: "Integração", prioridade: "Alta", status: "Em atendimento", empresa: "Tech Solutions", responsavel: "Suporte N2", descricao: "Validação da sincronização automática.", hora: "Hoje 10:12" },
    { id: "CH-1041", titulo: "PDV não fecha caixa", categoria: "PDV", prioridade: "Crítica", status: "Aberto", empresa: "Loja Matriz", responsavel: "Sem responsável", descricao: "Operador relatou bloqueio ao finalizar caixa.", hora: "Hoje 09:41" },
    { id: "CH-1038", titulo: "Dúvida sobre NF-e", categoria: "Fiscal", prioridade: "Normal", status: "Finalizado", empresa: "Mercado Bom Preço", responsavel: "Suporte Fiscal", descricao: "Orientação de CFOP finalizada.", hora: "Ontem" },
  ]);
  const [selectedTicketId, setSelectedTicketId] = useState("CH-1041");
  const [mensagens, setMensagens] = useState<Mensagem[]>(baseMessages);

  const isSuperAdmin = s.perfil === "Super Admin";

  const conversas = useMemo<Conversa[]>(() => {
    const usuarios = s.usuarios.filter((user) => user.nome !== "Carlos Silva").slice(0, 8).map((user) => ({
      id: `user-${user.id}`,
      nome: user.nome,
      tipo: "Usuário" as const,
      subtitulo: user.perfil,
      ultima: user.perfil === "BPO Financeiro" ? "Disponível para suporte BPO" : "Usuário disponível no sistema",
      online: ["Administrador", "BPO Financeiro", "Operador PDV"].includes(user.perfil),
      icon: UserRound,
    }));
    return [
      { id: "grupo-geral", nome: `${s.empresaAtual} • Grupo geral`, tipo: "Grupo da empresa", subtitulo: "Todos os usuários da empresa", ultima: "Conversa geral da operação", online: true, icon: Building2 },
      ...customGroups,
      { id: "suporte", nome: "Suporte Fluxia", tipo: "Suporte", subtitulo: "Chamados e atendimento técnico", ultima: chamados[0]?.titulo ?? "Abrir novo chamado", online: true, icon: Headphones },
      ...usuarios,
    ];
  }, [s.empresaAtual, s.usuarios, chamados, customGroups]);

  const [ativaId, setAtivaId] = useState("grupo-geral");
  const ativa = conversas.find((item) => item.id === ativaId) ?? conversas[0];
  const filtradas = conversas.filter((item) => [item.nome, item.subtitulo, item.tipo].some((value) => value.toLowerCase().includes(busca.toLowerCase())));
  const mensagensAtivas = mensagens.filter((m) => m.conversaId === ativa.id);
  const selectedTicket = chamados.find((ticket) => ticket.id === selectedTicketId) ?? chamados[0];

  const enviarMensagem = () => {
    if (!texto.trim()) return;
    const conversaId = isSuperAdmin ? `ticket-${selectedTicket?.id ?? "geral"}` : ativa.id;
    setMensagens((prev) => [...prev, { conversaId, de: "Você", texto: texto.trim(), hora: "Agora", meu: true }]);
    setTexto("");
    toast.success("Mensagem enviada e registrada no chat.");
  };

  const anexar = (tipo: "imagem" | "arquivo" | "documento") => {
    setMensagens((prev) => [...prev, { conversaId: ativa.id, de: "Você", texto: `${tipo === "imagem" ? "Imagem" : tipo === "arquivo" ? "Arquivo" : "Documento"} anexado para análise`, hora: "Agora", meu: true, anexo: tipo }]);
    toast.success(`${tipo} anexado no mock e preparado para upload no backend.`);
  };

  const criarGrupo = () => {
    if (!groupDraft.nome.trim()) return toast.warning("Informe o nome do grupo.");
    const grupo: Conversa = { id: `grupo-${uid()}`, nome: groupDraft.nome, tipo: "Grupo criado", subtitulo: groupDraft.descricao || "Grupo interno personalizado", ultima: "Grupo criado agora", online: true, icon: Users };
    setCustomGroups((prev) => [grupo, ...prev]);
    setMensagens((prev) => [...prev, { conversaId: grupo.id, de: "Sistema", texto: `Grupo criado com participantes: ${groupDraft.participantes || "a definir"}`, hora: "Agora", meu: false }]);
    setAtivaId(grupo.id);
    setGroupDraft({ nome: "", descricao: "", participantes: "" });
    setGroupModal(false);
    toast.success("Novo grupo criado.");
  };

  const abrirChamado = () => {
    if (!ticketDraft.titulo.trim()) return toast.warning("Informe o título do chamado.");
    const chamado: Chamado = { id: `CH-${String(1043 + chamados.length)}`, titulo: ticketDraft.titulo, categoria: ticketDraft.categoria, prioridade: ticketDraft.prioridade, status: "Aberto", empresa: s.empresaAtual, responsavel: "Sem responsável", descricao: ticketDraft.descricao, hora: "Agora" };
    setChamados((prev) => [chamado, ...prev]);
    setMensagens((prev) => [...prev, { conversaId: "suporte", de: "Você", texto: `Chamado ${chamado.id} aberto: ${chamado.titulo}`, hora: "Agora", meu: true }]);
    setSelectedTicketId(chamado.id);
    setTicketDraft({ titulo: "", categoria: "Dúvida operacional", prioridade: "Normal", descricao: "" });
    setTicketModal(false);
    setAtivaId("suporte");
    toast.success(`${chamado.id} registrado para o suporte.`);
  };

  const moverChamado = (id: string, status: TicketStatus) => {
    setChamados((prev) => prev.map((ticket) => ticket.id === id ? { ...ticket, status, responsavel: status === "Em atendimento" ? "Super Admin" : ticket.responsavel } : ticket));
    toast.success(`Chamado movido para ${status}.`);
  };

  if (isSuperAdmin) {
    const ticketMessages = mensagens.filter((m) => m.conversaId === `ticket-${selectedTicket?.id}`);
    return (
      <div className="flex h-[calc(100vh-8rem)] min-h-0 flex-col overflow-hidden">
        <PageHeader title="Chat de suporte" description="Atendimento por chamado, com filas de status e histórico operacional para Super Admin." action={<Button size="sm" onClick={() => setTicketModal(true)}><Plus className="mr-2 h-4 w-4" />Novo chamado manual</Button>} />
        <div className="grid min-h-0 flex-1 gap-4 overflow-hidden xl:grid-cols-[minmax(0,1.3fr)_420px]">
          <Card className="custom-scrollbar min-h-0 overflow-y-auto rounded-2xl p-4 shadow-soft">
            <div className="mb-4 flex items-center justify-between"><h2 className="font-semibold">Fila de chamados</h2><Input className="max-w-xs" placeholder="Buscar chamado, empresa ou categoria" /></div>
            <div className="grid gap-3 lg:grid-cols-4">
              {ticketStatuses.map(({ status, icon: Icon }) => (
                <div key={status} className="min-h-[460px] rounded-2xl border bg-muted/25 p-3">
                  <div className="mb-3 flex items-center justify-between"><h3 className="flex items-center gap-2 text-sm font-semibold"><Icon className="h-4 w-4" />{status}</h3><span className="rounded-full bg-background px-2 py-0.5 text-xs">{chamados.filter((t) => t.status === status).length}</span></div>
                  <div className="space-y-2">
                    {chamados.filter((ticket) => ticket.status === status).map((ticket) => (
                      <button key={ticket.id} onClick={() => setSelectedTicketId(ticket.id)} className={`w-full rounded-xl border bg-background p-3 text-left shadow-sm ${selectedTicket?.id === ticket.id ? "ring-2 ring-primary" : ""}`}>
                        <div className="flex items-center justify-between gap-2"><strong className="text-sm">{ticket.id}</strong><span className="rounded-full bg-primary-soft px-2 py-0.5 text-[10px] text-primary">{ticket.prioridade}</span></div>
                        <p className="mt-1 text-sm font-medium">{ticket.titulo}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{ticket.empresa} • {ticket.categoria}</p>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="flex min-h-0 flex-col overflow-hidden rounded-2xl shadow-soft">
            <header className="border-b p-4">
              <div className="flex items-start justify-between gap-3"><div><h2 className="font-semibold">{selectedTicket?.id} • {selectedTicket?.titulo}</h2><p className="text-xs text-muted-foreground">{selectedTicket?.empresa} • {selectedTicket?.categoria} • {selectedTicket?.prioridade}</p></div><span className="rounded-full bg-primary-soft px-2 py-1 text-xs text-primary">{selectedTicket?.status}</span></div>
              <div className="mt-3 flex flex-wrap gap-2">{ticketStatuses.map((item) => <Button key={item.status} variant="outline" size="sm" onClick={() => selectedTicket && moverChamado(selectedTicket.id, item.status)}>{item.status}</Button>)}</div>
            </header>
            <div className="custom-scrollbar min-h-0 flex-1 space-y-3 overflow-y-auto bg-muted/20 p-4">
              <div className="rounded-2xl bg-surface p-3 text-sm shadow-soft"><strong>Descrição inicial</strong><p className="mt-1 text-muted-foreground">{selectedTicket?.descricao}</p></div>
              {ticketMessages.length ? ticketMessages.map((m) => <div key={`${m.hora}-${m.texto}`} className={`flex ${m.meu ? "justify-end" : "justify-start"}`}><div className={`max-w-[82%] rounded-2xl p-3 text-sm shadow-soft ${m.meu ? "bg-primary text-primary-foreground" : "bg-surface"}`}><p>{m.texto}</p><p className="mt-1 text-[11px] opacity-70">{m.de} • {m.hora}</p></div></div>) : <p className="text-center text-sm text-muted-foreground">Nenhuma interação registrada neste chamado.</p>}
            </div>
            <footer className="border-t p-3"><div className="grid grid-cols-[1fr_auto] gap-2"><Textarea value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Responder ao chamado selecionado..." className="min-h-12 resize-none" /><Button className="h-full px-5" disabled={!texto.trim()} onClick={enviarMensagem}><Send className="mr-2 h-4 w-4" />Enviar</Button></div></footer>
          </Card>
        </div>
        <TicketDialog open={ticketModal} setOpen={setTicketModal} ticketDraft={ticketDraft} setTicketDraft={setTicketDraft} abrirChamado={abrirChamado} />
      </div>
    );
  }

  return (
    <>
      <div className="flex h-[calc(100vh-8rem)] min-h-0 flex-col overflow-hidden">
        <PageHeader title="Chat interno" description="Grupos por empresa, conversas diretas entre usuários e chamados de suporte registrados por protocolo." action={<div className="flex gap-2"><Button variant="outline" size="sm" onClick={() => setGroupModal(true)}><FolderPlus className="mr-2 h-4 w-4" />Novo grupo</Button><Button size="sm" onClick={() => setTicketModal(true)}><Plus className="mr-2 h-4 w-4" />Abrir chamado</Button></div>} />
        <Card className="grid min-h-0 flex-1 overflow-hidden rounded-2xl shadow-soft lg:grid-cols-[340px_1fr_300px]">
          <aside className="flex min-h-0 flex-col border-r bg-surface/70"><div className="border-b p-3"><div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={busca} onChange={(event) => setBusca(event.target.value)} className="pl-9" placeholder="Buscar grupo, usuário ou suporte" /></div></div><div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto p-2">{filtradas.map((c) => { const Icon = c.icon; const active = ativa.id === c.id; return <button key={c.id} onClick={() => setAtivaId(c.id)} className={`mb-2 flex w-full items-start gap-3 rounded-2xl p-3 text-left transition ${active ? "bg-primary-soft text-primary" : "hover:bg-muted"}`}><div className="rounded-xl bg-background p-2"><Icon className="h-5 w-5" /></div><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><p className="truncate font-semibold">{c.nome}</p>{c.online && <span className="h-2 w-2 rounded-full bg-primary" />}</div><p className="text-xs text-muted-foreground">{c.subtitulo}</p><p className="mt-1 truncate text-xs text-muted-foreground">{c.ultima}</p></div></button>; })}</div></aside>
          <section className="flex min-h-0 flex-col"><header className="flex items-center justify-between border-b p-4"><div><h2 className="font-semibold">{ativa.nome}</h2><p className="text-xs text-muted-foreground">{ativa.tipo} • conversa registrada para histórico e futura integração backend</p></div>{ativa.id === "suporte" ? <Button variant="outline" size="sm" onClick={() => setTicketModal(true)}><Ticket className="mr-2 h-4 w-4" />Novo chamado</Button> : <Button variant="outline" size="sm" onClick={() => toast.info("Resumo da conversa preparado no mock.")}>Gerar resumo</Button>}</header><div className="custom-scrollbar min-h-0 flex-1 space-y-3 overflow-y-auto bg-muted/20 p-5">{mensagensAtivas.length ? mensagensAtivas.map((m) => <div key={`${m.hora}-${m.texto}`} className={`flex ${m.meu ? "justify-end" : "justify-start"}`}><div className={`max-w-[72%] rounded-2xl p-3 text-sm shadow-soft ${m.meu ? "bg-primary text-primary-foreground" : "bg-surface"}`}><p>{m.texto}</p>{m.anexo && <div className="mt-2 rounded-xl bg-black/10 px-3 py-2 text-xs font-semibold">Anexo: {m.anexo}</div>}<p className={`mt-1 text-[11px] ${m.meu ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{m.de} • {m.hora}</p></div></div>) : <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Nenhuma mensagem nesta conversa. Envie a primeira mensagem.</div>}</div><footer className="border-t p-3"><div className="mb-2 flex flex-wrap gap-2"><Button variant="outline" size="sm" onClick={() => anexar("imagem")}><ImageIcon className="mr-2 h-4 w-4" />Imagem</Button><Button variant="outline" size="sm" onClick={() => anexar("arquivo")}><Paperclip className="mr-2 h-4 w-4" />Arquivo</Button><Button variant="outline" size="sm" onClick={() => anexar("documento")}><FileText className="mr-2 h-4 w-4" />Documento</Button></div><div className="grid grid-cols-[1fr_auto] gap-2"><Textarea value={texto} onChange={(e) => setTexto(e.target.value)} placeholder={ativa.id === "suporte" ? "Digite uma mensagem para o suporte ou abra um chamado..." : "Digite uma mensagem interna..."} className="min-h-12 resize-none" /><Button className="h-full px-5" disabled={!texto.trim()} onClick={enviarMensagem}><Send className="mr-2 h-4 w-4" />Enviar</Button></div></footer></section>
          <aside className="custom-scrollbar min-h-0 overflow-y-auto border-l bg-surface/50 p-4"><h3 className="font-semibold">{ativa.id === "suporte" ? "Chamados de suporte" : "Contexto da conversa"}</h3>{ativa.id === "suporte" ? <div className="mt-3 space-y-3">{chamados.map((chamado) => <div key={chamado.id} className="rounded-2xl border bg-background p-3"><div className="flex items-start justify-between gap-2"><strong>{chamado.id}</strong><span className="rounded-full bg-primary-soft px-2 py-0.5 text-[11px] text-primary">{chamado.status}</span></div><p className="mt-1 text-sm font-medium">{chamado.titulo}</p><p className="mt-1 text-xs text-muted-foreground">{chamado.categoria} • {chamado.prioridade} • {chamado.hora}</p></div>)}</div> : <div className="mt-3 space-y-3 text-sm text-muted-foreground"><p>Canal pronto para salvar histórico, anexos, participantes, leitura e tickets vinculados no backend.</p><div className="rounded-2xl border bg-background p-3"><div className="flex items-center gap-2 font-semibold text-foreground"><CheckCircle2 className="h-4 w-4 text-primary" />Recursos preparados</div><ul className="mt-2 list-disc space-y-1 pl-4"><li>Grupo geral por empresa</li><li>Conversas individuais por usuário</li><li>Histórico local mockado</li><li>Chamados vinculados ao suporte</li></ul></div></div>}</aside>
        </Card>
      </div>
      <GroupDialog open={groupModal} setOpen={setGroupModal} groupDraft={groupDraft} setGroupDraft={setGroupDraft} criarGrupo={criarGrupo} />
      <TicketDialog open={ticketModal} setOpen={setTicketModal} ticketDraft={ticketDraft} setTicketDraft={setTicketDraft} abrirChamado={abrirChamado} />
    </>
  );
}

function GroupDialog({ open, setOpen, groupDraft, setGroupDraft, criarGrupo }: any) {
  return <Dialog open={open} onOpenChange={setOpen}><DialogContent className="sm:max-w-xl"><DialogHeader><DialogTitle>Criar novo grupo</DialogTitle><DialogDescription>Crie grupos por operação, setor, cliente, campanha ou equipe interna.</DialogDescription></DialogHeader><div className="grid gap-3"><div><Label>Nome do grupo</Label><Input value={groupDraft.nome} onChange={(event) => setGroupDraft({ ...groupDraft, nome: event.target.value })} placeholder="Ex.: Pós-venda Loja Matriz" /></div><div><Label>Descrição</Label><Input value={groupDraft.descricao} onChange={(event) => setGroupDraft({ ...groupDraft, descricao: event.target.value })} placeholder="Objetivo do grupo" /></div><div><Label>Participantes</Label><Input value={groupDraft.participantes} onChange={(event) => setGroupDraft({ ...groupDraft, participantes: event.target.value })} placeholder="Nomes, e-mails ou perfis separados por vírgula" /></div></div><DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button><Button onClick={criarGrupo}>Criar grupo</Button></DialogFooter></DialogContent></Dialog>;
}

function TicketDialog({ open, setOpen, ticketDraft, setTicketDraft, abrirChamado }: any) {
  return <Dialog open={open} onOpenChange={setOpen}><DialogContent className="sm:max-w-xl"><DialogHeader><DialogTitle>Abrir chamado de suporte</DialogTitle><DialogDescription>Registre uma solicitação para o suporte Fluxia. O chamado fica listado e pode ser integrado ao backend depois.</DialogDescription></DialogHeader><div className="grid gap-3"><div><Label>Título do chamado</Label><Input value={ticketDraft.titulo} onChange={(event) => setTicketDraft({ ...ticketDraft, titulo: event.target.value })} placeholder="Ex: Erro ao finalizar venda no PDV" /></div><div className="grid gap-3 sm:grid-cols-2"><div><Label>Categoria</Label><Input value={ticketDraft.categoria} onChange={(event) => setTicketDraft({ ...ticketDraft, categoria: event.target.value })} /></div><div><Label>Prioridade</Label><Input value={ticketDraft.prioridade} onChange={(event) => setTicketDraft({ ...ticketDraft, prioridade: event.target.value })} /></div></div><div><Label>Descrição</Label><Textarea value={ticketDraft.descricao} onChange={(event) => setTicketDraft({ ...ticketDraft, descricao: event.target.value })} placeholder="Descreva o que aconteceu, tela afetada e impacto operacional." /></div></div><DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button><Button onClick={abrirChamado}>Registrar chamado</Button></DialogFooter></DialogContent></Dialog>;
}
