# TrackFilmes

TrackFilmes é uma aplicação web que permite aos usuários rastrear e gerenciar os filmes que desejam assistir.Os usuários podem buscar filmes, adicionar à sua watchlist e marcar como assistidos.

## Funcionalidades

- Cadastro e autenticação de usuários
- Busca de filmes usando a API do TMDB
- Criação de watchlist personalizada
- Marcar filmes como assistidos
- Gestão de perfil de usuário
- Design responsivo para desktop e dispositivos móveis

## Tecnologias Utilizadas

### Frontend

- React.js
- React Router
- Bootstrap (com tema personalizado)
- Formik & Yup para validação de formulários
- Axios para requisições HTTP

### Backend

- Node.js com Express
- Sequelize ORM
- MySQL para persistência de dados
- JWT para autenticação
- Integração com The Movie Database API

## Instalação e Configuração

### Pré-requisitos

- Node.js (versão 14 ou superior)
- MySQL

### Frontend

```bash
# Clone o repositório
git clone https://github.com/miyashiroo/trackfilmes-frontend.git

# Navegue até a pasta do projeto frontend
cd trackfilmes-frontend

# Instale as dependências
npm install

# Crie um arquivo .env na raiz do projeto com:
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_API_KEY=sua_api_TMDB

# Inicie a aplicação em modo de desenvolvimento
npm start
```

### Backend

```bash

# Clone o repositório
git clone https://github.com/miyashiroo/trackfilmes-backend.git

# Navegue até a pasta do projeto backend
cd trackfilmes-backend

# Instale as dependências
npm install

# Crie um banco de dados no MySQL e coloco o mesmo nome no DB_NAME do .env abaixo.

# Crie um arquivo .env na raiz do projeto backend com:
PORT=5000
DB_NAME=trackfilmes
DB_USER=seu_usuario_mysql
DB_PASSWORD=sua_senha_mysql
DB_HOST=localhost
JWT_SECRET=seu_token_secreto
TMDB_API_KEY=sua_chave_api_tmdb

# Inicie o servidor
npm run dev
```

## Acesso à Aplicação

A aplicação está disponível online nos seguintes endereços:

- Frontend: [https://trackfilmes-frontend-production.up.railway.app](https://trackfilmes-frontend-production.up.railway.app)
- Backend: [https://trackfilmes-backend-production.up.railway.app](https://trackfilmes-backend-production.up.railway.app)

## Autor

Desenvolvido por [Rodrigo Miyashiro](https://github.com/miyashiroo)
