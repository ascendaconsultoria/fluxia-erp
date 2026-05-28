import { createFileRoute } from "@tanstack/react-router";
import { FinanceiroGenericPage } from "@/components/fluxia/FinanceiroGenericPage";

export const Route = createFileRoute("/_app/financeiro/contas-carteiras")({
  component: () => <FinanceiroGenericPage kind="contas-carteiras" />,
});
