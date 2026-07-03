# Port da autenticação Cognito (sus → plantio) — gate + provisioning

Data: 2026-07-03
Escopo: `udv-plantio-back` (principal), `udv-plantio-app` (tratar erro 403 no login + regen de tipos).
Base: replica a camada Cognito do `udv-sus-back`, versão **enxuta** (só gate de acesso + provisionamento). Sem tabela de permissões, sem filtro de escopo.

## Objetivo

Trocar o login local (bcrypt) por autenticação no Amazon Cognito, igual ao sus.
Cognito vira a **fonte de verdade** das credenciais; o backend valida no Cognito e
emite o nosso próprio JWT (fluxo atual, inalterado). Usuário e núcleo (Center) são
**provisionados a partir do token** a cada login. Acesso é restrito.

## Decisões (aprovadas)

- **Escopo enxuto**: só gate de acesso + provisioning. NÃO portar tabela de permissões nem filtro de escopo (plantio não tem esses models; `Center.region` é String).
- **Mesmo pool Cognito do sus**: `us-east-1_QCJtSIWeq`, client `7lcqn8l4s2uth5qh2kmif2bap3`.
- **Regra de acesso** (mais restrita que o sus): entra só quem for `grau === "QM"` **OU** tiver o cargo `MONITOR(A) DO PLANTIO LOCAL` (código 56) **OU** bypass de email. Senão → 403 "Sem acesso ao aplicativo".
- **Bypass**: `BYPASS_EMAILS` no `.env` = `mauriciokwt@gmail.com`. Bypass = acesso garantido.
- **Remover login local (bcrypt)** do fluxo de auth: `password` vira opcional, sem `compare`. Cognito valida. Usuário que existe no Cognito mas não no DB é auto-provisionado.
- **Provisionar do token a cada login**: Center (upsert por nome, `region` = regiao do token) e User (upsert por email).
- **`hierarchy`** (já existe em `User`) é usado como `grau`.
- **Incluir mock-claims dev** (só dev + email em `BYPASS_EMAILS`) para testar gate/provisioning sem depender do Cognito real.
- **CRUD manual de usuário/center**: fora de escopo — permanece intacto (endpoints existentes não removidos).
- **Controller `authenticate.ts` e o JWT `{userId}`**: inalterados.

## Claims lidos do IdToken (Cognito)

- `email`
- `name` (fallback `given_name` / `cognito:username`) → `nome`
- `custom:grau` → `grau` (`hierarchy`); `"QM"` libera acesso
- `custom:cargos` → todos os cargos (texto ou código), separados por vírgula
- `custom:cargo_nome` → cargo principal (nome)
- `custom:cargo_codigo` → cargo principal (código) — fallback do matcher
- `custom:nucleo_nome` → núcleo → `Center.name`
- `custom:regiao_nome` → região → `Center.region`

## Fluxo novo — `POST /authentication/sign/in`

```
front → POST /sign/in {email, password}
  1. cognitoSignIn(email, password)          // SRP (amazon-cognito-identity-js), decode IdToken
       erro (NotAuthorized/UserNotFound/...) → BadRequestError("Credenciais inválidas")
  2. bypass = BYPASS_EMAILS.includes(email)
  2b. mock de claims (só dev + bypass email, se MOCK_ENABLED=true)
  3. access = deriveAccess({ grau, cargosClaim, cargoCodigo, bypass })
       podeAcessar = bypass || grau === "QM" || matchCargos(...).length > 0
  4. !podeAcessar → ForbiddenError("Sem acesso ao aplicativo")   // 403, não emite token
  5. upsert Center (por nome = nucleoNome; region = regiaoNome)
  6. upsert User (por email): grau→hierarchy, cargos, cargoNome, cargoCodigo, bypass,
       password: null, connect Center
  7. retorna { user } → authenticate.ts emite nosso accessToken/refreshToken (igual hoje)
```

## Componentes

### Backend (`udv-plantio-back`)

1. **`.env` + `.env-example` + `src/env/index.ts`** — adicionar ao `envSchema`:
   ```
   COGNITO_REGION=us-east-1
   COGNITO_USER_POOL_ID=us-east-1_QCJtSIWeq
   COGNITO_USER_POOL_CLIENT_ID=7lcqn8l4s2uth5qh2kmif2bap3
   BYPASS_EMAILS=mauriciokwt@gmail.com
   # mock (só dev)
   MOCK_ENABLED=false
   MOCK_BYPASS=true
   # MOCK_GRAU / MOCK_CARGOS / MOCK_CARGO_CODIGO / MOCK_CARGO_NOME / MOCK_NUCLEO_NOME / MOCK_REGIAO_NOME
   ```
   Schema: `COGNITO_*` = `z.string()`; `BYPASS_EMAILS` = `z.string().default("")`;
   `MOCK_ENABLED`/`MOCK_BYPASS` = `z.string().default(...)`; `MOCK_*` = `z.string().optional()`.

2. **`schema.prisma`** — model `User`:
   ```prisma
   password    String?   // era obrigatório; Cognito é fonte de verdade
   cargos      String?   // custom:cargos — cru, separado por vírgula
   cargoNome   String?   // custom:cargo_nome
   cargoCodigo String?   // custom:cargo_codigo
   bypass      Boolean   @default(false)
   // hierarchy já existe → usado como grau
   ```
   + `prisma migrate` (dev) e `prisma generate`.

