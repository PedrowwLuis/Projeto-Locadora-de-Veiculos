# Projeto Locadora de Veículos

Sistema web full stack de locação de veículos: uma API REST em Node.js e Express, persistência relacional com Prisma ORM e MySQL, autenticação com JWT e uma interface em React.

Atividade prática da disciplina **Programação com Frameworks Web** (API REST, Prisma, Autenticação e React).

## Integrantes

| Nome completo | Responsabilidade |
| --- | --- |
| PEDRO LUIS DE LIRA ALVES | Responsavel Geral |

## Descrição do sistema

Uma locadora precisa cadastrar veículos, controlar a disponibilidade deles e registrar as locações feitas por usuários autenticados. O sistema permite cadastrar e listar veículos, iniciar e finalizar locações, calcular os valores e consultar o histórico.

Há dois perfis de usuário:

| Perfil | Como é criado | O que pode fazer |
| --- | --- | --- |
| `USUARIO` | Qualquer pessoa que se cadastra pela tela "Cadastre-se". O perfil é sempre definido pelo servidor. | Listar veículos, registrar locações, consultar e finalizar as próprias locações. |
| `ADMIN` | Criado pelo seed ou promovido diretamente no banco. | Tudo o que o usuário faz, mais o cadastro de veículos. |

## Funcionalidades

- Cadastro e login de usuários, com senha protegida por hash bcrypt e token JWT
- Identificação do usuário autenticado e logout
- Cadastro de veículos (somente administrador), com placa única e valor de diária positivo
- Listagem de veículos com filtro de disponibilidade
- Seleção de veículo disponível para locação
- Registro de locação com cálculo do valor total feito no backend
- Finalização de locação (devolução), que libera o veículo
- Histórico das locações do usuário, com os dados do veículo
- Mensagens de sucesso e erro e atualização da tela após cada operação

## Tecnologias

| Camada | Tecnologias |
| --- | --- |
| Backend | Node.js, Express, JavaScript (ESM), Prisma ORM, MySQL, `jsonwebtoken`, `bcrypt`, `cors`, `dotenv` |
| Frontend | React 18, React Router, Vite, `fetch` |

## Requisitos de execução

- Node.js 18 ou superior (recomendado Node 20 ou 22 LTS)
- npm
- MySQL 8 em execução (Workbench, XAMPP, instalação local ou contêiner)

## Instalação e execução

Os comandos abaixo partem da pasta raiz do repositório (`Projeto-Locadora-de-Veiculos`). Use dois terminais: um para o backend e outro para o frontend.

### 1. Configurar o banco de dados

Crie o banco no MySQL (o nome tem hífens, então precisa de crases):

```sql
CREATE DATABASE `Projeto-Locadora-de-Veiculos` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Backend

```bash
cd backend
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate deploy
npm run seed
npm run dev
```

No Windows (CMD), troque `cp` por `copy`.

Antes de rodar as migrations, edite o `backend/.env`: ajuste usuário, senha e porta do `DATABASE_URL` e defina um `JWT_SECRET` longo e aleatório.

| Variável | Descrição | Padrão |
| --- | --- | --- |
| `DATABASE_URL` | String de conexão do MySQL | obrigatória |
| `JWT_SECRET` | Segredo usado para assinar os tokens | obrigatória |
| `JWT_EXPIRES_IN` | Validade do token | `1d` |
| `BCRYPT_ROUNDS` | Custo do hash bcrypt | `10` |
| `PORT` | Porta da API | `3333` |
| `FRONTEND_URL` | Origens liberadas no CORS, separadas por vírgula | `http://localhost:5173` |

Se a senha do banco tiver caracteres especiais, codifique-os na URL (`@` vira `%40`, `:` vira `%3A`, `/` vira `%2F`, `#` vira `%23`).

A API sobe em `http://localhost:3333`. Para conferir, abra `http://localhost:3333/health`, que deve responder `{"status":"ok"}`.

Scripts do backend:

| Script | O que faz |
| --- | --- |
| `npm run dev` | Inicia a API com recarga automática |
| `npm start` | Inicia a API |
| `npm run generate` | Gera o Prisma Client |
| `npm run migrate` | `prisma migrate dev`, para criar novas migrations durante o desenvolvimento |
| `npm run migrate:deploy` | Aplica as migrations existentes |
| `npm run seed` | Insere os dados de exemplo (pode ser repetido) |

