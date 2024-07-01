import { singleton } from 'tsyringe';

import { AuthRepository } from '@repositories/AuthRepository.js';
import { UpdateParams } from './RecoverPasswordValidation.js';

@singleton()
export class RecoverPasswordUseCase {
  constructor(private _auth: AuthRepository) {}

  async execute({ email, password }: UpdateParams): Promise<void> {
    const user = await this._auth.getUserByEmail(email);
    const id = user.uid;

    if (!user) {
      throw new Error('Usuario não encontrado');
    }

    if (password) {
      await this._auth.update({
        id,
        password
      });
    }
  }
}
