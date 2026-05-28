import { createFileRoute, Navigate } from "@tanstack/react-router";
import { type ClipboardEvent, type FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Image as ImageIcon, Loader2, Lock, Minus, Plus, Printer, Search, Trash2, UnlockKeyhole, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/fluxia/ConfirmDialog";
import { ModalForm } from "@/components/fluxia/ModalForm";
import { PageHeader } from "@/components/fluxia/PageHeader";
import { brl, sleep, uid } from "@/lib/format";
import { useStore } from "@/mock/store";

export const Route = createFileRoute("/_app/pdv/")({ component: PdvPage });

type PaymentType = "dinheiro" | "pix" | "debito" | "credito" | "boleto" | "vale" | "crediario" | "misto";
type DiscountMode = "valor" | "percentual";

type HorusProduct = {
  id: string;
  productId?: string;
  name: string;
  code: string;
  stock: number;
  salePrice: number;
  imageUrl?: string;
};

type HorusCartItem = {
  id: string;
  code: string;
  name: string;
  quantity: number;
  unitPrice: number;
  discount: number;
};

const paymentOptions: Array<{ value: PaymentType; label: string }> = [
  { value: "dinheiro", label: "Dinheiro" },
  { value: "pix", label: "PIX" },
  { value: "debito", label: "Cartão Débito" },
  { value: "credito", label: "Cartão Crédito" },
  { value: "boleto", label: "Boleto" },
  { value: "vale", label: "Vale / Crédito" },
  { value: "crediario", label: "Crediário" },
  { value: "misto", label: "Pagamento misto" },
];

const fallbackProducts: HorusProduct[] = [
  { id: "CAF250", name: "Café Especial 250g", code: "CAF250", stock: 45, salePrice: 32.9, imageUrl: "/pdv-assets/cafe.png" },
  { id: "PAOFR", name: "Pão Francês kg", code: "PAOFR", stock: 8, salePrice: 14.9, imageUrl: "/pdv-assets/pao.png" },
  { id: "AG500", name: "Água Mineral 500ml", code: "AG500", stock: 120, salePrice: 4.5, imageUrl: "/pdv-assets/agua.png" },
  { id: "NTB14", name: "Notebook Pro 14\"", code: "NTB14", stock: 6, salePrice: 4599, imageUrl: "/pdv-assets/notebook.png" },
  { id: "MS001", name: "Mouse Wireless", code: "MS001", stock: 2, salePrice: 89.9, imageUrl: "/pdv-assets/mouse.png" },
  { id: "CAMP01", name: "Camiseta Premium P", code: "CAMP01", stock: 18, salePrice: 59.9, imageUrl: "/pdv-assets/camiseta.png" },
  { id: "CAD96", name: "Caderno A4 96f", code: "CAD96", stock: 120, salePrice: 12.9, imageUrl: "/pdv-assets/caderno.png" },
];

function formatDateTime(date: Date) {
  return {
    dateLabel: date.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" }),
    timeLabel: date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
  };
}

function formatMoneyBr(value: number) {
  return value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function parseMoneyBr(value: string) {
  const sanitized = value.replace(/[^0-9,.-]/g, "").replace(/\./g, "").replace(",", ".");
  const parsed = Number(sanitized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function maskMoneyBr(value: string) {
  const digits = value.replace(/\D/g, "");
  const numeric = Number(digits || "0") / 100;
  return formatMoneyBr(numeric);
}

function sanitizeIntegerInput(value: string) {
  return value.replace(/\D/g, "");
}

function preventNonDigitBeforeInput(event: FormEvent<HTMLInputElement>) {
  const data = (event.nativeEvent as InputEvent).data ?? "";
  if (data && /\D/.test(data)) event.preventDefault();
}

async function enterPdvFullscreen() {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (!document.fullscreenElement && root.requestFullscreen) await root.requestFullscreen();
}

async function exitPdvFullscreen() {
  if (typeof document === "undefined") return;
  if (document.fullscreenElement && document.exitFullscreen) await document.exitFullscreen();
}

function openStandalonePdvWindow() {
  if (typeof window === "undefined") return null;
  const width = window.screen?.availWidth || 1440;
  const height = window.screen?.availHeight || 900;
  const features = `popup=yes,left=0,top=0,width=${width},height=${height},resizable=yes,scrollbars=no`;
  const pdv = window.open("about:blank", "fluxia-pdv", features);
  if (pdv) {
    pdv.document.write(`<!doctype html><html><head><title>Fluxia PDV</title><style>html,body{height:100%;margin:0;background:#0f172a;color:#e2e8f0;font-family:Inter,Arial,sans-serif}main{height:100%;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:12px}.loader{width:42px;height:42px;border:4px solid rgba(3,105,161,.2);border-top-color:#0369a1;border-radius:50%;animation:spin .8s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}strong{font-size:22px}</style></head><body><main><div class="loader"></div><strong>Abrindo Fluxia PDV...</strong><span>Sincronizando caixa e produtos.</span></main></body></html>`);
    pdv.document.close();
    try { pdv.moveTo(0, 0); pdv.resizeTo(width, height); } catch {}
    pdv.focus();
  }
  const url = `${window.location.origin}/pdv?modo=caixa&fullscreen=1`;
  window.setTimeout(() => {
    if (pdv && !pdv.closed) pdv.location.href = url;
    else window.open(url, "fluxia-pdv", features)?.focus();
  }, 60);
  return pdv;
}

function PdvPage() {
  const isStandalone = typeof window !== "undefined" && window.location.search.includes("modo=caixa");
  if (!isStandalone) return <Navigate to="/pdv/caixa" />;

  const { s, update } = useStore();
  const productInputRef = useRef<HTMLInputElement | null>(null);
  const qtyInputRef = useRef<HTMLInputElement | null>(null);

  const operadores = s.usuarios.filter((u) => ["Operador PDV", "Administrador"].includes(u.perfil) || u.nome.includes("Marina"));
  const [now, setNow] = useState(new Date());
  const [openCashModal, setOpenCashModal] = useState(false);
  const [initialCash, setInitialCash] = useState(200);
  const [operator, setOperator] = useState(operadores[0]?.nome ?? "Operador");
  const [productSearch, setProductSearch] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [showProductOptions, setShowProductOptions] = useState(false);
  const [highlightedProductIndex, setHighlightedProductIndex] = useState(0);
  const [quantityInput, setQuantityInput] = useState("1");
  const [itemDiscountInput, setItemDiscountInput] = useState("0,00");
  const [itemDiscountMode, setItemDiscountMode] = useState<DiscountMode>("valor");
  const [cart, setCart] = useState<HorusCartItem[]>([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [paymentType, setPaymentType] = useState<PaymentType>("dinheiro");
  const [cpfNota, setCpfNota] = useState("");
  const [cashGiven, setCashGiven] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState("avulso");
  const [clientModal, setClientModal] = useState(false);
  const [clientDraft, setClientDraft] = useState({ nome: "", documento: "", email: "", telefone: "", cidade: "", estado: "" });
  const [cancelModal, setCancelModal] = useState(false);
  const [closeCashModal, setCloseCashModal] = useState(false);
  const [removeConfirm, setRemoveConfirm] = useState<HorusCartItem | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<{ codigo: string; total: number; payment: string } | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [printLoading, setPrintLoading] = useState(false);

  const products = useMemo<HorusProduct[]>(() => {
    const storeProducts: HorusProduct[] = s.produtos.map((item) => ({
      id: item.codigo || item.id,
      productId: item.id,
      name: item.nome,
      code: item.codigo || item.id,
      stock: Number(item.estoque || 0),
      salePrice: Number(item.preco || 0),
      imageUrl: item.imagem || fallbackProducts.find((p) => p.code === item.codigo || p.name === item.nome)?.imageUrl,
    }));
    const merged = [...storeProducts];
    fallbackProducts.forEach((fallback) => {
      if (!merged.some((item) => item.code === fallback.code || item.name === fallback.name)) merged.push(fallback);
    });
    return merged;
  }, [s.produtos]);

  const selectedProduct = useMemo(() => products.find((item) => item.id === selectedProductId) ?? null, [products, selectedProductId]);
  const quantity = useMemo(() => {
    const parsed = Number(quantityInput);
    if (!Number.isFinite(parsed) || parsed < 1) return 1;
    return Math.floor(parsed);
  }, [quantityInput]);
  const filteredProducts = useMemo(() => {
    const normalized = productSearch.trim().toLowerCase();
    if (!normalized) return products;
    return products.filter((item) => item.name.toLowerCase().includes(normalized) || item.code.toLowerCase().includes(normalized));
  }, [products, productSearch]);
  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + Math.max(0, item.unitPrice - item.discount) * item.quantity, 0), [cart]);
  const totalDiscount = useMemo(() => cart.reduce((sum, item) => sum + item.discount * item.quantity, 0), [cart]);
  const totalVolumes = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const cashGivenValue = parseMoneyBr(cashGiven || "0");
  const changeValue = paymentType === "dinheiro" ? Math.max(0, cashGivenValue - subtotal) : 0;
  const selectedCustomer = selectedCustomerId === "avulso" ? null : s.clientes.find((cliente) => cliente.id === selectedCustomerId) ?? null;
  const itemDiscountBase = parseMoneyBr(itemDiscountInput || "0");
  const itemDiscount = selectedProduct
    ? itemDiscountMode === "percentual"
      ? Math.min(selectedProduct.salePrice, selectedProduct.salePrice * Math.min(100, itemDiscountBase) / 100)
      : Math.min(selectedProduct.salePrice, itemDiscountBase)
    : 0;
  const activeProductName = cart.length > 0 ? cart[cart.length - 1].name : selectedProduct?.name ?? "";
  const previewProduct = selectedProduct ?? products.find((item) => item.id === cart[cart.length - 1]?.id) ?? null;
  const cashCanSell = s.caixaAberto;
  const cashLabel = cashCanSell ? `Caixa aberto por menos de 1 min` : "Abra o caixa para liberar o PDV.";
  const { dateLabel, timeLabel } = formatDateTime(now);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    if (typeof window !== "undefined" && window.location.search.includes("fullscreen=1")) {
      window.setTimeout(() => enterPdvFullscreen().catch(() => undefined), 80);
      try { window.moveTo(0, 0); window.resizeTo(window.screen.availWidth, window.screen.availHeight); } catch {}
    }
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (filteredProducts.length === 0) {
      setHighlightedProductIndex(-1);
      return;
    }
    setHighlightedProductIndex((current) => {
      if (current < 0) return 0;
      if (current >= filteredProducts.length) return filteredProducts.length - 1;
      return current;
    });
  }, [filteredProducts]);

  const selectProductOption = (product: HorusProduct) => {
    setSelectedProductId(product.id);
    setProductSearch(product.name);
    setShowProductOptions(false);
    setHighlightedProductIndex(0);
    qtyInputRef.current?.focus();
  };

  const addItem = useCallback(() => {
    const matched = selectedProduct ?? filteredProducts.find((item) => item.name.toLowerCase() === productSearch.trim().toLowerCase() || item.code.toLowerCase() === productSearch.trim().toLowerCase()) ?? filteredProducts[0];
    if (!matched) {
      toast.error("Selecione um produto.");
      return;
    }
    if (quantity > matched.stock) {
      toast.error(`Estoque insuficiente. Disponível: ${matched.stock}.`);
      return;
    }
    const discountBase = parseMoneyBr(itemDiscountInput || "0");
    const discount = itemDiscountMode === "percentual"
      ? Math.min(matched.salePrice, matched.salePrice * Math.min(100, discountBase) / 100)
      : Math.min(matched.salePrice, discountBase);
    setCart((current) => {
      const existing = current.find((item) => item.id === matched.id && item.discount === discount);
      if (!existing) return [...current, { id: matched.id, code: matched.code, name: matched.name, quantity, unitPrice: matched.salePrice, discount }];
      const nextQuantity = existing.quantity + quantity;
      if (nextQuantity > matched.stock) {
        toast.error(`Estoque insuficiente para ${matched.name}.`);
        return current;
      }
      return current.map((item) => item.id === existing.id && item.discount === discount ? { ...item, quantity: nextQuantity } : item);
    });
    setSelectedProductId("");
    setProductSearch("");
    setShowProductOptions(false);
    setQuantityInput("1");
    setItemDiscountInput("0,00");
    productInputRef.current?.focus();
  }, [filteredProducts, itemDiscountInput, productSearch, quantity, selectedProduct]);

  const confirmRemoveItem = async () => {
    if (!removeConfirm) return;
    setCart((current) => current.filter((item) => !(item.id === removeConfirm.id && item.discount === removeConfirm.discount)));
    toast.info(`${removeConfirm.name} removido do carrinho.`);
    setRemoveConfirm(null);
  };

  const askRemoveItem = (item: HorusCartItem) => setRemoveConfirm(item);

  const updateCartQuantity = (item: HorusCartItem, delta: number) => {
    if (delta < 0 && item.quantity <= 1) {
      setRemoveConfirm(item);
      return;
    }
    const product = products.find((row) => row.id === item.id || row.code === item.code);
    if (delta > 0 && product && item.quantity + 1 > product.stock) {
      toast.error(`Estoque insuficiente. Disponível: ${product.stock}.`);
      return;
    }
    setCart((current) => current.map((row) => row.id === item.id && row.discount === item.discount ? { ...row, quantity: Math.max(1, row.quantity + delta) } : row));
  };

  const cancelSale = () => {
    if (!cart.length) {
      toast.info("Não há itens para cancelar.");
      return;
    }
    setCancelModal(true);
  };

  const confirmCancelSale = async () => {
    setCart([]);
    setCpfNota("");
    setCashGiven("");
    setCheckoutOpen(false);
    toast.info("Venda cancelada.");
  };

  const openPayment = () => {
    if (cart.length === 0) {
      toast.error("Adicione ao menos um item.");
      return;
    }
    if (!cashCanSell) {
      toast.error("Abra o caixa antes de iniciar uma venda.");
      return;
    }
    setPaymentType("dinheiro");
    setCashGiven(formatMoneyBr(subtotal));
    setCheckoutOpen(true);
  };

  const confirmPayment = async () => {
    if (paymentLoading) return;
    if (paymentType === "dinheiro" && cashGivenValue < subtotal) {
      toast.error("Valor recebido menor que total.");
      return;
    }
    setPaymentLoading(true);
    await sleep(300);
    const saleCode = `PDV-${Date.now().toString().slice(-6)}`;
    update((state) => ({
      ...state,
      produtos: state.produtos.map((product) => {
        const sold = cart.filter((item) => item.code === product.codigo || item.name === product.nome).reduce((sum, item) => sum + item.quantity, 0);
        return sold ? { ...product, estoque: Math.max(0, product.estoque - sold) } : product;
      }),
      lancamentos: [{
        id: uid(),
        tipo: "receita" as const,
        descricao: `Venda PDV ${saleCode}`,
        categoria: "Receita operacional",
        contraparte: selectedCustomer?.nome || (cpfNota ? `CPF ${cpfNota}` : "Consumidor avulso"),
        vencimento: new Date().toISOString().slice(0, 10),
        pagamento: new Date().toISOString().slice(0, 10),
        valor: subtotal,
        status: "recebido" as const,
        conta: "Caixa",
        forma: paymentOptions.find((item) => item.value === paymentType)?.label ?? paymentType,
      }, ...state.lancamentos],
      vendas: [{
        id: uid(),
        codigo: saleCode,
        data: new Date().toISOString(),
        operador: state.caixaOperador || operator,
        cliente: selectedCustomer?.nome || (cpfNota ? `CPF ${cpfNota}` : undefined),
        total: subtotal,
        formaPagamento: paymentOptions.find((item) => item.value === paymentType)?.label ?? paymentType,
        status: "concluida" as const,
        itens: cart.map((item) => ({ produto: item.name, qtd: item.quantity, valor: Math.max(0, item.unitPrice - item.discount) * item.quantity })),
      }, ...state.vendas],
    }));
    setReceiptPreview({ codigo: saleCode, total: subtotal, payment: paymentOptions.find((item) => item.value === paymentType)?.label ?? paymentType });
    setCheckoutOpen(false);
    setCart([]);
    setSelectedProductId("");
    setProductSearch("");
    setShowProductOptions(false);
    setQuantityInput("1");
    setPaymentType("dinheiro");
    setCpfNota("");
    setCashGiven("");
    toast.success(`Pagamento confirmado. Venda ${saleCode} registrada.`);
    setPaymentLoading(false);
    window.setTimeout(() => productInputRef.current?.focus(), 0);
  };

  const openCash = async () => {
    if (!operator) throw new Error("Selecione o operador.");
    const pdvWindow = typeof window !== "undefined" && !window.location.search.includes("modo=caixa") ? openStandalonePdvWindow() : null;
    update((state) => {
      const next = { ...state, caixaAberto: true, caixaSaldoInicial: initialCash, caixaOperador: operator };
      try { localStorage.setItem("fluxia-store-v1", JSON.stringify(next)); window.dispatchEvent(new Event("fluxia-store-sync")); } catch {}
      return next;
    });
    if (typeof window !== "undefined" && window.location.search.includes("modo=caixa")) {
      await enterPdvFullscreen().catch(() => toast.info("O navegador bloqueou o modo tela cheia. Use F11 ou clique novamente no PDV."));
    } else {
      try { pdvWindow?.focus(); } catch {}
    }
  };

  const closeCash = async () => {
    setCart([]);
    setCheckoutOpen(false);
    setPaymentLoading(false);
    setPrintLoading(false);
    update((state) => {
      const next = { ...state, caixaAberto: false, caixaSaldoInicial: 0, caixaOperador: "" };
      try {
        localStorage.setItem("fluxia-store-v1", JSON.stringify(next));
        localStorage.setItem("fluxia-pdv-close-signal", String(Date.now()));
        window.dispatchEvent(new Event("fluxia-store-sync"));
        window.opener?.postMessage({ type: "FLUXIA_PDV_CAIXA_FECHADO" }, window.location.origin);
      } catch {}
      return next;
    });
    await exitPdvFullscreen().catch(() => undefined);
    toast.success("Caixa fechado. Vendas bloqueadas até nova abertura.");
    if (typeof window !== "undefined" && window.location.search.includes("modo=caixa")) {
      window.setTimeout(() => {
        try { window.close(); } catch {}
        if (!window.closed) window.location.href = "/pdv?modo=caixa&closed=1";
      }, 500);
    }
  };

  const printLastSale = async () => {
    setPrintLoading(true);
    await sleep(350);
    setPrintLoading(false);
    receiptPreview ? toast.info(`Última venda ${receiptPreview.codigo}: ${brl(receiptPreview.total)}`) : toast.info("Nenhuma venda finalizada nesta estação.");
  };

  const pasteCashGiven = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    setCashGiven(maskMoneyBr(event.clipboardData.getData("text")));
  };

  const createClient = async () => {
    if (!clientDraft.nome.trim()) throw new Error("Informe o nome do cliente.");
    const id = uid();
    const novoCliente = {
      id,
      nome: clientDraft.nome.trim(),
      documento: clientDraft.documento.trim() || "Não informado",
      email: clientDraft.email.trim(),
      telefone: clientDraft.telefone.trim(),
      cidade: clientDraft.cidade.trim(),
      estado: clientDraft.estado.trim(),
      status: "ativo" as const,
      totalCompras: 0,
    };
    update((state) => ({ ...state, clientes: [novoCliente, ...state.clientes] }));
    setSelectedCustomerId(id);
    setClientDraft({ nome: "", documento: "", email: "", telefone: "", cidade: "", estado: "" });
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;
      const target = event.target as HTMLElement | null;
      const isInput = target?.tagName === "INPUT";
      if (event.key === "F2") {
        event.preventDefault();
        productInputRef.current?.focus();
      }
      if (event.key === "F4") {
        event.preventDefault();
        qtyInputRef.current?.focus();
      }
      if (event.key === "F8") {
        event.preventDefault();
        cancelSale();
      }
      if (event.key === "F12") {
        event.preventDefault();
        if (!checkoutOpen) openPayment();
      }
      if (event.key === "Enter" && isInput && !checkoutOpen) {
        if (target === productInputRef.current && showProductOptions) return;
        if (target === productInputRef.current || target === qtyInputRef.current) {
          event.preventDefault();
          addItem();
        }
      }
      if (event.key === "Escape" && checkoutOpen) {
        event.preventDefault();
        setCheckoutOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [addItem, checkoutOpen, openPayment, showProductOptions]);

  if (!s.caixaAberto) {
    return (
      <>
        <PageHeader title="PDV" description="Frente de caixa no padrão Fluxia, com abertura de caixa obrigatória." />
        <Card className="p-10 text-center shadow-soft">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-warning/15 text-warning-foreground"><Lock className="h-6 w-6" /></div>
          <h2 className="text-xl font-semibold">Caixa fechado</h2>
          <p className="mt-1 text-sm text-muted-foreground">Para realizar vendas, abra o caixa com valor inicial e operador cadastrado.</p>
          <Button className="mt-5" onClick={() => setOpenCashModal(true)}>Abrir caixa</Button>
        </Card>
        <ModalForm open={openCashModal} onOpenChange={setOpenCashModal} title="Abrir caixa" description="Informe o valor inicial e selecione o operador responsável." successMessage="Caixa aberto" onSave={openCash}>
          <div className="grid gap-3 sm:grid-cols-2">
            <div><Label>Valor inicial</Label><Input type="number" value={initialCash} onChange={(event) => setInitialCash(Number(event.target.value))} /></div>
            <div><Label>Operador</Label><Select value={operator} onValueChange={setOperator}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent>{operadores.map((user) => <SelectItem key={user.id} value={user.nome}>{user.nome}</SelectItem>)}</SelectContent></Select></div>
          </div>
          <div><Label>Observação</Label><Input placeholder="Opcional" /></div>
        </ModalForm>
      </>
    );
  }

  return (
    <>
      <div className="h-[100dvh] overflow-y-auto bg-[#f8fafc] p-1.5 font-sans text-[#111827] md:overflow-hidden md:p-2">
        <div className="mx-auto flex min-h-full w-full max-w-[1600px] flex-col overflow-visible rounded-2xl border border-[#e2e8f0] bg-white shadow-md md:h-full md:overflow-hidden">
          <header className="relative border-b border-[#cbd5e1] bg-[#0369a1] px-4 py-3 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-sans text-2xl font-bold italic leading-none md:text-4xl">Fluxia PDV</h1>
                <p className="text-sm italic leading-none md:text-lg">Frente de Caixa</p>
              </div>
              <div className="flex items-center gap-4 text-right text-xs md:text-sm">
                <div>
                  <p className="capitalize">{dateLabel}</p>
                  <p className="text-base font-semibold md:text-lg">{timeLabel}</p>
                </div>
                <button onClick={() => setCloseCashModal(true)} className="rounded-xl bg-red-600 px-3 py-2 text-xs font-bold text-white shadow hover:bg-red-700">Fechar caixa</button>
              </div>
            </div>
          </header>

          <main className="flex min-h-0 flex-1 flex-col lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
            <aside className="shrink-0 border-b border-[#e2e8f0] bg-[#f1f5f9] p-3.5 text-[#111827] lg:overflow-y-auto lg:border-b-0 lg:border-r">
              <label className="mb-2 block">
                <span className="mb-1 block text-xs font-semibold uppercase">Produto:</span>
                <div className="relative">
                  <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b]" />
                  <input
                    ref={productInputRef}
                    value={productSearch}
                    onChange={(event) => { setProductSearch(event.target.value); setSelectedProductId(""); setShowProductOptions(true); setHighlightedProductIndex(0); }}
                    onFocus={() => { const hasSearch = productSearch.trim().length > 0; setShowProductOptions(hasSearch); if (hasSearch && filteredProducts.length > 0) setHighlightedProductIndex(0); }}
                    onBlur={() => window.setTimeout(() => setShowProductOptions(false), 120)}
                    onKeyDown={(event) => {
                      if (!showProductOptions) return;
                      if (event.key === "ArrowDown") { event.preventDefault(); if (filteredProducts.length === 0) return; setHighlightedProductIndex((current) => current >= filteredProducts.length - 1 ? 0 : current + 1); }
                      if (event.key === "ArrowUp") { event.preventDefault(); if (filteredProducts.length === 0) return; setHighlightedProductIndex((current) => current <= 0 ? filteredProducts.length - 1 : current - 1); }
                      if (event.key === "Enter") { event.preventDefault(); const product = filteredProducts[highlightedProductIndex]; if (product) selectProductOption(product); }
                      if (event.key === "Escape") { event.preventDefault(); setShowProductOptions(false); }
                    }}
                    className="h-10 w-full rounded-xl border border-[#cbd5e1] bg-white px-3 py-2 pl-9 text-sm text-[#111827] shadow-sm outline-none transition focus:border-[#0369a1] focus:ring-2 focus:ring-sky-600/20"
                    autoComplete="off"
                  />
                  {showProductOptions && (
                    <ul className="absolute left-0 right-0 top-full z-[120] mt-1 max-h-44 overflow-y-auto rounded-xl border border-[#cbd5e1] bg-white text-[#111827] shadow-lg">
                      {filteredProducts.length > 0 ? filteredProducts.map((item, index) => (
                        <li key={item.id} className={`cursor-pointer border-b border-[#e2e8f0] px-3 py-2 text-xs ${highlightedProductIndex === index ? "bg-[#e2e8f0]" : "hover:bg-[#e2e8f0]"}`} onMouseEnter={() => setHighlightedProductIndex(index)} onMouseDown={() => selectProductOption(item)}>
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-[11px] text-[#475569]">{item.code}</p>
                        </li>
                      )) : <li className="px-2 py-2 text-xs text-[#475569]">Nenhum produto encontrado.</li>}
                    </ul>
                  )}
                </div>
              </label>

              <label className="mb-2 block"><span className="mb-1 block text-xs font-semibold uppercase">Quantidade (volume):</span><input ref={qtyInputRef} value={quantityInput} inputMode="numeric" pattern="[0-9]*" onFocus={(event) => event.target.select()} onChange={(event) => setQuantityInput(sanitizeIntegerInput(event.target.value).slice(0, 4))} onBlur={() => { if (!quantityInput || Number(quantityInput) < 1) setQuantityInput("1"); }} className="h-10 w-full rounded-xl border border-[#cbd5e1] bg-white px-3 py-2 text-lg font-semibold text-[#111827] shadow-sm outline-none focus:border-[#0369a1] focus:ring-2 focus:ring-sky-600/20" /></label>
              <label className="mb-2 block"><span className="mb-1 block text-xs font-semibold uppercase">Preço unitário:</span><input value={selectedProduct ? formatMoneyBr(selectedProduct.salePrice) : "0,00"} className="h-10 w-full rounded-xl border border-[#cbd5e1] bg-[#e2e8f0] px-3 py-2 text-lg font-semibold text-[#111827] shadow-sm" disabled /></label>
              <label className="mb-2 block"><span className="mb-1 block text-xs font-semibold uppercase">Desconto no item:</span><div className="grid grid-cols-[1fr_94px] gap-2"><input value={itemDiscountInput} inputMode="numeric" pattern="[0-9,.]*" onFocus={(event) => event.target.select()} onPaste={(event) => { event.preventDefault(); setItemDiscountInput(maskMoneyBr(event.clipboardData.getData("text"))); }} onChange={(event) => setItemDiscountInput(maskMoneyBr(event.target.value))} className="h-10 w-full rounded-xl border border-[#cbd5e1] bg-white px-3 py-2 text-lg font-semibold text-[#111827] shadow-sm outline-none focus:border-[#0369a1] focus:ring-2 focus:ring-sky-600/20" /><div className="grid grid-cols-2 rounded-xl border border-[#cbd5e1] bg-white p-1"><button type="button" onClick={() => setItemDiscountMode("valor")} className={`rounded-lg text-sm font-bold ${itemDiscountMode === "valor" ? "bg-[#0369a1] text-white" : "text-[#475569]"}`}>R$</button><button type="button" onClick={() => setItemDiscountMode("percentual")} className={`rounded-lg text-sm font-bold ${itemDiscountMode === "percentual" ? "bg-[#0369a1] text-white" : "text-[#475569]"}`}>%</button></div></div><p className="mt-1 text-[11px] text-[#64748b]">Aplicado como {itemDiscountMode === "percentual" ? "porcentagem" : "valor em reais"}. Desconto calculado: {formatMoneyBr(itemDiscount)}</p></label>
              <label className="mb-2 block"><span className="mb-1 block text-xs font-semibold uppercase">Preço total:</span><input value={selectedProduct ? formatMoneyBr(Math.max(0, selectedProduct.salePrice - itemDiscount) * quantity) : "0,00"} className="h-10 w-full rounded-xl border border-[#cbd5e1] bg-[#e2e8f0] px-3 py-2 text-lg font-semibold text-[#111827] shadow-sm" disabled /></label>
              <button type="button" onClick={addItem} className="h-10 w-full rounded-xl bg-[#15803d] px-4 py-2 font-semibold text-white shadow-md transition hover:bg-[#166534]">ADICIONAR ITEM (ENTER)</button>
              <div className="mt-2 border-t border-[#e2e8f0] pt-2 text-sm"><p className="font-semibold">Total volumes: {String(totalVolumes).padStart(4, "0")}</p></div>
              <div className="mt-3 hidden rounded-xl border border-[#e2e8f0] bg-white p-3 sm:block">
                <div className="mx-auto flex h-28 w-full max-w-[220px] items-center justify-center overflow-hidden rounded-xl border-2 border-[#cbd5e1] bg-[#f8fafc] text-[#64748b]">
                  {previewProduct?.imageUrl ? <img src={previewProduct.imageUrl} alt={previewProduct.name} className="h-full w-full object-contain" /> : <div className="flex flex-col items-center gap-1 text-center"><ImageIcon size={28} /><span className="text-xs font-medium">Sem imagem</span></div>}
                </div>
              </div>
            </aside>

            <section className="flex min-h-[55vh] flex-col bg-white lg:min-h-0">
              <div className="grid grid-cols-1 gap-1 border-b border-[#e2e8f0] bg-[#f1f5f9] px-3 py-2 text-xs text-[#111827] sm:grid-cols-[1fr_200px] sm:gap-0"><p><span className="font-semibold">Empresa:</span> Fluxia ERP</p><p className="sm:text-right"><span className="font-semibold">CNPJ:</span> 00.000.000/0001-00</p></div>
              <div className={`border-b px-3 py-2 text-xs font-semibold ${cashCanSell ? "border-green-700/20 bg-green-700/10 text-green-700" : "border-red-600/20 bg-red-600/10 text-red-600"}`}>{cashLabel}</div>
              <div className="border-b border-[#e2e8f0] px-3 py-3"><p className="text-xs font-semibold">Nome produto:</p><h2 className="text-center font-sans text-xl font-semibold leading-none tracking-tight text-[#111827] md:text-3xl">{activeProductName || "AGUARDANDO PRODUTO"}</h2></div>
              <div className="flex min-h-0 flex-1 flex-col px-3 py-3"><p className="mb-1 text-sm font-semibold">Lista de itens:</p><div className="min-h-[180px] flex-1 overflow-auto rounded-xl border border-dashed border-[#cbd5e1] bg-[#f8fafc] md:min-h-0">
                {cart.length === 0 ? <div className="px-2 py-6 text-center text-sm text-[#475569]">Nenhum item no cupom.</div> : <table className="min-w-[900px] w-full text-sm leading-[1.25] md:text-base"><thead><tr className="border-b border-[#e2e8f0] bg-[#f1f5f9] text-[11px] uppercase text-[#475569] md:text-xs"><th className="w-12 px-2 py-1 text-center">#</th><th className="w-28 px-2 py-1 text-left">Código</th><th className="px-2 py-1 text-left">Produto</th><th className="w-32 px-2 py-1 text-center">Qtd</th><th className="w-32 px-2 py-1 text-right">Vl. Unit</th><th className="w-28 px-2 py-1 text-right">Desconto</th><th className="w-32 px-2 py-1 text-right">Vl. Total</th><th className="w-12 px-1 py-1 text-center"></th></tr></thead><tbody>{cart.map((item, index) => <tr key={`${item.id}-${item.discount}`} className="border-b border-[#e2e8f0]"><td className="w-12 px-2 py-1 text-center">{index + 1}</td><td className="w-28 px-2 py-1">{item.code}</td><td className="px-2 py-1">{item.name}</td><td className="w-32 px-2 py-1"><div className="flex items-center justify-center gap-1"><button type="button" onClick={() => updateCartQuantity(item, -1)} className="inline-flex h-7 w-7 items-center justify-center rounded bg-[#e2e8f0] text-[#111827]"><Minus size={12} /></button><span className="inline-flex h-7 min-w-10 items-center justify-center rounded border bg-white px-2 font-semibold">{item.quantity}</span><button type="button" onClick={() => updateCartQuantity(item, 1)} className="inline-flex h-7 w-7 items-center justify-center rounded bg-[#e2e8f0] text-[#111827]"><Plus size={12} /></button></div></td><td className="w-32 px-2 py-1 text-right">{formatMoneyBr(item.unitPrice)}</td><td className="w-28 px-2 py-1 text-right text-red-600">{item.discount ? `-${formatMoneyBr(item.discount * item.quantity)}` : "0,00"}</td><td className="w-32 px-2 py-1 text-right">{formatMoneyBr(Math.max(0, item.unitPrice - item.discount) * item.quantity)}</td><td className="w-12 px-1 py-1 text-center"><button type="button" onClick={() => askRemoveItem(item)} className="inline-flex h-7 w-7 items-center justify-center rounded-sm bg-red-600 text-white"><Trash2 size={12} /></button></td></tr>)}</tbody></table>}
              </div></div>
              <div className="md:sticky md:bottom-0 md:z-10 md:shadow-[0_-8px_18px_rgba(15,23,42,0.08)]">
                <div className="border-t border-[#e2e8f0] bg-[#f1f5f9] px-3 py-1.5 text-sm text-[#111827]">00 - Ajuda</div>
                <div className="grid grid-cols-[1fr_160px] border-t border-[#e2e8f0] md:grid-cols-[1fr_220px]"><div className="bg-[#f1f5f9] px-3 py-2 text-right text-sm font-semibold uppercase text-[#111827]">SUB TOTAL:</div><div className="bg-[#0369a1] px-3 py-2 text-right font-sans text-3xl font-bold text-white md:text-4xl">R$ {formatMoneyBr(subtotal)}</div></div>
                <div className="grid grid-cols-1 gap-2 border-t border-[#e2e8f0] px-3 py-3 sm:grid-cols-3"><button type="button" onClick={cancelSale} className="h-11 w-full rounded-xl bg-red-600 px-4 py-2 font-semibold text-white shadow-md hover:bg-red-700">✖ CANCELAR (F8)</button><button type="button" onClick={printLastSale} disabled={printLoading} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#cbd5e1] px-4 py-2 text-sm font-semibold text-[#475569] transition hover:bg-[#e2e8f0] hover:text-[#111827] disabled:opacity-60">{printLoading ? <Loader2 size={16} className="animate-spin" /> : <Printer size={16} />}Imprimir última venda</button><button type="button" onClick={openPayment} className="h-11 w-full rounded-xl bg-[#15803d] px-4 py-2 font-semibold text-white shadow-md hover:bg-[#166534] disabled:cursor-not-allowed disabled:opacity-60" disabled={!cashCanSell}>PAGAMENTO (F12)</button></div>
                <footer className="space-y-0.5 border-t border-[#e2e8f0] bg-[#f8fafc] px-3 py-2 text-[11px] text-[#475569] sm:grid sm:grid-cols-3 sm:items-center sm:space-y-0 sm:text-xs"><p>Usuário: {s.caixaOperador || operator}</p><p className="sm:text-center">Estabelecimento: Fluxia ERP</p><p className="sm:text-right">Prévia impressão: Sim • Caixa: {cashCanSell ? "PDV01 aberto" : "bloqueado"}</p></footer>
              </div>
            </section>
          </main>
        </div>

        {checkoutOpen && <div className="fixed inset-0 z-[180] flex items-end bg-black/45 md:items-center md:justify-center"><div className="w-full rounded-t-2xl border border-[#e2e8f0] bg-white p-4 md:max-w-xl md:rounded-2xl"><div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-semibold text-[#111827]">Pagamento</h2><button type="button" onClick={() => setCheckoutOpen(false)} className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#e2e8f0] text-[#475569]"><X size={14} /></button></div><div className="space-y-3"><div className="grid gap-2 sm:grid-cols-[1fr_auto]"><div><Label>Cliente da venda</Label><Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}><SelectTrigger><SelectValue placeholder="Consumidor avulso" /></SelectTrigger><SelectContent><SelectItem value="avulso">Consumidor avulso</SelectItem>{s.clientes.map((cliente) => <SelectItem key={cliente.id} value={cliente.id}>{cliente.nome}</SelectItem>)}</SelectContent></Select></div><Button type="button" variant="outline" className="self-end" onClick={() => setClientModal(true)}>Cadastrar cliente</Button></div><label className="block"><span className="mb-1.5 block text-sm text-[#475569]">CPF na nota (opcional)</span><input value={cpfNota} onChange={(event) => setCpfNota(event.target.value)} className="w-full rounded-xl border border-[#cbd5e1] bg-white px-3 py-2 text-[#111827] shadow-sm outline-none focus:border-[#0369a1] focus:ring-2 focus:ring-sky-600/20" placeholder="Somente se cliente pedir" /></label><div><Label>Forma de pagamento</Label><Select value={paymentType} onValueChange={(value) => setPaymentType(value as PaymentType)}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent>{paymentOptions.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent></Select></div>{paymentType === "misto" && <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">Pagamento misto preparado para backend: dividir total em múltiplas formas no fechamento real.</div>}{["boleto", "crediario"].includes(paymentType) && <div className="rounded-xl border border-sky-200 bg-sky-50 p-3 text-sm text-sky-900">Esta forma gera conta a receber vinculada ao cliente cadastrado. Para venda avulsa, informe CPF ou cadastre o cliente.</div>}{paymentType === "dinheiro" && <label className="block"><span className="mb-1.5 block text-sm text-[#475569]">Valor recebido</span><input value={cashGiven} inputMode="numeric" pattern="[0-9,.]*" onBeforeInput={preventNonDigitBeforeInput} onPaste={pasteCashGiven} onChange={(event) => setCashGiven(maskMoneyBr(event.target.value))} className="w-full rounded-xl border border-[#cbd5e1] bg-white px-3 py-2 text-[#111827] shadow-sm outline-none focus:border-[#0369a1] focus:ring-2 focus:ring-sky-600/20" placeholder="0,00" /></label>}<div className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-3 text-sm"><div className="flex items-center justify-between"><span className="text-[#475569]">Descontos nos itens</span><span className="font-semibold text-red-600">- R$ {formatMoneyBr(totalDiscount)}</span></div><div className="mt-1 flex items-center justify-between"><span className="text-[#475569]">Total</span><span className="font-semibold text-[#111827]">R$ {formatMoneyBr(subtotal)}</span></div>{paymentType === "dinheiro" && <div className="mt-1 flex items-center justify-between"><span className="text-[#475569]">Troco</span><span className="font-semibold text-[#15803d]">R$ {formatMoneyBr(changeValue)}</span></div>}</div></div><div className="mt-4 grid gap-2 sm:grid-cols-2"><button type="button" onClick={() => setCheckoutOpen(false)} className="rounded-xl bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700">Voltar</button><button type="button" onClick={confirmPayment} disabled={paymentLoading} className="inline-flex items-center justify-center rounded-xl bg-[#15803d] px-4 py-2 font-semibold text-white hover:bg-[#166534] disabled:opacity-60">{paymentLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Confirmar</button></div></div></div>}
      </div>

      <ConfirmDialog open={cancelModal} onOpenChange={setCancelModal} title="Cancelar venda" description="Isso limpa o cupom atual." variant="destructive" confirmText="Cancelar venda" successMessage="Venda cancelada" onConfirm={confirmCancelSale} />
      <ConfirmDialog open={!!removeConfirm} onOpenChange={(open) => !open && setRemoveConfirm(null)} title="Remover item" description={`Confirma a remoção de ${removeConfirm?.name ?? "este item"} do carrinho?`} variant="destructive" confirmText="Remover item" successMessage="Item removido" onConfirm={confirmRemoveItem} />
      <ConfirmDialog open={closeCashModal} onOpenChange={setCloseCashModal} title="Fechar caixa" description="Isso encerra a sessão do caixa e bloqueia novas vendas até nova abertura." variant="destructive" confirmText="Fechar caixa" successMessage="Caixa fechado" onConfirm={closeCash} />

      <ModalForm open={clientModal} onOpenChange={setClientModal} title="Cadastrar cliente" description="Cliente opcional para recompra, crediário e histórico de pós-venda." successMessage="Cliente cadastrado e vinculado à venda" onSave={createClient}>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2"><Label>Nome do cliente</Label><Input value={clientDraft.nome} onChange={(event) => setClientDraft({ ...clientDraft, nome: event.target.value })} placeholder="Nome completo ou razão social" /></div>
          <div><Label>CPF/CNPJ</Label><Input value={clientDraft.documento} onChange={(event) => setClientDraft({ ...clientDraft, documento: event.target.value })} placeholder="Opcional" /></div>
          <div><Label>Telefone</Label><Input value={clientDraft.telefone} onChange={(event) => setClientDraft({ ...clientDraft, telefone: event.target.value })} placeholder="WhatsApp" /></div>
          <div><Label>E-mail</Label><Input value={clientDraft.email} onChange={(event) => setClientDraft({ ...clientDraft, email: event.target.value })} placeholder="Opcional" /></div>
          <div><Label>Cidade</Label><Input value={clientDraft.cidade} onChange={(event) => setClientDraft({ ...clientDraft, cidade: event.target.value })} /></div>
          <div><Label>Estado</Label><Input value={clientDraft.estado} onChange={(event) => setClientDraft({ ...clientDraft, estado: event.target.value })} placeholder="UF" /></div>
        </div>
      </ModalForm>
      <Dialog open={!!receiptPreview} onOpenChange={(open) => !open && setReceiptPreview(null)}><DialogContent><DialogHeader><DialogTitle>Venda registrada</DialogTitle><DialogDescription>Comprovante mockado da última venda.</DialogDescription></DialogHeader>{receiptPreview && <div className="rounded-xl border bg-muted/30 p-4 text-sm"><p><strong>Código:</strong> {receiptPreview.codigo}</p><p><strong>Total:</strong> {brl(receiptPreview.total)}</p><p><strong>Pagamento:</strong> {receiptPreview.payment}</p></div>}<DialogFooter><Button onClick={() => setReceiptPreview(null)}>Fechar</Button></DialogFooter></DialogContent></Dialog>
    </>
  );
}
