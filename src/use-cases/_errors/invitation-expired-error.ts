export class InvitationExpiredError extends Error {
  constructor() {
    super('This invitation has expired.');
  }
}
