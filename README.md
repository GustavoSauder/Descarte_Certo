# 🌍 Descarte Certo

Plataforma educacional e ecológica para facilitar o descarte correto de resíduos e promover a educação ambiental.

## 🚀 Sobre o Projeto

O **Descarte Certo** é uma plataforma completa que combina tecnologia e educação ambiental para incentivar práticas sustentáveis de descarte de resíduos. O projeto utiliza gamificação para engajar usuários e promover mudanças comportamentais positivas.

## ✨ Funcionalidades Principais

### 🔐 Sistema de Autenticação
- Registro e login de usuários
- Autenticação segura com JWT
- Perfis personalizáveis

### ♻️ Gestão de Descarte
- Registro de descartas por categoria
- Upload de imagens
- Cálculo de pontos por material
- Geolocalização de pontos de coleta

### 🏆 Gamificação
- Sistema de conquistas e badges
- Ranking de usuários
- Desafios semanais
- Recompensas por atividades

### 📊 Analytics e Relatórios
- Dashboard interativo
- Gráficos em tempo real
- Métricas de impacto ambiental
- Relatórios personalizados

### 📱 PWA (Progressive Web App)
- Instalação como app nativo
- Funcionalidade offline
- Notificações push
- Sincronização automática

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca de UI
- **Vite** - Build tool moderno
- **Tailwind CSS** - Framework CSS
- **Framer Motion** - Animações
- **Chart.js** - Gráficos interativos

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **Prisma** - ORM moderno
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação

### DevOps
- **Vercel** - Deploy e hosting
- **Supabase** - Backend-as-a-Service
- **GitHub Actions** - CI/CD

## 📁 Estrutura do Projeto

```
descarte-certo/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # Serviços de API
│   │   └── utils/         # Utilitários
│   └── public/            # Arquivos públicos
├── server/                # Backend Node.js
│   ├── routes/           # Rotas da API
│   ├── services/         # Lógica de negócio
│   ├── middleware/       # Middlewares
│   ├── config/          # Configurações
│   └── prisma/          # Schema do banco
└── docs/                # Documentação
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- PostgreSQL database

### Instalação

```bash
# Clone o repositório
git clone https://github.com/GustavoSauder/Descarte_Certo.git
cd Descarte_Certo

# Instale as dependências
npm run install-all

# Configure as variáveis de ambiente
cp server/env-template.txt server/.env
# Edite o arquivo .env com suas credenciais

# Execute as migrações do banco
cd server
npx prisma migrate dev
npx prisma generate

# Inicie o projeto
npm run dev
```

### Acessar a Aplicação
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3002
- **API Docs**: http://localhost:3002/api/docs

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
- Login/Registro seguro
- Validação de tokens JWT
- Controle de acesso baseado em roles
- Recuperação de senha

### 👥 Gestão de Usuários
- CRUD completo de usuários
- Perfis personalizáveis
- Sistema de níveis e pontuação
- Histórico de atividades

### ♻️ Sistema de Descarte
- Registro de descartas por material
- Categorização automática
- Cálculo de pontos
- Upload e processamento de imagens

### 🏆 Gamificação
- Sistema de conquistas
- Ranking competitivo
- Desafios temporários
- Recompensas por metas

### 📈 Analytics
- Dashboard interativo
- Gráficos em tempo real
- Exportação de relatórios
- Métricas de impacto

### 🔔 Notificações
- Push notifications
- Notificações por email
- Notificações in-app
- Configurações personalizáveis

## 🛡️ Segurança

- Rate limiting configurado
- CORS adequadamente configurado
- Headers de segurança
- Validação de entrada
- Sanitização de dados
- Autenticação JWT segura

## 📱 PWA Features

- Instalação como app nativo
- Funcionalidade offline
- Cache inteligente
- Sincronização em background
- Atualizações automáticas

## 🎯 Próximos Passos

### Funcionalidades Planejadas
- Chat em tempo real
- Integração com IoT
- Machine Learning para detecção
- Blockchain para certificados
- API pública para terceiros

### Melhorias Técnicas
- Microserviços
- Cache distribuído
- Load balancing
- CI/CD pipeline
- Docker containers

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 👥 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## 📞 Suporte

- **Email**: gustavo@descarte-certo.com
- **Issues**: [GitHub Issues](https://github.com/GustavoSauder/Descarte_Certo/issues)

---

**Desenvolvido com ❤️ para um futuro mais sustentável! 🌍**

## 🌟 Agradecimentos

Agradecemos a todos os contribuidores e à comunidade que apoia projetos de sustentabilidade e educação ambiental.

---

**Status**: ✅ Em desenvolvimento ativo  
**Versão**: 2.0.0  
**Última atualização**: Janeiro 2025
