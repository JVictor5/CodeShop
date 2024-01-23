import { FirebaseAbstract } from '@burand/functions/firestore';
import { singleton } from 'tsyringe';

import { FirestoreCollecionName } from '@config/FirestoreCollecionName.js';
import { User } from '@models/User.js';

@singleton()
export class UserRepository extends FirebaseAbstract<User> {
  constructor() {
    super(FirestoreCollecionName.USERS);
  }
}
