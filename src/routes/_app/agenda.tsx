import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, Grid3X3, HelpCircle, Menu, Plus, Search, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ModalForm } from "@/components/fluxia/ModalForm";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/agenda")({ component: AgendaPage });

type CalendarType = "todos" | "operacional" | "comercial" | "bpo" | "pos-venda" | "estoque";
type ViewMode = "dia" | "semana" | "mes" | "agenda";
type AgendaEvent = {
  id: string;
  title: string;
  date: string;
  start: string;
  end: string;
  calendar: Exclude<CalendarType, "todos">;
  description?: string;
};

const days = ["DOM.", "SEG.", "TER.", "QUA.", "QUI.", "SEX.", "SÁB."];
const week = [24, 25, 26, 27, 28, 29, 30];
const hours = Array.from({ length: 13 }, (_, i) => i + 11);
const calendarOptions: Array<{ value: Exclude<CalendarType, "todos">; label: string; color: string }> = [
  { value: "operacional", label: "Fluxia operacional", color: "bg-blue-500 text-white" },
  { value: "comercial", label: "Comercial", color: "bg-emerald-500 text-white" },
  { value: "bpo", label: "BPO", color: "bg-violet-500 text-white" },
  { value: "pos-venda", label: "Pós-venda", color: "bg-amber-500 text-white" },
  { value: "estoque", label: "Estoque", color: "bg-cyan-500 text-white" },
];

const monthCells = Array.from({ length: 35 }, (_, i) => (i < 5 ? "" : String(i - 4)));

function dayIndexFromDate(date: string) {
  const parsed = new Date(`${date}T00:00:00`);
  const index = parsed.getDay();
  return Number.isFinite(index) ? index : 0;
}

function hourFromTime(time: string) {
  const [hour] = time.split(":").map(Number);
  return Number.isFinite(hour) ? hour : 11;
}

