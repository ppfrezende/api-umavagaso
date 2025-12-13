import 'fastify';
import { Role, User, Tenant } from '@prisma/client';

declare module 'fastify' {
  export interface FastifyRequest {
    userId?: string;
    clerkId?: string;
    userRole?: Role;
    user?: User & { tenant?: Tenant | null };
  }
}
