# Isa Sushi - Sistema de Pedidos & PDV Online 🍣

Bem-vindo ao repositório do **Isa Sushi**, uma plataforma completa no estilo E-commerce / Ponto de Venda focada em delivery, desenvolvida para agilizar o atendimento, gerenciar o cardápio e receber pedidos (com integração ao WhatsApp e pagamento via Pix).

## 🚀 Tecnologias Utilizadas

O projeto está sendo construído com tecnologias modernas do ecossistema JS/TS:
- **[Next.js 14/15](https://nextjs.org/)** (App Router, Server Actions, Server Components)
- **[React 19](https://react.dev/)**
- **[TypeScript](https://www.typescriptlang.org/)**
- **[Tailwind CSS](https://tailwindcss.com/)** (Estilização)
- **[Prisma ORM](https://www.prisma.io/)** (Banco de dados PostgreSQL)
- **[Zustand](https://github.com/pmndrs/zustand)** (Gerenciamento de Estado Global do Carrinho)
- **[UploadThing](https://uploadthing.com/)** (Upload e armazenamento de imagens)

## 🔒 Funcionalidades de Segurança Adicionadas
- **Server-Side Price Calculation:** Para evitar fraudes no pagamento e no fechamento do carrinho, todos os preços do pedido (`createOrder`) são validados do absoluto zero no backend de acordo com a tabela de produtos real (imutável pelo usuário).
- **Admin Server Actions Guard:** Ações críticas do sistema (adicionar produtos, abrir/fechar loja, deletar itens e excluir sistema) são protegidas e rejeitadas automaticamente caso tentem ser forçadas remotamente sem o header `Basic Auth` do `.env`.
- **Prevenção contra SQL Injection & Roteamento Privado protegido por Middleware.**

## 🛠️ Como Rodar o Projeto (Desenvolvimento)

### Pré-requisitos
Certifique-se de ter o Node.js v18+ e um banco de dados **PostgreSQL** disponível (pode ser Local, Neon, Supabase, etc).

1. Clone o repositório
2. Rode `npm install`
3. Crie um arquivo `.env` na raiz (baseado nas variáveis abaixo).
4. Sincronize o Prisma rodando `npx prisma db push` e `npx prisma generate`
5. Inicie o servidor: `npm run dev`

Sua aplicação estará disponível em `http://localhost:3000`.

### Variáveis de Ambiente Necessárias (`.env`)

Você precisa preencher as informações de conexão do Banco e do Administrador.

```env
# Banco de Dados
DATABASE_URL="postgresql://usuario:senha@host:5432/nombredobanco?schema=public"

# Credenciais do Painel Admin (/admin)
LOGIN="seu_usuario_admin"
SENHA="sua_senha_admin"
```

*(É recomendável também adicionar as varíaveis do UploadThing se for fazer upload de fotos dos Sushis)*

## 📦 Funcionalidades Principais
* **Cliente (Página Venda):** Ver cardápio, adicionar Sushis ao Carrinho, preencher detalhes de entrega, escolher Pix/Dinheiro/Cartão e envio do recibo/fechamento do pedido via WhatsApp apontando para o sistema.
* **Dashboard Administrativo:** Controle do painel (Aberto/Fechado), tabela interativa com tempo real e som dos últimos pedidos `(`/admin/pedidos`)`, gestão do Cardápio com CRUD completo de Produtos e separação em Categorias.
* **Componentes Responsivos** voltados para alta taxa de conversão em dispositivos Mobile.
