import { ReactNode, useState } from "react";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ButtonWithLoading } from "./ButtonWithLoading";
import { toast } from "sonner";
import { sleep } from "@/lib/format";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  onSave: () => void | Promise<void>;
  saveText?: string;
  successMessage?: string;
  size?: "default" | "lg" | "xl";
}

export function ModalForm({
  open, onOpenChange, title, description, children, onSave,
  saveText = "Salvar", successMessage = "Registro salvo com sucesso", size = "default",
}: Props) {
  const [loading, setLoading] = useState(false);

  const sizeClass = {
    default: "sm:max-w-lg",
    lg: "sm:max-w-2xl",
    xl: "sm:max-w-4xl",
  }[size];

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave();
      await sleep(600);
      toast.success(successMessage);
      onOpenChange(false);
    } catch (e: any) {
      toast.error(e?.message || "Falha ao salvar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${sizeClass} max-h-[90vh] overflow-y-auto`}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="space-y-4 py-2">{children}</div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancelar
          </Button>
          <ButtonWithLoading loading={loading} onClick={handleSave}>
            {saveText}
          </ButtonWithLoading>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
