# 🚀 Guia de Configuração - Descarte Certo

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Git

## 🛠️ Instalação

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd descarte-certo-site
```

### 2. Instale todas as dependências
```bash
npm run install-all
```

### 3. Configure as variáveis de ambiente
```bash
# Copie o arquivo de exemplo
cp server/env.example server/.env

# Edite o arquivo .env com suas configurações
nano server/.env
```

### 4. Configure o banco de dados
```bash
cd server
npm run db:generate
npm run db:migrate
npm run db:seed
```

### 5. Inicie o projeto
```bash
# Volte para a raiz do projeto
cd ..

# Inicie backend e frontend simultaneamente
npm run dev
```

## 🌐 Acesso

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001
- **Admin**: http://localhost:5173/admin
- **Credenciais Admin**: admin@descarte-certo.com / admin123

## 📁 Estrutura do Projeto

```
descarte-certo-site/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── pages/         # Páginas da aplicação
│   │   └── ...
├── server/                 # Backend Node.js
│   ├── routes/            # Rotas da API
│   ├── prisma/            # Schema e migrações do banco
│   ├── uploads/           # Arquivos enviados
│   └── docs/              # Documentos para download
└── ...
```

## 🔧 Scripts Disponíveis

### Raiz do projeto
- `npm run dev` - Inicia backend e frontend
- `npm run install-all` - Instala todas as dependências
- `npm run build` - Build do frontend

### Backend (server/)
- `npm run dev` - Inicia servidor em modo desenvolvimento
- `npm run db:migrate` - Executa migrações do banco
- `npm run db:seed` - Popula banco com dados iniciais
- `npm run db:studio` - Abre interface do Prisma Studio

### Frontend (client/)
- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Preview do build

## 🗄️ Banco de Dados

O projeto usa SQLite com Prisma ORM. O banco é criado automaticamente na primeira execução.

### Tabelas principais:
- `users` - Usuários do sistema
- `disposals` - Registros de descarte
- `stories` - Histórias de impacto
- `collection_points` - Pontos de coleta
- `impact_data` - Dados de impacto ambiental

## 📧 Configuração de Email

Para funcionalidades de email funcionarem, configure no `.env`:

```env
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_de_aplicativo
```

**Nota**: Use senha de aplicativo do Gmail, não a senha normal.

## 🗺️ Google Maps

Para funcionalidades de mapa, adicione sua chave no `.env`:

```env
GOOGLE_MAPS_API_KEY=sua_chave_aqui
```

## 🚀 Deploy

### Backend
1. Configure variáveis de ambiente de produção
2. Execute `npm run build` no frontend
3. Configure servidor web (nginx, Apache)
4. Use PM2 para manter o processo ativo

### Frontend
1. Execute `npm run build`
2. Faça upload da pasta `dist/` para seu servidor web

## 🐛 Troubleshooting

### Erro de conexão com banco
```bash
cd server
npm run db:generate
npm run db:migrate
```

### Erro de dependências
```bash
rm -rf node_modules package-lock.json
npm install
```

### Porta já em uso
```bash
# Mude a porta no .env ou mate o processo
lsof -ti:3001 | xargs kill -9
```

## 📞 Suporte

Para dúvidas ou problemas, abra uma issue no repositório. 