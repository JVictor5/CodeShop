import { singleton } from 'tsyringe';

import { AuthRepository } from '@repositories/AuthRepository.js';
import { UserRepository } from '@repositories/UserRepository.js';
import { UpdateParams } from './UpdateUserValidation.js';

@singleton()
export class UpdateUserUseCase {
  constructor(
    private _user: UserRepository,
    private _auth: AuthRepository
  ) {}

  async execute(
    id: string,
    { email, password, name, document, documentType, phone, nivel }: UpdateParams
  ): Promise<void> {
    if (email) {
      await this._auth.update({
        id,
        email
      });

      await this._user.update({
        id,
        email,
        name,
        document,
        documentType,
        phone,
        nivel
      });
    }

    if (password) {
      await this._auth.update({
        id,
        password
      });
    }
  }
}
