export class CannotInviteOwnerError extends Error {
  constructor() {
    super('Users who own a tenant cannot be invited as students.');
  }
}
