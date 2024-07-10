import { Injectable } from "@angular/core";
import { CreateProduct } from "../interfaces/create-product-interface";
import { UpdateProduct } from "../interfaces/update-product-interface";
import { ProductRepository } from "../repositories/product.repository"; 
import { Product } from "../models/product";

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

    async create(data: CreateProduct): Promise<string> {
        try {
            const id = await this.productRepository.add(data);
            return id;
        } catch(error) {
            return 'error: ' + error;
        }
    }

    async update(data: UpdateProduct) {
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