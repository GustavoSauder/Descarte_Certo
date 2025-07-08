# Troubleshooting Google OAuth

## Problemas Comuns e Soluções

### 1. Erro: "redirect_uri_mismatch"

**Sintoma:** O Google retorna erro de URL de redirecionamento não correspondente.

**Solução:**
1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Vá para **APIs & Services** > **Credentials**
3. Clique no seu OAuth 2.0 Client ID
4. Em **Authorized redirect URIs**, adicione:
   ```
   https://nxqomjncwxtcxcdzlpix.supabase.co/auth/v1/callback
   ```
5. Clique em **Save**

### 2. Erro: "invalid_client"

**Sintoma:** Erro de cliente inválido.

**Solução:**
1. Verifique se o **Client ID** e **Client Secret** estão corretos no Supabase
2. Acesse [Supabase Dashboard](https://app.supabase.com)
3. Vá para **Authentication** > **Providers** > **Google**
4. Cole o Client ID e Secret corretos
5. Clique em **Save**

### 3. Erro: "access_denied"

**Sintoma:** Acesso negado pelo Google.

**Solução:**
1. No Google Cloud Console, adicione os domínios autorizados:
   ```
   http://localhost:3000
   http://localhost:5173
   https://seu-dominio.com
   ```

### 4. Botão Google não funciona

**Sintoma:** Clicar no botão não faz nada.

**Solução:**
1. Abra o console do navegador (F12)
2. Vá para a aba **Console**
3. Execute o script de teste:
   ```javascript
   // Cole o conteúdo de test-google-auth.js no console
   ```
4. Verifique se há erros

### 5. Redirecionamento não funciona

**Sintoma:** Após login, não redireciona corretamente.

**Solução:**
1. Verifique se a URL de redirecionamento está correta no código:
   ```javascript
   redirectTo: `${window.location.origin}/dashboard`
   ```
2. Teste com URL absoluta:
   ```javascript
   redirectTo: 'http://localhost:3000/dashboard'
   ```

## Como Testar

### 1. Usar o Debug Component
- Clique no botão 🐛 no canto inferior direito
- Verifique o status da sessão
- Use o botão "Test Google Auth"

### 2. Console do Navegador
1. Abra o console (F12)
2. Cole o script `test-google-auth.js`
3. Execute `testGoogleAuth()`

### 3. Verificar Configuração
```javascript
// No console do navegador
console.log('Supabase URL:', supabase.supabaseUrl);
console.log('Supabase Key:', supabase.supabaseKey ? 'OK' : 'MISSING');
```

## Checklist de Configuração

### Supabase Dashboard
- [ ] Google provider habilitado
- [ ] Client ID configurado
- [ ] Client Secret configurado
- [ ] Redirect URL: `https://nxqomjncwxtcxcdzlpix.supabase.co/auth/v1/callback`

### Google Cloud Console
- [ ] OAuth 2.0 Client ID criado
- [ ] Authorized JavaScript origins:
  - [ ] `http://localhost:3000`
  - [ ] `http://localhost:5173`
  - [ ] `https://seu-dominio.com`
- [ ] Authorized redirect URIs:
  - [ ] `https://nxqomjncwxtcxcdzlpix.supabase.co/auth/v1/callback`

### Código
- [ ] Supabase client configurado
- [ ] Google OAuth chamada correta
- [ ] Tratamento de erros implementado

## Logs Úteis

### Console do Navegador
```javascript
// Verificar se Supabase está carregado
console.log('Supabase:', typeof supabase !== 'undefined');

// Verificar configuração
console.log('URL:', supabase.supabaseUrl);
console.log('Key:', supabase.supabaseKey ? 'OK' : 'MISSING');

// Testar login
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: { redirectTo: window.location.origin + '/dashboard' }
});
console.log('Result:', { data, error });
```

### Network Tab
1. Abra DevTools (F12)
2. Vá para aba **Network**
3. Clique no botão Google
4. Verifique as requisições para:
   - `supabase.co`
   - `accounts.google.com`

## Contatos de Suporte

- **Supabase:** [Discord](https://discord.supabase.com)
- **Google Cloud:** [Documentação](https://developers.google.com/identity/protocols/oauth2)
- **Projeto:** Verificar issues no GitHub 