import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UpdateAvatarUseCase } from './UpdateAvatarUseCase.js';

export async function handleFileUpload(request: Request, response: Response): Promise<Response> {
  if (request.files.length === 0) {
    return response.status(400).json({ mensagem: 'Formato ou Arquino não e valido' });
  }
  const userId = request.user.uid;

  const updateAvatar = container.resolve(UpdateAvatarUseCase);

  await updateAvatar.execute(userId, request.files);

  return response.status(204).json();
}
