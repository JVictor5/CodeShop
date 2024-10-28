import { Injectable } from '@angular/core';
import { FirebaseAbstract } from '@burand/angular';
import { Product } from '../models/product';
import { Firestore } from '@angular/fire/firestore';
import { CollectionNames } from '../config/colectionNames';
import { getFirestore, collection, query, getDocs, orderBy, startAt, endAt, where } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class ProductRepository extends FirebaseAbstract<Product> {
  private db = getFirestore();
  
  constructor(protected override firestore: Firestore) {
    super(firestore, CollectionNames.PRODUCT);
  }

  public async getByName(nameProduct: string): Promise<Product[]> {
    const collectionRef = collection(this.db, CollectionNames.PRODUCT);
    
    const q = query(
      collectionRef,
      orderBy('name' as string),
      startAt(nameProduct),
      endAt(nameProduct + '\uf8ff')
    );
    
    const querySnapshot = await getDocs(q);
    const results: Product[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as Product;
      const id = doc.id;
      results.push({ ...data, id });
    });

    return results;
  }

  public async getByCategory(categoryProduct: string): Promise<Product[]> {
    const collectionRef = collection(this.db, CollectionNames.PRODUCT);

    const q = query(collectionRef, where('category', '==', categoryProduct));

    const querySnapshot = await getDocs(q);
    const results: Product[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as Product;
      const id = doc.id;
      results.push({ ...data, id });
    });

    return results;
  }

  public async getByGameGender(gameGenderCode: string, gameGenderName: string): Promise<Product[]> {
    const collectionRef = collection(this.db, CollectionNames.PRODUCT);

    const q = query(collectionRef, where('genres', 'array-contains', { code: gameGenderCode, name: gameGenderName }));

    const querySnapshot = await getDocs(q);
    const results: Product[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as Product;
      const id = doc.id;
      results.push({ ...data, id });
    });

    return results;
  }
}