import { Model } from '@burand/angular';

export interface Product extends Model {
  name: string;
  description: string;
  price: number;
  quantity: number;
  capaUrl: string;
  videosUrls: string[];
  imgUrls: string[];
  category: string;
  genres: string[];
  keys: string[];
}
