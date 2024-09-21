import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { ProductVideosUploadUseCase } from './CreateProdVideosUseCase.js';

export async function handleVideosUpload(request: Request, response: Response): Promise<Response> {
  if (request.files.length === 0) {
    return response.status(400).json({ mensagem: 'Formato ou arquivo não é válido' });
  }

  const userId = request.user.uid;
  const { productId } = request.params;

  const productVideosUpload = container.resolve(ProductVideosUploadUseCase);

  const savedPaths = await productVideosUpload.execute(userId, productId, request.files);

  return response.status(200).json({ savedPaths });
}
