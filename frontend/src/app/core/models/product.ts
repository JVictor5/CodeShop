import { Model } from '@burand/angular';

export interface Product extends Model {
  name: string;
  description: string;
  price: number;
  quantity: number;
  capaUrl: { sm: string, lg: string};
  videosUrls: string[];
  imgUrls: { sm: string[], lg: string[]};
  category: string;
  genres?: string[];
  keys: string[];
  minimumSystemRequirements?: {
    os: string;
    cpu: string;
    storage: string;
    memory: string;
    gpu: string;
  };
  recommendedSystemRequirements?: {
    os: string;
    cpu: string;
    storage: string;
    memory: string;
    gpu: string;
  };
  idUser: string;
  releaseDate: {
    dateFormat: string; 
    bruteFormat: string;
  };
  titleDestaque: string;
  descriptionDestaque: string;
  capaDestaqueUrl: { sm: string, lg: string};
  playerModes?: string[];
}
