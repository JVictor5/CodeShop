import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { createSellerValidation } from './CreateSellerValidation.js';
import { CreateShopUseCase } from './CreateSellerUseCase.js';

export async function handleCreateShop(request: Request, response: Response): Promise<Response> {
  const body = createSellerValidation.parse(request.body);

  const createShop = container.resolve(CreateShopUseCase);

  const id = await createShop.execute(body);

  return response.status(201).json({
    id
  });
}
