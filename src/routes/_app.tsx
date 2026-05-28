import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/fluxia/AppShell";

export const Route = createFileRoute("/_app")({
  component: AppShell,
});
