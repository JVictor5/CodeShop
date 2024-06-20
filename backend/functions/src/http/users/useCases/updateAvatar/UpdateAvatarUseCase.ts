import { injectable } from 'tsyringe';
import fs from 'fs';
import { File } from '@interfaces/file.js';
import path from 'path';

@injectable()
export class UpdateAvatarUseCase {
  private readonly dirpath = path.resolve('src', 'files', 'avatars');

  constructor() {
    if (!fs.existsSync(this.dirpath)) {
      try {
        fs.mkdirSync(this.dirpath, { recursive: true });
      } catch (error) {
        console.error('Erro ao criar o diretório:', error);
      }
    }
  }

  public async execute(id: string, files: File[]): Promise<void> {
    files.forEach(file => {
      const userDir = path.join(this.dirpath, id);

      if (!fs.existsSync(userDir)) {
        fs.mkdirSync(userDir);
      }

      const filepath = path.join(userDir, `${file.fieldname}.${file.ext}`);

      fs.writeFileSync(filepath, file.buffer);
    });
  }
}
