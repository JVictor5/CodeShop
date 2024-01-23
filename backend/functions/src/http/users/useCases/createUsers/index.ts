import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateUserUseCase } from './CreateUserUseCase.js';
import { createUserValidation } from './CreateUserValidation.js';

export async function handleCreateUser(request: Request, response: Response): Promise<Response> {
  const { email, name } = createUserValidation.parse(request.body);

  const createUser = container.resolve(CreateUserUseCase);

  const id = await createUser.execute({
    email,
    name
  });

  return response.status(201).json({
    id
  });
}
