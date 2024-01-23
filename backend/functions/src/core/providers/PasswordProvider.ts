import { randomBytes } from 'node:crypto';
import { singleton } from 'tsyringe';

@singleton()
export class PasswordProvider {
  private password = '123456';

  get defaultPassword(): string {
    return this.password;
  }

  /**
   * Gera uma string aleatória para ser usada como senha.
   */
  get randomPassword(): string {
    return randomBytes(10).toString('hex');
  }
}
