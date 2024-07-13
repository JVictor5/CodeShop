import { ApiError } from '@burand/functions/exceptions';
import { Request, Response } from 'express';
import { fileTypeFromBuffer } from 'file-type';
import { container } from 'tsyringe';
import { GetProdImgUseCase } from './GetProdImgUseCase.js';

export async function handleGetFileProd(request: Request, response: Response): Promise<Response> {
  const { id, produc, filename } = request.params;

  const getAvatar = container.resolve(GetProdImgUseCase);

  const buffer = await getAvatar.execute(id, produc, filename);

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
