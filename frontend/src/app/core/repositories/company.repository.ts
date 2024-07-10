import { Injectable } from '@angular/core';
import { FirebaseAbstract } from '@burand/angular';
import {
import { Firestore } from '@angular/fire/firestore';
import { CollectionNames } from '../config/colectionNames';

@Injectable({
    providedIn: 'root',
})
export class CompanyRepository extends FirebaseAbstract