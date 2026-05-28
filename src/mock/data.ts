import { uid } from "@/lib/format";

export type ID = string;
export type Status = "ativo" | "inativo" | "suspenso";

export interface Empresa {
  id: ID;
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  email: string;
  telefone: string;
  segmento: string;
  plano: string;
  status: Status;
  responsavel: string;
  valorMensal: number;
  dataCadastro: string;
  ultimoAcesso: string;
  usuarios: number;
}

export interface Cliente {
  id: ID;
  nome: string;
  documento: string;
  email: string;
  telefone: string;
  cidade: string;
  estado: string;
  status: Status;
  totalCompras: number;
}

export interface Fornecedor {
  id: ID;
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  email: string;
  telefone: string;
  categoria: string;
  status: Status;
}

export interface Produto {
  id: ID;
  nome: string;
  codigo: string;
  codigoBarras: string;
  categoria: string;
  marca: string;
  unidade: string;
  custo: number;
  preco: number;
  estoque: number;
  estoqueMinimo: number;
  status: Status;
  imagem?: string;
}

export interface Venda {
  id: ID;
  codigo: string;
  data: string;
  operador: string;
  cliente?: string;
  total: number;
  formaPagamento: string;
  status: "concluida" | "cancelada" | "aberta";
  itens: { produto: string; qtd: number; valor: number }[];
}

export interface Lancamento {
  id: ID;
  tipo: "receita" | "despesa";
  descricao: string;
  categoria: string;
  contraparte: string;
  vencimento: string;
  pagamento?: string;
  valor: number;
  status: "pendente" | "pago" | "recebido" | "atrasado";
  conta: string;
  forma: string;
}

export interface ClienteBPO {
  id: ID;
  empresa: string;
  cnpj: string;
  responsavel: string;
  plano: string;
  status: Status;
  valorMensal: number;
  pendencias: number;
  fechamentoAtual: string;
  ultimoAcesso: string;
}

export interface Pendencia {
  id: ID;
  cliente: string;
  tipo: string;
  prioridade: "baixa" | "media" | "alta";
  prazo: string;
  responsavel: string;
  status: "aberta" | "andamento" | "concluida";
}

export interface Fechamento {
  id: ID;
  cliente: string;
  mes: string;
  status: "nao_iniciado" | "andamento" | "concluido" | "atrasado";
  progresso: number;
  responsavel: string;
  atualizado: string;
}

export interface Plano {
  id: ID;
  nome: string;
  valor: number;
  limiteUsuarios: number;
  limiteClientesBPO: number;
  modulos: string[];
  status: Status;
}

export interface Usuario {
  id: ID;
  nome: string;
  email: string;
  perfil: string;
  status: Status;
  ultimoAcesso: string;
}

// ---------- seeds ----------

export const seedEmpresas: Empresa[] = [
  ["Tech Solutions LTDA", "Tech Solutions", "12.345.678/0001-99", "Profissional", "Carlos Silva", 349, "ativo"],
  ["Padaria Pão Quente ME", "Pão Quente", "23.456.789/0001-12", "Starter", "Ana Pereira", 149, "ativo"],
  ["Contábil Express", "Contábil Express", "34.567.890/0001-23", "BPO", "Maria Souza", 599, "ativo"],
  ["Mercado Bom Preço", "Bom Preço", "45.678.901/0001-34", "Profissional", "João Lima", 349, "ativo"],
  ["Studio Bella", "Studio Bella", "56.789.012/0001-45", "Starter", "Júlia Rocha", 149, "inativo"],
  ["AutoCenter Veloz", "Veloz", "67.890.123/0001-56", "Enterprise", "Pedro Alves", 1290, "ativo"],
  ["BPO Master", "BPO Master", "78.901.234/0001-67", "BPO", "Renata Lima", 599, "ativo"],
  ["Padaria do Bairro", "Do Bairro", "89.012.345/0001-78", "Starter", "Marcos Reis", 149, "suspenso"],
].map(([rs, nf, cnpj, plano, resp, valor, status], i) => ({
  id: uid(),
  razaoSocial: rs as string,
  nomeFantasia: nf as string,
  cnpj: cnpj as string,
  email: `contato@${(nf as string).toLowerCase().replace(/\s+/g, "")}.com.br`,
  telefone: `(11) 9${1000 + i}-${2000 + i * 11}`,
  segmento: ["Tecnologia", "Alimentação", "Serviços", "Varejo", "Beleza", "Automotivo", "Contabilidade", "Alimentação"][i],
  plano: plano as string,
  status: status as Status,
  responsavel: resp as string,
  valorMensal: valor as number,
  dataCadastro: `2024-${String((i % 12) + 1).padStart(2, "0")}-15`,
  ultimoAcesso: `2026-05-${String(15 + i).padStart(2, "0")}`,
  usuarios: 3 + i,
}));

