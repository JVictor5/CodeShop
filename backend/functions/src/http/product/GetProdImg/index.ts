import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { GetProdImgUseCase } from './GetProdImgUseCase.js';

export async function handleGetFileProd(request: Request, response: Response): Promise<Response> {
  const userId = request.user.uid;
  const { productId, typeMedia, size } = request.params;

  const getProductMedia = container.resolve(GetProdImgUseCase);

  const productMedia = await getProductMedia.execute(userId, productId, typeMedia, size);

  return response.status(200).json({ productMedia });
}
