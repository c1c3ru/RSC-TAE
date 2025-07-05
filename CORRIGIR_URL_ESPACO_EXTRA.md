# 🔧 Corrigir Espaço Extra na URL de Redirecionamento

## Problema Identificado
O Supabase está retornando erro:
```
parse " https://rsc-tae.vercel.app/dashboard": first path segment in URL cannot contain colon
```

**Causa:** Há um espaço extra antes de `https://` na URL de redirecionamento.

## 🚨 **CORREÇÃO URGENTE NO SUPABASE DASHBOARD**

### 1. Acesse o Supabase Dashboard
1. Vá para: https://supabase.com/dashboard/project/nndkowmwzxfbonbldzsc
2. Faça login na sua conta

### 2. Configure as URLs CORRETAMENTE (sem espaços)

**Vá em: Authentication > URL Configuration**

#### URLs de Redirecionamento (Redirect URLs):
**IMPORTANTE:** Copie e cole exatamente estas URLs (sem espaços extras):
```
https://rsc-tae.vercel.app/dashboard
http://localhost:5173/dashboard
```

#### URLs do Site (Site URLs):
**IMPORTANTE:** Copie e cole exatamente estas URLs (sem espaços extras):
```
https://rsc-tae.vercel.app
http://localhost:5173
```

## ⚠️ **PONTOS CRÍTICOS:**

1. **NÃO adicione espaços** antes ou depois das URLs
2. **Copie e cole exatamente** as URLs acima
3. **Verifique se não há caracteres invisíveis**
4. **Salve as configurações** após a correção

## 🔍 **COMO VERIFICAR:**

1. **No Supabase Dashboard:**
   - Vá em Authentication > URL Configuration
   - Verifique se as URLs estão exatamente como mostrado acima
   - Não deve haver espaços extras

2. **Teste novamente:**
   - Acesse https://rsc-tae.vercel.app/
   - Tente fazer login com Google
   - Verifique se o redirecionamento funciona

## 🚀 **PRÓXIMOS PASSOS:**

1. **Corrija as URLs no Supabase Dashboard** (passo mais importante)
2. **Remova qualquer espaço extra**
3. **Salve as configurações**
4. **Teste o login novamente**

## 📋 **CHECKLIST DE VERIFICAÇÃO:**

- [ ] URLs sem espaços extras
- [ ] URLs copiadas exatamente como mostrado
- [ ] Configurações salvas
- [ ] Login testado novamente

## 🎯 **RESULTADO ESPERADO:**

Após a correção, o erro deve desaparecer e o redirecionamento deve funcionar perfeitamente.

**O login já está funcionando - só precisamos corrigir o redirecionamento!** 