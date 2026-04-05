import { SetMetadata } from '@nestjs/common';
import { ISPUBLIC_KEY_FIELD } from '../../common/constant/constant';

export const Public = () => {
  return SetMetadata(ISPUBLIC_KEY_FIELD, true);
};
