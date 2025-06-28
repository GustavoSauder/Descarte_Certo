# 🌱 Descarte Certo - Plataforma Completa

Uma plataforma completa de educação ambiental e gamificação para reciclagem, construída com React, Node.js, Prisma e Supabase.

## 🚀 Funcionalidades Implementadas

### ✅ **Autenticação e Segurança**
- **Supabase Auth** - Autenticação segura com JWT
- **Middleware de Autorização** - Controle de acesso por roles
- **Rate Limiting** - Proteção contra ataques
- **Helmet** - Headers de segurança
- **CORS** - Configuração segura de cross-origin

### ✅ **API e Documentação**
- **Swagger/OpenAPI** - Documentação automática da API
- **Respostas Padronizadas** - Formato consistente de respostas
- **Validação Centralizada** - Middleware de validação
- **Tratamento de Erros** - Sistema robusto de tratamento de erros

### ✅ **Painel Administrativo Avançado**
- **Dashboard com Gráficos** - Estatísticas em tempo real
- **Gestão de Usuários** - CRUD completo com ações (banir, promover, deletar)
- **Monitoramento de Atividades** - Logs detalhados de ações
- **Relatórios Avançados** - Exportação em PDF e Excel

### ✅ **Sistema de Notificações**
- **Notificações Push** - Via Service Worker
- **Notificações por Email** - Templates HTML responsivos
- **Notificações In-App** - Sistema interno de notificações
- **Configurações Personalizáveis** - Controle por usuário

### ✅ **PWA (Progressive Web App)**
- **Service Worker** - Funcionalidade offline
- **Manifest.json** - Instalação como app nativo
- **Cache Inteligente** - Estratégias de cache
- **Sincronização em Background** - Dados offline

### ✅ **Exportação de Dados**
- **Relatórios PDF** - Relatórios detalhados de usuários
- **Exportação Excel** - Planilhas com múltiplas abas
- **Exportação CSV** - Dados em formato tabular
- **Limpeza Automática** - Arquivos temporários

### ✅ **Monitoramento e Logs**
- **Métricas de Sistema** - CPU, memória, uptime
- **Métricas de Aplicação** - Usuários, descartas, performance
- **Logs de Atividade** - Rastreamento de ações
- **Logs de Erro** - Captura e análise de erros
- **Relatório de Saúde** - Status do sistema

### ✅ **Testes de Integração**
- **Vitest** - Framework de testes moderno
- **Supertest** - Testes de API
- **Cobertura de Código** - Relatórios de cobertura
- **Testes Automatizados** - CI/CD ready

### ✅ **Acessibilidade**
- **ARIA Labels** - Suporte a leitores de tela
- **Navegação por Teclado** - Acessibilidade completa
- **Contraste Adequado** - Design inclusivo
- **Semântica HTML** - Estrutura semântica

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca de UI
- **Vite** - Build tool moderno
- **Tailwind CSS** - Framework CSS utilitário
- **Framer Motion** - Animações
- **Chart.js** - Gráficos interativos
- **React Query** - Gerenciamento de estado
- **React Router** - Roteamento
- **i18next** - Internacionalização

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **Prisma** - ORM moderno
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **Nodemailer** - Envio de emails
- **PDFKit** - Geração de PDFs
- **ExcelJS** - Manipulação de Excel

### DevOps & Qualidade
- **Vitest** - Testes unitários
- **ESLint** - Linting de código
- **Prettier** - Formatação
- **Swagger** - Documentação API
- **Helmet** - Segurança
- **Morgan** - Logging

## 📁 Estrutura do Projeto

```
descarte-certo-site/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # Serviços de API
│   │   ├── utils/         # Utilitários
│   │   └── locales/       # Traduções
│   ├── public/
│   │   ├── manifest.json  # PWA manifest
│   │   └── sw.js         # Service Worker
│   └── package.json
├── server/                # Backend Node.js
│   ├── routes/           # Rotas da API
│   ├── services/         # Lógica de negócio
│   ├── middleware/       # Middlewares
│   ├── config/          # Configurações
│   ├── test/            # Testes
│   └── prisma/          # Schema do banco
└── README.md
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Supabase account
- PostgreSQL database

### 1. Configuração do Ambiente
```bash
# Clone o repositório
git clone https://github.com/seu-usuario/descarte-certo-site.git
cd descarte-certo-site

# Instale as dependências
npm install
cd client && npm install
cd ../server && npm install
```

### 2. Configuração do Banco de Dados
```bash
# Configure as variáveis de ambiente
cp server/env.example server/.env
# Edite o arquivo .env com suas credenciais

# Execute as migrações
cd server
npx prisma migrate dev
npx prisma generate
```

### 3. Executar o Projeto
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

### 4. Acessar a Aplicação
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000
- **API Docs**: http://localhost:3000/api/docs

## 🧪 Testes

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes com cobertura
npm run test:coverage
```

## 📊 Funcionalidades por Módulo

### 🔐 Autenticação
- [x] Login/Registro com Supabase
- [x] JWT Token validation
- [x] Role-based access control
- [x] Password reset
- [x] Email verification

### 👥 Gestão de Usuários
- [x] CRUD completo
- [x] Perfis personalizáveis
- [x] Sistema de níveis
- [x] Pontuação gamificada
- [x] Histórico de atividades

### ♻️ Sistema de Descarte
- [x] Registro de descartas
- [x] Categorização por material
- [x] Cálculo de pontos
- [x] Upload de imagens
- [x] Geolocalização

### 🏆 Gamificação
- [x] Sistema de conquistas
- [x] Ranking de usuários
- [x] Recompensas
- [x] Desafios
- [x] Metas semanais

### 📈 Analytics e Relatórios
- [x] Dashboard interativo
- [x] Gráficos em tempo real
- [x] Exportação de dados
- [x] Relatórios personalizados
- [x] Métricas de impacto

### 🔔 Notificações
- [x] Push notifications
- [x] Email notifications
- [x] In-app notifications
- [x] Configurações personalizáveis
- [x] Templates responsivos

### 📱 PWA Features
- [x] Instalação como app
- [x] Funcionalidade offline
- [x] Cache inteligente
- [x] Sincronização em background
- [x] Atualizações automáticas

### 🛡️ Segurança
- [x] Rate limiting
- [x] CORS configurado
- [x] Headers de segurança
- [x] Validação de entrada
- [x] Sanitização de dados

### 📋 Monitoramento
- [x] Logs de atividade
- [x] Logs de erro
- [x] Métricas de performance
- [x] Relatório de saúde
- [x] Alertas automáticos

## 🎯 Próximos Passos

### Funcionalidades Planejadas
- [ ] Chat em tempo real
- [ ] Integração com IoT
- [ ] Machine Learning para detecção
- [ ] Blockchain para certificados
- [ ] API pública para terceiros

### Melhorias Técnicas
- [ ] Microserviços
- [ ] Cache distribuído
- [ ] Load balancing
- [ ] CI/CD pipeline
- [ ] Docker containers

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

- **Email**: gustavo@descarte-certo.com
- **Documentação**: http://localhost:3000/api/docs
- **Issues**: [GitHub Issues](https://github.com/seu-usuario/descarte-certo-site/issues)

---

**Desenvolvido com ❤️ para um futuro mais sustentável! 🌍** 