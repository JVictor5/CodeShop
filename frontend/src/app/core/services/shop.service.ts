import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../environment/environment';
import { ShopForm } from '../interfaces/seller-form.interface';
import { Company } from '../models/company';
import { CompanyRepository } from '../repositories/company.repository';
import { AuthService } from './auth.service';
import { ShopResponse } from '../interfaces/shopresponse.interface';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private companyRepository: CompanyRepository
  ) {}
  async cad(form: ShopForm): Promise<ShopResponse | null> {
    try {
      const response = await lastValueFrom(
        this.http.post(`${environment.urlApi}/shop/sellers`, form)
      );
      return response as ShopResponse; // Cast para o tipo ShopResponse
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
      return null;
    }
  }

  async update(id: string, form: ShopForm) {
    try {
      const response = await lastValueFrom(
        this.http.put(`${environment.urlApi}/shop/${id}`, form)
      );
      console.log('isso e a resposta:', response);
      console.log('isso e a form:', id, '/', form);
    } catch (error) {
      throw new Error('Loja não encontrado');
    }
  }

  async getById(id: string): Promise<Company> {
    try {
      const product = await this.companyRepository.getById(id);
      return product;
    } catch (error) {
      throw new Error('Loja não encontrado');
    }
  }
}
