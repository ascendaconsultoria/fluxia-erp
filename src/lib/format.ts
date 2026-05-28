export const brl = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const num = (n: number) => n.toLocaleString("pt-BR");

export const pct = (n: number) =>
  `${n > 0 ? "+" : ""}${n.toFixed(1).replace(".", ",")}%`;

export const formatDate = (d: string | Date) => {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("pt-BR");
};

export const formatDateTime = (d: string | Date) => {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const sleep = (ms = 700) => new Promise((r) => setTimeout(r, ms));

export const uid = () => Math.random().toString(36).slice(2, 10);
