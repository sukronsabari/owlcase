export class AuthenticationError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = "AUTHENTICATION_ERROR";
    this.statusCode = 401;
  }
}
