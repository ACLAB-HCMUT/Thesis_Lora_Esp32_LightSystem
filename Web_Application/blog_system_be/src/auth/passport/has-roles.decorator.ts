import { SetMetadata } from '@nestjs/common';
import { Role } from './role/role.enum';

export const HasRoles = (...role: Role[]) => SetMetadata('role', role);
