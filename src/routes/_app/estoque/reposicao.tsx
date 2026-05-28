import { createFileRoute } from "@tanstack/react-router";
import { EstoqueGenericPage } from "@/components/fluxia/EstoqueGenericPage";

export const Route = createFileRoute("/_app/estoque/reposicao")({
  component: () => <EstoqueGenericPage kind="reposicao" />,
});
