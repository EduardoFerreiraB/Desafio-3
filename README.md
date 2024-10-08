
# FlexiLease Autos

A FlexiLease Autos API é uma aplicação construída em Node.js com TypeScript que permite gerenciar toda lógica para locação de veiculos, desde Cadastro de veiculos, usuarios até realizar a reserva de um veiculos. A Api utiliza JWT, para tornar rotas mais seguras e unicas.


## Funcionalidades
- Car
    - Adcionar um novo carro ao sistema.
    - Listar os carros com parametros e paginação
    - Atualizar os dados de um carro.
    - Listar um carro por seu ID.
    - Deletar um carro.
    - Modificar acessorios.
- Users
    - Adcionar um novo Usuario.
    - Autenticar um usuario.
    - Atualizar um usuario.
    - Deletar um usuario.
    - Buscar um usuario.
- Reservas
    - Realizar uma reserva.
    - Atualizar uma reserva.
    - Remover uma reserva.
    - Listar todas reservas do usuario logado, com paginação e parametros.
    - Buscar uma reserva pelo ID.

## Pré Requisitos

- Node.js
- Ferramenta de testes de API(Postman/Insomnia)
- npm ou yarn

## Instalação

- **Clone o repositório:**
    ```bash
    git clone https://github.com/EduardoFerreiraB/Desafio-3
    ```
- Segundo passo:
    - **Assim que clonar o repositorio, abrir ele em uma IDE e rodar o seguinte comando no terminal para instalar as dependencias:**
    ```bash
    npm install
    ```
## Executando a aplicação

- **Inicie o servidor com o comando abaixo:**
     ```bash
    npm run dev
    ```
- **Para saber mais das rotas e como a API espera receber as entradas acesse a documentação em:**

- http://localhost:3000/doc
## Documentação

[Documentação](http://localhost:3000/doc)