### 3. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

A interface abre em `http://localhost:5173`. Se a API estiver em outro endereço, ajuste `VITE_API_URL` em `frontend/.env`.

### 4. Dados de exemplo

O comando `npm run seed` cria:

| Perfil | E-mail | Senha |
| --- | --- | --- |
| Administrador | `admin@projeto-locadora-de-veiculos.com` | `Admin@123` |
| Usuário comum | `demo@projeto-locadora-de-veiculos.com` | `Demo@123` |

Também cria 8 veículos, 1 locação finalizada e 1 locação ativa (do usuário comum, com o veículo indisponível). Para promover outro usuário a administrador:

```sql
UPDATE Usuario SET perfil = 'ADMIN' WHERE email = 'email@exemplo.com';
```

### Problemas comuns

| Sintoma | O que fazer |
| --- | --- |
| `P1013: invalid port number in database URL` | A `DATABASE_URL` está mal formada. Confira o formato e codifique caracteres especiais da senha. |
| `@prisma/client did not initialize yet` | Rode `npx prisma generate` na pasta `backend`. |
| `EPERM ... query_engine` no Windows | Há uma instância do backend aberta. Pare todos os processos Node (`Ctrl+C` ou `taskkill /F /IM node.exe`) e rode `npx prisma generate` de novo. |
| `Unknown argument perfil` | O Prisma Client está desatualizado. Rode `npx prisma generate` e reinicie o backend. |
| `EADDRINUSE` | A porta 3333 já está em uso. Pare a outra instância ou mude `PORT` e `VITE_API_URL`. |
| Aviso de drift ao usar `migrate dev` no Windows | O MySQL do Windows grava nomes de tabela em minúsculas. Use `npx prisma migrate deploy`, que não compara os nomes. |
| "Não foi possível conectar à API" na interface | O backend não está rodando ou o `VITE_API_URL` aponta para outra porta. |

## Estrutura do projeto

```
backend/
  prisma/
    schema.prisma          entidades, enums e relações
    migrations/            histórico versionado do banco
    seed.js                dados de exemplo
  src/
    server.js              inicia o servidor e trata o encerramento
    app.js                 monta o Express (cors, json, rotas, erros)
    config/env.js          lê e valida as variáveis de ambiente
    routes/                mapeamento dos endpoints
    controllers/           entrada e resposta HTTP
    services/              validações e regras de negócio
    middlewares/           autenticação JWT, perfil e tratamento de erros
    lib/                   Prisma Client, AppError, asyncHandler, validação
frontend/
  src/
    api/                   chamadas HTTP (fetch)
    context/               AuthContext (sessão do usuário)
    components/            formulários, listas, navbar, mensagens
    pages/                 login, cadastro, veículos, locações
    utils/                 formatadores e mensagens
```

A API segue a separação **Routes → Controllers → Services → Prisma**. As rotas só mapeiam endpoints, os controllers cuidam de entrada e resposta HTTP, e as regras de negócio ficam nos services.

## Modelagem do banco

```
Usuario 1 ───< Locacao >─── 1 Veiculo
```

| Entidade | Campos |
| --- | --- |
| `Usuario` | `id` (PK), `nome`, `email` (único), `senhaHash`, `perfil` (`ADMIN` ou `USUARIO`, padrão `USUARIO`), `criadoEm` |
| `Veiculo` | `id` (PK), `marca`, `modelo`, `placa` (única), `ano`, `valorDiaria`, `disponivel` |
| `Locacao` | `id` (PK), `usuarioId` (FK), `veiculoId` (FK), `dataInicio`, `dataPrevistaDevolucao`, `dataDevolucaoEfetiva` (opcional), `valorTotal`, `status` (`ATIVA` ou `FINALIZADA`) |

- Os dois relacionamentos 1:N estão declarados em `backend/prisma/schema.prisma`: um `Usuario` possui várias `Locacao`, e um `Veiculo` possui várias `Locacao` em momentos diferentes.
- As chaves estrangeiras usam `ON DELETE RESTRICT`, o que impede apagar usuário ou veículo com locações e preserva o histórico.
- Migrations versionadas em `backend/prisma/migrations`:
  - `20261115000000_init`: tabelas, índices únicos e chaves estrangeiras
  - `20261118000000_perfil_usuario`: coluna `perfil` em `Usuario`
