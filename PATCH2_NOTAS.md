# Fluxia V2 — Patch 2 de melhorias

## Ajustes principais aplicados

- PDV com menu interno compacto no mesmo padrão visual do BPO Financeiro.
- Caixa do PDV reorganizado com título, subtítulo, status do caixa e ações principais na mesma linha.
- PDV aberto em layout focado, com bloqueio de navegação para outros módulos enquanto o caixa estiver aberto.
- Checkout do PDV reposicionado para aproveitar melhor a altura da tela e reduzir necessidade de rolagem.
- Financeiro com menu interno e novas telas: Cobranças, Tarefas, Notificações, Contas e carteiras, Cartões, além de Contas a pagar, Contas a receber, Conciliação, Fluxo de caixa e DRE.
- Dashboard financeiro redesenhado com menos cards por linha, melhor responsividade e layout mais limpo.
- Estoque com menu interno e novas telas: Consulta, Locais, Reposição, Transferências e Perdas, além de Produtos, Movimentações e Inventário.
- Compras com menu interno no padrão BPO, mantendo visão geral e abas já existentes em formato mais profissional.
- Removida a escrita “Operação” do agrupamento do menu lateral principal.
- Adicionado botão de chat/suporte ao lado das notificações no topo.
- Gráficos que usavam verde e preto foram ajustados para verde e vermelho.
- Botões de ação adicionados com modal, confirmação ou loading conforme contexto.
- Rotas novas adicionadas e `routeTree.gen.ts` atualizado.

## Validação técnica

- `tsc --noEmit` executado com sucesso.
- `npm run build` executado com sucesso.

## Observação

O projeto foi entregue sem `node_modules` e sem `dist` no ZIP final para manter o pacote leve. Rode `npm install` e depois `npm run build` no ambiente local antes de publicar.
