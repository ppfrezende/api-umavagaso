export class InvitationNotFoundError extends Error {
  constructor() {
    super('Invitation not found.');
  }
}
