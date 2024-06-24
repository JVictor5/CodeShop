import { injectable } from 'tsyringe';
import fs from 'fs';
import path from 'path';

@injectable()
export class GetAvatarUseCase {
  private readonly dirpath = path.resolve('src', 'files', 'avatars');
  private readonly defaultAvatarPath = path.join(this.dirpath, 'avatarPadrao.jpg');

  public async execute(id: string): Promise<Buffer | null> {
    try {
      const filedir = path.join(this.dirpath, id);

      const files = await fs.promises.readdir(filedir);
      if (files.length === 0) {
        console.warn('Nenhum arquivo encontrado no diretório. Usando o avatar padrão.');
        return fs.promises.readFile(this.defaultAvatarPath);
      }

      const firstFile = files[0];
      const filepath = path.join(filedir, firstFile);

      const buffer = await fs.promises.readFile(filepath);
      return buffer;
    } catch (error) {
      console.error('Erro ao ler o arquivo:', error);
      return fs.promises.readFile(this.defaultAvatarPath);
    }
  }
}
