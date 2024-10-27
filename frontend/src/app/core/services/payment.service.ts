import { Injectable } from '@angular/core';
import { PagamentoRepository } from '../repositories/pagament.repository';
import { Pagament } from '../models/pagament';
import { AddDocument } from '@burand/angular';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(
    private pagamentoRepository: PagamentoRepository,
    private toastr: ToastrService
  ) {}

  async getAll() {
    try {
      const pagamentos = await this.pagamentoRepository.getAll();
      return pagamentos;
    } catch (error) {
      return error;
    }
  }
  async create(data: AddDocument<Pagament>): Promise<string> {
    try {
      const id = await this.pagamentoRepository.add(data);
      return id;
    } catch (error) {
      return 'error: ' + error;
    }
  }

  async toastSuccess() {
    setTimeout(() => {
      this.toastr.success('', 'Pagamento realizado com sucesso!', {
        closeButton: false,
      });
    }, 1000);
  }
}
