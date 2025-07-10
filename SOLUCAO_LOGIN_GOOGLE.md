# 🔧 Solução para Problemas do Login Google

## 🚨 **PROBLEMA IDENTIFICADO**
O login com Google não está funcionando corretamente. Implementei melhorias para debug e tratamento de erros.

## ✅ **MELHORIAS IMPLEMENTADAS**

### 1. Logs de Debug Detalhados
- Adicionados logs no `AuthContext.tsx` para monitorar todo o processo
- Logs específicos para diferentes tipos de erro
- Detecção automática do ambiente (Vercel/Local)

### 2. Tratamento de Erros Específicos
- "Invalid redirect URL" → Configuração incorreta no Supabase
- "Provider not configured" → Google OAuth não ativado
- "Client ID not found" → Credenciais do Google incorretas

### 3. Componente de Debug
- Botão de debug visível apenas em desenvolvimento
- Informações detalhadas sobre ambiente e configuração
- Teste direto do login Google

## 🔍 **COMO IDENTIFICAR O PROBLEMA**

### 1. Abra o Console do Navegador (F12)
### 2. Procure por logs que começam com 🔍:
```
🔍 Debug - Iniciando login com Google
🔍 Debug - URL atual: https://rsc-tae.vercel.app/
🔍 Debug - Ambiente Vercel detectado
🔍 Debug - URL de redirecionamento: https://rsc-tae.vercel.app/dashboard
```

### 3. Possíveis Mensagens de Erro:
- `URL de redirecionamento inválida` → Configurar URLs no Supabase
- `Google OAuth não está configurado` → Ativar provider no Supabase
- `Client ID do Google não encontrado` → Verificar credenciais

## 🛠️ **CONFIGURAÇÃO NECESSÁRIA**

### **PASSO 1: Configurar URLs no Supabase Dashboard**

1. Acesse: https://supabase.com/dashboard/project/nndkowmwzxfbonbldzsc
2. Vá em **Authentication > URL Configuration**
3. Configure:

**URLs de Redirecionamento:**
```
https://rsc-tae.vercel.app/dashboard
http://localhost:5173/dashboard
```

**URLs do Site:**
```
https://rsc-tae.vercel.app
http://localhost:5173
```

### **PASSO 2: Configurar Google OAuth no Supabase**

1. Vá em **Authentication > Providers > Google**
2. Ative o toggle do Google
3. Configure:
   - **Client ID:** (seu Google OAuth Client ID)
   - **Client Secret:** (seu Google OAuth Client Secret)

### **PASSO 3: Configurar no Google Cloud Console**

1. Acesse: https://console.cloud.google.com/
2. Vá em **APIs & Services > Credentials**
3. Edite seu OAuth 2.0 Client ID
4. **Authorized redirect URIs** deve conter:
```
https://nndkowmwzxfbonbldzsc.supabase.co/auth/v1/callback
```

## 🧪 **COMO TESTAR**

### 1. Teste em Desenvolvimento
```bash
npm run dev
```
- Abra http://localhost:5173
- Clique no botão "🐛 Debug Google" (canto inferior direito)
- Verifique as informações de debug
- Teste o login Google

### 2. Teste em Produção
- Acesse https://rsc-tae.vercel.app/
- Abra o console do navegador (F12)
- Tente fazer login com Google
- Verifique os logs de debug

## 🐛 **PROBLEMAS COMUNS E SOLUÇÕES**

### Problema 1: "Invalid redirect URL"
**Solução:** Verificar se as URLs estão exatamente iguais no Supabase Dashboard

### Problema 2: "Provider not configured"
**Solução:** Ativar o Google provider no Supabase

### Problema 3: "Client ID not found"
**Solução:** Verificar se o Client ID está correto no Supabase

### Problema 4: Redirecionamento para localhost
**Solução:** Verificar se a URL de redirecionamento está configurada corretamente

## 📋 **CHECKLIST DE VERIFICAÇÃO**

- [ ] URLs configuradas no Supabase Dashboard
- [ ] Google provider ativado no Supabase
- [ ] Client ID e Secret configurados no Supabase
- [ ] Redirect URI configurado no Google Cloud Console
- [ ] Testado em desenvolvimento
- [ ] Testado em produção
- [ ] Logs de debug verificados

## 🚀 **PRÓXIMOS PASSOS**

1. **Configure as URLs no Supabase Dashboard** (mais importante)
2. **Verifique a configuração do Google OAuth**
3. **Teste o login novamente**
4. **Verifique os logs de debug no console**

## 📞 **SUPORTE**

Se o problema persistir:
1. Verifique se todas as URLs estão corretas
2. Confirme se não há espaços extras
3. Teste em modo incógnito
4. Verifique se o domínio está correto
5. Use o componente de debug para obter mais informações

## 🔧 **CONFIGURAÇÃO ALTERNATIVA**

Se ainda houver problemas:
1. Desativar e reativar o Google provider no Supabase
2. Regenerar o Client Secret no Google Cloud Console
3. Verificar se há restrições de domínio no Google OAuth
4. Verificar se o projeto está ativo no Google Cloud Console 