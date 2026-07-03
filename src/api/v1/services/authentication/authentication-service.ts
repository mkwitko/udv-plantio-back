import { UserModel } from "../../models/user-model";
import { cognitoSignIn } from "./cognito-service";
import {
  applyMockClaims,
  isMockClaimsEmail,
  mockBypass,
} from "./apply-mock-claims";
import { deriveAccess } from "../authorization/derive-access";
import { ForbiddenError } from "@/errors/forbidden-error";
import { env } from "@/env";

interface AuthenticationParams {
  email: string;
  password: string;
}

const bypassEmails = env.BYPASS_EMAILS.split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export async function authenticationService({
  email,
  password,
}: AuthenticationParams) {
  // 1. Cognito é a fonte de verdade das credenciais.
  let claims = await cognitoSignIn({ email, password });

  // 1b. Mock de claims (só dev + email de bypass) — testar cargo/grau/acesso.
  let bypass = bypassEmails.includes(claims.email.toLowerCase());
  if (isMockClaimsEmail(claims.email, bypassEmails)) {
    claims = applyMockClaims(claims);
    bypass = mockBypass();
    console.log("[MOCK] claims aplicados:", {
      grau: claims.grau,
      cargos: claims.cargos,
      cargoCodigo: claims.cargoCodigo,
      nucleoNome: claims.nucleoNome,
      regiaoNome: claims.regiaoNome,
      bypass,
    });
  }

  // 2. Gate de acesso: grau (QM/CDC/CI) ou cargo 56 (Monitor Plantio Local) ou bypass.
  const { podeAcessar } = deriveAccess({
    grau: claims.grau,
    cargosClaim: claims.cargos,
    cargoCodigo: claims.cargoCodigo,
    bypass,
  });

  if (!podeAcessar) {
    throw new ForbiddenError("Sem acesso ao aplicativo");
  }

  const userModel = new UserModel();

  // 3. Provisiona o núcleo (Center) do token — cria se não existir (match nome).
  const centerId = claims.nucleoNome
    ? await userModel.upsertCenterByName(claims.nucleoNome, claims.regiaoNome)
    : null;

  // 4. Provisiona/atualiza o usuário a partir do Cognito.
  const { id } = await userModel.syncFromCognito({
    data: {
      email: claims.email,
      nome: claims.nome,
      grau: claims.grau,
      cargos: claims.cargos,
      cargoNome: claims.cargoNome,
      cargoCodigo: claims.cargoCodigo,
    },
    centerId,
    bypass,
  });

  // 5. Retorna o usuário completo (sem senha) para emissão do nosso JWT.
  const user = await userModel.findById(id);

  return { user };
}
