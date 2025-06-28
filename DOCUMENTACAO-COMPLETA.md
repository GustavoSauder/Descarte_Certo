# 📚 DOCUMENTAÇÃO COMPLETA - DESCARTE CERTO

## 🎯 Visão Geral do Projeto

**Descarte Certo** é uma plataforma educacional e ecológica inovadora que combina tecnologia, gamificação e inteligência artificial para promover a reciclagem e educação ambiental. O projeto visa transformar a forma como as pessoas interagem com o descarte de resíduos, criando uma comunidade engajada em práticas sustentáveis.

### 🏆 Objetivos Principais
- **Educação Ambiental**: Conscientizar sobre reciclagem e sustentabilidade
- **Gamificação**: Engajar usuários através de sistema de pontos e recompensas
- **IA e Tecnologia**: Utilizar inteligência artificial para reconhecimento de materiais
- **Impacto Social**: Criar uma comunidade engajada em práticas sustentáveis

---

## 🏗️ Arquitetura do Sistema

### 📱 Frontend (React + Vite)
```
client/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   ├── pages/              # Páginas da aplicação
│   ├── hooks/              # Hooks customizados
│   ├── services/           # Serviços de API
│   ├── utils/              # Utilitários
│   ├── locales/            # Arquivos de internacionalização
│   └── lib/                # Configurações (Supabase)
├── public/                 # Arquivos estáticos
└── package.json           # Dependências do frontend
```

### 🔧 Backend (Node.js + Express)
```
server/
├── routes/                 # Rotas da API
├── middleware/             # Middlewares customizados
├── services/               # Serviços de negócio
├── prisma/                 # Schema e migrações do banco
├── config/                 # Configurações
└── package.json           # Dependências do backend
```

### 🗄️ Banco de Dados (PostgreSQL + Supabase)
- **Autenticação**: Supabase Auth
- **Banco de Dados**: PostgreSQL hospedado no Supabase
- **ORM**: Prisma para gerenciamento do banco
- **Storage**: Supabase Storage para arquivos

---

## 🚀 Funcionalidades Implementadas

### 🔐 Sistema de Autenticação
- **Login/Registro**: Autenticação via Supabase
- **Login Social**: Integração com Google
- **Recuperação de Senha**: Sistema de reset via email
- **Sessões Persistentes**: Manutenção do estado de login

### 📊 Dashboard do Usuário
- **Estatísticas Pessoais**: Pontos, ranking, descartes realizados
- **Histórico de Atividades**: Timeline de ações do usuário
- **Metas e Desafios**: Sistema de objetivos personalizados
- **Progresso Visual**: Gráficos e indicadores de evolução

### 🎮 Sistema de Gamificação
- **Pontuação**: Sistema de pontos por ações sustentáveis
- **Ranking**: Classificação global e por escola
- **Conquistas**: Badges e medalhas por metas atingidas
- **Recompensas**: Loja virtual com produtos sustentáveis

### 📝 Formulário de Contato
- **Validação Completa**: Frontend e backend
- **Salvamento no Banco**: Persistência de mensagens
- **Notificações**: Confirmação de envio
- **Campos Personalizados**: Nome, email, telefone, escola, assunto, mensagem

### 🎨 Interface e UX
- **Design Responsivo**: Adaptação para todos os dispositivos
- **Dark Mode**: Tema escuro/claro
- **Internacionalização**: Suporte PT/EN
- **Acessibilidade**: Recursos para usuários com necessidades especiais

### 📱 PWA (Progressive Web App)
- **Instalação**: Pode ser instalado como app
- **Offline**: Funcionalidade básica sem internet
- **Notificações**: Push notifications (configurável)
- **Service Worker**: Cache inteligente

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18**: Biblioteca principal
- **Vite**: Build tool e dev server
- **Tailwind CSS**: Framework de estilização
- **Framer Motion**: Animações
- **React Router**: Roteamento
- **React i18next**: Internacionalização
- **Supabase JS**: Cliente do Supabase

### Backend
- **Node.js**: Runtime JavaScript
- **Express**: Framework web
- **Prisma**: ORM para banco de dados
- **JWT**: Autenticação via tokens
- **Multer**: Upload de arquivos
- **Nodemailer**: Envio de emails
- **Cors**: Cross-origin resource sharing

