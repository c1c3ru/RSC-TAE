# Instruções para Deploy e Configuração do Login Google

## Problema Resolvido ✅

O login com Google estava redirecionando para `localhost` porque a configuração usava `window.location.origin`, que em desenvolvimento aponta para `http://localhost:5173`.

## Configuração para Deploy

### 1. **Configurar Variável de Ambiente**

Crie um arquivo `.env` na raiz do projeto com:

```env
VITE_PRODUCTION_URL=https://seu-dominio-real.com
```

**Substitua `https://seu-dominio-real.com` pela URL real do seu site em produção.**

### 2. **Configurar Supabase Dashboard**

No painel do Supabase, vá em **Authentication > URL Configuration** e adicione:

**URLs de Redirecionamento:**
- `https://seu-dominio-real.com/dashboard`
- `https://seu-dominio-real.com/reset-password`
- `http://localhost:5173/dashboard` (para desenvolvimento)

**URLs do Site:**
- `https://seu-dominio-real.com`
- `http://localhost:5173` (para desenvolvimento)

### 3. **Configurar Google OAuth**

No Google Cloud Console:
1. Vá para **APIs & Services > Credentials**
2. Edite seu OAuth 2.0 Client ID
3. Adicione nas **Authorized redirect URIs**:
   - `https://nndkowmwzxfbonbldzsc.supabase.co/auth/v1/callback`
   - `https://seu-dominio-real.com/auth/callback`

### 4. **Build para Produção**

```bash
npm run build
```

### 5. **Deploy**

Faça upload da pasta `dist` para seu serviço de hospedagem:
- **Vercel:** Conecte o repositório e configure a variável de ambiente
- **Netlify:** Faça upload da pasta `dist` ou conecte o repositório
- **Firebase Hosting:** Use `firebase deploy`
- **GitHub Pages:** Configure o GitHub Actions

## Estrutura de Arquivos Modificados

- `src/config/environment.js` - Nova configuração de ambiente
- `src/context/AuthContext.jsx` - URLs de redirecionamento corrigidas
- `DEPLOY_INSTRUCTIONS.md` - Este arquivo

## Teste

Após o deploy:
1. Acesse sua URL de produção
2. Tente fazer login com Google
3. Verifique se o redirecionamento funciona corretamente

## Suporte

Se ainda houver problemas:
1. Verifique se a variável `VITE_PRODUCTION_URL` está configurada corretamente
2. Confirme se as URLs estão adicionadas no Supabase Dashboard
3. Verifique se o Google OAuth está configurado corretamente 