# 🚀 Instruções Rápidas - Descarte Certo

## ⚡ Inicialização Rápida

### Opção 1: Script Automático (Recomendado)
```powershell
.\start-project.ps1
```

### Opção 2: Manual
```powershell
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend
cd client
npm run dev
```

## 🌐 URLs de Acesso

- **📱 Frontend**: http://localhost:5173
- **🔧 Backend**: http://localhost:3000
- **📚 API Docs**: http://localhost:3000/api/docs
- **🏥 Health Check**: http://localhost:3000/api/health

## ⚙️ Configuração (Opcional)

Para funcionalidades completas, configure o arquivo `server/.env`:

```env
# Email (Gmail)
EMAIL_USER=seu-email@gmail.com
EMAIL_PASS=sua-senha-app

# Firebase (opcional)
FIREBASE_PROJECT_ID=seu-projeto
FIREBASE_PRIVATE_KEY=sua-chave-privada
FIREBASE_CLIENT_EMAIL=seu-email-service

# Supabase
DATABASE_URL=sua-url-do-supabase
SUPABASE_URL=sua-url-do-supabase
SUPABASE_ANON_KEY=sua-chave-anonima
```

## 🧪 Testes

```powershell
# Testar todas as funcionalidades
cd server
npm test

# Testar especificamente
node test-all-features.js
```

## 📊 Funcionalidades Disponíveis

### ✅ Implementadas e Funcionando
- 🔐 Autenticação com Supabase
- ♻️ Sistema de descarte
- 🏆 Gamificação completa
- 📊 Dashboard administrativo
- 🔔 Sistema de notificações
- 📱 PWA (Progressive Web App)
- 📄 Exportação de dados (PDF/Excel/CSV)
- 📋 Monitoramento e logs
- 🧪 Testes de integração
- 📚 Documentação Swagger

### 🎯 Próximos Passos
1. Configure as variáveis de ambiente
2. Teste todas as funcionalidades
3. Deploy em produção
4. Configure domínio personalizado

## 🆘 Suporte

- **Email**: gustavo@descarte-certo.com
- **Documentação**: http://localhost:3000/api/docs
- **Issues**: GitHub Issues

---

**🌱 Descarte Certo - Plataforma Completa e Funcional!** 