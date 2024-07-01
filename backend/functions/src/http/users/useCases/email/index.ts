import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { EmailUseCase } from './EmailUseCase.js';

export async function enviEmail(request: Request, response: Response): Promise<Response> {
  const { email, url } = request.body;

  const eEmail = container.resolve(EmailUseCase);

  await eEmail.execute(email, url);

  return response.status(204).json();
}
