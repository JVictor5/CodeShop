import { FirebaseAbstract } from '@burand/functions/firestore';
import { singleton } from 'tsyringe';

import { FirestoreCollecionName } from '@config/FirestoreCollecionName.js';
import { Seller } from '@models/Seller.js';

@singleton()
export class SellerRepository extends FirebaseAbstract<Seller> {
  constructor() {
    super(FirestoreCollecionName.SELLERS);
  }
}
