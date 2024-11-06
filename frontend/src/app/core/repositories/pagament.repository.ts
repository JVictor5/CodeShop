import { Injectable } from '@angular/core';
import { FirebaseAbstract } from '@burand/angular';
import { Pagament } from '../models/pagament';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { PagamentNames } from '../config/pagamentNames';
import { getFirestore, collection, query, getDocs, orderBy, startAt, endAt, where } from 'firebase/firestore';
import { map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PagamentoRepository extends FirebaseAbstract<Pagament> {
  private db = getFirestore();

  constructor(protected override firestore: Firestore) {
    super(firestore, PagamentNames.PAGAMENT);
  }

  public getByIdProduct(idProduct: string): Observable<any[]> {
    const paymentCollection = collection(this.firestore, 'pagament');
    return collectionData(paymentCollection, { idField: 'id' as const }).pipe(
      map((documents: any[]) => 
        documents.filter(doc => 
          doc.status === 'Aprovado' 
          && doc.idProd 
          && doc.idProd.some((item: any) => item.idProd === idProduct)
        )
      )
    );
  }
}
