import { createFileRoute } from "@tanstack/react-router";
import { FinanceiroGenericPage } from "@/components/fluxia/FinanceiroGenericPage";

export const Route = createFileRoute("/_app/financeiro/cobrancas")({
  component: () => <FinanceiroGenericPage kind="cobrancas" />,
});
