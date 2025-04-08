export class UnauthorizedError extends Error {
  constructor(message?: string) {
    super(message ?? "Não autorizado");
    this.name = "UnauthorizedError";
  }
}
