// import { Request, Response } from 'express';
// import { container } from 'tsyringe';
// import { createShopValidation } from './CreateShopValidation.js';

// export async function handleCreateUser(request: Request, response: Response): Promise<Response> {
//   const body = createShopValidation.parse(request.body);

//   const createShop = container.resolve(CreateShopUseCase);

//   const id = await createShop.execute(body);

//   return response.status(201).json({
//     id
//   });
// }
