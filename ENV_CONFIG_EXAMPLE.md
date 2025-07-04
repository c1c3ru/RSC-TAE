# Configuração de Ambiente - Exemplo

## Para resolver o problema do login Google redirecionando para localhost

### ⚠️ IMPORTANTE: Estas são URLs da SUA aplicação (frontend), não do Supabase!

### 1. Crie um arquivo `.env.local` na raiz do projeto:

```env
# URL para desenvolvimento (substitua pela porta que você está usando)
VITE_DEVELOPMENT_URL=http://localhost:5175

# URL para produção (substitua pelo seu domínio real)
VITE_PRODUCTION_URL=https://seu-site.com
```

### 1.1. Ou configure diretamente no código (solução mais simples):

Edite o arquivo `src/config/environment.js` e substitua a linha:

```javascript
// Mude esta linha:
: (import.meta.env.VITE_DEVELOPMENT_URL || 'http://localhost:5175');

// Para a porta que você está usando atualmente
// Exemplo: se estiver rodando na porta 5176, mude para:
: (import.meta.env.VITE_DEVELOPMENT_URL || 'http://localhost:5176');
```

### 2. Ou configure diretamente no código:

Se preferir não usar arquivos .env, você pode modificar o arquivo `src/config/environment.js`:

```javascript
export const getRedirectUrl = (path) => {
  // Configure aqui a URL que você quer usar
  const baseUrl = 'http://localhost:5173'; // ou sua URL de produção
  
  return `${baseUrl}${path}`;
};
```

### 3. Configurar no Supabase Dashboard:

No painel do Supabase, vá em **Authentication > URL Configuration** e adicione:

**URLs de Redirecionamento:**
- `http://localhost:5175/dashboard` (desenvolvimento)
- `https://seu-site.com/dashboard` (produção)

**URLs do Site:**
- `http://localhost:5175` (desenvolvimento)
- `https://seu-site.com` (produção)

### 4. Reiniciar o servidor:

Após criar o arquivo `.env.local`, reinicie o servidor de desenvolvimento:

```bash
npm run dev
```

## 🔄 Como Funciona o Fluxo de Autenticação

1. **Usuário clica em "Login com Google"**
2. **Google redireciona para:** `https://nndkowmwzxfbonbldzsc.supabase.co/auth/v1/callback`
3. **Supabase processa a autenticação**
4. **Supabase redireciona para:** `http://localhost:5175/dashboard` (sua aplicação)

## 📋 Resumo das URLs

- **Supabase (Backend):** `https://nndkowmwzxfbonbldzsc.supabase.co` ✅ Já configurado
- **Sua Aplicação (Frontend):** `http://localhost:5175` ← Esta é a que configuramos
- **Redirecionamento:** Da aplicação Supabase para sua aplicação

## Resultado

Agora o login com Google redirecionará para a URL da SUA aplicação configurada, independente de ser localhost ou não. 