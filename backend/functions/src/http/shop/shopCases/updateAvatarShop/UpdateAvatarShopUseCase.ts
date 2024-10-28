import 'dotenv/config';
import { injectable } from 'tsyringe';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

@injectable()
export class UpdateAvatarShopUseCase {
  constructor() {
    this.supabase = createClient(process.env.SUPABASE_PROJECT_URL!, process.env.SUPABASE_PROJECT_API_KEY_SERVICE_ROLE!);
  }

  private supabase;

  public async execute(
    shopId: string,
    typeMedia: string,
    file: { fieldname: string; mime: string; ext: string; buffer: Buffer; }
  ): Promise<string> {
    const avatarDir = path.posix.join(shopId, typeMedia);
    const fileName = `${uuidv4()}.${file.ext}`;
    const filePath = path.posix.join(avatarDir, fileName);
    
    const savedPath = await this.uploadToSupabase(filePath, file.buffer);

    if (savedPath !== null) {
      return savedPath;
    }
    
    return '';
  }

  public async getPublicUrl(bucketName: string, filePath: string) {
    const { data } = this.supabase.storage.from(bucketName).getPublicUrl(filePath);
    if (!data) {
      console.error('Erro ao pegar a url pública.');
      return null;
    }

    return data.publicUrl;
  }

  public async uploadToSupabase(filepath: string, buffer: Buffer) {
    const { data, error } = await this.supabase.storage.from('seller_media').upload(filepath, buffer);
    if (error) {
      console.error('Erro no upload do arquivo: ', error);
      return null;
    }
    const publicUrl = await this.getPublicUrl('seller_media', data.path);
    if (publicUrl) {
      return publicUrl;
    } else {
      return null;
    }

  }
}