export const seedClientes: Cliente[] = [
  "Ana Beatriz Costa,123.456.789-00,SP",
  "Bruno Henrique Lima,234.567.890-11,RJ",
  "Carla Mendes Souza,345.678.901-22,MG",
  "Diego Ramos Oliveira,456.789.012-33,SP",
  "Eduarda Pires,567.890.123-44,PR",
  "Fernando Tavares,678.901.234-55,SC",
  "Gabriela Nunes,789.012.345-66,RS",
  "Henrique Castro,890.123.456-77,SP",
  "Isabela Martins,901.234.567-88,BA",
  "João Vitor Silva,012.345.678-99,GO",
].map((s, i) => {
  const [nome, doc, uf] = s.split(",");
  return {
    id: uid(),
    nome,
    documento: doc,
    email: `${nome.toLowerCase().split(" ")[0]}@email.com`,
    telefone: `(${10 + i}) 9${1000 + i}-${4000 + i}`,
    cidade: ["São Paulo", "Rio de Janeiro", "Belo Horizonte", "Campinas", "Curitiba", "Florianópolis", "Porto Alegre", "Santos", "Salvador", "Goiânia"][i],
    estado: uf,
    status: (i === 4 ? "inativo" : "ativo") as Status,
    totalCompras: 1200 + i * 837,
  };
});

export const seedFornecedores: Fornecedor[] = [
  ["Distribuidora Alfa LTDA", "Alfa Dist", "11.111.111/0001-11", "Bebidas"],
  ["Importadora Beta", "Beta Imp", "22.222.222/0001-22", "Eletrônicos"],
  ["Fábrica Gama", "Gama", "33.333.333/0001-33", "Confecção"],
  ["Atacado Delta", "Delta", "44.444.444/0001-44", "Alimentos"],
  ["Suprimentos Épsilon", "Épsilon", "55.555.555/0001-55", "Limpeza"],
].map(([rs, nf, cnpj, cat], i) => ({
  id: uid(),
  razaoSocial: rs as string,
  nomeFantasia: nf as string,
  cnpj: cnpj as string,
  email: `compras@${(nf as string).toLowerCase().replace(/\s+/g, "")}.com.br`,
  telefone: `(11) 3${100 + i}-${4000 + i}`,
  categoria: cat as string,
  status: "ativo" as Status,
  imagem: ["/pdv-assets/cafe.png", "/pdv-assets/pao.png", "/pdv-assets/notebook.png", "/pdv-assets/mouse.png", "/pdv-assets/camiseta.png", "/pdv-assets/camiseta.png", "/pdv-assets/caderno.png", "/pdv-assets/caderno.png", "/pdv-assets/agua.png", "/pdv-assets/notebook.png", "/pdv-assets/mouse.png", "/pdv-assets/pao.png"][i],
}));

export const seedProdutos: Produto[] = [
  ["Café Especial 250g", "CAF250", "Bebidas", "Aroma", 18.5, 32.9, 45, 10],
  ["Pão Francês kg", "PAOFR", "Padaria", "Casa", 7.5, 14.9, 8, 20],
  ["Notebook Pro 14\"", "NTB14", "Eletrônicos", "Vision", 3200, 4599, 6, 3],
  ["Mouse Wireless", "MS001", "Eletrônicos", "Vision", 45, 89.9, 2, 10],
  ["Camiseta Premium P", "CAMP01", "Vestuário", "Linea", 22, 59.9, 18, 8],
  ["Camiseta Premium M", "CAMM01", "Vestuário", "Linea", 22, 59.9, 0, 8],
  ["Caderno A4 96f", "CAD96", "Papelaria", "Norte", 6.8, 14.9, 120, 30],
  ["Caneta Gel azul", "CNG01", "Papelaria", "Norte", 1.2, 3.5, 240, 50],
  ["Garrafa Térmica 500ml", "GT500", "Utilidades", "Aroma", 28, 69.9, 14, 5],
  ["Mochila Executiva", "MCH01", "Acessórios", "Linea", 89, 199, 5, 3],
  ["Fone Bluetooth", "FN001", "Eletrônicos", "Vision", 110, 249, 9, 5],
  ["Açúcar Refinado 1kg", "ACR01", "Mercearia", "Casa", 4.5, 7.9, 36, 12],
].map(([nome, cod, cat, marca, custo, preco, est, min], i) => ({
  id: uid(),
  nome: nome as string,
  codigo: cod as string,
  codigoBarras: `78912345${String(10000 + i).padStart(5, "0")}`,
  categoria: cat as string,
  marca: marca as string,
  unidade: "UN",
  custo: custo as number,
  preco: preco as number,
  estoque: est as number,
  estoqueMinimo: min as number,
  status: "ativo" as Status,
}));

