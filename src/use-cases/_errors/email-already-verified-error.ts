export class EmailAlreadyVerifiedError extends Error {
  constructor() {
    super('Email already verified.');
  }
}
