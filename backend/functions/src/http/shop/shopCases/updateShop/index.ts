import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { updateSellerValidation, updateShopParamsValidation } from './UpdateShopValidation.js';
import { ShopUserUseCase } from './UpdateShopUseCase.js';

export async function handleUpdateShop(request: Request, response: Response): Promise<Response> {
  try {
    const { idUser, name, email, discription, phone } = updateSellerValidation.parse(request.body);
    const { id } = updateShopParamsValidation.parse(request.params);

    const updateShop = container.resolve(ShopUserUseCase);

    await updateShop.execute(id, { idUser, name, email, discription, phone });

    return response.status(204).json();
  } catch (error) {
    console.error('Erro de validação:', error);
    return response.status(400).json({ error: 'Dados inválidos' });
  }
}
