# 🔧 Diagnóstico do Erro 500 do Supabase

## Problema Identificado
O callback do Google está chegando ao Supabase, mas retorna erro 500. Isso indica problema no lado do servidor.

## 🔍 **DIAGNÓSTICO PASSO A PASSO**

### 1. Verificar Logs do Supabase
1. Acesse: https://supabase.com/dashboard/project/nndkowmwzxfbonbldzsc
2. Vá em **Logs > Auth Logs**
3. Procure por erros relacionados ao Google OAuth
4. Verifique se há erros de configuração

### 2. Verificar Configuração do Google OAuth
1. No Supabase Dashboard, vá em **Authentication > Providers > Google**
2. Confirme que:
   - ✅ Provider está ativado
   - ✅ Client ID está correto
   - ✅ Client Secret está correto
   - ✅ Não há espaços extras

### 3. Verificar URLs de Redirecionamento
1. Vá em **Authentication > URL Configuration**
2. Confirme que as URLs estão **exatamente** assim:

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

### 4. Verificar Google Cloud Console
1. Acesse: https://console.cloud.google.com/
2. Vá em **APIs & Services > Credentials**
3. Edite seu OAuth 2.0 Client ID
4. **Authorized redirect URIs** deve conter:
```
https://nndkowmwzxfbonbldzsc.supabase.co/auth/v1/callback
```

## 🚨 **POSSÍVEIS CAUSAS E SOLUÇÕES**

### Problema 1: Client Secret Inválido
**Sintomas:** Erro 500 no callback
**Solução:** 
1. Regenerar o Client Secret no Google Cloud Console
2. Atualizar no Supabase Dashboard

### Problema 2: URLs Mal Configuradas
**Sintomas:** Erro 500 ou "Invalid redirect URL"
**Solução:**
1. Verificar se não há espaços extras
2. Confirmar que as URLs estão exatamente iguais

### Problema 3: Provider Desativado
**Sintomas:** Erro 500 no callback
**Solução:**
1. Desativar e reativar o Google provider no Supabase
2. Salvar as configurações

### Problema 4: Restrições de Domínio
**Sintomas:** Erro 500 após autenticação
**Solução:**
1. Verificar se há restrições de domínio no Google OAuth
2. Adicionar o domínio se necessário

## 🔧 **SOLUÇÕES IMEDIATAS**

### Solução 1: Reconfigurar Google OAuth
1. No Supabase Dashboard, vá em **Authentication > Providers > Google**
2. Desative o provider (toggle OFF)
3. Salve as configurações
4. Ative novamente (toggle ON)
5. Cole o Client ID e Secret novamente
6. Salve

### Solução 2: Regenerar Credenciais Google
1. No Google Cloud Console, vá em **APIs & Services > Credentials**
2. Edite seu OAuth 2.0 Client ID
3. Clique em "Regenerate Secret"
4. Copie o novo Client Secret
5. Cole no Supabase Dashboard

### Solução 3: Verificar APIs Ativadas
1. No Google Cloud Console, vá em **APIs & Services > Library**
2. Confirme que estas APIs estão ativadas:
   - Google+ API
   - Google Identity and Access Management (IAM) API
   - Google OAuth2 API

## 🐛 **DEBUG AVANÇADO**

### Logs para Verificar
1. **Supabase Auth Logs:** Erros específicos do OAuth
2. **Google Cloud Console:** Logs de atividade
3. **Console do Navegador:** Erros JavaScript

### Teste de Configuração
Use o componente de teste em `/supabase-test` para verificar:
- Conexão com Supabase
- Configuração do Google OAuth
- URLs configuradas

## 📞 **SUPORTE SUPABASE**

Se o problema persistir:
1. Acesse: https://supabase.com/support
2. Crie um ticket com:
   - ID do projeto: nndkowmwzxfbonbldzsc
   - Descrição do erro 500
   - Logs de erro (se disponíveis)

## 🚀 **PRÓXIMOS PASSOS**

1. **Verifique os logs do Supabase** (passo mais importante)
2. **Reconfigure o Google OAuth** se necessário
3. **Teste novamente** o login
4. **Se persistir, entre em contato com o suporte**

## 📋 **CHECKLIST DE VERIFICAÇÃO**

- [ ] Logs do Supabase verificados
- [ ] Google OAuth reconfigurado
- [ ] URLs de redirecionamento corretas
- [ ] Client Secret regenerado (se necessário)
- [ ] APIs do Google ativadas
- [ ] Teste executado novamente 