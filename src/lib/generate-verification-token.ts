import crypto from 'crypto';

export function generateVerificationToken(): string {
  return crypto.randomInt(100000, 999999).toString();
}

export function getVerificationTokenExpiry(): Date {
  const expiry = new Date();
  expiry.setHours(expiry.getHours() + 24);
  return expiry;
}
