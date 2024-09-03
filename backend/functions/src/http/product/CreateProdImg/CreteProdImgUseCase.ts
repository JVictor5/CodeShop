import 'dotenv/config';
import { injectable } from 'tsyringe';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

@injectable()
export class ProductMediaUploadUseCase {

  constructor() {
    this.supabase = createClient(process.env.SUPABASE_PROJECT_URL!, process.env.SUPABASE_PROJECT_API_KEY_SERVICE_ROLE!);
  }

  private supabase;

  public async execute(
    userId: string,
    productId: string,
    files: { fieldname: string; mime: string; ext: string; buffer: Buffer; }[]
  ): Promise<string[]> {
    const savedPaths: string[] = [];
    const productDir = path.posix.join(userId, productId);

    for (const file of files) {
      const filename = `${uuidv4()}.${file.ext}`;
      const filepath = path.posix.join(productDir, filename);

      const { data, error } = await this.supabase.storage.from('product_media').upload(filepath, file.buffer);
      if (error) {
        console.error('Erro no upload do arquivo: ', error);
      } else {
        const publicUrl = await this.getPublicUrl('product_media', data.path);
        if (publicUrl) {
          savedPaths.push(publicUrl);
        }
      }
    };

    return savedPaths;
  }

  public async getPublicUrl(bucketName: string, filePath: string) {
    const { data } = this.supabase.storage.from(bucketName).getPublicUrl(filePath);
    if (!data) {
      console.error('Erro ao pegar a url pública.');
      return null;
    }

    return data.publicUrl;
  }
}
