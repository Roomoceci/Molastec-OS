# MolaTech OS v1.0

Sistema profissional para controle de manutencao, regulagem e troca de molas hidraulicas em portas de vidro.

## Status

Aplicacao Node.js com backend Express, frontend estatico e banco SQLite.

## Estrutura

```text
backend/
  server.js
  database.js
  controllers/
  services/
  models/

frontend/
  index.html
  solicitar-servico.html
  login.html
  dashboard.html
  clientes.html
  ordens.html
  solicitacoes.html
  tecnicos.html
  financeiro.html
  assets/home/
  css/style.css
  js/

database/
  molatech.db
```

## Tecnologias

- Node.js 18+
- Express
- CommonJS
- SQLite
- HTML, CSS e JavaScript sem framework

## Execucao local

```bash
npm install
npm start
```

Abra:

```text
http://localhost:3000
```

Modo desenvolvimento:

```bash
npm run dev
```

## Variaveis de ambiente

Copie `.env.example` para `.env` quando quiser configurar ambiente local ou producao.

```env
PORT=3000
HOST=0.0.0.0
NODE_ENV=production
DB_PATH=database/molatech.db
CORS_ORIGIN=
ADMIN_EMAIL=admin@molatech.com
ADMIN_PASSWORD=troque-esta-senha
ADMIN_NAME=Administrador
SEED_DEMO_DATA=false
WHATSAPP_CENTRAL_NUMBER=5511999999999
WHATSAPP_CENTRAL_NAME=Central MolaTech
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
```

Em hospedagem web, use um caminho persistente para SQLite:

```env
DB_PATH=/data/molatech.db
```

## Rotas principais

- Home publica: `/`
- Solicitar servico: `/solicitar-servico.html`
- Login administrativo: `/login.html`
- Health check: `/health`
- API: `/api`

## Modulos

- Dashboard administrativo
- Clientes
- Tecnicos
- Ordens de servico
- Solicitacoes publicas
- Financeiro e relatorios
- WhatsApp com mensagens prontas
- Finalizacao de OS paga com tentativa de envio de NFe por e-mail

## Acesso padrao

Em banco novo, o primeiro usuario administrativo vem das variaveis:

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `ADMIN_NAME`

Localmente, se nao configurar `.env`, o fallback continua sendo:

- E-mail: `admin@molatech.com`
- Senha: `admin123`

## Deploy

Configuracao padrao para Render, Railway, Fly.io ou hospedagem Node.js semelhante:

- Build command: `npm install`
- Start command: `npm start`
- Health check: `/health`
- Porta: usar a variavel `PORT` da plataforma
- Banco: configurar `DB_PATH` para uma pasta persistente

SQLite precisa de disco persistente. Para producao com volume maior, o proximo passo recomendado e migrar para PostgreSQL.

## Reset do banco

Para apagar o banco atual e recriar o admin inicial no proximo start:

```bash
CONFIRM_RESET_DB=true npm run reset-db
```

Use com cuidado. Em producao, configure `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME` e `DB_PATH` antes de rodar.
