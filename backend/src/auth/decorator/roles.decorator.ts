import { SetMetadata } from '@nestjs/common';
import { Role } from '../enum/role.enum';
import { ROLES_KEY } from 'src/common/constant/constant';

export const Roles = (...roles: [Role, ...Role[]]) => {
  return SetMetadata(ROLES_KEY, roles);
};
