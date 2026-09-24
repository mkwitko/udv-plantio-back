export type TokenType = "access" | "refresh";

/**
 * Access e refresh usam a mesma chave; `typ` impede usar um no lugar do outro.
 * ponytail: tokens sem `typ` (emitidos antes de 2026-09-24) ainda passam;
 * exigir `typ` depois de 2026-10-24, quando o último refresh de 30d expirar.
 */
export function isTokenType(payload: { typ?: TokenType }, expected: TokenType) {
  return payload.typ === undefined || payload.typ === expected;
}
