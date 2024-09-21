import 'dotenv/config';
import { injectable } from 'tsyringe';
import { createClient } from '@supabase/supabase-js';
import path from 'path';

@injectable()
export class ProductMediaDeleteUseCase {

    constructor() {
        this.supabase = createClient(process.env.SUPABASE_PROJECT_URL!, process.env.SUPABASE_PROJECT_API_KEY_SERVICE_ROLE!)
    }

    private supabase;

    public async execute(userId: string, productId: string, typeMedia: string, filePath: string) {
        const productDir = path.posix.join(userId, productId, typeMedia);
        const sizes = ['sm', 'lg'];

        for (const size of sizes) {
            const fileName: string = path.posix.join(productDir, size, filePath);

            const { data, error } = await this.supabase.storage.from('product_media').remove([fileName]);
            if (error) {
                console.error("Erro ao remover imagem: ", error);
                return 'Error';
            }
        }

        return 'Success';
    }

}