import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";
import { useStore } from "@/mock/store";

export const Route = createFileRoute("/_app/bpo")({ component: BpoLayout });

function BpoLayout() {
  const { s } = useStore();
  if (s.perfil !== "BPO Financeiro") {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center overflow-hidden">
        <Card className="max-w-xl rounded-2xl p-8 text-center shadow-soft">
          <ShieldCheck className="mx-auto h-10 w-10 text-primary" />
          <h1 className="mt-4 text-2xl font-bold">BPO restrito</h1>
          <p className="mt-2 text-sm text-muted-foreground">As rotas do BPO Financeiro são invisíveis e inacessíveis para usuários de operação comum.</p>
        </Card>
      </div>
    );
  }

  return <Outlet />;
}
