# 🎮 Pokémon TypeScript

Uma aplicação web interativa que permite pesquisar Pokémon pelo nome ou número da Pokédex, consumindo dados da [PokéAPI](https://pokeapi.co/) e utilizando TypeScript para garantir maior segurança e organização no código.

O projeto foi desenvolvido com o objetivo de praticar conceitos de TypeScript, manipulação do DOM, consumo de APIs REST e programação assíncrona, utilizando tecnologias nativas do desenvolvimento web.

## ✨ Funcionalidades

- 🔎 **Busca de Pokémon:** pesquisa pelo nome ou número da Pokédex.
- 🎨 **Exibição de informações:** apresenta o nome, a imagem e os tipos do Pokémon.
- 🌀 **Sprites animados:** prioriza imagens animadas e utiliza imagens estáticas como alternativa.
- ⚡ **Cache de requisições:** armazena os Pokémon já consultados para evitar requisições desnecessárias.
- 🚫 **Cancelamento de requisições:** interrompe uma busca anterior quando uma nova pesquisa é iniciada.
- ⚠️ **Tratamento de erros:** apresenta mensagens para Pokémon não encontrados e falhas nas requisições.
- ⌨️ **Busca pelo teclado:** permite pesquisar pressionando a tecla Enter.

## 🛠️ Tecnologias utilizadas

| Tecnologia | Finalidade |
|---|---|
| HTML5 | Estrutura da aplicação |
| CSS3 | Estilização e layout |
| TypeScript | Lógica e tipagem estática |
| JavaScript ES2020 | Código executado no navegador |
| PokéAPI | Fonte dos dados dos Pokémon |

## 🧠 Conceitos aplicados

Durante o desenvolvimento, foram trabalhados conceitos importantes do desenvolvimento web:

- **TypeScript:** interfaces, tipagem estática, generics e type assertions.
- **DOM:** seleção e manipulação de elementos HTML.
- **Fetch API:** consumo de APIs REST.
- **Async/Await:** gerenciamento de operações assíncronas.
- **Promises:** tratamento de operações assíncronas e respostas HTTP.
- **AbortController:** cancelamento de requisições em andamento.
- **Map:** armazenamento temporário de dados em cache.
- **Tratamento de erros:** utilização de `try/catch/finally` e validação de respostas HTTP.

## 🚀 Como executar o projeto

### Pré-requisitos

- Navegador atualizado.
- [Node.js](https://nodejs.org/) (para instalar e executar o compilador TypeScript).
- TypeScript instalado globalmente ou disponível no ambiente de desenvolvimento.

### 1. Clone o repositório

```bash
git clone https://github.com/aloisiomarques/pokemonTypeScript.git
```

### 2. Acesse a pasta do projeto

```bash
cd pokemonTypeScript
```

### 3. Instale o TypeScript (caso ainda não esteja instalado)

```bash
npm install -g typescript
```

### 4. Compile o TypeScript

```bash
tsc
```

O compilador utilizará as configurações definidas no `tsconfig.json` para gerar o arquivo JavaScript a partir do código TypeScript.

### 5. Execute a aplicação

Abra o arquivo `index.html` no navegador ou utilize uma extensão de servidor local, como o Live Server.

## 📁 Estrutura do projeto

```text
pokemonTypeScript/
│
├── index.html      # Estrutura da aplicação
├── style.css       # Estilização da interface
├── main.ts         # Código-fonte TypeScript
├── main.js         # JavaScript gerado pelo compilador
└── tsconfig.json   # Configurações do TypeScript
```

## 🌐 API utilizada

Os dados são obtidos através da [PokéAPI](https://pokeapi.co/), uma API REST pública que disponibiliza informações sobre Pokémon.

Endpoint utilizado:

```text
https://pokeapi.co/api/v2/pokemon/{nome-ou-id}
```

Exemplo de consulta:

```text
https://pokeapi.co/api/v2/pokemon/pikachu
```

## 🎯 Objetivo do projeto

Este projeto faz parte da minha jornada de aprendizado em desenvolvimento web, com foco no aprofundamento em TypeScript e na integração entre aplicações frontend e APIs externas.

A proposta é aplicar conceitos fundamentais de programação em um projeto prático, buscando desenvolver código mais organizado, tipado e de fácil manutenção.

## 👨‍💻 Autor

**Aloisio Marques**

- GitHub: [@aloisiomarques](https://github.com/aloisiomarques)

---

⭐ Se este projeto despertou seu interesse, considere deixar uma estrela no repositório!
