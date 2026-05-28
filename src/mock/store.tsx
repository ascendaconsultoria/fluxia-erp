import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  seedEmpresas, seedClientes, seedFornecedores, seedProdutos, seedVendas,
  seedLancamentos, seedClientesBPO, seedPendencias, seedFechamentos,
  seedPlanos, seedUsuarios,
  Empresa, Cliente, Fornecedor, Produto, Venda, Lancamento,
  ClienteBPO, Pendencia, Fechamento, Plano, Usuario,
} from "./data";

export type ThemeMode = "light" | "dark" | "system";
export type SidebarMode = "expanded" | "collapsed" | "auto";
export type PerfilUsuario = "Administrador" | "Operador PDV" | "BPO Financeiro" | "Super Admin" | "Gestor Financeiro" | "Gestor de Estoque" | "Vendedor" | "Visualizador";

interface StoreShape {
  empresas: Empresa[];
  clientes: Cliente[];
  fornecedores: Fornecedor[];
  produtos: Produto[];
  vendas: Venda[];
  lancamentos: Lancamento[];
  clientesBPO: ClienteBPO[];
  pendencias: Pendencia[];
  fechamentos: Fechamento[];
  planos: Plano[];
  usuarios: Usuario[];
  empresaAtual: string;
  perfil: PerfilUsuario;
  themeMode: ThemeMode;
  sidebarMode: SidebarMode;
  caixaAberto: boolean;
  caixaSaldoInicial: number;
  caixaOperador: string;
}

type Ctx = {
  s: StoreShape;
  set: <K extends keyof StoreShape>(key: K, value: StoreShape[K]) => void;
  update: (fn: (s: StoreShape) => StoreShape) => void;
  reset: () => void;
};

const KEY = "fluxia-store-v1";

const initial: StoreShape = {
  empresas: seedEmpresas,
  clientes: seedClientes,
  fornecedores: seedFornecedores,
  produtos: seedProdutos,
  vendas: seedVendas,
  lancamentos: seedLancamentos,
  clientesBPO: seedClientesBPO,
  pendencias: seedPendencias,
  fechamentos: seedFechamentos,
  planos: seedPlanos,
  usuarios: seedUsuarios,
  empresaAtual: "Tech Solutions",
  perfil: "Administrador",
  themeMode: "system",
  sidebarMode: "auto",
  caixaAberto: false,
  caixaSaldoInicial: 0,
  caixaOperador: "",
};

const StoreCtx = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<StoreShape>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setS({ ...initial, ...JSON.parse(raw) });
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {}
    }
  }, [s, hydrated]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const syncStore = () => {
      try {
        const raw = localStorage.getItem(KEY);
        if (raw) setS((prev) => ({ ...prev, ...JSON.parse(raw) }));
      } catch {}
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === KEY || event.key === "fluxia-pdv-close-signal") syncStore();
    };
    const onManualSync = () => syncStore();
    window.addEventListener("storage", onStorage);
    window.addEventListener("fluxia-store-sync", onManualSync);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("fluxia-store-sync", onManualSync);
    };
  }, []);

  const value: Ctx = {
    s,
    set: (k, v) => setS((prev) => ({ ...prev, [k]: v })),
    update: (fn) => setS((prev) => fn(prev)),
    reset: () => { setS(initial); try { localStorage.removeItem(KEY); } catch {} },
  };

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
