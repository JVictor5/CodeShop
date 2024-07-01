import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { RecoverPasswordUseCase } from './RecoverPassowordUseCase.js';
import { recoverPasswordValidation } from './RecoverPasswordValidation.js';

export async function recoverPass(request: Request, response: Response): Promise<Response> {
  const { email, password } = recoverPasswordValidation.parse(request.body);

  const recoverPassword = container.resolve(RecoverPasswordUseCase);

  await recoverPassword.execute({ email, password });

  return response.status(204).json();
}
