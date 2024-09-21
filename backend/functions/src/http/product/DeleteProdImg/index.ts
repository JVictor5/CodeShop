import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { ProductMediaDeleteUseCase } from './DeleteProdImgUseCase.js';

export async function handleFileDelete(request: Request, response: Response): Promise<Response> {
    
    const userId = request.user.uid;
    const { productId, typeMedia, fileName } = request.params;

    const productMediaDelete = container.resolve(ProductMediaDeleteUseCase);

    const message = await productMediaDelete.execute(userId, productId, typeMedia, fileName);

    return response.status(200).json({ message });
}