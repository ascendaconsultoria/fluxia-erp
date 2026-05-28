import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/fluxia/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CheckCheck, Trash2, Search, SquareCheckBig, MoreVertical, Archive, Eye } from "lucide-react";

export const Route = createFileRoute("/_app/notificacoes")({ component: NotificacoesPage });

type N = { id: string; titulo: string; modulo: string; tipo: string; canal: string; status: string; hora: string; mensagem: string };

const seed: N[] = [
  { id: "n1", titulo: "Conta vencida", modulo: "Financeiro", tipo: "Crítica", canal: "Sistema", status: "Não lida", hora: "09:12", mensagem: "Boleto #1044 venceu há 4 dias e precisa de ação." },
  { id: "n2", titulo: "Produto abaixo do mínimo", modulo: "Estoque", tipo: "Atenção", canal: "Sistema", status: "Não lida", hora: "10:03", mensagem: "Mouse Wireless está abaixo do estoque mínimo configurado." },
  { id: "n3", titulo: "Pedido de compra atrasado", modulo: "Compras", tipo: "Atenção", canal: "E-mail", status: "Lida", hora: "Ontem", mensagem: "Fornecedor ainda não confirmou o pedido #442." },
  { id: "n4", titulo: "Cliente BPO respondeu", modulo: "BPO", tipo: "Informativa", canal: "Chat", status: "Não lida", hora: "11:30", mensagem: "Tech Solutions enviou uma nova mensagem no canal BPO." },
];

function NotificacoesPage() {
  const [ativas, setAtivas] = useState(seed);
  const [arquivadas, setArquivadas] = useState<N[]>([]);
  const [selecionadas, setSelecionadas] = useState<string[]>([]);
  const [busca, setBusca] = useState("");
  const [aba, setAba] = useState("Principal");

  const lista = aba === "Arquivadas" ? arquivadas : ativas;
  const filtradas = lista.filter((n) => [n.titulo, n.modulo, n.tipo, n.status, n.mensagem].some((v) => v.toLowerCase().includes(busca.toLowerCase())));
  const todasSelecionadas = selecionadas.length === filtradas.length && filtradas.length > 0;
  const idsFiltrados = filtradas.map((n) => n.id);

  const toggleTodas = () => setSelecionadas(todasSelecionadas ? [] : idsFiltrados);
  const markRead = (ids = selecionadas) => {
    setAtivas((prev) => prev.map((n) => ids.includes(n.id) ? { ...n, status: "Lida" } : n));
    setSelecionadas([]);
  };
  const archive = (ids: string[]) => {
    const moving = ativas.filter((n) => ids.includes(n.id));
    setArquivadas((prev) => [...moving.map((n) => ({ ...n, status: "Concluída" })), ...prev]);
    setAtivas((prev) => prev.filter((n) => !ids.includes(n.id)));
    setSelecionadas([]);
  };
  const remove = (ids: string[]) => {
    if (aba === "Arquivadas") setArquivadas((prev) => prev.filter((n) => !ids.includes(n.id)));
    else setAtivas((prev) => prev.filter((n) => !ids.includes(n.id)));
    setSelecionadas([]);
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] min-h-0 flex-col overflow-hidden">
      <PageHeader
        title="Notificações"
        description="Central operacional de alertas, pendências e mensagens do sistema."
        action={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => markRead(ativas.map((n) => n.id))}>
              <CheckCheck className="mr-2 h-4 w-4" />Ler todas
            </Button>
            <Button variant="outline" size="sm" onClick={toggleTodas}>
              <SquareCheckBig className="mr-2 h-4 w-4" />{todasSelecionadas ? "Limpar seleção" : "Selecionar"}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm">
                  <MoreVertical className="mr-2 h-4 w-4" />Ações
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem disabled={!selecionadas.length} onClick={() => markRead()}>
                  <Eye className="mr-2 h-4 w-4" />Marcar selecionadas como lidas
                </DropdownMenuItem>
                <DropdownMenuItem disabled={!selecionadas.length || aba === "Arquivadas"} onClick={() => archive(selecionadas)}>
                  <Archive className="mr-2 h-4 w-4" />Concluir e arquivar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled={!selecionadas.length} onClick={() => remove(selecionadas)} className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />Apagar selecionadas
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => remove(idsFiltrados)} className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />Apagar lista filtrada
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        }
      />

      <Card className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl shadow-soft">
        <div className="flex flex-shrink-0 flex-col gap-3 border-b bg-surface/60 p-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-2">
            <button onClick={() => { setAba("Principal"); setSelecionadas([]); }} className={`rounded-xl px-3 py-2 text-sm ${aba === "Principal" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>Principal</button>
            <button onClick={() => { setAba("Arquivadas"); setSelecionadas([]); }} className={`rounded-xl px-3 py-2 text-sm ${aba === "Arquivadas" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>Arquivadas</button>
          </div>
          <div className="relative max-w-2xl flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
            <Input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por módulo, tipo, status ou mensagem..." className="pl-9"/>
          </div>
          <p className="text-xs text-muted-foreground">{filtradas.length} registro(s) • {selecionadas.length} selecionado(s)</p>
        </div>

        <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto">
          {filtradas.map((n) => (
            <div key={n.id} className={`grid gap-3 border-b p-4 transition hover:bg-muted/30 lg:grid-cols-[28px_1fr_auto] ${selecionadas.includes(n.id) ? "bg-primary-soft/70" : ""}`}>
              <Checkbox checked={selecionadas.includes(n.id)} onCheckedChange={(checked) => setSelecionadas((prev) => checked ? [...prev, n.id] : prev.filter((id) => id !== n.id))}/>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold">{n.titulo}</p>
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${n.tipo === "Crítica" ? "bg-destructive text-destructive-foreground" : n.tipo === "Atenção" ? "bg-warning text-warning-foreground" : "bg-muted"}`}>{n.tipo}</span>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">{n.modulo}</span>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">{n.status}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{n.mensagem}</p>
              </div>
              <div className="flex items-center gap-2 lg:justify-end">
                <span className="text-xs text-muted-foreground">{n.hora}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {aba !== "Arquivadas" && <DropdownMenuItem onClick={() => markRead([n.id])}>Marcar como lida</DropdownMenuItem>}
                    {aba !== "Arquivadas" && <DropdownMenuItem onClick={() => archive([n.id])}>Concluir e arquivar</DropdownMenuItem>}
                    <DropdownMenuItem onClick={() => remove([n.id])} className="text-destructive">Apagar</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
