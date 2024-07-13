import { injectable } from 'tsyringe';
import fs from 'fs';
import path from 'path';

@injectable()
export class GetProdImgUseCase {
  private readonly dirpath = path.resolve('src', 'files', 'product_media');

  public async execute(userId: string, productId: string, fileName: string): Promise<Buffer | null> {
    try {
      const filedir = path.join(this.dirpath, userId, productId);

      const files = await fs.promises.readdir(filedir);
      if (files.length === 0) {
        console.warn('Nenhum arquivo encontrado no diretório.');
        return null;
      }

      const filepath = path.join(filedir, fileName);
      const buffer = await fs.promises.readFile(filepath);

      return buffer;
    } catch (error) {
      console.error('Erro ao ler o arquivo:', error);
      return null;
    }
  }
}
