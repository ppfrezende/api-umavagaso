import crypto from 'crypto';

export function generateInvitationToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function getInvitationTokenExpiry(days: number = 7): Date {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + days);
  return expiry;
}
