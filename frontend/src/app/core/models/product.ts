import { Model } from '@burand/angular';

export interface Product extends Model {
  name: string;
  description: string;
  price: number;
  quantity: number;
  capaUrl: string | string[];
  imgUrls: string[];
  videosUrls: string[];
}
