import { Injectable } from '@angular/core';
import {
  Auth,
  User as FireUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  authState,
} from '@angular/fire/auth';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environment/environment';
import { AuthService } from '../../core/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ImgService {
  constructor(private http: HttpClient, private authService: AuthService) {}
  async uploadFile(selectedFile: any) {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile, selectedFile.name);

      try {
        const token = await this.authService.getBearerToken();
        console.log(token);
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
        });

        this.http
          .post(`${environment.urlApi}/users/:id/upload`, formData, { headers })
          .subscribe({
            next: (response: any) => console.log(response),
            error: (error: any) => console.error(error),
          });
      } catch (error) {
        console.error('Erro ao obter o token:', error);
      }
    }
  }

  async uploadProductMedia(productId: string, files: File[]): Promise<void> {
    if (files.length === 0) {
      console.error('Nenhum arquivo selecionado.');
      return;
    }

    const formData = new FormData();

    // Convert a coleção de arquivos em um array
    const fileArray = files;

    fileArray.forEach((file, index) => {
      formData.append(`file${index}`, file, file.name);
    });

    try {
      const token = await this.authService.getBearerToken();
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });

      const url = `${environment.urlApi}/prods/${productId}/upload`;

      this.http.post(url, formData, { headers }).subscribe({
        next: (response: any) => console.log('Upload bem-sucedido:', response),
        error: (error: any) => console.error('Erro ao fazer o upload:', error),
      });
    } catch (error) {
      console.error('Erro ao obter o token:', error);
    }
  }
}
