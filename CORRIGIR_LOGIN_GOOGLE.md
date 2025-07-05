# 🔧 Como Corrigir o Erro de Redirecionamento do Login Google

## Problema Identificado
O login com Google está redirecionando para `http://localhost:3000` em vez da URL correta da sua aplicação.

## ✅ Soluções Implementadas

### 1. Configuração de URLs Corrigida
O arquivo `src/config/environment.js` foi atualizado com as URLs corretas:
- **Desenvolvimento:** `http://localhost:5173`
- **Produção:** `https://rsc-tae.vercel.app`

### 2. Configuração no Supabase Dashboard

**IMPORTANTE:** Você precisa configurar as URLs no painel do Supabase:

1. Acesse: https://supabase.com/dashboard/project/nndkowmwzxfbonbldzsc
2. Vá em **Authentication > URL Configuration**
3. Configure as seguintes URLs:

**URLs de Redirecionamento:**
```
http://localhost:5173/dashboard
https://rsc-tae.vercel.app/dashboard
```

**URLs do Site:**
```
http://localhost:5173
https://rsc-tae.vercel.app
```

### 3. Configuração no Google Cloud Console

1. Acesse: https://console.cloud.google.com/
2. Vá em **APIs & Services > Credentials**
3. Edite seu OAuth 2.0 Client ID
4. Adicione nas **Authorized redirect URIs**:
```
https://nndkowmwzxfbonbldzsc.supabase.co/auth/v1/callback
https://rsc-tae.vercel.app/auth/callback
```

## 🚀 Próximos Passos

1. **Configure as URLs no Supabase Dashboard** (passo mais importante)
2. **Configure as URLs no Google Cloud Console**
3. **Faça commit das mudanças:**
   ```bash
   git add src/config/environment.js
   git commit -m "Corrige URLs de redirecionamento do login Google"
   git push
   ```
4. **Teste o login novamente**

## 🔍 Verificação

Após as configurações, o fluxo deve ser:
1. Usuário clica "Login com Google"
2. Google redireciona para Supabase
3. Supabase processa autenticação
4. Supabase redireciona para `https://rsc-tae.vercel.app/dashboard`

## 📞 Suporte

Se o problema persistir, verifique:
- Se as URLs estão configuradas corretamente no Supabase
- Se as URLs estão configuradas no Google Cloud Console
- Se o domínio `rsc-tae.vercel.app` está correto 