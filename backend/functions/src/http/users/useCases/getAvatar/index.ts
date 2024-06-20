import { ApiError } from '@burand/functions/exceptions';
import { Request, Response } from 'express';
import { fileTypeFromBuffer } from 'file-type';
import { container } from 'tsyringe';
import { z } from 'zod';
import { GetAvatarUseCase } from './GetAvatarUseCase.js';

const idSchema = z.string().trim().length(28);
export async function handleGetFile(request: Request, response: Response): Promise<Response> {
  const userId = idSchema.parse(request.params?.id);

  const getAvatar = container.resolve(GetAvatarUseCase);

  const buffer = await getAvatar.execute(userId);

  if (!buffer) {
    throw new ApiError('Arquivo não encontrado', 'file-not-found', 400);
  }
  const fileInfo = await fileTypeFromBuffer(buffer);
  if (!fileInfo) {
    console.warn('Tipo de arquivo desconhecido.');
    return response.status(500).json({ error: 'Tipo de arquivo desconhecido.' });
  }

  response.setHeader('Content-Type', fileInfo.mime);

  return response.send(buffer);
}
