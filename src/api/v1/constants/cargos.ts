/**
 * ==========================================================================
 *  CONFIG DE ACESSO — fonte única, fácil de manter.
 *  Acesso ao app: grau ∈ GRAUS_ACESSO  OU  algum cargo de CARGOS_ACESSO
 *  OU  bypass de email. Para trocar/adicionar grau: edite GRAUS_ACESSO.
 * ==========================================================================
 */

/** Graus que liberam o acesso base ao app. */
export const GRAUS_ACESSO = ["QM", "CDC", "CI"] as const;

interface CargoConfig {
  codigo: number;
  nome: string;
}

/** ⇩⇩⇩  EDITE AQUI para trocar/adicionar cargos com acesso  ⇩⇩⇩ */
export const CARGOS_ACESSO: CargoConfig[] = [
  { codigo: 56, nome: "MONITOR(A) DO PLANTIO LOCAL" },
];

/** Normaliza texto p/ comparação: minúsculo, sem acento, sem espaços extras. */
function normalize(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

const CARGO_BY_NOME = new Map(CARGOS_ACESSO.map((c) => [normalize(c.nome), c]));
const CARGO_BY_CODIGO = new Map(CARGOS_ACESSO.map((c) => [c.codigo, c]));

const GRAUS_ACESSO_SET = new Set(GRAUS_ACESSO.map((g) => normalize(g)));

/** True se o grau do usuário está entre os liberados (case/acento-insensível). */
export function hasGrauAcesso(grau: string | null | undefined): boolean {
  if (!grau) return false;
  return GRAUS_ACESSO_SET.has(normalize(grau));
}

/**
 * Casa os cargos do token contra a config. Funciona se `custom:cargos` vier em
 * TEXTO (nomes) ou em CÓDIGO (números), separados por vírgula. `cargoCodigo`
 * (custom:cargo_codigo) entra como fallback do cargo mais alto.
 */
export function matchCargos(
  cargosClaim: string | null | undefined,
  cargoCodigo?: string | number | null,
): CargoConfig[] {
  const matched = new Map<number, CargoConfig>();

  const tokens = (cargosClaim ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  for (const token of tokens) {
    const asNumber = Number(token);
    const byCodigo = Number.isFinite(asNumber)
      ? CARGO_BY_CODIGO.get(asNumber)
      : undefined;
    const byNome = CARGO_BY_NOME.get(normalize(token));
    const hit = byCodigo ?? byNome;
    if (hit) matched.set(hit.codigo, hit);
  }

  if (cargoCodigo != null) {
    const hit = CARGO_BY_CODIGO.get(Number(cargoCodigo));
    if (hit) matched.set(hit.codigo, hit);
  }

  return [...matched.values()];
}
