import { injectable } from 'tsyringe';
import fs from 'fs';
import { File } from '@interfaces/file.js';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

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

  public async execute(userId: string, productId: string, files: File[]): Promise<string[]> {
    const urls: string[] = [];
    const userDir = path.join(this.baseDir, userId);

    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }

    const productDir = path.join(userDir, productId);

    if (!fs.existsSync(productDir)) {
      fs.mkdirSync(productDir, { recursive: true });
    }

    files.forEach(file => {
      const filename = `${uuidv4()}.${file.ext}`;
      const filepath = path.join(productDir, filename);

      fs.writeFileSync(filepath, file.buffer);
      urls.push(`${productId}/${filename}`);
    });

    return urls;
  }
}
