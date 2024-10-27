import { Model } from '@burand/angular';

export interface Pagament extends Model {
  idUser: string;
  precoTotal: string;
  idProd: { idProd: string; quantity: number }[];
  endCard: string;
  status: string;
}
