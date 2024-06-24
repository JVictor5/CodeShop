import { injectable } from 'tsyringe';
import fs from 'fs';
import { File } from '@interfaces/file.js';
import path from 'path';

@injectable()
export class ProductMediaUploadUseCase {
  private readonly baseDir = path.resolve('src', 'files', 'product_media');

  constructor() {
    if (!fs.existsSync(this.baseDir)) {
      try {
        fs.mkdirSync(this.baseDir, { recursive: true });
      } catch (error) {
        console.error('Erro ao criar o diretório base:', error);
      }
    }
  }

  public async execute(userId: string, productId: string, files: File[]): Promise<void> {
    const userDir = path.join(this.baseDir, userId);

    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }

    const productDir = path.join(userDir, productId);

    if (!fs.existsSync(productDir)) {
      fs.mkdirSync(productDir, { recursive: true });
    }

    files.forEach((file, index) => {
      const filename = `file${index + 1}.${file.ext}`;
      const filepath = path.join(productDir, filename);

      fs.writeFileSync(filepath, file.buffer);
    });
  }
}
