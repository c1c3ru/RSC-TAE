# Melhorar Template de Email de Confirmação

## Problema Atual
O email de confirmação atual está em inglês e com texto básico:
```
<h2>Confirm your signup</h2>
<p>Follow this link to confirm your user:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your mail</a></p>
```

## Solução Proposta

### 1. Acessar Supabase Dashboard
1. Faça login no [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá para **Authentication** > **Email Templates**

### 2. Template Melhorado para Confirmação de Email

**Assunto do Email:**
```
Confirme seu cadastro - Sistema RSC TAE
```

**Conteúdo HTML:**
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmação de Cadastro - Sistema RSC TAE</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .container {
            background-color: #ffffff;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #e9ecef;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #1e40af;
            margin-bottom: 10px;
        }
        .subtitle {
            color: #6c757d;
            font-size: 16px;
        }
        .content {
            margin-bottom: 30px;
        }
        .title {
            color: #1e40af;
            font-size: 22px;
            font-weight: bold;
            margin-bottom: 20px;
            text-align: center;
        }
        .message {
            font-size: 16px;
            margin-bottom: 25px;
            text-align: justify;
        }
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            font-size: 16px;
            text-align: center;
            margin: 20px 0;
            transition: all 0.3s ease;
            box-shadow: 0 4px 6px rgba(30, 64, 175, 0.2);
        }
        .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(30, 64, 175, 0.3);
        }
        .button-container {
            text-align: center;
            margin: 30px 0;
        }
        .info-box {
            background-color: #f8f9fa;
            border-left: 4px solid #1e40af;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
        }
        .info-title {
            font-weight: bold;
            color: #1e40af;
            margin-bottom: 10px;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
            color: #6c757d;
            font-size: 14px;
        }
        .warning {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 5px;
            padding: 15px;
            margin: 20px 0;
        }
        .warning-title {
            color: #856404;
            font-weight: bold;
            margin-bottom: 8px;
        }
        .warning-text {
            color: #856404;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Sistema RSC TAE</div>
            <div class="subtitle">Progressão Funcional</div>
        </div>
        
        <div class="content">
            <h1 class="title">Confirme seu Cadastro</h1>
            
            <p class="message">
                Olá! Obrigado por se cadastrar no Sistema de Cálculo de Pontuação para Progressão Funcional (RSC TAE). 
                Para ativar sua conta e começar a registrar suas atividades, é necessário confirmar seu endereço de e-mail.
            </p>
            
            <div class="button-container">
                <a href="{{ .ConfirmationURL }}" class="button">
                    Confirmar Meu E-mail
                </a>
            </div>
            
            <div class="info-box">
                <div class="info-title">📧 O que acontece após a confirmação?</div>
                <ul style="margin: 10px 0; padding-left: 20px;">
                    <li>Sua conta será ativada automaticamente</li>
                    <li>Você poderá fazer login no sistema</li>
                    <li>Começará a registrar suas atividades acadêmicas e profissionais</li>
                    <li>Terá acesso ao dashboard com suas pontuações</li>
                </ul>
            </div>
            
            <div class="warning">
                <div class="warning-title">⚠️ Importante:</div>
                <div class="warning-text">
                    • Este link é válido por 24 horas<br>
                    • Se não conseguir clicar no botão, copie e cole o link no seu navegador<br>
                    • Verifique também sua pasta de spam/lixo eletrônico
                </div>
            </div>
            
            <p class="message">
                Se você não solicitou este cadastro, pode ignorar este e-mail com segurança.
            </p>
        </div>
        
        <div class="footer">
            <p><strong>Sistema RSC TAE</strong></p>
            <p>Sistema de Cálculo de Pontuação para Progressão Funcional</p>
            <p>© 2025 - Versão 1.0</p>
            <p style="font-size: 12px; margin-top: 10px;">
                Este é um e-mail automático, não responda a esta mensagem.
            </p>
        </div>
    </div>
</body>
</html>
```

### 3. Template para Recuperação de Senha

**Assunto do Email:**
```
Recuperação de Senha - Sistema RSC TAE
```

**Conteúdo HTML:**
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recuperação de Senha - Sistema RSC TAE</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .container {
            background-color: #ffffff;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #e9ecef;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #dc2626;
            margin-bottom: 10px;
        }
        .subtitle {
            color: #6c757d;
            font-size: 16px;
        }
        .content {
            margin-bottom: 30px;
        }
        .title {
            color: #dc2626;
            font-size: 22px;
            font-weight: bold;
            margin-bottom: 20px;
            text-align: center;
        }
        .message {
            font-size: 16px;
            margin-bottom: 25px;
            text-align: justify;
        }
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            font-size: 16px;
            text-align: center;
            margin: 20px 0;
            transition: all 0.3s ease;
            box-shadow: 0 4px 6px rgba(220, 38, 38, 0.2);
        }
        .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(220, 38, 38, 0.3);
        }
        .button-container {
            text-align: center;
            margin: 30px 0;
        }
        .info-box {
            background-color: #f8f9fa;
            border-left: 4px solid #dc2626;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
        }
        .info-title {
            font-weight: bold;
            color: #dc2626;
            margin-bottom: 10px;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
            color: #6c757d;
            font-size: 14px;
        }
        .warning {
            background-color: #fef2f2;
            border: 1px solid #fecaca;
            border-radius: 5px;
            padding: 15px;
            margin: 20px 0;
        }
        .warning-title {
            color: #dc2626;
            font-weight: bold;
            margin-bottom: 8px;
        }
        .warning-text {
            color: #dc2626;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Sistema RSC TAE</div>
            <div class="subtitle">Progressão Funcional</div>
        </div>
        
        <div class="content">
            <h1 class="title">Recuperação de Senha</h1>
            
            <p class="message">
                Olá! Recebemos uma solicitação para redefinir a senha da sua conta no Sistema RSC TAE. 
                Se você fez essa solicitação, clique no botão abaixo para criar uma nova senha.
            </p>
            
            <div class="button-container">
                <a href="{{ .ConfirmationURL }}" class="button">
                    Redefinir Minha Senha
                </a>
            </div>
            
            <div class="info-box">
                <div class="info-title">🔐 Segurança da sua conta:</div>
                <ul style="margin: 10px 0; padding-left: 20px;">
                    <li>Escolha uma senha forte com pelo menos 8 caracteres</li>
                    <li>Use uma combinação de letras, números e símbolos</li>
                    <li>Não compartilhe sua senha com outras pessoas</li>
                    <li>Use senhas diferentes para cada serviço</li>
                </ul>
            </div>
            
            <div class="warning">
                <div class="warning-title">⚠️ Importante:</div>
                <div class="warning-text">
                    • Este link é válido por 1 hora<br>
                    • Se você não solicitou esta recuperação, ignore este e-mail<br>
                    • Verifique também sua pasta de spam/lixo eletrônico
                </div>
            </div>
            
            <p class="message">
                Se você não solicitou a recuperação de senha, sua conta permanece segura e você pode ignorar este e-mail.
            </p>
        </div>
        
        <div class="footer">
            <p><strong>Sistema RSC TAE</strong></p>
            <p>Sistema de Cálculo de Pontuação para Progressão Funcional</p>
            <p>© 2025 - Versão 1.0</p>
            <p style="font-size: 12px; margin-top: 10px;">
                Este é um e-mail automático, não responda a esta mensagem.
            </p>
        </div>
    </div>
</body>
</html>
```

### 4. Passos para Implementação

1. **Acesse o Supabase Dashboard**
2. **Vá para Authentication > Email Templates**
3. **Selecione "Confirm signup"**
4. **Cole o template HTML melhorado**
5. **Clique em "Save"**
6. **Repita o processo para "Reset password"**

### 5. Benefícios da Melhoria

- ✅ **Profissionalismo**: Design moderno e institucional
- ✅ **Clareza**: Instruções claras em português
- ✅ **Segurança**: Informações sobre segurança da conta
- ✅ **Responsivo**: Funciona bem em dispositivos móveis
- ✅ **Branding**: Identidade visual do sistema RSC TAE
- ✅ **Acessibilidade**: Cores e contrastes adequados

### 6. Variáveis Disponíveis

O Supabase disponibiliza as seguintes variáveis para uso nos templates:
- `{{ .ConfirmationURL }}` - Link de confirmação
- `{{ .Email }}` - Email do usuário
- `{{ .TokenHash }}` - Hash do token
- `{{ .Token }}` - Token de confirmação

### 7. Teste

Após implementar, teste o envio de emails:
1. Crie uma conta de teste
2. Verifique se o email chega com o novo design
3. Teste o link de confirmação
4. Teste a recuperação de senha 