import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useStore } from "@/mock/store";

export const Route = createFileRoute("/_app/controle")({ component: ControleRedirect });

function ControleRedirect() {
  const { s } = useStore();
  if (s.perfil === "Super Admin") return <Navigate to="/super-admin" />;
  if (s.perfil === "BPO Financeiro") return <Navigate to="/bpo" />;
  return <Navigate to="/dashboard" />;
}
