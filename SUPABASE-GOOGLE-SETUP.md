# Configuração do Google OAuth no Supabase

## 1. Configurar Google OAuth no Supabase Dashboard

### Passo 1: Acessar o Supabase Dashboard
1. Vá para [supabase.com](https://supabase.com)
2. Faça login na sua conta
3. Selecione seu projeto: `nxqomjncwxtcxcdzlpix`

### Passo 2: Configurar Authentication
1. No menu lateral, clique em **Authentication**
2. Clique em **Providers**
3. Procure por **Google** e clique em **Enable**

### Passo 3: Configurar Google OAuth
1. **Client ID**: `[SEU_GOOGLE_CLIENT_ID]`
2. **Client Secret**: `[SEU_GOOGLE_CLIENT_SECRET]`
3. **Redirect URL**: `https://nxqomjncwxtcxcdzlpix.supabase.co/auth/v1/callback`

## 2. Criar Google OAuth Credentials

### Passo 1: Google Cloud Console
1. Acesse [console.cloud.google.com](https://console.cloud.google.com)
2. Crie um novo projeto ou selecione um existente
3. Vá para **APIs & Services** > **Credentials**

### Passo 2: Criar OAuth 2.0 Client
1. Clique em **Create Credentials** > **OAuth 2.0 Client IDs**
2. Selecione **Web application**
3. Configure:
   - **Name**: `Descarte Certo Supabase`
   - **Authorized JavaScript origins**:
     - `http://localhost:3000`
     - `http://localhost:5173`
     - `https://seu-dominio.com`
   - **Authorized redirect URIs**:
     - `https://nxqomjncwxtcxcdzlpix.supabase.co/auth/v1/callback`

### Passo 3: Copiar Credentials
1. Anote o **Client ID** e **Client Secret**
2. Cole no Supabase Dashboard

## 3. Configurar URLs de Redirecionamento

### URLs Autorizadas no Google Console:
```
http://localhost:3000
http://localhost:5173
https://seu-dominio.com
```

### URLs de Redirecionamento no Google Console:
```
https://nxqomjncwxtcxcdzlpix.supabase.co/auth/v1/callback
```

## 4. Testar a Configuração

### Verificar se está funcionando:
1. Abra o console do navegador
2. Vá para a página de login
3. Clique no botão "Google"
4. Verifique se redireciona para o Google
5. Após login, deve redirecionar de volta

## 5. Troubleshooting

### Erro: "redirect_uri_mismatch"
- Verifique se a URL de redirecionamento está correta no Google Console
- Deve ser exatamente: `https://nxqomjncwxtcxcdzlpix.supabase.co/auth/v1/callback`

### Erro: "invalid_client"
- Verifique se o Client ID e Secret estão corretos no Supabase
- Certifique-se de que o projeto está ativo no Google Console

### Erro: "access_denied"
- Verifique se o domínio está autorizado no Google Console
- Adicione `localhost` para desenvolvimento local

## 6. Configuração Final

### Variáveis de Ambiente (se necessário):
```env
VITE_SUPABASE_URL=https://nxqomjncwxtcxcdzlpix.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Código de Teste:
```javascript
// Testar login com Google
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/dashboard`
  }
});

if (error) {
  console.error('Erro no login:', error);
} else {
  console.log('Login iniciado com sucesso');
}
```

## 7. Próximos Passos

1. ✅ Configurar Google OAuth no Supabase
2. ✅ Criar credentials no Google Console
3. ✅ Testar login
4. ✅ Configurar redirecionamentos
5. ✅ Implementar tratamento de erros
6. ✅ Adicionar loading states
7. ✅ Testar em produção

## Links Úteis

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Supabase Dashboard](https://app.supabase.com)
- [Google Cloud Console](https://console.cloud.google.com) 