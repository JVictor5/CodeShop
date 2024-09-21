import { Injectable } from "@angular/core";
import { ProductRepository } from "../repositories/product.repository";
import { Product } from "../models/product";
import { AddDocument, UpdateDocument } from "@burand/angular";

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    constructor(private productRepository: ProductRepository) {};

    async getAll() {
        try {
            const products = await this.productRepository.getAll();
            return products;
        } catch(error) {
            return error;
        }
    }

    async getById(id: string): Promise<Product> {
        try {
            const product = await this.productRepository.getById(id);
            return product;
        } catch(error) {
            throw new Error('Produto não encontrado');
        }
    }

    async create(data: AddDocument<Product>): Promise<string> {
        try {
            const id = await this.productRepository.add(data);
            return id;
        } catch(error) {
            return 'error: ' + error;
        }
    }

    async update(data: UpdateDocument<Product>) {
        try {
            await this.productRepository.update(data);
        } catch(error) {
            console.log(error);
        }
    }

    async delete(id: string) {
        try {
            await this.productRepository.delete(id);
        } catch(error) {
            console.log(error);
        }
    }
}