### Banco de Dados
- **PostgreSQL**: Banco de dados principal
- **Supabase**: Plataforma de backend-as-a-service
- **Prisma Migrate**: Migrações de banco

### DevOps e Ferramentas
- **Git**: Controle de versão
- **npm**: Gerenciador de pacotes
- **ESLint**: Linting de código
- **Prettier**: Formatação de código

---

## 📋 Estrutura de Páginas

### 🏠 Páginas Públicas
1. **Home** (`/`) - Página inicial com apresentação do projeto
2. **Sobre Nós** (`/sobre-nos`) - Informações sobre a equipe
3. **Sobre Projeto** (`/sobre-projeto`) - Detalhes técnicos do projeto
4. **Kit Educacional** (`/kit`) - Material para escolas
5. **Impacto** (`/impacto`) - Métricas e histórias de sucesso
6. **Contato** (`/contato`) - Formulário de contato

### 🔐 Páginas de Autenticação
1. **Login** (`/app`) - Tela de login
2. **Registro** (`/cadastro`) - Tela de cadastro
3. **Recuperação de Senha** (`/esqueci-senha`) - Reset de senha

### 👤 Páginas do Usuário
1. **Dashboard** (`/dashboard`) - Painel principal do usuário
2. **Perfil** (`/perfil`) - Gerenciamento de dados pessoais
3. **Ranking** (`/ranking`) - Classificação dos usuários
4. **Recompensas** (`/recompensas`) - Loja de pontos
5. **Histórico** (`/historico`) - Timeline de atividades
6. **Conquistas** (`/conquistas`) - Badges e medalhas
7. **Notificações** (`/notificacoes`) - Sistema de notificações
8. **Suporte** (`/suporte`) - Tickets de suporte
9. **Configurações** (`/configuracoes`) - Preferências do usuário

### 👨‍💼 Páginas Administrativas
1. **Admin** (`/admin`) - Painel administrativo
2. **Admin Dashboard** (`/admin-dashboard`) - Métricas avançadas

---

## 🗄️ Modelos de Dados

### 👤 Usuário (User)
```sql
- id: UUID (PK)
- name: String
- email: String (unique)
- password: String (hashed)
- school: String (optional)
- city: String (optional)
- state: String (optional)
- points: Integer
- level: Integer
- created_at: DateTime
- updated_at: DateTime
```

### 📝 Contato (Contact)
```sql
- id: UUID (PK)
- name: String
- email: String
- phone: String (optional)
- school: String (optional)
- subject: String
- message: Text
- created_at: DateTime
```

### 🗑️ Descarte (Disposal)
```sql
- id: UUID (PK)
- user_id: UUID (FK)
- material_type: String
- weight: Decimal
- points: Integer
- created_at: DateTime
```

### 🏆 Conquista (Achievement)
```sql
- id: UUID (PK)
- title: String
- description: Text
- icon: String
- badge_type: String
- points_required: Integer
```

### 🎁 Recompensa (Reward)
```sql
- id: UUID (PK)
- title: String
- description: Text
- points_cost: Integer
- available: Boolean
```

### 📢 Notificação (Notification)
```sql
- id: UUID (PK)
- user_id: UUID (FK)
- title: String
- message: Text
- read: Boolean
- created_at: DateTime
```

### 🎫 Ticket de Suporte (SupportTicket)
```sql
- id: UUID (PK)
- user_id: UUID (FK)
- subject: String
- message: Text
- category: String
- status: String
- created_at: DateTime
```

---

## 🔌 APIs e Endpoints

### 🔐 Autenticação
```
POST /api/auth/register     - Registro de usuário
POST /api/auth/login        - Login de usuário
POST /api/auth/logout       - Logout
POST /api/auth/forgot-password - Recuperação de senha
GET  /api/auth/profile      - Perfil do usuário
PUT  /api/auth/profile      - Atualizar perfil
```

### 👤 Usuários
```
GET  /api/users             - Listar usuários
GET  /api/users/:id         - Buscar usuário
PUT  /api/users/:id         - Atualizar usuário
DELETE /api/users/:id       - Deletar usuário
GET  /api/users/ranking     - Ranking de usuários
```