- As consultas de locação usam `include` do Prisma para trazer os dados do veículo.

## Endpoints

Todas as rotas, exceto `/health`, cadastro e login, exigem o cabeçalho `Authorization: Bearer <token>`.

| Método | Rota | Acesso | Descrição | Sucesso |
| --- | --- | --- | --- | --- |
| GET | `/health` | Público | Verifica a API | 200 |
| POST | `/auth/cadastro` | Público | Cadastra usuário (`nome`, `email`, `senha`) | 201 |
| POST | `/auth/login` | Público | Retorna `{ token, usuario }` | 200 |
| GET | `/auth/perfil` | Autenticado | Usuário do token | 200 |
| POST | `/veiculos` | Somente ADMIN | Cadastra veículo (`marca`, `modelo`, `placa`, `ano`, `valorDiaria`) | 201 |
| GET | `/veiculos` | Autenticado | Lista veículos; filtro opcional `?disponivel=true` ou `false` | 200 |
| GET | `/veiculos/disponiveis` | Autenticado | Lista apenas veículos disponíveis | 200 |
| POST | `/locacoes` | Autenticado | Registra locação (`veiculoId`, `dataInicio`, `dataPrevistaDevolucao`) | 201 |
| GET | `/locacoes` | Autenticado | Locações do usuário; filtro opcional `?status=ATIVA` ou `FINALIZADA` | 200 |
| GET | `/locacoes/:id` | Autenticado (dono) | Uma locação do usuário | 200 |
| PATCH | `/locacoes/:id/finalizar` | Autenticado (dono) | Registra a devolução e libera o veículo | 200 |

Os erros seguem o formato `{ "erro": "mensagem", "detalhes": [...] }`, e `detalhes` só aparece em erros de validação.

| Código | Quando |
| --- | --- |
| 400 | Dados inválidos, datas incoerentes, filtros inválidos |
| 401 | Token ausente, inválido ou expirado; credenciais incorretas |
| 403 | Usuário comum cadastrando veículo; acesso a locação de outro usuário |
| 404 | Veículo ou locação inexistente |
| 409 | E-mail ou placa duplicados; veículo indisponível; locação já finalizada |
| 500 | Erro interno |

## Regras de negócio e onde estão implementadas

| Regra | Implementação |
| --- | --- |
| Somente autenticados gerenciam veículos e locações | `middlewares/autenticar.js`, aplicado nas rotas com `router.use(autenticar)` |
| Somente administrador cadastra veículos | `middlewares/exigirPerfil.js` em `POST /veiculos` |
| Cadastro público sempre cria perfil `USUARIO` | `authService.cadastrar` (o campo `perfil` do corpo é ignorado) |
| Usuário identificado pelo token, nunca pelo corpo | `req.usuario.id` nos controllers de locação |
| Senha com bcrypt; hash nunca retornado | `authService` e `usuarioService.camposPublicos` (`select` sem `senhaHash`) |
| Data de devolução posterior ao início | `locacaoService.registrar` |
| Valor total calculado no backend; fração de 24 h conta como diária | `locacaoService.calcularDiarias` (`Math.ceil` da duração em dias) multiplicada pela diária com `Prisma.Decimal` |
| Um veículo não tem duas locações ativas; fica indisponível ao locar | `locacaoService.registrar` |
| Devolução libera o veículo; não finaliza locação já finalizada | `locacaoService.finalizar` |
| Usuário só consulta e finaliza as próprias locações | `buscarDoUsuario`, `finalizar` (403) e `listarDoUsuario` (filtra por `usuarioId`) |
| Placa e e-mail únicos; sem locação de veículo inexistente | `@unique` no schema, verificação nos services (409) e 404 em `registrar` |
| Histórico preservado | Sem rotas de exclusão e chaves estrangeiras com `RESTRICT` |
| Consistência com requisições simultâneas | Transações `prisma.$transaction` e atualização condicional |

### Fluxo do registro de locação

