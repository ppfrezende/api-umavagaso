import 'fastify';
import { Role, User, Tenant } from '@prisma/client';

declare module 'fastify' {
  export interface FastifyRequest {
    userId?: string;
    userRole?: Role;
    userData?: User & { tenant?: Tenant | null };
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: {
      sub: string;
      email: string;
      role?: Role;
    };
  }
}
