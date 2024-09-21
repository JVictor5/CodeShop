import 'dotenv/config';
import { injectable } from 'tsyringe';
import { createClient } from '@supabase/supabase-js';
import path from 'path';

@injectable()
export class GetProdImgUseCase {

  constructor() {
    this.supabase = createClient(process.env.SUPABASE_PROJECT_URL!, process.env.SUPABASE_PROJECT_API_KEY_SERVICE_ROLE!);
  }

  private supabase;

  public async execute(userId: string, productId: string, typeMedia: string, size: string) {
    const productDir = path.posix.join(userId, productId, typeMedia, size);
    const { data, error } = await this.supabase.storage.from('product_media').list(productDir);

    if (error) {
      console.log("Erro ao obter mídia do produto: ", error);
      return [];
    }

    const products = data.map(file => ({
      name: file.name,
      size: file.metadata.size,
      objectURL: this.supabase.storage.from('product_media').getPublicUrl(`${productDir}/${file.name}`).data.publicUrl
    }));

    return products;
  }
}
