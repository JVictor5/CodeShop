import { Model } from '@burand/angular';
import { UserType } from '../config/userNames';

export interface User extends Model {
  password: string | undefined;
  active: boolean;
  avatar: string | null;
  email: string;
  lastAccess: Date | null;
  name: string;
  document: string;
  documentType: 'CPF' | 'CNPJ';
  type: UserType;
  phone: string;
  nivel: number;
  idShop?: string;
}
