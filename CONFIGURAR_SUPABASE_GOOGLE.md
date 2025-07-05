# 🔧 Configuração Completa do Supabase para Login Google

## Problema Identificado
O Supabase não está reconhecendo o login com Google corretamente. O callback está chegando, mas há problemas na configuração.

## 🚨 **CONFIGURAÇÃO OBRIGATÓRIA NO SUPABASE**

### 1. Acesse o Supabase Dashboard
1. Vá para: https://supabase.com/dashboard/project/nndkowmwzxfbonbldzsc
2. Faça login na sua conta

### 2. Configure as URLs de Redirecionamento

**Vá em: Authentication > URL Configuration**

#### URLs de Redirecionamento (Redirect URLs):
```
https://rsc-tae.vercel.app/dashboard
http://localhost:5173/dashboard
```

#### URLs do Site (Site URLs):
```
https://rsc-tae.vercel.app
http://localhost:5173
```

### 3. Configure o Google OAuth

**Vá em: Authentication > Providers > Google**

1. **Ative o Google Provider** (toggle deve estar ON)
2. **Client ID:** (seu Google OAuth Client ID)
3. **Client Secret:** (seu Google OAuth Client Secret)

### 4. Configure no Google Cloud Console

1. Acesse: https://console.cloud.google.com/
2. Vá em **APIs & Services > Credentials**
3. Edite seu OAuth 2.0 Client ID
4. **Authorized redirect URIs** deve conter:
```
https://nndkowmwzxfbonbldzsc.supabase.co/auth/v1/callback
```

## 🔍 **VERIFICAÇÃO DA CONFIGURAÇÃO**

### Teste 1: Verificar URLs no Supabase
1. No Supabase Dashboard, vá em **Authentication > URL Configuration**
2. Confirme que as URLs estão exatamente como listadas acima
3. **IMPORTANTE:** Não deve haver espaços extras ou caracteres especiais

### Teste 2: Verificar Google OAuth
1. No Google Cloud Console, verifique se o redirect URI está correto
2. Confirme que o Client ID e Secret estão corretos no Supabase

### Teste 3: Testar o Fluxo
1. Acesse https://rsc-tae.vercel.app/
2. Abra o Console do Navegador (F12)
3. Tente fazer login com Google
4. Verifique os logs de debug

## 🐛 **DEBUG AVANÇADO**

### Logs para Verificar
No console do navegador, procure por:
```
🔍 Debug - URL de redirecionamento: https://rsc-tae.vercel.app/dashboard
🔍 Debug - Ambiente: PRODUÇÃO
🔍 Debug - É Vercel: true
```

### Possíveis Problemas e Soluções

#### Problema 1: "Invalid redirect URL"
**Solução:** Verifique se a URL está exatamente igual no Supabase Dashboard

#### Problema 2: "Provider not configured"
**Solução:** Ative o Google provider no Supabase

#### Problema 3: "Client ID not found"
**Solução:** Verifique se o Client ID está correto no Supabase

## 📋 **CHECKLIST DE CONFIGURAÇÃO**

- [ ] URLs de redirecionamento configuradas no Supabase
- [ ] URLs do site configuradas no Supabase
- [ ] Google provider ativado no Supabase
- [ ] Client ID e Secret configurados no Supabase
- [ ] Redirect URI configurado no Google Cloud Console
- [ ] Aplicação testada em produção

## 🚀 **PRÓXIMOS PASSOS**

1. **Configure as URLs no Supabase Dashboard** (passo mais importante)
2. **Verifique a configuração do Google OAuth**
3. **Teste o login novamente**
4. **Verifique os logs de debug no console**

## 📞 **SUPORTE**

Se o problema persistir após a configuração:
1. Verifique se todas as URLs estão corretas
2. Confirme se não há espaços extras
3. Teste em modo incógnito
4. Verifique se o domínio está correto

## 🔧 **CONFIGURAÇÃO ALTERNATIVA**

Se ainda houver problemas, você pode tentar:
1. Desativar e reativar o Google provider no Supabase
2. Regenerar o Client Secret no Google Cloud Console
3. Verificar se há restrições de domínio no Google OAuth 