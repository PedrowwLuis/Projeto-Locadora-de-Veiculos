export class AppError extends Error {
  constructor(status, message, detalhes) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.detalhes = detalhes;
  }
}
