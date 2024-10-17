import { Model } from '@burand/angular';

export interface Company extends Model {
  avatar: string | null;
  name: string;
  phone: string;
  email: string;
  discription: string;
  idUser: string;
}
