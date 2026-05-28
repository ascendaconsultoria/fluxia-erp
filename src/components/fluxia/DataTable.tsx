import { ReactNode, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { EmptyState } from "./EmptyState";

export interface Column<T> {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
}

interface Props<T> {
  data: T[];
  columns: Column<T>[];
  searchKeys?: (keyof T)[];
  searchPlaceholder?: string;
  toolbar?: ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  rowKey?: (row: T) => string;
  pageSize?: number;
  maxHeight?: string;
  stickyHeader?: boolean;
  compact?: boolean;
}

export function DataTable<T extends Record<string, any>>({
  data, columns, searchKeys, searchPlaceholder = "Buscar...",
  toolbar, emptyTitle = "Nenhum registro encontrado",
  emptyDescription = "Tente ajustar os filtros ou cadastrar um novo registro.",
  rowKey, pageSize = 10, maxHeight = "calc(100vh - 20rem)", stickyHeader = true, compact = false,
}: Props<T>) {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const filtered = useMemo(() => {
    if (!q || !searchKeys) return data;
    const term = q.toLowerCase();
    return data.filter((r) => searchKeys.some((k) => String(r[k] ?? "").toLowerCase().includes(term)));
  }, [data, q, searchKeys]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const changeSearch = (value: string) => {
    setQ(value);
    setPage(1);
  };

  return (
    <Card className="flex min-h-0 flex-col overflow-hidden rounded-2xl shadow-soft">
      <div className="flex flex-shrink-0 flex-col gap-3 border-b bg-surface/50 p-3 md:flex-row md:items-center md:justify-between">
        {searchKeys && (
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => changeSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="h-9 pl-9 text-sm"
            />
          </div>
        )}
        {toolbar && <div className="flex flex-wrap gap-2">{toolbar}</div>}
      </div>

      {filtered.length === 0 ? (
        <div className="p-10">
          <EmptyState title={emptyTitle} description={emptyDescription} />
        </div>
      ) : (
        <div className="custom-scrollbar min-h-0 overflow-auto" style={{ maxHeight }}>
          <Table>
            <TableHeader className={stickyHeader ? "sticky top-0 z-10 bg-surface shadow-[0_1px_0_var(--border)]" : undefined}>
              <TableRow className="bg-muted/40">
                {columns.map((c) => (
                  <TableHead key={c.key} className={`${compact ? "h-9 text-xs" : ""} ${c.className ?? ""}`}>{c.header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.map((row, i) => (
                <TableRow key={rowKey ? rowKey(row) : `${safePage}-${i}`} className="hover:bg-muted/30">
                  {columns.map((c) => (
                    <TableCell key={c.key} className={`${compact ? "py-2 text-xs" : "text-sm"} ${c.className ?? ""}`}>
                      {c.cell(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="flex flex-shrink-0 flex-wrap items-center justify-between gap-2 border-t bg-surface/30 px-4 py-2.5 text-xs text-muted-foreground">
        <span>{filtered.length} registro(s) • {pageSize} por página</span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={safePage <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <span>Página {safePage} de {totalPages}</span>
          <Button variant="outline" size="sm" disabled={safePage >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