### 🗑️ Descartes
```
GET  /api/disposals         - Listar descartes
POST /api/disposals         - Criar descarte
GET  /api/disposals/:id     - Buscar descarte
PUT  /api/disposals/:id     - Atualizar descarte
DELETE /api/disposals/:id   - Deletar descarte
```

### 📝 Contato
```
POST /api/contact           - Enviar mensagem de contato
GET  /api/contact           - Listar mensagens (admin)
```

### 🏆 Conquistas
```
GET  /api/achievements      - Listar conquistas
POST /api/achievements      - Criar conquista
GET  /api/achievements/:id  - Buscar conquista
PUT  /api/achievements/:id  - Atualizar conquista
DELETE /api/achievements/:id - Deletar conquista
```

### 🎁 Recompensas
```
GET  /api/rewards           - Listar recompensas
POST /api/rewards           - Criar recompensa
POST /api/rewards/:id/redeem - Resgatar recompensa
```

### 📢 Notificações
```
GET  /api/notifications     - Listar notificações
POST /api/notifications     - Criar notificação
PUT  /api/notifications/:id/read - Marcar como lida
DELETE /api/notifications/:id - Deletar notificação
```

### 🎫 Suporte
```
GET  /api/support           - Listar tickets
POST /api/support           - Criar ticket
GET  /api/support/:id       - Buscar ticket
PUT  /api/support/:id       - Atualizar ticket
```

### 📊 Relatórios
```
GET  /api/reports/impact    - Relatório de impacto
GET  /api/reports/users     - Relatório de usuários
GET  /api/reports/disposals - Relatório de descartes
```

---

## 🎨 Componentes UI

### 🔘 Botões
- **Button**: Componente base com variantes (primary, secondary, outline, danger, ghost)
- **Tamanhos**: sm, md, lg, xl
- **Estados**: loading, disabled, fullWidth

### 📋 Formulários
- **Input**: Campo de texto com validação
- **Textarea**: Área de texto
- **Select**: Lista suspensa
- **Checkbox**: Caixa de seleção
- **Radio**: Botão de opção

### 🃏 Cards
- **Card**: Container com sombra e bordas arredondadas
- **CardHeader**: Cabeçalho do card
- **CardContent**: Conteúdo do card
- **CardTitle**: Título do card

### 📊 Tabelas
- **Table**: Tabela responsiva
- **Pagination**: Paginação
- **Sorting**: Ordenação de colunas
- **Filtering**: Filtros

### 🔔 Notificações
- **Notification**: Sistema de notificações toast
- **NotificationContainer**: Container de notificações

### 🔄 Loading
- **Loading**: Spinner de carregamento
- **LoadingOverlay**: Overlay de carregamento

### 🎭 Modal
- **Modal**: Janela modal
- **ConfirmModal**: Modal de confirmação

---

## 🎯 Sistema de Gamificação

### 📊 Pontuação
- **Plástico**: 10 pontos/kg
- **Papel**: 8 pontos/kg
- **Metal**: 12 pontos/kg
- **Vidro**: 15 pontos/kg
- **Eletrônicos**: 20 pontos/kg

### 🏆 Níveis
- **Iniciante**: 0-100 pontos
- **Reciclador**: 101-500 pontos
- **Eco Warrior**: 501-1000 pontos
- **Sustentável**: 1001-2000 pontos
- **Mestre Verde**: 2000+ pontos

### 🎖️ Conquistas
- **Primeiro Descarte**: Primeira vez reciclando
- **Meta Semanal**: 10kg em uma semana
- **Meta Mensal**: 50kg em um mês
- **Diversidade**: Todos os tipos de material
- **Consistência**: 30 dias seguidos

### 🎁 Recompensas
- **Produtos Sustentáveis**: Squeezes, canecas, sacolas
- **Cupons de Desconto**: Lojas parceiras
- **Certificados**: Certificados de impacto ambiental
- **Experiências**: Visitas a centros de reciclagem

---

## 🔧 Configuração e Deploy

### 📋 Pré-requisitos
- Node.js 18+
- npm ou yarn
- Conta no Supabase
- PostgreSQL (opcional para desenvolvimento local)

