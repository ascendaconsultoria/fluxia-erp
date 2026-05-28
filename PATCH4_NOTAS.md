# Fluxia V2 - Patch 4

## Plano de execução aplicado

1. Corrigir usabilidade e área útil do PDV, incluindo zoom operacional temporário, carrinho escuro e redesign da aba Caixa.
2. Revisar submenus internos para ficarem fixos e usar rolagem interna nas áreas de conteúdo e tabelas.
3. Redesenhar telas críticas de Estoque, Financeiro, BPO, Vendas, Compras, Tarefas, Notificações, Configurações e Uso do Sistema.
4. Remover cards de orientação genérica do sistema e substituir por indicadores, gráficos, tabelas e ações funcionais.
5. Revisar botões sem função, ajustar nomes, criar modais coerentes e manter loading/confirm dialog nas ações críticas.
6. Validar build e TypeScript antes de empacotar.

## Principais alterações

- PDV: caixa redesenhado, operação com escala visual reduzida em 20% quando caixa aberto, carrinho escuro e ações superiores reorganizadas.
- Estoque: consulta, locais, reposição, transferências e perdas redesenhadas com tabelas, gráficos, modais e rolagem interna.
- Financeiro: visão geral ajustada, fluxo de caixa redesenhado, contas/carteiras e cartões modernizados, cobranças sem card de recomendação e botões renomeados.
- BPO: menu interno fixo no topo, dashboard com rolagem, comunicação operacional tipo chat e configurações BPO robustas.
- Vendas: menu interno próprio, visão geral sem botões e abas de pedidos, orçamentos, clientes, funil, metas, comissões e entregas com layouts próprios.
- Compras: abas refeitas com layouts próprios e remoção de relatórios internos duplicados.
- Tarefas: nova tela com kanban, lista, agenda, carga por responsável, modais e confirmações.
- Notificações: nova central com seleção, marcar como lida, concluir/arquivar, apagar manualmente e apagar em massa.
- Cadastros: aba Permissões removida.
- Configurações: criada estrutura robusta com empresa, usuários, permissões, automações, integrações, fiscal/financeiro, segurança e aparência.
- Super Admin > Uso do sistema: nova visão com indicadores, gráficos, insights e tabela de adoção por empresa.

## Validação

- npm install --no-audit --no-fund: concluído.
- npx tsc --noEmit: concluído sem erros.
- npm run build: concluído com sucesso.

