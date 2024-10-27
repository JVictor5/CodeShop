import { Model } from '@burand/angular';

export interface Key extends Model {
  code: string;
  productId: string;
  userId: string;
  status?: string;
}
