# Sistema de Competências RSC-TAE

Sistema web para registro, pontuação e acompanhamento de atividades para Reconhecimento de Saberes e Competências dos Técnico-Administrativos em Educação (RSC-TAE).

## Funcionalidades

- **Cadastro de usuário** com campos obrigatórios: nome, e-mail, matrícula, cargo e escolaridade.
- **Login seguro** (e-mail/senha ou Google).
- **Edição de perfil**: usuário pode atualizar nome, cargo e escolaridade a qualquer momento.
- **Registro de atividades** por categoria, com seleção de competência, quantidade, datas e upload obrigatório de documento comprobatório.
- **Upload de documentos** para o Supabase Storage, com visualização e remoção.
- **Dashboard**:
  - Exibe pontuação total, média por atividade, distribuição por categoria (gráfico radar) e lista de atividades.
  - Checagem automática dos requisitos para cada nível do RSC-TAE (pontuação, itens distintos e escolaridade), mostrando se o usuário está apto para cada nível.
- **Exclusão de atividades** com confirmação e feedback visual.
- **Navegação moderna** com menu lateral (Sidebar), responsivo e intuitivo.
- **Experiência de usuário aprimorada**: feedbacks visuais, loaders, mensagens de sucesso/erro, skeleton loaders.

## Estrutura do Projeto

```
├── src/
│   ├── App.jsx                # Rotas e layout principal
│   ├── main.jsx               # Entry point
│   ├── index.css              # Estilos globais (Tailwind)
│   ├── components/            # Componentes reutilizáveis (Dashboard, Formulários, Layout)
│   ├── context/               # Contextos globais (Auth, Competency, Layout)
│   ├── pages/                 # Páginas principais (Login, Dashboard, Cadastro, Perfil)
│   ├── services/              # Integração com Supabase
│   ├── utils/                 # Utilitários
│   └── constants/             # Textos centralizados
├── public/                    # Assets estáticos
├── database/                  # Scripts SQL do banco
├── README.md                  # Documentação
```

## Como rodar o projeto

1. Instale as dependências:
   ```bash
   pnpm install
   # ou npm install
   ```
2. Configure o Supabase e o banco de dados conforme o arquivo `database/setup.sql`.
3. Inicie o servidor de desenvolvimento:
   ```bash
   pnpm run dev
   # ou npm run dev
   ```
4. Acesse em [http://localhost:5173](http://localhost:5173)

## Tecnologias
- React 18
- Vite
- TailwindCSS
- Supabase (Auth, Storage, Database)
- ESLint
- Javascript

## Observações
- O sistema segue a metodologia do RSC-TAE, com checagem automática dos requisitos para cada nível.
- O campo escolaridade é obrigatório e pode ser editado no perfil.
- O upload de documentos é obrigatório para registro de atividades.
- O sistema é responsivo e preparado para uso em dispositivos móveis e desktop.

---
Para dúvidas ou sugestões, entre em contato com a equipe de desenvolvimento.
