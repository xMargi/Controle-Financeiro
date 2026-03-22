# Controle Financeiro 💰

Aplicação fullstack para controle de finanças pessoais com autenticação, categorias e dashboard com gráficos.

![Controle Financeiro](https://github.com/user-attachments/assets/ea6a1797-0c67-4b2f-b842-c8a8a4a3dbe3)

## 🚀 Tecnologias

**Frontend**
- React 19
- TypeScript
- Vite
- Tailwind CSS
- Shadcn/ui
- Recharts
- React Hook Form
- React Router

**Backend**
- Node.js
- Express
- TypeScript
- PostgreSQL
- JWT
- Bcrypt

## ✨ Funcionalidades

- Cadastro e autenticação de usuários
- Rotas protegidas por JWT
- Criação e listagem de categorias por tipo (Receita/Despesa)
- Registro de transações financeiras
- Dashboard com gráficos de fluxo mensal e distribuição por categoria
- Visualização de saldo e resumo financeiro

## ⚙️ Como rodar

### Backend
```bash
cd backend
npm install
npm run dev
```

Configure o `.env`:
```env
DB_HOST=localhost
DB_PASSWORD=sua_senha
DB_PORT=5432
DB_USER=postgres
DB_NAME=controle_financeiro_db
PORT=3001
SECRETWORD=sua_palavra_secreta
```

Crie o banco e rode o schema:
```bash
psql -U postgres -f database/schema.sql
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Configure o `.env`:
```env
VITE_API_URL=http://localhost:3001
```
