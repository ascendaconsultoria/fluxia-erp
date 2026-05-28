import { createFileRoute } from "@tanstack/react-router";
import { BpoModulePage } from "@/components/fluxia/BpoModulePage";

export const Route = createFileRoute("/_app/bpo/relatorios")({
  component: () => <BpoModulePage kind="relatorios" />,
});
