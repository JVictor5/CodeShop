import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
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

  async uploadProductMedia(
    productId: string,
    files: File[]
  ): Promise<string[]> {
    if (files.length === 0) {
      console.error('Nenhum arquivo selecionado.');
      return [];
    }
    const urls: string[] = [];
    const formData = new FormData();

    const fileArray = files;

    fileArray.forEach((file, index) => {
      formData.append(`file${index}`, file, file.name);
    });

    try {
      const token = await this.authService.getBearerToken();
      console.log(token);
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });

      const url = `${environment.urlApi}/prods/${productId}/upload`;

      const response = await lastValueFrom(
        this.http.post<{ savedPaths: string[] }>(url, formData, { headers })
      );
      console.log(response);
      return response.savedPaths;
    } catch (error) {
      console.error('Erro ao obter o token:', error);
      return [];
    }
  }
}
