import { Injectable } from '@angular/core';
import { FirebaseAbstract } from '@burand/angular';
import { Firestore } from '@angular/fire/firestore';
import { UserType } from '../config/userNames';
import { User } from '../models/users';

@Injectable({
  providedIn: 'root',
})
export class UserRepository extends FirebaseAbstract<User> {
  constructor(protected override firestore: Firestore) {
    super(firestore, UserType.USERS);
  }
}
