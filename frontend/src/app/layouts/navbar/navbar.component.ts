import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environment/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  isExpanded = false;
  isHovering = false;
  router: any;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isHovering) {
      this.isExpanded = false;
    }
  }

  username: string = '';
  avatar: string =
    'http://127.0.0.1:5001/teste-4c267/southamerica-east1/api/users/Tu81S35L63XGdWJAPcv3bwBilcq2/avatar';

  constructor(private authService: AuthService, private http: HttpClient) {}

  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen) {
      this.isExpanded = false;
    }
  }

  ngOnInit() {
    this.authService.currentUser.subscribe((user) => {
      if (user) {
        this.username = user.displayName;
        this.getAvatar(); // Chame o método para obter o avatar
      } else {
        this.username = '';
        this.avatar = 'assets/avatar/avatarPadrao.jpg';
      }
    });
  }

  logout() {
    this.authService.signOut();
  }

  // teste

  getAvatar() {
    this.http
      .get(`${environment.urlApi}/users/:id/avatar`, {
        responseType: 'arraybuffer',
      })
      .subscribe(
        (data: ArrayBuffer) => {
          // Converta o ArrayBuffer em uma URL de dados (base64) para exibir a imagem
          const blob = new Blob([data], { type: 'image/jpeg' }); // Assumindo que o avatar é uma imagem JPEG
          const reader = new FileReader();
          reader.onload = () => {
            this.avatar = reader.result as string;
          };
          reader.readAsDataURL(blob);
        },
        (error: any) => {
          console.error('Erro ao obter o avatar:', error);
          this.avatar =
            'http://127.0.0.1:5001/teste-4c267/southamerica-east1/api/users/Tu81S35L63XGdWJAPcv3bwBilcq2/avatar';
        }
      );
  }
}
