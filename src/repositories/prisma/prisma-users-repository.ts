import { Prisma, User } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { UsersRepository, UserWithoutPassword } from '../users-repository';

export class PrismaUsersRepository implements UsersRepository {
  async create(data: Prisma.UserCreateInput): Promise<User> {
    const user = await prisma.user.create({
      data,
    });

    return user;
  }

  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        userTenants: {
          include: {
            tenant: true,
          },
        },
      },
    });

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        userTenants: {
          include: {
            tenant: true,
          },
        },
      },
    });

    return user;
  }

  async findByVerificationToken(token: string): Promise<User | null> {
    const user = await prisma.user.findFirst({
      where: {
        emailVerificationToken: token,
        emailVerificationExpiry: {
          gte: new Date(),
        },
      },
      include: {
        userTenants: {
          include: {
            tenant: true,
          },
        },
      },
    });

    return user;
  }

  async listStudentsByTenantId(
    tenantId: string,
    isActive: boolean,
    page: number,
    limit: number,
  ): Promise<{ students: UserWithoutPassword[]; total: number }> {
    const where: Prisma.UserWhereInput = {
      isActive,
      userTenants: {
        some: {
          tenantId,
          role: 'STUDENT',
        },
      },
    };

    const [students, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          role: true,
          isActive: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
          userTenants: {
            where: {
              tenantId,
            },
            include: {
              tenant: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return { students, total };
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    const user = await prisma.user.update({
      where: { id },
      data,
    });

    return user;
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id },
    });
  }
}
