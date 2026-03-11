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

---

## 🤖 Como rodar este projeto usando IA (Setup Automatizado)

Se você utiliza assistentes virtuais de código baseados em IA (como **ChatGPT Server/Dev**, **Claude / Cursor**, **GitHub Copilot Workspace** ou **Gemini Code Assist**), você pode pedir para a própria IA configurar e rodar todo o projeto para você!

Basta copiar e colar o **Prompt** abaixo no chat da sua IA:

> **Prompt de Instalação Automatizada:**
> *"Olá! Eu acabei de clonar este repositório de Controle Financeiro. Este é um projeto full-stack. O back-end está na pasta `backend` (escrito em Python/FastAPI) e o front-end está na pasta `frontend` (escrito em React/Vite).*
> 
> *Por favor, faça o setup completo e rode o projeto na minha máquina. Siga estes passos de forma autônoma:*
> *1. Leia o README.md para entender os requisitos.*
> *2. Abra um terminal, entre na pasta `backend`, crie um ambiente virtual (venv), ative-o, instale as dependências (FastAPI, Uvicorn, SQLAlchemy, Pydantic) e inicie o servidor rodando `uvicorn main:app --reload` no background.*
> *3. Abra um segundo terminal, entre na pasta `frontend`, rode `npm install` e depois inicie o servidor com `npm run dev`.*
> *4. Me avise quando tudo estiver rodando e me passe as URLs de acesso."*
