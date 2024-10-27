import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  getDoc,
  updateDoc,
  addDoc,
  deleteDoc,
} from '@angular/fire/firestore';
import { UpdateDocument } from '@burand/angular';
import { KeyRepository } from '../repositories/key.repository';
import { Key } from '../models/key';

@Injectable({
  providedIn: 'root',
})
export class KeyService {
  constructor(
    private keyRepository: KeyRepository,
    private firestore: Firestore
  ) {}

  async getAll() {
    try {
      const key = await this.keyRepository.getAll();
      return key;
    } catch (error) {
      return error;
    }
  }

  async update(data: UpdateDocument<Key>) {
    try {
      await this.keyRepository.update({
        id: data.id,
        status: data.status,
      });
    } catch (error) {
      console.log(error);
    }
  }
  async sendCode(
    idUser: string,
    idProd: { idProd: string; quantity: number }[],
    idBuy: string
  ): Promise<void> {
    const productMap: { [key: string]: number } = {};

    for (const { idProd: productId, quantity } of idProd) {
      if (productMap[productId]) {
        productMap[productId] += quantity;
      } else {
        productMap[productId] = quantity;
      }
    }

    for (const productId in productMap) {
      const quantityToBuy = productMap[productId];
      const productRef = doc(this.firestore, `product/${productId}`);
      const productSnap = await getDoc(productRef);

      if (productSnap.exists()) {
        const productData = productSnap.data();
        const availableQuantity = productData?.['quantity'] || 0;
        const codes = productData?.['keys'] || [];

        if (availableQuantity > 0 && codes.length >= quantityToBuy) {
          const codesToSend = codes.slice(0, quantityToBuy);
          const updatedCodes = codes.slice(quantityToBuy);

          await updateDoc(productRef, {
            quantity: availableQuantity - quantityToBuy,
            keys: updatedCodes,
          });

          const codesCollectionRef = collection(this.firestore, 'codes');
          for (const codeToSend of codesToSend) {
            await addDoc(codesCollectionRef, {
              userId: idUser,
              productId: productId,
              code: codeToSend,
              idBuy: idBuy,
              createdAt: new Date(),
            });

            console.log('Código gerado e salvo:', codeToSend);
          }
        } else {
          if (availableQuantity === 0) {
            console.log('Estoque insuficiente para o produto:', productId);
          } else {
            console.log(
              'Número insuficiente de códigos disponíveis para o produto:',
              productId
            );
          }
        }
      } else {
        console.log('Produto não encontrado:', productId);
      }
    }
  }

  async refundCode(codeId: string): Promise<void> {
    try {
      const codeRef = doc(this.firestore, `codes/${codeId}`);
      const codeSnap = await getDoc(codeRef);

      if (!codeSnap.exists()) {
        console.log('Código não encontrado:', codeId);
        return;
      }

      const codeData = codeSnap.data();
      const productId = codeData?.['productId'];
      const code = codeData?.['code'];
      const idBuy = codeData?.['idBuy'];

      if (!productId || !code || !idBuy) {
        console.log('Informações incompletas no código:', codeId);
        return;
      }

      const paymentRef = doc(this.firestore, `pagament/${idBuy}`);
      const paymentSnap = await getDoc(paymentRef);

      if (!paymentSnap.exists()) {
        console.log('Histórico de pagamento não encontrado:', idBuy);
        return;
      }

      const paymentData = paymentSnap.data();
      const updatedProducts = paymentData?.['idProd'].map((product: any) => {
        if (product.idProd === productId && product.status === 'Comprado') {
          return { ...product, status: 'Reembolsado' };
        }
        return product;
      });

      await updateDoc(paymentRef, { idProd: updatedProducts });
      console.log('Status de compra atualizado para reembolsado.');

      // Verifica se todos os produtos foram reembolsados
      const allRefunded = updatedProducts.every(
        (product: any) => product.status === 'Reembolsado'
      );

      if (allRefunded) {
        await updateDoc(paymentRef, { status: 'Cancelado' });
        console.log('Status de pagamento atualizado para Cancelado.');
      }

      const productRef = doc(this.firestore, `product/${productId}`);
      const productSnap = await getDoc(productRef);

      if (productSnap.exists()) {
        const productData = productSnap.data();
        const availableQuantity = productData?.['quantity'] || 0;
        const currentCodes = productData?.['keys'] || [];

        const updatedCodes = [...currentCodes, code];

        await updateDoc(productRef, {
          quantity: availableQuantity + 1,
          keys: updatedCodes,
        });

        console.log('Código devolvido ao estoque do produto:', code);
      } else {
        console.log('Produto não encontrado:', productId);
      }

      await deleteDoc(codeRef);
      console.log('Código excluído da coleção codes:', codeId);
    } catch (error) {
      console.log('Erro ao processar o reembolso:', error);
    }
  }
}
