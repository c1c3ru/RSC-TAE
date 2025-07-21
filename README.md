# Sistema de Competências RSC-TAE

Sistema web para registro, pontuação e acompanhamento de atividades para o Reconhecimento de Saberes e Competências dos Técnico-Administrativos em Educação (RSC-TAE).

![Logo IFCE](src/assets/images/ifce.png)

## Visão Geral

O **RSC-TAE** é uma plataforma digital desenvolvida para facilitar o processo de progressão funcional dos servidores técnico-administrativos em educação, conforme as diretrizes do RSC-TAE. O sistema permite o cadastro, acompanhamento e validação de atividades, pontuação e requisitos para cada nível, tornando o processo mais transparente, ágil e seguro.

## Funcionalidades Principais

- **Cadastro e autenticação de usuários** (e-mail institucional ou Google)
- **Edição de perfil**: atualização de dados pessoais, cargo e escolaridade
- **Registro de atividades**: seleção de categoria, competência, datas, quantidade e upload obrigatório de documentos comprobatórios
- **Upload seguro de documentos** para o Supabase Storage
- **Dashboard completo**:
  - Pontuação total e média
  - Distribuição por categoria (gráfico)
  - Lista de atividades cadastradas
  - Checagem automática dos requisitos para cada nível do RSC-TAE (pontuação, itens distintos e escolaridade)
  - Indicação visual de aptidão para cada nível
- **Exclusão de atividades** com confirmação
- **Navegação moderna e responsiva** (menu lateral, mobile first)
- **Feedback visual**: loaders, mensagens de sucesso/erro, skeleton loaders
- **Segurança**: autenticação Supabase, validação de email, rate limiting

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
│   └── constants/             # Textos centralizados, cargos, etc.
├── public/                    # Assets estáticos
├── database/                  # Scripts SQL do banco
├── README.md                  # Documentação
```

## Instalação e Execução

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/c1c3ru/RSC-TAE.git
   cd RSC-TAE
   ```
2. **Instale as dependências:**
   ```bash
   pnpm install
   # ou npm install
   ```
3. **Configure o Supabase:**
   - Crie um projeto no [Supabase](https://supabase.com/)
   - Configure as variáveis de ambiente conforme o exemplo em `ENV_CONFIG_EXAMPLE.md`
   - Execute o script SQL em `database/setup.sql` para criar as tabelas necessárias
4. **Inicie o servidor de desenvolvimento:**
   ```bash
   pnpm run dev
   # ou npm run dev
   ```
5. **Acesse o sistema:**
   [http://localhost:5173](http://localhost:5173)

## Tecnologias Utilizadas
- [React 18](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [Supabase (Auth, Storage, Database)](https://supabase.com/)
- [ESLint](https://eslint.org/)
- Javascript/Typescript

## Diferenciais
- **Integração total com Supabase** (auth, storage, banco)
- **UX moderna e responsiva**
- **Validação automática dos requisitos do RSC-TAE**
- **Código limpo, modular e documentado**
- **Pronto para deploy em Vercel, Netlify ou similar**

## Contribuição
Pull requests são bem-vindos! Sinta-se à vontade para abrir issues ou sugerir melhorias.

## Licença
Este projeto é open-source e está sob a licença GNU.

---

### Autoria & Contato
Desenvolvido por **c1c3ru** (<a href="mailto:cicero.silva@ifce.edu.br">cicero.silva@ifce.edu.br</a>)

<img src="src/assets/images/ifce.png" alt="Logo IFCE" width="60" />

Sistema desenvolvido no âmbito do IFCE — Instituto Federal do Ceará.
