import { Link } from "@tanstack/react-router";
import { LucideIcon, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";

export interface SectionMenuItem {
  to: string;
  label: string;
  description?: string;
  icon: LucideIcon;
  badge?: string | number;
}

export function SectionMenu({ items }: { items: SectionMenuItem[] }) {
  return (
    <Card className="divide-y overflow-hidden shadow-soft">
      {items.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className="group flex items-center justify-between gap-4 p-4 transition-colors hover:bg-muted/40"
        >
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-primary-soft p-2.5 text-primary">
              <item.icon className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium text-foreground">{item.label}</p>
                {item.badge !== undefined && (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    {item.badge}
                  </span>
                )}
              </div>
              {item.description && (
                <p className="mt-0.5 text-sm text-muted-foreground">{item.description}</p>
              )}
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </Link>
      ))}
    </Card>
  );
}
