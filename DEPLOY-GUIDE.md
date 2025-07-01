# 🚀 Guia de Deploy - Descarte Certo

## 📋 Opções de Deploy

### 1. **Vercel (Recomendado) - Gratuito**
**Melhor para:** Full-stack com backend

#### Passos:
1. Acesse [vercel.com](https://vercel.com)
2. Faça login com GitHub
3. Clique em "New Project"
4. Importe o repositório `GustavoSauder/Descarte-Certo`
5. Configure as variáveis de ambiente:
   ```
   DATABASE_URL=sua_url_supabase
   JWT_SECRET=seu_jwt_secret
   SUPABASE_URL=sua_url_supabase
   SUPABASE_ANON_KEY=sua_chave_anon
   ```
6. Deploy automático!

**URL:** `https://descarte-certo.vercel.app`

---

### 2. **GitHub Pages - Gratuito**
**Melhor para:** Frontend apenas

#### Passos:
1. No repositório GitHub, vá em Settings > Pages
2. Source: "Deploy from a branch"
3. Branch: `gh-pages`
4. Execute localmente:
   ```bash
   cd client
   npm install gh-pages --save-dev
   npm run deploy
   ```

**URL:** `https://gustavosauder.github.io/Descarte-Certo`

---

### 3. **Netlify - Gratuito**
**Melhor para:** Frontend + Serverless

#### Passos:
1. Acesse [netlify.com](https://netlify.com)
2. "New site from Git"
3. Conecte com GitHub
4. Build settings:
   - Build command: `cd client && npm run build`
   - Publish directory: `client/dist`

**URL:** `https://descarte-certo.netlify.app`

---

### 4. **Railway - Pago**
**Melhor para:** Full-stack com banco de dados

#### Passos:
1. Acesse [railway.app](https://railway.app)
2. "New Project" > "Deploy from GitHub repo"
3. Configure variáveis de ambiente
4. Deploy automático

---

## 🔧 Configuração de Domínio Personalizado

### 1. **Comprar Domínio**
- [Namecheap](https://namecheap.com)
- [GoDaddy](https://godaddy.com)
- [Google Domains](https://domains.google)

### 2. **Configurar DNS**
```
Tipo: CNAME
Nome: www
Valor: descarte-certo.vercel.app

Tipo: A
Nome: @
Valor: 76.76.19.19
```

### 3. **Configurar no Vercel**
1. Project Settings > Domains
2. Add Domain: `descarte-certo.com`
3. Configure DNS conforme instruções

---

## 🔐 Variáveis de Ambiente (Produção)

```env
# Banco de Dados
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
SUPABASE_URL=https://[PROJECT].supabase.co
SUPABASE_ANON_KEY=[ANON_KEY]
SUPABASE_SERVICE_ROLE_KEY=[SERVICE_ROLE_KEY]

# JWT
JWT_SECRET=seu_super_secret_jwt_producao

# Email
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_app

# Frontend
FRONTEND_URL=https://descarte-certo.com
API_URL=https://descarte-certo.com/api

# Segurança
NODE_ENV=production
```

---

## 📊 Monitoramento

### 1. **Vercel Analytics**
- Performance
- Core Web Vitals
- Error tracking

### 2. **Sentry (Opcional)**
```bash
npm install @sentry/react @sentry/tracing
```

### 3. **Google Analytics**
```html
<!-- Adicionar no index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
```

---

## 🚀 Deploy Automático

### GitHub Actions
O workflow já está configurado em `.github/workflows/deploy.yml`

**Triggers:**
- Push para `main` → Deploy automático
- Pull Request → Testes automáticos

### Vercel CLI
```bash
npm i -g vercel
vercel login
vercel --prod
```

---

## 🔄 Atualizações

### 1. **Desenvolvimento**
```bash
git add .
git commit -m "Nova funcionalidade"
git push origin main
```

### 2. **Deploy Automático**
- Vercel: Deploy automático
- GitHub Pages: `npm run deploy`
- Netlify: Deploy automático

---

## 📱 PWA (Progressive Web App)

### Configuração
- ✅ Manifest configurado
- ✅ Service Worker ativo
- ✅ Offline support
- ✅ Install prompt

### Teste
```bash
npm run build
npm run preview
```

---

## 🔍 Troubleshooting

### Erro de Build
```bash
npm run build
# Verificar logs de erro
```

### Variáveis de Ambiente
```bash
# Verificar se todas estão configuradas
echo $DATABASE_URL
echo $JWT_SECRET
```

### Banco de Dados
```bash
# Verificar conexão
npx prisma db push
npx prisma studio
```

---

## 📞 Suporte

- **Email:** gustavo@descarte-certo.com
- **GitHub Issues:** [Criar Issue](https://github.com/GustavoSauder/Descarte-Certo/issues)
- **Documentação:** [README.md](README.md)

---

**Status:** ✅ Pronto para Deploy  
**Última atualização:** Julho 2024 