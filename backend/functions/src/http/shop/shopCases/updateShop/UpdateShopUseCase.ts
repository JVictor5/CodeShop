import { singleton } from 'tsyringe';
import { SellerRepository } from '@repositories/SellerRepository.js';
import { UpdateParams } from './UpdateShopValidation.js';

@singleton()
export class ShopUserUseCase {
  constructor(private _shop: SellerRepository) {}

  async execute(id: string, { idUser, name, email, discription, phone }: UpdateParams): Promise<void> {
    if (id) {
      await this._shop.update({
        id,
        idUser,
        name,
        email,
        discription,
        phone
      });
    }
  }
}
