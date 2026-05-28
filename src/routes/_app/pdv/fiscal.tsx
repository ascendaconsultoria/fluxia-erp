import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/fluxia/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ModalForm } from "@/components/fluxia/ModalForm";
import { DataTable } from "@/components/fluxia/DataTable";
import { StatCard } from "@/components/fluxia/StatCard";
import { brl } from "@/lib/format";
import { FileText, ShieldCheck, Cloud, AlertTriangle, Plus, Send, ReceiptText } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/pdv/fiscal")({ component: FiscalPage });

const documentos = [
  { numero: "NFC-e 000124", tipo: "NFC-e", cliente: "Consumidor final", valor: brl(168.1), status: "Autorizada", chave: "3526 0520 0000 0000 0000 6500 1000 0001 2410 0001" },
  { numero: "NF-e 000077", tipo: "NF-e", cliente: "Tech Solutions", valor: brl(4599), status: "Pendente XML", chave: "3526 0520 0000 0000 0000 5500 1000 0000 7710 0001" },
  { numero: "NFC-e 000123", tipo: "NFC-e", cliente: "Ana Beatriz", valor: brl(89.9), status: "Contingência", chave: "3526 0520 0000 0000 0000 6500 1000 0001 2310 0001" },
];

function FiscalPage() {
  const [modal, setModal] = useState(false);
  return (
    <div className="h-full overflow-hidden">
      <PageHeader title="Fiscal NFC-e / NF-e" description="Modelo fiscal preparado para emissão, contingência, certificado digital, XML e DANFE/NFC-e." action={<Button size="sm" onClick={() => setModal(true)}><Plus className="mr-2 h-4 w-4" />Nova emissão fiscal</Button>} />
      <div className="custom-scrollbar h-[calc(100vh-13rem)] overflow-y-auto pr-1">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="NFC-e autorizadas" value="124" icon={ReceiptText} />
          <StatCard title="NF-e emitidas" value="77" icon={FileText} />
          <StatCard title="Certificado" value="A1 válido" icon={ShieldCheck} tone="primary" />
          <StatCard title="Contingência" value="1" icon={AlertTriangle} tone="warning" />
        </div>
        <div className="mt-5 grid gap-4 xl:grid-cols-[1fr_340px]">
          <DataTable data={documentos} pageSize={10} maxHeight="calc(100vh - 25rem)" searchKeys={["numero", "tipo", "cliente", "status", "chave"]} columns={[
            { key: "numero", header: "Documento", cell: (r) => <strong>{r.numero}</strong> },
            { key: "tipo", header: "Tipo", cell: (r) => r.tipo },
            { key: "cliente", header: "Cliente", cell: (r) => r.cliente },
            { key: "valor", header: "Valor", cell: (r) => <strong>{r.valor}</strong> },
            { key: "status", header: "Status", cell: (r) => <span className={r.status === "Autorizada" ? "text-primary font-semibold" : "text-warning-foreground font-semibold"}>{r.status}</span> },
            { key: "acao", header: "", className: "text-right", cell: (r) => <Button variant="ghost" size="sm" onClick={() => toast.success(`${r.numero} preparado para DANFE/XML`)}>Abrir</Button> },
          ]} />
          <Card className="rounded-2xl p-5 shadow-soft">
            <Cloud className="h-5 w-5 text-primary" />
            <h3 className="mt-2 font-semibold">Pipeline fiscal</h3>
            <div className="mt-4 space-y-3 text-sm">
              {[
                ["1. Validar venda", "Cliente, CFOP, NCM, CST/CSOSN e totais"],
                ["2. Assinar XML", "Certificado A1/A3 e token CSC NFC-e"],
                ["3. Transmitir SEFAZ", "Autorização, rejeição ou contingência"],
                ["4. Arquivar", "XML, DANFE, protocolo e vínculo com venda"],
              ].map(([a,b]) => <div key={a} className="rounded-xl border p-3"><strong>{a}</strong><p className="text-xs text-muted-foreground">{b}</p></div>)}
            </div>
          </Card>
        </div>
      </div>
      <ModalForm open={modal} onOpenChange={setModal} title="Nova emissão fiscal" successMessage="Documento fiscal preparado" onSave={async () => {}}>
        <div className="grid gap-3 sm:grid-cols-2">
          <div><Label>Tipo</Label><Select defaultValue="nfce"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="nfce">NFC-e</SelectItem><SelectItem value="nfe">NF-e</SelectItem></SelectContent></Select></div>
          <div><Label>Venda vinculada</Label><Input placeholder="Ex.: V1024" /></div>
          <div><Label>CFOP</Label><Input defaultValue="5102" /></div>
          <div><Label>Ambiente</Label><Select defaultValue="homologacao"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="homologacao">Homologação</SelectItem><SelectItem value="producao">Produção</SelectItem></SelectContent></Select></div>
          <div className="sm:col-span-2"><Label>Observação fiscal</Label><Input placeholder="Informações complementares" /></div>
        </div>
      </ModalForm>
    </div>
  );
}
