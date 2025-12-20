export class PendingInvitationAlreadyExistsError extends Error {
  constructor() {
    super('A pending invitation already exists for this user.');
  }
}
