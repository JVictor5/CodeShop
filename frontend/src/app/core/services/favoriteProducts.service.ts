import { Injectable } from '@angular/core';
import { 
    Firestore, 
    collection, 
    doc, 
    setDoc, 
    deleteDoc, 
    query, 
    where, 
    collectionData 
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoriteProdutsService {

    constructor(private firestore: Firestore) {}

    async addFavorito(userId: string, productId: string): Promise<void> {
        const favoriteId = `${userId}_${productId}`;
        const favoriteRef = doc(this.firestore, `favoriteProducts/${favoriteId}`);

        await setDoc(favoriteRef, { userId, productId });
    }

    async deleteFavorito(userId: string, productId: string): Promise<void> {
        const favoriteId = `${userId}_${productId}`;
        const favoriteRef = doc(this.firestore, `favoriteProducts/${favoriteId}`);

        await deleteDoc(favoriteRef);
    }

    getFavoritesByUser(userId: string): Observable<any[]> {
        const favoritesRef = collection(this.firestore, 'favoriteProducts');
        const q = query(favoritesRef, where('userId', '==', userId));
        return collectionData(q);
    }

    getFavoritesByProduct(productId: string): Observable<any[]> {
        const favoritesRef = collection(this.firestore, 'favoriteProducts');
        const q = query(favoritesRef, where('productId', '==', productId));
        return collectionData(q);
    }
}