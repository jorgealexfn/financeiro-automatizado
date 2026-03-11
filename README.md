# Financeiro Automatizado

Um aplicativo web full-stack para controle financeiro automatizado, com o back-end desenvolvido em Python utilizando o framework **FastAPI** e banco de dados SQLite (via SQLAlchemy), enquanto o front-end foi construído em React/TypeScript utilizando **Vite**.

## Tecnologias e Ferramentas

### Back-end
- **Python** com **FastAPI**
- **SQLAlchemy** (ORM)
- **SQLite** (Banco de dados local)
- **Uvicorn** (Servidor web)
- **Pydantic** (Validação de dados)

### Front-end
- **React** (Biblioteca de interface)
- **TypeScript** (Tipagem estática)
- **Vite** (Build tool e servidor de desenvolvimento)

## Como Executar Localmente

### Pré-requisitos
- [Python 3.8+](https://www.python.org/downloads/)
- [Node.js](https://nodejs.org/) (recomendado versão 18 ou superior)
- Gerenciador de pacotes (npm ou pnpm ou yarn)

### Passo 1: Configurar e iniciar o Back-end

1. Abra um terminal na pasta `backend`.
2. (Opcional) Crie e ative um ambiente virtual:
   ```bash
   python -m venv venv
   # No Windows:
   venv\Scripts\activate
   # No Linux/Mac:
   source venv/bin/activate
   ```
3. Instale as dependências:
   ```bash
   pip install fastapi uvicorn sqlalchemy pydantic
   ```
4. Inicie o servidor remoto FastAPI:
   ```bash
   uvicorn main:app --reload
   ```
   A API estará rodando em `http://localhost:8000`. Você pode acessar a documentação interativa em `http://localhost:8000/docs`.

### Passo 2: Configurar e iniciar o Front-end

1. Abra um novo terminal na pasta `frontend`.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento do React:
   ```bash
   npm run dev
   ```
   A aplicação React deve abrir no seu navegador padrão.

## Funcionalidades
A aplicação possui comunicação completa de API com banco de dados para gerenciar dados financeiros (despesas, receitas) por mês.
