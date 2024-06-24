import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { ProductMediaUploadUseCase } from './CreteProdImgUseCase.js';

export async function handleFileUpload(request: Request, response: Response): Promise<Response> {
  if (request.files.length === 0) {
    return response.status(400).json({ mensagem: 'Formato ou arquivo não é válido' });
  }

  const userId = request.user.uid;
  const { productId } = request.params;

  const productMediaUpload = container.resolve(ProductMediaUploadUseCase);

  await productMediaUpload.execute(userId, productId, request.files);

  return response.status(204).json();
}
