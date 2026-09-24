export class NotFoundError extends Error {
  constructor(message?: string) {
    super(message ?? "Não encontrado");
    this.name = "NotFoundError";
  }
}
