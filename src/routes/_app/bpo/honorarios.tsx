import { createFileRoute } from "@tanstack/react-router";
import { BpoModulePage } from "@/components/fluxia/BpoModulePage";

export const Route = createFileRoute("/_app/bpo/honorarios")({
  component: () => <BpoModulePage kind="honorarios" />,
});
