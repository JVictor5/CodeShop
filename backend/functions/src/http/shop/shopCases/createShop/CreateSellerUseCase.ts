import { ApiError } from '@burand/functions/exceptions';
import { AddDocument } from '@burand/functions/typings';
import { singleton } from 'tsyringe';

import { Seller } from '@models/Seller.js';
import { SellerRepository } from '@repositories/SellerRepository.js';
import { UserRepository } from '@repositories/UserRepository.js';
import { CreateSellerParams } from './CreateSellerValidation.js';

@singleton()
export class CreateShopUseCase {
  constructor(
    private _seller: SellerRepository,
    private _user: UserRepository
  ) {}

  async execute({ idUser, name, email, discription, phone }: CreateSellerParams): Promise<void> {
    try {
      const sellerData: AddDocument<Seller> = {
        idUser,
        name,
        email,
        discription,
        phone,
        active: true,
        avatar: null,
        lastAccess: null
      };

      const idShop = await this._seller.add(sellerData);

      await this._user.update({
        id: idUser,
        nivel: 2,
        idShop
      });
    } catch {
      console.error('');

      throw new ApiError('User create failed', 'application/create-user', 500);
    }
  }
}
