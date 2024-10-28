import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UpdateAvatarShopUseCase } from './UpdateAvatarShopUseCase.js';

export async function handleFileUpload(request: Request, response: Response): Promise<Response> {
  if (request.files.length === 0) {
    return response.status(400).json({ mensagem: 'Formato ou arquivo não é válido' });
  }

  const { shopId, typeMedia } = request.params;
  const file = request.files[0];

  const updateAvatarShopUpload = container.resolve(UpdateAvatarShopUseCase);

  const savedPath = await updateAvatarShopUpload.execute(shopId, typeMedia, file);

  return response.status(200).json({ savedPath });
}