3. **`package.json`** — nova dep `amazon-cognito-identity-js`. `bcryptjs` **mantido** (CRUD manual fora de escopo ainda usa `hash`).

4. **Novo `src/api/v1/constants/cargos.ts`** (enxuto — só o necessário para o gate):
   ```ts
   export const GRAU_ACESSO = "QM";
   export const CARGOS_ACESSO = [
     { codigo: 56, nome: "MONITOR(A) DO PLANTIO LOCAL" },
   ];
   // normalize(): lower + sem acento + trim
   // matchCargos(cargosClaim, cargoCodigo): CargoConfig[]  — casa por nome OU código
   ```
   Sem `Escopo`, sem `ESCOPO_PERMISSOES`, sem permissões.

5. **Novo `src/api/v1/services/authentication/cognito-service.ts`** — cópia do sus:
   - `CognitoUserPool` + `CognitoUser.authenticateUser` (SRP).
   - erros Cognito (`NotAuthorizedException` / `UserNotFoundException` / `UserNotConfirmedException` / `newPasswordRequired`) → `BadRequestError("Credenciais inválidas")`.
   - `decode(idToken)` (sem verify — veio da AWS via TLS).
   - log de debug **só em dev**, só o payload (`claims`), nunca o JWT cru.
   - retorna `CognitoClaims`: `{ email, nome, cargos, cargoNome, cargoCodigo, grau, nucleoNome, regiaoNome }`.

6. **Novo `src/api/v1/services/authentication/apply-mock-claims.ts`** — cópia do sus:
   `isMockClaimsEmail`, `applyMockClaims`, `mockBypass`. Ativo só se `MOCK_ENABLED==="true"` e `ENVIRONMENT==="development"` e email em `BYPASS_EMAILS`.

7. **Novo `src/api/v1/services/authorization/derive-access.ts`** (enxuto):
   - `deriveAccess({ grau, cargosClaim, cargoCodigo, bypass })` → `{ podeAcessar: boolean }`.
   - `podeAcessar = bypass || grau === GRAU_ACESSO || matchCargos(cargosClaim, cargoCodigo).length > 0`.
   - Sem permissões no retorno.

8. **`src/api/v1/services/authentication/authentication-service.ts`** (reescrito):
   - remove `bcryptjs`/`findByEmail`+`compare`.
   - `claims = cognitoSignIn(...)`; `bypass = bypassEmails.includes(email)`; aplica mock se for o caso.
   - `deriveAccess(...)`; `!podeAcessar` → `ForbiddenError("Sem acesso ao aplicativo")`.
   - `centerId = nucleoNome ? userModel.upsertCenterByName(nucleoNome, regiaoNome) : null`.
   - `id = userModel.syncFromCognito({ data, centerId, bypass })`.
   - `user = userModel.findById(id)`; retorna `{ user }`.

9. **`src/api/v1/models/user-model.ts`** — novos métodos:
   - `upsertCenterByName(name, region)`: `prisma.center.findFirst({ where: { name: { equals, mode: "insensitive" } } })` → cria se não existir (com `region`); se existir e `region` mudou, atualiza. Retorna `id`.
   - `syncFromCognito({ data, centerId, bypass })`: `prisma.user.upsert({ where: { email } })` — grava `name`, `hierarchy` (grau), `cargos`, `cargoNome`, `cargoCodigo`, `bypass`, `password: null`, connect `center`. Retorna `{ id }`.
   - `findById` (existente): garantir que devolve os campos novos + center. Transforma `cargos` string → array na resposta (ou no service — ver item 10).

10. **`userResponse`** (`src/api/v1/controllers/user/create-user.ts`) — adicionar:
    `cargos: z.array(z.string())`, `cargoNome: z.string().nullable()`, `cargoCodigo: z.string().nullable()`, `bypass: z.boolean()`. (`hierarchy` já existe.)
    `findUserByIdService` (ou `findById`) transforma `cargos?.split(",").filter(Boolean) ?? []` antes de responder. Usado por `/user/find/me`.

11. **`authenticate.ts`** — sem mudança (JWT `{userId}`, cookies iguais).

### App mobile (`udv-plantio-app`)

12. **`app/public/signin/index.tsx`** — hoje o `catch` engole o erro. Passar a exibir mensagem de erro (403 → "Sem acesso ao aplicativo"; 400 → "Credenciais inválidas"). Usar o mecanismo de feedback existente (toast/`notify` comentado ou texto inline).

13. **Regen orval** (`yarn generate:api` com backend rodando) → tipos de `/find/me` ganham `cargos`, `cargoNome`, `cargoCodigo`, `bypass`.

## Fora de escopo (YAGNI)

- Tabela de permissões e derivação de permissões por cargo.
- Filtro de dados por escopo (região/núcleo do usuário).
- Remoção do CRUD manual de usuário/center (mantido intacto).
- Verificação do JWT do Cognito via JWKS (decode direto basta — token vem da AWS via TLS).
- Refresh do token do Cognito (usamos nosso refresh).
- Model `Regioes` separado (usa `Center.region` String).

## Notas

- Repositório não é git (`git: false`) → spec não será commitada.
- Após alterar o schema Prisma: `prisma migrate dev` + `prisma generate`.
- Remover imports órfãos de `bcryptjs` só no `authentication-service` (demais usos permanecem).
- Cognito app client precisa suportar SRP (`ALLOW_USER_SRP_AUTH`) — já usado pelo sus no mesmo pool.
