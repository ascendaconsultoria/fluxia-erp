import { Button, ButtonProps } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { forwardRef } from "react";

interface Props extends ButtonProps {
  loading?: boolean;
  loadingText?: string;
}

export const ButtonWithLoading = forwardRef<HTMLButtonElement, Props>(
  ({ loading, loadingText, disabled, children, ...rest }, ref) => (
    <Button ref={ref} disabled={loading || disabled} {...rest}>
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {loading ? (loadingText ?? "Processando...") : children}
    </Button>
  ),
);
ButtonWithLoading.displayName = "ButtonWithLoading";
