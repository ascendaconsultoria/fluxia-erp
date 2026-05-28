import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/fluxia/PageHeader";
import { EstoqueShell } from "@/components/fluxia/ModuleShells";
import { DataTable } from "@/components/fluxia/DataTable";
import { StatusBadge } from "@/components/fluxia/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ModalForm } from "@/components/fluxia/ModalForm";
import { ConfirmDialog } from "@/components/fluxia/ConfirmDialog";
import { useStore } from "@/mock/store";
import { brl, uid } from "@/lib/format";
import { Plus, MoreHorizontal, Edit, Trash2, ArrowLeftRight, Download, Upload, Package } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Produto } from "@/mock/data";

export const Route = createFileRoute("/_app/estoque/produtos")({
  component: ProdutosPage,
});

function ProdutosPage() {
  const { s, update } = useStore();
  const [novo, setNovo] = useState(false);
  const [excluir, setExcluir] = useState<Produto | null>(null);
  const [editar, setEditar] = useState<Produto | null>(null);
  const [form, setForm] = useState({
    nome: "", codigo: "", categoria: "", marca: "", imagem: "", custo: 0, preco: 0, estoque: 0, estoqueMinimo: 0,
  });

  const salvarNovo = async () => {
    if (!form.nome || !form.codigo) throw new Error("Nome e código são obrigatórios");
    update((st) => ({
      ...st,
      produtos: [
        {
          id: uid(), nome: form.nome, codigo: form.codigo, codigoBarras: `789${Math.floor(Math.random() * 1e8)}`,
          categoria: form.categoria || "Geral", marca: form.marca || "—", unidade: "UN", imagem: form.imagem || "/pdv-assets/cafe.png",
          custo: form.custo, preco: form.preco, estoque: form.estoque, estoqueMinimo: form.estoqueMinimo, status: "ativo",
        }, ...st.produtos,
      ],
    }));
    setForm({ nome: "", codigo: "", categoria: "", marca: "", imagem: "", custo: 0, preco: 0, estoque: 0, estoqueMinimo: 0 });
  };

  return (
    <EstoqueShell>
      <>
      <PageHeader
        title="Produtos" description="Catálogo completo de produtos."
        breadcrumb={[{ label: "Estoque" }, { label: "Produtos" }]}
        action={
          <>
            <Button variant="outline" size="sm" onClick={() => toast.success("Modelo baixado")}>
              <Download className="mr-2 h-4 w-4" /> Modelo
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast.info("Pré-visualizando importação")}>
              <Upload className="mr-2 h-4 w-4" /> Importar
            </Button>
            <Button size="sm" onClick={() => setNovo(true)}><Plus className="mr-2 h-4 w-4" />Novo produto</Button>
          </>
        }
      />

      <DataTable
        data={s.produtos}
        pageSize={10}
        maxHeight="calc(100vh - 18rem)"
        compact
        searchKeys={["nome", "codigo", "categoria", "marca"]}
        columns={[
          { key: "img", header: "Foto", cell: (r) => <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border bg-muted/40">{r.imagem ? <img src={r.imagem} alt={r.nome} className="h-full w-full object-contain" /> : <Package className="h-4 w-4 text-muted-foreground" />}</div> },
          { key: "nome", header: "Nome", cell: (r) => <div><p className="font-medium">{r.nome}</p><p className="text-xs text-muted-foreground">{r.codigo}</p></div> },
          { key: "cat", header: "Categoria", cell: (r) => r.categoria },
          { key: "marca", header: "Marca", cell: (r) => r.marca },
          {
            key: "est", header: "Estoque",
            cell: (r) => (
              <span className={r.estoque === 0 ? "text-destructive font-medium" : r.estoque <= r.estoqueMinimo ? "text-warning-foreground font-medium" : ""}>
                {r.estoque} {r.unidade}
              </span>
            ),
          },
          { key: "min", header: "Mín.", cell: (r) => r.estoqueMinimo },
          { key: "custo", header: "Custo", cell: (r) => <span className="text-muted-foreground">{brl(r.custo)}</span> },
          { key: "preco", header: "Preço", cell: (r) => brl(r.preco) },
          { key: "margem", header: "Margem", cell: (r) => <span className="font-medium text-primary">{r.preco ? Math.round(((r.preco - r.custo) / r.preco) * 100) : 0}%</span> },
          { key: "status", header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
          {
            key: "acoes", header: "", className: "text-right",
            cell: (r) => (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setEditar(r)}><Edit className="mr-2 h-4 w-4" />Editar</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.info("Modal de movimentação")}><ArrowLeftRight className="mr-2 h-4 w-4" />Movimentar</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive" onClick={() => setExcluir(r)}>
                    <Trash2 className="mr-2 h-4 w-4" />Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ),
          },
        ]}
      />

      <ModalForm open={novo} onOpenChange={setNovo} title="Novo produto" size="lg" onSave={salvarNovo} successMessage="Produto cadastrado">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2"><Label>Nome*</Label><Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} /></div>
          <div className="sm:col-span-2"><Label>Foto do produto (URL ou caminho do arquivo)</Label><Input value={form.imagem} onChange={(e) => setForm({ ...form, imagem: e.target.value })} placeholder="/pdv-assets/cafe.png ou https://..." /><p className="mt-1 text-xs text-muted-foreground">Essa imagem aparece na frente de caixa, consulta e cadastro.</p></div>
          <div><Label>Código*</Label><Input value={form.codigo} onChange={(e) => setForm({ ...form, codigo: e.target.value })} /></div>
          <div><Label>Categoria</Label>
            <Select value={form.categoria} onValueChange={(v) => setForm({ ...form, categoria: v })}>
              <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
              <SelectContent>
                {["Bebidas", "Padaria", "Eletrônicos", "Vestuário", "Papelaria", "Utilidades", "Mercearia"].map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div><Label>Marca</Label><Input value={form.marca} onChange={(e) => setForm({ ...form, marca: e.target.value })} /></div>
          <div><Label>Unidade</Label><Input defaultValue="UN" /></div>
          <div><Label>Custo</Label><Input type="number" value={form.custo} onChange={(e) => setForm({ ...form, custo: Number(e.target.value) })} /></div>
          <div><Label>Preço de venda</Label><Input type="number" value={form.preco} onChange={(e) => setForm({ ...form, preco: Number(e.target.value) })} /></div>
          <div><Label>Estoque inicial</Label><Input type="number" value={form.estoque} onChange={(e) => setForm({ ...form, estoque: Number(e.target.value) })} /></div>
          <div><Label>Estoque mínimo</Label><Input type="number" value={form.estoqueMinimo} onChange={(e) => setForm({ ...form, estoqueMinimo: Number(e.target.value) })} /></div>
        </div>
      </ModalForm>

      <ModalForm open={!!editar} onOpenChange={(v) => !v && setEditar(null)} title={`Editar ${editar?.nome ?? ""}`}
        onSave={async () => { toast.success("Produto atualizado"); }}>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2"><Label>Nome</Label><Input defaultValue={editar?.nome} /></div>
          <div className="sm:col-span-2"><Label>Foto do produto</Label><Input defaultValue={editar?.imagem} placeholder="URL/caminho da imagem" /></div>
          <div><Label>Preço de custo</Label><Input type="number" defaultValue={editar?.custo} /></div>
          <div><Label>Preço de venda</Label><Input type="number" defaultValue={editar?.preco} /></div>
          <div><Label>Estoque</Label><Input type="number" defaultValue={editar?.estoque} /></div>
        </div>
      </ModalForm>

      <ConfirmDialog
        open={!!excluir} onOpenChange={(v) => !v && setExcluir(null)}
        title="Confirmar exclusão"
        description="Essa ação não poderá ser desfeita. Deseja realmente excluir este produto?"
        variant="destructive" confirmText="Excluir definitivamente"
        successMessage="Produto excluído"
        onConfirm={() => excluir && update((st) => ({ ...st, produtos: st.produtos.filter((p) => p.id !== excluir.id) }))}
      />
      </>
    </EstoqueShell>
  );
}
