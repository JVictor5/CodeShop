import { Model } from '@burand/functions/firestore';

import { UserType } from '@enums/UserType.js';

export interface User extends Model {
  active: boolean;
  avatar: string | null;
  email: string;
  lastAccess: Date | null;
  name: string;
  type: UserType;
}
