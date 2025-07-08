# Segurança, Políticas e Boas Práticas – Supabase

## 1. Políticas e Configurações Atuais

- **RLS (Row Level Security):** Ativado em todas as tabelas sensíveis.
- **Políticas de acesso:** Apenas o usuário dono pode acessar/modificar seus dados.
- **Confirmação de e-mail:** Ativada.
- **MFA (Autenticação em 2 fatores):** Ativada para administradores.
- **SMTP customizado:** (Configuração abaixo)
- **Backups:** Automatizados diariamente e script manual disponível.
- **Revisão de segurança:** Checklist e simulação de ataques simples.

---

## 2. Exemplos de Políticas RLS

### Tabela: `user_profile`
```sql
-- Permitir que o usuário só veja/edite seu próprio perfil
CREATE POLICY "Users can view their own profile" ON user_profile
  FOR SELECT USING (id = auth.uid());
CREATE POLICY "Users can update their own profile" ON user_profile
  FOR UPDATE USING (id = auth.uid());
```

### Tabela: `user_rsc` (atividades)
```sql
-- Permitir que o usuário só veja/edite/exclua suas próprias atividades
CREATE POLICY "Users can view their own activities" ON user_rsc
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert their own activities" ON user_rsc
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own activities" ON user_rsc
  FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete their own activities" ON user_rsc
  FOR DELETE USING (user_id = auth.uid());
```

---

## 3. Índices recomendados

- **user_profile:**
  - `CREATE INDEX idx_user_profile_email ON user_profile(email);`
- **user_rsc:**
  - `CREATE INDEX idx_user_rsc_user_id ON user_rsc(user_id);`
  - `CREATE INDEX idx_user_rsc_competence_id ON user_rsc(competence_id);`
  - `CREATE INDEX idx_user_rsc_date_awarded ON user_rsc(date_awarded);`
- **competences:**
  - `CREATE INDEX idx_competences_category ON competences(category);`

---

## 4. Configuração de SMTP customizado

1. Crie uma conta em um provedor (ex: SendGrid, AWS SES, Mailgun).
2. No Supabase Dashboard, vá em **Auth > Settings > SMTP**.
3. Preencha:
   - Host: `smtp.seudominio.com`
   - Port: `587` (ou `465` para SSL)
   - Username: `usuario@seudominio.com`
   - Password: `SENHA`
   - Sender email: `no-reply@seudominio.com`
4. Salve e teste o envio de e-mails.

---

## 5. Script de backup automatizado

Exemplo usando `pg_dump` (agende via cron):
```bash
#!/bin/bash
DATA=$(date +%Y-%m-%d_%H-%M)
pg_dump --dbname=postgresql://USUARIO:SENHA@HOST:PORT/DBNAME \
  --file=/caminho/para/backups/backup_$DATA.sql \
  --format=custom --blobs --verbose
```
- **Dica:** Use variáveis de ambiente para não expor senhas.
- **Restaurar:**
```bash
pg_restore --dbname=postgresql://USUARIO:SENHA@HOST:PORT/DBNAME /caminho/para/backup_xxx.sql
```

---

## 6. Checklist de Revisão de Segurança (periódica)

- [ ] RLS ativado em todas as tabelas sensíveis
- [ ] Políticas revisadas e testadas (simule acesso de outro usuário)
- [ ] MFA ativo para todos administradores
- [ ] SMTP customizado funcionando
- [ ] Backups automáticos e restauração testada
- [ ] Índices criados para queries mais comuns
- [ ] Testes de carga realizados
- [ ] Monitoramento de uso e alertas configurados
- [ ] Revisão de logs de acesso e erros

---

## 7. Simulação de Ataques Simples

- **Teste 1:** Tentar acessar/editar dados de outro usuário via API ou SQL.
- **Teste 2:** Tentar inserir atividade com outro `user_id`.
- **Teste 3:** Tentar deletar atividade de outro usuário.
- **Resultado esperado:** Acesso negado em todos os casos.

---

**Mantenha este arquivo atualizado a cada alteração de política ou configuração importante!** 