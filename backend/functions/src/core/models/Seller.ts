import { Model } from '@burand/functions/firestore';

export interface Seller extends Model {
  idUser: string;
  name: string;
  email: string;
  discription: string;
  phone: string;
  active: boolean;
  avatar: string | null;
  lastAccess: Date | null;
}
