import { hasGrauAcesso, matchCargos } from "@/api/v1/constants/cargos";

interface DeriveAccessParams {
  grau: string | null | undefined;
  cargosClaim: string | null | undefined;
  cargoCodigo?: string | number | null;
  bypass: boolean;
}

export interface AccessResult {
  podeAcessar: boolean;
}

/**
 * Decide se o usuário pode acessar o app a partir do grau, cargos (Cognito) e
 * bypass. Regra e lista de cargos vivem em `constants/cargos.ts`.
 *
 * Acesso = bypass  OU  grau ∈ {QM, CDC, CI}  OU  algum cargo de CARGOS_ACESSO (56).
 */
export function deriveAccess({
  grau,
  cargosClaim,
  cargoCodigo,
  bypass,
}: DeriveAccessParams): AccessResult {
  const cargos = matchCargos(cargosClaim, cargoCodigo);
  const grauLiberado = hasGrauAcesso(grau);

  return { podeAcessar: bypass || grauLiberado || cargos.length > 0 };
}
