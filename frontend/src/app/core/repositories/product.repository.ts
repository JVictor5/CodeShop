import { Injectable } from '@angular/core';
import { FirebaseAbstract } from '@burand/angular';
import { Product } from '../models/product';
import { Firestore } from '@angular/fire/firestore';
import { CollectionNames } from '../config/colectionNames';

@Injectable({
  providedIn: 'root',
})
export class ProductRepository extends FirebaseAbstract<Product> {
  constructor(protected override firestore: Firestore) {
    super(firestore, CollectionNames.PRODUCT);
  }
}
