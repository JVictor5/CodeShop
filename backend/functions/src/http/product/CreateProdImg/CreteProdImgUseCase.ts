import 'dotenv/config';
import { injectable } from 'tsyringe';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import fs from 'fs';

@injectable()
export class ProductMediaUploadUseCase {

  constructor() {
    this.supabase = createClient(process.env.SUPABASE_PROJECT_URL!, process.env.SUPABASE_PROJECT_API_KEY_SERVICE_ROLE!);
  }

  private supabase;

  public async execute(
    userId: string,
    productId: string,
    typeMedia: string,
    files: { fieldname: string; mime: string; ext: string; buffer: Buffer; }[]
  ): Promise<{ sm: string[], lg: string[] }> {
    
    const fileUrlToPath = fileURLToPath(import.meta.url);
    const __dirname = dirname(fileUrlToPath);
    const tempDir = path.posix.join(__dirname, 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    const savedPaths: { sm: string[], lg: string[] } = { sm: [], lg: [] };
    const productDir = path.posix.join(userId, productId, typeMedia);

    for (const file of files) {
      const filename = `${uuidv4()}.${file.ext}`;
      const tempFilePath = path.posix.join(tempDir, filename);

      fs.writeFileSync(tempFilePath, file.buffer);

      const imageSizes = [
        { type: 'sm', width: 292, height: 136, },
        { type: 'lg', width: 836, height: 470, }
      ];

      for (const size of imageSizes) {
        const tempFilePathResized = `${tempFilePath}-${size.type}.webp`;

        await this.resizeImage(tempFilePath, tempFilePathResized, size.width, size.height)
          .then(async () => {
            const resizedBuffer = fs.readFileSync(tempFilePathResized);

            const partsFilename = filename.split('.');
            partsFilename[partsFilename.length - 1] = 'webp';
            const filenameWebp = partsFilename.join('.');
            const filepath = path.posix.join(productDir, size.type, filenameWebp);

            const savedPath = await this.uploadToSupabase(filepath, resizedBuffer);
            if (savedPath !== null) {
              if (size.type == 'sm') {
                savedPaths.sm.push(savedPath);
              } else {
                savedPaths.lg.push(savedPath);
              }
            }

            fs.unlinkSync(tempFilePathResized);

          }).catch((error) => {
            console.error('Erro percorrendo imageSizes: ', error);
          });

      }
    }

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

  public async resizeImage(inputPath: string, outputPath: string, width: number, height: number) {
    try {
      if (!fs.existsSync(inputPath)) {
        throw new Error('Imagem de entrada não encontrada.');
      }

      const rawImage = sharp(inputPath);

      const rawImageMetadata = await rawImage.metadata();
      const rawWidth = rawImageMetadata.width ? rawImageMetadata.width : 0;
      let fit: any;
      if (rawWidth > width) {
        fit = sharp.fit.outside;
      } else {
        fit = sharp.fit.inside;
      }

      const resizedImage = rawImage.resize({
        width: width,
        fit: fit,
        withoutEnlargement: true,
      }).webp({ quality: 90 });

      const resizedMetadata = await resizedImage.metadata();

      const actualWidth: number = resizedMetadata.width ? resizedMetadata.width : 0
      const actualHeight: number = resizedMetadata.height ? resizedMetadata.height : 0;

      // Calcula as margens a serem adicionadas
      const top = Math.floor((height - actualHeight) / 2);
      const bottom = height - actualHeight - top;
      const left = Math.floor((width - actualWidth) / 2);
      const right = width - actualWidth - left;

      await resizedImage
        .extend({
          top: top > 0 ? top : 0,
          bottom: bottom > 0 ? bottom : 0,
          left: left > 0 ? left : 0,
          right: right > 0 ? right : 0,
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .toFile(outputPath);
    } catch (error) {
      console.error('Erro ao redimensionar a imagem: ', error);
    }
  }

  public async uploadToSupabase(filepath: string, resizedBuffer: Buffer) {
    const { data, error } = await this.supabase.storage.from('product_media').upload(filepath, resizedBuffer);
    if (error) {
      console.error('Erro no upload do arquivo: ', error);
      return null;
    }
    const publicUrl = await this.getPublicUrl('product_media', data.path);
    if (publicUrl) {
      return publicUrl;
    } else {
      return null;
    }

  }
}
