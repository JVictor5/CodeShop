import { CreateRequest, UpdateRequest, UserRecord, getAuth } from 'firebase-admin/auth';
import { singleton } from 'tsyringe';

import { UserType } from '@enums/UserType.js';

const fireAuth = getAuth();

interface ParamsCreate extends CreateRequest {
  email: string;
  password: string;
}

interface ParamsUpdate extends UpdateRequest {
  id: string;
}

interface ClaimsParams {
  type: UserType;
}

@singleton()
export class AuthRepository {
  async create(data: ParamsCreate): Promise<string> {
    const { uid } = await fireAuth.createUser(data);
    return uid;
  }

  async delete(id: string): Promise<void> {
    await fireAuth.deleteUser(id);
  }

  async update({ id, ...data }: ParamsUpdate): Promise<void> {
    await fireAuth.updateUser(id, data);
  }

  getUserByEmail(email: string): Promise<UserRecord> {
    return fireAuth.getUserByEmail(email);
  }

  async revokeRefreshTokens(id: string): Promise<void> {
    await fireAuth.revokeRefreshTokens(id);
  }

  generatePasswordResetLink(email: string): Promise<string> {
    return fireAuth.generatePasswordResetLink(email);
  }

  setCustomClaims(userId: string, customUserClaims: ClaimsParams): Promise<void> {
    return fireAuth.setCustomUserClaims(userId, customUserClaims);
  }
}
