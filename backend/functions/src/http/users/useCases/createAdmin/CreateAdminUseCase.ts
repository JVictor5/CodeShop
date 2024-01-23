import { ApiError } from '@burand/functions/exceptions';
import { SetDocument } from '@burand/functions/typings';
import { singleton } from 'tsyringe';

import { UserPermission } from '@enums/UserPermission.js';
import { UserType } from '@enums/UserType.js';
import { User } from '@models/User.js';
import { PasswordProvider } from '@providers/PasswordProvider.js';
import { AuthRepository } from '@repositories/AuthRepository.js';
import { UserRepository } from '@repositories/UserRepository.js';
import { AdminParams } from './CreateAdminValidation.js';

@singleton()
export class CreateAdminUseCase {
  constructor(
    private _user: UserRepository,
    private _auth: AuthRepository,
    private _password: PasswordProvider
  ) {}

  async execute({ email, name }: AdminParams): Promise<string> {
    let id = null;

    try {
      const password = this._password.defaultPassword;

      id = await this._auth.create({
        email,
        password,
        displayName: name
      });

      const userData: SetDocument<User> = {
        id,
        name,
        email,
        active: true,
        avatar: null,
        type: UserType.ADMIN,
        lastAccess: null
      };

      await this._user.set(userData);

      await this._auth.setCustomClaims(id, {
        type: UserType.ADMIN,
        permissions: [
          UserPermission.READ_ADMINS,
          UserPermission.WRITE_ADMINS,
          UserPermission.READ_USERS,
          UserPermission.WRITE_USERS
        ]
      });

      return id;
    } catch {
      if (id) {
        await this._auth.delete(id);
      }

      throw new ApiError('Admin create failed', 'application/create-admin', 500);
    }
  }
}
