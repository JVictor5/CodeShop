import { Injectable } from '@angular/core';
import { FirebaseAbstract } from '@burand/angular';
import { Pagament } from '../models/pagament';
import { Firestore } from '@angular/fire/firestore';
import { PagamentNames } from '../config/pagamentNames';

@Injectable({
  providedIn: 'root',
})
export class PagamentoRepository extends FirebaseAbstract<Pagament> {
  constructor(protected override firestore: Firestore) {
    super(firestore, PagamentNames.PAGAMENT);
  }
}