### ⚙️ Variáveis de Ambiente

#### Frontend (.env)
```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
VITE_API_URL=http://localhost:3001/api
```

#### Backend (.env)
```env
# Supabase
DATABASE_URL=sua_url_do_banco
SUPABASE_URL=sua_url_do_supabase
SUPABASE_SERVICE_KEY=sua_chave_de_servico

# JWT
JWT_SECRET=seu_jwt_secret

# Email (opcional)
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_de_app

# Servidor
PORT=3001
NODE_ENV=development
```

### 🚀 Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/descarte-certo-site.git
cd descarte-certo-site
```

2. **Instale as dependências**
```bash
npm run install-all
```

3. **Configure o banco de dados**
```bash
cd server
npx prisma migrate dev
npx prisma generate
```

4. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

5. **Execute o projeto**
```bash
npm run dev
```

### 🌐 Deploy

#### Frontend (Vercel/Netlify)
```bash
cd client
npm run build
# Faça upload da pasta dist
```

#### Backend (Railway/Heroku)
```bash
cd server
# Configure as variáveis de ambiente
# Deploy via Git
```

---

## 🧪 Testes

### 📝 Testes Unitários
```bash
cd client
npm test
```

### 🔄 Testes de Integração
```bash
cd server
npm test
```

### 🌐 Testes E2E
```bash
npm run test:e2e
```

---

## 📊 Monitoramento e Analytics

### 📈 Métricas Implementadas
- **Usuários Ativos**: Contagem diária/mensal
- **Material Reciclado**: Peso total por tipo
- **Pontos Distribuídos**: Total de pontos ganhos
- **Engajamento**: Tempo médio de sessão
- **Conversão**: Taxa de registro

### 🔍 Logs
- **Acesso**: Logs de requisições
- **Erros**: Logs de erros com stack trace
- **Performance**: Tempo de resposta das APIs
- **Segurança**: Tentativas de acesso não autorizado

### 📊 Dashboard de Analytics
- **Google Analytics**: Rastreamento de usuários
- **Supabase Analytics**: Métricas do banco
- **Custom Metrics**: Métricas específicas do projeto

---

## 🔒 Segurança

### 🛡️ Medidas Implementadas
- **HTTPS**: Forçado em produção
- **CORS**: Configurado adequadamente
- **Rate Limiting**: Limitação de requisições
- **Input Validation**: Validação de entrada
- **SQL Injection**: Prevenido via Prisma
- **XSS**: Prevenido via React
- **CSRF**: Tokens de proteção

### 🔐 Autenticação
- **JWT**: Tokens seguros
- **Refresh Tokens**: Renovação automática
- **Password Hashing**: bcrypt
- **Session Management**: Gerenciamento de sessões

### 🚨 Monitoramento de Segurança
- **Logs de Segurança**: Tentativas de acesso
- **Alertas**: Notificações de atividades suspeitas
- **Backup**: Backup automático do banco

---

## 📱 PWA (Progressive Web App)

### ✨ Funcionalidades
- **Instalação**: Pode ser instalado como app nativo
- **Offline**: Funcionalidade básica sem internet
- **Push Notifications**: Notificações push
- **Background Sync**: Sincronização em background
- **App Shell**: Interface similar a app nativo

### 📋 Manifest
```json
{
  "name": "Descarte Certo",
  "short_name": "DescarteCerto",
  "description": "Plataforma educacional e ecológica",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#059669",
  "icons": [...]
}
```

---

## 🌍 Internacionalização (i18n)

### 🌐 Idiomas Suportados
- **Português (PT)**: Idioma padrão
- **Inglês (EN)**: Tradução completa

### 📝 Estrutura de Traduções
```
locales/
├── pt.json     # Português
└── en.json     # Inglês
```

### 🔄 Funcionalidades
- **Detecção Automática**: Detecta idioma do navegador
- **Persistência**: Salva preferência do usuário
- **Fallback**: Fallback para português
- **Pluralização**: Suporte a pluralização

---

## ♿ Acessibilidade

### 🎯 Recursos Implementados
- **ARIA Labels**: Labels para screen readers
- **Keyboard Navigation**: Navegação por teclado
- **High Contrast**: Modo alto contraste
- **Large Text**: Texto ampliado
- **Reduced Motion**: Redução de animações
- **Screen Reader**: Compatibilidade com leitores de tela

### 🎨 Design Inclusivo
- **Contraste**: Contraste adequado de cores
- **Tamanho de Fonte**: Fontes legíveis
- **Espaçamento**: Espaçamento adequado
- **Foco Visual**: Indicadores de foco claros

---

## 🔄 CI/CD

### 📋 Pipeline de Deploy
1. **Testes**: Execução automática de testes
2. **Build**: Build de produção
3. **Análise**: Análise de código
4. **Deploy**: Deploy automático
5. **Monitoramento**: Verificação pós-deploy

### 🛠️ Ferramentas
- **GitHub Actions**: Automação
- **ESLint**: Linting de código
- **Prettier**: Formatação
- **Jest**: Testes unitários
- **Cypress**: Testes E2E

---

## 📈 Roadmap

### 🚀 Versão 2.0 (Próximos 3 meses)
- [ ] **App Mobile**: Aplicativo nativo iOS/Android
- [ ] **IA Avançada**: Reconhecimento de imagens
- [ ] **Gamificação Avançada**: Missões e eventos
- [ ] **Integração Escolar**: Dashboard para escolas
- [ ] **Marketplace**: Loja de produtos sustentáveis

### 🌟 Versão 3.0 (Próximos 6 meses)
- [ ] **Realidade Aumentada**: AR para identificação
- [ ] **Blockchain**: Certificados digitais
- [ ] **IoT**: Sensores inteligentes
- [ ] **Machine Learning**: Previsões de reciclagem
- [ ] **API Pública**: API para terceiros

### 🎯 Versão 4.0 (Próximos 12 meses)
- [ ] **Expansão Internacional**: Múltiplos países
- [ ] **Parcerias Corporativas**: Empresas parceiras
- [ ] **Educação Formal**: Integração com currículo escolar
- [ ] **Pesquisa**: Plataforma de pesquisa ambiental
- [ ] **Sustentabilidade**: Carbono neutro

---

## 👥 Equipe e Contribuição

### 👨‍💻 Desenvolvedor Principal
- **Gustavo Sauder**: Full-stack developer
- **Email**: gustavo@descarte-certo.com
- **GitHub**: [@gustavosauder](https://github.com/gustavosauder)

### 🤝 Como Contribuir
1. **Fork** o projeto
2. **Crie** uma branch para sua feature
3. **Commit** suas mudanças
4. **Push** para a branch
5. **Abra** um Pull Request

### 📋 Padrões de Código
- **ESLint**: Configuração padrão
- **Prettier**: Formatação automática
- **Conventional Commits**: Padrão de commits
- **Code Review**: Revisão obrigatória

---

## 📞 Suporte e Contato

### 🆘 Suporte Técnico
- **Email**: suporte@descarte-certo.com
- **Documentação**: [docs.descarte-certo.com](https://docs.descarte-certo.com)
- **Issues**: [GitHub Issues](https://github.com/seu-usuario/descarte-certo-site/issues)

### 📧 Contato Geral
- **Email**: contato@descarte-certo.com
- **Website**: [descarte-certo.com](https://descarte-certo.com)
- **LinkedIn**: [Descarte Certo](https://linkedin.com/company/descarte-certo)

### 📱 Redes Sociais
- **Instagram**: [@descarte_certo](https://instagram.com/descarte_certo)
- **Facebook**: [Descarte Certo](https://facebook.com/descarte.certo)
- **YouTube**: [Descarte Certo](https://youtube.com/@descarte_certo)

---

## 📄 Licença

Este projeto está licenciado sob a **MIT License** - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 🙏 Agradecimentos

- **Supabase**: Plataforma de backend
- **Vercel**: Hospedagem do frontend
- **Tailwind CSS**: Framework de estilização
- **React**: Biblioteca JavaScript
- **Comunidade Open Source**: Contribuições e feedback

---

*Documentação atualizada em: Janeiro 2025*
*Versão do projeto: 2.0.0*
*Última revisão: Gustavo Sauder* 