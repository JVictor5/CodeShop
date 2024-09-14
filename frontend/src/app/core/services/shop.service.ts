import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../environment/environment';
import { ShopForm } from '../interfaces/seller-form.interface';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  constructor(private http: HttpClient) {}
  async cad(form: ShopForm) {
    try {
      const response = await lastValueFrom(
        this.http.post(`${environment.urlApi}/shop/sellers`, form)
      );
      console.log(response);
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
    }
  }
}
