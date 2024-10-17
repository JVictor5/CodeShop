import { Injectable } from '@angular/core';
import { FirebaseAbstract } from '@burand/angular';
import { Company } from '../models/company';
import { Firestore } from '@angular/fire/firestore';
import { CompanyNames } from '../config/companyNames';

@Injectable({
  providedIn: 'root',
})
export class CompanyRepository extends FirebaseAbstract<Company> {
  constructor(protected override firestore: Firestore) {
    super(firestore, CompanyNames.SELLERS);
  }
}
