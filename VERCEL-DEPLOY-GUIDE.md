# 🚀 Guia Completo de Deploy no Vercel - Descarte Certo

## 📋 Pré-requisitos

1. **Conta no GitHub** com o repositório do projeto
2. **Conta no Vercel** (gratuita)
3. **Projeto Supabase** configurado
4. **Node.js 18+** instalado localmente

## 🔧 Passo 1: Preparar o Projeto

### 1.1 Verificar se tudo está funcionando localmente:
```bash
# Instalar dependências
npm run install-all

# Testar build
npm run build

# Testar servidor local
npm run dev
```

### 1.2 Verificar arquivos de configuração:
- ✅ `vercel.json` - Configuração do Vercel
- ✅ `client/vite.config.js` - Configuração do Vite
- ✅ `package.json` - Scripts de build

## 🌐 Passo 2: Configurar Supabase

### 2.1 Criar projeto no Supabase:
1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Anote as credenciais:
   - **URL do projeto**
   - **Anon Key**
   - **Service Role Key**

### 2.2 Configurar banco de dados:
```bash
# No diretório server
cd server

# Configurar DATABASE_URL no .env
echo "DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres" > .env

# Executar migrações
npx prisma migrate deploy

# Gerar cliente Prisma
npx prisma generate
```

## 🚀 Passo 3: Deploy no Vercel

### 3.1 Conectar repositório:
1. Acesse [vercel.com](https://vercel.com)
2. Faça login com GitHub
3. Clique em **"New Project"**
4. Importe o repositório `GustavoSauder/Descarte-Certo`

### 3.2 Configurar projeto:
- **Framework Preset**: `Other`
- **Root Directory**: `./` (raiz do projeto)
- **Build Command**: `npm run vercel-build`
- **Output Directory**: `client/dist`
- **Install Command**: `npm run install-all`

### 3.3 Configurar variáveis de ambiente:
Clique em **"Environment Variables"** e adicione:

```env
# Banco de Dados
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
SUPABASE_URL=https://[PROJECT].supabase.co
SUPABASE_ANON_KEY=[ANON_KEY]
SUPABASE_SERVICE_ROLE_KEY=[SERVICE_ROLE_KEY]

# JWT
JWT_SECRET=seu_super_secret_jwt_producao_2024

# Email (opcional)
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_app

# Ambiente
NODE_ENV=production
FRONTEND_URL=https://seu-dominio.vercel.app
API_URL=https://seu-dominio.vercel.app/api
```

### 3.4 Deploy:
1. Clique em **"Deploy"**
2. Aguarde o build (2-5 minutos)
3. Verifique os logs se houver erros

## 🔍 Passo 4: Verificar Deploy

### 4.1 Testar funcionalidades:
- ✅ Página inicial carrega
- ✅ Registro/Login funciona
- ✅ API responde corretamente
- ✅ Banco de dados conectado
- ✅ Upload de imagens funciona

### 4.2 Verificar logs:
```bash
# No painel do Vercel
# Functions > server/index.js > View Function Logs
```

## 🛠️ Passo 5: Configurações Avançadas

### 5.1 Domínio personalizado:
1. **Settings** > **Domains**
2. **Add Domain**: `descarte-certo.com`
3. Configure DNS conforme instruções

### 5.2 Variáveis de ambiente por ambiente:
- **Production**: Todas as variáveis
- **Preview**: Mesmas variáveis
- **Development**: Variáveis de teste

### 5.3 Configurar webhooks (opcional):
```bash
# Para deploy automático em mudanças
# Settings > Git > Deploy Hooks
```

## 🔧 Troubleshooting

### Erro: Build failed
```bash
# Verificar logs no Vercel
# Comum: Dependências faltando
npm run install-all
```

### Erro: Database connection failed
```bash
# Verificar DATABASE_URL
# Testar conexão local
npx prisma db push
```

### Erro: API not found
```bash
# Verificar vercel.json
# Verificar rotas no server/index.js
```

### Erro: Environment variables
```bash
# Verificar se todas estão configuradas
# Verificar nomes (case sensitive)
```

## 📊 Monitoramento

### 5.1 Vercel Analytics:
- **Performance**: Core Web Vitals
- **Errors**: Error tracking
- **Usage**: Function calls

### 5.2 Logs em tempo real:
```bash
# No painel do Vercel
# Functions > server/index.js > View Function Logs
```

## 🔄 Atualizações

### Deploy automático:
1. Push para `main` → Deploy automático
2. Pull Request → Deploy de preview

### Deploy manual:
```bash
# Via CLI
npm i -g vercel
vercel login
vercel --prod
```

## 📱 PWA e Mobile

### Verificar PWA:
- ✅ Manifest configurado
- ✅ Service Worker ativo
- ✅ Offline support
- ✅ Install prompt

### Teste mobile:
- Responsividade
- Touch interactions
- Performance

## 🔐 Segurança

### Verificar:
- ✅ HTTPS ativo
- ✅ Headers de segurança
- ✅ Rate limiting
- ✅ CORS configurado

## 📞 Suporte

### Problemas comuns:
1. **Build falha**: Verificar dependências
2. **API não responde**: Verificar rotas
3. **DB não conecta**: Verificar DATABASE_URL
4. **Variáveis não carregam**: Verificar nomes

### Contatos:
- **Email**: gustavo@descarte-certo.com
- **GitHub Issues**: [Criar Issue](https://github.com/GustavoSauder/Descarte-Certo/issues)
- **Vercel Support**: [Documentação](https://vercel.com/docs)

---

## ✅ Checklist Final

- [ ] Projeto builda localmente
- [ ] Supabase configurado
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy realizado com sucesso
- [ ] Funcionalidades testadas
- [ ] PWA funcionando
- [ ] Mobile responsivo
- [ ] Performance OK
- [ ] SSL ativo
- [ ] Monitoramento configurado

**Status**: 🚀 Pronto para produção!  
**URL**: `https://seu-projeto.vercel.app` 