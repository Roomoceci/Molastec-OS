# Deploy no Render

Este guia e o caminho recomendado para colocar o MolaTech OS no ar usando Node.js + SQLite com disco persistente.

## 1. Subir o codigo para GitHub

Na pasta do projeto:

```bash
git init
git add .
git commit -m "Initial MolaTech OS deploy"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/molatech-os.git
git push -u origin main
```

## 2. Criar Web Service no Render

No Render:

1. Clique em `New`.
2. Escolha `Blueprint`.
3. Conecte o repositorio do GitHub.
4. Selecione o arquivo `render.yaml`.

O Blueprint ja configura:

```text
Build Command: npm install
Start Command: npm start
Health Check Path: /health
Persistent Disk: /var/data
DB_PATH: /var/data/molatech.db
```

Se preferir criar manualmente, escolha `New > Web Service` e use as mesmas configuracoes acima.

## 3. Confirmar Persistent Disk

SQLite grava em arquivo. Sem disco persistente, os dados podem ser perdidos em redeploy/restart.

O `render.yaml` ja cria um disco com mount path:

```text
/var/data
```

## 4. Variaveis de ambiente

Configure no Render:

```env
NODE_ENV=production
HOST=0.0.0.0
ADMIN_EMAIL=seu-email@dominio.com
ADMIN_PASSWORD=uma-senha-forte
ADMIN_NAME=Administrador
SEED_DEMO_DATA=false
DB_PATH=/var/data/molatech.db
WHATSAPP_CENTRAL_NUMBER=5511999999999
WHATSAPP_CENTRAL_NAME=Central MolaTech
```

Para e-mail de NFe/comprovante:

```env
SMTP_HOST=smtp.seuprovedor.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=usuario@dominio.com
SMTP_PASS=sua-senha-ou-app-password
SMTP_FROM=financeiro@dominio.com
```

Depois que o Render concluir o deploy, abra a URL gerada e teste:

```text
https://seu-app.onrender.com/health
https://seu-app.onrender.com/login.html
```

## Resetar banco inicial

Use apenas se ainda nao houver dados importantes.

1. Configure antes:

```env
ADMIN_EMAIL=seu-email@dominio.com
ADMIN_PASSWORD=uma-senha-forte
ADMIN_NAME=Administrador
SEED_DEMO_DATA=false
DB_PATH=/var/data/molatech.db
```

2. No Render, abra `Shell` do servico e rode:

```bash
CONFIRM_RESET_DB=true npm run reset-db
```

3. Depois clique em `Manual Deploy > Clear build cache & deploy` ou reinicie o servico.

## Corrigir login admin sem apagar dados

Se o login definitivo nao funcionar, confira as variaveis `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME` e `DB_PATH`.

Depois abra `Shell` no Render e rode:

```bash
npm run set-admin
```

O comando cria ou atualiza o usuario admin usando os valores atuais das variaveis de ambiente.
