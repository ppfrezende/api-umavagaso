export class UserAlreadyMemberOfTenantError extends Error {
  constructor() {
    super('User is already a member of this tenant.');
  }
}
