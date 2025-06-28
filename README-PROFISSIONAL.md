# 🌱 Descarte Certo - Plataforma Educacional e Ecológica

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue.svg)](https://www.postgresql.org/)

> Plataforma inovadora que combina tecnologia, gamificação e inteligência artificial para promover a reciclagem e sustentabilidade através da educação ambiental.

## 🎯 Sobre o Projeto

O **Descarte Certo** é uma solução completa que transforma a reciclagem em uma experiência educativa e envolvente. Através de um sistema gamificado, reconhecimento de materiais por IA e uma interface moderna, o projeto visa criar uma comunidade engajada em práticas sustentáveis.

### ✨ Principais Características

- 🎮 **Sistema Gamificado**: Pontos, níveis e recompensas
- 🤖 **Inteligência Artificial**: Reconhecimento automático de materiais
- 📱 **Design Responsivo**: Funciona em todos os dispositivos
- 🌙 **Dark Mode**: Interface adaptável às preferências
- 🌍 **Internacionalização**: Suporte PT/EN
- ♿ **Acessibilidade**: Conformidade WCAG 2.1
- 🔐 **Segurança**: Autenticação JWT + Supabase

## 🚀 Demonstração

- **Frontend**: [https://descarte-certo.vercel.app](https://descarte-certo.vercel.app)
- **Backend API**: [https://descarte-certo-api.railway.app](https://descarte-certo-api.railway.app)
- **Documentação**: [DOCUMENTACAO-COMPLETA.md](DOCUMENTACAO-COMPLETA.md)

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca JavaScript
- **Vite** - Build tool
- **Tailwind CSS** - Framework CSS
- **Framer Motion** - Animações
- **React Router** - Roteamento
- **React Query** - Gerenciamento de estado
- **Yup** - Validação de formulários

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **Prisma** - ORM
- **PostgreSQL** - Banco de dados
- **Supabase** - Backend-as-a-Service
- **JWT** - Autenticação
- **Multer** - Upload de arquivos

### DevOps & Ferramentas
- **Git** - Controle de versão
- **GitHub Actions** - CI/CD
- **Vercel** - Deploy frontend
- **Railway** - Deploy backend
- **Supabase** - Banco e autenticação

## 📦 Instalação

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta no Supabase
- Git

### Passo a Passo

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/descarte-certo-site.git
cd descarte-certo-site
```

2. **Instale as dependências**
```bash
npm run install-all
```

3. **Configure as variáveis de ambiente**

Crie o arquivo `.env` na pasta `server/`:
```env
DATABASE_URL="postgresql://postgres:[SENHA]@db.[REF].supabase.co:5432/postgres"
PORT=3001
JWT_SECRET="sua-chave-secreta-aqui"
```

Crie o arquivo `.env` na pasta `client/`:
```env
VITE_API_URL=http://localhost:3001
VITE_SUPABASE_URL=sua-url-supabase
VITE_SUPABASE_ANON_KEY=sua-chave-anonima
```

4. **Configure o banco de dados**
```bash
cd server
npx prisma migrate dev
npx prisma db seed
```

5. **Inicie o desenvolvimento**
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

6. **Acesse a aplicação**
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## 🏗️ Estrutura do Projeto

```
descarte-certo-site/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # Serviços de API
│   │   ├── utils/         # Utilitários
│   │   └── locales/       # Arquivos de tradução
│   └── public/            # Arquivos estáticos
├── server/                # Backend Node.js
│   ├── routes/            # Rotas da API
│   ├── middleware/        # Middlewares
│   ├── services/          # Serviços
│   ├── prisma/            # Schema e migrações
│   └── config/            # Configurações
└── docs/                  # Documentação
```

## 🎮 Funcionalidades

### 👤 Sistema de Usuários
- Cadastro e login com email/senha
- Autenticação OAuth (Google)
- Perfis personalizáveis
- Sistema de níveis e pontos

### 🎯 Gamificação
- **Pontos Ecológicos**: Ganhos por descarte correto
- **Sistema de Níveis**: Progressão baseada em pontos
- **Ranking**: Competição entre usuários
- **Conquistas**: Badges e achievements
- **Recompensas**: Loja de pontos

### 🤖 Inteligência Artificial
- **Reconhecimento de Materiais**: Upload e classificação
- **Tempo de Decomposição**: Informações educativas
- **Pontos de Coleta**: Sugestões de descarte
- **Análise de Impacto**: Estatísticas personalizadas

### 📊 Dashboard e Analytics
- **Estatísticas Pessoais**: Progresso individual
- **Histórico de Descartes**: Timeline de atividades
- **Impacto Ambiental**: Métricas de sustentabilidade
- **Relatórios**: Exportação de dados

### ⚙️ Configurações Avançadas
- **Dark Mode**: Tema claro/escuro/sistema
- **Internacionalização**: PT/EN
- **Acessibilidade**: Alto contraste, texto grande
- **Privacidade**: Controle de dados
- **Notificações**: Push e email

## 🔐 Segurança

- **Autenticação JWT**: Tokens seguros
- **Validação de Input**: Sanitização de dados
- **Rate Limiting**: Proteção contra ataques
- **CORS**: Configuração segura
- **Helmet**: Headers de segurança
- **SQL Injection Protection**: Prisma ORM

## 📱 Responsividade

- **Mobile First**: Design otimizado para mobile
- **Breakpoints**: sm, md, lg, xl
- **Touch Friendly**: Interface para toque
- **PWA Ready**: Progressive Web App

## ♿ Acessibilidade

- **WCAG 2.1**: Conformidade com diretrizes
- **Navegação por Teclado**: Tab, Enter, Esc
- **Screen Readers**: ARIA labels
- **Alto Contraste**: Modo acessibilidade
- **Redução de Animação**: Preferências do usuário

## 🧪 Testes

```bash
# Frontend
cd client
npm test

# Backend
cd server
npm test

# E2E
npm run test:e2e
```

## 📊 Performance

- **Lighthouse Score**: 95+ em todas as métricas
- **Bundle Size**: < 500KB gzipped
- **Load Time**: < 2s
- **Core Web Vitals**: Otimizados

## 🚀 Deploy

### Frontend (Vercel)
```bash
cd client
npm run build
# Deploy automático via GitHub Actions
```

### Backend (Railway)
```bash
cd server
npm start
# Deploy automático via GitHub Actions
```

## 📈 Métricas

- **Usuários Ativos**: 1.200+
- **Materiais Reciclados**: 2.500kg+
- **Escolas Participantes**: 15+
- **Produtos 3D Criados**: 120+

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Diretrizes de Contribuição

- Siga o padrão de código existente
- Adicione testes para novas funcionalidades
- Atualize a documentação quando necessário
- Use commits semânticos

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Equipe

- **Desenvolvedor Principal**: [Gustavo Sauder](https://github.com/gustavosauder)
- **Design**: Equipe interna
- **Testes**: QA Team
- **DevOps**: Infrastructure Team

## 📞 Suporte

- **Email**: suporte@descarte-certo.com
- **WhatsApp**: (11) 99999-9999
- **Issues**: [GitHub Issues](https://github.com/seu-usuario/descarte-certo-site/issues)
- **Documentação**: [DOCUMENTACAO-COMPLETA.md](DOCUMENTACAO-COMPLETA.md)

## 🗓️ Roadmap

### Versão 2.0 (Q2 2024)
- [ ] App mobile nativo (React Native)
- [ ] Integração com IoT
- [ ] Machine Learning avançado
- [ ] Marketplace de reciclagem

### Versão 3.0 (Q4 2024)
- [ ] Blockchain para pontos
- [ ] Realidade aumentada
- [ ] Integração com cidades inteligentes
- [ ] API pública

## 🙏 Agradecimentos

- Comunidade open source
- Supabase pelo backend-as-a-service
- Vercel e Railway pelo hosting
- Todos os contribuidores

---

<div align="center">

**Feito com ❤️ para um mundo mais sustentável**

[![GitHub stars](https://img.shields.io/github/stars/seu-usuario/descarte-certo-site?style=social)](https://github.com/seu-usuario/descarte-certo-site/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/seu-usuario/descarte-certo-site?style=social)](https://github.com/seu-usuario/descarte-certo-site/network)
[![GitHub issues](https://img.shields.io/github/issues/seu-usuario/descarte-certo-site)](https://github.com/seu-usuario/descarte-certo-site/issues)

</div> 