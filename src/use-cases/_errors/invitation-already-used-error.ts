export class InvitationAlreadyUsedError extends Error {
  constructor() {
    super('This invitation has already been used.');
  }
}
