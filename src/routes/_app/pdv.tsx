import { createFileRoute, Outlet } from "@tanstack/react-router";
import { LayoutDashboard, Wallet, History, ReceiptText, Repeat2, Settings } from "lucide-react";
import { ModuleSideNav } from "@/components/fluxia/ModuleSideNav";
import { useStore } from "@/mock/store";

export const Route = createFileRoute("/_app/pdv")({ component: PdvLayout });

const items = [
  { to: "/pdv/caixa", label: "Caixa", icon: Wallet },
  { to: "/pdv/visao-geral", label: "Visão geral do caixa", icon: LayoutDashboard },
  { to: "/pdv/fiscal", label: "Fiscal NFC-e/NF-e", icon: ReceiptText },
  { to: "/pdv/trocas-devolucoes", label: "Trocas e devoluções", icon: Repeat2 },
  { to: "/pdv/configuracoes", label: "Configurações PDV", icon: Settings },
  { to: "/pdv/historico", label: "Histórico", icon: History },
];

function PdvLayout() {
  const { s } = useStore();

  const standalone = typeof window !== "undefined" && window.location.search.includes("modo=caixa");

  if (standalone) {
    return (
      <div className="fixed inset-0 z-[9999] m-0 h-screen w-screen overflow-hidden bg-background p-0">
        <Outlet />
      </div>
    );
  }

  return (
    <ModuleSideNav title="PDV" items={items}>
      <Outlet />
    </ModuleSideNav>
  );
}
