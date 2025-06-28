# Descarte Certo API v2.0

## 📋 Visão Geral

A API do Descarte Certo v2.0 é uma plataforma completa de educação ambiental que oferece funcionalidades avançadas de gamificação, notificações, marketplace, blog, suporte e muito mais.

## 🚀 Funcionalidades Principais

### ✅ Implementadas na v2.0

- **🔐 Autenticação e Autorização** - JWT com roles
- **♻️ Sistema de Descarte** - Registro e rastreamento
- **📊 Impacto Ambiental** - Métricas e estatísticas
- **📍 Pontos de Coleta** - Geolocalização
- **📖 Histórias de Sucesso** - Compartilhamento
- **⚙️ Painel Administrativo** - Gestão completa
- **🔔 Notificações Push/Email** - Firebase + Nodemailer
- **🎯 Sistema de Desafios** - Gamificação avançada
- **📱 Feed de Atividades** - Tempo real
- **🛒 Marketplace de Recompensas** - Parceiros
- **📝 Blog e Conteúdo** - CMS integrado
- **🎫 Sistema de Suporte** - Tickets e chatbot
- **📄 Relatórios PDF** - Certificados e relatórios
- **🌐 API Pública** - Documentada e segura
- **🏆 Gamificação Avançada** - Níveis, badges, rankings
- **🗺️ Ranking Geolocalizado** - Por cidade/estado
- **🧮 Simulador de Impacto** - Interativo
- **📱 PWA/Modo Offline** - Progressive Web App

## 🔗 Endpoints

### Autenticação
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
POST   /api/auth/refresh
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
```

### Usuários
```
GET    /api/users
GET    /api/users/:id
PUT    /api/users/:id
DELETE /api/users/:id
GET    /api/users/ranking
GET    /api/users/:id/stats
```

### Descartes
```
GET    /api/disposals
POST   /api/disposals
GET    /api/disposals/:id
PUT    /api/disposals/:id
DELETE /api/disposals/:id
GET    /api/disposals/stats
POST   /api/disposals/upload-image
```

### Impacto Ambiental
```
GET    /api/impact
GET    /api/impact/stats
GET    /api/impact/calculator
POST   /api/impact/calculate
```

### Pontos de Coleta
```
GET    /api/collection
POST   /api/collection
GET    /api/collection/:id
PUT    /api/collection/:id
DELETE /api/collection/:id
GET    /api/collection/nearby
```

### Contato
```
POST   /api/contact
GET    /api/contact (admin)
PUT    /api/contact/:id/status (admin)
```

### Histórias
```
GET    /api/stories
POST   /api/stories
GET    /api/stories/:id
PUT    /api/stories/:id
DELETE /api/stories/:id
GET    /api/stories/featured
POST   /api/stories/:id/like
```

### Notificações
```
GET    /api/notifications
PATCH  /api/notifications/:id/read
PATCH  /api/notifications/read-all
GET    /api/notifications/unread-count
DELETE /api/notifications/:id
```

### Desafios
```
GET    /api/challenges
GET    /api/challenges/my-challenges
POST   /api/challenges/:id/join
PATCH  /api/challenges/:id/progress
GET    /api/challenges/:id/ranking
GET    /api/challenges/stats
POST   /api/challenges (admin)
PUT    /api/challenges/:id (admin)
DELETE /api/challenges/:id (admin)
```

### Atividades
```
GET    /api/activities
GET    /api/activities/my-activities
GET    /api/activities/location/:city/:state
GET    /api/activities/stats
GET    /api/activities/friends
DELETE /api/activities/:id
```

### Marketplace
```
GET    /api/marketplace/catalog
GET    /api/marketplace/my-rewards
POST   /api/marketplace/redeem/:id
GET    /api/marketplace/partners
POST   /api/marketplace/donate
GET    /api/marketplace/donations
GET    /api/marketplace/stats
POST   /api/marketplace/catalog (admin)
PUT    /api/marketplace/catalog/:id (admin)
DELETE /api/marketplace/catalog/:id (admin)
```

### Blog
```
GET    /api/blog
GET    /api/blog/:id
GET    /api/blog/my-posts
POST   /api/blog
PUT    /api/blog/:id
DELETE /api/blog/:id
POST   /api/blog/:id/like
GET    /api/blog/tags/popular
GET    /api/blog/:id/related
PATCH  /api/blog/:id/approve (admin)
GET    /api/blog/stats/overview (admin)
```

### Suporte
```
GET    /api/support/my-tickets
GET    /api/support/:id
POST   /api/support
PUT    /api/support/:id
PATCH  /api/support/:id/close
GET    /api/support/admin/all (admin)
PATCH  /api/support/:id/status (admin)
POST   /api/support/:id/reply (admin)
GET    /api/support/stats/overview (admin)
GET    /api/support/categories
```

### Relatórios
```
GET    /api/reports/personal
GET    /api/reports/certificate
GET    /api/reports/impact (admin)
GET    /api/reports/school/:id (admin)
```

### API Pública
```
GET    /api/public
GET    /api/public/impact
GET    /api/public/stats
GET    /api/public/leaderboard
GET    /api/public/materials
GET    /api/public/schools
GET    /api/public/collection-points
```

### Administração
```
GET    /api/admin/dashboard
GET    /api/admin/users
GET    /api/admin/disposals
GET    /api/admin/stories
GET    /api/admin/contacts
GET    /api/admin/analytics
POST   /api/admin/users/:id/role
DELETE /api/admin/users/:id
```

## 🔐 Autenticação

### Headers Necessários
```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Roles
- `USER` - Usuário comum
- `ADMIN` - Administrador
- `MODERATOR` - Moderador

