import { createFileRoute } from "@tanstack/react-router";
import { FinanceiroGenericPage } from "@/components/fluxia/FinanceiroGenericPage";

export const Route = createFileRoute("/_app/financeiro/notificacoes")({
  component: () => <FinanceiroGenericPage kind="notificacoes" />,
});
