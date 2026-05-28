import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ButtonWithLoading } from "@/components/fluxia/ButtonWithLoading";
import { Sparkles, Mail, Lock } from "lucide-react";
import { useStore } from "@/mock/store";
import { sleep } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

const perfis = ["Administrador", "Operador PDV", "BPO Financeiro", "Super Admin"] as const;

function LoginPage() {
  const navigate = useNavigate();
  const { set } = useStore();
  const [email, setEmail] = useState("carlos@fluxia.com");
  const [senha, setSenha] = useState("••••••••");
  const [perfil, setPerfil] = useState<(typeof perfis)[number]>("Administrador");
  const [loading, setLoading] = useState(false);

  const entrar = async () => {
    if (!email || !senha) {
      toast.error("Informe e-mail e senha.");
      return;
    }
    setLoading(true);
    await sleep(900);
    set("perfil", perfil);
    toast.success(`Bem-vindo ao Fluxia, ${perfil}!`);
    navigate({ to: perfil === "Super Admin" ? "/super-admin" : "/dashboard" });
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Esquerda: branding */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-secondary p-12 text-secondary-foreground lg:flex">
        <div className="fluxia-grid-bg absolute inset-0 opacity-20" />
        <div className="relative">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="text-xl font-semibold tracking-tight">Fluxia</span>
          </div>
        </div>
        <div className="relative space-y-6">
          <h1 className="text-4xl font-semibold leading-tight tracking-tight">
            Gestão financeira, PDV e BPO em um único lugar.
          </h1>
          <p className="max-w-md text-white/70">
            Operação simples para a frente de caixa, robustez para o BPO financeiro e
            visão executiva para a tomada de decisão.
          </p>
          <div className="grid max-w-md grid-cols-3 gap-4 pt-4">
            {[
              ["R$ 84.750", "Receita mensal"],
              ["+12%", "Crescimento"],
              ["36", "Empresas ativas"],
            ].map(([v, l]) => (
              <div key={l} className="rounded-lg border border-white/10 bg-white/5 p-3">
                <p className="text-lg font-semibold">{v}</p>
                <p className="text-xs text-white/60">{l}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="relative text-xs text-white/40">© 2026 Fluxia. Todos os direitos reservados.</p>
      </div>

      {/* Direita: formulário */}
      <div className="flex flex-col justify-center bg-background px-6 py-12 md:px-16">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="text-xl font-semibold">Fluxia</span>
          </div>

          <h2 className="text-2xl font-semibold tracking-tight">Entrar na sua conta</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Acesse o painel Fluxia com suas credenciais.
          </p>

          <Card className="mt-6 space-y-5 p-6 shadow-card">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email" type="email" value={email}
                  onChange={(e) => setEmail(e.target.value)} className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="senha">Senha</Label>
                <button
                  type="button"
                  className="text-xs font-medium text-primary hover:underline"
                  onClick={() => toast.info("Enviamos um link para seu e-mail")}
                >
                  Esqueci minha senha
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="senha" type="password" value={senha}
                  onChange={(e) => setSenha(e.target.value)} className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Perfil de teste</Label>
              <div className="grid grid-cols-2 gap-2">
                {perfis.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPerfil(p)}
                    className={`rounded-lg border p-2.5 text-left text-xs transition ${
                      perfil === p
                        ? "border-primary bg-primary-soft text-primary font-medium"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <ButtonWithLoading loading={loading} onClick={entrar} className="w-full">
              Entrar
            </ButtonWithLoading>

            <p className="text-center text-xs text-muted-foreground">
              Ao continuar você concorda com nossos termos.
            </p>
          </Card>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Não tem uma conta? <Button variant="link" className="h-auto p-0 text-xs text-primary">Fale conosco</Button>
          </p>
        </div>
      </div>
    </div>
  );
}
