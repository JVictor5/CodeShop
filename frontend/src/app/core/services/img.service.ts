import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../environment/environment';
import { AuthService } from '../../core/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ImgService {
  constructor(private http: HttpClient, private authService: AuthService) { }
  
  async uploadUserMedia(
    typeMedia: string,
    file: File
  ): Promise<string> {
    if (!file) {
      console.error('Nenhum arquivo selecionado.');
      return '';
    }

    const formData = new FormData();
    formData.append('file', file, file.name);
    
    try {
      const token = await this.authService.getBearerToken();
      console.log(token);
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });

      const url = `${environment.urlApi}/users/:id/${typeMedia}/upload`;

      const response = await lastValueFrom(
        this.http.post<{ savedPath: string }>(url, formData, { headers })
      );

      return response.savedPath;
    } catch (error) {
      console.error('Erro ao obter o token:', error);
      return '';
    }
  }

  async uploadSellerMedia(
    shopId: string,
    typeMedia: string,
    file: File
  ): Promise<string> {
    if (!file) {
      console.error('Nenhum arquivo selecionado.');
      return '';
    }

    const formData = new FormData();
    formData.append('file', file, file.name);
    
    try {
      const token = await this.authService.getBearerToken();
      console.log(token);
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });

      const url = `${environment.urlApi}/shop/${shopId}/${typeMedia}/upload`;

      const response = await lastValueFrom(
        this.http.post<{ savedPath: string }>(url, formData, { headers })
      );

      return response.savedPath;
    } catch (error) {
      console.error('Erro ao obter o token:', error);
      return '';
    }
  }

  async uploadProductMedia(
    productId: string,
    typeMedia: string,
    files: File[]
  ): Promise<{ sm: string[], lg: string[] }> {
    if (files.length === 0) {
      console.error('Nenhum arquivo selecionado.');
      return { sm: [], lg: [] };
    }

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

      const url = `${environment.urlApi}/prods/${productId}/${typeMedia}/upload`;

      const response = await lastValueFrom(
        this.http.post<{ savedPaths: { sm: string[], lg: string[] } }>(url, formData, { headers })
      );

      return response.savedPaths;
    } catch (error) {
      console.error('Erro ao obter o token:', error);
      return { sm: [], lg: [] };
    }
  }

  async getProductMedia(productId: string, typeMedia: string, size: string) {
    if (!productId) {
      console.error('Id não encontrado.');
      return [];
    }

    try {
      const token = await this.authService.getBearerToken();
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });

      const url = `${environment.urlApi}/prods/${productId}/${typeMedia}/${size}/getAll`;

      const response = await lastValueFrom(
        this.http.get<{
          productMedia: {
            name: string;
            size: any;
            objectURL: string;
          }[]
        }>(url, { headers })
      );
      return response.productMedia;
    } catch (error) {
      console.error('Erro ao obter mídia do produto:', error);
      return [];
    }
  }

  async deleteProductMedia(productId: string, typeMedia: string, filePath: string) {
    if (!productId) {
      console.error('Id não encontrado.');
      return 'Error';
    }

    try {
      const token = await this.authService.getBearerToken();
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });

      
      const partsImg = filePath.split('/');
      const filename = partsImg[partsImg.length - 1].trim();

      const url = `${environment.urlApi}/prods/${productId}/${typeMedia}/${filename}/deleteImage`;

      const response = await lastValueFrom(
        this.http.delete<{
          message: string
        }>(url, { headers })
      );
      return response.message;

    } catch (error) {
      console.error('Erro ao apagar mídia do produto:', error);
      if (error instanceof HttpErrorResponse) {
        console.log(error.status, error.message, error.error);
      }
      return 'Error';
    }
  }

  async uploadProductVideos(productId: string, files: File[]) {
    if (files.length === 0) {
      console.error('Nenhum arquivo selecionado.');
      return [];
    }
    
    const formData = new FormData();

    const fileArray = files;

    fileArray.forEach((file, index) => {
      formData.append(`file${index}`, file, file.name);
    });

    try {
      const token = await this.authService.getBearerToken();
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });

      const url = `${environment.urlApi}/prods/${productId}/uploadVideos`;

      const response = await lastValueFrom(
        this.http.post<{ savedPaths: string[] }>(url, formData, { headers })
      );

      return response.savedPaths;
    } catch (error) {
      console.error('Erro ao obter o token:', error);
      return [];
    }
  }
}
