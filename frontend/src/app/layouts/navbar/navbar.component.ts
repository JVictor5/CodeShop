import { CommonModule, NgIf, Location } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

import { UserRepository } from '../../core/repositories/user.repository';
import { gameGenres } from '../../data/game-genres';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, NgIf],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  genres = gameGenres;
  [x: string]: any;
  isExpanded = false;
  isHovering = false;
  
  private userRepository = inject(UserRepository);
  private location: Location = inject(Location);
  private router = inject(Router);

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isHovering) {
      this.isExpanded = false;
    }
  }

  showMenuPerfil: boolean = false;
  isLoggedIn: boolean = false;

  username: string = '';
  id: string = '';
  avatar: string | null = '';
  email: string = '';

  nivel = 0;

  constructor(private authService: AuthService) {}

  async ngOnInit() {
    this.authService.currentUser.subscribe(async (user) => {
      if (!user) {
        this.isLoggedIn = false;
        this.username = 'Visitante';
        this.avatar = 'assets/avatar/avatarPadrao.jpg';
      } else {
        this.isLoggedIn = true;
        this.username = user.displayName;
        this.id = user.uid;
        const userFromApi = await this.userRepository.getById(`${this.id}`);
        this.nivel = userFromApi.nivel;
        if(!userFromApi.avatar) {
          this.avatar = 'assets/avatar/avatarPadrao.jpg';
        } else {
          this.avatar = userFromApi.avatar;
        }
      }
    });
  }

  toggleMenuPerfil() {
    this.showMenuPerfil = !this.showMenuPerfil;
  }

  logout() {
    this.authService.signOut();
    this.router.navigate(['/login']);
  }

  async searchProduct(inputValue: string) {
    this.location.go('/produtos/nome/' + inputValue);
  }
}
