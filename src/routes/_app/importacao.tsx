import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/fluxia/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Download, FileSpreadsheet, CheckCircle2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/importacao")({ component: ImportacaoPage });

const tabs = ["Importar Clientes", "Importar Fornecedores", "Importar Produtos/Stock", "Importar Fluxo de Caixa", "Importar Plano de Contas", "Importar Saldo Inicial de Bancos", "Importar Histórico de Vendas"];

function ImportacaoPage() {
  const [tab, setTab] = useState(tabs[0]);
  const [step, setStep] = useState(1);
  const campos = tab.includes("Clientes")
    ? ["nome", "documento", "telefone", "email", "cidade", "status"]
    : tab.includes("Fornecedores")
      ? ["fornecedor", "cnpj", "contato", "prazo", "score", "categoria"]
      : tab.includes("Produtos") || tab.includes("Stock")
        ? ["sku", "nome", "categoria", "estoque", "preco", "custo"]
        : tab.includes("Fluxo")
          ? ["data", "descricao", "tipo", "valor", "conta", "centro_custo"]
          : tab.includes("Plano")
            ? ["codigo", "conta", "grupo", "natureza", "dre", "status"]
            : tab.includes("Saldo")
              ? ["banco", "agencia", "conta", "saldo_inicial", "data_base", "carteira"]
              : ["data", "cliente", "pedido", "produto", "valor", "vendedor"];
  const steps = ["Upload", "Pré-validação", "Correção", "Importação"];
  return (
    <div className="flex h-[calc(100vh-8rem)] min-h-0 flex-col overflow-hidden">
      <PageHeader title="Importação de dados" description="Traga dados externos para clientes, fornecedores, produtos, financeiro, plano de contas, bancos e histórico comercial." />
      <div className="mb-4 flex flex-shrink-0 gap-2 overflow-x-auto rounded-2xl border bg-surface p-2">
        {tabs.map((item) => <button key={item} onClick={() => setTab(item)} className={`whitespace-nowrap rounded-xl px-3 py-2 text-sm ${tab === item ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>{item}</button>)}
      </div>
      <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto pr-1">
        <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
          <Card className="rounded-2xl p-5 shadow-soft">
            <h3 className="font-semibold">{tab}</h3>
            <p className="mt-1 text-sm text-muted-foreground">Envie CSV/XLSX no modelo padrão para evitar perda de campos e duplicidades.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div><Label>Arquivo</Label><Input type="file" accept=".csv,.xlsx" /></div>
              <div><Label>Estratégia de duplicidade</Label><Input defaultValue="Atualizar por documento/SKU" /></div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button onClick={() => { setStep(4); toast.success("Importação simulada concluída"); }}><Upload className="mr-2 h-4 w-4" />Importar arquivo</Button>
              <Button variant="outline" onClick={() => toast.success("Modelo CSV gerado")}><Download className="mr-2 h-4 w-4" />Baixar modelo CSV</Button>
              <Button variant="outline" onClick={() => toast.success("Modelo XLSX gerado")}><FileSpreadsheet className="mr-2 h-4 w-4" />Baixar modelo XLSX</Button>
            </div>
          </Card>
          <Card className="rounded-2xl p-5 shadow-soft">
            <h3 className="font-semibold">Modelo esperado</h3>
            <div className="mt-4 space-y-2">{campos.map((c) => <div key={c} className="rounded-xl border p-3 text-sm"><CheckCircle2 className="mr-2 inline h-4 w-4 text-primary" />{c}</div>)}</div>
          </Card>
        </div>
        <Card className="mt-4 rounded-2xl p-5 shadow-soft">
          <h3 className="font-semibold">Stepper de validação</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-4">
            {steps.map((name, index) => {
              const active = step >= index + 1;
              return <button key={name} type="button" onClick={() => setStep(index + 1)} className={`rounded-2xl border p-4 text-left transition ${active ? "border-primary bg-primary-soft text-primary" : "bg-surface text-muted-foreground"}`}><span className="flex h-8 w-8 items-center justify-center rounded-full bg-background font-bold">{index + 1}</span><p className="mt-3 font-semibold">{name}</p></button>
            })}
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3"><div className="rounded-xl border p-3"><CheckCircle2 className="mr-2 inline h-4 w-4 text-primary" /> 120 linhas válidas</div><div className="rounded-xl border p-3"><AlertTriangle className="mr-2 inline h-4 w-4 text-warning" /> 4 duplicidades</div><div className="rounded-xl border p-3"><AlertTriangle className="mr-2 inline h-4 w-4 text-destructive" /> 2 campos ausentes</div></div>
        </Card>
      </div>
    </div>
  );
}