## 📊 Códigos de Status

- `200` - Sucesso
- `201` - Criado
- `400` - Requisição inválida
- `401` - Não autorizado
- `403` - Proibido
- `404` - Não encontrado
- `429` - Muitas requisições
- `500` - Erro interno

## 🚀 Rate Limiting

- **Limite**: 100 requests por 15 minutos por IP
- **Headers de resposta**:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

## 📝 Exemplos de Uso

### Criar um descarte
```bash
curl -X POST http://localhost:3000/api/disposals \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "materialType": "PLASTIC",
    "weight": 2.5,
    "location": "Escola"
  }'
```

### Buscar ranking
```bash
curl -X GET "http://localhost:3000/api/users/ranking?limit=10&city=São Paulo" \
  -H "Authorization: Bearer <token>"
```

### Participar de desafio
```bash
curl -X POST http://localhost:3000/api/challenges/challenge-id/join \
  -H "Authorization: Bearer <token>"
```

## 🔧 Configuração

### Variáveis de Ambiente
```env
PORT=3000
DATABASE_URL="file:./dev.db"
JWT_SECRET=your-secret-key
EMAIL_USER=seu-email@gmail.com
EMAIL_PASS=sua-senha-app
FIREBASE_PROJECT_ID=descarte-certo
API_KEY=your-public-api-key
```

### Instalação
```bash
npm install
npm run migrate
npm run db:seed
npm run dev
```

## 📈 Monitoramento

### Health Check
```bash
GET /api/health
```

### Métricas
- Total de usuários ativos
- Descartes realizados
- Impacto ambiental
- Performance da API

## 🔒 Segurança

- **Helmet** - Headers de segurança
- **CORS** - Controle de origem
- **Rate Limiting** - Proteção contra spam
- **JWT** - Autenticação segura
- **Validação** - Sanitização de dados
- **HTTPS** - Criptografia em produção

## 📚 Recursos Adicionais

- [Documentação Completa](https://docs.descarte-certo.com)
- [SDK JavaScript](https://github.com/descarte-certo/js-sdk)
- [Exemplos de Integração](https://github.com/descarte-certo/examples)
- [Comunidade](https://community.descarte-certo.com)

## 🤝 Suporte

- **Email**: api@descarte-certo.com
- **Documentação**: https://docs.descarte-certo.com/api
- **Issues**: https://github.com/descarte-certo/api/issues
- **Discord**: https://discord.gg/descarte-certo

---

**Versão**: 2.0.0  
**Última atualização**: Dezembro 2024  
**Status**: ✅ Produção 