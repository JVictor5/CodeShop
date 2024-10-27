import { Injectable } from '@angular/core';
import { FirebaseAbstract } from '@burand/angular';
import { Firestore } from '@angular/fire/firestore';
import { keyNames } from '../config/keyNames';
import { Key } from '../models/key';



@Injectable({
  providedIn: 'root',
})
export class KeyRepository extends FirebaseAbstract<Key> {
  constructor(protected override firestore: Firestore) {
    super(firestore, keyNames.CODES);
  }
}
