import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environment/environment';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss',
})
export class PerfilComponent {
  selectedFile: File | null = null;

  constructor(private http: HttpClient, private authService: AuthService) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  async uploadFile() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile, this.selectedFile.name);

      try {
        const token = await this.authService.getBearerToken();
        console.log(token);
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
        });

        this.http
          .post(`${environment.urlApi}/users/:id/upload`, formData, { headers })
          .subscribe({
            next: (response) => console.log(response),
            error: (error) => console.error(error),
          });
      } catch (error) {
        console.error('Erro ao obter o token:', error);
      }
    }
  }
}
