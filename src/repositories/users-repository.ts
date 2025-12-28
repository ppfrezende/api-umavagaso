import { Prisma, User } from '@prisma/client';

export type UserWithoutPassword = Omit<
  User,
  'password_hash' | 'emailVerificationToken' | 'emailVerificationExpiry'
>;

export interface UsersRepository {
  create(data: Prisma.UserCreateInput): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByVerificationToken(token: string): Promise<User | null>;
  listStudentsByTenantId(
    tenantId: string,
    isActive: boolean,
    page: number,
    limit: number,
  ): Promise<{ students: UserWithoutPassword[]; total: number }>;
  update(id: string, data: Prisma.UserUpdateInput): Promise<User>;
  delete(id: string): Promise<void>;
}
