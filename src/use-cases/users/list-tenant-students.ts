import {
  UsersRepository,
  type UserWithoutPassword,
} from '@/repositories/users-repository';

interface ListTenantStudentsUseCaseRequest {
  tenantId: string;
  isActive: boolean;
  page: number;
  limit: number;
}

interface ListTenantStudentsUseCaseResponse {
  students: UserWithoutPassword[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class ListTenantStudentsUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    tenantId,
    isActive,
    page,
    limit,
  }: ListTenantStudentsUseCaseRequest): Promise<ListTenantStudentsUseCaseResponse> {
    const { students, total } =
      await this.usersRepository.listStudentsByTenantId(
        tenantId,
        isActive,
        page,
        limit,
      );

    return {
      students,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