export const seedVendas: Venda[] = Array.from({ length: 24 }, (_, i) => {
  const total = 80 + Math.floor(Math.random() * 600);
  return {
    id: uid(),
    codigo: `V${String(1000 + i)}`,
    data: `2026-05-${String(20 - (i % 18)).padStart(2, "0")}T${String(8 + (i % 10)).padStart(2, "0")}:${String((i * 7) % 60).padStart(2, "0")}:00`,
    operador: ["Marina", "Lucas", "Patrícia", "Rafael"][i % 4],
    cliente: i % 3 === 0 ? seedClientes[i % seedClientes.length].nome : undefined,
    total,
    formaPagamento: ["Pix", "Cartão Crédito", "Cartão Débito", "Dinheiro"][i % 4],
    status: (i === 5 ? "cancelada" : "concluida") as Venda["status"],
    itens: [],
  };
});

export const seedLancamentos: Lancamento[] = Array.from({ length: 30 }, (_, i) => {
  const tipo = (i % 2 === 0 ? "despesa" : "receita") as Lancamento["tipo"];
  const valor = 200 + Math.floor(Math.random() * 4500);
  const day = ((i * 3) % 28) + 1;
  return {
    id: uid(),
    tipo,
    descricao: tipo === "receita"
      ? ["Venda PDV", "Serviço prestado", "Mensalidade cliente", "Honorários BPO"][i % 4]
      : ["Aluguel", "Energia", "Fornecedor", "Folha de pagamento", "Marketing", "Impostos"][i % 6],
    categoria: tipo === "receita" ? "Receita operacional" : ["Despesa fixa", "Fornecedores", "Pessoal", "Marketing"][i % 4],
    contraparte: tipo === "receita" ? seedClientes[i % seedClientes.length].nome : seedFornecedores[i % seedFornecedores.length].nomeFantasia,
    vencimento: `2026-05-${String(day).padStart(2, "0")}`,
    pagamento: i % 3 === 0 ? `2026-05-${String(day).padStart(2, "0")}` : undefined,
    valor,
    status: (i % 4 === 0 ? "pago" : i % 4 === 1 ? "recebido" : i % 4 === 2 ? "pendente" : "atrasado") as Lancamento["status"],
    conta: ["Conta Itaú PJ", "Conta Bradesco", "Caixa"][i % 3],
    forma: ["Pix", "Boleto", "Cartão", "Transferência"][i % 4],
  };
});

export const seedClientesBPO: ClienteBPO[] = [
  ["Tech Solutions", "12.345.678/0001-99", "Carlos Silva", "BPO Completo", 1890, 3, "Mai/26"],
  ["Padaria Pão Quente", "23.456.789/0001-12", "Ana Pereira", "BPO Essencial", 890, 1, "Mai/26"],
  ["Mercado Bom Preço", "45.678.901/0001-34", "João Lima", "BPO Completo", 1890, 5, "Mai/26"],
  ["AutoCenter Veloz", "67.890.123/0001-56", "Pedro Alves", "BPO Premium", 2890, 0, "Mai/26"],
  ["Studio Bella", "56.789.012/0001-45", "Júlia Rocha", "BPO Essencial", 890, 2, "Mai/26"],
  ["Clínica Vida", "98.765.432/0001-10", "Dra. Helena", "BPO Completo", 1890, 4, "Mai/26"],
  ["Restaurante Sabor", "87.654.321/0001-21", "Chef Marcos", "BPO Essencial", 890, 0, "Mai/26"],
  ["E-commerce Plus", "76.543.210/0001-32", "Bianca Reis", "BPO Premium", 2890, 6, "Mai/26"],
].map(([emp, cnpj, resp, plano, valor, pend, fech], i) => ({
  id: uid(),
  empresa: emp as string,
  cnpj: cnpj as string,
  responsavel: resp as string,
  plano: plano as string,
  status: (i === 6 ? "inativo" : "ativo") as Status,
  valorMensal: valor as number,
  pendencias: pend as number,
  fechamentoAtual: fech as string,
  ultimoAcesso: `2026-05-${String(10 + i).padStart(2, "0")}`,
}));

