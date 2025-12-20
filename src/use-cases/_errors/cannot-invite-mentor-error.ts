export class CannotInviteMentorError extends Error {
  constructor() {
    super('Users who are mentors cannot be invited to other tenants.');
  }
}
