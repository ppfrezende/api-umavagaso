export class UnauthorizedToInviteError extends Error {
  constructor() {
    super('Only owners and mentors can invite users.');
  }
}
