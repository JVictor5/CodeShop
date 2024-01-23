import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateAdminUseCase } from './CreateAdminUseCase.js';
import { createAdminValidation } from './CreateAdminValidation.js';

export async function handleCreateAdmin(request: Request, response: Response): Promise<Response> {
  const { email, name } = createAdminValidation.parse(request.body);

  const createAdmin = container.resolve(CreateAdminUseCase);

  const id = await createAdmin.execute({
    email,
    name
  });

  return response.status(201).json({
    id
  });
}