1. O React envia `POST /locacoes` com o JWT no cabeçalho e `veiculoId`, `dataInicio` e `dataPrevistaDevolucao` no corpo.
2. O middleware `autenticar` valida o token, confere se o usuário ainda existe e preenche `req.usuario`.
3. O controller repassa `req.usuario.id` e `req.body` para `locacaoService.registrar`.
4. O service valida os campos e a ordem das datas (400).
5. Dentro de uma transação, busca o veículo (404), confere a disponibilidade (409), calcula o valor total e marca o veículo como indisponível com `updateMany`, condicionado a `disponivel: true`.
6. Se o `updateMany` não afetar nenhuma linha, outra requisição reservou o veículo antes e a resposta é 409.
7. Cria a locação com status `ATIVA`, incluindo os dados do veículo, e responde 201.
8. O React mostra a mensagem com o valor total e recarrega os veículos disponíveis e o histórico.

### Concorrência

A reserva do veículo é uma única instrução `UPDATE ... WHERE id = ? AND disponivel = true`. No InnoDB essa instrução trava a linha, então, entre duas requisições simultâneas para o mesmo veículo, só uma encontra `disponivel = true` e altera a linha. A outra, ao obter a trava, reavalia a condição, não afeta nenhuma linha e recebe 409. Como a reserva e a criação da locação estão na mesma transação, qualquer falha desfaz as duas operações. A finalização usa o mesmo princípio, com `updateMany` condicionado a `status: 'ATIVA'`.

## Decisões de projeto

- O valor total é calculado uma vez, no registro, com base na duração contratada. A devolução, antecipada ou atrasada, apenas grava `dataDevolucaoEfetiva`, sem recalcular o valor.
- A data de início não precisa ser futura, para permitir iniciar a locação no momento do registro.
- O perfil do usuário é lido do banco a cada requisição, e não do token, então uma mudança de perfil vale imediatamente.
- Valores monetários usam `Decimal` no banco e chegam ao frontend como texto, formatados com `Intl.NumberFormat`.
- Placas aceitam o padrão antigo (ABC1234) e o Mercosul (ABC1D23) e são normalizadas para maiúsculas e sem hífen.
- Não há edição nem exclusão de veículos e locações, conforme o escopo da atividade.
- O token fica em `localStorage`. Ao abrir a aplicação, o frontend o valida em `GET /auth/perfil`, e qualquer resposta 401 encerra a sessão.
- O formulário de cadastro de veículos só aparece para administradores, mas a proteção real está na API (403).
- O código-fonte não contém comentários explicativos; as instruções e decisões estão neste README.

## Roteiro de demonstração

1. Abrir `GET /health` e mostrar a estrutura de pastas (Routes, Controllers, Services).
2. Cadastrar um usuário pela tela e fazer login; o formulário de veículos não aparece para ele.
3. Entrar como administrador e cadastrar um veículo; repetir a placa para mostrar o 409.
4. Filtrar os veículos por disponibilidade.
5. Como usuário, registrar uma locação, mostrar o valor calculado e o veículo ficando indisponível.
6. Tentar locar o mesmo veículo de novo (409) e mostrar o histórico.
7. Finalizar a locação, mostrar o veículo disponível de novo e tentar finalizar outra vez (409).
8. Mostrar o 403 ao usar o token de um usuário comum em `POST /veiculos` e ao acessar a locação de outro usuário.

Exemplo com `curl` (troque `TOKEN` pelo valor retornado no login):

```bash
curl -X POST http://localhost:3333/auth/login -H "Content-Type: application/json" -d '{"email":"demo@projeto-locadora-de-veiculos.com","senha":"Demo@123"}'

curl http://localhost:3333/veiculos/disponiveis -H "Authorization: Bearer TOKEN"

curl -X POST http://localhost:3333/locacoes -H "Authorization: Bearer TOKEN" -H "Content-Type: application/json" -d '{"veiculoId":3,"dataInicio":"2026-12-01T10:00:00.000Z","dataPrevistaDevolucao":"2026-12-04T11:00:00.000Z"}'

curl http://localhost:3333/locacoes -H "Authorization: Bearer TOKEN"

curl -X PATCH http://localhost:3333/locacoes/ID/finalizar -H "Authorization: Bearer TOKEN"
```

O exemplo de locação dura 3 dias e 1 hora, então cobra 4 diárias.