export const seedPendencias: Pendencia[] = Array.from({ length: 12 }, (_, i) => ({
  id: uid(),
  cliente: seedClientesBPO[i % seedClientesBPO.length].empresa,
  tipo: ["Extrato bancário", "NF de fornecedor", "Comprovante de pagamento", "Categorização", "Documento fiscal"][i % 5],
  prioridade: (["alta", "media", "baixa"] as const)[i % 3],
  prazo: `2026-05-${String(22 + (i % 8)).padStart(2, "0")}`,
  responsavel: ["Marina", "Lucas", "Patrícia"][i % 3],
  status: (["aberta", "andamento", "concluida"] as const)[i % 3],
}));

export const seedFechamentos: Fechamento[] = seedClientesBPO.map((c, i) => ({
  id: uid(),
  cliente: c.empresa,
  mes: "Maio/2026",
  status: (["andamento", "concluido", "atrasado", "nao_iniciado"] as const)[i % 4],
  progresso: [40, 100, 70, 0, 60, 85, 100, 25][i],
  responsavel: ["Marina", "Lucas", "Patrícia", "Rafael"][i % 4],
  atualizado: `2026-05-${String(15 + i).padStart(2, "0")}`,
}));

export const seedPlanos: Plano[] = [
  { id: uid(), nome: "Starter", valor: 149, limiteUsuarios: 3, limiteClientesBPO: 0, modulos: ["Financeiro", "PDV", "Estoque"], status: "ativo" },
  { id: uid(), nome: "Profissional", valor: 349, limiteUsuarios: 10, limiteClientesBPO: 0, modulos: ["Financeiro", "PDV", "Estoque", "Vendas", "Compras", "Relatórios"], status: "ativo" },
  { id: uid(), nome: "BPO", valor: 599, limiteUsuarios: 8, limiteClientesBPO: 30, modulos: ["Financeiro", "BPO", "Relatórios"], status: "ativo" },
  { id: uid(), nome: "Enterprise", valor: 1290, limiteUsuarios: 50, limiteClientesBPO: 100, modulos: ["Todos"], status: "ativo" },
];

export const seedUsuarios: Usuario[] = [
  ["Carlos Silva", "carlos@fluxia.com", "Administrador"],
  ["Marina Costa", "marina@fluxia.com", "BPO Financeiro"],
  ["Lucas Pereira", "lucas@fluxia.com", "Financeiro"],
  ["Patrícia Lima", "patricia@fluxia.com", "BPO Financeiro"],
  ["Rafael Souza", "rafael@fluxia.com", "Operador PDV"],
  ["Ana Rocha", "ana@fluxia.com", "Vendedor"],
].map(([n, e, p], i) => ({
  id: uid(),
  nome: n,
  email: e,
  perfil: p,
  status: "ativo" as Status,
  ultimoAcesso: `2026-05-${String(18 + (i % 5)).padStart(2, "0")}`,
}));

// Dashboard mock series
export const fluxoMensal = [
  { mes: "Dez", entradas: 62000, saidas: 41000 },
  { mes: "Jan", entradas: 71000, saidas: 44000 },
  { mes: "Fev", entradas: 68000, saidas: 39000 },
  { mes: "Mar", entradas: 79000, saidas: 46000 },
  { mes: "Abr", entradas: 81000, saidas: 43000 },
  { mes: "Mai", entradas: 84750, saidas: 42380 },
];

export const vendasSemana = [
  { dia: "Seg", valor: 2100 },
  { dia: "Ter", valor: 1820 },
  { dia: "Qua", valor: 2640 },
  { dia: "Qui", valor: 2310 },
  { dia: "Sex", valor: 3680 },
  { dia: "Sáb", valor: 3120 },
  { dia: "Dom", valor: 1450 },
];

export const formasPagamento = [
  { name: "Pix", value: 38 },
  { name: "Cartão Crédito", value: 32 },
  { name: "Cartão Débito", value: 18 },
  { name: "Dinheiro", value: 12 },
];

export const produtosMaisVendidos = [
  { nome: "Café Especial 250g", qtd: 184 },
  { nome: "Pão Francês kg", qtd: 156 },
  { nome: "Caneta Gel azul", qtd: 142 },
  { nome: "Caderno A4 96f", qtd: 98 },
  { nome: "Mouse Wireless", qtd: 76 },
];
