import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UpdateAvatarUseCase } from './UpdateAvatarUseCase.js';

export async function handleFileUpload(request: Request, response: Response): Promise<Response> {
  if (request.files.length === 0) {
    return response.status(400).json({ mensagem: 'Formato ou arquivo não é válido' });
  }

  const userId = request.user.uid;
  const { typeMedia } = request.params;
  const file = request.files[0];

  const updateAvatarUpload = container.resolve(UpdateAvatarUseCase);

  const savedPath = await updateAvatarUpload.execute(userId, typeMedia, file);

  return response.status(200).json({ savedPath });
}
