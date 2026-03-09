# Guia de Configuração: Login OAuth com Facebook e Deploy no Easypanel

Este guia detalha os passos necessários para configurar o login OAuth com Facebook (e Instagram Business) para a aplicação PostaFácil, além de preparar e implantar o projeto no Easypanel.

## 1. Configuração do Aplicativo no Facebook Developers

Para que o login com Facebook e a conexão com contas do Instagram Business funcionem, você precisa criar e configurar um aplicativo na plataforma Facebook Developers.

### 1.1. Criar um Novo Aplicativo

1.  Acesse o [Facebook Developers](https://developers.facebook.com/) e faça login com sua conta.
2.  No painel, clique em **"Meus Aplicativos"** e depois em **"Criar Aplicativo"**.
3.  Escolha o tipo de aplicativo que melhor se adequa ao seu caso (geralmente **"Consumidor"** ou **"Empresa"** se você for gerenciar páginas de negócios).
4.  Preencha os detalhes solicitados, como nome de exibição do aplicativo e e-mail de contato.

### 1.2. Configurar Login do Facebook e Instagram Basic Display

Após criar o aplicativo, você precisará adicionar os produtos **"Login do Facebook"** e **"Instagram Basic Display"** (se quiser conectar contas do Instagram).

1.  No painel do seu aplicativo, na barra lateral esquerda, clique em **"Adicionar Produto"**.
2.  Encontre **"Login do Facebook"** e clique em **"Configurar"**.
3.  Repita o processo para **"Instagram Basic Display"**.

### 1.3. Configurações do Login do Facebook

1.  Na barra lateral esquerda, navegue até **"Login do Facebook" > "Configurações"**.
2.  Em **"URIs de Redirecionamento OAuth Válidos"**, adicione a URL de redirecionamento da sua aplicação. Esta URL é onde o Facebook enviará o usuário de volta após a autorização. Ela deve ser no formato `https://SEU_DOMINIO.com/connect-accounts`.
    *   **Exemplo:** `https://postagensfacilty.com/connect-accounts`
    *   **Importante:** Para desenvolvimento local, você pode adicionar `http://localhost:8080/connect-accounts`.
3.  Certifique-se de que as opções **"Login com HTTPS Obrigatório"** e **"Usar Modo Estrito para URIs de Redirecionamento"** estejam ativadas (recomendado para segurança).

### 1.4. Configurações Avançadas e Permissões (Escopos)

Para que a aplicação possa acessar as informações necessárias (páginas do Facebook, contas do Instagram Business), você precisará solicitar as seguintes permissões (scopes):

*   `instagram_basic`
*   `instagram_content_publish`
*   `pages_show_list`
*   `pages_read_engagement`
*   `business_management`

Você pode configurar isso em **"Login do Facebook" > "Configurações" > "Configurações Avançadas"** ou na seção **"Revisão do Aplicativo"** para solicitar acesso a essas permissões.

### 1.5. Obter Credenciais do Aplicativo

1.  Na barra lateral esquerda, vá para **"Configurações" > "Básico"**.
2.  Anote o **"ID do Aplicativo"** (META_APP_ID) e a **"Chave Secreta do Aplicativo"** (META_APP_SECRET). Você precisará dessas credenciais para configurar o Supabase.

## 2. Configuração do Supabase

O projeto utiliza o Supabase para autenticação e como backend para a Edge Function `instagram-oauth`. Você precisará configurar as variáveis de ambiente no seu projeto Supabase.

### 2.1. Variáveis de Ambiente para Edge Functions

As credenciais do Facebook (`META_APP_ID` e `META_APP_SECRET`) são usadas pela Edge Function `instagram-oauth` para se comunicar com a API do Facebook. Você deve configurá-las no seu projeto Supabase:

1.  Acesse o painel do seu projeto Supabase.
2.  Na barra lateral esquerda, vá para **"Edge Functions"**.
3.  Selecione a função `instagram-oauth`.
4.  Vá para a seção **"Environment Variables"** (Variáveis de Ambiente).
5.  Adicione as seguintes variáveis:
    *   `META_APP_ID`: Cole o ID do Aplicativo do Facebook que você obteve.
    *   `META_APP_SECRET`: Cole a Chave Secreta do Aplicativo do Facebook que você obteve.

### 2.2. Configuração de Provedores OAuth (Opcional, se usar Supabase Auth para login direto)

Embora este projeto use uma Edge Function para o fluxo OAuth do Instagram/Facebook Pages, se você quiser usar o login direto do Facebook via Supabase Auth (para autenticação de usuários, não para gerenciar páginas), você precisaria:

1.  No painel do Supabase, vá para **"Authentication" > "Providers"**.
2.  Ative o provedor **"Facebook"**.
3.  Insira o **"App ID"** e o **"App Secret"** do seu aplicativo Facebook.
4.  Adicione a URL de redirecionamento do Supabase (`https://<seu-projeto-id>.supabase.co/auth/v1/callback`) nas **"URIs de Redirecionamento OAuth Válidos"** no Facebook Developers, conforme descrito na seção 1.3.

## 3. Deploy no Easypanel

O projeto está configurado para ser implantado usando Docker, o que o torna compatível com o Easypanel. Você precisará dos arquivos `Dockerfile.nginx`, `nginx.conf`, `.env.production` e `docker-compose.yml` (opcional para deploy).

### 3.1. Estrutura de Arquivos para Deploy

Certifique-se de que os seguintes arquivos estejam na raiz do seu projeto antes de fazer o deploy:

*   `Dockerfile.nginx`: Define como a aplicação será construída e servida com Nginx.
*   `nginx.conf`: Configuração do servidor Nginx para servir os arquivos estáticos e lidar com o roteamento de SPA.
*   `.env.production`: Contém as variáveis de ambiente para o ambiente de produção.
*   `package.json`, `pnpm-lock.yaml` (ou `package-lock.json`): Para gerenciamento de dependências.
*   `src/` (e outros diretórios de código-fonte).

### 3.2. Variáveis de Ambiente no Easypanel

No Easypanel, você precisará definir as seguintes variáveis de ambiente para a sua aplicação:

*   `VITE_SUPABASE_URL`: A URL do seu projeto Supabase (ex: `https://outbqhcizvjtpspwpjyu.supabase.co`).
*   `VITE_SUPABASE_ANON_KEY`: A chave pública (anon key) do seu projeto Supabase.
*   `VITE_APP_URL`: **Extremamente importante!** Esta deve ser a URL pública do seu aplicativo no Easypanel (ex: `https://postagensfacilty.com`). Esta variável é usada para construir as URLs de redirecionamento corretas para o OAuth.

### 3.3. Processo de Deploy

1.  **No Easypanel**, crie um novo serviço ou aplicativo.
2.  Configure o serviço para usar um **Dockerfile**.
3.  Aponte para o `Dockerfile.nginx` na raiz do seu projeto.
4.  Defina as variáveis de ambiente mencionadas na seção 3.2.
5.  Certifique-se de que a porta exposta no Dockerfile (3000) esteja mapeada corretamente no Easypanel.
6.  Inicie o deploy. O Easypanel construirá a imagem Docker e implantará sua aplicação.

## 4. Teste e Validação

Após o deploy, acesse sua aplicação pela URL configurada no Easypanel. Navegue até a seção de conexão de contas e tente o fluxo de login com Facebook. Verifique se as contas são conectadas corretamente e se não há erros de redirecionamento ou autorização.

--- 

**Autor:** Manus AI

**Referências:**

[1] [Facebook for Developers - Documentação](https://developers.facebook.com/docs)
[2] [Supabase - Documentação](https://supabase.com/docs)
[3] [Easypanel - Documentação](https://easypanel.io/docs)
