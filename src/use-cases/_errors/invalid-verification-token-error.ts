export class InvalidVerificationTokenError extends Error {
  constructor() {
    super('Invalid or expired verification token.');
  }
}