function AgendaPage() {
  const [modal, setModal] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("semana");
  const [selectedCalendar, setSelectedCalendar] = useState<CalendarType>("todos");
  const [events, setEvents] = useState<AgendaEvent[]>([]);
  const [draft, setDraft] = useState({ title: "", date: "2026-05-27", start: "09:00", end: "10:00", calendar: "operacional" as Exclude<CalendarType, "todos">, description: "" });

  const filteredEvents = useMemo(() => {
    return selectedCalendar === "todos" ? events : events.filter((event) => event.calendar === selectedCalendar);
  }, [events, selectedCalendar]);

  const saveEvent = async () => {
    if (!draft.title.trim()) throw new Error("Informe o título do evento.");
    setEvents((current) => [{ id: crypto.randomUUID?.() ?? String(Date.now()), ...draft }, ...current]);
    setDraft({ title: "", date: "2026-05-27", start: "09:00", end: "10:00", calendar: "operacional", description: "" });
    toast.success("Evento criado na agenda interna.");
  };

  const renderEvent = (event: AgendaEvent) => {
    const cal = calendarOptions.find((item) => item.value === event.calendar) ?? calendarOptions[0];
    return (
      <button key={event.id} onClick={() => toast.info(`${event.title} • ${event.start} – ${event.end}`)} className={`w-full overflow-hidden rounded-md px-2 py-1 text-left text-xs shadow-sm ${cal.color}`}>
        <strong className="block truncate">{event.title}</strong>
        <span className="block truncate">{event.start} – {event.end}</span>
      </button>
    );
  };

  return (
    <div className="h-screen overflow-hidden bg-[#f8fafd] text-[#202124]">
      <header className="flex h-16 items-center justify-between border-b bg-white px-4">
        <div className="flex items-center gap-4">
          <Menu className="h-6 w-6" />
          <div className="flex items-center gap-2"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 font-bold text-white">27</div><span className="text-xl">Agenda</span></div>
          <Button variant="outline" className="rounded-full">Hoje</Button>
          <ChevronLeft className="h-5 w-5" />
          <ChevronRight className="h-5 w-5" />
          <h1 className="text-xl">Maio de 2026</h1>
        </div>
        <div className="flex items-center gap-3">
          <Search className="h-5 w-5" />
          <HelpCircle className="h-5 w-5" />
          <Settings className="h-5 w-5" />
          <Select value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)}><SelectTrigger className="h-9 w-32 rounded-full bg-white"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="dia">Dia</SelectItem><SelectItem value="semana">Semana</SelectItem><SelectItem value="mes">Mês</SelectItem><SelectItem value="agenda">Agenda</SelectItem></SelectContent></Select>
          <Button variant="outline" size="icon"><CalendarDays className="h-4 w-4" /></Button>
          <CheckCircle2 className="h-5 w-5" />
          <Grid3X3 className="h-5 w-5" />
        </div>
      </header>

      <main className="grid h-[calc(100vh-4rem)] grid-cols-[220px_1fr] overflow-hidden">
        <aside className="custom-scrollbar overflow-y-auto border-r bg-white p-3">
          <Button onClick={() => setModal(true)} className="mb-6 h-12 rounded-xl bg-white text-[#202124] shadow hover:bg-slate-50" variant="outline"><Plus className="mr-2 h-5 w-5" />Criar</Button>
          <div className="mb-5"><div className="mb-2 flex items-center justify-between text-sm font-medium"><span>Maio de 2026</span><span>‹ ›</span></div><div className="grid grid-cols-7 gap-1 text-center text-[11px] text-slate-600">{"DSTQQSS".split("").map((d, i) => <span key={i}>{d}</span>)}{monthCells.map((value, i) => <span key={i} className={`rounded-full py-1 ${value === "27" ? "bg-blue-600 text-white" : ""}`}>{value}</span>)}</div></div>
          <Input placeholder="Pesquisar pessoas" />
          <div className="mt-5 space-y-4 text-sm">
            <div><strong>Tipos de agenda</strong></div>
            <div className="space-y-2">
              <button onClick={() => setSelectedCalendar("todos")} className={`w-full rounded-lg px-3 py-2 text-left ${selectedCalendar === "todos" ? "bg-blue-50 text-blue-700" : "hover:bg-slate-50"}`}>Todas as agendas</button>
              {calendarOptions.map((calendar) => <button key={calendar.value} onClick={() => setSelectedCalendar(calendar.value)} className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left ${selectedCalendar === calendar.value ? "bg-blue-50 text-blue-700" : "hover:bg-slate-50"}`}><span className={`h-3 w-3 rounded-full ${calendar.color.split(" ")[0]}`} />{calendar.label}</button>)}
            </div>
            <div><strong>Minhas agendas</strong></div>
            <div><strong>Outras agendas</strong><span className="float-right">+</span></div>
          </div>
        </aside>

        <section className="overflow-auto bg-white">
          {viewMode === "agenda" ? (
            <div className="p-6">
              <h2 className="mb-4 text-lg font-medium">Próximos eventos</h2>
              {filteredEvents.length === 0 ? <Card className="p-8 text-center text-sm text-slate-500">Agenda vazia. Clique em Criar para adicionar o primeiro evento.</Card> : <div className="space-y-3">{filteredEvents.map((event) => <Card key={event.id} className="p-4"><div className="flex items-center justify-between"><strong>{event.title}</strong><span>{event.date} • {event.start} – {event.end}</span></div><p className="mt-1 text-sm text-slate-500">{event.description || "Sem descrição"}</p></Card>)}</div>}
            </div>
          ) : (
            <>
              <div className="grid min-w-[980px] grid-cols-[54px_repeat(7,1fr)] border-b"><div className="border-r p-2 text-xs text-slate-500">GMT-03</div>{week.map((d, i) => <div key={d} className="border-r p-3 text-center"><p className="text-xs">{days[i]}</p><div className={`mx-auto mt-1 flex h-10 w-10 items-center justify-center rounded-full text-2xl ${d === 27 ? "bg-blue-600 text-white" : ""}`}>{d}</div></div>)}</div>
              <div className="min-w-[980px]">
                {hours.map((hour) => (
                  <div key={hour} className="grid grid-cols-[54px_repeat(7,1fr)]">
                    <div className="h-16 border-r border-b px-2 pt-1 text-xs text-slate-500">{hour}:00</div>
                    {week.map((_, day) => {
                      const cellEvents = filteredEvents.filter((event) => dayIndexFromDate(event.date) === day && hourFromTime(event.start) === hour);
                      return <div key={`${hour}-${day}`} onDoubleClick={() => { setDraft((prev) => ({ ...prev, date: `2026-05-${String(24 + day).padStart(2, "0")}`, start: `${String(hour).padStart(2, "0")}:00`, end: `${String(hour + 1).padStart(2, "0")}:00` })); setModal(true); }} className="h-16 min-w-0 overflow-hidden border-r border-b p-1">{cellEvents.map(renderEvent)}</div>;
                    })}
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </main>

      <ModalForm open={modal} onOpenChange={setModal} title="Criar evento" successMessage="Evento criado" onSave={saveEvent}>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2"><Label>Título</Label><Input value={draft.title} onChange={(e) => setDraft((prev) => ({ ...prev, title: e.target.value }))} /></div>
          <div><Label>Data</Label><Input type="date" value={draft.date} onChange={(e) => setDraft((prev) => ({ ...prev, date: e.target.value }))} /></div>
          <div><Label>Calendário</Label><Select value={draft.calendar} onValueChange={(value) => setDraft((prev) => ({ ...prev, calendar: value as Exclude<CalendarType, "todos"> }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{calendarOptions.map((calendar) => <SelectItem key={calendar.value} value={calendar.value}>{calendar.label}</SelectItem>)}</SelectContent></Select></div>
          <div><Label>Início</Label><Input type="time" value={draft.start} onChange={(e) => setDraft((prev) => ({ ...prev, start: e.target.value }))} /></div>
          <div><Label>Fim</Label><Input type="time" value={draft.end} onChange={(e) => setDraft((prev) => ({ ...prev, end: e.target.value }))} /></div>
          <div className="sm:col-span-2"><Label>Descrição</Label><Textarea value={draft.description} onChange={(e) => setDraft((prev) => ({ ...prev, description: e.target.value }))} /></div>
        </div>
      </ModalForm>
    </div>
  );
}
