import { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { LucideIcon } from "lucide-react";

export interface ModuleNavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
  badge?: string | number;
}

interface Props {
  title?: string;
  items: ModuleNavItem[];
  children: ReactNode;
  compact?: boolean;
  contentClassName?: string;
  fullHeight?: boolean;
}

export function ModuleSideNav({ title, items, children, compact = true, contentClassName = "", fullHeight = false }: Props) {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const sidebarWidth = compact ? "lg:grid-cols-[168px_1fr]" : "lg:grid-cols-[220px_1fr]";
  const heightClass = fullHeight ? "h-full max-h-full" : "h-[calc(100vh-8rem)] max-h-[calc(100vh-8rem)]";
  const asideHeight = fullHeight ? "lg:h-full" : "lg:h-[calc(100vh-8rem)]";

  return (
    <div className={`grid min-w-0 gap-4 overflow-hidden ${heightClass} ${sidebarWidth}`}>
      <aside className={`custom-scrollbar min-w-0 flex-shrink-0 overflow-x-auto border-b pb-2 lg:sticky lg:top-0 ${asideHeight} lg:overflow-y-auto lg:overflow-x-hidden lg:border-b-0 lg:pr-2`}>
        {title && <p className="mb-2 hidden px-3 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground lg:block">{title}</p>}
        <div className="flex gap-2 lg:block lg:space-y-1">
          {items.map((i) => {
            const active = i.exact ? pathname === i.to : pathname === i.to || pathname.startsWith(i.to + "/");
            return (
              <Link
                key={i.to}
                to={i.to}
                className={`flex min-w-max items-center gap-2 rounded-xl px-3 py-2 text-xs transition lg:min-w-0 ${active ? "bg-primary-soft font-medium text-primary" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"}`}
              >
                <i.icon className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{i.label}</span>
                {i.badge !== undefined && <span className="ml-auto rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary">{i.badge}</span>}
              </Link>
            );
          })}
        </div>
      </aside>
      <div className={`custom-scrollbar min-w-0 overflow-y-auto pr-1 ${contentClassName}`}>{children}</div>
    </div>
  );
}
