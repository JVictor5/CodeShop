import { CommonModule } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

import { UserRepository } from '../../core/repositories/user.repository';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  [x: string]: any;
  isExpanded = false;
  isHovering = false;
  router: any;

  private userRepository = inject(UserRepository);

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isHovering) {
      this.isExpanded = false;
    }
  }

  username: string = '';
  id: string = '';
  avatar: string = '';
  nivel = 0;

  constructor(private authService: AuthService) {}

  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen) {
      this.isExpanded = false;
    }
  }
  async ngOnInit() {
    // this.doc = userr.document;
    this.authService.currentUser.subscribe(async (user) => {
      if (!user) {
        this.username = 'Usuário';
        this.avatar = 'assets/avatar/avatarPadrao.jpg';
      }
      this.username = user.displayName;
      this.id = user.uid;
      this.avatar = `http://127.0.0.1:5001/teste-4c267/southamerica-east1/api/users/${this.id}/avatar`;
      const userFromApi = await this.userRepository.getById(`${this.id}`);
      this.nivel = userFromApi.nivel;
    });
  }

  logout() {
    this.authService.signOut();
  }
}
