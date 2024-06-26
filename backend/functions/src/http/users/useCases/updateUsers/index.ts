import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UpdateUserUseCase } from './UpdateUserUseCase.js';
import { updateUserBodyValidation, updateUserParamsValidation } from './UpdateUserValidation.js';

export async function handleUpdateUser(request: Request, response: Response): Promise<Response> {
  const { document, documentType, email, name, password, phone, nivel } = updateUserBodyValidation.parse(request.body);
  const { id } = updateUserParamsValidation.parse(request.params);

  const updateUser = container.resolve(UpdateUserUseCase);

  await updateUser.execute(id, { document, documentType, email, name, password, phone, nivel });

  return response.status(204).json();
}
