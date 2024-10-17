import { Injectable } from '@angular/core';
import { CompanyRepository } from '../repositories/company.repository';
import { Company } from '../models/company';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  constructor(private companyRepository: CompanyRepository) {}

  async getAll() {
    try {
      const companys = await this.companyRepository.getAll();
      return companys;
    } catch (error) {
      return error;
    }
  }

  async getById(id: string): Promise<Company> {
    try {
      const company = await this.companyRepository.getById(id);
      return company;
    } catch (error) {
      throw new Error('Produto não encontrado');
    }
  }
}
